using System;
using System.Drawing;
using Microsoft.Extensions.Configuration;
using Qdrant.Client;
using Qdrant.Client.Grpc;

namespace JobPreppersDemo.Services
{
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

        // Just going to create the collection in the qdrant console itself
        // public async Task CreateJobDescriptionCollection()
        // {
        //     var collectionExists = await _client.GetCollectionInfoAsync("job_description");
        //     if (collectionExists != null)
        //     {
        //         Console.WriteLine("Collection Exist");
        //         return;
        //     }

        //     await _client.CreateCollectionAsync(
        //         collectionName: "{collection_name}",
        //         vectorsConfig: new VectorParams { Size = 384, Distance = Distance.Cosine }
        //     );
        //     return;

        //     //     await _client.CreateCollectionAsync(
        //     //     collectionName: "job_qualication",
        //     //     vectorsConfig: new VectorParamsMap
        //     //     {
        //     //         Map = {
        //     //                 ["qualification"] = new VectorParams{Size = 384, Distance = Distance.Cosine},
        //     //                 ["job_description"] = new VectorParams{Size = 384, Distance = Distance.Cosine}
        //     //         },
        //     //     }
        //     // );
        // }

        public float[] CombineEmbeddings(float[] qualificationEmbedding, float[] jobDescriptionEmbedding)
        {
            var combined = qualificationEmbedding.Concat(jobDescriptionEmbedding).ToArray();
            return combined; // Maybe average or weight 
        }
        public async Task AddToJobVector(string description, int jobID)
        {
            float[] descriptionEmbedded = _session.GetEmbeddingsForSentence(description);
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


    }

}

