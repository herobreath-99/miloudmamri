import { useState, useEffect } from "react";
import { Sparkles, Lock, Heart, Pencil, Check, Smile, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import {
  saveMoodEntry,
  getTodayMood,
  todayISO,
  type MoodType,
  type MoodEntry,
} from "@/lib/local-db";
import { MOOD_DEFINITIONS, type MoodMeta } from "./WellbeingTypes";

interface Props {
  onOpenCrisisModal?: () => void;
  onOpenBreathing?: () => void;
  onEntrySaved?: (entry: MoodEntry) => void;
}

const PRESET_TAGS = [
  {
    ar: "يوم علاج",
    dz: "نهار السبيطار والعلاج",
    fr: "Jour de traitement",
    en: "Treatment day",
  },
  {
    ar: "مع العائلة",
    dz: "مع العايلة والحباب",
    fr: "En famille",
    en: "With family",
  },
  {
    ar: "راحة تامة",
    dz: "راحة ورياح",
    fr: "Repos complet",
    en: "Pure rest",
  },
  {
    ar: "ألم خفيف",
    dz: "وجيعة خفيفة",
    fr: "Légère gêne",
    en: "Mild discomfort",
  },
  {
    ar: "نوم مريح",
    dz: "رڨاد هني ومريح",
    fr: "Sommeil réparateur",
    en: "Restful sleep",
  },
  {
    ar: "مشي خفيف",
    dz: "حركة ومشي خفيف",
    fr: "Marche douce",
    en: "Gentle walk",
  },
  {
    ar: "قراءة ودعاء",
    dz: "دعاء وقراءة هادية",
    fr: "Prière & méditation",
    en: "Quiet reflection",
  },
];

export function MoodJournalCard({ onOpenCrisisModal, onOpenBreathing, onEntrySaved }: Props) {
  const { lang, t } = useI18n();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [customMoodName, setCustomMoodName] = useState("");
  const [notes, setNotes] = useState("");
  const [wellnessLevel, setWellnessLevel] = useState<number>(3);
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [todayEntry, setTodayEntry] = useState<MoodEntry | undefined>(undefined);
  const [showDistressPrompt, setShowDistressPrompt] = useState(false);

  const getMoodLabel = (m: MoodMeta) => {
    if (lang === "dz") return m.label_dz;
    if (lang === "fr") return m.label_fr;
    if (lang === "en") return m.label_en;
    return m.label_ar;
  };

  const getMoodDesc = (m: MoodMeta) => {
    if (lang === "dz") return m.description_dz;
    if (lang === "fr") return m.description_fr;
    if (lang === "en") return m.description_en;
    return m.description_ar;
  };

  const getTagLabel = (tag: (typeof PRESET_TAGS)[0]) => {
    if (lang === "dz") return tag.dz;
    if (lang === "fr") return tag.fr;
    if (lang === "en") return tag.en;
    return tag.ar;
  };

  // Load today's existing entry
  useEffect(() => {
    loadTodayEntry();
    const handleUpdate = () => loadTodayEntry();
    window.addEventListener("pinkcare:mood-updated", handleUpdate);
    return () => window.removeEventListener("pinkcare:mood-updated", handleUpdate);
  }, []);

  const loadTodayEntry = () => {
    const entry = getTodayMood();
    setTodayEntry(entry);
    if (entry) {
      setSelectedMood(entry.mood as MoodType);
      setCustomMoodName(entry.customMoodName || "");
      setNotes(entry.notes || "");
      setWellnessLevel(entry.wellness || 3);
      setEnergyLevel(entry.energy || 3);
      setSelectedTags(entry.tags || []);
    }
  };

  const handleSelectMood = (type: MoodType) => {
    setSelectedMood(type);
    if (["sad", "anxious", "exhausted", "stressed"].includes(type)) {
      setShowDistressPrompt(true);
    } else {
      setShowDistressPrompt(false);
    }
  };

  const toggleTag = (tagStr: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagStr) ? prev.filter((t) => t !== tagStr) : [...prev, tagStr],
    );
  };

  const handleSave = () => {
    if (!selectedMood) {
      toast.error(
        lang === "ar"
          ? "يرجى اختيار شعوركِ أولاً 🌸"
          : lang === "dz"
            ? "خيري واش راكي حاسة أولاً 🌸"
            : lang === "fr"
              ? "Veuillez sélectionner votre ressenti 🌸"
              : "Please select your mood first 🌸",
      );
      return;
    }

    const saved = saveMoodEntry({
      id: todayEntry?.id,
      mood: selectedMood,
      customMoodName: selectedMood === "other" ? customMoodName.trim() : undefined,
      notes: notes.trim() || undefined,
      wellness: wellnessLevel,
      energy: energyLevel,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      date: todayISO(),
    });

    setTodayEntry(saved);
    setIsEditing(false);

    toast.success(
      lang === "ar"
        ? "تم حفظ شعوركِ بأمان في سجلكِ الخاص 💗"
        : lang === "dz"
          ? "تسجل شعورك في دفترك السري بأمان 💗"
          : lang === "fr"
            ? "Votre humeur a été enregistrée en toute confidentialité 💗"
            : "Your mood was saved safely in your private journal 💗",
    );

    if (onEntrySaved) onEntrySaved(saved);
  };

  const activeMeta = MOOD_DEFINITIONS.find((m) => m.type === selectedMood);

  // If already logged and not in editing mode, display summary card
  if (todayEntry && !isEditing) {
    const recordedMeta = MOOD_DEFINITIONS.find((m) => m.type === todayEntry.mood);
    return (
      <div className="glass rounded-3xl p-5 border border-primary/25 space-y-4 shadow-sm animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>
              {lang === "ar"
                ? "شعوركِ المسجل لليوم"
                : lang === "dz"
                  ? "المورال ديالك المسجل اليوم"
                  : lang === "fr"
                    ? "Votre ressenti enregistré aujourd'hui"
                    : "Today's Logged Mood"}
            </span>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-full transition"
          >
            <Pencil className="w-3 h-3" />
            <span>
              {lang === "ar"
                ? "تعديل"
                : lang === "dz"
                  ? "تبديل"
                  : lang === "fr"
                    ? "Modifier"
                    : "Edit"}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/50 border border-border/40">
          <div className="text-3xl sm:text-4xl p-2 rounded-2xl bg-card shadow-sm shrink-0">
            {recordedMeta?.emoji || "🌸"}
          </div>
          <div className="flex-1">
            <p className="font-bold text-base text-foreground">
              {todayEntry.mood === "other" && todayEntry.customMoodName
                ? todayEntry.customMoodName
                : recordedMeta
                  ? getMoodLabel(recordedMeta)
                  : ""}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {recordedMeta ? getMoodDesc(recordedMeta) : ""}
            </p>
          </div>
        </div>

        {todayEntry.notes && (
          <div className="p-3.5 rounded-2xl bg-card/60 border border-border/40 space-y-1">
            <p className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
              <Lock className="w-3 h-3 text-primary" />
              <span>
                {lang === "ar"
                  ? "ملاحظتكِ الشخصية المشفرة:"
                  : lang === "dz"
                    ? "ملاحظاتك الشخصية السرية:"
                    : lang === "fr"
                      ? "Note personnelle chiffrée :"
                      : "Your Private Note:"}
              </span>
            </p>
            <p className="text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {todayEntry.notes}
            </p>
          </div>
        )}

        {todayEntry.tags && todayEntry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {todayEntry.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {lang === "ar"
                ? "محفوظ محلياً ومحمي تماماً"
                : lang === "dz"
                  ? "محفوظ غير عندك ومشفر"
                  : lang === "fr"
                    ? "Stocké localement & strictement confidentiel"
                    : "Stored locally & 100% private"}
            </span>
          </span>
          <span className="tabular-nums num-en">{todayEntry.date}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-5 border border-primary/25 space-y-4 shadow-sm animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-primary/15 flex items-center justify-center text-primary">
            <Smile className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-foreground">
              {lang === "ar"
                ? "كيف تشعرين اليوم؟"
                : lang === "dz"
                  ? "كيفاش راه المورال ديالك اليوم؟"
                  : lang === "fr"
                    ? "Comment vous sentez-vous aujourd'hui ?"
                    : "How are you feeling today?"}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {lang === "ar"
                ? "سجّلي مشاعركِ بصدق دون أي حكم أو ضغط"
                : lang === "dz"
                  ? "سجلي واش راكي حاسة بكل صدق وبلا ما تضغطي على روحك"
                  : lang === "fr"
                    ? "Exprimez votre ressenti en toute franchise et sans jugement"
                    : "Check in with your feelings gently and honestly"}
            </p>
          </div>
        </div>

        {isEditing && (
          <button
            onClick={() => setIsEditing(false)}
            className="text-xs text-muted-foreground hover:text-foreground font-bold"
          >
            {lang === "ar"
              ? "إلغاء"
              : lang === "dz"
                ? "بطلت"
                : lang === "fr"
                  ? "Annuler"
                  : "Cancel"}
          </button>
        )}
      </div>

      {/* Mood Selector (8 Emotions Required) */}
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 pt-1">
        {MOOD_DEFINITIONS.map((m) => {
          const isSelected = selectedMood === m.type;
          return (
            <button
              key={m.type}
              type="button"
              onClick={() => handleSelectMood(m.type)}
              className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 transition text-center relative border ${
                isSelected
                  ? `gradient-rose text-primary-foreground shadow-md ${m.borderColor} scale-105 ring-2 ring-primary/40`
                  : `bg-secondary/40 hover:bg-secondary border-border/50 text-foreground`
              }`}
            >
              <span className="text-2xl sm:text-3xl">{m.emoji}</span>
              <span className="text-[11px] font-bold leading-tight mt-0.5">{getMoodLabel(m)}</span>
            </button>
          );
        })}
      </div>

      {/* Description of picked mood */}
      {activeMeta && (
        <div className="p-3 rounded-2xl bg-secondary/50 border border-border/40 text-xs text-foreground/80 flex items-center justify-between animate-fade-in">
          <span>{getMoodDesc(activeMeta)}</span>
          <span className="text-base">{activeMeta.emoji}</span>
        </div>
      )}

      {/* Custom mood text field if "Other" is picked */}
      {selectedMood === "other" && (
        <div className="space-y-1 animate-slide-down">
          <label className="text-xs font-bold text-foreground">
            {lang === "ar"
              ? "صفي شعوركِ بكلمتكِ الخاصة:"
              : lang === "dz"
                ? "وصفي شعورك بكلماتك الشخصية:"
                : lang === "fr"
                  ? "Décrivez votre ressenti en vos propres mots :"
                  : "Describe your feeling in your own words:"}
          </label>
          <input
            type="text"
            value={customMoodName}
            onChange={(e) => setCustomMoodName(e.target.value)}
            placeholder={
              lang === "ar"
                ? "مثال: ممتنة، مرتبكة، محتارة، في انتظار..."
                : lang === "dz"
                  ? "مثال: راني فرحانة، شوية حيرانة، ربي يفرج..."
                  : lang === "fr"
                    ? "ex. Reconnaissante, pensive, dans l'attente..."
                    : "e.g. Grateful, contemplative, numb..."
            }
            className="w-full px-3.5 py-2.5 rounded-2xl bg-secondary/60 border border-primary/30 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      )}

      {/* GENTLE DISTRESS PROMPT / IMMEDIATE SUPPORT OFFER */}
      {showDistressPrompt && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-2 animate-slide-down">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs">
            <Heart className="w-4 h-4 shrink-0 text-rose-500" />
            <span>
              {lang === "ar"
                ? "نحن نشعر بكِ ونقف معكِ. من الطبيعي تماماً أن تشعري بهذا الثقل."
                : lang === "dz"
                  ? "حاسين بيك وواقفين معاك. هاد الثقل طبيعي ومفهوم ربي يخفف عليك."
                  : lang === "fr"
                    ? "Nous sommes de tout cœur avec vous. Il est tout à fait légitime de ressentir ce poids."
                    : "We hear you. It is completely normal and valid to feel this weight."}
            </span>
          </div>
          <p className="text-[11px] text-rose-950 dark:text-rose-200 leading-relaxed">
            {lang === "ar"
              ? "إذا كان الشعور خانقاً أو مفاجئاً، يمكنكِ تجربة دقيقتين من التنفس الهادئ، أو التواصل مع خطوط الدعم المتخصصة فوراً."
              : lang === "dz"
                ? "إذا راكي حاسة بضيق كبير، جربي زوج دقائق تاع تنفس هادئ ولا تكلمي مع خطوط الدعم المتخصصة."
                : lang === "fr"
                  ? "Si cette émotion devient trop vive, deux minutes de respiration apaisante ou un échange avec un professionnel peuvent vous aider à vous recentrer."
                  : "If this feeling is overwhelming, gentle 2-minute breathing or speaking to a support professional can help ground you."}
          </p>
          <div className="flex items-center gap-2 pt-1">
            {onOpenBreathing && (
              <button
                type="button"
                onClick={onOpenBreathing}
                className="px-3 py-1.5 rounded-xl gradient-rose text-primary-foreground text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <span>
                  {lang === "ar"
                    ? "جلسة تنفس مهدئة"
                    : lang === "dz"
                      ? "تنفس هادئ"
                      : lang === "fr"
                        ? "Respiration apaisante"
                        : "Calm Breathing"}
                </span>
              </button>
            )}
            {onOpenCrisisModal && (
              <button
                type="button"
                onClick={onOpenCrisisModal}
                className="px-3 py-1.5 rounded-xl bg-card border border-rose-300 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1 hover:bg-rose-50"
              >
                <span>
                  {lang === "ar"
                    ? "أرقام المساعدة الفورية"
                    : lang === "dz"
                      ? "أرقام المساعدة المجانية"
                      : lang === "fr"
                        ? "Lignes d'aide immédiate"
                        : "Emergency Helplines"}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Energy & Wellness Sliders */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="bg-secondary/40 p-3 rounded-2xl border border-border/40 space-y-1.5">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="flex items-center gap-1 text-primary">
              <Zap className="w-3.5 h-3.5" />
              <span>
                {lang === "ar"
                  ? "مستوى الطاقة"
                  : lang === "dz"
                    ? "طاقتك اليوم"
                    : lang === "fr"
                      ? "Niveau d'énergie"
                      : "Energy Level"}
              </span>
            </span>
            <span className="font-bold tabular-nums num-en text-primary">{energyLevel}/5</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={energyLevel}
            onChange={(e) => setEnergyLevel(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        <div className="bg-secondary/40 p-3 rounded-2xl border border-border/40 space-y-1.5">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="flex items-center gap-1 text-primary">
              <Heart className="w-3.5 h-3.5" />
              <span>
                {lang === "ar"
                  ? "السكينة والراحة"
                  : lang === "dz"
                    ? "الراحة والهدوء"
                    : lang === "fr"
                      ? "Paix & Confort"
                      : "Peace & Comfort"}
              </span>
            </span>
            <span className="font-bold tabular-nums num-en text-primary">{wellnessLevel}/5</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={wellnessLevel}
            onChange={(e) => setWellnessLevel(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>
      </div>

      {/* Context Tags */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-muted-foreground">
          {lang === "ar"
            ? "عوامل اليوم وسياقه (اختياري):"
            : lang === "dz"
              ? "واش صرا في نهارك اليوم (اختياري):"
              : lang === "fr"
                ? "Contexte de la journée (facultatif) :"
                : "Context tags (optional):"}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_TAGS.map((tag) => {
            const label = getTagLabel(tag);
            const isPicked = selectedTags.includes(label);
            return (
              <button
                key={tag.en}
                type="button"
                onClick={() => toggleTag(label)}
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition border ${
                  isPicked
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/40 text-muted-foreground border-border/40 hover:text-foreground"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Private Notes Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground flex items-center gap-1">
            <Lock className="w-3 h-3 text-primary" />
            <span>{t("optional_note")}</span>
          </label>
          <span className="text-[10px] text-emerald-600 font-medium">
            {lang === "ar"
              ? "مشفر وخاص 100%"
              : lang === "dz"
                ? "سري ومشفر 100%"
                : lang === "fr"
                  ? "Chiffré & 100% confidentiel"
                  : "Private & Encrypted"}
          </span>
        </div>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("note_placeholder")}
          className="w-full p-3 rounded-2xl bg-secondary/50 border border-primary/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed resize-none"
        />
      </div>

      {/* Privacy Guarantee Pill */}
      <div className="p-2.5 rounded-2xl bg-secondary/30 border border-border/30 flex items-start gap-2 text-[10px] text-muted-foreground">
        <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
        <p className="leading-tight">{t("privacy_guarantee")}</p>
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        className="w-full py-3.5 rounded-2xl gradient-rose text-primary-foreground font-bold text-sm shadow-md hover:opacity-95 transition flex items-center justify-center gap-2"
      >
        <Check className="w-4 h-4" />
        <span>
          {lang === "ar"
            ? "حفظ تسجيل اليوم"
            : lang === "dz"
              ? "تسجيل مشاعر اليوم"
              : lang === "fr"
                ? "Enregistrer mon humeur du jour"
                : "Save Today's Check-in"}
        </span>
      </button>
    </div>
  );
}
