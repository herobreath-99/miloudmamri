import type { AiChatSession, AiChatMessage, AiQuickSuggestion } from "@/types/ai";

const STORAGE_PREFIX = "pinkcare_ai_sessions_";
const ACTIVE_SESSION_PREFIX = "pinkcare_ai_active_session_";

export const AI_SUGGESTIONS: AiQuickSuggestion[] = [
  {
    id: "sug-terms",
    textAr: "اشرحي لي هذا المصطلح الطبي بلغة بسيطة",
    textDz: "فهّمني هذا المصطلح الطبي بالدارجة وساهل",
    textFr: "Explique-moi ce terme médical simplement",
    category: "medical",
  },
  {
    id: "sug-doctor-prep",
    textAr: "كيف أستعد لموعدي القادم مع الطبيب؟",
    textDz: "كيفاش نوجد لروانديفو تاع الطبيب؟",
    textFr: "Comment me préparer pour mon prochain rendez-vous médical ?",
    category: "medical",
  },
  {
    id: "sug-shoulder",
    textAr: "ما فوائد تمارين حركة الكتف بعد الجراحة؟",
    textDz: "واش هي فايدة حركات الكتف والذراع بعد العملية؟",
    textFr: "Quels sont les bienfaits des exercices de mobilité de l'épaule ?",
    category: "exercise",
  },
  {
    id: "sug-anxiety",
    textAr: "أشعر بالقلق والتوتر، كيف أهدئ نفسي؟",
    textDz: "راني مقلقة بزاف وحاسة بالخوف، كيفاش نهدأ روحي؟",
    textFr: "Je ressens de l'anxiété et du stress, comment m'apaiser ?",
    category: "support",
  },
  {
    id: "sug-medication",
    textAr: "ساعديني على فهم النشرة الدوائية والآثار الجانبية الشائعة",
    textDz: "عاونيني نفهم الأعراض الجانبية المعروفة للأدوية",
    textFr: "Aide-moi à comprendre la notice de mon médicament et ses effets secondaires",
    category: "medication",
  },
  {
    id: "sug-nutrition",
    textAr: "ما هي الأغذية التي تساعد على تقوية المناعة والراحة؟",
    textDz: "واش ناكل باش نقوي المناعة ونرتاح من التعب؟",
    textFr: "Quels aliments soutiennent l'immunité et l'énergie ?",
    category: "nutrition",
  },
];

export function getInitialWelcomeMessage(lang: string = "ar", userName?: string): AiChatMessage {
  const nameDisplay = userName ? ` يا ${userName}` : "";
  let content = "";

  if (lang === "fr") {
    content = `Bonjour${userName ? ` ${userName}` : ""} 🌸 Je suis **PinkCare AI**, votre assistante intelligente dédiée à votre accompagnement au quotidien.

Je peux vous aider à :
- 🔬 Comprendre les termes médicaux et les examens.
- 🧘‍♀️ Vous soutenir sur le plan émotionnel avec des conseils d'apaisement.
- 🥗 Répondre à vos questions sur la nutrition et le mode de vie.
- 🤸‍♀️ Vous guider sur les exercices doux de rééducation de PinkCare.
- 📋 Préparer vos questions pour votre médecin traitant.

⚠️ *Rappel : Mes réponses sont éducatives et bienveillantes, et ne remplacent jamais l'avis de votre équipe médicale.*

Comment puis-je vous aider aujourd'hui ?`;
  } else if (lang === "dz") {
    content = `أهلاً وسهلاً بكِ${nameDisplay} في **PinkCare AI** 💗 راني هنا باش نكون معاكِ خطوة بخطوة في رحلتكِ.

نقدر نعاونكِ في:
- 🔬 نبسطلكِ المصطلحات الطبية والفحوصات بلغة سهلة ومفهومة.
- 🌸 نسمعلكِ ونقدملكِ دعم نفسي وتمارين تنفس لطيفة كي تحسي بالقلق.
- 🥗 نصائح على الماكلة الصحية والراحة أثناء العلاج.
- 🤸‍♀️ حركات وتأهيل الكتف والذراع المتوفرة في تطبيق PinkCare.
- 📝 نوجدو الأسئلة اللي تحبي تطرحيها على طبيبكِ في الموعد الجاي.

⚠️ *تذكير دافئ: راني هنا للمساعدة والتوعية والدعم المعنوي، وما نقدروش نبدلو توجيهات طبيبكِ المعالج.*

واش هو السؤال اللي راه في بالكِ اليوم؟ راني نسمعلكِ بكل حب 🌸`;
  } else {
    content = `أهلاً بكِ${nameDisplay} في **PinkCare AI – المساعد الذكي** 💗 رفيقتكِ اليومية للتوعية والدعم المتكامل.

يسعدني مساعدتكِ في:
- 🔬 شرح المصطلحات الطبية والفحوصات بأسلوب مبسط وموثوق.
- 🌸 تقديم الدعم المعنوي وتمارين التنفس والاسترخاء لتخفيف القلق.
- 🥗 إرشادات التغذية المتوازنة والتعامل مع الإجهاد اليومي.
- 🤸‍♀️ توضيح فوائد تمارين التأهيل الحركي المتوفرة في قسم التمارين.
- 📝 إعداد قائمة الأسئلة لمناقشتها مع طبيبكِ المعالج بكل ثقة.

⚠️ *تنبيه أمان: جميع المعلومات المقدمة هي لأغراض التوعية والدعم النفسي فقط، ولا تعد تشخيصاً طبياً أو بديلاً عن استشارة فريقكِ الطبي المعالج.*

ما الذي يدور في ذهنكِ اليوم وتريدين التحدث عنه؟ أنا هنا دائماً للاستماع إليكِ 🌸`;
  }

  return {
    id: "welcome-msg",
    role: "model",
    content,
    createdAt: new Date().toISOString(),
  };
}

export function getAiSessions(userId: string): AiChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAiSessions(userId: string, sessions: AiChatSession[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(sessions));
  } catch (err) {
    console.error("Failed to save AI sessions:", err);
  }
}

export function getActiveSessionId(userId: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${ACTIVE_SESSION_PREFIX}${userId}`);
}

export function setActiveSessionId(userId: string, sessionId: string | null): void {
  if (typeof window === "undefined") return;
  if (sessionId) {
    localStorage.setItem(`${ACTIVE_SESSION_PREFIX}${userId}`, sessionId);
  } else {
    localStorage.removeItem(`${ACTIVE_SESSION_PREFIX}${userId}`);
  }
}

export function createNewAiSession(
  userId: string,
  lang: string = "ar",
  userName?: string,
): AiChatSession {
  const newSession: AiChatSession = {
    id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    title: lang === "fr" ? "Nouvelle conversation" : "محادثة جديدة 🌸",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [getInitialWelcomeMessage(lang, userName)],
  };

  const sessions = getAiSessions(userId);
  const updated = [newSession, ...sessions];
  saveAiSessions(userId, updated);
  setActiveSessionId(userId, newSession.id);
  return newSession;
}

export function getOrCreateActiveSession(
  userId: string,
  lang: string = "ar",
  userName?: string,
): AiChatSession {
  const sessions = getAiSessions(userId);
  const activeId = getActiveSessionId(userId);

  if (activeId) {
    const found = sessions.find((s) => s.id === activeId);
    if (found) return found;
  }

  if (sessions.length > 0) {
    setActiveSessionId(userId, sessions[0].id);
    return sessions[0];
  }

  return createNewAiSession(userId, lang, userName);
}

export function updateSessionMessages(
  userId: string,
  sessionId: string,
  messages: AiChatMessage[],
  newTitle?: string,
): void {
  const sessions = getAiSessions(userId);
  const index = sessions.findIndex((s) => s.id === sessionId);
  if (index === -1) return;

  const session = sessions[index];
  session.messages = messages;
  session.updatedAt = new Date().toISOString();

  if (newTitle) {
    session.title = newTitle;
  } else if (session.title === "محادثة جديدة 🌸" || session.title === "Nouvelle conversation") {
    const firstUserMsg = messages.find((m) => m.role === "user");
    if (firstUserMsg) {
      session.title =
        firstUserMsg.content.slice(0, 36) + (firstUserMsg.content.length > 36 ? "..." : "");
    }
  }

  sessions[index] = session;
  saveAiSessions(userId, sessions);
}

export function deleteAiSession(userId: string, sessionId: string): void {
  const sessions = getAiSessions(userId);
  const filtered = sessions.filter((s) => s.id !== sessionId);
  saveAiSessions(userId, filtered);

  if (getActiveSessionId(userId) === sessionId) {
    if (filtered.length > 0) {
      setActiveSessionId(userId, filtered[0].id);
    } else {
      setActiveSessionId(userId, null);
    }
  }
}

export function clearAllAiSessions(userId: string): void {
  saveAiSessions(userId, []);
  setActiveSessionId(userId, null);
}
