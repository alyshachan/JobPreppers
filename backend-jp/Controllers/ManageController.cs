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

    [Route("api/[controller]")]
    [ApiController]
    public class ManageController : Controller
    {
        public class ManageDto
        {
            public int userID { get; set; }

        }
        private readonly ApplicationDbContext _context;
        public ManageController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllJobs([FromQuery] ManageDto request)
        {

            try
            {

                // var jobs = await _context.Jobs.ToListAsync();
                var jobs = await _context.JobPosts
                                .Include(job => job.qualification)
                                .Include(job => job.company)
                                .Include(job => job.location)
                                .Where(job => job.recruiter.userID == request.userID)
                                .Select(job => new
                                {
                                    company = job.company.Name,
                                    minimumSalary = job.minimumSalary,
                                    benefits = job.benefits,
                                    postDate = job.postDate,
                                    endDate = job.endDate,
                                    description = job.description,
                                    title = job.title,
                                    type = job.type,
                                    link = job.link,
                                    location = job.location.name,
                                    bonues = job.bonus,
                                    perks = job.perks,


                                }
                                )
                                .ToListAsync();

                if (jobs == null)
                {
                    return NotFound("No jobs found.");
                }
                return Ok(new { jobs });

            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                    Console.WriteLine($"Inner Exception StackTrace: {ex.InnerException.StackTrace}");
                }
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });


            }

        }



    }
}



