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
using JobPreppersDemo.Services;
using System.Text.Json;
using Newtonsoft.Json;

public class JobDescriptionRequest
{
    public string Description { get; set; }
}


namespace JobPreppersDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TextAnalyticsController : ControllerBase
    {

        private readonly TextAnalyticsService _textAnalyticsService;

        public TextAnalyticsController(TextAnalyticsService textAnalyticsService)
        {
            _textAnalyticsService = textAnalyticsService;
        }

        [HttpPost("")]

        public async Task<IActionResult> ParseDescription([FromBody] JobDescriptionRequest jobDescription)
        {
            if (jobDescription.Description.IsNullOrEmpty())
            {
                return BadRequest("Bad job description.");
            }
            try
            {
                var json = JsonConvert.SerializeObject(jobDescription);
                Console.WriteLine($"Json: {json} ");
                var result = await _textAnalyticsService.EntityEntryRecognition(json);

                return Ok(result);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }





        }

    }
}
