import { useState } from "react";
import {
  X,
  Video,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle2,
  BadgeCheck,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import type { DoctorProfile, ConsultationType } from "@/types/teleconsult";
import { bookConsultation } from "@/lib/teleconsultStorage";

type BookAppointmentModalProps = {
  doctor: DoctorProfile;
  patientId: string;
  patientName: string;
  onClose: () => void;
  onSuccess: () => void;
  lang?: "ar" | "en";
};

export function BookAppointmentModal({
  doctor,
  patientId,
  patientName,
  onClose,
  onSuccess,
  lang = "ar",
}: BookAppointmentModalProps) {
  // Generate next 5 calendar dates
  const availableDates: { dateStr: string; labelAr: string; labelEn: string }[] = [];
  const now = new Date();
  for (let i = 1; i <= 6; i++) {
    const d = new Date(now.getTime() + i * 86400000);
    const dateStr = d.toISOString().split("T")[0];
    const dayNameAr = d.toLocaleDateString("ar-EG", { weekday: "long" });
    const dayNameEn = d.toLocaleDateString("en-US", { weekday: "short" });
    availableDates.push({
      dateStr,
      labelAr: `${dayNameAr} (${d.getDate()}/${d.getMonth() + 1})`,
      labelEn: `${dayNameEn} (${d.getMonth() + 1}/${d.getDate()})`,
    });
  }

  const [selectedDate, setSelectedDate] = useState(availableDates[0]?.dateStr || "");
  const [selectedSlot, setSelectedSlot] = useState(doctor.slots[0]?.time || "10:00");
  const [consultationType, setConsultationType] = useState<ConsultationType>("video");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast.error(
        lang === "ar"
          ? "يرجى تحديد سبب الاستشارة أو الاستفسار الرئيسي"
          : "Please describe the reason for your consultation",
      );
      return;
    }

    setSubmitting(true);
    try {
      bookConsultation({
        doctorId: doctor.id,
        patientId,
        patientName: patientName || "المستفيدة الكريمة",
        consultationType,
        date: selectedDate,
        time: selectedSlot,
        reason,
        notes,
      });

      toast.success(
        lang === "ar"
          ? `تم تأكيد حجز الاستشارة مع ${doctor.name} بنجاح! 💗`
          : `Consultation confirmed with ${doctor.name}! 💗`,
      );
      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast.error((err as Error).message || "فشل حجز الموعد");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border rounded-3xl p-5 max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-primary/30 shrink-0">
              <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-foreground">{doctor.name}</h3>
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <p className="text-[11px] text-muted-foreground">{doctor.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          {/* Consultation Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              {lang === "ar" ? "نوع جلسة الاستشارة:" : "Consultation Format:"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setConsultationType("video")}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 text-xs transition ${
                  consultationType === "video"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border/60 hover:bg-muted text-muted-foreground"
                }`}
              >
                <Video className="w-5 h-5" />
                <span>{lang === "ar" ? "فيديو WebRTC" : "Video Call"}</span>
                <span className="text-[9px] opacity-75 font-normal">HD صوت وصورة</span>
              </button>

              <button
                type="button"
                onClick={() => setConsultationType("audio")}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 text-xs transition ${
                  consultationType === "audio"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border/60 hover:bg-muted text-muted-foreground"
                }`}
              >
                <Phone className="w-5 h-5" />
                <span>{lang === "ar" ? "مكالمة صوتية" : "Voice Call"}</span>
                <span className="text-[9px] opacity-75 font-normal">مكالمة آمنة</span>
              </button>

              <button
                type="button"
                onClick={() => setConsultationType("messaging")}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 text-xs transition ${
                  consultationType === "messaging"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border/60 hover:bg-muted text-muted-foreground"
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>{lang === "ar" ? "محادثة كتابية" : "Chat Consult"}</span>
                <span className="text-[9px] opacity-75 font-normal">مراسلة مشفرة</span>
              </button>
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>{lang === "ar" ? "تاريخ الاستشارة:" : "Choose Date:"}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableDates.map((item) => (
                <button
                  type="button"
                  key={item.dateStr}
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={`p-2.5 rounded-xl border text-xs text-center transition ${
                    selectedDate === item.dateStr
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-border/60 hover:bg-muted text-foreground/80"
                  }`}
                >
                  {lang === "ar" ? item.labelAr : item.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{lang === "ar" ? "التوقيت المتاح:" : "Available Time Slot:"}</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {doctor.slots.map((slot) => (
                <button
                  type="button"
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.time)}
                  className={`py-2 px-2 rounded-xl border text-xs font-mono font-bold text-center transition ${
                    selectedSlot === slot.time
                      ? "border-primary bg-primary text-primary-foreground shadow-xs"
                      : "border-border/60 hover:bg-muted text-foreground"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>

          {/* Consultation Reason */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              {lang === "ar" ? "سبب الاستشارة أو الاستفسار الصحي:" : "Reason for Consultation:"}
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                lang === "ar"
                  ? "مثال: مراجعة تحاليل روتينية، أعراض إجهاد بعد العلاج..."
                  : "e.g. Review lab results, post-session symptoms..."
              }
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-hidden focus:border-primary"
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              {lang === "ar"
                ? "ملاحظات للطبيبة مسبقاً (اختياري):"
                : "Additional Notes for Doctor (Optional):"}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder={
                lang === "ar"
                  ? "اكتبي أي أعراض تشعرين بها أو أسئلة تودين مناقشتها في الجلسة..."
                  : "Any specific concerns you want to highlight..."
              }
              className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-hidden focus:border-primary"
            />
          </div>

          {/* Privacy & Medical Reassurance */}
          <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 text-xs text-muted-foreground flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-primary shrink-0" />
            <span className="text-[11px] leading-relaxed">
              {lang === "ar"
                ? "الجلسة مشفرة وآمنة تماماً. جميع السجلات تحفظ حصرياً في ملفكِ الصحي الخاص."
                : "Consultations are encrypted end-to-end and stored securely in your private profile."}
            </span>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:bg-muted"
            >
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 shadow-md hover:opacity-90 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === "ar" ? "تأكيد حجز الاستشارة" : "Confirm Booking"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
