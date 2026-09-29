# SignalRProjects

A series of real-time applications built with **ASP.NET Core SignalR**, growing from simple shared-state demos to full Angular apps. Every project is small enough to understand in one sitting and focused on one idea: **many people, one live state**.

## The Idea

Each project answers the same question in a different setting: *what happens when everyone sees the same thing at the same time?* A balloon popped on one screen bursts on all of them, a queue updates the moment an order is ready, a scoreboard moves as the dart lands.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | ASP.NET Core + SignalR Hubs |
| Frontend (1–15) | HTML + CSS + TypeScript (no framework) |
| Frontend (16–30) | Angular: standalone components, Signals, RxJS, guards and interceptors |
| Auth | HttpOnly cookie + refresh token |

## Authentication Rule

All projects use **HttpOnly cookies with a refresh-token flow**. Tokens are **never stored in `localStorage`**, in any project, with no exceptions. The point is to practice secure authentication alongside real-time communication, not just the real-time part.

## Roadmap

### Beginner (1–10): HTML / CSS / TypeScript

| # | Project | Status |
|---|---------|--------|
| 01 | [Live Balloon Pop Counter](./Beginner/01-LiveBalloonPopCounter): everyone pops balloons together toward a shared goal | Done |
| 02 | Real-time Classroom "Pop Quiz" Buzzer Light | In progress |
| 03 | Live Fireworks Show Trigger Board: one person launches, everyone sees it fire at once | Planned |
| 04 | Real-time Shared Household Grocery List: items checked off live by everyone in the house | Planned |
| 05 | Live "High Five" Wall: tap to send a virtual high five, animated across every screen | Planned |
| 06 | Real-time Coffee Shop Order-Ready Buzzer Board | Planned |
| 07 | Live Classroom Mood Check-in Board: students tap an emoji, the teacher sees the live mood spread | Planned |
| 08 | Real-time Shared Alarm Snooze Battle: a playful race for who snoozes last | Planned |
| 09 | Live Plant Growth Race: virtual plants grow as people water them, racing live | Planned |
| 10 | Real-time Office Noise Level Meter: a shared simulated noise-level bar for an open office | Planned |

### Intermediate (11–20)

| # | Project | Frontend | Status |
|---|---------|----------|--------|
| 11 | Multiplayer Word Association Chain Game | HTML/CSS/TS | Planned |
| 12 | Live Food Truck Rally Queue Board | HTML/CSS/TS | Planned |
| 13 | Real-time Vitals Monitor Simulation Dashboard: several simulated patients, live charts | HTML/CSS/TS | Planned |
| 14 | Live Airport Baggage Carousel Status Board | HTML/CSS/TS | Planned |
| 15 | Real-time Community Garden Plot Reservation Board | HTML/CSS/TS | Planned |
| 16 | Live Warehouse Forklift Position Tracker | Angular | Planned |
| 17 | Real-time Multiplayer Chess Clock & Match Board | Angular | Planned |
| 18 | Live Conference Q&A + Upvote Board | Angular | Planned |
| 19 | Real-time Hotel Housekeeping Status Board | Angular | Planned |
| 20 | Live Multiplayer Darts Scoreboard | Angular | Planned |

### Advanced (21–30): Angular

Coming soon.

## Repository Structure

```
SignalRProjects/
├── Beginner/
│   └── 01-LiveBalloonPopCounter/
├── Intermediate/
├── SignalRProjects.slnx
└── .gitignore
```

Projects are numbered and grouped by level. Each one contains its own ASP.NET Core backend and frontend.

## Getting Started

### Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) (a recent version with `.slnx` support)
- [Node.js](https://nodejs.org/) (and the [Angular CLI](https://angular.dev/tools/cli) for projects 16 and up)

### Clone

```bash
git clone https://github.com/IbrahimShafiq4/SignalRProjects.git
cd SignalRProjects
```

### Run a project

```bash
cd Beginner/01-LiveBalloonPopCounter
```

Then start the backend and open the frontend as described in that project's own folder. Open the app in **two or more browser tabs** to see the real-time behavior.

> Check each project's `appsettings.json` for any required configuration.

## Author

**Ibrahim Shafiq Abd El-Shafi**

- GitHub: [@IbrahimShafiq4](https://github.com/IbrahimShafiq4)
