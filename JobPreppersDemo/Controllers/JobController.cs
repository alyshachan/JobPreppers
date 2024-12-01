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


        // // View Rendering for Index
        // [HttpGet("/job")]
        // public IActionResult Index()
        // {
        //     // Example data you want to log
        //     var jobs = _context.Jobs.ToList();

        //     ViewData["Jobs"] = System.Text.Json.JsonSerializer.Serialize(jobs);
        //     return View();
        // }
    }
}
