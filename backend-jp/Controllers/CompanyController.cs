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
           if(companyDto == null) 
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
    }
}


