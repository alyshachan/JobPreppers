
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using JobPreppersDemo.Models;
using JobPreppersDemo.Contexts;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}


builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
        Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.39-mysql")));

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
        policy.WithOrigins("http://localhost:3000") // react url
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();

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


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
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

//app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.Urls.Add("http://localhost:5000");
app.Urls.Add("https://localhost:5001");


app.MapControllers();

app.Run();
