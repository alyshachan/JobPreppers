using Stream;
using Stream.Models;
using System;
using StreamChat.Clients;
using StreamChat.Models;

namespace JobPreppersDemo.Services
{
    public class StreamService
    {
        public StreamClient Client { get; private set; } // getstream feed client
        public StreamClientFactory ChatClientFactory { get; private set; } // getstream user client factory

        public IChannelClient ChatChannelClient {get; private set;}
        public string var {get; private set;}
        private string apiKey = Environment.GetEnvironmentVariable("STREAM_API_KEY");
        private string apiSecret = Environment.GetEnvironmentVariable("STREAM_API_SECRET");
        public StreamService()
        {
            // string apiKey = Environment.GetEnvironmentVariable("STREAM_API_KEY");
            // string apiSecret = Environment.GetEnvironmentVariable("STREAM_API_SECRET");

            Client = new StreamClient(
                Environment.GetEnvironmentVariable("STREAM_API_KEY"), // jobpreppers-app
                Environment.GetEnvironmentVariable("STREAM_API_SECRET"),
                new StreamClientOptions
                {
                    Location = StreamApiLocation.USEast,
                    Timeout = 16000
                });

            ChatClientFactory = new StreamClientFactory(apiKey, apiSecret);

            ChatChannelClient = ChatClientFactory.GetChannelClient();
        }
        public async Task<ChannelGetResponse> CreateDMChannelAsync(string requestingUserID, string receiverUserID) {

            var user1 = await Client.Users.GetAsync(requestingUserID);
            var user2 = await Client.Users.GetAsync(receiverUserID);


            Console.WriteLine("BIG TEXT FNUESIJFSNIFSVD");
            Console.WriteLine(user1.Data["name"]);
            Console.WriteLine(user2.Data["name"]);


            var channelData = new ChannelRequest {
                CreatedBy = new UserRequest {Id = requestingUserID},
                Members = new List<ChannelMember> {
                        new ChannelMember {UserId = requestingUserID, Role = "member"},
                        new ChannelMember {UserId = receiverUserID, Role = "member"}
                    },
            };
            var channel = await ChatChannelClient.GetOrCreateAsync("messaging", new ChannelGetRequest {
                Data = channelData
                });

            return channel;
        }
    }
}