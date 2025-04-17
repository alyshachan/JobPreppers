using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using JobPreppersDemo.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZstdSharp.Unsafe;
using Newtonsoft.Json;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;


namespace JobPreppersDemo.Controllers
{
    public class JobScoreDto
    {
        public int Id { get; set; }
        public int Score { get; set; }
    }
    [Route("api/[controller]")]
    [ApiController]
    public class JobPostController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly EmbeddedUser _embeddedUser;


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

            public int userID { get; set; }

            public string Search_Query { get; set; } = string.Empty;

            public int page { get; set; }
            public int Number_Per_Page { get; set; }



        }

        public class DeleteJobRequest
        {
            public int jobID { get; set; }
            public int userID { get; set; }
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
            public int score { get; set; }

            public string? profilePic { get; set; }
            public string? link { get; set; }


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



        public class UpdateJobDto
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

            public string? link { get; set; }

            public int locationID { get; set; }

            public int userID { get; set; }

            public int jobID { get; set; }

            public virtual JobLocation location { get; set; } = null!;

            public virtual JobQualification qualification { get; set; } = null!;


        }


        public JobPostController(ApplicationDbContext context, JobsVectorDB vector)
        {
            _context = context;
            _vector = vector;
            _embeddedUser = new EmbeddedUser(context, vector);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllJobs([FromQuery] int userID)
        {

            try
            {

                Dictionary<int, int>? jobSearch = new Dictionary<int, int>();
                if (userID != 0)
                {
                    var user = _context.UserEmbeddings.FirstOrDefault(ub => ub.userID == userID);
                    if (user == null)
                    {
                        // Nothing in cache need to 
                        await _embeddedUser.AddEmbeddedUser(userID);
                        user = _context.UserEmbeddings.FirstOrDefault(ub => ub.userID == userID);
                        Console.WriteLine("User was null but it should be added");
                    }

                    float[]? embedded = JsonConvert.DeserializeObject<float[]>(user!.embedding);
                    Console.WriteLine($"Embedded: {embedded}");
                    if (embedded != null)
                    {
                        var response = await _vector.sematicSearch(embedded);
                        jobSearch = JsonConvert.DeserializeObject<List<JobScoreDto>>(response)!.ToDictionary(j => j.Id, j => j.Score);
                    }


                    // Maybe call addEmbedded
                    if (jobSearch.IsNullOrEmpty())
                    {
                        Console.WriteLine("Was not found");
                        return StatusCode(500, new { message = $"Internal server error: user not in the embedded table" });
                    }
                    var jobPostIds = jobSearch.Keys.ToList();

                    // var jobs = await _context.Jobs.ToListAsync();
                    var jobs = await _context.JobPosts
                                    .Include(job => job.qualification)
                                    .Include(job => job.company)
                                    .Include(job => job.location)
                                    .Where(job => !_context.DeleteJobs
                                    .Any(deleteJob => deleteJob.jobID == job.postID && deleteJob.userID == userID)).Where(job => jobPostIds.Contains(job.postID))
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
                                        score = jobSearch[job.postID],
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
                return StatusCode(500, new { message = $"Internal server error: UserID not found" });

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
                    StringBuilder sb = new StringBuilder(request.qualification.Skills);
                    sb.Append(" ");
                    var description = JsonDocument.Parse(request.description);
                    sb.Append(description);
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

        [HttpPut("update")]
        public async Task<ActionResult> UpdateJob([FromBody] UpdateJobDto request)
        {
            try
            {
                var job = _context.JobPosts.Where(job => job.postID == request.jobID).FirstOrDefault();
                var location = _context.JobLocations.Where(l => l.name == request.location.name).FirstOrDefault();


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
                int locationID = location.locationID;
                // If job doesn't exist -- return bad request-- shouldn't be possible otherwise
                if (job == null)
                {
                    return BadRequest("No job to update");
                }
                // if does exist then update
                var qualification = _context.JobQualifications.Where(jq => jq.qualID == job.qualificationID).FirstOrDefault();
                if (qualification != null)
                {
                    qualification.Skills = request.qualification.Skills;
                    qualification.MinimumExperience = request.qualification.MinimumExperience;
                    qualification.EducationLevel = request.qualification.EducationLevel;
                    qualification.MaximumExperience = request.qualification.MaximumExperience;
                    _context.JobQualifications.Update(qualification);
                }
                // Shouldn't need to change recruiter id or company id
                job.title = request.title;
                job.description = request.description;
                job.minimumSalary = request.minimumSalary;
                job.postDate = request.postDate;
                job.endDate = request.endDate;
                job.type = request.type;
                job.benefits = request.benefits;
                job.bonus = request.bonus;
                job.perks = request.perks;
                job.paymentType = request.paymentType;
                job.link = request.link;
                job.locationID = locationID;
                _context.JobPosts.Update(job);
                await _context.SaveChangesAsync();

                // Could sent something that states the job description changed or not
                if (!string.IsNullOrEmpty(request.description))
                {
                    StringBuilder sb = new StringBuilder(request.description);
                    sb.Append(" ");
                    sb.Append(request.qualification.Skills);
                    sb.Append(" ");
                    sb.Append(request.qualification.EducationLevel);
                    string combine = sb.ToString();
                    await _vector.AddToJobVector(combine, job.postID);
                }

                return Ok("Succesful Updating Job");

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


                // Section for user maybe helper method: 
                // Check Cache - should be there  --- maybe call other: 
                Dictionary<int, int>? jobSearch = new Dictionary<int, int>();
                var user = _context.UserEmbeddings.FirstOrDefault(ub => ub.userID == request.userID);


                if (user == null)
                {
                    // Nothing in cache need to add first 
                    await _embeddedUser.AddEmbeddedUser(request.userID);
                    user = _context.UserEmbeddings.FirstOrDefault(ub => ub.userID == request.userID);
                    Console.WriteLine("User was null but it should be added");
                }
                float[]? embedded = JsonConvert.DeserializeObject<float[]>(user!.embedding);
                Console.WriteLine($"Embedded: {embedded}");
                if (embedded != null)
                {
                    var response = await _vector.sematicSearch(embedded);
                    jobSearch = JsonConvert.DeserializeObject<List<JobScoreDto>>(response)!.ToDictionary(j => j.Id, j => j.Score);

                }
                // Maybe call addEmbedded
                if (jobSearch.IsNullOrEmpty())
                {
                    Console.WriteLine("Was not found");
                    return StatusCode(500, new { message = $"Internal server error: user not in the embedded table" });
                }
                var jobPostIds = jobSearch.Keys.ToList();
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
                    .Where(job => !_context.DeleteJobs
                    .Any(deleteJob => deleteJob.jobID == job.postID && deleteJob.userID == request.userID))
                    .Where(job => jobPostIds.Contains(job.postID))
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
                        link = job.link,
                        score = jobSearch[job.postID],
                        profilePic = job!.company!.user!.profile_pic != null
    ? "data:image/png;base64," + Convert.ToBase64String(job.company.user.profile_pic)
    : null

                    });

                }

                else
                {
                    query = _context.JobPosts
                    .Include(job => job.company)
                    .Include(job => job.location)
                    .Where(job => !_context.DeleteJobs
                    .Any(deleteJob => deleteJob.jobID == job.postID && deleteJob.userID == request.userID))
                    .Where(job => jobPostIds.Contains(job.postID))
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
                        link = job.link,
                        score = jobSearch[job.postID],
                        profilePic = job!.company!.user!.profile_pic != null
    ? "data:image/png;base64," + Convert.ToBase64String(job.company.user.profile_pic)
    : null



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

                if (!request.Search_Query.IsNullOrEmpty())
                {

                    query = query.Where(job => job.title.Contains(request.Search_Query));
                }

                if (request.Company != null && request.Company.Any())
                {
                    query = query.Where(job => request.Company.Contains(job.company));
                }

                if (request.Min_Salary != 0)
                {
                    query = query.Where(job => job.minimumSalary >= request.Min_Salary);
                }

                var totalCount = query.Count();
                var filteredJobs = await query.Skip((request.page - 1) * request.Number_Per_Page).Take(request.Number_Per_Page).ToListAsync();
                Console.WriteLine($"Jobs in Filters: {filteredJobs}");

                if (filteredJobs == null || filteredJobs.Count == 0)
                {
                    return Ok(new { newJobs = new List<Job>(), totalCount }); // Return an empty list with HTTP 200
                }

                return Ok(new { newJobs = filteredJobs, totalCount });
            }
            catch (Exception error)
            {
                return StatusCode(500, new { message = $"Internal server error: {error.Message}" });
            }
        }



        [HttpPost("filterCompanyView")]
        public async Task<IActionResult> FilterCompanyJobs([FromBody] PostFilterRequest request)
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
                    .ThenInclude(company => company.user)
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
                        link = job.link,
                        profilePic = job!.company!.user!.profile_pic != null
    ? "data:image/png;base64," + Convert.ToBase64String(job.company.user.profile_pic)
    : null


                    });

                }

                else
                {
                    query = _context.JobPosts
                    .Include(job => job.company)
                    .ThenInclude(company => company.user)
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
                        link = job.link,
                        profilePic = job!.company!.user!.profile_pic != null
    ? "data:image/png;base64," + Convert.ToBase64String(job.company.user.profile_pic)
    : null

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

                if (request.Type != null && request.Type.Any())
                {

                    query = query.Where(job => request.Type.Contains(job.type));
                }

                if (!request.Search_Query.IsNullOrEmpty())
                {

                    query = query.Where(job => job.title.Contains(request.Search_Query));
                }


                var totalCount = query.Count();
                var filteredJobs = await query.Skip((request.page - 1) * request.Number_Per_Page).Take(request.Number_Per_Page).ToListAsync();
                Console.WriteLine($"Jobs in Filters: {filteredJobs}");

                if (filteredJobs == null || filteredJobs.Count == 0)
                {
                    return Ok(new { newJobs = new List<Job>(), totalCount }); // Return an empty list with HTTP 200
                }

                return Ok(new { newJobs = filteredJobs, totalCount });
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


        [HttpPost("delete")]
        public async Task<IActionResult> deleteJobPost([FromBody] DeleteJobRequest request)
        {

            try
            {
                // Add to the Delete Table from the database 
                var selectedJob = await _context.JobPosts.Where(job => job.postID == request.jobID).FirstOrDefaultAsync();
                if (selectedJob != null)
                {
                    var newDeleteJob = new DeleteJob
                    {
                        jobID = selectedJob.postID,
                        userID = request.userID

                    };
                    await _context.DeleteJobs.AddAsync(newDeleteJob);
                    await _context.SaveChangesAsync();

                }
                else
                {
                    return StatusCode(500, new { message = $"Couldn't find the job post" });

                }

                return Ok(new { message = "Job deleted for user successfully", jobId = request.jobID });
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

