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
    public class RecruiterDTO
    {
        public int userID { get; set; }
        public int companyID { get; set; }
       

    }
    [Route("api/[controller]")]
    [ApiController]
    public class RecruiterController : Controller
    {
        private readonly ApplicationDbContext _context;
        public RecruiterController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("CreateRecruiter")]
        public async Task<IActionResult> CreateRecruiter([FromBody] RecruiterDTO recruiterDto)
        {
            if (recruiterDto == null)
            {

                return BadRequest("Company info not filled out");
            }
            try
            {
                var newRecruiter = new Recruiter
                {
                    userID = recruiterDto.userID,
                    companyID = recruiterDto.companyID
                    
                };
                await _context.Recruiters.AddAsync(newRecruiter);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(CreateRecruiter), newRecruiter);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }
    }
}


