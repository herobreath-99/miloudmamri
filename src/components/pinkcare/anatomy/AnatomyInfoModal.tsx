import { useState } from "react";
import {
  X,
  Target,
  Sparkles,
  AlertTriangle,
  HeartHandshake,
  Dumbbell,
  BookOpen,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ExternalLink,
  Activity,
  Layers,
  Info,
} from "lucide-react";
import { type AnatomyRegion } from "@/data/anatomyData";
import { EXERCISES, type Exercise } from "@/data/exercises";

interface AnatomyInfoModalProps {
  region: AnatomyRegion | null;
  onClose: () => void;
  lang: "ar" | "dz" | "fr" | "en";
  onSelectExercise: (exerciseKey: string) => void;
}

type TabKey = "anatomy" | "issues" | "symptoms" | "benefits" | "exercises" | "warnings";

export function AnatomyInfoModal({
  region,
  onClose,
  lang,
  onSelectExercise,
}: AnatomyInfoModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("anatomy");

  if (!region) return null;

  const isRtl = lang === "ar" || lang === "dz";

  const getRegionName = () => {
    if (lang === "fr") return region.name_fr;
    if (lang === "dz") return region.name_dz;
    if (lang === "en") return region.name_en;
    return region.name_ar;
  };

  const getDefinition = () => {
    if (lang === "fr") return region.definition_fr;
    if (lang === "en") return region.definition_en;
    return region.definition_ar;
  };

  const getConnectedStructures = () => {
    if (lang === "fr") return region.connectedStructures_fr;
    if (lang === "en") return region.connectedStructures_en;
    return region.connectedStructures_ar;
  };

  const getMotorFunctions = () => {
    if (lang === "fr") return region.motorFunctions_fr;
    if (lang === "en") return region.motorFunctions_en;
    return region.motorFunctions_ar;
  };

  const getClinicalIssues = () => {
    if (lang === "fr") return region.clinicalIssues_fr;
    if (lang === "en") return region.clinicalIssues_en;
    return region.clinicalIssues_ar;
  };

  const getSymptoms = () => {
    if (lang === "fr") return region.symptoms_fr;
    if (lang === "en") return region.symptoms_en;
    return region.symptoms_ar;
  };

  const getRomFactors = () => {
    if (lang === "fr") return region.romFactors_fr;
    if (lang === "en") return region.romFactors_en;
    return region.romFactors_ar;
  };

  const getExerciseBenefits = () => {
    if (lang === "fr") return region.exerciseBenefits_fr;
    if (lang === "en") return region.exerciseBenefits_en;
    return region.exerciseBenefits_ar;
  };

  const getCareTips = () => {
    if (lang === "fr") return region.careTips_fr;
    if (lang === "en") return region.careTips_en;
    return region.careTips_ar;
  };

  const getDoctorAlerts = () => {
    if (lang === "fr") return region.doctorAlerts_fr;
    if (lang === "en") return region.doctorAlerts_en;
    return region.doctorAlerts_ar;
  };

  // Matched exercise objects
  const relatedExercises: Exercise[] = region.recommendedExerciseKeys
    .map((k) => EXERCISES.find((e) => e.key === k))
    .filter((e): e is Exercise => Boolean(e));

  const tabs: {
    id: TabKey;
    labelAr: string;
    labelFr: string;
    labelEn: string;
    icon: typeof Activity;
  }[] = [
    { id: "anatomy", labelAr: "التشريح", labelFr: "Anatomie", labelEn: "Anatomy", icon: Layers },
    {
      id: "issues",
      labelAr: "المشكلات المحتملة",
      labelFr: "Problèmes",
      labelEn: "Issues",
      icon: AlertTriangle,
    },
    {
      id: "symptoms",
      labelAr: "الأعراض",
      labelFr: "Symptômes",
      labelEn: "Symptoms",
      icon: Activity,
    },
    {
      id: "benefits",
      labelAr: "فوائد التمارين",
      labelFr: "Bénéfices",
      labelEn: "Benefits",
      icon: HeartHandshake,
    },
    {
      id: "exercises",
      labelAr: "التمارين",
      labelFr: "Exercices",
      labelEn: "Exercises",
      icon: Dumbbell,
    },
    {
      id: "warnings",
      labelAr: "التحذيرات والرعاية",
      labelFr: "Précautions",
      labelEn: "Warnings",
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-lg bg-slate-950/95 border border-fuchsia-500/40 rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-start"
        style={{
          boxShadow:
            "0 0 50px -10px oklch(0.65 0.3 320 / 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
        }}
      >
        {/* Header Bar */}
        <div className="p-4 pb-3 border-b border-fuchsia-400/25 bg-gradient-to-r from-purple-950/80 via-fuchsia-950/70 to-purple-950/80 relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-fuchsia-950/70">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white tracking-wide">{getRegionName()}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/30 text-pink-200 border border-pink-400/30 font-semibold">
                  {region.category === "arm"
                    ? isRtl
                      ? "منطقة الذراع"
                      : "Arm Region"
                    : region.category === "shoulder"
                      ? isRtl
                        ? "منطقة الكتف"
                        : "Shoulder Region"
                      : isRtl
                        ? "الجذع والظهر"
                        : "Core & Spine"}
                </span>
              </div>
              <p className="text-[10px] text-fuchsia-200/80 mt-0.5">
                {region.name_fr} • {region.name_en}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full glass-dark text-fuchsia-200 hover:text-white flex items-center justify-center border border-fuchsia-400/30 transition-all hover:scale-105 active:scale-95"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-2 bg-black/40 border-b border-fuchsia-500/20 no-scrollbar">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            const label = lang === "fr" ? tab.labelFr : lang === "en" ? tab.labelEn : tab.labelAr;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-md shadow-fuchsia-950/50 border border-pink-300/40"
                    : "glass-dark text-fuchsia-200/80 hover:text-white border border-fuchsia-400/15"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-sm no-scrollbar">
          {/* TAB 1: ANATOMY */}
          {activeTab === "anatomy" && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-fuchsia-400/25 space-y-1.5">
                <span className="text-[11px] font-bold text-pink-300 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  {isRtl ? "التعريف التشريحي المبسط" : "Simplified Anatomical Definition"}
                </span>
                <p className="text-xs text-white/95 leading-relaxed">{getDefinition()}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-fuchsia-200 mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-pink-400" />
                  {isRtl
                    ? "العضلات والمفاصل والأنسجة المرتبطة"
                    : "Connected Muscles, Joints & Tissues"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {getConnectedStructures().map((item, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-fuchsia-400/20 flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_6px_#ec4899] shrink-0" />
                      <span className="text-xs text-white/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-fuchsia-200 mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  {isRtl ? "الوظائف الحركية اليومية" : "Motor & Functional Roles"}
                </h4>
                <div className="space-y-1.5">
                  {getMotorFunctions().map((fn, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-400/20 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-xs text-emerald-100">{fn}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLINICAL ISSUES */}
          {activeTab === "issues" && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="p-3 rounded-2xl bg-fuchsia-950/40 border border-fuchsia-400/30 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
                <p className="text-[11px] text-fuchsia-100/90 leading-relaxed">
                  {isRtl
                    ? "معلومات متخصصة لمرحلة ما بعد جراحة أو علاج سرطان الثدي. لا تعد هذه الحالات تشخيصاً مؤكداً، بل دليلاً تثقيفياً."
                    : "Post-operative and post-treatment insights. These do not constitute a diagnosis, but serve as an educational guide."}
                </p>
              </div>

              <div className="space-y-2.5">
                {getClinicalIssues().map((issue, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-slate-900/90 border border-fuchsia-400/25 space-y-1 relative overflow-hidden"
                  >
                    {issue.isSpecificToBC && (
                      <div className="inline-block px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30 text-[9px] font-bold mb-1">
                        {isRtl
                          ? "خاص بمتعافيات ومريضات سرطان الثدي"
                          : "Breast Cancer Specific Care"}
                      </div>
                    )}
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {issue.title}
                    </h5>
                    <p className="text-xs text-fuchsia-100/80 leading-relaxed">{issue.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SYMPTOMS & ROM FACTORS */}
          {activeTab === "symptoms" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="text-xs font-bold text-fuchsia-200 mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-pink-400" />
                  {isRtl ? "الأعراض التي قد تلاحظينها" : "Symptoms You Might Observe"}
                </h4>
                <div className="space-y-2">
                  {getSymptoms().map((symp, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-purple-950/40 border border-fuchsia-400/20 flex items-start gap-2"
                    >
                      <span className="w-4 h-4 rounded-full bg-pink-500/30 text-pink-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-xs text-white/90 leading-relaxed">{symp}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-fuchsia-200 mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  {isRtl ? "عوامل قد تؤثر على مدى الحركة" : "Factors Influencing Range of Motion"}
                </h4>
                <div className="space-y-1.5">
                  {getRomFactors().map((factor, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-400/20 flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                      <p className="text-xs text-amber-100/90">{factor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXERCISE BENEFITS */}
          {activeTab === "benefits" && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-teal-950/50 border border-emerald-400/30 space-y-1">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  {isRtl ? "الفوائد الفسيولوجية والحركية" : "Physiological & Functional Benefits"}
                </span>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  {isRtl
                    ? "التمارين التأهيلية المعتمدة تساهم في تسريع الشفاء وتعزيز مرونة الأنسجة ودعم التصريف اللمفاوي الطبيعي."
                    : "Structured rehabilitation exercises accelerate recovery, tissue elasticity, and natural lymphatic flow."}
                </p>
              </div>

              <div className="space-y-2">
                {getExerciseBenefits().map((ben, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-fuchsia-400/20 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-white/95 leading-relaxed">{ben}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RECOMMENDED EXERCISES */}
          {activeTab === "exercises" && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-xs text-fuchsia-200/90">
                {isRtl
                  ? "التمارين الطبية المعتمدة الخاصة بهذه المنطقة. يمكنك اختيار أي تمرين لبدء أدائه مباشرة في الاستوديو:"
                  : "Approved exercises targeting this region. Tap any exercise to perform it in the studio:"}
              </p>

              <div className="space-y-2.5">
                {relatedExercises.map((ex) => (
                  <div
                    key={ex.key}
                    className="p-3 rounded-2xl glass-dark border border-fuchsia-400/30 flex items-center justify-between gap-3 hover:border-pink-400 transition"
                  >
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-white truncate">
                        {isRtl ? ex.name_ar : ex.name_en}
                      </h5>
                      <p className="text-[10px] text-fuchsia-200/80 truncate mt-0.5">
                        {isRtl ? ex.desc_ar : ex.desc_en}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                          {isRtl ? ex.level_ar : ex.level_en}
                        </span>
                        <span className="text-[9px] text-fuchsia-300 font-medium">
                          {ex.minutes} {isRtl ? "دقائق" : "min"} • {ex.reps}{" "}
                          {isRtl ? "تكرارات" : "reps"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectExercise(ex.key);
                        onClose();
                      }}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white text-[11px] font-bold shadow-md hover:brightness-110 active:scale-95 shrink-0 flex items-center gap-1"
                    >
                      <Dumbbell className="w-3.5 h-3.5" />
                      <span>{isRtl ? "ابدئي الآن" : "Start Now"}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PRECAUTIONS & RED FLAGS */}
          {activeTab === "warnings" && (
            <div className="space-y-4 animate-fade-in">
              {/* Care Tips */}
              <div>
                <h4 className="text-xs font-bold text-fuchsia-200 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {isRtl ? "إرشادات العناية اليومية والوقاية" : "Daily Care & Protection Tips"}
                </h4>
                <div className="space-y-1.5">
                  {getCareTips().map((tip, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-400/20 flex items-start gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                      <p className="text-xs text-emerald-100/90 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Red Flags Doctor Alerts */}
              <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/40 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <h4 className="text-xs font-bold text-rose-300">
                    {isRtl
                      ? "حالات تستدعي مراجعة الطبيب فوراً (علامات التحذير)"
                      : "Red Flags Requiring Immediate Medical Review"}
                  </h4>
                </div>
                <div className="space-y-1.5">
                  {getDoctorAlerts().map((alert, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-rose-200/90">
                      <span className="text-rose-400 font-bold shrink-0">•</span>
                      <p className="leading-relaxed">{alert}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strict Medical Disclaimer Notice */}
              <div className="p-3 rounded-xl bg-black/60 border border-fuchsia-400/20 text-[10px] text-fuchsia-200/70 leading-relaxed">
                <p className="font-bold text-fuchsia-300 mb-0.5">
                  {isRtl ? "تنبيه طبي صارم:" : "Strict Medical Notice:"}
                </p>
                <p>
                  {isRtl
                    ? "التمارين التأهيلية تهدف لتحسين المرونة واستعادة الحركة ولا تقي من الوذمة اللمفية (Lymphedema) ولا تعالجها بمفردها. يجب استشارة طبيبك المعالج أو أخصائي العلاج الطبيعي المعتمد عند ملاحظة أي تورم أو سخونة."
                    : "Rehabilitation exercises promote range of motion and tissue mobility; they do not prevent or cure lymphedema on their own. Consult your healthcare team immediately if swelling or warmth occurs."}
                </p>
              </div>

              {/* Trusted References */}
              <div>
                <h5 className="text-[11px] font-bold text-fuchsia-300 mb-1.5 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-pink-400" />
                  {isRtl ? "المصادر والمراجع العلمية المعتمدة" : "Trusted Clinical References"}
                </h5>
                <div className="space-y-1 text-[10px] text-fuchsia-200/80">
                  {region.references.map((ref, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <ExternalLink className="w-3 h-3 text-fuchsia-400 shrink-0" />
                      <span className="font-semibold text-white/90">{ref.source}:</span>
                      <span className="truncate">{ref.guideline}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-fuchsia-400/20 bg-black/50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl glass-dark text-fuchsia-100 hover:text-white text-xs font-semibold border border-fuchsia-400/30 transition text-center"
          >
            {isRtl ? "العودة إلى المجسم ثلاثي الأبعاد" : "Back to 3D Model"}
          </button>
        </div>
      </div>
    </div>
  );
}
