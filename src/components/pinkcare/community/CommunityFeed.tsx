import { useEffect, useState } from "react";
import { Search, Plus, Bookmark, Users, Sparkles, Shield, Filter } from "lucide-react";
import type { CommunityCategory, CommunityPost } from "@/types/community";
import { getCommunityPosts, getBlockedUsers } from "@/lib/communityStorage";
import { PostCard } from "./PostCard";
import { CreatePostModal } from "./CreatePostModal";
import { PostDetailModal } from "./PostDetailModal";
import { ReportContentModal } from "./ReportContentModal";
import { CommunityGuidelinesBanner } from "./CommunityGuidelinesBanner";

import type { Lang } from "@/lib/i18n";

type CommunityFeedProps = {
  currentUserId: string;
  currentUserName: string;
  lang?: Lang;
};

const CATEGORIES: {
  id: CommunityCategory | "all";
  labelAr: string;
  labelDz: string;
  labelFr: string;
  labelEn: string;
  icon: string;
}[] = [
  {
    id: "all",
    labelAr: "الكل",
    labelDz: "كامل المنشورات",
    labelFr: "Tous",
    labelEn: "All",
    icon: "✨",
  },
  {
    id: "treatment",
    labelAr: "تجارب العلاج",
    labelDz: "تجارب العلاج",
    labelFr: "Soins & Traitements",
    labelEn: "Treatment",
    icon: "🩺",
  },
  {
    id: "emotional",
    labelAr: "الدعم النفسي",
    labelDz: "الدعم النفسي والمورال",
    labelFr: "Soutien émotionnel",
    labelEn: "Emotional",
    icon: "🌸",
  },
  {
    id: "recovery",
    labelAr: "مرحلة التعافي",
    labelDz: "مرحلة الشفاء",
    labelFr: "Rétablissement",
    labelEn: "Recovery",
    icon: "🌿",
  },
  {
    id: "self_care",
    labelAr: "العناية اليومية",
    labelDz: "العناية اليومية",
    labelFr: "Soins au quotidien",
    labelEn: "Self-Care",
    icon: "✨",
  },
  {
    id: "qa",
    labelAr: "أسئلة وإجابات",
    labelDz: "سؤال وجواب",
    labelFr: "Questions & Réponses",
    labelEn: "Q&A",
    icon: "💬",
  },
  {
    id: "motivation",
    labelAr: "تحفيز وأمل",
    labelDz: "تحفيز وأمل",
    labelFr: "Motivation & Espoir",
    labelEn: "Motivation",
    icon: "💖",
  },
];

export function CommunityFeed({ currentUserId, currentUserName, lang = "ar" }: CommunityFeedProps) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory | "all">("all");
  const [onlySaved, setOnlySaved] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeDetailPost, setActiveDetailPost] = useState<CommunityPost | null>(null);
  const [activeReportPost, setActiveReportPost] = useState<CommunityPost | null>(null);
  const uiLang: "ar" | "en" = lang === "ar" || lang === "dz" ? "ar" : "en";

  const loadPosts = () => {
    const all = getCommunityPosts();
    const blocked = getBlockedUsers();
    const blockedIds = new Set(blocked.map((b) => b.blockedUserId));

    // Exclude blocked users and removed posts
    const visible = all.filter((p) => !blockedIds.has(p.authorId) && p.status !== "removed");
    setPosts(visible);
  };

  useEffect(() => {
    loadPosts();
    const handleUpdate = () => loadPosts();
    window.addEventListener("pinkcare:community-updated", handleUpdate);
    return () => window.removeEventListener("pinkcare:community-updated", handleUpdate);
  }, []);

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    if (selectedCategory !== "all" && post.category !== selectedCategory) {
      return false;
    }
    if (onlySaved && !post.savedBy?.includes(currentUserId)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = post.title.toLowerCase().includes(q);
      const inContent = post.content.toLowerCase().includes(q);
      const inTags = post.tags?.some((t) => t.toLowerCase().includes(q));
      if (!inTitle && !inContent && !inTags) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Header intro */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {lang === "ar" ? "مجتمع PinkCare الداعم" : "PinkCare Support Community"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {lang === "ar"
                ? "مساحة خاصة وآمنة لتبادل التجارب والأمل"
                : "A private, safe haven for shared experiences & hope"}
            </p>
          </div>
        </div>

        {/* Create Post Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 rounded-2xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 shadow-md hover:opacity-90 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">
            {lang === "ar" ? "شاركي تجربتكِ" : "Share Story"}
          </span>
          <span className="sm:hidden">{lang === "ar" ? "نشر" : "Post"}</span>
        </button>
      </div>

      {/* Guidelines Banner */}
      <CommunityGuidelinesBanner lang={uiLang} />

      {/* Search & Saved Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === "ar" ? "ابحثي في تجارب الأخوات والوسوم..." : "Search stories and tags..."
            }
            className="w-full bg-card border border-border rounded-2xl ps-9 pe-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary shadow-xs"
          />
        </div>

        <button
          onClick={() => setOnlySaved(!onlySaved)}
          className={`flex items-center gap-1 px-3 py-2 rounded-2xl text-xs font-semibold border transition ${
            onlySaved
              ? "bg-primary text-primary-foreground border-primary shadow-xs"
              : "bg-card border-border hover:bg-muted text-muted-foreground"
          }`}
          title={lang === "ar" ? "المنشورات المحفوظة" : "Saved posts"}
        >
          <Bookmark className={`w-3.5 h-3.5 ${onlySaved ? "fill-primary-foreground" : ""}`} />
          <span className="hidden sm:inline">{lang === "ar" ? "المفضلة" : "Saved"}</span>
        </button>
      </div>

      {/* Categories Filter Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition ${
              selectedCategory === cat.id
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "bg-card/70 hover:bg-muted border border-border/60 text-muted-foreground"
            }`}
          >
            <span>{cat.icon}</span>
            <span>
              {lang === "dz"
                ? cat.labelDz
                : lang === "fr"
                  ? cat.labelFr
                  : lang === "en"
                    ? cat.labelEn
                    : cat.labelAr}
            </span>
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              onOpenDetail={(p) => setActiveDetailPost(p)}
              onOpenReport={(p) => setActiveReportPost(p)}
              onPostUpdated={loadPosts}
              lang={uiLang}
            />
          ))
        ) : (
          <div className="glass rounded-3xl p-8 text-center space-y-3 border border-dashed border-border/80">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center text-primary">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="font-bold text-foreground text-sm">
              {lang === "ar" ? "لا توجد مشاركات تطابق بحثكِ" : "No posts found"}
            </p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              {lang === "ar"
                ? "كوني أول من يشارك تجربة ملهمة أو يطرح تساؤلاً داعماً لأخواتكِ."
                : "Be the first to share an inspiring story or question."}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-2xl bg-primary text-primary-foreground text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === "ar" ? "إنشاء مشاركة جديدة" : "Create New Post"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreatePostModal
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          onClose={() => setShowCreateModal(false)}
          onPostCreated={loadPosts}
          lang={uiLang}
        />
      )}

      {/* Post Detail Modal */}
      {activeDetailPost && (
        <PostDetailModal
          post={activeDetailPost}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          onClose={() => setActiveDetailPost(null)}
          onPostUpdated={loadPosts}
          lang={uiLang}
        />
      )}

      {/* Report Modal */}
      {activeReportPost && (
        <ReportContentModal
          targetType="post"
          targetId={activeReportPost.id}
          targetPreview={activeReportPost.content}
          authorId={activeReportPost.authorId}
          reporterId={currentUserId}
          reporterName={currentUserName}
          onClose={() => setActiveReportPost(null)}
          lang={uiLang}
        />
      )}
    </div>
  );
}
