import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Stethoscope,
  Activity,
  Microscope,
  Eye,
  RotateCcw,
  Bell,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import {
  getAppointments,
  saveAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  todayISO,
  type MedicalAppointment,
  type AppointmentType,
} from "@/lib/local-db";

const APPOINTMENT_TYPES: {
  type: AppointmentType;
  label_ar: string;
  label_en: string;
  icon: typeof Stethoscope;
}[] = [
  { type: "doctor", label_ar: "موعد طبيب", label_en: "Doctor Visit", icon: Stethoscope },
  {
    type: "oncology",
    label_ar: "استشارة أورام",
    label_en: "Oncology Consultation",
    icon: Activity,
  },
  {
    type: "examination",
    label_ar: "فحص سريري",
    label_en: "Clinical Examination",
    icon: Stethoscope,
  },
  { type: "laboratory", label_ar: "تحاليل مخبرية", label_en: "Lab Test", icon: Microscope },
  { type: "imaging", label_ar: "فحص تصويري (أشعة)", label_en: "Imaging Scan", icon: Eye },
  { type: "follow_up", label_ar: "متابعة دورية", label_en: "Follow-up Visit", icon: RotateCcw },
];

export function AppointmentManager() {
  const { lang } = useI18n();
  const [apps, setApps] = useState<MedicalAppointment[]>([]);
  const [filterType, setFilterType] = useState<AppointmentType | "all">("all");
  const [viewTab, setViewTab] = useState<"upcoming" | "history">("upcoming");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<MedicalAppointment | null>(null);

  // Form fields
  const [type, setType] = useState<AppointmentType>("oncology");
  const [title, setTitle] = useState("");
  const [specialistName, setSpecialistName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("10:00");
  const [reminderTiming, setReminderTiming] = useState<
    "1_day_before" | "2_hours_before" | "1_hour_before" | "on_time"
  >("1_day_before");
  const [notes, setNotes] = useState("");

  const refresh = () => {
    setApps(getAppointments());
  };

  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener("pinkcare:appointments", handleUpdate);
    return () => window.removeEventListener("pinkcare:appointments", handleUpdate);
  }, []);

  const openAdd = () => {
    setEditingApp(null);
    setType("oncology");
    setTitle(lang === "ar" ? "استشارة متابعة الأورام" : "Oncology Consultation");
    setSpecialistName("");
    setSpecialty(lang === "ar" ? "طب الأورام" : "Medical Oncology");
    setLocation("");
    setDate(todayISO());
    setTime("10:00");
    setReminderTiming("1_day_before");
    setNotes("");
    setIsDialogOpen(true);
  };

  const openEdit = (item: MedicalAppointment) => {
    setEditingApp(item);
    setType(item.type);
    setTitle(item.title);
    setSpecialistName(item.specialistName);
    setSpecialty(item.specialty ?? "");
    setLocation(item.location);
    setDate(item.date);
    setTime(item.time);
    setReminderTiming(item.reminderTiming);
    setNotes(item.notes ?? "");
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !specialistName.trim() || !location.trim()) {
      toast.error(
        lang === "ar"
          ? "يرجى ملء تفاصيل الموعد واسم الطبيب والمركز الطبي"
          : "Please complete title, specialist name, and location",
      );
      return;
    }

    saveAppointment({
      id: editingApp?.id,
      type,
      title: title.trim(),
      specialistName: specialistName.trim(),
      specialty: specialty.trim() || undefined,
      location: location.trim(),
      date,
      time,
      reminderTiming,
      notes: notes.trim() || null,
      status: editingApp ? editingApp.status : "upcoming",
    });

    toast.success(
      editingApp
        ? lang === "ar"
          ? "تم تحديث بيانات الموعد"
          : "Appointment updated"
        : lang === "ar"
          ? "تم حفظ الموعد وإعداد التذكيرات الذكية"
          : "Appointment saved & reminders scheduled",
    );
    setIsDialogOpen(false);
  };

  const handleStatusChange = (id: string, nextStatus: "upcoming" | "completed" | "cancelled") => {
    updateAppointmentStatus(id, nextStatus);
    toast.success(
      nextStatus === "completed"
        ? lang === "ar"
          ? "تم تسجيل حضور الموعد بنجاح 💗"
          : "Appointment marked completed 💗"
        : lang === "ar"
          ? "تم إلغاء الموعد"
          : "Appointment marked cancelled",
    );
  };

  const handleDelete = (id: string) => {
    deleteAppointment(id);
    toast.success(lang === "ar" ? "تم حذف الموعد" : "Appointment deleted");
  };

  const filteredApps = apps.filter((a) => {
    const matchesTab = viewTab === "upcoming" ? a.status === "upcoming" : a.status !== "upcoming";
    const matchesType = filterType === "all" ? true : a.type === filterType;
    return matchesTab && matchesType;
  });

  return (
    <div className="space-y-4">
      {/* Top action header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary">
              {lang === "ar" ? "المواعيد والفحوصات الطبية" : "Appointments & Exams"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {lang === "ar"
                ? "جدولة استشارات الأورام، التحاليل المخبرية والأشعة"
                : "Schedule consultations, lab tests & imaging scans"}
            </p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="gradient-neon text-primary-foreground text-xs font-bold px-3 py-2 rounded-2xl flex items-center gap-1 neon-glow shadow-sm hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === "ar" ? "إضافة موعد" : "Add Appt"}</span>
        </button>
      </div>

      {/* View Tabs */}
      <div className="glass rounded-full p-1 grid grid-cols-2 gap-1 text-xs font-bold">
        <button
          onClick={() => setViewTab("upcoming")}
          className={`py-2 rounded-full transition-all ${
            viewTab === "upcoming"
              ? "gradient-neon text-primary-foreground neon-glow shadow-sm"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          {lang === "ar"
            ? `المواعيد القادمة (${apps.filter((a) => a.status === "upcoming").length})`
            : `Upcoming (${apps.filter((a) => a.status === "upcoming").length})`}
        </button>
        <button
          onClick={() => setViewTab("history")}
          className={`py-2 rounded-full transition-all ${
            viewTab === "history"
              ? "gradient-neon text-primary-foreground neon-glow shadow-sm"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          {lang === "ar"
            ? `السجل السابق (${apps.filter((a) => a.status !== "upcoming").length})`
            : `History (${apps.filter((a) => a.status !== "upcoming").length})`}
        </button>
      </div>

      {/* Filter by Type Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold no-scrollbar">
        <button
          onClick={() => setFilterType("all")}
          className={`px-3 py-1.5 rounded-full shrink-0 transition ${
            filterType === "all"
              ? "bg-primary text-primary-foreground"
              : "glass text-muted-foreground"
          }`}
        >
          {lang === "ar" ? "الكل" : "All"}
        </button>
        {APPOINTMENT_TYPES.map((t) => (
          <button
            key={t.type}
            onClick={() => setFilterType(t.type)}
            className={`px-3 py-1.5 rounded-full shrink-0 transition ${
              filterType === t.type
                ? "bg-primary text-primary-foreground"
                : "glass text-muted-foreground"
            }`}
          >
            {lang === "ar" ? t.label_ar : t.label_en}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredApps.length === 0 ? (
          <div className="glass rounded-3xl p-6 text-center space-y-3">
            <Calendar className="w-10 h-10 text-primary/40 mx-auto" />
            <p className="text-sm font-semibold text-primary">
              {viewTab === "upcoming"
                ? lang === "ar"
                  ? "لا توجد مواعيد قادمة مجدولة"
                  : "No upcoming appointments scheduled"
                : lang === "ar"
                  ? "لا توجد مواعيد سابقة في السجل"
                  : "No past appointments in history"}
            </p>
            {viewTab === "upcoming" && (
              <button
                onClick={openAdd}
                className="gradient-neon text-primary-foreground text-xs font-bold px-4 py-2 rounded-full neon-glow inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === "ar" ? "جدولة موعد جديد" : "Schedule appointment"}</span>
              </button>
            )}
          </div>
        ) : (
          filteredApps.map((item) => {
            const typeMeta = APPOINTMENT_TYPES.find((t) => t.type === item.type);
            const Icon = typeMeta?.icon ?? Stethoscope;
            const isToday = item.date === todayISO();

            return (
              <div
                key={item.id}
                className={`glass rounded-3xl p-4 space-y-3 border transition-all ${
                  isToday && item.status === "upcoming"
                    ? "border-primary/50 ring-2 ring-primary/20"
                    : "border-primary/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-2xl gradient-neon text-primary-foreground flex items-center justify-center shrink-0 mt-0.5 neon-glow">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-primary text-base">{item.title}</h4>
                        {isToday && item.status === "upcoming" && (
                          <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">
                            {lang === "ar" ? "اليوم" : "Today"}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-foreground/80 flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3 text-primary" />
                        <span className="font-bold">{item.specialistName}</span>
                        {item.specialty && (
                          <span className="text-muted-foreground">({item.specialty})</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {item.status === "upcoming" ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStatusChange(item.id, "completed")}
                        className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center hover:bg-emerald-500/25"
                        title={lang === "ar" ? "تم الحضور" : "Mark completed"}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEdit(item)}
                        className="w-8 h-8 rounded-full glass flex items-center justify-center text-primary"
                        title={lang === "ar" ? "تعديل" : "Edit"}
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${
                          item.status === "completed"
                            ? "bg-emerald-500/15 text-emerald-600"
                            : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {item.status === "completed"
                          ? lang === "ar"
                            ? "مكتمل ✓"
                            : "Completed ✓"
                          : lang === "ar"
                            ? "ملغي ✕"
                            : "Cancelled ✕"}
                      </span>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="w-7 h-7 rounded-full glass flex items-center justify-center text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1 border-t border-border/40">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span className="tabular-nums num-en" dir="ltr">
                      {item.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span className="tabular-nums num-en font-bold text-foreground" dir="ltr">
                      {item.time}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>

                {/* Reminder timing badge */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <Bell className="w-3 h-3 text-primary" />
                    <span>
                      {lang === "ar" ? "التذكير:" : "Reminder:"}{" "}
                      {item.reminderTiming === "1_day_before"
                        ? lang === "ar"
                          ? "قبل بيوم (09:00)"
                          : "1 day before (09:00)"
                        : item.reminderTiming === "2_hours_before"
                          ? lang === "ar"
                            ? "قبل ساعتين"
                            : "2 hours before"
                          : item.reminderTiming === "1_hour_before"
                            ? lang === "ar"
                              ? "قبل ساعة"
                              : "1 hour before"
                            : lang === "ar"
                              ? "في نفس الوقت"
                              : "At scheduled time"}
                    </span>
                  </span>
                </div>

                {/* Preparation Notes */}
                {item.notes && (
                  <div className="p-2.5 rounded-2xl bg-muted/60 text-xs text-foreground/80 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-primary">
                        {lang === "ar" ? "تعليمات التحضير: " : "Preparation notes: "}
                      </span>
                      <span>{item.notes}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ADD / EDIT APPOINTMENT MODAL */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <form
            onSubmit={handleSave}
            className="glass-strong rounded-3xl p-5 max-w-md w-full space-y-4 border border-primary/30 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-primary text-base">
                  {editingApp
                    ? lang === "ar"
                      ? "تعديل الموعد الطبي"
                      : "Edit Medical Appointment"
                    : lang === "ar"
                      ? "جدولة موعد أو فحص جديد"
                      : "Schedule Appointment or Exam"}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="w-8 h-8 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {/* Type selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                {lang === "ar" ? "نوع الموعد أو الفحص *" : "Appointment / Exam Type *"}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AppointmentType)}
                className="w-full bg-white/80 dark:bg-black/40 rounded-xl px-3 py-2 text-xs border border-primary/20 focus:border-primary"
              >
                {APPOINTMENT_TYPES.map((t) => (
                  <option key={t.type} value={t.type}>
                    {lang === "ar" ? t.label_ar : t.label_en}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                {lang === "ar" ? "عنوان الموعد / الفحص *" : "Title / Purpose *"}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  lang === "ar"
                    ? "مثال: تصوير الماموغرام الدوري، مراجعة طبيب الأورام"
                    : "e.g., Annual Mammogram, Oncology Consultation"
                }
                className="w-full bg-white/80 dark:bg-black/40 rounded-xl px-3 py-2 text-xs border border-primary/20 focus:border-primary"
              />
            </div>

            {/* Specialist & Specialty */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  {lang === "ar" ? "اسم الطبيب / الأخصائي *" : "Specialist Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={specialistName}
                  onChange={(e) => setSpecialistName(e.target.value)}
                  placeholder={lang === "ar" ? "د. سارة عثمان" : "Dr. Sarah Osman"}
                  className="w-full bg-white/80 dark:bg-black/40 rounded-xl px-3 py-2 text-xs border border-primary/20 focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  {lang === "ar" ? "التخصص / القسم" : "Specialty / Department"}
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder={lang === "ar" ? "أورام طبية، أشعة..." : "Oncology, Radiology..."}
                  className="w-full bg-white/80 dark:bg-black/40 rounded-xl px-3 py-2 text-xs border border-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                {lang === "ar"
                  ? "المستشفى / المركز الطبي والعنوان *"
                  : "Hospital / Clinic Location *"}
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={
                  lang === "ar"
                    ? "مستشفى الأورام المركزي - الطابق الثاني، عيادة 4"
                    : "Central Oncology Center - 2nd floor, clinic 4"
                }
                className="w-full bg-white/80 dark:bg-black/40 rounded-xl px-3 py-2 text-xs border border-primary/20 focus:border-primary"
              />
            </div>

            {/* Date and Time (Africa/Algiers timezone context) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  {lang === "ar" ? "التاريخ *" : "Date *"}
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/80 dark:bg-black/40 rounded-xl px-2 py-2 text-xs border border-primary/20 tabular-nums num-en"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  {lang === "ar" ? "الوقت *" : "Time *"}
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-white/80 dark:bg-black/40 rounded-xl px-2 py-2 text-xs border border-primary/20 tabular-nums num-en"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Reminder Setting */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                {lang === "ar" ? "إعداد التنبيه والتذكير الذكي:" : "Smart Reminder Timing:"}
              </label>
              <select
                value={reminderTiming}
                onChange={(e) =>
                  setReminderTiming(
                    e.target.value as
                      "1_day_before" | "2_hours_before" | "1_hour_before" | "on_time",
                  )
                }
                className="w-full bg-white/80 dark:bg-black/40 rounded-xl px-3 py-2 text-xs border border-primary/20 focus:border-primary"
              >
                <option value="1_day_before">
                  {lang === "ar"
                    ? "قبل الموعد بيوم واحد (الساعة 09:00 صباحاً)"
                    : "1 day before (at 09:00 AM)"}
                </option>
                <option value="2_hours_before">
                  {lang === "ar" ? "قبل الموعد بساعتين" : "2 hours before"}
                </option>
                <option value="1_hour_before">
                  {lang === "ar" ? "قبل الموعد بساعة واحدة" : "1 hour before"}
                </option>
                <option value="on_time">
                  {lang === "ar" ? "في نفس وقت الموعد تماماً" : "Exactly at appointment time"}
                </option>
              </select>
            </div>

            {/* Preparation Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                {lang === "ar"
                  ? "تعليمات التحضير الخاصة (صيام، إحضار الفحوصات السابقة...):"
                  : "Preparation instructions (e.g. fasting, prior scans):"}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder={
                  lang === "ar"
                    ? "الصيام لمدة 8 ساعات قبل التحليل، إحضار قرص الأشعة المقطعية السابقة..."
                    : "Fasting for 8 hours before lab draw, bring CD of prior CT scans..."
                }
                className="w-full bg-white/80 dark:bg-black/40 rounded-xl px-3 py-2 text-xs border border-primary/20 focus:border-primary"
              />
            </div>

            {/* Form actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="glass py-2.5 rounded-2xl text-xs font-bold text-muted-foreground"
              >
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="submit"
                className="gradient-neon text-primary-foreground py-2.5 rounded-2xl text-xs font-bold neon-glow shadow-md hover:scale-[1.02] transition"
              >
                {editingApp
                  ? lang === "ar"
                    ? "حفظ التعديلات"
                    : "Save Changes"
                  : lang === "ar"
                    ? "تأكيد وجدولة الموعد"
                    : "Schedule Appointment"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
