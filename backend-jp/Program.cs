using System.Text;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using JobPreppersDemo.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

//Test for TextAnalytics
// Test.Experience();
// Test.Salary();
// Add services to the container.


if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}
var connectionString =
    Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

var gptKey = Environment.GetEnvironmentVariable("GPTKey") ?? builder.Configuration["GPTKey"];

builder.Services.AddSingleton<StreamService>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        connectionString,
        Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.39-mysql")
    )
);

builder.Services.AddControllers();
builder.Services.AddLogging(options =>
{
    options.AddConsole();
    options.AddDebug();
});
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowReactApp",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:3000") // react url
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
    );
});
builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("thisisuperlongbecauseitneedstobe256bits")
            ),
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

                if (!string.IsNullOrEmpty(token))
                    ;
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
    options.Cookie.SecurePolicy = CookieSecurePolicy.None;
    options.Cookie.HttpOnly = true;
    options.Cookie.Domain = "jobpreppers.co";
});

// Azure Language SetUp
var azureSettings = builder.Configuration.GetSection("AzureLanguage");

var apiKey = azureSettings["APIKey"] ?? Environment.GetEnvironmentVariable("AzureLanguage__APIKey");
var endpoint =
    azureSettings["Endpoint"] ?? Environment.GetEnvironmentVariable("AzureLanguage__Endpoint");

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

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Define the security schema for the API key in header
    options.AddSecurityDefinition(
        "ApiKey",
        new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header, // Where to send the key (header, query, etc.)
            Name = "Authorization", // Name of the header
            Type = SecuritySchemeType.ApiKey, // Type is API Key
            Description = "API key needed to access the Stream API",
        }
    );

    // Apply the security definition globally
    options.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "ApiKey",
                    },
                },
                new string[] { }
            },
        }
    );
});

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "JobPreppersDemo API");

        c.RoutePrefix = string.Empty; // Set Swagger UI as the root (e.g., jobpreppers.co:5000)
    });
}

// app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

// app.Urls.Add("http://localhost:5000");
// app.Urls.Add("http://localhost:5000:5001");
app.Urls.Add("http://localhost:5000");
app.Urls.Add("https://localhost:5001");

app.MapControllers();

app.Run();
