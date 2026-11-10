import { useState } from "react";
import {
  Video,
  Phone,
  MessageSquare,
  Clock,
  Calendar,
  FileText,
  BadgeCheck,
  XCircle,
  PlayCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { ConsultationBooking } from "@/types/teleconsult";
import { updateBookingStatus } from "@/lib/teleconsultStorage";

type AppointmentsListProps = {
  bookings: ConsultationBooking[];
  onJoinCall: (booking: ConsultationBooking) => void;
  onRefresh: () => void;
  lang?: "ar" | "en";
};

export function AppointmentsList({
  bookings,
  onJoinCall,
  onRefresh,
  lang = "ar",
}: AppointmentsListProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [selectedSummary, setSelectedSummary] = useState<ConsultationBooking | null>(null);

  const upcomingBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "in_progress",
  );
  const pastBookings = bookings.filter((b) => b.status === "completed" || b.status === "cancelled");

  const displayed = activeTab === "upcoming" ? upcomingBookings : pastBookings;

  const handleCancel = (id: string) => {
    updateBookingStatus(id, "cancelled");
    toast.success(lang === "ar" ? "تم إلغاء الموعد" : "Appointment cancelled");
    onRefresh();
  };

  return (
    <div className="space-y-3">
      {/* Sub tabs */}
      <div className="flex rounded-2xl bg-muted/50 p-1 border border-border/50">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
            activeTab === "upcoming"
              ? "bg-card text-primary shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang === "ar" ? "المواعيد القادمة" : "Upcoming"} ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
            activeTab === "past"
              ? "bg-card text-primary shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang === "ar" ? "السجل والمكتملة" : "Past & History"} ({pastBookings.length})
        </button>
      </div>

      {/* List */}
      {displayed.length > 0 ? (
        <div className="space-y-3">
          {displayed.map((b) => {
            const isConfirmed = b.status === "confirmed" || b.status === "in_progress";
            return (
              <div
                key={b.id}
                className="glass rounded-3xl p-4 border border-primary/20 space-y-3 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-primary/30 shrink-0">
                      <img
                        src={b.doctorAvatar}
                        alt={b.doctorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-foreground">{b.doctorName}</span>
                        <BadgeCheck className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-xs text-primary font-medium">{b.doctorTitle}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className="font-mono">{b.date}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span className="font-mono">{b.time}</span>
                        </span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      b.status === "confirmed"
                        ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                        : b.status === "in_progress"
                          ? "bg-primary/20 text-primary border border-primary/40 animate-pulse"
                          : b.status === "completed"
                            ? "bg-blue-500/15 text-blue-600 border border-blue-500/30"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {b.status === "confirmed"
                      ? lang === "ar"
                        ? "مؤكد"
                        : "Confirmed"
                      : b.status === "in_progress"
                        ? lang === "ar"
                          ? "جارية الآن"
                          : "In Progress"
                        : b.status === "completed"
                          ? lang === "ar"
                            ? "مكتملة ✓"
                            : "Completed ✓"
                          : lang === "ar"
                            ? "ملغاة"
                            : "Cancelled"}
                  </span>
                </div>

                <div className="bg-muted/30 rounded-2xl p-2.5 text-xs border border-border/40 space-y-1">
                  <span className="font-semibold text-foreground/80 block">
                    {lang === "ar" ? "الاستفسار المسجل:" : "Consultation Topic:"}
                  </span>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">{b.reason}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {b.consultationType === "video" && (
                      <span className="flex items-center gap-1 text-primary">
                        <Video className="w-3.5 h-3.5" />
                        <span>WebRTC HD</span>
                      </span>
                    )}
                    {b.consultationType === "audio" && (
                      <span className="flex items-center gap-1 text-primary">
                        <Phone className="w-3.5 h-3.5" />
                        <span>مكالمة صوتية</span>
                      </span>
                    )}
                    {b.consultationType === "messaging" && (
                      <span className="flex items-center gap-1 text-primary">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>استشارة نصية</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isConfirmed && (
                      <>
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="px-3 py-1.5 rounded-xl text-xs text-muted-foreground hover:bg-muted hover:text-destructive transition"
                        >
                          {lang === "ar" ? "إلغاء" : "Cancel"}
                        </button>
                        <button
                          onClick={() => onJoinCall(b)}
                          className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>{lang === "ar" ? "دخول غرفة الاستشارة" : "Join Call"}</span>
                        </button>
                      </>
                    )}

                    {b.status === "completed" && (
                      <button
                        onClick={() => setSelectedSummary(b)}
                        className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 font-semibold text-xs flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{lang === "ar" ? "عرض التقرير" : "View Summary"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass rounded-3xl p-6 text-center text-xs text-muted-foreground border border-dashed border-border/80">
          <Calendar className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
          <p className="font-semibold text-foreground">
            {activeTab === "upcoming"
              ? lang === "ar"
                ? "لا توجد مواعيد استشارات قادمة حالياً"
                : "No upcoming appointments"
              : lang === "ar"
                ? "لا يوجد سجل استشارات سابقة حتى الآن"
                : "No consultation history yet"}
          </p>
          <p className="text-[11px] mt-1">
            {lang === "ar"
              ? "تصفحي قائمة الطبيبات والأخصائيات المعتمدات أعلاه لحجز موعد مجاني مدعوم."
              : "Browse verified doctors above to book your consultation."}
          </p>
        </div>
      )}

      {/* Summary View Modal */}
      {selectedSummary && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground border border-border rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <FileText className="w-5 h-5" />
                <span>{lang === "ar" ? "ملخص الاستشارة الطبية" : "Consultation Summary"}</span>
              </div>
              <button
                onClick={() => setSelectedSummary(null)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-foreground">
                {selectedSummary.doctorName} • {selectedSummary.doctorTitle}
              </p>
              <p className="text-[11px] text-muted-foreground">
                التاريخ: {selectedSummary.date} {selectedSummary.time}
              </p>

              <div className="bg-muted/40 p-3 rounded-2xl border border-border/40 space-y-1.5 mt-2">
                <span className="font-semibold text-primary block">
                  {lang === "ar" ? "توصيات الطبيبة والملاحظات:" : "Clinical Notes:"}
                </span>
                <p className="text-foreground/90 leading-relaxed">
                  {selectedSummary.clinicalSummary ||
                    "تمت مناقشة الحالة الصحية وتوجيه التوصيات اللازمة."}
                </p>
              </div>

              {selectedSummary.recommendations && (
                <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 space-y-1">
                  <span className="font-semibold block">
                    {lang === "ar" ? "الخطوات القادمة:" : "Next Steps:"}
                  </span>
                  <p className="text-[11px] leading-relaxed">{selectedSummary.recommendations}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSummary(null)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
              >
                {lang === "ar" ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
