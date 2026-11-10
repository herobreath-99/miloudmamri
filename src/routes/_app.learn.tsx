import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Play,
  Search,
  Heart,
  Share2,
  Clock,
  Sparkles,
  History,
  Info,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  Lightbulb,
  Settings,
  Plus,
  Eye,
  Film,
  Compass,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { EDUCATION_CATEGORIES } from "@/data/educationalArticles";
import type { EducationalArticle, EducationalVideo, EducationCategoryId } from "@/types/education";
import {
  getStoredArticles,
  getStoredVideos,
  getFavoriteArticleIds,
  toggleFavoriteArticle,
  getFavoriteVideoIds,
  toggleFavoriteVideo,
  getRecentVideos,
  getYouTubeThumbnail,
} from "@/lib/educationStore";
import { ArticleDetailModal } from "@/components/pinkcare/ArticleDetailModal";
import { VideoPlayerModal } from "@/components/pinkcare/VideoPlayerModal";
import { EducationAdminModal } from "@/components/pinkcare/EducationAdminModal";
import { CATEGORIES as TIP_CATEGORIES, TIPS, getDailyTip, type Tip } from "@/data/tips";
import { TipDetailsDialog } from "@/components/pinkcare/TipDetailsDialog";

export const Route = createFileRoute("/_app/learn")({
  component: EducationCenterPage,
});

type MainTab = "articles" | "videos" | "tips";

function EducationCenterPage() {
  const { lang } = useI18n();
  const ar = lang === "ar";

  // Navigation tabs
  const [mainTab, setMainTab] = useState<MainTab>("articles");

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EducationCategoryId | "all">("all");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Data state
  const [articles, setArticles] = useState<EducationalArticle[]>([]);
  const [videos, setVideos] = useState<EducationalVideo[]>([]);
  const [favArticleIds, setFavArticleIds] = useState<string[]>([]);
  const [favVideoIds, setFavVideoIds] = useState<string[]>([]);
  const [recentEntries, setRecentEntries] = useState<{ videoId: string; watchedAt: number }[]>([]);

  // Dialog states
  const [selectedArticle, setSelectedArticle] = useState<EducationalArticle | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<EducationalVideo | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);

  // Tips state (legacy preservation)
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
  const dailyTip = useMemo(() => getDailyTip(), []);

  // Reload store data
  const reloadData = () => {
    setArticles(getStoredArticles());
    setVideos(getStoredVideos());
    setFavArticleIds(getFavoriteArticleIds());
    setFavVideoIds(getFavoriteVideoIds());
    setRecentEntries(getRecentVideos());
  };

  useEffect(() => {
    reloadData();
    const handleArticlesChanged = () => setArticles(getStoredArticles());
    const handleVideosChanged = () => setVideos(getStoredVideos());
    const handleFavArticles = () => setFavArticleIds(getFavoriteArticleIds());
    const handleFavVideos = () => setFavVideoIds(getFavoriteVideoIds());

    window.addEventListener("pc:articles-changed", handleArticlesChanged);
    window.addEventListener("pc:videos-changed", handleVideosChanged);
    window.addEventListener("pc:fav-articles-changed", handleFavArticles);
    window.addEventListener("pc:fav-videos-changed", handleFavVideos);

    return () => {
      window.removeEventListener("pc:articles-changed", handleArticlesChanged);
      window.removeEventListener("pc:videos-changed", handleVideosChanged);
      window.removeEventListener("pc:fav-articles-changed", handleFavArticles);
      window.removeEventListener("pc:fav-videos-changed", handleFavVideos);
    };
  }, []);

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchCat = selectedCategory === "all" || art.categoryId === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        art.title_ar.toLowerCase().includes(q) ||
        art.title_en.toLowerCase().includes(q) ||
        art.summary_ar.toLowerCase().includes(q) ||
        art.summary_en.toLowerCase().includes(q);
      const matchFav = !onlyFavorites || favArticleIds.includes(art.id);
      return matchCat && matchQuery && matchFav;
    });
  }, [articles, selectedCategory, searchQuery, onlyFavorites, favArticleIds]);

  // Filtered Videos
  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const matchCat = selectedCategory === "all" || v.categoryId === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        v.title_ar.toLowerCase().includes(q) ||
        v.title_en.toLowerCase().includes(q) ||
        (v.description_ar && v.description_ar.toLowerCase().includes(q)) ||
        (v.description_en && v.description_en.toLowerCase().includes(q));
      const matchFav = !onlyFavorites || favVideoIds.includes(v.id);
      return matchCat && matchQuery && matchFav;
    });
  }, [videos, selectedCategory, searchQuery, onlyFavorites, favVideoIds]);

  // Recently watched videos list
  const recentVideos = useMemo(() => {
    return recentEntries
      .map((entry) => videos.find((v) => v.id === entry.videoId || v.youtubeId === entry.videoId))
      .filter((v): v is EducationalVideo => Boolean(v))
      .slice(0, 5);
  }, [recentEntries, videos]);

  const handleShareVideo = async (v: EducationalVideo, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = v.originalUrl || `https://youtu.be/${v.youtubeId}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: ar ? v.title_ar : v.title_en,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success(ar ? "تم نسخ رابط الفيديو" : "Video link copied");
      }
    } catch {
      // Ignore share cancellation
    }
  };

  const handleToggleFavVideo = (v: EducationalVideo, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = toggleFavoriteVideo(v.id);
    setFavVideoIds(getFavoriteVideoIds());
    toast.success(
      ar
        ? next
          ? "أُضيف الفيديو إلى المفضلة 💖"
          : "أُزيل الفيديو من المفضلة"
        : next
          ? "Added to favorites 💖"
          : "Removed from favorites",
    );
  };

  const handleToggleFavArticle = (art: EducationalArticle, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = toggleFavoriteArticle(art.id);
    setFavArticleIds(getFavoriteArticleIds());
    toast.success(
      ar
        ? next
          ? "أُضيف المقال إلى المفضلة 💖"
          : "أُزيل المقال من المفضلة"
        : next
          ? "Added to favorites 💖"
          : "Removed from favorites",
    );
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Header Banner */}
      <section className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          {ar ? "المركز الطبي والتوعوي" : "Educational & Awareness Center"}
        </div>
        <h2 className="text-2xl font-bold text-primary">
          {ar ? "دليلكِ المعرفي للعافية" : "Knowledge & Awareness Center"}
        </h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          {ar
            ? "مقالات طبية موثوقة ومكتبة مرئية شاملة لدعمكِ في كل محطة"
            : "Clinically verified articles and interactive video library for your care"}
        </p>
      </section>

      {/* Medical Disclaimer Banner */}
      <div className="rounded-2xl p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-950 dark:text-amber-200 text-xs leading-relaxed flex gap-2.5 items-start">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-start">
          <span className="font-bold">{ar ? "تنويه طبي هام: " : "Medical Disclaimer: "}</span>
          <span>
            {ar
              ? "المعلومات المنشورة هنا لأغراض التوعية والتثقيف الصحي فقط، ولا تُعد بأي حال بديلاً عن التشخيص الطبي أو استشارة طبيب الأورام المعالج."
              : "All content is provided strictly for educational purposes and is never a substitute for direct diagnosis or personalized oncologist consultation."}
          </span>
        </div>
      </div>

      {/* Main Mode Tabs & Admin Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 glass rounded-2xl p-1 flex gap-1">
          <button
            onClick={() => setMainTab("articles")}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              mainTab === "articles"
                ? "btn-glow shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {ar ? "المقالات والأدلة" : "Articles"}
          </button>
          <button
            onClick={() => setMainTab("videos")}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              mainTab === "videos"
                ? "btn-glow shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            {ar ? "مكتبة الفيديوهات" : "Videos"}
          </button>
          <button
            onClick={() => setMainTab("tips")}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              mainTab === "tips"
                ? "btn-glow shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {ar ? "نصائح يومية" : "Daily Tips"}
          </button>
        </div>

        {/* Admin / Editor Button */}
        <button
          onClick={() => setAdminOpen(true)}
          title={ar ? "إدارة المحتوى (للمحررين والأطباء)" : "Content Management (Editor)"}
          className="w-10 h-10 rounded-2xl glass text-primary hover:bg-primary/10 flex items-center justify-center transition shrink-0"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Search & Favorites Bar (for Articles and Videos) */}
      {mainTab !== "tips" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="glass rounded-full flex-1 flex items-center gap-2 px-4 py-2.5">
              <Search className="w-4 h-4 text-primary" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  mainTab === "articles"
                    ? ar
                      ? "ابحثي في المقالات والأدلة الطبية..."
                      : "Search articles and clinical guides..."
                    : ar
                      ? "ابحثي في الفيديوهات التوعوية..."
                      : "Search educational videos..."
                }
                className="flex-1 bg-transparent outline-none text-xs placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setOnlyFavorites((prev) => !prev)}
              aria-label="Filter Favorites"
              title={ar ? "المفضلة فقط" : "Favorites only"}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition shrink-0 ${
                onlyFavorites
                  ? "bg-primary text-primary-foreground shadow"
                  : "glass text-primary hover:bg-primary/10"
              }`}
            >
              <Heart className={`w-4 h-4 ${onlyFavorites ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* 10 Categorized Sections Selector */}
          <div className="overflow-x-auto no-scrollbar pb-1 -mx-2 px-2 flex gap-1.5">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition ${
                selectedCategory === "all" ? "btn-glow" : "glass text-primary"
              }`}
            >
              {ar ? "كافة الأقسام" : "All Sections"}
            </button>
            {EDUCATION_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition flex items-center gap-1 ${
                  selectedCategory === cat.id ? "btn-glow" : "glass text-primary"
                }`}
              >
                <span>{ar ? cat.title_ar : cat.title_en}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 1: ARTICLES ================= */}
      {mainTab === "articles" && (
        <div className="space-y-4">
          {/* Section Count Indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              {ar
                ? `عرض ${filteredArticles.length} من أصل ${articles.length} دليلاً طبياً`
                : `Showing ${filteredArticles.length} of ${articles.length} guides`}
            </span>
            {onlyFavorites && (
              <span className="text-primary font-bold">
                {ar ? "عرض المفضلة فقط" : "Favorites only"}
              </span>
            )}
          </div>

          {/* Articles Grid / List */}
          <div className="space-y-3">
            {filteredArticles.map((art) => {
              const cat = EDUCATION_CATEGORIES.find((c) => c.id === art.categoryId);
              const isFav = favArticleIds.includes(art.id);
              return (
                <article
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className="glass rounded-3xl p-4 md:p-5 space-y-3 cursor-pointer hover:scale-[1.01] hover:border-primary/30 transition text-start relative overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-primary/90 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {cat ? (ar ? cat.title_ar : cat.title_en) : ""}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 tabular-nums num-en">
                        <Clock className="w-3 h-3" />
                        {art.readingTimeMinutes} {ar ? "دقائق" : "min"}
                      </span>
                      <button
                        onClick={(e) => handleToggleFavArticle(art, e)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                          isFav ? "text-primary" : "text-muted-foreground hover:text-primary"
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${isFav ? "fill-primary text-primary" : ""}`}
                        />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-primary leading-snug">
                    {ar ? art.title_ar : art.title_en}
                  </h3>

                  <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2">
                    {ar ? art.summary_ar : art.summary_en}
                  </p>

                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                    <span className="text-primary font-bold flex items-center gap-1">
                      {ar ? "قراءة الدليل كاملاً" : "Read Full Guide"}
                      {ar ? (
                        <ChevronLeft className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {art.references?.[0]?.organization || "WHO / ASCO"}
                    </span>
                  </div>
                </article>
              );
            })}

            {filteredArticles.length === 0 && (
              <div className="text-center py-12 glass rounded-3xl p-6 space-y-2">
                <BookOpen className="w-8 h-8 text-muted-foreground mx-auto" />
                <p className="font-bold text-primary text-sm">
                  {ar
                    ? "لم يتم العثور على مقالات تطابق بحثك"
                    : "No articles found matching your query"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {ar
                    ? "جربي البحث بكلمات أخرى أو تغيير القسم"
                    : "Try different keywords or section filters"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: VIDEOS ================= */}
      {mainTab === "videos" && (
        <div className="space-y-4">
          {/* Recently Watched Shelf */}
          {recentVideos.length > 0 && !onlyFavorites && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1 font-semibold">
                <History className="w-3.5 h-3.5 text-primary" />
                <span>{ar ? "فيديوهات شاهدتِها مؤخراً" : "Recently Watched"}</span>
              </div>
              <div className="overflow-x-auto no-scrollbar flex gap-2.5 pb-1 -mx-1 px-1">
                {recentVideos.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVideo(v)}
                    className="w-40 glass rounded-2xl p-2 shrink-0 text-start space-y-1.5 hover:scale-[1.02] transition"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                      <img
                        src={getYouTubeThumbnail(v.youtubeId)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow">
                          <Play className="w-3.5 h-3.5 text-primary fill-primary ms-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 end-1 bg-black/75 text-white text-[9px] px-1 rounded tabular-nums num-en">
                        {v.duration}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-primary truncate">
                      {ar ? v.title_ar : v.title_en}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Videos Grid */}
          <div className="space-y-3">
            {filteredVideos.map((v) => {
              const cat = EDUCATION_CATEGORIES.find((c) => c.id === v.categoryId);
              const isFav = favVideoIds.includes(v.id);
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVideo(v)}
                  className="glass rounded-3xl overflow-hidden cursor-pointer hover:border-primary/30 transition group"
                >
                  {/* Thumbnail & Play Overlay */}
                  <div className="relative aspect-video w-full bg-black overflow-hidden">
                    <img
                      src={getYouTubeThumbnail(v.youtubeId)}
                      alt={ar ? v.title_ar : v.title_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                    {/* Central Play Badge */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition"
                        style={{
                          background: "var(--gradient-primary)",
                          boxShadow: "0 8px 24px oklch(0.7 0.15 350 / 0.6)",
                        }}
                      >
                        <Play className="w-6 h-6 text-white fill-white ms-1" />
                      </div>
                    </div>

                    {/* Duration & Views info */}
                    <div className="absolute bottom-2 start-2 flex items-center gap-2 text-white text-[10px]">
                      <span className="bg-black/70 backdrop-blur px-2 py-0.5 rounded flex items-center gap-1 tabular-nums num-en">
                        <Clock className="w-3 h-3" />
                        {v.duration}
                      </span>
                      {v.views && (
                        <span className="bg-black/70 backdrop-blur px-2 py-0.5 rounded flex items-center gap-1 tabular-nums num-en">
                          <Eye className="w-3 h-3" />
                          {v.views}
                        </span>
                      )}
                    </div>

                    {v.isShort && (
                      <span className="absolute top-2 start-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        SHORTS
                      </span>
                    )}
                  </div>

                  {/* Title and Controls */}
                  <div className="p-3.5 flex items-center justify-between gap-3 text-start">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-primary uppercase">
                        {cat ? (ar ? cat.title_ar : cat.title_en) : v.categoryId}
                      </span>
                      <h4 className="font-bold text-sm text-foreground leading-snug line-clamp-2">
                        {ar ? v.title_ar : v.title_en}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => handleToggleFavVideo(v, e)}
                        aria-label="Favorite"
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                          isFav
                            ? "bg-primary text-primary-foreground shadow"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                      </button>
                      <button
                        onClick={(e) => handleShareVideo(v, e)}
                        aria-label="Share"
                        className="w-9 h-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredVideos.length === 0 && (
              <div className="text-center py-12 glass rounded-3xl p-6 space-y-2">
                <Film className="w-8 h-8 text-muted-foreground mx-auto" />
                <p className="font-bold text-primary text-sm">
                  {ar ? "لم يتم العثور على فيديوهات تطابق بحثك" : "No videos found"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {ar ? "جربي البحث باسم آخر أو إيقاف تصفية المفضلة" : "Try clearing filters"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: DAILY TIPS (Preserved) ================= */}
      {mainTab === "tips" && (
        <div className="space-y-4">
          {/* Daily Highlight Tip */}
          <button
            onClick={() => setSelectedTip(dailyTip)}
            className="w-full text-start glass rounded-3xl p-5 space-y-3 relative overflow-hidden hover:scale-[1.01] transition"
          >
            <div
              className="absolute -top-10 -end-10 w-40 h-40 rounded-full opacity-30"
              style={{ background: "var(--gradient-rose)" }}
            />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
                  {ar ? "نصيحة اليوم الصحية" : "Today's Tip"}
                </span>
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-primary text-start">
                {ar ? dailyTip.title_ar : dailyTip.title_en}
              </h3>
              <p className="text-xs text-foreground/80 text-start mt-2 leading-relaxed">
                {ar ? dailyTip.body_ar : dailyTip.body_en}
              </p>
              <p className="text-xs text-primary font-bold text-start mt-2 flex items-center gap-1">
                {ar ? "عرض تفاصيل النصيحة كاملة ←" : "Learn more →"}
              </p>
            </div>
          </button>

          {/* Tip Categories & List */}
          <div className="space-y-3">
            {TIPS.slice(0, 10).map((tip) => {
              const cm = TIP_CATEGORIES.find((c) => c.key === tip.category);
              return (
                <article
                  key={tip.id}
                  onClick={() => setSelectedTip(tip)}
                  className="glass rounded-2xl p-4 space-y-2 cursor-pointer hover:border-primary/30 transition text-start"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {cm?.emoji} {cm ? (ar ? cm.ar : cm.en) : ""}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-primary">
                    {ar ? tip.title_ar : tip.title_en}
                  </h4>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {ar ? tip.body_ar : tip.body_en}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation footer link */}
      <Link to="/achievements" className="glass rounded-2xl p-4 flex items-center justify-between">
        <ChevronLeft className="w-5 h-5 text-muted-foreground rotate-180 rtl:rotate-0" />
        <span className="font-bold text-sm text-primary">
          {ar ? "اطلعي على إنجازاتك اليومية ←" : "See your daily achievements →"}
        </span>
      </Link>

      {/* Modals */}
      <ArticleDetailModal
        article={selectedArticle}
        open={Boolean(selectedArticle)}
        onOpenChange={(o) => !o && setSelectedArticle(null)}
      />

      <VideoPlayerModal
        video={selectedVideo}
        open={Boolean(selectedVideo)}
        onOpenChange={(o) => !o && setSelectedVideo(null)}
      />

      <EducationAdminModal
        open={adminOpen}
        onOpenChange={setAdminOpen}
        onDataChanged={reloadData}
      />

      <TipDetailsDialog
        tip={selectedTip}
        open={Boolean(selectedTip)}
        onOpenChange={(o) => !o && setSelectedTip(null)}
      />
    </div>
  );
}
