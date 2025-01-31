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
                Expires = DateTime.UtcNow.AddHours(100), //token expire time
                SigningCredentials = credentials,
                Issuer = "yourdomain.com",
                Audience = "yourdomain.com",
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            Console.WriteLine($"New Token generated: {token}");
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
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(10)
            };

            Response.Cookies.Append("authToken", token, cookieOptions);
            return Ok(new { message = "Welcome to JobPreppers, " + user.username, user = user, token = token });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("authToken");
            return Ok(new { message = "Logged out successfully." });
        }

        [HttpGet("auth")]
        [Authorize]
        public async Task<IActionResult> Authenticate()
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

            return Ok(new
            {
                userID = user.userID,
                username = user.username,
                first_name = user.first_name,
                last_name = user.last_name,
                email = user.email,
                profile_pic = user.profile_pic
            });
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

        [HttpPost("signup")]
        public async Task<IActionResult> AddNewUser([FromBody] SignupRequest request)
        {
            if (request == null ||
            string.IsNullOrEmpty(request.FirstName) ||
            string.IsNullOrEmpty(request.LastName) ||
            string.IsNullOrEmpty(request.Username) ||
            string.IsNullOrEmpty(request.Email) ||
            string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("All fields are required.");
            }

            try
            {
                //check if user already exits
                var user = await _context.Users.FirstOrDefaultAsync(s => s.username == request.Username);
                //if not create user and add to user table
                if (user == null)
                {
                    user = new User
                    {
                        first_name = request.FirstName,
                        last_name = request.LastName,
                        username = request.Username,
                        email = request.Email,
                        password = request.Password
                    };
                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    return BadRequest("User already exists");

                }
                return Ok(new
                {
                    Message = "Successfully added user.",
                    User = user
                });

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("AddUserDetails")]
        public async Task<IActionResult> AddUserDetails([FromBody] DetailsRequest request)
        {
            if (request == null ||
            request.userID == 0)
            {
                return BadRequest("UserID is invalid.");
            }

            try
            {
                //check if user already exits
                var user = await _context.Users.FirstOrDefaultAsync(s => s.userID == request.userID);
                //if not create user and add to user table
                if (user == null)
                {
                    return NotFound("User not found");
                }
                else
                {
                    user.title = request.title;
                    user.location = request.location;
                    await _context.SaveChangesAsync();
                }
                return Ok(new
                {
                    Message = "User details updated",
                    User = user
                });

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        // Define the request model
        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class SignupRequest
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class DetailsRequest{
            public int userID {get; set;}
            public string title {get; set;}
            public string location {get; set;}
        }

    }
}
