using Microsoft.AspNetCore.SignalR;

namespace FireworksShowAPI.Hubs
{
    public class LaunchEvent
    {
        public DateTime LaunchedAt { get; set; }
    }

    public class FireworksHub : Hub
    {
        private static string? _hostConnectionId;
        private static readonly List<LaunchEvent> _recentLaunches = new();
        private static readonly object _lock = new();

        public override async Task OnConnectedAsync()
        {
            bool isNewHost = false;

            lock (_lock)
            {
                if (_hostConnectionId is null)
                {
                    _hostConnectionId = Context.ConnectionId;
                    isNewHost = true;
                }
            }

            await Clients.Caller.SendAsync("RoleAssigned", isNewHost);
            await Clients.Caller.SendAsync("RecentLaunchesSync", _recentLaunches.ToList());

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            lock (_lock)
            {
                if (_hostConnectionId == Context.ConnectionId)
                {
                    _hostConnectionId = null;
                }
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task Launch()
        {
            if (Context.ConnectionId != _hostConnectionId)
            {
                await Clients.Caller.SendAsync("LaunchRejected");
                return;
            }

            var launchEvent = new LaunchEvent { LaunchedAt = DateTime.UtcNow };

            lock (_lock)
            {
                _recentLaunches.Add(launchEvent);
                if (_recentLaunches.Count > 2)
                    _recentLaunches.RemoveAt(0);
            }

            await Clients.All.SendAsync("FireworksLaunched", launchEvent);
        }
    }
}