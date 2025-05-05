using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using JobPreppersDemo.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpGet("getFeedToken/{userID}")]
        public async Task<IActionResult> GetStreamFeedAuthToken(string userID)
        {
            var client = _streamService.Client;
            var token = client.CreateUserToken(userID);
            return Ok(new { token });
        }

        [HttpPost("followGlobal/{userID}")]
        public async Task<IActionResult> FollowGlobalFeed(string userID)
        {
            var client = _streamService.Client;
            var userGlobalFeed = client.Feed("global", userID);
            var globalFeed = client.Feed("global", "global_feed");

            await globalFeed.AddActivityAsync(
                new Activity("global", "post", "global_post_1")
                {
                    Actor = "User:global",
                    Verb = "post",
                    Object = "post:1",
                    ForeignId = "post:1",
                    Time = DateTime.UtcNow,
                }
            );
            await userGlobalFeed.FollowFeedAsync("global", "global_feed");
            return Ok("Global feed followed");
        }

        [HttpGet("getTimeline/{userID}")]
        public async Task<IActionResult> GetOrUpdateFeedTimeline(string userID)
        {
            var jpUser = await _context.Users.FirstOrDefaultAsync(u =>
                u.userID == int.Parse(userID)
            );
            // string jpUsername = jpUser.first_name + " " + jpUser.last_name;
            // api calls go here
            var client = _streamService.Client;

            var timelineFeed = client.Feed("timeline", userID);

            var activities = await timelineFeed.GetActivitiesAsync();
            // var userData = new Dictionary<string, object>
            // {
            //     {"name", jpUsername}
            // };

            return Ok(new { activities });
        }

        // NOTE: deprecated, use AddFriendsToTimeline, too scared to delete for now
        [HttpPost("timeline/followFriend/{userID}")]
        public async Task<IActionResult> AddFriendToTimeline(string userID, string friendID)
        {
            var jpUser = await _context.Users.FirstOrDefaultAsync(u =>
                u.userID == int.Parse(userID)
            );
            // api calls go here
            var client = _streamService.Client;
            var timelineFeed = client.Feed("timeline", userID);
            var friendTimelineFeed = client.Feed("timeline", friendID);

            await timelineFeed.FollowFeedAsync("user", friendID);
            await friendTimelineFeed.FollowFeedAsync("user", userID);

            string OkMsg = $"{userID} now follows friend {friendID} and vice versa";

            return Ok(new { OkMsg });
        }

        [HttpPost("timeline/followFriendMany/{userID}")]
        public async Task<IActionResult> AddFriendsToTimeline(
            string userID,
            [FromBody] List<string> friendIDs
        )
        {
            var jpUser = await _context.Users.FirstOrDefaultAsync(u =>
                u.userID == int.Parse(userID)
            );
            // api calls go here
            var client = _streamService.Client;
            var userUserFeed = client.Feed("user", userID);
            var userTimelineFeed = client.Feed("timeline", userID);

            foreach (string friendID in friendIDs)
            {
                var friendTimelineFeed = client.Feed("timeline", friendID);
                await userTimelineFeed.FollowFeedAsync("user", friendID);
                await friendTimelineFeed.FollowFeedAsync("user", userID);
            }

            string joinedIDs = string.Join(",", friendIDs);
            string OkMsg = $"{userID} now follows users {joinedIDs} and vice versa";

            return Ok(new { OkMsg });
        }

        [HttpGet("getUserFeed/{userID}")]
        public async Task<IActionResult> GetUserFeed(string userID)
        {
            var jpUser = await _context.Users.FirstOrDefaultAsync(u =>
                u.userID == int.Parse(userID)
            );
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

        [HttpGet("getGlobalFeed/{userID}")]
        public async Task<IActionResult> GetGlobalFeed(string userID)
        {
            var jpUser = await _context.Users.FirstOrDefaultAsync(u =>
                u.userID == int.Parse(userID)
            );
            string jpUsername = jpUser.first_name + " " + jpUser.last_name;
            // api calls go here
            var client = _streamService.Client;

            var userFeed = client.Feed("global", userID);

            var activities = await userFeed.GetActivitiesAsync();

            // var userData = new Dictionary<string, object>
            // {
            //     {"name", jpUsername}
            // };

            return Ok(new { activities });
        }

        [HttpPost("timeline/LikePost/{likedUserID}/{activityID}")]
        public async Task<IActionResult> LikePost(string likedUserID, string activityID)
        {
            // var jpUser = await _context.Users.FirstOrDefaultAsync(u => u.userID == int.Parse(userID));
            // api calls go here
            var client = _streamService.Client;

            var activities = client.Feed("timeline", likedUserID).GetActivitiesAsync();

            var firstActivityID = activities.Result.Results[1].Id;
            var reactions = await client.Reactions.FilterAsync(
                ReactionFiltering.Default,
                ReactionPagination.By.ActivityId(firstActivityID)
            );

            // await client.Reactions.AddAsync(null, "like", firstActivityID, likedUserID);

            // string OkMsg = $"added a like";
            string OkMsg = $"testing";

            return Ok(new { firstActivityID, reactions });
        }

        [HttpGet("recommend/{userID}")]
        public async Task<IActionResult> GetRecommendedUsers(string userID)
        {
            int userId = int.Parse(userID);
            // var jpUser = await _context.Users.FirstOrDefaultAsync(u => u.userID == int.Parse(userID));
            // api calls go here
            var friends = await _context
                .Friends.Where(f => (f.userID == userId || f.friendID == userId))
                .Select(f => f.userID == userId ? f.friendID : f.userID)
                .ToListAsync();

            var recommendations = await _context
                .Users.Where(u => u.userID != userId && !friends.Contains(u.userID))
                .Select(u => new
                {
                    Id = u.userID,
                    Name = u.first_name + " " + u.last_name,
                    Title = u.title,
                    Username = u.username,
                    Email = u.email,
                    ProfilePic = u.profile_pic,
                })
                .Take(5)
                .ToListAsync();

            return Ok(new { recommendations });
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
