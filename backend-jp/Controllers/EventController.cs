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
using Newtonsoft.Json.Serialization;
using System.Text.Json;

namespace JobPreppersDemo.Controllers
{
    public class EventDTO
    {
        public string Name { get; set; }
        public DateOnly? date { get; set; }
        public TimeOnly? startTime { get; set; }
        public TimeOnly? endTime { get; set; }
        public int host { get; set; }
        public string participants { get; set; }
        public string details { get; set; }
        public string link { get; set; }
    }
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : Controller
    {
        private readonly ApplicationDbContext _context;
        public EventController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("CreateEvent")]
        public async Task<IActionResult> CreateEvent([FromBody] EventDTO eventDto)
        {
            if(eventDto == null) 
            {
                return BadRequest("Event Info not correctly filled out");

            }
            try
            {
        string GenerateRandomLink(int length = 10)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

               var newEvent = new Event 
               { 
                   eventName = eventDto.Name,
                   eventDate = eventDto.date,
                   eventStartTime = eventDto.startTime,
                   eventEndTime = eventDto.endTime,
                   hostID = eventDto.host,
                   eventDetails = eventDto.details,
                   participantID = JsonSerializer.Serialize(eventDto.participants.Split(',').Select(p => p.Trim())),
                   eventLink = GenerateRandomLink(),
               };
                await _context.Events.AddAsync(newEvent);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(CreateEvent), newEvent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("GetEventsByHost/{userId}")]
        public async Task<IActionResult> GetEventsByHost(int userId)
        {
            var events = await _context.Events
                .Where(e => e.hostID == userId)
                .ToListAsync();

            if (!events.Any())
                return NotFound("No events found for this host.");

            return Ok(events);
        }
        [HttpGet("GetEventsByParticipant/{userId}")]
        public async Task<IActionResult> GetEventsByParticipant(int userId)
        {
            var userIdJson = $"\"{userId}\""; 
            var events = await _context.Events
                .Where(e => EF.Functions.JsonContains(e.participantID, userIdJson))
                .ToListAsync();

            if (!events.Any())
                return NotFound("No events found for this participant.");

            return Ok(events);
        }
        [HttpGet("GetEventsByUserID/{userId}")]
        public async Task<IActionResult> GetUserEvents(int userId)
        {
            var userIdJson = $"\"{userId}\""; 

            var hostEvents = await _context.Events
                .Where(e => e.hostID == userId)
                .ToListAsync();
            
            var participantEvents = await _context.Events
                .Where(e => EF.Functions.JsonContains(e.participantID, userIdJson))
                .ToListAsync();

            var allEvents = hostEvents.Concat(participantEvents).OrderByDescending(e => e.eventDate).ToList();

            if (!allEvents.Any())
                return NotFound("No events found for this user.");

            return Ok(allEvents);
        }

    }
}