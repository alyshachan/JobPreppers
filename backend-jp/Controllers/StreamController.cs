using JobPreppersDemo.Services;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Stream;
using Stream.Models;
using System.Web;


namespace JobPreppersDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StreamController : ControllerBase
    {
        private readonly StreamService _streamService;
        private readonly ApplicationDbContext _context;

        public StreamController(StreamService streamService, ApplicationDbContext context)
        {
            _streamService = streamService;
            _context = context;
        }


        [HttpGet("get/{userID}")]
        public async Task<IActionResult> GetStreamUser(string userID)
        {
            // api calls go here
            var client = _streamService.Client;
            var streamUser = await client.Users.GetAsync(userID);
            var data = streamUser.Data;

            return Ok(new { streamUser.Id, streamUser.Data });
        }

        [HttpPost("update/{userID}")]
        public async Task<IActionResult> UpdateStreamUser(string userID)
        {
            // api calls go here
            Console.WriteLine("i hate rest APIS");
            // this stupid method is haunting me, it seems impossible to parse out some stupid kv data
            // out of the uri. figure out tomorrow (kms) - will
            
            // string fullUri = $"{Request.Scheme}://{Request.Host}{Request.Path}";
            // var query = HttpUtility.UrlDecode(fullUri);
            // Console.WriteLine(query);
            // Console.WriteLine(fullUri);

            // var queryParams = HttpUtility.ParseQueryString(query);
            // Console.WriteLine("help me");
            // Console.WriteLine(queryParams);

            var client = _streamService.Client;



            // var streamUser = await client.Users.GetAsync(userID);

            // var userData = new Dictionary<string, object>
            // {
            //     {"name", "Poopy shithead"}
            // };
            // await client.Users.UpdateAsync(streamUser.Id, userData);

            return Ok(new { client });
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