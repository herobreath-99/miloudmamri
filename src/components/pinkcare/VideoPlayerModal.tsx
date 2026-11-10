import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Heart,
  Share2,
  X,
  Clock,
  Eye,
  Maximize2,
  ExternalLink,
  Sparkles,
  Info,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import type { EducationalVideo } from "@/types/education";
import {
  getFavoriteVideoIds,
  toggleFavoriteVideo,
  recordRecentVideo,
  getYouTubeEmbedUrl,
  fetchYouTubeOEmbed,
} from "@/lib/educationStore";
import { EDUCATION_CATEGORIES } from "@/data/educationalArticles";

interface VideoPlayerModalProps {
  video: EducationalVideo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VideoPlayerModal({ video, open, onOpenChange }: VideoPlayerModalProps) {
  const { lang } = useI18n();
  const ar = lang === "ar";
  const [isFav, setIsFav] = useState(false);
  const [realTitle, setRealTitle] = useState<string | null>(null);
  const [channel, setChannel] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (video) {
      setIsFav(getFavoriteVideoIds().includes(video.id));
      recordRecentVideo(video.id);

      // Attempt client-side oEmbed to fetch actual YouTube video title and author
      fetchYouTubeOEmbed(video.youtubeId).then((meta) => {
        if (meta?.title) setRealTitle(meta.title);
        if (meta?.author_name) setChannel(meta.author_name);
      });
    } else {
      setRealTitle(null);
      setChannel(null);
    }
  }, [video, open]);

  if (!video) return null;

  const displayTitle = realTitle || (ar ? video.title_ar : video.title_en);
  const category = EDUCATION_CATEGORIES.find((c) => c.id === video.categoryId);

  const handleToggleFav = () => {
    const next = toggleFavoriteVideo(video.id);
    setIsFav(next);
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

  const handleShare = async () => {
    const url = video.originalUrl || `https://youtu.be/${video.youtubeId}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: displayTitle,
          text: ar
            ? `${displayTitle} — مكتبة بينك كير المرئية`
            : `${displayTitle} — PinkCare Video`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success(ar ? "تم نسخ رابط الفيديو بنجاح" : "Video link copied");
      }
    } catch {
      // User cancelled
    }
  };

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden border-0 rounded-3xl bg-black text-white shadow-2xl">
        <DialogTitle className="sr-only">{displayTitle}</DialogTitle>

        {/* Top bar */}
        <div className="absolute top-3 end-3 z-20 flex items-center gap-2">
          <button
            onClick={handleFullscreen}
            aria-label="Fullscreen"
            title={ar ? "ملء الشاشة" : "Fullscreen"}
            className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur text-white flex items-center justify-center transition"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Responsive YouTube Embed Container */}
        <div
          className={`relative w-full bg-black flex items-center justify-center ${
            video.isShort ? "aspect-[9/16] max-h-[72vh] mx-auto" : "aspect-video"
          }`}
        >
          <iframe
            ref={iframeRef}
            src={getYouTubeEmbedUrl(video.youtubeId, true)}
            title={displayTitle}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
          />
        </div>

        {/* Video Info Card */}
        <div className="p-4 md:p-5 bg-card text-foreground space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 flex-1 text-start">
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                {category && (
                  <span className="font-semibold text-primary">
                    {ar ? category.title_ar : category.title_en}
                  </span>
                )}
                {category && <span>·</span>}
                <span className="flex items-center gap-1 tabular-nums num-en">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </span>
                {video.views && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1 tabular-nums num-en">
                      <Eye className="w-3 h-3" />
                      {video.views}
                    </span>
                  </>
                )}
                {video.isShort && (
                  <span className="bg-destructive/15 text-destructive font-bold text-[10px] px-1.5 py-0.5 rounded">
                    SHORTS
                  </span>
                )}
              </div>

              <h3 className="text-base md:text-lg font-bold text-primary leading-snug">
                {displayTitle}
              </h3>

              {channel && (
                <p className="text-xs text-muted-foreground">
                  {ar ? "القناة الرسمية:" : "Channel:"}{" "}
                  <span className="text-foreground/80 font-medium">{channel}</span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleToggleFav}
                aria-label="Favorite"
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition ${
                  isFav
                    ? "bg-primary text-primary-foreground shadow"
                    : "glass text-primary hover:bg-primary/10"
                }`}
              >
                <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={handleShare}
                aria-label="Share"
                className="w-10 h-10 rounded-2xl glass text-primary hover:bg-primary/10 flex items-center justify-center transition"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <a
                href={video.originalUrl || `https://youtu.be/${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open on YouTube"
                className="w-10 h-10 rounded-2xl glass text-primary hover:bg-primary/10 flex items-center justify-center transition"
                title={ar ? "فتح على يوتيوب" : "Open on YouTube"}
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          {(video.description_ar || video.description_en) && (
            <p className="text-xs text-foreground/75 leading-relaxed border-t border-border/40 pt-2 text-start">
              {ar ? video.description_ar : video.description_en}
            </p>
          )}

          {/* Educational notice */}
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-primary/5 rounded-xl px-3 py-2">
            <Info className="w-3.5 h-3.5 text-primary shrink-0" />
            <p>
              {ar
                ? "محتوى توعوي تثقيفي مقدم للمريضات والمتعافيات؛ يرجى مراجعة طبيبك بخصوص أي استفسار دوائي."
                : "Educational video content curated for patients and survivors. Please consult your physician for individualized medical advice."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
