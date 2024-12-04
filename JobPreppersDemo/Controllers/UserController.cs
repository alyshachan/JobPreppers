using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using System.Diagnostics;


namespace JobPreppersProto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            // Fetch all users from the database
            var users = await _context.Users.ToListAsync();

            if (users == null || users.Count == 0)
            {
                return NotFound("No users found.");
            }

            return Ok(users);
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
        new Claim("userID", user.userID.ToString()), // userid
        new Claim("username", user.username), // username
        new Claim("email", user.email), // email
        new Claim(JwtRegisteredClaimNames.Aud, "yourdomain.com"),
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("thisisuperlongbecauseitneedstobe256bits"));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1), //token expire time
                SigningCredentials = credentials,
                Issuer = "yourdomain.com",
                Audience = "yourdomain.com",
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token); // return jwt token
        }

        [HttpPost("login")]
        public async Task<IActionResult> CheckUserExists([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Email and Password are required.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == request.Email && u.password == request.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var token = GenerateJwtToken(user);
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("authToken", token, cookieOptions);
            return Ok(new { message = "Welcome to JobPreppers, " + user.username, user = user, token = token });
        }

        [HttpPost("logout")]
        public IActionResult Logout() {
            Response.Cookies.Delete("authToken");
            return Ok(new { message = "Logged out successfully." });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMe()
        {
            var userID = User.Claims.FirstOrDefault(c => c.Type == "userID")?.Value;
            var username = User.Claims.FirstOrDefault(c => c.Type == "username")?.Value;

            if (string.IsNullOrEmpty(userID))
            {
                return Unauthorized(new { message = "Invalid token." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.userID.ToString() == userID);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // Console.WriteLine($"Just performed an authentication check for user {userID}, {username}");
            return Ok(new { 
                userID = user.userID, 
                username = user.username,
                first_name = user.first_name,
                last_name = user.last_name, 
                email = user.email });
        }


        [HttpGet("GetUser/{id}")]
        public async Task<IActionResult> GetUserInfo(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.userID == id);
            if (user == null)
            {
                return NotFound(new { message = "Invalid User" });
            }
            return Ok(new
            {
                message = "Found user",
                user = user
            });
        }

        // Define the request model
        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

    }
}
