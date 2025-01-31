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

namespace JobPreppersDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserExperienceController : Controller
    {
        private readonly ApplicationDbContext _context;
        public UserExperienceController(ApplicationDbContext context)
        {
            _context = context;
        }
        public class UserExperienceDto
        {
            public int userID { get; set; }
            public string workName { get; set; } = null!;
            public string location { get; set; } = null!;
            public string jobTitle { get; set; } = null!;
            public DateOnly? start_date { get; set; }
            public DateOnly? end_date { get; set; }
            public string? description { get; set; }
        }


        [HttpGet("{userID}")]
        public async Task<IActionResult> GetUserExperience(int userID)
        {
            try
            {
                //check if user exists
                var doesExist = await _context.Users.AnyAsync(u => u.userID == userID);
                if (!doesExist)
                {
                    return NotFound("User not Found");
                }
                //if they do return all user experience
                else
                {
                    var userExperience = await _context.UserExperiences
                           .Where(ue => ue.userID == userID)
                           .Include(ue => ue.work)
                           .OrderByDescending(ue => ue.end_date == null)
                           .ThenByDescending(ue => ue.end_date)
                           .ThenByDescending(ue => ue.start_date)
                           .Select(ue => new
                           {
                               WorkName = ue.work.work_name,
                               WorkLocation = ue.work.location,
                               JobTitle = ue.job_title,
                               StartDate = ue.start_date,
                               EndDate = ue.end_date,
                               Description = ue.description
                           })
                           .ToListAsync();

                    if (userExperience.Count == 0)
                    {
                        return NotFound($"No experience found for user with ID {userID}.");
                    }

                    return Ok(userExperience);

                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("CreateExperience")]
        public async Task<IActionResult> createExperience([FromBody] UserExperienceDto experience)
        {
            if (experience == null)
            {
                return BadRequest("Experience information not filled out.");
            }

            try
            {
                // Check if the work already exists by name and location
                var work = await _context.Works
                    .FirstOrDefaultAsync(w => w.work_name.ToLower() == experience.workName.ToLower() &&
                                              w.location.ToLower() == experience.location.ToLower());

                // If the work doesn't exist, add it to the database
                if (work == null)
                {
                    work = new Work
                    {
                        work_name = experience.workName,
                        location = experience.location
                    };

                    await _context.Works.AddAsync(work);
                    await _context.SaveChangesAsync(); // Save to generate the workID
                }

                // Create a new UserExperience and associate it with the work
                var userExperience = new UserExperience
                {
                    userID = experience.userID,
                    workID = work.workID,
                    job_title = experience.jobTitle,
                    start_date = experience.start_date,
                    end_date = experience.end_date,
                    description = experience.description
                };

                await _context.UserExperiences.AddAsync(userExperience);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(createExperience), new { id = userExperience.userExperienceID }, userExperience);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
