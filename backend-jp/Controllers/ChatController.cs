using JobPreppersDemo.Services;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Stream;
using Stream.Models;
using StreamChat.Clients;

namespace JobPreppersDemo.Controllers {
    [Route("api/[controller]")]
    [ApiController]

     public class ChatController : ControllerBase
    {
        private readonly StreamService _streamService;
        private readonly ApplicationDbContext _context;
        private readonly StreamClientFactory _streamChatFactory;

        public ChatController(StreamService streamService, ApplicationDbContext context) {
            _streamService = streamService;
            _context = context;
            _streamChatFactory = streamService.ChatClientFactory;
        }

        [HttpGet("generateChatToken/{userID}")]
        public async Task<IActionResult> GenerateChatToken(string userID)
        {
            // api calls go here
            var userClient = _streamChatFactory.GetUserClient();
            var token = userClient.CreateToken(userID, DateTimeOffset.UtcNow.AddHours(1));
            string OkMsg = $"Created token {token} for user {userID}";
            return Ok(new { OkMsg });
        }

    }
}