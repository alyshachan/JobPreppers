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
    public class CompanyDTO
    {
        public int userID { get; set; }
        public string Name { get; set; }
        public string industry { get; set; }

    }

    public class IsCompanyResponseDto
    {
        public bool isCompany { get; set; }

    }
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : Controller
    {
        private readonly ApplicationDbContext _context;
        public CompanyController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("CreateCompany")]
        public async Task<IActionResult> CreateCompany([FromBody] CompanyDTO companyDto)
        {
            if (companyDto == null)
            {

                return BadRequest("Company info not filled out");
            }
            try
            {
                var newCompany = new Company
                {
                    userID = companyDto.userID,
                    Name = companyDto.Name,
                    industry = companyDto.industry,
                };
                await _context.Companies.AddAsync(newCompany);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(CreateCompany), newCompany);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }

        [HttpGet]
        public async Task<IActionResult> GetCompanyJobs([FromQuery] int userID)
        {
            try
            {

                var companyJobs = await _context.JobPosts
                                        .Include(job => job.company)
                                        .Include(job => job.location)
                                        .Where(job => job.company.userID == userID)
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
                                            jobID = job.postID


                                        }
                                    )
                                        .ToListAsync();

                // var jobs = await _context.JobPosts
                //                          .Where(job => bookmarkedJobs.Contains(job.postID))
                //                          .ToListAsync();

                return Ok(companyJobs);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("isCompany")]
        public async Task<ActionResult<IsCompanyResponseDto>> isCompany([FromQuery] int userID)
        {
            try
            {
                Console.WriteLine("This went into the right function");
                var company = await _context.Companies
                .Where(c => c.userID == userID).AnyAsync();
                Console.WriteLine($"Is this user a company: {company}");

                var response = new IsCompanyResponseDto
                {
                    isCompany = company,
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


    }
}


