using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using System.Diagnostics;
using System.Text.Json;

namespace JobPreppersDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResumeController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public ResumeController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        [HttpGet("test-gpt-key")]
        public async Task<IActionResult> TestGptKey()
        {
            // Retrieve the GPT key from secrets
            var gptKey = _configuration["GPTKey"];
            if (string.IsNullOrEmpty(gptKey))
            {
                return BadRequest("GPT key not found. Ensure it is correctly configured in your secrets.");
            }

            try
            {
                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {gptKey}");

                // Adjust for ChatGPT-specific API
                var payload = new
                {
                    model = "gpt-4o-mini", // Specify the ChatGPT model you are using
                    messages = new[]
                    {
                new { role = "system", content = "You are a helpful assistant." },
                new { role = "user", content = "Hello, GPT!" }
            },
                    max_tokens = 10
                };

                var response = await httpClient.PostAsync(
                    "https://api.openai.com/v1/chat/completions",
                    new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
                );

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return StatusCode((int)response.StatusCode, $"API call failed: {errorContent}");
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                return Ok($"API call successful: {responseContent}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}
