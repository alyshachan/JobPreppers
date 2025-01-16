using Microsoft.AspNetCore.SignalR;

namespace chatServer_jp.Hubs
{
    public class DirectMessageHub : Hub
    {
        // private static readonly 
        public async Task SendMessageToAll(string user, string message){
            Console.WriteLine("someone invoked SendMessageToAll");
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public override async Task OnConnectedAsync()
        {
            var userID = Context.User?.Claims.FirstOrDefault(c => c.Type == "userID")?.Value;

            Console.WriteLine($"boss.. i think someone connected");
            if (userID != null) {
                Console.WriteLine($"{userID} connected");
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? e)
        {
            var userID = Context.UserIdentifier;
            
            // if (userID != null) {

            // }
            Console.WriteLine("disconnected :o");
            await base.OnDisconnectedAsync(e);
        }

        // public async Task SendDirectMessage(string receiverID, string message) {
            
        // }
    }
}