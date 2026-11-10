import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Heart,
  Share2,
  X,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  Info,
  Stethoscope,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import type { EducationalArticle } from "@/types/education";
import { EDUCATION_CATEGORIES } from "@/data/educationalArticles";
import { getFavoriteArticleIds, toggleFavoriteArticle } from "@/lib/educationStore";

interface ArticleDetailModalProps {
  article: EducationalArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArticleDetailModal({ article, open, onOpenChange }: ArticleDetailModalProps) {
  const { lang } = useI18n();
  const ar = lang === "ar";
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (article) {
      setIsFav(getFavoriteArticleIds().includes(article.id));
    }
  }, [article, open]);

  if (!article) return null;

  const category = EDUCATION_CATEGORIES.find((c) => c.id === article.categoryId);
  const title = ar ? article.title_ar : article.title_en;
  const summary = ar ? article.summary_ar : article.summary_en;
  const content = ar ? article.detailedContent_ar : article.detailedContent_en;
  const recommendations = ar
    ? article.practicalRecommendations_ar
    : article.practicalRecommendations_en;
  const precautions = ar ? article.precautions_ar : article.precautions_en;
  const doctorAlerts = ar ? article.whenToContactDoctor_ar : article.whenToContactDoctor_en;

  const handleToggleFav = () => {
    const next = toggleFavoriteArticle(article.id);
    setIsFav(next);
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

  const handleShare = async () => {
    const shareText = `${title}\n\n${summary}\n\n— PinkCare Medical Education`;
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(`${title}\n\n${shareText}`);
        toast.success(ar ? "تم نسخ رابط وتفاصيل المقال" : "Article details copied");
      }
    } catch {
      // User cancelled share
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden max-h-[92vh] overflow-y-auto rounded-3xl border-0 shadow-2xl">
        {/* Header Banner */}
        <div
          className="relative p-6 pb-7 text-primary"
          style={{ background: "var(--gradient-rose)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-primary/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {category ? (ar ? category.title_ar : category.title_en) : ""}
              <span className="text-muted-foreground/60">·</span>
              <span className="flex items-center gap-1 tabular-nums num-en">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTimeMinutes} {ar ? "دقائق قراءة" : "min read"}
              </span>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToggleFav}
                aria-label="Favorite"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                  isFav
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-white/60 dark:bg-black/30 text-primary hover:bg-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={handleShare}
                aria-label="Share"
                className="w-9 h-9 rounded-full bg-white/60 dark:bg-black/30 flex items-center justify-center text-primary hover:bg-white transition"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenChange(false)}
                aria-label="Close"
                className="w-9 h-9 rounded-full bg-white/60 dark:bg-black/30 flex items-center justify-center text-primary hover:bg-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <DialogTitle className="text-xl md:text-2xl font-bold text-primary leading-snug">
            {title}
          </DialogTitle>

          <p className="mt-2 text-sm text-foreground/80 leading-relaxed font-medium">{summary}</p>
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-6 space-y-6 bg-card">
          {/* Explicit Medical Disclaimer Notice */}
          <div className="rounded-2xl p-4 bg-amber-500/10 border border-amber-500/20 text-amber-950 dark:text-amber-200 text-xs leading-relaxed flex gap-3 items-start">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm mb-0.5 text-amber-900 dark:text-amber-300">
                {ar ? "تنويه طبي وإخلاء مسؤولية:" : "Medical Disclaimer:"}
              </p>
              <p>
                {ar
                  ? "هذا المحتوى تثقيفي وتوعوي مستند إلى المبادئ التوجيهية الطبية الدولية. لا يُقصد به تقديم استشارة طبية شخصية، أو تشخيص، أو خطة علاج بديلة عن إرشادات طبيب الأورام المعالج أو الفريق الطبي المشرف على حالتكِ."
                  : "This content is purely educational and grounded in international clinical oncology guidelines. It is not intended as personalized medical advice, diagnosis, or substitute for the direct clinical judgment of your medical oncologist or healthcare team."}
              </p>
            </div>
          </div>

          {/* Detailed Content */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-base">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3>{ar ? "الشرح الطبي والتفصيلي" : "Clinical Explanation"}</h3>
            </div>
            <div className="text-sm text-foreground/85 leading-relaxed space-y-3 whitespace-pre-line text-start">
              {content}
            </div>
          </section>

          {/* Practical Recommendations */}
          {recommendations.length > 0 && (
            <section className="space-y-3 rounded-2xl p-4 bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <h3>{ar ? "توصيات وإرشادات عملية" : "Practical Recommendations"}</h3>
              </div>
              <ul className="space-y-2 text-sm text-foreground/85">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Important Precautions */}
          {precautions.length > 0 && (
            <section className="space-y-3 rounded-2xl p-4 bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-bold text-base">
                <ShieldAlert className="w-5 h-5" />
                <h3>{ar ? "احتياطات ومحاذير هامة" : "Important Precautions"}</h3>
              </div>
              <ul className="space-y-2 text-sm text-foreground/85">
                {precautions.map((prec, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                    <span className="leading-relaxed">{prec}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* When to Contact Doctor (Red Flags) */}
          {doctorAlerts.length > 0 && (
            <section className="space-y-3 rounded-2xl p-4 bg-destructive/10 border border-destructive/30">
              <div className="flex items-center gap-2 text-destructive font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
                <h3>
                  {ar
                    ? "متى يجب التواصل مع الفريق الطبي فوراً؟"
                    : "When to Contact Your Doctor Immediately"}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                {ar
                  ? "لا تترددي في التوجه إلى الطوارئ أو الاتصال بمركز الأورام عند ملاحظة أيٍّ من الأعراض التالية:"
                  : "Seek prompt medical care or visit the nearest oncology emergency unit if you develop:"}
              </p>
              <ul className="space-y-2 text-sm font-medium text-destructive-foreground/90">
                {doctorAlerts.map((alert, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    <span className="leading-relaxed">{alert}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Trusted References */}
          {article.references && article.references.length > 0 && (
            <section className="space-y-2 pt-2 border-t border-border/40">
              <div className="flex items-center gap-2 text-muted-foreground font-semibold text-xs">
                <Stethoscope className="w-4 h-4" />
                <h4>{ar ? "المراجع والمصادر الطبية الموثوقة:" : "Trusted Clinical References:"}</h4>
              </div>
              <ul className="space-y-1.5">
                {article.references.map((ref, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-muted-foreground/90 flex items-center justify-between"
                  >
                    <span>
                      <strong className="text-foreground/80">{ref.organization}:</strong>{" "}
                      {ref.title}
                    </span>
                    {ref.url && (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline ms-2 inline-flex items-center gap-1 shrink-0"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
