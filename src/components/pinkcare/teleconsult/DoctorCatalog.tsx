import { useEffect, useState } from "react";
import {
  Search,
  BadgeCheck,
  Star,
  Building2,
  Calendar,
  Stethoscope,
  Globe,
  Award,
  AlertCircle,
} from "lucide-react";
import type { DoctorProfile, SpecialtyCategory } from "@/types/teleconsult";
import { getDoctors } from "@/lib/teleconsultStorage";
import { DoctorProfileModal } from "./DoctorProfileModal";
import { BookAppointmentModal } from "./BookAppointmentModal";
import { DoctorVerificationModal } from "./DoctorVerificationModal";

import type { Lang } from "@/lib/i18n";

type DoctorCatalogProps = {
  patientId: string;
  patientName: string;
  onBookingSuccess: () => void;
  lang?: Lang;
};

const SPECIALTIES: {
  id: SpecialtyCategory | "all";
  labelAr: string;
  labelDz: string;
  labelFr: string;
  labelEn: string;
  icon: string;
}[] = [
  {
    id: "all",
    labelAr: "جميع التخصصات",
    labelDz: "كامل التخصصات",
    labelFr: "Toutes spécialités",
    labelEn: "All Specialties",
    icon: "✨",
  },
  {
    id: "oncology",
    labelAr: "طب وأورام الثدي",
    labelDz: "طب وأورام الثدي",
    labelFr: "Oncologie",
    labelEn: "Oncology",
    icon: "🩺",
  },
  {
    id: "psychology",
    labelAr: "الدعم النفسي",
    labelDz: "الدعم النفسي",
    labelFr: "Psycho-oncologie",
    labelEn: "Psychology",
    icon: "🌸",
  },
  {
    id: "physiotherapy",
    labelAr: "العلاج الطبيعي والتأهيل",
    labelDz: "العلاج الطبيعي والتأهيل",
    labelFr: "Kinésithérapie",
    labelEn: "Physiotherapy",
    icon: "🌿",
  },
  {
    id: "nutrition",
    labelAr: "التغذية العلاجية",
    labelDz: "التغذية العلاجية",
    labelFr: "Nutrition clinique",
    labelEn: "Nutrition",
    icon: "🥗",
  },
  {
    id: "nursing",
    labelAr: "التمريض والرعاية",
    labelDz: "التمريض والرعاية",
    labelFr: "Soins infirmiers",
    labelEn: "Nursing",
    icon: "💉",
  },
];

export function DoctorCatalog({
  patientId,
  patientName,
  onBookingSuccess,
  lang = "ar",
}: DoctorCatalogProps) {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedDoctorProfile, setSelectedDoctorProfile] = useState<DoctorProfile | null>(null);
  const [bookingDoctor, setBookingDoctor] = useState<DoctorProfile | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const loadDoctors = () => {
    setDoctors(getDoctors());
  };

  useEffect(() => {
    loadDoctors();
    const handleUpdate = () => loadDoctors();
    window.addEventListener("pinkcare:doctors-updated", handleUpdate);
    return () => window.removeEventListener("pinkcare:doctors-updated", handleUpdate);
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    if (selectedSpecialty !== "all" && doc.specialty !== selectedSpecialty) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inName = doc.name.toLowerCase().includes(q);
      const inHospital = doc.hospital.toLowerCase().includes(q);
      const inTitle = doc.title.toLowerCase().includes(q);
      if (!inName && !inHospital && !inTitle) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner with Doctor Registration Action */}
      <div className="glass rounded-3xl p-4.5 border border-primary/20 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-primary font-bold text-xs">
            <Award className="w-4 h-4" />
            <span>
              {lang === "ar"
                ? "فريق طبي متعدد التخصصات ومعتمد رسمياً"
                : "Multidisciplinary Verified Medical Team"}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {lang === "ar"
              ? "استشارات مرئية وصوتية آمنة مع استشاريات في طب الأورام، الدعم النفسي، والعلاج الطبيعي."
              : "Encrypted telehealth consultations with verified oncologists, psycho-oncologists, and therapists."}
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="self-start sm:self-auto px-3.5 py-2 rounded-2xl bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-semibold flex items-center gap-1.5 shrink-0 transition"
        >
          <Stethoscope className="w-4 h-4 text-primary" />
          <span>{lang === "ar" ? "تقديم طلب اعتماد طبيب" : "Apply as Specialist"}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            lang === "ar"
              ? "ابحثي باسم الطبيبة أو المستشفى أو التخصص..."
              : "Search doctor name, hospital, or specialty..."
          }
          className="w-full bg-card border border-border rounded-2xl ps-9 pe-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary shadow-xs"
        />
      </div>

      {/* Specialty Filter Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {SPECIALTIES.map((spec) => (
          <button
            key={spec.id}
            onClick={() => setSelectedSpecialty(spec.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition ${
              selectedSpecialty === spec.id
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "bg-card/70 hover:bg-muted border border-border/60 text-muted-foreground"
            }`}
          >
            <span>
              {lang === "dz"
                ? spec.labelDz
                : lang === "fr"
                  ? spec.labelFr
                  : lang === "en"
                    ? spec.labelEn
                    : spec.labelAr}
            </span>
          </button>
        ))}
      </div>

      {/* Doctors Grid */}
      <div className="space-y-3.5">
        {filteredDoctors.map((doc) => {
          const isVerified = doc.verificationStatus === "verified";
          return (
            <div
              key={doc.id}
              className="glass rounded-3xl p-4.5 border border-primary/20 space-y-3.5 hover:shadow-md transition"
            >
              <div className="flex items-start gap-3.5">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-primary/30 shrink-0">
                  <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" />
                  {isVerified && (
                    <div className="absolute bottom-0.5 end-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <BadgeCheck className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-sm text-foreground">{doc.name}</h3>
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <BadgeCheck className="w-3 h-3" />
                        <span>{lang === "ar" ? "معتمد" : "Verified"}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        <AlertCircle className="w-3 h-3" />
                        <span>{lang === "ar" ? "قيد التدقيق" : "Pending"}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-primary">{doc.title}</p>

                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Building2 className="w-3 h-3 shrink-0" />
                    <span className="truncate">{doc.hospital}</span>
                  </div>

                  <div className="flex items-center gap-3 pt-1 text-[11px]">
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span className="num-en">{doc.rating || "5.0"}</span>
                      <span className="text-muted-foreground font-normal">
                        ({doc.reviewsCount || 0})
                      </span>
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground font-medium">
                      {doc.experienceYears} {lang === "ar" ? "سنوات خبرة" : "yrs"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2">
                {lang === "ar" ? doc.bioAr || doc.bio : doc.bio}
              </p>

              {/* Languages & Slots Indicator */}
              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-primary" />
                  <span>{doc.languages.join(" • ")}</span>
                </span>
                <span className="font-semibold text-emerald-600">{doc.consultationFee}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedDoctorProfile(doc)}
                  className="flex-1 py-2 px-3 rounded-2xl border border-border hover:bg-muted text-xs font-semibold text-foreground text-center transition"
                >
                  {lang === "ar" ? "عرض الملف والترخيص" : "View Profile"}
                </button>

                {isVerified ? (
                  <button
                    type="button"
                    onClick={() => setBookingDoctor(doc)}
                    className="flex-1 py-2 px-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{lang === "ar" ? "حجز استشارة" : "Book Slot"}</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 py-2 px-3 rounded-2xl bg-muted text-muted-foreground text-xs font-medium cursor-not-allowed"
                  >
                    {lang === "ar" ? "بانتظار الاعتماد الإداري" : "Pending Verification"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Doctor Profile Modal */}
      {selectedDoctorProfile && (
        <DoctorProfileModal
          doctor={selectedDoctorProfile}
          onClose={() => setSelectedDoctorProfile(null)}
          onBook={(doc) => setBookingDoctor(doc)}
          lang={lang}
        />
      )}

      {/* Book Appointment Modal */}
      {bookingDoctor && (
        <BookAppointmentModal
          doctor={bookingDoctor}
          patientId={patientId}
          patientName={patientName}
          onClose={() => setBookingDoctor(null)}
          onSuccess={onBookingSuccess}
          lang={lang}
        />
      )}

      {/* Apply as Specialist Modal */}
      {showApplyModal && (
        <DoctorVerificationModal
          onClose={() => setShowApplyModal(false)}
          onSubmitted={loadDoctors}
          lang={lang}
        />
      )}
    </div>
  );
}
