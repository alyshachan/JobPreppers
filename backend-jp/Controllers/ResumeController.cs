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
using System.Text.Json;
using System.IO;
using static System.Runtime.InteropServices.JavaScript.JSType;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
namespace JobPreppersDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResumeController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public ResumeController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        [HttpGet("test-gpt-key")]
        public async Task<IActionResult> TestGptKey()
        {
            // Retrieve the GPT key from secrets
            var gptKey = _configuration["GPTKey"];
            if (string.IsNullOrEmpty(gptKey))
            {
                return BadRequest("GPT key not found. Ensure it is correctly configured in your secrets.");
            }

            try
            {
                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {gptKey}");

                // Adjust for ChatGPT-specific API
                var payload = new
                {
                    model = "gpt-4o-mini", // Specify the ChatGPT model you are using
                    messages = new[]
                    {
                new { role = "system", content = "You are a helpful assistant." },
                new { role = "user", content = "Hello, GPT!" }
            },
                    max_tokens = 10
                };

                var response = await httpClient.PostAsync(
                    "https://api.openai.com/v1/chat/completions",
                    new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
                );

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return StatusCode((int)response.StatusCode, $"API call failed: {errorContent}");
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                return Ok($"API call successful: {responseContent}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
        [HttpPost("PostFile")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> PostFile([FromForm] UploadResumeRequest request)
        {
            var file = request.File;
            var userID = request.UserID;
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            if (file.ContentType != "application/pdf")
            {
                return BadRequest("Only PDF files are allowed.");
            }

            try
            {
                

                // Read the file into a byte array
                byte[] resumePdf;
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    resumePdf = memoryStream.ToArray();
                }
                Console.WriteLine($"Uploaded file size: {resumePdf.Length} bytes");
                // Check for an existing resume
                // Check for an existing resume
                var existingResume = await _context.Resumes.FirstOrDefaultAsync(r => r.userID == userID);
                if (existingResume != null)
                {
                    existingResume.resume_pdf = resumePdf;
                    existingResume.upload_date = DateTime.UtcNow;
                }
                else
                {
                    var newResume = new Resume
                    {
                        userID = userID,
                        resume_pdf = resumePdf,
                        upload_date = DateTime.UtcNow
                    };
                    await _context.Resumes.AddAsync(newResume);
                }

                await _context.SaveChangesAsync();
                return Ok("Resume uploaded successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.InnerException?.Message ?? ex.Message}");
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


        [HttpPost("generate-suggestions")]
        public async Task<IActionResult> GenerateSuggestions([FromBody] JobDescriptionInput input)
        {
            // Validate input
            if (string.IsNullOrEmpty(input.JobDescription))
            {
                return BadRequest("Job description is required.");
            }

            // Retrieve the GPT key from secrets
            var gptKey = _configuration["GPTKey"];
            if (string.IsNullOrEmpty(gptKey))
            {
                return BadRequest("GPT key not found. Ensure it is correctly configured in your secrets.");
            }

            try
            {
                // Fetch the user's resume from the database
                var userResume = await _context.Resumes
                    .Where(r => r.userID == input.UserID)
                    .Select(r => r.resume_pdf) 
                    .FirstOrDefaultAsync();

                if (userResume == null || userResume.Length == 0)
                {
                    return NotFound("Resume not found for the specified user.");
                }

                // Extract text from the BLOB (assuming it's a PDF)
                string resumeText = ExtractTextFromBlob(userResume);
                if (string.IsNullOrWhiteSpace(resumeText))
                {
                    return BadRequest("Failed to extract text from the resume.");
                }
                // Prepare the prompt for GPT
                var prompt = @$"
You are a career coach. 
Here is the job description:
{input.JobDescription}

Here is the user's resume:
{resumeText}

Provide suggestions on how to improve the resume to better match the job description. 
Additionally, recommend projects or skills the user can work on to align with the job requirements.";

                // Prepare the payload for the OpenAI API
                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {gptKey}");

                var payload = new
                {
                    model = "gpt-4", // Replace with the appropriate model
                    messages = new[]
                    {
                new { role = "system", content = "You are a helpful assistant." },
                new { role = "user", content = prompt }
            },
                    max_tokens = 100 // Adjust token limit as needed
                };

                var response = await httpClient.PostAsync(
                    "https://api.openai.com/v1/chat/completions",
                    new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
                );

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return StatusCode((int)response.StatusCode, $"API call failed: {errorContent}");
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                return Ok(JsonSerializer.Deserialize<object>(responseContent)); // Return API response
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
        public class JobDescriptionInput
        {
            public string JobDescription { get; set; }
            public int UserID { get; set; }
        }
        public class UploadResumeRequest
        {
            public IFormFile File { get; set; }
            public int UserID { get; set; }
        }
        private string ExtractTextFromBlob(byte[] blobData)
        {
            try
            {
                using var memoryStream = new MemoryStream(blobData);
                if (!memoryStream.CanRead)
                {
                    throw new InvalidOperationException("Memory stream is not readable.");
                }
                using var pdfReader = new iText.Kernel.Pdf.PdfReader(memoryStream);
                using var pdfDocument = new iText.Kernel.Pdf.PdfDocument(pdfReader);

                var stringBuilder = new StringBuilder();
                var strategy = new iText.Kernel.Pdf.Canvas.Parser.Listener.SimpleTextExtractionStrategy();

                for (int i = 1; i <= pdfDocument.GetNumberOfPages(); i++)
                {
                    var page = pdfDocument.GetPage(i);
                    stringBuilder.Append(iText.Kernel.Pdf.Canvas.Parser.PdfTextExtractor.GetTextFromPage(page, strategy));
                }

                return stringBuilder.ToString();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw new InvalidOperationException("Failed to extract text from the PDF.", ex);
            }
        }
    }
}
