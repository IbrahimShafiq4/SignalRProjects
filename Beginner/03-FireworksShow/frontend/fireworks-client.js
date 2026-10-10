import * as signalR from "@microsoft/signalr";

const launchBtn = document.getElementById("launchBtn");
const roleLabel = document.getElementById("roleLabel");
const skyEl = document.getElementById("sk");
const starsEl = document.getElementById("stars");
const windowsEl = document.querySelector(".city__windows");
const decorRays = document.querySelectorAll(".decor__rays");

const rand = (min, max) => min + Math.random() * (max - min);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const BURST_COLORS = ["#ff3d68", "#ffca3a", "#5eead4", "#ff8c42", "#c084fc", "#f7f3ea"];

function seedStars(count = 80) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const s = document.createElement("span");
        s.className = "star";
        const size = Math.random() < 0.88 ? 1 : 2;
        s.style.width = `${size}px`;
        s.style.height = `${size}px`;
        s.style.left = `${Math.random() * 100}%`;
        s.style.top = `${Math.random() * 80}%`;
        s.style.animationDelay = `${Math.random() * 4}s`;
        s.style.animationDuration = `${3 + Math.random() * 3}s`;
        frag.appendChild(s);
    }
    starsEl.appendChild(frag);
}

function seedWindows(count = 60) {
    if (!windowsEl) return;
    const NS = "http://www.w3.org/2000/svg";
    const frag = document.createDocumentFragment();

    // نوزّع الشبابيك على منطقة المبانٍ (y من 120 لـ 240)
    for (let i = 0; i < count; i++) {
        const rect = document.createElementNS(NS, "rect");
        rect.setAttribute("x", rand(40, 1400).toFixed(1));
        rect.setAttribute("y", rand(120, 240).toFixed(1));
        rect.setAttribute("width", "2.5");
        rect.setAttribute("height", "3.5");
        rect.style.animationDelay = `${rand(0, 9).toFixed(2)}s`;
        rect.style.animationDuration = `${rand(6, 12).toFixed(2)}s`;
        frag.appendChild(rect);
    }
    windowsEl.appendChild(frag);
}

function seedDecor(svg) {
    const NS = "http://www.w3.org/2000/svg";
    const rays = svg.querySelector(".decor__rays");
    if (!rays) return;

    const count = 18;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
        const angle = (360 / count) * i + rand(-3, 3);
        const len = rand(26, 40);
        const line = document.createElementNS(NS, "line");
        line.setAttribute("x1", "0");
        line.setAttribute("y1", "0");
        line.setAttribute("x2", "0");
        line.setAttribute("y2", (-len).toFixed(1));
        line.setAttribute("transform", `rotate(${angle.toFixed(1)})`);
        frag.appendChild(line);
    }
    rays.appendChild(frag);
}

function createBurstSVG(color, rayCount) {
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "-60 -60 120 120");
    svg.setAttribute("class", "burst-svg");
    svg.style.left = `${rand(15, 85).toFixed(2)}%`;
    svg.style.top = `${rand(15, 60).toFixed(2)}%`;
    const size = rand(120, 240);
    svg.style.width = `${size}px`;
    svg.style.height = `${size}px`;

    const ring = document.createElementNS(NS, "circle");
    ring.setAttribute("cx", "0");
    ring.setAttribute("cy", "0");
    ring.setAttribute("r", "44");
    ring.setAttribute("fill", "none");
    ring.setAttribute("stroke", color);
    ring.setAttribute("stroke-width", "0.7");
    ring.setAttribute("opacity", "0.85");
    ring.classList.add("burst-svg__ring");

    const raysG = document.createElementNS(NS, "g");
    raysG.setAttribute("class", "burst-svg__rays");

    for (let i = 0; i < rayCount; i++) {
        const angle = (360 / rayCount) * i + rand(-2, 2);
        const len = rand(28, 50);
        const line = document.createElementNS(NS, "line");
        line.setAttribute("x1", "0");
        line.setAttribute("y1", "0");
        line.setAttribute("x2", "0");
        line.setAttribute("y2", (-len).toFixed(1));
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", "0.9");
        line.setAttribute("stroke-linecap", "round");
        line.setAttribute("transform", `rotate(${angle.toFixed(1)})`);
        line.setAttribute("opacity", "0.95");
        raysG.appendChild(line);

        const dot = document.createElementNS(NS, "circle");
        const rad = (angle - 90) * Math.PI / 180;
        dot.setAttribute("cx", (Math.cos(rad) * len).toFixed(2));
        dot.setAttribute("cy", (Math.sin(rad) * len).toFixed(2));
        dot.setAttribute("r", "1.1");
        dot.setAttribute("fill", color);
        dot.setAttribute("opacity", "0.75");
        raysG.appendChild(dot);
    }

    const core = document.createElementNS(NS, "circle");
    core.setAttribute("cx", "0");
    core.setAttribute("cy", "0");
    core.setAttribute("r", "4");
    core.setAttribute("fill", color);
    core.setAttribute("filter", "url(#burstGlow)");
    core.classList.add("burst-svg__core");

    const defs = document.createElementNS(NS, "defs");
    defs.innerHTML = `
        <filter id="burstGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge>
                <feMergeNode in="b"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    `;

    svg.appendChild(defs);
    svg.appendChild(ring);
    svg.appendChild(raysG);
    svg.appendChild(core);
    return svg;
}

function triggerFireworkAnimation() {
    const color = pick(BURST_COLORS);
    const rayCount = 16 + Math.floor(Math.random() * 10);
    const svg = createBurstSVG(color, rayCount);

    skyEl.appendChild(svg);
    setTimeout(() => svg.remove(), 1600);
}

let isHost = false;
let roleStr = "connecting";

function setRole(role) {
    roleStr = role;
    document.body.dataset.role = role;

    if (role === "host") roleLabel.textContent = window.__fwT("roleHost");
    else if (role === "spectator") roleLabel.textContent = window.__fwT("roleSpectator");
    else roleLabel.textContent = window.__fwT("roleConnecting");

    launchBtn.disabled = role !== "host";
    launchBtn.setAttribute("aria-disabled", role !== "host" ? "true" : "false");
}

window.__fwRefreshRole = () => setRole(roleStr);

const HUB_URL = "https://localhost:7272/hubs/fireworks";

const connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL)
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.on("RoleAssigned", (hostStatus) => {
    isHost = !!hostStatus;
    setRole(isHost ? "host" : "spectator");
});

connection.on("RecentLaunchesSync", (launches) => {
    console.log(`Synced with ${launches.length} recent launches`);
});

connection.on("FireworksLaunched", (_event) => {
    triggerFireworkAnimation();
});

connection.on("LaunchRejected", () => {
    flashRejection();
});

let rejectTimer = null;
function flashRejection() {
    clearTimeout(rejectTimer);

    launchBtn.classList.remove("is-pressed");
    void launchBtn.offsetWidth;       
    launchBtn.style.animation = "none";
    requestAnimationFrame(() => {
        launchBtn.animate(
            [
                { transform: "translateX(0)" },
                { transform: "translateX(-6px)" },
                { transform: "translateX(6px)" },
                { transform: "translateX(-4px)" },
                { transform: "translateX(0)" }
            ],
            { duration: 320, easing: "ease-out" }
        );
    });

    roleLabel.textContent = window.__fwT("rejected");
    roleLabel.style.color = "var(--ember)";
    roleLabel.style.borderColor = "rgba(255, 61, 104, 0.5)";

    rejectTimer = setTimeout(() => {
        roleLabel.style.color = "";
        roleLabel.style.borderColor = "";
        setRole(roleStr);
    }, 2600);
}

launchBtn.addEventListener("click", () => {
    if (!isHost) {
        flashRejection();
        return;
    }

    launchBtn.classList.remove("is-pressed");
    void launchBtn.offsetWidth;
    launchBtn.classList.add("is-pressed");
    setTimeout(() => launchBtn.classList.remove("is-pressed"), 500);

    connection.invoke("Launch").catch((err) => {
        console.error("Launch failed:", err);
    });
});

seedStars();
seedWindows();
decorRays.forEach(seedDecor);
setRole("connecting");

async function start() {
    try {
        await connection.start();
        console.log("Connected to FireworksHub ✅", HUB_URL);
    } catch (err) {
        console.error("Connection failed, retrying in 3s:", err);
        setTimeout(start, 3000);
    }
}

start();