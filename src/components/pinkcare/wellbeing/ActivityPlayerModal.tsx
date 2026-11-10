import { useState, useEffect, useRef } from "react";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Wind,
  Brain,
  Feather,
  Heart,
  Sun,
  BookHeart,
  Moon,
  Clock,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { logWellbeingActivity } from "@/lib/local-db";
import { type ActivityDefinition } from "./WellbeingTypes";

interface Props {
  activity: ActivityDefinition | null;
  open: boolean;
  onClose: () => void;
  onCompleted?: () => void;
}

export function ActivityPlayerModal({ activity, open, onClose, onCompleted }: Props) {
  const { lang } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  // Breathing specific state: inhale (4s), hold (4s), exhale (6s) = 14s cycle
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [phaseSeconds, setPhaseSeconds] = useState(4);
  const [breathCycles, setBreathCycles] = useState(0);

  // Step progression for grounding / reflection
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Gratitude inputs
  const [gratitude1, setGratitude1] = useState("");
  const [gratitude2, setGratitude2] = useState("");
  const [gratitude3, setGratitude3] = useState("");

  const intervalRef = useRef<number | null>(null);
  const completeRef = useRef<() => void>(() => {});

  const getActivityTitle = () => {
    if (!activity) return "";
    if (lang === "dz") return activity.title_dz;
    if (lang === "fr") return activity.title_fr;
    if (lang === "en") return activity.title_en;
    return activity.title_ar;
  };

  const getActivitySubtitle = () => {
    if (!activity) return "";
    if (lang === "dz") return activity.subtitle_dz;
    if (lang === "fr") return activity.subtitle_fr;
    if (lang === "en") return activity.subtitle_en;
    return activity.subtitle_ar;
  };

  const getInstructions = (): string[] => {
    if (!activity) return [];
    if (lang === "dz") return activity.instructions_dz;
    if (lang === "fr") return activity.instructions_fr;
    if (lang === "en") return activity.instructions_en;
    return activity.instructions_ar;
  };

  const getPrecautions = (): string => {
    if (!activity) return "";
    if (lang === "dz") return activity.precautions_dz;
    if (lang === "fr") return activity.precautions_fr;
    if (lang === "en") return activity.precautions_en;
    return activity.precautions_ar;
  };

  // Initialize timers when activity is selected
  useEffect(() => {
    if (activity && open) {
      const initialSec = activity.durationMinutes * 60;
      setTotalSeconds(initialSec);
      setSecondsRemaining(initialSec);
      setIsPlaying(false);
      setBreathingPhase("inhale");
      setPhaseSeconds(4);
      setBreathCycles(0);
      setCurrentStepIndex(0);
      setGratitude1("");
      setGratitude2("");
      setGratitude3("");
    }
  }, [activity, open]);

  // Main countdown timer
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            completeRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  // Breathing rhythmic loop
  useEffect(() => {
    if (!isPlaying || activity?.type !== "breathing") return;

    const breathInterval = window.setInterval(() => {
      setPhaseSeconds((prev) => {
        if (prev <= 1) {
          if (breathingPhase === "inhale") {
            setBreathingPhase("hold");
            return 4;
          } else if (breathingPhase === "hold") {
            setBreathingPhase("exhale");
            return 6;
          } else {
            setBreathingPhase("inhale");
            setBreathCycles((c) => c + 1);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(breathInterval);
  }, [isPlaying, breathingPhase, activity?.type]);

  if (!open || !activity) return null;

  const handleStartPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSecondsRemaining(totalSeconds);
    setBreathingPhase("inhale");
    setPhaseSeconds(4);
    setBreathCycles(0);
    setCurrentStepIndex(0);
  };

  const handleAdjustDuration = (mins: number) => {
    const sec = mins * 60;
    setTotalSeconds(sec);
    setSecondsRemaining(sec);
  };

  const handleComplete = () => {
    setIsPlaying(false);
    const spentSec = Math.max(1, totalSeconds - secondsRemaining);

    let notes: string | undefined = undefined;
    if (activity.type === "gratitude") {
      const items = [gratitude1, gratitude2, gratitude3].filter(Boolean);
      if (items.length > 0) {
        notes = items.join(" • ");
      }
    }

    logWellbeingActivity({
      activityType: activity.type,
      title: getActivityTitle(),
      durationSeconds: spentSec,
      notes,
    });

    toast.success(
      lang === "ar"
        ? `أحسنتِ صنعاً! تم تسجيل جلسة "${getActivityTitle()}" 🌸`
        : lang === "dz"
          ? `يعطيك الصحة! تسجلت جلسة "${getActivityTitle()}" 🌸`
          : lang === "fr"
            ? `Bravo ! Séance "${getActivityTitle()}" enregistrée 🌸`
            : `Well done! Completed "${getActivityTitle()}" session 🌸`,
    );

    if (onCompleted) onCompleted();
    onClose();
  };
  completeRef.current = handleComplete;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progressPercent =
    totalSeconds > 0 ? Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100) : 0;

  const instructions = getInstructions();
  const precautions = getPrecautions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-card text-card-foreground rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-primary/20 animate-scale-up">
        {/* Header */}
        <div
          className={`p-4 sm:p-5 border-b border-border/40 bg-gradient-to-r ${activity.accentBg} flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-card/80 backdrop-blur shadow flex items-center justify-center text-primary">
              {activity.type === "breathing" && <Wind className="w-5 h-5" />}
              {activity.type === "mindfulness" && <Brain className="w-5 h-5" />}
              {activity.type === "relaxation" && <Feather className="w-5 h-5" />}
              {activity.type === "self_reflection" && <Heart className="w-5 h-5" />}
              {activity.type === "daily_motivation" && <Sun className="w-5 h-5" />}
              {activity.type === "gratitude" && <BookHeart className="w-5 h-5" />}
              {activity.type === "sleep_relaxation" && <Moon className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">{getActivityTitle()}</h3>
              <p className="text-xs text-muted-foreground">{getActivitySubtitle()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-card/70 hover:bg-card flex items-center justify-center text-muted-foreground transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 flex flex-col items-center">
          {/* BREATHING INTERACTIVE CIRCLE */}
          {activity.type === "breathing" && (
            <div className="flex flex-col items-center justify-center py-4 w-full">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                {/* Outer pulsing wave */}
                <div
                  className={`absolute inset-0 rounded-full bg-primary/10 transition-transform duration-1000 ${
                    breathingPhase === "inhale"
                      ? "scale-110 opacity-70"
                      : breathingPhase === "hold"
                        ? "scale-105 opacity-90"
                        : "scale-90 opacity-40"
                  }`}
                />
                {/* Main animated ball */}
                <div
                  className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center shadow-xl transition-all ${
                    breathingPhase === "inhale"
                      ? "gradient-rose text-white scale-105 shadow-pink-300/50"
                      : breathingPhase === "hold"
                        ? "bg-purple-600 text-white scale-100 shadow-purple-300/50"
                        : "bg-teal-500 text-white scale-90 shadow-teal-300/50"
                  }`}
                  style={{
                    transitionDuration:
                      breathingPhase === "inhale"
                        ? "4000ms"
                        : breathingPhase === "hold"
                          ? "1000ms"
                          : "6000ms",
                  }}
                >
                  <p className="text-sm font-semibold tracking-wide uppercase opacity-90">
                    {breathingPhase === "inhale"
                      ? lang === "ar"
                        ? "شهيق لطيف"
                        : lang === "dz"
                          ? "دخلي النفس بالراحة"
                          : lang === "fr"
                            ? "Inspirez doucement"
                            : "Inhale"
                      : breathingPhase === "hold"
                        ? lang === "ar"
                          ? "احبسي بهدوء"
                          : lang === "dz"
                            ? "احبسي بشوية"
                            : lang === "fr"
                              ? "Retenez paisiblement"
                              : "Hold"
                        : lang === "ar"
                          ? "زفير ناعم"
                          : lang === "dz"
                            ? "خرجي النفس بنعومة"
                            : lang === "fr"
                              ? "Expirez lentement"
                              : "Exhale"}
                  </p>
                  <p className="text-3xl font-bold tabular-nums num-en mt-1">{phaseSeconds}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                <span className="bg-secondary/60 px-3 py-1 rounded-full font-medium">
                  {lang === "ar"
                    ? `الدورات: ${breathCycles}`
                    : lang === "dz"
                      ? `الدورات: ${breathCycles}`
                      : lang === "fr"
                        ? `Cycles : ${breathCycles}`
                        : `Cycles: ${breathCycles}`}
                </span>
                <span className="bg-secondary/60 px-3 py-1 rounded-full font-medium">
                  {lang === "ar" || lang === "dz"
                    ? "4ث شهيق • 4ث حبس • 6ث زفير"
                    : lang === "fr"
                      ? "4s inspire • 4s retiens • 6s expire"
                      : "4s in • 4s hold • 6s out"}
                </span>
              </div>
            </div>
          )}

          {/* SENSORY GROUNDING STEP-BY-STEP */}
          {activity.type === "mindfulness" && (
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
                <span>
                  {lang === "ar" || lang === "dz"
                    ? `الخطوة ${currentStepIndex + 1} من ${instructions.length}`
                    : `Step ${currentStepIndex + 1} of ${instructions.length}`}
                </span>
                <span className="text-primary">
                  {lang === "ar" || lang === "dz" ? "تمرين 5-4-3-2-1" : "5-4-3-2-1 Technique"}
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-secondary/40 border border-primary/20 min-h-[140px] flex flex-col justify-center text-center space-y-2">
                <p className="text-2xl">
                  {["👁️", "✋", "👂", "👃", "🤍"][currentStepIndex] || "🌸"}
                </p>
                <p className="text-sm sm:text-base font-bold text-foreground">
                  {instructions[currentStepIndex]}
                </p>
              </div>

              <div className="flex justify-between items-center pt-1">
                <button
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex((i) => Math.max(0, i - 1))}
                  className="px-4 py-2 rounded-2xl bg-secondary disabled:opacity-40 text-xs font-bold flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-0 rotate-180" />
                  <span>
                    {lang === "ar"
                      ? "السابق"
                      : lang === "dz"
                        ? "لي قبلها"
                        : lang === "fr"
                          ? "Précédent"
                          : "Previous"}
                  </span>
                </button>
                <button
                  disabled={currentStepIndex === instructions.length - 1}
                  onClick={() =>
                    setCurrentStepIndex((i) => Math.min(instructions.length - 1, i + 1))
                  }
                  className="px-4 py-2 rounded-2xl gradient-rose text-primary-foreground disabled:opacity-40 text-xs font-bold flex items-center gap-1"
                >
                  <span>
                    {lang === "ar"
                      ? "التالي"
                      : lang === "dz"
                        ? "لي موراها"
                        : lang === "fr"
                          ? "Suivant"
                          : "Next"}
                  </span>
                  <ChevronLeft className="w-4 h-4 rtl:rotate-0 rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* GRATITUDE PROMPTS */}
          {activity.type === "gratitude" && (
            <div className="w-full space-y-3">
              <p className="text-xs text-muted-foreground text-center">
                {lang === "ar"
                  ? "اكتبي 3 نعم أو تفاصيل بسيطة أبهجت خاطركِ اليوم (تُحفظ بأمان في هاتفكِ فقط):"
                  : lang === "dz"
                    ? "اكتبي 3 حوايج صغار فرحوك اليوم (محفوظين في تيليفونك برك):"
                    : lang === "fr"
                      ? "Notez 3 moments doux ou bienfaits d'aujourd'hui (chiffrés sur votre appareil) :"
                      : "List 3 gentle moments or blessings you are thankful for today (stored privately):"}
              </p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 bg-secondary/50 p-2.5 rounded-2xl border border-border/40">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <input
                    type="text"
                    value={gratitude1}
                    onChange={(e) => setGratitude1(e.target.value)}
                    placeholder={
                      lang === "ar"
                        ? "مثال: فنجان شاي هادئ، رسالة من أختي..."
                        : lang === "dz"
                          ? "مثال: كاس تاي دافي، ميساج من حبيبتي..."
                          : lang === "fr"
                            ? "ex. Une tisane chaude, un message d'une amie..."
                            : "e.g. Quiet morning tea, sweet message..."
                    }
                    className="w-full bg-transparent text-xs sm:text-sm focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 p-2.5 rounded-2xl border border-border/40">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <input
                    type="text"
                    value={gratitude2}
                    onChange={(e) => setGratitude2(e.target.value)}
                    placeholder={
                      lang === "ar"
                        ? "مثال: لمسة دفء، نوم أفضل اليوم..."
                        : lang === "dz"
                          ? "مثال: رڨاد هني ومريح اليوم..."
                          : lang === "fr"
                            ? "ex. Un rayon de soleil, une sieste réparatrice..."
                            : "e.g. Warm sunlight, restful nap..."
                    }
                    className="w-full bg-transparent text-xs sm:text-sm focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 p-2.5 rounded-2xl border border-border/40">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <input
                    type="text"
                    value={gratitude3}
                    onChange={(e) => setGratitude3(e.target.value)}
                    placeholder={
                      lang === "ar"
                        ? "مثال: امتنان لشجاعة جسدي وصبره..."
                        : lang === "dz"
                          ? "مثال: الحمد لله على صبر جسمي وشجاعتي..."
                          : lang === "fr"
                            ? "ex. Gratitude pour la patience et la force de mon corps..."
                            : "e.g. Gratitude for my body's patience..."
                    }
                    className="w-full bg-transparent text-xs sm:text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* GENERAL STEP-BY-STEP INSTRUCTIONS / CARDS FOR RELAXATION / SLEEP / MOTIVATION */}
          {["relaxation", "self_reflection", "daily_motivation", "sleep_relaxation"].includes(
            activity.type,
          ) && (
            <div className="w-full space-y-3">
              <div className="p-4 rounded-3xl bg-secondary/40 border border-primary/20 space-y-3 text-start">
                <div className="space-y-2">
                  {instructions.map((inst, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed text-foreground/90">{inst}</p>
                    </div>
                  ))}
                </div>
              </div>

              {precautions && (
                <div className="p-3 rounded-2xl bg-muted/40 text-[11px] text-muted-foreground border border-border/40 leading-relaxed text-start">
                  <p className="font-semibold text-foreground/80 mb-0.5">
                    {lang === "ar"
                      ? "ملاحظة أمان وتوجيه لطيف:"
                      : lang === "dz"
                        ? "تنبيه خفيف وسلامة:"
                        : lang === "fr"
                          ? "Conseil de précaution & douceur :"
                          : "Gentle safety reminder:"}
                  </p>
                  <p>{precautions}</p>
                </div>
              )}
            </div>
          )}

          {/* Countdown & Progress */}
          <div className="w-full space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>
                  {lang === "ar"
                    ? "الوقت المتبقي:"
                    : lang === "dz"
                      ? "الوقت لي بقا:"
                      : lang === "fr"
                        ? "Temps restant :"
                        : "Time left:"}
                </span>
              </span>
              <span className="font-bold text-base text-primary tabular-nums num-en" dir="ltr">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
            </div>

            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full gradient-rose transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Duration presets */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="text-[10px] text-muted-foreground">
                {lang === "ar"
                  ? "مدة الجلسة:"
                  : lang === "dz"
                    ? "وقت الجلسة:"
                    : lang === "fr"
                      ? "Durée :"
                      : "Preset:"}
              </span>
              {[1, 2, 3, 5, 10].map((m) => (
                <button
                  key={m}
                  onClick={() => handleAdjustDuration(m)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                    totalSeconds === m * 60
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m} {lang === "ar" || lang === "dz" ? "د" : "m"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="p-4 border-t border-border/40 bg-card/60 flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition"
            title={
              lang === "ar"
                ? "إعادة ضبط"
                : lang === "dz"
                  ? "إعادة من اللول"
                  : lang === "fr"
                    ? "Réinitialiser"
                    : "Reset"
            }
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleStartPause}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 ${
              isPlaying
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : "gradient-rose hover:opacity-95 text-primary-foreground"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>
                  {lang === "ar"
                    ? "إيقاف مؤقت"
                    : lang === "dz"
                      ? "حبسي شوية"
                      : lang === "fr"
                        ? "Pause"
                        : "Pause"}
                </span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {lang === "ar"
                    ? "بدء الجلسة"
                    : lang === "dz"
                      ? "ابداي الجلسة"
                      : lang === "fr"
                        ? "Démarrer la séance"
                        : "Start Session"}
                </span>
              </>
            )}
          </button>

          <button
            onClick={handleComplete}
            className="px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {lang === "ar"
                ? "إكمال وحفظ"
                : lang === "dz"
                  ? "كملت وتسجيل"
                  : lang === "fr"
                    ? "Terminer & Valider"
                    : "Done & Log"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
