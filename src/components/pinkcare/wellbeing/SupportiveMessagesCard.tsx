import { useState } from "react";
import { RefreshCw, Heart, Feather, Quote } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SUPPORTIVE_AFFIRMATIONS } from "./WellbeingTypes";

export function SupportiveMessagesCard() {
  const { lang } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const handleNextMessage = () => {
    setIsRotating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % SUPPORTIVE_AFFIRMATIONS.length);
      setIsRotating(false);
    }, 200);
  };

  const currentMsg = SUPPORTIVE_AFFIRMATIONS[currentIndex] || SUPPORTIVE_AFFIRMATIONS[0];

  const getAffirmationText = () => {
    if (lang === "dz") return currentMsg.dz;
    if (lang === "fr") return currentMsg.fr;
    if (lang === "en") return currentMsg.en;
    return currentMsg.ar;
  };

  return (
    <div
      className="glass rounded-3xl p-5 border border-primary/25 relative overflow-hidden space-y-3 shadow-sm"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.96 0.03 330 / 0.8), oklch(0.93 0.05 315 / 0.8))",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full gradient-rose flex items-center justify-center text-primary-foreground shadow-sm">
            <Feather className="w-4 h-4" />
          </div>
          <span className="font-bold text-xs uppercase tracking-wider text-primary">
            {lang === "ar"
              ? "كلمات دافئة لقلبكِ اليوم"
              : lang === "dz"
                ? "كلمات دافية لقلبك اليوم"
                : lang === "fr"
                  ? "Pensée réconfortante & bienveillance"
                  : "Compassionate Reflection"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleNextMessage}
          className="flex items-center gap-1 text-[11px] font-bold text-primary hover:opacity-80 transition bg-white/60 dark:bg-black/30 px-2.5 py-1 rounded-full shadow-xs"
        >
          <RefreshCw className={`w-3 h-3 ${isRotating ? "animate-spin" : ""}`} />
          <span>
            {lang === "ar"
              ? "رسالة أخرى"
              : lang === "dz"
                ? "كلمة أخرى"
                : lang === "fr"
                  ? "Autre pensée"
                  : "Next thought"}
          </span>
        </button>
      </div>

      <div className="py-2 px-1 relative">
        <Quote className="w-8 h-8 text-primary/15 absolute -top-1 start-0 pointer-events-none" />
        <p
          className={`text-sm sm:text-base font-medium text-foreground leading-relaxed transition-opacity duration-200 ${
            isRotating ? "opacity-0" : "opacity-100"
          }`}
        >
          "{getAffirmationText()}"
        </p>
      </div>

      <div className="pt-1 flex items-center justify-between text-[10px] text-muted-foreground border-t border-primary/15">
        <span className="flex items-center gap-1 text-primary">
          <Heart className="w-3 h-3 fill-current" />
          <span>
            {lang === "ar"
              ? "دعم صادق وواقعي بدون ضغط"
              : lang === "dz"
                ? "دعم صادق من القلب وبلا ضغط"
                : lang === "fr"
                  ? "Soutien sincère sans injonction"
                  : "Realistic, compassionate support"}
          </span>
        </span>
        <span className="tabular-nums num-en">
          {currentIndex + 1} / {SUPPORTIVE_AFFIRMATIONS.length}
        </span>
      </div>
    </div>
  );
}
