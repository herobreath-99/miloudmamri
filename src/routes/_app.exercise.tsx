import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Flame,
  Volume2,
  VolumeX,
  Info,
  Check,
  X,
  Sparkles,
  Target,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Hand,
  ShieldCheck,
  Lightbulb,
  CheckCircle2,
  Activity,
  Heart,
  Dumbbell,
  Compass,
  Layers,
  Eye,
  Sliders,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { addCompletedExercise } from "@/lib/local-db";
import { EXERCISES, type Exercise, type BodyPart } from "@/data/exercises";
import { ANATOMY_REGIONS, type AnatomyRegion } from "@/data/anatomyData";
import { AnatomyInfoModal } from "@/components/pinkcare/anatomy/AnatomyInfoModal";
import avatarImg from "@/assets/exercise-avatar.png";
import coachImg from "@/assets/exercise-coach.png";
import poseCorrect from "@/assets/pose-correct.png";
import poseWrong from "@/assets/pose-wrong.png";
import poseArm from "@/assets/exercise-pose-arm.png";
import poseShoulder from "@/assets/exercise-pose-shoulder.png";
import poseChest from "@/assets/exercise-pose-chest.png";
import poseBreathing from "@/assets/exercise-pose-breathing.png";
import poseFull from "@/assets/exercise-pose-full.png";
import shoulderAnatomyImg from "@/assets/shoulder_anatomy_target.jpg";

const POSE_IMAGES: Record<string, string> = {
  arm: poseArm,
  shoulder: poseShoulder,
  chest: poseChest,
  breathing: poseBreathing,
  full: poseFull,
};

const BODY_PART_LABELS: Record<BodyPart, { ar: string; dz: string; fr: string; en: string }> = {
  arm: {
    ar: "مفصل الكتف والذراع",
    dz: "مفصل الكتف واليد",
    fr: "Épaule et bras",
    en: "Shoulder Joint & Arm",
  },
  shoulder: {
    ar: "الكتفان وأعلى الظهر",
    dz: "الكتاف وأعلى الظهر",
    fr: "Épaules et haut du dos",
    en: "Shoulders & Upper Back",
  },
  chest: {
    ar: "عضلات الصدر والقفص",
    dz: "عضلات الصدر والقفص الصدري",
    fr: "Poitrine et cage thoracique",
    en: "Chest & Ribcage Muscles",
  },
  breathing: {
    ar: "الحجاب الحاجز والرئتان",
    dz: "التنفس والرئتين",
    fr: "Diaphragme et respiration",
    en: "Diaphragm & Lungs",
  },
  full: {
    ar: "كامل الجزء العلوي",
    dz: "الجسم العلوي كامل",
    fr: "Haut du corps complet",
    en: "Full Upper Body",
  },
};

export const Route = createFileRoute("/_app/exercise")({
  component: UnifiedExerciseStudio,
});

function UnifiedExerciseStudio() {
  const { t, lang } = useI18n();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [idx, setIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [reps, setReps] = useState(0);

  // 3D camera controls for the classic model
  const [rotateY, setRotateY] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [autoRotate, setAutoRotate] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Anatomy Interactive Studio States
  const [selectedAnatomyRegion, setSelectedAnatomyRegion] = useState<AnatomyRegion | null>(null);
  const [hoveredAnatomyRegion, setHoveredAnatomyRegion] = useState<AnatomyRegion | null>(null);
  const [showAnatomyLayer, setShowAnatomyLayer] = useState(true);
  const [anatomyCategoryFilter, setAnatomyCategoryFilter] = useState<
    "all" | "arm" | "shoulder" | "core"
  >("all");

  // Touch and drag references
  const dragRef = useRef<{ x: number; y: number; rotY: number; rotX: number } | null>(null);
  const pinchRef = useRef<number | null>(null);
  const lastSpokenRef = useRef<number>(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Filtered exercises list
  const filteredExercises = useMemo(() => {
    if (activeCategory === "all") return EXERCISES;
    return EXERCISES.filter((e) => e.body_part === activeCategory);
  }, [activeCategory]);

  // Keep idx within bounds
  const currentIdx = Math.min(idx, filteredExercises.length - 1);
  const ex: Exercise = filteredExercises[currentIdx] ?? EXERCISES[0];
  const currentPoseImg = POSE_IMAGES[ex.body_part] ?? avatarImg;

  const getExName = (e: Exercise) => {
    if (lang === "dz" && e.name_dz) return e.name_dz;
    if (lang === "fr" && e.name_fr) return e.name_fr;
    if (lang === "en") return e.name_en;
    return e.name_ar;
  };

  const getExDesc = (e: Exercise) => {
    if (lang === "dz" && e.desc_dz) return e.desc_dz;
    if (lang === "fr" && e.desc_fr) return e.desc_fr;
    if (lang === "en") return e.desc_en;
    return e.desc_ar;
  };

  const getExLevel = (e: Exercise) => {
    if (lang === "dz" && e.level_dz) return e.level_dz;
    if (lang === "fr" && e.level_fr) return e.level_fr;
    if (lang === "en") return e.level_en;
    return e.level_ar;
  };

  const getExWarning = (e: Exercise) => {
    if (lang === "dz" && e.warning_dz) return e.warning_dz;
    if (lang === "fr" && e.warning_fr) return e.warning_fr;
    if (lang === "en") return e.warning_en;
    return e.warning_ar;
  };

  const getExStepText = (st: { ar: string; dz?: string; fr?: string; en: string }) => {
    if (lang === "dz" && st.dz) return st.dz;
    if (lang === "fr" && st.fr) return st.fr;
    if (lang === "en") return st.en;
    return st.ar;
  };

  // Normalize current rotation angle to [0, 360)
  const normalizedRotY = ((rotateY % 360) + 360) % 360;
  const isBackView = normalizedRotY > 110 && normalizedRotY < 250;

  // Timer tick
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  // Auto-increment rep count based on rhythm
  useEffect(() => {
    if (!running) return;
    const repSeconds = 8;
    if (seconds > 0 && seconds % repSeconds === 0) {
      setReps((r) => (r < ex.reps ? r + 1 : r));
    }
  }, [seconds, running, ex.reps]);

  // Smooth continuous auto-rotation if toggled
  useEffect(() => {
    if (!autoRotate) return;
    const id = setInterval(() => {
      setRotateY((r) => (r + 1.2) % 360);
    }, 40);
    return () => clearInterval(id);
  }, [autoRotate]);

  // Clean up speech synthesis
  useEffect(
    () => () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    },
    [],
  );

  const totalSeconds = Math.max(60, ex.minutes * 60);

  const reset = () => {
    setRunning(false);
    setSeconds(0);
    setReps(0);
  };

  const nextExercise = () => {
    reset();
    setIdx((prev) => (prev + 1) % filteredExercises.length);
  };

  const prevExercise = () => {
    reset();
    setIdx((prev) => (prev - 1 + filteredExercises.length) % filteredExercises.length);
  };

  const finishExercise = async () => {
    setRunning(false);
    const duration = Math.max(seconds, 30);
    addCompletedExercise(ex.key, duration);
    toast.success(
      lang === "dz"
        ? `✨ يعطيك الصحة! تسجل تمرين "${getExName(ex)}" بنجاح`
        : lang === "ar"
          ? `✨ أحسنتِ! تم تسجيل تمرين "${ex.name_ar}" بنجاح`
          : `✨ Great job! "${ex.name_en}" recorded successfully`,
      {
        description:
          lang === "dz"
            ? `كملتي ${reps || ex.reps} تكرارات في ${Math.max(1, Math.round(duration / 60))} دقيقة`
            : lang === "ar"
              ? `أكملتِ ${reps || ex.reps} تكرار في ${Math.max(1, Math.round(duration / 60))} دقيقة`
              : `Completed ${reps || ex.reps} reps in ${Math.max(1, Math.round(duration / 60))} min`,
      },
    );
    reset();
  };

  // Helper to load an exercise by key
  const handleSelectExerciseByKey = (key: string) => {
    const targetIdx = EXERCISES.findIndex((e) => e.key === key);
    if (targetIdx !== -1) {
      setActiveCategory("all");
      setIdx(targetIdx);
      reset();
      toast.info(
        lang === "ar"
          ? `تم تحميل تمرين: ${EXERCISES[targetIdx].name_ar}`
          : `Loaded: ${EXERCISES[targetIdx].name_en}`,
      );
    }
  };

  // Preset camera angle helper
  const setCameraAngle = (angleY: number, angleX = 0) => {
    setAutoRotate(false);
    setRotateY(angleY);
    setRotateX(angleX);
  };

  // Formatted elapsed and remaining times
  const elapsedFormatted = useMemo(() => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, [seconds]);

  const targetFormatted = useMemo(() => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, [totalSeconds]);

  const progress = Math.min(100, Math.round((seconds / totalSeconds) * 100));
  const calories = Math.round((seconds / 60) * 6.5);

  const stepIdx =
    ex.steps.length > 0
      ? Math.min(
          ex.steps.length - 1,
          Math.floor((seconds / Math.max(1, totalSeconds)) * ex.steps.length),
        )
      : 0;
  const currentStep = ex.steps[stepIdx];

  // Voice guidance with SpeechSynthesis
  useEffect(() => {
    if (!voiceOn || !running || typeof window === "undefined" || !("speechSynthesis" in window))
      return;
    if (lastSpokenRef.current === stepIdx) return;
    lastSpokenRef.current = stepIdx;
    const step = ex.steps[stepIdx];
    if (!step) return;
    const text = lang === "ar" ? step.ar : step.en;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang === "ar" ? "ar-SA" : "en-US";
      utter.rate = 0.92;
      utter.pitch = 1.05;
      window.speechSynthesis.speak(utter);
    } catch {
      // SpeechSynthesis may fail or be unsupported in some environments
    }
  }, [stepIdx, voiceOn, running, lang, ex]);

  const coachMsg = running
    ? lang === "ar"
      ? "حافظي على استقامة ظهرك وتنفسي بعمق، لا تدفعي جسمك فوق نقطة الراحة 💗"
      : "Keep your back tall, breathe deeply, and stay within your comfortable range 💗"
    : lang === "ar"
      ? "اضغطي بدء التمرين عندما تكونين جاهزة، وتحركي برفق وهدوء 🌸"
      : "Tap start whenever you're ready, and move gently with confidence 🌸";

  // Categories definition for exercises
  const categories: { id: string; labelAr: string; labelEn: string }[] = [
    { id: "all", labelAr: "الكل", labelEn: "All" },
    { id: "arm", labelAr: "الذراع", labelEn: "Arm" },
    { id: "shoulder", labelAr: "الكتف", labelEn: "Shoulder" },
    { id: "chest", labelAr: "الصدر", labelEn: "Chest" },
    { id: "breathing", labelAr: "التنفس", labelEn: "Breathing" },
  ];

  // Filtered anatomy regions for quick explorer
  const displayedAnatomyRegions = useMemo(() => {
    if (anatomyCategoryFilter === "all") return ANATOMY_REGIONS;
    return ANATOMY_REGIONS.filter((r) => r.category === anatomyCategoryFilter);
  }, [anatomyCategoryFilter]);

  return (
    <div className="space-y-3.5 pb-10">
      {/* 1. Sleek Unified Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/80 via-fuchsia-900/70 to-purple-950/80 border border-fuchsia-400/30 p-2.5 shadow-lg backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-fuchsia-950/60 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-white tracking-wide">
              {lang === "ar"
                ? "استوديو التشريح والتأهيل الحركي 3D"
                : "3D Anatomy & Rehabilitation Studio"}
            </h1>
            <p className="text-[10px] text-fuchsia-200/90 -mt-0.5">
              {lang === "ar"
                ? "استكشاف تشريحي تفاعلي باللمس • تمارين معتمدة"
                : "Interactive Touch Anatomy • Clinical Exercises"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Toggle Anatomical Layer */}
          <button
            onClick={() => setShowAnatomyLayer((prev) => !prev)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              showAnatomyLayer
                ? "bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white shadow-[0_0_12px_#ec4899] border border-pink-300"
                : "glass-dark text-fuchsia-200 hover:text-white"
            }`}
            title={
              lang === "ar"
                ? showAnatomyLayer
                  ? "إخفاء الطبقة التشريحية"
                  : "إظهار الطبقة التشريحية التفاعلية"
                : "Toggle Anatomy Layer"
            }
            aria-label="Toggle anatomy layer"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setVoiceOn((v) => !v)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              voiceOn
                ? "bg-fuchsia-500/40 text-white shadow-[0_0_12px_oklch(0.78_0.3_340/0.6)] border border-fuchsia-300/50"
                : "glass-dark text-fuchsia-200/60"
            }`}
            title={lang === "ar" ? "التوجيه الصوتي" : "Voice Guidance"}
            aria-label="Toggle voice"
          >
            {voiceOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setShowInfoModal(true)}
            className="w-8 h-8 rounded-full glass-dark text-fuchsia-200 flex items-center justify-center hover:text-white transition"
            title={lang === "ar" ? "إرشادات التمرين" : "Exercise Info"}
            aria-label="Exercise info"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Interactive Anatomical Hotspots Banner Hint */}
      <div className="rounded-2xl p-2 px-3 bg-gradient-to-r from-purple-900/50 via-pink-950/40 to-purple-900/50 border border-pink-500/30 flex items-center justify-between text-xs shadow-sm">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500" />
          </span>
          <span className="text-[11px] font-medium text-white/95">
            {lang === "ar"
              ? "المسّي أي منطقة على المجسم لاستكشاف تشريحها ومشكلاتها الصحية وتمارينها"
              : "Touch any body part on the 3D model to explore anatomy, issues & exercises"}
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30 font-bold shrink-0">
          15 {lang === "ar" ? "منطقة نشطة" : "regions"}
        </span>
      </div>

      {/* 3. Main Avatar 3D Interactive Stage */}
      <div
        className="glass-dark rounded-[28px] p-2 relative overflow-hidden select-none touch-none border border-fuchsia-400/30 shadow-[0_12px_36px_-10px_oklch(0.3_0.15_320/0.5)]"
        onPointerDown={(e) => {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          dragRef.current = {
            x: e.clientX,
            y: e.clientY,
            rotY: rotateY,
            rotX: rotateX,
          };
          setAutoRotate(false);
        }}
        onPointerMove={(e) => {
          if (!dragRef.current) return;
          const dx = e.clientX - dragRef.current.x;
          const dy = e.clientY - dragRef.current.y;
          setRotateY(dragRef.current.rotY + dx * 0.75);
          // Vertical tilt clamped between -25 and +25 degrees
          setRotateX(Math.max(-25, Math.min(25, dragRef.current.rotX - dy * 0.4)));
        }}
        onPointerUp={() => {
          dragRef.current = null;
        }}
        onPointerCancel={() => {
          dragRef.current = null;
        }}
        onTouchStart={(e) => {
          if (e.touches.length === 2) {
            const dist = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY,
            );
            pinchRef.current = dist;
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 2 && pinchRef.current !== null) {
            const dist = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY,
            );
            const delta = (dist - pinchRef.current) * 0.005;
            setZoom((z) => Math.max(0.7, Math.min(1.8, z + delta)));
            pinchRef.current = dist;
          }
        }}
        onTouchEnd={() => {
          pinchRef.current = null;
        }}
        onWheel={(e) => {
          setZoom((z) => Math.max(0.7, Math.min(1.8, z - e.deltaY * 0.0012)));
        }}
      >
        {/* Atmospheric Studio Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 25%, oklch(0.55 0.28 320 / 0.5), transparent 65%), radial-gradient(circle at 50% 90%, oklch(0.52 0.3 305 / 0.4), transparent 60%)",
          }}
        />

        {/* Ambient neon light pillars */}
        <div className="absolute inset-y-6 left-5 w-px bg-gradient-to-b from-transparent via-fuchsia-400/70 to-transparent shadow-[0_0_12px_oklch(0.75_0.3_350/0.8)] pointer-events-none" />
        <div className="absolute inset-y-6 right-5 w-px bg-gradient-to-b from-transparent via-fuchsia-400/70 to-transparent shadow-[0_0_12px_oklch(0.75_0.3_350/0.8)] pointer-events-none" />

        {/* Sparkle particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full animate-sparkle"
              style={{
                left: `${(i * 31 + 10) % 90}%`,
                top: `${12 + ((i * 47) % 70)}%`,
                width: `${2.5 + (i % 3) * 1.5}px`,
                height: `${2.5 + (i % 3) * 1.5}px`,
                background: "oklch(0.95 0.1 350)",
                boxShadow: "0 0 8px oklch(0.85 0.3 350 / 0.9)",
                animationDelay: `${0.15 + i * 0.14}s`,
              }}
            />
          ))}
        </div>

        {/* Floating Left Vertical Controls (360°, Zoom In, Zoom Out, Reset) */}
        <div className="absolute top-4 start-3 z-30 flex flex-col gap-2">
          {/* 360° Rotate button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAutoRotate((prev) => !prev);
            }}
            className={`px-2.5 py-2 rounded-2xl flex flex-col items-center gap-0.5 transition-all backdrop-blur-md border ${
              autoRotate
                ? "bg-gradient-to-b from-pink-500/80 to-fuchsia-600/80 text-white shadow-[0_0_16px_oklch(0.78_0.3_340/0.7)] border-pink-300"
                : "glass-dark text-fuchsia-100 hover:text-white border-fuchsia-400/30"
            }`}
            title={lang === "ar" ? "تدوير تلقائي 360 درجة" : "360° Auto-rotate"}
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? "animate-spin" : ""}`} />
            <span className="text-[10px] font-bold">360°</span>
            <span className="text-[8px] text-fuchsia-200/80 leading-none">
              {lang === "ar" ? "إدارة النموذج" : "Rotate"}
            </span>
          </button>

          {/* Zoom In */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoom((z) => Math.min(1.8, z + 0.15));
            }}
            className="px-2.5 py-1.5 rounded-2xl glass-dark text-fuchsia-100 hover:text-white flex flex-col items-center gap-0.5 border border-fuchsia-400/30 transition-all backdrop-blur-md"
            title={lang === "ar" ? "تكبير" : "Zoom In"}
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span className="text-[8px] leading-none">{lang === "ar" ? "تكبير" : "Zoom In"}</span>
          </button>

          {/* Zoom Out */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoom((z) => Math.max(0.7, z - 0.15));
            }}
            className="px-2.5 py-1.5 rounded-2xl glass-dark text-fuchsia-100 hover:text-white flex flex-col items-center gap-0.5 border border-fuchsia-400/30 transition-all backdrop-blur-md"
            title={lang === "ar" ? "تصغير" : "Zoom Out"}
          >
            <ZoomOut className="w-3.5 h-3.5" />
            <span className="text-[8px] leading-none">{lang === "ar" ? "تصغير" : "Zoom Out"}</span>
          </button>

          {/* Reset Angle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCameraAngle(0, 0);
              setZoom(1);
            }}
            className="w-8 h-8 rounded-xl glass-dark text-fuchsia-200 hover:text-white flex items-center justify-center border border-fuchsia-400/20 self-center"
            title={lang === "ar" ? "إعادة ضبط المنظور" : "Reset Angle"}
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Floating Right Anatomical Target Window ("منطقة التمرين") */}
        <div
          onClick={() => {
            const defaultReg = ANATOMY_REGIONS.find((r) => r.id === "shoulder_joint");
            if (defaultReg) setSelectedAnatomyRegion(defaultReg);
          }}
          className="absolute top-4 end-3 z-30 w-24 rounded-2xl overflow-hidden glass-dark border border-fuchsia-400/40 shadow-xl backdrop-blur-md cursor-pointer hover:border-pink-400 transition"
          title={lang === "ar" ? "اضغطي لعرض التفاصيل التشريحية" : "Click for anatomy details"}
        >
          <div className="relative h-28 bg-gradient-to-b from-purple-950/80 to-fuchsia-950/90 flex items-center justify-center p-1 overflow-hidden">
            <img
              src={shoulderAnatomyImg}
              alt="Target Muscle Anatomy"
              className="w-full h-full object-cover rounded-xl opacity-90 hover:scale-105 transition-transform"
            />
            {/* Pulsing Target Hotspot on the anatomical joint */}
            <div className="absolute top-7 left-8 pointer-events-none">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500 border border-white shadow-[0_0_8px_#ff2d87]" />
              </span>
            </div>
          </div>
          <div className="py-1 px-1.5 text-center bg-black/40 border-t border-fuchsia-400/30">
            <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-white">
              <Target className="w-3 h-3 text-pink-400" />
              <span>{lang === "ar" ? "منطقة التمرين" : "Target Area"}</span>
            </div>
            <p className="text-[8px] text-fuchsia-200/80 truncate">
              {lang === "ar"
                ? BODY_PART_LABELS[ex.body_part]?.ar
                : BODY_PART_LABELS[ex.body_part]?.en}
            </p>
          </div>
        </div>

        {/* Center: Classic Avatar on Neon Platform with Interactive Hotspots */}
        <div className="relative h-[350px] flex items-end justify-center">
          {/* Glowing trajectory motion arc */}
          <svg
            className="absolute inset-x-0 top-3 mx-auto opacity-90 pointer-events-none"
            width="240"
            height="190"
            viewBox="0 0 240 190"
            fill="none"
          >
            <defs>
              <linearGradient id="studioArc" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="oklch(0.85 0.28 350)" />
                <stop offset="100%" stopColor="oklch(0.65 0.3 305)" />
              </linearGradient>
            </defs>
            <path
              d="M 45 165 Q 120 -8 205 75"
              stroke="url(#studioArc)"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="6 6"
              style={{ filter: "drop-shadow(0 0 6px oklch(0.78 0.28 340 / 0.9))" }}
            />
            <polygon
              points="205,75 195,67 200,82"
              fill="oklch(0.85 0.3 340)"
              style={{ filter: "drop-shadow(0 0 6px oklch(0.78 0.28 340))" }}
            />
          </svg>

          {/* Avatar Container with 3D perspective rotation (X & Y axes) + zoom */}
          <div
            className="relative z-10 h-[300px]"
            style={{
              transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${zoom})`,
              transformOrigin: "50% 65%",
              transition: dragRef.current ? "none" : "transform 0.35s cubic-bezier(.2,.8,.25,1)",
              transformStyle: "preserve-3d",
            }}
          >
            <img
              key={ex.key}
              src={currentPoseImg}
              alt="Rehabilitation Fitness Avatar"
              width={1024}
              height={1024}
              className={`h-[300px] w-auto object-contain drop-shadow-[0_22px_45px_oklch(0.55_0.3_320/0.6)] animate-page-enter ${
                running ? "animate-avatar-breathe" : "animate-float"
              }`}
            />

            {/* Active Muscle Glow on Avatar */}
            <BodyPartGlow part={ex.body_part} pulse={running} />

            {/* INTERACTIVE 3D ANATOMICAL HOTSPOTS OVERLAY */}
            {showAnatomyLayer && (
              <div className="absolute inset-0 z-20 pointer-events-auto">
                {ANATOMY_REGIONS.map((region) => {
                  // Determine coordinates based on whether the view is from front or back
                  const top =
                    isBackView && region.backTopPercent !== undefined
                      ? region.backTopPercent
                      : region.topPercent;
                  const left =
                    isBackView && region.backLeftPercent !== undefined
                      ? region.backLeftPercent
                      : region.leftPercent;

                  // If region is strictly back (e.g. Scapula) and we are viewing from front, reduce opacity
                  const isBackSpecific = region.id === "scapula" || region.id === "upper_back";
                  if (isBackSpecific && !isBackView) {
                    // Still clickable but with subtle cue
                  }

                  const isSelected = selectedAnatomyRegion?.id === region.id;
                  const isHovered = hoveredAnatomyRegion?.id === region.id;

                  return (
                    <button
                      key={region.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAnatomyRegion(region);
                      }}
                      onMouseEnter={() => setHoveredAnatomyRegion(region)}
                      onMouseLeave={() => setHoveredAnatomyRegion(null)}
                      style={{
                        top: `${top}%`,
                        left: `${left}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none cursor-pointer"
                      title={lang === "fr" ? region.name_fr : region.name_ar}
                      aria-label={region.name_ar}
                    >
                      {/* Outer pulse wave */}
                      <span className="relative flex h-5 w-5 items-center justify-center">
                        <span
                          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            isSelected
                              ? "animate-ping bg-pink-400"
                              : "animate-pulse bg-fuchsia-400/80"
                          }`}
                        />
                        <span
                          className={`relative inline-flex h-3.5 w-3.5 rounded-full border border-white transition-all shadow-md ${
                            isSelected
                              ? "bg-pink-500 scale-125 shadow-[0_0_12px_#ff2d87]"
                              : isHovered
                                ? "bg-fuchsia-400 scale-110 shadow-[0_0_10px_#d946ef]"
                                : "bg-gradient-to-br from-pink-500 to-purple-600"
                          }`}
                        />
                      </span>

                      {/* Floating Tooltip Label on Hover / Selection */}
                      <span
                        className={`absolute top-full start-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded-lg text-[9px] font-bold whitespace-nowrap shadow-xl pointer-events-none transition-all z-30 ${
                          isSelected || isHovered
                            ? "opacity-100 scale-100 bg-slate-900/95 text-white border border-pink-400/80"
                            : "opacity-0 scale-95 hidden sm:block sm:opacity-0 group-hover:opacity-100 group-hover:scale-100 bg-black/85 text-pink-200 border border-fuchsia-400/40"
                        }`}
                      >
                        {lang === "fr" ? region.name_fr : region.name_ar}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Concentric Neon Platform Rings on the floor */}
          <div className="absolute bottom-0 inset-x-0 h-20 pointer-events-none">
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-9 w-[260px] h-[60px] rounded-full border-2 border-fuchsia-400/80 shadow-[0_0_32px_oklch(0.78_0.3_340/0.8)]"
              style={{ transform: "translateX(-50%) perspective(400px) rotateX(72deg)" }}
            />
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-6 w-[200px] h-[46px] rounded-full border border-fuchsia-300/70 shadow-[0_0_24px_oklch(0.78_0.3_340/0.75)]"
              style={{ transform: "translateX(-50%) perspective(400px) rotateX(72deg)" }}
            />
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-3 w-[140px] h-[32px] rounded-full border border-pink-200/60 shadow-[0_0_18px_oklch(0.78_0.3_340/0.6)]"
              style={{ transform: "translateX(-50%) perspective(400px) rotateX(72deg)" }}
            />
          </div>

          {/* Quick Perspective Angle Presets on bottom bar */}
          <div className="absolute bottom-2 start-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full glass-dark border border-fuchsia-300/30 text-[10px] text-fuchsia-100 shadow-md">
            <Compass className="w-3 h-3 text-pink-400" />
            <button
              onClick={() => setCameraAngle(0, 0)}
              className={`px-1.5 py-0.5 rounded transition ${
                normalizedRotY < 30 || normalizedRotY > 330
                  ? "font-bold text-white bg-pink-500/30 shadow-sm"
                  : "hover:text-white"
              }`}
            >
              {lang === "ar" ? "أمامي" : "Front"}
            </button>
            <span className="text-fuchsia-400/40">|</span>
            <button
              onClick={() => setCameraAngle(90, 0)}
              className={`px-1.5 py-0.5 rounded transition ${
                normalizedRotY >= 75 && normalizedRotY <= 105
                  ? "font-bold text-white bg-pink-500/30 shadow-sm"
                  : "hover:text-white"
              }`}
            >
              {lang === "ar" ? "جانبي" : "Side"}
            </button>
            <span className="text-fuchsia-400/40">|</span>
            <button
              onClick={() => setCameraAngle(180, 0)}
              className={`px-1.5 py-0.5 rounded transition ${
                isBackView ? "font-bold text-white bg-pink-500/30 shadow-sm" : "hover:text-white"
              }`}
            >
              {lang === "ar" ? "خلفي" : "Back"}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Quick Anatomical Regions Explorer Strip */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-pink-400" />
            {lang === "ar" ? "استكشاف المناطق التشريحية باللمس" : "Interactive Anatomy Explorer"}
          </span>
          <div className="flex items-center gap-1 text-[10px]">
            <button
              onClick={() => setAnatomyCategoryFilter("all")}
              className={`px-2 py-0.5 rounded-full ${
                anatomyCategoryFilter === "all"
                  ? "bg-pink-500 text-white font-bold"
                  : "text-fuchsia-200/70 hover:text-white"
              }`}
            >
              {lang === "ar" ? "الكل" : "All"}
            </button>
            <button
              onClick={() => setAnatomyCategoryFilter("arm")}
              className={`px-2 py-0.5 rounded-full ${
                anatomyCategoryFilter === "arm"
                  ? "bg-pink-500 text-white font-bold"
                  : "text-fuchsia-200/70 hover:text-white"
              }`}
            >
              {lang === "ar" ? "الذراع" : "Arm"}
            </button>
            <button
              onClick={() => setAnatomyCategoryFilter("shoulder")}
              className={`px-2 py-0.5 rounded-full ${
                anatomyCategoryFilter === "shoulder"
                  ? "bg-pink-500 text-white font-bold"
                  : "text-fuchsia-200/70 hover:text-white"
              }`}
            >
              {lang === "ar" ? "الكتف" : "Shoulder"}
            </button>
            <button
              onClick={() => setAnatomyCategoryFilter("core")}
              className={`px-2 py-0.5 rounded-full ${
                anatomyCategoryFilter === "core"
                  ? "bg-pink-500 text-white font-bold"
                  : "text-fuchsia-200/70 hover:text-white"
              }`}
            >
              {lang === "ar" ? "الجذع" : "Core"}
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar">
          {displayedAnatomyRegions.map((region) => {
            const isSelected = selectedAnatomyRegion?.id === region.id;
            return (
              <button
                key={region.id}
                onClick={() => {
                  setSelectedAnatomyRegion(region);
                  // Adjust view to highlight region
                  if (region.id === "scapula" || region.id === "upper_back") {
                    setCameraAngle(180, 0);
                  } else {
                    setCameraAngle(0, 0);
                  }
                }}
                className={`px-3 py-1.5 rounded-2xl whitespace-nowrap text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                  isSelected
                    ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-md shadow-fuchsia-950/40 border border-pink-300/40 scale-105"
                    : "glass-dark text-fuchsia-100 hover:text-white border border-fuchsia-400/20"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? "bg-white shadow-[0_0_6px_#ffffff]" : "bg-pink-400"
                  }`}
                />
                <span>{lang === "fr" ? region.name_fr : region.name_ar}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Exercise Card with Rep Ring & Tips (Matching Screenshot Layout) */}
      <div className="glass-dark rounded-[26px] p-3.5 border border-fuchsia-400/30 shadow-lg relative">
        {/* Pill header with exercise name */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-800/80 via-fuchsia-700/80 to-purple-800/80 border border-fuchsia-300/40 text-white shadow-md">
              <Dumbbell className="w-3.5 h-3.5 text-pink-300" />
              <h2 className="text-xs font-bold">{getExName(ex)}</h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[80px_1fr_40px] items-center gap-3">
          {/* Reps Counter with Circular Badge */}
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 border-fuchsia-400/50 bg-purple-950/40 shadow-[0_0_15px_oklch(0.78_0.3_340/0.4)]">
              <span className="text-sm font-bold text-white tabular-nums">
                {reps} / {ex.reps}
              </span>
              <span className="text-[9px] text-fuchsia-200/90 -mt-0.5">
                {lang === "dz" ? "تكرارات" : lang === "ar" ? "تكرارات" : "reps"}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <button
                onClick={() => setReps((r) => Math.max(0, r - 1))}
                className="w-5 h-5 rounded-full bg-fuchsia-400/20 text-fuchsia-100 flex items-center justify-center hover:bg-fuchsia-400/40"
                aria-label="Decrease reps"
              >
                <Minus className="w-2.5 h-2.5" />
              </button>
              <button
                onClick={() => setReps((r) => r + 1)}
                className="w-5 h-5 rounded-full bg-fuchsia-400/20 text-fuchsia-100 flex items-center justify-center hover:bg-fuchsia-400/40"
                aria-label="Increase reps"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* Exercise Description & Step Guidance */}
          <div className="text-start">
            <p className="text-[12px] font-medium text-white/95 leading-relaxed">{getExDesc(ex)}</p>
            {running && currentStep && (
              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-pink-300 font-semibold animate-pulse">
                <Activity className="w-3 h-3 shrink-0" />
                <span>
                  {lang === "dz"
                    ? `خطوة ${stepIdx + 1}: ${getExStepText(currentStep)}`
                    : lang === "ar"
                      ? `خطوة ${stepIdx + 1}: ${currentStep.ar}`
                      : `Step ${stepIdx + 1}: ${currentStep.en}`}
                </span>
              </div>
            )}
          </div>

          {/* Lightbulb Tips Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowInfoModal(true)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-pink-500 text-white flex items-center justify-center shadow-[0_0_16px_#f59e0b] hover:scale-105 transition"
              title={lang === "dz" ? "نصائح وإرشادات" : lang === "ar" ? "نصائح وإرشادات" : "Tips"}
            >
              <Lightbulb className="w-5 h-5 fill-current text-amber-100" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. Primary Actions Bar (Done, Play/Pause Hero Button, Next) */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* Left: Finish & Log ("تم الإنجاز") */}
        <button
          onClick={finishExercise}
          className="rounded-2xl py-3 px-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600/80 to-teal-600/80 border border-emerald-400/40 shadow-lg flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{lang === "dz" ? "كملت التمرين ✓" : lang === "ar" ? "تم الإنجاز" : "Done"}</span>
        </button>

        {/* Center: Hero Play/Pause Toggle */}
        <button
          onClick={() => setRunning((r) => !r)}
          className="rounded-full py-3 px-8 font-bold flex items-center justify-center gap-2 text-white shadow-xl transition-all active:scale-95 animate-pulse-glow"
          style={{
            background: running
              ? "linear-gradient(135deg, #e11d48, #be185d)"
              : "linear-gradient(135deg, #ec4899, #d946ef)",
            boxShadow: running
              ? "0 0 28px oklch(0.65 0.3 15 / 0.7), 0 10px 25px -5px rgba(225, 29, 72, 0.5)"
              : "0 0 32px oklch(0.78 0.3 340 / 0.8), 0 10px 25px -5px rgba(217, 70, 239, 0.5)",
          }}
        >
          {running ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span className="text-sm">
                {lang === "dz" ? "حبسي شوية" : lang === "ar" ? "إيقاف مؤقت" : "Pause"}
              </span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span className="text-sm">
                {lang === "dz" ? "ابداي التمرين" : lang === "ar" ? "بدء التمرين" : "Start"}
              </span>
            </>
          )}
        </button>

        {/* Right: Next Exercise ("التالي") */}
        <button
          onClick={nextExercise}
          className="rounded-2xl py-3 px-3 text-xs font-bold text-white bg-gradient-to-r from-purple-800/80 to-fuchsia-800/80 border border-fuchsia-400/30 shadow-lg flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition"
        >
          <span>{lang === "dz" ? "التالي" : lang === "ar" ? "التالي" : "Next"}</span>
          <ChevronLeft className="w-4 h-4 rtl:hidden" />
          <ChevronRight className="w-4 h-4 ltr:hidden" />
        </button>
      </div>

      {/* 7. Timer & Sleek Progress Bar */}
      <div className="glass-dark rounded-2xl p-2.5 flex items-center gap-3 border border-fuchsia-400/25">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white shrink-0 tabular-nums">
          <RotateCcw
            onClick={reset}
            className="w-3.5 h-3.5 text-fuchsia-300 cursor-pointer hover:rotate-180 transition-transform"
            title={lang === "ar" ? "إعادة المؤقت" : "Reset Timer"}
          />
          <span>
            {elapsedFormatted} / {targetFormatted}
          </span>
        </div>

        {/* Gradient Progress Bar */}
        <div className="flex-1 h-3 rounded-full bg-purple-950/60 overflow-hidden p-0.5 border border-fuchsia-400/30">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.max(5, progress)}%`,
              background: "linear-gradient(90deg, #ec4899, #f43f5e)",
              boxShadow: "0 0 10px rgba(236, 72, 153, 0.7)",
            }}
          />
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold text-fuchsia-200 shrink-0">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
          <span>{calories} cal</span>
        </div>
      </div>

      {/* 8. Clinical Safety Disclaimer Banner */}
      <div className="rounded-2xl py-2 px-3.5 bg-gradient-to-r from-emerald-950/60 via-teal-900/60 to-emerald-950/60 border border-emerald-400/40 text-emerald-100 flex items-center justify-center gap-2 shadow-md">
        <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
        <span className="text-[11px] font-bold text-center">
          {lang === "ar"
            ? "توقفي فوراً إذا شعرتِ بألم جديد أو تورم"
            : "Stop immediately if you feel any new pain or swelling"}
        </span>
      </div>

      {/* 9. Correct vs Wrong Technique Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <PoseCard label={lang === "ar" ? "وضعية صحيحة" : "Correct"} ok img={poseCorrect} />
        <PoseCard label={lang === "ar" ? "وضعية خاطئة" : "Wrong"} img={poseWrong} />
      </div>

      {/* 10. Virtual Coach Dr. Nour Guidance Card */}
      <div className="glass-dark rounded-2xl p-3 flex items-center gap-3 border border-fuchsia-400/30 relative overflow-hidden">
        <img
          src={coachImg}
          alt="Virtual Coach Dr. Nour"
          className="w-12 h-12 rounded-xl object-cover border-2 border-fuchsia-300/60 shadow-md shrink-0"
        />
        <div className="flex-1 min-w-0 text-start">
          <div className="flex items-center gap-1 text-[11px] font-bold text-fuchsia-300">
            <Sparkles className="w-3 h-3 text-pink-400" />
            <span>{lang === "ar" ? "توجيه المدربة الافتراضية" : "Coach Guidance"}</span>
          </div>
          <p className="text-[11px] text-white/90 leading-snug mt-0.5">{coachMsg}</p>
        </div>
      </div>

      {/* 11. Horizontal Exercise Quick Selector */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-fuchsia-100 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-pink-400" />
            {lang === "ar" ? "مكتبة التمارين المعتمدة" : "Approved Exercise Library"}
          </span>
          <span className="text-[10px] text-fuchsia-300/80">
            {currentIdx + 1} / {filteredExercises.length}
          </span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory no-scrollbar">
          {filteredExercises.map((e, i) => {
            const active = i === currentIdx;
            return (
              <button
                key={e.key}
                onClick={() => {
                  reset();
                  setIdx(i);
                }}
                className={`shrink-0 w-32 snap-start glass-dark rounded-2xl p-2 text-start relative overflow-hidden transition-all ${
                  active
                    ? "ring-2 ring-pink-400 shadow-[0_0_20px_oklch(0.78_0.3_340/0.6)] bg-purple-900/40"
                    : "hover:bg-white/5 opacity-80"
                }`}
              >
                <div className="h-16 rounded-xl mb-1.5 flex items-center justify-center bg-gradient-to-br from-fuchsia-950/60 to-purple-950/60 overflow-hidden">
                  <img
                    src={POSE_IMAGES[e.body_part] ?? avatarImg}
                    alt={getExName(e)}
                    className="h-14 w-auto object-contain drop-shadow"
                  />
                </div>
                <p className="font-bold text-white text-[11px] leading-tight truncate">
                  {getExName(e)}
                </p>
                <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">
                  {getExLevel(e)}
                </span>
                {active && (
                  <div className="absolute top-2 start-2 w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center shadow">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 12. Modal: Step-by-Step Instructions & Precautions */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900/95 border border-fuchsia-400/40 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-fuchsia-400/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-300">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{getExName(ex)}</h3>
                  <span className="text-[10px] text-fuchsia-200/80">
                    {getExLevel(ex)} • {ex.minutes}{" "}
                    {lang === "dz" ? "دقائق" : lang === "ar" ? "دقائق" : "mins"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-8 h-8 rounded-full glass-dark text-fuchsia-200 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Steps */}
            <div>
              <h4 className="text-xs font-bold text-pink-300 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lang === "dz"
                  ? "الخطوات باش ديري التمرين صحيح"
                  : lang === "ar"
                    ? "خطوات الأداء الصحيح"
                    : "Exercise Steps"}
              </h4>
              <div className="space-y-2">
                {ex.steps.map((st, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-purple-950/40 border border-fuchsia-400/20 flex items-start gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-pink-500/30 text-pink-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-[11px] text-white/90 leading-relaxed">{getExStepText(st)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Precautions */}
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-400/40 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-200/90 leading-relaxed">
                <p className="font-bold text-amber-300 mb-0.5">
                  {lang === "dz"
                    ? "تنبيه طبي مهم"
                    : lang === "ar"
                      ? "تنبيه طبي مهم"
                      : "Clinical Caution"}
                </p>
                <p>
                  {getExWarning(ex) ||
                    (lang === "dz"
                      ? "حبسي فوراً إيلا حسيتي بسطر جديد أو ورم جديد. هاد التمارين مديورين باش تعاونك ترجعي خفتك غير بالشوية وماتعوضش رأي طبيبك المعالج."
                      : lang === "ar"
                        ? "توقفي فوراً إذا شعرتِ بألم حاد أو تورم جديد. التمارين مصممة للمرونة التدريجية ولا تعوض عن استشارة طبيبك."
                        : "Stop immediately if you experience sharp pain or new swelling.")}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-bold text-xs shadow-lg"
            >
              {lang === "dz"
                ? "فهمت ودرك واجدة نكمل"
                : lang === "ar"
                  ? "فهمت ومستعدة للمتابعة"
                  : "Understood & Ready"}
            </button>
          </div>
        </div>
      )}

      {/* 13. Interactive 3D Anatomy Smart Modal / Panel */}
      {selectedAnatomyRegion && (
        <AnatomyInfoModal
          region={selectedAnatomyRegion}
          onClose={() => setSelectedAnatomyRegion(null)}
          lang={lang}
          onSelectExercise={handleSelectExerciseByKey}
        />
      )}
    </div>
  );
}

function PoseCard({ label, ok, img }: { label: string; ok?: boolean; img: string }) {
  return (
    <div className="glass-dark rounded-2xl p-2 relative border border-fuchsia-400/25">
      <p className="text-[10px] text-fuchsia-100/90 text-center mb-1 font-semibold">{label}</p>
      <div
        className="h-[62px] rounded-xl flex items-center justify-center"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.55 0.18 320 / 0.5), oklch(0.3 0.12 305 / 0.5))",
        }}
      >
        <img
          src={img}
          alt={label}
          width={64}
          height={80}
          loading="lazy"
          className="h-[56px] w-auto object-contain"
        />
      </div>
      <div
        className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-lg ${
          ok ? "bg-emerald-500" : "bg-rose-500"
        }`}
      >
        {ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      </div>
    </div>
  );
}

function BodyPartGlow({
  part,
  pulse,
}: {
  part: "arm" | "shoulder" | "chest" | "breathing" | "full";
  pulse: boolean;
}) {
  const map: Record<string, { top: string; left: string; size: number } | null> = {
    arm: { top: "12%", left: "34%", size: 75 },
    shoulder: { top: "26%", left: "62%", size: 68 },
    chest: { top: "34%", left: "50%", size: 85 },
    breathing: { top: "38%", left: "50%", size: 95 },
    full: { top: "45%", left: "50%", size: 140 },
  };
  const cfg = map[part];
  if (!cfg) return null;
  return (
    <div
      className={`pointer-events-none absolute rounded-full ${pulse ? "animate-part-pulse" : ""}`}
      style={{
        top: cfg.top,
        left: cfg.left,
        width: cfg.size,
        height: cfg.size,
        transform: "translate(-50%, -50%)",
        background:
          "radial-gradient(circle, oklch(0.85 0.3 340 / 0.6) 0%, oklch(0.75 0.3 320 / 0.3) 45%, transparent 70%)",
        boxShadow: "0 0 32px oklch(0.78 0.3 340 / 0.8), 0 0 65px oklch(0.65 0.3 305 / 0.5)",
        mixBlendMode: "screen",
      }}
    />
  );
}
