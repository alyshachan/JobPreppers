using Qdrant.Client;
using Qdrant.Client.Grpc;
using Tokens.Extensions;
using ZstdSharp.Unsafe;
using System.Text.Json;


namespace JobPreppersDemo.Services
{
    public class SearchResult
    {
        public int Id { get; set; }
        public int Score { get; set; }
    }
    public class JobsVectorDB
    {
        private readonly QdrantClient _client;
        private readonly OnnxModelService _session;
        private readonly string collection_name = "combined_qualification";

        public JobsVectorDB(QdrantClient client, OnnxModelService session)
        {
            _client = client;
            _session = session;
        }

        public float[] CombineEmbeddings(float[] qualificationEmbedding, float[] jobDescriptionEmbedding)
        {
            var combined = qualificationEmbedding.Concat(jobDescriptionEmbedding).ToArray();
            return combined; // Maybe average or weight 
        }

        public async Task<float[]> embeddedSentence(string sentence)
        {
            return await _session.GetEmbeddingsForSentence(sentence);
        }

        public async Task<string> sematicSearch(float[] embeddedUser)
        {
            var results = await _client.QueryAsync(
            collectionName: $"{collection_name}",
            query: embeddedUser,
            searchParams: new SearchParams { Exact = false, HnswEf = 128 },
            limit: 10
            );
            var extractedResults = results.Select(r => new SearchResult
            {
                Id = (int)r.Id.Num,
                Score = (int)Math.Round(r.Score * 100.0, 0),
            }).ToList();

            string jsonOutput = JsonSerializer.Serialize(extractedResults);
            Console.WriteLine($"JSON Output: {jsonOutput}");

            return jsonOutput;
        }


        public async Task AddToJobVector(string description, int jobID)
        {
            float[] descriptionEmbedded = await _session.GetEmbeddingsForSentence(description);
            Console.WriteLine($"Combined Vector:  {descriptionEmbedded}");
            await _client.UpsertAsync(
                collectionName: $"{collection_name}",
                points: new List<PointStruct>
                {
                    new()
                    {
                        Id = (ulong)jobID,
                        Vectors = descriptionEmbedded,
                    }
                }
            );
        }

        public async Task deleteFromJobVector(int jobID)
        {
            await _client.DeleteAsync(
                collectionName: $"{collection_name}",
                id: (ulong)jobID
            );
            Console.WriteLine("Sucessfully deleted");
        }


    }

}

