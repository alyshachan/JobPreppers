using JobPreppersDemo.Services;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Stream;
using Stream.Models;

namespace JobPreppersDemo.Controllers {
    [Route("api/[controller]")]
    [ApiController]

     public class ChatController : ControllerBase
    {
        private readonly StreamService _streamService;
        private readonly ApplicationDbContext _context;

        public ChatController(StreamService streamService, ApplicationDbContext context) {
            _streamService = streamService;
            _context = context;
        }

    }
}