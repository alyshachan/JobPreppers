using JobPreppersDemo.Services;
using Microsoft.AspNetCore.Mvc;
using Stream;
using Stream.Models;

namespace JobPreppersDemo.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class VideoCallController : ControllerBase {
        private readonly StreamService _streamService;

        public VideoCallController(StreamService streamService) {
            _streamService = streamService;
        }

        [HttpGet("token/{userID}")]
        public async Task<IActionResult> GetStreamAuthToken(string userID) {
            var client = _streamService.Client;
            var token = client.CreateUserToken(userID);
            return Ok(new {token});
        }
    }
}