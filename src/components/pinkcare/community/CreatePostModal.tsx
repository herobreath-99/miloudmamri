import { useState } from "react";
import { X, Sparkles, ShieldAlert, Tag, UserCheck, EyeOff, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { CommunityCategory } from "@/types/community";
import {
  createCommunityPost,
  getUserCommunityNickname,
  setUserCommunityNickname,
  scanForUnverifiedMedicalAdvice,
} from "@/lib/communityStorage";

type CreatePostModalProps = {
  currentUserId: string;
  currentUserName: string;
  onClose: () => void;
  onPostCreated: () => void;
  lang?: "ar" | "en";
};

const CATEGORIES: { id: CommunityCategory; labelAr: string; labelEn: string; icon: string }[] = [
  { id: "treatment", labelAr: "تجارب العلاج", labelEn: "Treatment experiences", icon: "🩺" },
  { id: "emotional", labelAr: "الدعم النفسي", labelEn: "Emotional support", icon: "🌸" },
  { id: "recovery", labelAr: "مرحلة التعافي", labelEn: "Recovery experiences", icon: "🌿" },
  { id: "self_care", labelAr: "العناية اليومية", labelEn: "Daily self-care", icon: "✨" },
  { id: "qa", labelAr: "أسئلة وإجابات", labelEn: "Questions & answers", icon: "💬" },
  { id: "motivation", labelAr: "تحفيز وتشجيع", labelEn: "Motivation & hope", icon: "💖" },
];

export function CreatePostModal({
  currentUserId,
  currentUserName,
  onClose,
  onPostCreated,
  lang = "ar",
}: CreatePostModalProps) {
  const [category, setCategory] = useState<CommunityCategory>("emotional");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Nickname & Privacy Controls
  const [useNickname, setUseNickname] = useState(true);
  const [nickname, setNickname] = useState(getUserCommunityNickname() || "أخت داعمة 🌸");
  const [sensitiveContent, setSensitiveContent] = useState(false);
  const [acknowledgedPeerOnly, setAcknowledgedPeerOnly] = useState(false);

  // Unverified Medical Advice check
  const [medicalWarning, setMedicalWarning] = useState<string | null>(null);

  const handleAddTag = () => {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((x) => x !== t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error(
        lang === "ar" ? "يرجى كتابة عنوان ونص للمنشور" : "Please provide title and content",
      );
      return;
    }

    if (!acknowledgedPeerOnly) {
      toast.error(
        lang === "ar"
          ? "يرجى تأكيد الالتزام بميثاق المجتمع (عدم تقديم نصائح طبية)"
          : "Please acknowledge the peer support charter",
      );
      return;
    }

    // Safety scan
    const scan = scanForUnverifiedMedicalAdvice(`${title} ${content}`);
    if (scan.hasWarning && !medicalWarning) {
      setMedicalWarning(scan.warningMessage || "يرجى الانتباه إلى صياغة المنشور");
      toast.warning(
        lang === "ar"
          ? "تنبيه: محتواكِ يحتوي على عبارات علاجية قد تخالف شروط المجتمع. راجعي التنبيه أسفله."
          : "Warning: Contains therapeutic terms that require careful review.",
      );
      return;
    }

    // Save chosen nickname
    if (useNickname && nickname.trim()) {
      setUserCommunityNickname(nickname);
    }

    createCommunityPost({
      authorId: currentUserId,
      authorName: currentUserName,
      authorNickname: nickname.trim() || "أخت داعمة 🌸",
      useNickname,
      category,
      title,
      content,
      tags,
      sensitiveContent,
    });

    toast.success(
      lang === "ar"
        ? "تم نشر مشاركتكِ في مجتمع PinkCare بنجاح 💗"
        : "Your post has been published 💗",
    );
    onPostCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border rounded-3xl p-5 max-w-lg w-full space-y-4 shadow-2xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">
                {lang === "ar" ? "مشاركة تجربة أو تساؤل داعم" : "Create Community Post"}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                {lang === "ar"
                  ? "مساحتكِ الآمنة للبوح وتبادل الأمل"
                  : "Your safe space for mutual support"}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              {lang === "ar" ? "اختاري تصنيف المشاركة:" : "Select Category:"}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-2.5 rounded-2xl border text-xs flex items-center gap-2 transition ${
                    category === cat.id
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-border/60 hover:bg-muted text-foreground/80"
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="truncate">{lang === "ar" ? cat.labelAr : cat.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy & Identity Preference */}
          <div className="bg-muted/40 rounded-2xl p-3 border border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">
                  {lang === "ar" ? "النشر باسم مستعار (حماية الخصوصية)" : "Post with Nickname"}
                </span>
              </div>
              <input
                type="checkbox"
                id="nickname-toggle"
                checked={useNickname}
                onChange={(e) => setUseNickname(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>

            {useNickname ? (
              <div className="space-y-1 pt-1">
                <label className="text-[11px] text-muted-foreground">
                  {lang === "ar" ? "اسمكِ المستعار في المجتمع:" : "Community nickname:"}
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="مثال: فراشة الأمل 🌸"
                  className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-hidden focus:border-primary"
                />
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                {lang === "ar"
                  ? `سيظهر اسمكِ الحقيقي: ${currentUserName}`
                  : `Your real profile name will be visible: ${currentUserName}`}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              {lang === "ar" ? "عنوان المشاركة:" : "Post Title:"}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                lang === "ar"
                  ? "مثال: كيف تجاوزت صعوبة أول جلسة علاج بفضل الله..."
                  : "e.g. How I found comfort during recovery days..."
              }
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-hidden focus:border-primary"
            />
          </div>

          {/* Content */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              {lang === "ar" ? "نص المشاركة أو التجربة:" : "Your Experience / Story:"}
            </label>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (medicalWarning) setMedicalWarning(null);
              }}
              rows={4}
              placeholder={
                lang === "ar"
                  ? "اكتبي تجربتكِ أو ما تشعرين به بحرية ومحبة..."
                  : "Share your thoughts, feelings, or questions..."
              }
              className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground leading-relaxed focus:outline-hidden focus:border-primary"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-muted-foreground" />
              <label className="text-xs font-semibold text-foreground">
                {lang === "ar" ? "وسوم توضيحية (اختياري):" : "Tags (Optional):"}
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder={lang === "ar" ? "أضيفي وسماً واضغطي إضافة..." : "Add a tag..."}
                className="flex-1 bg-background border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-hidden focus:border-primary"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80"
              >
                {lang === "ar" ? "إضافة" : "Add"}
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-primary/10 text-primary border border-primary/20"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sensitive Content Warning Flag */}
          <label className="flex items-center gap-2 p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs cursor-pointer">
            <EyeOff className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-amber-700 dark:text-amber-400">
                {lang === "ar"
                  ? "تحديد كمحتوى حساس (يتطلب نقرة لإظهاره)"
                  : "Mark as sensitive content"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {lang === "ar"
                  ? "إذا كانت المشاركة تتناول تفاصيل جراحية أو ألم بدني حاد قد يؤثر على الأخوات الحساسات"
                  : "Requires readers to tap before reading sensitive surgical or pain details"}
              </p>
            </div>
            <input
              type="checkbox"
              checked={sensitiveContent}
              onChange={(e) => setSensitiveContent(e.target.checked)}
              className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
            />
          </label>

          {/* Warning Banner if unverified advice detected */}
          {medicalWarning && (
            <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/30 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-destructive font-bold">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{lang === "ar" ? "تنبيه إشرافي طبي" : "Medical Guardrail Alert"}</span>
              </div>
              <p className="text-[11px] text-foreground/80 leading-relaxed">{medicalWarning}</p>
              <p className="text-[10px] text-destructive font-semibold">
                {lang === "ar"
                  ? "بالضغط على نشر مرة ثانية، أنتِ تقرين بأن هذا المنشور هو رأي وتجربة شخصية فقط وليس استشارة أو توصية دوائية."
                  : "By proceeding, you explicitly acknowledge this is personal peer reflection only, not a clinical prescription."}
              </p>
            </div>
          )}

          {/* Mandatory Peer Support Charter Acknowledgement */}
          <label className="flex items-start gap-2 text-xs p-2.5 rounded-2xl border border-primary/20 bg-primary/5 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledgedPeerOnly}
              onChange={(e) => setAcknowledgedPeerOnly(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-primary rounded cursor-pointer"
            />
            <span className="text-[11px] text-foreground/80 leading-snug">
              {lang === "ar"
                ? "أؤكد أن مشاركتي تعبر عن تجربتي الشخصية أو الدعم المعنوي، ولا تتضمن أي نصيحة دوائية أو تشخيصية بديلة عن الفريق الطبي المشرف."
                : "I confirm this post is purely my personal experience and mutual support, containing no unverified clinical prescriptions."}
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:bg-muted"
            >
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 shadow-md hover:opacity-90"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === "ar" ? "نشر المشاركة 💗" : "Publish Post 💗"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
