const translations = {
    ar: {
        brand: "بازر الكويز",
        navStudent: "الطالب",
        navTeacher: "المعلم",
        heroTitle: "مين هيضغط الأول؟",
        heroSubtitle: "المعلم بيسأل، والطلبة بيتسابقوا على البازر. السيرفر بيحدد مين ضغط الأول بدقة الميلي ثانية، وترتيب الكل بيظهر لحظيًا عند المعلم.",
        ctaStart: "جرّب البازر",
        whyTitle: "ليه المشروع ده تحديدًا؟",
        whyBody1: "في Project 1 كل الناس كانوا متساويين — كله بيفرقع بالونة والكل شايف نفس الرقم. هنا أول مرة بيبقى فيه فرقين: طالب بيضغط، ومعلم بيراقب. وأهم حاجة: السيرفر لازم يحسم مين فاز فعلًا لما اتنين يضغطوا في نفس اللحظة تقريبًا — ده مفهوم جديد اسمه server-side locking.",
        whyBody2: "الفكرة من حصة مدرسية حقيقية: المعلم بيسأل سؤال، وكل الطلبة قاعدين بموبايلاتهم مفتوح عندهم بازر كبير. أول واحد يضغط، السيرفر يقفل الجولة فورًا لحد ما المعلم يعمل Reset لسؤال جديد.",

        // student page
        studentTitle: "جاهز؟ اضغط البازر!",
        statusConnecting: "جاري الاتصال بالسيرفر...",
        statusReady: "سؤال جديد! جاهز؟",
        statusWon: "🎉 برافو! انت أول واحد ضغط!",
        statusLocked: "😅 حد سبقك بالضغطة!",
        statusSent: "تم الإرسال...",
        statusWaiting: "في انتظار الاتصال...",
        promptName: "اكتب اسمك:",

        // teacher page
        teacherTitle: "لوحة المعلم — الترتيب",
        resetBtn: "جولة جديدة",
        rankingEmpty: "لا يوجد متسابقون بعد"
    },
    en: {
        brand: "Pop Quiz Buzzer",
        navStudent: "Student",
        navTeacher: "Teacher",
        heroTitle: "Who buzzes in first?",
        heroSubtitle: "The teacher asks, students race for the buzzer. The server resolves who pressed first down to the millisecond, and the full ranking appears live for the teacher.",
        ctaStart: "Try the Buzzer",
        whyTitle: "Why this project?",
        whyBody1: "In Project 1 everyone was equal — everyone popped a balloon and saw the same number. Here, for the first time, there are two roles: a student who presses, and a teacher who watches. And critically: the server has to resolve who actually won when two people press at almost the same instant — a new concept called server-side locking.",
        whyBody2: "The idea comes from a real classroom: the teacher asks a question, and every student has a big buzzer open on their phone. Whoever presses first locks the round instantly, until the teacher resets it for a new question.",

        studentTitle: "Ready? Hit the buzzer!",
        statusConnecting: "Connecting to server...",
        statusReady: "New question! Ready?",
        statusWon: "🎉 Bravo! You buzzed first!",
        statusLocked: "😅 Someone beat you to it!",
        statusSent: "Sending...",
        statusWaiting: "Waiting for connection...",
        promptName: "Enter your name:",

        teacherTitle: "Teacher Dashboard — Ranking",
        resetBtn: "New Round",
        rankingEmpty: "No contestants yet"
    }
};

let currentLang = localStorage.getItem("qb-lang") || "ar";

window.t = function (key) {
    return (translations[currentLang] && translations[currentLang][key]) || key;
};

function applyTranslations(lang) {
    currentLang = lang;
    localStorage.setItem("qb-lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.dataset.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    window.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
}

const langToggle = document.getElementById("langToggle");
if (langToggle) {
    langToggle.addEventListener("click", () => {
        applyTranslations(currentLang === "ar" ? "en" : "ar");
    });
}

applyTranslations(currentLang);