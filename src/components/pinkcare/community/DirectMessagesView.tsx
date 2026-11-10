import { useState, useEffect, useRef, useMemo } from "react";
import {
  MessageSquare,
  Search,
  Plus,
  Send,
  User,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
  X,
  Lock,
  UserX,
  Flag,
} from "lucide-react";
import { toast } from "sonner";
import type { DirectConversation, ChatMessage } from "@/types/community";
import {
  getDirectConversations,
  getDirectMessages,
  sendChatMessage,
  getOrCreateDirectConversation,
  markConversationRead,
  getCommunityUserProfile,
} from "@/lib/communityChatStorage";
import { blockUser, getBlockedUsers } from "@/lib/communityStorage";
import { INITIAL_USER_ACCOUNTS } from "@/lib/rbacStorage";
import type { Lang } from "@/lib/i18n";

interface DirectMessagesViewProps {
  currentUserId: string;
  currentUserName: string;
  currentUserNickname?: string;
  currentUserRole?: string;
  lang?: Lang;
  onReportUser?: (userId: string, userName: string) => void;
  onOpenReport?: (messageId: string, preview: string, authorId: string) => void;
}

export function DirectMessagesView({
  currentUserId,
  currentUserName,
  currentUserNickname,
  currentUserRole,
  lang = "ar",
  onReportUser,
  onOpenReport,
}: DirectMessagesViewProps) {
  const nickname = currentUserNickname || currentUserName;
  void currentUserRole;
  const isRtl = lang === "ar" || lang === "dz";

  const [conversations, setConversations] = useState<DirectConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<DirectConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewConvoModal, setShowNewConvoModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations
  const loadConversations = () => {
    const all = getDirectConversations();
    const myConvos = all.filter((c) => c.participantIds.includes(currentUserId));
    setConversations(myConvos);

    // If active convo, reload its messages
    if (activeConversation) {
      const msgs = getDirectMessages(activeConversation.id);
      setMessages(msgs);
      markConversationRead(activeConversation.id, currentUserId);
    }
  };

  useEffect(() => {
    loadConversations();
    const handleUpdate = () => loadConversations();
    window.addEventListener("pinkcare:community-chat-updated", handleUpdate);
    return () => window.removeEventListener("pinkcare:community-chat-updated", handleUpdate);
  }, [activeConversation?.id]);

  useEffect(() => {
    if (activeConversation) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // Select conversation
  const selectConvo = (convo: DirectConversation) => {
    setActiveConversation(convo);
    const msgs = getDirectMessages(convo.id);
    setMessages(msgs);
    markConversationRead(convo.id, currentUserId);
  };

  // Other participant details
  const getOtherParticipant = (convo: DirectConversation) => {
    const otherId = convo.participantIds.find((id) => id !== currentUserId) || "";
    const details = convo.participantDetails[otherId] || {
      name: "أخت في مجتمع PinkCare",
      nickname: "أخت داعمة 🌸",
    };
    return { id: otherId, ...details };
  };

  // Send Direct Message
  const handleSend = () => {
    if (!inputText.trim() || !activeConversation) return;

    const other = getOtherParticipant(activeConversation);
    const otherProfile = getCommunityUserProfile(other.id);

    // Check if other user disabled direct messages
    if (otherProfile.allowDirectMessages === false) {
      toast.error(
        isRtl
          ? "هذه العضوة فضّلت إيقاف استقبال الرسائل الخاصة في إعدادات الخصوصية."
          : "This member has disabled direct messages in privacy settings.",
      );
      return;
    }

    sendChatMessage({
      conversationId: activeConversation.id,
      senderId: currentUserId,
      senderName: currentUserName,
      senderNickname: nickname,
      content: inputText,
    });

    setInputText("");
  };

  // Block User
  const handleBlockUser = (otherId: string, otherName: string) => {
    if (
      confirm(isRtl ? `هل ترغبين في حظر ${otherName} ومنعها من مراسلتك؟` : `Block ${otherName}?`)
    ) {
      blockUser(otherId, otherName);
      toast.success(isRtl ? "تم حظر المستخدمة بنجاح" : "User blocked");
      setActiveConversation(null);
      loadConversations();
    }
  };

  // List of potential members to message
  const candidateUsers = useMemo(() => {
    const blocked = getBlockedUsers().map((b) => b.blockedUserId);
    return INITIAL_USER_ACCOUNTS.filter((u) => u.id !== currentUserId && !blocked.includes(u.id));
  }, [currentUserId]);

  const startNewWithUser = (user: (typeof INITIAL_USER_ACCOUNTS)[0]) => {
    const convo = getOrCreateDirectConversation(
      currentUserId,
      user.id,
      {
        name: currentUserName,
        nickname: nickname,
      },
      {
        name: `${user.firstName} ${user.lastName}`,
        nickname:
          user.role === "community_moderator"
            ? "مشرفة الأمان 🛡️"
            : user.role === "professional"
              ? "طبيبة أخصائية 🩺"
              : "عضوة داعمة 🌸",
        role: user.role,
      },
    );
    setShowNewConvoModal(false);
    selectConvo(convo);
  };

  // If a conversation is actively open: Render 1-on-1 Chat Room
  if (activeConversation) {
    const other = getOtherParticipant(activeConversation);

    return (
      <div className="flex flex-col h-[calc(100vh-140px)] rounded-3xl bg-slate-950/90 border border-fuchsia-500/30 shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Direct Chat Header */}
        <div className="p-3.5 bg-gradient-to-r from-purple-950/80 via-fuchsia-950/80 to-purple-950/80 border-b border-fuchsia-500/25 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setActiveConversation(null)}
              className="w-8 h-8 rounded-full glass-dark text-fuchsia-200 hover:text-white flex items-center justify-center border border-fuchsia-400/30 transition shrink-0"
            >
              {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shrink-0">
              {other.name[0] || "🌸"}
            </div>

            <div className="min-w-0">
              <h3 className="text-xs font-bold text-white truncate">
                {other.nickname || other.name}
              </h3>
              <p className="text-[10px] text-fuchsia-200/80 flex items-center gap-1">
                <Lock className="w-3 h-3 text-pink-400" />
                <span>{isRtl ? "محادثة خاصة ومحمية" : "Private & Encrypted"}</span>
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => handleBlockUser(other.id, other.nickname || other.name)}
              className="w-8 h-8 rounded-full glass-dark text-rose-300 hover:text-white flex items-center justify-center"
              title={isRtl ? "حظر المستخدمة" : "Block"}
            >
              <UserX className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (onReportUser) {
                  onReportUser(other.id, other.nickname || other.name);
                } else if (onOpenReport) {
                  onOpenReport(activeConversation.id, `Private Chat with ${other.name}`, other.id);
                }
              }}
              className="w-8 h-8 rounded-full glass-dark text-amber-300 hover:text-white flex items-center justify-center"
              title={isRtl ? "إبلاغ" : "Report"}
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Private Chat Guidance Banner */}
        <div className="px-3 py-1.5 bg-purple-950/40 border-b border-fuchsia-500/15 text-[10px] text-fuchsia-200/80 text-center shrink-0">
          {isRtl
            ? "🔒 محادثة فردية خاصة. لا تشاركي أرقام هواتفكِ أو تقاريركِ الطبية السرية."
            : "🔒 Private individual chat. Never share confidential phone numbers or test results."}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2 opacity-80">
              <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-400/30 flex items-center justify-center text-pink-300">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-white">
                {isRtl
                  ? "بداية محادثتكِ مع " + (other.nickname || other.name)
                  : "Conversation started"}
              </p>
              <p className="text-[11px] text-fuchsia-200/70">
                {isRtl ? "أرسلي رسالة ترحيب لتبادل الدعم والتشجيع 🌸" : "Say hello to connect 🌸"}
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
                      isMe
                        ? "bg-gradient-to-br from-pink-600/90 to-fuchsia-700/90 text-white rounded-br-xs border border-pink-400/30"
                        : "bg-slate-900/90 text-white rounded-bl-xs border border-fuchsia-400/20"
                    }`}
                  >
                    <p className="text-xs leading-relaxed whitespace-pre-wrap select-text">
                      {msg.content}
                    </p>
                    <div
                      className={`flex items-center gap-1.5 mt-1 text-[9px] ${
                        isMe ? "text-pink-100/75 justify-end" : "text-fuchsia-300/70 justify-start"
                      }`}
                    >
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isMe && <CheckCheck className="w-3 h-3 text-cyan-300" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-2.5 bg-slate-950 border-t border-fuchsia-500/25 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isRtl ? "اكتبي رسالتكِ الخاصة هنا..." : "Type a private message..."}
            className="flex-1 bg-slate-900/90 text-xs text-white placeholder-fuchsia-300/40 rounded-2xl p-2.5 px-3.5 border border-fuchsia-400/25 focus:border-pink-400 focus:outline-none"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition shadow-lg shrink-0 ${
              inputText.trim()
                ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-fuchsia-950/60 hover:scale-105 active:scale-95"
                : "glass-dark text-fuchsia-400/40 cursor-not-allowed"
            }`}
          >
            <Send className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    );
  }

  // Otherwise: Render Conversations List
  return (
    <div className="space-y-3 pb-8">
      {/* Top Action & Search Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-fuchsia-300 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? "بحث في المحادثات الخاصة..." : "Search direct messages..."}
            className="w-full bg-slate-950/80 text-xs text-white placeholder-fuchsia-300/40 rounded-2xl py-2.5 ps-9 pe-3 border border-fuchsia-500/25 focus:border-pink-400 focus:outline-none"
          />
        </div>

        <button
          onClick={() => setShowNewConvoModal(true)}
          className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? "محادثة جديدة" : "New Chat"}</span>
        </button>
      </div>

      {/* Conversations Cards List */}
      <div className="space-y-2">
        {conversations.length === 0 ? (
          <div className="p-8 text-center rounded-3xl glass-dark border border-fuchsia-400/20 space-y-2">
            <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-400/30 flex items-center justify-center text-pink-300 mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-white">
              {isRtl ? "لا توجد محادثات خاصة بعد" : "No direct conversations yet"}
            </h4>
            <p className="text-[11px] text-fuchsia-200/80 max-w-xs mx-auto">
              {isRtl
                ? "يمكنكِ بدء محادثة فردية خاصة مع أي من الأخوات أو المشرفات لتبادل الدعم الشخصي."
                : "Start a private conversation with peer members or moderators for 1-on-1 support."}
            </p>
            <button
              onClick={() => setShowNewConvoModal(true)}
              className="mt-2 px-4 py-2 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-400/30 text-xs font-bold hover:bg-pink-500/30 transition"
            >
              {isRtl ? "بدء محادثة أولى 🌸" : "Start First Chat 🌸"}
            </button>
          </div>
        ) : (
          conversations.map((convo) => {
            const other = getOtherParticipant(convo);
            const unread = convo.unreadCount[currentUserId] || 0;

            return (
              <div
                key={convo.id}
                onClick={() => selectConvo(convo)}
                className={`p-3.5 rounded-2xl glass-dark border cursor-pointer hover:border-pink-400 transition flex items-center justify-between gap-3 ${
                  unread > 0
                    ? "border-pink-500/60 bg-purple-950/40 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                    : "border-fuchsia-400/20"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                    {other.name[0] || "🌸"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white truncate">
                        {other.nickname || other.name}
                      </h4>
                      {other.role === "community_moderator" && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-200 border border-purple-400/30">
                          {isRtl ? "مشرفة" : "Mod"}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-fuchsia-200/70 truncate mt-0.5">
                      {convo.lastMessagePreview || "محادثة خاصة"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[9px] text-fuchsia-300/60 tabular-nums">
                    {new Date(convo.lastMessageAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {unread > 0 && (
                    <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md shadow-pink-500/50">
                      {unread}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewConvoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-950 border border-fuchsia-400/40 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-fuchsia-400/20">
              <h3 className="text-xs font-bold text-white">
                {isRtl ? "اختاري عضوة لمراسلتها بأمان" : "Start Private Chat"}
              </h3>
              <button
                onClick={() => setShowNewConvoModal(false)}
                className="w-7 h-7 rounded-full glass-dark text-fuchsia-200 hover:text-white flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-fuchsia-200/80 leading-relaxed">
              {isRtl
                ? "يمكنكِ التواصل مع المشرفات أو الأخوات في مساحة خاصة تحمي بيانات اتصالكِ بالكامل."
                : "Communicate directly with peer members and safe moderators."}
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
              {candidateUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => startNewWithUser(user)}
                  className="p-2.5 rounded-2xl glass-dark border border-fuchsia-400/20 hover:border-pink-400 transition flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 font-bold flex items-center justify-center text-xs">
                      {user.firstName[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {user.firstName} {user.lastName}
                      </h4>
                      <span className="text-[10px] text-fuchsia-300/70">
                        {user.role === "community_moderator"
                          ? isRtl
                            ? "مشرفة الدعم والأمان"
                            : "Community Moderator"
                          : user.role === "professional"
                            ? isRtl
                              ? "طبيبة أخصائية"
                              : "Healthcare Specialist"
                            : isRtl
                              ? "عضوة متعافية"
                              : "Peer Member"}
                      </span>
                    </div>
                  </div>
                  <MessageSquare className="w-4 h-4 text-pink-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
