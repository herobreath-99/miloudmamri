import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  User as UserIcon,
  BadgeCheck,
  Heart,
  Award,
  ChevronLeft,
  ShieldCheck,
  Bell,
  LogOut,
  Languages,
  Moon,
  Pencil,
  Smile,
  Users,
  Stethoscope,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useI18n, SUPPORTED_LANGUAGES, type Lang } from "@/lib/i18n";
import { countRemindersSince, getCompletedExercises } from "@/lib/local-db";
import { AdminPortalModal } from "@/components/pinkcare/admin/AdminPortalModal";
import { PrivacySecurityModal } from "@/components/pinkcare/privacy/PrivacySecurityModal";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const { t, lang, setLang } = useI18n();
  const nav = useNavigate();
  const [exDone, setExDone] = useState(0);
  const [commitment, setCommitment] = useState(0);
  const [dark, setDark] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);

  useEffect(() => {
    setExDone(getCompletedExercises().length);
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const count = countRemindersSince(sevenDaysAgo);
    setCommitment(Math.min(100, Math.round((count / (8 * 7)) * 100)));
  }, [profile]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const doLogout = async () => {
    await signOut();
    toast.success("✓");
    nav({ to: "/" });
  };

  const bars = [60, 80, 75, 90, 65, 70, 55];
  const labels =
    lang === "dz"
      ? ["السبت", "الجمعة", "الخميس", "الأربعاء", "الثلاثاء", "الاثنين", "الحد"]
      : lang === "ar"
        ? ["سبت", "جمعة", "خميس", "أربعاء", "ثلاثاء", "إثنين", "أحد"]
        : ["Sat", "Fri", "Thu", "Wed", "Tue", "Mon", "Sun"];

  return (
    <div className="space-y-5">
      <div className="glass rounded-3xl p-6 text-center space-y-3">
        <div className="relative w-24 h-24 mx-auto rounded-full gradient-rose p-1">
          <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-10 h-10 text-primary" />
            )}
          </div>
          <BadgeCheck className="absolute bottom-0 end-0 w-7 h-7 text-primary bg-card rounded-full" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary">
            {profile?.first_name} {profile?.last_name}
          </h2>
          {user?.email && (
            <p className="text-xs text-muted-foreground font-mono mt-0.5" dir="ltr">
              {user.email}
            </p>
          )}
          {profile?.city && <p className="text-xs text-muted-foreground">{profile.city}</p>}
          {profile?.age != null && (
            <p className="text-xs text-muted-foreground num-en">{profile.age}</p>
          )}
        </div>
        <Link
          to="/profile-edit"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary glass rounded-full px-4 py-1.5"
        >
          <Pencil className="w-3.5 h-3.5" />
          {t("edit_my_info")}
        </Link>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-white/60 rounded-2xl p-3">
            <p className="text-2xl font-bold text-primary num-en">{commitment}%</p>
            <p className="text-xs text-muted-foreground">{t("commitment")}</p>
          </div>
          <div className="bg-white/60 rounded-2xl p-3">
            <p className="text-2xl font-bold text-primary num-en">{exDone}</p>
            <p className="text-xs text-muted-foreground">{t("exercises_done")}</p>
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="flex justify-between mb-4">
          <span className="text-xs text-primary font-bold">{t("last_7_days")}</span>
          <p className="font-bold text-primary">{t("recovery_progress")}</p>
        </div>
        <div className="flex items-end justify-between gap-2 h-40">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-xl gradient-rose" style={{ height: `${h}%` }} />
              <span className="text-[10px] text-muted-foreground">{labels[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-3xl p-4 text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-full bg-accent/40 flex items-center justify-center text-accent-foreground">
            <Award className="w-6 h-6" />
          </div>
          <p className="font-bold text-primary text-sm">
            {lang === "dz" ? "بطلة السمانة" : lang === "ar" ? "بطلة الأسبوع" : "Star of the week"}
          </p>
        </div>
        <div className="glass rounded-3xl p-4 text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Heart className="w-6 h-6" fill="currentColor" />
          </div>
          <p className="font-bold text-primary text-sm">
            {lang === "dz" ? "صحة القلب والنشاط" : lang === "ar" ? "صحة القلب" : "Heart health"}
          </p>
        </div>
      </div>

      <div className="glass rounded-3xl p-5 space-y-1">
        <h3 className="text-end font-bold text-primary mb-2">{t("settings")}</h3>

        <Link
          to="/profile-edit"
          className="w-full flex items-center justify-between py-3 border-b border-border"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{t("edit_my_info")}</span>
          <Pencil className="w-5 h-5 text-primary" />
        </Link>

        <Link
          to="/wellbeing"
          className="w-full flex items-center justify-between py-3 border-b border-border"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            {lang === "dz"
              ? "دفتر المشاعر وراحة البال"
              : lang === "ar"
                ? "سجل المشاعر والدعم النفسي"
                : "Mood Journal & Well-being"}
          </span>
          <Smile className="w-5 h-5 text-primary" />
        </Link>

        <Link
          to="/community"
          className="w-full flex items-center justify-between py-3 border-b border-border"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            {lang === "dz"
              ? "مجموعة الخواتات الداعمة"
              : lang === "ar"
                ? "مجتمع الأخوات الداعم"
                : "PinkCare Support Community"}
          </span>
          <Users className="w-5 h-5 text-primary" />
        </Link>

        <Link
          to="/teleconsult"
          className="w-full flex items-center justify-between py-3 border-b border-border"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            {lang === "dz"
              ? "استشارة الطبيب عن بعد بالفيديو"
              : lang === "ar"
                ? "الاستشارات الطبية عن بُعد (WebRTC)"
                : "Teleconsultations"}
          </span>
          <Stethoscope className="w-5 h-5 text-emerald-600" />
        </Link>

        <button
          onClick={() => setShowAdmin(true)}
          className="w-full flex items-center justify-between py-3 border-b border-border text-start"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            {lang === "dz"
              ? "بوابة الإدارة وتأكيد الأطباء"
              : lang === "ar"
                ? "بوابة الإشراف الإداري واعتماد الأطباء"
                : "Moderator & Verification Portal"}
          </span>
          <ShieldAlert className="w-5 h-5 text-amber-600" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowLangPicker(!showLangPicker)}
            className="w-full flex items-center justify-between py-3 border-b border-border"
          >
            <ChevronLeft
              className={`w-4 h-4 text-muted-foreground transition-transform ${showLangPicker ? "rotate-90" : ""}`}
            />
            <span className="text-sm">
              {t("change_language")} •{" "}
              {SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.label ?? lang}
            </span>
            <Languages className="w-5 h-5 text-primary" />
          </button>
          {showLangPicker && (
            <div className="p-2 my-2 rounded-2xl bg-card border border-border space-y-1 shadow-lg">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setShowLangPicker(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                    lang === l.code
                      ? "bg-primary text-primary-foreground font-bold"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-75">{l.nativeName}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={toggleDark}
          className="w-full flex items-center justify-between py-3 border-b border-border"
        >
          <span className="text-xs text-muted-foreground">{dark ? "✓" : ""}</span>
          <span className="text-sm">{t("dark_mode")}</span>
          <Moon className="w-5 h-5 text-primary" />
        </button>

        <Link
          to="/notifications"
          className="w-full flex items-center justify-between py-3 border-b border-border"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{t("notifications")}</span>
          <Bell className="w-5 h-5 text-primary" />
        </Link>

        <button
          onClick={() => setShowPrivacyModal(true)}
          className="w-full flex items-center justify-between py-3 border-b border-border"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            {lang === "ar"
              ? "الخصوصية، الأمان وإدارة البيانات"
              : lang === "dz"
                ? "الخصوصية والحماية"
                : lang === "fr"
                  ? "Confidentialité & Données"
                  : "Privacy, Security & Data"}
          </span>
          <ShieldCheck className="w-5 h-5 text-primary" />
        </button>

        <button
          onClick={() => setShowPrivacyModal(true)}
          className="w-full flex items-center justify-between py-3 border-b border-border text-destructive/80"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold">
            {lang === "ar"
              ? "تصدير السجلات أو مسح الحساب"
              : lang === "dz"
                ? "تحميل السجلات ولا مسح الحساب"
                : lang === "fr"
                  ? "Exporter les données ou supprimer le compte"
                  : "Export records or delete account"}
          </span>
          <ShieldAlert className="w-5 h-5 text-destructive" />
        </button>

        <button
          onClick={doLogout}
          className="w-full flex items-center justify-between py-3 text-muted-foreground hover:text-foreground"
        >
          <span />
          <span className="text-sm font-bold">
            {lang === "ar"
              ? "تسجيل الخروج"
              : lang === "dz"
                ? "خروج"
                : lang === "fr"
                  ? "Déconnexion"
                  : "Sign out"}
          </span>
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {showAdmin && <AdminPortalModal onClose={() => setShowAdmin(false)} lang={lang} />}
      {showPrivacyModal && (
        <PrivacySecurityModal
          onClose={() => setShowPrivacyModal(false)}
          onAccountDeleted={() => nav({ to: "/" })}
        />
      )}
    </div>
  );
}
