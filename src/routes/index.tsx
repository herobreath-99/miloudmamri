import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, ChevronLeft, Sparkles } from "lucide-react";
import slide1 from "@/assets/welcome-slide-1.png";
import slide2 from "@/assets/welcome-slide-2.png";
import { useAuth } from "@/lib/auth";
import { useI18n, getLocalizedText, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: SplashPage,
});

type LocalizedString = {
  ar: string;
  dz: string;
  fr: string;
  en: string;
};

type Slide = {
  image: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  quote: LocalizedString;
};

const SLIDES: Slide[] = [
  {
    image: slide1,
    title: {
      ar: "أهلًا بكِ في PinkCare",
      dz: "مرحبا بيك في PinkCare 💗",
      fr: "Bienvenue sur PinkCare",
      en: "Welcome to PinkCare",
    },
    subtitle: {
      ar: "دليلك اليومي لتكوني بأفضل حال",
      dz: "دليلك اليومي باش تكوني بخير وعافية",
      fr: "Votre guide quotidien pour vous sentir au mieux",
      en: "Your daily guide to feeling your best",
    },
    quote: {
      ar: "كل شروق شمس هو فرصة جديدة للعناية بنفسكِ 🌸",
      dz: "كل نهار جديد فرصة باش تتهلاي في صحتك وروحك 🌸",
      fr: "Chaque lever de soleil est une nouvelle chance de prendre soin de vous 🌸",
      en: "Every sunrise is a new chance to care for yourself 🌸",
    },
  },
  {
    image: slide2,
    title: {
      ar: "رحلتكِ تبدأ من هنا",
      dz: "رحلة الشفاء تبدا من هنا",
      fr: "Votre parcours commence ici",
      en: "Your journey starts here",
    },
    subtitle: {
      ar: "تمارين • تذكيرات • متابعة • دعم نفسي",
      dz: "تمارين • تذكيرات • متابعة • راحة البال",
      fr: "Exercices • Rappels • Suivi • Soutien",
      en: "Exercises • Reminders • Tracking • Support",
    },
    quote: {
      ar: "أنتِ أقوى مما تظنين 💗",
      dz: "راك قوية وما شاء الله عليك 💗",
      fr: "Vous êtes bien plus forte que vous ne le pensez 💗",
      en: "You are stronger than you think 💗",
    },
  },
];

function SplashPage() {
  const nav = useNavigate();
  const { user, profile, loading } = useAuth();
  const { lang, dir } = useI18n();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!loading && (profile || user)) nav({ to: "/home" });
  }, [profile, user, loading, nav]);

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  const goNext = () => {
    if (isLast) nav({ to: "/auth" });
    else setIndex((i) => i + 1);
  };
  const skip = () => nav({ to: "/auth" });

  const ArrowIcon = ChevronLeft;

  const skipLabel = getLocalizedText(lang, {
    ar: "تخطي",
    dz: "تخطي",
    fr: "Passer",
    en: "Skip",
  });

  const nextLabel = isLast
    ? getLocalizedText(lang, {
        ar: "ابدئي الآن",
        dz: "ابداي درك",
        fr: "Commencer",
        en: "Start now",
      })
    : getLocalizedText(lang, {
        ar: "التالي",
        dz: "اللي بعدو",
        fr: "Suivant",
        en: "Next",
      });

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Slides stack with fade */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt=""
            className="w-full h-full object-cover"
            width={1024}
            height={2048}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.95 0.06 350 / 0.05) 0%, oklch(0.4 0.15 330 / 0.15) 45%, oklch(0.25 0.12 320 / 0.7) 100%)",
            }}
          />
        </div>
      ))}

      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full animate-sparkle"
            style={{
              left: `${(i * 41) % 100}%`,
              top: `${(i * 59) % 100}%`,
              width: `${4 + (i % 4) * 2}px`,
              height: `${4 + (i % 4) * 2}px`,
              background: "oklch(0.95 0.1 350)",
              boxShadow: "0 0 12px oklch(0.85 0.18 350 / 0.9)",
              animationDelay: `${0.3 + i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Skip button */}
      <button
        onClick={skip}
        className="absolute top-5 z-20 px-3 py-1.5 rounded-full glass text-xs font-semibold text-primary"
        style={dir === "rtl" ? { left: 16 } : { right: 16 }}
      >
        {skipLabel}
      </button>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-end px-6 pb-10 pt-6 max-w-md mx-auto">
        <div className="mt-2 px-4 py-1.5 rounded-full glass text-[11px] font-semibold text-primary flex items-center gap-1.5 animate-fade-up-soft">
          <Sparkles className="w-3 h-3" />
          PinkCare
        </div>

        <div className="flex-1" />

        {/* Greeting card */}
        <div
          key={index}
          className="glass rounded-3xl p-6 w-full text-center space-y-3 animate-fade-up-soft"
          style={{
            background: "linear-gradient(160deg, oklch(1 0 0 / 0.7), oklch(0.95 0.06 320 / 0.5))",
            boxShadow:
              "0 30px 80px -30px oklch(0.5 0.2 340 / 0.55), inset 0 1px 0 oklch(1 0 0 / 0.7)",
          }}
        >
          <h1 className="text-2xl font-bold text-gradient">
            {getLocalizedText(lang, slide.title)}
          </h1>
          <p className="text-sm text-foreground/85 font-medium">
            {getLocalizedText(lang, slide.subtitle)}
          </p>
          <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <p className="text-sm italic text-foreground/75">
            &quot;{getLocalizedText(lang, slide.quote)}&quot;
          </p>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-2 mt-5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`slide ${i + 1}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === index ? 24 : 8,
                background: i === index ? "oklch(0.7 0.22 340)" : "oklch(0.95 0.05 340 / 0.6)",
              }}
            />
          ))}
        </div>

        <div className="w-full flex flex-col items-center gap-4 mt-5">
          <button
            onClick={goNext}
            className="btn-glow w-full rounded-full py-4 px-8 flex items-center justify-center gap-3 text-lg font-semibold cursor-pointer"
          >
            <Heart className="w-5 h-5" />
            <span>{nextLabel}</span>
            <ArrowIcon className="w-5 h-5" />
          </button>
          <p className="tracking-[0.3em] text-xs text-white/90 drop-shadow-[0_2px_8px_oklch(0.3_0.15_340/0.8)]">
            RESILIENCE & HOPE
          </p>
        </div>
      </div>
    </main>
  );
}
