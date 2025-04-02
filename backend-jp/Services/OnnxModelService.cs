using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
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


        public float[] GetEmbeddingsForSentence(string sentence)
        {
            // Create a tokenizer instance

            var encoded = _tokenizer.Encode(384, sentence);


            // Extract token IDs, attention mask, and token type IDs
            var inputIds = encoded.Select(t => t.InputIds).ToArray();
            var attentionMask = encoded.Select(t => t.AttentionMask).ToArray();
            var typeIds = encoded.Select(t => t.TokenTypeIds).ToArray();


            // Create input tensors for ONNX model
            var inputTensors = new List<NamedOnnxValue>
            {
                NamedOnnxValue.CreateFromTensor("input_ids", new DenseTensor<long>(inputIds, new[] { 1, inputIds.Length })),
                NamedOnnxValue.CreateFromTensor("attention_mask", new DenseTensor<long>(attentionMask, new[] { 1, attentionMask.Length })),
                NamedOnnxValue.CreateFromTensor("token_type_ids", new DenseTensor<long>(typeIds, new[] { 1, typeIds.Length }))
            };

            using var results = _session.Run(inputTensors);

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

                return meanEmbedding;
            }
            else
            {
                Console.WriteLine("Unexpected tensor shape or empty output.");
                return Array.Empty<float>();
            }

        }


        public void Dispose()
        {
            _session?.Dispose();
        }


    }
}