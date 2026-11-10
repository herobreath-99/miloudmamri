import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Home,
  BookOpen,
  Dumbbell,
  Sparkles,
  User as UserIcon,
  Bell,
  Users,
  Stethoscope,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { toast } from "sonner";
import appBg from "@/assets/pinkcare-app-bg.png";
import logoImg from "@/assets/pinkcare-logo.png";
import { useNotifications, type CategoryKey } from "@/lib/notifications";
import { RoleSwitcherBar } from "@/components/pinkcare/rbac/RoleSwitcherBar";
import { FloatingAiAssistant } from "@/components/pinkcare/ai/FloatingAiAssistant";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { user, profile, loading } = useAuth();
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (!loading && !profile && !user) nav({ to: "/auth" });
  }, [profile, user, loading, nav]);

  if (loading || (!profile && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Fixed app background image, visible across all sections */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: `url(${appBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      />
      {/* Soft readability overlay */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, oklch(1 0 0 / 0.55) 0%, oklch(0.96 0.05 340 / 0.55) 50%, oklch(0.92 0.08 320 / 0.65) 100%)",
        }}
      />
      <div className="relative min-h-screen pb-24 max-w-md mx-auto">
        <Header />
        <div
          key={loc.pathname}
          className={`animate-page-enter ${
            loc.pathname === "/exercise" || loc.pathname === "/community"
              ? "px-3 pt-1"
              : "px-5 pt-2"
          }`}
        >
          {loc.pathname !== "/exercise" && <RoleSwitcherBar lang={lang} />}
          <Outlet />
        </div>
        <FloatingAiAssistant />
        <BottomNav t={t} />
      </div>
    </div>
  );
}

function Header() {
  const { t, lang } = useI18n();
  const { snoozeLast, markDone } = useNotifications();
  const nav = useNavigate();
  const loc = useLocation();
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{
        title: string;
        body: string;
        category: CategoryKey | "custom";
        route?: string;
      }>;
      const { title, body, category, route } = ce.detail;
      void route;
      toast(title, {
        description: body,
        duration: 8000,
        action: {
          label: lang === "dz" ? "صحيتي ✓" : lang === "ar" ? "تم ✓" : "Done ✓",
          onClick: () => {
            markDone(category);
          },
        },
        cancel: {
          label: lang === "dz" ? "من بعد" : lang === "ar" ? "لاحقًا" : "Later",
          onClick: () => {
            snoozeLast();
          },
        },
      });
      setUnread((u) => u + 1);
    };
    window.addEventListener("pinkcare:notification", handler as EventListener);

    // Bridge OS notification action buttons (tapped on lock screen / system tray)
    // back into the app. The service worker forwards them via postMessage.
    const swMsg = (event: MessageEvent) => {
      const data = event.data || {};
      if (data.type === "pinkcare:action") {
        if (data.action === "done") {
          markDone(data.category);
          toast.success(
            lang === "dz"
              ? "تسجل النشاط يعطيك الصحة 💗"
              : lang === "ar"
                ? "تم تسجيل النشاط 💗"
                : "Marked as done 💗",
          );
        } else if (data.action === "snooze") {
          snoozeLast();
          toast(
            lang === "dz"
              ? "نعاودو نذكروك من بعد 🌸"
              : lang === "ar"
                ? "سنذكّرك لاحقًا 🌸"
                : "We'll remind you later 🌸",
          );
        }
      } else if (data.type === "pinkcare:navigate" && data.route) {
        nav({ to: data.route });
      }
    };
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", swMsg);
    }
    return () => {
      window.removeEventListener("pinkcare:notification", handler as EventListener);
      if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", swMsg);
      }
    };
  }, [lang, markDone, snoozeLast, nav]);
  return (
    <header className="flex items-center justify-between px-5 pt-6 pb-2">
      <div className="flex items-center gap-1.5">
        <Link
          to="/notifications"
          onClick={() => setUnread(0)}
          className="relative w-9 h-9 rounded-full glass flex items-center justify-center text-primary"
          title="الإشعارات والتذكيرات"
        >
          <Bell className="w-4.5 h-4.5" />
          {unread > 0 && (
            <span className="absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 rounded-full gradient-neon text-primary-foreground text-[10px] font-bold flex items-center justify-center neon-glow">
              {unread}
            </span>
          )}
        </Link>
        <Link
          to="/community"
          className={`w-9 h-9 rounded-full glass flex items-center justify-center transition ${
            loc.pathname === "/community"
              ? "gradient-neon text-primary-foreground neon-glow"
              : "text-primary hover:bg-primary/10"
          }`}
          title="مجتمع الدعم والمشاركة"
        >
          <Users className="w-4.5 h-4.5" />
        </Link>
        <Link
          to="/teleconsult"
          className={`w-9 h-9 rounded-full glass flex items-center justify-center transition ${
            loc.pathname === "/teleconsult"
              ? "bg-emerald-600 text-white shadow-md"
              : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
          }`}
          title="الاستشارات الطبية عن بُعد"
        >
          <Stethoscope className="w-4.5 h-4.5" />
        </Link>
      </div>

      <Link to="/home" className="flex items-center gap-1.5 focus:outline-none">
        <img src={logoImg} alt="PinkCare" className="w-7 h-7 object-contain drop-shadow" />
        <span className="text-lg font-bold bg-gradient-to-r from-pink-600 via-fuchsia-600 to-rose-500 bg-clip-text text-transparent">
          {t("appName")}
        </span>
      </Link>

      <Link
        to="/profile"
        className="w-9 h-9 rounded-full overflow-hidden glass border-2 border-primary/30 flex items-center justify-center text-primary"
      >
        <UserIcon className="w-4.5 h-4.5" />
      </Link>
    </header>
  );
}

function BottomNav({ t }: { t: (k: TranslationKey) => string }) {
  const loc = useLocation();
  const items = [
    { to: "/profile", icon: UserIcon, label: t("profile") },
    { to: "/learn", icon: BookOpen, label: t("learn") },
    { to: "/exercise", icon: Dumbbell, label: t("exercise") },
    { to: "/care", icon: Sparkles, label: t("care") },
    { to: "/home", icon: Home, label: t("home") },
  ] as const;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40">
      <div className="max-w-md mx-auto px-3 pb-5">
        <div className="glass-strong rounded-3xl flex items-center justify-around py-2 px-2 relative">
          {items.map(({ to, icon: Icon, label }) => {
            const active = loc.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-2xl transition-all duration-300 ${
                  active
                    ? "gradient-neon text-primary-foreground neon-glow scale-105"
                    : "text-muted-foreground hover:text-primary hover:-translate-y-0.5"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
