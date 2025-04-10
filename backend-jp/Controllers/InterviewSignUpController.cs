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
using Newtonsoft.Json.Serialization;
using System.Text.Json;
namespace JobPreppersDemo.Controllers
{
    public class signUpDto
    {
        public int userID { get; set; }
        public string? specialties { get; set; }
        public string? availability { get; set; }
        public decimal? rating { get; set; }

    }
    [Route("api/[controller]")]
    [ApiController]
    public class InterviewSignUpController : Controller
    {

        private readonly ApplicationDbContext _context;
        public InterviewSignUpController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllInterviewers")]
        public async Task<IActionResult> GetAllInterviewers()
        {
            try
            {
                var interviewers = await _context.Interviewers
                    .Join(_context.Users,
                          interviewer => interviewer.userID,
                          user => user.userID,
                          (interviewer, user) => new
                          {
                              interviewer.userID,
                              FirstName = user.first_name,
                              LastName = user.last_name,
                              Username = user.username,
                              Title = user.title,
                              interviewer.specialties,
                              interviewer.availability,
                          })
                    .ToListAsync();

                return Ok(interviewers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpPost("SignUpToInterview")]
        public async Task<IActionResult> signUpToInterview([FromBody] signUpDto signUp)
        {
            if (signUp == null)
            {
                return BadRequest("Form was not filled out correctly");
            }
            try
            {
                var newSignUp = new Interviewer
                {
                    userID = signUp.userID,
                    specialties = JsonSerializer.Serialize(signUp.specialties),
                    availability = signUp.availability,
                    rating = null

                };
                await _context.Interviewers.AddAsync(newSignUp);
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    message = "Interviewer added successfully",
                    signUpID = newSignUp.interviewerID,
                    userID = newSignUp.userID,
                    specialties = signUp.specialties,
                    availability = signUp.availability,
                    rating = newSignUp.rating
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
