import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  Check,
  X,
  BookOpen,
  Video as VideoIcon,
  Sparkles,
  Save,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import type { EducationalArticle, EducationalVideo, EducationCategoryId } from "@/types/education";
import { EDUCATION_CATEGORIES } from "@/data/educationalArticles";
import {
  getStoredArticles,
  getStoredVideos,
  upsertArticle,
  deleteArticle,
  resetArticlesToDefault,
  upsertVideo,
  deleteVideo,
  resetVideosToDefault,
  extractYouTubeId,
  getYouTubeThumbnail,
} from "@/lib/educationStore";

interface EducationAdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataChanged: () => void;
}

export function EducationAdminModal({
  open,
  onOpenChange,
  onDataChanged,
}: EducationAdminModalProps) {
  const { lang } = useI18n();
  const ar = lang === "ar";
  const [activeTab, setActiveTab] = useState<"articles" | "videos">("articles");

  // Articles state
  const articles = getStoredArticles();
  const [editingArticle, setEditingArticle] = useState<Partial<EducationalArticle> | null>(null);

  // Videos state
  const videos = getStoredVideos();
  const [editingVideo, setEditingVideo] = useState<Partial<EducationalVideo> | null>(null);

  // Form states for arrays
  const [recsText, setRecsText] = useState("");
  const [precsText, setPrecsText] = useState("");
  const [alertsText, setAlertsText] = useState("");

  const handleStartAddArticle = () => {
    setEditingArticle({
      id: `art-custom-${Date.now()}`,
      categoryId: "understanding",
      title_ar: "",
      title_en: "",
      summary_ar: "",
      summary_en: "",
      detailedContent_ar: "",
      detailedContent_en: "",
      practicalRecommendations_ar: [],
      practicalRecommendations_en: [],
      precautions_ar: [],
      precautions_en: [],
      whenToContactDoctor_ar: [],
      whenToContactDoctor_en: [],
      references: [{ title: "National Cancer Care Guidelines", organization: "WHO / ASCO" }],
      readingTimeMinutes: 5,
    });
    setRecsText("");
    setPrecsText("");
    setAlertsText("");
  };

  const handleStartEditArticle = (art: EducationalArticle) => {
    setEditingArticle({ ...art });
    setRecsText(art.practicalRecommendations_ar.join("\n"));
    setPrecsText(art.precautions_ar.join("\n"));
    setAlertsText(art.whenToContactDoctor_ar.join("\n"));
  };

  const handleSaveArticle = () => {
    if (!editingArticle?.title_ar && !editingArticle?.title_en) {
      toast.error(ar ? "يرجى إدخال عنوان المقال" : "Please provide an article title");
      return;
    }
    const fullArticle: EducationalArticle = {
      id: editingArticle.id || `art-${Date.now()}`,
      categoryId: (editingArticle.categoryId as EducationCategoryId) || "understanding",
      title_ar: editingArticle.title_ar || editingArticle.title_en || "",
      title_en: editingArticle.title_en || editingArticle.title_ar || "",
      summary_ar: editingArticle.summary_ar || "",
      summary_en: editingArticle.summary_en || "",
      detailedContent_ar: editingArticle.detailedContent_ar || "",
      detailedContent_en: editingArticle.detailedContent_en || "",
      practicalRecommendations_ar: recsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      practicalRecommendations_en: recsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      precautions_ar: precsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      precautions_en: precsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      whenToContactDoctor_ar: alertsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      whenToContactDoctor_en: alertsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      references: editingArticle.references || [],
      readingTimeMinutes: editingArticle.readingTimeMinutes || 5,
      isCustom: true,
    };
    upsertArticle(fullArticle);
    setEditingArticle(null);
    onDataChanged();
    toast.success(ar ? "تم حفظ المقال بنجاح" : "Article saved successfully");
  };

  const handleDeleteArticle = (id: string) => {
    if (
      confirm(
        ar ? "هل أنتِ متأكدة من حذف هذا المقال؟" : "Are you sure you want to delete this article?",
      )
    ) {
      deleteArticle(id);
      onDataChanged();
      toast.success(ar ? "تم حذف المقال" : "Article deleted");
    }
  };

  const handleResetArticles = () => {
    if (
      confirm(
        ar
          ? "إعادة تعيين كافة المقالات إلى النسخة الطبية الأصلية؟"
          : "Reset all articles to default medical library?",
      )
    ) {
      resetArticlesToDefault();
      onDataChanged();
      toast.success(ar ? "تمت استعادة المقالات الأصلية" : "Reset articles to default");
    }
  };

  // Video Management Handlers
  const handleStartAddVideo = () => {
    setEditingVideo({
      id: `yt-custom-${Date.now()}`,
      youtubeId: "",
      originalUrl: "",
      title_ar: "",
      title_en: "",
      categoryId: "understanding",
      isShort: false,
      duration: "5:00",
      channelTitle: "PinkCare",
    });
  };

  const handleStartEditVideo = (v: EducationalVideo) => {
    setEditingVideo({ ...v });
  };

  const handleSaveVideo = () => {
    const rawUrl = editingVideo?.originalUrl || editingVideo?.youtubeId || "";
    const extractedId = extractYouTubeId(rawUrl);
    if (!extractedId) {
      toast.error(ar ? "رابط أو معرف يوتيوب غير صالح" : "Invalid YouTube link or ID");
      return;
    }
    const fullVideo: EducationalVideo = {
      id: editingVideo?.id || `yt-${Date.now()}`,
      youtubeId: extractedId,
      originalUrl: rawUrl.startsWith("http")
        ? rawUrl
        : `https://www.youtube.com/watch?v=${extractedId}`,
      title_ar: editingVideo?.title_ar || editingVideo?.title_en || "فيديو توعوي جديد",
      title_en: editingVideo?.title_en || editingVideo?.title_ar || "New Educational Video",
      description_ar: editingVideo?.description_ar || "",
      description_en: editingVideo?.description_en || "",
      categoryId: (editingVideo?.categoryId as EducationCategoryId) || "understanding",
      isShort: Boolean(editingVideo?.isShort || rawUrl.includes("shorts")),
      duration: editingVideo?.duration || "3:30",
      views: editingVideo?.views || "1.2K",
      channelTitle: editingVideo?.channelTitle || "Medical Channel",
      isCustom: true,
    };
    upsertVideo(fullVideo);
    setEditingVideo(null);
    onDataChanged();
    toast.success(ar ? "تم حفظ الفيديو بنجاح" : "Video saved successfully");
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm(ar ? "هل أنتِ متأكدة من حذف هذا الفيديو؟" : "Delete this video?")) {
      deleteVideo(id);
      onDataChanged();
      toast.success(ar ? "تم حذف الفيديو" : "Video deleted");
    }
  };

  const handleResetVideos = () => {
    if (
      confirm(
        ar
          ? "إعادة تعيين قائمة الفيديوهات إلى الفيديوهات الثمانية المعتمدة؟"
          : "Reset video list to verified videos?",
      )
    ) {
      resetVideosToDefault();
      onDataChanged();
      toast.success(ar ? "تمت استعادة الفيديوهات الأصلية" : "Reset videos to default");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden max-h-[92vh] overflow-y-auto rounded-3xl border-0 shadow-2xl">
        {/* Header */}
        <div className="p-5 pb-4 bg-card border-b border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-start">
              <DialogTitle className="text-lg font-bold text-primary">
                {ar ? "إدارة المحتوى الطبي والتوعوي" : "Content Management (Editor)"}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                {ar
                  ? "إضافة وتعديل وحذف المقالات الطبية والفيديوهات التوعوية"
                  : "Add, edit, categorize, and remove articles & videos"}
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="w-9 h-9 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-4 bg-muted/30 flex gap-2 border-b border-border/40">
          <button
            onClick={() => {
              setActiveTab("articles");
              setEditingArticle(null);
              setEditingVideo(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              activeTab === "articles" ? "btn-glow shadow-sm" : "glass text-foreground/75"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {ar ? `المقالات (${articles.length})` : `Articles (${articles.length})`}
          </button>
          <button
            onClick={() => {
              setActiveTab("videos");
              setEditingArticle(null);
              setEditingVideo(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              activeTab === "videos" ? "btn-glow shadow-sm" : "glass text-foreground/75"
            }`}
          >
            <VideoIcon className="w-4 h-4" />
            {ar ? `الفيديوهات (${videos.length})` : `Videos (${videos.length})`}
          </button>
        </div>

        {/* Tab 1: Articles */}
        {activeTab === "articles" && (
          <div className="p-5 space-y-4">
            {!editingArticle ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={handleStartAddArticle}
                    className="btn-glow px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    {ar ? "إضافة مقال جديد" : "Add New Article"}
                  </button>
                  <button
                    onClick={handleResetArticles}
                    className="glass px-3 py-2 rounded-2xl text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {ar ? "استعادة المقالات الافتراضية" : "Reset to Defaults"}
                  </button>
                </div>

                <div className="space-y-2.5">
                  {articles.map((art) => {
                    const cat = EDUCATION_CATEGORIES.find((c) => c.id === art.categoryId);
                    return (
                      <div
                        key={art.id}
                        className="glass rounded-2xl p-3.5 flex items-center justify-between gap-3 text-start hover:border-primary/30 transition"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-primary uppercase">
                            {cat ? (ar ? cat.title_ar : cat.title_en) : art.categoryId}
                          </span>
                          <h4 className="font-bold text-sm text-foreground truncate">
                            {ar ? art.title_ar : art.title_en}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {ar ? art.summary_ar : art.summary_en}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleStartEditArticle(art)}
                            className="w-8 h-8 rounded-xl glass text-primary flex items-center justify-center hover:bg-primary/10"
                            title={ar ? "تعديل" : "Edit"}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className="w-8 h-8 rounded-xl glass text-destructive flex items-center justify-center hover:bg-destructive/10"
                            title={ar ? "حذف" : "Delete"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Article Editor Form */
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <h3 className="font-bold text-base text-primary">
                    {editingArticle.id?.includes("custom")
                      ? ar
                        ? "إضافة مقال تعليمي جديد"
                        : "Add New Article"
                      : ar
                        ? "تعديل المقال"
                        : "Edit Article"}
                  </h3>
                  <button
                    onClick={() => setEditingArticle(null)}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    {ar ? "إلغاء" : "Cancel"}
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground/80 block mb-1">
                      {ar ? "القسم / التصنيف الطبي" : "Category"}
                    </label>
                    <select
                      value={editingArticle.categoryId || "understanding"}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          categoryId: e.target.value as EducationCategoryId,
                        })
                      }
                      className="w-full glass rounded-xl px-3 py-2 text-sm bg-card outline-none border border-border/50 focus:border-primary"
                    >
                      {EDUCATION_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {ar ? c.title_ar : c.title_en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground/80 block mb-1">
                        {ar ? "العنوان (بالعربية)" : "Title (Arabic)"}
                      </label>
                      <input
                        value={editingArticle.title_ar || ""}
                        onChange={(e) =>
                          setEditingArticle({ ...editingArticle, title_ar: e.target.value })
                        }
                        className="w-full glass rounded-xl px-3 py-2 text-sm outline-none border border-border/50 focus:border-primary"
                        placeholder="عنوان المقال الواضح..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground/80 block mb-1">
                        {ar ? "العنوان (بالإنجليزية)" : "Title (English)"}
                      </label>
                      <input
                        value={editingArticle.title_en || ""}
                        onChange={(e) =>
                          setEditingArticle({ ...editingArticle, title_en: e.target.value })
                        }
                        className="w-full glass rounded-xl px-3 py-2 text-sm outline-none border border-border/50 focus:border-primary"
                        placeholder="Clear article title..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground/80 block mb-1">
                      {ar ? "مقدمة موجزة (ملخص)" : "Short Summary"}
                    </label>
                    <textarea
                      rows={2}
                      value={editingArticle.summary_ar || ""}
                      onChange={(e) =>
                        setEditingArticle({ ...editingArticle, summary_ar: e.target.value })
                      }
                      className="w-full glass rounded-xl p-3 text-sm outline-none border border-border/50 focus:border-primary"
                      placeholder="ملخص قصير يشرح فكرة المقال..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground/80 block mb-1">
                      {ar ? "الشرح الطبي والتفصيلي" : "Detailed Explanation"}
                    </label>
                    <textarea
                      rows={5}
                      value={editingArticle.detailedContent_ar || ""}
                      onChange={(e) =>
                        setEditingArticle({ ...editingArticle, detailedContent_ar: e.target.value })
                      }
                      className="w-full glass rounded-xl p-3 text-sm outline-none border border-border/50 focus:border-primary"
                      placeholder="الشرح العلمي المفصل..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground/80 block mb-1">
                      {ar
                        ? "توصيات وإرشادات عملية (سطر لكل توصية)"
                        : "Practical Recommendations (one per line)"}
                    </label>
                    <textarea
                      rows={3}
                      value={recsText}
                      onChange={(e) => setRecsText(e.target.value)}
                      className="w-full glass rounded-xl p-3 text-sm outline-none border border-border/50 focus:border-primary"
                      placeholder="توصية 1&#10;توصية 2..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-orange-600 dark:text-orange-400 block mb-1">
                      {ar
                        ? "احتياطات ومحاذير هامة (سطر لكل بند)"
                        : "Important Precautions (one per line)"}
                    </label>
                    <textarea
                      rows={2}
                      value={precsText}
                      onChange={(e) => setPrecsText(e.target.value)}
                      className="w-full glass rounded-xl p-3 text-sm outline-none border border-orange-500/30 focus:border-orange-500"
                      placeholder="تحذير 1&#10;تحذير 2..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-destructive block mb-1">
                      {ar
                        ? "متى يجب التواصل مع الطبيب فوراً؟ (سطر لكل علامة خطيرة)"
                        : "When to Contact Doctor (one per line)"}
                    </label>
                    <textarea
                      rows={2}
                      value={alertsText}
                      onChange={(e) => setAlertsText(e.target.value)}
                      className="w-full glass rounded-xl p-3 text-sm outline-none border border-destructive/30 focus:border-destructive"
                      placeholder="حرارة تفوق 38 مئوية&#10;ألم حاد مفاجئ..."
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveArticle}
                      className="btn-glow flex-1 py-2.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow"
                    >
                      <Save className="w-4 h-4" />
                      {ar ? "حفظ ونشر المقال" : "Save & Publish"}
                    </button>
                    <button
                      onClick={() => setEditingArticle(null)}
                      className="glass px-4 py-2.5 rounded-2xl text-sm font-semibold"
                    >
                      {ar ? "إلغاء" : "Cancel"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Videos */}
        {activeTab === "videos" && (
          <div className="p-5 space-y-4">
            {!editingVideo ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={handleStartAddVideo}
                    className="btn-glow px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    {ar ? "إضافة فيديو يوتيوب" : "Add YouTube Video"}
                  </button>
                  <button
                    onClick={handleResetVideos}
                    className="glass px-3 py-2 rounded-2xl text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {ar ? "استعادة الفيديوهات الأصلية" : "Reset to Defaults"}
                  </button>
                </div>

                <div className="space-y-2.5">
                  {videos.map((v) => {
                    const cat = EDUCATION_CATEGORIES.find((c) => c.id === v.categoryId);
                    return (
                      <div
                        key={v.id}
                        className="glass rounded-2xl p-3 flex items-center justify-between gap-3 text-start hover:border-primary/30 transition"
                      >
                        <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 bg-black relative">
                          <img
                            src={getYouTubeThumbnail(v.youtubeId)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          {v.isShort && (
                            <span className="absolute top-0.5 start-0.5 bg-destructive text-[8px] font-bold px-1 rounded text-white">
                              S
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-primary">
                            {cat ? (ar ? cat.title_ar : cat.title_en) : v.categoryId} · {v.duration}
                          </span>
                          <h4 className="font-bold text-xs text-foreground truncate">
                            {ar ? v.title_ar : v.title_en}
                          </h4>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            ID: {v.youtubeId}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleStartEditVideo(v)}
                            className="w-8 h-8 rounded-xl glass text-primary flex items-center justify-center hover:bg-primary/10"
                            title={ar ? "تعديل" : "Edit"}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(v.id)}
                            className="w-8 h-8 rounded-xl glass text-destructive flex items-center justify-center hover:bg-destructive/10"
                            title={ar ? "حذف" : "Delete"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Video Editor Form */
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <h3 className="font-bold text-base text-primary">
                    {editingVideo.id?.includes("custom")
                      ? ar
                        ? "إضافة فيديو يوتيوب جديد"
                        : "Add YouTube Video"
                      : ar
                        ? "تعديل الفيديو"
                        : "Edit Video"}
                  </h3>
                  <button
                    onClick={() => setEditingVideo(null)}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    {ar ? "إلغاء" : "Cancel"}
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground/80 block mb-1">
                      {ar ? "رابط يوتيوب أو المعرّف (ID)" : "YouTube URL or Video ID"}
                    </label>
                    <input
                      value={editingVideo.originalUrl || editingVideo.youtubeId || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        const id = extractYouTubeId(val);
                        setEditingVideo({
                          ...editingVideo,
                          originalUrl: val,
                          youtubeId: id || val,
                          isShort: val.includes("shorts"),
                        });
                      }}
                      className="w-full glass rounded-xl px-3 py-2 text-sm outline-none border border-border/50 focus:border-primary font-mono text-xs"
                      placeholder="https://www.youtube.com/watch?v=... أو https://youtube.com/shorts/..."
                    />
                  </div>

                  {editingVideo.youtubeId && extractYouTubeId(editingVideo.youtubeId) && (
                    <div className="p-3 glass rounded-2xl flex items-center gap-3">
                      <div className="w-20 h-14 rounded-xl overflow-hidden bg-black shrink-0">
                        <img
                          src={getYouTubeThumbnail(extractYouTubeId(editingVideo.youtubeId)!)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs space-y-0.5">
                        <p className="font-bold text-primary">
                          {ar ? "معاينة الغلاف من يوتيوب" : "YouTube Thumbnail Preview"}
                        </p>
                        <p className="text-muted-foreground font-mono">
                          ID: {extractYouTubeId(editingVideo.youtubeId)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-foreground/80 block mb-1">
                      {ar ? "القسم والتصنيف" : "Category"}
                    </label>
                    <select
                      value={editingVideo.categoryId || "understanding"}
                      onChange={(e) =>
                        setEditingVideo({
                          ...editingVideo,
                          categoryId: e.target.value as EducationCategoryId,
                        })
                      }
                      className="w-full glass rounded-xl px-3 py-2 text-sm bg-card outline-none border border-border/50 focus:border-primary"
                    >
                      {EDUCATION_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {ar ? c.title_ar : c.title_en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground/80 block mb-1">
                        {ar ? "العنوان (بالعربية)" : "Title (Arabic)"}
                      </label>
                      <input
                        value={editingVideo.title_ar || ""}
                        onChange={(e) =>
                          setEditingVideo({ ...editingVideo, title_ar: e.target.value })
                        }
                        className="w-full glass rounded-xl px-3 py-2 text-sm outline-none border border-border/50 focus:border-primary"
                        placeholder="عنوان الفيديو..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground/80 block mb-1">
                        {ar ? "العنوان (بالإنجليزية)" : "Title (English)"}
                      </label>
                      <input
                        value={editingVideo.title_en || ""}
                        onChange={(e) =>
                          setEditingVideo({ ...editingVideo, title_en: e.target.value })
                        }
                        className="w-full glass rounded-xl px-3 py-2 text-sm outline-none border border-border/50 focus:border-primary"
                        placeholder="Video title..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground/80 block mb-1">
                        {ar ? "المدة (مثلاً 6:15 أو 0:45)" : "Duration"}
                      </label>
                      <input
                        value={editingVideo.duration || ""}
                        onChange={(e) =>
                          setEditingVideo({ ...editingVideo, duration: e.target.value })
                        }
                        className="w-full glass rounded-xl px-3 py-2 text-sm outline-none border border-border/50 focus:border-primary tabular-nums"
                        placeholder="5:20"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-5">
                      <input
                        type="checkbox"
                        id="isShortCheck"
                        checked={Boolean(editingVideo.isShort)}
                        onChange={(e) =>
                          setEditingVideo({ ...editingVideo, isShort: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor="isShortCheck"
                        className="text-xs font-semibold cursor-pointer"
                      >
                        {ar ? "فيديو قصير (YouTube Shorts)" : "YouTube Shorts format"}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground/80 block mb-1">
                      {ar ? "وصف مختصر (اختياري)" : "Description (optional)"}
                    </label>
                    <textarea
                      rows={2}
                      value={editingVideo.description_ar || ""}
                      onChange={(e) =>
                        setEditingVideo({ ...editingVideo, description_ar: e.target.value })
                      }
                      className="w-full glass rounded-xl p-3 text-sm outline-none border border-border/50 focus:border-primary"
                      placeholder="شرح موجز للفيديو..."
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveVideo}
                      className="btn-glow flex-1 py-2.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow"
                    >
                      <Save className="w-4 h-4" />
                      {ar ? "حفظ الفيديو" : "Save Video"}
                    </button>
                    <button
                      onClick={() => setEditingVideo(null)}
                      className="glass px-4 py-2.5 rounded-2xl text-sm font-semibold"
                    >
                      {ar ? "إلغاء" : "Cancel"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
