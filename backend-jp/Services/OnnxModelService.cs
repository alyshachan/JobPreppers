using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
using Qdrant.Client.Grpc;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Diagnostics;
using Tokenizers.DotNet;
using iText.StyledXmlParser.Jsoup.Parser;
namespace JobPreppersDemo.Services
{
    public class OnnxModelService
    {
        private readonly InferenceSession _session;
        // private readonly Tokenizer _tokenizer;


        // Constructor to load the ONNX model
        public OnnxModelService(string modelPath)
        {
            _session = new InferenceSession(modelPath);
            // _tokenizer = new Tokenizer(vocabPath: tokenPath);


        }

        // public float[] GetEmbeddingsAsync(string[] sentences)
        // {
        //     var inputTensor = new DenseTensor<string>(sentences, new[] { sentences.Length });

        //     // Create input named "input" for the model
        //     var inputs = new NamedOnnxValue[]
        //     {
        //         NamedOnnxValue.CreateFromTensor("input", inputTensor)

        //     };
        //     // Run inference (generate embeddings)
        //     var results = _session.Run(inputs);
        //     Console.WriteLine($"Result: {results}");

        //     // Get the embeddings from the result
        //     var output = results.FirstOrDefault()?.AsTensor<float>();
        //     Console.WriteLine($"Output: {results}");


        //     var embeddings = output?.ToArray() ?? Array.Empty<float>();

        //     return embeddings;
        // }

        public static Dictionary<string, int[][]> Tokenize(string text)
        {
            var scriptPath = Path.Combine("..", "onnx_env", "tokenizer", "tokenizer.py");

            var psi = new ProcessStartInfo
            {
                FileName = "python",
                Arguments = $"\"{scriptPath}\" \"{text}\"",
                RedirectStandardOutput = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = new Process { StartInfo = psi };
            process.Start();
            string result = process.StandardOutput.ReadToEnd();
            process.WaitForExit();

            return JsonSerializer.Deserialize<Dictionary<string, int[][]>>(result);
        }

        public float[] GetEmbeddingsForSentence(string sentence)
        {
            var encodedDescription = Tokenize(sentence);
            Console.WriteLine($"Encoded Description: {encodedDescription}");



            // Step 1: Create the input tensor for a single sentence
            var inputTensor = new DenseTensor<string>(new[] { sentence }, new[] { 1 }); // Single sentence as input

            foreach (var input in _session.InputMetadata)
            {
                Console.WriteLine($"Input Name: {input.Key}, Type: {input.Value.ElementType}");
            }
            // Step 2: Create input named "input" for the model
            var inputs = new NamedOnnxValue[]
            {
                NamedOnnxValue.CreateFromTensor("input", inputTensor)
            };

            // Step 3: Run inference (generate embeddings)
            var results = _session.Run(inputs);
            Console.WriteLine($"Result: {results}");


            // Step 4: Get the embeddings from the result
            var output = results.FirstOrDefault()?.AsTensor<float>();
            Console.WriteLine($"Output: {results}");


            // Step 5: Convert tensor to array and handle null case
            var embeddings = output?.ToArray() ?? Array.Empty<float>();

            return embeddings;
        }


        public void Dispose()
        {
            _session?.Dispose();
        }


    }
}