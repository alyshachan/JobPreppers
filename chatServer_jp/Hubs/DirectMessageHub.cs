using Microsoft.AspNetCore.SignalR;

namespace chatServer_jp.Hubs
{
    public class DirectMessageHub : Hub
    {
        // k: userID, v: connectionId
        private static readonly Dictionary<int, string> _userConnectionIDs = new Dictionary<int, string>();

        public async Task SendMessageToAll(string user, string message){
            Console.WriteLine("someone invoked SendMessageToAll");
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task SendDirectMessage(string user, int receiverID, string message) {
            if (_userConnectionIDs.ContainsKey(receiverID)) {
                var receiverConnectionID = _userConnectionIDs[receiverID];
                await Clients.Client(receiverConnectionID).SendAsync("ReceiveDirectMessage", user, message);
            }
            else {
                Console.WriteLine("Someone tried to send a message to a nonexistent person");
            }
        }

        public override async Task OnConnectedAsync()
        {
            // foreach (var claim in Context.User.Claims)
            //     {
            //         Console.WriteLine($"Claim Type: {claim.Type}, Claim Value: {claim.Value}");
            //     }
            int userID = int.Parse(Context.User?.Claims.FirstOrDefault(c => c.Type == "userID")?.Value);
            var otheruserID = Context.User.Identity.Name;
            string connectionID = Context.ConnectionId;

            Console.WriteLine($"boss.. i think someone connected");
            if (userID != null) {
                Console.WriteLine($"{userID} connected with connectionID:");
                Console.WriteLine(connectionID);
                _userConnectionIDs[userID] = connectionID;
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
    }
}