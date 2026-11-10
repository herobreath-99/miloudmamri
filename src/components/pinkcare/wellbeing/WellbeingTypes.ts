import type { MoodType, WellbeingActivityType } from "@/lib/local-db";

export interface MoodMeta {
  type: MoodType;
  label_ar: string;
  label_dz: string;
  label_fr: string;
  label_en: string;
  emoji: string;
  color: string;
  bgLight: string;
  borderColor: string;
  description_ar: string;
  description_dz: string;
  description_fr: string;
  description_en: string;
}

export const MOOD_DEFINITIONS: MoodMeta[] = [
  {
    type: "happy",
    label_ar: "سعيدة",
    label_dz: "فرحانة ومستريحة",
    label_fr: "Heureuse",
    label_en: "Happy",
    emoji: "😊",
    color: "text-amber-500",
    bgLight: "bg-amber-500/10 hover:bg-amber-500/20",
    borderColor: "border-amber-400",
    description_ar: "شعور بالراحة، البهجة والامتنان لليوم",
    description_dz: "تحسي بالفرحة، خفة الروح والحمد لله على نهار اليوم",
    description_fr: "Sentiment de joie, de gratitude et de légèreté aujourd'hui",
    description_en: "Feeling joyful, pleased, and lighthearted today",
  },
  {
    type: "calm",
    label_ar: "هادئة",
    label_dz: "مهنية وهادئة",
    label_fr: "Sereine & Calme",
    label_en: "Calm",
    emoji: "🌸",
    color: "text-emerald-500",
    bgLight: "bg-emerald-500/10 hover:bg-emerald-500/20",
    borderColor: "border-emerald-400",
    description_ar: "سكينة وسلام داخلي وراحة في البال",
    description_dz: "راحة بال وهدوء داخلي يريح القلب",
    description_fr: "Paix intérieure, tranquillité d'esprit et douceur",
    description_en: "Inner peace, stillness, and centeredness",
  },
  {
    type: "hopeful",
    label_ar: "متفائلة",
    label_dz: "متفائلة بالخير",
    label_fr: "Confiante & Pleine d'espoir",
    label_en: "Hopeful",
    emoji: "✨",
    color: "text-purple-500",
    bgLight: "bg-purple-500/10 hover:bg-purple-500/20",
    borderColor: "border-purple-400",
    description_ar: "تطلع مشرق نحو الغد وثقة بالشفاء والعافية",
    description_dz: "نظرة مشرقة للقدام وثقة في ربي بالشفاء والعافية",
    description_fr: "Regard confiant vers l'avenir, résilience et espoir de guérison",
    description_en: "Looking forward with trust and resilience",
  },
  {
    type: "anxious",
    label_ar: "قلقة",
    label_dz: "مقلقة شوية",
    label_fr: "Anxieuse & Préoccupée",
    label_en: "Anxious",
    emoji: "🌊",
    color: "text-sky-500",
    bgLight: "bg-sky-500/10 hover:bg-sky-500/20",
    borderColor: "border-sky-400",
    description_ar: "أفكار متسارعة، ترقب أو توجس طبيعي ومشروع",
    description_dz: "أفكار تدور في راسك وخوف طبيعي ومفهوم",
    description_fr: "Pensées agitées, appréhension compréhensible et légitime",
    description_en: "Racing thoughts, natural concern or anticipation",
  },
  {
    type: "sad",
    label_ar: "حزينة",
    label_dz: "قلبي مقبوض / حزينة",
    label_fr: "Triste ou Émotive",
    label_en: "Sad",
    emoji: "🌧️",
    color: "text-blue-500",
    bgLight: "bg-blue-500/10 hover:bg-blue-500/20",
    borderColor: "border-blue-400",
    description_ar: "شعور بثقل أو دموع، ومن حقكِ التعبير عنه بسلام",
    description_dz: "ثقل في الصدر أو دموع، ومن حقك تفرغي قلبك براحتك",
    description_fr: "Cœur lourd ou besoin de pleurer ; votre peine est entendue et respectée",
    description_en: "Feeling low or tender; your sorrow is valid",
  },
  {
    type: "stressed",
    label_ar: "متوترة",
    label_dz: "مستريسية ومضغوطة",
    label_fr: "Stressée & Sous tension",
    label_en: "Stressed",
    emoji: "⚡",
    color: "text-orange-500",
    bgLight: "bg-orange-500/10 hover:bg-orange-500/20",
    borderColor: "border-orange-400",
    description_ar: "ضغوط متراكمة أو انزعاج، يحتاج لمهدئات بسيطة",
    description_dz: "تراكم التعب والضغط، محتاجة استراحة وتنفس هادئ",
    description_fr: "Pression accumulée ou nervosité, appelant à un temps de pause",
    description_en: "Under pressure or tense, needing gentle pause",
  },
  {
    type: "exhausted",
    label_ar: "مرهقة",
    label_dz: "تعبانة وفاشلة",
    label_fr: "Épuisée & Fatiguée",
    label_en: "Exhausted",
    emoji: "💤",
    color: "text-rose-500",
    bgLight: "bg-rose-500/10 hover:bg-rose-500/20",
    borderColor: "border-rose-400",
    description_ar: "تعب جسدي أو نفسي، حان وقت النوم والراحة التامة",
    description_dz: "تعب في الجسم والمورال، لازمك راحة تامة ورڨاد",
    description_fr: "Fatigue physique ou morale, votre corps réclame un repos complet",
    description_en: "Physical or mental depletion; pure rest is needed",
  },
  {
    type: "other",
    label_ar: "أخرى",
    label_dz: "حاجة أخرى",
    label_fr: "Autre ressenti",
    label_en: "Other",
    emoji: "🌿",
    color: "text-pink-600",
    bgLight: "bg-pink-500/10 hover:bg-pink-500/20",
    borderColor: "border-pink-400",
    description_ar: "شعور مركب أو خاص يمكنكِ كتابته بنفسكِ",
    description_dz: "إحساس خاص تقدري توصفيه بكلماتك الشخصية",
    description_fr: "Une émotion singulière ou nuancée que vous pouvez nommer",
    description_en: "A nuanced feeling that you can name yourself",
  },
];

export interface ActivityDefinition {
  type: WellbeingActivityType;
  title_ar: string;
  title_dz: string;
  title_fr: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_dz: string;
  subtitle_fr: string;
  subtitle_en: string;
  durationMinutes: number;
  iconName: string;
  color: string;
  accentBg: string;
  category: "relaxation" | "mindfulness" | "reflection";
  instructions_ar: string[];
  instructions_dz: string[];
  instructions_fr: string[];
  instructions_en: string[];
  precautions_ar: string;
  precautions_dz: string;
  precautions_fr: string;
  precautions_en: string;
}

export const WELLBEING_ACTIVITIES: ActivityDefinition[] = [
  {
    type: "breathing",
    title_ar: "التنفس الهادئ المنظم (4-4-6)",
    title_dz: "تنفس هادئ ومنظم (4-4-6)",
    title_fr: "Respiration apaisante guidée (4-4-6)",
    title_en: "Gentle Guided Breathing (4-4-6)",
    subtitle_ar: "تهدئة الجهاز العصبي وتخفيف وتيرة التوتر اليومي",
    subtitle_dz: "تهدئة الأعصاب وتنقيص القلقة والضغط",
    subtitle_fr: "Apaiser le système nerveux et relâcher les tensions quotidiennes",
    subtitle_en: "Calm your nervous system and release daily stress",
    durationMinutes: 3,
    iconName: "Wind",
    color: "text-teal-600",
    accentBg: "from-teal-500/20 to-emerald-500/20",
    category: "relaxation",
    instructions_ar: [
      "اجلسي أو استلقي في وضعية مريحة وداعمة لظهرك وكتفيكِ.",
      "استنشقي الهواء ببطء ولطف من الأنف لمدة 4 ثوانٍ مع تمدد البطن.",
      "احبسي النفس بلطف وهدوء تام لمدة 4 ثوانٍ دون ضغط.",
      "اطلقي الزفير بنعومة من الفم كأنكِ تطفئين شمعة برقة لمدة 6 ثوانٍ.",
      "كرري هذه الدورة ببطء وشاهدي الدائرة المتنفسة على الشاشة.",
    ],
    instructions_dz: [
      "ڨعدي ولا تكسلي في بلاصة مريحة تسند ظهرك وكتافك مليح.",
      "دخلي الهواء بالراحة من نيفك في 4 ثواني وخلي كرشك تنتفخ شوية.",
      "احبسي النفس بشوية وبلا ما تزيري على روحك لمدة 4 ثواني.",
      "خرجي النفس من فمك بنعومة كأنك تطفاي في شمعة لمدة 6 ثواني.",
      "عاودي هاد الخطوات وتبعي الدائرة لي تتحرك في الشاشة.",
    ],
    instructions_fr: [
      "Installez-vous confortablement en soutenant votre dos et vos épaules.",
      "Inspirez doucement par le nez pendant 4 secondes en laissant le ventre se gonfler.",
      "Retenez l'air paisiblement pendant 4 secondes sans forcer.",
      "Expirez lentement par la bouche comme pour faire vaciller une bougie pendant 6 secondes.",
      "Répétez ce cycle apaisant au rythme du cercle visuel à l'écran.",
    ],
    instructions_en: [
      "Sit or recline comfortably supporting your spine and shoulders.",
      "Inhale slowly and gently through your nose for 4 seconds as your abdomen expands.",
      "Hold your breath gently and softly for 4 seconds without straining.",
      "Exhale smoothly through your mouth as if gently flickering a candle for 6 seconds.",
      "Repeat this rhythmic cycle following the pulsating circle on screen.",
    ],
    precautions_ar:
      "تنفسي بطبيعية؛ إذا شعرتِ بأي دوار خفيف، عودي فوراً لنمط تنفسكِ الطبيعي المعتاد.",
    precautions_dz: "تنفسي بطبيعتك، وإذا حسيتي بدوخة خفيفة حبسي ورجعي لتنفسك العادي.",
    precautions_fr:
      "Respirez naturellement ; en cas de léger vertige, reprenez aussitôt votre rythme spontané.",
    precautions_en:
      "Breathe naturally; if you feel lightheaded, resume your normal breathing pace immediately.",
  },
  {
    type: "mindfulness",
    title_ar: "حضور ذهني وتجذير حسي (5-4-3-2-1)",
    title_dz: "تركيز حسي وتصفية البال (5-4-3-2-1)",
    title_fr: "Ancrage sensoriel en pleine conscience (5-4-3-2-1)",
    title_en: "Mindful Sensory Grounding (5-4-3-2-1)",
    subtitle_ar: "إعادة الوعي للّحظة الراهنة وتبديد الأفكار المقلقة",
    subtitle_dz: "ترجعي لوعيك في هاد اللحظة وتنحي الأفكار لي تقلق",
    subtitle_fr: "Ramener l'esprit à l'instant présent et dissiper les ruminations",
    subtitle_en: "Anchor your senses in the present moment",
    durationMinutes: 4,
    iconName: "Brain",
    color: "text-indigo-600",
    accentBg: "from-indigo-500/20 to-purple-500/20",
    category: "mindfulness",
    instructions_ar: [
      "تأمّلي حولكِ ولاحظي 5 أشياء يمكنكِ رؤيتها بالعين (لوحة، ضوء، ستارة، كوب).",
      "تحسسي 4 أشياء يمكنكِ لمسها بيدكِ (ملمس ثيابكِ، الوسادة، دفء يديكِ).",
      "أنصتي باهتمام إلى 3 أصوات مسموعة في المكان (صوت نسيم، عقارب ساعة، خطى).",
      "ميّزي شيئين (2) يمكنكِ شمهما (رائحة مرطبكِ، قهوة، هواء نقي).",
      "تذكري شيئاً واحداً (1) تحبينه في نفسكِ أو خذي شهيقاً عميقاً للسلام الداخلي.",
    ],
    instructions_dz: [
      "شوفي حولك ولاحظي 5 حوايج راكي تشوفي فيهم (طاقة، ضو، كاس، حيط...).",
      "لمسي 4 حوايج بيدك (قشك، المخدة، دفء يديك...).",
      "سمعي مليح 3 أصوات كاينين في البيت (ريح، ساعة، حس خفيف...).",
      "شمي زوج حوايج (ريحة كاش بارفان، قهوة، ولا هواء نقي...).",
      "تفكرّي حاجة وحدة تحبيها في روحك ولا خذي نفس عميق بالسلام.",
    ],
    instructions_fr: [
      "Observez autour de vous 5 choses visibles (une couleur, un tableau, la lumière).",
      "Ressentez 4 sensations tactiles (la douceur d'un tissu, un coussin, vos mains tièdes).",
      "Écoutez 3 sons présents dans la pièce (le vent, le tic-tac, une respiration).",
      "Identifiez 2 odeurs perceptibles (un parfum doux, une tisane, l'air frais).",
      "Évoquez 1 pensée bienveillante envers vous-même et respirez avec gratitude.",
    ],
    instructions_en: [
      "Acknowledge 5 things you can see around you right now.",
      "Acknowledge 4 things you can physically touch and feel.",
      "Acknowledge 3 subtle sounds you can hear in your room.",
      "Acknowledge 2 scents or aromas you can smell.",
      "Acknowledge 1 positive trait or feeling of gentle self-appreciation.",
    ],
    precautions_ar: "تذكري أنه لا توجد إجابات خاطئة؛ الهدف هو نقل انتباهكِ من الأفكار إلى الحواس.",
    precautions_dz: "ماكان حتى إجابة غالطة، الفايدة برك تفرغي راسك من الوسواس وترجعي لحواسك.",
    precautions_fr:
      "Il n'y a pas de bonne ou mauvaise réponse ; l'exercice vise à reconnecter vos sens au présent.",
    precautions_en:
      "There are no wrong answers; the goal is simply gently bringing awareness to your physical surroundings.",
  },
  {
    type: "relaxation",
    title_ar: "استرخاء عضلي لطيف وموجه",
    title_dz: "استرخاء العضلات برفق وأمان",
    title_fr: "Relaxation musculaire douce et progressive",
    title_en: "Gentle Progressive Relaxation",
    subtitle_ar: "إرخاء توتر الفكين والرقبة والكتفين بحذر وأمان",
    subtitle_dz: "تنحي التزيار من الرقبة، الكتاف والفكين",
    subtitle_fr: "Détendre les tensions de la mâchoire, du cou et des épaules avec précaution",
    subtitle_en: "Ease tension in jaw, neck, and shoulders safely",
    durationMinutes: 5,
    iconName: "Feather",
    color: "text-purple-600",
    accentBg: "from-purple-500/20 to-pink-500/20",
    category: "relaxation",
    instructions_ar: [
      "دعي كتفيكِ يهبطان بعيداً عن أذنيكِ وركّزي على التخلص من أي شد بالرقبة.",
      "أرخي عضلات الجبين وحول العينين، وافصلي بين الأسنان بلطف لإراحة الفكين.",
      "خذي نفساً عميقاً، ومع الزفير، تخيلي ثقلاً دافئاً ومريحاً يغمر ذراعيكِ وأصابعكِ.",
      "اتركي ظهركِ يستند بارتياح كامل دون بذل أي جهد عضلي.",
      "اسحبي تركيزكِ إلى دفء صدركِ وبطنكِ وتنفسي بنعومة.",
    ],
    instructions_dz: [
      "هبطي كتافك بعيد على وذنيك وارخي كامل الرقبة.",
      "ارخي جبهتك وعينيك، وافتحي فمك شوية باش ترتاحي من التزيار تاع سنانك.",
      "خذي نفس عميق، ومع الزفير تخيلي دفء مريح يمشي في يديك وصباعتيك.",
      "خلي ظهرك مسنود مليح وبلا ما ديري حتى مجهود عضلي.",
      "ركزي على الراحة في صدرك وبطنك وتنفسي بشوية.",
    ],
    instructions_fr: [
      "Laissez vos épaules s'abaisser loin des oreilles et relâchez la nuque.",
      "Desserrez la mâchoire, décollez la langue du palais et lissez le front.",
      "Prenez une profonde inspiration, puis sur l'expiration, visualisez une vague de chaleur détendre vos bras.",
      "Laissez votre dos s'enfoncer doucement dans votre siège ou votre lit.",
      "Savourez quelques instants de calme musculaire sans effort.",
    ],
    instructions_en: [
      "Let your shoulders gently drop away from your ears, releasing neck tension.",
      "Soften your forehead, unclench your jaw, and let your tongue rest gently.",
      "With every exhale, imagine a warm, relaxing wave soothing your arms and hands.",
      "Allow your back to sink completely into your bed or chair.",
      "Rest comfortably in stillness for several moments.",
    ],
    precautions_ar:
      "تجنبي أي شد عنيف لعضلات الصدر أو الذراع في الجانب المعالج جراحياً؛ الاسترخاء هنا ذهني وسلبي فقط.",
    precautions_dz:
      "ممنوع ديري أي مجهود أو تزيار على جهة العملية؛ الاسترخاء هنا في البال والراحة برك.",
    precautions_fr:
      "Ne forcez jamais sur le côté opéré ; la relaxation s'opère par le lâcher-prise passif sans contraction vive.",
    precautions_en:
      "Do not tense or strain the chest or surgical side; focus purely on passive mental relaxation and letting go.",
  },
  {
    type: "self_reflection",
    title_ar: "تأمل ذاتي لطيف وتقدير الذات",
    title_dz: "تصالح مع الذات وتقدير الشجاعة ديالك",
    title_fr: "Auto-compassion et bienveillance envers soi",
    title_en: "Compassionate Self-Reflection",
    subtitle_ar: "احتضان المشاعر وتقدير شجاعتكِ اليومية دون لوم",
    subtitle_dz: "تحضني مشاعرك وتفهمي روحك بلا ما تلومي نفسك",
    subtitle_fr: "Accueillir ses émotions avec tendresse et honorer son courage quotidien",
    subtitle_en: "Honoring your courage with unconditional self-kindness",
    durationMinutes: 4,
    iconName: "Heart",
    color: "text-pink-600",
    accentBg: "from-pink-500/20 to-rose-500/20",
    category: "reflection",
    instructions_ar: [
      "ضعي يدكِ بلطف على موضع قلبكِ واستشعري نبضكِ الهادئ.",
      "قولي لنفسكِ: 'أنا أبذل قصارى جهدي اليوم، وهذا كافٍ تماماً'.",
      "تقبّلي أن المشاعر تتغير كأمواج البحر؛ لا بأس بالشعور بالتعب أحياناً.",
      "سامحي نفسكِ على أي خطط لم تكتمل اليوم؛ الشفاء هو الأولوية الوحيدة.",
      "امنحي نفسكِ عناقاً ذهنياً دافئاً واشكري جسدكِ على كل مجهود يبذله.",
    ],
    instructions_dz: [
      "حطي يدك بحنية على قلبك وحسي بدقاتو الهادية.",
      "قولي لروحك: 'راني دايرة كامل واش نقدر اليوم، وهاد الشي بزاف ويكفي'.",
      "تقبلي بلي المشاعر تتبدل، ومافيها والو إذا حسيتي بالفشل ولا التعب أحياناً.",
      "سامحي روحك على واش ما درتيش اليوم، صحتك هي الصح وهي الأولى.",
      "اشكري جسمك ونفسك على الصبر والمجهود لي راكي ديريه.",
    ],
    instructions_fr: [
      "Posez délicatement une main sur votre cœur et sentez son battement régulier.",
      "Dites-vous avec tendresse : 'Je fais de mon mieux aujourd'hui, et cela suffit amplement'.",
      "Acceptez que les émotions varient comme les marées ; être fatiguée est légitime.",
      "Libérez-vous de la culpabilité des tâches inachevées ; votre rétablissement est la priorité.",
      "Remerciez votre corps pour sa résilience silencieuse et offrez-vous ce moment de grâce.",
    ],
    instructions_en: [
      "Place your hand gently on your heart and feel your gentle pulse.",
      "Remind yourself: 'I am doing the very best I can today, and that is enough'.",
      "Accept that feelings ebb and flow like gentle waves; fatigue is not a failure.",
      "Release pressure about unfinished tasks; rest and recovery are productive.",
      "Offer yourself genuine gratitude for your quiet resilience.",
    ],
    precautions_ar:
      "إذا ظهرت مشاعر حزن عميقة، اسمحي للدموع بالانهمار؛ فالبكاء تفريغ صحي وليس ضعفاً.",
    precautions_dz: "إذا حسيتي بالبكا، ابكي براحتك؛ البكاء يريح القلب وماشي عيب ولا ضعف.",
    precautions_fr:
      "Si des larmes montent, accueillez-les ; pleurer est une libération émotionnelle saine et non une faiblesse.",
    precautions_en:
      "If emotions surface, allow them gently; emotional tears are a natural, healthy release.",
  },
  {
    type: "daily_motivation",
    title_ar: "تحفيز يومي دافئ وواقعي",
    title_dz: "تشجيع صادق من القلب وبلا مبالغة",
    title_fr: "Encouragement bienveillant & réaliste",
    title_en: "Gentle Non-Toxic Motivation",
    subtitle_ar: "تشجيع صادق خالٍ من الوعود المبالغة أو الإيجابية السامة",
    subtitle_dz: "كلمات تدفيك بلا وعود زايدة ولا ضغط الإيجابية المصطنعة",
    subtitle_fr: "Soutien sincère sans injonction au bonheur ni positivité toxique",
    subtitle_en: "Honest encouragement free from toxic positivity",
    durationMinutes: 3,
    iconName: "Sun",
    color: "text-amber-600",
    accentBg: "from-amber-500/20 to-orange-500/20",
    category: "reflection",
    instructions_ar: [
      "القوة لا تعني الابتسام الدائم، بل تعني الاستمرار حتى عندما تكون الخطوات بطيئة.",
      "يومكِ يخصكِ وحدكِ؛ لا تقارني وتيرة تعافيكِ بأي شخص آخر.",
      "كل جرعة دواء، كل رشفة ماء، وكل دقيقة نوم هي عمل حب تقدمينه لنفسكِ.",
      "أنتِ أكبر من أي مرض أو مرحلة علاجية؛ روحكِ فريدة وغالية.",
    ],
    instructions_dz: [
      "القوة ماشي لازم تضحكي ديما، القوة هي تكملي حتى كي تكون خطواتك ثقيلة.",
      "كل يوم عندو طاقتو، ما تقارنيش روحك بحتى وحدة أخرى.",
      "كل دوا تشربيه، وكل كاس ماء، وكل ساعة ترقديها هي اهتمام بصحتك.",
      "راك أغلى من أي مرحلة علاج، وقدرك كبير وربي معاك.",
    ],
    instructions_fr: [
      "Être forte ne signifie pas sourire en permanence, mais avancer à votre propre pas.",
      "Votre parcours vous appartient ; ne comparez jamais votre énergie à celle d'autrui.",
      "Chaque comprimé pris, chaque verre d'eau bu et chaque sieste sont des gestes d'amour pour vous-même.",
      "Vous êtes infiniment plus vaste qu'un diagnostic ou un protocole médical.",
    ],
    instructions_en: [
      "Real strength does not mean always smiling; it means honoring your pace.",
      "Your journey is yours alone; do not compare your energy to anyone else.",
      "Every sip of water, every medication taken, and every rest is an act of love.",
      "You are far more than a patient or a diagnosis; you are whole and cherished.",
    ],
    precautions_ar:
      "نحن نؤمن بالطب والمتابعة السريرية، ونبتعد عن ادعاءات أن التفكير الإيجابي بمفرده يشفي الأمراض.",
    precautions_dz:
      "العلاج الطبي هو الأساس، والأفكار الإيجابية تعاون في الراحة النفسية وما تعوضش الطبيب.",
    precautions_fr:
      "La médecine et le suivi clinique restent essentiels ; les pensées bienveillantes soutiennent le moral mais ne remplacent pas les soins.",
    precautions_en:
      "We believe in clinical science; gentle thoughts support your comfort but do not replace treatment.",
  },
  {
    type: "gratitude",
    title_ar: "دفتر الامتنان للحظات البسيطة",
    title_dz: "دفتر الامتنان للحوايج الصغار الملاح",
    title_fr: "Journal de gratitude des petits bonheurs",
    title_en: "Gratitude Journal for Little Blessings",
    subtitle_ar: "ملاحظة 3 نعم أو لمسات حنان حدثت خلال يومكِ",
    subtitle_dz: "تسجيل 3 حوايج صغار فرحوك اليوم",
    subtitle_fr: "Prendre note de 3 douceurs ou bienfaits survenus aujourd'hui",
    subtitle_en: "Noticing 3 simple moments of grace today",
    durationMinutes: 4,
    iconName: "BookHeart",
    color: "text-rose-600",
    accentBg: "from-rose-500/20 to-pink-500/20",
    category: "reflection",
    instructions_ar: [
      "فكّري في 3 أشياء بسيطة أضاءت يومكِ (ابتسامة ممرضة، رسالة صديقة، فنجان شاي دافئ).",
      "اكتبيها في خانة الامتنان أدناه لتُحفظ في سجلكِ الخاص المشفر.",
      "استشعري كيف تنعش هذه اللحظات الصغيرة شعور الدفء في صدركِ.",
    ],
    instructions_dz: [
      "فكري في 3 حوايج ساهلين زهاو خاطرك اليوم (ضحكة ممرضة، ميساج من وحدة تحبك، كاس تاي دافي...).",
      "اكتبيهم في الخانات لتحت ويبقاو مسجلين غير عندك برك.",
      "حسي بالدفء لي تخلي هاد اللحظات البسيطة في قلبك.",
    ],
    instructions_fr: [
      "Pensez à 3 petits détails qui ont adouci votre journée (un sourire, un mot doux, une tasse de thé chaud).",
      "Notez-les ci-dessous pour les conserver précieusement dans votre journal privé.",
      "Ressentez la tiédeur bienfaisante que ces instants de grâce diffusent en vous.",
    ],
    instructions_en: [
      "Reflect on 3 simple gifts today (a warm smile, a friendly call, sunlight through the window).",
      "Write them in the private prompt below to keep in your personal notes.",
      "Feel the quiet warmth that these simple moments bring to your day.",
    ],
    precautions_ar: "حتى في الأيام الصعبة، قد يكون الامتنان لمجرد سرير مريح أو نفس هادئ.",
    precautions_dz: "حتى في الأيام الواعرة، تقدري تفرحي برك بلي راكي في فراش دافي ونفسك هادي.",
    precautions_fr:
      "Même les jours difficiles, la gratitude peut se nicher dans un oreiller doux ou un instant de silence.",
    precautions_en:
      "On tougher days, gratitude can be as gentle as a soft pillow or a quiet breath.",
  },
  {
    type: "sleep_relaxation",
    title_ar: "استرخاء ما قبل النوم وتصفية الذهن",
    title_dz: "استرخاء وتفريغ الراس قبل الرڨاد",
    title_fr: "Rituel du soir & relaxation pour le sommeil",
    title_en: "Bedtime Wind-Down & Sleep Relaxation",
    subtitle_ar: "تهيئة الجسم لنوم عميق ومجدد للخلايا والعافية",
    subtitle_dz: "توجاد روحك لرڨاد هني ومريح للجسم",
    subtitle_fr: "Préparer le corps et l'esprit à un sommeil réparateur et bienfaisant",
    subtitle_en: "Preparing body and mind for restorative sleep",
    durationMinutes: 7,
    iconName: "Moon",
    color: "text-violet-600",
    accentBg: "from-violet-500/20 to-indigo-500/20",
    category: "relaxation",
    instructions_ar: [
      "اخفضي إضاءة الغرفة وضعي هاتفكِ على وضع الصامت أو عدم الإزعاج.",
      "استلقي على ظهركِ أو على الجانب غير المصاب مع وسادة داعمة تحت ذراعكِ إذا لزم.",
      "اغمضي عينيكِ بلطف وتخيلي أن كل زفير يأخذ معه كل هموم وتعب هذا اليوم.",
      "دعي عقلكِ يترك كل خطط الغد؛ الغد سيعتني بنفسه عندما يحين.",
      "استمعي للعد التنازلي البطيء وتنفسي حتى تغفي بسلام وأمان.",
    ],
    instructions_dz: [
      "نقصي ضو البيت وديري التيليفون في الصامت.",
      "تكسلي على ظهرك ولا على الجنب لي ماشي مريض وديري مخدة تحت يدك إذا حبيتي.",
      "غمضي عينيك بشوية وتخيلي بلي كل نفس يخرج يدي معاه تعب نهار كامل.",
      "انساي واش كاين غدوة، غدوة ربي يسهلو في وقتو.",
      "تبعي العداد الهادي وتنفسي بالراحة حتى يجيك النعاس.",
    ],
    instructions_fr: [
      "Tamisez la lumière de la pièce et mettez votre téléphone en mode silencieux.",
      "Allongez-vous sur le dos ou sur le côté non opéré avec un coussin sous le bras si besoin.",
      "Fermez les yeux et imaginez chaque expiration emporter au loin les soucis et la fatigue du jour.",
      "Remettez à demain les projets ; cette nuit est entièrement consacrée à votre régénération.",
      "Laissez-vous bercer par le rythme apaisant jusqu'au sommeil réparateur.",
    ],
    instructions_en: [
      "Dim the bedroom lights and place your phone on silent or do-not-disturb.",
      "Recline on your back or unaffected side with gentle pillow support under your arm if needed.",
      "Close your eyes softly and visualize every exhale releasing the worries of the day.",
      "Surrender tomorrow's plans; tonight is dedicated exclusively to rest.",
      "Follow the soothing countdown until peaceful sleep envelops you.",
    ],
    precautions_ar:
      "إذا استعصى النوم لأكثر من 20 دقيقة، لا تقلقي؛ انهضي بلطف واشربي ماء دافئ واقرئي شيئاً هادئاً.",
    precautions_dz:
      "إذا ما جاكش النعاس بعد 20 دقيقة ما تقلقيش؛ نوضي بشوية اشربي كاس ماء ولا تيزانة دافية واقراي شوية.",
    precautions_fr:
      "Si le sommeil tarde après 20 minutes, ne forcez pas ; levez-vous calmement, buvez une tisane tiède et écoutez un son doux.",
    precautions_en:
      "If sleep is elusive after 20 minutes, don't worry; rest quietly with a warm drink or calming music.",
  },
];

export const SUPPORTIVE_AFFIRMATIONS = [
  {
    ar: "مشاعركِ في هذا اليوم طبيعية ومشروعة؛ لا تضغطي على نفسكِ لتكوني بخير دائماً.",
    dz: "واش راكي حاسة اليوم طبيعي ومفهوم؛ ما تضغطيش على روحك باش تباني ديما لاباس.",
    fr: "Tout ce que vous ressentez aujourd'hui est légitime ; ne vous forcez pas à toujours paraître forte.",
    en: "Whatever you feel today is valid and understandable; take the pressure off yourself.",
  },
  {
    ar: "التعافي ليس خطاً مستقيماً، فلكل يوم طاقته الخاصة ولكل لحظة جمالها الهادئ.",
    dz: "طريق الشفاء ماشي مسطر بالمسطرة، كل نهار وعندو جهده الخاص ومافيها والو.",
    fr: "La guérison n'est pas une ligne droite ; chaque jour a son propre rythme et sa douceur.",
    en: "Recovery is not a straight line; each day brings its own rhythm and gentle grace.",
  },
  {
    ar: "أنتِ محاطة بالحب والدعاء، وكل خطوة عناية صغيرة بذاتكِ تصنع فرقاً حقيقياً.",
    dz: "راكي محاطة بالمحبة والدعاء، وكل حاجة صغيرة تديريها على جالك راهي فايدة كبيرة.",
    fr: "Vous êtes entourée de bienveillance, et chaque petit geste pour vous-même a une vraie valeur.",
    en: "You are surrounded by love, and every small act of self-care truly matters.",
  },
  {
    ar: "الراحة ليست هدراً للوقت، بل هي الركيزة الأساسية التي يعيد بها جسدكِ بناء قواه.",
    dz: "الراحة ماشي تضييع وقت، هي الأساس لي يعاون جسمك يسترجع صحته وقوته.",
    fr: "Le repos n'est jamais du temps perdu ; c'est le socle sur lequel votre corps se reconstruit.",
    en: "Rest is never wasted time; it is the vital foundation through which your body heals.",
  },
  {
    ar: "تذكري أن قوتكِ الحقيقية تكمن في شجاعة طلب الدعم والراحة متى احتجتِ إليها.",
    dz: "الشجاعة الصح هي كي تطلبي المساعدة والراحة كي تحتاجيها بلا ما تحشمي.",
    fr: "Votre vraie force s'exprime aussi dans le courage d'accepter l'aide et de vous reposer.",
    en: "Your truest strength lies in the courage to ask for help and rest whenever needed.",
  },
  {
    ar: "أنتِ لستِ وحدكِ في هذا الطريق؛ نحن وفريقكِ الطبي نقف معكِ بكل فخر واعتزاز.",
    dz: "ما راكيش وحدك في هاد الطريق؛ رانا معاك وفريقك الطبي كامل يساند فيك بكل فخر.",
    fr: "Vous n'êtes pas seule sur ce chemin ; notre communauté et vos soignants sont à vos côtés.",
    en: "You are never alone on this path; we and your healthcare team stand with you.",
  },
];
