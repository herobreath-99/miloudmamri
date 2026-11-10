// Local-only persistence layer for PinkCare.
// Everything lives in localStorage under the `pc_*` namespace.

export type LocalProfile = {
  id: string;
  first_name: string;
  last_name: string;
  age?: number | null;
  avatar_url?: string | null;
  city?: string | null;
  journey_start?: string | null; // ISO date
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

export const DEFAULT_TIMEZONE = "Africa/Algiers";

// ---------- Medication Types ----------
export type Medication = {
  id: string;
  name: string; // Exact medication name entered by user
  dosage: string; // Exact prescribed dosage (e.g. "20 mg", "1 tablet")
  frequency: string; // e.g. "Once daily", "Twice daily", "Custom"
  times: string[]; // Administration times (e.g. ["08:00", "20:00"])
  startDate: string; // YYYY-MM-DD
  endDate?: string | null; // YYYY-MM-DD or null if ongoing
  instructions: string; // Instructions explicitly provided by healthcare professional
  userConfirmed: boolean; // Explicit confirmation that details match prescription
  status: "active" | "discontinued";
  discontinuedDate?: string | null;
  discontinuedReason?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MedicationDoseLog = {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string; // "08:00"
  scheduledDate: string; // YYYY-MM-DD
  takenAt?: string | null;
  status: "taken" | "skipped" | "snoozed";
  notes?: string | null;
};

// ---------- Appointment & Examination Types ----------
export type AppointmentType =
  "doctor" | "oncology" | "examination" | "laboratory" | "imaging" | "follow_up";

export type MedicalAppointment = {
  id: string;
  type: AppointmentType;
  title: string; // e.g. "Oncology Consultation", "Mammography Screening"
  specialistName: string;
  specialty?: string;
  location: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (in Africa/Algiers timezone)
  notes?: string | null; // Preparation instructions
  reminderTiming: "1_day_before" | "2_hours_before" | "1_hour_before" | "on_time";
  status: "upcoming" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
};

const K = {
  profile: "pc_profile",
  reminders: "pc_daily_reminders", // [{key,date,at}]
  exercises: "pc_completed_exercises", // [{key,seconds,at}]
  moods: "pc_mood_logs", // [{mood,at,date,wellness?,energy?}]
  symptoms: "pc_symptoms",
  notifLog: "pc_notification_log", // [{id,category,title,body,status,at}]
  notifSettings: "pc_notification_settings",
  medications: "pc_medications",
  medDoseLogs: "pc_medication_dose_logs",
  appointments: "pc_appointments",
  pushSubscription: "pc_push_subscription",
  dispatchedDedupe: "pc_dispatched_dedupe_keys",
  exerciseApprovals: "pc_exercise_approvals",
  rehabPreferences: "pc_rehab_preferences",
  wellbeingActivities: "pc_wellbeing_activities",
};

function read<T>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or serialization errors
  }
}

export function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ---------- Profile ----------
export function getProfile(): LocalProfile | null {
  return read<LocalProfile | null>(K.profile, null);
}
export function saveProfile(p: Partial<LocalProfile>): LocalProfile {
  const existing = getProfile();
  const now = new Date().toISOString();
  const next: LocalProfile = {
    id: existing?.id ?? uuid(),
    first_name: p.first_name ?? existing?.first_name ?? "",
    last_name: p.last_name ?? existing?.last_name ?? "",
    age: p.age ?? existing?.age ?? null,
    avatar_url: p.avatar_url ?? existing?.avatar_url ?? null,
    city: p.city ?? existing?.city ?? null,
    journey_start: p.journey_start ?? existing?.journey_start ?? null,
    notes: p.notes ?? existing?.notes ?? null,
    created_at: existing?.created_at ?? now,
    updated_at: now,
  };
  write(K.profile, next);
  window.dispatchEvent(new CustomEvent("pinkcare:profile"));
  return next;
}
export function clearAllData() {
  if (typeof localStorage === "undefined") return;
  Object.values(K).forEach((k) => localStorage.removeItem(k));
  window.dispatchEvent(new CustomEvent("pinkcare:profile"));
}

// ---------- Reminders ----------
type Reminder = { key: string; date: string; at: string };
export function getReminders(date?: string): Reminder[] {
  const all = read<Reminder[]>(K.reminders, []);
  return date ? all.filter((r) => r.date === date) : all;
}
export function addReminder(key: string, date = todayISO()) {
  const all = read<Reminder[]>(K.reminders, []);
  if (all.some((r) => r.key === key && r.date === date)) return;
  all.push({ key, date, at: new Date().toISOString() });
  write(K.reminders, all);
}
export function removeReminder(key: string, date = todayISO()) {
  const all = read<Reminder[]>(K.reminders, []).filter((r) => !(r.key === key && r.date === date));
  write(K.reminders, all);
}
export function countRemindersSince(sinceISO: string): number {
  return read<Reminder[]>(K.reminders, []).filter((r) => r.at >= sinceISO).length;
}

// ---------- Exercises ----------
type Exercise = { id: string; key: string; seconds: number; at: string };
export function addCompletedExercise(key: string, seconds: number) {
  const all = read<Exercise[]>(K.exercises, []);
  all.push({ id: uuid(), key, seconds, at: new Date().toISOString() });
  write(K.exercises, all);
}
export function getCompletedExercises(sinceISO?: string): Exercise[] {
  const all = read<Exercise[]>(K.exercises, []);
  return sinceISO ? all.filter((e) => e.at >= sinceISO) : all;
}

// ---------- Exercise Approvals & Rehab Preferences ----------
export type RehabPreferences = {
  affectedSide: "left" | "right" | "both";
  playbackSpeed: number; // 0.5, 0.75, 1.0, 1.25
  voiceEnabled: boolean;
  autoRotate: boolean;
  filterDoctorApprovedOnly: boolean;
  activeStage: "all" | "early" | "gentle" | "progressive";
  activeCategory: string; // "all" | specific category
};

export const DEFAULT_REHAB_PREFS: RehabPreferences = {
  affectedSide: "left",
  playbackSpeed: 1.0,
  voiceEnabled: true,
  autoRotate: false,
  filterDoctorApprovedOnly: false,
  activeStage: "all",
  activeCategory: "all",
};

export function getExerciseApprovals(): Record<string, boolean> {
  return read<Record<string, boolean>>(K.exerciseApprovals, {
    // By default, gentle breathing & basic mobility start as approved baseline suggestions
    breathing: true,
    arm_raise: true,
    shoulder_circle: true,
  });
}

export function setExerciseApproval(key: string, approved: boolean): void {
  const current = getExerciseApprovals();
  current[key] = approved;
  write(K.exerciseApprovals, current);
  window.dispatchEvent(
    new CustomEvent("pinkcare:exercise-approvals", { detail: { key, approved } }),
  );
}

export function getRehabPreferences(): RehabPreferences {
  const saved = read<Partial<RehabPreferences>>(K.rehabPreferences, {});
  return { ...DEFAULT_REHAB_PREFS, ...saved };
}

export function saveRehabPreferences(p: Partial<RehabPreferences>): RehabPreferences {
  const current = getRehabPreferences();
  const next = { ...current, ...p };
  write(K.rehabPreferences, next);
  window.dispatchEvent(new CustomEvent("pinkcare:rehab-preferences", { detail: next }));
  return next;
}

// ---------- Moods & Emotional Well-being ----------
export type MoodType =
  "happy" | "calm" | "hopeful" | "anxious" | "sad" | "stressed" | "exhausted" | "other";

export type MoodEntry = {
  id: string;
  mood: MoodType | string;
  customMoodName?: string;
  notes?: string;
  wellness?: number;
  energy?: number;
  tags?: string[];
  date: string;
  at: string;
};

export type WellbeingActivityType =
  | "breathing"
  | "mindfulness"
  | "relaxation"
  | "self_reflection"
  | "daily_motivation"
  | "gratitude"
  | "sleep_relaxation";

export type WellbeingActivityLog = {
  id: string;
  activityType: WellbeingActivityType;
  title: string;
  durationSeconds: number;
  date: string;
  at: string;
  notes?: string;
};

export function saveMoodEntry(
  entry: Omit<MoodEntry, "id" | "at"> & { id?: string; at?: string },
): MoodEntry {
  const all = read<MoodEntry[]>(K.moods, []);
  const now = new Date().toISOString();
  const id = entry.id || uuid();
  const date = entry.date || todayISO();

  const existingIdx = all.findIndex((m) => m.id === id);
  const newEntry: MoodEntry = {
    id,
    at: entry.at || now,
    date,
    mood: entry.mood,
    customMoodName: entry.customMoodName,
    notes: entry.notes,
    wellness: entry.wellness,
    energy: entry.energy,
    tags: entry.tags,
  };

  if (existingIdx >= 0) {
    all[existingIdx] = newEntry;
  } else {
    // Check if there is already an entry for this exact date to allow multiple or edit
    all.unshift(newEntry);
  }

  write(K.moods, all);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("pinkcare:mood-updated", { detail: newEntry }));
  }
  return newEntry;
}

export function deleteMoodEntry(id: string): void {
  const all = read<MoodEntry[]>(K.moods, []);
  const filtered = all.filter((m) => m.id !== id);
  write(K.moods, filtered);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("pinkcare:mood-updated", { detail: { id, deleted: true } }),
    );
  }
}

export function getMoodEntries(sinceISO?: string): MoodEntry[] {
  const all = read<MoodEntry[]>(K.moods, []);
  const filtered = sinceISO ? all.filter((m) => m.at >= sinceISO) : all;
  return filtered.sort((a, b) => b.at.localeCompare(a.at));
}

export function getTodayMood(): MoodEntry | undefined {
  const today = todayISO();
  const all = read<MoodEntry[]>(K.moods, []);
  return all.find((m) => m.date === today);
}

// Backwards-compatible aliases
export type Mood = MoodEntry;
export function addMood(mood: string, extras: Partial<MoodEntry> = {}) {
  return saveMoodEntry({
    mood: mood as MoodType,
    date: todayISO(),
    ...extras,
  });
}
export function getMoods(sinceISO?: string): MoodEntry[] {
  return getMoodEntries(sinceISO);
}

// ---------- Wellbeing Activities Log ----------
export function logWellbeingActivity(
  data: Omit<WellbeingActivityLog, "id" | "at" | "date"> & {
    date?: string;
  },
): WellbeingActivityLog {
  const all = read<WellbeingActivityLog[]>(K.wellbeingActivities, []);
  const log: WellbeingActivityLog = {
    id: uuid(),
    activityType: data.activityType,
    title: data.title,
    durationSeconds: data.durationSeconds,
    date: data.date || todayISO(),
    at: new Date().toISOString(),
    notes: data.notes,
  };
  all.unshift(log);
  write(K.wellbeingActivities, all);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("pinkcare:activity-logged", { detail: log }));
  }
  return log;
}

export function getWellbeingActivityLogs(): WellbeingActivityLog[] {
  return read<WellbeingActivityLog[]>(K.wellbeingActivities, []);
}

export function deleteWellbeingActivityLog(id: string): void {
  const all = read<WellbeingActivityLog[]>(K.wellbeingActivities, []);
  write(
    K.wellbeingActivities,
    all.filter((a) => a.id !== id),
  );
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("pinkcare:activity-logged", { detail: { id, deleted: true } }),
    );
  }
}

// ---------- Notification log ----------
export type NotifLogRow = {
  id: string;
  category: string;
  title: string;
  body: string;
  status: string;
  at: string;
};
export function addNotifLog(row: Omit<NotifLogRow, "id" | "at">) {
  const all = read<NotifLogRow[]>(K.notifLog, []);
  all.push({ id: uuid(), at: new Date().toISOString(), ...row });
  // cap at 500
  if (all.length > 500) all.splice(0, all.length - 500);
  write(K.notifLog, all);
}
export function getNotifLog(sinceISO?: string, limit = 200): NotifLogRow[] {
  const all = read<NotifLogRow[]>(K.notifLog, []).slice().reverse();
  const filtered = sinceISO ? all.filter((n) => n.at >= sinceISO) : all;
  return filtered.slice(0, limit);
}
export function clearNotifLog() {
  write(K.notifLog, []);
}

// ---------- Notification settings ----------
export function getStoredNotifSettings<T>(fallback: T): T {
  return read<T>(K.notifSettings, fallback);
}
export function setStoredNotifSettings<T>(value: T) {
  write(K.notifSettings, value);
}

// ---------- Medications ----------
export function getMedications(status?: "active" | "discontinued"): Medication[] {
  const all = read<Medication[]>(K.medications, []);
  return status ? all.filter((m) => m.status === status) : all;
}

export function saveMedication(
  med: Omit<Medication, "id" | "createdAt" | "updatedAt"> & { id?: string },
): Medication {
  const all = read<Medication[]>(K.medications, []);
  const now = new Date().toISOString();
  if (med.id) {
    const idx = all.findIndex((m) => m.id === med.id);
    if (idx >= 0) {
      const updated: Medication = {
        ...all[idx],
        ...med,
        id: med.id,
        updatedAt: now,
      };
      all[idx] = updated;
      write(K.medications, all);
      window.dispatchEvent(new CustomEvent("pinkcare:medications"));
      return updated;
    }
  }
  const created: Medication = {
    ...med,
    id: med.id ?? uuid(),
    createdAt: now,
    updatedAt: now,
  };
  all.push(created);
  write(K.medications, all);
  window.dispatchEvent(new CustomEvent("pinkcare:medications"));
  return created;
}

export function discontinueMedication(id: string, reason?: string): boolean {
  const all = read<Medication[]>(K.medications, []);
  const idx = all.findIndex((m) => m.id === id);
  if (idx < 0) return false;
  all[idx] = {
    ...all[idx],
    status: "discontinued",
    discontinuedDate: todayISO(),
    discontinuedReason: reason ?? null,
    updatedAt: new Date().toISOString(),
  };
  write(K.medications, all);
  window.dispatchEvent(new CustomEvent("pinkcare:medications"));
  return true;
}

export function reactivateMedication(id: string): boolean {
  const all = read<Medication[]>(K.medications, []);
  const idx = all.findIndex((m) => m.id === id);
  if (idx < 0) return false;
  all[idx] = {
    ...all[idx],
    status: "active",
    discontinuedDate: null,
    discontinuedReason: null,
    updatedAt: new Date().toISOString(),
  };
  write(K.medications, all);
  window.dispatchEvent(new CustomEvent("pinkcare:medications"));
  return true;
}

export function deleteMedication(id: string): boolean {
  const all = read<Medication[]>(K.medications, []).filter((m) => m.id !== id);
  write(K.medications, all);
  window.dispatchEvent(new CustomEvent("pinkcare:medications"));
  return true;
}

// ---------- Medication Dose Logs ----------
export function getMedDoseLogs(date?: string): MedicationDoseLog[] {
  const all = read<MedicationDoseLog[]>(K.medDoseLogs, []);
  return date ? all.filter((l) => l.scheduledDate === date) : all;
}

export function logMedDose(
  medicationId: string,
  scheduledTime: string,
  status: "taken" | "skipped" | "snoozed",
  scheduledDate = todayISO(),
  notes?: string,
): MedicationDoseLog {
  const meds = getMedications();
  const med = meds.find((m) => m.id === medicationId);
  const all = read<MedicationDoseLog[]>(K.medDoseLogs, []);
  const existingIdx = all.findIndex(
    (l) =>
      l.medicationId === medicationId &&
      l.scheduledTime === scheduledTime &&
      l.scheduledDate === scheduledDate,
  );

  const entry: MedicationDoseLog = {
    id: existingIdx >= 0 ? all[existingIdx].id : uuid(),
    medicationId,
    medicationName: med?.name ?? "Medication",
    dosage: med?.dosage ?? "",
    scheduledTime,
    scheduledDate,
    takenAt: status === "taken" ? new Date().toISOString() : null,
    status,
    notes: notes ?? null,
  };

  if (existingIdx >= 0) {
    all[existingIdx] = entry;
  } else {
    all.push(entry);
  }
  write(K.medDoseLogs, all);
  window.dispatchEvent(new CustomEvent("pinkcare:med-doses"));
  return entry;
}

// ---------- Medical Appointments ----------
export function getAppointments(
  status?: "upcoming" | "completed" | "cancelled",
): MedicalAppointment[] {
  const all = read<MedicalAppointment[]>(K.appointments, []);
  return status ? all.filter((a) => a.status === status) : all;
}

export function saveAppointment(
  app: Omit<MedicalAppointment, "id" | "createdAt" | "updatedAt"> & { id?: string },
): MedicalAppointment {
  const all = read<MedicalAppointment[]>(K.appointments, []);
  const now = new Date().toISOString();
  if (app.id) {
    const idx = all.findIndex((a) => a.id === app.id);
    if (idx >= 0) {
      const updated: MedicalAppointment = {
        ...all[idx],
        ...app,
        id: app.id,
        updatedAt: now,
      };
      all[idx] = updated;
      write(K.appointments, all);
      window.dispatchEvent(new CustomEvent("pinkcare:appointments"));
      return updated;
    }
  }
  const created: MedicalAppointment = {
    ...app,
    id: app.id ?? uuid(),
    createdAt: now,
    updatedAt: now,
  };
  all.push(created);
  write(K.appointments, all);
  window.dispatchEvent(new CustomEvent("pinkcare:appointments"));
  return created;
}

export function updateAppointmentStatus(
  id: string,
  status: "upcoming" | "completed" | "cancelled",
): boolean {
  const all = read<MedicalAppointment[]>(K.appointments, []);
  const idx = all.findIndex((a) => a.id === id);
  if (idx < 0) return false;
  all[idx] = {
    ...all[idx],
    status,
    updatedAt: new Date().toISOString(),
  };
  write(K.appointments, all);
  window.dispatchEvent(new CustomEvent("pinkcare:appointments"));
  return true;
}

export function deleteAppointment(id: string): boolean {
  const all = read<MedicalAppointment[]>(K.appointments, []).filter((a) => a.id !== id);
  write(K.appointments, all);
  window.dispatchEvent(new CustomEvent("pinkcare:appointments"));
  return true;
}

// ---------- Push Subscriptions & Deduplication ----------
export type StoredPushSub = {
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string;
  subscribedAt: string;
};

export function getStoredPushSub(): StoredPushSub | null {
  return read<StoredPushSub | null>(K.pushSubscription, null);
}

export function setStoredPushSub(sub: StoredPushSub | null) {
  if (sub) {
    write(K.pushSubscription, sub);
  } else if (typeof localStorage !== "undefined") {
    localStorage.removeItem(K.pushSubscription);
  }
}

export function isNotificationDeduplicated(dedupeKey: string): boolean {
  const set = new Set(read<string[]>(K.dispatchedDedupe, []));
  return set.has(dedupeKey);
}

export function recordNotificationDeduplicated(dedupeKey: string) {
  const list = read<string[]>(K.dispatchedDedupe, []);
  if (!list.includes(dedupeKey)) {
    list.push(dedupeKey);
    // keep recent 1000 dedupe keys
    if (list.length > 1000) list.splice(0, list.length - 1000);
    write(K.dispatchedDedupe, list);
  }
}

// ---------- helpers ----------
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
