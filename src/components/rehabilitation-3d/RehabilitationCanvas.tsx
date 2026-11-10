import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Crosshair,
  Sparkles,
  Info,
  X,
  RotateCw,
  Target,
  Activity,
  Eye,
  Layers,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import stageCharacterImg from "@/assets/rehab_stage_pure.png";
import shoulderAnatomyImg from "@/assets/shoulder_anatomy_target.jpg";
import { AffectedSide, Exercise3DDef } from "./types";

interface RehabilitationCanvasProps {
  exercise: Exercise3DDef;
  repProgress: number; // 0 to 1 representing single repetition cycle
  affectedSide: AffectedSide;
  isRunning: boolean;
  phase: string;
  lang: "ar" | "en";
}

export type JointHotspotId =
  "rotator_cuff" | "pectoralis" | "axillary_lymph" | "biceps_elbow" | "scapular";

interface JointHotspot {
  id: JointHotspotId;
  topPercent: number; // Y position in %
  leftPercent: number; // X position in %
  name_ar: string;
  name_en: string;
  muscle_ar: string;
  muscle_en: string;
  action_ar: string;
  action_en: string;
  safeLimit_ar: string;
  safeLimit_en: string;
  sensation_ar: string;
  sensation_en: string;
  color: "amber" | "fuchsia" | "emerald" | "purple" | "cyan";
  relevantCategories: string[];
}

const JOINT_HOTSPOTS: JointHotspot[] = [
  {
    id: "rotator_cuff",
    topPercent: 23.5,
    leftPercent: 40.5,
    name_ar: "مفصل الكتف والكفة المدورة",
    name_en: "Rotator Cuff & Shoulder Joint",
    muscle_ar: "عضلات الكفة المدورة والدالية (Supraspinatus, Infraspinatus, Deltoid)",
    muscle_en: "Rotator cuff complex & deltoid fibers",
    action_ar: "استعادة حركة رفع وتدوير الذراع للأعلى وللجانب بلطف دون تحميل أوزان.",
    action_en: "Gently restore elevation and rotation mobility without external loads.",
    safeLimit_ar: "المدى الآمن: حتى 85 درجة ارتفاع (دون الوصول إلى نقطة الألم).",
    safeLimit_en: "Safe range: up to 85° elevation (strictly pain-free).",
    sensation_ar: "شعور بتمدد لطيف ومريح في الكتف دون أي وخز أو شد قسري.",
    sensation_en: "Mild, comfortable stretch without pinching or sharp pull.",
    color: "amber",
    relevantCategories: ["arm_elevation", "shoulder_mobility", "shoulder_rotation"],
  },
  {
    id: "pectoralis",
    topPercent: 29.5,
    leftPercent: 49.0,
    name_ar: "عضلات الصدر والقفص الصدري",
    name_en: "Pectoral & Thoracic Musculature",
    muscle_ar: "العضلة الصدرية الكبيرة والصغيرة (Pectoralis Major & Minor)",
    muscle_en: "Pectoralis major and minor muscles",
    action_ar: "تخفيف انكماش عضلات الصدر بعد العملية وتحسين التمدد الطبيعي للقفص الصدري.",
    action_en: "Relieve post-surgical tightness and encourage thoracic expansion.",
    safeLimit_ar: "المدى الآمن: تمدد تدريجي لطيف مع الشهيق دون ضغط على الندبة الجراحية.",
    safeLimit_en: "Safe range: gentle expansion synchronized with deep breathing.",
    sensation_ar: "انفتاح لطيف في الصدر وتحسن في استقامة الظهر.",
    sensation_en: "Gentle chest opening with postural alignment.",
    color: "fuchsia",
    relevantCategories: ["chest_stretch", "breathing_relaxation"],
  },
  {
    id: "axillary_lymph",
    topPercent: 27.5,
    leftPercent: 37.0,
    name_ar: "المنطقة الإبطية والمسار اللمفاوي",
    name_en: "Axillary & Lymphatic Drainage Region",
    muscle_ar: "الأنسجة الإبطية ومسارات الأوعية اللمفاوية السطحية",
    muscle_en: "Axillary soft tissues & lymphatic drainage channels",
    action_ar: "تحفيز التصريف اللمفاوي الطبيعي وتليين الأنسجة تحت الإبط بالحركة الهادئة.",
    action_en: "Stimulate natural lymphatic circulation and relieve axillary tightness.",
    safeLimit_ar: "تجنبي الشد القوي تحت الإبط أو تجاوز 60 درجة حركة جانبية.",
    safeLimit_en: "Avoid forceful stretching; limit side abduction to 60°.",
    sensation_ar: "راحة وتخفيف للاحتقان وثقل الذراع، دون أي شعور بتنميل.",
    sensation_en: "Lightness and congestion relief without numbness or tingling.",
    color: "emerald",
    relevantCategories: ["side_movement", "breathing_relaxation"],
  },
  {
    id: "biceps_elbow",
    topPercent: 33.0,
    leftPercent: 54.0,
    name_ar: "مفصل الكوع والذراع المساندة",
    name_en: "Elbow Joint & Assisting Arm",
    muscle_ar: "العضلة ذات الرأسين العضدية ومثنيات الساعد (Biceps & Brachialis)",
    muscle_en: "Biceps brachii & forearm flexors",
    action_ar: "توفير الدعم وتثبيت الذراع المصابة أثناء أداء التمارين برفق.",
    action_en: "Provide stable, gentle cradling support for the recovering arm.",
    safeLimit_ar: "تثبيت الكوع بزاوية مريحة 90-110 درجة دون ضغط مفرط.",
    safeLimit_en: "Support at 90-110° angle without compressive grip.",
    sensation_ar: "ثبات وشعور بالأمان والتحكم التام أثناء الحركة.",
    sensation_en: "Stability, security, and controlled gentle guidance.",
    color: "purple",
    relevantCategories: ["wand_assisted_mobility", "shoulder_rotation", "arm_elevation"],
  },
  {
    id: "scapular",
    topPercent: 25.0,
    leftPercent: 47.0,
    name_ar: "لوح الكتف وعضلات أعلى الظهر",
    name_en: "Scapula & Upper Back Retractors",
    muscle_ar: "العضلات المعينية وشبه المنحرفة وثابتات القوام (Rhomboids & Trapezius)",
    muscle_en: "Rhomboids, middle trapezius & postural stabilizers",
    action_ar: "ضم لوحي الكتف للخلف لتقوية عضلات القوام وتخفيف تحدب الظهر.",
    action_en: "Draw scapulae back to strengthen posture and counter slouching.",
    safeLimit_ar: "ضم لطيف لمدة 2-3 ثوانٍ دون رفع الكتفين نحو الأذنين.",
    safeLimit_en: "Gentle 2-3s squeeze without shrugging toward ears.",
    sensation_ar: "شد عضلي خفيف ومريح بين لوحي الكتف مع استرخاء الرقبة.",
    sensation_en: "Mild contraction between shoulder blades with relaxed neck.",
    color: "cyan",
    relevantCategories: ["scapular_squeeze_retraction", "shoulder_mobility"],
  },
];

export function RehabilitationCanvas({
  exercise,
  repProgress,
  affectedSide,
  isRunning,
  phase,
  lang,
}: RehabilitationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Interactive Camera / Transform State
  const [rotateY, setRotateY] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAnatomyModal, setShowAnatomyModal] = useState(false);

  // Interaction layer state: Active highlighted joint / muscle group
  const [activeJointId, setActiveJointId] = useState<JointHotspotId>("rotator_cuff");
  const [showJointHotspots, setShowJointHotspots] = useState(true);
  const [isPinching, setIsPinching] = useState(false);
  const [pinchFeedback, setPinchFeedback] = useState<string | null>(null);

  // Auto-highlight relevant joint when the exercise changes
  useEffect(() => {
    const matched = JOINT_HOTSPOTS.find((h) => h.relevantCategories.includes(exercise.category));
    if (matched) {
      setActiveJointId(matched.id);
    } else {
      setActiveJointId("rotator_cuff");
    }
  }, [exercise.key, exercise.category]);

  // Pointer drag state for 360-degree rotation with momentum
  const dragRef = useRef<{
    startX: number;
    startY: number;
    initRotY: number;
    initRotX: number;
    lastX: number;
    lastTime: number;
    velocityX: number;
  } | null>(null);

  // Multi-touch pinch tracking ref
  const touchesRef = useRef<{
    initialDist: number;
    initialZoom: number;
  } | null>(null);

  const pinchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Continuous auto-orbit rotation loop when 360 mode is enabled
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setRotateY((r) => (r + 1.2) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [autoRotate]);

  // Handle single pointer drag (360-degree rotation)
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only handle if not a multi-touch pinch event
    if (e.pointerType === "touch" && touchesRef.current) return;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initRotY: rotateY,
      initRotX: rotateX,
      lastX: e.clientX,
      lastTime: performance.now(),
      velocityX: 0,
    };
    setAutoRotate(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || isPinching) return;

    const now = performance.now();
    const dt = Math.max(1, now - dragRef.current.lastTime);
    const deltaX = e.clientX - dragRef.current.lastX;
    dragRef.current.velocityX = deltaX / dt;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastTime = now;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    setRotateY(dragRef.current.initRotY + dx * 0.45);
    setRotateX(Math.max(-20, Math.min(20, dragRef.current.initRotX - dy * 0.22)));
  };

  const handlePointerUp = () => {
    if (dragRef.current && Math.abs(dragRef.current.velocityX) > 0.3) {
      // Apply subtle coasting inertia
      const extraRot = dragRef.current.velocityX * 18;
      setRotateY((r) => r + extraRot);
    }
    dragRef.current = null;
  };

  // ==================== MULTI-TOUCH PINCH-TO-ZOOM GESTURE ====================
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      touchesRef.current = {
        initialDist: dist,
        initialZoom: zoom,
      };
      setIsPinching(true);
      dragRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchesRef.current) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const factor = dist / Math.max(1, touchesRef.current.initialDist);
      const newZoom = Math.max(
        0.85,
        Math.min(2.0, +(touchesRef.current.initialZoom * factor).toFixed(2)),
      );
      setZoom(newZoom);

      const percent = Math.round(newZoom * 100);
      setPinchFeedback(`${percent}%`);
      if (pinchTimeoutRef.current) clearTimeout(pinchTimeoutRef.current);
      pinchTimeoutRef.current = setTimeout(() => setPinchFeedback(null), 1200);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      touchesRef.current = null;
      setIsPinching(false);
    }
  };

  // Wheel zoom with touchpad / mouse
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => {
      const next = Math.max(0.85, Math.min(2.0, +(z + delta).toFixed(2)));
      setPinchFeedback(`${Math.round(next * 100)}%`);
      if (pinchTimeoutRef.current) clearTimeout(pinchTimeoutRef.current);
      pinchTimeoutRef.current = setTimeout(() => setPinchFeedback(null), 1000);
      return next;
    });
  };

  const handleZoom = (delta: number) => {
    setZoom((z) => {
      const next = Math.max(0.85, Math.min(2.0, +(z + delta).toFixed(2)));
      setPinchFeedback(`${Math.round(next * 100)}%`);
      if (pinchTimeoutRef.current) clearTimeout(pinchTimeoutRef.current);
      pinchTimeoutRef.current = setTimeout(() => setPinchFeedback(null), 1000);
      return next;
    });
  };

  const resetCamera = () => {
    setRotateY(0);
    setRotateX(0);
    setZoom(1);
    setAutoRotate(false);
  };

  const setCameraAngle = (targetY: number, targetX = 0, newZoom = 1) => {
    setRotateY(targetY);
    setRotateX(targetX);
    setZoom(newZoom);
    setAutoRotate(false);
  };

  // Focus zoom onto active joint
  const focusOnJoint = (hotspot: JointHotspot) => {
    setActiveJointId(hotspot.id);
    setRotateY(0);
    setRotateX(-2);
    setZoom(1.4);
    setPinchFeedback(lang === "ar" ? "تركيز على المفصل 140%" : "Focused 140%");
    if (pinchTimeoutRef.current) clearTimeout(pinchTimeoutRef.current);
    pinchTimeoutRef.current = setTimeout(() => setPinchFeedback(null), 1500);
  };

  // Active highlighted joint info
  const activeJoint = useMemo(
    () => JOINT_HOTSPOTS.find((h) => h.id === activeJointId) || JOINT_HOTSPOTS[0],
    [activeJointId],
  );

  // Cadence pulsation (gentle breathing scale when exercise is active)
  const breathScale = isRunning ? 1 + Math.sin(repProgress * Math.PI * 2) * 0.018 : 1;

  // Normalized rotation in 0-359 range for UI readout
  const normalizedDeg = Math.round(((rotateY % 360) + 360) % 360);

  return (
    <div className="w-full space-y-3">
      {/* ==================== 3D MODEL CANVAS CONTAINER ==================== */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-[32px] overflow-hidden select-none border border-fuchsia-400/35 shadow-2xl transition-all duration-300 ${
          isFullscreen
            ? "fixed inset-0 z-50 rounded-none border-none bg-slate-950 flex items-center justify-center"
            : "h-[460px] sm:h-[520px]"
        }`}
        style={{
          background:
            "radial-gradient(circle at 50% 30%, oklch(0.32 0.14 315) 0%, oklch(0.14 0.08 300) 60%, oklch(0.09 0.04 290) 100%)",
        }}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ==================== 3D INTERACTION STAGE ==================== */}
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ perspective: "1200px" }}
          >
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={{
                transform: `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${zoom * breathScale})`,
                transformOrigin: "50% 55%",
                transition:
                  dragRef.current || isPinching
                    ? "none"
                    : "transform 0.4s cubic-bezier(0.2, 0.8, 0.25, 1)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* The Authentic Character & Stage from Reference Image */}
              <img
                src={stageCharacterImg}
                alt="PinkCare 3D Fitness Model"
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_20px_40px_rgba(219,39,119,0.35)]"
              />

              {/* ==================== INTERACTIVE JOINT & MUSCLE HOTSPOTS LAYER ==================== */}
              {/* (Click/tap to highlight specific joints or muscle groups relevant to the selected exercise) */}
              {showJointHotspots &&
                JOINT_HOTSPOTS.map((hotspot) => {
                  const isActive = hotspot.id === activeJointId;
                  const isRelevantToExercise = hotspot.relevantCategories.includes(
                    exercise.category,
                  );

                  return (
                    <button
                      key={hotspot.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveJointId(hotspot.id);
                      }}
                      className={`absolute z-30 transition-transform cursor-pointer focus:outline-none -translate-x-1/2 -translate-y-1/2 group ${
                        isActive ? "scale-125 z-40" : "hover:scale-115"
                      }`}
                      style={{
                        top: `${hotspot.topPercent}%`,
                        left: `${hotspot.leftPercent}%`,
                      }}
                      title={lang === "ar" ? hotspot.name_ar : hotspot.name_en}
                      aria-label={lang === "ar" ? hotspot.name_ar : hotspot.name_en}
                    >
                      <div className="relative flex items-center justify-center">
                        {/* Active pulsating ripple waves */}
                        {isActive && (
                          <>
                            <span
                              className={`absolute w-12 h-12 rounded-full animate-ping opacity-60 ${
                                hotspot.color === "amber"
                                  ? "bg-amber-400"
                                  : hotspot.color === "fuchsia"
                                    ? "bg-fuchsia-400"
                                    : hotspot.color === "emerald"
                                      ? "bg-emerald-400"
                                      : hotspot.color === "purple"
                                        ? "bg-purple-400"
                                        : "bg-cyan-400"
                              }`}
                            />
                            <span
                              className={`absolute w-8 h-8 rounded-full animate-ping opacity-75 ${
                                hotspot.color === "amber"
                                  ? "bg-amber-300"
                                  : hotspot.color === "fuchsia"
                                    ? "bg-pink-400"
                                    : hotspot.color === "emerald"
                                      ? "bg-teal-300"
                                      : hotspot.color === "purple"
                                        ? "bg-violet-300"
                                        : "bg-sky-300"
                              }`}
                              style={{ animationDelay: "0.35s" }}
                            />
                          </>
                        )}

                        {/* Center Beacon Orb */}
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all border ${
                            isActive
                              ? "bg-gradient-to-tr from-amber-400 to-yellow-200 border-white shadow-[0_0_18px_rgba(251,191,36,0.95)] ring-2 ring-amber-300/60"
                              : isRelevantToExercise
                                ? "bg-fuchsia-500/80 border-fuchsia-200/90 shadow-[0_0_12px_rgba(236,72,153,0.8)] animate-pulse"
                                : "bg-slate-900/80 border-fuchsia-300/40 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isActive
                                ? "bg-amber-900"
                                : isRelevantToExercise
                                  ? "bg-white"
                                  : "bg-fuchsia-300"
                            }`}
                          />
                        </span>

                        {/* Small Label Pin on Hover/Active */}
                        {isActive && (
                          <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-slate-900/95 border border-amber-400/60 text-[9px] font-bold text-amber-200 shadow-xl pointer-events-none animate-fadeIn flex items-center gap-1">
                            <Target className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                            <span>{lang === "ar" ? hotspot.name_ar : hotspot.name_en}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}

              {/* Live Radiant Floating Waist Halo Overlay */}
              <div
                className={`absolute pointer-events-none w-[280px] h-[75px] rounded-full border-2 border-fuchsia-300/80 shadow-[0_0_30px_rgba(236,72,153,0.7)] transition-transform duration-700 ${
                  isRunning ? "animate-pulse" : ""
                }`}
                style={{
                  top: "40.5%",
                  left: "50%",
                  transform:
                    "translate(-50%, -50%) perspective(400px) rotateX(68deg) rotateZ(-6deg)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Atmospheric lighting gradients */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-fuchsia-950/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none" />

        {/* ==================== PINCH / ZOOM FEEDBACK BADGE ==================== */}
        {pinchFeedback && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none animate-fadeIn">
            <div className="px-4 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-pink-400/50 text-white font-mono font-bold text-sm shadow-[0_0_24px_rgba(236,72,153,0.6)] flex items-center gap-2">
              <ZoomIn className="w-4 h-4 text-pink-400" />
              <span>{pinchFeedback}</span>
            </div>
          </div>
        )}

        {/* ==================== FLOATING JOINT INSPECTION SPOTLIGHT PILL ==================== */}
        {/* (Shows details of the currently selected joint / muscle group when clicked) */}
        {activeJoint && (
          <div className="absolute bottom-2.5 inset-x-3 sm:inset-x-6 z-20">
            <div className="rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-fuchsia-400/35 p-2.5 sm:p-3 shadow-2xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                    activeJoint.color === "amber"
                      ? "bg-amber-500/20 text-amber-300 border-amber-400/40"
                      : activeJoint.color === "fuchsia"
                        ? "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40"
                        : activeJoint.color === "emerald"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                          : "bg-purple-500/20 text-purple-300 border-purple-400/40"
                  }`}
                >
                  <Target className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-white truncate">
                      {lang === "ar" ? activeJoint.name_ar : activeJoint.name_en}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-md bg-fuchsia-500/20 text-fuchsia-200 text-[9px] font-medium shrink-0">
                      {lang === "ar" ? "نقطة مستهدفة" : "Target"}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-fuchsia-200/80 truncate">
                    {lang === "ar" ? activeJoint.action_ar : activeJoint.action_en}
                  </p>
                </div>
              </div>

              {/* Quick Actions for Active Joint */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => focusOnJoint(activeJoint)}
                  className="px-2.5 py-1 rounded-xl bg-pink-500/25 hover:bg-pink-500/35 border border-pink-400/40 text-[10px] font-semibold text-pink-200 hover:text-white transition-all flex items-center gap-1"
                  title={lang === "ar" ? "تكبير وتركيز الكاميرا" : "Focus on joint"}
                >
                  <Eye className="w-3 h-3" />
                  <span className="hidden sm:inline">{lang === "ar" ? "تركيز" : "Focus"}</span>
                </button>

                <button
                  onClick={() => setShowAnatomyModal(true)}
                  className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 text-fuchsia-200 hover:text-white flex items-center justify-center transition-all"
                  title={lang === "ar" ? "تفاصيل إضافية" : "More details"}
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== CLEAN FLEX-BASED CONTROL BAR (POSITIONED STRICTLY BELOW CANVAS) ==================== */}
      <div className="rounded-2xl p-2.5 bg-slate-900/85 backdrop-blur-xl border border-fuchsia-400/30 shadow-lg space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* 360° Rotate */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setAutoRotate((a) => !a);
            }}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all backdrop-blur-md border ${
              autoRotate
                ? "bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white shadow-lg shadow-fuchsia-500/50 border-pink-300"
                : "bg-white/5 text-fuchsia-100 hover:text-white border-fuchsia-400/30 hover:bg-white/10"
            }`}
            title={lang === "ar" ? "إدارة النموذج 360°" : "360° Rotation"}
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin text-white" : "text-pink-400"}`}
            />
            <span>360°</span>
            <span className="text-[10px] font-normal opacity-90 hidden sm:inline">
              {lang === "ar" ? "تدوير تلقائي" : "Auto-rotate"}
            </span>
          </button>

          {/* Zoom Controls (- / % / +) */}
          <div className="flex items-center gap-1 bg-slate-950/70 p-0.5 rounded-xl border border-fuchsia-400/30">
            <button
              type="button"
              disabled={zoom <= 0.75}
              onClick={(e) => {
                e.stopPropagation();
                handleZoom(-0.2);
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-fuchsia-100 hover:text-white hover:bg-pink-500/20 disabled:opacity-40 transition"
              title={lang === "ar" ? "تصغير (-)" : "Zoom out (-)"}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <span className="text-[10px] font-bold text-fuchsia-200 px-1.5 min-w-[38px] text-center tabular-nums">
              {Math.round(zoom * 100)}%
            </span>

            <button
              type="button"
              disabled={zoom >= 2.0}
              onClick={(e) => {
                e.stopPropagation();
                handleZoom(0.2);
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-fuchsia-100 hover:text-white hover:bg-pink-500/20 disabled:opacity-40 transition"
              title={lang === "ar" ? "تكبير (+)" : "Zoom in (+)"}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset Camera Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetCamera();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-fuchsia-100 hover:text-white flex items-center gap-1.5 text-xs font-semibold border border-fuchsia-400/30 transition backdrop-blur-md"
            title={lang === "ar" ? "إعادة ضبط الكاميرا" : "Reset view"}
          >
            <RotateCw className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-[11px]">{lang === "ar" ? "إعادة ضبط" : "Reset"}</span>
          </button>
        </div>

        {/* Bottom Row: Angle presets, Fullscreen & Target Area */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-fuchsia-400/20 text-xs">
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-950/60 border border-fuchsia-400/25 text-[10px]">
            <button
              type="button"
              onClick={() => setCameraAngle(0, 0, 1)}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                rotateY === 0
                  ? "bg-fuchsia-500 text-white font-bold"
                  : "text-fuchsia-200 hover:text-white"
              }`}
            >
              {lang === "ar" ? "أمامي" : "Front"}
            </button>
            <button
              type="button"
              onClick={() => setCameraAngle(45, -2, 1)}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                rotateY === 45
                  ? "bg-fuchsia-500 text-white font-bold"
                  : "text-fuchsia-200 hover:text-white"
              }`}
            >
              45°
            </button>
            <button
              type="button"
              onClick={() => setCameraAngle(90, 0, 1)}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                rotateY === 90
                  ? "bg-fuchsia-500 text-white font-bold"
                  : "text-fuchsia-200 hover:text-white"
              }`}
            >
              {lang === "ar" ? "جانبي" : "Side"}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Toggle Joint Hotspots */}
            <button
              type="button"
              onClick={() => setShowJointHotspots((s) => !s)}
              className={`px-2 py-1 rounded-xl text-[10px] font-medium flex items-center gap-1 border transition-all ${
                showJointHotspots
                  ? "bg-fuchsia-500/25 text-pink-300 border-fuchsia-400/40"
                  : "bg-white/5 text-fuchsia-300/60 border-fuchsia-400/20 hover:text-white"
              }`}
              title={lang === "ar" ? "إظهار/إخفاء نقاط المفاصل" : "Toggle Joint Hotspots"}
            >
              <Layers className="w-3 h-3" />
              <span>{lang === "ar" ? "المفاصل" : "Joints"}</span>
            </button>

            {/* Target Area Modal Trigger */}
            <button
              type="button"
              onClick={() => setShowAnatomyModal(true)}
              className="px-2 py-1 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-fuchsia-400/30 text-[10px] font-bold text-white flex items-center gap-1 transition"
              title={lang === "ar" ? "عرض الخريطة التشريحية" : "View anatomical target"}
            >
              <Crosshair className="w-3 h-3 text-pink-400" />
              <span>{lang === "ar" ? "منطقة التمرين" : "Target"}</span>
            </button>

            {/* Fullscreen toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen((f) => !f)}
              className="w-7 h-7 rounded-xl bg-white/5 hover:bg-white/15 border border-fuchsia-400/25 text-fuchsia-200 hover:text-white flex items-center justify-center transition-all"
              title={lang === "ar" ? "شاشة كاملة" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ==================== ANATOMICAL TARGET MODAL ==================== */}
      {showAnatomyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-[28px] bg-slate-900 border border-fuchsia-400/40 p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-fuchsia-400/20 pb-2">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Crosshair className="w-4 h-4 text-pink-400" />
                <span>
                  {lang === "ar" ? "المنطقة التشريحية المستهدفة" : "Target Anatomical Region"}
                </span>
              </div>
              <button
                onClick={() => setShowAnatomyModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-fuchsia-500/30">
              <img
                src={shoulderAnatomyImg}
                alt="Target Anatomy"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Detailed anatomical information */}
            <div className="text-xs text-fuchsia-100/90 leading-relaxed space-y-1.5">
              <div className="font-bold text-white flex items-center justify-between">
                <span>{lang === "ar" ? activeJoint.name_ar : activeJoint.name_en}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-200">
                  {lang === "ar" ? exercise.targetArea_ar : exercise.targetArea_en}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-950/60 border border-fuchsia-500/20 space-y-1 text-[11px]">
                <p>
                  <span className="font-bold text-pink-300">
                    {lang === "ar" ? "العضلات المعنية: " : "Muscles: "}
                  </span>
                  {lang === "ar" ? activeJoint.muscle_ar : activeJoint.muscle_en}
                </p>
                <p>
                  <span className="font-bold text-amber-300">
                    {lang === "ar" ? "المدى الآمن: " : "Safe Range: "}
                  </span>
                  {lang === "ar" ? activeJoint.safeLimit_ar : activeJoint.safeLimit_en}
                </p>
                <p>
                  <span className="font-bold text-emerald-300">
                    {lang === "ar" ? "الإحساس المطلوب: " : "Sensation: "}
                  </span>
                  {lang === "ar" ? activeJoint.sensation_ar : activeJoint.sensation_en}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAnatomyModal(false)}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold text-xs"
            >
              {lang === "ar" ? "إغلاق" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
