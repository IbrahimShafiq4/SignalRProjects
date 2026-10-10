const root     = document.documentElement;
const themeBtn = document.getElementById("themeToggle");

function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeBtn.textContent = theme === "dark" ? "🌆" : "🌌";
    themeBtn.setAttribute(
        "aria-label",
        theme === "dark" ? "التبديل لوضع الشفق" : "التبديل لوضع منتصف الليل"
    );
}

setTheme("dark");

themeBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
});