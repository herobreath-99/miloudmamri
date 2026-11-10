import type {
  CommunityPost,
  CommunityComment,
  CommunityCategory,
  ReactionType,
  CommunityReport,
  ReportReason,
  BlockedUser,
} from "@/types/community";

const POSTS_KEY = "pc_community_posts_v1";
const REPORTS_KEY = "pc_community_reports_v1";
const BLOCKS_KEY = "pc_community_blocked_users_v1";
const NICKNAME_KEY = "pc_community_user_nickname_v1";

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    authorId: "user-amina",
    authorName: "أمينة ك.",
    authorNickname: "زهرة الأمل 🌸",
    useNickname: true,
    authorAvatar: "",
    category: "treatment",
    title: "تجربتي مع جلسات العلاج وكيف تغلبت على التوتر قبل الدخول",
    content:
      "في أول جلسة علاج كنت أشعر بخوف شديد ودقات قلبي تتسارع. نصحتني ممرضة عطوفة بأخذ نفس عميق والاستماع لصوت ماء وأذكار مريحة في سماعات الأذن. مرت الجلسة بسلام بفضل الله. أحببت أن أشارككن هذه اللحظة لأقول لكل أخت في بداية طريقها: الخوف طبيعي جداً، لكنكِ أقوى منه وستعبرين هذه المحطة بإذن الله.",
    tags: ["علاج", "تجربة_شخصية", "تغلب_على_الخوف"],
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    reactions: { love: 14, hug: 18, strength: 22, hope: 31 },
    commentsCount: 3,
    comments: [
      {
        id: "comm-1",
        postId: "post-1",
        authorId: "user-samia",
        authorName: "سامية م.",
        authorNickname: "شمس الصباح ☀️",
        useNickname: true,
        content: "بارك الله فيكِ أختي الغالية، كلامكِ لمس قلبي في وقت كنت أحتاجه جداً.",
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        likes: 5,
      },
      {
        id: "comm-2",
        postId: "post-1",
        authorId: "user-nadia",
        authorName: "نادية ب.",
        authorNickname: "فراشة التعافي 🦋",
        useNickname: true,
        content: "السماعات والاسترخاء ساعدوني أيضاً كثيراً. شكراً لمشاركتكِ الدافئة 💗",
        createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
        likes: 3,
      },
    ],
    sensitiveContent: false,
    sensitiveConsentGiven: true,
    hasMedicalDisclaimer: true,
    status: "active",
    savedBy: [],
  },
  {
    id: "post-2",
    authorId: "user-leila",
    authorName: "ليلى ح.",
    authorNickname: "أم الصابرين",
    useNickname: true,
    authorAvatar: "",
    category: "emotional",
    title: "أيام الضعف ليست فشلاً، هي مجرد استراحة محارب",
    content:
      "أحياناً نضغط على أنفسنا لنبدو متفائلات وقويات طوال الوقت أمام عائلاتنا وأطفالنا. اليوم شعرت برغبة في البكاء وأعطيت نفسي الإذن بذلك. البكاء ليس هزيمة بل تفريغ لثقل حملناه. تذكري يا صديقتي: لا بأس أن تكوني متعبة اليوم، غداً ستشرق الشمس من جديد وستجدين طاقتكِ.",
    tags: ["دعم_نفسي", "مشاعر", "صدق_مع_النفس"],
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    reactions: { love: 25, hug: 42, strength: 19, hope: 28 },
    commentsCount: 2,
    comments: [
      {
        id: "comm-3",
        postId: "post-2",
        authorId: "user-khadija",
        authorName: "خديجة ع.",
        authorNickname: "قلب نابض 💖",
        useNickname: true,
        content: "حضن دافئ لكِ يا ليلى، كلماتكِ حقيقية وصادقة وتخفف عن الكثير منا.",
        createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
        likes: 7,
      },
    ],
    sensitiveContent: false,
    sensitiveConsentGiven: true,
    hasMedicalDisclaimer: true,
    status: "active",
    savedBy: [],
  },
  {
    id: "post-3",
    authorId: "user-fatima",
    authorName: "فاطمة ز.",
    authorNickname: "فاطمة الورد 🌹",
    useNickname: true,
    authorAvatar: "",
    category: "recovery",
    title: "6 أشهر بعد الجراحة: خطوات العودة التدريجية للحركة",
    content:
      "مرت ستة أشهر على عمليتي، وأردت مشاركة نصيحة أكد عليها طبيبي وأخصائي العلاج الطبيعي: التدرج وعدم الاستعجال هو مفتاح النجاح. كنت أمارس تمارين فتح الذراع والكتف لدقائق قليلة مع التنفس، والآن أستطيع رفع ذراعي بدون أي ألم يذكر. التزمي بتعليمات طبيبكِ فقط ولا تترددي في سؤاله دائماً.",
    tags: ["تعافي", "علاج_طبيعي", "أمل"],
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    reactions: { love: 19, hug: 12, strength: 34, hope: 40 },
    commentsCount: 1,
    comments: [
      {
        id: "comm-4",
        postId: "post-3",
        authorId: "user-meriem",
        authorName: "مريم ت.",
        authorNickname: "طائر النورس 🕊️",
        useNickname: true,
        content: "ما شاء الله! ألف الحمد لله على سلامتك، قصتكِ تمنحنا أملاً كبيراً.",
        createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
        likes: 4,
      },
    ],
    sensitiveContent: false,
    sensitiveConsentGiven: true,
    hasMedicalDisclaimer: true,
    status: "active",
    savedBy: [],
  },
  {
    id: "post-4",
    authorId: "user-sarah",
    authorName: "سارة د.",
    authorNickname: "سارة النقية ✨",
    useNickname: true,
    authorAvatar: "",
    category: "self_care",
    title: "روتين لطيف للعناية بالبشرة الجافة أثناء فترة المتابعة",
    content:
      "لاحظت جفافاً شديداً في بشرتي وشفاهي، بعد استشارة الطبيبة، بدأت باستخدام مرطبات خالية تماماً من العطور والكحول وتناول رشفات ماء كل نصف ساعة. إضافة إلى استخدام زيت اللوز الحلو على اليدين قبل النوم. الفرق كان كبيراً وساعدني على الشعور بالراحة والنعومة.",
    tags: ["عناية_بالنفس", "ترطيب", "راحة"],
    createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    reactions: { love: 16, hug: 11, strength: 14, hope: 22 },
    commentsCount: 0,
    comments: [],
    sensitiveContent: false,
    sensitiveConsentGiven: true,
    hasMedicalDisclaimer: true,
    status: "active",
    savedBy: [],
  },
  {
    id: "post-5",
    authorId: "user-houda",
    authorName: "هدى س.",
    authorNickname: "أخت الجميع 🤍",
    useNickname: true,
    authorAvatar: "",
    category: "qa",
    title: "سؤال للأخوات: كيف تتعاملن مع تنميل أطراف الأصابع في الصباح؟",
    content:
      "السلام عليكم أخواتي، أحياناً أستيقظ ببرودة خفيفة أو تنميل بسيط في أطراف أصابعي. هل هناك تمارين تدليك خفيفة أو طرق ساعدتكم في الشعور بالدفء والراحة؟ شاركوني تجاربكم اليومية البسيطة.",
    tags: ["أسئلة_وأجوبة", "استفسار", "تجارب"],
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    reactions: { love: 11, hug: 15, strength: 9, hope: 16 },
    commentsCount: 2,
    comments: [
      {
        id: "comm-5",
        postId: "post-5",
        authorId: "user-amina",
        authorName: "أمينة ك.",
        authorNickname: "زهرة الأمل 🌸",
        useNickname: true,
        content:
          "أنا أقوم بفتح وقبض كف اليد برفق عدة مرات في ماء فاتر صباحاً، هذا ساعدني كثيراً بعد موافقة طبيبي.",
        createdAt: new Date(Date.now() - 30 * 3600000).toISOString(),
        likes: 6,
      },
    ],
    sensitiveContent: false,
    sensitiveConsentGiven: true,
    hasMedicalDisclaimer: true,
    status: "active",
    savedBy: [],
  },
  {
    id: "post-6",
    authorId: "user-yasmine",
    authorName: "ياسمين ر.",
    authorNickname: "ياسمين الجزائر 🇩🇿",
    useNickname: true,
    authorAvatar: "",
    category: "motivation",
    title: "رسالة الصباح: ابتسمي، أنتِ هنا وهذا بحد ذاته معجزة تستحق الاحتفاء",
    content:
      "كل يوم جديد هو فرصة لنبدأ بروح متجددة. مهما كانت التحديات المحيطة بنا، تذكري كم مرحلة صعبة مررتِ بها وتغلبتِ عليها. كل وردة تتفتح تذكرنا أن الجمال يولد بعد العواصف. دمتنّ قويات وجميلات ودعواتي للجميع بالشفاء التام والسعادة الدائمة.",
    tags: ["تحفيز", "أمل", "طاقة_إيجابية"],
    createdAt: new Date(Date.now() - 60 * 3600000).toISOString(),
    reactions: { love: 48, hug: 36, strength: 52, hope: 67 },
    commentsCount: 1,
    comments: [],
    sensitiveContent: false,
    sensitiveConsentGiven: true,
    hasMedicalDisclaimer: true,
    status: "active",
    savedBy: [],
  },
];

// Helper to get posts
export function getCommunityPosts(): CommunityPost[] {
  if (typeof window === "undefined") return INITIAL_POSTS;
  const raw = localStorage.getItem(POSTS_KEY);
  if (!raw) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(INITIAL_POSTS));
    return INITIAL_POSTS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_POSTS;
  }
}

// Helper to save posts
export function saveCommunityPosts(posts: CommunityPost[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  window.dispatchEvent(new CustomEvent("pinkcare:community-updated"));
}

// Get user blocked list
export function getBlockedUsers(): BlockedUser[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(BLOCKS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function blockUser(blockedUserId: string, blockedUserName: string): void {
  const list = getBlockedUsers();
  if (list.some((b) => b.blockedUserId === blockedUserId)) return;
  const next: BlockedUser[] = [
    ...list,
    {
      id: `block-${Date.now()}`,
      blockedUserId,
      blockedUserName,
      blockedAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem(BLOCKS_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("pinkcare:community-updated"));
}

export function unblockUser(blockedUserId: string): void {
  const list = getBlockedUsers();
  const next = list.filter((b) => b.blockedUserId !== blockedUserId);
  localStorage.setItem(BLOCKS_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("pinkcare:community-updated"));
}

// User Nickname preferences
export function getUserCommunityNickname(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(NICKNAME_KEY) || "أخت داعمة 🌸";
}

export function setUserCommunityNickname(nick: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(NICKNAME_KEY, nick.trim());
}

// Content Scanner for Medical Claims / Unverified Advice
export function scanForUnverifiedMedicalAdvice(text: string): {
  hasWarning: boolean;
  warningMessage?: string;
  flaggedTerms: string[];
} {
  const riskyTerms = [
    { term: "أوقفي الدواء", reason: "تشجيع على إيقاف الدواء الموصوف" },
    { term: "أوقفي الكيماوي", reason: "تشجيع على إيقاف العلاج الكيميائي" },
    { term: "بديل عن الكيماوي", reason: "ترويج لبدائل غير مثبتة" },
    { term: "علاج نهائي للسرطان", reason: "ادعاء علاج نهائي غير طبي" },
    { term: "اشربي جرعة", reason: "تحديد جرعات بدون استشارة طبية" },
    { term: "تناولي هذا الدواء", reason: "وصف دوائي مباشر" },
    { term: "stop chemotherapy", reason: "Advising to stop chemotherapy" },
    { term: "cure cancer completely", reason: "Unverified curative claim" },
    { term: "take this dose", reason: "Recommending unverified dosage" },
    { term: "mg", reason: "Prescribing dosage quantities" },
  ];

  const lower = text.toLowerCase();
  const flagged: string[] = [];

  for (const item of riskyTerms) {
    if (lower.includes(item.term.toLowerCase())) {
      flagged.push(item.term);
    }
  }

  if (flagged.length > 0) {
    return {
      hasWarning: true,
      warningMessage:
        "يحتوي المنشور على مصطلحات قد تُفهم كنصيحة أو وصفة طبية مباشرة. مجتمع PinkCare هو مساحة لتبادل الدعم النفسي والتجارب الإنسانية فقط، ويُمنع منعاً باتاً تقديم نصائح دوائية أو ادعاءات علاجية بدون إشراف طبي.",
      flaggedTerms: flagged,
    };
  }

  return { hasWarning: false, flaggedTerms: [] };
}

// Add a post
export function createCommunityPost(postData: {
  authorId: string;
  authorName: string;
  authorNickname: string;
  useNickname: boolean;
  authorAvatar?: string;
  category: CommunityCategory;
  title: string;
  content: string;
  tags?: string[];
  sensitiveContent?: boolean;
}): CommunityPost {
  const posts = getCommunityPosts();
  const newPost: CommunityPost = {
    id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    authorId: postData.authorId,
    authorName: postData.authorName,
    authorNickname: postData.authorNickname || "أخت داعمة 🌸",
    useNickname: postData.useNickname,
    authorAvatar: postData.authorAvatar || "",
    category: postData.category,
    title: postData.title.trim(),
    content: postData.content.trim(),
    tags: postData.tags || [],
    createdAt: new Date().toISOString(),
    reactions: { love: 0, hug: 0, strength: 0, hope: 0 },
    userReactions: {},
    commentsCount: 0,
    comments: [],
    sensitiveContent: Boolean(postData.sensitiveContent),
    sensitiveConsentGiven: true,
    hasMedicalDisclaimer: true,
    status: "active",
    savedBy: [],
  };

  const next = [newPost, ...posts];
  saveCommunityPosts(next);
  return newPost;
}

// Toggle reaction on a post
export function toggleReaction(
  postId: string,
  userId: string,
  reaction: ReactionType,
): CommunityPost | null {
  const posts = getCommunityPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return null;

  if (!post.reactions) {
    post.reactions = { love: 0, hug: 0, strength: 0, hope: 0 };
  }
  if (!post.userReactions) {
    post.userReactions = {};
  }

  const current = post.userReactions[userId];

  if (current === reaction) {
    // Remove reaction
    delete post.userReactions[userId];
    post.reactions[reaction] = Math.max(0, (post.reactions[reaction] || 1) - 1);
  } else {
    // If had prior reaction, decrement it
    if (current) {
      post.reactions[current] = Math.max(0, (post.reactions[current] || 1) - 1);
    }
    // Set new reaction
    post.userReactions[userId] = reaction;
    post.reactions[reaction] = (post.reactions[reaction] || 0) + 1;
  }

  saveCommunityPosts(posts);
  return post;
}

// Add comment to a post
export function addComment(
  postId: string,
  commentData: {
    authorId: string;
    authorName: string;
    authorNickname: string;
    useNickname: boolean;
    authorAvatar?: string;
    content: string;
  },
): CommunityComment | null {
  const posts = getCommunityPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return null;

  const newComment: CommunityComment = {
    id: `comm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    postId,
    authorId: commentData.authorId,
    authorName: commentData.authorName,
    authorNickname: commentData.authorNickname || "أخت داعمة 🌸",
    useNickname: commentData.useNickname,
    authorAvatar: commentData.authorAvatar,
    content: commentData.content.trim(),
    createdAt: new Date().toISOString(),
    likes: 0,
  };

  post.comments = [...(post.comments || []), newComment];
  post.commentsCount = post.comments.length;

  saveCommunityPosts(posts);
  return newComment;
}

// Toggle Save / Bookmark
export function toggleSavePost(postId: string, userId: string): boolean {
  const posts = getCommunityPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return false;

  if (!post.savedBy) post.savedBy = [];
  const idx = post.savedBy.indexOf(userId);
  let isSaved = false;

  if (idx >= 0) {
    post.savedBy.splice(idx, 1);
    isSaved = false;
  } else {
    post.savedBy.push(userId);
    isSaved = true;
  }

  saveCommunityPosts(posts);
  return isSaved;
}

// Submit a moderation report
export function submitCommunityReport(reportData: {
  targetType: "post" | "comment";
  targetId: string;
  targetPreview: string;
  authorId: string;
  reporterId: string;
  reporterName: string;
  reason: ReportReason;
  details: string;
}): CommunityReport {
  const reports = getCommunityReports();
  const newReport: CommunityReport = {
    id: `rep-${Date.now()}`,
    targetType: reportData.targetType,
    targetId: reportData.targetId,
    targetPreview: reportData.targetPreview,
    authorId: reportData.authorId,
    reporterId: reportData.reporterId,
    reporterName: reportData.reporterName,
    reason: reportData.reason,
    details: reportData.details.trim(),
    createdAt: new Date().toISOString(),
    status: "pending",
  };

  const next = [newReport, ...reports];
  localStorage.setItem(REPORTS_KEY, JSON.stringify(next));

  // If flagged for unverified medical advice or severe harassment, mark post as flagged
  if (reportData.targetType === "post") {
    const posts = getCommunityPosts();
    const p = posts.find((x) => x.id === reportData.targetId);
    if (p && p.status === "active") {
      p.status = "flagged";
      p.moderationNotes = `Reported: ${reportData.reason}`;
      saveCommunityPosts(posts);
    }
  }

  window.dispatchEvent(new CustomEvent("pinkcare:reports-updated"));
  return newReport;
}

export function getCommunityReports(): CommunityReport[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(REPORTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Moderator actions
export function resolveReport(reportId: string, action: "dismiss" | "remove_post" | "warn"): void {
  const reports = getCommunityReports();
  const rep = reports.find((r) => r.id === reportId);
  if (!rep) return;

  rep.status = action === "dismiss" ? "dismissed" : "resolved";
  rep.resolutionNotes = `Handled via action: ${action} on ${new Date().toLocaleDateString()}`;
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));

  if (action === "remove_post" && rep.targetType === "post") {
    const posts = getCommunityPosts();
    const post = posts.find((p) => p.id === rep.targetId);
    if (post) {
      post.status = "removed";
      saveCommunityPosts(posts);
    }
  }

  window.dispatchEvent(new CustomEvent("pinkcare:reports-updated"));
}

export function removePostDirectly(postId: string, reason?: string): void {
  const posts = getCommunityPosts();
  const post = posts.find((p) => p.id === postId);
  if (post) {
    post.status = "removed";
    post.moderationNotes = reason || "Removed by administrator";
    saveCommunityPosts(posts);
  }
}

export function restorePostDirectly(postId: string): void {
  const posts = getCommunityPosts();
  const post = posts.find((p) => p.id === postId);
  if (post) {
    post.status = "active";
    post.moderationNotes = undefined;
    saveCommunityPosts(posts);
  }
}
