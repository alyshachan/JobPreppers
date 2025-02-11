using JobPreppersDemo.Services;
using Microsoft.AspNetCore.Mvc;

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
            var userFeed = client.GetFeed("user", userID);
            // add a test activity
            await userFeed.AddActivityAsync(new Activity{
                Actor = userID,
                Verb = "posted",
                Object = "content",
                Time = DateTime.UtcNow
            })
            var activities = await userFeed.GetActivitiesAsync();
            return Ok(new {activities});
        }
    }
}