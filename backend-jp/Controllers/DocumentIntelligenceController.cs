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
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentIntelligenceController : ControllerBase
    {
        private readonly DocumentIntelligenceService _documentService;
        private readonly BlobStorageService _blobService;

        public DocumentIntelligenceController(DocumentIntelligenceService documentService, BlobStorageService blobService)
        {
            _documentService = documentService;
            _blobService = blobService;
        }


        [HttpPost("PostFile")]
        public async Task<IActionResult> PostFile(IFormFile file, [FromForm] string userID)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var blobUri = await _blobService.UploadToBlobStorage(file);
            var parsedResult = await _documentService.AnalyzeResume(blobUri); // ✅ use instance here

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
        private readonly string connectionString;
        private readonly string containerName;

        public BlobStorageService(IConfiguration configuration)
        {
            var documentIntelligenceSettings = configuration.GetSection("AzureDocumentIntelligence");
            connectionString = documentIntelligenceSettings["ConnectionString"] ?? Environment.GetEnvironmentVariable("DocumentIntelligence__ConnectionString");
            containerName = "resumes";

            if (string.IsNullOrEmpty(connectionString) || string.IsNullOrEmpty(containerName))
            {
                throw new InvalidOperationException("Blob storage settings are missing.");
            }
        }

        public async Task<Uri> UploadToBlobStorage(IFormFile file)
        {
            var blobServiceClient = new BlobServiceClient(connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            await containerClient.CreateIfNotExistsAsync();

            string blobName = $"{Guid.NewGuid()}_{file.FileName}";
            var blobClient = containerClient.GetBlobClient(blobName);

            using var stream = file.OpenReadStream();
            await blobClient.UploadAsync(stream, overwrite: true);

            return GetSasUri(blobClient, TimeSpan.FromMinutes(5));
        }

        private Uri GetSasUri(BlobClient blobClient, TimeSpan validDuration)
        {
            if (!blobClient.CanGenerateSasUri)
                throw new InvalidOperationException("Cannot generate SAS URI. Check permissions.");

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
    }

}
