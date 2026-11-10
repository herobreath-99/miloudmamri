import { useState, useRef, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Smile,
  Paperclip,
  Image as ImageIcon,
  Reply,
  MoreVertical,
  Trash2,
  Edit2,
  Flag,
  X,
  Search,
  Users,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Info,
  Check,
  CheckCheck,
  Heart,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import type { CommunityGroup, ChatMessage, ChatAttachment } from "@/types/community";
import {
  getGroupMessages,
  sendChatMessage,
  toggleMessageReaction,
  editChatMessage,
  deleteChatMessage,
  markMessagesAsRead,
  scanMessageSafety,
} from "@/lib/communityChatStorage";
import type { Lang } from "@/lib/i18n";

interface GroupChatRoomProps {
  group: CommunityGroup;
  currentUserId: string;
  currentUserName: string;
  currentUserNickname?: string;
  currentUserRole?: string;
  lang?: Lang;
  onBack: () => void;
  onOpenReport?: (messageId: string, preview: string, authorId: string) => void;
  onReportMessage?: (messageId: string, preview: string, authorId: string) => void;
}

const SUPPORTIVE_EMOJIS = ["🌸", "❤️", "🫂", "💪", "🙏", "✨", "🤍", "🌷", "☀️", "☕"];

export function GroupChatRoom({
  group,
  currentUserId,
  currentUserName,
  currentUserNickname,
  currentUserRole = "patient",
  lang = "ar",
  onBack,
  onOpenReport,
  onReportMessage,
}: GroupChatRoomProps) {
  const triggerReport = onReportMessage || onOpenReport || (() => {});
  const nickname = currentUserNickname || currentUserName;
  const isRtl = lang === "ar" || lang === "dz";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Replying state
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);

  // Editing state
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [editText, setEditText] = useState("");

  // Attachment state
  const [attachment, setAttachment] = useState<ChatAttachment | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Active message action popup
  const [activeMessageMenu, setActiveMessageMenu] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load messages
  const loadMessages = () => {
    const msgs = getGroupMessages(group.id);
    setMessages(msgs);

    // Mark unread messages as read
    const unreadIds = msgs.filter((m) => !m.readBy?.includes(currentUserId)).map((m) => m.id);
    if (unreadIds.length > 0) {
      markMessagesAsRead(unreadIds, currentUserId);
    }
  };

  useEffect(() => {
    loadMessages();

    const handleUpdate = () => {
      loadMessages();
    };

    window.addEventListener("pinkcare:community-chat-updated", handleUpdate);
    return () => {
      window.removeEventListener("pinkcare:community-chat-updated", handleUpdate);
    };
  }, [group.id]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (!searchQuery) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, searchQuery]);

  // Real-time safety check on input text
  const safetyStatus = useMemo(() => {
    if (!inputText.trim()) return { isSafe: true };
    return scanMessageSafety(inputText);
  }, [inputText]);

  // Handle Send Message
  const handleSendMessage = () => {
    if (!inputText.trim() && !attachment) return;

    if (!safetyStatus.isSafe && safetyStatus.detectedType === "phone_exposure") {
      toast.error(
        isRtl
          ? "يُمنع مشاركة أرقام الهواتف لحماية خصوصيتكِ وأمانكِ 🌸"
          : "Sharing phone numbers is restricted for your privacy & safety 🌸",
      );
      return;
    }

    sendChatMessage({
      groupId: group.id,
      senderId: currentUserId,
      senderName: currentUserName,
      senderNickname: nickname,
      senderRole: currentUserRole,
      content: inputText,
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            senderName: replyingTo.senderNickname || replyingTo.senderName,
            content: replyingTo.content.slice(0, 70),
          }
        : undefined,
      attachment: attachment || undefined,
    });

    setInputText("");
    setAttachment(null);
    setReplyingTo(null);
    setShowEmojiPicker(false);
  };

  // Handle File / Image upload
  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(isRtl ? "حجم الملف كبير جداً (الحد الأقصى 5MB)" : "File too large (max 5MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === "string" ? reader.result : "";
      const isImg = file.type.startsWith("image/");
      setAttachment({
        type: isImg ? "image" : "file",
        url,
        name: file.name,
        sizeBytes: file.size,
      });
      toast.success(isRtl ? "تم إرفاق الصورة بنجاح" : "Image attached");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Filter messages if search is active
  const displayedMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter(
      (m) =>
        m.content.toLowerCase().includes(q) ||
        m.senderName.toLowerCase().includes(q) ||
        m.senderNickname?.toLowerCase().includes(q),
    );
  }, [messages, searchQuery]);

  // Is moderator or platform admin
  const isModerator =
    currentUserRole === "community_moderator" || currentUserRole === "platform_admin";

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] rounded-3xl bg-slate-950/90 border border-fuchsia-500/30 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* 1. Group Chat Header */}
      <div className="p-3.5 bg-gradient-to-r from-purple-950/80 via-fuchsia-950/80 to-purple-950/80 border-b border-fuchsia-500/25 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full glass-dark text-fuchsia-200 hover:text-white flex items-center justify-center border border-fuchsia-400/30 transition shrink-0"
            title={isRtl ? "العودة للمجموعات" : "Back to groups"}
          >
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center text-xl shadow-md shrink-0">
            {group.icon}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-white truncate">
                {isRtl ? group.nameAr : group.nameFr}
              </h3>
              {group.isOfficial && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 font-semibold border border-pink-400/30 shrink-0">
                  {isRtl ? "رسمية" : "Official"}
                </span>
              )}
            </div>
            <p className="text-[10px] text-fuchsia-200/80 flex items-center gap-1 mt-0.5 truncate">
              <Users className="w-3 h-3 text-pink-400 shrink-0" />
              <span>
                {group.memberIds.length} {isRtl ? "عضوة منضمة" : "members"}
              </span>
              <span>•</span>
              <span className="text-emerald-400">{isRtl ? "نشطة الآن" : "Active"}</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setShowSearch((s) => !s)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
              showSearch
                ? "bg-pink-500 text-white shadow-md shadow-pink-500/40"
                : "glass-dark text-fuchsia-200 hover:text-white"
            }`}
            title={isRtl ? "بحث في المحادثة" : "Search in chat"}
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowRulesModal(true)}
            className="w-8 h-8 rounded-full glass-dark text-fuchsia-200 hover:text-white flex items-center justify-center"
            title={isRtl ? "قواعد المجموعة" : "Group rules"}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. In-Chat Search Bar (if opened) */}
      {showSearch && (
        <div className="p-2 bg-black/60 border-b border-fuchsia-500/20 flex items-center gap-2 animate-fade-in shrink-0">
          <Search className="w-3.5 h-3.5 text-fuchsia-300 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? "بحث في رسائل المجموعة..." : "Search messages..."}
            className="flex-1 bg-transparent text-xs text-white placeholder-fuchsia-300/50 focus:outline-none"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-fuchsia-300 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 3. Safety Alert Strip */}
      <div className="px-3 py-1.5 bg-gradient-to-r from-purple-950/40 via-pink-950/40 to-purple-950/40 border-b border-fuchsia-500/15 flex items-center justify-between text-[10px] text-fuchsia-200/90 shrink-0">
        <div className="flex items-center gap-1.5 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">
            {isRtl
              ? "محادثة آمنة للدعم النفسي • لا تستبدل استشارة طبيبك المعالج"
              : "Safe peer space • Does not replace your oncologist"}
          </span>
        </div>
        <button
          onClick={() => setShowRulesModal(true)}
          className="text-pink-300 hover:text-white underline text-[9px] shrink-0 font-medium"
        >
          {isRtl ? "القواعد" : "Rules"}
        </button>
      </div>

      {/* 4. Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar">
        {displayedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2 opacity-80">
            <div className="w-12 h-12 rounded-full bg-fuchsia-500/10 border border-fuchsia-400/30 flex items-center justify-center text-pink-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-white">
              {searchQuery
                ? isRtl
                  ? "لا توجد نتائج مطابقة لبحثك"
                  : "No matching messages"
                : isRtl
                  ? "أهلاً بكِ في هذه المجموعة! كوني أول من يبدأ المحادثة 🌸"
                  : "Welcome! Start the conversation 🌸"}
            </p>
          </div>
        ) : (
          displayedMessages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            const isMsgMod =
              msg.senderRole === "community_moderator" || msg.senderRole === "platform_admin";
            const isDoc = msg.senderRole === "professional";

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"} group relative`}
              >
                {/* Sender Header info if not me */}
                {!isMe && (
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[11px] font-bold text-fuchsia-200">
                      {msg.senderNickname || msg.senderName}
                    </span>
                    {isMsgMod && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/40 font-semibold">
                        {isRtl ? "مشرفة" : "Mod"}
                      </span>
                    )}
                    {isDoc && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 font-semibold">
                        {isRtl ? "طبيبة أخصائية" : "Doctor"}
                      </span>
                    )}
                  </div>
                )}

                {/* Bubble Container */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 shadow-md relative transition-all ${
                    isMe
                      ? "bg-gradient-to-br from-pink-600/90 to-fuchsia-700/90 text-white rounded-br-xs border border-pink-400/40"
                      : "bg-slate-900/90 text-white rounded-bl-xs border border-fuchsia-400/25"
                  }`}
                >
                  {/* Quoted Reply Preview */}
                  {msg.replyTo && (
                    <div
                      className={`mb-2 p-2 rounded-xl text-[10px] border-s-2 flex flex-col ${
                        isMe
                          ? "bg-black/20 border-white/60 text-pink-100"
                          : "bg-black/30 border-pink-400 text-fuchsia-200"
                      }`}
                    >
                      <span className="font-bold">{msg.replyTo.senderName}</span>
                      <span className="truncate opacity-90">{msg.replyTo.content}</span>
                    </div>
                  )}

                  {/* Attachment Preview (Image or File) */}
                  {msg.attachment && (
                    <div className="mb-2 rounded-xl overflow-hidden border border-white/20">
                      {msg.attachment.type === "image" ? (
                        <img
                          src={msg.attachment.url}
                          alt={msg.attachment.name}
                          onClick={() => setZoomedImage(msg.attachment!.url)}
                          className="max-h-48 w-full object-cover cursor-pointer hover:scale-[1.02] transition"
                        />
                      ) : (
                        <div className="p-2.5 bg-black/30 flex items-center gap-2 text-xs">
                          <Paperclip className="w-4 h-4 text-pink-300 shrink-0" />
                          <span className="truncate flex-1">{msg.attachment.name}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Content */}
                  <p className="text-xs leading-relaxed whitespace-pre-wrap select-text">
                    {msg.content}
                  </p>

                  {/* Footer: Time, Edited mark & Read status */}
                  <div
                    className={`flex items-center gap-1.5 mt-1 text-[9px] ${
                      isMe ? "text-pink-100/75 justify-end" : "text-fuchsia-300/70 justify-start"
                    }`}
                  >
                    {msg.isEdited && <span>({isRtl ? "معدلة" : "edited"})</span>}
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isMe && (
                      <span>
                        {msg.readBy.length > 1 ? (
                          <CheckCheck className="w-3 h-3 text-cyan-300" />
                        ) : (
                          <Check className="w-3 h-3 text-pink-200" />
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Reactions Display Under Bubble */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1 px-1">
                    {Object.entries(msg.reactions).map(([emoji, users]) => {
                      const hasReacted = users.includes(currentUserId);
                      return (
                        <button
                          key={emoji}
                          onClick={() => toggleMessageReaction(msg.id, emoji, currentUserId)}
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold transition border ${
                            hasReacted
                              ? "bg-pink-500/30 border-pink-400 text-white shadow-xs"
                              : "glass-dark border-fuchsia-400/20 text-fuchsia-200 hover:border-pink-400"
                          }`}
                        >
                          <span>{emoji}</span>
                          <span className="tabular-nums text-[9px]">{users.length}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Floating Action Menu Bar on Hover / Tap */}
                <div
                  className={`flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Quick Reactions */}
                  <button
                    onClick={() => toggleMessageReaction(msg.id, "❤️", currentUserId)}
                    className="p-1 rounded-full glass-dark text-xs hover:scale-125 transition"
                    title="Love"
                  >
                    ❤️
                  </button>
                  <button
                    onClick={() => toggleMessageReaction(msg.id, "🌸", currentUserId)}
                    className="p-1 rounded-full glass-dark text-xs hover:scale-125 transition"
                    title="Rose"
                  >
                    🌸
                  </button>
                  <button
                    onClick={() => toggleMessageReaction(msg.id, "🫂", currentUserId)}
                    className="p-1 rounded-full glass-dark text-xs hover:scale-125 transition"
                    title="Hug"
                  >
                    🫂
                  </button>

                  {/* Reply Button */}
                  <button
                    onClick={() => setReplyingTo(msg)}
                    className="p-1 rounded-full glass-dark text-fuchsia-200 hover:text-white text-xs"
                    title={isRtl ? "رد على الرسالة" : "Reply"}
                  >
                    <Reply className="w-3 h-3" />
                  </button>

                  {/* Edit (if own) */}
                  {isMe && !msg.isDeleted && (
                    <button
                      onClick={() => {
                        setEditingMessage(msg);
                        setEditText(msg.content);
                      }}
                      className="p-1 rounded-full glass-dark text-fuchsia-200 hover:text-white text-xs"
                      title={isRtl ? "تعديل" : "Edit"}
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}

                  {/* Delete (if own or moderator) */}
                  {(isMe || isModerator) && (
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            isRtl ? "هل أنتِ متأكدة من حذف هذه الرسالة؟" : "Delete this message?",
                          )
                        ) {
                          deleteChatMessage(msg.id, currentUserId, isModerator);
                          toast.success(isRtl ? "تم حذف الرسالة" : "Message deleted");
                        }
                      }}
                      className="p-1 rounded-full glass-dark text-rose-300 hover:text-rose-100 text-xs"
                      title={isRtl ? "حذف" : "Delete"}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}

                  {/* Report (if not own) */}
                  {!isMe && (
                    <button
                      onClick={() => triggerReport(msg.id, msg.content, msg.senderId)}
                      className="p-1 rounded-full glass-dark text-amber-300 hover:text-amber-100 text-xs"
                      title={isRtl ? "إبلاغ عن محتوى غير لائق" : "Report"}
                    >
                      <Flag className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 5. Replying To Bar (if active) */}
      {replyingTo && (
        <div className="p-2 px-3 bg-purple-950/90 border-t border-fuchsia-400/30 flex items-center justify-between text-xs animate-fade-in shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Reply className="w-3.5 h-3.5 text-pink-400 shrink-0" />
            <div className="truncate">
              <span className="font-bold text-pink-300">
                {isRtl ? "الرد على" : "Replying to"}{" "}
                {replyingTo.senderNickname || replyingTo.senderName}:
              </span>
              <span className="text-white/80 ms-1 truncate">{replyingTo.content}</span>
            </div>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-fuchsia-300 hover:text-white shrink-0 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 6. Pending Attachment Preview Bar (if active) */}
      {attachment && (
        <div className="p-2 px-3 bg-fuchsia-950/80 border-t border-fuchsia-400/30 flex items-center justify-between text-xs animate-fade-in shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {attachment.type === "image" ? (
              <img src={attachment.url} alt="thumb" className="w-8 h-8 rounded object-cover" />
            ) : (
              <Paperclip className="w-4 h-4 text-pink-300 shrink-0" />
            )}
            <span className="truncate text-white text-[11px]">{attachment.name}</span>
          </div>
          <button
            onClick={() => setAttachment(null)}
            className="text-fuchsia-300 hover:text-white shrink-0 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 7. Safety Warning Strip (if risky content detected in real-time) */}
      {!safetyStatus.isSafe && (
        <div className="p-2 px-3 bg-amber-950/90 border-t border-amber-400/40 flex items-center gap-2 text-[10px] text-amber-200 animate-pulse shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{safetyStatus.warning}</span>
        </div>
      )}

      {/* 8. Emoji Quick Bar (if toggled) */}
      {showEmojiPicker && (
        <div className="p-2 px-3 bg-black/80 border-t border-fuchsia-500/20 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {SUPPORTIVE_EMOJIS.map((em) => (
            <button
              key={em}
              onClick={() => {
                setInputText((prev) => prev + em);
              }}
              className="text-lg hover:scale-125 transition p-1"
            >
              {em}
            </button>
          ))}
        </div>
      )}

      {/* 9. Message Input Bar */}
      <div className="p-2.5 bg-slate-950 border-t border-fuchsia-500/25 flex items-center gap-2 shrink-0">
        {/* Attachment Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-9 h-9 rounded-2xl glass-dark text-fuchsia-200 hover:text-white flex items-center justify-center border border-fuchsia-400/20 transition shrink-0"
          title={isRtl ? "مشاركة صورة أو ملف" : "Attach image/file"}
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFilePick} />

        {/* Emoji Bar Toggle */}
        <button
          onClick={() => setShowEmojiPicker((p) => !p)}
          className={`w-9 h-9 rounded-2xl flex items-center justify-center transition shrink-0 ${
            showEmojiPicker
              ? "bg-pink-500 text-white shadow-md shadow-pink-500/30"
              : "glass-dark text-fuchsia-200 hover:text-white border border-fuchsia-400/20"
          }`}
          title={isRtl ? "رموز تعبيرية" : "Emojis"}
        >
          <Smile className="w-4 h-4" />
        </button>

        {/* Text Input */}
        <textarea
          rows={1}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={
            isRtl ? `اكتبي رسالتكِ في ${group.nameAr}...` : `Message in ${group.nameFr}...`
          }
          className="flex-1 bg-slate-900/90 text-xs text-white placeholder-fuchsia-300/40 rounded-2xl p-2.5 px-3.5 border border-fuchsia-400/25 focus:border-pink-400 focus:outline-none resize-none max-h-24"
        />

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim() && !attachment}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition shadow-lg shrink-0 ${
            inputText.trim() || attachment
              ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-fuchsia-950/60 hover:scale-105 active:scale-95"
              : "glass-dark text-fuchsia-400/40 cursor-not-allowed"
          }`}
          title={isRtl ? "إرسال" : "Send"}
        >
          <Send className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* 10. Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-950 border border-fuchsia-400/40 rounded-3xl p-5 max-w-sm w-full space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-fuchsia-400/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-500/20 flex items-center justify-center text-lg">
                  {group.icon}
                </div>
                <h3 className="text-xs font-bold text-white">
                  {isRtl ? "قواعد وإرشادات المجموعة" : "Group Rules & Guidelines"}
                </h3>
              </div>
              <button
                onClick={() => setShowRulesModal(false)}
                className="w-7 h-7 rounded-full glass-dark text-fuchsia-200 hover:text-white flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-fuchsia-200/90 leading-relaxed">
                {isRtl ? group.descriptionAr : group.descriptionFr}
              </p>

              <div className="p-3 rounded-2xl bg-purple-950/40 border border-fuchsia-400/25 space-y-1">
                <span className="font-bold text-pink-300 block">
                  {isRtl ? "ميثاق الأمان والاحترام:" : "Safety Code:"}
                </span>
                <p className="text-[11px] text-white/90 leading-relaxed">
                  {isRtl ? group.rulesAr : group.rulesFr}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-1 text-[10px] text-rose-200">
                <span className="font-bold text-rose-300 block">
                  {isRtl ? "تنبيه طبي صارم:" : "Strict Medical Notice:"}
                </span>
                <p>
                  {isRtl
                    ? "يُمنع منعاً باتاً التوصية بإيقاف أدوية أو تعديل جرعات أو تقديم وصفات طبية غير معتمدة. استشيري طبيبك دائماً."
                    : "Never advise modifying prescriptions or stopping treatments. Always consult your oncologist."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-bold text-xs shadow-md"
            >
              {isRtl ? "فهمت والتزم بالقواعد" : "I Agree to Rules"}
            </button>
          </div>
        </div>
      )}

      {/* 11. Edit Message Inline Dialog */}
      {editingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-950 border border-fuchsia-400/40 rounded-3xl p-4 max-w-sm w-full space-y-3 shadow-2xl">
            <h4 className="text-xs font-bold text-white">
              {isRtl ? "تعديل الرسالة" : "Edit Message"}
            </h4>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-slate-900 text-xs text-white rounded-xl p-2.5 border border-fuchsia-400/30 focus:border-pink-400 focus:outline-none"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setEditingMessage(null)}
                className="flex-1 py-2 rounded-xl glass-dark text-xs text-fuchsia-200 hover:text-white"
              >
                {isRtl ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={() => {
                  if (editText.trim()) {
                    editChatMessage(editingMessage.id, editText, currentUserId);
                    setEditingMessage(null);
                    toast.success(isRtl ? "تم تعديل الرسالة" : "Message edited");
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-xs font-bold text-white shadow"
              >
                {isRtl ? "حفظ التعديل" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 12. Zoomed Image Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in cursor-zoom-out"
        >
          <img
            src={zoomedImage}
            alt="zoom"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
