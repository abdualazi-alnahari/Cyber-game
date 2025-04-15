const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spinBtn");
const questionText = document.getElementById("question");
const optionsDiv = document.getElementById("options");
const scoreDiv = document.getElementById("score");
const timerDiv = document.getElementById("timer");

let currentRotation = 0;
let score = 0;
let answeredQuestions = 0;
let timerInterval;

// الأسئلة لكل مستوى
const allQuestions = {
  easy: [],
  medium: [],
  hard: []
};

// دمج كل الأسئلة في مستوى واحد للتسهيل
const allCyberQuestions = [
  
    // أسئلة اختيار من متعدد
    { question: "ما هو التصيد الإلكتروني (Phishing)؟", options: ["خداع للحصول على معلوماتك", "تشغيل الإنترنت", "مسح الفيروسات"], correct: "خداع للحصول على معلوماتك" },
    { question: "لماذا يجب استخدام المصادقة الثنائية؟", options: ["لزيادة الأمان", "لإبطاء الدخول", "لتغيير كلمة المرور"], correct: "لزيادة الأمان" },
    { question: "ما هو أقوى نوع كلمة مرور؟", options: ["تحتوي على حروف وأرقام ورموز", "اسم المستخدم", "تاريخ الميلاد"], correct: "تحتوي على حروف وأرقام ورموز" },
    { question: "ما هو معنى VPN؟", options: ["شبكة افتراضية خاصة", "مشغل فيديو", "جهاز حماية"], correct: "شبكة افتراضية خاصة" },
    { question: "ما هو جدار الحماية (Firewall)؟", options: ["يحمي من التهديدات", "يرفع سرعة الإنترنت", "ينظف الجهاز"], correct: "يحمي من التهديدات" },
    { question: "ما المقصود بالهندسة الاجتماعية؟", options: ["خداع الناس للحصول على معلومات", "بناء شبكات", "تصميم المواقع"], correct: "خداع الناس للحصول على معلومات" },
    { question: "ما الفرق بين https و http؟", options: ["https آمن", "http أسرع", "لا فرق"], correct: "https آمن" },
    { question: "ما هو الهدف من تحديث البرامج؟", options: ["إصلاح ثغرات الأمان", "استهلاك البطارية", "إبطاء الجهاز"], correct: "إصلاح ثغرات الأمان" },
  
    // أسئلة رتب الجملة الصحيحة
    { question: "رتب الجملة الصحيحة: [استخدم, كلمة مرور, قوية]", options: ["كلمة مرور استخدم قوية", "استخدم كلمة مرور قوية", "قوية استخدم كلمة مرور"], correct: "استخدم كلمة مرور قوية" },
    { question: "رتب الجملة: [لا, معلوماتك, تشارك, الشخصية]", options: ["لا تشارك معلوماتك الشخصية", "معلوماتك لا تشارك الشخصية", "الشخصية لا معلوماتك تشارك"], correct: "لا تشارك معلوماتك الشخصية" },
    { question: "رتب الجملة: [الأمان, مهم, جدًا]", options: ["مهم الأمان جدًا", "الأمان مهم جدًا", "جداً الأمان مهم"], correct: "الأمان مهم جدًا" },
    { question: "رتب الجملة: [لا, تفتح, روابط, مشبوهة]", options: ["لا تفتح روابط مشبوهة", "تفتح لا روابط مشبوهة", "مشبوهة لا تفتح روابط"], correct: "لا تفتح روابط مشبوهة" },
  
    // أسئلة صح وخطأ أو اختر الأصح
    { question: "هل من الآمن مشاركة كلمة المرور مع الأصدقاء؟", options: ["لا", "نعم"], correct: "لا" },
    { question: "ما هو الخيار الأفضل لحماية حساباتك؟", options: ["استخدام نفس كلمة المرور لكل حساب", "المصادقة الثنائية", "عدم استخدام كلمات مرور"], correct: "المصادقة الثنائية" },
    { question: "هل من الآمن الاتصال بأي شبكة Wi-Fi عامة؟", options: ["لا", "نعم"], correct: "لا" },
    { question: "أي من التالي آمن أكثر؟", options: ["VPN موثوق", "تحميل من مصادر غير معروفة", "عدم تحديث التطبيقات"], correct: "VPN موثوق" },
  
    // أسئلة مفاهيم وهجمات
    { question: "ما هي برمجيات الفدية (Ransomware)؟", options: ["تشفير الملفات وطلب فدية", "حذف الملفات مباشرة", "مضاد فيروسات"], correct: "تشفير الملفات وطلب فدية" },
    { question: "ماذا يعني التشفير؟", options: ["تحويل البيانات لصيغة غير مفهومة", "حذف البيانات", "إعادة تشغيل الجهاز"], correct: "تحويل البيانات لصيغة غير مفهومة" },
    { question: "ما هو التصيد الصوتي (Vishing)؟", options: ["احتيال عبر مكالمات هاتفية", "تشغيل تطبيقات", "نسخ الملفات"], correct: "احتيال عبر مكالمات هاتفية" },
    { question: "ما هو هجوم Brute Force؟", options: ["تخمين كلمات المرور", "تشغيل الشبكة", "مسح الملفات"], correct: "تخمين كلمات المرور" },
  
    // أسئلة تعليمية تطبيقية
    { question: "أين يجب حفظ كلمات المرور؟", options: ["في مدير كلمات مرور آمن", "في ورقة على المكتب", "في تطبيق الملاحظات العادي"], correct: "في مدير كلمات مرور آمن" },
    { question: "ما هو الخيار الأفضل عند تلقي بريد مشبوه؟", options: ["تجاهله أو حذفه", "الرد عليه", "فتح الرابط فورًا"], correct: "تجاهله أو حذفه" },
    { question: "ما هو التحديث الأمني؟", options: ["تحديثات لسد الثغرات", "تغيير واجهة التطبيق", "إعلانات جديدة"], correct: "تحديثات لسد الثغرات" },
    { question: "ما هو أثر استخدام برامج مقرصنة؟", options: ["تعرض الجهاز للاختراق", "تسريع الأداء", "زيادة الأمان"], correct: "تعرض الجهاز للاختراق" },
    { question: "متى يجب تغيير كلمة المرور؟", options: ["بشكل دوري أو عند الشك", "مرة واحدة للأبد", "كل يوم"], correct: "بشكل دوري أو عند الشك" },
    { question: "هل كلمة المرور '123456' آمنة؟", options: ["لا", "نعم"], correct: "لا" },
    { question: "لماذا لا يُنصح باستخدام نفس كلمة المرور في كل المواقع؟", options: ["لمنع تسرب جميع الحسابات دفعة واحدة", "لأنه ممل", "لأنه بطيء"], correct: "لمنع تسرب جميع الحسابات دفعة واحدة" },
  
    // إضافية تفاعلية
    { question: "ما هو CAPTCHA؟", options: ["اختبار لتمييز الإنسان عن الآلة", "مشغل فيديو", "أداة ضغط صور"], correct: "اختبار لتمييز الإنسان عن الآلة" },
    { question: "كيف تحمي حسابك على وسائل التواصل؟", options: ["كلمة مرور قوية + مصادقة ثنائية", "كلمة مرور بسيطة", "عدم تسجيل الخروج"], correct: "كلمة مرور قوية + مصادقة ثنائية" }
  ];
  

// توزيع الأسئلة حسب الصعوبة
allCyberQuestions.forEach((q, i) => {
  if (i < 10) allQuestions.easy.push(q);
  else if (i < 20) allQuestions.medium.push(q);
  else allQuestions.hard.push(q);
});

// بناء العجلة
function buildWheel(questions) {
  wheel.innerHTML = "";
  const angle = 360 / questions.length;
  questions.forEach((_, i) => {
    const seg = document.createElement("div");
    seg.classList.add("segment");
    seg.style.transform = `rotate(${i * angle}deg) skewY(-${90 - angle}deg)`;
    seg.style.background = i % 2 === 0 ? "#009688" : "#004d40";
    seg.innerText = `سؤال ${i + 1}`;
    wheel.appendChild(seg);
  });
}

// عرض السؤال
function showQuestion(q) {
  clearInterval(timerInterval);
  questionText.innerText = "❓ " + q.question;
  optionsDiv.innerHTML = "";
  let timeLeft = 15;
  timerDiv.innerText = `⏳ الوقت المتبقي: ${timeLeft} ثانية`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDiv.innerText = `⏳ الوقت المتبقي: ${timeLeft} ثانية`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("⏰ انتهى الوقت! الإجابة الصحيحة: " + q.correct);
      clearUI();
    }
  }, 1000);

  q.options.forEach(opt => {
    const btn = document.createElement("div");
    btn.classList.add("option");
    btn.innerText = opt;
    btn.onclick = () => {
      clearInterval(timerInterval);
      if (opt === q.correct) {
        score++;
      // استكمال دالة عرض السؤال بعد اختيار الإجابة
      alert("✅ إجابة صحيحة!");
    } else {
      alert("❌ إجابة خاطئة! الإجابة الصحيحة: " + q.correct);
    }

    scoreDiv.innerText = `النقاط: ${score}`;
    answeredQuestions++;

    if (answeredQuestions >= 10) {
      alert(`🎉 انتهت اللعبة!\n✅ عدد الإجابات الصحيحة: ${score} من ${answeredQuestions}`);
      resetGame();
    } else {
      clearUI();
    }
  };
  optionsDiv.appendChild(btn);
});
}

// إعادة تعيين واجهة السؤال
function clearUI() {
questionText.innerText = "";
optionsDiv.innerHTML = "";
timerDiv.innerText = "";
}

// إعادة تعيين اللعبة
function resetGame() {
score = 0;
answeredQuestions = 0;
scoreDiv.innerText = "النقاط: 0";
clearUI();
}

// تدوير العجلة واختيار سؤال عشوائي
spinBtn.addEventListener("click", () => {
const difficulty = document.getElementById("difficulty").value;
const questions = allQuestions[difficulty];

if (!questions.length) {
  alert("لا توجد أسئلة متاحة لهذا المستوى.");
  return;
}

const randomIndex = Math.floor(Math.random() * questions.length);
const anglePerSegment = 360 / questions.length;
const targetRotation = 3600 + (randomIndex * anglePerSegment);
currentRotation += targetRotation;

wheel.style.transform = `rotate(${currentRotation}deg)`;

setTimeout(() => {
  showQuestion(questions[randomIndex]);
}, 4000);
});

// بناء العجلة عند بدء الصفحة
window.onload = () => {
const difficulty = document.getElementById("difficulty").value;
buildWheel(allQuestions[difficulty]);

document.getElementById("difficulty").addEventListener("change", () => {
  const diff = document.getElementById("difficulty").value;
  buildWheel(allQuestions[diff]);
});
};

