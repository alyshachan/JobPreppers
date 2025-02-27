using Azure;
using System;
using System.Globalization;
using Azure.AI.TextAnalytics;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting.StaticWebAssets;
using System.Security.Policy;
using Org.BouncyCastle.Security;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Text.RegularExpressions;

public class ResultEntities
{
    public string? educationLevel { get; set; }

    public List<string>? skills { get; set; }

    public string? title { get; set; }

    public string? companyName { get; set; }

    public decimal? minimumSalary { get; set; }

    public decimal? maximumSalary { get; set; }

    public string? benefits { get; set; }

    public int? minimumExperience { get; set; }

    public string? location { get; set; }

    public string? type { get; set; }


}


namespace JobPreppersDemo.Services
{
    public class TextAnalyticsService
    {
        private readonly TextAnalyticsClient _client;

        public TextAnalyticsService(string apiKey, string endpointUrl)
        {
            var credential = new AzureKeyCredential(apiKey);
            var endpoint = new Uri(endpointUrl);
            _client = new TextAnalyticsClient(endpoint, credential);
        }

        public async Task<RecognizeCustomEntitiesOperation> EntityEntryRecognition(string jobDescription)
        {

            List<TextDocumentInput> batchedDocuments = new()
            {
            new TextDocumentInput("1", jobDescription)
            {
                Language = "en",
            }
            };
            ResultEntities entities = new ResultEntities();
            string projectName = "parsejobdescription";
            string deploymentName = "job-description-model";
            RecognizeCustomEntitiesOperation result = await _client.RecognizeCustomEntitiesAsync(WaitUntil.Completed, batchedDocuments, projectName, deploymentName);
            await foreach (RecognizeCustomEntitiesResultCollection documentsInPage in result.Value)
            {
                foreach (RecognizeEntitiesResult documentResult in documentsInPage)
                {
                    if (documentResult.HasError)
                    {
                        Console.WriteLine($"  Error!");
                        Console.WriteLine($"  Document error code: {documentResult.Error.ErrorCode}");
                        Console.WriteLine($"  Message: {documentResult.Error.Message}");
                        Console.WriteLine();
                        continue;
                    }
                    foreach (CategorizedEntity entity in documentResult.Entities)
                    {
                        var category = entity.Category;
                        if (String.Equals(category, "company_name"))
                        {
                            entities.companyName = entity.Text;
                            continue;
                        }

                        if (String.Equals(category, "title"))
                        {
                            entities.title = entity.Text;
                            continue;
                        }

                        if (String.Equals(category, "education_level"))
                        {
                            entities.educationLevel = entity.Text;
                            continue;
                        }

                        if (String.Equals(category, "location"))
                        {
                            entities.location = entity.Text;
                            continue;
                        }

                        if (String.Equals(category, "type"))
                        {
                            entities.type = entity.Text;
                            continue;
                        }

                        if (String.Equals(category, "minimum_experience"))
                        {
                            string input = entity.Text;
                            string pattern = @"(?<experience>\d+)";
                            // RegexOptions options = RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace;
                            Match match = Regex.Match(input, pattern);
                            if (match.Success)
                            {
                                if (Int32.TryParse(match.Groups["experience"].Value, out int min))
                                {
                                    entities.minimumSalary = min;
                                    Console.WriteLine($" Was able to parse correctly {min}");
                                }
                                else
                                {
                                    Console.WriteLine("String could not be parsed.");
                                }
                            }
                        }




                        Console.WriteLine($"  Text: {entity.Text}");
                        Console.WriteLine($"  Category: {entity.Category}");
                        Console.WriteLine($"  Offset: {entity.Offset}");
                        Console.WriteLine($"  Length: {entity.Length}");
                        Console.WriteLine($"  ConfidenceScore: {entity.ConfidenceScore}");
                        Console.WriteLine($"  SubCategory: {entity.SubCategory}");
                        Console.WriteLine();
                    }
                }
            }
            return await _client.RecognizeCustomEntitiesAsync(WaitUntil.Completed, batchedDocuments, projectName, deploymentName);
        }
    }

}


