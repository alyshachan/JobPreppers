using Azure;
using Azure.AI.DocumentIntelligence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using JobPreppersDemo.Models;

public class DocumentIntelligenceService
{
    private readonly string endpoint;
    private readonly string apiKey;
    private readonly string modelId;

    public DocumentIntelligenceService(IConfiguration configuration)
    {
        var documentIntelligenceSettings = configuration.GetSection("AzureDocumentIntelligence");

        endpoint = documentIntelligenceSettings["Endpoint"] ?? Environment.GetEnvironmentVariable("DocumentIntelligence__APIKey");
        apiKey = documentIntelligenceSettings ["APIKey"] ?? Environment.GetEnvironmentVariable("DocumentIntelligence__Endpoint");
        modelId = "Resume4";

        if (string.IsNullOrEmpty(endpoint) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(modelId))
        {
            throw new InvalidOperationException("Azure Document Intelligence settings are missing or incomplete.");
        }
    }

    public async Task<object> AnalyzeResume(Uri fileUri)
    {
        var credential = new AzureKeyCredential(apiKey);
        var client = new DocumentIntelligenceClient(new Uri(endpoint), credential);

        Operation<AnalyzeResult> operation = await client.AnalyzeDocumentAsync(WaitUntil.Completed, modelId, fileUri);
        AnalyzeResult result = operation.Value;

        var extracted = new
        {
            ModelId = result.ModelId,
            Documents = result.Documents.Select(doc => new
            {
                DocumentType = doc.DocumentType,
                Fields = doc.Fields.ToDictionary(
                    kvp => kvp.Key,
                    kvp =>
                    {
                        var field = kvp.Value;

                        bool isTable = field.ValueList != null &&
                                       field.ValueList.Count > 0 &&
                                       field.ValueList.All(i => i.ValueDictionary != null && i.ValueDictionary.Count > 0);

                        if (isTable)
                        {
                            var rows = new List<Dictionary<string, string>>();

                            foreach (var item in field.ValueList)
                            {
                                var row = new Dictionary<string, string>();
                                foreach (var col in item.ValueDictionary)
                                {
                                    row[col.Key] = col.Value?.Content ?? col.Value?.ValueString ?? "";
                                }
                                rows.Add(row);
                            }

                            return (object)new
                            {
                                Type = "table",
                                Content = rows,
                                Confidence = field.Confidence
                            };
                        }
                        else
                        {
                            return (object)new
                            {
                                Type = "field",
                                Content = field.Content ?? field.ValueString ?? "",
                                Confidence = field.Confidence
                            };
                        }
                    })
            })
        };

        return extracted;
    }
}
