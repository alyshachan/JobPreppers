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
using Mysqlx.Crud;

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
            public string projectTitle { get; set; }
            public string description { get; set; }
        }
        public UserProjectController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userID}")]
        public async Task<IActionResult> GetUserProjects(int userID)
        {
            try
            {
                //check if user exists
                var doesExist = await _context.Users.AnyAsync(u => u.userID == userID);
                if (!doesExist)
                {
                    return NotFound("User not Found");
                }
                //if they do return all user projects
                else
                {
                    var userProjects = await _context.UserProjects
                           .Where(up => up.userID == userID)
                           .Select(up => new
                           {
                               UserProjectID = up.projectID,
                               ProjectTitle = up.project_title,
                               Description = up.description
                           })
                           .ToListAsync();

                    if (userProjects.Count == 0)
                    {
                        return NotFound($"No projects found for user with ID {userID}.");
                    }

                    return Ok(userProjects);

                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
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
                return Ok(new { message = "Project added successfully", projectID = newProject.projectID });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }

        [HttpPut("EditProject/{projectID}")]
        public async Task<IActionResult> EditProject(int projectID, [FromBody] UserProjectDto userProjectDto)
        {
            if (userProjectDto == null)
            {
                return BadRequest("Project information not filled out");
            }
            try
            {
                var project = await _context.UserProjects.FindAsync(projectID);
                if (project == null){
                    return NotFound("Project not found");
                }

                // Check if the project already exists
                var duplicateProject = await _context.UserProjects
                    .AnyAsync(p =>
                        p.userID == userProjectDto.userID &&
                        p.project_title.ToLower() == userProjectDto.projectTitle.ToLower() &&
                        p.projectID != projectID);

                if (duplicateProject)
                {
                    return Conflict("A project with the same title already exists for this user.");
                }

                project.project_title = userProjectDto.projectTitle;
                project.description = userProjectDto.description;

                _context.UserProjects.Update(project);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Project updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("DeleteProject/{projectID}")]
        public async Task<IActionResult> DeleteProject(int projectID){
            try{
                var project = await _context.UserProjects.FindAsync(projectID);
                if (project == null){
                    return NotFound("Project not found");
                }

                _context.UserProjects.Remove(project);
                await _context.SaveChangesAsync();

                return Ok(new {message = "Project deleted sucessfully"});
            }
            catch(Exception ex){
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
