import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  X,
  Maximize2,
  Minimize2,
  Copy,
  Volume2,
  VolumeX,
  ShieldAlert,
  Plus,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import type { AiChatMessage, AiAttachment } from "@/types/ai";
import {
  getOrCreateActiveSession,
  updateSessionMessages,
  createNewAiSession,
  AI_SUGGESTIONS,
} from "@/lib/pinkcareAiStorage";

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export function FloatingAiAssistant() {
  const { profile } = useAuth();
  const { lang } = useI18n();

  const isRtl = lang === "ar" || lang === "dz";
  const userId = profile?.id || "user-current";
  const userName = profile?.first_name || (isRtl ? "محاربة PinkCare" : "Chère patiente");

  // Chat window state
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasUnreadIndicator, setHasUnreadIndicator] = useState(false);

  // Active session and messages
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<AiAttachment | null>(null);

  // Audio / Speech
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Abort controller
  const abortControllerRef = useRef<AbortController | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load session on start or user/lang change
  useEffect(() => {
    const session = getOrCreateActiveSession(userId, lang, userName);
    setSessionId(session.id);
    setMessages(session.messages);
  }, [userId, lang, userName]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Handle Speech Recognition setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const win = window as unknown as {
        SpeechRecognition?: new () => SpeechRecognitionInstance;
        webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
      };
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = lang === "fr" ? "fr-FR" : lang === "dz" ? "ar-DZ" : "ar-SA";

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsRecording(false);
          toast.success(isRtl ? "تم التقاط صوتكِ بنجاح 🎙️" : "Voix capturée avec succès 🎙️");
        };

        recognition.onerror = () => {
          setIsRecording(false);
          toast.error(
            isRtl
              ? "تعذر التعرف على الصوت. يُرجى التحقق من إذن الميكروفون."
              : "Impossible de reconnaître la voix. Vérifiez le microphone.",
          );
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [lang, isRtl]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.info(
        isRtl
          ? "ميزة الإملاء الصوتي غير مدعومة على هذا المتصفح حالياً."
          : "Reconnaissance vocale non prise en charge.",
      );
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.lang = lang === "fr" ? "fr-FR" : lang === "dz" ? "ar-DZ" : "ar-SA";
        recognitionRef.current.start();
        setIsRecording(true);
        toast.info(isRtl ? "تحدثي الآن، أنا أستمع إليكِ 🌸" : "Parlez maintenant, j'écoute 🌸");
      } catch (e) {
        console.error(e);
        setIsRecording(false);
      }
    }
  };

  // Text-To-Speech reader
  const handleReadAloud = (messageId: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.info(isRtl ? "ميزة قراءة النص غير مدعومة هنا" : "Synthèse vocale indisponible");
      return;
    }

    if (isSpeaking === messageId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`>]/g, "").slice(0, 400);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === "fr" ? "fr-FR" : "ar-SA";
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(messageId);
    window.speechSynthesis.speak(utterance);
  };

  // Handle Image Attachment
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(isRtl ? "يُرجى اختيار ملف صورة صالح (JPEG, PNG, WebP)" : "Fichier image requis");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error(isRtl ? "حجم الصورة يجب أن لا يتجاوز 4 ميغابايت" : "Image trop lourde (max 4Mo)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage({
        type: "image",
        url: reader.result as string,
        mimeType: file.type,
        name: file.name,
        sizeBytes: file.size,
      });
      toast.success(isRtl ? "تم إرفاق الصورة بنجاح 📎" : "Image attachée 📎");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query && !attachedImage) return;

    const userMessage: AiChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: "user",
      content: query || (isRtl ? "تحليل هذه الصورة المرفقة 📷" : "Analyser cette image jointe 📷"),
      attachment: attachedImage || undefined,
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    updateSessionMessages(userId, sessionId, updatedMessages);

    setInputText("");
    setAttachedImage(null);
    setIsLoading(true);

    const apiMessages = updatedMessages.map((m) => ({
      role: m.role,
      content: m.content,
      attachment: m.attachment
        ? {
            type: m.attachment.type,
            url: m.attachment.url,
            mimeType: m.attachment.mimeType,
          }
        : undefined,
    }));

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          messages: apiMessages,
          lang,
          userName,
        }),
      });

      const data = await response.json();

      const botMessage: AiChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: "model",
        content: data.reply || (isRtl ? "تم استلام رسالتكِ 🌸" : "Bien reçu 🌸"),
        sources: data.sources || [],
        createdAt: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      updateSessionMessages(userId, sessionId, finalMessages);

      if (!isOpen) {
        setHasUnreadIndicator(true);
      }
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") {
        toast.info(isRtl ? "تم إيقاف الرد" : "Réponse interrompue");
      } else {
        console.error(err);
        const errorMessage: AiChatMessage = {
          id: `msg_err_${Date.now()}`,
          role: "model",
          content: isRtl
            ? "حدث انقطاع مؤقت في الاتصال بخدمة الذكاء الاصطناعي. يُرجى التحقق من الاتصال وإعادة المحاولة 🌸"
            : "Une interruption temporaire est survenue. Veuillez réessayer 🌸",
          hasError: true,
          createdAt: new Date().toISOString(),
        };
        const finalMessages = [...updatedMessages, errorMessage];
        setMessages(finalMessages);
        updateSessionMessages(userId, sessionId, finalMessages);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Stop generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  // New Chat session
  const handleStartNewChat = () => {
    const newSession = createNewAiSession(userId, lang, userName);
    setSessionId(newSession.id);
    setMessages(newSession.messages);
    setInputText("");
    setAttachedImage(null);
    toast.success(isRtl ? "بدأت محادثة جديدة 💗" : "Nouvelle conversation démarrée 💗");
  };

  // Copy text to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(isRtl ? "تم نسخ الإجابة بنجاح" : "Texte copié !");
  };

  return (
    <>
      {/* 1. Floating AI Button (Fixed, glowing, accessible) */}
      <div
        className={`fixed z-40 transition-all duration-300 ${
          isRtl ? "left-4 md:left-6" : "right-4 md:right-6"
        } bottom-20 md:bottom-22`}
      >
        <button
          onClick={() => {
            setIsOpen((prev) => !prev);
            setHasUnreadIndicator(false);
          }}
          className="relative group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-pink-600 via-fuchsia-600 to-purple-600 text-white shadow-[0_0_25px_rgba(236,72,153,0.55)] border-2 border-pink-300/40 hover:scale-108 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-pink-400/40"
          aria-label="PinkCare AI Assistant"
          title={isRtl ? "اسأليني – PinkCare AI 💗" : "Demandez-moi – PinkCare AI 💗"}
        >
          {/* Ambient slow breathing glow */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-60 blur-md group-hover:opacity-90 animate-pulse pointer-events-none" />

          {/* Central Logo: Pink Ribbon + AI Sparkles combination */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Pink Ribbon stylized mark */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 md:w-8 md:h-8 drop-shadow-md text-pink-100"
              >
                <path
                  d="M12 2C8.5 2 7 5 7 7.5C7 10 9 13 12 16C15 13 17 10 17 7.5C17 5 15.5 2 12 2Z"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                />
                <path
                  d="M9.5 13.5L5 22M14.5 13.5L19 22"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
              {/* Sparkling AI Star */}
              <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -end-1 animate-spin duration-10000" />
            </div>
            <span className="text-[9px] font-black tracking-tight text-white/95 mt-[-2px] uppercase">
              AI
            </span>
          </div>

          {/* Unread Message Notification Dot */}
          {hasUnreadIndicator && (
            <span className="absolute top-0 end-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900 animate-bounce" />
          )}

          {/* Hover Tooltip */}
          <span
            className={`absolute ${
              isRtl ? "start-full ms-3" : "end-full me-3"
            } top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-950/90 text-white text-[11px] font-bold border border-fuchsia-400/40 shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap backdrop-blur-md hidden sm:block`}
          >
            {isRtl ? "اسأليني – PinkCare AI 💗" : "Demandez-moi – PinkCare AI 💗"}
          </span>
        </button>
      </div>

      {/* 2. Floating AI Chat Window Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 shadow-2xl backdrop-blur-xl ${
            isRtl ? "left-2 sm:left-6" : "right-2 sm:right-6"
          } bottom-4 sm:bottom-22 ${
            isExpanded
              ? "w-[96vw] sm:w-[580px] h-[92vh] sm:h-[700px] max-w-[96vw]"
              : "w-[94vw] sm:w-[420px] h-[82vh] sm:h-[540px] max-h-[85vh]"
          } rounded-3xl bg-slate-950/95 border border-fuchsia-500/40 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6`}
        >
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-purple-950/90 via-fuchsia-950/90 to-purple-950/90 border-b border-fuchsia-500/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-fuchsia-950/70 shrink-0 border border-pink-300/30">
                <Sparkles className="w-5 h-5 text-amber-200" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white truncate">
                    PinkCare AI – {isRtl ? "المساعد الذكي" : "Assistant Intelligent"}
                  </h3>
                  <span className="flex h-2 w-2 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </div>
                <p className="text-[10px] text-fuchsia-200/80 truncate">
                  {lang === "dz"
                    ? "دعم نفسي ومعنوي ومرافقة خطوة بخطوة 💗"
                    : isRtl
                      ? "دعم نفسي وتوعية صحية متكاملة 💗"
                      : "Soutien & Sensibilisation 💗"}
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1 shrink-0">
              {/* New chat */}
              <button
                onClick={handleStartNewChat}
                className="w-8 h-8 rounded-full glass-dark text-fuchsia-200 hover:text-white flex items-center justify-center transition"
                title={
                  lang === "dz" ? "محادثة جديدة" : isRtl ? "محادثة جديدة" : "Nouvelle conversation"
                }
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Expand/Restore */}
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className="w-8 h-8 rounded-full glass-dark text-fuchsia-200 hover:text-white hidden sm:flex items-center justify-center transition"
                title={isExpanded ? (isRtl ? "تصغير" : "Réduire") : isRtl ? "تكبير" : "Agrandir"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full glass-dark text-fuchsia-200 hover:text-white flex items-center justify-center transition"
                title={isRtl ? "إغلاق" : "Fermer"}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Medical Safety Disclaimer Strip */}
          <div className="px-3 py-1 bg-purple-950/40 border-b border-fuchsia-500/20 flex items-center justify-center gap-1.5 text-[10px] text-fuchsia-200/85 shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-pink-400 shrink-0" />
            <span className="truncate">
              {lang === "dz"
                ? "تنبيه طبي: المعلومات هنا للمساعدة والدعم فقط وما تعوضش استشارة طبيبك المعالج."
                : isRtl
                  ? "تنبيه طبي: المعلومات تثقيفية وداعمة ولا تعد تشخيصاً أو بديلاً عن طبيبكِ."
                  : "Info éducative et bienveillante ne remplaçant pas votre médecin."}
            </span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3.5 no-scrollbar">
            {messages.map((msg) => {
              const isUser = msg.role === "user";

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl p-3 shadow-lg relative group ${
                      isUser
                        ? "bg-gradient-to-br from-pink-600/90 to-fuchsia-700/90 text-white rounded-br-xs border border-pink-400/30"
                        : "bg-slate-900/90 text-slate-100 rounded-bl-xs border border-fuchsia-500/25"
                    }`}
                  >
                    {/* Image Attachment Preview */}
                    {msg.attachment && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-white/20 max-w-[220px]">
                        <img
                          src={msg.attachment.url}
                          alt={msg.attachment.name}
                          className="w-full h-auto object-cover max-h-48"
                        />
                      </div>
                    )}

                    {/* Content text */}
                    <div className="text-xs leading-relaxed whitespace-pre-wrap select-text space-y-1">
                      {msg.content}
                    </div>

                    {/* Scientific Citations / Sources */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-fuchsia-400/20 text-[10px] space-y-1 text-fuchsia-300">
                        <span className="font-semibold block text-pink-300">
                          {isRtl ? "المراجع والمصادر الطبية المعتمدة:" : "Sources médicales :"}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((s, idx) => (
                            <a
                              key={idx}
                              href={s.uri || "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-900/60 hover:bg-purple-800/80 text-fuchsia-200 border border-fuchsia-400/30 transition text-[9px]"
                            >
                              <ExternalLink className="w-2.5 h-2.5 text-pink-300" />
                              <span className="truncate max-w-[140px]">{s.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bottom Metadata & Action Buttons */}
                    <div className="flex items-center justify-between gap-3 mt-1.5 text-[9px] text-fuchsia-300/70 pt-1">
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {!isUser && (
                        <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition">
                          {/* Text to speech */}
                          <button
                            onClick={() => handleReadAloud(msg.id, msg.content)}
                            className="p-1 rounded-md hover:bg-purple-900/50 text-fuchsia-300"
                            title={
                              isSpeaking === msg.id
                                ? isRtl
                                  ? "إيقاف الصوت"
                                  : "Arrêter"
                                : isRtl
                                  ? "قراءة صوتية"
                                  : "Lire à haute voix"
                            }
                          >
                            {isSpeaking === msg.id ? (
                              <VolumeX className="w-3.5 h-3.5 text-pink-400" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Copy */}
                          <button
                            onClick={() => handleCopy(msg.content)}
                            className="p-1 rounded-md hover:bg-purple-900/50 text-fuchsia-300"
                            title={isRtl ? "نسخ الإجابة" : "Copier"}
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* In-Flight Thinking Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2 animate-in fade-in">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-fuchsia-600 flex items-center justify-center text-white shrink-0 text-xs">
                  🌸
                </div>
                <div className="p-3 rounded-2xl rounded-bl-xs bg-slate-900/90 border border-fuchsia-500/30 text-xs text-fuchsia-200 flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
                  </span>
                  <span>{isRtl ? "تفكّر PinkCare AI..." : "PinkCare AI réfléchit..."}</span>
                  <button
                    onClick={handleStopGeneration}
                    className="ms-2 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-400/30 hover:bg-rose-500/30"
                  >
                    {isRtl ? "إيقاف" : "Arrêter"}
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-1.5 border-t border-fuchsia-500/15 bg-slate-950/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-[10px]">
            {AI_SUGGESTIONS.map((sug) => {
              const text = lang === "fr" ? sug.textFr : lang === "dz" ? sug.textDz : sug.textAr;
              return (
                <button
                  key={sug.id}
                  disabled={isLoading}
                  onClick={() => handleSendMessage(text)}
                  className="px-2.5 py-1 rounded-xl glass-dark border border-fuchsia-400/25 text-fuchsia-200 hover:text-white hover:border-pink-400 whitespace-nowrap transition shrink-0 active:scale-95 disabled:opacity-50"
                >
                  {text}
                </button>
              );
            })}
          </div>

          {/* Image Attachment Preview in Input Bar */}
          {attachedImage && (
            <div className="px-3 pt-2 bg-slate-950 flex items-center justify-between text-xs text-pink-300 border-t border-fuchsia-500/20">
              <div className="flex items-center gap-2">
                <img
                  src={attachedImage.url}
                  alt="preview"
                  className="w-8 h-8 rounded-lg object-cover border border-pink-400/40"
                />
                <span className="truncate max-w-[180px] text-[11px] text-white">
                  {attachedImage.name}
                </span>
              </div>
              <button
                onClick={() => setAttachedImage(null)}
                className="p-1 rounded-full text-rose-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input Controls Bar */}
          <div className="p-2.5 bg-slate-950 border-t border-fuchsia-500/25 flex items-end gap-2 shrink-0">
            {/* Hidden File input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Attachment Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-9 h-9 rounded-2xl glass-dark text-fuchsia-300 hover:text-white flex items-center justify-center border border-fuchsia-400/25 transition shrink-0"
              title={isRtl ? "إرفاق صورة" : "Joindre une image"}
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            {/* Voice Dictation Button */}
            <button
              onClick={toggleRecording}
              className={`w-9 h-9 rounded-2xl flex items-center justify-center transition shrink-0 ${
                isRecording
                  ? "bg-rose-600 text-white animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.6)]"
                  : "glass-dark text-fuchsia-300 hover:text-white border border-fuchsia-400/25"
              }`}
              title={
                isRecording
                  ? isRtl
                    ? "إيقاف التسجيل"
                    : "Arrêter"
                  : isRtl
                    ? "إملاء صوتي"
                    : "Dictée vocale"
              }
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text input */}
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                placeholder={
                  lang === "dz"
                    ? "سقسي PinkCare AI على أي حاجة راكي حابة تفهميها..."
                    : isRtl
                      ? "اسألي PinkCare AI عن أي استفسار أو مخاوف..."
                      : "Posez votre question à PinkCare AI..."
                }
                className="w-full bg-slate-900/90 text-xs text-white placeholder-fuchsia-300/40 rounded-2xl p-2.5 px-3 border border-fuchsia-400/25 focus:border-pink-400 focus:outline-none resize-none max-h-24"
              />
            </div>

            {/* Send button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || (!inputText.trim() && !attachedImage)}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition shadow-lg shrink-0 ${
                inputText.trim() || attachedImage
                  ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-fuchsia-950/60 hover:scale-105 active:scale-95"
                  : "glass-dark text-fuchsia-400/40 cursor-not-allowed"
              }`}
              title={isRtl ? "إرسال" : "Envoyer"}
            >
              <Send className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
