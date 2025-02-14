using JobPreppersDemo.Services;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Stream;
using Stream.Models;

namespace JobPreppersDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedController : ControllerBase
    {
        private readonly StreamService _streamService;
        private readonly ApplicationDbContext _context;

        public FeedController(StreamService streamService, ApplicationDbContext context)
        {
            _streamService = streamService;
            _context = context;
        }


        [HttpGet("{userID}")]
        public async Task<IActionResult> GetFeed(string userID)
        {
            var jpUser = await _context.Users.FirstOrDefaultAsync(u => u.userID == int.Parse(userID));
            string jpUsername = jpUser.first_name + " " + jpUser.last_name;
            // api calls go here
            var client = _streamService.Client;

            var userFeed = client.Feed("user", userID);

            var activities = await userFeed.GetActivitiesAsync();
            // var userData = new Dictionary<string, object>
            // {
            //     {"name", jpUsername}
            // };

            var retrievedUser = await client.Users.GetAsync(userID);
            // Console.WriteLine("Retrieved user:");
            // Console.WriteLine(retrievedUser.Id);

            // Console.WriteLine("Updating user's name");
            // client.Users.UpdateAsync(retrievedUser.Id, userData);

            retrievedUser = await client.Users.GetAsync(userID);
            Console.WriteLine("new user:");
            Console.WriteLine(retrievedUser);
            Console.WriteLine(retrievedUser.Id);
            // Console.WriteLine(retrievedUser.userData);

            return Ok(new { activities });
        }

        [HttpGet("token/{userID}")]
        public async Task<IActionResult> GetStreamAuthToken(string userID)
        {
            var client = _streamService.Client;
            var token = client.CreateUserToken(userID);
            return Ok(new { token });
        }
    }
}