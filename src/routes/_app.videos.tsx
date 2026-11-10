import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Play,
  Search,
  Heart,
  Share2,
  X,
  Eye,
  Clock,
  Sparkles,
  History,
  Settings,
  Info,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import type { EducationalVideo, EducationCategoryId } from "@/types/education";
import { EDUCATION_CATEGORIES } from "@/data/educationalArticles";
import {
  getStoredVideos,
  getFavoriteVideoIds,
  toggleFavoriteVideo,
  getRecentVideos,
  getYouTubeThumbnail,
} from "@/lib/educationStore";
import { VideoPlayerModal } from "@/components/pinkcare/VideoPlayerModal";
import { EducationAdminModal } from "@/components/pinkcare/EducationAdminModal";

export const Route = createFileRoute("/_app/videos")({
  component: VideosPage,
});

function VideosPage() {
  const { lang } = useI18n();
  const ar = lang === "ar";
  const [query, setQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState<EducationCategoryId | "all">("all");
  const [playing, setPlaying] = useState<EducationalVideo | null>(null);
  const [favs, setFavs] = useState<string[]>([]);
  const [videos, setVideos] = useState<EducationalVideo[]>([]);
  const [recentEntries, setRecentEntries] = useState<{ videoId: string; watchedAt: number }[]>([]);
  const [adminOpen, setAdminOpen] = useState(false);
  const [onlyFavs, setOnlyFavs] = useState(false);

  const reload = () => {
    setVideos(getStoredVideos());
    setFavs(getFavoriteVideoIds());
    setRecentEntries(getRecentVideos());
  };

  useEffect(() => {
    reload();
    const handleVideosChanged = () => setVideos(getStoredVideos());
    const handleFavVideos = () => setFavs(getFavoriteVideoIds());

    window.addEventListener("pc:videos-changed", handleVideosChanged);
    window.addEventListener("pc:fav-videos-changed", handleFavVideos);

    return () => {
      window.removeEventListener("pc:videos-changed", handleVideosChanged);
      window.removeEventListener("pc:fav-videos-changed", handleFavVideos);
    };
  }, []);

  const daily = useMemo(() => {
    if (videos.length === 0) return null;
    const dayIndex = Math.floor(Date.now() / 86400000) % videos.length;
    return videos[dayIndex];
  }, [videos]);

  const recommended = useMemo(() => {
    if (!daily) return videos.slice(0, 4);
    return videos.filter((v) => v.id !== daily.id).slice(0, 4);
  }, [videos, daily]);

  const filtered = useMemo(() => {
    return videos.filter((v) => {
      const matchCat = selectedCat === "all" || v.categoryId === selectedCat;
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        v.title_ar.toLowerCase().includes(q) ||
        v.title_en.toLowerCase().includes(q) ||
        (v.description_ar && v.description_ar.toLowerCase().includes(q)) ||
        (v.description_en && v.description_en.toLowerCase().includes(q));
      const matchFav = !onlyFavs || favs.includes(v.id);
      return matchCat && matchQ && matchFav;
    });
  }, [videos, selectedCat, query, onlyFavs, favs]);

  const toggleFav = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = toggleFavoriteVideo(id);
    setFavs(getFavoriteVideoIds());
    toast.success(
      ar
        ? next
          ? "أُضيف الفيديو إلى المفضلة 💖"
          : "أُزيل من المفضلة"
        : next
          ? "Added to favorites 💖"
          : "Removed from favorites",
    );
  };

  const share = async (v: EducationalVideo, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = v.originalUrl || `https://youtu.be/${v.youtubeId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: ar ? v.title_ar : v.title_en, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success(ar ? "تم نسخ الرابط" : "Link copied");
      }
    } catch {
      // Ignore share cancellation
    }
  };

  const recentVideos = useMemo(() => {
    return recentEntries
      .map((entry) => videos.find((v) => v.id === entry.videoId || v.youtubeId === entry.videoId))
      .filter((v): v is EducationalVideo => Boolean(v))
      .slice(0, 4);
  }, [recentEntries, videos]);

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <section className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-primary">
          {ar ? "مكتبة الفيديوهات الصحية" : "Health Video Library"}
        </h2>
        <p className="text-xs text-muted-foreground">
          {ar
            ? "فيديوهات توعوية وتثقيفية مختارة بعناية لدعم رحلة علاجكِ وتعافيكِ"
            : "Clinically curated awareness and physical therapy videos"}
        </p>
      </section>

      {/* Search and Action Bar */}
      <div className="flex items-center gap-2">
        <div className="glass rounded-full flex-1 flex items-center gap-2 px-4 py-2.5">
          <Search className="w-4 h-4 text-primary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={ar ? "ابحثي في الفيديوهات التوعوية..." : "Search videos..."}
            className="flex-1 bg-transparent outline-none text-xs placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-xs text-muted-foreground">
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => setOnlyFavs((prev) => !prev)}
          aria-label="Favorites"
          title={ar ? "المفضلة" : "Favorites"}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition shrink-0 ${
            onlyFavs
              ? "bg-primary text-primary-foreground shadow"
              : "glass text-primary hover:bg-primary/10"
          }`}
        >
          <Heart className={`w-4 h-4 ${onlyFavs ? "fill-current" : ""}`} />
        </button>

        <button
          onClick={() => setAdminOpen(true)}
          aria-label="Manage Videos"
          title={ar ? "إدارة الفيديوهات" : "Manage Videos"}
          className="w-10 h-10 rounded-full glass text-primary hover:bg-primary/10 flex items-center justify-center transition shrink-0"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Featured Daily Video */}
      {daily && !query && selectedCat === "all" && !onlyFavs && (
        <div
          onClick={() => setPlaying(daily)}
          className="glass rounded-3xl p-4 space-y-3 relative overflow-hidden cursor-pointer hover:border-primary/40 transition"
        >
          <div
            className="absolute -top-10 -end-10 w-40 h-40 rounded-full opacity-30"
            style={{ background: "var(--gradient-rose)" }}
          />
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-bold text-xs text-primary">
                {ar ? "فيديو اليوم المختار" : "Today's Featured Video"}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground tabular-nums num-en">
              {daily.duration}
            </span>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
            <img
              src={getYouTubeThumbnail(daily.youtubeId)}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Play className="w-7 h-7 text-white fill-white ms-1" />
              </div>
            </div>
            {daily.isShort && (
              <span className="absolute top-2 start-2 bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded">
                SHORTS
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 text-start">
            <h3 className="font-bold text-sm text-primary flex-1 line-clamp-1">
              {ar ? daily.title_ar : daily.title_en}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => toggleFav(daily.id, e)}
                className="w-8 h-8 rounded-full glass flex items-center justify-center text-primary"
              >
                <Heart className={`w-3.5 h-3.5 ${favs.includes(daily.id) ? "fill-primary" : ""}`} />
              </button>
              <button
                onClick={(e) => share(daily, e)}
                className="w-8 h-8 rounded-full glass flex items-center justify-center text-primary"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recently Watched */}
      {recentVideos.length > 0 && !query && !onlyFavs && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1 font-semibold">
            <History className="w-3.5 h-3.5 text-primary" />
            <span>{ar ? "آخر ما شاهدتِ" : "Recently Watched"}</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {recentVideos.slice(0, 2).map((v) => (
              <div
                key={v.id}
                onClick={() => setPlaying(v)}
                className="glass rounded-2xl p-2.5 flex items-center gap-2.5 cursor-pointer hover:border-primary/30 transition text-start"
              >
                <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-black shrink-0">
                  <img
                    src={getYouTubeThumbnail(v.youtubeId)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white ms-0.5" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-primary truncate">
                    {ar ? v.title_ar : v.title_en}
                  </p>
                  <p className="text-[10px] text-muted-foreground tabular-nums num-en">
                    {v.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="overflow-x-auto no-scrollbar flex gap-1.5 pb-1 -mx-2 px-2">
        <button
          onClick={() => setSelectedCat("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition ${
            selectedCat === "all" ? "btn-glow" : "glass text-primary"
          }`}
        >
          {ar ? "الكل" : "All"}
        </button>
        {EDUCATION_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCat(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition flex items-center gap-1 ${
              selectedCat === c.id ? "btn-glow" : "glass text-primary"
            }`}
          >
            {ar ? c.title_ar : c.title_en}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>{ar ? `عدد الفيديوهات (${filtered.length})` : `Videos (${filtered.length})`}</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filtered.map((v) => {
            const cat = EDUCATION_CATEGORIES.find((c) => c.id === v.categoryId);
            const isFav = favs.includes(v.id);
            return (
              <div
                key={v.id}
                onClick={() => setPlaying(v)}
                className="glass rounded-2xl overflow-hidden cursor-pointer hover:border-primary/40 transition group text-start"
              >
                <div className="relative aspect-video w-full bg-black">
                  <img
                    src={getYouTubeThumbnail(v.youtubeId)}
                    alt={ar ? v.title_ar : v.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      <Play className="w-5 h-5 text-white fill-white ms-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 start-2 flex items-center gap-2 text-white text-[10px]">
                    <span className="bg-black/70 px-2 py-0.5 rounded flex items-center gap-1 tabular-nums num-en">
                      <Clock className="w-3 h-3" />
                      {v.duration}
                    </span>
                    {v.views && (
                      <span className="bg-black/70 px-2 py-0.5 rounded flex items-center gap-1 tabular-nums num-en">
                        <Eye className="w-3 h-3" />
                        {v.views}
                      </span>
                    )}
                  </div>
                  {v.isShort && (
                    <span className="absolute top-2 start-2 bg-destructive text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      SHORTS
                    </span>
                  )}
                </div>

                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-primary">
                      {cat ? (ar ? cat.title_ar : cat.title_en) : v.categoryId}
                    </span>
                    <h4 className="font-bold text-xs text-foreground truncate">
                      {ar ? v.title_ar : v.title_en}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => toggleFav(v.id, e)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                        isFav ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
                    </button>
                    <button
                      onClick={(e) => share(v, e)}
                      className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-xs">
              {ar ? "لا توجد فيديوهات مطابقة للبحث" : "No videos found"}
            </p>
          )}
        </div>
      </section>

      {/* Recommended Videos */}
      {!query && selectedCat === "all" && recommended.length > 0 && (
        <section className="space-y-2 pt-2">
          <h3 className="font-bold text-sm text-primary text-start">
            {ar ? "فيديوهات مقترحة إضافية" : "Recommended Videos"}
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {recommended.map((v) => (
              <button
                key={v.id}
                onClick={() => setPlaying(v)}
                className="glass rounded-2xl overflow-hidden text-start group hover:border-primary/30 transition"
              >
                <div className="relative aspect-video">
                  <img
                    src={getYouTubeThumbnail(v.youtubeId)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow">
                      <Play className="w-3.5 h-3.5 text-primary fill-primary ms-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1 end-1 text-[9px] bg-black/70 text-white px-1 rounded tabular-nums num-en">
                    {v.duration}
                  </span>
                </div>
                <div className="p-2">
                  <p className="text-xs font-bold text-primary line-clamp-1">
                    {ar ? v.title_ar : v.title_en}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <VideoPlayerModal
        video={playing}
        open={Boolean(playing)}
        onOpenChange={(o) => !o && setPlaying(null)}
      />

      <EducationAdminModal open={adminOpen} onOpenChange={setAdminOpen} onDataChanged={reload} />
    </div>
  );
}
