using JobPreppersDemo.Services;
using Microsoft.AspNetCore.Mvc;
using Stream;
using Stream.Models;

namespace JobPreppersDemo.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class FeedController : ControllerBase {
        private readonly StreamService _streamService;

        public FeedController(StreamService streamService) {
            _streamService = streamService;
        }


        [HttpGet("{userID}")]
        public async Task<IActionResult> GetFeed(string userID) {
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