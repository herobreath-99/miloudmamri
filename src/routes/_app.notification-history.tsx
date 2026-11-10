import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  BellOff,
  ChevronRight,
  CheckCircle2,
  Clock,
  Dumbbell,
  Heart,
  Pill,
  Calendar,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  getNotifLog,
  getMoods,
  getCompletedExercises,
  getReminders,
  getMedDoseLogs,
  getAppointments,
  DEFAULT_TIMEZONE,
  type MedicationDoseLog,
  type MedicalAppointment,
} from "@/lib/local-db";

export const Route = createFileRoute("/_app/notification-history")({
  component: NotificationHistoryPage,
});

type NotifRow = {
  id: string;
  category: string;
  title: string;
  body: string;
  status: string;
  fired_at: string;
};
type MoodRow = { id: string; mood: string; logged_at: string };
type ExRow = { id: string; exercise_key: string; completed_at: string };
type ReminderRow = { id: string; reminder_key: string; completed_at: string };

type Item =
  | { kind: "notif"; at: Date; row: NotifRow }
  | { kind: "mood"; at: Date; row: MoodRow }
  | { kind: "exercise"; at: Date; row: ExRow }
  | { kind: "reminder"; at: Date; row: ReminderRow }
  | { kind: "med_dose"; at: Date; row: MedicationDoseLog }
  | { kind: "appointment"; at: Date; row: MedicalAppointment };

const STATUS_META: Record<
  string,
  { ar: string; dz: string; fr: string; en: string; cls: string; Icon: typeof CheckCircle2 }
> = {
  sent: {
    ar: "تم الاستلام",
    dz: "وصل الإشعار",
    fr: "Reçu",
    en: "Received",
    cls: "bg-primary/15 text-primary",
    Icon: Bell,
  },
  done: {
    ar: "تم الإنجاز",
    dz: "كملتيها يعطيك الصحة",
    fr: "Complété",
    en: "Completed",
    cls: "bg-emerald-500/15 text-emerald-600",
    Icon: CheckCircle2,
  },
  snoozed: {
    ar: "تم التأجيل",
    dz: "أجّلتيه لشويا",
    fr: "Reporté",
    en: "Snoozed",
    cls: "bg-amber-500/15 text-amber-600",
    Icon: Clock,
  },
  dismissed: {
    ar: "تم الرفض",
    dz: "مسحتيه",
    fr: "Ignoré",
    en: "Dismissed",
    cls: "bg-destructive/15 text-destructive",
    Icon: XCircle,
  },
  opened: {
    ar: "تم الفتح",
    dz: "فتحتيه",
    fr: "Ouvert",
    en: "Opened",
    cls: "bg-accent/40 text-accent-foreground",
    Icon: Sparkles,
  },
};

function NotificationHistoryPage() {
  const { lang } = useI18n();
  const [notifs, setNotifs] = useState<NotifRow[]>([]);
  const [moods, setMoods] = useState<MoodRow[]>([]);
  const [exercises, setExercises] = useState<ExRow[]>([]);
  const [reminders, setReminders] = useState<ReminderRow[]>([]);
  const [medDoses, setMedDoses] = useState<MedicationDoseLog[]>([]);
  const [appointments, setAppointments] = useState<MedicalAppointment[]>([]);
  const [filter, setFilter] = useState<"all" | "sent" | "done" | "snoozed" | "dismissed">("all");

  useEffect(() => {
    const since = new Date(Date.now() - 7 * 86400000).toISOString();
    setNotifs(
      getNotifLog(since).map((n) => ({
        id: n.id,
        category: n.category,
        title: n.title,
        body: n.body,
        status: n.status,
        fired_at: n.at,
      })),
    );
    setMoods(getMoods(since).map((m) => ({ id: m.id, mood: m.mood, logged_at: m.at })));
    setExercises(
      getCompletedExercises(since).map((e) => ({
        id: e.id,
        exercise_key: e.key,
        completed_at: e.at,
      })),
    );
    setReminders(
      getReminders()
        .filter((r) => r.at >= since)
        .map((r, i) => ({
          id: `${r.key}-${r.date}-${i}`,
          reminder_key: r.key,
          completed_at: r.at,
        })),
    );
    setMedDoses(getMedDoseLogs());
    setAppointments(getAppointments());
  }, []);

  // Build day-grouped unified timeline
  const grouped = useMemo(() => {
    const items: Item[] = [
      ...notifs
        .filter((n) => filter === "all" || n.status === filter)
        .map((n) => ({ kind: "notif" as const, at: new Date(n.fired_at), row: n })),
      ...moods.map((m) => ({ kind: "mood" as const, at: new Date(m.logged_at), row: m })),
      ...exercises.map((e) => ({
        kind: "exercise" as const,
        at: new Date(e.completed_at),
        row: e,
      })),
      ...reminders.map((r) => ({
        kind: "reminder" as const,
        at: new Date(r.completed_at),
        row: r,
      })),
      ...medDoses
        .filter((d) => d.takenAt)
        .map((d) => ({
          kind: "med_dose" as const,
          at: new Date(d.takenAt!),
          row: d,
        })),
      ...appointments.map((a) => ({
        kind: "appointment" as const,
        at: new Date(`${a.date}T${a.time}:00`),
        row: a,
      })),
    ];
    items.sort((a, b) => b.at.getTime() - a.at.getTime());
    const days = new Map<string, Item[]>();
    for (const it of items) {
      const key = it.at.toISOString().slice(0, 10);
      if (!days.has(key)) days.set(key, []);
      days.get(key)!.push(it);
    }
    return Array.from(days.entries());
  }, [notifs, moods, exercises, reminders, medDoses, appointments, filter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { sent: 0, done: 0, snoozed: 0, dismissed: 0 };
    for (const n of notifs) if (n.status in c) c[n.status]++;
    return c;
  }, [notifs]);

  const fmtTime = (d: Date) =>
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: DEFAULT_TIMEZONE,
    });

  const fmtDay = (key: string) => {
    const d = new Date(key);
    const today = new Date().toISOString().slice(0, 10);
    const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (key === today) {
      return lang === "dz"
        ? "اليوم"
        : lang === "ar"
          ? "اليوم"
          : lang === "fr"
            ? "Aujourd'hui"
            : "Today";
    }
    if (key === yest) {
      return lang === "dz"
        ? "البارح"
        : lang === "ar"
          ? "أمس"
          : lang === "fr"
            ? "Hier"
            : "Yesterday";
    }
    return d.toLocaleDateString(lang === "fr" ? "fr-FR" : lang === "en" ? "en" : "ar-u-nu-latn", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-center justify-between">
        <Link to="/notifications" className="text-primary text-sm font-medium">
          <ChevronRight className="w-5 h-5 inline" />
        </Link>
        <h1 className="text-xl font-bold text-gradient">
          {lang === "dz"
            ? "السجل تاع الإشعارات والأنشطة"
            : lang === "ar"
              ? "سجل الإشعارات والأنشطة"
              : lang === "fr"
                ? "Historique des notifications"
                : "Notifications & Activity History"}
        </h1>
        <span className="w-5" />
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-4 gap-2">
        {(["sent", "done", "snoozed", "dismissed"] as const).map((s) => {
          const meta = STATUS_META[s];
          const Icon = meta.Icon;
          const active = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(active ? "all" : s)}
              className={`glass rounded-2xl p-3 text-center transition-all ${
                active ? "neon-glow ring-2 ring-primary" : ""
              }`}
            >
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${meta.cls}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold mt-1 tabular-nums num-en">{counts[s]}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{meta[lang]}</p>
            </button>
          );
        })}
      </div>

      {filter !== "all" && (
        <button
          onClick={() => setFilter("all")}
          className="text-xs text-primary font-bold mx-auto block hover:underline"
        >
          {lang === "dz"
            ? "بيني قاع"
            : lang === "ar"
              ? "إظهار الكل"
              : lang === "fr"
                ? "Tout afficher"
                : "Show all"}
        </button>
      )}

      {grouped.length === 0 && (
        <div className="glass rounded-3xl p-8 text-center space-y-2">
          <BellOff className="w-10 h-10 text-primary/40 mx-auto" />
          <p className="text-sm text-muted-foreground">
            {lang === "dz"
              ? "ماكاين حتى نشاط مسجل لحد الآن"
              : lang === "ar"
                ? "لا توجد أحداث مسجلة بعد"
                : lang === "fr"
                  ? "Aucun événement enregistré"
                  : "No recorded events yet"}
          </p>
        </div>
      )}

      {grouped.map(([day, items]) => (
        <div key={day} className="space-y-2">
          <h2 className="text-sm font-bold text-primary px-1 sticky top-0 backdrop-blur-md py-1 z-10">
            {fmtDay(day)}
          </h2>
          <div className="relative ps-5">
            <div className="absolute top-0 bottom-0 start-2 w-px bg-gradient-to-b from-primary/40 to-transparent" />
            <div className="space-y-2">
              {items.map((it, idx) => (
                <TimelineItem
                  key={`${it.kind}-${idx}-${it.at.getTime()}`}
                  item={it}
                  lang={lang}
                  time={fmtTime(it.at)}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineItem({
  item,
  lang,
  time,
}: {
  item: Item;
  lang: "ar" | "dz" | "fr" | "en";
  time: string;
}) {
  if (item.kind === "notif") {
    const meta = STATUS_META[item.row.status] ?? STATUS_META.sent;
    const Icon = meta.Icon;
    return (
      <div className="glass rounded-2xl p-3 flex items-start gap-3 animate-page-enter border border-primary/10">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${meta.cls}`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold text-sm text-primary truncate">{item.row.title}</p>
            <span
              className="text-[10px] text-muted-foreground shrink-0 tabular-nums num-en"
              dir="ltr"
            >
              {time}
            </span>
          </div>
          {item.row.body && (
            <p className="text-xs text-foreground/80 mt-0.5 line-clamp-2 leading-relaxed">
              {item.row.body}
            </p>
          )}
          <span
            className={`inline-flex items-center gap-1 mt-1 text-[10px] px-2 py-0.5 rounded-full ${meta.cls}`}
          >
            {meta[lang]}
          </span>
        </div>
      </div>
    );
  }

  if (item.kind === "med_dose") {
    return (
      <ActivityRow
        Icon={Pill}
        time={time}
        title={
          lang === "dz"
            ? "شربتي الجرعة تاع الدوا"
            : lang === "ar"
              ? "جرعة دواء مسجلة"
              : lang === "fr"
                ? "Dose enregistrée"
                : "Medication dose taken"
        }
        sub={`${item.row.medicationName} (${item.row.dosage})`}
        tone="text-purple-600 bg-purple-500/15"
      />
    );
  }

  if (item.kind === "appointment") {
    return (
      <ActivityRow
        Icon={Calendar}
        time={time}
        title={
          lang === "dz"
            ? "رونديفو تاع الطبيب"
            : lang === "ar"
              ? "موعد طبي"
              : lang === "fr"
                ? "Rendez-vous médical"
                : "Medical appointment"
        }
        sub={`${item.row.title} - ${item.row.specialistName} (${item.row.location})`}
        tone="text-blue-600 bg-blue-500/15"
      />
    );
  }

  if (item.kind === "mood") {
    return (
      <ActivityRow
        Icon={Heart}
        time={time}
        title={
          lang === "dz"
            ? "تسجيل المورال والمشاعر"
            : lang === "ar"
              ? "تسجيل المزاج"
              : lang === "fr"
                ? "Humeur enregistrée"
                : "Mood logged"
        }
        sub={item.row.mood}
        tone="text-pink-500 bg-pink-500/15"
      />
    );
  }

  if (item.kind === "exercise") {
    return (
      <ActivityRow
        Icon={Dumbbell}
        time={time}
        title={
          lang === "dz"
            ? "كملتي التمرين يعطيك الصحة"
            : lang === "ar"
              ? "تمرين مكتمل"
              : lang === "fr"
                ? "Exercice complété"
                : "Exercise completed"
        }
        sub={item.row.exercise_key}
        tone="text-emerald-600 bg-emerald-500/15"
      />
    );
  }

  return (
    <ActivityRow
      Icon={Activity}
      time={time}
      title={
        lang === "dz"
          ? "نشاط عناية تاع اليوم"
          : lang === "ar"
            ? "نشاط عناية يومي"
            : lang === "fr"
              ? "Soin quotidien"
              : "Daily care activity"
      }
      sub={item.row.reminder_key}
      tone="text-indigo-500 bg-indigo-500/15"
    />
  );
}

function ActivityRow({
  Icon,
  time,
  title,
  sub,
  tone,
}: {
  Icon: typeof Heart;
  time: string;
  title: string;
  sub: string;
  tone: string;
}) {
  return (
    <div className="glass rounded-2xl p-3 flex items-start gap-3 animate-page-enter">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${tone}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold text-sm truncate">{title}</p>
          <span
            className="text-[10px] text-muted-foreground shrink-0 tabular-nums num-en"
            dir="ltr"
          >
            {time}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{sub}</p>
      </div>
    </div>
  );
}
