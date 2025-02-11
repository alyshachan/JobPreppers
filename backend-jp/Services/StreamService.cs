using Stream;
using Stream.Models;
using System;

namespace JobPreppersDemo.Services {
    public class StreamService {
        public StreamClient Client {get; private set;}
        public StreamService()
        {
            Client = new StreamClient(
                Environment.GetEnvironmentVariable("STREAM_API_KEY"), // jobpreppers-app
                Environment.GetEnvironmentVariable("STREAM_API_SECRET"),
                new StreamClientOptions
                {
                    Location = StreamApiLocation.USEast,
                    Timeout = 16000
                });
        }
    }
}