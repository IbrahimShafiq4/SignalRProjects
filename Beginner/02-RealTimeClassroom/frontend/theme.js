var root = document.documentElement;
const themeBtn = document.getElementById("themeToggle");

function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("qb-theme", theme);
    if (themeBtn) themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
}

setTheme(root.getAttribute("data-theme") || "light");

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        const current = root.getAttribute("data-theme");
        setTheme(current === "dark" ? "light" : "dark");
        document.body.setAttribute('data-lang', currentLang)
    });
}