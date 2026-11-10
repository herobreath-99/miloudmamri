import { useState, useEffect } from "react";
import {
  Pill,
  Plus,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  RotateCcw,
  ShieldCheck,
  FileText,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import {
  getMedications,
  saveMedication,
  discontinueMedication,
  reactivateMedication,
  deleteMedication,
  getMedDoseLogs,
  logMedDose,
  todayISO,
  type Medication,
  type MedicationDoseLog,
} from "@/lib/local-db";

export function MedicationManager() {
  const { lang } = useI18n();
  const [activeTab, setActiveTab] = useState<"today" | "active" | "history">("today");
  const [meds, setMeds] = useState<Medication[]>([]);
  const [doseLogs, setDoseLogs] = useState<MedicationDoseLog[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Once daily");
  const [times, setTimes] = useState<string[]>(["09:00"]);
  const [startDate, setStartDate] = useState(todayISO());
  const [hasEndDate, setHasEndDate] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [notes, setNotes] = useState("");

  // Discontinue dialog state
  const [discontinueTarget, setDiscontinueTarget] = useState<Medication | null>(null);
  const [discontinueReason, setDiscontinueReason] = useState("");

  const refreshData = () => {
    setMeds(getMedications());
    setDoseLogs(getMedDoseLogs(todayISO()));
  };

  useEffect(() => {
    refreshData();
    const handleMedChange = () => refreshData();
    window.addEventListener("pinkcare:medications", handleMedChange);
    window.addEventListener("pinkcare:med-doses", handleMedChange);
    return () => {
      window.removeEventListener("pinkcare:medications", handleMedChange);
      window.removeEventListener("pinkcare:med-doses", handleMedChange);
    };
  }, []);

  const openAddDialog = () => {
    setEditingMed(null);
    setName("");
    setDosage("");
    setFrequency(lang === "ar" ? "مرة يوميًا" : "Once daily");
    setTimes(["09:00"]);
    setStartDate(todayISO());
    setHasEndDate(false);
    setEndDate("");
    setInstructions("");
    setUserConfirmed(false);
    setNotes("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (med: Medication) => {
    setEditingMed(med);
    setName(med.name);
    setDosage(med.dosage);
    setFrequency(med.frequency);
    setTimes(med.times.length > 0 ? med.times : ["09:00"]);
    setStartDate(med.startDate);
    setHasEndDate(!!med.endDate);
    setEndDate(med.endDate ?? "");
    setInstructions(med.instructions);
    setUserConfirmed(med.userConfirmed);
    setNotes(med.notes ?? "");
    setIsDialogOpen(true);
  };

  const handleAddTime = () => {
    if (times.length < 6) {
      setTimes([...times, "14:00"]);
    }
  };

  const handleRemoveTime = (index: number) => {
    if (times.length > 1) {
      setTimes(times.filter((_, i) => i !== index));
    }
  };

  const handleTimeChange = (index: number, val: string) => {
    const next = [...times];
    next[index] = val;
    setTimes(next);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(
        lang === "ar" ? "يرجى إدخال اسم الدواء بدقة" : "Please enter the exact medication name",
      );
      return;
    }
    if (!dosage.trim()) {
      toast.error(
        lang === "ar"
          ? "يرجى إدخال الجرعة الموصوفة بدقة"
          : "Please enter the exact prescribed dosage",
      );
      return;
    }
    if (!userConfirmed) {
      toast.error(
        lang === "ar"
          ? "يجب تأكيد أن البيانات مطابقة لتعليمات الطبيب المعالج"
          : "You must confirm the details match your doctor's instructions",
      );
      return;
    }

    saveMedication({
      id: editingMed?.id,
      name: name.trim(),
      dosage: dosage.trim(),
      frequency,
      times,
      startDate,
      endDate: hasEndDate && endDate ? endDate : null,
      instructions: instructions.trim(),
      userConfirmed: true,
      status: editingMed ? editingMed.status : "active",
      notes: notes.trim() || null,
    });

    toast.success(
      editingMed
        ? lang === "ar"
          ? "تم تحديث خطة الدواء بنجاح"
          : "Medication plan updated"
        : lang === "ar"
          ? "تمت إضافة الدواء بنجاح"
          : "Medication added successfully",
    );
    setIsDialogOpen(false);
  };

  const confirmDiscontinue = () => {
    if (!discontinueTarget) return;
    discontinueMedication(discontinueTarget.id, discontinueReason.trim() || undefined);
    toast.info(lang === "ar" ? "تم إيقاف خطة الدواء ونقلها للسجل" : "Medication plan discontinued");
    setDiscontinueTarget(null);
    setDiscontinueReason("");
  };

  const handleReactivate = (id: string) => {
    reactivateMedication(id);
    toast.success(lang === "ar" ? "تمت إعادة تفعيل الدواء" : "Medication reactivated");
  };

  const handleDelete = (id: string) => {
    deleteMedication(id);
    toast.success(lang === "ar" ? "تم حذف الدواء" : "Medication deleted");
  };

  const toggleDoseTaken = (med: Medication, time: string) => {
    const today = todayISO();
    const existing = doseLogs.find(
      (l) => l.medicationId === med.id && l.scheduledTime === time && l.scheduledDate === today,
    );
    if (existing && existing.status === "taken") {
      logMedDose(med.id, time, "skipped", today);
      toast.info(lang === "ar" ? "تم إلغاء تسجيل الجرعة" : "Dose marked as not taken");
    } else {
      logMedDose(med.id, time, "taken", today);
      toast.success(
        lang === "ar"
          ? `تم تناول جرعة ${med.name} (${time}) بنجاح 💗`
          : `Logged dose for ${med.name} (${time}) 💗`,
      );
    }
  };

  const activeMeds = meds.filter((m) => m.status === "active");
  const discontinuedMeds = meds.filter((m) => m.status === "discontinued");

  return (
    <div className="space-y-4">
      {/* Top action header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary">
              {lang === "ar" ? "إدارة الأدوية الموصوفة" : "Prescribed Medications"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {lang === "ar"
                ? "متابعة دقيقة للجرعات المعتمدة من فريقكِ الطبي"
                : "Exact tracking of your confirmed healthcare plan"}
            </p>
          </div>
        </div>
        <button
          onClick={openAddDialog}
          className="gradient-neon text-primary-foreground text-xs font-bold px-3 py-2 rounded-2xl flex items-center gap-1 neon-glow shadow-sm hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === "ar" ? "إضافة دواء" : "Add Med"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="glass rounded-full p-1 grid grid-cols-3 gap-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab("today")}
          className={`py-2 rounded-full transition-all ${
            activeTab === "today"
              ? "gradient-neon text-primary-foreground neon-glow shadow-sm"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          {lang === "ar" ? "جرعات اليوم" : "Today's Doses"}
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`py-2 rounded-full transition-all ${
            activeTab === "active"
              ? "gradient-neon text-primary-foreground neon-glow shadow-sm"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          {lang === "ar"
            ? `الأدوية النشطة (${activeMeds.length})`
            : `Active (${activeMeds.length})`}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`py-2 rounded-full transition-all ${
            activeTab === "history"
              ? "gradient-neon text-primary-foreground neon-glow shadow-sm"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          {lang === "ar"
            ? `سجل الأدوية (${discontinuedMeds.length})`
            : `History (${discontinuedMeds.length})`}
        </button>
      </div>

      {/* TAB 1: TODAY'S DOSES */}
      {activeTab === "today" && (
        <div className="space-y-3">
          {activeMeds.length === 0 ? (
            <div className="glass rounded-3xl p-6 text-center space-y-3">
              <Pill className="w-10 h-10 text-primary/40 mx-auto" />
              <p className="text-sm font-semibold text-primary">
                {lang === "ar"
                  ? "لا توجد أدوية مسجلة حاليًا"
                  : "No active medications recorded yet"}
              </p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                {lang === "ar"
                  ? "أضيفي أدويتكِ المعتمدة من طبيبكِ المعالج لمتابعة مواعيد تناولها بدقة وتلقي التذكيرات."
                  : "Add your confirmed prescribed medications to track intake times and receive reminders."}
              </p>
              <button
                onClick={openAddDialog}
                className="gradient-neon text-primary-foreground text-xs font-bold px-4 py-2 rounded-full neon-glow inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === "ar" ? "إضافة أول دواء" : "Add first medication"}</span>
              </button>
            </div>
          ) : (
            activeMeds.map((med) => (
              <div
                key={med.id}
                className="glass rounded-3xl p-4 space-y-3 border border-primary/20"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary text-base">{med.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-bold tabular-nums num-en">
                        {med.dosage}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{med.frequency}</p>
                  </div>
                  <span className="text-[11px] text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {lang === "ar" ? "موصوف طبياً" : "Prescribed"}
                  </span>
                </div>

                {med.instructions && (
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">
                        {lang === "ar" ? "تعليمات الطبيب: " : "Doctor's instructions: "}
                      </span>
                      <span>{med.instructions}</span>
                    </div>
                  </div>
                )}

                {/* Dose checkpoints for today */}
                <div className="space-y-2 pt-1 border-t border-border/40">
                  <p className="text-xs font-bold text-muted-foreground">
                    {lang === "ar" ? "مواعيد الجرعات لليوم:" : "Today's scheduled doses:"}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {med.times.map((time) => {
                      const dose = doseLogs.find(
                        (l) =>
                          l.medicationId === med.id &&
                          l.scheduledTime === time &&
                          l.scheduledDate === todayISO(),
                      );
                      const isTaken = dose?.status === "taken";

                      return (
                        <button
                          key={time}
                          onClick={() => toggleDoseTaken(med, time)}
                          className={`p-2.5 rounded-2xl border flex items-center justify-between transition-all ${
                            isTaken
                              ? "bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                              : "glass hover:border-primary/50 text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 opacity-70" />
                            <span className="text-xs font-bold tabular-nums num-en" dir="ltr">
                              {time}
                            </span>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                              isTaken
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-muted-foreground/40"
                            }`}
                          >
                            {isTaken && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: ACTIVE MEDICATIONS */}
      {activeTab === "active" && (
        <div className="space-y-3">
          {activeMeds.length === 0 ? (
            <div className="glass rounded-3xl p-6 text-center text-sm text-muted-foreground">
              {lang === "ar" ? "لا توجد أدوية نشطة" : "No active medications"}
            </div>
          ) : (
            activeMeds.map((med) => (
              <div
                key={med.id}
                className="glass rounded-3xl p-4 space-y-3 border border-primary/20"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-primary text-base">{med.name}</h4>
                    <p className="text-xs font-bold text-foreground/80 mt-0.5">
                      {lang === "ar" ? "الجرعة المقررة:" : "Prescribed Dose:"}{" "}
                      <span className="tabular-nums num-en text-primary">{med.dosage}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{med.frequency}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditDialog(med)}
                      className="w-8 h-8 rounded-full glass flex items-center justify-center text-primary hover:neon-glow"
                      title={lang === "ar" ? "تعديل" : "Edit"}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDiscontinueTarget(med)}
                      className="w-8 h-8 rounded-full glass flex items-center justify-center text-amber-600 hover:neon-glow"
                      title={lang === "ar" ? "إيقاف الخطة" : "Discontinue plan"}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1 border-t border-border/40">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>
                      {lang === "ar" ? "البدء:" : "Start:"}{" "}
                      <span className="tabular-nums num-en" dir="ltr">
                        {med.startDate}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>
                      {lang === "ar" ? "الانتهاء:" : "End:"}{" "}
                      <span className="tabular-nums num-en" dir="ltr">
                        {med.endDate || (lang === "ar" ? "مستمر" : "Ongoing")}
                      </span>
                    </span>
                  </div>
                </div>

                {med.instructions && (
                  <div className="p-2.5 rounded-2xl bg-muted/60 text-xs text-foreground/80 flex items-start gap-2">
                    <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-primary">
                        {lang === "ar" ? "تعليمات الاستخدام: " : "Directions: "}
                      </span>
                      <span>{med.instructions}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: DISCONTINUED / HISTORY */}
      {activeTab === "history" && (
        <div className="space-y-3">
          {discontinuedMeds.length === 0 ? (
            <div className="glass rounded-3xl p-6 text-center text-sm text-muted-foreground">
              {lang === "ar"
                ? "لا توجد أدوية متوقفة في السجل"
                : "No discontinued medications in history"}
            </div>
          ) : (
            discontinuedMeds.map((med) => (
              <div
                key={med.id}
                className="glass rounded-3xl p-4 space-y-2 opacity-80 hover:opacity-100 transition border border-muted"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-foreground text-sm line-through">{med.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {lang === "ar" ? "الجرعة السابقة:" : "Previous Dose:"}{" "}
                      <span className="tabular-nums num-en">{med.dosage}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleReactivate(med.id)}
                      className="w-8 h-8 rounded-full glass flex items-center justify-center text-emerald-600 hover:neon-glow"
                      title={lang === "ar" ? "إعادة تفعيل" : "Reactivate"}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(med.id)}
                      className="w-8 h-8 rounded-full glass flex items-center justify-center text-destructive hover:neon-glow"
                      title={lang === "ar" ? "حذف نهائي" : "Delete"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {med.discontinuedReason && (
                  <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2 rounded-xl">
                    <span className="font-bold">
                      {lang === "ar" ? "سبب الإيقاف: " : "Discontinue reason: "}
                    </span>
                    {med.discontinuedReason}
                  </p>
                )}

                <p className="text-[11px] text-muted-foreground">
                  {lang === "ar" ? "تاريخ الإيقاف:" : "Discontinued on:"}{" "}
                  <span className="tabular-nums num-en" dir="ltr">
                    {med.discontinuedDate}
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* DISCONTINUE CONFIRMATION MODAL */}
      {discontinueTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-strong rounded-3xl p-6 max-w-sm w-full space-y-4 border border-amber-500/30">
            <div className="w-12 h-12 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-bold text-base text-primary">
                {lang === "ar" ? "إيقاف خطة الدواء" : "Discontinue Medication Plan"}
              </h4>
              <p className="text-xs text-muted-foreground">
                {lang === "ar"
                  ? `هل ترغبين بإيقاف خطة دواء "${discontinueTarget.name}"؟ سيبقى الدواء محفوظاً في سجلكِ الطبي.`
                  : `Are you sure you want to discontinue "${discontinueTarget.name}"? It will remain saved in your history.`}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">
                {lang === "ar"
                  ? "سبب الإيقاف (اختياري، مثلاً: انتهاء الكورس العلاجي):"
                  : "Reason (optional):"}
              </label>
              <input
                type="text"
                value={discontinueReason}
                onChange={(e) => setDiscontinueReason(e.target.value)}
                placeholder={
                  lang === "ar" ? "مثال: بناءً على تعليمات الطبيب" : "e.g., Per doctor's order"
                }
                className="w-full bg-white/70 dark:bg-black/40 rounded-xl px-3 py-2 text-xs border border-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDiscontinueTarget(null)}
                className="glass py-2 rounded-xl text-xs font-bold text-muted-foreground"
              >
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={confirmDiscontinue}
                className="bg-amber-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-amber-700"
              >
                {lang === "ar" ? "تأكيد الإيقاف" : "Discontinue"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MEDICATION MODAL */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <form
            onSubmit={handleSave}
            className="glass-strong rounded-3xl p-5 max-w-md w-full space-y-4 border border-primary/30 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-primary text-base">
                  {editingMed
                    ? lang === "ar"
                      ? "تعديل خطة الدواء"
                      : "Edit Medication Plan"
                    : lang === "ar"
                      ? "إضافة خطة دواء جديدة"
                      : "Add New Medication Plan"}
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

            {/* Strict Safety Notice */}
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-foreground/80 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === "ar" ? "إرشادات السلامة الطبية:" : "Medical Safety Note:"}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {lang === "ar"
                  ? "يجب إدخال اسم الدواء والجرعة والمواعيد بدقة تامة كما وصفها طبيبكِ المعالج. تطبيق PinkCare لا يستنتج الجرعات تلقائياً."
                  : "Please enter the exact name, prescribed dosage, and schedule confirmed by your care team. PinkCare never automatically infers dosages."}
              </p>
            </div>

            {/* Exact Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                {lang === "ar" ? "اسم الدواء الدقيق *" : "Exact Medication Name *"}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === "ar" ? "مثال: تاموكسيفين (Tamoxifen)" : "e.g., Tamoxifen"}
                className="w-full bg-white/80 dark:bg-black/40 rounded-xl px-3 py-2 text-xs border border-primary/20 focus:border-primary"
              />
            </div>

            {/* Exact Dosage */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                {lang === "ar" ? "الجرعة المقررة من الطبيب *" : "Exact Prescribed Dosage *"}
              </label>
              <input
                type="text"
                required
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder={lang === "ar" ? "مثال: 20 ملغ (قرص واحد)" : "e.g., 20 mg (1 tablet)"}
                className="w-full bg-white/80 dark:bg-black/40 rounded-xl px-3 py-2 text-xs border border-primary/20 focus:border-primary tabular-nums num-en"
              />
            </div>

            {/* Frequency */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                {lang === "ar" ? "التكرار اليومي *" : "Frequency *"}
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-white/80 dark:bg-black/40 rounded-xl px-3 py-2 text-xs border border-primary/20 focus:border-primary"
              >
                <option value={lang === "ar" ? "مرة يوميًا" : "Once daily"}>
                  {lang === "ar" ? "مرة يوميًا" : "Once daily"}
                </option>
                <option value={lang === "ar" ? "مرتان يوميًا" : "Twice daily"}>
                  {lang === "ar" ? "مرتان يوميًا" : "Twice daily"}
                </option>
                <option value={lang === "ar" ? "3 مرات يوميًا" : "3 times daily"}>
                  {lang === "ar" ? "3 مرات يوميًا" : "3 times daily"}
                </option>
                <option value={lang === "ar" ? "كل 8 ساعات" : "Every 8 hours"}>
                  {lang === "ar" ? "كل 8 ساعات" : "Every 8 hours"}
                </option>
                <option value={lang === "ar" ? "عند اللزوم" : "As needed"}>
                  {lang === "ar" ? "عند اللزوم" : "As needed"}
                </option>
              </select>
            </div>

            {/* Times */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">
                  {lang === "ar" ? "مواعيد التناول اليومية:" : "Administration Times:"}
                </label>
                {times.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddTime}
                    className="text-[11px] font-bold text-primary flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {lang === "ar" ? "إضافة موعد" : "Add time"}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {times.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 bg-white/60 dark:bg-black/30 p-1.5 rounded-xl border border-primary/20"
                  >
                    <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                    <input
                      type="time"
                      value={t}
                      onChange={(e) => handleTimeChange(idx, e.target.value)}
                      className="w-full bg-transparent text-xs tabular-nums num-en"
                      dir="ltr"
                    />
                    {times.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTime(idx)}
                        className="text-muted-foreground hover:text-destructive text-xs px-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Start and End Date */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  {lang === "ar" ? "تاريخ البدء *" : "Start Date *"}
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white/80 dark:bg-black/40 rounded-xl px-2 py-2 text-xs border border-primary/20 tabular-nums num-en"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">
                    {lang === "ar" ? "تاريخ الانتهاء" : "End Date"}
                  </label>
                  <label className="flex items-center gap-1 text-[10px] text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasEndDate}
                      onChange={(e) => setHasEndDate(e.target.checked)}
                      className="rounded accent-primary"
                    />
                    <span>{lang === "ar" ? "محدد" : "Set date"}</span>
                  </label>
                </div>
                {hasEndDate ? (
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white/80 dark:bg-black/40 rounded-xl px-2 py-2 text-xs border border-primary/20 tabular-nums num-en"
                    dir="ltr"
                  />
                ) : (
                  <div className="p-2 text-xs text-muted-foreground bg-white/40 dark:bg-black/20 rounded-xl text-center">
                    {lang === "ar" ? "علاج مستمر" : "Ongoing treatment"}
                  </div>
                )}
              </div>
            </div>

            {/* Healthcare Professional Instructions */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                {lang === "ar"
                  ? "تعليمات الفريق الطبي المعالج (مثل: بعد الوجبة، مع كوب ماء كامل):"
                  : "Healthcare professional instructions (e.g. take with meals):"}
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
                placeholder={
                  lang === "ar"
                    ? "يؤخذ يومياً بعد وجبة الإفطار مع كوب ماء وفير..."
                    : "Take once daily in the morning after breakfast with a full glass of water..."
                }
                className="w-full bg-white/80 dark:bg-black/40 rounded-xl px-3 py-2 text-xs border border-primary/20 focus:border-primary"
              />
            </div>

            {/* Personal Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">
                {lang === "ar" ? "ملاحظات إضافية (اختياري):" : "Personal Notes (optional):"}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  lang === "ar" ? "رقم الوصفة، صيدلية الصرف..." : "Prescription number, pharmacy..."
                }
                className="w-full bg-white/80 dark:bg-black/40 rounded-xl px-3 py-1.5 text-xs border border-primary/20"
              />
            </div>

            {/* MANDATORY CONFIRMATION CHECKBOX */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={userConfirmed}
                  onChange={(e) => setUserConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-primary shrink-0"
                />
                <span className="text-xs font-bold text-amber-950 dark:text-amber-200 leading-snug">
                  {lang === "ar"
                    ? "أؤكد أن اسم هذا الدواء وجرعته ومواعيد تناوله قد تم وصفها وتأكيدها لي مباشرة من قبل طبيبي المعالج أو فريقي الطبي."
                    : "I confirm that this medication name, dosage, and administration schedule were directly prescribed and confirmed by my physician or care team."}
                </span>
              </label>
            </div>

            {/* Form Buttons */}
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
                disabled={!userConfirmed}
                className={`py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  userConfirmed
                    ? "gradient-neon text-primary-foreground neon-glow shadow-md hover:scale-[1.02]"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                }`}
              >
                {editingMed
                  ? lang === "ar"
                    ? "حفظ التعديلات"
                    : "Save Changes"
                  : lang === "ar"
                    ? "حفظ الخطة المعتمدة"
                    : "Save Confirmed Plan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
