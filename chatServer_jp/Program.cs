using chatServer_jp.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5690); // Listen on port 5690 for HTTP
    options.ListenAnyIP(5691, listenOptions => listenOptions.UseHttps()); // Listen on port 5691 for HTTPS
});

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddSignalR(e => {e.EnableDetailedErrors = true;});
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

                if (!string.IsNullOrEmpty(token));
                {
                    context.Token = token;
                }
                return Task.CompletedTask;
            },
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();


app.UseRouting();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapHub<ChatHub>("/chatHub");
app.MapHub<DirectMessageHub>("/directMessageHub");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.Run();
