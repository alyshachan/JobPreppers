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

    public class UserEducationDto
    {
        public int userID { get; set; }
        public string schoolName { get; set; }
        public string? degreeName { get; set; }
        public string? studyName { get; set; }
        public DateOnly? start_date { get; set; }
        public DateOnly? end_date { get; set; }
        public string? description { get; set; }

    }

    [Route("api/[controller]")]
    [ApiController]
    public class UserEducationController : Controller
    {
        private readonly ApplicationDbContext _context;
        public UserEducationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userID}")]
        public async Task<IActionResult> GetUserEducation(int userID)
        {
            try
            {
                //check if user exists
                var doesExist = await _context.Users.AnyAsync(u => u.userID == userID);
                if (!doesExist)
                {
                    return NotFound("User not Found");
                }
                //if they do return all user education
                else
                {
                    var userEducation = await _context.UserEducations
                           .Where(ue => ue.userID == userID)
                           .Include(ue => ue.school)
                           .Include(ue => ue.degree)
                           .Include(ue => ue.study)
                           .OrderByDescending(ue => ue.end_date == null)
                           .ThenByDescending(ue => ue.end_date)
                           .ThenByDescending(ue => ue.start_date)
                           .Select(ue => new
                           {
                               SchoolName = ue.school.school_name,
                               DegreeName = ue.degree != null ? ue.degree.degree_name : null,
                               StudyName = ue.study != null ? ue.study.study_name : null,
                               StartDate = ue.start_date,
                               EndDate = ue.end_date,
                               Description = ue.description
                           })
                           .ToListAsync();

                    if (userEducation.Count == 0)
                    {
                        return NotFound($"No education found for user with ID {userID}.");
                    }

                    return Ok(userEducation);

                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("CreateEducation")]
        public async Task<IActionResult> CreateEducation([FromBody] UserEducationDto userEducationDto)
        {
            if (userEducationDto == null)
            {
                return BadRequest("Education information not filled out.");
            }

            try
            {
                // Check or add School
                var school = await _context.Schools
                    .FirstOrDefaultAsync(s => s.school_name.ToLower() == userEducationDto.schoolName.ToLower());

                if (school == null)
                {
                    school = new School { school_name = userEducationDto.schoolName };
                    await _context.Schools.AddAsync(school);
                    await _context.SaveChangesAsync();
                }

                // Check or add Degree
                var degree = string.IsNullOrEmpty(userEducationDto.degreeName)
                    ? null
                    : await _context.Degrees
                        .FirstOrDefaultAsync(d => d.degree_name.ToLower() == userEducationDto.degreeName.ToLower());

                if (degree == null && !string.IsNullOrEmpty(userEducationDto.degreeName))
                {
                    degree = new Degree { degree_name = userEducationDto.degreeName };
                    await _context.Degrees.AddAsync(degree);
                    await _context.SaveChangesAsync();
                }

                // Check or add Study
                var study = string.IsNullOrEmpty(userEducationDto.studyName)
                    ? null
                    : await _context.Studies
                        .FirstOrDefaultAsync(st => st.study_name.ToLower() == userEducationDto.studyName.ToLower());

                if (study == null && !string.IsNullOrEmpty(userEducationDto.studyName))
                {
                    study = new Study { study_name = userEducationDto.studyName };
                    await _context.Studies.AddAsync(study);
                    await _context.SaveChangesAsync();
                }

                // Create the UserEducation record
                var newEducation = new UserEducation
                {
                    userID = userEducationDto.userID,
                    schoolID = school.schoolID,
                    degreeID = degree?.degreeID,
                    studyID = study?.studyID,
                    start_date = userEducationDto.start_date,
                    end_date = userEducationDto.end_date,
                    description = userEducationDto.description
                };

                await _context.UserEducations.AddAsync(newEducation);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Education added successfully", educationID = newEducation.userEducationID });

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
