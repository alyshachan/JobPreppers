using Azure;
using Azure.AI.DocumentIntelligence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using Microsoft.WindowsAzure.Storage.Blob;   

public class DocumentIntelligenceService
{
    private readonly ApplicationDbContext _context;
    private readonly DocumentIntelligenceClient _client;
    private const string modelId = "Resume4";

    public DocumentIntelligenceService(ApplicationDbContext context)
    {
        _context = context;

        string endpoint = "https://jobpreppersresumeparser.cognitiveservices.azure.com/";
        string key = "3a4457bb5ba641c9ab49f8f848bc3c4f";
        var credential = new AzureKeyCredential(key);

        _client = new DocumentIntelligenceClient(new Uri(endpoint), credential);
    }

    public async Task<Dictionary<string, object>> ParseResume(int userID)
    {
        var userResume = await _context.Resumes
            .Where(r => r.userID == userID)
            .Select(r => r.resume_pdf)
            .FirstOrDefaultAsync();

        if (userResume == null || userResume.Length == 0)
        {
            throw new Exception("No resume found for this user.");
        }

        string resumeUri = await UploadToBlobStorage(userResume);

        var operation = await _client.AnalyzeDocumentAsync(
            WaitUntil.Completed, 
            modelId,
            new Uri(resumeUri)
        );
        var result = operation.Value;

        var extractedData = new Dictionary<string, object> { { "ModelID", result.ModelId } };

        foreach (var document in result.Documents)
        {
            foreach (var field in document.Fields)
            {
                extractedData[field.Key] = field.Value.Content;
            }
        }

        return extractedData;
    }
}
