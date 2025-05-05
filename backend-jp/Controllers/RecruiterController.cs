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


    public class RecruiterResponseDto
    {
        public bool IsRecruiter { get; set; }
        public string? CompanyName { get; set; }

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
                var company = await _context.Companies
                            .FirstOrDefaultAsync(c => c.userID == recruiterDto.companyID);

                if (company == null)
                {
                    return BadRequest("No company found for the provided userID.");
                }
                var newRecruiter = new Recruiter
                {
                    userID = recruiterDto.userID,
                    companyID = company.companyID

                };
                await _context.Recruiters.AddAsync(newRecruiter);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Recruiter added successfully", recruiterID = newRecruiter.recruiterID });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }


        [HttpGet("isRecruiter")]
        public async Task<ActionResult<RecruiterResponseDto>> isRecruiter([FromQuery] int userID)
        {

            try
            {
                var recruiter = await _context.Recruiters
                .Include(rec => rec.company)
                .Where(rec => rec.userID == userID)
                .Select(r => new { CompanyName = r.company.Name })
                .FirstOrDefaultAsync();
                bool isRec = recruiter != null;
                string companyName = recruiter?.CompanyName ?? "Not Found";

                var response = new RecruiterResponseDto
                {
                    IsRecruiter = isRec,
                    CompanyName = companyName
                };

                Console.WriteLine($"The result of the query 1: {companyName}");
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}




