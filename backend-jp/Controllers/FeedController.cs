using JobPreppersDemo.Services;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Stream;
using Stream.Models;

namespace JobPreppersDemo.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class FeedController : ControllerBase {
        private readonly StreamService _streamService;
        private readonly ApplicationDbContext _context;

        public FeedController(StreamService streamService, ApplicationDbContext context) {
            _streamService = streamService;
            _context = context;
        }


        [HttpGet("{userID}")]
        public async Task<IActionResult> GetFeed(string userID) {
            var jpUser = await _context.Users.FirstOrDefaultAsync(u => u.userID == int.Parse(userID));
            string jpUsername = jpUser.first_name + " " + jpUser.last_name;
            // api calls go here
            var client = _streamService.Client;
            
            var userFeed = client.Feed("user", userID);
            // add a test activity
            // var activity = new Activity(userID, "posted", "content");
            // await userFeed.AddActivityAsync(activity);
            var activities = await userFeed.GetActivitiesAsync();
            return Ok(new {activities});
        }

        [HttpGet("token/{userID}")]
        public async Task<IActionResult> GetStreamAuthToken(string userID) {
            var client = _streamService.Client;
            var token = client.CreateUserToken(userID);
            return Ok(new {token});
        }
    }
}