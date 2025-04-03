using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;

namespace JobPreppersDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentIntelligenceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly DocumentIntelligenceService _docService;
        private readonly ILogger<DocumentIntelligenceController> _logger;

        public DocumentIntelligenceController(ApplicationDbContext context, DocumentIntelligenceService docService, ILogger<DocumentIntelligenceController> logger)
        {
            _context = context;
            _docService = docService;
            _logger = logger;
        }

        [HttpPost("PostFile")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> PostFile([FromForm] UploadResumeRequest request)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest("No file uploaded.");

            if (request.File.ContentType != "application/pdf")
                return BadRequest("Only PDF files are allowed.");

            try
            {
                using var memoryStream = new MemoryStream();
                await request.File.CopyToAsync(memoryStream);
                var resumePdf = memoryStream.ToArray();

                var existingResume = await _context.Resumes.FirstOrDefaultAsync(r => r.userID == request.UserID);
                if (existingResume == null)
                {
                    _context.Resumes.Add(new Resume { userID = request.UserID, resume_pdf = resumePdf, upload_date = DateTime.UtcNow });
                }
                else
                {
                    existingResume.resume_pdf = resumePdf;
                    existingResume.upload_date = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
                return Ok(existingResume == null ? "New resume uploaded successfully." : "Existing resume updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading resume.");
                return StatusCode(500, "An internal server error occurred.");
            }
        }

        [HttpGet("ParseResume/{userID}")]
        public async Task<IActionResult> ParseResume(int userID)
        {
            try
            {
                var result = await _docService.ParseResume(userID);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error parsing resume.");
                return StatusCode(500, ex.Message);
            }
        }

        public class UploadResumeRequest
        {
            public IFormFile File { get; set; }
            public int UserID { get; set; }
        }
    }
}
