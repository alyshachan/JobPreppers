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

            return Ok(new { activities });
        }

        [HttpGet("getTimeline/{userID}")]
        public async Task<IActionResult> GetOrUpdateFeedTimeline(string userID)
        {
            var jpUser = await _context.Users.FirstOrDefaultAsync(u => u.userID == int.Parse(userID));
            // string jpUsername = jpUser.first_name + " " + jpUser.last_name;
            // api calls go here
            var client = _streamService.Client;

            // will dev note 2/21: when a friends list frontend is completed, add a controller that
            // will call .FollowFeed() on new friends
            var timelineFeed = client.Feed("timeline", userID);

            var activities = await timelineFeed.GetActivitiesAsync();
            // var userData = new Dictionary<string, object>
            // {
            //     {"name", jpUsername}
            // };

            return Ok(new { activities });
        }

        [HttpPost("timeline/followFriend/{userID}")]
        public async Task<IActionResult> AddFriendToTimeline(string userID, string friendID)
        {
            var jpUser = await _context.Users.FirstOrDefaultAsync(u => u.userID == int.Parse(userID));
            // api calls go here
            var client = _streamService.Client;
            var timelineFeed = client.Feed("timeline", userID);
            var friendTimelineFeed = client.Feed("timeline", friendID);

            await timelineFeed.FollowFeedAsync("user", friendID);
            await friendTimelineFeed.FollowFeedAsync("user", userID);



            string OkMsg = $"{userID} now follows friend {friendID} and vice versa";

            return Ok(new { OkMsg });
        }

        // [HttpGet("token/{userID}")]
        // public async Task<IActionResult> GetStreamAuthToken(string userID)
        // {
        //     var client = _streamService.Client;
        //     var token = client.CreateUserToken(userID);
        //     return Ok(new { token });
        // }
    }
}