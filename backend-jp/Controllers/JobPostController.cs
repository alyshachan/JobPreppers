using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using JobPreppersDemo.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZstdSharp.Unsafe;



namespace JobPreppersDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobPostController : Controller
    {
        private readonly ApplicationDbContext _context;

        private readonly JobsVectorDB _vector;

        public class PostFilterRequest
        {
            public DateTime? Date { get; set; }
            public List<string>? Type { get; set; }

            public List<string>? Company { get; set; }

            public int Min_Salary { get; set; }

            public double? Longitude { get; set; }

            public double? Latitude { get; set; }

            public int Distance { get; set; }


        }


        public class JobPostDto
        {
            public string company { get; set; } = string.Empty;
            public int minimumSalary { get; set; }
            public DateTime postDate { get; set; }
            public DateTime endDate { get; set; }
            public string title { get; set; } = string.Empty;
            public string type { get; set; } = string.Empty;
            public string location { get; set; } = string.Empty;
            public string description { get; set; } = string.Empty;

            public string benefits { get; set; } = string.Empty;

            public string perks { get; set; } = string.Empty;

            public string bonues { get; set; } = string.Empty;
            public int jobID { get; set; }

        }


        public class AddJobDto
        {

            public DateTime postDate { get; set; }

            public DateTime endDate { get; set; }

            public string title { get; set; } = null!;

            public string type { get; set; } = null!;

            public string? benefits { get; set; }

            public string? perks { get; set; }

            public string? bonus { get; set; }

            public int minimumSalary { get; set; }

            public int? maximumSalary { get; set; }

            public string? description { get; set; }

            public string paymentType { get; set; } = null!;

            public int qualificationID { get; set; }

            // public string? currency { get; set; }

            // public int? numberOfHires { get; set; }

            public string? link { get; set; }

            public int locationID { get; set; }

            public int userID { get; set; }

            public virtual JobLocation location { get; set; } = null!;

            public virtual JobQualification qualification { get; set; } = null!;


        }


        public JobPostController(ApplicationDbContext context, JobsVectorDB vector)
        {
            _context = context;
            _vector = vector;
        }

        // // GET: api/jobpost
        [HttpGet]
        public async Task<IActionResult> GetAllJobs()
        {

            try
            {

                // var jobs = await _context.Jobs.ToListAsync();
                var jobs = await _context.JobPosts
                                .Include(job => job.qualification)
                                .Include(job => job.company)
                                .Include(job => job.location)
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
                                    jobID = job.postID


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

        // GET: api/jobpost/add
        [HttpPost("add")]
        public async Task<ActionResult> PostJob([FromBody] AddJobDto request)
        {

            try
            {
                // Add need to look for Recruiter 
                int recruiterID;
                int companyID;
                var recruiter = await _context.Recruiters.FirstOrDefaultAsync(rec => rec.userID == request.userID);
                if (recruiter == null)
                {
                    return BadRequest("Not a recruiter");
                }
                recruiterID = recruiter.recruiterID;
                companyID = recruiter.companyID;

                int locationID;
                // Add need to look for Company
                if (string.IsNullOrWhiteSpace(request.location.name))
                {
                    return BadRequest("Employer info needed");
                }
                var location = await _context.JobLocations.FirstOrDefaultAsync(e => e.name == request.location.name);
                if (location == null)
                {
                    location = new JobLocation
                    {
                        name = request.location.name,
                        longitude = request.location.longitude,
                        latitude = request.location.latitude,
                    };
                    _context.JobLocations.Add(location);
                    await _context.SaveChangesAsync();
                    //Add
                }
                locationID = location.locationID;


                // Add - need to firstorDefault for location
                int qualificationID;
                var qualification = new JobQualification
                {
                    Skills = request.qualification.Skills,
                    MinimumExperience = request.qualification.MinimumExperience,
                    EducationLevel = request.qualification.EducationLevel,
                    MaximumExperience = request.qualification.MaximumExperience
                };
                _context.JobQualifications.Add(qualification);
                await _context.SaveChangesAsync();
                qualificationID = qualification.qualID;
                // Add location
                var newJobPost = new JobPost
                {
                    title = request.title,
                    description = request.description,
                    recruiterID = recruiterID,
                    companyID = companyID,
                    locationID = locationID,
                    minimumSalary = request.minimumSalary,
                    postDate = request.postDate,
                    endDate = request.endDate,
                    type = request.type,
                    qualificationID = qualificationID,
                    benefits = request.benefits,
                    perks = request.perks,
                    bonus = request.bonus,
                    paymentType = request.paymentType,
                    link = request.link,

                };

                _context.JobPosts.Add(newJobPost);
                await _context.SaveChangesAsync();
                if (!string.IsNullOrEmpty(request.description))
                {
                    Console.WriteLine("Its going into the to the right spot");
                    StringBuilder sb = new StringBuilder(request.description);
                    sb.Append(" ");
                    sb.Append(request.qualification.Skills);
                    sb.Append(" ");
                    sb.Append(request.qualification.EducationLevel);
                    string combine = sb.ToString();
                    await _vector.AddToJobVector(combine, newJobPost.postID);
                }

                return Ok(new { message = "Job added successfully", jobId = newJobPost.postID });
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


        [HttpPost("filter")]
        public async Task<IActionResult> FilterJobs([FromBody] PostFilterRequest request)
        {
            IQueryable<JobPostDto> query;
            try
            {


                if (request.Latitude != null && request.Longitude != null && request.Distance != 0)
                {
                    var distance = request.Distance * 1609.34;
                    query = _context.JobPosts.FromSqlInterpolated(
                        $@"
                    SELECT jp.* FROM JobPosts jp
                    JOIN JobLocations l on jp.locationID = l.locationID
                    WHERE LOWER(l.name) REGEXP 'remote' OR ST_Distance_Sphere(Point({request.Longitude}, {request.Latitude}), Point(l.longitude, l.latitude)) <= {distance}"
                    ).Include(job => job.company)
                    .Include(job => job.location)
                    .Select(job => new JobPostDto
                    {
                        company = job.company.Name,
                        minimumSalary = job.minimumSalary,
                        postDate = job.postDate,
                        endDate = job.endDate,
                        title = job.title,
                        type = job.type,
                        location = job.location.name,
                        description = job.description ?? "",
                        benefits = job.benefits ?? "",
                        bonues = job.bonus ?? "",
                        perks = job.perks ?? "",
                        jobID = job.postID

                    });

                }

                else
                {
                    query = _context.JobPosts
                    .Include(job => job.company)
                    .Include(job => job.location)
                    .Select(job => new JobPostDto
                    {
                        company = job.company.Name,
                        minimumSalary = job.minimumSalary,
                        postDate = job.postDate,
                        endDate = job.endDate,
                        title = job.title,
                        type = job.type,
                        location = job.location.name,
                        description = job.description ?? "",
                        benefits = job.benefits ?? "",
                        bonues = job.bonus ?? "",
                        perks = job.perks ?? "",
                        jobID = job.postID,

                    });

                }

                if (request.Date != null)
                {
                    var filterDate = request.Date.Value.Date;
                    query = query.Where(job => job.endDate >= filterDate);
                }

                if (request.Type != null && request.Type.Any())
                {

                    query = query.Where(job => request.Type.Contains(job.type));
                }

                if (request.Company != null && request.Company.Any())
                {
                    query = query.Where(job => request.Company.Contains(job.company));
                }

                if (request.Min_Salary != 0)
                {
                    query = query.Where(job => job.minimumSalary >= request.Min_Salary);
                }


                var filteredJobs = await query.ToListAsync();
                Console.WriteLine($"Jobs in Filters: {filteredJobs}");

                if (filteredJobs == null || filteredJobs.Count == 0)
                {
                    return Ok(new List<Job>()); // Return an empty list with HTTP 200
                }

                return Ok(filteredJobs);
            }
            catch (Exception error)
            {
                return StatusCode(500, new { message = $"Internal server error: {error.Message}" });
            }
        }


        [HttpGet("company")]
        public async Task<IActionResult> GetCompany()
        {

            try
            {
                // var jobs = await _context.Jobs.ToListAsync();
                var jobs = await _context.JobPosts
                                .Include(job => job.company)
                                .Select(job => new
                                {
                                    company = job.company.Name,
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

        [HttpGet("JobPostSearch")]
        public async Task<ActionResult<IEnumerable<JobPost>>> JobPostSearch([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Search query cannot be empty");
            }
            // Retrieve job posts based on the query
            var jobs = await _context.JobPosts
                .Where(job => job.title.Contains(query))
                .Select(job => new
                {
                    job.title,
                    job.location,
                    job.description,
                    job.companyID // Include the CompanyID for later lookup
                })
                .ToListAsync();

            // Now retrieve the company names for the job posts
            var companyIds = jobs.Select(j => j.companyID).Distinct().ToList();
            var companies = await _context.Companies
                .Where(c => companyIds.Contains(c.companyID))
                .ToDictionaryAsync(c => c.companyID, c => c.Name); // Map to dictionary for quick access

            // Create DTOs and populate company names
            var jobDtos = jobs.Select(job => new JobPostDto
            {
                company = companies.ContainsKey(job.companyID) ? companies[job.companyID] : string.Empty, // Get the company name
                title = job.title,
                description = job.description != null ? job.description : string.Empty
            }).ToList();

            return Ok(jobDtos);
        }

    }



}

