import * as signalR from "@microsoft/signalr";

interface BuzzerEntry {
    studentName: string;
    elapsedSeconds: number;
}

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7053/hubs/buzzer")
    .withAutomaticReconnect()
    .build();

const rankingList = document.getElementById("rankingList") as HTMLOListElement;
const resetBtn = document.getElementById("resetBtn") as HTMLButtonElement;

connection.on("RankingUpdated", (entries: BuzzerEntry[]) => {
    rankingList.innerHTML = "";
    entries.forEach((entry) => {
        const li = document.createElement("li");
        li.textContent = `${entry.studentName} (${entry.elapsedSeconds}s)`;
        rankingList.appendChild(li);
    });
});

connection.on("RoundReset", () => {
    rankingList.innerHTML = "";
});

resetBtn.addEventListener("click", () => {
    connection.invoke("ResetRound").catch((err) => {
        console.error("Reset failed:", err);
    });
});

async function start(): Promise<void> {
    try {
        await connection.start();
        await connection.invoke("JoinAsTeacher");
        console.log("Teacher connected ✅");
    } catch (err) {
        console.error("Connection failed, retrying in 3s:", err);
        setTimeout(start, 3000);
    }
}

start();