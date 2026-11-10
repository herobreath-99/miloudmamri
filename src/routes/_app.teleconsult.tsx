import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Stethoscope, Calendar, ShieldCheck, Video } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import type { ConsultationBooking } from "@/types/teleconsult";
import { getBookings } from "@/lib/teleconsultStorage";
import { DoctorCatalog } from "@/components/pinkcare/teleconsult/DoctorCatalog";
import { AppointmentsList } from "@/components/pinkcare/teleconsult/AppointmentsList";
import { VideoConsultationRoom } from "@/components/pinkcare/teleconsult/VideoConsultationRoom";
import { AdminPortalModal } from "@/components/pinkcare/admin/AdminPortalModal";

export const Route = createFileRoute("/_app/teleconsult")({
  component: TeleconsultPage,
});

function TeleconsultPage() {
  const { profile } = useAuth();
  const { lang } = useI18n();

  const [activeTab, setActiveTab] = useState<"catalog" | "my_appointments">("catalog");
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [activeCallBooking, setActiveCallBooking] = useState<ConsultationBooking | null>(null);
  const [showAdminPortal, setShowAdminPortal] = useState(false);

  const patientId = profile?.id || "patient-current";
  const patientName = profile ? `${profile.first_name} ${profile.last_name}` : "المستفيدة الكريمة";

  const refreshBookings = useCallback(() => {
    setBookings(getBookings(patientId));
  }, [patientId]);

  useEffect(() => {
    refreshBookings();
    const handleUpd = () => refreshBookings();
    window.addEventListener("pinkcare:bookings-updated", handleUpd);
    return () => window.removeEventListener("pinkcare:bookings-updated", handleUpd);
  }, [refreshBookings]);

  const upcomingCount = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "in_progress",
  ).length;

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header & Admin Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shadow-xs">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {lang === "ar" ? "الاستشارات الطبية عن بُعد" : "Teleconsultation"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {lang === "ar"
                ? "تواصل مرئي مباشر مع طبيبات وأخصائيات معتمدات"
                : "Encrypted direct video consultations with verified specialists"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAdminPortal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 transition"
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="hidden sm:inline">
            {lang === "ar" ? "لوحة الاعتماد الطبي" : "Verification Portal"}
          </span>
          <span className="sm:hidden">{lang === "ar" ? "الاعتماد" : "Admin"}</span>
        </button>
      </div>

      {/* Main Tabs */}
      <div className="flex rounded-3xl bg-muted/60 p-1.5 border border-border/60">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex-1 py-2 text-xs font-bold rounded-2xl transition flex items-center justify-center gap-1.5 ${
            activeTab === "catalog"
              ? "bg-card text-primary shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>{lang === "ar" ? "دليل الأخصائيات المعتمدات" : "Find Specialists"}</span>
        </button>

        <button
          onClick={() => setActiveTab("my_appointments")}
          className={`flex-1 py-2 text-xs font-bold rounded-2xl transition flex items-center justify-center gap-1.5 relative ${
            activeTab === "my_appointments"
              ? "bg-card text-primary shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{lang === "ar" ? "استشاراتي ومواعيدي" : "My Appointments"}</span>
          {upcomingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-primary text-primary-foreground font-mono font-bold">
              {upcomingCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Doctors Catalog */}
      {activeTab === "catalog" && (
        <DoctorCatalog
          patientId={patientId}
          patientName={patientName}
          onBookingSuccess={() => {
            refreshBookings();
            setActiveTab("my_appointments");
          }}
          lang={lang}
        />
      )}

      {/* Tab 2: Appointments & Call Joining */}
      {activeTab === "my_appointments" && (
        <AppointmentsList
          bookings={bookings}
          onJoinCall={(b) => setActiveCallBooking(b)}
          onRefresh={refreshBookings}
          lang={lang}
        />
      )}

      {/* WebRTC Video Consultation Room */}
      {activeCallBooking && (
        <VideoConsultationRoom
          booking={activeCallBooking}
          onClose={() => {
            setActiveCallBooking(null);
            refreshBookings();
          }}
          lang={lang}
        />
      )}

      {/* Admin Verification Portal Modal */}
      {showAdminPortal && (
        <AdminPortalModal onClose={() => setShowAdminPortal(false)} lang={lang} />
      )}
    </div>
  );
}
