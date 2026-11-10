import { useState } from "react";
import {
  X,
  MessageCircle,
  Bookmark,
  Send,
  User as UserIcon,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import type { CommunityPost, ReactionType } from "@/types/community";
import {
  addComment,
  toggleReaction,
  toggleSavePost,
  getUserCommunityNickname,
} from "@/lib/communityStorage";

type PostDetailModalProps = {
  post: CommunityPost;
  currentUserId: string;
  currentUserName: string;
  onClose: () => void;
  onPostUpdated: () => void;
  lang?: "ar" | "en";
};

const REACTIONS: { type: ReactionType; emoji: string; labelAr: string; labelEn: string }[] = [
  { type: "love", emoji: "❤️", labelAr: "حب", labelEn: "Love" },
  { type: "hug", emoji: "🫂", labelAr: "حضن", labelEn: "Hug" },
  { type: "strength", emoji: "💪", labelAr: "قوة", labelEn: "Strength" },
  { type: "hope", emoji: "🌸", labelAr: "أمل", labelEn: "Hope" },
];

export function PostDetailModal({
  post,
  currentUserId,
  currentUserName,
  onClose,
  onPostUpdated,
  lang = "ar",
}: PostDetailModalProps) {
  const [commentText, setCommentText] = useState("");
  const [useNickname, setUseNickname] = useState(true);
  const [showSensitive, setShowSensitive] = useState(!post.sensitiveContent);

  const nickname = getUserCommunityNickname() || "أخت داعمة 🌸";
  const isSaved = post.savedBy?.includes(currentUserId);
  const userReaction = post.userReactions?.[currentUserId];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(post.id, {
      authorId: currentUserId,
      authorName: currentUserName,
      authorNickname: nickname,
      useNickname,
      content: commentText.trim(),
    });

    setCommentText("");
    toast.success(lang === "ar" ? "أُضيف تعليقكِ الداعم بنجاح 💗" : "Your comment was added 💗");
    onPostUpdated();
  };

  const handleReactionClick = (r: ReactionType) => {
    toggleReaction(post.id, currentUserId, r);
    onPostUpdated();
  };

  const displayName = post.useNickname ? post.authorNickname : post.authorName;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border rounded-3xl p-5 max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl my-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-border/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
              {post.authorAvatar ? (
                <img src={post.authorAvatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">{displayName}</p>
              <p className="text-[11px] text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Post Content & Comments */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Medical disclaimer note */}
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-primary/5 border border-primary/15 text-xs text-primary/80">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span className="text-[11px]">
              {lang === "ar"
                ? "تذكير: الآراء والمشاركات تعكس تجارب شخصية ولا تغني عن استشارة طبيبكِ المعالج."
                : "Reminder: Personal shared reflections do not substitute direct medical consultation."}
            </span>
          </div>

          {/* Title & Body */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-foreground">{post.title}</h2>

            {post.sensitiveContent && !showSensitive ? (
              <div className="p-3.5 rounded-2xl bg-muted/60 border border-border/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <EyeOff className="w-4 h-4 text-amber-600" />
                  <span>{lang === "ar" ? "محتوى حساس (مخفي)" : "Sensitive content (hidden)"}</span>
                </div>
                <button
                  onClick={() => setShowSensitive(true)}
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{lang === "ar" ? "إظهار المحتوى" : "Reveal"}</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-[10px] bg-secondary/80 text-secondary-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Reactions bar */}
          <div className="p-3 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {REACTIONS.map((r) => {
                const count = post.reactions?.[r.type] || 0;
                const isSelected = userReaction === r.type;
                return (
                  <button
                    key={r.type}
                    onClick={() => handleReactionClick(r.type)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-bold shadow-xs scale-105"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <span>{r.emoji}</span>
                    <span className="text-[11px] font-mono">{count}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                toggleSavePost(post.id, currentUserId);
                onPostUpdated();
              }}
              className={`p-2 rounded-full transition ${
                isSaved ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-primary" : ""}`} />
            </button>
          </div>

          {/* Comments section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span>
                  {lang === "ar" ? "الردود والتجارب الداعمة" : "Supportive Responses"} (
                  {post.comments?.length || 0})
                </span>
              </h3>
            </div>

            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-2.5">
                {post.comments.map((comm) => {
                  const commName = comm.useNickname ? comm.authorNickname : comm.authorName;
                  return (
                    <div
                      key={comm.id}
                      className="p-3 rounded-2xl bg-muted/40 border border-border/40 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary text-[11px]">{commName}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(comm.createdAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-foreground/85 leading-relaxed">{comm.content}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-4 text-xs text-muted-foreground">
                {lang === "ar"
                  ? "لا توجد ردود بعد. كوني أول من يقدم كلمة تشجيع دافئة 💗"
                  : "No replies yet. Be the first to share an encouraging word 💗"}
              </p>
            )}
          </div>
        </div>

        {/* Add comment input bar */}
        <form
          onSubmit={handleAddComment}
          className="pt-3 border-t border-border/60 shrink-0 space-y-2"
        >
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={useNickname}
                onChange={(e) => setUseNickname(e.target.checked)}
                className="accent-primary rounded w-3.5 h-3.5"
              />
              <span>{lang === "ar" ? `الرد كـ "${nickname}"` : `Reply as "${nickname}"`}</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                lang === "ar" ? "اكتبي كلمة طيبة أو تجربة ملهمة..." : "Write a kind reply..."
              }
              className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-hidden focus:border-primary"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="h-9 px-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-1 disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>{lang === "ar" ? "إرسال" : "Send"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
