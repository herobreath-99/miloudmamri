import { useState, useEffect } from "react";
import {
  BarChart3,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import {
  getMoodEntries,
  deleteMoodEntry,
  getWellbeingActivityLogs,
  deleteWellbeingActivityLog,
  type MoodEntry,
  type WellbeingActivityLog,
} from "@/lib/local-db";
import { MOOD_DEFINITIONS, type MoodMeta } from "./WellbeingTypes";

export function EmotionalTrackingView() {
  const { lang, t } = useI18n();
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "notes" | "activities">(
    "weekly",
  );
  const [moodLogs, setMoodLogs] = useState<MoodEntry[]>([]);
  const [activityLogs, setActivityLogs] = useState<WellbeingActivityLog[]>([]);
  const [hideNotesOnScreen, setHideNotesOnScreen] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const getMoodLabel = (meta: MoodMeta) => {
    if (lang === "dz") return meta.label_dz;
    if (lang === "fr") return meta.label_fr;
    if (lang === "en") return meta.label_en;
    return meta.label_ar;
  };

  const loadData = () => {
    setMoodLogs(getMoodEntries());
    setActivityLogs(getWellbeingActivityLogs());
  };

  useEffect(() => {
    loadData();
    const handleMood = () => loadData();
    const handleAct = () => loadData();
    window.addEventListener("pinkcare:mood-updated", handleMood);
    window.addEventListener("pinkcare:activity-logged", handleAct);
    return () => {
      window.removeEventListener("pinkcare:mood-updated", handleMood);
      window.removeEventListener("pinkcare:activity-logged", handleAct);
    };
  }, []);

  const handleDeleteMood = (id: string) => {
    const msg =
      lang === "ar"
        ? "هل ترغبين بحذف هذا التسجيل؟"
        : lang === "dz"
          ? "حابة تمسحي هاد التسجيل؟"
          : lang === "fr"
            ? "Supprimer cet enregistrement ?"
            : "Delete this entry?";
    if (confirm(msg)) {
      deleteMoodEntry(id);
      toast.success(
        lang === "ar"
          ? "تم حذف التسجيل"
          : lang === "dz"
            ? "تم مسح التسجيل"
            : lang === "fr"
              ? "Enregistrement supprimé"
              : "Entry deleted",
      );
      loadData();
    }
  };

  const handleDeleteActivity = (id: string) => {
    const msg =
      lang === "ar"
        ? "هل ترغبين بحذف سجل هذا النشاط؟"
        : lang === "dz"
          ? "حابة تمسحي هاد النشاط؟"
          : lang === "fr"
            ? "Supprimer cet historique d'activité ?"
            : "Delete this activity record?";
    if (confirm(msg)) {
      deleteWellbeingActivityLog(id);
      toast.success(
        lang === "ar"
          ? "تم حذف النشاط"
          : lang === "dz"
            ? "تم مسح النشاط"
            : lang === "fr"
              ? "Activité supprimée"
              : "Activity removed",
      );
      loadData();
    }
  };

  // Build last 7 days array
  const last7Days: { dateStr: string; dayLabel: string; entry?: MoodEntry }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().slice(0, 10);
    const localeStr =
      lang === "ar" ? "ar-DZ" : lang === "dz" ? "ar-DZ" : lang === "fr" ? "fr-FR" : "en-US";
    const dayLabel = d.toLocaleDateString(localeStr, { weekday: "short" });
    const entry = moodLogs.find((m) => m.date === dateStr);
    last7Days.push({ dateStr, dayLabel, entry });
  }

  // Distribution counts
  const moodCounts: Record<string, number> = {};
  for (const m of moodLogs) {
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
  }
  const totalEntries = moodLogs.length;

  return (
    <div className="space-y-4">
      {/* MANDATORY MEDICAL / ETHICAL NON-DIAGNOSTIC BANNER */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-200">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-amber-800 dark:text-amber-300">
            {lang === "ar"
              ? "تنبيه طبي وأخلاقي مهم:"
              : lang === "dz"
                ? "تنبيه طبي وأخلاقي مهم:"
                : lang === "fr"
                  ? "Avis médical & éthique important :"
                  : "Important Clinical Notice:"}
          </p>
          <p className="leading-relaxed">{t("non_diagnostic_disclaimer")}</p>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="glass rounded-2xl p-1.5 flex gap-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab("weekly")}
          className={`flex-1 py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === "weekly"
              ? "gradient-rose text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>
            {lang === "ar"
              ? "أسبوعي"
              : lang === "dz"
                ? "أسبوعي"
                : lang === "fr"
                  ? "Hebdo"
                  : "Weekly"}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("monthly")}
          className={`flex-1 py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === "monthly"
              ? "gradient-rose text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {lang === "ar"
              ? "شهري"
              : lang === "dz"
                ? "شهري"
                : lang === "fr"
                  ? "Mensuel"
                  : "Monthly"}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={`flex-1 py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === "notes"
              ? "gradient-rose text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>
            {lang === "ar"
              ? "الملاحظات"
              : lang === "dz"
                ? "الملاحظات"
                : lang === "fr"
                  ? "Notes"
                  : "Notes"}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("activities")}
          className={`flex-1 py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === "activities"
              ? "gradient-rose text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>
            {lang === "ar"
              ? "الأنشطة"
              : lang === "dz"
                ? "التمارين"
                : lang === "fr"
                  ? "Activités"
                  : "Activities"}
          </span>
        </button>
      </div>

      {/* TAB 1: WEEKLY OVERVIEW */}
      {activeTab === "weekly" && (
        <div className="space-y-4 animate-fade-in">
          {/* 7-Day Visual Bars */}
          <div className="glass rounded-3xl p-5 border border-primary/20 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  {lang === "ar"
                    ? "رحلة مشاعركِ خلال آخر 7 أيام"
                    : lang === "dz"
                      ? "المورال ديالك خلال آخر 7 أيام"
                      : lang === "fr"
                        ? "Votre parcours émotionnel (7 derniers jours)"
                        : "Your Emotional Journey (Last 7 Days)"}
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  {lang === "ar"
                    ? "كل يوم هو محطة جديدة في طريق التعافي"
                    : lang === "dz"
                      ? "كل نهار خطوة جديدة في طريق الشفاء"
                      : lang === "fr"
                        ? "Chaque jour est une étape douce vers le rétablissement"
                        : "Every day is a gentle stepping stone"}
                </p>
              </div>
              <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold tabular-nums num-en">
                {
                  moodLogs.filter((m) => {
                    const dayDiff = (now.getTime() - new Date(m.date).getTime()) / 86400000;
                    return dayDiff <= 7;
                  }).length
                }{" "}
                / 7 {lang === "ar" || lang === "dz" ? "أيام" : "days"}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 pt-2">
              {last7Days.map((d) => {
                const meta = d.entry
                  ? MOOD_DEFINITIONS.find((m) => m.type === d.entry?.mood)
                  : null;
                const isToday = d.dateStr === now.toISOString().slice(0, 10);
                return (
                  <div
                    key={d.dateStr}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition ${
                      isToday
                        ? "bg-primary/10 border-primary/40 font-bold"
                        : "bg-secondary/40 border-border/40"
                    }`}
                  >
                    <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                      {d.dayLabel}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-card flex items-center justify-center text-lg shadow-sm">
                      {meta ? (
                        meta.emoji
                      ) : (
                        <span className="text-muted-foreground/40 text-xs">•</span>
                      )}
                    </div>
                    <span className="text-[9px] text-muted-foreground tabular-nums num-en">
                      {d.dateStr.slice(8)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Emotional Breakdown Stats */}
          <div className="glass rounded-3xl p-5 border border-primary/20 space-y-3">
            <h4 className="font-bold text-sm text-foreground">
              {lang === "ar"
                ? "توزيع المشاعر المسجلة"
                : lang === "dz"
                  ? "توزيع المشاعر المسجلة"
                  : lang === "fr"
                    ? "Répartition globale des humeurs"
                    : "Overall Mood Distribution"}
            </h4>
            {totalEntries === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                {lang === "ar"
                  ? "لا توجد تسجيلات بعد. ابدئي بتسجيل شعوركِ اليوم 🌸"
                  : lang === "dz"
                    ? "ما كاين حتى تسجيل درك. ابداي سجلي واش راكي حاسة اليوم 🌸"
                    : lang === "fr"
                      ? "Aucun enregistrement pour le moment. Commencez par noter votre humeur 🌸"
                      : "No mood records yet. Start by logging your feeling today 🌸"}
              </p>
            ) : (
              <div className="space-y-2.5">
                {MOOD_DEFINITIONS.map((def) => {
                  const count = moodCounts[def.type] || 0;
                  if (count === 0) return null;
                  const percentage = Math.round((count / totalEntries) * 100);
                  return (
                    <div key={def.type} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span>{def.emoji}</span>
                          <span>{getMoodLabel(def)}</span>
                        </span>
                        <span className="text-muted-foreground font-bold tabular-nums num-en">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full gradient-rose transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MONTHLY HISTORY */}
      {activeTab === "monthly" && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass rounded-3xl p-5 border border-primary/20 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  {lang === "ar"
                    ? "سجل الشهر الحالي"
                    : lang === "dz"
                      ? "سجل الشهر الحالي"
                      : lang === "fr"
                        ? "Historique mensuel"
                        : "Monthly Mood Overview"}
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  {lang === "ar"
                    ? "استعرضي أيام الشهر ومشاعرها المسجلة"
                    : lang === "dz"
                      ? "شوفي نهارات الشهر والمشاعر لي تسجلت"
                      : lang === "fr"
                        ? "Consultez vos check-ins quotidiens de ce mois"
                        : "Daily check-ins logged this month"}
                </p>
              </div>
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold tabular-nums num-en">
                {moodLogs.length} {lang === "ar" || lang === "dz" ? "تسجيل" : "entries"}
              </span>
            </div>

            <div className="divide-y divide-border/40 max-h-[360px] overflow-y-auto">
              {moodLogs.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  {lang === "ar" || lang === "dz"
                    ? "لا توجد تسجيلات بعد"
                    : lang === "fr"
                      ? "Aucun enregistrement pour le moment"
                      : "No records yet"}
                </p>
              ) : (
                moodLogs.map((entry) => {
                  const meta = MOOD_DEFINITIONS.find((m) => m.type === entry.mood);
                  return (
                    <div
                      key={entry.id}
                      className="py-2.5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{meta?.emoji || "🌸"}</span>
                        <div>
                          <p className="font-bold text-foreground">
                            {entry.mood === "other" && entry.customMoodName
                              ? entry.customMoodName
                              : meta
                                ? getMoodLabel(meta)
                                : ""}
                          </p>
                          <p className="text-[10px] text-muted-foreground tabular-nums num-en">
                            {entry.date} •{" "}
                            {entry.at
                              ? new Date(entry.at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {entry.wellness != null && (
                          <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full font-medium tabular-nums num-en">
                            {lang === "ar" || lang === "dz"
                              ? `راحة: ${entry.wellness}/5`
                              : lang === "fr"
                                ? `Paix : ${entry.wellness}/5`
                                : `Peace: ${entry.wellness}/5`}
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteMood(entry.id)}
                          className="w-7 h-7 rounded-full text-muted-foreground hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition"
                          title={
                            lang === "ar" || lang === "dz"
                              ? "حذف"
                              : lang === "fr"
                                ? "Supprimer"
                                : "Delete"
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRIVATE NOTES REVIEW */}
      {activeTab === "notes" && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass rounded-3xl p-5 border border-primary/20 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-primary" />
                  <span>
                    {lang === "ar"
                      ? "ملاحظاتكِ وسجلكِ الخاص"
                      : lang === "dz"
                        ? "ملاحظاتك وسجلك الخاص"
                        : lang === "fr"
                          ? "Notes personnelles & réflexions"
                          : "Your Private Notes & Reflections"}
                  </span>
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  {lang === "ar"
                    ? "لا يطلع عليها أي شخص آخر؛ محفوظة على هاتفكِ فقط"
                    : lang === "dz"
                      ? "ما يشوفها حتى واحد، محفوظة في تيليفونك برك"
                      : lang === "fr"
                        ? "Confidentiel : stocké sur votre appareil uniquement"
                        : "Stored on your phone only; strictly private"}
                </p>
              </div>

              {/* Privacy screen blur toggle */}
              <button
                onClick={() => setHideNotesOnScreen((v) => !v)}
                className="flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition"
              >
                {hideNotesOnScreen ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
                <span>
                  {hideNotesOnScreen
                    ? lang === "ar" || lang === "dz"
                      ? "إظهار الملاحظات"
                      : lang === "fr"
                        ? "Afficher"
                        : "Show"
                    : lang === "ar" || lang === "dz"
                      ? "حجب للسرية"
                      : lang === "fr"
                        ? "Masquer"
                        : "Blur Notes"}
                </span>
              </button>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto">
              {moodLogs.filter((m) => m.notes).length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  {lang === "ar"
                    ? "لم تسجلي أي ملاحظات مكتوبة بعد. يمكنكِ إضافة ملاحظة مع تسجيل مشاعركِ القادم 📝"
                    : lang === "dz"
                      ? "ما كتبتي حتى ملاحظة درك. تقدري تكتبي في تسجيل المشاعر الجاي 📝"
                      : lang === "fr"
                        ? "Aucune note rédigée pour le moment. Vous pouvez en ajouter lors de votre prochain check-in 📝"
                        : "No written notes logged yet. You can add one during your next check-in 📝"}
                </p>
              ) : (
                moodLogs
                  .filter((m) => m.notes)
                  .map((entry) => {
                    const meta = MOOD_DEFINITIONS.find((m) => m.type === entry.mood);
                    const isExpanded = expandedLogId === entry.id;
                    return (
                      <div
                        key={entry.id}
                        className="p-3.5 rounded-2xl bg-secondary/50 border border-border/40 space-y-2 transition"
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="flex items-center gap-1.5 font-bold">
                            <span>{meta?.emoji || "🌸"}</span>
                            <span>{meta ? getMoodLabel(meta) : ""}</span>
                          </span>
                          <span className="text-muted-foreground tabular-nums num-en">
                            {entry.date}
                          </span>
                        </div>
                        <p
                          className={`text-xs text-foreground/90 whitespace-pre-wrap transition ${
                            hideNotesOnScreen ? "filter blur-xs select-none" : ""
                          }`}
                        >
                          {entry.notes}
                        </p>
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => handleDeleteMood(entry.id)}
                            className="text-[10px] text-rose-600 hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>
                              {lang === "ar" || lang === "dz"
                                ? "حذف الملاحظة"
                                : lang === "fr"
                                  ? "Supprimer"
                                  : "Delete"}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPLETED ACTIVITIES */}
      {activeTab === "activities" && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass rounded-3xl p-5 border border-primary/20 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {lang === "ar"
                      ? "سجل التمارين المنجزة"
                      : lang === "dz"
                        ? "التمارين لي كملتيهم"
                        : lang === "fr"
                          ? "Activités de bien-être complétées"
                          : "Completed Well-being Activities"}
                  </span>
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  {lang === "ar"
                    ? "كل جلسة استرخاء هي هدية تهديها لجسدكِ وروحكِ"
                    : lang === "dz"
                      ? "كل جلسة استرخاء هي راحة لجسمك وبالك"
                      : lang === "fr"
                        ? "Chaque pause méditative est un cadeau pour votre corps"
                        : "Honoring every mindful pause"}
                </p>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full font-bold tabular-nums num-en">
                {activityLogs.length} {lang === "ar" || lang === "dz" ? "جلسة" : "sessions"}
              </span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto">
              {activityLogs.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  {lang === "ar"
                    ? "لم تنجزي أي تمارين بعد. جرّبي تمرين التنفس أو الامتنان اليوم 🌸"
                    : lang === "dz"
                      ? "ما درتي حتى تمرين بعد. جربي تمرين التنفس ولا الامتنان اليوم 🌸"
                      : lang === "fr"
                        ? "Aucune activité terminée pour le moment. Essayez un exercice de respiration douce ou de gratitude 🌸"
                        : "No completed activities yet. Try a gentle breathing or gratitude exercise today 🌸"}
                </p>
              ) : (
                activityLogs.map((act) => {
                  const minutes = Math.max(1, Math.round(act.durationSeconds / 60));
                  return (
                    <div
                      key={act.id}
                      className="p-3 rounded-2xl bg-secondary/50 border border-border/40 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl gradient-rose text-primary-foreground flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{act.title}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-primary" />
                            <span className="tabular-nums num-en">
                              {minutes} {lang === "ar" || lang === "dz" ? "دقيقة" : "min"}
                            </span>
                            <span>•</span>
                            <span className="tabular-nums num-en">{act.date}</span>
                          </p>
                          {act.notes && (
                            <p className="text-[11px] text-primary mt-1 italic">"{act.notes}"</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteActivity(act.id)}
                        className="w-7 h-7 rounded-full text-muted-foreground hover:text-rose-600 flex items-center justify-center"
                        title={
                          lang === "ar" || lang === "dz"
                            ? "حذف"
                            : lang === "fr"
                              ? "Supprimer"
                              : "Delete"
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
