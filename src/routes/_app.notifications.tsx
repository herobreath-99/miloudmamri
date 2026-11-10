import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bell,
  BellOff,
  BellRing,
  ChevronRight,
  Clock,
  History,
  Moon,
  Pill,
  Sparkles,
  Trash2,
  Vibrate,
  Volume2,
  Calendar,
  ShieldCheck,
  Smartphone,
  Globe,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { getNotifLog, clearNotifLog, DEFAULT_TIMEZONE, type NotifLogRow } from "@/lib/local-db";
import { useNotifications, CATEGORY_MESSAGES, type CategoryKey } from "@/lib/notifications";
import { getPushServerStatus } from "@/lib/push.functions";

export const Route = createFileRoute("/_app/notifications")({
  component: NotificationsPage,
});

const CAT_LABELS: Record<CategoryKey, { ar: string; en: string; icon: typeof Bell }> = {
  medication: { ar: "الأدوية الموصوفة", en: "Prescribed Medication", icon: Pill },
  appointment: { ar: "المواعيد الطبية", en: "Medical Appointments", icon: Calendar },
  examination: { ar: "الفحوصات والتحاليل", en: "Examinations & Labs", icon: Calendar },
  hydration: { ar: "شرب الماء والترطيب", en: "Hydration", icon: Sparkles },
  skincare: { ar: "ترطيب وعناية البشرة", en: "Skincare", icon: Sparkles },
  arm_exercise: { ar: "تمارين الذراع المعتمدة", en: "Approved Arm Exercise", icon: Sparkles },
  walking: { ar: "المشي اللطيف", en: "Gentle Walking", icon: Sparkles },
  sleep: { ar: "الراحة والنوم", en: "Rest & Sleep", icon: Moon },
  mood_checkin: { ar: "تسجيل الحالة اليومية", en: "Daily Check-in", icon: Sparkles },
  motivation: { ar: "رسائل الدعم والتشجيع", en: "Motivation & Support", icon: Sparkles },
  educational: { ar: "الثقافة والتوجيه الصحي", en: "Health Education", icon: Sparkles },
};

type LogRow = {
  id: string;
  category: string;
  title: string;
  body: string;
  status: string;
  fired_at: string;
};

function NotificationsPage() {
  const { lang } = useI18n();
  const {
    settings,
    permission,
    isPushSupported,
    pushSubscription,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    sendTestPushNotification,
    previewChimeSound,
    updateSettings,
    updateCategory,
    fireNotification,
  } = useNotifications();

  const [tab, setTab] = useState<"history" | "settings">("settings");
  const [log, setLog] = useState<LogRow[]>([]);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isTestingPush, setIsTestingPush] = useState(false);
  const [serverStats, setServerStats] = useState<{
    activeDevices: number;
    totalSent: number;
    totalFailed: number;
    lastDispatchedAt: string | null;
    timezone: string;
    vapidKeyConfigured: boolean;
  } | null>(null);

  const loadServerStats = () => {
    getPushServerStatus()
      .then(setServerStats)
      .catch(() => {});
  };

  const loadLog = () => {
    setLog(
      getNotifLog(undefined, 50).map((n: NotifLogRow) => ({
        id: n.id,
        category: n.category,
        title: n.title,
        body: n.body,
        status: n.status,
        fired_at: n.at,
      })),
    );
  };

  useEffect(() => {
    loadLog();
    loadServerStats();
  }, []);

  const clearLog = () => {
    clearNotifLog();
    setLog([]);
    toast.success(lang === "ar" ? "تم مسح السجل" : "History cleared");
  };

  const handleToggleWebPush = async () => {
    setIsSubscribing(true);
    try {
      if (pushSubscription) {
        const ok = await unsubscribeFromPush();
        if (ok) {
          toast.info(
            lang === "ar"
              ? "تم إلغاء تفعيل إشعارات الويب المباشرة"
              : "Web Push notifications disabled",
          );
          loadServerStats();
        }
      } else {
        const ok = await subscribeToPush();
        if (ok) {
          toast.success(
            lang === "ar"
              ? "تم تفعيل إشعارات Web Push بنجاح! ستصلكِ حتى عند إغلاق التطبيق 💗"
              : "Web Push activated! You will receive reminders even when closed 💗",
          );
          loadServerStats();
        } else {
          toast.error(
            lang === "ar"
              ? "تعذر تفعيل الإشعارات. يرجى التأكد من منح الإذن في إعدادات المتصفح."
              : "Could not enable push. Check browser permissions.",
          );
        }
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleTestWebPush = async () => {
    setIsTestingPush(true);
    try {
      if (pushSubscription) {
        const res = await sendTestPushNotification();
        if (res.success) {
          toast.success(
            lang === "ar"
              ? "تم إرسال إشعار Web Push حقيقي عبر السيرفر! تحققي من شريط الإشعارات 🌸"
              : "Real Web Push sent via server! Check your notifications tray 🌸",
          );
          setTimeout(loadLog, 500);
          loadServerStats();
        } else {
          toast.error(res.message);
        }
      } else {
        await fireNotification(
          "motivation",
          lang === "ar" ? "🌸 إشعار تجريبي من PinkCare" : "🌸 PinkCare Test Reminder",
          lang === "ar"
            ? "خطتكِ العلاجية في غاية الأهمية. هكذا تظهر إشعارات PinkCare الداعمة 💗"
            : "Your health plan matters. This is how PinkCare supportive reminders look 💗",
        );
        toast.info(lang === "ar" ? "تم إطلاق إشعار محلي" : "Local notification triggered");
        setTimeout(loadLog, 400);
      }
    } finally {
      setIsTestingPush(false);
    }
  };

  const testVibration = () => {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate([200, 100, 200]);
      toast.success(
        lang === "ar" ? "تم تشغيل نمط الاهتزاز التجريبي" : "Vibration pattern triggered",
      );
    } else {
      toast.info(
        lang === "ar"
          ? "الاهتزاز غير مدعوم على متصفحك أو تم تقييده من قبل نظام التشغيل."
          : "Vibration is not supported or is restricted on this device.",
      );
    }
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link to="/home" className="text-primary text-sm font-medium">
          <ChevronRight className="w-5 h-5 inline" />
        </Link>
        <h1 className="text-xl font-bold text-gradient">
          {lang === "ar" ? "مركز الإشعارات والتذكيرات" : "Smart Notification Center"}
        </h1>
        <button
          onClick={handleTestWebPush}
          disabled={isTestingPush}
          className="text-primary text-xs font-bold glass px-3 py-1.5 rounded-full flex items-center gap-1 hover:neon-glow transition"
        >
          <BellRing className="w-3.5 h-3.5" />
          <span>{isTestingPush ? "..." : lang === "ar" ? "اختبار" : "Test"}</span>
        </button>
      </div>

      {/* Quick link to detailed timeline */}
      <Link
        to="/notification-history"
        className="glass rounded-2xl p-3 flex items-center justify-between gap-3 hover:neon-glow transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-neon flex items-center justify-center text-primary-foreground neon-glow shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-primary text-sm">
              {lang === "ar"
                ? "سجل الإشعارات والأنشطة المرتبطة"
                : "Notifications & Activity History"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {lang === "ar"
                ? "سجل كامل للإشعارات مع ربطها بالأدوية، المواعيد، وتمارين اليوم"
                : "Full timeline linking reminders to medications, visits & exercises"}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-primary rotate-180 rtl:rotate-0 shrink-0" />
      </Link>

      {/* Tabs */}
      <div className="glass rounded-full p-1 grid grid-cols-2 gap-1 text-sm font-bold">
        <button
          onClick={() => setTab("settings")}
          className={`py-2 rounded-full transition-all ${
            tab === "settings"
              ? "gradient-neon text-primary-foreground neon-glow shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          {lang === "ar" ? "إعدادات التذكيرات" : "Reminder Settings"}
        </button>
        <button
          onClick={() => setTab("history")}
          className={`py-2 rounded-full transition-all ${
            tab === "history"
              ? "gradient-neon text-primary-foreground neon-glow shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          {lang === "ar" ? `السجل الحديث (${log.length})` : `Recent Log (${log.length})`}
        </button>
      </div>

      {/* TAB 1: SETTINGS */}
      {tab === "settings" && (
        <div className="space-y-4 animate-page-enter">
          {/* REAL MOBILE WEB PUSH NOTIFICATION CARD */}
          <div className="glass rounded-3xl p-5 space-y-4 border-2 border-primary/30">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl gradient-neon flex items-center justify-center text-primary-foreground neon-glow shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-primary text-base">
                      {lang === "ar"
                        ? "إشعارات الهاتف المباشرة (Web Push)"
                        : "Real Mobile Web Push"}
                    </p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        pushSubscription
                          ? "bg-emerald-500/15 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {pushSubscription
                        ? lang === "ar"
                          ? "مفعلة ✓"
                          : "Active ✓"
                        : lang === "ar"
                          ? "غير مفعلة"
                          : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lang === "ar"
                      ? "إشعارات تظهر على شاشة القفل حتى عند إغلاق تبويب التطبيق أو قفل الهاتف (للهواتف والأنظمة المدعومة)."
                      : "Delivered to your lock screen even when tab is closed (on supported devices & OS)."}
                  </p>
                </div>
              </div>
            </div>

            {/* Platform status indicator */}
            <div className="p-3 rounded-2xl bg-white/50 dark:bg-black/30 border border-primary/20 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {lang === "ar" ? "دعم Web Push في المتصفح:" : "Browser Push Support:"}
                </span>
                <span className="font-bold text-foreground">
                  {isPushSupported
                    ? lang === "ar"
                      ? "مدعوم بالكامل ✓"
                      : "Fully Supported ✓"
                    : lang === "ar"
                      ? "غير مدعوم في هذا المتصفح"
                      : "Not supported in this browser"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {lang === "ar" ? "إذن الإشعارات من النظام:" : "System Permission:"}
                </span>
                <span
                  className={`font-bold ${
                    permission === "granted"
                      ? "text-emerald-600"
                      : permission === "denied"
                        ? "text-destructive"
                        : "text-amber-600"
                  }`}
                >
                  {permission === "granted"
                    ? lang === "ar"
                      ? "تم السماح ✓"
                      : "Granted ✓"
                    : permission === "denied"
                      ? lang === "ar"
                        ? "مرفوض في إعدادات المتصفح ✕"
                        : "Blocked by browser ✕"
                      : lang === "ar"
                        ? "بانتظار الموافقة"
                        : "Pending request"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {lang === "ar" ? "الأجهزة المسجلة بالسيرفر:" : "Active Server Devices:"}
                </span>
                <span className="font-bold text-primary tabular-nums num-en">
                  {serverStats?.activeDevices ?? (pushSubscription ? 1 : 0)}{" "}
                  {lang === "ar" ? "جهاز نشط" : "device(s)"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {lang === "ar" ? "نغمة الإشعار على الهاتف:" : "Phone Notification Sound:"}
                </span>
                <span className="font-bold text-emerald-600">
                  {lang === "ar" ? "قناة النظام الحقيقية (OS Native)" : "Native OS Channel"}
                </span>
              </div>
            </div>

            {/* Push toggle action button */}
            <div className="space-y-2">
              {permission !== "granted" ? (
                <button
                  onClick={requestPermission}
                  className="w-full gradient-neon text-primary-foreground rounded-2xl py-3 text-xs font-bold neon-glow shadow-sm hover:scale-[1.01] transition"
                >
                  {lang === "ar"
                    ? "🔔 طلب إذن الإشعارات من المتصفح"
                    : "🔔 Request Browser Permission"}
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleToggleWebPush}
                    disabled={isSubscribing}
                    className={`rounded-2xl py-2.5 text-xs font-bold transition-all ${
                      pushSubscription
                        ? "glass text-destructive hover:bg-destructive/10"
                        : "gradient-neon text-primary-foreground neon-glow"
                    }`}
                  >
                    {isSubscribing
                      ? "..."
                      : pushSubscription
                        ? lang === "ar"
                          ? "إلغاء اشتراك Web Push"
                          : "Disable Web Push"
                        : lang === "ar"
                          ? "تفعيل Web Push المباشر"
                          : "Enable Web Push"}
                  </button>
                  <button
                    onClick={handleTestWebPush}
                    disabled={isTestingPush}
                    className="glass rounded-2xl py-2.5 text-xs font-bold text-primary hover:neon-glow"
                  >
                    {isTestingPush
                      ? "..."
                      : lang === "ar"
                        ? "إرسال إشعار تجريبي للجهاز"
                        : "Send Test Push"}
                  </button>
                </div>
              )}
            </div>

            {/* Honest Platform Compatibility Note */}
            <div className="p-2.5 rounded-xl bg-muted/40 text-[11px] text-muted-foreground flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {lang === "ar"
                  ? "ملاحظة موثوقة: على أجهزة Android يعمل Web Push مباشرة. على أجهزة iOS (iPhone/iPad)، تتطلب سياسات Apple إضافة التطبيق للشاشة الرئيسية (Add to Home Screen) لتلقي الإشعارات في الخلفية مع نغمة النظام."
                  : "Note: Android supports Web Push natively. On iOS (iPhone/iPad), Apple requires adding the app to your Home Screen (PWA mode) for background push notifications."}
              </p>
            </div>
          </div>

          {/* MASTER NOTIFICATIONS TOGGLE & TIMEZONE */}
          <div className="glass rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-primary">
                  {lang === "ar" ? "المجدول الذكي للإشعارات" : "Smart Notification Scheduler"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {lang === "ar"
                    ? "فحص وتنبيه مواعيد الأدوية والمواعيد والفحوصات الدورية"
                    : "Automatic checks for medications, visits & daily care"}
                </p>
              </div>
              <Toggle on={settings.enabled} onChange={(v) => updateSettings({ enabled: v })} />
            </div>

            {/* Default Timezone Display (Africa/Algiers) */}
            <div className="p-3 rounded-2xl bg-white/40 dark:bg-black/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-foreground/80">
                <Globe className="w-4 h-4 text-primary" />
                <span className="font-bold">
                  {lang === "ar" ? "المنطقة الزمنية المعتمدة:" : "Time Zone:"}
                </span>
              </div>
              <span className="font-bold text-primary tabular-nums num-en">
                {DEFAULT_TIMEZONE} (GMT+1)
              </span>
            </div>
          </div>

          {/* SOUND AND VIBRATION SETTINGS */}
          <div className="glass rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" />
              <p className="font-bold text-primary">
                {lang === "ar" ? "الصوت والاهتزاز" : "Sound & Vibration"}
              </p>
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs font-bold text-foreground">
                  {lang === "ar" ? "نغمة الإشعار الصوتي" : "Notification Sound"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {lang === "ar"
                    ? "تشغيل نغمة النظام بالتزامن مع ظهور الإشعار على الهاتف"
                    : "Native system sound triggered in sync with notification"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={previewChimeSound}
                  className="px-2.5 py-1 rounded-xl glass text-[11px] font-bold text-primary hover:neon-glow transition"
                >
                  {lang === "ar" ? "استماع للنغمة" : "Preview"}
                </button>
                <Toggle
                  on={settings.sound_enabled}
                  onChange={(v) => updateSettings({ sound_enabled: v })}
                />
              </div>
            </div>

            {/* Vibration Toggle & Intensity */}
            <div className="space-y-3 pt-2 border-t border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Vibrate className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {lang === "ar" ? "الاهتزاز اللمسي (Haptic)" : "Haptic Vibration"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {lang === "ar"
                        ? "أنماط اهتزاز مخصصة لكل نوع إشعار"
                        : "Distinct patterns per category"}
                    </p>
                  </div>
                </div>
                <Toggle
                  on={settings.vibration_enabled}
                  onChange={(v) => updateSettings({ vibration_enabled: v })}
                />
              </div>

              {settings.vibration_enabled && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {lang === "ar" ? "شدة الاهتزاز:" : "Intensity:"}
                    </span>
                    <span className="text-primary font-bold tabular-nums num-en">
                      {Math.round((settings.vibration_intensity || 1) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.3}
                    max={1.5}
                    step={0.1}
                    value={settings.vibration_intensity || 1}
                    onChange={(e) =>
                      updateSettings({ vibration_intensity: Number(e.target.value) })
                    }
                    className="w-full accent-primary"
                  />
                  <button
                    type="button"
                    onClick={testVibration}
                    className="w-full glass rounded-xl py-2 text-xs font-bold text-primary hover:neon-glow"
                  >
                    {lang === "ar" ? "اختبار نمط الاهتزاز" : "Test Vibration Pattern"}
                  </button>
                </div>
              )}

              {/* Silent mode respect note */}
              <p className="text-[10px] text-muted-foreground leading-relaxed pt-1">
                {lang === "ar"
                  ? "يتم احترام وضع الصامت (Silent Mode) وعدم الإزعاج (DND) تلقائيًا بناءً على إعدادات نظام جهازك."
                  : "Silent mode and Do Not Disturb (DND) are always respected based on device OS settings."}
              </p>
            </div>
          </div>

          {/* QUIET HOURS */}
          <div className="glass rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-primary" />
              <p className="font-bold text-primary">
                {lang === "ar" ? "ساعات الهدوء والراحة" : "Quiet Rest Hours"}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {lang === "ar"
                ? "لن يتم إرسال أي إشعارات خلال هذه الفترة لضمان راحتكِ ونومكِ الهادئ."
                : "No notifications will be fired during this period to ensure quiet rest."}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <TimeField
                label={lang === "ar" ? "تبدأ من:" : "Starts at:"}
                value={settings.quiet_start || "22:00"}
                onChange={(v) => updateSettings({ quiet_start: v })}
              />
              <TimeField
                label={lang === "ar" ? "تنتهي عند:" : "Ends at:"}
                value={settings.quiet_end || "07:00"}
                onChange={(v) => updateSettings({ quiet_end: v })}
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
              <span className="font-bold text-foreground">
                {lang === "ar" ? "مدة التأجيل (زر لاحقًا):" : "Snooze duration:"}
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={settings.snooze_minutes || 10}
                  onChange={(e) =>
                    updateSettings({
                      snooze_minutes: Math.max(1, Number(e.target.value) || 10),
                    })
                  }
                  className="w-16 text-center bg-white/80 dark:bg-black/30 rounded-xl py-1 border border-primary/20 tabular-nums num-en font-bold"
                />
                <span className="text-muted-foreground">{lang === "ar" ? "دقيقة" : "min"}</span>
              </div>
            </div>
          </div>

          {/* SMART REMINDER CATEGORIES */}
          <div className="glass rounded-3xl p-5 space-y-4">
            <div>
              <p className="font-bold text-primary text-base">
                {lang === "ar" ? "جداول التذكيرات الذكية" : "Smart Reminder Categories"}
              </p>
              <p className="text-xs text-muted-foreground">
                {lang === "ar"
                  ? "تخصيص مواعيد وتكرار كل نشاط علاجي أو رعاية ذاتية"
                  : "Customize schedule and frequency for each care item"}
              </p>
            </div>

            {(Object.keys(settings.categories) as CategoryKey[]).map((k) => {
              const cfg = settings.categories[k] || { enabled: true, time: "09:00", frequency: 1 };
              const meta = CAT_LABELS[k] || {
                ar: k,
                en: k,
                icon: Bell,
              };
              const Icon = meta.icon;

              return (
                <div key={k} className="space-y-2 pb-3 border-b border-border last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {lang === "ar" ? meta.ar : meta.en}
                        </p>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          {CATEGORY_MESSAGES[k]?.[lang]?.body ?? ""}
                        </p>
                      </div>
                    </div>
                    <Toggle on={cfg.enabled} onChange={(v) => updateCategory(k, { enabled: v })} />
                  </div>

                  {cfg.enabled && (
                    <div className="flex items-center justify-between gap-2 text-xs ps-10 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span className="text-muted-foreground text-[11px]">
                          {lang === "ar" ? "الموعد:" : "Time:"}
                        </span>
                        <HmSelect
                          value={cfg.time}
                          onChange={(v) => updateCategory(k, { time: v })}
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground text-[11px]">
                          {lang === "ar" ? "التكرار:" : "Repeat:"}
                        </span>
                        <select
                          value={cfg.frequency}
                          onChange={(e) => updateCategory(k, { frequency: Number(e.target.value) })}
                          className="bg-white/70 dark:bg-black/30 rounded-lg px-2 py-1 border border-primary/20 text-xs tabular-nums num-en"
                        >
                          <option value={1}>{lang === "ar" ? "مرة" : "1x"}</option>
                          <option value={2}>{lang === "ar" ? "مرتين" : "2x"}</option>
                          <option value={3}>{lang === "ar" ? "3 مرات" : "3x"}</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: RECENT LOG */}
      {tab === "history" && (
        <div className="space-y-3 animate-page-enter">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-muted-foreground">
              {log.length} {lang === "ar" ? "إشعار مسجل" : "recorded items"}
            </p>
            {log.length > 0 && (
              <button
                onClick={clearLog}
                className="text-destructive text-xs flex items-center gap-1 hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === "ar" ? "مسح السجل" : "Clear Log"}</span>
              </button>
            )}
          </div>

          {log.length === 0 ? (
            <div className="glass rounded-3xl p-8 text-center space-y-2">
              <BellOff className="w-10 h-10 text-primary/40 mx-auto" />
              <p className="text-sm font-semibold text-primary">
                {lang === "ar" ? "لا توجد إشعارات مسجلة حديثاً" : "No recent notifications"}
              </p>
              <p className="text-xs text-muted-foreground">
                {lang === "ar"
                  ? "ستظهر هنا جميع التذكيرات الصادرة ومواعيد الأدوية والفحوصات."
                  : "All triggered reminders, medication alerts and visit notices will appear here."}
              </p>
            </div>
          ) : (
            log.map((n) => (
              <div
                key={n.id}
                className="glass rounded-2xl p-4 flex items-start gap-3 animate-page-enter border border-primary/15"
              >
                <div className="w-9 h-9 rounded-2xl gradient-neon flex items-center justify-center text-primary-foreground neon-glow shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-sm text-primary truncate">{n.title}</p>
                    <span
                      className="text-[10px] text-muted-foreground shrink-0 tabular-nums num-en"
                      dir="ltr"
                    >
                      {new Date(n.fired_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        timeZone: DEFAULT_TIMEZONE,
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80 mt-1 line-clamp-3 leading-relaxed">
                    {n.body}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                      {n.category}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        n.status === "done"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : n.status === "snoozed"
                            ? "bg-amber-500/15 text-amber-600"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {n.status === "done"
                        ? lang === "ar"
                          ? "مكتمل ✓"
                          : "Done ✓"
                        : n.status === "snoozed"
                          ? lang === "ar"
                            ? "مؤجل ⏱"
                            : "Snoozed ⏱"
                          : lang === "ar"
                            ? "تم الاستلام"
                            : "Delivered"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`w-12 h-7 rounded-full p-0.5 transition-all ${
        on ? "gradient-neon neon-glow" : "bg-muted"
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-5 rtl:-translate-x-5" : ""
        }`}
      />
    </button>
  );
}

function TimeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <HmSelect value={value} onChange={onChange} />
    </label>
  );
}

function HmSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [hh = "00", mm = "00"] = (value || "00:00").split(":");
  const setH = (h: string) => onChange(`${h}:${mm}`);
  const setM = (m: string) => onChange(`${hh}:${m}`);
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));
  const selectCls =
    "bg-white/80 dark:bg-black/30 rounded-lg px-1.5 py-1 border border-primary/20 tabular-nums num-en text-xs";
  return (
    <span dir="ltr" lang="en" className="inline-flex items-center gap-1 tabular-nums num-en">
      <select value={hh} onChange={(e) => setH(e.target.value)} className={selectCls}>
        {hours.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="opacity-60 font-bold">:</span>
      <select
        value={minutes.includes(mm) ? mm : mm}
        onChange={(e) => setM(e.target.value)}
        className={selectCls}
      >
        {minutes.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
        {!minutes.includes(mm) && <option value={mm}>{mm}</option>}
      </select>
    </span>
  );
}
