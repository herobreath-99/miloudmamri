import { useState } from "react";
import {
  Wind,
  Brain,
  Feather,
  Heart,
  Sun,
  BookHeart,
  Moon,
  Clock,
  Play,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { WELLBEING_ACTIVITIES, type ActivityDefinition } from "./WellbeingTypes";

interface Props {
  onSelectActivity: (activity: ActivityDefinition) => void;
}

export function WellbeingActivitiesGrid({ onSelectActivity }: Props) {
  const { lang } = useI18n();
  const [filterCategory, setFilterCategory] = useState<
    "all" | "relaxation" | "mindfulness" | "reflection"
  >("all");

  const filtered =
    filterCategory === "all"
      ? WELLBEING_ACTIVITIES
      : WELLBEING_ACTIVITIES.filter((a) => a.category === filterCategory);

  const getTitle = (act: ActivityDefinition) => {
    if (lang === "dz") return act.title_dz;
    if (lang === "fr") return act.title_fr;
    if (lang === "en") return act.title_en;
    return act.title_ar;
  };

  const getSubtitle = (act: ActivityDefinition) => {
    if (lang === "dz") return act.subtitle_dz;
    if (lang === "fr") return act.subtitle_fr;
    if (lang === "en") return act.subtitle_en;
    return act.subtitle_ar;
  };

  const getCategoryLabel = (category: string) => {
    if (category === "relaxation") {
      if (lang === "dz") return "استرخاء وتنفس";
      if (lang === "fr") return "Relaxation & Souffle";
      if (lang === "en") return "Relaxation & Breath";
      return "استرخاء وتنفس";
    }
    if (category === "mindfulness") {
      if (lang === "dz") return "حضور ذهني وتجذير";
      if (lang === "fr") return "Pleine conscience";
      if (lang === "en") return "Mindfulness";
      return "حضور ذهني وتجذير";
    }
    if (lang === "dz") return "امتنان وتأمل";
    if (lang === "fr") return "Gratitude & Réflexion";
    if (lang === "en") return "Gratitude & Reflection";
    return "امتنان وتأمل";
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "breathing":
        return <Wind className="w-5 h-5" />;
      case "mindfulness":
        return <Brain className="w-5 h-5" />;
      case "relaxation":
        return <Feather className="w-5 h-5" />;
      case "self_reflection":
        return <Heart className="w-5 h-5" />;
      case "daily_motivation":
        return <Sun className="w-5 h-5" />;
      case "gratitude":
        return <BookHeart className="w-5 h-5" />;
      case "sleep_relaxation":
        return <Moon className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Category Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setFilterCategory("all")}
          className={`px-3 py-1.5 rounded-full transition shrink-0 ${
            filterCategory === "all"
              ? "gradient-rose text-primary-foreground shadow-xs"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang === "ar"
            ? "جميع التمارين"
            : lang === "dz"
              ? "كامل التمارين"
              : lang === "fr"
                ? "Tous les exercices"
                : "All Exercises"}
        </button>
        <button
          onClick={() => setFilterCategory("relaxation")}
          className={`px-3 py-1.5 rounded-full transition shrink-0 ${
            filterCategory === "relaxation"
              ? "gradient-rose text-primary-foreground shadow-xs"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          {getCategoryLabel("relaxation")}
        </button>
        <button
          onClick={() => setFilterCategory("mindfulness")}
          className={`px-3 py-1.5 rounded-full transition shrink-0 ${
            filterCategory === "mindfulness"
              ? "gradient-rose text-primary-foreground shadow-xs"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          {getCategoryLabel("mindfulness")}
        </button>
        <button
          onClick={() => setFilterCategory("reflection")}
          className={`px-3 py-1.5 rounded-full transition shrink-0 ${
            filterCategory === "reflection"
              ? "gradient-rose text-primary-foreground shadow-xs"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          {getCategoryLabel("reflection")}
        </button>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 gap-2.5">
        {filtered.map((activity) => (
          <div
            key={activity.type}
            onClick={() => onSelectActivity(activity)}
            className="glass rounded-3xl p-4 border border-primary/20 hover:border-primary/40 hover:scale-[1.01] transition cursor-pointer flex items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activity.accentBg} flex items-center justify-center ${activity.color} shrink-0 shadow-xs`}
              >
                {getIcon(activity.type)}
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">{getTitle(activity)}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{getSubtitle(activity)}</p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1 font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3" />
                    <span className="tabular-nums num-en">
                      {activity.durationMinutes} {lang === "ar" || lang === "dz" ? "دقائق" : "min"}
                    </span>
                  </span>
                  <span>•</span>
                  <span>{getCategoryLabel(activity.category)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition shrink-0"
              title={lang === "ar" || lang === "dz" ? "بدء التمرين" : "Start"}
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
