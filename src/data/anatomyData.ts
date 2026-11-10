export interface AnatomyRegion {
  id: string;
  name_ar: string;
  name_fr: string;
  name_dz: string;
  name_en: string;
  category: "arm" | "shoulder" | "core";
  // Coordinates for hotspot placement on the 3D model (% relative to avatar frame)
  topPercent: number;
  leftPercent: number;
  // Alternative back view position (% relative to frame)
  backTopPercent?: number;
  backLeftPercent?: number;

  // 1. Definition
  definition_ar: string;
  definition_fr: string;
  definition_en: string;

  // 2. Connected structures (muscles, joints, nerves)
  connectedStructures_ar: string[];
  connectedStructures_fr: string[];
  connectedStructures_en: string[];

  // 3. Motor functions
  motorFunctions_ar: string[];
  motorFunctions_fr: string[];
  motorFunctions_en: string[];

  // 4. Clinical issues & Post-operative challenges in breast cancer care
  clinicalIssues_ar: {
    title: string;
    desc: string;
    isSpecificToBC?: boolean;
  }[];
  clinicalIssues_fr: {
    title: string;
    desc: string;
    isSpecificToBC?: boolean;
  }[];
  clinicalIssues_en: {
    title: string;
    desc: string;
    isSpecificToBC?: boolean;
  }[];

  // 5. Patient symptoms
  symptoms_ar: string[];
  symptoms_fr: string[];
  symptoms_en: string[];

  // 6. Factors affecting range of motion
  romFactors_ar: string[];
  romFactors_fr: string[];
  romFactors_en: string[];

  // 7. Expected exercise benefits
  exerciseBenefits_ar: string[];
  exerciseBenefits_fr: string[];
  exerciseBenefits_en: string[];

  // 8. Recommended exercises (keys linking to EXERCISES)
  recommendedExerciseKeys: string[];

  // 9. Care & prevention tips
  careTips_ar: string[];
  careTips_fr: string[];
  careTips_en: string[];

  // 10. When to consult a doctor (Red flags)
  doctorAlerts_ar: string[];
  doctorAlerts_fr: string[];
  doctorAlerts_en: string[];

  // 11. Trusted clinical references
  references: {
    source: string;
    guideline: string;
  }[];
}

export const ANATOMY_REGIONS: AnatomyRegion[] = [
  // =================== ARM REGION (الذراع) ===================
  {
    id: "upper_arm",
    name_ar: "الذراع العلوي (العضد)",
    name_fr: "Bras supérieur (Humérus)",
    name_dz: "الذراع الفوقاني (العضد)",
    name_en: "Upper Arm (Humerus)",
    category: "arm",
    topPercent: 32,
    leftPercent: 33,
    definition_ar:
      "الجزء الممتد بين مفصل الكتف ومفصل المرفق، يرتكز على عظم العضد وتحيط به حزم عضلية محركة للطرف العلوي.",
    definition_fr:
      "Segment situé entre l'épaule et le coude, centré sur l'humérus et entouré de loges musculaires motrices.",
    definition_en:
      "The region between the shoulder and elbow joint, structured around the humerus bone and vital motor muscles.",
    connectedStructures_ar: [
      "عظم العضد (Humerus)",
      "العضلة ذات الرأسين العضدية",
      "العضلة ثلاثية الرؤوس",
      "الشريان العضدي والعصب الكعبري والناصف",
      "الأوعية اللمفاوية العميقة والسطحية",
    ],
    connectedStructures_fr: [
      "Humérus",
      "Biceps brachial et triceps",
      "Artère brachiale et nerfs radial/médian",
      "Vaisseaux lymphatiques superficiels et profonds",
    ],
    connectedStructures_en: [
      "Humerus bone",
      "Biceps and triceps brachii",
      "Brachial artery, radial and median nerves",
      "Superficial and deep lymphatic vessels",
    ],
    motorFunctions_ar: [
      "رفع وثني الذراع للأمام والجانب",
      "مد الذراع للخلف",
      "المساعدة في حمل الأشياء وتقريبها من الجسم",
    ],
    motorFunctions_fr: [
      "Élévation et flexion du bras",
      "Extension postérieure",
      "Port de charges et rapprochement vers le tronc",
    ],
    motorFunctions_en: [
      "Arm elevation and forward flexion",
      "Backward arm extension",
      "Carrying objects and upper limb coordination",
    ],
    clinicalIssues_ar: [
      {
        title: "الشد العضلي والتليف بعد الجراحة",
        desc: "قد يحدث تيبس أو انكماش في أنسجة الذراع العلوية بعد استئصال الكتلة أو تفريغ العقد الإبطية.",
        isSpecificToBC: true,
      },
      {
        title: "احتمالية الوذمة اللمفية (Lymphedema)",
        desc: "تراكم السائل اللمفاوي قد يسبب شعوراً بالثقل أو الامتلاء في العضد، خاصة بعد إزالة العقد اللمفاوية أو العلاج الإشعاعي.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_fr: [
      {
        title: "Rétraction et fibrose post-chirurgicale",
        desc: "Raideur musculaire après chirurgie mammaire ou curage ganglionnaire axillaire.",
        isSpecificToBC: true,
      },
      {
        title: "Risque de lymphœdème du bras",
        desc: "Sensation de lourdeur ou œdème lié au drainage lymphatique altéré.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_en: [
      {
        title: "Post-surgical muscle tightness & fibrosis",
        desc: "Stiffness or tension in upper arm tissues after breast surgery or axillary node clearance.",
        isSpecificToBC: true,
      },
      {
        title: "Potential Lymphedema",
        desc: "Fluid buildup causing heaviness or fullness in the upper arm following lymph node surgery.",
        isSpecificToBC: true,
      },
    ],
    symptoms_ar: [
      "ثقل ملحوظ أو ضيق في الأكمام",
      "صعوبة في رفع الذراع لأعلى الرأس",
      "ألم خفيف أو إحساس بالشد على طول العضد",
    ],
    symptoms_fr: [
      "Sensation de bras lourd ou vêtements étroits",
      "Difficulté à lever le bras au-dessus de la tête",
      "Tiraillement ou gêne musculaire le long du bras",
    ],
    symptoms_en: [
      "Noticeable heaviness or tight clothing sleeves",
      "Difficulty raising arm overhead",
      "Mild ache or pulling sensation along the humerus",
    ],
    romFactors_ar: [
      "مكان وحجم الشق الجراحي",
      "تأثير العلاج الإشعاعي على مرونة الأنسجة",
      "قلة الحركة المبكرة خوفاً من الألم",
    ],
    romFactors_fr: [
      "Localisation de l'incision chirurgicale",
      "Effets des rayons sur l'élasticité cutanée",
      "Immobilisation prolongée par appréhension",
    ],
    romFactors_en: [
      "Surgical incision site and healing",
      "Radiation effects on tissue elasticity",
      "Fear-avoidance and prolonged immobilization",
    ],
    exerciseBenefits_ar: [
      "تحسين الدورة الدموية وتدفق السائل اللمفاوي بلطف",
      "استعادة مرونة الأنسجة الرخوة بدون ضغط",
      "تقوية عضلات الذراع لدعم الأنشطة اليومية البسيطة",
    ],
    exerciseBenefits_fr: [
      "Amélioration de la circulation et du flux lymphatique doux",
      "Restauration de la souplesse tissulaire sans contrainte",
      "Renforcement progressif pour les activités du quotidien",
    ],
    exerciseBenefits_en: [
      "Promotes healthy fluid circulation gently",
      "Restores soft tissue compliance without strain",
      "Builds endurance for everyday activities",
    ],
    recommendedExerciseKeys: ["arm_raise", "arm_side", "arm_stretch", "wall_climb_mobility"],
    careTips_ar: [
      "تجنبي حمل الحقائب الثقيلة على الذراع المتأثرة",
      "احرصي على ارتداء ملابس غير ضاغطة على أعلى الذراع",
      "مارسي تمارين الإطالة الخفيفة بصورة منتظمة يومياً",
    ],
    careTips_fr: [
      "Évitez de porter des charges lourdes du côté opéré",
      "Privilégiez des vêtements souples sans élastiques serrés",
      "Pratiquez des étirements doux et réguliers",
    ],
    careTips_en: [
      "Avoid carrying heavy bags on the affected side",
      "Wear comfortable, non-constrictive sleeves",
      "Perform gentle stretching consistently every day",
    ],
    doctorAlerts_ar: [
      "زيادة مفاجئة في محيط الذراع أو تورم واضح",
      "احمرار أو دفء وسخونة في جلد الذراع",
      "ألم حاد متزايد لا يخف بالراحة",
    ],
    doctorAlerts_fr: [
      "Augmentation soudaine du volume du bras",
      "Rougeur ou chaleur cutanée suspecte",
      "Douleur aiguë persistante malgré le repos",
    ],
    doctorAlerts_en: [
      "Sudden increase in arm circumference or visible swelling",
      "Redness, warmth, or heat in arm skin",
      "Sharp, escalating pain not relieved by rest",
    ],
    references: [
      {
        source: "American Cancer Society (ACS)",
        guideline: "Exercises After Breast Cancer Surgery",
      },
      { source: "ASCO Guidelines", guideline: "Management of Upper Limb Lymphedema and Mobility" },
      {
        source: "Haute Autorité de Santé (HAS)",
        guideline: "Kinésithérapie et rééducation post-cancer du sein",
      },
    ],
  },

  {
    id: "biceps",
    name_ar: "العضلة ذات الرأسين (Biceps)",
    name_fr: "Biceps brachial",
    name_dz: "عضلة البيسبس (الذراع الأمامية)",
    name_en: "Biceps Brachii",
    category: "arm",
    topPercent: 31,
    leftPercent: 32,
    definition_ar:
      "عضلة أمامية رئيسية في الذراع تنشأ من لوح الكتف وتنغرز في عظم الكعبرة بالساعد، مسؤولة عن ثني الكوع.",
    definition_fr:
      "Muscle antérieur majeur reliant la scapula au radius, responsable de la flexion du coude et de la supination.",
    definition_en:
      "Key anterior arm muscle originating from the scapula, driving elbow flexion and forearm supination.",
    connectedStructures_ar: [
      "وتر الرأس الطويل للبيسبس (في الثلم بين الحديقتين)",
      "وتر الرأس القصير (في الناتئ الغرابي)",
      "عظم الكعبرة ومفصل المرفق",
      "العصب العضلي الجلدي",
    ],
    connectedStructures_fr: [
      "Tendons long et court du biceps",
      "Apophyse coracoïde et radius",
      "Nerf musculo-cutané",
    ],
    connectedStructures_en: [
      "Long and short heads tendons",
      "Coracoid process and radial tuberosity",
      "Musculocutaneous nerve",
    ],
    motorFunctions_ar: [
      "ثني مفصل المرفق لتقريب اليد نحو الوجه",
      "تدوير الساعد للخارج (Supination)",
      "المساعدة في الثني الأمامي للكتف",
    ],
    motorFunctions_fr: [
      "Flexion du coude pour amener la main au visage",
      "Supination de l'avant-bras",
      "Assistance à la flexion antérieure de l'épaule",
    ],
    motorFunctions_en: [
      "Elbow flexion (bringing hand toward face)",
      "Forearm supination (palm turning upward)",
      "Assists in shoulder anterior elevation",
    ],
    clinicalIssues_ar: [
      {
        title: "الشد والتقصير بعد فترات الراحة",
        desc: "الميل لإبقاء الكوع مثنياً بعد الجراحة يؤدي لتقصير عضلة البيسبس وصعوبة فرد الذراع بالكامل.",
        isSpecificToBC: true,
      },
      {
        title: "التهاب وتر البيسبس الرأسي",
        desc: "قد يحدث تهيج لوتر البيسبس نتيجة تغير ميكانيكا حركة الكتف والتعويض العضلي غير المتوازن.",
      },
    ],
    clinicalIssues_fr: [
      {
        title: "Rétraction par posture antalgique",
        desc: "Tendance à garder le coude fléchi entraînant une perte d'extension complète.",
        isSpecificToBC: true,
      },
      {
        title: "Ténosynovite du long biceps",
        desc: "Irritation mécanique liée aux compensations d'épaule.",
      },
    ],
    clinicalIssues_en: [
      {
        title: "Postural muscle shortening",
        desc: "Guarding posture keeping elbow flexed can shorten biceps and restrict full extension.",
        isSpecificToBC: true,
      },
      {
        title: "Bicipital tendon irritation",
        desc: "Tendon tension due to altered shoulder biomechanics and compensatory movement.",
      },
    ],
    symptoms_ar: [
      "صعوبة فرد الكوع تماماً بزاوية 180 درجة",
      "ألم في مقدمة الكتف يمتد إلى منتصف الذراع",
      "إحساس بتوتر وشد عند محاولة الوصول لأشياء بعيدة",
    ],
    symptoms_fr: [
      "Difficulté à tendre complètement le coude",
      "Douleur à la face antérieure de l'épaule irradiant au bras",
      "Tension lors de la préhension à distance",
    ],
    symptoms_en: [
      "Difficulty fully straightening the elbow",
      "Pain at front of shoulder radiating down the arm",
      "Tension when reaching for distant objects",
    ],
    romFactors_ar: [
      "الوضعيات الدفاعية لحماية الجرح الجراحي",
      "وجود أنبوب النزح الجراحي (Drain) في الأيام الأولى",
      "تيبس محفظة مفصل الكتف",
    ],
    romFactors_fr: [
      "Postures de protection de la cicatrice",
      "Présence antérieure de redon/drain",
      "Enraidissement de la capsule gléno-humérale",
    ],
    romFactors_en: [
      "Protective guarding around surgical incision",
      "Post-drain recovery and scar tissue remodeling",
      "Capsular stiffness in glenohumeral joint",
    ],
    exerciseBenefits_ar: [
      "استعادة الفرد التام لمفصل الكوع",
      "تخفيف الشد على أوتار الكتف الأمامية",
      "تحسين سلاسة الحركة اليومية كتناول الطعام وتمشيط الشعر",
    ],
    exerciseBenefits_fr: [
      "Récupération de l'extension complète du coude",
      "Diminution de la tension sur les tendons antérieurs",
      "Aisance dans les gestes quotidiens (coiffage, repas)",
    ],
    exerciseBenefits_en: [
      "Restores full elbow extension range",
      "Relieves anterior shoulder tendon tension",
      "Enhances ease in grooming and eating gestures",
    ],
    recommendedExerciseKeys: ["arm_stretch", "arm_raise", "post_surgery"],
    careTips_ar: [
      "افردي ذراعك برفق كل ساعة وتجنبي وضعية الثني الدائم",
      "استخدمي وسادة مريحة تحت الساعد عند الجلوس",
      "تجنبي الشد العنيف أو الحركات المفاجئة",
    ],
    careTips_fr: [
      "Dépliez doucement le bras régulièrement",
      "Placez un coussin sous l'avant-bras en position assise",
      "Évitez les étirements brusques ou forcés",
    ],
    careTips_en: [
      "Gently extend your arm periodically throughout the day",
      "Rest arm on a supportive cushion when seated",
      "Avoid sudden jerks or aggressive pulling",
    ],
    doctorAlerts_ar: [
      "انحباس مفاجئ في حركة الكوع",
      "ألم حاد نابض في وتر العضلة",
      "تغير في لون أو إحساس الساعد واليد",
    ],
    doctorAlerts_fr: [
      "Blocage aigu de l'articulation du coude",
      "Douleur vive lancinante tendineuse",
      "Trouble de sensibilité ou de coloration de la main",
    ],
    doctorAlerts_en: [
      "Sudden lock in elbow joint movement",
      "Sharp throbbing tendon pain",
      "Color or sensation changes in hand/forearm",
    ],
    references: [
      {
        source: "NCCN Clinical Practice Guidelines",
        guideline: "Breast Cancer Rehabilitation & Survivorship",
      },
      { source: "Mayo Clinic", guideline: "Rehabilitation and Arm Exercises After Mastectomy" },
    ],
  },

  {
    id: "triceps",
    name_ar: "العضلة ثلاثية الرؤوس (Triceps)",
    name_fr: "Triceps brachial",
    name_dz: "عضلة الترايسبس (خلف الذراع)",
    name_en: "Triceps Brachii",
    category: "arm",
    topPercent: 33,
    leftPercent: 30,
    backTopPercent: 33,
    backLeftPercent: 68,
    definition_ar:
      "عضلة خلفية تشغل الجزء الخلفي من الذراع بالكامل، تنشأ من لوح الكتف والعضد وتنغرز في نتوء الزند (Olecranon).",
    definition_fr:
      "Muscle postérieur du bras s'insérant sur l'olécrâne de l'ulna, principal extenseur du coude.",
    definition_en:
      "Posterior arm muscle inserting onto the olecranon process, serving as the prime elbow extensor.",
    connectedStructures_ar: [
      "الرؤوس الثلاثة: الطويل، الوحشي، والإنسي",
      "نتوء الزند بمفصل المرفق (Olecranon)",
      "العصب الكعبري المار بالمسار الحلزوني",
    ],
    connectedStructures_fr: [
      "Trois chefs (long, latéral, médial)",
      "Olécrâne et coude",
      "Nerf radial dans le sillon spiral",
    ],
    connectedStructures_en: [
      "Long, lateral, and medial heads",
      "Olecranon of ulna",
      "Radial nerve in spiral groove",
    ],
    motorFunctions_ar: [
      "بسط ومد مفصل المرفق بالكامل",
      "دفع الأبواب والأشياء بعيداً عن الجسم",
      "المساعدة في تثبيت مفصل الكتف من الخلف",
    ],
    motorFunctions_fr: [
      "Extension complète du coude",
      "Poussée d'objets vers l'avant",
      "Stabilisation postérieure de la tête humérale",
    ],
    motorFunctions_en: [
      "Elbow extension",
      "Pushing objects away from body",
      "Posterior shoulder stabilization",
    ],
    clinicalIssues_ar: [
      {
        title: "ضعف العضلة بعد فترات قلة الاستخدام",
        desc: "ضعف القدرة على دفع الجسم للنهوض من السرير أو الكرسي بعد الجراحة.",
        isSpecificToBC: true,
      },
      {
        title: "انضغاط العصب الكعبري الموضعي",
        desc: "قد يسبب خدر في ظهر اليد إذا كان هناك تورم أو وضعيات ضاغطة.",
      },
    ],
    clinicalIssues_fr: [
      {
        title: "Faiblesse par déconditionnement",
        desc: "Difficulté à s'appuyer pour se lever du lit après chirurgie.",
        isSpecificToBC: true,
      },
      {
        title: "Compression nerveuse radiale secondaire",
        desc: "Engourdissement du dos de la main lié à la posture ou à l'œdème.",
      },
    ],
    clinicalIssues_en: [
      {
        title: "Disuse deconditioning weakness",
        desc: "Reduced ability to push up from chairs or beds during early recovery.",
        isSpecificToBC: true,
      },
      {
        title: "Radial nerve irritation",
        desc: "Numbness on the back of hand if prolonged compression or edema occurs.",
      },
    ],
    symptoms_ar: [
      "صعوبة في دفع النفس للنهوض من المقعد",
      "ضعف في قوة مد الذراع",
      "رجفان خفيف في الذراع عند محاولة تثبيتها ممتدة",
    ],
    symptoms_fr: [
      "Difficulté à se relever avec appui des bras",
      "Faiblesse à l'extension du bras",
      "Tremblement léger en maintien prolongé",
    ],
    symptoms_en: [
      "Struggling to push self up from chair",
      "Weakness extending arm against gravity",
      "Mild trembling when holding arm straight",
    ],
    romFactors_ar: [
      "الراحة السريرية الطويلة",
      "تجنب استخدام الذراع في الدفع",
      "ألم في جدار الصدر والكتف",
    ],
    romFactors_fr: [
      "Repos prolongé",
      "Évitement de l'appui sur le bras",
      "Douleurs pariétales thoraciques",
    ],
    romFactors_en: [
      "Prolonged bed rest and immobility",
      "Compensatory avoidance of pushing",
      "Thoracic wall discomfort",
    ],
    exerciseBenefits_ar: [
      "استعادة القوة الوظيفية للاعتماد على النفس في الحركة اليومية",
      "تنشيط ضخ السائل اللمفاوي عبر الانقباض العضلي المتناغم",
      "تحسين استقرار واستقامة مفصل المرفق",
    ],
    exerciseBenefits_fr: [
      "Restauration de la force fonctionnelle pour l'autonomie",
      "Activation de la pompe musculaire lymphatique",
      "Stabilité articulaire du coude",
    ],
    exerciseBenefits_en: [
      "Restores self-reliance in mobility transfers",
      "Promotes muscular lymphatic pumping action",
      "Improves elbow joint stability",
    ],
    recommendedExerciseKeys: ["arm_side", "arm_stretch", "post_surgery"],
    careTips_ar: [
      "تدرجي في تمارين التقوية بعد إذن الطبيب دون أوزان ثقيلة",
      "تجنبي الاتكاء المفاجئ بكامل وزن الجسم على الذراع المتأثرة",
      "مارسي تمارين البسط اللطيفة بالتنفس الهادئ",
    ],
    careTips_fr: [
      "Progressez sans charges lourdes après avis médical",
      "Évitez l'appui brutal de tout le poids du corps",
      "Pratiquez des extensions douces synchronisées au souffle",
    ],
    careTips_en: [
      "Progress gently without heavy resistance once cleared",
      "Avoid sudden full-weight bearing on the healing side",
      "Perform gentle extensions with relaxed breathing",
    ],
    doctorAlerts_ar: [
      "عجز مفاجئ عن مد الكوع",
      "سقوط الرسغ أو صعوبة رفع ظهر اليد (Wrist drop)",
      "ألم حاد في مؤخرة المرفق",
    ],
    doctorAlerts_fr: [
      "Impossibilité soudaine d'étendre le coude",
      "Chute du poignet ou déficit moteur des doigts",
      "Douleur aiguë à l'arrière du coude",
    ],
    doctorAlerts_en: [
      "Sudden inability to extend the elbow",
      "Wrist drop or inability to lift back of hand",
      "Sharp pain at posterior elbow",
    ],
    references: [
      {
        source: "American Physical Therapy Association (APTA)",
        guideline: "Oncology Section Practice Patterns",
      },
      {
        source: "Cochrane Systematic Review",
        guideline: "Exercise interventions for upper-limb dysfunction post-breast cancer",
      },
    ],
  },

  {
    id: "forearm",
    name_ar: "الساعد (Forearm)",
    name_fr: "Avant-bras",
    name_dz: "الساعد (بين الكوع واليد)",
    name_en: "Forearm",
    category: "arm",
    topPercent: 42,
    leftPercent: 30,
    definition_ar:
      "المنطقة الواقعة بين المرفق والرسغ، تضم عظمي الكعبرة والزند ومجموعات عضلية تتحكم في حركة اليد والأصابع.",
    definition_fr:
      "Segment situé entre le coude et le poignet, comprenant le radius et l'ulna ainsi que les muscles fléchisseurs/extenseurs des doigts.",
    definition_en:
      "Segment between elbow and wrist containing radius and ulna bones, housing finger and wrist motor groups.",
    connectedStructures_ar: [
      "عظم الكعبرة وعظم الزند",
      "الغشاء بين العظمين (Interosseous membrane)",
      "العضلات القابضة والباسطة للرسغ والأصابع",
      "الشريان الكعبري والزندي",
    ],
    connectedStructures_fr: [
      "Radius et ulna",
      "Membrane interosseuse",
      "Muscles fléchisseurs et extenseurs des doigts",
      "Artères radiale et ulnaire",
    ],
    connectedStructures_en: [
      "Radius and ulna bones",
      "Interosseous membrane",
      "Finger and wrist flexors/extensors",
      "Radial and ulnar vascular bundles",
    ],
    motorFunctions_ar: [
      "تدوير اليد للأعلى وللأسفل (كب وبسط الساعد)",
      "التحكم في قوة قبضة اليد والأصابع",
      "تثبيت الرسغ أثناء حمل الأغراض الخفيفة",
    ],
    motorFunctions_fr: [
      "Prono-supination de la main",
      "Contrôle de la force de préhension des doigts",
      "Stabilisation du poignet lors du port d'objets",
    ],
    motorFunctions_en: [
      "Pronation and supination (turning hand over)",
      "Fine and power finger grip strength",
      "Wrist stabilization during fine tasks",
    ],
    clinicalIssues_ar: [
      {
        title: "الوذمة اللمفية في الساعد",
        desc: "قد يظهر تورم بطيء في الساعد مع انطباع أثر عند الضغط بالأصبع (Pitting edema).",
        isSpecificToBC: true,
      },
      {
        title: "متلازمة الحبل الإبطي الممتدة (Cording)",
        desc: "أوتار مشدودة شبيهة بالحبل قد تمتد من الإبط مروراً بالكوع إلى الساعد، مما يحد من حركة اليد.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_fr: [
      {
        title: "Lymphœdème de l'avant-bras",
        desc: "Gonflement progressif avec signe du godet possible.",
        isSpecificToBC: true,
      },
      {
        title: "Corde axillaire descendante (Axillary Web Syndrome)",
        desc: "Structure fibreuse visible ou palpable limitant l'extension.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_en: [
      {
        title: "Forearm Lymphedema",
        desc: "Gradual swelling in forearm tissue, sometimes exhibiting pitting.",
        isSpecificToBC: true,
      },
      {
        title: "Axillary Web Syndrome (Cording)",
        desc: "Tight subcutaneous cords extending from axilla across elbow into forearm.",
        isSpecificToBC: true,
      },
    ],
    symptoms_ar: [
      "ضيق في أساور اليد أو الساعة",
      "شعور بحبل مشدود تحت الجلد عند فرد الذراع",
      "تنميل أو وخز خفيف في باطن الساعد",
    ],
    symptoms_fr: [
      "Bracelets ou montre serrés",
      "Cordelette sous-cutanée tendue en tendant le bras",
      "Picotements ou engourdissement de l'avant-bras",
    ],
    symptoms_en: [
      "Jewelry, watches, or sleeves feeling tight",
      "Tight guitar-string cord felt under skin on full reach",
      "Tingling or fuzzy sensation on forearm surface",
    ],
    romFactors_ar: [
      "تليف الأنسجة بعد إزالة العقد اللمفاوية",
      "عدم تحريك الأصابع والمرفق في الأيام الأولى",
      "الاستلقاء بوضعية غير ملائمة",
    ],
    romFactors_fr: [
      "Fibrose après curage axillaire",
      "Manque de mobilisation distale précoce",
      "Positionnement nocturne inadapté",
    ],
    romFactors_en: [
      "Scarring post axillary lymph node dissection",
      "Lack of early gentle distal finger/wrist mobility",
      "Dependent positioning without elevation",
    ],
    exerciseBenefits_ar: [
      "تنشيط مضخة العضلات للمساعدة في التصريف اللمفاوي",
      "تليين الحبال التليفية واستعادة المرونة تدريجياً",
      "تحسين قوة القبضة والكفاءة الحركية",
    ],
    exerciseBenefits_fr: [
      "Activation de la pompe musculaire veino-lymphatique",
      "Assouplissement des brides fibreuses",
      "Maintien de la force de préhension",
    ],
    exerciseBenefits_en: [
      "Activates muscle pump facilitating lymphatic return",
      "Softens fibrotic cords and enhances reach",
      "Sustains functional grip strength",
    ],
    recommendedExerciseKeys: ["post_surgery", "arm_stretch", "arm_raise"],
    careTips_ar: [
      "ارفعي الساعد على وسادة مريحة عند الجلوس لتعزيز التصريف",
      "تجنبي قياس ضغط الدم أو سحب العينات في هذا الذراع إذا أوصى طبيبك",
      "حافظي على نظافة وترطيب جلد الساعد باستمرار",
    ],
    careTips_fr: [
      "Surélevez l'avant-bras sur un coussin au repos",
      "Évitez prises de sang et tensiomètre du côté opéré selon consigne médicale",
      "Hydratez la peau délicatement au quotidien",
    ],
    careTips_en: [
      "Elevate forearm on soft pillow when resting",
      "Avoid blood pressure cuffs or IVs on surgical arm per medical team guidance",
      "Keep skin cleanly moisturized and protected",
    ],
    doctorAlerts_ar: [
      "تورم متزايد ومستمر في الساعد",
      "دفء واحمرار سريع الانتشار (اشتباه التهاب خلوي Celullitis)",
      "ألم شديد يصاحبه تغير في لون الجلد",
    ],
    doctorAlerts_fr: [
      "Gonflement persistant croissant de l'avant-bras",
      "Zone rouge chaude s'étendant (suspicion érysipèle)",
      "Douleur vive avec altération cutanée",
    ],
    doctorAlerts_en: [
      "Progressive worsening swelling in forearm",
      "Spreading warm redness (suspicion of cellulitis / infection)",
      "Severe pain with skin changes",
    ],
    references: [
      {
        source: "National Lymphedema Network (NLN)",
        guideline: "Clinical Guidelines for Breast Cancer Survivors",
      },
      { source: "Macmillan Cancer Support", guideline: "Managing Cording (Axillary Web Syndrome)" },
    ],
  },

  {
    id: "elbow",
    name_ar: "مفصل المرفق (الكوع)",
    name_fr: "Articulation du coude",
    name_dz: "الكوع (المرفق)",
    name_en: "Elbow Joint",
    category: "arm",
    topPercent: 37,
    leftPercent: 31,
    definition_ar:
      "مفصل بكرية ومحورية يربط عظم العضد بعظمي الزند والكعبرة، يتيح حركات الثني والمد وتدوير الساعد.",
    definition_fr:
      "Articulation trochléenne et trochoïde unissant l'humérus au radius et à l'ulna pour la flexion-extension et la pronosupination.",
    definition_en:
      "Hinge and pivot synovial joint connecting humerus to ulna and radius for flexion, extension, and rotation.",
    connectedStructures_ar: [
      "اللقمة العضدية الإنسية والوحشية (Epicondyles)",
      "المحفظة المفصلية والأربطة الجانبية (Collateral ligaments)",
      "العصب الزندي المار في نفق الكوع خلف اللقمة الإنسية",
    ],
    connectedStructures_fr: [
      "Épicondyles médial et latéral",
      "Capsule articulaire et ligaments collatéraux",
      "Nerf ulnaire dans la gouttière épitrochléo-olécranienne",
    ],
    connectedStructures_en: [
      "Medial and lateral epicondyles",
      "Articular capsule and collateral ligaments",
      "Ulnar nerve in cubital groove",
    ],
    motorFunctions_ar: [
      "ثني الذراع للوصول إلى الوجه والرأس",
      "فرد الذراع بالكامل للوصول للأمام والأسفل",
      "توفير محور ارتكاز لحركات اليد الدقيقة",
    ],
    motorFunctions_fr: [
      "Flexion du membre pour atteindre le visage",
      "Extension pour atteindre des objets",
      "Pivot dynamique pour les gestes de la main",
    ],
    motorFunctions_en: [
      "Flexion bringing hand to face and chest",
      "Extension for forward and downward reaching",
      "Dynamic stable pivot for hand dexterity",
    ],
    clinicalIssues_ar: [
      {
        title: "تيبس المرفق من الوضعية الدفاعية",
        desc: "صعوبة مد الكوع بعد أسابيع من الجراحة بسبب انكماش الأنسجة أو الخوف من الألم.",
        isSpecificToBC: true,
      },
      {
        title: "حبال متلازمة الحبل الإبطي العابرة للكوع",
        desc: "بروز حبل وترى مشدود يمنع البسط الكامل للكوع ويسبب وخزاً وألماً.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_fr: [
      {
        title: "Enraidissement par posture antalgique",
        desc: "Déficit d'extension consécutif à l'inactivité post-opératoire.",
        isSpecificToBC: true,
      },
      {
        title: "Passage de cordelette axillaire au pli du coude",
        desc: "Tension limitant l'ouverture de l'articulation.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_en: [
      {
        title: "Guarding-induced elbow stiffness",
        desc: "Flexion contracture risk due to holding arm bent to protect surgical area.",
        isSpecificToBC: true,
      },
      {
        title: "Axillary web cord traversing the cubital fossa",
        desc: "Tight taut fibrous band crossing the elbow restricting extension.",
        isSpecificToBC: true,
      },
    ],
    symptoms_ar: [
      "عدم القدرة على وضع الذراع مفرودة على الطاولة",
      "ألم أو شد في طية الكوع عند محاولة الفرد",
      "تنميل في الإصبع الصغير والبنصر عند ثني الكوع طويلاً",
    ],
    symptoms_fr: [
      "Impossibilité de poser le bras à plat",
      "Tiraillement au pli du coude en extension",
      "Engourdissement du petit doigt en flexion prolongée",
    ],
    symptoms_en: [
      "Inability to lay arm completely flat on table",
      "Pulling pain in the elbow crease on straightening",
      "Numbness in ring and pinky fingers if bent long",
    ],
    romFactors_ar: [
      "حبال التليف اللمفاوية",
      "الخوف من الشد على جرح الصدر أو الإبط",
      "الاستلقاء مع ثني الكوع طوال الليل",
    ],
    romFactors_fr: [
      "Cordes fibreuses lymphatiques",
      "Appréhension de traction sur la cicatrice",
      "Flexion continue nocturne",
    ],
    romFactors_en: [
      "Lymphatic fibrotic banding",
      "Apprehension of traction on chest/axillary scar",
      "Sleeping with elbow continuously bent",
    ],
    exerciseBenefits_ar: [
      "استعادة المدى الحركي الكامل بثقة وهدوء",
      "تمديد لطيف للحبال الليفية تحت إشراف التأهيل",
      "تخفيف الضغط على العصب الزندي",
    ],
    exerciseBenefits_fr: [
      "Récupération de l'amplitude totale en confiance",
      "Élongation progressive des brides fibreuses",
      "Décompression du nerf ulnaire",
    ],
    exerciseBenefits_en: [
      "Restores full functional range gently",
      "Safely elongates soft tissue cords",
      "Relieves ulnar nerve entrapment risk",
    ],
    recommendedExerciseKeys: ["post_surgery", "arm_stretch", "arm_raise"],
    careTips_ar: [
      "مارسي حركات الثني والفرد اللطيفة 5 إلى 10 مرات عدة مرات يومياً",
      "تجنبي الاستناد الشديد على الكوعين على الأسطح الصلبة",
      "توقفي عن التمرين فوراً إذا شعرتِ بلسعة كهربائية في اليد",
    ],
    careTips_fr: [
      "Pratiquez des flexions-extensions douces plusieurs fois par jour",
      "Évitez l'appui prolongé sur les coudes sur surfaces dures",
      "Arrêtez le mouvement en cas de décharge électrique dans la main",
    ],
    careTips_en: [
      "Perform gentle bend and straighten reps several times daily",
      "Avoid resting heavy weight on elbows on hard surfaces",
      "Stop immediately if you feel electric-like nerve sensations",
    ],
    doctorAlerts_ar: [
      "انتفاخ حاد واحمرار ساخن في مفصل الكوع",
      "فقدان القدرة على ثني أو فرد المفصل فجأة",
      "تنميل دائم في أصابع اليد",
    ],
    doctorAlerts_fr: [
      "Gonflement chaud aigu du coude",
      "Perte brutale de mobilité articulaire",
      "Perte de sensibilité persistante des doigts",
    ],
    doctorAlerts_en: [
      "Acute hot swelling at the elbow joint",
      "Sudden loss of joint range of motion",
      "Persistent finger sensory loss",
    ],
    references: [
      { source: "British Lymphology Society", guideline: "Axillary Web Syndrome Management" },
      { source: "HAS France", guideline: "Mobilisation articulaire après sénologie" },
    ],
  },

  {
    id: "wrist",
    name_ar: "الرسغ (Poignet)",
    name_fr: "Poignet",
    name_dz: "الرسغ (المعصم)",
    name_en: "Wrist Joint",
    category: "arm",
    topPercent: 49,
    leftPercent: 30,
    definition_ar:
      "مفصل مركب يربط الساعد باليد عبر ثماني عظام رسغية صغيرة، يتحكم في توجيه اليد بدقة واستقرار.",
    definition_fr:
      "Articulation complexe unissant l'avant-bras à la main via 8 osselets carpiens, essentielle à l'orientation fine de la main.",
    definition_en:
      "Complex synovial joint connecting forearm to carpal bones, granting versatile 3D orientation for the hand.",
    connectedStructures_ar: [
      "عظام الرسغ الثمانية (Scaphoid, Lunate...)",
      "النفق الرسغي (Carpal tunnel) والعصب الناصف",
      "القيد القابض (Flexor retinaculum)",
      "أوتار العضلات القابضة والباسطة للأصابع",
    ],
    connectedStructures_fr: [
      "Os du carpe",
      "Canal carpien et nerf médian",
      "Rétinaculum des fléchisseurs",
      "Tendons moteurs des doigts",
    ],
    connectedStructures_en: [
      "Eight carpal bones",
      "Carpal tunnel and median nerve",
      "Flexor retinaculum",
      "Extrinsic finger flexor and extensor tendons",
    ],
    motorFunctions_ar: [
      "ثني ومد الرسغ للأعلى والأسفل",
      "الانحراف الزندي والكعبري (الميلان لليمين واليسار)",
      "تثبيت اليد للكتابة واستخدام الهاتف",
    ],
    motorFunctions_fr: [
      "Flexion et extension du poignet",
      "Inclinaisons radiale et ulnaire",
      "Stabilisation pour l'écriture et le téléphone",
    ],
    motorFunctions_en: [
      "Wrist flexion and extension",
      "Radial and ulnar deviation",
      "Stable foundation for writing, typing, and mobile use",
    ],
    clinicalIssues_ar: [
      {
        title: "متلازمة النفق الرسغي بعد العلاج الكيميائي أو الهرموني",
        desc: "احتباس السوائل أو تأثير مثبطات الأروماتاز قد يسبب ضغطاً على العصب الناصف بالرسغ.",
        isSpecificToBC: true,
      },
      {
        title: "تورم الرسغ اللمفاوي",
        desc: "صعوبة ارتداء الأساور أو الساعة بسبب تجمع السوائل.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_fr: [
      {
        title: "Syndrome du canal carpien post-chimiothérapie ou hormonothérapie",
        desc: "Rétention hydrique ou effets des inhibiteurs de l'aromatase comprimant le nerf médian.",
        isSpecificToBC: true,
      },
      {
        title: "Œdème du poignet",
        desc: "Sensation de gêne avec les bijoux et montres.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_en: [
      {
        title: "Carpal tunnel syndrome related to aromatase inhibitors or chemo",
        desc: "Fluid retention or hormonal therapy side-effects causing median nerve compression.",
        isSpecificToBC: true,
      },
      {
        title: "Distal wrist lymphedema puffiness",
        desc: "Tightness around wrists and difficulties wearing bracelets.",
        isSpecificToBC: true,
      },
    ],
    symptoms_ar: [
      "وخز وتنميل في الإبهام والسبابة والوسطى (خاصة ليلاً)",
      "تيبس في مفصل الرسغ عند الاستيقاظ صباحاً",
      "ضعف طفيف في إمساك الأشياء الصغيرة",
    ],
    symptoms_fr: [
      "Fourmillements nocturnes dans le pouce, l'index et le majeur",
      "Raideur matinale du poignet",
      "Lâchage accidentel d'objets fins",
    ],
    symptoms_en: [
      "Nocturnal tingling in thumb, index, and middle finger",
      "Morning wrist stiffness",
      "Occasional dropping of small objects due to numbness",
    ],
    romFactors_ar: [
      "الآثار الجانبية للأدوية الهرمونية (Aromatase inhibitors)",
      "احتباس السوائل العام أو اللمفاوي",
      "قلة الحركة وتثبيت اليد",
    ],
    romFactors_fr: [
      "Effets secondaires des anti-aromatases",
      "Rétention hydrique générale ou lymphatique",
      "Immobilisation",
    ],
    romFactors_en: [
      "Aromatase inhibitor arthralgia",
      "Systemic or lymphatic fluid retention",
      "Protracted wrist immobilization",
    ],
    exerciseBenefits_ar: [
      "تحسين حركة الرسغ وتقليل التيبس الصباحي",
      "تخفيف الضغط داخل النفق الرسغي بحركات انزلاق الأوتار (Tendon gliding)",
      "تعزيز الدورة الدموية الدقيقة في اليد",
    ],
    exerciseBenefits_fr: [
      "Amélioration de la mobilité et diminution de la raideur matinale",
      "Glissement tendineux pour décomprimer le canal carpien",
      "Stimulation de la micro-circulation",
    ],
    exerciseBenefits_en: [
      "Relieves morning joint stiffness",
      "Facilitates tendon gliding in carpal tunnel",
      "Enhances peripheral blood and lymphatic flow",
    ],
    recommendedExerciseKeys: ["post_surgery", "arm_stretch"],
    careTips_ar: [
      "قومي بتمارين دوران الرسغ البسيطة في كلا الاتجاهين",
      "تجنبي ثني الرسغ بشدة أثناء النوم (يمكن استخدام جبيرة ليلية عند استشارة الطبيب)",
      "دلكي الرسغ بلطف للأعلى باتجاه المرفق",
    ],
    careTips_fr: [
      "Faites des rotations douces du poignet dans les deux sens",
      "Évitez la flexion forcée la nuit (attelle de repos si conseillé par le médecin)",
      "Effleurez délicatement vers le coude",
    ],
    careTips_en: [
      "Perform gentle wrist circles both clockwise and counter-clockwise",
      "Avoid sleeping with wrists severely flexed; consider neutral resting splint if recommended",
      "Gently stroke upward toward the elbow",
    ],
    doctorAlerts_ar: [
      "فقدان الإحساس التام في أطراف الأصابع",
      "ألم مستمر يعطل النوم ليلاً",
      "ضمور ملحوظ في عضلات قاعدة الإبهام",
    ],
    doctorAlerts_fr: [
      "Perte totale de sensibilité des doigts",
      "Douleur continue perturbant le sommeil",
      "Amyotrophie de l'éminence thénar",
    ],
    doctorAlerts_en: [
      "Total sensory numbness in fingertips",
      "Persistent pain waking you up from sleep",
      "Noticeable muscle wasting at base of thumb",
    ],
    references: [
      {
        source: "ESMO Clinical Guidelines",
        guideline: "Management of Aromatase Inhibitor-Associated Arthralgia",
      },
      {
        source: "American Academy of Orthopaedic Surgeons (AAOS)",
        guideline: "Carpal Tunnel Syndrome",
      },
    ],
  },

  {
    id: "hand",
    name_ar: "اليد والأصابع (Hand & Fingers)",
    name_fr: "Main et doigts",
    name_dz: "اليد والأصابع",
    name_en: "Hand & Fingers",
    category: "arm",
    topPercent: 55,
    leftPercent: 30,
    definition_ar:
      "نهاية الطرف العلوي وأداة الاتصال واللمس الدقيقة، تتركب من 19 عظماً وعدة مفاصل وعضلات دقيقة للأصابع.",
    definition_fr:
      "Extrémité distale du membre supérieur, organe complexe de préhension et du toucher formé de métacarpiens et phalanges.",
    definition_en:
      "Distal upper limb terminal organ for tactile touch and high-dexterity grip, composed of metacarpals and phalanges.",
    connectedStructures_ar: [
      "الأمشاط والسلاميات (Metacarpals & Phalanges)",
      "العضلات الدودية والعضلات بين العظام (Lumbricals & Interossei)",
      "الأوتار القابضة السطحية والعميقة",
      "الأعصاب الحسية الرقمية",
    ],
    connectedStructures_fr: [
      "Métacarpiens et phalanges",
      "Muscles lombricaux et interosseux",
      "Tendons fléchisseurs superficiels et profonds",
      "Nerfs digitaux sensitifs",
    ],
    connectedStructures_en: [
      "Metacarpals and phalanges",
      "Lumbrical and interosseous intrinsic muscles",
      "Flexor and extensor tendon sheaths",
      "Digital sensory nerve branches",
    ],
    motorFunctions_ar: [
      "القبض الدقيق للإبرة والقلم (Fine motor pinch)",
      "القبض القوي على المقابض والأكواب (Power grip)",
      "التواصل والإيماءات اليومية والتعبير الحركي",
    ],
    motorFunctions_fr: [
      "Pincement fin pour saisir de petits objets",
      "Préhension globale pour tenir des objets",
      "Geste expressif et communication",
    ],
    motorFunctions_en: [
      "Fine motor pinch and pincer grasp",
      "Functional cylindrical and power grip",
      "Tactile exploration and everyday self-care",
    ],
    clinicalIssues_ar: [
      {
        title: "الاعتلال العصبي المحيطي الناجم عن العلاج الكيميائي (CIPN)",
        desc: "أدوية التاكسان والبلاتين قد تسبب خدر وتنميل وشعور بالحرارة أو البرودة في الأصابع.",
        isSpecificToBC: true,
      },
      {
        title: "تورم ظهر اليد والأصابع (Hand Lymphedema)",
        desc: "انتفاخ ظهر اليد وصعوبة غلق الأصابع أو ارتداء الخواتم.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_fr: [
      {
        title: "Neuropathie périphérique induite par chimiothérapie (CIPN)",
        desc: "Engourdissement, picotements en chaussette/gant par les taxanes.",
        isSpecificToBC: true,
      },
      {
        title: "Lymphœdème du dos de la main et des doigts",
        desc: "Gonflement rendant difficile le port des bagues et la fermeture du poing.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_en: [
      {
        title: "Chemotherapy-Induced Peripheral Neuropathy (CIPN)",
        desc: "Tingling, numbness, or hypersensitivity in fingertips related to taxane therapies.",
        isSpecificToBC: true,
      },
      {
        title: "Dorsal hand and finger lymphedema",
        desc: "Puffiness on back of hand, difficulty fitting rings, tight feeling on fist clenching.",
        isSpecificToBC: true,
      },
    ],
    symptoms_ar: [
      "صعوبة في تزرير الملابس أو التقاط العملات المعدنية",
      "انتفاخ ظاهر في ظهر اليد مع اختفاء مفاصل الأصابع",
      "إحساس بالدبابيس أو البرودة في أطراف الأصابع",
    ],
    symptoms_fr: [
      "Difficulté à boutonner ou ramasser une pièce",
      "Gonflement du dos de la main effaçant le relief des veines",
      "Sensation de brûlure ou d'aiguilles aux bouts des doigts",
    ],
    symptoms_en: [
      "Trouble buttoning shirts or picking up small coins",
      "Visible puffiness on back of hand obscuring veins/knuckles",
      "Pins-and-needles or cold sensation in fingertips",
    ],
    romFactors_ar: [
      "تأثيرات العلاج الكيميائي التراكمية",
      "التورم اللمفاوي الموضعي",
      "جفاف الجلد والتهاب الأوتار",
    ],
    romFactors_fr: [
      "Toxicité cumulative des chimiothérapies",
      "Œdème lymphatique distal",
      "Sécheresse cutanée et ténosynovite",
    ],
    romFactors_en: [
      "Cumulative neurotoxic chemotherapy exposure",
      "Distal lymphatic swelling",
      "Dry skin and superficial tenosynovitis",
    ],
    exerciseBenefits_ar: [
      "تنشيط التصريف اللمفاوي بمضخة قبض وبسط الأصابع",
      "تحفيز النهايات العصبية ومكافحة التنميل بالحركات الدقيقة",
      "المحافظة على المهارات الحركية الدقيقة للاستقلالية اليومية",
    ],
    exerciseBenefits_fr: [
      "Pompage lymphatique distal par ouvertures/fermetures de la main",
      "Stimulation proprioceptive contre les neuropathies",
      "Maintien de l'indépendance fonctionnelle",
    ],
    exerciseBenefits_en: [
      "Distal muscular pumping through gentle fist open-and-close cycles",
      "Sensory re-education countering CIPN symptoms",
      "Maintains dexterity for writing and personal care",
    ],
    recommendedExerciseKeys: ["post_surgery", "breathing"],
    careTips_ar: [
      "ارتدي قفازات واقية عند تنظيف المنزل أو البستنة لتجنب الخدوش والعدوى",
      "تجنبي قص الجلد المحيط بالأظافر بعنف",
      "مارسي فتح وقبض الأصابع ببطء مع كرة مطاطية إسفنجية ناعمة",
    ],
    careTips_fr: [
      "Portez des gants de protection pour le ménage ou le jardinage (prévention des infections)",
      "Évitez de couper les cuticules trop court",
      "Pressez doucement une balle souple en mousse",
    ],
    careTips_en: [
      "Wear protective gloves when gardening or using household chemicals to prevent infection",
      "Do not cut nail cuticles harshly",
      "Perform gentle open-and-close finger movements using soft stress ball",
    ],
    doctorAlerts_ar: [
      "أي جرح ملتهب أو خدش يظهر عليه احمرار وسخونة",
      "تورم مفاجئ وسريع في كامل اليد",
      "فقدان كامل للقدرة على استخدام الأصابع",
    ],
    doctorAlerts_fr: [
      "Toute plaie infectée, coupure avec rougeur ou chaleur",
      "Gonflement brutal de toute la main",
      "Perte motrice complète des doigts",
    ],
    doctorAlerts_en: [
      "Any cut or wound exhibiting redness, warmth, or pus",
      "Sudden rapid whole-hand swelling",
      "Complete inability to move fingers",
    ],
    references: [
      {
        source: "Oncology Nursing Society (ONS)",
        guideline: "Chemotherapy-Induced Peripheral Neuropathy Guidelines",
      },
      {
        source: "Lymphoedema Support Network (LSN)",
        guideline: "Skin Care and Infection Prevention",
      },
    ],
  },

  // =================== SHOULDER REGION (الكتف) ===================
  {
    id: "shoulder_joint",
    name_ar: "مفصل الكتف (Glenohumeral Joint)",
    name_fr: "Articulation gléno-humérale",
    name_dz: "مفصل الكتف الأساسي",
    name_en: "Glenohumeral Shoulder Joint",
    category: "shoulder",
    topPercent: 25,
    leftPercent: 37,
    definition_ar:
      "المفصل الكروي الحقي الأكثر حركة في الجسم، يربط رأس عظم العضد بالتجويف الحقاني للوح الكتف، محاط بمحفظة مرنة وأوتار داعمة.",
    definition_fr:
      "Articulation énarthrose la plus mobile du corps, unissant la tête humérale à la glène de la scapula.",
    definition_en:
      "The ball-and-socket synovial joint connecting humeral head to glenoid cavity of scapula, possessing the widest range of motion.",
    connectedStructures_ar: [
      "رأس العضد والتجويف الحقاني (Glenoid fossa)",
      "المحفظة المفصلية والأربطة الحقانية العضدية",
      "الشفا الحقاني (Glenoid labrum)",
      "أوتار الكفة المدورة المحيطة بالمفصل",
    ],
    connectedStructures_fr: [
      "Tête de l'humérus et cavité glénoïdale",
      "Capsule articulaire et ligaments gléno-huméraux",
      "Bourrelet glénoïdien (labrum)",
      "Tendons de la coiffe des rotateurs",
    ],
    connectedStructures_en: [
      "Humeral head and glenoid cavity",
      "Articular capsule and glenohumeral ligaments",
      "Glenoid labrum",
      "Surrounding rotator cuff tendinous hood",
    ],
    motorFunctions_ar: [
      "رفع الذراع للأعلى 180 درجة (Flexion & Abduction)",
      "تدوير الذراع للداخل وللخارج (Internal & External rotation)",
      "تحريك الذراع بحرية في جميع المستويات الفراغية",
    ],
    motorFunctions_fr: [
      "Élévation du bras à 180° (flexion et abduction)",
      "Rotations interne et externe",
      "Mouvements multidirectionnels dans l'espace",
    ],
    motorFunctions_en: [
      "Arm elevation up to 180° in flexion and abduction",
      "Internal and external rotation",
      "Full multi-planar 3D movement",
    ],
    clinicalIssues_ar: [
      {
        title: "تيبس مفصل الكتف والكتف المتجمدة (Frozen Shoulder)",
        desc: "شائع بعد جراحات الثدي أو العلاج الإشعاعي، حيث تلتهب المحفظة المفصلية وتنكمش مما يحد من رفع الذراع بشدة.",
        isSpecificToBC: true,
      },
      {
        title: "محدودية الدوران الخارجي والرفع للأعلى",
        desc: "صعوبة تمشيط الشعر أو ارتداء حمالة الصدر بسبب انكماش المحفظة الأمامية.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_fr: [
      {
        title: "Capsulite rétractile (Épaule gelée / Frozen shoulder)",
        desc: "Complication fréquente post-chirurgie ou radiothérapie avec rétraction capsulaire sévère.",
        isSpecificToBC: true,
      },
      {
        title: "Perte de rotation externe et d'élévation",
        desc: "Gêne pour se coiffer ou agrafer un vêtement dans le dos.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_en: [
      {
        title: "Adhesive Capsulitis (Frozen Shoulder)",
        desc: "Capsular thickening and contraction restricting elevation and rotation post-surgery/radiation.",
        isSpecificToBC: true,
      },
      {
        title: "Loss of external rotation and overhead reach",
        desc: "Difficulty styling hair or fastening garments behind the back.",
        isSpecificToBC: true,
      },
    ],
    symptoms_ar: [
      "عجز عن رفع الذراع فوق مستوى الكتف دون رفع لوح الكتف بالكامل",
      "ألم عميق في المفصل يزداد ليلاً عند النوم على الجانب المتأثر",
      "شعور بأن المفصل 'مقفول' أو عالق عند نقطة معينة",
    ],
    symptoms_fr: [
      "Incapacité à lever le bras au-dessus de l'horizontale sans hausser l'épaule",
      "Douleur profonde nocturne en appui sur le côté opéré",
      "Sensation de butée mécanique ferme",
    ],
    symptoms_en: [
      "Inability to lift arm overhead without shrugging entire shoulder",
      "Deep joint ache worsening at night when lying on affected side",
      "Hard mechanical end-feel blocking movement",
    ],
    romFactors_ar: [
      "الالتصاقات الناتجة عن الجراحة والإشعاع",
      "تأخر بدء تمارين الحركة بعد نزع أنابيب التصريف",
      "الاستجابة الالتهابية الموضعية للأنسجة",
    ],
    romFactors_fr: [
      "Adhérences post-chirurgicales et radique",
      "Retard de mobilisation après ablation des redons",
      "Réaction inflammatoire tissulaire locale",
    ],
    romFactors_en: [
      "Post-surgical and radiation-induced adhesions",
      "Delayed mobilization post drain removal",
      "Local tissue inflammatory remodeling",
    ],
    exerciseBenefits_ar: [
      "تليين المحفظة المفصلية تدريجياً وإعادة ترطيب الغضاريف",
      "استعادة مدى الحركة الوظيفي الكافي للاستقلالية التامة",
      "تخفيف الألم المزمن وتحسين نوعية النوم",
    ],
    exerciseBenefits_fr: [
      "Assouplissement de la capsule et lubrification synoviale",
      "Restauration de l'amplitude fonctionnelle pour l'autonomie",
      "Diminution des douleurs chroniques et meilleur sommeil",
    ],
    exerciseBenefits_en: [
      "Gently restores capsular compliance and synovial lubrication",
      "Regains functional range of motion for independence",
      "Alleviates chronic pain and restores restorative sleep",
    ],
    recommendedExerciseKeys: [
      "arm_raise",
      "arm_side",
      "shoulder_circle",
      "shoulder_flex",
      "wall_climb_mobility",
    ],
    careTips_ar: [
      "ابدئي التمارين ببطء شديد وتوقفي عند أول شعور بالراحة دون تجاوز حد الألم",
      "استخدمي كمادات دافئة لطيفة قبل التمارين إذا سمح طبيبك بذلك",
      "تجنبي النوم مباشرة على الكتف المتأثر في الأشهر الأولى",
    ],
    careTips_fr: [
      "Démarrez très progressivement, sans jamais forcer dans la douleur",
      "Chaleur douce avant les exercices si autorisée par le médecin",
      "Évitez de dormir directement sur l'épaule opérée",
    ],
    careTips_en: [
      "Start exercises very smoothly and stop at the comfort boundary without pushing through pain",
      "Mild gentle warmth before exercise if permitted by your oncologist",
      "Avoid sleeping directly compressed on the operative shoulder",
    ],
    doctorAlerts_ar: [
      "تدهور سريع في مدى حركة الكتف خلال أيام قليلة",
      "ألم شديد ومفاجئ يمنع أي حركة للذراع",
      "حرارة موضعية وتورم ملحوظ في مفصل الكتف",
    ],
    doctorAlerts_fr: [
      "Perte brutale d'amplitude articulaire en quelques jours",
      "Douleur aiguë interdisant toute mobilisation",
      "Chaleur locale et tuméfaction de l'épaule",
    ],
    doctorAlerts_en: [
      "Rapid loss of shoulder range within days",
      "Severe intractable pain prohibiting any arm movement",
      "Local warmth and acute joint swelling",
    ],
    references: [
      {
        source: "ASCO Post-Treatment Guidelines",
        guideline: "Management of Adhesive Capsulitis in Breast Cancer",
      },
      {
        source: "American Physical Therapy Association (APTA)",
        guideline: "Shoulder Impairments in Breast Cancer Survivors",
      },
    ],
  },

  {
    id: "rotator_cuff",
    name_ar: "عضلات الكفة المدورة (Rotator Cuff)",
    name_fr: "Coiffe des rotateurs",
    name_dz: "عضلات الكفة المدورة للكتف",
    name_en: "Rotator Cuff Complex",
    category: "shoulder",
    topPercent: 24,
    leftPercent: 39,
    definition_ar:
      "مجموعة من أربع عضلات وأوتارها (فوق الشوكة، تحت الشوكة، المدورة الصغيرة، وتحت الكتف) تثبت رأس العضد داخل التجويف الحقاني وتتحكم في دورانه.",
    definition_fr:
      "Groupe de 4 muscles (sus-épineux, sous-épineux, petit rond, sous-scapulaire) coiffant la tête humérale pour la stabiliser et la faire pivoter.",
    definition_en:
      "Four dynamic muscles (supraspinatus, infraspinatus, teres minor, subscapularis) dynamic stabilizers centering humeral head during movement.",
    connectedStructures_ar: [
      "العضلة فوق الشوكة (Supraspinatus)",
      "العضلة تحت الشوكة (Infraspinatus)",
      "العضلة المدورة الصغيرة (Teres minor)",
      "العضلة تحت الكتف (Subscapularis)",
      "المسافة تحت الأخرمية (Subacromial space)",
    ],
    connectedStructures_fr: [
      "Supra-épineux",
      "Infra-épineux",
      "Petit rond",
      "Subscapulaire",
      "Espace sous-acromial",
    ],
    connectedStructures_en: [
      "Supraspinatus tendon",
      "Infraspinatus tendon",
      "Teres minor",
      "Subscapularis tendon",
      "Subacromial bursa and space",
    ],
    motorFunctions_ar: [
      "تثبيت رأس عظم العضد في مكانه أثناء رفع الذراع لمنع الاحتكاك",
      "بدء أول 15 درجة من رفع الذراع للجانب (فوق الشوكة)",
      "تدوير الذراع للخارج لتمشيط الشعر أو الوصول للمقعد الخلفي",
    ],
    motorFunctions_fr: [
      "Centrage dynamique de la tête humérale pendant l'élévation",
      "Initiation de l'abduction (0-15°)",
      "Rotation externe pour les gestes de coiffage et d'habillement",
    ],
    motorFunctions_en: [
      "Dynamic humeral head depression preventing subacromial impingement",
      "Initiation of lateral arm abduction (0-15°)",
      "External and internal rotation for grooming and dressing",
    ],
    clinicalIssues_ar: [
      {
        title: "متلازمة الانحشار تحت الأخرم (Impingement Syndrome)",
        desc: "تغير ميكانيكا الكتف بعد الجراحة يسبب ضغطاً على وتر فوق الشوكة أثناء رفع الذراع.",
        isSpecificToBC: true,
      },
      {
        title: "ضعف الكفة المدورة بسبب قلة الاستخدام أو الإشعاع",
        desc: "فقدان القوة التثبيتية مما يسبب صعود رأس العضد للأعلى واحتكاكه بعظم الأخرم.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_fr: [
      {
        title: "Conflit sous-acromial secondaire",
        desc: "Pincement du tendon supra-épineux par altération du rythme scapulo-huméral post-opératoire.",
        isSpecificToBC: true,
      },
      {
        title: "Déséquilibre et faiblesse des rotateurs",
        desc: "Perte du centrage de la tête humérale.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_en: [
      {
        title: "Secondary Subacromial Impingement",
        desc: "Altered scapulohumeral rhythm pinching supraspinatus tendon between 60° and 120° arc.",
        isSpecificToBC: true,
      },
      {
        title: "Rotator cuff muscular fatigue and deconditioning",
        desc: "Loss of dynamic humeral centering following surgery and radiation therapy.",
        isSpecificToBC: true,
      },
    ],
    symptoms_ar: [
      "ألم قوسي حاد عند رفع الذراع بين 60 إلى 120 درجة (Arc doloroso)",
      "صعوبة وضع اليد خلف الظهر أو ربط المئزر",
      "ضعف ملحوظ عند محاولة رفع إبريق ماء خفيف جانباً",
    ],
    symptoms_fr: [
      "Arc douloureux entre 60° et 120° d'élévation",
      "Difficulté à passer la main dans le dos",
      "Faiblesse lors du port d'objets bras écarté",
    ],
    symptoms_en: [
      "Painful arc between 60° and 120° of arm elevation",
      "Difficulty reaching behind back",
      "Weakness holding light pitcher out to the side",
    ],
    romFactors_ar: [
      "اضطراب حركة لوح الكتف التعويضي",
      "ضعف العضلات المثبتة للجذع",
      "الشد والندبات في الصدر والإبط",
    ],
    romFactors_fr: [
      "Dyskinésie scapulaire compensatoire",
      "Faiblesse des stabilisateurs de posture",
      "Cicatrices rétractiles pectorales et axillaires",
    ],
    romFactors_en: [
      "Compensatory scapular dyskinesis",
      "Postural stabilizer fatigue",
      "Pectoral and axillary scar contractures",
    ],
    exerciseBenefits_ar: [
      "إعادة توازن القوى العضلية حول مفصل الكتف",
      "منع الاحتكاك المؤلم بفتح المسافة تحت الأخرمية",
      "تحسين ثبات المفصل والقدرة على التحكم بالحركة بسلاسة",
    ],
    exerciseBenefits_fr: [
      "Rééquilibrage des forces musculaires de l'épaule",
      "Ouverture de l'espace sous-acromial anti-frottement",
      "Stabilité articulaire et fluidité du mouvement",
    ],
    exerciseBenefits_en: [
      "Re-establishes muscular force couples around glenohumeral joint",
      "Opens subacromial clearance preventing painful friction",
      "Enhances dynamic stability and movement fluency",
    ],
    recommendedExerciseKeys: [
      "shoulder_circle",
      "shoulder_flex",
      "scapular_retraction",
      "arm_side",
    ],
    careTips_ar: [
      "ارفعي ذراعك في المستوى الإبطي (Scaption - بزاوية 30 درجة للأمام) بدلاً من الجانب التام لتفادي الاحتكاك",
      "تجنبي حمل الأشياء الثقيلة بذراع ممدودة بعيداً عن الجسم",
      "حافظي على وضعية استقامة الكتفين والصدر للخارج",
    ],
    careTips_fr: [
      "Montez le bras dans le plan de la scapula (30° en avant) plutôt qu'en abduction pure",
      "Évitez de porter à bout de bras",
      "Maintenez une bonne ouverture posturale des épaules",
    ],
    careTips_en: [
      "Elevate arm in scapular plane (30° forward of coronal plane) to spare cuff tendons",
      "Keep loads close to your body rather than at arm's length",
      "Maintain upright thoracic posture without slumping forward",
    ],
    doctorAlerts_ar: [
      "صوت طقطقة مؤلمة يصاحبه عجز مفاجئ عن رفع الذراع",
      "ألم حاد لا يهدأ حتى في وضعيات الراحة التامة",
      "فقدان تدريجي متزايد في قوة الرفع الجانبي",
    ],
    doctorAlerts_fr: [
      "Craquement douloureux avec incapacité brutale de lever le bras",
      "Douleur continue au repos complet",
      "Diminution rapide de la force motrice",
    ],
    doctorAlerts_en: [
      "Painful snap followed by sudden inability to lift arm",
      "Sharp pain unremitting even in complete rest positions",
      "Progressive loss of lateral lifting strength",
    ],
    references: [
      {
        source: "Journal of Clinical Oncology",
        guideline: "Upper Extremity Morbidity and Quality of Life in Breast Cancer",
      },
      {
        source: "Mayo Clinic Proceedings",
        guideline: "Rotator Cuff Care in Post-Mastectomy Rehabilitation",
      },
    ],
  },

  {
    id: "deltoid",
    name_ar: "العضلة الدالية (Deltoid Muscle)",
    name_fr: "Muscle deltoïde",
    name_dz: "عضلة الكتف الدالية (الدلتويد)",
    name_en: "Deltoid Muscle",
    category: "shoulder",
    topPercent: 27,
    leftPercent: 36,
    definition_ar:
      "العضلة المثلثية الكبيرة التي تغطي قمة الكتف وتمنحه شكله المدور، تتكون من ألياف أمامية ووسطى وخلفية لتنفيذ كافة حركات رفع الذراع.",
    definition_fr:
      "Puissant muscle triangulaire coiffant le moignon de l'épaule en trois faisceaux (antérieur, moyen, postérieur).",
    definition_en:
      "Large triangular muscle forming the rounded contour of shoulder, split into anterior, lateral, and posterior heads.",
    connectedStructures_ar: [
      "الترقوة (Clavicle - الجزء الأمامي)",
      "الأخرم (Acromion - الجزء الأوسط)",
      "شوكة لوح الكتف (Spine of scapula - الجزء الخلفي)",
      "الأحدوبة الدالية على عظم العضد (Deltoid tuberosity)",
      "العصب الإبطي (Axillary nerve)",
    ],
    connectedStructures_fr: [
      "Clavicule, acromion et épine scapulaire",
      "Tubérosité deltoïdienne de l'humérus",
      "Nerf axillaire",
    ],
    connectedStructures_en: [
      "Clavicle, acromion, and scapular spine",
      "Deltoid tuberosity on humerus",
      "Axillary nerve",
    ],
    motorFunctions_ar: [
      "رفع الذراع للجانب حتى 90 درجة وما فوق (الألياف الوسطى)",
      "رفع الذراع للأمام والداخل (الألياف الأمامية)",
      "سحب الذراع للخلف والدوران الخارجي (الألياف الخلفية)",
    ],
    motorFunctions_fr: [
      "Abduction du bras à 90° et au-delà (faisceau moyen)",
      "Antépulsion et rotation interne (faisceau antérieur)",
      "Rétropulsion et rotation externe (faisceau postérieur)",
    ],
    motorFunctions_en: [
      "Primary arm abduction from 15° to 90° and beyond",
      "Anterior flexion and internal rotation assistance",
      "Horizontal extension and backward arm draw",
    ],
    clinicalIssues_ar: [
      {
        title: "تثبيط العضلة الدالية بسبب الألم أو الجراحة الإبطية",
        desc: "قد تتأثر الألياف السفلية أو يتردد المريض في تفعيلها نتيجة الشد في الندبة الإبطية.",
        isSpecificToBC: true,
      },
      {
        title: "الشد التشنجي التعويضي",
        desc: "إجهاد الألياف العلوية لمحاولة تعويض ضعف الكفة المدورة أو عضلات لوح الكتف.",
      },
    ],
    clinicalIssues_fr: [
      {
        title: "Inhibition réflexe par la cicatrice axillaire",
        desc: "Réticence à activer le deltoïde en raison de la tension cicatricielle.",
        isSpecificToBC: true,
      },
      {
        title: "Surcharge compensatoire",
        desc: "Hyperactivité des fibres supérieures pour pallier le déficit de la coiffe.",
      },
    ],
    clinicalIssues_en: [
      {
        title: "Reflex muscular inhibition post axillary surgery",
        desc: "Hesitancy to fire deltoid due to surgical tightness or axillary nerve sensitivity.",
        isSpecificToBC: true,
      },
      {
        title: "Compensatory overuse spasm",
        desc: "Overactivity of upper fibers compensating for deep rotator cuff insufficiency.",
      },
    ],
    symptoms_ar: [
      "شعور بثقل وإرهاق سريع في قمة الكتف عند رفع الذراع",
      "صعوبة في رفع الذراع للجانب لوضع الأغراض على رفوف متوسطة",
      "ألم في الوجه الخارجي للكتف عند لمس العضلة",
    ],
    symptoms_fr: [
      "Fatigabilité rapide du galbe de l'épaule en élévation",
      "Difficulté à poser un objet sur une étagère à hauteur moyenne",
      "Sensibilité musculaire à la palpation latérale",
    ],
    symptoms_en: [
      "Quick fatigue and heavy sensation at top of shoulder when lifting",
      "Difficulty placing items on mid-height shelves",
      "Muscle soreness on lateral shoulder contour",
    ],
    romFactors_ar: [
      "حماية الجرح الإبطي والصدر",
      "تليف العضلات المجاورة بعد العلاج الإشعاعي",
      "قلة تدريب الحركة المتدرجة",
    ],
    romFactors_fr: [
      "Protection de la cicatrice axillaire et thoracique",
      "Fibrose radique des tissus avoisinants",
      "Progression d'exercices discontinue",
    ],
    romFactors_en: [
      "Guarding of axillary and chest wound",
      "Radiation-related tissue stiffness nearby",
      "Lack of structured gradual mobility progression",
    ],
    exerciseBenefits_ar: [
      "إعادة تفعيل القوة الرافعة للذراع دون ألم",
      "تحسين المظهر الطبيعي لقمة الكتف وتناسق القوام",
      "دعم الأنشطة اليومية كارتداء الملابس وحمل الأشياء الخفيفة",
    ],
    exerciseBenefits_fr: [
      "Réactivation de la force d'élévation sans douleur",
      "Restauration du galbe naturel de l'épaule",
      "Facilitation des gestes d'habillage",
    ],
    exerciseBenefits_en: [
      "Safely restores elevation power without pain",
      "Restores natural shoulder contour and posture symmetry",
      "Eases daily dressing and light lifting tasks",
    ],
    recommendedExerciseKeys: ["arm_side", "arm_raise", "shoulder_flex"],
    careTips_ar: [
      "ابدئي برفع الذراع بمدى صغير (حتى مستوى الصدر) ثم زيدي تدريجياً مع الراحة",
      "تنفسي بانتظام واسترخي أثناء أداء التمرين وتجنبي شد الرقبة",
      "دلكي العضلة بلطف بحركات دائرية خفيفة بعد التمرين",
    ],
    careTips_fr: [
      "Commencez par de petites amplitudes (hauteur poitrine) avant d'augmenter",
      "Respirez calmement sans contracter le cou",
      "Massez doucement en cercles après la séance",
    ],
    careTips_en: [
      "Start with small elevation arcs up to chest height before progressing",
      "Breathe rhythmically while moving without tensing the neck",
      "Gently massage the muscle with light circular motions post-workout",
    ],
    doctorAlerts_ar: [
      "فقدان تام للقدرة على رفع الذراع للجانب (فوق 15 درجة)",
      "خدر مستمر في البقعة الجلدية فوق العضلة الدالية (منطقة العصب الإبطي)",
      "ألم حاد مفاجئ في منشأ العضلة على الترقوة",
    ],
    doctorAlerts_fr: [
      "Incapacité totale d'abduction au-delà de 15°",
      "Anesthésie en écusson sur le moignon de l'épaule (nerf axillaire)",
      "Douleur aiguë à l'insertion claviculaire",
    ],
    doctorAlerts_en: [
      "Complete inability to initiate lateral abduction beyond 15°",
      "Persistent numbness over deltoid patch (axillary nerve territory)",
      "Acute sharp pain at clavicular attachment",
    ],
    references: [
      {
        source: "ACS Rehabilitation Guidelines",
        guideline: "Active Assisted Upper Extremity Exercises",
      },
      { source: "NCCN", guideline: "Survivorship Functional Restoration" },
    ],
  },

  {
    id: "scapula",
    name_ar: "لوح الكتف (Scapula)",
    name_fr: "Scapula (Omoplate)",
    name_dz: "لوح الكتف (اللوح الخلفي)",
    name_en: "Scapula (Shoulder Blade)",
    category: "shoulder",
    topPercent: 26,
    leftPercent: 43,
    backTopPercent: 26,
    backLeftPercent: 58,
    definition_ar:
      "عظم مسطح مثلث يقع أعلى الظهر، يشكل القاعدة المتحركة الحيوية لحركة الذراع ويرتبط بالقفص الصدري عبر عضلات داعمة دقيقة.",
    definition_fr:
      "Os plat triangulaire dorsal constituant la base mobile fondamentale du bras, glissant sur le gril costal.",
    definition_en:
      "Flat triangular bone on the upper back serving as the foundational mobile platform for all upper extremity movement.",
    connectedStructures_ar: [
      "المفصل الكتفي الصدري (Scapulothoracic sliding plane)",
      "العضلة المنشارية الأمامية (Serratus anterior)",
      "العضلات المعينية (Rhomboids major & minor)",
      "العضلة شبه المنحرفة (Trapezius)",
      "العصب الصدري الطويل (Long thoracic nerve)",
    ],
    connectedStructures_fr: [
      "Plan de glissement scapulo-thoracique",
      "Dentelé antérieur (Serratus anterior)",
      "Rhomboïdes et trapèze",
      "Nerf thoracique long (de Charles Bell)",
    ],
    connectedStructures_en: [
      "Scapulothoracic pseudo-joint sliding plane",
      "Serratus anterior muscle",
      "Rhomboids and trapezius",
      "Long thoracic nerve of Bell",
    ],
    motorFunctions_ar: [
      "الدوران للأعلى أثناء رفع الذراع بنسبة 1:2 (الإيقاع الكتفي العضدي Scapulohumeral rhythm)",
      "ضم لوحي الكتف للخلف لفتح الصدر (Retraction)",
      "تثبيت قاعدة الذراع لحمل الأشياء ودفعها بأمان",
    ],
    motorFunctions_fr: [
      "Sonnette externe lors de l'élévation du bras (rythme scapulo-huméral 1:2)",
      "Rétraction des omoplates ouvrant la cage thoracique",
      "Point fixe stable pour la poussée et le portage",
    ],
    motorFunctions_en: [
      "Upward rotation coordinating with humeral elevation (1:2 ratio)",
      "Retraction drawing shoulder blades together",
      "Stable foundation enabling safe pushing and lifting",
    ],
    clinicalIssues_ar: [
      {
        title: "بروز لوح الكتف أو اضطراب حركته (Scapular Winging / Dyskinesis)",
        desc: "قد يبرز لوح الكتف كالجانح أو يتحرك بصورة غير متناسقة بعد جراحة الإبط وتفريغ العقد اللمفاوية بسبب تأثر العصب الصدري الطويل أو ضعف المنشارية.",
        isSpecificToBC: true,
      },
      {
        title: "التصاق لوح الكتف بالقفص الصدري",
        desc: "تليف الأنسجة الرخوة بعد الجراحة والإشعاع يمنع انزلاق اللوح بحرية على الظهر.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_fr: [
      {
        title: "Décollement de l'omoplate (Scapula alata / Dyskynésie)",
        desc: "Instabilité ou décollement lié à la fragilisation du nerf thoracique long lors du curage axillaire.",
        isSpecificToBC: true,
      },
      {
        title: "Adhérence scapulo-thoracique",
        desc: "Perte de glissement dorsal par fibrose post-radique.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_en: [
      {
        title: "Scapular Winging & Dyskinesis",
        desc: "Medial border prominence or abnormal kinematics following axillary dissection or long thoracic nerve neuropraxia.",
        isSpecificToBC: true,
      },
      {
        title: "Scapulothoracic adhesions",
        desc: "Reduced sliding motion on ribs due to post-surgical fibrosis and radiation therapy.",
        isSpecificToBC: true,
      },
    ],
    symptoms_ar: [
      "بروز حافة لوح الكتف للخارج عند دفع الجدار باليدين",
      "إرهاق وألم كليل بين لوح الكتف والعمود الفقري",
      "صعوبة رفع الذراع فوق 90 درجة مع شعور بأن الكتف 'يهوي'",
    ],
    symptoms_fr: [
      "Bord de l'omoplate qui ressort en poussant contre un mur",
      "Douleur sourde entre l'omoplate et la colonne",
      "Blocage de l'élévation au-delà de 90°",
    ],
    symptoms_en: [
      "Medial border winging out when pushing against a wall",
      "Dull fatigue ache between shoulder blade and spine",
      "Elevation hitching or blockage past 90°",
    ],
    romFactors_ar: [
      "جراحة الإبط وحماية العصب الصدري الطويل",
      "انكماش عضلات الصدر التي تجذب اللوح للأمام والأسفل",
      "وضعية الانحناء الدفاعية للأمام",
    ],
    romFactors_fr: [
      "Chirurgie axillaire et sensibilité nerveuse",
      "Rétraction du petit pectoral basculant la scapula",
      "Enroulement antérieur des épaules",
    ],
    romFactors_en: [
      "Axillary surgical exploration and nerve recovery",
      "Pectoralis minor contracture tilting scapula anteriorly",
      "Protective forward slumped posture",
    ],
    exerciseBenefits_ar: [
      "استعادة التنسيق الحركي الطبيعي بين لوح الكتف والذراع",
      "إعادة استقرار لوح الكتف على القفص الصدري ومنع بروزه",
      "فتح القفص الصدري وتحسين كفاءة التنفس العميق واستقامة الظهر",
    ],
    exerciseBenefits_fr: [
      "Restauration du rythme scapulo-thoracique harmonieux",
      "Plaquage et stabilisation de la scapula contre les côtes",
      "Ouverture thoracique et optimisation du souffle",
    ],
    exerciseBenefits_en: [
      "Re-establishes coordinated scapulohumeral rhythm",
      "Stabilizes scapula flat against ribcage preventing winging",
      "Expands thoracic cavity and supports posture alignment",
    ],
    recommendedExerciseKeys: [
      "scapular_retraction",
      "shoulder_circle",
      "chest_open",
      "shoulder_flex",
    ],
    careTips_ar: [
      "مارسي تمرين تقريب لوحي الكتف للخلف بلطف لثلاث ثوانٍ مع التنفس",
      "انتبهي لوضعية ظهرك عند الجلوس أمام الشاشات أو عند القراءة",
      "تجنبي حمل حقائب الظهر الثقيلة على جهة واحدة",
    ],
    careTips_fr: [
      "Resserrez doucement les omoplates 3 secondes en soufflant",
      "Surveillez votre maintien assis sans laisser les épaules s'enrouler",
      "Évitez les sacs lourds sur une seule épaule",
    ],
    careTips_en: [
      "Perform gentle scapular retractions holding 3 seconds while breathing out",
      "Mind your posture while sitting at desks to avoid rounding shoulders forward",
      "Avoid asymmetric single-strap heavy bags",
    ],
    doctorAlerts_ar: [
      "بروز حاد مفاجئ للوح الكتف بالكامل مع سقوط الكتف للأسفل",
      "صعوبة في التنفس مصاحبة لألم حاد خلف لوح الكتف",
      "ضعف متزايد يعوق القدرة على رفع اليد حتى مستوى الفم",
    ],
    doctorAlerts_fr: [
      "Décollement brutal et complet de l'omoplate avec affaissement",
      "Gêne respiratoire associée à une douleur thoracique postérieure vive",
      "Faiblesse empêchant d'amener la main à la bouche",
    ],
    doctorAlerts_en: [
      "Sudden marked whole-scapula winging with shoulder dropping",
      "Shortness of breath accompanied by acute posterior chest wall pain",
      "Progressive weakness preventing bringing hand to mouth",
    ],
    references: [
      {
        source: "British Journal of Sports Medicine (BJSM)",
        guideline: "Scapular Dyskinesis Assessment in Breast Cancer",
      },
      {
        source: "Haute Autorité de Santé (HAS)",
        guideline: "Kinésithérapie de la scapula post-mastectomie",
      },
    ],
  },

  {
    id: "axilla",
    name_ar: "المنطقة الإبطية والمسار اللمفاوي (Axillary Area)",
    name_fr: "Creux axillaire et drainage lymphatique",
    name_dz: "منطقة تحت الإبط والغدد اللمفاوية",
    name_en: "Axillary & Lymphatic Drainage Region",
    category: "shoulder",
    topPercent: 29,
    leftPercent: 35,
    definition_ar:
      "المنطقة الهرمية الفاصلة بين الجانب العلوي للصدر وأعلى الذراع، تضم العقد والأوعية اللمفاوية الرئيسية المسؤولة عن تصريف سوائل الطرف العلوي والصدر.",
    definition_fr:
      "Espace pyramidal de transition entre le thorax et le bras, contenant les ganglions et troncs lymphatiques majeurs.",
    definition_en:
      "Pyramidal anatomic crossroads between lateral thorax and upper arm housing vital lymphatic trunks and nodes.",
    connectedStructures_ar: [
      "العقد اللمفاوية الإبطية (المستويات I, II, III)",
      "الوريد والشريان الإبطي (Axillary vessels)",
      "الحزمة العصبية العضدية (Brachial plexus)",
      "الأنسجة الدهنية واللفافة الإبطية",
    ],
    connectedStructures_fr: [
      "Ganglions lymphatiques axillaires (niveaux I, II, III)",
      "Veine et artère axillaires",
      "Plexus brachial",
      "Tissu cellulo-adipeux et fascia axillaire",
    ],
    connectedStructures_en: [
      "Axillary lymph node basins (Levels I, II, III)",
      "Axillary vein and artery",
      "Brachial plexus branches",
      "Axillary fat pad and fascia",
    ],
    motorFunctions_ar: [
      "السماح بالتمدد الحر والمرن للذراع أثناء الرفع والفتح الجانبي",
      "توفير مسار آمن للأوعية والأعصاب أثناء حركة الطرف العلوي",
      "التصريف اللمفاوي الطبيعي المتوازن",
    ],
    motorFunctions_fr: [
      "Mobilité d'extension souple lors de l'abduction",
      "Passage sécurisé vasculo-nerveux",
      "Drainage lymphatique physiologique",
    ],
    motorFunctions_en: [
      "Enables flexible arm abduction and overhead reach without restriction",
      "Safe protected conduit for neurovascular structures during limb movement",
      "Physiological lymphatic drainage transit",
    ],
    clinicalIssues_ar: [
      {
        title: "الوذمة اللمفية (Lymphedema)",
        desc: "تراكم السوائل الغنية بالبروتين في الذراع بعد إزالة العقد اللمفاوية أو تشعيع الإبط. تنبيه طبي: التمارين لا تقي من الوذمة ولا تعالجها بمفردها، بل تحافظ على المرونة ويجب استشارة الطبيب عند أي تورم.",
        isSpecificToBC: true,
      },
      {
        title: "متلازمة الحبل الإبطي (Axillary Web Syndrome / Cording)",
        desc: "ظهور حبال ليفية مشدودة تحت جلد الإبط تعيق مد الذراع وتسبب شداً مؤلماً.",
        isSpecificToBC: true,
      },
      {
        title: "الشد والتندب في الندبة الجراحية الإبطية",
        desc: "انكماش جلد الإبط مما يحد من رفع الذراع لأكثر من 60-90 درجة في الأسابيع الأولى.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_fr: [
      {
        title: "Lymphœdème post-curage axillaire",
        desc: "Accumulation de liquide lymphatique. Note: Les exercices n'empêchent ni ne guérissent le lymphœdème, ils favorisent la mobilité.",
        isSpecificToBC: true,
      },
      {
        title: "Syndrome de la corde axillaire (Cording)",
        desc: "Thrombose lymphatique superficielle créant des cordons sous-cutanés rétractiles.",
        isSpecificToBC: true,
      },
      {
        title: "Fibrose cicatricielle axillaire",
        desc: "Adhérence cutanée limitant l'abduction.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_en: [
      {
        title: "Secondary Lymphedema",
        desc: "Protein-rich interstitial fluid accumulation post lymph node dissection or radiation. Note: Exercises do not prevent or cure lymphedema; physician consult is mandatory.",
        isSpecificToBC: true,
      },
      {
        title: "Axillary Web Syndrome (Cording)",
        desc: "Visible or palpable tight cords of hardened lymphatic vessels restricting abduction.",
        isSpecificToBC: true,
      },
      {
        title: "Axillary surgical scarring and contracture",
        desc: "Skin retraction and tightness restricting comfortable arm elevation.",
        isSpecificToBC: true,
      },
    ],
    symptoms_ar: [
      "شعور بثقل أو امتلاء مستمر في الإبط والذراع",
      "رؤية أو جس حبل مشدود تحت الجلد عند رفع الذراع جانباً",
      "تغير في ملمس الجلد ليصبح مشدوداً أو لامعاً",
      "تنميل أو خدر في الجزء الداخلي من أعلى الذراع (العصب الوربي العضدي)",
    ],
    symptoms_fr: [
      "Sensation de lourdeur ou de plénitude dans le creux axillaire",
      "Cordon fibreux visible ou palpable sous la peau",
      "Peau tendue ou brillante",
      "Hypoesthésie de la face interne du bras (nerf intercosto-brachial)",
    ],
    symptoms_en: [
      "Persistent feeling of fullness or heaviness in armpit and arm",
      "Taut guitar string cord felt under skin when lifting arm sideways",
      "Tense or shiny skin texture",
      "Numbness along upper inner arm (intercostobrachial nerve sensitivity)",
    ],
    romFactors_ar: [
      "عدد العقد اللمفاوية المستأصلة (خزعة العقدة الحارسة مقابل التفريغ الكامل)",
      "تلقي علاج إشعاعي للمحطة الإبطية أو فوق الترقوة",
      "الوزن ومؤشر كتلة الجسم (BMI)",
    ],
    romFactors_fr: [
      "Type de chirurgie (ganglion sentinelle vs curage complet)",
      "Irradiation ganglionnaire sus-claviculaire et axillaire",
      "Indice de masse corporelle (IMC)",
    ],
    romFactors_en: [
      "Extent of surgery (sentinel lymph node biopsy vs full axillary dissection)",
      "Radiation therapy to axillary and supraclavicular beds",
      "Body mass index and tissue volume",
    ],
    exerciseBenefits_ar: [
      "تليين الأنسجة الإبطية بلطف واستعادة مرونة الجلد",
      "تحسين مدى رفع الذراع تدريجياً دون شد عنيف على الندبة",
      "المساعدة في استرخاء عضلات الكتف وتخفيف الاحتقان الموضعي",
    ],
    exerciseBenefits_fr: [
      "Assouplissement doux des tissus axillaires et de la cicatrice",
      "Gain progressif d'élévation sans traction violente",
      "Détente musculaire et réduction de la sensation d'engorgement",
    ],
    exerciseBenefits_en: [
      "Gently mobilizes axillary tissues and promotes skin pliability",
      "Gradual overhead range recovery without tearing or scarring stress",
      "Eases regional tension and postural guarding",
    ],
    recommendedExerciseKeys: ["arm_side", "arm_raise", "breathing", "post_surgery"],
    careTips_ar: [
      "تجنبي إزالة الشعر من الإبط بالشفرات الحادة (استخدمي ماكينة كهربائية لتفادي الجروح)",
      "استخدمي مزيل عرق لطيف غير معطر وخالٍ من الكحول بعد التئام الجرح",
      "تجنبي الحقن أو سحب الدم أو قياس الضغط في الذراع المتأثرة دون إشراف طبي",
    ],
    careTips_fr: [
      "Évitez le rasoir mécanique sous l'aisselle (préférez le rasoir électrique)",
      "Utilisez un déodorant doux sans alcool après cicatrisation",
      "Évitez piqûres, vaccins et prises de sang du côté opéré selon recommandation médicale",
    ],
    careTips_en: [
      "Avoid sharp razor blade shaving in axilla (use electric shaver to prevent cuts and infection)",
      "Use gentle alcohol-free, fragrance-free deodorant after wound has fully healed",
      "Avoid blood draws, injections, or blood pressure cuffs on affected limb per medical protocol",
    ],
    doctorAlerts_ar: [
      "أي تورم جديد أو ملحوظ في الذراع أو الإبط أو جدار الصدر",
      "احمرار موضعي مصحوب بسخونة أو قشعريرة وحمى (طوارئ طبية: التهاب خلوي)",
      "خروج أي إفرازات أو فتح في الشق الجراحي الإبطي",
    ],
    doctorAlerts_fr: [
      "Tout gonflement nouveau ou rapide du bras, de l'aisselle ou du thorax",
      "Rougeur avec chaleur, frissons ou fièvre (urgence: érysipèle)",
      "Écoulement ou désunion de la cicatrice axillaire",
    ],
    doctorAlerts_en: [
      "Any new or increasing swelling in arm, axilla, or breast/chest wall",
      "Redness accompanied by warmth, chills, or fever (medical emergency: cellulitis)",
      "Fluid drainage, weeping, or dehiscence along axillary surgical scar",
    ],
    references: [
      {
        source: "International Society of Lymphology (ISL)",
        guideline: "Consensus Document on Diagnosis and Treatment of Lymphedema",
      },
      {
        source: "American Cancer Society (ACS)",
        guideline: "Lymphedema: What Every Woman with Breast Cancer Needs to Know",
      },
      {
        source: "NCCN Survivorship Guidelines",
        guideline: "Axillary Web Syndrome Diagnosis and Care",
      },
    ],
  },

  // =================== CORE & ADDITIONAL REGIONS ===================
  {
    id: "neck",
    name_ar: "الرقبة والعمود الفقري العنقي (Neck & Cervical Spine)",
    name_fr: "Cou et rachis cervical",
    name_dz: "الرقبة وأعلى الظهر",
    name_en: "Neck & Cervical Spine",
    category: "core",
    topPercent: 19,
    leftPercent: 50,
    definition_ar:
      "الوصلة الحيوية بين الرأس والجذع، تحتوي على الفقرات العنقية السبع وجذور الضفيرة العضدية العصبية التي تغذي الطرف العلوي بأكمله.",
    definition_fr:
      "Charnière entre la tête et le tronc, abritant le rachis cervical et l'origine du plexus brachial.",
    definition_en:
      "Vital junction between head and torso containing 7 cervical vertebrae and brachial plexus nerve roots feeding the upper extremity.",
    connectedStructures_ar: [
      "الفقرات العنقية (C1 - C7)",
      "الضفيرة العصبية العضدية (Brachial plexus roots C5-T1)",
      "العضلة القترائية (Sternocleidomastoid)",
      "العضلات الأخمصية (Scalene muscles)",
    ],
    connectedStructures_fr: [
      "Vertèbres cervicales C1-C7",
      "Plexus brachial (racines C5-T1)",
      "Sténo-cléido-mastoïdien",
      "Muscles scalènes",
    ],
    connectedStructures_en: [
      "Cervical vertebrae C1-C7",
      "Brachial plexus roots C5-T1",
      "Sternocleidomastoid muscle",
      "Scalene muscles",
    ],
    motorFunctions_ar: [
      "ثني ومد الرقبة (النظر للأعلى والأسفل)",
      "تدوير الرأس لليمين واليسار",
      "الميلان الجانبي للأذن نحو الكتف",
    ],
    motorFunctions_fr: [
      "Flexion et extension du cou",
      "Rotation de la tête à droite et à gauche",
      "Inclinaison latérale oreille-épaule",
    ],
    motorFunctions_en: [
      "Neck flexion and extension (looking up and down)",
      "Head rotation right and left",
      "Lateral head tilting toward shoulders",
    ],
    clinicalIssues_ar: [
      {
        title: "التشنج العضلي التوتري التعويضي",
        desc: "رفع الكتف المتأثر باستمرار لتفادي الألم يسبب شداً مؤلماً في عضلات الرقبة وصداعاً توترياً.",
        isSpecificToBC: true,
      },
      {
        title: "تهيج جذور الضفيرة العضدية",
        desc: "قد يسبب وخزاً يمتد من الرقبة عبر الكتف نحو الذراع.",
      },
    ],
    clinicalIssues_fr: [
      {
        title: "Contracture musculaire compensatoire",
        desc: "Élévation réflexe de l'épaule entraînant des céphalées de tension et cervicalgies.",
        isSpecificToBC: true,
      },
      {
        title: "Irritation radiculaire du plexus brachial",
        desc: "Irradiation douloureuse vers le bras.",
      },
    ],
    clinicalIssues_en: [
      {
        title: "Compensatory tension spasm",
        desc: "Continuous shoulder hitching to protect surgical site causes cervical spasm and tension headaches.",
        isSpecificToBC: true,
      },
      {
        title: "Brachial plexus traction sensitivity",
        desc: "Tingling radiating from lateral neck through shoulder down the arm.",
      },
    ],
    symptoms_ar: [
      "صعوبة الالتفات بالرأس للخلف أثناء القيادة",
      "صداع يبدأ من قاعدة الجمجمة خلف الرأس",
      "ألم وتشنج في عضلات جانب الرقبة",
    ],
    symptoms_fr: [
      "Difficulté à tourner la tête en conduisant",
      "Céphalées partant de la base du crâne",
      "Tension douloureuse latéro-cervicale",
    ],
    symptoms_en: [
      "Stiffness checking blind spots while driving",
      "Headaches originating from base of skull",
      "Aching tension along lateral neck muscles",
    ],
    romFactors_ar: [
      "التوتر والقلق بعد تشخيص وجراحة السرطان",
      "وضعية النوم الخاطئة على وسائد عالية جداً",
      "إهمال استرخاء الكتفين",
    ],
    romFactors_fr: [
      "Stress et anxiété péri-opératoires",
      "Mauvais oreillers trop épais",
      "Haussage d'épaule inconscient",
    ],
    romFactors_en: [
      "Psychological stress and guarding tension",
      "Improper pillow height and sleeping posture",
      "Unconscious shoulder shrugging",
    ],
    exerciseBenefits_ar: [
      "إرخاء عضلات الرقبة المتشنجة والتخلص من الصداع التوتري",
      "تسهيل حركة الكتف عبر فك الارتباط التشنجي بينهما",
      "تعزيز تدفق الدم وتحسين الهدوء النفسي",
    ],
    exerciseBenefits_fr: [
      "Relâchement des tensions cervicales et des céphalées",
      "Libération de la mobilité de l'épaule",
      "Amélioration de la détente générale",
    ],
    exerciseBenefits_en: [
      "Relieves cervical muscle spasm and associated headaches",
      "Frees shoulder girdle mechanics from compensatory stiffness",
      "Promotes parasympathetic relaxation and calm breathing",
    ],
    recommendedExerciseKeys: ["shoulder_circle", "breathing", "shoulder_flex"],
    careTips_ar: [
      "قومي بتمارين إمالة الرأس بلطف مع الزفير الهادئ",
      "استخدمي وسادة طبية بارتفاع مريح يحافظ على استقامة العمود الفقري",
      "تجنبي النظر المطول للأسفل إلى الهاتف",
    ],
    careTips_fr: [
      "Inclinez doucement la tête sur le côté en expirant",
      "Utilisez un oreiller ergonomique respectant l'axe cervical",
      "Limitez la tête baissée prolongée sur les écrans",
    ],
    careTips_en: [
      "Gently tilt head ear-to-shoulder on calm exhalations",
      "Use an ergonomic pillow maintaining neutral cervical spine alignment",
      "Avoid prolonged downward head posture when reading or using phones",
    ],
    doctorAlerts_ar: [
      "ألم حاد مفاجئ كالبرق يمتد من الرقبة إلى أطراف الأصابع",
      "دوخة شديدة أو فقدان توازن عند تحريك الرأس",
      "تيبس تام في الرقبة مصحوب بارتفاع في درجة الحرارة",
    ],
    doctorAlerts_fr: [
      "Douleur en éclair fulgurant de la nuque vers les doigts",
      "Vertiges ou perte d'équilibre lors des rotations de tête",
      "Raideur méningée avec fièvre",
    ],
    doctorAlerts_en: [
      "Electric shock-like pain shooting from neck down to fingers",
      "Severe dizziness or loss of balance on head turns",
      "Rigid neck stiffness accompanied by high fever",
    ],
    references: [
      {
        source: "Cervical Spine Research Society (CSRS)",
        guideline: "Postural Rehabilitation in Upper Quadrant Disorders",
      },
      { source: "Mayo Clinic", guideline: "Neck Tension and Post-Surgical Recovery" },
    ],
  },

  {
    id: "chest",
    name_ar: "عضلات الصدر والقفص الصدري (Chest & Pectorals)",
    name_fr: "Poitrine et muscles pectoraux",
    name_dz: "منطقة الصدر والقفص الصدري",
    name_en: "Chest & Pectoral Musculature",
    category: "core",
    topPercent: 33,
    leftPercent: 50,
    definition_ar:
      "تضم العضلة الصدرية الكبيرة والصغيرة والأنسجة المحيطة بالقفص الصدري، وهي المنطقة الأكثر تأثراً بجراحات الثدي (الاستئصال الجزئي أو الكلي، أو إعادة البناء).",
    definition_fr:
      "Comprend les muscles grand et petit pectoraux ainsi que la paroi thoracique antérieure, siège principal de la chirurgie mammaire.",
    definition_en:
      "Encompasses pectoralis major and minor muscles and anterior thoracic wall, the primary site of breast cancer surgery and reconstruction.",
    connectedStructures_ar: [
      "العضلة الصدرية الكبيرة (Pectoralis major)",
      "العضلة الصدرية الصغيرة (Pectoralis minor)",
      "القفص الصدري والغضاريف الوربية (Costal cartilages)",
      "عظم القص (Sternum) والترقوة",
      "أعصاب الصدر الإنسية والوحشية (Pectoral nerves)",
    ],
    connectedStructures_fr: [
      "Grand pectoral et petit pectoral",
      "Gril costal et cartilages intercostaux",
      "Sternum et clavicule",
      "Nerfs pectoraux médial et latéral",
    ],
    connectedStructures_en: [
      "Pectoralis major muscle",
      "Pectoralis minor muscle",
      "Ribcage and intercostal spaces",
      "Sternum and clavicle",
      "Medial and lateral pectoral nerves",
    ],
    motorFunctions_ar: [
      "تقريب الذراعين أمام الصدر (Adduction)",
      "الدوران الداخلي للذراع",
      "دعم حركات التنفس العميق وتمدد القفص الصدري",
    ],
    motorFunctions_fr: [
      "Adduction des bras devant le thorax",
      "Rotation interne du bras",
      "Ampliation thoracique lors de l'inspiration profonde",
    ],
    motorFunctions_en: [
      "Horizontal arm adduction (hugging motion)",
      "Internal shoulder rotation",
      "Assists in ribcage expansion during deep inspiration",
    ],
    clinicalIssues_ar: [
      {
        title: "انكماش وتليف عضلات الصدر بعد الجراحة أو الإشعاع",
        desc: "قصر العضلة الصدرية الصغيرة يسحب لوح الكتف للأمام ويمنع فرد الظهر أو رفع الذراع بالكامل.",
        isSpecificToBC: true,
      },
      {
        title: "متلازمة ما بعد استئصال الثدي (PMPS - Post-Mastectomy Pain Syndrome)",
        desc: "ألم عصبي حارق أو إحساس بالشد والضغط حول جدار الصدر والندبة.",
        isSpecificToBC: true,
      },
      {
        title: "تغيرات ما بعد إعادة البناء (Reconstruction tightness)",
        desc: "شد متزايد عند وضع حشوات السيليكون تحت العضلة الصدرية (Subpectoral implants).",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_fr: [
      {
        title: "Rétraction pectorale et fibrose cicatricielle",
        desc: "Raccourcissement du petit pectoral basculant l'épaule en avant.",
        isSpecificToBC: true,
      },
      {
        title: "Syndrome douloureux post-mastectomie (PMPS)",
        desc: "Douleurs neuropathiques, sensation d'étau thoracique ou brûlures.",
        isSpecificToBC: true,
      },
      {
        title: "Tensions post-reconstruction mammaire",
        desc: "Spasmes sous-pectoraux post-implants.",
        isSpecificToBC: true,
      },
    ],
    clinicalIssues_en: [
      {
        title: "Pectoral tightness and radiation fibrosis",
        desc: "Pectoralis minor contracture tipping scapula forward and restricting full reach.",
        isSpecificToBC: true,
      },
      {
        title: "Post-Mastectomy Pain Syndrome (PMPS)",
        desc: "Neuropathic burning, tightness, or vise-like constrictive sensation around chest wall.",
        isSpecificToBC: true,
      },
      {
        title: "Post-Reconstruction muscle tightness",
        desc: "Tightness following subpectoral implant or tissue expander placement.",
        isSpecificToBC: true,
      },
    ],
    symptoms_ar: [
      "شعور بحزام ضاغط أو درع صلب حول القفص الصدري",
      "صعوبة في أخذ نفس عميق كامل ومريح",
      "انحناء الكتفين للأمام وتحدب أعلى الظهر",
    ],
    symptoms_fr: [
      "Sensation de cuirasse ou d'étau autour du thorax",
      "Difficulté à prendre une inspiration ample et profonde",
      "Enroulement des épaules vers l'avant",
    ],
    symptoms_en: [
      "Sensation of a tight band or heavy armor across chest",
      "Difficulty taking a comfortable deep breath",
      "Rounded shoulders and hunched upper back posture",
    ],
    romFactors_ar: [
      "نوع وحجم العملية (جراحة تحفظية مقابل استئصال كلي مع أو بدون إعادة بناء)",
      "جرعات العلاج الإشعاعي الموجهة لجدار الصدر",
      "التئام الندبة الجراحية وحركيتها",
    ],
    romFactors_fr: [
      "Type de chirurgie (tumorectomie, mastectomie, reconstruction)",
      "Radiothérapie de la paroi thoracique",
      "Élasticité et adhérences de la cicatrice",
    ],
    romFactors_en: [
      "Surgical approach (lumpectomy vs mastectomy vs reconstruction)",
      "Chest wall radiation dosage and fields",
      "Scar healing compliance and mobility",
    ],
    exerciseBenefits_ar: [
      "استعادة مرونة جدار الصدر والقدرة على فرد الظهر باستقامة تامة",
      "تحسين كفاءة التنفس العميق وتخفيف التوتر والقلق",
      "تقليل الشد على الندبة ومساعدة الأنسجة على التجدد المرن",
    ],
    exerciseBenefits_fr: [
      "Restauration de la souplesse pariétale et de l'alignement dorsal",
      "Amélioration de l'amplitude respiratoire et baisse du stress",
      "Assouplissement doux de la cicatrice",
    ],
    exerciseBenefits_en: [
      "Restores anterior chest wall flexibility and upright spinal alignment",
      "Facilitates diaphragmatic deep breathing and eases stress",
      "Promotes gentle scar tissue remodelling",
    ],
    recommendedExerciseKeys: ["chest_open", "breathing", "scapular_retraction", "shoulder_circle"],
    careTips_ar: [
      "مارسي تمرين فتح الصدر بلطف شديد مع الشهيق الهادئ ودون التسبب بألم في الندبة",
      "دلكي الندبة الجراحية برفق بعد التئامها التام بموافقة طبيبك (Scar massage)",
      "تجنبي التمارين التي تضغط بقوة على عضلات الصدر في الأشهر الأولى",
    ],
    careTips_fr: [
      "Ouvrez doucement la poitrine à l'inspiration sans forcer sur la cicatrice",
      "Massez délicatement la cicatrice fermée avec l'accord de votre chirurgien",
      "Évitez les exercices de renforcement intense des pectoraux au début",
    ],
    careTips_en: [
      "Practice gentle chest-opening stretches synchronized with relaxed inhales",
      "Perform gentle scar mobilization once incisions have completely healed and cleared by doctor",
      "Avoid heavy push-ups or forceful pectoral resistance in early rehabilitation",
    ],
    doctorAlerts_ar: [
      "ألم حاد في الصدر مصحوب بضيق تنفس أو ألم يمتد للفك (طوارئ قلبية/رئوية)",
      "تجمع سوائل متزايد تحت جلد الصدر (ورم مصلي Seroma)",
      "احمرار وتورم ساخن حول الندبة الجراحية أو ثقب بالجلد",
    ],
    doctorAlerts_fr: [
      "Douleur thoracique aiguë avec essoufflement (urgence médicale)",
      "Collection liquide fluctuante (sérome volumineux)",
      "Rougeur, chaleur ou écoulement cicatriciel",
    ],
    doctorAlerts_en: [
      "Acute sharp chest pain with shortness of breath (medical emergency)",
      "Rapidly accumulating fluid pocket under chest skin (large seroma)",
      "Redness, heat, or skin breakdown around surgical incision",
    ],
    references: [
      {
        source: "American Cancer Society (ACS)",
        guideline: "Caring for Your Scars and Restoring Chest Mobility",
      },
      {
        source: "Annals of Surgical Oncology",
        guideline: "Prevention and Management of Post-Mastectomy Pain",
      },
    ],
  },

  {
    id: "upper_back",
    name_ar: "أعلى الظهر والعضلة شبه المنحرفة (Upper Back & Trapezius)",
    name_fr: "Haut du dos et trapèze",
    name_dz: "أعلى الظهر والعضلة المروحية (الترابيز)",
    name_en: "Upper Back & Trapezius",
    category: "core",
    topPercent: 27,
    leftPercent: 50,
    backTopPercent: 27,
    backLeftPercent: 50,
    definition_ar:
      "المنطقة الخلفية المحصورة بين العنق ومنتصف الظهر، تضم العضلة شبه المنحرفة الكبيرة والعضلات المعينية وعضلات العمود الفقري الصدري التي تحافظ على استقامة الجذع.",
    definition_fr:
      "Région postérieure majeure comprenant le trapèze, les rhomboïdes et les spinaux thoraciques, garant de l'équilibre postural.",
    definition_en:
      "Posterior thoracic region featuring the trapezius, rhomboids, and thoracic erector spinae maintaining spinal verticality.",
    connectedStructures_ar: [
      "العضلة شبه المنحرفة بأقسامها الثلاثة (Trapezius upper, middle, lower)",
      "الفقرات الصدرية والأضلاع الظهرية",
      "العضلات المعينية (Rhomboids)",
      "العصب الإضافي الشوكي (Spinal accessory nerve)",
    ],
    connectedStructures_fr: [
      "Muscle trapèze (supérieur, moyen, inférieur)",
      "Vertèbres thoraciques et côtes postérieures",
      "Muscles rhomboïdes",
      "Nerf accessoire (XI)",
    ],
    connectedStructures_en: [
      "Trapezius muscle (upper, middle, lower segments)",
      "Thoracic spine vertebrae and posterior ribs",
      "Rhomboid major and minor",
      "Spinal accessory nerve (CN XI)",
    ],
    motorFunctions_ar: [
      "رفع وتثبيت واستدارة لوح الكتف",
      "فرد واستقامة العمود الفقري والوقاية من التحدب",
      "المساعدة في توزيع أوزان الذراعين على الجذع بالتساوي",
    ],
    motorFunctions_fr: [
      "Élévation, abaissement et stabilisation scapulaire",
      "Maintien de l'érection du rachis thoracique",
      "Répartition équilibrée du poids des membres supérieurs",
    ],
    motorFunctions_en: [
      "Scapular elevation, retraction, and depression",
      "Maintains thoracic spinal upright extension against gravity",
      "Distributes upper limb load evenly across axial skeleton",
    ],
    clinicalIssues_ar: [
      {
        title: "التحدب الوضعي الوقائي (Kyphotic guarding posture)",
        desc: "الميل للانحناء للأمام لإخفاء أو حماية الصدر المصاب يجهد عضلات أعلى الظهر بشدة.",
        isSpecificToBC: true,
      },
      {
        title: "نقاط الزناد العضلية التشنجية (Myofascial Trigger Points)",
        desc: "عقد عضلية مؤلمة في العضلة شبه المنحرفة تسبب ألماً حارقاً خلف الرقبة والكتف.",
      },
    ],
    clinicalIssues_fr: [
      {
        title: "Attitude cyphotique de protection",
        desc: "Enroulement dorsal protecteur provoquant une fatigue musculaire dorsale intense.",
        isSpecificToBC: true,
      },
      {
        title: "Points gâchettes myofasciculaires (Trigger points)",
        desc: "Nodules douloureux dans les fibres du trapèze.",
      },
    ],
    clinicalIssues_en: [
      {
        title: "Protective Kyphotic Postural Sag",
        desc: "Subconscious forward hunching to shield the operative breast creating chronic upper back fatigue.",
        isSpecificToBC: true,
      },
      {
        title: "Myofascial Trigger Points",
        desc: "Hyperirritable taut bands in trapezius producing referred burning pain.",
      },
    ],
    symptoms_ar: [
      "ألم حارق أو إجهاد مستمر بين الكتفين في نهاية اليوم",
      "صعوبة في الوقوف بظهر مفرود ومستقيم دون تعب سريع",
      "عقد عضلية مؤلمة عند الضغط على أعلى الظهر",
    ],
    symptoms_fr: [
      "Douleur de brûlure inter-scapulaire en fin de journée",
      "Difficulté à se tenir droite sans fatigue rapide",
      "Points douloureux sensibles entre les omoplates",
    ],
    symptoms_en: [
      "Burning muscular fatigue between shoulder blades by evening",
      "Struggling to stand tall without rapidly fatiguing",
      "Tender knots when pressing upper back musculature",
    ],
    romFactors_ar: [
      "تغير مركز ثقل الجسم بعد الجراحة",
      "ضعف عضلات الظهر السفلية",
      "ساعات الجلوس الطويلة أثناء فترة النقاهة",
    ],
    romFactors_fr: [
      "Modification du centre de gravité post-opératoire",
      "Faiblesse des fixateurs d'omoplates",
      "Position assise prolongée en convalescence",
    ],
    romFactors_en: [
      "Center of gravity alteration post mastectomy/surgery",
      "Scapular depressor and extensor deconditioning",
      "Prolonged sedentary resting posture during recovery",
    ],
    exerciseBenefits_ar: [
      "استعادة القوام المتوازن والممشوق بثقة وراحة",
      "تخفيف آلام الظهر المزمنة وحرقان ما بين الكتفين",
      "دعم الأداء الحركي للكتفين وتسهيل رفع الذراعين للأعلى",
    ],
    exerciseBenefits_fr: [
      "Redressement harmonieux et confiant de la silhouette",
      "Soulagement des douleurs dorsales de compensation",
      "Optimisation de la mécanique des épaules",
    ],
    exerciseBenefits_en: [
      "Reclaims confident, upright symmetrical posture",
      "Soothes chronic compensatory mid-back burning pain",
      "Provides stable platform for effortless overhead arm reach",
    ],
    recommendedExerciseKeys: ["scapular_retraction", "shoulder_circle", "chest_open"],
    careTips_ar: [
      "ارفعي رأسك وافتحي صدرك للخارج بانتظام أثناء المشي",
      "استخدمي وسادة داعمة لأسفل الظهر عند الجلوس على الأريكة أو المكتب",
      "مارسي تمارين التنفس العميق مع ضم لوحي الكتف للخلف",
    ],
    careTips_fr: [
      "Redressez la tête et ouvrez la poitrine régulièrement en marchant",
      "Placez un soutien lombaire en position assise",
      "Associez inspiration profonde et rétraction des omoplates",
    ],
    careTips_en: [
      "Gently roll shoulders back and lift chest periodically when walking",
      "Use lumbar support cushion when sitting on sofas or work chairs",
      "Coordinate slow diaphragmatic breathing with gentle scapular pinches",
    ],
    doctorAlerts_ar: [
      "ألم مستمر وحاد في عظام العمود الفقري لا يخف بالراحة أو تغيير الوضعية",
      "ألم عصبي حزامي يلتف حول القفص الصدري",
      "ضعف أو تنميل في الساقين (طوارئ عصبية)",
    ],
    doctorAlerts_fr: [
      "Douleur osseuse vertébrale constante ne cédant pas au repos",
      "Douleur en ceinture autour du thorax",
      "Faiblesse ou engourdissement des membres inférieurs (urgence)",
    ],
    doctorAlerts_en: [
      "Constant deep spinal bone pain not relieved by lying down or changing positions",
      "Band-like pain wrapping around the chest wall",
      "Weakness or numbness in lower limbs (neurological red flag)",
    ],
    references: [
      {
        source: "Journal of Cancer Survivorship",
        guideline: "Postural Dysfunction and Myofascial Pain in Breast Cancer",
      },
      {
        source: "American College of Sports Medicine (ACSM)",
        guideline: "Exercise Guidelines for Cancer Survivors",
      },
    ],
  },
];
