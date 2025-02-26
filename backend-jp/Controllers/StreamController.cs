using JobPreppersDemo.Services;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Stream;
using Stream.Models;
using StreamChat;
using StreamChat.Clients;
using System.Web;
using System.Text.RegularExpressions;


namespace JobPreppersDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StreamController : ControllerBase
    {
        private readonly StreamService _streamService;
        private readonly ApplicationDbContext _context;

        private readonly StreamClientFactory _clientFactory;

        public StreamController(StreamService streamService, ApplicationDbContext context)
        {
            _streamService = streamService;
            _context = context;
            _clientFactory = new StreamClientFactory();
        }

        [HttpGet("feedToken/{userID}")]
        public async Task<IActionResult> GetStreamFeedAuthToken(string userID)
        {
            var client = _streamService.Client;
            var token = client.CreateUserToken(userID);
            return Ok(new { token });
        }

        [HttpGet("chatToken/{userID}")]
        public async Task<IActionResult> GetStreamChatAuthToken(string userID)
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

        [HttpPost("getOrCreate/{userID}")]
        public async Task<IActionResult> GetOrCreateStreamUser(string userID)
        {
            // api calls go here
            var client = _streamService.Client;
            try
            {
                var jpUser = await _context.Users.FirstOrDefaultAsync(u => u.userID == int.Parse(userID));
                try
                {
                    var streamUser = await client.Users.GetAsync(userID);
                    Console.WriteLine("User retrieved successfully");
                    return Ok(new { streamUser.Id, streamUser.Data });
                }
                catch (StreamException e) when (e.Message.Contains("User does not existl"))
                {
                    string jpUsername = jpUser.first_name + " " + jpUser.last_name;
                    Dictionary<string, object> userData = new Dictionary<string, object>
                        {
                        {"name", $"{jpUsername}" },
                        };
                    await client.Users.AddAsync(userID, userData);
                    string OkMsg = $"Stream user {userID} did not exist, created new one";
                    var newStreamUser = await client.Users.GetAsync(userID);
                    return Ok(new { OkMsg, newStreamUser.Id, newStreamUser.Data });
                }
            }
            catch
            {
                return NotFound();
            }

        }

        [HttpPost("update/{userID}")]
        public async Task<IActionResult> UpdateStreamUser(string userID)
        {
            // api calls go here
            var client = _streamService.Client;
            Console.WriteLine("Client good");
            var jpUser = await _context.Users.FirstOrDefaultAsync(u => u.userID == int.Parse(userID));


            if (jpUser != null)
            {
                string jpUsername = jpUser.first_name + " " + jpUser.last_name;
                var userData = new Dictionary<string, object> {
                    {"name", $"{jpUsername}"}
                };

                var streamUser = await client.Users.GetAsync(userID);
                await client.Users.UpdateAsync(streamUser.Id, userData);

                return Ok(new { streamUser.Data });
            }

            return NotFound();
        }
    }
}