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

        public JobController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/jobs
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

        [HttpPost("filter")]
        public async Task<IActionResult> FilterJobs([FromBody] FilterRequest request)
        {

            var query = _context.Jobs.AsQueryable();

            Console.WriteLine($"Received date: {request.Date}");

            if (request.Date != null)
            {
                var filterDate = request.Date.Value.Date;
                query = query.Where(job => job.fill_by_date >= filterDate);
            }

            if (request.Type != null && request.Type.Any())
            {

                query = query.Where(job => request.Type.Contains(job.type));
            }

            if (request.Company != null && request.Company.Any())
            {
                query = query.Where(job => request.Company.Contains(job.company));
            }



            var filteredJobs = await query.ToListAsync();


            if (filteredJobs == null || filteredJobs.Count == 0)
            {
                return Ok(new List<Job>()); // Return an empty list with HTTP 200
            }


            return Ok(filteredJobs);
        }
    }



}

