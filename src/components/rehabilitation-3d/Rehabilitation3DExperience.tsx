import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  Filter,
  Search,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Flame,
  Clock,
  Layers,
  Heart,
  RotateCw,
} from "lucide-react";
import { EXERCISES_3D } from "./exerciseData3D";
import { Exercise3DDef, AffectedSide, RehabStage } from "./types";
import { RehabilitationCanvas } from "./RehabilitationCanvas";
import { VirtualCoachHUD } from "./VirtualCoachHUD";
import { ExerciseControlsHUD } from "./ExerciseControlsHUD";
import { ClinicalDisclaimerBanner } from "./ClinicalDisclaimerBanner";
import {
  getExerciseApprovals,
  setExerciseApproval,
  getRehabPreferences,
  saveRehabPreferences,
  addCompletedExercise,
} from "@/lib/local-db";

interface Rehabilitation3DExperienceProps {
  lang: "ar" | "en";
  onSwitchToClassic?: () => void;
}

export function Rehabilitation3DExperience({
  lang,
  onSwitchToClassic,
}: Rehabilitation3DExperienceProps) {
  // Load initial preferences
  const initialPrefs = useMemo(() => getRehabPreferences(), []);
  const [approvals, setApprovals] = useState<Record<string, boolean>>(() => getExerciseApprovals());

  // Active exercise & filters state
  const [selectedExerciseKey, setSelectedExerciseKey] = useState<string>(EXERCISES_3D[0].key);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStage, setSelectedStage] = useState<RehabStage>("all");
  const [onlyApproved, setOnlyApproved] = useState<boolean>(initialPrefs.filterDoctorApprovedOnly);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Playback state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [completedReps, setCompletedReps] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(initialPrefs.playbackSpeed || 1.0);
  const [affectedSide, setAffectedSide] = useState<AffectedSide>(
    initialPrefs.affectedSide || "left",
  );
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(initialPrefs.voiceEnabled ?? true);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Current active exercise definition
  const currentExercise = useMemo<Exercise3DDef>(() => {
    return EXERCISES_3D.find((e) => e.key === selectedExerciseKey) || EXERCISES_3D[0];
  }, [selectedExerciseKey]);

  // Total session target seconds
  const totalSeconds = currentExercise.defaultTotalMinutes * 60;

  // Single repetition duration scaled by user speed setting
  const effectiveRepDuration = Math.max(2, currentExercise.repDurationSeconds / speed);

  // Progress within the current repetition cycle (0 to 1)
  const repProgress = useMemo(() => {
    if (!isRunning && elapsedSeconds === 0) return 0;
    const cycleTime = elapsedSeconds % effectiveRepDuration;
    return cycleTime / effectiveRepDuration;
  }, [elapsedSeconds, effectiveRepDuration, isRunning]);

  // Current step index within the exercise based on repetition progress
  const currentStepIndex = useMemo(() => {
    const steps = currentExercise.steps;
    if (!steps || steps.length === 0) return 0;
    let accumulatedPercent = 0;
    const progressPercent = repProgress * 100;

    for (let i = 0; i < steps.length; i++) {
      accumulatedPercent += steps[i].durationPercent;
      if (progressPercent <= accumulatedPercent) {
        return i;
      }
    }
    return steps.length - 1;
  }, [repProgress, currentExercise]);

  const currentStep = currentExercise.steps[currentStepIndex];

  // Timer interval for playback
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          // Check if a repetition was completed
          if (next > 0 && Math.floor(next % effectiveRepDuration) === 0) {
            setCompletedReps((r) => {
              const updatedReps = r + 1;
              if (updatedReps >= currentExercise.recommendedReps) {
                // Auto finish target
                toast.success(
                  lang === "ar"
                    ? `🎉 أحسنتِ! تم إكمال ${currentExercise.recommendedReps} تكرارات بنجاح`
                    : `🎉 Excellent! Completed ${currentExercise.recommendedReps} reps successfully`,
                );
              }
              return updatedReps;
            });
          }
          return next;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, effectiveRepDuration, currentExercise, lang]);

  // Save preference updates
  const handleUpdateAffectedSide = (side: AffectedSide) => {
    setAffectedSide(side);
    saveRehabPreferences({ affectedSide: side });
  };

  const handleUpdateSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    saveRehabPreferences({ playbackSpeed: newSpeed });
  };

  const handleToggleVoice = () => {
    setVoiceEnabled((v) => {
      const next = !v;
      saveRehabPreferences({ voiceEnabled: next });
      return next;
    });
  };

  const handleToggleDoctorApproval = (approved: boolean) => {
    setExerciseApproval(currentExercise.key, approved);
    setApprovals((prev) => ({ ...prev, [currentExercise.key]: approved }));
    toast.success(
      approved
        ? lang === "ar"
          ? "تم تحديد التمرين كمعتمد من الفريق الطبي"
          : "Exercise marked as doctor approved"
        : lang === "ar"
          ? "تم إلغاء تحديد الاعتماد الطبي"
          : "Exercise marked as pending clearance",
    );
  };

  const handleResetSession = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setCompletedReps(0);
  };

  const handleFinishSession = () => {
    setIsRunning(false);
    if (elapsedSeconds >= 10) {
      addCompletedExercise(currentExercise.key, elapsedSeconds);
      toast.success(
        lang === "ar"
          ? `✨ تم حفظ جلسة "${currentExercise.name_ar}" في سجلك اليومي`
          : `✨ Saved "${currentExercise.name_en}" session to your daily log`,
      );
    }
    handleResetSession();
  };

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return EXERCISES_3D.filter((ex) => {
      // Category filter
      if (selectedCategory !== "all" && ex.category !== selectedCategory) {
        return false;
      }
      // Stage filter
      if (selectedStage !== "all" && ex.stage !== "all" && ex.stage !== selectedStage) {
        return false;
      }
      // Doctor approved filter
      if (onlyApproved && !approvals[ex.key]) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName =
          ex.name_ar.toLowerCase().includes(query) || ex.name_en.toLowerCase().includes(query);
        const matchesPurpose =
          ex.purpose_ar.toLowerCase().includes(query) ||
          ex.purpose_en.toLowerCase().includes(query);
        return matchesName || matchesPurpose;
      }
      return true;
    });
  }, [selectedCategory, selectedStage, onlyApproved, searchQuery, approvals]);

  // Categories list
  const categories = [
    { id: "all", ar: "جميع التمارين", en: "All" },
    { id: "arm_elevation", ar: "رفع الذراع", en: "Arm Elevation" },
    { id: "shoulder_mobility", ar: "حركة الكتف", en: "Shoulder Mobility" },
    { id: "side_movement", ar: "الحركة الجانبية", en: "Side Movement" },
    { id: "shoulder_rotation", ar: "دوران الكتف", en: "Shoulder Rotation" },
    { id: "chest_stretch", ar: "تمديد الصدر", en: "Chest Stretch" },
    { id: "breathing_relaxation", ar: "التنفس والاسترخاء", en: "Breathing" },
  ];

  const handleNextExercise = () => {
    if (filteredExercises.length === 0) return;
    const currentIdx = filteredExercises.findIndex((e) => e.key === selectedExerciseKey);
    const nextIdx = (currentIdx + 1) % filteredExercises.length;
    handleResetSession();
    setSelectedExerciseKey(filteredExercises[nextIdx].key);
    toast.info(
      lang === "ar"
        ? `التالي: ${filteredExercises[nextIdx].name_ar}`
        : `Next: ${filteredExercises[nextIdx].name_en}`,
    );
  };

  return (
    <div className="space-y-3 pb-8">
      {/* Prominent Studio Title Pill (Matching reference image header!) */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex-1 flex justify-center">
          <div className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-2 rounded-full bg-gradient-to-r from-purple-900/85 via-fuchsia-800/90 to-purple-900/85 border border-fuchsia-400/45 shadow-[0_0_24px_rgba(219,39,119,0.35)] backdrop-blur-xl">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
              <span className="text-sm">🧘‍♀️</span>
            </div>
            <div className="text-center leading-tight">
              <div className="text-xs font-black text-white tracking-wide drop-shadow-sm">
                {lang === "ar" ? "استوديو التمارين التفاعلي" : "Interactive Exercise Studio"}
              </div>
              <div className="text-[10px] text-fuchsia-200/90 font-medium">
                {lang === "ar" ? "لإعادة التأهيل الحركي" : "Motor Rehabilitation Guidance"}
              </div>
            </div>
          </div>
        </div>

        {/* Switch to Classic View button (discreet top action) */}
        {onSwitchToClassic && (
          <button
            onClick={onSwitchToClassic}
            className="shrink-0 px-2.5 py-1.5 rounded-2xl glass-dark border border-fuchsia-400/30 text-fuchsia-200 text-[10px] font-semibold hover:text-white hover:bg-white/10 transition-all flex items-center gap-1"
            title={lang === "ar" ? "التبديل إلى الدليل الكلاسيكي" : "Switch to Classic Guide"}
          >
            <span>{lang === "ar" ? "كلاسيكي" : "Classic"}</span>
            <ChevronRight className="w-3 h-3 rtl:rotate-180" />
          </button>
        )}
      </div>

      {/* Main 3D Viewport with the Authentic Character from Reference Image */}
      <RehabilitationCanvas
        exercise={currentExercise}
        repProgress={repProgress}
        affectedSide={affectedSide}
        isRunning={isRunning}
        phase={currentStep?.phase || "prepare"}
        lang={lang}
      />

      {/* Main Exercise Controls HUD Dock matching reference image */}
      <ExerciseControlsHUD
        exercise={currentExercise}
        isRunning={isRunning}
        onTogglePlay={() => setIsRunning((r) => !r)}
        onReset={handleResetSession}
        onFinish={handleFinishSession}
        onNext={handleNextExercise}
        elapsedSeconds={elapsedSeconds}
        totalSeconds={totalSeconds}
        completedReps={completedReps}
        targetReps={currentExercise.recommendedReps}
        onUpdateReps={(delta) => setCompletedReps((r) => Math.max(0, r + delta))}
        speed={speed}
        onChangeSpeed={handleUpdateSpeed}
        affectedSide={affectedSide}
        onChangeAffectedSide={handleUpdateAffectedSide}
        lang={lang}
      />

      {/* Virtual Coach Dr. Nour HUD */}
      <VirtualCoachHUD
        exercise={currentExercise}
        currentStep={currentStep}
        stepIndex={currentStepIndex}
        isRunning={isRunning}
        voiceEnabled={voiceEnabled}
        onToggleVoice={handleToggleVoice}
        lang={lang}
      />

      {/* Strict Clinical Disclaimer & Safety Banner */}
      <ClinicalDisclaimerBanner
        exerciseKey={currentExercise.key}
        isDoctorApproved={Boolean(approvals[currentExercise.key])}
        onToggleDoctorApproval={handleToggleDoctorApproval}
        lang={lang}
      />

      {/* Category & Filter Strip */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Filter className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>{lang === "ar" ? "تصنيفات التمارين السريرية" : "Clinical Categories"}</span>
          </div>

          {/* Doctor Approved Filter Toggle */}
          <button
            onClick={() => setOnlyApproved((a) => !a)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-all ${
              onlyApproved
                ? "bg-emerald-500/25 text-emerald-200 border border-emerald-500/40"
                : "glass-dark text-fuchsia-300/80 border border-fuchsia-500/20"
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>{lang === "ar" ? "المعتمدة فقط من طبيبي" : "Doctor Approved Only"}</span>
          </button>
        </div>

        {/* Scrollable Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-3 py-1.5 rounded-2xl text-[11px] font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-md shadow-fuchsia-950/40"
                    : "glass-dark text-fuchsia-200 hover:text-white hover:bg-white/10 border border-fuchsia-500/20"
                }`}
              >
                {lang === "ar" ? cat.ar : cat.en}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute top-3 start-3 text-fuchsia-300/60 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === "ar"
                ? "ابحثي بالاسم أو الفائدة (مثال: كتف، رفع، تنفس)..."
                : "Search exercises by name or benefit..."
            }
            className="w-full ps-9 pe-4 py-2 rounded-2xl glass-dark border border-fuchsia-500/25 text-xs text-white placeholder-fuchsia-300/50 focus:outline-none focus:border-fuchsia-400"
          />
        </div>
      </div>

      {/* Exercise Cards Carousel / Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-fuchsia-200/80">
          <span>
            {lang === "ar"
              ? `التمارين المتوفرة (${filteredExercises.length})`
              : `Available Exercises (${filteredExercises.length})`}
          </span>
          <span className="text-[10px] text-fuchsia-300/60">
            {lang === "ar"
              ? "اضغطي على أي تمرين لتحميله في النموذج ثلاثي الأبعاد"
              : "Tap any exercise to load into 3D viewer"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredExercises.map((ex) => {
            const isSelected = ex.key === selectedExerciseKey;
            const isApproved = Boolean(approvals[ex.key]);

            return (
              <div
                key={ex.key}
                onClick={() => {
                  if (ex.key !== selectedExerciseKey) {
                    handleResetSession();
                    setSelectedExerciseKey(ex.key);
                  }
                }}
                className={`glass-dark rounded-2xl p-3 cursor-pointer transition-all border text-start relative overflow-hidden ${
                  isSelected
                    ? "border-fuchsia-400 ring-2 ring-fuchsia-400/40 bg-fuchsia-950/40 shadow-xl"
                    : "border-fuchsia-500/20 hover:border-fuchsia-400/40 hover:bg-white/5"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-500" />
                    <h3 className="text-xs font-bold text-white">
                      {lang === "ar" ? ex.name_ar : ex.name_en}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    {isApproved && (
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>{lang === "ar" ? "معتمد" : "Approved"}</span>
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-200 text-[9px]">
                      {lang === "ar" ? ex.level_ar : ex.level_en}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-fuchsia-200/80 leading-snug line-clamp-2">
                  {lang === "ar" ? ex.purpose_ar : ex.purpose_en}
                </p>

                <div className="mt-2.5 pt-2 border-t border-fuchsia-500/15 flex items-center justify-between text-[10px] text-fuchsia-300/80">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-pink-400" />
                      <span>
                        {ex.defaultTotalMinutes} {lang === "ar" ? "د" : "min"}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span>
                        {ex.recommendedReps} {lang === "ar" ? "تكرارات" : "reps"}
                      </span>
                    </span>
                  </div>

                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-200">
                    {lang === "ar" ? ex.targetArea_ar : ex.targetArea_en}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
