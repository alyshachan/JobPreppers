using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using JobPreppersDemo.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stream;
using Stream.Models;
using StreamChat;
using StreamChat.Clients;

namespace JobPreppersDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly StreamService _streamService;

        public FriendController(StreamService streamService, ApplicationDbContext context)
        {
            _streamService = streamService;
            _context = context;
        }

        [HttpGet("PendingRequests/{userId}")]
        public async Task<IActionResult> GetPendingFriendRequests(int userId)
        {
            var pendingRequests = await _context.Friends
                .Where(f => f.friendID == userId && f.status == FriendStatus.Pending)
                .Join(_context.Users,
                      f => f.userID,
                      user => user.userID,
                      (f, user) => new
                      {
                          Id = user.userID,
                          Username = user.username,
                          Name = user.first_name + " " + user.last_name,
                          Email = user.email,
                          ProfilePicture = user.profile_pic,
                          SentAt = f.created_at
                      })
                .ToListAsync();

            if (!pendingRequests.Any())
            {
                return Ok("No pending friend requests.");
            }

            return Ok(pendingRequests);
        }

        [HttpGet("GetFriends/{userId}")]
        public async Task<IActionResult> GetFriends(int userId)
        {
            var friends = await _context.Friends
       .Where(f => (f.userID == userId || f.friendID == userId) && f.status == FriendStatus.Accepted)
       .Select(f => f.userID == userId ? f.friendID : f.userID)
       .Join(_context.Users,
             friendId => friendId,
             user => user.userID,
             (friendId, user) => new
             {
                 Id = user.userID,
                 Username = user.username,
                 Name = user.first_name + " " + user.last_name,
                 Email = user.email,
                 ProfilePicture = user.profile_pic,
                 Title = user.title
             })
       .ToListAsync();

            if (!friends.Any())
            {
                return Ok("No friends found.");
            }

            return Ok(friends);
        }

        [HttpPost("FriendRequest")]
        public async Task<IActionResult> SendFriendRequest([FromBody] FriendRequestDto request)
        {
            if (request.UserId == request.FriendId)
                if (request.UserId == request.FriendId)
                {
                    return BadRequest("Invalid Friend Request. Cannot request yourself");
                }

            var existingrequst = await _context.Friends.FirstOrDefaultAsync(f =>
                (f.userID == request.UserId && f.friendID == request.FriendId)
                || (f.userID == request.FriendId && f.friendID == request.UserId)
            );

            if (existingrequst != null)
                if (existingrequst != null)
                {
                    return BadRequest(
                        "Invalid Friend Request. Friend request already sent or are already friends"
                    );
                }
            var newRequest = new Friend
            {
                userID = request.UserId,
                friendID = request.FriendId,
                status = FriendStatus.Pending,
                created_at = DateTime.UtcNow,
            };
            _context.Friends.Add(newRequest);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Friend request sent successfully." });
        }

        [HttpPost("AcceptFriendRequest")]
        public async Task<IActionResult> AcceptFriendRequest([FromBody] FriendRequestDto request)
        {
            var friendRequest = await _context.Friends.FirstOrDefaultAsync(f =>
                f.userID == request.FriendId
                && f.friendID == request.UserId
                && f.status == "pending"
            );

            if (friendRequest == null)
            {
                return NotFound("Friend request not found or already accepted.");
            }

            // Update status to "accepted"
            friendRequest.status = FriendStatus.Accepted;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Friend request accepted successfully." });
        }

        [HttpPost("DenyFriendRequest")]
        public async Task<IActionResult> DenyFriendRequest([FromBody] FriendRequestDto request)
        {
            var friendRequest = await _context.Friends.FirstOrDefaultAsync(f =>
                f.userID == request.FriendId
                && f.friendID == request.UserId
                && f.status == "pending"
            );

            if (friendRequest == null)
            {
                return NotFound("Friend request not found or already accepted.");
            }

            // Update status to "accepted"
            _context.Friends.Remove(friendRequest);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Friend request rejected." });
        }
        [HttpGet("GetFriendStatus")]
        public async Task<IActionResult> GetFriendStatus([FromQuery] int userId, [FromQuery] int friendId)
        {
            if (userId == friendId)
                return Ok("This is you");

            var status = await _context.Friends.FirstOrDefaultAsync(f =>
                (f.userID == userId && f.friendID == friendId) ||
                (f.userID == friendId && f.friendID == userId));

            if (status == null) return Ok("None");

            if (status.status == FriendStatus.Accepted) return Ok("Friends");
            if (status.status == FriendStatus.Pending) return Ok("Pending");

            return Ok("None");
        }
        // syncs getstream friends and jp friends
        [HttpPost("SyncFriends/{userId}")]
        public async Task<IActionResult> SyncFriends(int userId)
        {
            var friends = await _context
                .Friends.Where(f =>
                    (f.userID == userId || f.friendID == userId)
                    && f.status == FriendStatus.Accepted
                )
                .Select(f => f.userID == userId ? f.friendID : f.userID)
                .Join(
                    _context.Users,
                    friendId => friendId,
                    user => user.userID,
                    (friendId, user) =>
                        new
                        {
                            Id = user.userID,
                            Username = user.username,
                            Name = user.first_name + " " + user.last_name,
                            Email = user.email,
                            //ProfilePicture = user.profile_pic
                        }
                )
                .ToListAsync();

            if (!friends.Any())
            {
                return Ok("No friends found to sync");
            }

            string sUserID = userId.ToString();

            var client = _streamService.Client;
            var timelineFeed = client.Feed("timeline", sUserID);
            var userUserFeed = client.Feed("user", sUserID);
            await timelineFeed.FollowFeedAsync("user", sUserID);
            Console.WriteLine("reached here");

            foreach (var friend in friends)
            {
                string sFriendID = friend.Id.ToString();
                var friendTimelineFeed = client.Feed("timeline", sFriendID);
                await timelineFeed.FollowFeedAsync("user", sFriendID);
                await friendTimelineFeed.FollowFeedAsync("user", sUserID);

                var channel = await _streamService.CreateDMChannelAsync(sUserID, sFriendID);
            }
            return Ok("Friends synced");
        }
        public class FriendRequestDto
        {
            public int UserId { get; set; }
            public int FriendId { get; set; }
        }
        public static class FriendStatus
        {
            public const string Pending = "pending";
            public const string Accepted = "accepted";
            public const string Rejected = "rejected";


            public class FriendRequestDto
            {
                public int UserId { get; set; }
                public int FriendId { get; set; }
            }
        }
    }
}
