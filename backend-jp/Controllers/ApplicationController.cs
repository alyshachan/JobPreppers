using JobPreppersDemo.Contexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobPreppersDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ApplicationController(ApplicationDbContext context)
        {
            _context = context;
        }
        public class applicationDTO
        {
            public int userID { get; set; }
            public int postID { get; set; }
            public int recruiterID { get; set; }
        }

        [HttpPost("ClickedApply")]
        public async Task<ActionResult> updateApplication([FromBody] applicationDTO application)
        {
            // Check if the user already applied to this job (optional, but prevents duplicates)
            var existingApplication = await _context.Applications.FindAsync(application.userID, application.postID);

            if (existingApplication != null)
            {
                return Ok(new { message = "User has already applied to this job post." });
            }

            var newApplication = new Models.Application
            {
                userID = application.userID,
                recruiterID = application.recruiterID,
                jobPostID = application.postID
            };

            try
            {
                _context.Applications.Add(newApplication);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Application successfully submitted." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while submitting the application.", error = ex.Message });
            }
        }
        [HttpGet("count/{jobPostID}")]
        public async Task<ActionResult<int>> GetApplicationCount(int jobPostID)
        {
            try
            {
                var count = await _context.Applications
                    .Where(a => a.jobPostID == jobPostID)
                    .CountAsync();

                return Ok(new { jobPostID = jobPostID, applicantCount = count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error counting applications", error = ex.Message });
            }
        }
        [HttpGet("applicants/{jobPostID}")]
        public async Task<IActionResult> GetApplicants(int jobPostID)
        {
            var applicants = await _context.Applications
                .Where(a => a.jobPostID == jobPostID)
                .Join(_context.Users,
                      app => app.userID,
                      user => user.userID,
                      (app, user) => new
                      {
                          user.userID,
                          first_name = user.first_name,
                          last_name = user.last_name,
                          title = user.title,
                          pfp = user.profile_pic
                      })
                .ToListAsync();

            return Ok(applicants);
        }
    }
}
