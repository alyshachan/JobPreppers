using JobPreppersDemo.Contexts;
using Microsoft.AspNetCore.Mvc;
using JobPreppersDemo.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Org.BouncyCastle.Asn1.Ocsp;
using static JobPreppersDemo.Controllers.SkillsController;

namespace JobPreppersDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserSkillsController : Controller
    {
        private readonly ApplicationDbContext _context;
        public class UserSkill
        {
            public int UserID { get; set; }
            public string SkillName { get; set; } = null!;
            public string Category { get; set; } = null!;
        }

        public UserSkillsController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet("{userID}skills")]
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
                    var userSkills = await _context.userSkills
                           .Where(us => us.userID == userID)
                           .Include(us => us.skill) // Include skill details
                           .Select(us => new
                           {
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
            catch(Exception ex) 
            {
                return StatusCode(500, ex.Message);
            }

        }
        [HttpPost("AddSkillToUser")]
        public async Task<IActionResult> AddSkillToUser([FromBody] UserSkill request)
        {
            
            if (request == null || string.IsNullOrEmpty(request.SkillName) || string.IsNullOrEmpty(request.Category))
            {
                return BadRequest("SkillName and Category are required.");
            }
            
            try
            {
                //check if skill already exits
                var skill = await _context.Skills.FirstOrDefaultAsync(s => s.Name == request.SkillName);
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
                var userSkillExits = await _context.userSkills.AnyAsync(s => s.userID == request.UserID && s.skillID == skill.skillID);
                if (userSkillExits) 
                {
                    return Conflict("User already has this skill");
                }
                //add to userSkill table
                else
                {
                    var newSkill = new userSkill
                    {
                        userID = request.UserID,
                        skillID = skill.skillID,
                    };
                     _context.userSkills.Add(newSkill);
                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        Message = "Skill successfully added to user.",
                        Skill = skill,
                        UserSkill = newSkill
                    });
                }
                
            }
            catch (Exception ex) 
            {
                return StatusCode(500, ex.Message);
            }

            


        }

    }
}
