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

        public async Task<IActionResult> ParseDescription([FromBody] string jobDescription)
        {
            if (jobDescription.IsNullOrEmpty())
            {
                return BadRequest("Bad job description.");
            }
            try
            {
                List<string> list = new List<string>();

                var result = await _textAnalyticsService.EntityEntryRecognition(jobDescription);


                return Ok(result);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }





        }

    }
}
