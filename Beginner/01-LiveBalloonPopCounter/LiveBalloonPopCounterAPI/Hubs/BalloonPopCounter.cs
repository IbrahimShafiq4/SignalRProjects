using Microsoft.AspNetCore.SignalR;

namespace LiveBalloonPopCounterAPI.Hubs
{
    public class BalloonPopCounter: Hub
    {
        private static          int _ballonCount = 0;
        private static readonly int _goal        = 500;

        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("CounterUpdated", _ballonCount, _goal);
            await base.OnConnectedAsync();
        }

        public async Task PopBalloon()
        {
            _ballonCount++;

            await Clients.All.SendAsync("CounterUpdated", _ballonCount, _goal);

            if (_ballonCount == _goal) { await Clients.All.SendAsync("GoalReached"); }
        }
    }
}
