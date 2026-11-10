import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Stethoscope,
  BadgeCheck,
  Calendar,
  Clock,
  User,
  FileText,
  Video,
  Send,
  Building2,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Lock,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import type { ConsultationBooking, DoctorProfile } from "@/types/teleconsult";
import {
  getDoctorById,
  saveDoctors,
  getDoctors,
  getBookings,
  updateBookingStatus,
} from "@/lib/teleconsultStorage";
import { getActiveUserRole, hasPermission } from "@/lib/rbacStorage";
import { VideoConsultationRoom } from "@/components/pinkcare/teleconsult/VideoConsultationRoom";

export const Route = createFileRoute("/_app/professional")({
  component: ProfessionalDashboardPage,
});

function ProfessionalDashboardPage() {
  const { profile } = useAuth();
  const { lang } = useI18n();

  const [currentRole, setCurrentRole] = useState(getActiveUserRole());
  const [activeTab, setActiveTab] = useState<"consultations" | "profile" | "recommendations">(
    "consultations",
  );

  // Authenticated doctor profile (defaults to Dr. Sarah Belkacem for professional persona)
  const currentDoctorId = "doc-1";
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | undefined>(
    getDoctorById(currentDoctorId),
  );

  // Consultations strictly authorized for this doctor
  const [authorizedBookings, setAuthorizedBookings] = useState<ConsultationBooking[]>([]);
  const [activeCallBooking, setActiveCallBooking] = useState<ConsultationBooking | null>(null);

  // Clinical note editing state
  const [selectedBookingForNotes, setSelectedBookingForNotes] =
    useState<ConsultationBooking | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [recommendationsText, setRecommendationsText] = useState("");

  const refreshData = () => {
    setCurrentRole(getActiveUserRole());
    const doc = getDoctorById(currentDoctorId);
    setDoctorProfile(doc);

    // CRITICAL SECURITY REQUIREMENT:
    // Professionals must only access their OWN authorized patient consultations!
    const allBookings = getBookings();
    const authorized = allBookings.filter((b) => b.doctorId === currentDoctorId);
    setAuthorizedBookings(authorized);
  };

  useEffect(() => {
    refreshData();
    const handleUpd = () => refreshData();
    window.addEventListener("pinkcare:rbac-role-switched", handleUpd);
    window.addEventListener("pinkcare:bookings-updated", handleUpd);
    window.addEventListener("pinkcare:doctors-updated", handleUpd);
    return () => {
      window.removeEventListener("pinkcare:rbac-role-switched", handleUpd);
      window.removeEventListener("pinkcare:bookings-updated", handleUpd);
      window.removeEventListener("pinkcare:doctors-updated", handleUpd);
    };
  }, []);

  const isAuthorized =
    hasPermission(currentRole, "view_authorized_patient_consultations") ||
    currentRole === "platform_admin";

  if (!isAuthorized) {
    return (
      <div className="glass rounded-3xl p-8 text-center space-y-4 my-8 border border-destructive/30">
        <div className="w-16 h-16 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            {lang === "ar"
              ? "منطقة مخصصة للكوادر الطبية المعتمدة"
              : "Authorized Healthcare Professionals Only"}
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 leading-relaxed">
            {lang === "ar"
              ? "يتطلب الوصول إلى سجلات الاستشارات الطبية دور [طبيبة أخصائية] أو [مدير منصة]. استخدمي شريط تبديل الأدوار في الأعلى لاختبار الصلاحيات."
              : "Access to consultation records requires the Healthcare Professional or Platform Admin role."}
          </p>
        </div>
      </div>
    );
  }

  // Handle saving clinical consultation notes
  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForNotes) return;

    updateBookingStatus(selectedBookingForNotes.id, selectedBookingForNotes.status, {
      clinicalSummary: clinicalNotes,
      recommendations: recommendationsText,
    });

    toast.success(lang === "ar" ? "تم توثيق الملاحظات الطبية بنجاح ✓" : "Clinical notes saved ✓");
    setSelectedBookingForNotes(null);
    refreshData();
  };

  // Handle updating profile bio/slots
  const handleUpdateDoctorBio = (newBio: string) => {
    if (!doctorProfile) return;
    const docs = getDoctors();
    const d = docs.find((x) => x.id === doctorProfile.id);
    if (d) {
      d.bio = newBio;
      d.bioAr = newBio;
      saveDoctors(docs);
      setDoctorProfile({ ...d });
      toast.success(lang === "ar" ? "تم تحديث الملف المهني بنجاح" : "Profile updated");
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header Profile Summary */}
      <div className="glass rounded-3xl p-5 border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shrink-0">
            <img
              src={doctorProfile?.avatar}
              alt={doctorProfile?.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0.5 end-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <BadgeCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">{doctorProfile?.name}</h2>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                {lang === "ar" ? "طبيبة معتمدة" : "Verified Specialist"}
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {doctorProfile?.title}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
              <Building2 className="w-3 h-3" />
              <span>{doctorProfile?.hospital}</span>
              <span>•</span>
              <span className="font-mono text-foreground font-semibold">
                {doctorProfile?.licenseNumber}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Security Privacy Notice */}
      <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 text-xs flex items-center gap-2">
        <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {lang === "ar"
            ? "حماية البيانات الطبية: تقتصر رؤيتكِ حصرياً على الاستشارات التي حجزتها المستفيدات معكِ شخصياً. لا يمكن للأطباء الوصول إلى السجلات العامة للمريضات الآخرين."
            : "Data Isolation: Access is strictly restricted to patient consultations scheduled directly with you."}
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex rounded-2xl bg-muted/50 p-1 border border-border/50">
        <button
          onClick={() => setActiveTab("consultations")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === "consultations"
              ? "bg-card text-emerald-700 dark:text-emerald-300 shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{lang === "ar" ? "استشاراتي المعتمدة" : "My Consultations"}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-600 text-white font-mono">
            {authorizedBookings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === "profile"
              ? "bg-card text-emerald-700 dark:text-emerald-300 shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>{lang === "ar" ? "ملفي وتوفر المواعيد" : "Profile & Slots"}</span>
        </button>

        <button
          onClick={() => setActiveTab("recommendations")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === "recommendations"
              ? "bg-card text-emerald-700 dark:text-emerald-300 shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{lang === "ar" ? "التوصيات التعليمية" : "Guidelines"}</span>
        </button>
      </div>

      {/* TAB 1: Authorized Patient Consultations */}
      {activeTab === "consultations" && (
        <div className="space-y-3">
          {authorizedBookings.length > 0 ? (
            authorizedBookings.map((booking) => (
              <div
                key={booking.id}
                className="glass rounded-3xl p-4 border border-emerald-500/20 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{booking.patientName}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="font-mono">{booking.date}</span>
                        <span>•</span>
                        <span className="font-mono">{booking.time}</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      booking.status === "confirmed"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : booking.status === "completed"
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {booking.status === "confirmed"
                      ? "مؤكد"
                      : booking.status === "completed"
                        ? "مكتملة ✓"
                        : booking.status}
                  </span>
                </div>

                {/* Patient explicitly shared topic & symptoms */}
                <div className="bg-muted/40 rounded-2xl p-3 text-xs space-y-1 border border-border/40">
                  <span className="text-[10px] font-bold text-foreground block">
                    {lang === "ar"
                      ? "المعلومات المشاركة صراحة من المستفيدة:"
                      : "Explicitly Shared by Patient:"}
                  </span>
                  <p className="text-foreground/90 font-medium">{booking.reason}</p>
                  {booking.notes && (
                    <p className="text-[11px] text-muted-foreground italic">
                      ملاحظات: {booking.notes}
                    </p>
                  )}
                </div>

                {/* Actions: Start Video Room & Add Clinical Notes */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-mono">
                    <Video className="w-3.5 h-3.5" />
                    <span>غرفة WebRTC: {booking.roomId}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedBookingForNotes(booking);
                        setClinicalNotes(booking.clinicalSummary || "");
                        setRecommendationsText(booking.recommendations || "");
                      }}
                      className="px-3 py-1.5 rounded-xl border border-border hover:bg-muted text-xs font-semibold flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      <span>{lang === "ar" ? "توثيق التقرير" : "Notes"}</span>
                    </button>

                    <button
                      onClick={() => setActiveCallBooking(booking)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{lang === "ar" ? "بدء الاتصال المرئي" : "Start Call"}</span>
                    </button>
                  </div>
                </div>

                {/* Existing recorded notes if any */}
                {booking.clinicalSummary && (
                  <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/15 text-[11px] text-foreground/85">
                    <span className="font-bold text-primary block mb-0.5">
                      الملخص الطبي الموثق:
                    </span>
                    <p>{booking.clinicalSummary}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="glass rounded-3xl p-6 text-center text-xs text-muted-foreground border border-dashed border-border/70">
              لا توجد استشارات مجدولة حالياً مع عيادتكِ. ستظهر هنا المواعيد الجديدة فور حجزها.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Professional Profile & Consultation Slots */}
      {activeTab === "profile" && doctorProfile && (
        <div className="glass rounded-3xl p-5 border border-border/60 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground">
              {lang === "ar" ? "تعديل النبذة التعريفية والخبرات:" : "Edit Bio & Expertise:"}
            </h3>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              ترخيص معتمد
            </span>
          </div>

          <textarea
            defaultValue={doctorProfile.bio}
            onBlur={(e) => handleUpdateDoctorBio(e.target.value)}
            rows={4}
            className="w-full bg-background border border-border rounded-xl p-3 text-foreground leading-relaxed focus:outline-hidden focus:border-emerald-500"
          />

          <div className="space-y-2">
            <h4 className="font-bold text-foreground">
              {lang === "ar"
                ? "أوقات الجلسات الاستشارية المتاحة:"
                : "Available Consultation Slots:"}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {doctorProfile.slots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-2 rounded-xl bg-muted/40 border border-border/50 text-center font-mono font-bold text-emerald-600"
                >
                  {slot.time}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Approved Educational Recommendations */}
      {activeTab === "recommendations" && (
        <div className="glass rounded-3xl p-5 border border-border/60 space-y-3 text-xs">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>
              {lang === "ar" ? "بروتوكولات التوجيه الطبي المعتمدة" : "Approved Clinical Guidelines"}
            </span>
          </h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            يمكن للأخصائية تزويد المستفيدات بتوصيات منتقاة من مكتبة PinkCare العلمية لمتابعة التعافي
            الحركي، الوقاية من الوذمة اللمفية، والتغذية السليمة.
          </p>
          <div className="space-y-2 pt-1">
            <div className="p-3 rounded-2xl bg-muted/30 border border-border/40">
              <span className="font-bold text-foreground block">
                1. بروتوكول حماية الذراع من التورم اللمفاوي
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                تجنب قياس الضغط أو وخز الإبر في الذراع المصابة، وترطيب البشرة بانتظام.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-muted/30 border border-border/40">
              <span className="font-bold text-foreground block">2. برنامج التدرج الحركي للكتف</span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                تمارين الإطالة الخفيفة مع التنفس العميق مرتين يومياً دون الوصول إلى مرحلة الألم
                الحاد.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal to record clinical consultation notes */}
      {selectedBookingForNotes && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground border border-border rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <FileText className="w-5 h-5" />
                <span>
                  {lang === "ar" ? "توثيق التقرير الطبي للاستشارة" : "Record Consultation Summary"}
                </span>
              </div>
              <button
                onClick={() => setSelectedBookingForNotes(null)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNotes} className="space-y-3 text-xs">
              <p className="font-bold text-foreground">
                المستفيدة: {selectedBookingForNotes.patientName} • {selectedBookingForNotes.date}{" "}
                {selectedBookingForNotes.time}
              </p>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  ملخص نتائج الاستشارة السريرية:
                </label>
                <textarea
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  rows={3}
                  placeholder="ملاحظات الحالة، استقرار التحاليل، وتوجيهات الطبيبة..."
                  required
                  className="w-full bg-background border border-border rounded-xl p-2.5 text-foreground focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  الخطة القادمة وموعد المتابعة:
                </label>
                <input
                  type="text"
                  value={recommendationsText}
                  onChange={(e) => setRecommendationsText(e.target.value)}
                  placeholder="مراجعة الفحوصات بعد 4 أسابيع، الاستمرار في المشي اليومي..."
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForNotes(null)}
                  className="px-4 py-2 rounded-xl text-muted-foreground hover:bg-muted"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  حفظ في ملف المريضة ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WebRTC Video Call Room */}
      {activeCallBooking && (
        <VideoConsultationRoom
          booking={activeCallBooking}
          onClose={() => {
            setActiveCallBooking(null);
            refreshData();
          }}
          lang={lang}
        />
      )}
    </div>
  );
}
