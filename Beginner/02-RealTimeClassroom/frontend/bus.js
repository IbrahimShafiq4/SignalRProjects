const CH = "qb-bus";
const KEY = "qb-state";
const channel = new BroadcastChannel(CH);
const clientId = crypto.randomUUID();

const handlers = new Map();

export const bus = {
    on(event, cb) {
        if (!handlers.has(event)) handlers.set(event, []);
        handlers.get(event).push(cb);
    },

    async start() {},

    async invoke(method, ...args) {
        if (method === "BuzzIn") return buzz(args[0]);
        if (method === "ResetRound") return reset();
        if (method === "JoinAsTeacher") return emitLocal("RankingUpdated", readState().entries);
    },

    onreconnecting() { }, onreconnected() { }, onclose() { }
};

function emitLocal(event, payload) {
    (handlers.get(event) || []).forEach(cb => cb(payload));
}
function broadcast(event, payload) {
    channel.postMessage({ event, payload });
}
channel.onmessage = (e) => emitLocal(e.data.event, e.data.payload);

function readState() {
    try {
        return JSON.parse(localStorage.getItem(KEY)) ||
            { locked: false, startTime: Date.now(), entries: [] };
    } catch {
        return { locked: false, startTime: Date.now(), entries: [] };
    }
}
function writeState(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

function reset() {
    writeState({ locked: false, startTime: Date.now(), entries: [] });
    broadcast("RoundReset", {});
    emitLocal("RoundReset", {});
}

async function buzz(name) {
    const doBuzz = () => {
        const s = readState();
        if (s.locked) {
            emitLocal("AlreadyLocked", {});
            return;
        }
        s.locked = true;
        const elapsed = ((Date.now() - s.startTime) / 1000).toFixed(3);
        s.entries.push({ studentName: name, elapsedSeconds: elapsed, _cid: clientId });
        writeState(s);

        const clean = s.entries.map(({ _cid, ...rest }) => rest);
        broadcast("RankingUpdated", clean);
        broadcast("AlreadyLocked", {});
        emitLocal("RankingUpdated", clean);
        emitLocal("YouWon", {});
    };

    if (navigator.locks) {
        await navigator.locks.request("qb-buzz", doBuzz);
    } else {
        doBuzz();
    }
}