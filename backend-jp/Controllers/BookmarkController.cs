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
    public class BookmarkDto
    {
        public int userID { get; set; }
        public int JobID { get; set; }


    }

    [Route("api/[controller]")]
    [ApiController]
    public class BookmarkController : Controller
    {
        private readonly ApplicationDbContext _context;
        public BookmarkController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("getBookmark")]
        public async Task<IActionResult> GetBookmark([FromQuery] int userID)
        {
            //Grab the user from the embedded table --> Need to scaffold first

            var bookmarkedJobs = await _context.Bookmarks
                                      .Where(b => b.userID == userID)
                                      .Select(b => b.JobID)
                                      .ToListAsync();

            // var jobs = await _context.JobPosts
            //                          .Where(job => bookmarkedJobs.Contains(job.postID))
            //                          .ToListAsync();

            return Ok(bookmarkedJobs);
        }



        [HttpGet("getBookmarkedJobs")]
        public async Task<IActionResult> GetBookmarkedJobs([FromQuery] int userID)
        {

            var bookmarkedJobs = await _context.Bookmarks
                                    .Include(book => book.Job)
                                    .Where(b => b.userID == userID)
                                    .Select(b => b.Job != null ? new
                                    {
                                        jobID = b.JobID,
                                        company = b.Job.company.Name,
                                        minimumSalary = b.Job.minimumSalary,
                                        benefits = b.Job.benefits,
                                        postDate = b.Job.postDate,
                                        endDate = b.Job.endDate,
                                        description = b.Job.description,
                                        title = b.Job.title,
                                        type = b.Job.type,
                                        link = b.Job.link,
                                        location = b.Job.location.name,
                                        bonues = b.Job.bonus,
                                        perks = b.Job.perks,
                                        profilePic = b.Job!.company!.user!.profile_pic != null
    ? "data:image/png;base64," + Convert.ToBase64String(b.Job.company.user.profile_pic)
    : null
                                    } : null
                                      )
                                      .ToListAsync();

            // var jobs = await _context.JobPosts
            //                          .Where(job => bookmarkedJobs.Contains(job.postID))
            //                          .ToListAsync();

            return Ok(bookmarkedJobs);
        }

        [HttpPost("ToggleBookmark")]
        public async Task<IActionResult> ToggleBookmark([FromBody] BookmarkDto request)
        {
            try
            {
                var bookmarkedJob = await _context.Bookmarks
                .FirstOrDefaultAsync(bj => bj.userID == request.userID && bj.JobID == request.JobID);
                Console.WriteLine(bookmarkedJob);

                // if doesn't exist, add
                if (bookmarkedJob == null)
                {
                    Console.WriteLine("Went into add bookmark");
                    var newBookmark = new Bookmark
                    {
                        userID = request.userID,
                        JobID = request.JobID
                    };
                    await _context.Bookmarks.AddAsync(newBookmark);

                }

                // If exist, remove 
                else
                {
                    Console.WriteLine("Went into remove bookmark");

                    _context.Bookmarks.Remove(bookmarkedJob);

                }
                await _context.SaveChangesAsync();
                return Ok(new { message = "Bookmark toggled successfully" });

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }



    }
}



