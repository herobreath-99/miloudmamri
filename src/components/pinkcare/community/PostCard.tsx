import { useState } from "react";
import {
  MessageCircle,
  Bookmark,
  MoreVertical,
  ShieldAlert,
  UserX,
  Eye,
  EyeOff,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { CommunityPost, ReactionType } from "@/types/community";
import { toggleReaction, toggleSavePost, blockUser } from "@/lib/communityStorage";

type PostCardProps = {
  post: CommunityPost;
  currentUserId: string;
  onOpenDetail: (post: CommunityPost) => void;
  onOpenReport: (post: CommunityPost) => void;
  onPostUpdated: () => void;
  lang?: "ar" | "en";
};

const CATEGORY_MAP: Record<string, { labelAr: string; labelEn: string; icon: string }> = {
  treatment: { labelAr: "تجارب العلاج", labelEn: "Treatment", icon: "🩺" },
  emotional: { labelAr: "الدعم النفسي", labelEn: "Emotional", icon: "🌸" },
  recovery: { labelAr: "مرحلة التعافي", labelEn: "Recovery", icon: "🌿" },
  self_care: { labelAr: "العناية اليومية", labelEn: "Self-care", icon: "✨" },
  qa: { labelAr: "أسئلة وإجابات", labelEn: "Q&A", icon: "💬" },
  motivation: { labelAr: "تحفيز وتشجيع", labelEn: "Motivation", icon: "💖" },
};

const REACTIONS: { type: ReactionType; emoji: string; labelAr: string; labelEn: string }[] = [
  { type: "love", emoji: "❤️", labelAr: "حب", labelEn: "Love" },
  { type: "hug", emoji: "🫂", labelAr: "حضن", labelEn: "Hug" },
  { type: "strength", emoji: "💪", labelAr: "قوة", labelEn: "Strength" },
  { type: "hope", emoji: "🌸", labelAr: "أمل", labelEn: "Hope" },
];

export function PostCard({
  post,
  currentUserId,
  onOpenDetail,
  onOpenReport,
  onPostUpdated,
  lang = "ar",
}: PostCardProps) {
  const [showSensitive, setShowSensitive] = useState(!post.sensitiveContent);
  const [showMenu, setShowMenu] = useState(false);

  const isSaved = post.savedBy?.includes(currentUserId);
  const userReaction = post.userReactions?.[currentUserId];

  const handleReactionClick = (r: ReactionType) => {
    toggleReaction(post.id, currentUserId, r);
    onPostUpdated();
  };

  const handleToggleSave = () => {
    const saved = toggleSavePost(post.id, currentUserId);
    toast.success(
      saved
        ? lang === "ar"
          ? "تم حفظ المنشور في المفضلة 🔖"
          : "Saved to bookmarks 🔖"
        : lang === "ar"
          ? "تمت إزالة المنشور من المفضلة"
          : "Removed from bookmarks",
    );
    onPostUpdated();
  };

  const handleBlockAuthor = () => {
    const displayName = post.useNickname ? post.authorNickname : post.authorName;
    blockUser(post.authorId, displayName);
    toast.success(
      lang === "ar"
        ? `تم حظر ${displayName} وإخفاء منشوراتها من تغذيتكِ.`
        : `Blocked ${displayName} and hid their posts.`,
    );
    setShowMenu(false);
    onPostUpdated();
  };

  const catMeta = CATEGORY_MAP[post.category] || {
    labelAr: "عام",
    labelEn: "General",
    icon: "🌸",
  };

  const displayName = post.useNickname ? post.authorNickname : post.authorName;

  return (
    <article className="glass rounded-3xl p-5 border border-primary/20 space-y-3.5 hover:shadow-md transition relative">
      {/* Top Author & Category Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
            {post.authorAvatar ? (
              <img src={post.authorAvatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-foreground">{displayName}</span>
              {post.useNickname && (
                <span className="text-[10px] bg-secondary/80 text-secondary-foreground px-1.5 py-0.2 rounded-md">
                  {lang === "ar" ? "اسم مستعار" : "Nickname"}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span>{catMeta.icon}</span>
              <span>{lang === "ar" ? catMeta.labelAr : catMeta.labelEn}</span>
              <span>•</span>
              <span className="tabular-nums">
                {new Date(post.createdAt).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>
        </div>

        {/* Options Menu Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground"
            title="خيارات إضافية"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute end-0 top-8 z-30 w-44 rounded-2xl bg-card border border-border shadow-xl p-1.5 space-y-1 text-xs animate-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenReport(post);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-destructive hover:bg-destructive/10 text-start font-medium"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{lang === "ar" ? "إبلاغ عن محتوى" : "Report Content"}</span>
              </button>
              {post.authorId !== currentUserId && (
                <button
                  onClick={handleBlockAuthor}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-muted-foreground hover:bg-muted text-start"
                >
                  <UserX className="w-4 h-4" />
                  <span>{lang === "ar" ? "حظر الكاتبة" : "Block User"}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mandatory Peer Medical Disclaimer Ribbon */}
      <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-xl bg-primary/5 text-primary/80 text-[10px] font-medium border border-primary/10">
        <span>🛡️</span>
        <span>
          {lang === "ar"
            ? "تجربة شخصية ودعم نفسي • لا تُعد تشخيصاً أو بديلاً عن رأي الفريق الطبي"
            : "Peer experience • Not medical advice or diagnostic instruction"}
        </span>
      </div>

      {/* Title & Content */}
      <div className="space-y-1.5 cursor-pointer" onClick={() => onOpenDetail(post)}>
        <h3 className="font-bold text-foreground text-sm hover:text-primary transition">
          {post.title}
        </h3>

        {post.sensitiveContent && !showSensitive ? (
          <div className="p-3.5 rounded-2xl bg-muted/60 border border-border/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <EyeOff className="w-4 h-4 text-amber-600" />
              <span>
                {lang === "ar" ? "محتوى حساس (انقري للإظهار)" : "Sensitive content (tap to view)"}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSensitive(true);
              }}
              className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{lang === "ar" ? "عرض" : "Show"}</span>
            </button>
          </div>
        ) : (
          <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3">{post.content}</p>
        )}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[10px] bg-secondary/60 text-secondary-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Reactions & Actions Footer */}
      <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
        {/* Reaction Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {REACTIONS.map((r) => {
            const count = post.reactions?.[r.type] || 0;
            const isSelected = userReaction === r.type;
            return (
              <button
                key={r.type}
                onClick={() => handleReactionClick(r.type)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-bold shadow-xs scale-105"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
                title={lang === "ar" ? r.labelAr : r.labelEn}
              >
                <span>{r.emoji}</span>
                {count > 0 && <span className="text-[11px] tabular-nums font-mono">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Comment count & Bookmark */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenDetail(post)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-muted-foreground hover:bg-muted transition"
          >
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-[11px] tabular-nums font-mono">{post.commentsCount || 0}</span>
          </button>

          <button
            onClick={handleToggleSave}
            className={`p-1.5 rounded-full transition ${
              isSaved
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            title={lang === "ar" ? "حفظ المنشور" : "Bookmark"}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-primary" : ""}`} />
          </button>
        </div>
      </div>
    </article>
  );
}
