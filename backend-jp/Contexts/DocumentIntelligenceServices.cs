using Azure;
using Azure.AI.DocumentIntelligence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using System.Linq;

public static class DocumentIntelligenceService
{
    private static readonly string endpoint = "https://jobpreppersresumeparser.cognitiveservices.azure.com/";
    private static readonly string key = "3a4457bb5ba641c9ab49f8f848bc3c4f";
    private static readonly string modelId = "Resume4";

public static async Task<object> AnalyzeResume(Uri fileUri)
{
    var credential = new AzureKeyCredential(key);
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
    kvp => {
        var field = kvp.Value;

        if (field.ValueList != null)
        {
            var rows = new List<Dictionary<string, string>>();

            foreach (var item in field.ValueList)
            {
                if (item.ValueDictionary != null)
                {
                    var row = new Dictionary<string, string>();
                    foreach (var col in item.ValueDictionary)
                    {
                        row[col.Key] = col.Value?.Content ?? col.Value?.ValueString ?? "";
                    }
                    rows.Add(row);
                }
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
                Content = field.Content ?? field.ValueString,
                Confidence = field.Confidence
            };
        }
    }
)

        })
    };

    return extracted;
}



}
