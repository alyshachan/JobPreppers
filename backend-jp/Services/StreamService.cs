using Stream;
using Stream.Models;
using System;

namespace JobPreppersDemo.Services {
    public class StreamService {
        public StreamClient Client {get; private set;}
        public StreamService()
        {
            Client = new StreamClient(
                Environment.GetEnvironmentVariable("eyr4ru8mttcv"), // jobpreppers-app
                Environment.GetEnvironmentVariable("tykf9qaxt9jwdpqqzvuk5suf6u7sryhqt7em47rtfja3gahf44h3rurhrw3kth7j"),
                new StreamClientOptions
                {
                    Location = StreamApiLocation.USEast,
                    Timeout = 16000
                });
        }
    }
}