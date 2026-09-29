const translations = {
    ar: {
        brand: "عداد فرقعة البالونات",
        heroTitle: "عداد فرقعة البالونات — Live",
        heroSubtitle: "كل واحد فاتح الصفحة بيفرقع بالونة، والعداد بيتحدث فورًا لكل الناس.",
        ctaStart: "ابدأ الفرقعة",
        whyTitle: "ليه المشروع ده تحديدًا؟",
        whyBody1: "ده أول مشروع في السلسة الجديدة، ولازم يكون أبسط حاجة ممكنة عشان دماغك تتعلم الفكرة الأساسية لـ SignalR من غير أي تعقيد حواليها: حد بيعمل حدث، السيرفر بياخده، وكل الناس التانيين بيشوفوا نتيجته على طول من غير ريفريش.",
        whyBody2: "الفكرة مستوحاة من عيد ميلاد حقيقي: تخيل إن في هدف مشترك — يوصل لـ 500 بالونة مفرقعة — وكل ضيف في الحفلة بيفرقع بالونات من موبايله، والعداد بيتحرك قدام عين الكل في نفس اللحظة. مفيش تسجيل دخول، مفيش صلاحيات، مفيش database — بس حدث واحد بسيط بينتقل.",

        goalLabel: "الهدف المشترك",
        popBtn: "فرقع بالونة! 🎈",
        celebrationText: "🎉 وصلنا للهدف! 🎉"
    },
    en: {
        brand: "Live Balloon Pop Counter",
        heroTitle: "Live Balloon Pop Counter",
        heroSubtitle: "Everyone on the page pops a balloon, and the shared counter updates instantly for all.",
        ctaStart: "Start Popping",
        whyTitle: "Why this project?",
        whyBody1: "This is project one on the track, and it needs to be the simplest possible thing so your brain learns the core SignalR idea with zero surrounding complexity: someone triggers an event, the server receives it, and everyone else sees the result instantly with no refresh.",
        whyBody2: "The idea is inspired by a real birthday party: imagine a shared goal — reach 500 popped balloons — and every guest at the party pops balloons from their own phone, with the counter moving in front of everyone's eyes at the same moment. No login, no roles, no complex database — just one simple event traveling at the speed of light.",

        goalLabel: "Shared goal",
        popBtn: "Pop a balloon! 🎈",
        celebrationText: "🎉 Goal reached! 🎉"
    }
};

let currentLang = "ar";

window.getCurrentLang = () => currentLang;

function applyTranslations(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    window.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
}

const langToggleBtn = document.getElementById("langToggle");
if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
        applyTranslations(currentLang === "ar" ? "en" : "ar");
    });
}

applyTranslations(currentLang);