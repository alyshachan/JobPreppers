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
using Mysqlx;
using Microsoft.IdentityModel.Tokens;

public class ResultEntities
{
    public string? educationLevel { get; set; }

    public HashSet<string> skills { get; set; } = new HashSet<string>();

    public string? title { get; set; }

    public string? companyName { get; set; }

    public int? minimumSalary { get; set; }

    public int? maximumSalary { get; set; }

    public List<string> benefits { get; set; } = new List<string>();

    public int? minimumExperience { get; set; }

    public string? location { get; set; }

    public string? type { get; set; }

    public override string ToString()
    {
        return String.Format("Name: {0}, Type: {1}, Title: {2}, minimum_salary: {3}, minimum_experience: {4}, Benefits: {5}, location: {6}, Education_Level: {7}, skills: {8}, maximum_salary: {9} ",
        companyName, type, title, minimumSalary, minimumExperience, string.Join(", ", benefits), location, educationLevel, string.Join(", ", skills), maximumSalary);
    }


}


namespace JobPreppersDemo.Services
{
    public class TextAnalyticsService
    {
        public int parseSalary(string input)
        {
            string salaryPattern = @"(?<salary>\d+)";
            Match match = Regex.Match(input, salaryPattern);
            if (match.Success && int.TryParse(match.Groups["salary"].Value, out int parseSalary))
            {

                if (input.ToLower().Contains("k") || input.Contains(","))
                {
                    Console.WriteLine($"Input: {input} -> Extracted Salary: {parseSalary}");
                    return parseSalary *= 1000;
                }

                Console.WriteLine($"Input: {input} -> Extracted Salary: {parseSalary}");
                return parseSalary;
            }
            else
            {
                Console.WriteLine($"Input: {input} -> No valid experience found.");
                return 0;
            }
        }




        private readonly TextAnalyticsClient _client;

        public TextAnalyticsService(string apiKey, string endpointUrl)
        {
            var credential = new AzureKeyCredential(apiKey);
            var endpoint = new Uri(endpointUrl);
            _client = new TextAnalyticsClient(endpoint, credential);
        }

        public async Task<ResultEntities> EntityEntryRecognition(string jobDescription)
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

                        Console.WriteLine($"  Category: {entity.Category}");
                        Console.WriteLine($"  Text: {entity.Text}");
                        Console.WriteLine($"  Offset: {entity.Offset}");
                        Console.WriteLine($"  Length: {entity.Length}");
                        Console.WriteLine($"  ConfidenceScore: {entity.ConfidenceScore}");
                        Console.WriteLine($"  SubCategory: {entity.SubCategory}");
                        Console.WriteLine();


                        // All the strings --> company_name title, education_level, location, and type
                        var category = entity.Category.ToString();
                        var confident = entity.ConfidenceScore;
                        double maxConfident = .80;
                        if (String.Equals(category, "company_name") && confident >= maxConfident)
                        {
                            entities.companyName = entity.Text;
                            continue;
                        }

                        if (String.Equals(category, "title") && confident >= maxConfident)
                        {
                            entities.title = entity.Text;
                            continue;
                        }

                        if (String.Equals(category, "education_level") && confident >= maxConfident)
                        {
                            entities.educationLevel = entity.Text;
                            continue;
                        }

                        if (String.Equals(category, "location") && confident >= maxConfident)
                        {
                            entities.location = entity.Text;
                            continue;
                        }

                        if (String.Equals(category, "type") && confident >= maxConfident)
                        {
                            entities.type = entity.Text;
                            continue;
                        }


                        // Int ---> Minimum Experience, Minimum Salary and Maximum Salary 
                        if (String.Equals(category, "minimum_experience") && confident >= maxConfident)
                        {
                            string input = entity.Text;
                            string pattern = @"(?<experience>\d+)";
                            Match match = Regex.Match(input, pattern);
                            if (match.Success)
                            {
                                if (Int32.TryParse(match.Groups["experience"].Value, out int min))
                                {
                                    Console.WriteLine($" Was able to parse correctly {min}");
                                    entities.minimumExperience = min;
                                    continue;
                                }
                                else
                                {
                                    Console.WriteLine("String could not be parsed.");
                                    continue;
                                }
                            }
                        }

                        if (String.Equals(category, "minimum_salary") && confident >= maxConfident)
                        {
                            // 0 means it wasn't able to parse
                            var salary = parseSalary(entity.Text);
                            if (salary != 0)
                            {
                                entities.minimumSalary = salary;
                            }
                            continue;
                        }

                        if (String.Equals(category, "maximum_salary") && confident >= maxConfident)
                        {
                            var salary = parseSalary(entity.Text);
                            if (salary != 0)
                            {
                                entities.minimumSalary = salary;
                            }
                            continue;
                        }


                        // List --> Skills and Benefits
                        if (String.Equals(category, "skills") && confident >= maxConfident)
                        {
                            entities.skills.Add(entity.Text);

                        }

                        if (String.Equals(category, "benefits") && confident >= maxConfident)
                        {

                            entities.benefits.Add(entity.Text);
                            continue;
                        }

                    }

                }
                Console.WriteLine($"Entities: {entities.ToString()}");
            }
            if (!entities.skills.IsNullOrEmpty())
            {
                var rawSkills = entities.skills;
                HashSet<string> finishedSkills = new HashSet<string>();

                foreach (var skill in rawSkills)
                {
                    var normalizeSkills = Regex.Split(skill, @"\s*,\s*|\s+and\s?|\s+or\s?", RegexOptions.IgnoreCase).Select(s => s.Trim())
                                           .Where(s => !string.IsNullOrEmpty(s))  // Remove empty strings
                                           .ToList();
                    foreach (var newSkill in normalizeSkills)
                    {
                        Console.WriteLine($"Input: {skill} -> Extracted skills: {newSkill}");
                        finishedSkills.Add(newSkill);
                    }
                }
                entities.skills = finishedSkills;
            }

            return entities;
        }
    }

}


