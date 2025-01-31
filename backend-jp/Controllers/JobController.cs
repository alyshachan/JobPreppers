using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobPreppersDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobController : Controller
    {
        private readonly ApplicationDbContext _context;
        public class FilterRequest
        {
            public DateTime? Date { get; set; }
            public List<string>? Type { get; set; }

            public List<string>? Company { get; set; }

            public int Min_Salary { get; set; }

            public double? Longitude { get; set; }

            public double? Latitude { get; set; }

            public int Distance { get; set; }


        }

        // public class PostRequest
        // {

        // }


        public JobController(ApplicationDbContext context)
        {
            _context = context;
        }

        // // GET: api/jobs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Job>>> GetAllJobs()
        {
            var jobs = await _context.Jobs.ToListAsync();

            if (jobs == null || jobs.Count == 0)
            {
                return NotFound("No jobs found.");
            }
            return Ok(jobs);
        }

        public class simpleRequest
        {
            public string title { get; set; } = null!;

            public string? description { get; set; }

            public string company { get; set; } = null!;
            public string type { get; set; } = null!;

        }
        // // GET: api/jobs
        [HttpPost("post")]
        public async Task<ActionResult> PostJob([FromBody] Job request)
        {

            try
            {
                _context.Jobs.Add(request);
                await _context.SaveChangesAsync();
                return Ok("Good"); // Assuming the Job model has an Id property

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");

            }

        }


        [HttpPost("filter")]
        public async Task<IActionResult> FilterJobs([FromBody] FilterRequest request)
        {

            var query = _context.Jobs.AsQueryable();

            Console.WriteLine($"Received date: {request.Date}");


            if (request.Latitude != null && request.Longitude != null && request.Distance != 0)
            {
                var distance = request.Distance * 1609.34;
                query = _context.Jobs.FromSqlInterpolated(
                    $@"Select * From Jobs where ST_Distance_Sphere(Point({request.Longitude},{request.Latitude}),
                    Point(longitude, latitude))
                    < {distance}
                    "
                );

            }




            // if (request.Date != null)
            // {
            //     var filterDate = request.Date.Value.Date;
            //     query = query.Where(job => job.fill_by_date >= filterDate);
            // }

            if (request.Type != null && request.Type.Any())
            {

                query = query.Where(job => request.Type.Contains(job.type));
            }

            if (request.Company != null && request.Company.Any())
            {
                query = query.Where(job => request.Company.Contains(job.company));
            }

            // if (request.minimumSalary != 0)
            // {
            //     query = query.Where(job => job.minimumSalary >= request.minimumSalary);
            // }


            var filteredJobs = await query.ToListAsync();


            if (filteredJobs == null || filteredJobs.Count == 0)
            {
                return Ok(new List<Job>()); // Return an empty list with HTTP 200
            }



            return Ok(filteredJobs);
        }

        // [HttpPost("post")]
        // public async Task<IActionResult> PostJob([FromBody] FilterRequest request)
        // {
        //     var query = _context.Jobs.AsQueryable();
        //     return Ok();
        // }


    }



}

