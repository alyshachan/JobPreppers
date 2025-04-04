using JobPreppersDemo.Contexts;
using Microsoft.AspNetCore.Mvc;
using JobPreppersDemo.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Org.BouncyCastle.Asn1.Ocsp;
using static JobPreppersDemo.Controllers.SkillsController;
using JobPreppersDemo.Services;

namespace JobPreppersDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserSkillsController : Controller
    {
        private readonly ApplicationDbContext _context;

        private readonly EmbeddedUser _embeddedUser;
        public class UserSkills
        {
            public int UserID { get; set; }
            public string SkillName { get; set; } = null!;
            public string Category { get; set; } = null!;
        }

        public UserSkillsController(ApplicationDbContext context, JobsVectorDB vector)
        {
            _context = context;
            _embeddedUser = new EmbeddedUser(context, vector);
        }
        [HttpGet("{userID}")]
        public async Task<IActionResult> GetAllUserSKills(int userID)
        {
            try
            {
                //check if user exists
                var doesExist = await _context.Users.AnyAsync(u => u.userID == userID);
                if (!doesExist)
                {
                    return NotFound("User not Found");
                }
                //if they do return all skills
                else
                {
                    var userSkills = await _context.UserSkills
                           .Where(us => us.userID == userID)
                           .Include(us => us.skill) // Include skill details
                           .Select(us => new
                           {
                               us.userSkillID,
                               us.skill.skillID,
                               us.skill.Name,
                               us.skill.Category
                           })
                           .ToListAsync();

                    if (userSkills.Count == 0)
                    {
                        return NotFound($"No skills found for user with ID {userID}.");
                    }

                    return Ok(userSkills);

                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }
        [HttpPost("AddSkillToUser")]
        public async Task<IActionResult> AddSkillToUser([FromBody] UserSkills request)
        {

            if (request == null || string.IsNullOrEmpty(request.SkillName) || string.IsNullOrEmpty(request.Category))
            {
                return BadRequest("SkillName and Category are required.");
            }

            try
            {
                //check if skill already exits
                var skill = await _context.Skills.FirstOrDefaultAsync(s => s.Name == request.SkillName && s.Category == request.Category);
                //if not create skill and add to skill table
                if (skill == null)
                {
                    skill = new Skill
                    {
                        Name = request.SkillName,
                        Category = request.Category
                    };
                    _context.Skills.Add(skill);
                    await _context.SaveChangesAsync();
                }
                //check if already in userskill table
                var userSkillExits = await _context.UserSkills.AnyAsync(s => s.userID == request.UserID && s.skillID == skill.skillID);
                if (userSkillExits)
                {
                    return Conflict("User already has this skill");
                }
                //add to userSkill table
                else
                {
                    var newSkill = new UserSkill
                    {
                        userID = request.UserID,
                        skillID = skill.skillID,
                    };

                    _context.UserSkills.Add(newSkill);
                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        Message = "Skill successfully added to user.",
                        skillID = newSkill.userSkillID
                    });
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpPut("EditSkill/{skillID}")]
        public async Task<IActionResult> EditUserSkill(int skillID, [FromBody] UserSkills request)
        {

            if (request == null || string.IsNullOrEmpty(request.SkillName) || string.IsNullOrEmpty(request.Category))
            {
                return BadRequest("SkillName and Category are required.");
            }

            try
            {
                var skill = await _context.UserSkills.FindAsync(skillID);
                if (skill == null)
                {
                    return NotFound("Skill not found");
                }
                //check if skill already exits
                var duplicateSkill = await _context.Skills.FirstOrDefaultAsync(s => s.Name == request.SkillName && s.Category == request.Category);
                //if not create skill and add to skill table
                if (duplicateSkill == null)
                {
                    duplicateSkill = new Skill
                    {
                        Name = request.SkillName,
                        Category = request.Category
                    };
                    _context.Skills.Add(duplicateSkill);
                    await _context.SaveChangesAsync();
                }
                //check if already in userskill table
                var userSkillExits = await _context.UserSkills.AnyAsync(s => s.userID == request.UserID && s.skillID == duplicateSkill.skillID && s.userSkillID != skillID);
                if (userSkillExits)
                {
                    return Conflict("User already has this skill");
                }
                //add to userSkill table
                else
                {

                    skill.userID = request.UserID;
                    skill.skillID = duplicateSkill.skillID;

                    _context.UserSkills.Update(skill);
                    await _context.SaveChangesAsync();
                    await _embeddedUser.AddEmbeddedUser(request.UserID);

                    return Ok(new
                    {
                        Message = "Skill updated successfully",
                    });
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpDelete("DeleteSkill/{skillID}")]
        public async Task<IActionResult> DeleteSkill(int skillID)
        {
            try
            {
                var skill = await _context.UserSkills.FindAsync(skillID);
                if (skill == null)
                {
                    return NotFound("Skill not found");
                }

                _context.UserSkills.Remove(skill);
                await _context.SaveChangesAsync();
                await _embeddedUser.AddEmbeddedUser(skill.userID);

                return Ok(new { message = "Skill deleted sucessfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
