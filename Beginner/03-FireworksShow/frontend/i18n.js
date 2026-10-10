const translations = {
    ar: {
        liveBadge:      "يُبَث الآن",
        heroTitle:      "FIREWORKS SHOW",
        heroSubtitle:   "واحد بس بيطلق، والكل شايف السما تنور في نفس اللحظة.",
        ctaStart:       "🚀 أطلق",
        storyEyebrow:   "المشروع الثالث · SignalR",
        whyTitle:       "ليه المشروع دا تحديدًا؟",
        whyBody1:       "في المشروعين اللي فاتوا، أي حد متصل كان يقدر يبعت الحدث. هنا أول مرة بيبقى فيه فرق: أول واحد يفتح الصفحة يبقى \"المُطلق\" (host)، والباقي بس بيشوفوا. ده تمهيد بسيط لمفهوم الصلاحيات (roles) اللي هيكبر معانا بعدين في المشاريع المتقدمة.",
        whyBody2:       "الفكرة من عرض ألعاب نارية حقيقي: شخص واحد بيتحكم في زرار الإطلاق، وكل الجمهور اللي واقف بعيد بيشوف نفس اللحظة بالظبط، من غير أي تأخير محسوس بين شاشة وشاشة.",
        roleConnecting: "جارٍ الاتصال…",
        roleHost:       "أنت المُطلق",
        roleSpectator:  "أنت مشاهد",
        rejected:       "انت مش المُطلق، متقدرش تطلق الألعاب النارية!"
    },
    en: {
        liveBadge:      "LIVE NOW",
        heroTitle:      "FIREWORKS SHOW",
        heroSubtitle:   "Only one person launches, and everyone sees the sky light up at the same instant.",
        ctaStart:       "🚀 Launch",
        storyEyebrow:   "Project 3 · SignalR",
        whyTitle:       "Why this project?",
        whyBody1:       "In the previous two projects, any connected client could send the event. Here, for the first time, there's a distinction: the first person to open the page becomes the launcher (host), and everyone else only watches. This lightly introduces the idea of roles, which will grow further in later, more advanced projects.",
        whyBody2:       "The idea comes from a real fireworks show: one person controls the launch button, and every spectator standing at a distance sees the exact same moment, with no noticeable delay between screens.",
        roleConnecting: "Connecting…",
        roleHost:       "You're the launcher",
        roleSpectator:  "You're watching",
        rejected:       "You're not the launcher — you can't fire the show!"
    }
};

let currentLang = "ar";

function applyTranslations(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir  = lang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key] !== undefined) {
            el.textContent = translations[lang][key];
        }
    });

    if (window.__fwRefreshRole) window.__fwRefreshRole();
}

document.getElementById("langToggle").addEventListener("click", () => {
    applyTranslations(currentLang === "ar" ? "en" : "ar");
});

applyTranslations(currentLang);

window.__fwT = (key) => (translations[currentLang] && translations[currentLang][key]) ?? key;