import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Heart,
  Droplet,
  Moon,
  Activity,
  BookOpen,
  Dumbbell,
  Lightbulb,
  ChevronLeft,
  Trophy,
  Sparkles,
  PlayCircle,
  Pill,
  Calendar,
  Clock,
  CheckCircle2,
  Smile,
  Users,
  Stethoscope,
  Video,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n, getLocalizedText } from "@/lib/i18n";
import {
  getReminders,
  getMedications,
  getAppointments,
  getMedDoseLogs,
  getTodayMood,
  todayISO,
  type Medication,
  type MedicalAppointment,
  type MoodEntry,
} from "@/lib/local-db";
import { MOOD_DEFINITIONS } from "@/components/pinkcare/wellbeing/WellbeingTypes";
import { getDailyTip } from "@/data/tips";

export const Route = createFileRoute("/_app/home")({
  component: HomePage,
});

function HomePage() {
  const { profile } = useAuth();
  const { t, lang } = useI18n();
  const [completed, setCompleted] = useState(0);
  const [activeMeds, setActiveMeds] = useState<Medication[]>([]);
  const [nextApp, setNextApp] = useState<MedicalAppointment | null>(null);
  const [todayMood, setTodayMood] = useState<MoodEntry | undefined>(undefined);
  const dailyTip = getDailyTip();
  const today = todayISO();

  useEffect(() => {
    setCompleted(getReminders(today).length);
    setActiveMeds(getMedications("active"));
    setTodayMood(getTodayMood());
    const upcoming = getAppointments("upcoming");
    // Sort by date then time
    upcoming.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
    setNextApp(upcoming[0] ?? null);

    const handleMoodUpdate = () => {
      setTodayMood(getTodayMood());
    };
    window.addEventListener("pinkcare:mood-updated", handleMoodUpdate);
    return () => window.removeEventListener("pinkcare:mood-updated", handleMoodUpdate);
  }, [profile, today]);

  const firstName = profile?.first_name ?? "";
  const totalReminders = 8;
  const progress = Math.min(100, Math.round((completed / totalReminders) * 100));

  // Find next dose among active meds
  const todayLogs = getMedDoseLogs(today);
  const untakenDoses: { med: Medication; time: string }[] = [];
  for (const med of activeMeds) {
    for (const time of med.times) {
      const taken = todayLogs.some(
        (l) => l.medicationId === med.id && l.scheduledTime === time && l.status === "taken",
      );
      if (!taken) {
        untakenDoses.push({ med, time });
      }
    }
  }
  untakenDoses.sort((a, b) => a.time.localeCompare(b.time));
  const nextDose = untakenDoses[0] ?? null;

  return (
    <div className="space-y-5">
      <section className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">{t("hello")} ✨</p>
        <h2 className="text-2xl font-bold text-primary">{firstName}</h2>
        <p className="text-sm text-foreground/70">{t("tagline")}</p>
        <div className="h-1 w-16 mx-auto rounded-full gradient-rose mt-1" />
      </section>

      {/* Main daily overview card */}
      <div className="glass rounded-3xl p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div className="text-end">
            <p className="text-xs text-muted-foreground">{t("today_overview")}</p>
            <p className="text-lg font-bold text-primary">{t("great_work")}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-bold text-primary tabular-nums num-en">{progress}%</span>
            <span className="font-medium">{t("physical_activity")}</span>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full gradient-rose transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Moon className="w-5 h-5" />}
            label={t("sleep_hours")}
            value={getLocalizedText(lang, {
              ar: "7.5 ساعة",
              dz: "7.5 سوايع",
              fr: "7.5 h",
              en: "7.5 hrs",
            })}
          />
          <StatCard
            icon={<Droplet className="w-5 h-5" />}
            label={t("water_intake")}
            value={getLocalizedText(lang, {
              ar: "1.8 لتر",
              dz: "1.8 لتر ما",
              fr: "1.8 L",
              en: "1.8 L",
            })}
          />
        </div>
      </div>

      {/* NEXT MEDICATION DOSE CARD */}
      {activeMeds.length > 0 && (
        <Link
          to="/care"
          search={{ tab: "medications" }}
          className="block glass rounded-3xl p-4 border border-primary/30 hover:neon-glow transition relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-primary uppercase tracking-wide">
                  {getLocalizedText(lang, {
                    ar: "الجرعة القادمة الموصوفة",
                    dz: "الجرعة الجاية من الدوا",
                    fr: "Prochaine prise prescrite",
                    en: "Next Prescribed Dose",
                  })}
                </p>
                {nextDose ? (
                  <p className="font-bold text-foreground text-sm mt-0.5">
                    {nextDose.med.name} ({nextDose.med.dosage})
                  </p>
                ) : (
                  <p className="font-bold text-emerald-600 text-sm mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {getLocalizedText(lang, {
                        ar: "أنجزتِ جميع جرعات اليوم ✓",
                        dz: "شربتي قاع دوايات اليوم يعطيك الصحة ✓",
                        fr: "Toutes les prises complétées ✓",
                        en: "All doses completed today ✓",
                      })}
                    </span>
                  </p>
                )}
                {nextDose && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-primary" />
                    <span className="tabular-nums num-en" dir="ltr">
                      {nextDose.time}
                    </span>
                    {nextDose.med.instructions && (
                      <span className="truncate max-w-[180px]">— {nextDose.med.instructions}</span>
                    )}
                  </p>
                )}
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-primary rotate-180 rtl:rotate-0 shrink-0" />
          </div>
        </Link>
      )}

      {/* UPCOMING APPOINTMENT CARD */}
      {nextApp && (
        <Link
          to="/care"
          search={{ tab: "appointments" }}
          className="block glass rounded-3xl p-4 border border-primary/30 hover:neon-glow transition relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-bold text-primary uppercase tracking-wide">
                    {getLocalizedText(lang, {
                      ar: "الموعد الطبي القادم",
                      dz: "الرونديفو الجاي عند الطبيب",
                      fr: "Prochain rendez-vous médical",
                      en: "Upcoming Medical Visit",
                    })}
                  </p>
                  {nextApp.date === today && (
                    <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.2 rounded-full font-bold">
                      {getLocalizedText(lang, {
                        ar: "اليوم",
                        dz: "اليوم",
                        fr: "Aujourd'hui",
                        en: "Today",
                      })}
                    </span>
                  )}
                </div>
                <p className="font-bold text-foreground text-sm mt-0.5">{nextApp.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <span className="tabular-nums num-en font-bold" dir="ltr">
                    {nextApp.date} {nextApp.time}
                  </span>{" "}
                  • {nextApp.specialistName} ({nextApp.location})
                </p>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-primary rotate-180 rtl:rotate-0 shrink-0" />
          </div>
        </Link>
      )}

      {/* EMOTIONAL WELL-BEING & MOOD CHECK-IN CARD */}
      <Link
        to="/wellbeing"
        className="block glass rounded-3xl p-4.5 border border-primary/30 hover:neon-glow transition relative overflow-hidden shadow-xs"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.96 0.03 330 / 0.85), oklch(0.93 0.05 315 / 0.85))",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-rose flex items-center justify-center text-primary-foreground shadow-md shrink-0">
              <Smile className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {getLocalizedText(lang, {
                    ar: "العناية النفسية",
                    dz: "راحة البال والمورال",
                    fr: "Bien-être mental",
                    en: "Mental Well-being",
                  })}
                </span>
                {todayMood && (
                  <span className="text-xs">
                    {MOOD_DEFINITIONS.find((m) => m.type === todayMood.mood)?.emoji || "🌸"}
                  </span>
                )}
              </div>
              <p className="font-bold text-foreground text-sm mt-0.5">
                {getLocalizedText(lang, {
                  ar: "سجل المشاعر والدعم النفسي",
                  dz: "دفتر المشاعر والراحة النفسية",
                  fr: "Journal des émotions & Soutien",
                  en: "Mood Journal & Well-being",
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {todayMood
                  ? getLocalizedText(lang, {
                      ar: `سجلتِ اليوم: ${MOOD_DEFINITIONS.find((m) => m.type === todayMood.mood)?.label_ar || todayMood.mood}`,
                      dz: `سجلتي اليوم: ${MOOD_DEFINITIONS.find((m) => m.type === todayMood.mood)?.label_ar || todayMood.mood}`,
                      fr: `Enregistré aujourd'hui: ${MOOD_DEFINITIONS.find((m) => m.type === todayMood.mood)?.label_en || todayMood.mood}`,
                      en: `Logged today: ${MOOD_DEFINITIONS.find((m) => m.type === todayMood.mood)?.label_en || todayMood.mood}`,
                    })
                  : getLocalizedText(lang, {
                      ar: "كيف تشعرين اليوم؟ سجّلي مشاعركِ واسترخي",
                      dz: "واش راكي حاسة اليوم؟ سجلي واش كاين في خاطرك وارتاحي",
                      fr: "Comment vous sentez-vous ? Notez vos ressentis",
                      en: "Check in with your feelings & relax",
                    })}
              </p>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-primary rotate-180 rtl:rotate-0 shrink-0" />
        </div>
      </Link>

      {/* PINKCARE SUPPORT COMMUNITY CARD */}
      <Link
        to="/community"
        className="block glass rounded-3xl p-4.5 border border-primary/30 hover:neon-glow transition relative overflow-hidden shadow-xs"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.95 0.04 345 / 0.85), oklch(0.92 0.06 330 / 0.85))",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 dark:text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded-full">
                  {getLocalizedText(lang, {
                    ar: "مجتمع الأخوات",
                    dz: "مجموعة الخواتات",
                    fr: "Communauté de pairs",
                    en: "Peer Community",
                  })}
                </span>
                <span className="text-[10px] bg-secondary px-1.5 py-0.2 rounded-full text-secondary-foreground font-semibold">
                  {getLocalizedText(lang, {
                    ar: "مساحة آمنة",
                    dz: "فضاء آمن",
                    fr: "Espace sécurisé",
                    en: "Safe Space",
                  })}
                </span>
              </div>
              <p className="font-bold text-foreground text-sm mt-0.5">
                {getLocalizedText(lang, {
                  ar: "مجتمع PinkCare الداعم",
                  dz: "مجموعة PinkCare الداعمة",
                  fr: "Communauté PinkCare",
                  en: "PinkCare Support Community",
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {getLocalizedText(lang, {
                  ar: "شاركي تجاربكِ، تفاعلي بالحب، وتواصلي باسم مستعار",
                  dz: "شاركي واش راكي حاسة، تفرغي قلبك وتلقاي لي يسمعك",
                  fr: "Partagez vos récits et échangez avec bienveillance",
                  en: "Share journeys, react with love, and connect safely",
                })}
              </p>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-primary rotate-180 rtl:rotate-0 shrink-0" />
        </div>
      </Link>

      {/* PROFESSIONAL TELECONSULTATION CARD */}
      <Link
        to="/teleconsult"
        className="block glass rounded-3xl p-4.5 border border-emerald-500/30 hover:shadow-lg transition relative overflow-hidden shadow-xs"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.96 0.03 160 / 0.85), oklch(0.93 0.05 145 / 0.85))",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  <span>
                    {getLocalizedText(lang, {
                      ar: "فيديو WebRTC مباشر",
                      dz: "فيديو مباشر WebRTC",
                      fr: "Vidéo WebRTC directe",
                      en: "Live WebRTC Video",
                    })}
                  </span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded-full font-bold">
                  {getLocalizedText(lang, {
                    ar: "معتمد",
                    dz: "أطباء معتمدين",
                    fr: "Vérifié",
                    en: "Verified",
                  })}
                </span>
              </div>
              <p className="font-bold text-foreground text-sm mt-0.5">
                {getLocalizedText(lang, {
                  ar: "الاستشارات الطبية عن بُعد",
                  dz: "الاستشارات الطبية عن بعد",
                  fr: "Téléconsultation médicale",
                  en: "Professional Teleconsultation",
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {getLocalizedText(lang, {
                  ar: "تحدثي مع طبيبات أورام وأخصائيات معتمدات في جلسة مرئية مشفرة",
                  dz: "اهدري مع طبيبة أورام ولا أخصائية في استشارة فيديو سرية ومريحة",
                  fr: "Consultez des oncologues vérifiées en toute intimité",
                  en: "Consult verified oncologists and therapists via encrypted video",
                })}
              </p>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-emerald-600 rotate-180 rtl:rotate-0 shrink-0" />
        </div>
      </Link>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 gap-4">
        <QuickCard to="/care" icon={<Heart className="w-7 h-7" />} label={t("reminders")} />
        <QuickCard to="/exercise" icon={<Dumbbell className="w-7 h-7" />} label={t("exercises")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <QuickCard
          to="/learn"
          icon={<Sparkles className="w-7 h-7" />}
          label={getLocalizedText(lang, {
            ar: "نصائح",
            dz: "نصايح",
            fr: "Conseils",
            en: "Tips",
          })}
        />
        <QuickCard
          to="/achievements"
          icon={<Trophy className="w-7 h-7" />}
          label={getLocalizedText(lang, {
            ar: "إنجازاتك",
            dz: "الإنجازات تاعك",
            fr: "Succès",
            en: "Achievements",
          })}
        />
      </div>

      <Link
        to="/videos"
        className="block glass rounded-3xl p-5 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.92 0.05 320 / 0.7), oklch(0.94 0.04 350 / 0.7))",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
            style={{ background: "var(--gradient-primary)" }}
          >
            <PlayCircle className="w-7 h-7" />
          </div>
          <div className="flex-1 text-end">
            <p className="font-bold text-primary">
              {getLocalizedText(lang, {
                ar: "مكتبة الفيديوهات الصحية",
                dz: "مكتبة الفيديوهات الصحية",
                fr: "Vidéothèque santé",
                en: "Health Video Library",
              })}
            </p>
            <p className="text-xs text-muted-foreground">
              {getLocalizedText(lang, {
                ar: "فيديوهات توعوية وتثقيفية مختارة",
                dz: "فيديوهات توعوية وتثقيفية خاصة بيك",
                fr: "Vidéos éducatives et bienveillantes sélectionnées",
                en: "Curated awareness & education videos",
              })}
            </p>
          </div>
        </div>
      </Link>

      <Link to="/learn" className="glass rounded-3xl p-4 flex items-center justify-between">
        <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        <div className="text-end flex-1 mx-3">
          <p className="font-bold text-primary">{t("health_education")}</p>
          <p className="text-xs text-muted-foreground">{t("daily_articles")}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-accent/40 flex items-center justify-center text-accent-foreground">
          <BookOpen className="w-6 h-6" />
        </div>
      </Link>

      <Link
        to="/learn"
        className="block glass rounded-3xl p-5"
        style={{
          background: "linear-gradient(135deg, oklch(0.94 0.04 350), oklch(0.92 0.05 320))",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <p className="font-bold text-primary">{t("todays_tip")}</p>
        </div>
        <p className="font-bold text-primary text-end">
          {lang === "ar" || lang === "dz" ? dailyTip.title_ar : dailyTip.title_en}
        </p>
        <p className="text-sm text-foreground/80 text-end leading-relaxed mt-1">
          {lang === "ar" || lang === "dz" ? dailyTip.body_ar : dailyTip.body_en}
        </p>
        <p className="text-xs text-primary text-end mt-2 font-medium">
          {getLocalizedText(lang, {
            ar: "اعرفي المزيد ←",
            dz: "شوفي أكثر ←",
            fr: "En savoir plus ←",
            en: "Learn more →",
          })}
        </p>
      </Link>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white/70 dark:bg-black/30 rounded-2xl p-3 text-center">
      <div className="text-primary flex justify-center mb-1">{icon}</div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-bold text-primary tabular-nums num-en">{value}</p>
    </div>
  );
}

function QuickCard({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="glass rounded-3xl p-5 flex flex-col items-center gap-2 hover:scale-[1.02] transition"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <p className="font-bold text-primary">{label}</p>
    </Link>
  );
}
