import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Heart, Smile, BarChart3, Sparkles, PhoneCall } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { MoodJournalCard } from "@/components/pinkcare/wellbeing/MoodJournalCard";
import { EmotionalTrackingView } from "@/components/pinkcare/wellbeing/EmotionalTrackingView";
import { WellbeingActivitiesGrid } from "@/components/pinkcare/wellbeing/WellbeingActivitiesGrid";
import { ActivityPlayerModal } from "@/components/pinkcare/wellbeing/ActivityPlayerModal";
import { SupportiveMessagesCard } from "@/components/pinkcare/wellbeing/SupportiveMessagesCard";
import { ProfessionalSupportModal } from "@/components/pinkcare/wellbeing/ProfessionalSupportModal";
import {
  WELLBEING_ACTIVITIES,
  type ActivityDefinition,
} from "@/components/pinkcare/wellbeing/WellbeingTypes";

export const Route = createFileRoute("/_app/wellbeing")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab as "journal" | "activities" | "tracking") || "journal",
    crisis: search.crisis === "true" || search.crisis === true,
  }),
  component: WellbeingPage,
});

function WellbeingPage() {
  const { lang, t } = useI18n();
  const search = Route.useSearch();
  const [activeSection, setActiveSection] = useState<"journal" | "activities" | "tracking">(
    search.tab || "journal",
  );
  const [selectedActivity, setSelectedActivity] = useState<ActivityDefinition | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(Boolean(search.crisis));
  const [isUrgentDistress, setIsUrgentDistress] = useState(false);

  // Sync with reactive search params
  useEffect(() => {
    if (
      search.tab &&
      (search.tab === "activities" || search.tab === "tracking" || search.tab === "journal")
    ) {
      setActiveSection(search.tab);
    }
    if (search.crisis) {
      setIsCrisisModalOpen(true);
    }
  }, [search.tab, search.crisis]);

  const handleLaunchActivity = (act: ActivityDefinition) => {
    setSelectedActivity(act);
    setIsActivityModalOpen(true);
  };

  const handleLaunchBreathing = () => {
    const breathingAct = WELLBEING_ACTIVITIES.find((a) => a.type === "breathing");
    if (breathingAct) {
      handleLaunchActivity(breathingAct);
    }
  };

  const handleOpenEmergencySupport = (urgent = true) => {
    setIsUrgentDistress(urgent);
    setIsCrisisModalOpen(true);
  };

  return (
    <div className="space-y-5 pb-8 animate-fade-in">
      {/* Title & Introduction */}
      <section className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-1">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>
            {lang === "ar"
              ? "رعاية الروح والسكينة"
              : lang === "dz"
                ? "راحة البال والمورال"
                : lang === "fr"
                  ? "Soin de l'esprit & Sérénité"
                  : "Gentle Emotional Care"}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-primary">{t("emotional_support")}</h2>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
          {t("emotional_subtitle")}
        </p>
        <div className="h-1 w-16 mx-auto rounded-full gradient-rose mt-1" />
      </section>

      {/* HIGH VISIBILITY CRISIS SUPPORT & SPECIALIST BUTTON */}
      <div className="glass rounded-3xl p-3.5 border border-rose-300/40 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-rose-500/20 text-rose-600 flex items-center justify-center shrink-0">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-xs text-foreground">
              {lang === "ar"
                ? "هل تحتاجين دعماً أو مساعدة عاجلة؟"
                : lang === "dz"
                  ? "محتاجة مساندة ولا شكون يسمعك درك؟"
                  : lang === "fr"
                    ? "Besoin d'écoute ou d'aide urgente ?"
                    : "Need support or urgent listening?"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {lang === "ar" || lang === "dz"
                ? "أرقام مجانية 24/7 (الجزائر: 3033 / 14 • فرنسا: 3114)"
                : "24/7 free helplines (DZ: 3033 / 14 • FR: 3114)"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleOpenEmergencySupport(false)}
          className="px-3 py-1.5 rounded-xl bg-card border border-rose-400/40 text-rose-700 dark:text-rose-300 font-bold text-xs hover:bg-rose-50 transition shrink-0 shadow-xs"
        >
          {lang === "ar"
            ? "خطوط الدعم"
            : lang === "dz"
              ? "خطوط الدعم"
              : lang === "fr"
                ? "Lignes d'aide"
                : "Helplines"}
        </button>
      </div>

      {/* Supportive Affirmation Card */}
      <SupportiveMessagesCard />

      {/* Main Section Navigation Tabs */}
      <div className="glass-strong rounded-3xl p-1.5 flex gap-1 text-xs font-bold shadow-xs">
        <button
          type="button"
          onClick={() => setActiveSection("journal")}
          className={`flex-1 py-2.5 px-2 rounded-2xl transition flex items-center justify-center gap-1.5 ${
            activeSection === "journal"
              ? "gradient-rose text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Smile className="w-4 h-4" />
          <span>
            {lang === "ar"
              ? "سجل المشاعر"
              : lang === "dz"
                ? "دفتر المشاعر"
                : lang === "fr"
                  ? "Journal"
                  : "Mood Journal"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("activities")}
          className={`flex-1 py-2.5 px-2 rounded-2xl transition flex items-center justify-center gap-1.5 ${
            activeSection === "activities"
              ? "gradient-rose text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {lang === "ar"
              ? "تمارين العافية"
              : lang === "dz"
                ? "تمارين الراحة"
                : lang === "fr"
                  ? "Ateliers"
                  : "Activities"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("tracking")}
          className={`flex-1 py-2.5 px-2 rounded-2xl transition flex items-center justify-center gap-1.5 ${
            activeSection === "tracking"
              ? "gradient-rose text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>
            {lang === "ar"
              ? "التتبع والرسوم"
              : lang === "dz"
                ? "تطور المورال"
                : lang === "fr"
                  ? "Suivi"
                  : "Tracking"}
          </span>
        </button>
      </div>

      {/* SECTION 1: MOOD JOURNAL */}
      {activeSection === "journal" && (
        <div className="space-y-4 animate-fade-in">
          <MoodJournalCard
            onOpenCrisisModal={() => handleOpenEmergencySupport(true)}
            onOpenBreathing={handleLaunchBreathing}
          />
        </div>
      )}

      {/* SECTION 2: WELLBEING ACTIVITIES */}
      {activeSection === "activities" && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass rounded-3xl p-4 border border-primary/20 space-y-1">
            <h3 className="font-bold text-sm text-foreground">
              {lang === "ar"
                ? "تمارين نفسية وعصبية داعمة"
                : lang === "dz"
                  ? "تمارين استرخاء وراحة للبال"
                  : lang === "fr"
                    ? "Ateliers de bien-être mental & sensoriel"
                    : "Supportive Mental Well-being Exercises"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {lang === "ar"
                ? "تمارين استرخاء لطيفة مع مؤقتات مرنة لتخفيف الإجهاد واستعادة التوازن"
                : lang === "dz"
                  ? "تمارين خفيفة مع عداد وقت لتنقيص التعب واسترجاع الراحة"
                  : lang === "fr"
                    ? "Des pauses guidées avec minuteurs flexibles pour relâcher la pression"
                    : "Gentle evidence-based pauses with flexible timers to recharge your calm"}
            </p>
          </div>

          <WellbeingActivitiesGrid onSelectActivity={handleLaunchActivity} />
        </div>
      )}

      {/* SECTION 3: EMOTIONAL TRACKING & TRENDS */}
      {activeSection === "tracking" && (
        <div className="space-y-4 animate-fade-in">
          <EmotionalTrackingView />
        </div>
      )}

      {/* Active Activity Player Modal */}
      <ActivityPlayerModal
        activity={selectedActivity}
        open={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
      />

      {/* Professional Support & Emergency Modal */}
      <ProfessionalSupportModal
        open={isCrisisModalOpen}
        isUrgent={isUrgentDistress}
        onClose={() => setIsCrisisModalOpen(false)}
      />
    </div>
  );
}
