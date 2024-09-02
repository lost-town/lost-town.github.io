// مكتبة الأحاديث
const hadiths = [
    "من حسن إسلام المرء تركه ما لا يعنيه.",
    "المسلم من سلم المسلمون من لسانه ويده.",
    "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه.",
];

// توليد حديث جديد
function generateHadith() {
    const randomIndex = Math.floor(Math.random() * hadiths.length);
    const hadith = hadiths[randomIndex];
    document.getElementById('hadith-container').innerText = hadith;
}

// ربط الزر بتوليد الأحاديث
document.getElementById('generate-btn').addEventListener('click', generateHadith);
