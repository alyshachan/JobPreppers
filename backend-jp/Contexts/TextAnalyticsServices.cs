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

public class ResultEntities
{
    public string? educationLevel { get; set; }

    public List<string>? skills { get; set; }

    public string? title { get; set; }

    public string? companyName { get; set; }

    public int? minimumSalary { get; set; }

    public int? maximumSalary { get; set; }

    public string? benefits { get; set; }

    public int? minimumExperience { get; set; }

    public string? location { get; set; }

    public string? type { get; set; }

    public override string ToString()
    {
        return String.Format("Name: {0}, Type: {1}, Title: {2}, minimum_salary: {3}, minimum_experience: {4},",
       "Benefits: {5}, location: {6}, Education_Level: {7}, skills: {8}, maximum_salary: {9} "
        , companyName, type, title, minimumSalary, minimumExperience, benefits, location, educationLevel, skills, maximumSalary);
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

                        Console.WriteLine($"  Category: {entity.Category}");
                        Console.WriteLine($"  Text: {entity.Text}");
                        Console.WriteLine($"  Offset: {entity.Offset}");
                        Console.WriteLine($"  Length: {entity.Length}");
                        Console.WriteLine($"  ConfidenceScore: {entity.ConfidenceScore}");
                        Console.WriteLine($"  SubCategory: {entity.SubCategory}");
                        Console.WriteLine();


                        // All the strings --> company_name title, education_level, location, type, and benefits
                        var category = entity.Category.ToString();
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

                        if (String.Equals(category, "benefits"))
                        {
                            entities.benefits = entity.Text;
                            continue;
                        }



                        // Int ---> Minimum Experience, Minimum Salary and Maximum Salary 
                        if (String.Equals(category, "minimum_experience"))
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

                        if (String.Equals(category, "minimum_salary"))
                        {
                            // 0 means it wasn't able to parse
                            var salary = parseSalary(entity.Text);
                            if (salary != 0)
                            {
                                entities.minimumSalary = salary;
                            }
                            continue;
                        }

                        if (String.Equals(category, "maximum_salary"))
                        {
                            var salary = parseSalary(entity.Text);
                            if (salary != 0)
                            {
                                entities.minimumSalary = salary;
                            }
                            continue;
                        }

                        if (String.Equals(category, "skills"))
                        {

                        }

                    }

                }
                Console.WriteLine($"Entities: {entities.ToString()}");
            }
            return await _client.RecognizeCustomEntitiesAsync(WaitUntil.Completed, batchedDocuments, projectName, deploymentName);
        }
    }

}


