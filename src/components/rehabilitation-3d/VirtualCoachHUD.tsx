import { useEffect, useRef } from "react";
import coachImg from "@/assets/exercise-coach.png";
import { Exercise3DDef, ExerciseStep3D } from "./types";
import { Volume2, VolumeX, Sparkles, ShieldCheck, Heart } from "lucide-react";

interface VirtualCoachHUDProps {
  exercise: Exercise3DDef;
  currentStep: ExerciseStep3D | undefined;
  stepIndex: number;
  isRunning: boolean;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  lang: "ar" | "en";
}

export function VirtualCoachHUD({
  exercise,
  currentStep,
  stepIndex,
  isRunning,
  voiceEnabled,
  onToggleVoice,
  lang,
}: VirtualCoachHUDProps) {
  const lastSpokenTextRef = useRef<string>("");

  // Web Speech API gentle coach voice
  useEffect(() => {
    if (!voiceEnabled || !isRunning || !currentStep || typeof window === "undefined") {
      return;
    }
    if (!("speechSynthesis" in window)) return;

    const textToSpeak = lang === "ar" ? currentStep.ar : currentStep.en;
    if (lastSpokenTextRef.current === textToSpeak) return;
    lastSpokenTextRef.current = textToSpeak;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = lang === "ar" ? "ar-SA" : "en-US";
      utterance.rate = 0.9; // gentle, reassuring pace
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch {
      // SpeechSynthesis may be blocked by autoplay policies
    }
  }, [currentStep, isRunning, voiceEnabled, lang]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const coachTitle =
    lang === "ar" ? "د. نــور • المرشدة الافتراضية" : "Dr. Nour • Virtual Rehabilitation Coach";

  const getEncouragement = () => {
    if (!isRunning) {
      return lang === "ar"
        ? "أهلاً بكِ. خذي نفساً عميقاً واضغطي 'بدء' عندما تكونين مستعدة تماماً 🌸"
        : "Welcome. Take a calm breath and tap 'Start' whenever you feel ready 🌸";
    }

    if (!currentStep) return "";

    switch (currentStep.phase) {
      case "prepare":
        return lang === "ar"
          ? "استرخي تماماً، واجعلي الظهر مستقيماً والكتفين مرتاحين."
          : "Relax fully, keep your spine tall and shoulders at ease.";
      case "movement":
        return lang === "ar"
          ? "حركة بطيئة وناعمة... تحركي فقط إلى الحد المريح والخالي من الألم."
          : "Slow, fluid motion... Move only within your pain-free comfort range.";
      case "hold":
        return lang === "ar"
          ? "ثبات لطيف ومريح. حافظي على استمرار التنفس ولا تحبسي النفس أبداً."
          : "Gentle hold at your peak. Keep breathing steadily—never hold your breath.";
      case "return":
        return lang === "ar"
          ? "عودة هادئة ومتحكم بها لنقطة البداية. رائع جداً!"
          : "Gentle, controlled return to resting posture. Wonderful control!";
      case "rest":
        return lang === "ar"
          ? "راحة قصيرة وتنفس عميق قبل التكرار التالي."
          : "Brief pause and deep breath before the next repetition.";
      default:
        return "";
    }
  };

  return (
    <div className="glass-dark rounded-[26px] p-3.5 border border-fuchsia-500/25 relative overflow-hidden shadow-xl">
      {/* Background glow tint */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 85% 50%, oklch(0.55 0.25 330 / 0.35), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex items-start gap-3">
        {/* Coach Avatar with status ring */}
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-fuchsia-400/60 shadow-[0_0_18px_oklch(0.78_0.3_340/0.4)]">
            <img
              src={coachImg}
              alt={coachTitle}
              width={256}
              height={256}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute -bottom-1 -end-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
            <ShieldCheck className="w-2.5 h-2.5 text-white" />
          </span>
        </div>

        {/* Coach Dialogue & Instructions */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-300" />
              <span className="text-[12px] font-bold text-white drop-shadow-[0_0_8px_oklch(0.75_0.3_340/0.7)]">
                {coachTitle}
              </span>
            </div>

            {/* Voice guidance toggle */}
            <button
              onClick={onToggleVoice}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-all ${
                voiceEnabled
                  ? "bg-fuchsia-500/30 text-fuchsia-200 border border-fuchsia-400/50 shadow-[0_0_10px_oklch(0.75_0.3_340/0.4)]"
                  : "bg-slate-800/80 text-fuchsia-300/60 border border-fuchsia-500/20 hover:text-fuchsia-200"
              }`}
              title={
                voiceEnabled
                  ? lang === "ar"
                    ? "التوجيه الصوتي مفعّل (انقري لكتم الصوت)"
                    : "Voice guidance ON (Click to mute)"
                  : lang === "ar"
                    ? "التوجيه الصوتي مكتوم (انقري للتشغيل)"
                    : "Voice guidance MUTED (Click to activate)"
              }
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="w-3 h-3 text-fuchsia-300" />
                  <span>{lang === "ar" ? "صوت مفعّل" : "Voice On"}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3 h-3" />
                  <span>{lang === "ar" ? "صامت" : "Muted"}</span>
                </>
              )}
            </button>
          </div>

          {/* Current step banner */}
          {isRunning && currentStep ? (
            <div className="space-y-1 mt-1">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-fuchsia-500/25 border border-fuchsia-400/40 text-[10px] font-bold text-fuchsia-200">
                  {lang === "ar"
                    ? `الخطوة ${stepIndex + 1} من ${exercise.steps.length}`
                    : `Step ${stepIndex + 1} of ${exercise.steps.length}`}
                </span>
                <span className="text-[10px] text-fuchsia-300/80">
                  {currentStep.phase === "prepare" && (lang === "ar" ? "الاستعداد" : "Prepare")}
                  {currentStep.phase === "movement" && (lang === "ar" ? "أداء الحركة" : "Movement")}
                  {currentStep.phase === "hold" &&
                    (lang === "ar" ? "الثبات الهادئ" : "Gentle Hold")}
                  {currentStep.phase === "return" &&
                    (lang === "ar" ? "العودة للراحة" : "Smooth Return")}
                </span>
              </div>
              <p className="text-[13px] font-semibold text-white leading-snug">
                {lang === "ar" ? currentStep.ar : currentStep.en}
              </p>
            </div>
          ) : (
            <p className="text-[12px] text-fuchsia-100/90 leading-snug mt-0.5">
              {getEncouragement()}
            </p>
          )}

          {/* Real-time clinical encouragement pill */}
          {isRunning && (
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-fuchsia-200/90 bg-fuchsia-950/40 px-2.5 py-1 rounded-xl border border-fuchsia-500/20">
              <Heart className="w-3 h-3 text-pink-400 shrink-0" />
              <span>{getEncouragement()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
