import { useState } from "react";
import {
  X,
  Stethoscope,
  FileCheck2,
  Building2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import type { SpecialtyCategory } from "@/types/teleconsult";
import { registerDoctorApplication } from "@/lib/teleconsultStorage";

type DoctorVerificationModalProps = {
  onClose: () => void;
  onSubmitted: () => void;
  lang?: "ar" | "en";
};

const SPECIALTIES: { id: SpecialtyCategory; labelAr: string; labelEn: string }[] = [
  { id: "oncology", labelAr: "طب وجراحة الأورام", labelEn: "Oncology" },
  { id: "psychology", labelAr: "الدعم النفسي للأورام", labelEn: "Psycho-oncology" },
  { id: "physiotherapy", labelAr: "العلاج الطبيعي والتأهيل الحركي", labelEn: "Physiotherapy" },
  { id: "nutrition", labelAr: "التغذية العلاجية للأورام", labelEn: "Clinical Nutrition" },
  { id: "nursing", labelAr: "التمريض التخصصي ورعاية المرضى", labelEn: "Oncology Nursing" },
];

export function DoctorVerificationModal({
  onClose,
  onSubmitted,
  lang = "ar",
}: DoctorVerificationModalProps) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [specialty, setSpecialty] = useState<SpecialtyCategory>("oncology");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [hospital, setHospital] = useState("");
  const [experienceYears, setExperienceYears] = useState(5);
  const [medicalCouncil, setMedicalCouncil] = useState("");
  const [bio, setBio] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !licenseNumber.trim() || !hospital.trim() || !medicalCouncil.trim()) {
      toast.error(
        lang === "ar"
          ? "يرجى ملء جميع الحقول المطلوبة وبيانات الترخيص الطبي بدقة"
          : "Please complete all mandatory license details",
      );
      return;
    }

    setSubmitting(true);
    registerDoctorApplication({
      name,
      title: title.trim() || "طبيبة أخصائية معتمدة",
      specialty,
      licenseNumber,
      hospital,
      experienceYears: Number(experienceYears) || 3,
      bio:
        bio.trim() ||
        "أخصائية معتمدة تسعى لتقديم الرعاية الطبية والدعم التضامني لمريضات ومحاربات السرطان.",
      languages: ["العربية", "Français"],
      medicalCouncil,
      documentName: documentName || "certificat_ordre_national_medecins.pdf",
    });

    toast.success(
      lang === "ar"
        ? "تم إرسال ملف الاعتماد للجنة الطبية الإدارية بنجاح! سيتم فحص الرخصة قبل تفعيل الحجوزات العامة."
        : "Credentials submitted for administrative verification! Booking will activate upon approval.",
    );
    setSubmitting(false);
    onSubmitted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border rounded-3xl p-5 max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">
                {lang === "ar"
                  ? "طلب اعتماد مهني وتقديم استشارات طبية"
                  : "Healthcare Professional Verification"}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {lang === "ar"
                  ? "انضمي لشبكة الأخصائيين المعتمدين في PinkCare"
                  : "Join the verified network of PinkCare medical specialists"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5 shrink-0 my-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <p className="leading-relaxed text-[11px]">
            {lang === "ar"
              ? "ضماناً لسلامة المستفيدات، لا تظهر الشارة الزرقاء المعتمدة ولا تُتاح حجوزات المرضى إلا بعد مراجعة الترخيص الطبي والتأكد من القيد في سجلات عمادة الأطباء الوطنية."
              : "For patient safety, the Verified badge and booking slots remain inactive until administrative review of medical license and council accreditation."}
          </p>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto py-2 space-y-3.5 pr-1 text-xs"
        >
          {/* Name & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground">
                {lang === "ar" ? "الاسم الكامل واللقب الطبي:" : "Full Name & Credentials:"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="د. لمياء بودربالة"
                required
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-hidden focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">
                {lang === "ar" ? "المسمى المهني التخصصي:" : "Professional Title:"}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="استشارية أورام الثدي"
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-hidden focus:border-primary"
              />
            </div>
          </div>

          {/* Specialty */}
          <div className="space-y-1">
            <label className="font-bold text-foreground">
              {lang === "ar" ? "التخصص الطبي أو العلاجي:" : "Medical Specialty:"}
            </label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value as SpecialtyCategory)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-hidden focus:border-primary"
            >
              {SPECIALTIES.map((s) => (
                <option key={s.id} value={s.id}>
                  {lang === "ar" ? s.labelAr : s.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* License Number & Medical Council */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground flex items-center gap-1">
                <FileCheck2 className="w-3.5 h-3.5 text-primary" />
                <span>{lang === "ar" ? "رقم رخصة الممارسة الطبية:" : "License Number:"}</span>
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="DZ-MED-92041"
                required
                className="w-full bg-background border border-border rounded-xl px-3 py-2 font-mono text-foreground focus:outline-hidden focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">
                {lang === "ar" ? "الهيئة أو العمادة المرخصة:" : "Licensing Council:"}
              </label>
              <input
                type="text"
                value={medicalCouncil}
                onChange={(e) => setMedicalCouncil(e.target.value)}
                placeholder="المجلس الوطني لأخلاقيات الطب"
                required
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-hidden focus:border-primary"
              />
            </div>
          </div>

          {/* Hospital & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                <span>
                  {lang === "ar" ? "المستشفى أو المركز الطبي التابع له:" : "Hospital / Clinic:"}
                </span>
              </label>
              <input
                type="text"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                placeholder="المركز الاستشفائي الجامعي"
                required
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-hidden focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">
                {lang === "ar" ? "سنوات الخبرة السريرية:" : "Years of Experience:"}
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 font-mono text-foreground focus:outline-hidden focus:border-primary"
              />
            </div>
          </div>

          {/* Verification Document attachment name */}
          <div className="space-y-1">
            <label className="font-bold text-foreground">
              {lang === "ar"
                ? "اسم وثيقة الترخيص أو الشهادة المرفقة:"
                : "Uploaded Document File Name:"}
            </label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="ordre_medecins_attestation_2025.pdf"
              className="w-full bg-background border border-border rounded-xl px-3 py-2 font-mono text-foreground focus:outline-hidden focus:border-primary"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="font-bold text-foreground">
              {lang === "ar" ? "نبذة تعريفية للمستفيدات:" : "Bio & Specialty Experience:"}
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="أخصائية في متابعة مريضات الأورام وبروتوكولات التعافي..."
              className="w-full bg-background border border-border rounded-xl p-3 text-foreground leading-relaxed focus:outline-hidden focus:border-primary"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-muted-foreground hover:bg-muted"
            >
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === "ar" ? "إرسال ملف الترخيص للاعتماد" : "Submit Credentials"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
