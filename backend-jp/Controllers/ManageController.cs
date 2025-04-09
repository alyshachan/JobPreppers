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
using JobPreppersDemo.Services;


namespace JobPreppersDemo.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class ManageController : Controller
    {

        public class DeleteJobRequest
        {
            public int jobID { get; set; }
            public int userID { get; set; }
        }
        public class ManageDto
        {
            public int userID { get; set; }

        }
        private readonly ApplicationDbContext _context;

        private readonly JobsVectorDB _vector;

        public ManageController(ApplicationDbContext context, JobsVectorDB vector)
        {
            _context = context;
            _vector = vector;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllJobs([FromQuery] ManageDto request)
        {

            try
            {

                // var jobs = await _context.Jobs.ToListAsync();
                var jobs = await _context.JobPosts
                                .Include(job => job.qualification)
                                .Include(job => job.company)
                                .Include(job => job.location)
                                .Where(job => job.recruiter.userID == request.userID)
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
                                    jobID = job.postID,
                                    skills = job.qualification.Skills,
                                    educationLevel = job.qualification.EducationLevel,
                                    minimumExperience = job.qualification.MinimumExperience,
                                    maximumExperience = job.qualification.MaximumExperience,
                                    profilePic = job!.company!.user!.profile_pic != null
    ? "data:image/png;base64," + Convert.ToBase64String(job.company.user.profile_pic)
    : null



                                }
                                )
                                .ToListAsync();

                if (jobs == null)
                {
                    return NotFound("No jobs found.");
                }
                return Ok(new { jobs });

            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                    Console.WriteLine($"Inner Exception StackTrace: {ex.InnerException.StackTrace}");
                }
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });


            }

        }

        // Recruiter are able to delete the job they posted
        [HttpPost("delete")]
        public async Task<IActionResult> deleteJobPost([FromBody] DeleteJobRequest request)
        {

            try
            {
                Console.WriteLine($"JobID: {request.jobID} ");
                Console.WriteLine($"UserID: {request.userID} ");

                // Might need to change to take into account if they posted the job position
                var isRecruiter = await _context.JobPosts.AnyAsync(job => job.postID == request.jobID && job.recruiter.userID == request.userID);
                if (isRecruiter)
                {
                    // Remove from the database 
                    var selectedJob = await _context.JobPosts.Where(job => job.postID == request.jobID).FirstOrDefaultAsync();
                    if (selectedJob != null)
                    {
                        _context.JobPosts.Remove(selectedJob);
                        await _context.SaveChangesAsync();
                        // Remove from Qdrant
                        await _vector.deleteFromJobVector(request.jobID);
                        Console.WriteLine($"Delete Sucessful");

                    }
                    else
                    {
                        return StatusCode(500, new { message = $"Couldn't find the job post" });

                    }


                }

                else
                {
                    return StatusCode(500, new { message = $"Not a recruiter, do not have access to this content" });

                }


                return Ok(new { message = "Job added successfully", jobId = request.jobID });
            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                    Console.WriteLine($"Inner Exception StackTrace: {ex.InnerException.StackTrace}");
                }
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });


            }



        }


    }
}



