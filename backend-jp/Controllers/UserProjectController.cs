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
using Google.Protobuf.Collections;

namespace JobPreppersDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProjectController : Controller
    {
        private readonly ApplicationDbContext _context;
        public class UserProjectDto
        {
            public int userID { get; set; }
            public string projectTitle{ get; set; }
            public string description { get; set; }
        }
        public UserProjectController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpPost("CreateProject")]
        public async Task<IActionResult> CreateProject([FromBody] UserProjectDto project)
        {
            if (project == null)
            {
                return BadRequest("Project Info not filled out");


            }
            try
            {
                // Check if the project already exists
        var existingProject = await _context.UserProjects
            .FirstOrDefaultAsync(p => p.userID == project.userID &&
                                      p.project_title.ToLower() == project.projectTitle.ToLower());

                if (existingProject != null)
                {
                    return Conflict("A project with the same title already exists for this user.");
                }
                var newProject = new UserProject
                {
                    userID = project.userID,
                    project_title = project.projectTitle,
                    description = project.description
                };
                await _context.UserProjects.AddAsync(newProject);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(CreateProject), new { id = newProject.projectID }, newProject);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            
        }
    }
}
