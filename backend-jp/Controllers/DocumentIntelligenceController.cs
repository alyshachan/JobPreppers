using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using System;
using System.IO;
using System.Threading.Tasks;

namespace JobPreppersDemo.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class DocumentIntelligenceController : ControllerBase
    {
        [HttpPost("PostFile")]
        public async Task<IActionResult> PostFile(IFormFile file, [FromForm] string userID)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var blobService = new BlobStorageService(); // or inject via DI
            var blobUri = await blobService.UploadToBlobStorage(file);

            var parsedResult = await DocumentIntelligenceService.AnalyzeResume(blobUri);

            var response = new
            {
                UserID = userID,
                ParsedResult = parsedResult
            };

            return Ok(response);
        }
    }

    public class BlobStorageService
    {
        private readonly string _connectionString = "DefaultEndpointsProtocol=https;AccountName=jobpreppersstore;AccountKey=Kxbif1v67kamnBrcUQTSTShT8R02lbU6tSDa+/mi8IMrj+3NrK0T1qdn5NeR/d6MYoJfS9h+peWf+ASthsq/aQ==;EndpointSuffix=core.windows.net";
        private readonly string _containerName = "resumes";

        public async Task<Uri> UploadToBlobStorage(IFormFile file)
        {
            var blobServiceClient = new BlobServiceClient(_connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(_containerName);

            // Ensure container exists
            await containerClient.CreateIfNotExistsAsync();

            // Optional: set public access level (only for public files)
            // await containerClient.SetAccessPolicyAsync(PublicAccessType.Blob);

            string blobName = $"{Guid.NewGuid()}_{file.FileName}";
            var blobClient = containerClient.GetBlobClient(blobName);

            using (var stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, overwrite: true);
            }

            // Generate SAS URI (valid for 5 minutes)
            var sasUri = GetSasUri(blobClient, TimeSpan.FromMinutes(5));
            return sasUri;
        }

        private Uri GetSasUri(BlobClient blobClient, TimeSpan validDuration)
        {
            if (blobClient.CanGenerateSasUri)
            {
                var sasBuilder = new BlobSasBuilder
                {
                    BlobContainerName = blobClient.BlobContainerName,
                    BlobName = blobClient.Name,
                    Resource = "b",
                    ExpiresOn = DateTimeOffset.UtcNow.Add(validDuration)
                };
                sasBuilder.SetPermissions(BlobSasPermissions.Read);

                return blobClient.GenerateSasUri(sasBuilder);
            }
            else
            {
                throw new InvalidOperationException("Cannot generate SAS URI. Check permissions.");
            }
        }
    }
}
