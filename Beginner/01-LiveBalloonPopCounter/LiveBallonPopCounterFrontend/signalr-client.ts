import type { HubConnection } from "@microsoft/signalr";
declare const signalR: typeof import("@microsoft/signalr");

const HUB_URL: string = "https://localhost:7264/hubs/balloon";

const connection: HubConnection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL)
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

const counterEl = document.getElementById("counter") as HTMLElement;
const goalEl = document.getElementById("goal") as HTMLElement;
const popBtn = document.getElementById("popBtn") as HTMLButtonElement;
const celebrationEl = document.getElementById("celebration") as HTMLElement;
const progressFill = document.getElementById("progressFill") as HTMLElement;
const progressBar = document.querySelector(".progress") as HTMLElement;
const statusEl = document.getElementById("status") as HTMLElement;

let celebrationFired: boolean = false;

type StatusState = "wait" | "connected" | "reconnecting" | "disconnected";
type Lang = "ar" | "en";

interface StatusMap {
    wait: string;
    connected: string;
    reconnecting: string;
    disconnected: string;
}

declare global {
    interface Window {
        getCurrentLang?: () => Lang;
    }
}

function setStatus(state: StatusState): void {
    if (!statusEl) return;
    statusEl.dataset.state = state;

    const lang: Lang = (window.getCurrentLang && window.getCurrentLang()) || "ar";

    const map: Record<Lang, StatusMap> = {
        ar: {
            wait: "بيتصل…",
            connected: "متصل ✅",
            reconnecting: "بيعيد الاتصال…",
            disconnected: "انقطع الاتصال ❌"
        },
        en: {
            wait: "Connecting…",
            connected: "Connected ✅",
            reconnecting: "Reconnecting…",
            disconnected: "Disconnected ❌"
        }
    };

    const dict = map[lang] || map.ar;
    statusEl.textContent = dict[state] || dict.wait;
}

function updateCounter(count: number, goal: number): void {
    counterEl.textContent = count.toString();
    goalEl.textContent = goal.toString();

    const pct: number = goal > 0 ? Math.min(100, (count / goal) * 100) : 0;
    progressFill.style.width = pct + "%";
    progressBar.setAttribute("aria-valuenow", String(count));
    progressBar.setAttribute("aria-valuemax", String(goal));

    if (count >= goal && !celebrationFired) {
        celebrationFired = true;
        popBtn.disabled = true;
        showCelebration();
    }
}

function showCelebration(): void {
    celebrationEl.classList.remove("hidden");
    celebrationEl.classList.add("celebration--show");
    burstConfetti();
}

function burstConfetti(): void {
    const colors: string[] = ["#d4a62a", "#e07856", "#a99bc4", "#6fae7a", "#cabfe0"];
    const rect: DOMRect = celebrationEl.getBoundingClientRect();
    const cx: number = rect.left + rect.width / 2;
    const cy: number = rect.top + rect.height / 2;

    for (let i = 0; i < 50; i++) {
        const piece: HTMLSpanElement = document.createElement("span");
        piece.className = "confetti-piece";
        piece.style.left = cx + "px";
        piece.style.top = cy + "px";
        piece.style.background = colors[i % colors.length];

        const angle: number = Math.random() * Math.PI * 2;
        const dist: number = 90 + Math.random() * 260;

        piece.style.setProperty("--dx", Math.cos(angle) * dist + "px");
        piece.style.setProperty("--dy", Math.sin(angle) * dist + "px");
        piece.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");

        document.body.appendChild(piece);
        setTimeout((): void => piece.remove(), 1400);
    }
}

connection.on("CounterUpdated", (count: number, goal: number): void => {
    updateCounter(count, goal);
});

connection.on("GoalReached", (): void => {
    if (!celebrationFired) {
        celebrationFired = true;
        popBtn.disabled = true;
        showCelebration();
    }
});

popBtn.addEventListener("click", async (): Promise<void> => {
    if (popBtn.disabled) return;

    popBtn.classList.add("pop-btn--pop");
    setTimeout((): void => popBtn.classList.remove("pop-btn--pop"), 260);

    try {
        await connection.invoke("PopBalloon");
    } catch (err: unknown) {
        console.error("Failed to pop balloon:", err);
    }
});

connection.onreconnecting((): void => setStatus("reconnecting"));
connection.onreconnected((): void => setStatus("connected"));
connection.onclose((): void => {
    setStatus("disconnected");
    setTimeout(start, 3000);
});

async function start(): Promise<void> {
    setStatus("wait");
    try {
        await connection.start();
        console.log("✅ Connected to BalloonHub");
        setStatus("connected");
    } catch (err: unknown) {
        console.error("❌ Connection failed, retrying in 3s:", err);
        setStatus("disconnected");
        setTimeout(start, 3000);
    }
}

window.addEventListener("langchange", (): void => {
    const state = (statusEl.dataset.state as StatusState) || "wait";
    setStatus(state);
});

start();

export { };