using Microsoft.AspNetCore.Mvc;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using static JobPreppersDemo.Controllers.SkillsController;


namespace JobPreppersDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillsController : Controller
    {

        private readonly ApplicationDbContext _context;
        public class SkillRequest
        {
            public string name { get; set; } = null!;
            public string category { get; set; } = null!;
        }

        public SkillsController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpPost("CreateSkill")]
        public async Task<IActionResult> CreateSkill([FromBody] SkillRequest skillRequest)
        {
            if (skillRequest == null || string.IsNullOrEmpty(skillRequest.name) || string.IsNullOrEmpty(skillRequest.category))
            {
                return BadRequest("No Name or Category specified");
            }
            else
            {
                try
                {
                    var newSkill = new Skill
                    {
                        Name = skillRequest.name,
                        Category = skillRequest.category
                    };
                    _context.Skills.Add(newSkill);
                    await _context.SaveChangesAsync();
                    return CreatedAtAction(nameof(CreateSkill), newSkill);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, ex.Message);
                }
            }

        }

    }
}
