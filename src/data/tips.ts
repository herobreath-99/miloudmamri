export type TipCategory = "skin" | "arm" | "activity" | "nutrition" | "sleep" | "mental";

export interface Tip {
  id: string;
  category: TipCategory;
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
}

export const CATEGORIES: { key: TipCategory; ar: string; en: string; emoji: string }[] = [
  { key: "skin", ar: "العناية بالجلد", en: "Skin care", emoji: "🌸" },
  { key: "arm", ar: "العناية بالذراع", en: "Arm care", emoji: "💪" },
  { key: "activity", ar: "النشاط البدني", en: "Physical activity", emoji: "🚶‍♀️" },
  { key: "nutrition", ar: "التغذية", en: "Nutrition", emoji: "🥗" },
  { key: "sleep", ar: "النوم والراحة", en: "Sleep & rest", emoji: "🌙" },
  { key: "mental", ar: "الصحة النفسية", en: "Mental wellness", emoji: "💗" },
];

const mk = (
  id: string,
  category: TipCategory,
  title_ar: string,
  title_en: string,
  body_ar: string,
  body_en: string,
): Tip => ({ id, category, title_ar, title_en, body_ar, body_en });

export const TIPS: Tip[] = [
  // ===== SKIN =====
  mk(
    "s1",
    "skin",
    "ترطيب الجلد يومياً",
    "Moisturize daily",
    "استخدمي مرطباً خالياً من العطور بعد الاستحمام مباشرة على بشرة رطبة لحبس الترطيب.",
    "Apply a fragrance-free moisturizer right after a shower on damp skin to lock in hydration.",
  ),
  mk(
    "s2",
    "skin",
    "كريمات للبشرة الحساسة",
    "Sensitive skin creams",
    "اختاري كريمات لطيفة طبية خالية من الكحول والعطور لتقليل التهيج بعد العلاج.",
    "Choose gentle medical creams free of alcohol and fragrance to reduce irritation after treatment.",
  ),
  mk(
    "s3",
    "skin",
    "تجنبي الماء الساخن جداً",
    "Avoid very hot water",
    "اغسلي بماء فاتر لمنع جفاف وحساسية البشرة التي تزداد أثناء العلاج.",
    "Wash with lukewarm water to prevent dryness and sensitivity that increase during treatment.",
  ),
  mk(
    "s4",
    "skin",
    "جففي الجلد بلطف",
    "Pat skin dry gently",
    "ربتي على بشرتك بمنشفة قطنية ناعمة بدلاً من فركها لتجنب التهيج.",
    "Pat your skin with a soft cotton towel instead of rubbing to avoid irritation.",
  ),
  mk(
    "s5",
    "skin",
    "حماية من الشمس",
    "Sun protection",
    "ضعي واقي شمس SPF 30+ يومياً، حتى داخل المنزل بالقرب من النوافذ.",
    "Wear SPF 30+ daily, even indoors near windows.",
  ),
  mk(
    "s6",
    "skin",
    "ملابس قطنية ناعمة",
    "Soft cotton clothing",
    "ارتدي ملابس قطنية واسعة لتجنب الاحتكاك مع البشرة المتأثرة بالعلاج.",
    "Wear loose cotton to avoid friction on treated skin.",
  ),
  mk(
    "s7",
    "skin",
    "افحصي بشرتك أسبوعياً",
    "Weekly skin check",
    "ابحثي عن أي احمرار أو تورم أو طفح جديد وأبلغي طبيبك إن استمر.",
    "Look for new redness, swelling, or rashes and tell your doctor if they persist.",
  ),
  mk(
    "s8",
    "skin",
    "تجنبي مزيلات العرق العطرية",
    "Avoid scented deodorants",
    "في منطقة العلاج، استخدمي بدائل خالية من الألمنيوم والعطور.",
    "In the treatment area, use aluminum-free and fragrance-free alternatives.",
  ),

  // ===== ARM CARE =====
  mk(
    "a1",
    "arm",
    "تجنبي حمل الأوزان الثقيلة",
    "Avoid heavy lifting",
    "ابدئي بأوزان خفيفة جداً وزيدي تدريجياً تحت إشراف الفريق الطبي.",
    "Start with very light weights and increase gradually under medical guidance.",
  ),
  mk(
    "a2",
    "arm",
    "لا تضغطي على الذراع المصابة",
    "No pressure on affected arm",
    "تجنبي النوم على الذراع المعالجة لتقليل خطر الوذمة اللمفية.",
    "Avoid sleeping on the treated arm to reduce lymphedema risk.",
  ),
  mk(
    "a3",
    "arm",
    "ارفعي الذراع بشكل صحيح",
    "Elevate the arm correctly",
    "ضعي وسادة تحت الذراع عند الاستلقاء لتسهيل تصريف السوائل.",
    "Place a pillow under your arm when lying down to help fluid drainage.",
  ),
  mk(
    "a4",
    "arm",
    "لا للإكسسوارات الضيقة",
    "No tight accessories",
    "تجنبي الساعات والخواتم والأساور الضيقة على الذراع المتأثرة.",
    "Avoid tight watches, rings, and bracelets on the affected arm.",
  ),
  mk(
    "a5",
    "arm",
    "لا حقن أو ضغط دم على الذراع",
    "No injections or BP cuff",
    "اطلبي من الفريق الطبي استخدام الذراع الأخرى للحقن وقياس الضغط.",
    "Ask staff to use the other arm for injections and blood pressure.",
  ),
  mk(
    "a6",
    "arm",
    "احمي ذراعك من الجروح",
    "Protect arm from cuts",
    "ارتدي قفازات أثناء البستنة والتنظيف لتجنب أي خدش أو عدوى.",
    "Wear gloves during gardening and cleaning to avoid scratches or infection.",
  ),
  mk(
    "a7",
    "arm",
    "تدليك لطيف للذراع",
    "Gentle arm massage",
    "حركات دائرية بطيئة من اليد نحو الكتف تساعد على تحريك السوائل.",
    "Slow circular strokes from hand toward shoulder help move fluids.",
  ),

  // ===== ACTIVITY =====
  mk(
    "p1",
    "activity",
    "المشي يومياً",
    "Daily walking",
    "20-30 دقيقة من المشي اللطيف تحسّن الدورة الدموية والمزاج.",
    "20-30 minutes of gentle walking boosts circulation and mood.",
  ),
  mk(
    "p2",
    "activity",
    "تمارين التمدد",
    "Stretching",
    "خصصي 5 دقائق صباحاً لتمديد الكتف والذراع برفق.",
    "Spend 5 minutes each morning gently stretching shoulders and arms.",
  ),
  mk(
    "p3",
    "activity",
    "الحركة المنتظمة",
    "Move regularly",
    "قومي ومشي دقيقتين كل ساعة أثناء الجلوس الطويل.",
    "Stand and walk for 2 minutes every hour when sitting long.",
  ),
  mk(
    "p4",
    "activity",
    "لا للجلوس الطويل",
    "Avoid long sitting",
    "الجلوس المتواصل أكثر من ساعة يزيد التعب — قسّمي يومك بحركات قصيرة.",
    "Sitting over an hour straight adds fatigue — break it up with short moves.",
  ),
  mk(
    "p5",
    "activity",
    "تمارين تنفس",
    "Breathing exercises",
    "نفس عميق 4 ثوانٍ، احتباس 4، زفير 6 — كرري 5 مرات لتهدئة الجسم.",
    "Inhale 4s, hold 4s, exhale 6s — repeat 5 times to calm the body.",
  ),
  mk(
    "p6",
    "activity",
    "السباحة الخفيفة",
    "Light swimming",
    "بعد إذن الطبيب، السباحة تحسّن مرونة الذراع دون ضغط على المفاصل.",
    "With doctor's approval, swimming improves arm mobility without joint strain.",
  ),
  mk(
    "p7",
    "activity",
    "اليوغا الترميمية",
    "Restorative yoga",
    "وضعيات لطيفة تساعد على تقليل الإجهاد وتحسين المرونة.",
    "Gentle poses help reduce stress and improve flexibility.",
  ),

  // ===== NUTRITION =====
  mk(
    "n1",
    "nutrition",
    "اشربي الماء",
    "Drink water",
    "هدف 8 أكواب يومياً يدعم التعافي ويقلل التعب.",
    "Aim for 8 cups a day to support recovery and reduce fatigue.",
  ),
  mk(
    "n2",
    "nutrition",
    "خضروات وفواكه ملونة",
    "Colorful produce",
    "5 حصص يومياً من ألوان مختلفة تمد جسمك بمضادات الأكسدة.",
    "5 servings of different colors daily give you antioxidants.",
  ),
  mk(
    "n3",
    "nutrition",
    "قللي السكر المضاف",
    "Reduce added sugar",
    "استبدلي الحلويات بفاكهة طازجة لمنح طاقة مستقرة.",
    "Replace sweets with fresh fruit for steady energy.",
  ),
  mk(
    "n4",
    "nutrition",
    "وجبات متوازنة",
    "Balanced meals",
    "ربع طبق بروتين + ربع حبوب كاملة + نصف خضار في كل وجبة.",
    "¼ protein + ¼ whole grains + ½ vegetables per plate.",
  ),
  mk(
    "n5",
    "nutrition",
    "بروتين كافٍ",
    "Enough protein",
    "البيض، السمك، البقوليات تدعم ترميم الأنسجة بعد العلاج.",
    "Eggs, fish, legumes support tissue repair after treatment.",
  ),
  mk(
    "n6",
    "nutrition",
    "أوميغا 3",
    "Omega-3",
    "السلمون وبذور الكتان تساعد على تقليل الالتهاب.",
    "Salmon and flaxseed help reduce inflammation.",
  ),
  mk(
    "n7",
    "nutrition",
    "قللي الأطعمة المصنعة",
    "Limit processed foods",
    "اختاري طعاماً طازجاً قدر الإمكان لتقليل المواد الحافظة.",
    "Choose fresh foods when possible to minimize preservatives.",
  ),

  // ===== SLEEP =====
  mk(
    "z1",
    "sleep",
    "نظمي ساعات النوم",
    "Regular sleep schedule",
    "نامي واستيقظي في نفس الوقت يومياً لإيقاع داخلي صحي.",
    "Sleep and wake at the same time daily for a healthy rhythm.",
  ),
  mk(
    "z2",
    "sleep",
    "أبعدي الهاتف قبل النوم",
    "Phone-free before bed",
    "توقفي عن الشاشات قبل النوم بساعة لتحسين جودة النوم.",
    "Stop screens an hour before bed to improve sleep quality.",
  ),
  mk(
    "z3",
    "sleep",
    "بيئة نوم مريحة",
    "Comfortable sleep space",
    "غرفة هادئة، باردة، ومظلمة تعزز النوم العميق.",
    "A quiet, cool, dark room boosts deep sleep.",
  ),
  mk(
    "z4",
    "sleep",
    "قيلولة قصيرة",
    "Short nap",
    "20 دقيقة بعد الظهر تعيد الطاقة دون التأثير على نوم الليل.",
    "A 20-minute afternoon nap restores energy without disrupting night sleep.",
  ),
  mk(
    "z5",
    "sleep",
    "شاي البابونج",
    "Chamomile tea",
    "كوب دافئ قبل النوم بساعة يساعد على الاسترخاء.",
    "A warm cup an hour before bed aids relaxation.",
  ),

  // ===== MENTAL =====
  mk(
    "m1",
    "mental",
    "تنفس عميق للاسترخاء",
    "Deep breathing",
    "5 دقائق من التنفس البطيء تقلل التوتر فوراً.",
    "5 minutes of slow breathing instantly lowers stress.",
  ),
  mk(
    "m2",
    "mental",
    "دوّني مشاعرك",
    "Journal your feelings",
    "كتابة 3 أشياء تشعرين بالامتنان لها يومياً ترفع المزاج.",
    "Writing 3 things you're grateful for daily lifts mood.",
  ),
  mk(
    "m3",
    "mental",
    "حافظي على التواصل",
    "Stay connected",
    "محادثة قصيرة مع صديقة كل يوم تخفف الشعور بالعزلة.",
    "A short chat with a friend each day eases isolation.",
  ),
  mk(
    "m4",
    "mental",
    "أنتِ قوية",
    "You are strong",
    "كل يوم تتقدمين فيه هو انتصار. كوني لطيفة مع نفسك.",
    "Every day forward is a win. Be kind to yourself.",
  ),
  mk(
    "m5",
    "mental",
    "التأمل الموجّه",
    "Guided meditation",
    "10 دقائق من التأمل تخفض ضغط الدم وتحسّن التركيز.",
    "10 minutes of meditation lowers blood pressure and sharpens focus.",
  ),
  mk(
    "m6",
    "mental",
    "اطلبي الدعم",
    "Ask for support",
    "لا تترددي بطلب المساعدة من العائلة أو مجموعات الدعم.",
    "Don't hesitate to ask family or support groups for help.",
  ),
  mk(
    "m7",
    "mental",
    "وقت لنفسك",
    "Me-time",
    "خصصي 30 دقيقة لشيء تحبينه: قراءة، فن، موسيقى.",
    "Give yourself 30 minutes for something you love: reading, art, music.",
  ),
];

/** Deterministic daily tip — same tip throughout a day, rotates next day. */
export function getDailyTip(date = new Date()): Tip {
  const dayIndex = Math.floor(date.getTime() / 86400000);
  return TIPS[dayIndex % TIPS.length];
}

export function getTipsByCategory(category: TipCategory): Tip[] {
  return TIPS.filter((t) => t.category === category);
}
