import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Heart,
  Share2,
  X,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ListChecks,
  BookOpen,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import type { Tip } from "@/data/tips";
import { getTipDetails } from "@/data/tip-details";

interface Props {
  tip: Tip | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const FAV_KEY = "pc_fav_tips";

function readFavs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  } catch {
    return [];
  }
}

export function TipDetailsDialog({ tip, open, onOpenChange }: Props) {
  const { lang } = useI18n();
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    setFavs(readFavs());
  }, [open]);

  if (!tip) return null;
  const d = getTipDetails(tip);
  const ar = lang === "ar";
  const isFav = favs.includes(tip.id);

  const toggleFav = () => {
    const next = isFav ? favs.filter((x) => x !== tip.id) : [...favs, tip.id];
    setFavs(next);
    localStorage.setItem(FAV_KEY, JSON.stringify(next));
    toast.success(
      ar
        ? isFav
          ? "أُزيلت من المفضلة"
          : "أُضيفت إلى المفضلة 💖"
        : isFav
          ? "Removed from favorites"
          : "Added to favorites 💖",
    );
  };

  const share = async () => {
    const text = `${ar ? tip.title_ar : tip.title_en}\n\n${ar ? d.why_ar : d.why_en}\n\n— PinkCare`;
    try {
      if (navigator.share) await navigator.share({ title: ar ? tip.title_ar : tip.title_en, text });
      else {
        await navigator.clipboard.writeText(text);
        toast.success(ar ? "تم نسخ النصيحة" : "Tip copied");
      }
    } catch {
      // Ignore share cancellation or clipboard failure
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden max-h-[90vh] overflow-y-auto rounded-3xl border-0">
        {/* Hero */}
        <div className="relative p-6 pb-8" style={{ background: "var(--gradient-rose)" }}>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 end-4 w-9 h-9 rounded-full bg-white/40 backdrop-blur flex items-center justify-center text-primary"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-7xl text-center animate-float drop-shadow-lg">{d.image}</div>
          <DialogTitle className="text-2xl font-bold text-primary text-center mt-3 leading-snug">
            {ar ? tip.title_ar : tip.title_en}
          </DialogTitle>
        </div>

        <div className="p-5 space-y-5 -mt-4 bg-card rounded-t-3xl relative">
          {/* Why */}
          <Section
            icon={<BookOpen className="w-5 h-5" />}
            title={ar ? "لماذا هذه النصيحة؟" : "Why this tip?"}
          >
            <p className="text-sm text-foreground/80 leading-relaxed">{ar ? d.why_ar : d.why_en}</p>
          </Section>

          {/* Benefits */}
          <Section icon={<Sparkles className="w-5 h-5" />} title={ar ? "الفوائد" : "Benefits"}>
            <ul className="space-y-1.5">
              {(ar ? d.benefits_ar : d.benefits_en).map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Steps */}
          <Section
            icon={<ListChecks className="w-5 h-5" />}
            title={ar ? "خطوات عملية" : "Practical steps"}
          >
            <ol className="space-y-2">
              {(ar ? d.steps_ar : d.steps_en).map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </Section>

          {/* Mistakes */}
          <Section
            icon={<AlertTriangle className="w-5 h-5" />}
            title={ar ? "أخطاء شائعة" : "Common mistakes"}
          >
            <ul className="space-y-1.5">
              {(ar ? d.mistakes_ar : d.mistakes_en).map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-destructive flex-shrink-0">✕</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Warning */}
          {(ar ? d.warning_ar : d.warning_en) && (
            <div className="rounded-2xl p-4 border-2 border-destructive/30 bg-destructive/5">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <p className="font-bold text-destructive text-sm">
                  {ar ? "ملاحظة مهمة" : "Important note"}
                </p>
              </div>
              <p className="text-sm text-foreground/80">{ar ? d.warning_ar : d.warning_en}</p>
            </div>
          )}

          {/* Did you know */}
          <div
            className="rounded-2xl p-4 border border-primary/20"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.94 0.04 350 / 0.6), oklch(0.92 0.05 320 / 0.6))",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <p className="font-bold text-primary text-sm">
                {ar ? "هل تعلمين؟" : "Did you know?"}
              </p>
            </div>
            <p className="text-sm text-foreground/80">
              {ar ? d.did_you_know_ar : d.did_you_know_en}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={toggleFav}
              className={`flex-1 rounded-2xl py-3 font-bold flex items-center justify-center gap-2 transition ${isFav ? "btn-glow" : "glass text-primary"}`}
            >
              <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
              {ar ? "المفضلة" : "Favorite"}
            </button>
            <button
              onClick={share}
              className="flex-1 glass rounded-2xl py-3 font-bold text-primary flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              {ar ? "مشاركة" : "Share"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <h4 className="font-bold text-primary">{title}</h4>
      </div>
      {children}
    </section>
  );
}
