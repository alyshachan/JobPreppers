using JobPreppersDemo.Services;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Stream;
using Stream.Models;
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

            // string apiKey = Environment.GetEnvironmentVariable("STREAM_API_KEY");
            // string apiSecret = Environment.GetEnvironmentVariable("STREAM_API_SECRET");

            // string fullUri = $"{Request.Scheme}://{Request.Host}{Request.Path}";
            // var query = HttpUtility.UrlDecode(fullUri);
            // string queryString = Regex.Split(query, "(\\?.*)")[1];
            // // Console.WriteLine(fullUri);

            // var queryParams = HttpUtility.ParseQueryString(queryString);
            // Console.WriteLine("help me");
            // Console.WriteLine(queryParams["name"]);
            // Console.WriteLine(queryParams.AllKeys[0]);
            // Console.WriteLine(apiKey);
            // Console.WriteLine(apiSecret);



            var client = _streamService.Client;
            // StreamClient client = new StreamClient(apiKey, apiSecret); // for testing
            // Console.WriteLine("Client good");


            // Dictionary<string, object> userData = new Dictionary<string, object>();
            var userData = new Dictionary<string, object> {
                {"name", "Son Goku"}
            };


            // foreach (var key in queryParams.AllKeys) {
            //     userData.Add(key, queryParams[key]);
            // }
            
            var streamUser = await client.Users.GetAsync(userID);
            await client.Users.UpdateAsync(streamUser.Id, userData);

            return Ok(new {streamUser.Data});
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