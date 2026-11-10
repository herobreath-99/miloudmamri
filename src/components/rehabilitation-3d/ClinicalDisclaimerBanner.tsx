import { useState } from "react";
import {
  AlertTriangle,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp,
  FileCheck2,
} from "lucide-react";

interface ClinicalDisclaimerBannerProps {
  exerciseKey: string;
  isDoctorApproved: boolean;
  onToggleDoctorApproval: (approved: boolean) => void;
  lang: "ar" | "en";
}

export function ClinicalDisclaimerBanner({
  isDoctorApproved,
  onToggleDoctorApproval,
  lang,
}: ClinicalDisclaimerBannerProps) {
  const [showFullDisclaimer, setShowFullDisclaimer] = useState(false);

  return (
    <div className="space-y-2">
      {/* Primary High-Priority Safety Warning Banner */}
      <div className="glass-dark rounded-2xl p-3 border border-amber-500/35 bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-rose-950/20 shadow-lg">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-amber-300" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-amber-200">
                {lang === "ar"
                  ? "إرشادات الأمان السريري الهامة"
                  : "Important Clinical Safety Guidelines"}
              </span>
              <button
                onClick={() => setShowFullDisclaimer((s) => !s)}
                className="text-[10px] text-amber-300/80 hover:text-amber-100 flex items-center gap-0.5"
              >
                <span>
                  {showFullDisclaimer
                    ? lang === "ar"
                      ? "إخفاء"
                      : "Less"
                    : lang === "ar"
                      ? "المزيد"
                      : "More"}
                </span>
                {showFullDisclaimer ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            </div>

            <p className="text-[11px] text-amber-100/90 leading-snug mt-1">
              {lang === "ar"
                ? "توقفي فوراً عن أداء التمرين في حال حدوث أي ألم، تورم جديد، دوخة، أو انزعاج غير معتاد."
                : "Stop immediately if you experience pain, new swelling, dizziness, or unusual discomfort."}
            </p>

            <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-rose-300/90 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              <span>
                {lang === "ar"
                  ? "تنبيه طبي صارم: تمارين التأهيل لا تقي من الوذمة اللمفاوية (Lymphedema) ولا تعالجها."
                  : "Clinical Rule: Rehabilitation exercises do not prevent or cure lymphedema."}
              </span>
            </div>

            {/* Expandable full medical disclaimer */}
            {showFullDisclaimer && (
              <div className="mt-2 pt-2 border-t border-amber-500/20 text-[10px] text-amber-200/80 space-y-1">
                <p>
                  {lang === "ar"
                    ? "• هذه التمارين استرشادية تعليمية ولا يتم وصفها تلقائياً بناءً على مرحلة المرض وحدها."
                    : "• These exercises are educational guidance only and are never automatically prescribed based solely on diagnosis or stage."}
                </p>
                <p>
                  {lang === "ar"
                    ? "• يجب استشارة طبيب الأورام أو أخصائي العلاج الطبيعي المعتمد للتأكد من ملاءمة التمارين لحالتك الجراحية والتئام الأنسجة."
                    : "• Always verify clearance from your oncologist or licensed physical therapist before beginning any post-surgical rehabilitation."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Healthcare Professional Approval Toggle Card */}
      <div className="glass-dark rounded-2xl p-2.5 px-3.5 border border-fuchsia-500/25 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center ${
              isDoctorApproved
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-slate-800 text-fuchsia-300/60 border border-fuchsia-500/20"
            }`}
          >
            {isDoctorApproved ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <FileCheck2 className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-white">
                {lang === "ar" ? "اعتماد الفريق الطبي" : "Healthcare Team Clearance"}
              </span>
              {isDoctorApproved && (
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                  {lang === "ar" ? "معتمد" : "Approved"}
                </span>
              )}
            </div>
            <p className="text-[10px] text-fuchsia-200/70">
              {lang === "ar"
                ? "تأكدي من حصولك على موافقة طبيبك المعالج لهذا التمرين"
                : "Confirm you received your doctor's clearance for this exercise"}
            </p>
          </div>
        </div>

        <button
          onClick={() => onToggleDoctorApproval(!isDoctorApproved)}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
            isDoctorApproved
              ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40"
              : "bg-white/10 hover:bg-white/20 text-fuchsia-200 border border-fuchsia-400/30"
          }`}
        >
          {isDoctorApproved ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{lang === "ar" ? "معتمد من طبيبي" : "Doctor Approved"}</span>
            </>
          ) : (
            <span>{lang === "ar" ? "تحديد كمعتمد" : "Mark Approved"}</span>
          )}
        </button>
      </div>
    </div>
  );
}
