import type { EducationCategory, EducationalArticle } from "@/types/education";

export const EDUCATION_CATEGORIES: EducationCategory[] = [
  {
    id: "understanding",
    title_ar: "فهم سرطان الثدي",
    title_en: "Understanding Breast Cancer",
    description_ar: "معلومات علمية موثوقة حول طبيعة المرض والأنواع والمفاهيم الأساسية",
    description_en:
      "Scientifically grounded knowledge on disease biology, types, and core concepts",
    iconName: "BookOpen",
    badge_ar: "أساسيات المعرفة",
    badge_en: "Core Knowledge",
  },
  {
    id: "journey",
    title_ar: "رحلة العلاج",
    title_en: "Treatment Journey",
    description_ar: "مراحل العلاج الكيميائي، الإشعاعي، الهرموني، والموجه وكيفية الاستعداد لها",
    description_en: "Chemotherapy, radiation, hormone, and targeted therapies and preparation",
    iconName: "Milestone",
    badge_ar: "مسار الرعاية",
    badge_en: "Care Pathway",
  },
  {
    id: "surgery_recovery",
    title_ar: "التعافي بعد جراحة الثدي",
    title_en: "Breast Surgery Recovery",
    description_ar: "إرشادات ما بعد استئصال الورم أو الثدي، العناية بالنزح الجراحي والتئام الجروح",
    description_en:
      "Post-mastectomy and lumpectomy recovery, drain care, and surgical wound healing",
    iconName: "ShieldCheck",
    badge_ar: "التعافي الجراحي",
    badge_en: "Surgical Recovery",
  },
  {
    id: "rehabilitation",
    title_ar: "إعادة التأهيل البدني",
    title_en: "Physical Rehabilitation",
    description_ar: "تمارين استعادة مرونة الكتف والذراعين ونطاق الحركة بأمان وتدرج",
    description_en:
      "Safely restoring shoulder and arm range of motion through graded rehabilitation",
    iconName: "Activity",
    badge_ar: "حركة ومرونة",
    badge_en: "Mobility & Range",
  },
  {
    id: "lymphedema",
    title_ar: "التوعية بالوذمة اللمفية",
    title_en: "Lymphedema Awareness",
    description_ar:
      "الوقاية من تورم الذراع بعد إزالة العقد اللمفاوية والعلامات المبكرة والاحتياطات",
    description_en:
      "Arm swelling prevention after lymph node removal, early signs, and precautions",
    iconName: "Sparkles",
    badge_ar: "وقاية حيوية",
    badge_en: "Vital Prevention",
  },
  {
    id: "skin_care",
    title_ar: "العناية بالبشرة والجلد",
    title_en: "Skin Care",
    description_ar: "حماية الجلد الحساس وترطيبه أثناء وبعد العلاج الإشعاعي والكيماوي",
    description_en:
      "Protecting and hydrating sensitive skin during and after radiation and chemotherapy",
    iconName: "HeartHandshake",
    badge_ar: "حماية وترطيب",
    badge_en: "Hydration & Care",
  },
  {
    id: "nutrition",
    title_ar: "التغذية والترطيب",
    title_en: "Nutrition & Hydration",
    description_ar: "نظام غذائي متوازن يدعم المناعة، إدارة الشهية، والترطيب الكافي اليومي",
    description_en: "Balanced nutrition supporting immune function, appetite care, and hydration",
    iconName: "Apple",
    badge_ar: "تغذية متوازنة",
    badge_en: "Balanced Diet",
  },
  {
    id: "emotional",
    title_ar: "الصحة والدعم النفسي",
    title_en: "Emotional Well-being",
    description_ar: "استراتيجيات التعامل مع القلق، الخوف، التغيرات الجسدية، وبناء شبكة الدعم",
    description_en: "Navigating anxiety, body image changes, mindfulness, and support networks",
    iconName: "Smile",
    badge_ar: "دعم وسلام داخلي",
    badge_en: "Inner Peace",
  },
  {
    id: "sleep_fatigue",
    title_ar: "إدارة النوم والإرهاق",
    title_en: "Sleep & Fatigue Management",
    description_ar: "التعامل مع الإرهاق المرتبط بالسرطان وتحسين جودة الراحة والنوم الليلي",
    description_en: "Coping with cancer-related fatigue (CRF) and improving restorative sleep",
    iconName: "Moon",
    badge_ar: "راحة واستعادة طاقة",
    badge_en: "Rest & Recovery",
  },
  {
    id: "followup",
    title_ar: "المتابعة الطبية والفحوصات",
    title_en: "Medical Follow-up",
    description_ar: "جدول المتابعات الدورية، فحوصات الماموجرام، والرعاية طويلة الأمد للمتعافيات",
    description_en: "Long-term survivorship schedules, mammography follow-ups, and vigilance",
    iconName: "CalendarClock",
    badge_ar: "متابعة مستمرة",
    badge_en: "Ongoing Vigilance",
  },
];

export const INITIAL_EDUCATIONAL_ARTICLES: EducationalArticle[] = [
  // 1. Understanding Breast Cancer
  {
    id: "art-understanding-1",
    categoryId: "understanding",
    title_ar: "ما هو سرطان الثدي؟ حقائق علمية ومفاهيم أساسية",
    title_en: "What is Breast Cancer? Scientific Facts & Fundamentals",
    summary_ar:
      "دليل مبسط لفهم التغيرات الخلوية، ومستقبلات الهرمونات، وأهمية التشخيص المبكر دون قلق مفرط.",
    summary_en:
      "A clear guide to cellular changes, hormone receptors, and why early detection transforms outcomes.",
    detailedContent_ar: `ينشأ سرطان الثدي عندما تبدأ خلايا معينة في أنسجة الثدي بالانقسام والتكاثر بشكل غير طبيعي وبوتيرة أسرع من الخلايا السليمة. يتكون الثدي بشكل رئيسي من فصيصات (غدد منتجة للحليب) وقنوات (تنقل الحليب إلى الحلمة)، وتحدث الغالبية العظمى من التغيرات في بطانة هذه القنوات (تسمى Carcinoma Ductal) أو الفصيصات (Lobular).

أظهرت الأبحاث السريرية الحديثة أن سرطان الثدي ليس مرضاً واحداً بل مجموعة من الحالات المتمايزة حسب وجود أو غياب مستقبلات محددة على سطح الخلية:
1. مستقبلات الإستروجين (ER) والبروجستيرون (PR): التي تستجيب للعلاجات الهرمونية الموجهة.
2. مستقبل عامل نمو البشرة البشري الثاني (HER2): الذي يوجه نحو علاجات بيولوجية دقيقة ذات فعالية عالية جداً.
3. الثلاثي السلبي (Triple Negative): ويتطلب خططاً علاجية كيميائية أو مناعية خاصة.

مع التطور الكبير في البروتوكولات الطبية والفحوصات الجينية والبيولوجية الدقيقة، أصبحت نسب الشفاء والسيطرة التامة على المرض في مراحلها المبكرة تتجاوز 90%، مما يجعل الفهم المعرفي السليم ركيزة لطمأنينتك وامتثالك للخطة العلاجية.`,
    detailedContent_en: `Breast cancer originates when cells in breast tissue begin dividing abnormally and at an accelerated pace compared to healthy cells. The breast consists predominantly of lobules (milk-producing glands) and ducts (tubes carrying milk to the nipple). Most cases originate within ductal or lobular linings.

Modern clinical oncology recognizes breast cancer not as a single disease, but as distinct subtypes characterized by receptor expressions:
1. Estrogen (ER) and Progesterone (PR) Receptors: allowing effective targeted endocrine therapies.
2. Human Epidermal Growth Factor Receptor 2 (HER2): responding to specific targeted biological antibodies with remarkable efficacy.
3. Triple-Negative Breast Cancer: requiring tailored chemotherapy or immunotherapy pathways.

Thanks to modern diagnostic precision, survival rates in early stages exceed 90%. Understanding your tumor's profile empowers you to partner effectively with your medical oncology team.`,
    practicalRecommendations_ar: [
      "اطلبي من طبيبكِ شرح تقرير الفحص النسيجي (Histopathology) ومعرفة حالة مستقبلات الورم الخاصة بكِ بدقة.",
      "احتفظي بملف ورقي أو رقمي منظّم لجميع الفحوصات والصور الشعاعية بالترتيب الزمني.",
      "دوني أسئلتكِ قبل موعد الطبيب في دفتر صغير لتتجنبي نسيان أي استفسار يهمكِ.",
      "اعتمدي فقط على المصادر الطبية الرسمية وتجنبي المنتديات غير الموثقة التي قد تنشر معلومات مضللة.",
    ],
    practicalRecommendations_en: [
      "Ask your medical oncologist to explain your histopathology report, including receptor status (ER, PR, HER2).",
      "Maintain a chronologically organized folder of all pathology reports, lab tests, and imaging.",
      "Write down your questions in advance before consultations to ensure clarity on your treatment plan.",
      "Rely solely on verified medical institutions and avoid unmoderated forums that amplify unscientific claims.",
    ],
    precautions_ar: [
      "لا تقارني حالتكِ أو مرحلتكِ مع مريضة أخرى؛ فكل خطة علاجية مخصصة بشكل فردي دقيق.",
      "لا تتناولي أي مكملات عشبية أو مستخلصات دون إطلاع طبيب الأورام المعالج؛ فقد تتداخل مع الأدوية.",
    ],
    precautions_en: [
      "Never compare your exact protocol to another patient; breast cancer therapy is strictly personalized.",
      "Do not initiate herbal remedies, high-dose vitamins, or alternative treatments without your oncologist's explicit approval.",
    ],
    whenToContactDoctor_ar: [
      "ظهور كتلة جديدة صلبة غير معتادة في الثدي أو تحت الإبط.",
      "تغير ملحوظ في شكل الجلد مثل التثلم (انخماص الجلد كالبرتقالة) أو انغلاق الحلمة نحو الداخل.",
      "خروج إفرازات دموية أو شفافة عفوية من الحلمة.",
      "تغير مفاجئ في حجم أحد الثديين مصحوب باحمرار وسخونة.",
    ],
    whenToContactDoctor_en: [
      "A new distinct hard lump in the breast or axillary (armpit) region.",
      "Noticeable skin changes such as dimpling (peau d'orange) or sudden nipple retraction.",
      "Spontaneous clear or bloody nipple discharge.",
      "Sudden localized swelling accompanied by redness or warmth.",
    ],
    references: [
      {
        title: "World Health Organization (WHO) Breast Cancer Key Facts",
        organization: "World Health Organization",
        url: "https://www.who.int/news-room/fact-sheets/detail/breast-cancer",
      },
      {
        title: "American Cancer Society: What Is Breast Cancer?",
        organization: "American Cancer Society",
        url: "https://www.cancer.org/cancer/types/breast-cancer/about/what-is-breast-cancer.html",
      },
      {
        title: "ESMO Clinical Practice Guidelines: Early Breast Cancer",
        organization: "European Society for Medical Oncology",
        url: "https://www.esmo.org/guidelines",
      },
    ],
    readingTimeMinutes: 5,
    publishedDate: "2025-01-10",
  },

  // 2. Treatment Journey
  {
    id: "art-journey-1",
    categoryId: "journey",
    title_ar: "رحلة العلاج الشاملة: من التشخيص إلى خطط العلاج المتكاملة",
    title_en: "The Comprehensive Treatment Journey: Pathways & Preparedness",
    summary_ar:
      "فهم دور الجراحة، العلاج الكيماوي، العلاج الإشعاعي، والعلاج الهرموني وكيفية التكيف مع كل مرحلة.",
    summary_en:
      "Understanding how surgery, chemotherapy, radiation, and endocrine therapies work sequentially.",
    detailedContent_ar: `تعتمد الخطة العلاجية لسرطان الثدي على عمل فريق متعدد التخصصات (Multidisciplinary Team) يضم جراح الأورام، طبيب علاج الأورام الدوائي، وأخصائي العلاج الإشعاعي.

تنقسم أركان العلاج عموماً إلى:
1. العلاج الجراحي: ويشمل إما استئصال الورم مع هامش أمان سليم (Lumpectomy) مع الحفاظ على الثدي، أو استئصال الثدي الكامل (Mastectomy) مع فحص العقدة اللمفاوية الحارسة (Sentinel Node).
2. العلاج الكيميائي: قد يُعطى قبل الجراحة لتصغير حجم الورم (Neoadjuvant) أو بعد الجراحة للقضاء على أي خلايا دقيقة غير مرئية (Adjuvant).
3. العلاج الإشعاعي: يستهدف منطقة الثدي أو جدار الصدر والعقد اللمفاوية لمنع النكس الموضعي بأمان وبدقة ميليمترية.
4. العلاج الهرموني والموجه: أقراص أو حقن دورية تستهدف مستقبلات الإستروجين (مثل التاموكسيفين ومثبطات الأروماتاز) أو أجسام مضادة لـ HER2، وتستمر لعدة سنوات لضمان الوقاية طويلة الأمد.

إن معرفتك بمواعيد الجرعات، وطبيعة الآثار الجانبية المتوقعة وكيفية تلطيفها، يساعدك على اجتياز هذه المحطة بثقة وثبات.`,
    detailedContent_en: `Your care protocol is formulated by a multidisciplinary team combining surgical oncologists, medical oncologists, radiation oncologists, and nurse navigators.

Core modalities include:
1. Surgical Intervention: Breast-conserving lumpectomy or mastectomy, alongside sentinel lymph node assessment.
2. Systemic Chemotherapy: Delivered either neoadjuvantly (prior to surgery to downsize the tumor) or adjuvantly (post-surgery to eradicate microscopic residual cells).
3. Precision Radiotherapy: Focused ion beams targeting the residual tissue and regional nodal basins to minimize local recurrence risk.
4. Endocrine & Targeted Agents: Oral or injectable agents (tamoxifen, aromatase inhibitors, anti-HER2 antibodies) prescribed over years for long-term prevention.`,
    practicalRecommendations_ar: [
      "حافظي على جدول زمني واضح لمواعيد الجلسات وفحوصات الدم الدورية قبل كل جرعة.",
      "ارتدي ملابس فضفاضة وسهلة الفتح عند الذهاب إلى جلسات العلاج أو الفحص.",
      "اطلبي مرافقة شخص مقرب ومريح نفسياً في الجلسات الأولى للشعور بالأمان وتدوين التعليمات.",
      "تناولي وجبة خفيفة سهلة الهضم قبل جلسات الحقن بساعة ما لم يوصِ الطبيب بخلاف ذلك.",
    ],
    practicalRecommendations_en: [
      "Keep an updated schedule of infusions and blood count tests required before each cycle.",
      "Wear comfortable, loose clothing with easy arm and chest access during treatment appointments.",
      "Bring a supportive relative or close friend to the initial sessions to assist with notes and comfort.",
      "Eat a small, bland, easily digestible meal 1-2 hours prior to infusions unless fasting is instructed.",
    ],
    precautions_ar: [
      "لا تفوتي جلسات الفحص الدموي قبل الكيماوي للتأكد من مستويات كريات الدم البيضاء والصفائح.",
      "تجنبي التجمعات المزدحمة في الفترات التي تنخفض فيها المناعة بعد الجرعات بيومين إلى خمسة أيام.",
    ],
    precautions_en: [
      "Never skip complete blood count (CBC) safety checks preceding systemic therapies.",
      "Avoid large crowded gatherings during the immunosuppressed nadir period (typically days 7-14 post-infusion).",
    ],
    whenToContactDoctor_ar: [
      "ارتفاع درجة حرارة الجسم إلى 38 درجة مئوية أو أعلى (حالة طوارئ تستدعي مراجعة الطوارئ فوراً).",
      "قشعريرة شديدة أو ارتعاش لا يتوقف حتى لو لم تكن الحرارة مرتفعة في لحظتها.",
      "غثيان أو قيء مستمر يمنعك من شرب السوائل لأكثر من 24 ساعة.",
      "ضيق في التنفس أو ألم مفاجئ في الصدر أو تسارع حاد في ضربات القلب.",
    ],
    whenToContactDoctor_en: [
      "Fever of 38.0°C (100.4°F) or above: constitutes a medical oncologic emergency requiring immediate hospital evaluation.",
      "Severe uncontrollable shaking chills (rigors).",
      "Persistent nausea or vomiting preventing fluid retention for over 24 hours.",
      "Sudden shortness of breath, chest pain, or rapid irregular heartbeat.",
    ],
    references: [
      {
        title:
          "National Comprehensive Cancer Network (NCCN) Guidelines for Patients: Breast Cancer",
        organization: "NCCN",
        url: "https://www.nccn.org/patients/guidelines/content/PDF/breast-invasive-patient.pdf",
      },
      {
        title: "ASCO Guidelines: Systemic Therapy for Patients with Early Breast Cancer",
        organization: "American Society of Clinical Oncology",
        url: "https://ascopubs.org",
      },
    ],
    readingTimeMinutes: 6,
    publishedDate: "2025-01-12",
  },

  // 3. Breast Surgery Recovery
  {
    id: "art-surgery-1",
    categoryId: "surgery_recovery",
    title_ar: "دليل التعافي بعد جراحة الثدي: العناية بالجرح والنزح الجراحي",
    title_en: "Breast Surgery Recovery Guide: Wound & Surgical Drain Care",
    summary_ar:
      "تعليمات عملية للعناية بالجرح، تفريغ أنابيب النزح الجراحي، وارتداء المشد الطبي بشكل سليم.",
    summary_en:
      "Practical step-by-step instructions for surgical incision hygiene, drain measurement, and recovery brassiere.",
    detailedContent_ar: `تعد مرحلة ما بعد الجراحة خطوة رئيسية نحو الشفاء الكامل. سواء خضعتِ لاستئصال جزئي مع تجريف جزئي للعقد، أو استئصال كلي مع إعادة بناء فوري، فإن العناية بالجرح تقلل فرص الالتهاب وتسرع الالتئام.

العناية بأنبوب النزح الجراحي (Jackson-Pratt Drain):
يقوم النزح بسحب السوائل والدم المتبقي من منطقة العملية لمنع تجمع السوائل (Seroma).
- يجب تفريغ الخزان مرتين إلى ثلاث مرات يومياً وتدوين الكمية بالسنتيمتر المكعب (ml) في سجل المتابعة.
- اغسلي يديكِ جيداً بالماء والصابون لمدة 20 ثانية قبل لمس الأنبوب.
- افتحي السدادة وفرغي السائل في الكوب المدرج، ثم اضغطي الخزان (لتكوين ضغط شفط سلبي) قبل إغلاق السدادة بإحكام.

حماية الشق الجراحي:
- حافظي على جفاف منطقة الضماد في الأيام الأولى حسب توصية الجراح، ولا تغمري المنطقة بالماء قبل إزالة الغرز والنزح.
- ارتدي حمالة الصدر الطبية بعد الجراحة (Post-surgical Bra) التي توفر دعماً ناعماً بدون أسلاك معدنية لتقليل الشد على الأنسجة.`,
    detailedContent_en: `Post-surgical care is pivotal in avoiding seromas, wound dehiscence, and surgical site infections.

Jackson-Pratt (JP) Drain Care:
- Empty the bulb 2-3 times daily, recording the measured volume in milliliters along with color notes.
- Wash hands thoroughly with antimicrobial soap for at least 20 seconds beforehand.
- Squeeze the bulb completely flat before resealing the cap to maintain therapeutic vacuum suction.
- Pin drains securely to your inner clothing or drain pouch to prevent accidental pulling.

Incision Care:
- Keep the incision dry as directed by your surgeon; avoid tub bathing or swimming until full closure.
- Wear a soft, front-closing, wireless medical bra that provides gentle compression without seam pressure on healing scars.`,
    practicalRecommendations_ar: [
      "دوني كمية سائل النزح ولونه يومياً في جدول لتقديمه للجراح عند موعد المراجعة.",
      "ثبتي خزان النزح بدبوس أمان لطيف في ملابسكِ الداخلية لمنع الشد المفاجئ على مكان الخروج.",
      "نامي على ظهركِ أو على الجانب غير المصاب، مع وضع وسادة مريحة تحت الذراع المصابة لدعمها.",
      "تجنبي رفع الأحمال الثقيلة (أكثر من 2 إلى 3 كغ) بالذراع المصابة خلال الأسابيع الأولى.",
    ],
    practicalRecommendations_en: [
      "Record daily drainage volume (mL) and color in a recovery journal for your surgeon's review.",
      "Safety-pin the drain bulb to your inner garment below incision level to avoid traction on the entry site.",
      "Sleep in a semi-recumbent position or on the unaffected side, using a supportive pillow under the affected arm.",
      "Refrain from lifting heavy objects (over 5 lbs / 2.5 kg) with the operative arm during the initial weeks.",
    ],
    precautions_ar: [
      "لا تضعي أي مراهم أو معقمات عطرية أو زيوت على الجرح ما لم يصفها الجراح بالاسم.",
      "تجنبي الشد المفاجئ للذراع للأعلى أو للخلف مباشرة بعد الجراحة لتفادي فتح الغرز.",
    ],
    precautions_en: [
      "Do not apply unprescribed ointments, alcohol rubs, or essential oils directly onto incisions.",
      "Avoid sudden overhead reaching or aggressive extension of the surgical arm in the immediate postoperative phase.",
    ],
    whenToContactDoctor_ar: [
      "احمرار متزايد أو سخونة واضحة تنتشر حول الشق الجراحي.",
      "خروج سائل كريه الرائحة أو صديد أصفر/أخضر من الجرح أو مكان الأنبوب.",
      "انخفاض مفاجئ أو توقف تام في نزول السوائل في الأنبوب مصحوب بانتفاخ مؤلم تحت الجلد.",
      "نزيف دموي أحمر فاقع مستمر يملأ الخزان بسرعة.",
      "حمى تتجاوز 38.3 مئوية.",
    ],
    whenToContactDoctor_en: [
      "Spreading redness, warmth, or progressive induration around the surgical incision.",
      "Foul-smelling, cloudy, or purulent drainage from the wound or drain site.",
      "Sudden cessation of drainage combined with a painful, bulging fluid pocket (seroma) under the skin.",
      "Bright red active bleeding rapidly filling the drain bulb.",
      "Fever exceeding 38.3°C (101°F).",
    ],
    references: [
      {
        title: "American College of Surgeons: Breast Surgery Patient Recovery Guide",
        organization: "American College of Surgeons",
        url: "https://www.facs.org/for-patients",
      },
      {
        title: "Memorial Sloan Kettering Cancer Center: Caring for Your Jackson-Pratt Drain",
        organization: "MSKCC",
        url: "https://www.mskcc.org/cancer-care/patient-education/caring-your-jackson-pratt-drain",
      },
    ],
    readingTimeMinutes: 5,
    publishedDate: "2025-01-15",
  },

  // 4. Physical Rehabilitation
  {
    id: "art-rehab-1",
    categoryId: "rehabilitation",
    title_ar: "إعادة التأهيل الحركي: استعادة مرونة الذراع والكتف بأمان",
    title_en: "Physical Rehabilitation: Safely Restoring Shoulder Mobility",
    summary_ar:
      "تمارين تدريجية لتحسين نطاق الحركة ومنع التيبس العضلي بعد جراحة الثدي واستئصال العقد اللمفية.",
    summary_en:
      "Graded therapeutic exercises to prevent frozen shoulder and regain full range of motion post-surgery.",
    detailedContent_ar: `بعد جراحة الثدي، قد تشعر المريضة بشد وتيبس في الكتف، الصدر، وجدار الإبط. يساعد البدء في برنامج تمارين حركية خفيفة وتدريجية في استعادة كامل حركة المفصل، وتخفيف الشد، وتحسين الدورة الدموية وتصريف السوائل اللمفية.

المراحل الزمنية للتمارين:
1. الأيام الأولى بعد الجراحة (مع وجود النزح):
   - التركيز على تمارين الضخ الخفيفة: فتح وغلق كف اليد، ثني وبسط المعصم والمرفق أثناء الاستلقاء.
   - تمارين التنفس العميق بالبطن لتهدئة القفص الصدري وتحفيز حركة الأكسجين.

2. بعد إزالة أنابيب النزح وبموافقة الجراح (غالباً بعد الأسبوع الثاني):
   - تمرين تسلق الجدار بالأصابع (Wall Climbing): الوقوف بمواجهة الحائط وصعود الأصابع للأعلى بنعومة دون إجهاد.
   - تمرين البندول (Pendulum Exercise): الانحناء للأمام برفق ودع الذراع المصابة تتأرجح بحرية في دوائر صغيرة لتخفيف ضغط مفصل الكتف.
   - تمرين فتح الصدر بالوسادة: استلقاء مريح مع فتح الذراعين جانباً للشعور بتمدد لطيف ومريح في عضلات الصدر.

تذكري: التمارين لا ينبغي أن تسبب ألماً حاداً، بل شعوراً بتمدد خفيف ومقبول.`,
    detailedContent_en: `Following surgical interventions in the breast and axilla, musculoskeletal stiffness, chest wall tightness, and reduced shoulder abduction frequently occur. Graded physical therapy prevents capsular contracture and restores functional independence.

Phased Exercise Milestones:
1. Phase 1 (Initial Post-Op with Drains in place):
   - Distal pumping motions: gentle fist clenches, wrist flexion/extension, and elbow bends.
   - Diaphragmatic deep breathing to mobilize the rib cage and promote lymphatic flow.

2. Phase 2 (Post-drain removal with surgical clearance):
   - Finger wall climbs: facing a wall, gently walking fingertips upward to a comfortable stretch point.
   - Pendulum swings: leaning forward, letting the arm swing smoothly in small circles under gravity.
   - Gentle supine chest opener: relaxing with pillows supporting comfortable bilateral arm elevation.

Key Rule: Stretching should produce a mild, comfortable stretch, never sharp lancinating pain.`,
    practicalRecommendations_ar: [
      "مارسي التمارين مرتين إلى ثلاث مرات يومياً لمدة 10 إلى 15 دقيقة في بيئة هادئة ومريحة.",
      "خذي حماماً دافئاً أو ضعي كمادة دافئة لطيفة (غير حارة) على الكتف قبل التمرين لتليين العضلات (تجنبي الجروح المفتوحة).",
      "تنفسي بعمق أثناء الحركة؛ لا تحبسي أنفاسكِ أبداً عند محاولة الوصول لارتفاع معين.",
      "تدرجي ببطء؛ الهدف هو الاستمرارية اليومية وليس السرعة.",
    ],
    practicalRecommendations_en: [
      "Perform your rehabilitation sequence 2-3 times daily for 10-15 minutes in a calm setting.",
      "Warm the shoulder with gentle movement before stretching; never hold your breath during stretches.",
      "Prioritize smooth continuity over rapid progression; gains in range of motion compound over weeks.",
      "Record your highest comfortable finger-climb mark on the wall to visually monitor progress.",
    ],
    precautions_ar: [
      "توقفي فوراً إذا شعرتِ بدوخة، ألم حاد كالطعن في الكتف، أو إحساس بتمزق في منطقة الجرح.",
      "لا تتركي أي شخص يدفع ذراعكِ بالقوة إلى الخلف أو للأعلى (تجنبي التمديد القسري).",
    ],
    precautions_en: [
      "Stop immediately if you experience sharp lancinating pain, dizziness, or tearing sensations.",
      "Never allow anyone to force or violently jerk your arm beyond its pain-free tolerance.",
    ],
    whenToContactDoctor_ar: [
      "تدهور مفاجئ في حركة الكتف بحيث تصبح الذراع عاجزة عن الارتفاع لمستوى الصدر.",
      "تورم جديد وسريع في اليد أو المعصم أو الساعد بعد ممارسة التمارين.",
      "ألم عصبي مستمر يشبه الكهرباء أو خدر وتنميل متزايد في الأصابع.",
    ],
    whenToContactDoctor_en: [
      "Sudden loss of previously achieved shoulder range of motion or joint locking.",
      "Rapid onset of swelling in the fingers, wrist, or forearm following exercise.",
      "Radiating shooting electric pains or progressive numbness in the fingers.",
    ],
    references: [
      {
        title: "American Cancer Society: Exercises After Breast Surgery",
        organization: "American Cancer Society",
        url: "https://www.cancer.org/cancer/types/breast-cancer/treatment/surgery-for-breast-cancer/exercises-after-breast-cancer-surgery.html",
      },
      {
        title: "Oncology Physical Therapy Rehabilitation Consensus",
        organization: "Journal of Cancer Survivorship",
        url: "https://link.springer.com/journal/11764",
      },
    ],
    readingTimeMinutes: 5,
    publishedDate: "2025-01-18",
  },

  // 5. Lymphedema Awareness
  {
    id: "art-lymph-1",
    categoryId: "lymphedema",
    title_ar: "التوعية بالوذمة اللمفية (Lymphedema): سبل الوقاية والعناية بالذراع",
    title_en: "Lymphedema Awareness: Prevention & Lifetime Arm Care",
    summary_ar:
      "إرشادات حيوية لحماية الذراع المعرضة للخطر بعد إزالة العقد اللمفاوية أو الإشعاع الإبطي.",
    summary_en:
      "Vital guidelines to protect your at-risk arm following axillary dissection or nodal radiotherapy.",
    detailedContent_ar: `تحدث الوذمة اللمفية عندما يتراكم السائل اللمفاوي الغني بالبروتين في الأنسجة الرخوة للذراع أو اليد أو جدار الصدر، وذلك نتيجة تأثر مسارات التصريف اللمفاوي بعد إزالة العقد اللمفاوية تحت الإبط أو تعرضها للإشعاع.

على الرغم من أنها قد تحدث لدى نسبة من المتعافيات، إلا أن الوعي بالعوامل المحفزة واتباع الاحتياطات اليومية يقلل من احتمالية حدوثها بشكل كبير ويسمح بالسيطرة عليها في بداياتها.

أهم القواعد الذهبية لحماية الذراع:
1. تجنب الإصابات والجروح: تجنبي وخز الإبر، سحب الدم، وقياس ضغط الدم في الذراع الواقعة في جهة الجراحة.
2. تجنب الحرارة الزائدة: مثل حمامات الساونا والجاكوزي والتعرض الطويل لأشعة الشمس الحارقة؛ فالحرارة تزيد من تدفق الدم مما يجهد الجهاز اللمفاوي.
3. تجنب الضغط الموضعي المقيد: تجنبي الأساور الضيقة، حمالات الصدر ذات الأشرطة القاسية التي تضغط على الكتف، أو حمل الحقائب الثقيلة على نفس الكتف.
4. النظافة والعناية بالجلد: حافظي على بشرة اليد والذراع رطبة وسليمة لمنع أي مدخل للبكتيريا المسببة للحمرة (Cellulitis).`,
    detailedContent_en: `Secondary lymphedema is the chronic accumulation of protein-rich lymphatic interstitial fluid in the arm, hand, or breast/chest wall caused by disruption of axillary lymphatics from nodal dissection or radiotherapy.

Early detection and preventive vigilance drastically lower the risk of progression to irreversible fibrotic stages.

Golden Protection Principles:
1. Limb Alert: strictly avoid venipuncture, injections, and blood pressure cuff measurements on the affected operative arm whenever possible.
2. Heat Avoidance: avoid saunas, hot tubs, steam baths, and severe sunburns, as thermal vasodilation increases lymphatic microvascular load.
3. Constriction Prevention: avoid tight elastic cuffs, constrictive jewelry, tight brassiere straps that dig into the shoulder, and carrying heavy bags on the affected side.
4. Skin Barrier Integrity: keep the stratum corneum hydrated with fragrance-free emollients to prevent microfissures that invite bacterial cellulitis.`,
    practicalRecommendations_ar: [
      "ارتدي قفازات واقية عند غسل الأطباق أو العمل في الحديقة أو استخدام المنظفات القوية لمنع الخدوش.",
      "استخدمي ماكينة حلاقة كهربائية بدلاً من الشفرات الحادة لتجنب جروح الإبط.",
      "استخدمي طارد حشرات لمنع اللسعات، وعالجي أي خدش بسيط فوراً بتطهيره وتغطيته بضمادة نظيفة.",
      "عند السفر بالطائرة لمسافات طويلة، استشيري أخصائي العلاج الطبيعي حول ارتداء كم ضاغط معتمد (Compression Sleeve).",
    ],
    practicalRecommendations_en: [
      "Wear protective gloves when doing dishes, gardening, or handling household chemicals to prevent microtrauma.",
      "Use an electric razor rather than straight razor blades for axillary grooming.",
      "Apply insect repellent outdoors; clean any accidental cut or scratch immediately with antiseptic and bandage.",
      "Consult a certified lymphedema therapist (CLT) regarding fitted compression sleeves for long air flights.",
    ],
    precautions_ar: [
      "لا تتجاهلي أي شعور بثقل أو ضيق في الخاتم أو الساعة في اليد المصابة حتى لو لم يكن التورم واضحاً بالعين.",
      "تجنبي حمل حقائب التسوق الثقيلة أو رفع الأثقال المفاجئ بتلك الذراع.",
    ],
    precautions_en: [
      "Do not dismiss subtle tightness of rings, watches, or shirt cuffs, even before visible swelling manifests.",
      "Avoid carrying heavy grocery bags or abrupt heavy weightlifting with the vulnerable limb.",
    ],
    whenToContactDoctor_ar: [
      "تورم ملحوظ أو شعور متزايد بالثقل والامتلاء في الذراع أو الأصابع أو الثدي.",
      "احمرار سريع الانتشار في جلد الذراع مصحوب بسخونة وألم (اشتباه التهاب خلوي بكتيري يستدعي مضاداً حيوياً عاجلاً).",
      "ارتفاع مفاجئ في درجة الحرارة وقشعريرة مقترنة بتغيرات في جلد الذراع.",
    ],
    whenToContactDoctor_en: [
      "Noticeable swelling or an enduring sensation of fullness and heaviness in the arm, hand, or chest.",
      "Rapidly spreading erythema (redness), warmth, and pain along the arm—indicative of bacterial cellulitis requiring prompt antibiotic therapy.",
      "Systemic fever and chills coinciding with arm sensitivity.",
    ],
    references: [
      {
        title: "National Lymphedema Network: Clinical Guidelines for Risk Reduction",
        organization: "National Lymphedema Network (NLN)",
        url: "https://lymphnet.org",
      },
      {
        title: "International Society of Lymphology (ISL) Consensus Document",
        organization: "ISL",
        url: "https://www.u-arizona.edu/~witte/ISL.htm",
      },
    ],
    readingTimeMinutes: 6,
    publishedDate: "2025-01-20",
  },

  // 6. Skin Care
  {
    id: "art-skin-1",
    categoryId: "skin_care",
    title_ar: "العناية المتكاملة بالبشرة أثناء وبعد العلاج الإشعاعي والكيماوي",
    title_en: "Skin Care Protocols During & After Radiation and Chemotherapy",
    summary_ar:
      "حماية حاجز البشرة، الوقاية من التهاب الجلد الإشعاعي، والتعامل مع الجفاف والحساسية الشديدة.",
    summary_en:
      "Safeguarding skin barrier function, managing radiation dermatitis, and treating xerosis.",
    detailedContent_ar: `تؤثر علاجات الأورام بشكل مباشر على خلايا البشرة سريعة التجدد. يتسبب العلاج الكيميائي غالباً في جفاف عام (Xerosis)، حساسية للشمس، وهشاشة في الأظافر، بينما يتسبب العلاج الإشعاعي في احمرار موضعي وجفاف وتقشر يشبه حروق الشمس (Radiation Dermatitis) في منطقة الصدر المعالجة.

أساسيات العناية بالجلد:
1. التنظيف فائق اللطف: اغسلي البشرة بماء فاتر فقط واستخدمي منظفاً خالياً تماماً من الصابون القلوي والعطور والكحول (Soap-free Syndet).
2. الترطيب المتكرر: ضعي مرطبات غنية بالسيراميد أو زبدة الشيا النقية أو الهيالورونيك الخالي من العطور على بشرة رطبة بعد الاستحمام مباشرة.
3. قاعدة العلاج الإشعاعي: لا تضعي أي كريمات أو مراهم قبل جلسة الإشعاع مباشرة (ساعتين إلى ثلاث ساعات على الأقل) لتجنب تأثير البولس وزيادة جرعة الجلد السطحية، بل ضعي المرطب المعتمد بعد انتهاء الجلسة.
4. الأقمشة والملابس: ارتدي ملابس قطنية 100% فضفاضة وفاتحة اللون لتفادي الاحتكاك أو التعرق المفرط.`,
    detailedContent_en: `Oncologic interventions challenge cutaneous homeostasis. Chemotherapy impairs epidermal turnover causing xerosis, photosensitivity, and nail dystrophy. Radiotherapy triggers radiation-induced dermatitis ranging from mild erythema to dry or moist desquamation.

Evidence-based Skin Care Protocol:
1. Ultra-gentle Hygiene: cleanse with lukewarm water and fragrance-free, pH-balanced syndet washes; pat dry with plush cotton.
2. Barrier-restoring Emollients: apply medical-grade ceramide or lipid-rich formulations immediately post-cleansing to seal moisture.
3. Radiation Timing Rule: ensure the irradiated skin is clean and completely free of thick topical creams at least 2-3 hours before each radiation fraction to prevent bolus effects. Apply approved emollients post-treatment.
4. Breathable Textiles: select loose, unbleached, 100% cotton garments to eliminate mechanical friction on sensitive skin.`,
    practicalRecommendations_ar: [
      "جففي البشرة دائماً بطريقة التربيت اللطيف بمنشفة قطنية ناعمة، وتجنبي الفرك تماماً.",
      "استخدمي واقي شمس فيزيائي يحتوي على أكسيد الزنك أو ثاني أكسيد التيتانيوم بعامل حماية SPF 50+ وتجنبي التعرض المباشر للشمس.",
      "تجنبي استخدام أكياس الماء الساخن أو كمادات الثلج مباشرة على منطقة الجلد المعالجة بالإشعاع.",
      "امتنعي عن إزالة الشعر بالشمع أو الشفرات الحادة في المنطقة المعالجة وتحت الإبط طوال فترة العلاج.",
    ],
    practicalRecommendations_en: [
      "Always pat skin dry with a soft towel; never rub or scrub vigorously.",
      "Apply broad-spectrum mineral sunscreen (zinc oxide / titanium dioxide SPF 50+) and shield treated areas with UV-protective clothing.",
      "Avoid heating pads or direct ice packs on radiation-treated skin fields.",
      "Refrain from waxing, depilatory creams, or shaving the irradiated axilla during active treatment cycles.",
    ],
    precautions_ar: [
      "لا تستخدمي المنتجات المحتوية على أحماض التقشير (AHA/BHA)، الرتينول، أو العطور المركزة على المنطقة المعالجة.",
      "لا تقشري أي قشور جلدية جافة بأصابعك؛ دعيها تسقط تلقائياً مع استمرار الترطيب اللطيف.",
    ],
    precautions_en: [
      "Avoid topical exfoliants, AHAs, BHAs, retinoids, or heavy fragrances on compromised skin.",
      "Never pick or peel flaking skin; allow desquamated layers to shed naturally under emollient care.",
    ],
    whenToContactDoctor_ar: [
      "تشقق الجلد مع خروج إفرازات مصلية رطبة صفراء أو نزيف (تقشر رطب Moist Desquamation).",
      "ألم حارق شديد لا يهدأ بالمرطبات الموصوفة.",
      "ظهور بثور صديدية أو طفح جلدي متسع مصحوب بارتفاع في الحرارة.",
    ],
    whenToContactDoctor_en: [
      "Open skin breakdown with oozing serous fluid or localized bleeding (moist desquamation).",
      "Severe burning dermatologic pain refractory to prescribed emollients.",
      "Pustular eruptions, ulcerations, or expanding rash accompanied by fever.",
    ],
    references: [
      {
        title:
          "Multinational Association of Supportive Care in Cancer (MASCC) Radiodermatitis Guidelines",
        organization: "MASCC",
        url: "https://mascc.org",
      },
      {
        title: "American Academy of Dermatology: Skin Care During Cancer Treatment",
        organization: "AAD",
        url: "https://www.aad.org/public/diseases/cancer-treatment-skin",
      },
    ],
    readingTimeMinutes: 5,
    publishedDate: "2025-01-22",
  },

  // 7. Nutrition & Hydration
  {
    id: "art-nutr-1",
    categoryId: "nutrition",
    title_ar: "التغذية العلاجية والترطيب: دعم المناعة والطاقة أثناء التعافي",
    title_en: "Therapeutic Nutrition & Hydration: Fueling Recovery & Immunity",
    summary_ar:
      "نظام غذائي متوازن وغني بالبروتين ومضادات الأكسدة الطبيعية للتعامل مع تغيرات التذوق والغثيان.",
    summary_en:
      "Nutritional strategies emphasizing lean proteins, adequate hydration, and managing dysgeusia or nausea.",
    detailedContent_ar: `تلعب التغذية السليمة دوراً محورياً في دعم جهاز المناعة، الحفاظ على الكتلة العضلية، وتسريع شفاء الأنسجة المتضررة جراء العلاجات الجراحية والدوائية.

الركائز الأساسية للتغذية أثناء العلاج:
1. البروتين عالي الجودة: يُعد حجر الأساس لإصلاح الأنسجة وخلايا الدم البيضاء. ركزي على البيض، صدور الدجاج المطهوة جيداً، الأسماك الغنية بأوميغا-3، البقوليات المطبوخة، والزبادي الطبيعي.
2. الترطيب المستمر: احرصي على شرب ما بين 1.5 إلى 2.5 لتر من السوائل يومياً (ماء، حساء خضار دافئ، شاي الأعشاب المعتمد كالبابونج) للمساعدة في التخلص من نواتج استقلاب الأدوية وحماية وظائف الكلى.
3. التغلب على تغيرات التذوق (طعم معدني):
   - استخدام ملاعق وشوك زجاجية أو خشبية بدلاً من المعدن.
   - إضافة قطرات خفيفة من الليمون أو الأعشاب العطرية كالنعناع إذا كانت مستساغة ولم تكن هناك تقرحات فموية.
4. وجبات صغيرة ومتكررة: تقسيم الطعام إلى 5 أو 6 وجبات صغيرة وخفيفة بدلاً من 3 وجبات كبيرة لتجنب الثقل والغثيان.`,
    detailedContent_en: `Targeted clinical nutrition supports cellular repair, attenuates cancer cachexia, preserves lean muscle mass, and buffers treatment-related toxicity.

Core Nutritional Pillars:
1. High-Biological-Value Protein: essential for tissue healing and leukocyte synthesis. Incorporate well-cooked poultry, fish high in omega-3, eggs, legumes, and Greek yogurt.
2. Optimal Hydration: consume 1.5 to 2.5 liters of clean fluids daily (water, clear broths, herbal infusions) to assist hepatic and renal clearance of chemotherapeutic metabolites.
3. Mitigating Dysgeusia (Metallic Taste):
   - Use non-metallic glassware, ceramic, or wooden utensils.
   - Enhance food aroma with gentle citrus, mint, or natural seasonings provided oral mucosa is free of mucositis.
4. Small, Frequent Meals: 5-6 nutrient-dense smaller portions throughout the day prevent postprandial nausea and sustain caloric delivery.`,
    practicalRecommendations_ar: [
      "احتفظي بزجاجة ماء بجانبكِ طوال اليوم واشربي رشفات صغيرة منتظمة حتى دون الشعور بالعطش.",
      "اغسلي الخضار والفواكه وقشريها جيداً واحرصي على طهي اللحوم والبيض حتى النضج التام لتفادي التسمم الغذائي.",
      "في حالة الغثيان الصباحي، تناولي قطعة بسكويت جاف أو بقسماط قبل مغادرة السرير.",
      "حضري وجبات خفيفة غنية بالطاقة مسبقاً (مثل زبدة الفول السوداني الطبيعية مع الشوفان) لأوقات التعب.",
    ],
    practicalRecommendations_en: [
      "Keep a water bottle at arm's reach and take frequent sips throughout the day.",
      "Practice strict food safety: wash produce thoroughly, peel skins, and ensure meats/eggs are thoroughly cooked.",
      "Keep dry crackers or toast bedside to nibble before getting up if morning nausea strikes.",
      "Prepare easily accessible nutrient-dense snacks (smoothies, nut butters, oatmeal) during peak energy hours.",
    ],
    precautions_ar: [
      "تجنبي اللحوم النيئة، الأسماك غير المطبوخة (كالسوشي)، والأجبان غير المبسترة تماماً لضعف المناعة.",
      "لا تتناولي فاكهة الجريب فروت (Grapefruit) أثناء العلاج الكيماوي أو الموجه لأنها تتداخل مع إنزيمات كبدية حيوية تفكك الأدوية.",
    ],
    precautions_en: [
      "Strictly avoid raw meats, sushi, raw shellfish, unpasteurized milk/cheeses during immunocompromised periods.",
      "Do not consume grapefruit or Seville oranges during systemic therapy; they inhibit CYP3A4 enzymes responsible for drug metabolism.",
    ],
    whenToContactDoctor_ar: [
      "فقدان غير مقصود لأكثر من 5% من وزن الجسم في غضون شهر واحد.",
      "صعوبة شديدة وألم في البلع أو ظهور تقرحات بيضاء مؤلمة تغطي بطانة الفم (التهاب الغشاء المخاطي الفموي Mucositis).",
      "إسهال أو إمساك حاد ومستمر لأكثر من يومين دون استجابة للعلاجات الداعمة.",
    ],
    whenToContactDoctor_en: [
      "Unintended weight loss exceeding 5% of body weight within one month.",
      "Severe odynophagia (painful swallowing) or extensive oral mucositis lesions.",
      "Severe persistent diarrhea or obstipation lasting over 48 hours without relief.",
    ],
    references: [
      {
        title:
          "American Institute for Cancer Research (AICR) / WCRF Guidelines on Cancer Survivorship",
        organization: "AICR / WCRF",
        url: "https://www.aicr.org",
      },
      {
        title: "ESPEN Guidelines on Nutrition in Cancer Patients",
        organization: "European Society for Clinical Nutrition and Metabolism",
        url: "https://www.espen.org",
      },
    ],
    readingTimeMinutes: 5,
    publishedDate: "2025-01-25",
  },

  // 8. Emotional Well-being
  {
    id: "art-emot-1",
    categoryId: "emotional",
    title_ar: "الصحة النفسية والدعم العاطفي: التعامل مع القلق وبناء الأمل",
    title_en: "Emotional Well-being: Coping with Anxiety & Nurturing Resilience",
    summary_ar:
      "إرشادات للتعامل مع الصدمة النفسية الأولى، تقلب المزاج، والحديث مع العائلة وإيجاد مساحات السلام الداخلي.",
    summary_en:
      "Psychological grounding techniques, managing vulnerability, open dialogue, and finding serenity.",
    detailedContent_ar: `إن رحلة علاج سرطان الثدي ليست مجرد مسار جسدي، بل تجربة عاطفية عميقة ومكثفة. من الطبيعي تماماً أن تتأرجح مشاعركِ بين الخوف، الغضب، الحزن، والأمل. إن قبول هذه المشاعر دون لوم للنفس هو أولى خطوات الدعم الذاتي.

خطوات عملية لدعم صحتك النفسية:
1. تقبل المشاعر الإنسانية: لستِ مضطرة لأن تكوني "قوية ومبتسمة" طوال الوقت من أجل الآخرين؛ من حقكِ التعبير عن حزنكِ أو رغبتكِ في البكاء والراحة.
2. تمارين التنفس الواعي (Box Breathing): استنشاق الهواء ببطء لـ 4 ثوانٍ، حبس النفس لـ 4 ثوانٍ، ثم الزفير ببطء لـ 4 ثوانٍ. يساعد ذلك في كسر حلقة القلق الفورية وتحفيز العصب الحائر المسؤول عن الاسترخاء.
3. دوائر الدعم الإيجابي: حددي الأشخاص الذين يمنحونكِ طاقة هادئة وإصغاءً حقيقياً، ولا تترددي في وضع حدود لطيفة مع من يقدمون نصائح مزعجة أو قصصاً سلبية.
4. مجموعات الدعم المتخصصة: التواصل مع نساء خضن نفس الرحلة وتجاوزنها يمنح شعوراً عميقاً بعدم الوحدة ويقدم حلولاً عملية مجربة.`,
    detailedContent_en: `A breast cancer diagnosis initiates a profound emotional recalibration. Ambivalence, vulnerability, grief over physical changes, and existential anxiety are standard psychological responses. Self-compassion is the foundation of emotional healing.

Evidence-based Psycho-oncology Strategies:
1. Emotional Validation: release the obligation of constant performative positivity. Permitting yourself to grieve or feel exhausted normalizes emotional expression.
2. Somatic Grounding & Box Breathing: inhale for 4 counts, hold for 4, exhale for 4, rest for 4. This activates the vagal parasympathetic pathway, quelling autonomic fight-or-flight panic.
3. Setting Interpersonal Boundaries: designate close contacts who listen without unsolicited advice. It is healthy to decline exhausting social visits.
4. Peer Support Communities: shared lived experiences in accredited support groups eliminate isolation and provide proven coping perspectives.`,
    practicalRecommendations_ar: [
      "خصصي 10 دقائق صباحاً أو مساءً لكتابة يومياتكِ ومشاعركِ بدون أي رقابة أو تعديل (تفريغ شعوري).",
      "مارسي أنشطة لطيفة تبهجكِ: قراءة كتاب خفيف، الاستماع لأصوات الطبيعة أو القرآن الكريم، أو العناية بنبتة منزلية.",
      "اطلبي مساعدة واضحة ومحددة من المحيطين (مثلاً: إعداد وجبة معينة، اصطحاب الأطفال، أو المرافقة في مشوار هادئ).",
      "تذكري أن هذا المسار مؤقت وله نهاية، وأن خطواتكِ الصغيرة اليومية تصنع فارقاً حقيقياً في تعافيكِ.",
    ],
    practicalRecommendations_en: [
      "Dedicate 10 quiet minutes daily to expressive journaling without self-censorship.",
      "Engage in restorative micro-rituals: gentle music, peaceful nature strolls, or soothing guided meditation.",
      "Delegate specific tasks clearly to friends and family (e.g. running an errand or meal preparation).",
      "Remind yourself that this phase is finite and that each small day of care moves you toward restoration.",
    ],
    precautions_ar: [
      "لا تعزلي نفسكِ تماماً عن العالم لأسابيع متواصلة؛ التواصل الإنساني عنصر دوائي حقيقي.",
      "تجنبي البحث العشوائي في منتديات الإنترنت في أوقات متأخرة من الليل عندما يكون التفكير في أقصى درجات القلق.",
    ],
    precautions_en: [
      "Avoid total social withdrawal; human connection is a validated therapeutic buffer against clinical depression.",
      "Refrain from late-night unstructured web searches when anxiety impairs objective critical thinking.",
    ],
    whenToContactDoctor_ar: [
      "شعور مستمر بالحزن الشديد أو فقدان تام للقدرة على الاستمتاع بأي شيء لأكثر من أسبوعين متواصلين.",
      "أفكار إيذاء النفس أو الشعور بانعدام الجدوى من الحياة (استشارة نفسية فورية وعاجلة).",
      "نوبات هلع متكررة تسبب ضيق تنفس شديد وتسارعاً بالقلب يمنعكِ من ممارسة يومكِ.",
    ],
    whenToContactDoctor_en: [
      "Unrelenting pervasive depressive mood or inability to experience any pleasure lasting over 2 consecutive weeks.",
      "Any thoughts of self-harm or feelings of worthlessness (requires urgent professional psycho-oncology support).",
      "Recurrent panic attacks causing acute hyperventilation and debilitating anxiety.",
    ],
    references: [
      {
        title: "International Psycho-Oncology Society (IPOS) Standards of Care",
        organization: "IPOS",
        url: "https://ipos-society.org",
      },
      {
        title: "American Psychological Association: Coping with a Breast Cancer Diagnosis",
        organization: "APA",
        url: "https://www.apa.org/topics/cancer-breast",
      },
    ],
    readingTimeMinutes: 5,
    publishedDate: "2025-01-28",
  },

  // 9. Sleep and Fatigue Management
  {
    id: "art-sleep-1",
    categoryId: "sleep_fatigue",
    title_ar: "إدارة النوم والإرهاق المصاحب لعلاج السرطان (CRF)",
    title_en: "Managing Cancer-Related Fatigue (CRF) & Restorative Sleep",
    summary_ar:
      "فهم طبيعة إرهاق السرطان، موازنة مستويات الطاقة، وإرشادات النوم الهادئ لراحة عميقة.",
    summary_en:
      "Understanding chronic fatigue mechanisms, energy conservation budgeting, and circadian sleep hygiene.",
    detailedContent_ar: `يُعد الإرهاق المرتبط بالسرطان (Cancer-Related Fatigue - CRF) من أكثر الأعراض شيوعاً، وهو يختلف تماماً عن التعب العادي؛ إذ لا يزول بمجرد أخذ قسط عادي من الراحة أو النوم. ينتج هذا الإرهاق عن استجابة الجسم المناعية للعلاج، وإعادة بناء الخلايا، وتأثير الأدوية على مستويات الهيموجلوبين والنوم.

استراتيجية "ميزانية الطاقة":
عاملي طاقتكِ اليومية كميزانية مالية محدودة:
- حددي الأنشطة الأكثر أهمية لكِ في الصباح عندما تكون طاقتكِ في أعلى مستوياتها.
- وزعي فترات راحة قصيرة (15 إلى 20 دقيقة) بين المهام قبل أن تشعري بالإنهاك التام.
- فترات القيلولة: اجعليها قبل الساعة 3 عصراً وألا تزيد عن 30 دقيقة حتى لا تؤثر على جودة النوم الليلي.

نظافة النوم (Sleep Hygiene):
- حافظي على موعد ثابت للاستيقاظ والنوم يومياً حتى في عطلات نهاية الأسبوع لضبط ساعتكِ البيولوجية.
- احرصي على أن تكون غرفة النوم مظلمة، باردة قليلاً، وهادئة.
- ابتعدي عن الشاشات الزرقاء (الهاتف، التلفزيون) قبل النوم بساعة على الأقل لأنها تثبط إفراز هرمون الميلاتونين المنوم.`,
    detailedContent_en: `Cancer-Related Fatigue (CRF) is a distressing, persistent, subjective sense of physical, emotional, and cognitive exhaustion related to cancer therapy that is disproportionate to recent activity and not fully relieved by sleep.

The Energy Banking Framework:
Conceptualize your daily stamina as a finite checking account:
- Prioritize high-value tasks during personal peak stamina windows (often late mornings).
- Pace activities with proactive 15-minute scheduled restorative intervals before exhaustion sets in.
- Optimize power naps: limit daytime naps to 20-30 minutes prior to 3:00 PM to protect nighttime sleep architecture.

Circadian Sleep Hygiene:
- Anchor consistent wake-up times daily to support circadian rhythm synchronization.
- Maintain a cool, pitch-dark, quiet bedroom sanctuary.
- Discontinue blue-light digital screens at least 60 minutes prior to sleep to enable endogenous melatonin surges.`,
    practicalRecommendations_ar: [
      "مارسي رياضة المشي الخفيف لمدة 15 إلى 20 دقيقة في الهواء الطلق صباحاً؛ فالنشاط البدني المعتدل ثبت علمياً أنه أفضل علاج للإرهاق السرطاني.",
      "تجنبي المشروبات المحتوية على الكافيين (القهوة والشاي الثقيل) بعد الساعة 2 بعد الظهر.",
      "استخدمي وسائد داعمة تحت الذراع المصابة وبين الركبتين لتقليل الضغط العضلي أثناء النوم.",
      "استمعي لتمارين استرخاء عضلات تدريجي أو تسجيلات هادئة للمساعدة في النوم.",
    ],
    practicalRecommendations_en: [
      "Engage in gentle 15-20 minute outdoor morning walking; graded aerobic activity is clinically proven to reduce CRF.",
      "Limit caffeinated beverages after 2:00 PM.",
      "Position supporting pillows under the surgical arm and between knees to prevent musculoskeletal tension.",
      "Utilize progressive muscle relaxation audio guidance to ease neuromuscular vigilance at bedtime.",
    ],
    precautions_ar: [
      "لا تلجأي للمنومات الدوائية دون استشارة وإشراف مباشر من طبيبكِ المعالج منعاً للتداخلات الدوائية.",
      "تجنبي البقاء في السرير طوال اليوم مستيقظة؛ فالخمول التام يضعف العضلات ويزيد من حدة الإرهاق.",
    ],
    precautions_en: [
      "Never take over-the-counter sleep aids or sedative pharmaceuticals without your oncologist's explicit review.",
      "Avoid staying bedridden when awake; prolonged daytime recumbency induces deconditioning and worsens fatigue.",
    ],
    whenToContactDoctor_ar: [
      "إرهاق شديد مفاجئ يعجزكِ تماماً عن مغادرة السرير للوصول إلى الحمام.",
      "دوخة شديدة أو إغماء عند الوقوف (قد يشير إلى فقر دم حاد أو جفاف).",
      "أرق حاد ومستمر لعدة أيام متتالية يؤثر على استقراركِ العصبي وصحتكِ العامة.",
    ],
    whenToContactDoctor_en: [
      "Profound sudden fatigue preventing essential self-care or walking to the bathroom.",
      "Severe postural lightheadedness or syncope (suggesting acute anemia or dehydration).",
      "Persistent severe insomnia refractory to sleep hygiene and causing severe psychological distress.",
    ],
    references: [
      {
        title: "NCCN Clinical Practice Guidelines in Oncology: Cancer-Related Fatigue",
        organization: "National Comprehensive Cancer Network",
        url: "https://www.nccn.org",
      },
      {
        title: "Sleep Medicine Reviews: Insomnia and Fatigue in Breast Cancer Survivors",
        organization: "Sleep Medicine Reviews",
        url: "https://www.sciencedirect.com/journal/sleep-medicine-reviews",
      },
    ],
    readingTimeMinutes: 5,
    publishedDate: "2025-02-01",
  },

  // 10. Medical Follow-up
  {
    id: "art-follow-1",
    categoryId: "followup",
    title_ar: "المتابعة الطبية والفحوصات الدورية: الأمان الصحي طويل الأمد",
    title_en: "Medical Follow-up & Survivorship Surveillance: Lifelong Security",
    summary_ar:
      "جدول الفحوصات الدورية، مواعيد الماموجرام، وفهم خطة الرعاية المستمرة لراحة بالك وسلامتك.",
    summary_en:
      "Comprehensive schedules for surveillance mammography, clinical checks, and survivorship planning.",
    detailedContent_ar: `تمثل مرحلة انتهاء العلاجات الأساسية والبدء في مرحلة المتابعة الدورية إنجازاً يستحق الاحتفاء، ومع ذلك قد يصاحبها شعور بالقلق من ابتعاد الفريق الطبي اليومي. تهدف خطة المتابعة الطبية (Survivorship Care Plan) إلى الاطمئنان الدائم على صحتكِ، مراقبة أي آثار جانبية متأخرة، والكشف المبكر عن أي تغيرات طارئة.

الجدول الزمني الموصى به للمتابعة السريرية (حسب إرشادات ASCO وESMO):
1. السنوات الثلاث الأولى (الأكثر أهمية):
   - زيارة سريرية شاملة كل 3 إلى 6 أشهر مع فحص جسدي دقيق للثدي وجدار الصدر والعقد اللمفاوية.
2. السنتان الرابعة والخامسة:
   - زيارة سريرية كل 6 إلى 12 شهراً.
3. بعد السنة الخامسة:
   - زيارة سريرية سنوية منتظمة ومستمرة مدى الحياة.

الفحوصات التصويرية الدورية:
- فحص الماموجرام السنوي (Mammography): يُجرى للثدي المتبقي بعد الاستئصال الجزئي أو للثدي السليم كل 12 شهراً (غالباً بعد 6 إلى 12 شهراً من انتهاء الإشعاع).
- لا يُنصح بإجراء فحوصات دم دورية لدلالات الأورام (Tumor Markers) أو تصوير مسحي للجسم بالكامل (PET-CT) بشكل روتيني دون وجود أعراض تستدعي ذلك، لأن الإرشادات العالمية أثبتت أن الفحص السريري الواعي والماموجرام المنتظم هما الأسلوب الأمثل.`,
    detailedContent_en: `Transitioning from active therapy to survivorship surveillance represents a significant milestone. A formal Survivorship Care Plan details treatment summaries, anticipated long-term effects, and a rigorous surveillance timetable.

Standard Clinical Surveillance Schedule (ASCO & ESMO Guidelines):
1. Years 1 to 3:
   - Clinical review and thorough physical examination every 3 to 6 months focusing on breast tissue, chest wall, and regional lymphatic basins.
2. Years 4 to 5:
   - Clinical check every 6 to 12 months.
3. Beyond Year 5:
   - Annual surveillance consultation for life.

Surveillance Imaging Protocol:
- Annual Diagnostic Mammography: for preserved breast tissue or the contralateral breast, typically scheduled 6-12 months post-radiotherapy, then annually.
- Routine PET-CT or serum tumor markers are not indicated in asymptomatic patients per international guidelines; targeted diagnostics are reserved for explicit symptoms.`,
    practicalRecommendations_ar: [
      "احتفظي بنسخة ملخصة من خطة رعايتكِ وعلاجاتكِ السابقة (Survivorship Summary) في ملفكِ الشخصي.",
      "دوني مواعيد الفحوصات السنوية والماموجرام في تقويم هاتفكِ مع تفعيل تذكيرات قبل الموعد بأسبوعين.",
      "التزمي بتناول أدويتكِ الهرمونية (إن وُصفت لكِ) في نفس الوقت يومياً، وأبلغي طبيبكِ عن أي أعراض جانبية كالهبات الساخنة أو آلام المفاصل لإيجاد حلول تلطيفية مناسبة.",
      "حافظي على نمط حياة صحي يجمع بين المشي المنتظم والغذاء المتوازن، فهو يقلل من احتمالية نكس المرض بنسبة كبيرة.",
    ],
    practicalRecommendations_en: [
      "Keep a hard copy of your oncologic treatment summary and survivorship plan accessible.",
      "Log your next scheduled mammograms and clinical exams in PinkCare with advance reminders.",
      "Adhere strictly to oral adjuvant endocrine therapies; consult your oncologist for supportive strategies regarding hot flashes or arthralgias.",
      "Maintain active lifestyle habits: regular walking and anti-inflammatory nutrition substantially lower recurrence risks.",
    ],
    precautions_ar: [
      "لا تترددي في حجز موعد مبكر قبل موعدكِ الدوري إذا لاحظتِ أي تغير جسدي يقلقكِ.",
      "لا تطلبي فحوصات إشعاعية متكررة غير مبررة؛ التزمي بتوجيهات الفريق الطبي لحماية جسمكِ من التعرض غير الضروري للإشعاع.",
    ],
    precautions_en: [
      "Never wait for your routine scheduled appointment if you observe an unexpected, persistent new symptom.",
      "Avoid demanding excessive unindicated CT scans; trust guideline-directed diagnostic surveillance.",
    ],
    whenToContactDoctor_ar: [
      "ألم عظمي موضعي مستمر جديد (خاصة في الظهر أو الورك أو الأضلاع) لا يزول بمسكنات خفيفة ويستمر لأكثر من أسبوعين.",
      "سعال مستمر أو ضيق نفس غير مبرر لا يرتبط بنزلة برد.",
      "صداع مستمر حاد وجديد مصحوب بدوخة أو تغيرات في الرؤية.",
      "ظهور كتلة جديدة صلبة في جدار الصدر، الندبة الجراحية، أو الرقبة والإبط.",
    ],
    whenToContactDoctor_en: [
      "New, persistent, localized bone pain (particularly spine, hip, or ribs) lasting > 2 weeks.",
      "Persistent non-productive cough or unexplained progressive shortness of breath.",
      "New severe persistent headaches, especially with vision changes or morning nausea.",
      "Any new palpable firmness or nodule along the chest wall scar, axilla, or supraclavicular fossa.",
    ],
    references: [
      {
        title: "American Society of Clinical Oncology (ASCO) Breast Cancer Survivorship Guidelines",
        organization: "ASCO",
        url: "https://ascopubs.org/journal/jco",
      },
      {
        title: "European Society for Medical Oncology (ESMO) Guidelines on Survivorship Care",
        organization: "ESMO",
        url: "https://www.esmo.org/guidelines",
      },
      {
        title: "National Cancer Institute (NCI): Coping with Cancer - Survivorship",
        organization: "National Cancer Institute",
        url: "https://www.cancer.org",
      },
    ],
    readingTimeMinutes: 6,
    publishedDate: "2025-02-05",
  },
];
