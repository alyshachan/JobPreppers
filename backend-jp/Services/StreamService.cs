using Stream;
using Stream.Models;
using System;
using StreamChat.Clients;

namespace JobPreppersDemo.Services
{
    public class StreamService
    {
        public StreamClient Client { get; private set; }
        public StreamClientFactory ChatClientFactory {get; private set;}
        public StreamService()
        {
            string apiKey = Environment.GetEnvironmentVariable("STREAM_API_KEY");
            string apiSecret = Environment.GetEnvironmentVariable("STREAM_API_SECRET");

            Client = new StreamClient(
                Environment.GetEnvironmentVariable("STREAM_API_KEY"), // jobpreppers-app
                Environment.GetEnvironmentVariable("STREAM_API_SECRET"),
                new StreamClientOptions
                {
                    Location = StreamApiLocation.USEast,
                    Timeout = 16000
                });

            ChatClientFactory = new StreamClientFactory(apiKey, apiSecret);
        }
    }
}