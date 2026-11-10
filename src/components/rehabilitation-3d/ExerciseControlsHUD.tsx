import { useState } from "react";
import {
  Play,
  Pause,
  Check,
  RotateCcw,
  Lightbulb,
  Clock,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Settings,
  X,
  Gauge,
  Sparkles,
  Heart,
} from "lucide-react";
import { AffectedSide, Exercise3DDef } from "./types";

interface ExerciseControlsHUDProps {
  exercise: Exercise3DDef;
  isRunning: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onFinish: () => void;
  onNext?: () => void;
  elapsedSeconds: number;
  totalSeconds: number;
  completedReps: number;
  targetReps: number;
  onUpdateReps: (delta: number) => void;
  speed: number;
  onChangeSpeed: (newSpeed: number) => void;
  affectedSide: AffectedSide;
  onChangeAffectedSide: (side: AffectedSide) => void;
  lang: "ar" | "en";
}

export function ExerciseControlsHUD({
  exercise,
  isRunning,
  onTogglePlay,
  onReset,
  onFinish,
  onNext,
  elapsedSeconds,
  totalSeconds,
  completedReps,
  targetReps,
  onUpdateReps,
  speed,
  onChangeSpeed,
  affectedSide,
  onChangeAffectedSide,
  lang,
}: ExerciseControlsHUDProps) {
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  // Time calculations
  const currentElapsedMins = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
  const currentElapsedSecs = String(elapsedSeconds % 60).padStart(2, "0");
  const totalMins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const totalSecs = String(totalSeconds % 60).padStart(2, "0");
  const timerLabel = `${currentElapsedMins}:${currentElapsedSecs} / ${totalMins}:${totalSecs}`;

  const timeProgressPercent = Math.min(
    100,
    Math.round((elapsedSeconds / Math.max(1, totalSeconds)) * 100),
  );

  // Repetition progress ring calculations
  const repPercent = Math.min(100, (completedReps / Math.max(1, targetReps)) * 100);
  const ringRadius = 30;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference - (repPercent / 100) * circumference;

  return (
    <div className="space-y-3 select-none">
      {/* ==================== MAIN GLASS EXERCISE HUD CARD ==================== */}
      {/* (Faithfully matching the rounded frosted purple/pink card in reference image!) */}
      <div className="rounded-[32px] p-4 bg-slate-900/70 backdrop-blur-2xl border border-fuchsia-400/30 shadow-[0_12px_40px_rgba(219,39,119,0.25)] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-10 -end-10 w-44 h-44 rounded-full bg-fuchsia-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -start-10 w-44 h-44 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        {/* ---------- UPPER SECTION: REPS RING + TITLE PILL + TIPS LIGHTBULB ---------- */}
        <div className="flex items-center justify-between gap-3 mb-4">
          {/* Left: Circular Repetition Progress Counter Ring */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg width="74" height="74" className="rotate-[-90deg]">
              {/* Background track */}
              <circle
                cx="37"
                cy="37"
                r={ringRadius}
                fill="transparent"
                stroke="rgba(244, 114, 182, 0.2)"
                strokeWidth="5"
              />
              {/* Progress arc */}
              <circle
                cx="37"
                cy="37"
                r={ringRadius}
                fill="transparent"
                stroke="url(#pinkGlowGrad)"
                strokeWidth="5.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
              <defs>
                <linearGradient id="pinkGlowGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-sm font-black text-white font-mono leading-none">
                {completedReps} / {targetReps}
              </span>
              <span className="text-[9px] font-bold text-fuchsia-200 mt-0.5">
                {lang === "ar" ? "تكرارات" : "Reps"}
              </span>
            </div>
          </div>

          {/* Center: Purple Pill Exercise Badge & Description */}
          <div className="flex-1 flex flex-col items-center text-center px-1">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-700/80 via-fuchsia-600/80 to-purple-700/80 border border-fuchsia-300/40 shadow-md">
              <span className="text-white font-bold text-xs tracking-wide">
                {lang === "ar" ? exercise.name_ar : exercise.name_en}
              </span>
              {/* Muscle Icon */}
              <span className="text-pink-300 text-sm">💪</span>
            </div>
            <p className="text-[11px] font-medium text-fuchsia-100/90 leading-tight mt-1.5 max-w-[240px]">
              {lang === "ar" ? exercise.purpose_ar : exercise.purpose_en}
            </p>
          </div>

          {/* Right: Round Glowing Lightbulb Tips Button */}
          <button
            onClick={() => setShowTipsModal(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/30 to-fuchsia-600/40 border border-pink-400/50 flex items-center justify-center text-amber-300 shadow-[0_0_18px_rgba(244,114,182,0.4)] hover:scale-105 active:scale-95 transition-all shrink-0"
            title={lang === "ar" ? "نصائح وإرشادات الأداء السليم" : "Tips & Guidance"}
          >
            <Lightbulb className="w-6 h-6 fill-amber-300/80 text-amber-300 animate-pulse" />
          </button>
        </div>

        {/* ---------- MIDDLE SECTION: 3 ACTION BUTTONS ROW ---------- */}
        {/* (Left: تم الإنجاز | Center: إيقاف مؤقت / بدء | Right: التالي) */}
        <div className="grid grid-cols-3 gap-2.5 items-center mb-4">
          {/* Left: Complete Button ("تم الإنجاز") */}
          <button
            onClick={onFinish}
            className="h-12 rounded-2xl bg-slate-800/80 hover:bg-slate-700/90 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-fuchsia-400/30 shadow-md active:scale-95 transition-all"
          >
            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
            <span>{lang === "ar" ? "تم الإنجاز" : "Done"}</span>
          </button>

          {/* Center: Large Glowing Hot-Pink Pill Hero Button */}
          <button
            onClick={onTogglePlay}
            className={`h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-white transition-all transform active:scale-95 shadow-[0_0_28px_rgba(236,72,153,0.7)] ${
              isRunning
                ? "bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-600 hover:brightness-110"
                : "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:brightness-110 animate-pulse"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>{lang === "ar" ? "إيقاف مؤقت" : "Pause"}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white rtl:translate-x-[-1px] ltr:translate-x-[1px]" />
                <span>{lang === "ar" ? "بدء التمرين" : "Start"}</span>
              </>
            )}
          </button>

          {/* Right: Next Exercise Button ("التالي") */}
          <button
            onClick={onNext}
            className="h-12 rounded-2xl bg-slate-800/80 hover:bg-slate-700/90 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-fuchsia-400/30 shadow-md active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white rtl:rotate-180" />
            <span>{lang === "ar" ? "التالي" : "Next"}</span>
          </button>
        </div>

        {/* ---------- BOTTOM SECTION: TIMER & HORIZONTAL PROGRESS BAR ---------- */}
        <div className="flex items-center gap-2.5 px-1">
          <div className="flex items-center gap-1.5 text-fuchsia-200 font-mono text-xs font-semibold shrink-0">
            <Clock className="w-3.5 h-3.5 text-pink-400" />
            <span>{timerLabel}</span>
          </div>

          {/* Horizontal glowing pink gradient progress bar */}
          <div className="flex-1 h-3 rounded-full bg-slate-950/70 border border-fuchsia-500/30 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.8)] transition-all duration-300"
              style={{ width: `${Math.max(4, timeProgressPercent)}%` }}
            />
          </div>

          {/* Additional Settings toggle icon */}
          <button
            onClick={() => setShowSettingsDrawer((s) => !s)}
            className="p-1 rounded-lg text-fuchsia-300 hover:text-white transition-colors"
            title={lang === "ar" ? "إعدادات الجلسة والسرعة" : "Session settings"}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Collapsible Fine Tuning Settings (Speed, Rep adjustments, Affected Side) */}
        {showSettingsDrawer && (
          <div className="mt-3 pt-3 border-t border-fuchsia-500/25 space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-fuchsia-200">
              <span className="font-semibold">{lang === "ar" ? "الجانب المستهدف:" : "Side:"}</span>
              <div className="flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-xl border border-fuchsia-500/20">
                <button
                  onClick={() => onChangeAffectedSide("left")}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                    affectedSide === "left" ? "bg-pink-500 text-white" : "text-fuchsia-300"
                  }`}
                >
                  {lang === "ar" ? "الأيسر" : "Left"}
                </button>
                <button
                  onClick={() => onChangeAffectedSide("right")}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                    affectedSide === "right" ? "bg-pink-500 text-white" : "text-fuchsia-300"
                  }`}
                >
                  {lang === "ar" ? "الأيمن" : "Right"}
                </button>
                <button
                  onClick={() => onChangeAffectedSide("both")}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                    affectedSide === "both" ? "bg-pink-500 text-white" : "text-fuchsia-300"
                  }`}
                >
                  {lang === "ar" ? "معاً" : "Both"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-fuchsia-200">
              <span className="font-semibold flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-fuchsia-400" />
                {lang === "ar" ? "سرعة الحركة:" : "Speed:"}
              </span>
              <div className="flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-xl border border-fuchsia-500/20 font-mono text-[10px]">
                {[0.5, 0.75, 1.0, 1.25].map((s) => (
                  <button
                    key={s}
                    onClick={() => onChangeSpeed(s)}
                    className={`px-2 py-0.5 rounded-lg font-bold ${
                      speed === s ? "bg-pink-500 text-white" : "text-fuchsia-300"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={onReset}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-fuchsia-200 text-[11px] font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{lang === "ar" ? "إعادة الضبط" : "Reset Timer"}</span>
              </button>

              <div className="flex items-center gap-1 text-[11px] text-fuchsia-200">
                <span>{lang === "ar" ? "تعديل التكرار:" : "Adjust Reps:"}</span>
                <button
                  onClick={() => onUpdateReps(-1)}
                  className="w-5 h-5 rounded-md bg-white/10 text-white flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="px-1 font-mono font-bold">{completedReps}</span>
                <button
                  onClick={() => onUpdateReps(1)}
                  className="w-5 h-5 rounded-md bg-white/10 text-white flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== FLOATING BOTTOM SAFETY BANNER ==================== */}
      {/* (Faithfully matching the pill banner with green shield in the reference screenshot!) */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/80 backdrop-blur-xl border border-emerald-400/35 text-xs font-semibold text-emerald-100 shadow-[0_4px_20px_rgba(16,185,129,0.2)]">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {lang === "ar"
              ? "توقفي إذا شعرت بألم جديد أو تورم"
              : "Stop if you feel new pain or swelling"}
          </span>
        </div>
      </div>

      {/* ==================== TIPS MODAL (LIGHTBULB CLICK) ==================== */}
      {showTipsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-[28px] bg-slate-900 border border-fuchsia-400/40 p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-fuchsia-400/20 pb-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Lightbulb className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>{lang === "ar" ? "إرشادات الأداء السليم" : "Performance Tips"}</span>
              </div>
              <button
                onClick={() => setShowTipsModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-fuchsia-100/90 leading-relaxed max-h-[60vh] overflow-y-auto">
              <h4 className="font-bold text-white text-xs">
                {lang === "ar" ? exercise.name_ar : exercise.name_en}
              </h4>
              <ul className="list-disc ps-4 space-y-1.5">
                {(lang === "ar" ? exercise.instructions_ar : exercise.instructions_en).map(
                  (step, idx) => (
                    <li key={idx}>{step}</li>
                  ),
                )}
              </ul>

              <div className="mt-3 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-200">
                <span className="font-bold">⚠️ {lang === "ar" ? "تنبيه هام:" : "Caution:"} </span>
                {lang === "ar" ? exercise.precautions_ar[0] : exercise.precautions_en[0]}
              </div>
            </div>

            <button
              onClick={() => setShowTipsModal(false)}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold text-xs"
            >
              {lang === "ar" ? "فهمت، متابعة التمرين" : "Got it, continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
