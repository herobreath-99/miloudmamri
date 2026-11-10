import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth";
import {
  addNotifLog,
  getStoredNotifSettings,
  setStoredNotifSettings,
  getMedications,
  getMedDoseLogs,
  getAppointments,
  getStoredPushSub,
  setStoredPushSub,
  isNotificationDeduplicated,
  recordNotificationDeduplicated,
  todayISO,
  DEFAULT_TIMEZONE,
  type StoredPushSub,
} from "@/lib/local-db";
import {
  getVapidPublicKey,
  savePushSubscription,
  deletePushSubscription,
  sendDirectPush,
} from "@/lib/push.functions";

export type CategoryKey =
  | "medication"
  | "appointment"
  | "examination"
  | "hydration"
  | "skincare"
  | "arm_exercise"
  | "walking"
  | "sleep"
  | "mood_checkin"
  | "motivation"
  | "educational";

export type CategoryConfig = { enabled: boolean; time: string; frequency: number };
export type Categories = Record<CategoryKey, CategoryConfig>;

export type NotifSettings = {
  enabled: boolean;
  permission_granted: boolean;
  sound_enabled: boolean;
  vibration_enabled: boolean;
  vibration_intensity: number;
  quiet_start: string;
  quiet_end: string;
  snooze_minutes: number;
  timezone: string;
  categories: Categories;
  adaptive: Record<string, number>;
};

const DEFAULTS: NotifSettings = {
  enabled: true,
  permission_granted: false,
  sound_enabled: true,
  vibration_enabled: true,
  vibration_intensity: 1.0,
  quiet_start: "22:00",
  quiet_end: "07:00",
  snooze_minutes: 10,
  timezone: DEFAULT_TIMEZONE,
  categories: {
    medication: { enabled: true, time: "09:00", frequency: 1 },
    appointment: { enabled: true, time: "08:30", frequency: 1 },
    examination: { enabled: true, time: "08:30", frequency: 1 },
    hydration: { enabled: true, time: "10:00", frequency: 1 },
    skincare: { enabled: true, time: "21:00", frequency: 1 },
    arm_exercise: { enabled: true, time: "17:00", frequency: 1 },
    walking: { enabled: true, time: "18:00", frequency: 1 },
    sleep: { enabled: true, time: "22:30", frequency: 1 },
    mood_checkin: { enabled: true, time: "20:00", frequency: 1 },
    motivation: { enabled: true, time: "08:30", frequency: 1 },
    educational: { enabled: true, time: "12:00", frequency: 1 },
  },
  adaptive: {},
};

export const CATEGORY_MESSAGES: Record<
  CategoryKey,
  {
    ar: { title: string; body: string };
    dz: { title: string; body: string };
    fr: { title: string; body: string };
    en: { title: string; body: string };
  }
> = {
  medication: {
    ar: {
      title: "💊 تذكير بالدواء الموصوف",
      body: "خطتكِ العلاجية في غاية الأهمية. حان موعد تناول دوائكِ وفق إرشادات فريقك الطبي المعالج.",
    },
    dz: {
      title: "💊 تذكير بالدوا تاعك",
      body: "خطتكِ العلاجية مهمة بزاف. وصل وقت الدوا تاعك على حساب واش قالك الطبيب المعالج.",
    },
    fr: {
      title: "💊 Rappel de médicament",
      body: "Votre plan de traitement est essentiel. Il est temps de prendre votre médicament.",
    },
    en: {
      title: "💊 Prescribed Medication",
      body: "Your health plan matters. It is time to follow the medication instructions confirmed by your care team.",
    },
  },
  appointment: {
    ar: {
      title: "🏥 موعد استشارة طبية",
      body: "موعدكِ الطبي القادم مقترب. الاستعداد المسبق يمنحكِ راحة البال.",
    },
    dz: {
      title: "🏥 رونديفو عند الطبيب",
      body: "الرونديفو الجاي راهو قريب. وجدي روحك باش ترتاحي وماتقلقيش.",
    },
    fr: {
      title: "🏥 Rendez-vous médical",
      body: "Votre prochaine consultation médicale approche. Préparez-vous sereinement.",
    },
    en: {
      title: "🏥 Medical Appointment",
      body: "Your upcoming oncology consultation is scheduled. Preparation brings peace of mind.",
    },
  },
  examination: {
    ar: {
      title: "🔬 موعد فحص طبي",
      body: "موعد فحصكِ الطبي يقترب. الاطمئنان على صحتكِ خطوة مهمة في مسار تعافيكِ.",
    },
    dz: {
      title: "🔬 وقت التحاليل والفحوصات",
      body: "موعد الفحص الطبي راهو قريب. كي تطمني على صحتك خطوة كبيرة في طريق الشفاء.",
    },
    fr: {
      title: "🔬 Examen médical",
      body: "Votre examen médical approche. Prendre soin de vous reste la priorité.",
    },
    en: {
      title: "🔬 Diagnostic Examination",
      body: "Your diagnostic examination is approaching. Taking care of your health is a priority.",
    },
  },
  hydration: {
    ar: {
      title: "💧 ترطيب الجسم",
      body: "خطوات الرعاية الصغيرة تصنع فارقاً حقيقياً. تذكري شرب كوب من الماء لترطيب جسمكِ.",
    },
    dz: {
      title: "💧 شربي شوية ما",
      body: "الحوايج الصغار يديرو فرق كبير. تفكري تشربي كاس ما باش ترطبي جسمك.",
    },
    fr: {
      title: "💧 Hydratation",
      body: "Pensez à boire un verre d'eau pour rester bien hydratée.",
    },
    en: {
      title: "💧 Hydration",
      body: "Small acts of self-care matter. Remember to drink water.",
    },
  },
  skincare: {
    ar: {
      title: "✨ العناية بالبشرة",
      body: "لحظة لطيفة للعناية بترطيب بشرتكِ وحمايتها برفق.",
    },
    dz: {
      title: "✨ تهلاي في لابو تاعك",
      body: "وقت خفيف باش ترطبي جلدك وتحميه بلطف وبراحة.",
    },
    fr: {
      title: "✨ Soin de la peau",
      body: "Un moment doux pour hydrater et protéger votre peau.",
    },
    en: {
      title: "✨ Skincare",
      body: "A gentle moment of care for your healing skin.",
    },
  },
  arm_exercise: {
    ar: {
      title: "🌸 تمارين الذراع اللطيفة",
      body: "جلسة حركة لطيفة قد تساعدكِ على الحفاظ على مرونتكِ وحركتكِ بما يناسب حالتكِ الصحية.",
    },
    dz: {
      title: "🌸 حركات وتمارين الذراع",
      body: "حركات خفيفة تعاونك باش تحافظي على الخفة والمرونة تاع ذراعك بلا ماتتعبي روحك.",
    },
    fr: {
      title: "🌸 Exercice doux du bras",
      body: "Une séance douce pour maintenir la souplesse et mobilité de votre bras.",
    },
    en: {
      title: "🌸 Gentle Arm Exercise",
      body: "A gentle movement session may help you maintain mobility when it is appropriate for your condition.",
    },
  },
  walking: {
    ar: {
      title: "🚶‍♀️ المشي اللطيف",
      body: "أنصتي لجسدكِ؛ مشي خفيف أو قسط هادئ من الراحة يعيد إليكِ طاقتكِ ونشاطكِ.",
    },
    dz: {
      title: "🚶‍♀️ تمشاي شوية",
      body: "سمعي لروحك؛ مشية خفيفة ترجعلك الطاقة والنشاط وتبدلي بيها الجو.",
    },
    fr: {
      title: "🚶‍♀️ Marche douce",
      body: "Écoutez votre corps. Une courte marche tranquille renouvelle votre énergie.",
    },
    en: {
      title: "🚶‍♀️ Gentle Walk",
      body: "Listen to your body. A short gentle walk or a quiet rest renews your energy.",
    },
  },
  sleep: {
    ar: {
      title: "🌙 الراحة والنوم الهادئ",
      body: "جسمكِ يستحق نوماً هادئاً ومريحاً الليلة لتعزيز استعادة حيويتكِ.",
    },
    dz: {
      title: "🌙 رقاد هني وراحة",
      body: "جسمك يستاهل رقاد هني ومريح الليلة باش تعاودي ترفدي صحتك.",
    },
    fr: {
      title: "🌙 Repos et sommeil",
      body: "Votre corps mérite un sommeil réparateur et paisible cette nuit.",
    },
    en: {
      title: "🌙 Rest & Sleep",
      body: "Your body deserves a calm, restorative rest tonight to support healing.",
    },
  },
  mood_checkin: {
    ar: {
      title: "💗 الاطمئنان على يومكِ",
      body: "كيف تشعرين اليوم؟ مشاعركِ وراحتكِ تهمنا، خصصي دقيقة لتسجيل حالتكِ.",
    },
    dz: {
      title: "💗 واش راكي حاسة اليوم؟",
      body: "كيفاش راكي حاسة اليوم؟ راحتك ومورالك يهمونا، خذي دقيقة وسجلي واش راكي حاسة.",
    },
    fr: {
      title: "💗 Écoute de vos émotions",
      body: "Comment vous sentez-vous aujourd'hui ? Prenez une minute pour écouter vos ressentis.",
    },
    en: {
      title: "💗 Daily Check-in",
      body: "How are you feeling today? Take a moment to listen to your body and emotions.",
    },
  },
  motivation: {
    ar: {
      title: "🌸 رسالة دعم وأمل",
      body: "كل خطوة عناية صغيرة اليوم هي تقدم حقيقي في رحلتكِ نحو العافية.",
    },
    dz: {
      title: "🌸 كلمة حلوة وأمل",
      body: "كل خطوة عناية صغيرة ديريها اليوم هي تقدم حقيقي في طريق العافية والشفاء.",
    },
    fr: {
      title: "🌸 Message de soutien",
      body: "Chaque petit geste de soin aujourd'hui est un progrès précieux sur votre chemin.",
    },
    en: {
      title: "🌸 Words of Support",
      body: "Every small act of care today is real, meaningful progress on your journey.",
    },
  },
  educational: {
    ar: {
      title: "📖 معلومة صحية مفيدة",
      body: "نصيحة طبية موثوقة لمساعدتكِ على فهم خطوات الرعاية الذاتية.",
    },
    dz: {
      title: "📖 نصيحة صحية تفيدك",
      body: "معلومة طبية موثوقة تعاونك باش تفهمي خطوات العناية الذاتية.",
    },
    fr: {
      title: "📖 Conseil santé",
      body: "Un repère médical de confiance pour accompagner vos routines de soin.",
    },
    en: {
      title: "📖 Health Insight",
      body: "A trusted guidance note to help you navigate your self-care routine with confidence.",
    },
  },
};

export const CATEGORY_VARIANTS: Record<
  CategoryKey,
  { ar: string[]; dz: string[]; fr: string[]; en: string[] }
> = {
  medication: {
    ar: [
      "💊 خطتكِ العلاجية في غاية الأهمية. حان موعد تناول دوائكِ وفق إرشادات فريقك الطبي المعالج.",
      "💊 تذكير بموعد الدواء — الالتزام بالجرعة الموصوفة يدعم تعافيكِ 💗",
    ],
    dz: [
      "💊 خطتكِ العلاجية مهمة بزاف. وصل وقت الدوا تاعك على حساب واش قالك الطبيب المعالج.",
      "💊 تذكير بموعد الدوا — كي تشربي دواك في وقته تعاوني صحتك ترتاح وتتعافى 💗",
    ],
    fr: [
      "Votre plan de traitement est essentiel. Prenez votre médicament selon les conseils de votre équipe soignante.",
      "Rappel de traitement — la régularité soutient votre rétablissement 💗",
    ],
    en: [
      "Your health plan matters. It is time to follow the medication instructions confirmed by your care team.",
      "A gentle medication reminder — staying consistent with prescribed doses supports healing 💗",
    ],
  },
  appointment: {
    ar: [
      "🏥 موعدكِ الطبي القادم مقترب. الاستعداد المسبق يمنحكِ راحة البال.",
      "🏥 تذكير بموعدكِ الطبي — فريقكِ المعالج بانتظاركِ للاطمئنان على صحتكِ 🌸",
    ],
    dz: [
      "🏥 الرونديفو الجاي راهو قريب. وجدي روحك باش ترتاحي وماتقلقيش.",
      "🏥 تذكير بموعد الطبيب — الطبيب والممرضين راهم يستناو فيك باش يطمنو على صحتك 🌸",
    ],
    fr: [
      "Votre prochaine consultation approche. Préparer vos questions vous apporte de la sérénité.",
      "Rappel de consultation — votre équipe médicale est là pour vous accompagner 🌸",
    ],
    en: [
      "Your upcoming oncology consultation is scheduled. Preparation brings peace of mind.",
      "Medical visit reminder — your care team is ready to support your progress 🌸",
    ],
  },
  examination: {
    ar: [
      "🔬 موعد فحصكِ الطبي يقترب. الاطمئنان على صحتكِ خطوة مهمة في مسار تعافيكِ.",
      "🔬 تذكير بالفحص التشخيصي — الاطمئنان خطوة تمنحكِ الأمان والاطمئنان 💗",
    ],
    dz: [
      "🔬 موعد الفحص الطبي راهو قريب. كي تطمني على صحتك خطوة كبيرة في طريق الشفاء.",
      "🔬 تذكير بالفحص والتحاليل — الاطمئنان يريح البال ويخليك مرتاحة 💗",
    ],
    fr: [
      "Votre examen médical approche. Faire le point est une étape clé de votre suivi.",
      "Rappel d'examen — le suivi régulier vous apporte clarté et sécurité 💗",
    ],
    en: [
      "Your diagnostic examination is approaching. Taking care of your health is a priority.",
      "Diagnostic test reminder — monitoring your health brings clarity and reassurance 💗",
    ],
  },
  hydration: {
    ar: [
      "💧 خطوات الرعاية الصغيرة تصنع فارقاً حقيقياً. تذكري شرب كوب من الماء لترطيب جسمكِ.",
      "💧 كوب ماء منعش الآن قد يكون ألطف هدية تقدمينها لجسمكِ 🌸",
    ],
    dz: [
      "💧 الحوايج الصغار يديرو فرق كبير. تفكري تشربي كاس ما باش ترطبي جسمك.",
      "💧 كاس ما منعش درك هو أحسن هدية تقدميها لصحتك ولابو تاعك 🌸",
    ],
    fr: [
      "Les petits gestes font une vraie différence. Pensez à boire un verre d'eau fraîche.",
      "Un grand verre d'eau maintenant est une belle attention pour votre corps 🌸",
    ],
    en: [
      "Small acts of self-care matter. Remember to drink water.",
      "A refreshing glass of water now is a kind gesture to your body 🌸",
    ],
  },
  skincare: {
    ar: [
      "✨ لحظة لطيفة للعناية بترطيب بشرتكِ وحمايتها برفق.",
      "✨ ترطيب البشرة بلطف يساعد على راحتكِ وتجدد أنسجتكِ بحب 💗",
    ],
    dz: [
      "✨ وقت خفيف باش ترطبي جلدك وتحميه بلطف وبراحة.",
      "✨ ترطيب الجلد بلطف يريحك ويعاون الخلايا تاعك تتجدد براحة 💗",
    ],
    fr: [
      "Un moment délicat pour hydrater et apaiser votre peau.",
      "Hydrater votre peau avec douceur favorise confort et apaisement 💗",
    ],
    en: [
      "A gentle moment of care for your healing skin.",
      "Moisturizing gently supports your comfort and delicate skin recovery 💗",
    ],
  },
  arm_exercise: {
    ar: [
      "🌸 جلسة حركة لطيفة قد تساعدكِ على الحفاظ على مرونتكِ وحركتكِ بما يناسب حالتكِ الصحية.",
      "🌸 بضع حركات تمدد خفيفة للذراع اليوم تعزز راحتكِ وتمنع الشد العضلي 💗",
    ],
    dz: [
      "🌸 حركات خفيفة تعاونك باش تحافظي على الخفة والمرونة تاع ذراعك بلا ماتتعبي روحك.",
      "🌸 شوية تمدد خفيف لليد والكتف اليوم يعاونك تنحي السطر والتزيار 💗",
    ],
    fr: [
      "Une séance de mouvements doux pour préserver l'amplitude et le confort de votre bras.",
      "Quelques étirements légers aujourd'hui soutiennent votre mobilité 💗",
    ],
    en: [
      "A gentle movement session may help you maintain mobility when it is appropriate for your condition.",
      "A few soft stretches today help your mobility and reduce tension 💗",
    ],
  },
  walking: {
    ar: [
      "🚶‍♀️ أنصتي لجسدكِ؛ مشي خفيف أو قسط هادئ من الراحة يعيد إليكِ طاقتكِ ونشاطكِ.",
      "🚶‍♀️ خطوات بسيطة في الهواء النقي تساعد على تنشيط الدورة الدموية وتحسين المزاج 🌸",
    ],
    dz: [
      "🚶‍♀️ سمعي لروحك؛ مشية خفيفة ترجعلك الطاقة والنشاط وتبدلي بيها الجو.",
      "🚶‍♀️ خطوات خفاف في الهوا النقي يحركو الدورة الدموية ويطلعو المورال 🌸",
    ],
    fr: [
      "Écoutez votre corps. Une marche tranquille ou un repos doux renouvelle votre énergie.",
      "Quelques pas au grand air réactivent la circulation et allègent l'esprit 🌸",
    ],
    en: [
      "Listen to your body. A short gentle walk or a quiet rest renews your energy.",
      "A gentle stroll in fresh air helps circulation and lifts your spirits 🌸",
    ],
  },
  sleep: {
    ar: [
      "🌙 جسمكِ يستحق نوماً هادئاً ومريحاً الليلة لتعزيز استعادة حيويتكِ.",
      "🌙 لحظة هدوء واسترخاء — النوم الكافي ركيزة أساسية في الشفاء 💗",
    ],
    dz: [
      "🌙 جسمك يستاهل رقاد هني ومريح الليلة باش تعاودي ترفدي صحتك.",
      "🌙 وقت باش تريحي روحك — الرقاد المليح هو الصح في الشفاء واسترجاع القوة 💗",
    ],
    fr: [
      "Votre corps mérite une nuit calme et paisible pour reconstituer ses forces.",
      "Un moment de sérénité — un sommeil profond est le pilier de votre récupération 💗",
    ],
    en: [
      "Your body deserves a calm, restorative rest tonight to support healing.",
      "Time to unwind — quality sleep is a cornerstone of your recovery 💗",
    ],
  },
  mood_checkin: {
    ar: [
      "💗 كيف تشعرين اليوم؟ مشاعركِ وراحتكِ تهمنا، خصصي دقيقة لتسجيل حالتكِ.",
      "💗 وقفة هادئة لسماع صوت جسدكِ ومشاعركِ في هذا اليوم 🌸",
    ],
    dz: [
      "💗 كيفاش راكي حاسة اليوم؟ راحتك ومورالك يهمونا، خذي دقيقة وسجلي واش راكي حاسة.",
      "💗 وقفة هادية باش تسمعي لصوت جسمك ومورالك في هاد النهار 🌸",
    ],
    fr: [
      "Comment vous sentez-vous aujourd'hui ? Vos émotions comptent, prenez un instant pour noter.",
      "Une pause sereine pour accueillir ce que vous ressentez maintenant 🌸",
    ],
    en: [
      "How are you feeling today? Take a moment to listen to your body and emotions.",
      "A quiet moment to check in with how you are feeling right now 🌸",
    ],
  },
  motivation: {
    ar: [
      "🌸 كل خطوة عناية صغيرة اليوم هي تقدم حقيقي في رحلتكِ نحو العافية.",
      "🌸 أنتِ شجاعة ورائعة، ونحن معكِ في كل خطوة 💗",
    ],
    dz: [
      "🌸 كل خطوة عناية صغيرة ديريها اليوم هي تقدم حقيقي في طريق العافية والشفاء.",
      "🌸 راكي قوية وشجاعة بزاف، وربي معاك وحنا ديما معاك في كل خطوة 💗",
    ],
    fr: [
      "Chaque attention pour vous-même aujourd'hui est une vraie avancée vers le bien-être.",
      "Vous faites preuve d'un courage remarquable, nous avançons à vos côtés 💗",
    ],
    en: [
      "Every small act of care today is real, meaningful progress on your journey.",
      "You are strong, resilient, and taking wonderful care of yourself 💗",
    ],
  },
  educational: {
    ar: [
      "📖 نصيحة طبية موثوقة لمساعدتكِ على فهم خطوات الرعاية الذاتية.",
      "📖 معلومة جديدة ومفيدة بانتظاركِ اليوم 🌸",
    ],
    dz: [
      "📖 معلومة طبية موثوقة تعاونك باش تفهمي خطوات العناية الذاتية.",
      "📖 نصيحة جديدة ومفيدة راهي تستنى فيك اليوم باش تنفعك 🌸",
    ],
    fr: [
      "Un conseil santé éclairant pour mieux comprendre vos repères au quotidien.",
      "Une nouvelle information utile vous attend aujourd'hui 🌸",
    ],
    en: [
      "A trusted guidance note to help you navigate your self-care routine with confidence.",
      "A new wellness insight is waiting for you today 🌸",
    ],
  },
};

export const VIBRATION_PATTERNS: Record<CategoryKey | "custom", number[]> = {
  medication: [300, 100, 300],
  appointment: [300, 150, 300, 150, 300],
  examination: [300, 150, 300],
  arm_exercise: [60, 80, 60, 80, 60],
  walking: [60, 80, 60, 80, 60],
  hydration: [40],
  skincare: [50, 60, 50],
  sleep: [30],
  mood_checkin: [50, 60, 50],
  motivation: [25],
  educational: [40, 60, 40],
  custom: [50],
};

export const CATEGORY_ROUTE: Record<CategoryKey, string> = {
  medication: "/care?tab=medications",
  appointment: "/care?tab=appointments",
  examination: "/care?tab=appointments",
  hydration: "/care?tab=checklist",
  skincare: "/care?tab=checklist",
  arm_exercise: "/exercise",
  walking: "/care?tab=checklist",
  sleep: "/care?tab=checklist",
  mood_checkin: "/home",
  motivation: "/home",
  educational: "/learn",
};

function urlB64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function previewChimeSound() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    // AudioContext blocked by autoplay policy or unsupported
  }
}

type Ctx = {
  settings: NotifSettings;
  permission: NotificationPermission;
  loading: boolean;
  isPushSupported: boolean;
  pushSubscription: StoredPushSub | null;
  requestPermission: () => Promise<void>;
  subscribeToPush: () => Promise<boolean>;
  unsubscribeFromPush: () => Promise<boolean>;
  sendTestPushNotification: () => Promise<{ success: boolean; message: string }>;
  previewChimeSound: () => void;
  updateSettings: (patch: Partial<NotifSettings>) => Promise<void>;
  updateCategory: (key: CategoryKey, patch: Partial<CategoryConfig>) => Promise<void>;
  fireNotification: (
    category: CategoryKey | "custom",
    title: string,
    body: string,
    customRoute?: string,
  ) => Promise<void>;
  snoozeLast: () => Promise<void>;
  markDone: (category: CategoryKey | "custom") => Promise<void>;
};

const NotifCtx = createContext<Ctx | null>(null);

function inQuietHours(settings: NotifSettings, now = new Date()) {
  const cur = now.getHours() * 60 + now.getMinutes();
  const [qsH, qsM] = (settings.quiet_start || "22:00").split(":").map(Number);
  const [qeH, qeM] = (settings.quiet_end || "07:00").split(":").map(Number);
  const start = qsH * 60 + qsM;
  const end = qeH * 60 + qeM;
  return start < end ? cur >= start && cur < end : cur >= start || cur < end;
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotifSettings>(DEFAULTS);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default",
  );
  const [pushSubscription, setPushSubState] = useState<StoredPushSub | null>(() =>
    getStoredPushSub(),
  );
  const [isPushSupported, setIsPushSupported] = useState(false);
  const [loading, setLoading] = useState(true);

  const lastNotifRef = useRef<{
    category: CategoryKey | "custom";
    title: string;
    body: string;
    route?: string;
  } | null>(null);
  const swRegRef = useRef<ServiceWorkerRegistration | null>(null);

  // Check SW and Push support
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasSW = "serviceWorker" in navigator;
    const hasPush = "PushManager" in window;
    setIsPushSupported(hasSW && hasPush);

    if (hasSW) {
      navigator.serviceWorker
        .register("/pinkcare-sw.js")
        .then(async (reg) => {
          swRegRef.current = reg;
          if (hasPush) {
            const sub = await reg.pushManager.getSubscription();
            if (sub) {
              const subJson = sub.toJSON();
              if (subJson.endpoint && subJson.keys?.p256dh && subJson.keys?.auth) {
                const stored: StoredPushSub = {
                  endpoint: subJson.endpoint,
                  p256dh: subJson.keys.p256dh,
                  auth: subJson.keys.auth,
                  subscribedAt: new Date().toISOString(),
                };
                setPushSubState(stored);
                setStoredPushSub(stored);
              }
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  // Load initial settings
  useEffect(() => {
    const stored = getStoredNotifSettings<Partial<NotifSettings> | null>(null);
    if (stored) {
      setSettings((prev) => ({
        ...prev,
        ...stored,
        categories: { ...DEFAULTS.categories, ...(stored.categories || {}) },
      }));
    }
    setLoading(false);
  }, []);

  const persist = useCallback((next: NotifSettings) => {
    setStoredNotifSettings(next);
  }, []);

  const updateSettings = useCallback(
    async (patch: Partial<NotifSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const updateCategory = useCallback(
    async (key: CategoryKey, patch: Partial<CategoryConfig>) => {
      setSettings((prev) => {
        const next = {
          ...prev,
          categories: { ...prev.categories, [key]: { ...prev.categories[key], ...patch } },
        };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const vibrate = useCallback(
    (category: CategoryKey | "custom") => {
      if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
      if (!settings.vibration_enabled) return;
      const pattern = VIBRATION_PATTERNS[category] ?? [50];
      const scaled = pattern.map((ms) =>
        Math.max(10, Math.round(ms * (settings.vibration_intensity || 1))),
      );
      try {
        navigator.vibrate(scaled);
      } catch {
        // Ignored if device is in silent mode or blocked
      }
    },
    [settings.vibration_enabled, settings.vibration_intensity],
  );

  const fireNotification = useCallback(
    async (category: CategoryKey | "custom", title: string, body: string, customRoute?: string) => {
      if (!settings.enabled) return;
      if (inQuietHours(settings)) return;

      const route =
        customRoute ??
        (category in CATEGORY_ROUTE ? CATEGORY_ROUTE[category as CategoryKey] : "/care");
      lastNotifRef.current = { category, title, body, route };

      // Native system notification plays OS notification sound when silent is false.
      // We strictly avoid client JS audio chimes to prevent echo/duplicate sound.
      vibrate(category);

      const actions = [
        { action: "done", title: "✓ تم الإنجاز" },
        { action: "snooze", title: "⏱ لاحقًا" },
        { action: "open", title: "↗ فتح" },
      ];

      const options: NotificationOptions & {
        actions?: typeof actions;
        image?: string;
        renotify?: boolean;
        vibrate?: number[];
        silent?: boolean;
      } = {
        body,
        icon: "/pinkcare-notif-icon.png",
        badge: "/pinkcare-notif-icon.png",
        image: "/pinkcare-notif-cover.jpg",
        tag: `pinkcare-${category}`,
        vibrate: settings.vibration_enabled ? (VIBRATION_PATTERNS[category] ?? [50]) : undefined,
        silent: !settings.sound_enabled,
        renotify: true,
        actions,
        data: { category, title, body, route },
      };

      try {
        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          const reg =
            swRegRef.current ??
            ("serviceWorker" in navigator
              ? await navigator.serviceWorker.ready.catch(() => null)
              : null);
          if (reg) {
            await reg.showNotification(title, options);
          } else {
            new Notification(title, {
              body,
              icon: options.icon,
              badge: options.badge,
              tag: options.tag,
            } as NotificationOptions);
          }
        }
      } catch {
        // Notification permission or service worker issue
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("pinkcare:notification", {
            detail: { category, title, body, route },
          }),
        );
      }
      addNotifLog({ category, title, body, status: "sent" });
    },
    [settings, vibrate],
  );

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const res = await Notification.requestPermission();
    setPermission(res);
    await updateSettings({ permission_granted: res === "granted" });
  }, [updateSettings]);

  // Subscribe to real Web Push notifications
  const subscribeToPush = useCallback(async (): Promise<boolean> => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      return false;
    }

    try {
      if (Notification.permission !== "granted") {
        const perm = await Notification.requestPermission();
        setPermission(perm);
        if (perm !== "granted") return false;
        await updateSettings({ permission_granted: true });
      }

      const reg = await navigator.serviceWorker.ready;
      const { key: vapidKey } = await getVapidPublicKey();
      if (!vapidKey) return false;

      const convertedKey = urlB64ToUint8Array(vapidKey);
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      });

      const json = sub.toJSON();
      if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return false;

      const record: StoredPushSub = {
        endpoint: json.endpoint,
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
        userAgent: navigator.userAgent,
        subscribedAt: new Date().toISOString(),
      };

      setPushSubState(record);
      setStoredPushSub(record);

      await savePushSubscription({
        data: {
          endpoint: record.endpoint,
          p256dh: record.p256dh,
          auth: record.auth,
          user_agent: record.userAgent,
          timezone: settings.timezone || DEFAULT_TIMEZONE,
          sound_enabled: settings.sound_enabled,
          vibration_enabled: settings.vibration_enabled,
        },
      });

      return true;
    } catch (err) {
      console.error("Web Push subscription failed:", err);
      return false;
    }
  }, [updateSettings, settings.timezone, settings.sound_enabled, settings.vibration_enabled]);

  // Unsubscribe from real Web Push
  const unsubscribeFromPush = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return false;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        await deletePushSubscription({ data: { endpoint: sub.endpoint } });
      }
      setPushSubState(null);
      setStoredPushSub(null);
      return true;
    } catch (err) {
      console.error("Web Push unsubscription failed:", err);
      return false;
    }
  }, []);

  // Send real test push through the backend server
  const sendTestPushNotification = useCallback(async () => {
    if (!pushSubscription) {
      return {
        success: false,
        message: "No active push subscription. Please enable Web Push first.",
      };
    }
    try {
      const res = await sendDirectPush({
        data: {
          endpoint: pushSubscription.endpoint,
          p256dh: pushSubscription.p256dh,
          auth: pushSubscription.auth,
          title: "🌸 PinkCare Web Push",
          body: "إشعار حقيقي مباشر عبر خادم الويب (Web Push). يظهر حتى مع إغلاق المتصفح وقفل الشاشة 💗",
          category: "motivation",
          route: "/notifications",
          sound_enabled: settings.sound_enabled,
          vibration_enabled: settings.vibration_enabled,
        },
      });
      if (res.ok) {
        addNotifLog({
          category: "motivation",
          title: "🌸 PinkCare Web Push",
          body: "تم تسليم الإشعار المباشر عبر السيرفر بنجاح.",
          status: "sent",
        });
        return {
          success: true,
          message: "Web Push delivered successfully via backend!",
        };
      } else {
        return {
          success: false,
          message: res.error || "Push delivery failed",
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Network error delivering test push",
      };
    }
  }, [pushSubscription, settings.sound_enabled, settings.vibration_enabled]);

  const snoozeLast = useCallback(async () => {
    const last = lastNotifRef.current;
    if (!last) return;
    addNotifLog({
      category: last.category,
      title: last.title,
      body: last.body,
      status: "snoozed",
    });
    const key = `ignored_${last.category}`;
    await updateSettings({
      adaptive: { ...settings.adaptive, [key]: (settings.adaptive[key] ?? 0) + 1 },
    });
    setTimeout(
      () => {
        fireNotification(last.category as CategoryKey, last.title, last.body, last.route);
      },
      (settings.snooze_minutes || 10) * 60 * 1000,
    );
  }, [settings, fireNotification, updateSettings]);

  const markDone = useCallback(
    async (category: CategoryKey | "custom") => {
      addNotifLog({ category, title: "✓ تم الإنجاز", body: "", status: "done" });
      const key = `ignored_${category}`;
      if (settings.adaptive[key]) {
        await updateSettings({ adaptive: { ...settings.adaptive, [key]: 0 } });
      }
    },
    [settings, updateSettings],
  );

  // Smart Scheduler tick (every 60 seconds)
  useEffect(() => {
    if (!user || loading || !settings.enabled) return;

    const checkSchedules = async () => {
      const now = new Date();
      if (inQuietHours(settings, now)) return;

      let activeLang: "ar" | "dz" | "fr" | "en" = "ar";
      if (typeof window !== "undefined") {
        const storedLang = localStorage.getItem("pinkcare_lang") as
          "ar" | "dz" | "fr" | "en" | null;
        if (storedLang && ["ar", "dz", "fr", "en"].includes(storedLang)) {
          activeLang = storedLang;
        } else if (document.documentElement.lang === "dz") {
          activeLang = "dz";
        } else if (document.documentElement.lang === "fr") {
          activeLang = "fr";
        } else if (document.documentElement.lang === "en") {
          activeLang = "en";
        }
      }

      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const currentHhmm = `${hh}:${mm}`;
      const today = todayISO();

      // 1. Check Active Medications
      if (settings.categories.medication?.enabled) {
        const activeMeds = getMedications("active");
        const todayLogs = getMedDoseLogs(today);

        for (const med of activeMeds) {
          // Check date bounds
          if (med.startDate && med.startDate > today) continue;
          if (med.endDate && med.endDate < today) continue;

          for (const time of med.times) {
            if (time === currentHhmm) {
              const dedupeKey = `med-${med.id}-${today}-${time}`;
              if (isNotificationDeduplicated(dedupeKey)) continue;

              const isAlreadyTaken = todayLogs.some(
                (l) =>
                  l.medicationId === med.id && l.scheduledTime === time && l.status === "taken",
              );
              if (isAlreadyTaken) continue;

              recordNotificationDeduplicated(dedupeKey);

              const title =
                activeLang === "dz"
                  ? `💊 وقت الدوا: ${med.name} (${med.dosage})`
                  : activeLang === "ar"
                    ? `💊 موعد دواء: ${med.name} (${med.dosage})`
                    : activeLang === "fr"
                      ? `💊 Heure de médicament: ${med.name} (${med.dosage})`
                      : `💊 Medication Time: ${med.name} (${med.dosage})`;

              const instructionNotice = med.instructions
                ? activeLang === "dz"
                  ? `\nواش وصاك الطبيب: ${med.instructions}`
                  : activeLang === "ar"
                    ? `\nتعليمات الطبيب: ${med.instructions}`
                    : activeLang === "fr"
                      ? `\nInstructions du médecin: ${med.instructions}`
                      : `\nDoctor's instructions: ${med.instructions}`
                : "";

              const body =
                (activeLang === "dz"
                  ? "خطتكِ العلاجية مهمة بزاف. وصل وقت الدوا تاعك على حساب واش قالك الطبيب المعالج."
                  : activeLang === "ar"
                    ? "خطتكِ العلاجية في غاية الأهمية. حان موعد تناول دوائكِ وفق إرشادات فريقك الطبي المعالج."
                    : activeLang === "fr"
                      ? "Votre plan de traitement est essentiel. Il est temps de prendre votre médicament."
                      : "Your health plan matters. It is time to follow the medication instructions confirmed by your care team.") +
                instructionNotice;

              await fireNotification("medication", title, body, "/care?tab=medications");
            }
          }
        }
      }

      // 2. Check Appointments & Diagnostic Examinations
      const upcomingApps = getAppointments("upcoming");
      for (const app of upcomingApps) {
        const isExam =
          app.type === "examination" || app.type === "laboratory" || app.type === "imaging";
        const catKey: CategoryKey = isExam ? "examination" : "appointment";
        if (!settings.categories[catKey]?.enabled) continue;

        // Reminder timing triggers
        let shouldTrigger = false;
        let reminderLabel = "";

        if (app.date === today && app.time === currentHhmm) {
          shouldTrigger = true;
          reminderLabel = "on_time";
        } else if (app.reminderTiming === "1_hour_before" && app.date === today) {
          const [appH, appM] = app.time.split(":").map(Number);
          const diffMinutes = appH * 60 + appM - (now.getHours() * 60 + now.getMinutes());
          if (diffMinutes === 60) {
            shouldTrigger = true;
            reminderLabel = "1_hour_before";
          }
        } else if (app.reminderTiming === "2_hours_before" && app.date === today) {
          const [appH, appM] = app.time.split(":").map(Number);
          const diffMinutes = appH * 60 + appM - (now.getHours() * 60 + now.getMinutes());
          if (diffMinutes === 120) {
            shouldTrigger = true;
            reminderLabel = "2_hours_before";
          }
        } else if (app.reminderTiming === "1_day_before" && currentHhmm === "09:00") {
          const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
          if (app.date === tomorrow) {
            shouldTrigger = true;
            reminderLabel = "1_day_before";
          }
        }

        if (shouldTrigger) {
          const dedupeKey = `app-${app.id}-${today}-${reminderLabel}`;
          if (!isNotificationDeduplicated(dedupeKey)) {
            recordNotificationDeduplicated(dedupeKey);
            const title =
              activeLang === "dz"
                ? `🏥 ${app.title} - ${app.specialistName}`
                : activeLang === "ar"
                  ? `🏥 ${app.title} - ${app.specialistName}`
                  : `🏥 ${app.title} - ${app.specialistName}`;
            const prepNotes = app.notes
              ? activeLang === "dz"
                ? ` (ملاحظات: ${app.notes})`
                : activeLang === "ar"
                  ? ` (ملاحظات: ${app.notes})`
                  : ` (Notes: ${app.notes})`
              : "";
            const body =
              (isExam
                ? activeLang === "dz"
                  ? "موعد الفحص الطبي راهو قريب. كي تطمني على صحتك خطوة كبيرة في طريق الشفاء."
                  : activeLang === "ar"
                    ? "موعد فحصكِ الطبي يقترب. الاطمئنان على صحتكِ خطوة مهمة في مسار تعافيكِ."
                    : activeLang === "fr"
                      ? "Votre examen médical approche. Prendre soin de vous reste la priorité."
                      : "Your diagnostic examination is approaching. Taking care of your health is a priority."
                : activeLang === "dz"
                  ? "الرونديفو الجاي راهو قريب. وجدي روحك باش ترتاحي وماتقلقيش."
                  : activeLang === "ar"
                    ? "موعدكِ الطبي القادم مقترب. الاستعداد المسبق يمنحكِ راحة البال."
                    : activeLang === "fr"
                      ? "Votre prochaine consultation médicale approche. Préparez-vous sereinement."
                      : "Your upcoming oncology consultation is scheduled. Preparation brings peace of mind.") +
              ` [${app.location} - ${app.time}]` +
              prepNotes;

            await fireNotification(catKey, title, body, "/care?tab=appointments");
          }
        }
      }

      // 3. Check Routine Daily Care Categories
      for (const [k, cfg] of Object.entries(settings.categories) as [
        CategoryKey,
        CategoryConfig,
      ][]) {
        if (k === "medication" || k === "appointment" || k === "examination") continue;
        if (!cfg.enabled || cfg.time !== currentHhmm) continue;

        const dedupeKey = `${today}-${k}-${currentHhmm}`;
        if (isNotificationDeduplicated(dedupeKey)) continue;
        recordNotificationDeduplicated(dedupeKey);

        const msgConfig = CATEGORY_MESSAGES[k][activeLang] || CATEGORY_MESSAGES[k].ar;
        const pool = CATEGORY_VARIANTS[k][activeLang] || CATEGORY_VARIANTS[k].ar;
        const title = msgConfig.title;
        const body = pool[Math.floor(Math.random() * pool.length)];

        await fireNotification(k, title, body);
      }
    };

    const intervalId = setInterval(checkSchedules, 60_000);
    checkSchedules();
    return () => clearInterval(intervalId);
  }, [user, loading, settings, fireNotification]);

  // Handle messages from Service Worker (actions, navigation, renewed subscriptions)
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator) || !user) return;
    const onMessage = async (event: MessageEvent) => {
      const msg = event.data || {};
      if (msg.type === "pinkcare:navigate" && msg.route && typeof window !== "undefined") {
        window.history.pushState({}, "", msg.route);
        window.dispatchEvent(new PopStateEvent("popstate"));
        return;
      }
      if (msg.type === "pinkcare:subscription-renewed" && msg.subscription) {
        const sub = msg.subscription;
        if (sub.endpoint && sub.keys?.p256dh && sub.keys?.auth) {
          const stored: StoredPushSub = {
            endpoint: sub.endpoint,
            p256dh: sub.keys.p256dh,
            auth: sub.keys.auth,
            subscribedAt: new Date().toISOString(),
          };
          setPushSubState(stored);
          setStoredPushSub(stored);
        }
        return;
      }
      if (msg.type !== "pinkcare:action") return;
      const { action, category, title, body } = msg;
      const cat = (category as CategoryKey | "custom") ?? "custom";
      if (action === "done") {
        addNotifLog({ category: cat, title: title ?? "done", body: body ?? "", status: "done" });
      } else if (action === "snooze") {
        addNotifLog({ category: cat, title: title ?? "", body: body ?? "", status: "snoozed" });
        setTimeout(
          () => {
            if (title) fireNotification(cat, title, body ?? "");
          },
          (settings.snooze_minutes || 10) * 60 * 1000,
        );
      } else if (action === "dismissed") {
        addNotifLog({ category: cat, title: title ?? "", body: body ?? "", status: "dismissed" });
      }
    };
    navigator.serviceWorker.addEventListener("message", onMessage);
    return () => navigator.serviceWorker.removeEventListener("message", onMessage);
  }, [user, settings, fireNotification]);

  return (
    <NotifCtx.Provider
      value={{
        settings,
        permission,
        loading,
        isPushSupported,
        pushSubscription,
        requestPermission,
        subscribeToPush,
        unsubscribeFromPush,
        sendTestPushNotification,
        previewChimeSound,
        updateSettings,
        updateCategory,
        fireNotification,
        snoozeLast,
        markDone,
      }}
    >
      {children}
    </NotifCtx.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotifCtx);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
