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
        [HttpPost("SignUpToInterview")]
        public async Task<IActionResult> signUpToInterview([FromBody]signUpDto signUp)
        {
            if(signUp == null)
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
                    rating = signUp.rating

                };
                await _context.Interviewers.AddAsync(newSignUp);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(signUpToInterview), newSignUp);
            }
            catch(Exception ex) 
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
