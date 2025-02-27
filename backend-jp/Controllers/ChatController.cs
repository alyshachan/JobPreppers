using JobPreppersDemo.Services;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Stream;
using Stream.Models;
using StreamChat.Clients;
using StreamChat.Models;
using System.Text.Json.Nodes;

namespace JobPreppersDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class ChatController : ControllerBase
    {
        private readonly StreamService _streamService;
        private readonly ApplicationDbContext _context;
        private readonly StreamClientFactory _streamChatFactory;

        public class DMChannelRequest
        {
            public required string UserID1 { get; set; }
            public required string UserID2 { get; set; }
        }

        public ChatController(StreamService streamService, ApplicationDbContext context)
        {
            _streamService = streamService;
            _context = context;
            _streamChatFactory = streamService.ChatClientFactory;
        }

        [HttpGet("getChatToken/{userID}")]
        public async Task<IActionResult> GetStreamChatToken(string userID)
        {
            // api calls go here
            var userClient = _streamChatFactory.GetUserClient();
            var token = userClient.CreateToken(userID, DateTimeOffset.UtcNow.AddHours(1));
            string OkMsg = $"Created token {token} for user {userID}";
            return Ok(new { OkMsg, token });
        }

        [HttpPost("getOrCreateDMChannel")]
        public async Task<IActionResult> GetOrCreateDMChannel([FromBody] DMChannelRequest request)
        {
            try
            {
                var channel = await _streamService.CreateDMChannelAsync(request.UserID1, request.UserID2);
                Console.WriteLine(channel);
                // string OkMsg = $"Created channel {channel.Channel.Cid} successfully with users {request.UserID1} and {request.UserID2}";
                string OkMsg = "testing";

                return Ok(new { OkMsg, channel.Members, channel.Channel.Cid });
            }
            catch (Exception error)
            {
                Console.WriteLine(error);
                var errorResponse = new
                {
                    message = "An error occurred while creating the DM channel.",
                    details = error.Message
                };
                return NotFound(new { errorResponse });
            }
        }

        [HttpGet("getAllChannels")]
        public async Task<IActionResult> getChannels()
        {

            var channels = await _streamService.ChatChannelClient.QueryChannelsAsync(QueryChannelsOptions.Default
            );
            // string OkMsg = $"Deleted channel ";
            return Ok(channels);
        }

        [HttpPost("deleteChannels/{cID}")]
        public async Task<IActionResult> DeleteChannel(string cID)
        {
            await _streamService.ChatChannelClient.DeleteAsync("messaging", cID);
            string OkMsg = $"Deleted channel {cID}";
            return Ok(OkMsg);
        }
    }
}