import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7053/hubs/buzzer")
    .withAutomaticReconnect()
    .build();

const buzzerBtn = document.getElementById("buzzerBtn") as HTMLButtonElement;
const statusEl = document.getElementById("status") as HTMLElement;

const studentName = prompt("اكتب اسمك:") || "طالب مجهول";

connection.on("YouWon", () => {
    statusEl.textContent = "🎉 برافو! انت أول واحد ضغط!";
    buzzerBtn.disabled = true;
    buzzerBtn.classList.add("won");
});

connection.on("AlreadyLocked", () => {
    statusEl.textContent = "😅 حد سبقك بالضغطة!";
    buzzerBtn.disabled = true;
});

connection.on("RoundReset", () => {
    statusEl.textContent = "سؤال جديد! جاهز؟";
    buzzerBtn.disabled = false;
    buzzerBtn.classList.remove("won");
});

buzzerBtn.addEventListener("click", () => {
    buzzerBtn.disabled = true;
    connection.invoke("BuzzIn", studentName).catch((err) => {
        console.error("Buzz failed:", err);
        buzzerBtn.disabled = false;
    });
});

async function start(): Promise<void> {
    try {
        await connection.start();
        console.log("Student connected ✅");
    } catch (err) {
        console.error("Connection failed, retrying in 3s:", err);
        setTimeout(start, 3000);
    }
}

start();