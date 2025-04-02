
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using JobPreppersDemo.Models;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Text;
using Qdrant.Client;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;


var builder = WebApplication.CreateBuilder(args);


//Test for TextAnalytics
// Test.Experience();
// Test.Salary();
// Test.Skills();
// Add services to the container.


if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}
var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
                       ?? builder.Configuration.GetConnectionString("DefaultConnection");

var gptKey = Environment.GetEnvironmentVariable("GPTKey")
             ?? builder.Configuration["GPTKey"];


builder.Services.AddSingleton<StreamService>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.39-mysql")));

builder.Services.AddControllers();
builder.Services.AddLogging(options =>
{
    options.AddConsole();
    options.AddDebug();
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("https://jobpreppers.co") // react url
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetIsOriginAllowed(origin => true) // Helps with some CORS issues
              .WithExposedHeaders("Access-Control-Allow-Origin");
    });
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "yourdomain.com",
            ValidAudience = "yourdomain.com",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("thisisuperlongbecauseitneedstobe256bits"))
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                if (string.IsNullOrEmpty(context.ErrorDescription))
                {
                    context.Response.Headers["WWW-Authenticate"] =
                        "Bearer realm=\"yourdomain.com\", error=\"invalid_token\", error_description=\"The token is invalid or expired.\"";
                }

                return Task.CompletedTask;
            },
            OnMessageReceived = context =>
            {
                var token = context.HttpContext.Request.Cookies["authToken"];

                if (!string.IsNullOrEmpty(token)) ;
                {
                    context.Token = token;
                }
                return Task.CompletedTask;
            },
        };
    });
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.HttpOnly = true;
    options.Cookie.Domain = "localhost";
});

// Azure Language SetUp
var azureSettings = builder.Configuration.GetSection("AzureLanguage");

var apiKey = azureSettings["APIKey"] ?? Environment.GetEnvironmentVariable("AzureLanguage__APIKey");
var endpoint = azureSettings["Endpoint"] ?? Environment.GetEnvironmentVariable("AzureLanguage__Endpoint");

if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(endpoint))
{
    throw new InvalidOperationException("Azure API Key or Endpoint is missing from configuration.");
}
else
{
    builder.Services.AddSingleton<TextAnalyticsService>(sp => new TextAnalyticsService(
        apiKey,
        endpoint
    ));
}

builder.Services.AddSingleton<QdrantClient>(provider =>
{

    string? QDRANT_API_KEY = builder.Configuration["Qdrant:ApiKey"];
    if (string.IsNullOrEmpty(QDRANT_API_KEY))
    {
        throw new InvalidOperationException("Error: QDRANT_API_KEY environment variable not set.");

    }

    return new QdrantClient(
        host: "b9cf505f-e0e0-4759-b845-724f672e0551.us-west-2-0.aws.cloud.qdrant.io",
        https: true,
        apiKey: QDRANT_API_KEY
    );
});

builder.Services.AddSingleton<OnnxModelService>(provider =>
{
    var modelPath = "onnx_env/all-MiniLM-L6-v2/onnx/model.onnx";
    // var tokenPath = "onnx_env/tokenizer/tokenizer.json";
    return new OnnxModelService(modelPath);
});

builder.Services.AddSingleton<JobsVectorDB>();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
       {
           // Define the security schema for the API key in header
           options.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme
           {
               In = ParameterLocation.Header, // Where to send the key (header, query, etc.)
               Name = "Authorization", // Name of the header
               Type = SecuritySchemeType.ApiKey, // Type is API Key
               Description = "API key needed to access the Stream API"
           });

           // Apply the security definition globally
           options.AddSecurityRequirement(new OpenApiSecurityRequirement
           {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "ApiKey"
                        }
                    },
                    new string[] {}
                }
           });
       });

builder.Services.AddAuthorization();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "JobPreppersDemo API");

        c.RoutePrefix = string.Empty; // Set Swagger UI as the root (e.g., localhost:5000)
    });
}

// app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

app.Urls.Add("http://localhost:5000");
app.Urls.Add("https://localhost:5001");

app.MapControllers();

app.Run();
