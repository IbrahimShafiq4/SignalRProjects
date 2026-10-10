import * as signalR from '@microsoft/signalr';

interface ILaunchEvent {
    launchedAt: string;
}

var connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5000/hubs/fireworks")
    .withAutomaticReconnect()
    .build();

const launchBtn = document.getElementById("launchBtn") as HTMLButtonElement;
const roleLabel = document.getElementById("roleLabel") as HTMLElement;
const skyEl = document.getElementById("sk") as HTMLElement;

let isHost = false;

connection.on("RoleAssigned", (hostStatus: boolean) => {
    isHost = hostStatus;

    if (isHost) {
        roleLabel.textContent = "أنت المُطلق";
        launchBtn.style.display = "inline-block";
    } else {
        roleLabel.textContent = "أنت مشاهد";
        launchBtn.style.display = "none";
    }
});

connection.on("RecentLaunchesSync", (launches: ILaunchEvent[]) => {
    console.log(`Synced with ${launches.length} recent Launches`);
})

connection.on("FireworksLaunched", (_event: ILaunchEvent) => {
    triggerFireworkAnimation();
});

connection.on("LaunchRejected", () => {
    alert("انت مش المُطلق، متقدرش تطلق الألعاب النارية!");
});

function triggerFireworkAnimation(): void {
    const burst = document.createElement("div");
    burst.className = "live-burst";
    burst.style.left = `${20 + Math.random() * 60}%`;
    burst.style.top = `${20 + Math.random() * 40}%`;
    skyEl.appendChild(burst);
    setTimeout(() => burst.remove(), 1200);
}

launchBtn.addEventListener("click", () => {
    connection.invoke("Launch").catch((err) => {
        console.error("Launch failed:", err);
    });
});

async function start(): Promise<void> {
    try {
        await connection.start();
        console.log("Connected to FireworksHub ✅");
    } catch (err) {
        console.error("Connection failed, retrying in 3s:", err);
        setTimeout(start, 3000);
    }
}

start();