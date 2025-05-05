using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
using Qdrant.Client.Grpc;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Diagnostics;
using BERTTokenizers;
namespace JobPreppersDemo.Services
{
    public class OnnxModelService
    {
        private readonly InferenceSession _session;

        private readonly BertBaseTokenizer _tokenizer;


        // Constructor to load the ONNX model
        public OnnxModelService(string modelPath)
        {
            _session = new InferenceSession(modelPath);
            _tokenizer = new BertBaseTokenizer();


        }


        public async Task<float[]> GetEmbeddingsForSentence(string sentence)
        {
            string newString = sentence.Replace("\n", "");
            return await Task.Run(() =>
    {
        // Create a tokenizer instance
        Console.WriteLine("Encoding Start");
        // Simple way but lose meaning
        // sentence = sentence.Substring(0, Math.Min(sentence.Length, 300));
        // var encoded = _tokenizer.Encode(384, sentence);

        int maxWords = 30;  // Adjust based on estimated tokens per word
        List<string> sentenceChunks = new List<string>();

        string[] words = newString.Split(' ');
        for (int i = 0; i < words.Length; i += maxWords)
        {
            string chunk = string.Join(" ", words.Skip(i).Take(maxWords));
            sentenceChunks.Add(chunk);
        }
        Console.WriteLine("Pass the chunking ");
        int count = 0;

        var inputIds = new List<long[]>();
        var attentionMasks = new List<long[]>();
        var tokenTypeIds = new List<long[]>();
        foreach (var chunk in sentenceChunks)
        {

            if (string.IsNullOrWhiteSpace(chunk)) continue;

            var encoded = _tokenizer.Encode(384, chunk);
            if (encoded.Count == 0 || encoded == null) continue;


            inputIds.Add(encoded.Select(t => t.InputIds).ToArray());
            attentionMasks.Add(encoded.Select(t => t.AttentionMask).ToArray());
            tokenTypeIds.Add(encoded.Select(t => t.TokenTypeIds).ToArray());

            count++;
            if (count > 10) break;
        }

        Console.WriteLine("Pass the encoding ");



        if (inputIds.Count == 0 || inputIds[0].Length == 0)
        {
            Console.WriteLine("inputIds is empty or invalid.");
            throw new ArgumentException("Tokenized input is empty. Check the input sentence or tokenizer.");
        }


        Console.WriteLine("Encoded Finished");
        // Extract token IDs, attention mask, and token type IDs
        // var inputIds = encoded.Select(t => t.InputIds).ToArray();
        // var attentionMask = encoded.Select(t => t.AttentionMask).ToArray();
        // var typeIds = encoded.Select(t => t.TokenTypeIds).ToArray();


        // Create input tensors for ONNX model
        var inputTensors = new List<NamedOnnxValue>
            { // Select Many to Many makes it one dimension
               NamedOnnxValue.CreateFromTensor("input_ids", new DenseTensor<long>(inputIds.SelectMany(x => x).ToArray(), new[] { inputIds.Count, inputIds[0].Length })),
                NamedOnnxValue.CreateFromTensor("attention_mask", new DenseTensor<long>(attentionMasks.SelectMany(x => x).ToArray(), new[] { attentionMasks.Count, attentionMasks[0].Length })),
                NamedOnnxValue.CreateFromTensor("token_type_ids", new DenseTensor<long>(tokenTypeIds.SelectMany(x => x).ToArray(), new[] { tokenTypeIds.Count, tokenTypeIds[0].Length }))
            };

        using var results = _session.Run(inputTensors);
        Console.WriteLine("Embedded Finished");

        // Get the embeddings from the results
        var outputTensor = results.FirstOrDefault()?.AsTensor<float>();
        if (outputTensor != null && outputTensor.Dimensions.Length == 3)
        {
            int tokenCount = outputTensor.Dimensions[1];  // 384 tokens
            int embeddingSize = outputTensor.Dimensions[2];

            float[] meanEmbedding = new float[embeddingSize];

            // Sum all token embeddings
            for (int i = 0; i < tokenCount; i++)
            {
                for (int j = 0; j < embeddingSize; j++)
                {
                    meanEmbedding[j] += outputTensor[0, i, j];
                }
            }

            // Divide by token count to get average
            for (int j = 0; j < embeddingSize; j++)
            {
                meanEmbedding[j] /= tokenCount;
            }
            Console.WriteLine("Mean Finished");

            return meanEmbedding;

        }
        else
        {
            Console.WriteLine("Unexpected tensor shape or empty output.");
            return Array.Empty<float>();
        }
    }
            );

        }


        public void Dispose()
        {
            _session?.Dispose();
        }


    }
}