import { useEffect, useState } from "react";
import {
  Shield,
  User,
  Stethoscope,
  FileEdit,
  ShieldAlert,
  Sliders,
  ChevronDown,
  Sparkles,
  FlaskConical,
} from "lucide-react";
import { toast } from "sonner";
import { Link, useLocation } from "@tanstack/react-router";
import type { UserRole } from "@/types/roles";
import { getActiveUserRole, setActiveUserRole, hasPermission } from "@/lib/rbacStorage";
import type { Lang } from "@/lib/i18n";
import { RoleSecurityTesterModal } from "./RoleSecurityTesterModal";

type RoleSwitcherBarProps = {
  lang?: Lang;
};

const ROLES: {
  id: UserRole;
  labelAr: string;
  labelDz: string;
  labelFr: string;
  labelEn: string;
  personaAr: string;
  personaDz: string;
  personaFr: string;
  personaEn: string;
  color: string;
  icon: typeof User;
}[] = [
  {
    id: "patient",
    labelAr: "مستفيدة / مريضة",
    labelDz: "مستفيدة / مريضة",
    labelFr: "Patiente",
    labelEn: "Patient",
    personaAr: "سارة المنصوري (مستفيدة)",
    personaDz: "سارة المنصوري (مستفيدة)",
    personaFr: "Sarah Mansouri (Patiente)",
    personaEn: "Sarah Mansouri (Patient)",
    color: "from-pink-500 to-rose-400 text-white",
    icon: User,
  },
  {
    id: "professional",
    labelAr: "طبيبة أخصائية",
    labelDz: "طبيبة مختصة",
    labelFr: "Médecin spécialiste",
    labelEn: "Healthcare Pro",
    personaAr: "د. سارة بلقاسم (أورام)",
    personaDz: "د. سارة بلقاسم (طبيبة أورام)",
    personaFr: "Dr. Sarah Belkacem (Oncologue)",
    personaEn: "Dr. Sarah Belkacem (Oncologist)",
    color: "from-emerald-600 to-teal-500 text-white",
    icon: Stethoscope,
  },
  {
    id: "content_editor",
    labelAr: "محررة محتوى",
    labelDz: "محررة المحتوى",
    labelFr: "Éditeur de contenu",
    labelEn: "Content Editor",
    personaAr: "نور الهدى (محررة المقالات والفيديوهات)",
    personaDz: "نور الهدى (مقالات وفيديوهات)",
    personaFr: "Nour (Éditrice d'articles & vidéos)",
    personaEn: "Nour (Content Editor)",
    color: "from-blue-600 to-cyan-500 text-white",
    icon: FileEdit,
  },
  {
    id: "community_moderator",
    labelAr: "مشرفة مجتمع",
    labelDz: "مشرفة المجتمع",
    labelFr: "Modératrice",
    labelEn: "Moderator",
    personaAr: "خديجة (مشرفة الدعم ومكافحة التجاوزات)",
    personaDz: "خديجة (مشرفة الدعم والأمان)",
    personaFr: "Khadija (Modératrice espace sûr)",
    personaEn: "Khadija (Safe Space Moderator)",
    color: "from-amber-600 to-orange-500 text-white",
    icon: ShieldAlert,
  },
  {
    id: "platform_admin",
    labelAr: "مدير المنصة العام",
    labelDz: "مسؤول المنصة",
    labelFr: "Administrateur",
    labelEn: "Platform Admin",
    personaAr: "د. أمين (الإشراف الطبي والتقني الكامل)",
    personaDz: "د. أمين (الإشراف الطبي والتقني الكامل)",
    personaFr: "Dr. Amine (Administration complète)",
    personaEn: "Dr. Amine (Full Platform Administrator)",
    color: "from-purple-600 to-indigo-600 text-white",
    icon: Shield,
  },
];

function getRoleLabel(role: (typeof ROLES)[0], lang: Lang) {
  if (lang === "ar") return role.labelAr;
  if (lang === "dz") return role.labelDz;
  if (lang === "fr") return role.labelFr;
  return role.labelEn;
}

function getRolePersona(role: (typeof ROLES)[0], lang: Lang) {
  if (lang === "ar") return role.personaAr;
  if (lang === "dz") return role.personaDz;
  if (lang === "fr") return role.personaFr;
  return role.personaEn;
}

export function RoleSwitcherBar({ lang = "ar" }: RoleSwitcherBarProps) {
  const [currentRole, setCurrentRole] = useState<UserRole>("patient");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showSecurityTester, setShowSecurityTester] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    setCurrentRole(getActiveUserRole());
    const handleSwitch = (e: Event) => {
      const ce = e as CustomEvent<UserRole>;
      setCurrentRole(ce.detail);
    };
    window.addEventListener("pinkcare:rbac-role-switched", handleSwitch);
    return () => window.removeEventListener("pinkcare:rbac-role-switched", handleSwitch);
  }, []);

  const handleSelectRole = (r: UserRole) => {
    setActiveUserRole(r);
    setCurrentRole(r);
    setOpenDropdown(false);
    const meta = ROLES.find((x) => x.id === r);
    const label = meta ? getRoleLabel(meta, lang) : r;
    const persona = meta ? getRolePersona(meta, lang) : "";
    toast.success(
      lang === "ar" || lang === "dz"
        ? `تم التبديل إلى دور: ${label} (${persona})`
        : lang === "fr"
          ? `Rôle changé en: ${label} (${persona})`
          : `Switched role to: ${label} (${persona})`,
    );
  };

  const activeMeta = ROLES.find((r) => r.id === currentRole) || ROLES[0];
  const ActiveIcon = activeMeta.icon;

  const canAccessAdmin =
    hasPermission(currentRole, "manage_users") ||
    hasPermission(currentRole, "moderate_community") ||
    hasPermission(currentRole, "manage_articles");

  const canAccessPro = hasPermission(currentRole, "view_authorized_patient_consultations");

  return (
    <>
      <div className="glass-strong rounded-2xl px-3 py-2 border border-primary/20 shadow-xs mb-3 flex items-center justify-between gap-2 text-xs">
        {/* Role Selector Trigger */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-card border border-border hover:bg-muted text-foreground transition"
          >
            <div
              className={`w-5 h-5 rounded-lg bg-gradient-to-tr ${activeMeta.color} flex items-center justify-center shrink-0 shadow-xs`}
            >
              <ActiveIcon className="w-3 h-3" />
            </div>
            <div className="text-start">
              <span className="font-bold block text-[11px] leading-tight">
                {getRoleLabel(activeMeta, lang)}
              </span>
              <span className="text-[9px] text-muted-foreground block truncate max-w-[120px] sm:max-w-[160px]">
                {getRolePersona(activeMeta, lang)}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
          </button>

          {/* Role Dropdown Menu */}
          {openDropdown && (
            <div className="absolute start-0 top-11 z-50 w-72 rounded-2xl bg-card border border-border shadow-2xl p-2 space-y-1 animate-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[10px] text-muted-foreground font-bold uppercase tracking-wider border-b border-border/50 mb-1">
                {lang === "ar" || lang === "dz"
                  ? "تبديل الصلاحية (اختبار الأدوار المستقل):"
                  : lang === "fr"
                    ? "Changer de rôle (test RBAC) :"
                    : "Switch Role Persona:"}
              </div>

              {ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = role.id === currentRole;
                return (
                  <button
                    key={role.id}
                    onClick={() => handleSelectRole(role.id)}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-start transition text-xs ${
                      isSelected
                        ? "bg-primary/10 text-primary font-bold border border-primary/20"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${role.color} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-semibold text-xs leading-snug">
                        {getRoleLabel(role, lang)}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {getRolePersona(role, lang)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Dashboard Shortcut Links */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {/* Patient App link */}
          <Link
            to="/home"
            className={`px-2.5 py-1.5 rounded-xl font-medium text-[11px] transition ${
              loc.pathname === "/home"
                ? "bg-primary text-primary-foreground font-bold"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {lang === "ar" || lang === "dz" ? "المستفيدة" : lang === "fr" ? "Patiente" : "Patient"}
          </Link>

          {/* Professional Dashboard Link */}
          {canAccessPro && (
            <Link
              to="/professional"
              className={`px-2.5 py-1.5 rounded-xl font-medium text-[11px] flex items-center gap-1 transition ${
                loc.pathname === "/professional"
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : "text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>
                {lang === "ar" || lang === "dz"
                  ? "لوحة الطبيبة"
                  : lang === "fr"
                    ? "Espace Médecin"
                    : "Doctor Hub"}
              </span>
            </Link>
          )}

          {/* Admin & Moderation Dashboard Link */}
          {canAccessAdmin && (
            <Link
              to="/admin"
              className={`px-2.5 py-1.5 rounded-xl font-medium text-[11px] flex items-center gap-1 transition ${
                loc.pathname === "/admin"
                  ? "bg-purple-600 text-white font-bold shadow-xs"
                  : "text-purple-700 dark:text-purple-400 hover:bg-purple-500/10"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>
                {lang === "ar" || lang === "dz"
                  ? "لوحة الإدارة"
                  : lang === "fr"
                    ? "Administration"
                    : "Admin Hub"}
              </span>
            </Link>
          )}

          {/* Security & Access Tester Modal trigger */}
          <button
            onClick={() => setShowSecurityTester(true)}
            className="p-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground text-[10px] font-bold flex items-center gap-1"
            title="فحص واختبار أمان الصلاحيات (Security Tester)"
          >
            <FlaskConical className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">
              {lang === "ar" || lang === "dz"
                ? "فحص الأمان"
                : lang === "fr"
                  ? "Audit Sécurité"
                  : "Test Security"}
            </span>
          </button>
        </div>
      </div>

      {showSecurityTester && (
        <RoleSecurityTesterModal
          currentRole={currentRole}
          onClose={() => setShowSecurityTester(false)}
          lang={lang}
        />
      )}
    </>
  );
}
