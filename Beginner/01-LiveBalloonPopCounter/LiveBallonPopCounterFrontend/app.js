document.getElementById("startBtn").addEventListener("click", () => {
    window.location.href = 'app.html';
});

function currentLangSafe() {
    return document.documentElement.lang || "ar";
}