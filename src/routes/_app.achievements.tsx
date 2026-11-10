import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trophy, Star, Flame, Heart, Award, Sparkles, Calendar } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getCompletedExercises, countRemindersSince } from "@/lib/local-db";

export const Route = createFileRoute("/_app/achievements")({
  component: AchievementsPage,
});

interface Badge {
  key: string;
  ar: string;
  en: string;
  desc_ar: string;
  desc_en: string;
  icon: typeof Trophy;
  threshold: number;
  metric: "exercises" | "reminders" | "points";
}

const BADGES: Badge[] = [
  {
    key: "first_step",
    ar: "الخطوة الأولى",
    en: "First Step",
    desc_ar: "أول تمرين منجز",
    desc_en: "First exercise completed",
    icon: Sparkles,
    threshold: 1,
    metric: "exercises",
  },
  {
    key: "warrior",
    ar: "محاربة",
    en: "Warrior",
    desc_ar: "10 تمارين منجزة",
    desc_en: "10 exercises done",
    icon: Flame,
    threshold: 10,
    metric: "exercises",
  },
  {
    key: "champion",
    ar: "بطلة",
    en: "Champion",
    desc_ar: "30 تمرين منجز",
    desc_en: "30 exercises done",
    icon: Trophy,
    threshold: 30,
    metric: "exercises",
  },
  {
    key: "caring",
    ar: "العناية الذاتية",
    en: "Self Care",
    desc_ar: "10 تذكيرات مكتملة",
    desc_en: "10 reminders completed",
    icon: Heart,
    threshold: 10,
    metric: "reminders",
  },
  {
    key: "consistent",
    ar: "ثابتة",
    en: "Consistent",
    desc_ar: "50 تذكير مكتمل",
    desc_en: "50 reminders completed",
    icon: Star,
    threshold: 50,
    metric: "reminders",
  },
  {
    key: "shining",
    ar: "نجمة لامعة",
    en: "Shining Star",
    desc_ar: "500 نقطة",
    desc_en: "500 points earned",
    icon: Award,
    threshold: 500,
    metric: "points",
  },
];

function AchievementsPage() {
  const { lang } = useI18n();
  const [stats, setStats] = useState({ exercises: 0, reminders: 0, weekRem: 0, monthRem: 0 });

  useEffect(() => {
    const now = Date.now();
    const weekAgo = new Date(now - 7 * 86400000).toISOString();
    const monthAgo = new Date(now - 30 * 86400000).toISOString();
    setStats({
      exercises: getCompletedExercises().length,
      reminders: countRemindersSince("0"),
      weekRem: countRemindersSince(weekAgo),
      monthRem: countRemindersSince(monthAgo),
    });
  }, []);

  const points = stats.exercises * 20 + stats.reminders * 10;
  const metric = { exercises: stats.exercises, reminders: stats.reminders, points };

  const weeklyPct = Math.min(100, Math.round((stats.weekRem / (8 * 7)) * 100));
  const monthlyPct = Math.min(100, Math.round((stats.monthRem / (8 * 30)) * 100));

  return (
    <div className="space-y-5 pb-6">
      <section className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-primary">
          {lang === "ar" ? "إنجازاتك" : "Your achievements"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {lang === "ar" ? "كل خطوة تستحق احتفالاً" : "Every step deserves celebration"}
        </p>
      </section>

      <div className="glass rounded-3xl p-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{ background: "var(--gradient-rose)" }}
        />
        <div className="relative">
          <Trophy className="w-10 h-10 text-primary mx-auto" />
          <p className="text-5xl font-bold text-gradient mt-2 tabular-nums">{points}</p>
          <p className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "نقطة" : "points"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label={lang === "ar" ? "تمارين منجزة" : "Exercises"} value={stats.exercises} />
        <StatCard label={lang === "ar" ? "تذكيرات مكتملة" : "Reminders"} value={stats.reminders} />
      </div>

      <div className="glass rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <Calendar className="w-5 h-5 text-primary" />
          <p className="font-bold text-primary">
            {lang === "ar" ? "نسبة الالتزام" : "Commitment rate"}
          </p>
        </div>
        <ProgressRow label={lang === "ar" ? "هذا الأسبوع" : "This week"} pct={weeklyPct} />
        <ProgressRow label={lang === "ar" ? "هذا الشهر" : "This month"} pct={monthlyPct} />
      </div>

      <div>
        <p className="text-end font-bold text-primary mb-2">
          {lang === "ar" ? "الشارات" : "Badges"}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {BADGES.map((b) => {
            const v = metric[b.metric];
            const unlocked = v >= b.threshold;
            const Icon = b.icon;
            const pct = Math.min(100, Math.round((v / b.threshold) * 100));
            return (
              <div
                key={b.key}
                className={`glass rounded-2xl p-4 text-center space-y-1 ${unlocked ? "ring-2 ring-primary" : "opacity-70"}`}
              >
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${unlocked ? "gradient-rose text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <p className="font-bold text-primary text-sm">{lang === "ar" ? b.ar : b.en}</p>
                <p className="text-[11px] text-muted-foreground">
                  {lang === "ar" ? b.desc_ar : b.desc_en}
                </p>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden mt-1">
                  <div
                    className="h-full gradient-rose transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-4 text-center">
      <p className="text-3xl font-bold text-gradient tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function ProgressRow({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-bold text-primary">{pct}%</span>
        <span className="text-foreground/80">{label}</span>
      </div>
      <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
        <div className="h-full gradient-rose transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
