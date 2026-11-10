import type { Tip } from "./tips";

export interface TipDetails {
  why_ar: string;
  why_en: string;
  benefits_ar: string[];
  benefits_en: string[];
  steps_ar: string[];
  steps_en: string[];
  mistakes_ar: string[];
  mistakes_en: string[];
  warning_ar?: string;
  warning_en?: string;
  did_you_know_ar: string;
  did_you_know_en: string;
  image?: string; // emoji as illustration
}

const D: Record<string, TipDetails> = {
  s1: {
    why_ar:
      "قد تصبح البشرة أكثر حساسية وجفافاً أثناء العلاج. الترطيب المنتظم يحافظ على صحة الجلد ويقلل التهيج.",
    why_en:
      "Skin can become more sensitive and dry during treatment. Regular moisturizing keeps skin healthy and reduces irritation.",
    benefits_ar: [
      "تقليل الجفاف والحكة",
      "حماية حاجز البشرة",
      "تحسين الراحة اليومية",
      "تقليل التشققات",
    ],
    benefits_en: [
      "Less dryness and itching",
      "Protect the skin barrier",
      "Better daily comfort",
      "Fewer cracks",
    ],
    steps_ar: [
      "استخدمي مرطباً خالياً من العطور والكحول",
      "ضعيه خلال 3 دقائق بعد الاستحمام",
      "كرري الترطيب صباحاً ومساءً",
      "ركّزي على المناطق الجافة",
    ],
    steps_en: [
      "Use a fragrance-free, alcohol-free moisturizer",
      "Apply within 3 minutes after showering",
      "Repeat morning and evening",
      "Focus on dry areas",
    ],
    mistakes_ar: [
      "استخدام مرطبات معطّرة قوية",
      "الانتظار حتى تجف البشرة تماماً",
      "فرك البشرة بقوة عند التطبيق",
    ],
    mistakes_en: [
      "Using strongly scented lotions",
      "Waiting until skin is fully dry",
      "Rubbing skin hard when applying",
    ],
    warning_ar: "تجنبي وضع المرطب على جروح مفتوحة أو على منطقة العلاج الإشعاعي قبل الجلسة.",
    warning_en:
      "Avoid applying moisturizer on open wounds or on the radiation area before a session.",
    did_you_know_ar: "البشرة تفقد الماء بشكل أسرع في أول 5 دقائق بعد الاستحمام — لذا التوقيت مهم!",
    did_you_know_en:
      "Skin loses water fastest in the first 5 minutes after showering — timing matters!",
    image: "🌸",
  },
  s6: {
    why_ar:
      "الملابس الضيقة قد تزيد الضغط على الذراع والصدر بعد العلاج أو الجراحة، مما قد يعيق الدورة الدموية واللمفاوية ويسبب التورم.",
    why_en:
      "Tight clothes can increase pressure on the arm and chest after treatment or surgery, hindering blood and lymph flow and causing swelling.",
    benefits_ar: [
      "تحسين الراحة اليومية",
      "تقليل الضغط على الذراع",
      "تحسين حركة الجسم",
      "حماية الجلد الحساس",
    ],
    benefits_en: [
      "Better daily comfort",
      "Less pressure on the arm",
      "Improved body movement",
      "Protects sensitive skin",
    ],
    steps_ar: [
      "اختاري قطناً ناعماً واسعاً",
      "تجنبي الأكمام الضيقة جداً",
      "استخدمي حمالات صدر طبية مريحة",
      "تخلصي من الإكسسوارات المشدودة على الذراع",
    ],
    steps_en: [
      "Choose loose soft cotton",
      "Avoid very tight sleeves",
      "Use comfortable medical bras",
      "Remove tight accessories on the arm",
    ],
    mistakes_ar: [
      "ارتداء أربطة ضاغطة دون استشارة الطبيب",
      "ملابس صناعية لا تتنفس",
      "حمالات صدر بأسلاك معدنية حادة",
    ],
    mistakes_en: [
      "Wearing compression bands without doctor's advice",
      "Synthetic non-breathable fabrics",
      "Bras with sharp metal underwires",
    ],
    did_you_know_ar: "اختيار ملابس مريحة قد يقلل خطر الوذمة اللمفية بنسبة ملحوظة.",
    did_you_know_en: "Choosing comfortable clothing can noticeably reduce lymphedema risk.",
    image: "👕",
  },
  a1: {
    why_ar:
      "بعد العلاج أو الجراحة، يحتاج الذراع إلى وقت للتعافي. الأوزان الثقيلة قد تسبب إجهاداً وتورماً.",
    why_en:
      "After treatment or surgery, the arm needs time to recover. Heavy weights can cause strain and swelling.",
    benefits_ar: [
      "تحسين المرونة تدريجياً",
      "تقليل خطر التورم",
      "بناء قوة آمنة",
      "دعم الحركة اليومية",
    ],
    benefits_en: [
      "Gradually improve mobility",
      "Reduce swelling risk",
      "Build safe strength",
      "Support daily movement",
    ],
    steps_ar: [
      "ابدئي بأوزان نصف كيلو فقط",
      "زيدي الوزن ببطء كل أسبوعين",
      "توقفي فوراً عند أي ألم",
      "اتبعي إرشادات أخصائي العلاج الطبيعي",
    ],
    steps_en: [
      "Start with 0.5 kg only",
      "Increase slowly every two weeks",
      "Stop immediately at any pain",
      "Follow your physiotherapist's guidance",
    ],
    mistakes_ar: [
      "البدء بأوزان ثقيلة مباشرة",
      "تجاهل الألم أو التورم",
      "ممارسة التمارين دون إحماء",
    ],
    mistakes_en: [
      "Starting with heavy weights right away",
      "Ignoring pain or swelling",
      "Exercising without warm-up",
    ],
    warning_ar: "استشيري طبيبك قبل أي برنامج جديد، خاصة في الأسابيع الأولى بعد الجراحة.",
    warning_en:
      "Consult your doctor before any new program, especially in the first weeks after surgery.",
    did_you_know_ar:
      "تمارين المقاومة الخفيفة المنتظمة قد تساعد فعلياً على الوقاية من الوذمة اللمفية.",
    did_you_know_en: "Light regular resistance exercise can actually help prevent lymphedema.",
    image: "💪",
  },
  p2: {
    why_ar: "التمدد اللطيف يحافظ على مرونة الكتف والذراع ويقلل التيبس الذي قد يحدث بعد العلاج.",
    why_en:
      "Gentle stretching maintains shoulder and arm flexibility and reduces stiffness that can occur after treatment.",
    benefits_ar: ["تحسين الحركة", "تقليل التصلب", "دعم النشاط اليومي", "تخفيف التوتر العضلي"],
    benefits_en: [
      "Improved range of motion",
      "Less stiffness",
      "Supports daily activity",
      "Eases muscle tension",
    ],
    steps_ar: [
      "ابدئي ببطء وحركات صغيرة",
      "تنفّسي بعمق أثناء كل حركة",
      "ثبتي كل وضعية 15-30 ثانية",
      "كرري 2-3 مرات يومياً",
    ],
    steps_en: [
      "Start slow with small movements",
      "Breathe deeply during each move",
      "Hold each pose 15-30 seconds",
      "Repeat 2-3 times daily",
    ],
    mistakes_ar: ["الاندفاع بحركات قوية", "حبس النفس أثناء التمدد", "الاستمرار رغم الألم الشديد"],
    mistakes_en: [
      "Forcing strong movements",
      "Holding your breath while stretching",
      "Pushing through sharp pain",
    ],
    did_you_know_ar: "5 دقائق فقط من التمدد صباحاً تكفي لتحسين ملحوظ في المرونة خلال أسبوعين.",
    did_you_know_en:
      "Just 5 minutes of morning stretching can noticeably improve flexibility within two weeks.",
    image: "🧘‍♀️",
  },
};

/** Returns details for a tip — uses curated content if present, otherwise generates a sensible default from the tip body. */
export function getTipDetails(tip: Tip): TipDetails {
  const custom = D[tip.id];
  if (custom) return custom;

  const emojiMap: Record<string, string> = {
    skin: "🌸",
    arm: "💪",
    activity: "🚶‍♀️",
    nutrition: "🥗",
    sleep: "🌙",
    mental: "💗",
  };

  return {
    why_ar: tip.body_ar,
    why_en: tip.body_en,
    benefits_ar: ["تحسين العافية اليومية", "دعم رحلة التعافي", "زيادة الراحة والطاقة"],
    benefits_en: ["Improves daily wellness", "Supports your recovery", "Boosts comfort and energy"],
    steps_ar: [
      "ابدئي بخطوة صغيرة اليوم",
      "اجعليها عادة يومية ثابتة",
      "راقبي تحسّنك أسبوعياً",
      "كافئي نفسك على الالتزام",
    ],
    steps_en: [
      "Start small today",
      "Make it a daily habit",
      "Track your progress weekly",
      "Reward yourself for consistency",
    ],
    mistakes_ar: [
      "البدء بأهداف كبيرة جداً",
      "إهمال الالتزام بعد بضعة أيام",
      "مقارنة تقدمك بالآخرين",
    ],
    mistakes_en: [
      "Setting goals too big",
      "Dropping the habit after a few days",
      "Comparing your progress to others",
    ],
    did_you_know_ar: "العادات الصغيرة المتكررة لها تأثير أكبر بكثير من المجهود الكبير لمرة واحدة.",
    did_you_know_en: "Small repeated habits have far greater impact than one big effort.",
    image: emojiMap[tip.category] ?? "✨",
  };
}
