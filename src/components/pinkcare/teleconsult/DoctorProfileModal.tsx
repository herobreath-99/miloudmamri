import {
  X,
  BadgeCheck,
  Building2,
  Award,
  Globe,
  Star,
  FileCheck2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import type { DoctorProfile } from "@/types/teleconsult";

type DoctorProfileModalProps = {
  doctor: DoctorProfile;
  onClose: () => void;
  onBook: (doctor: DoctorProfile) => void;
  lang?: "ar" | "en";
};

export function DoctorProfileModal({
  doctor,
  onClose,
  onBook,
  lang = "ar",
}: DoctorProfileModalProps) {
  const isVerified = doctor.verificationStatus === "verified";

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border rounded-3xl p-5 max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl my-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Award className="w-4 h-4" />
            <span>{lang === "ar" ? "الملف المهني المعتمد" : "Verified Professional Profile"}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Doctor Header Banner */}
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-20 rounded-3xl overflow-hidden border-2 border-primary/40 shadow-md shrink-0">
              <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover" />
              {isVerified && (
                <div className="absolute bottom-1 end-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <BadgeCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-foreground">{doctor.name}</h3>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    {lang === "ar" ? "اعتماد طبي موثق" : "Verified License"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {lang === "ar" ? "قيد المراجعة الإدارية" : "Under Review"}
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-primary">{doctor.title}</p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-0.5">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="truncate">{doctor.hospital}</span>
              </div>

              <div className="flex items-center gap-3 pt-1 text-xs">
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span className="num-en">{doctor.rating || "5.0"}</span>
                  <span className="text-muted-foreground font-normal text-[11px]">
                    ({doctor.reviewsCount || 0} تقييم)
                  </span>
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {doctor.experienceYears} {lang === "ar" ? "سنوات خبرة" : "yrs exp"}
                </span>
              </div>
            </div>
          </div>

          {/* Official License & Accreditation Box */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-primary font-bold">
              <FileCheck2 className="w-4 h-4" />
              <span>
                {lang === "ar"
                  ? "بيانات الترخيص والاعتماد المهني"
                  : "Licensing & Council Accreditation"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-muted-foreground block">
                  {lang === "ar" ? "رقم رخصة الممارسة:" : "License Number:"}
                </span>
                <span className="font-mono font-bold text-foreground">{doctor.licenseNumber}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">
                  {lang === "ar" ? "الهيئة أو العمادة المشرفة:" : "Medical Council:"}
                </span>
                <span className="font-medium text-foreground">
                  {doctor.medicalCouncil || "المجلس الطبي المعتمد"}
                </span>
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-foreground">
              {lang === "ar" ? "نبذة تعريفية وخبرات تخصصية:" : "Biography & Specialty Focus:"}
            </h4>
            <p className="text-xs text-foreground/80 leading-relaxed bg-muted/20 p-3 rounded-2xl border border-border/40">
              {lang === "ar" ? doctor.bioAr || doctor.bio : doctor.bio}
            </p>
          </div>

          {/* Languages & Working days */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
              <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                <Globe className="w-3 h-3 text-primary" />
                {lang === "ar" ? "اللغات المتاحة:" : "Languages:"}
              </span>
              <p className="text-xs font-bold text-foreground">{doctor.languages.join(" • ")}</p>
            </div>

            <div className="p-3 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
              <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-primary" />
                {lang === "ar" ? "أيام الاستشارات:" : "Available Days:"}
              </span>
              <p className="text-xs font-bold text-foreground">
                {doctor.availableDays?.join("، ") || "الأحد - الخميس"}
              </p>
            </div>
          </div>

          {/* Fee & Coverage Badge */}
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-primary font-bold">
                {lang === "ar" ? "تكلفة الاستشارة عن بُعد:" : "Consultation Fee:"}
              </p>
              <p className="text-xs font-bold text-foreground mt-0.5">{doctor.consultationFee}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary text-primary-foreground shadow-xs">
              {lang === "ar" ? "رعاية تضامنية" : "Sponsored"}
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:bg-muted"
          >
            {lang === "ar" ? "إغلاق" : "Close"}
          </button>
          {isVerified ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onBook(doctor);
              }}
              className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 shadow-md hover:opacity-90 transition active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>{lang === "ar" ? "حجز استشارة مع الطبيبة" : "Book Consultation"}</span>
            </button>
          ) : (
            <div className="text-xs text-amber-600 font-medium px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              {lang === "ar"
                ? "الحجز غير متاح حتى اكتمال التحقق الإداري من الرخصة"
                : "Booking disabled pending license verification"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
