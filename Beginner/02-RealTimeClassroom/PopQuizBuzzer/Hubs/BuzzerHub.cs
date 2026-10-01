using Microsoft.AspNetCore.SignalR;

namespace PopQuizBuzzer.Hubs
{
    public class BuzzerEntry
    {
        public string StudentName { get; set; } = string.Empty;
        public double ElapsedSeconds { get; set; }
    }

    public class BuzzerHub : Hub
    {
        private static bool _isLocked = false;
        private static DateTime _roundStartedAt = DateTime.UtcNow;
        private static readonly List<BuzzerEntry> _entries = new();
        private static readonly object _lockObject = new();

        public async Task BuzzIn(string studentName)
        {
            bool iWonTheRace = false;

            lock (_lockObject)
            {
                var elapsed = (DateTime.UtcNow - _roundStartedAt).TotalSeconds;

                _entries.Add(new BuzzerEntry
                {
                    StudentName = studentName,
                    ElapsedSeconds = elapsed
                });

                if (!_isLocked)
                {
                    _isLocked = true;
                    iWonTheRace = true;
                }
            }

            await Clients.Group("teachers").SendAsync("RankingUpdated", _entries);

            if (iWonTheRace)
                await Clients.Caller.SendAsync("YouWon");
            else
                await Clients.Caller.SendAsync("AlreadyLocked");
        }

        public async Task JoinAsTeacher()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "teachers");
            await Clients.Caller.SendAsync("RankingUpdated", _entries);
        }

        public async Task ResetRound()
        {
            lock (_lockObject)
            {
                _isLocked = false;
                _entries.Clear();
                _roundStartedAt = DateTime.UtcNow;
            }
            await Clients.All.SendAsync("RoundReset");
        }
    }
}