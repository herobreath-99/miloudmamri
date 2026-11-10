import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Shield,
  Users,
  BadgeCheck,
  FileText,
  Video,
  ShieldAlert,
  Bell,
  Settings,
  History,
  TrendingUp,
  Search,
  Check,
  X,
  Lock,
  Plus,
  RefreshCw,
  AlertTriangle,
  FileCheck2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import type {
  UserRole,
  UserAccount,
  NotificationTemplate,
  PlatformSettings,
  AuditLogEntry,
} from "@/types/roles";
import {
  getActiveUserRole,
  hasPermission,
  getUserAccounts,
  updateUserRole,
  updateUserStatus,
  getAuditLogs,
  getPlatformSettings,
  savePlatformSettings,
  getNotificationTemplates,
  saveNotificationTemplate,
  getRealPlatformAnalytics,
} from "@/lib/rbacStorage";
import {
  getDoctors,
  approveDoctorVerification,
  rejectDoctorVerification,
} from "@/lib/teleconsultStorage";
import { getCommunityReports, resolveReport, getCommunityPosts } from "@/lib/communityStorage";

export const Route = createFileRoute("/_app/admin")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { profile } = useAuth();
  const { lang } = useI18n();

  const [currentRole, setCurrentRole] = useState<UserRole>(getActiveUserRole());
  const [activeTab, setActiveTab] = useState<
    | "analytics"
    | "users"
    | "doctors"
    | "content"
    | "community"
    | "notifications"
    | "settings"
    | "audit"
  >("analytics");

  // State data
  const [analytics, setAnalytics] = useState(getRealPlatformAnalytics());
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [doctors, setDoctors] = useState(getDoctors());
  const [reports, setReports] = useState(getCommunityReports());
  const [posts, setPosts] = useState(getCommunityPosts());
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(getPlatformSettings());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [userSearch, setUserSearch] = useState("");

  const refreshAll = () => {
    const role = getActiveUserRole();
    setCurrentRole(role);
    setAnalytics(getRealPlatformAnalytics());
    setUsers(getUserAccounts());
    setDoctors(getDoctors());
    setReports(getCommunityReports());
    setPosts(getCommunityPosts());
    setTemplates(getNotificationTemplates());
    setPlatformSettings(getPlatformSettings());
    setAuditLogs(getAuditLogs());

    setActiveTab((prev) => {
      if (prev === "users" && !hasPermission(role, "manage_users")) return "analytics";
      if (prev === "doctors" && !hasPermission(role, "verify_professionals")) return "analytics";
      if (prev === "content" && !hasPermission(role, "manage_articles")) return "analytics";
      if (prev === "community" && !hasPermission(role, "moderate_community")) return "analytics";
      if (prev === "notifications" && !hasPermission(role, "manage_notifications"))
        return "analytics";
      if (prev === "settings" && !hasPermission(role, "manage_settings")) return "analytics";
      if (prev === "audit" && !hasPermission(role, "view_audit_logs")) return "analytics";
      return prev;
    });
  };

  useEffect(() => {
    refreshAll();
    const handleUpd = () => refreshAll();
    window.addEventListener("pinkcare:rbac-role-switched", handleUpd);
    window.addEventListener("pinkcare:rbac-users-updated", handleUpd);
    window.addEventListener("pinkcare:rbac-audit-updated", handleUpd);
    window.addEventListener("pinkcare:rbac-settings-updated", handleUpd);
    window.addEventListener("pinkcare:rbac-templates-updated", handleUpd);
    window.addEventListener("pinkcare:doctors-updated", handleUpd);
    window.addEventListener("pinkcare:reports-updated", handleUpd);
    window.addEventListener("pinkcare:community-updated", handleUpd);
    return () => {
      window.removeEventListener("pinkcare:rbac-role-switched", handleUpd);
      window.removeEventListener("pinkcare:rbac-users-updated", handleUpd);
      window.removeEventListener("pinkcare:rbac-audit-updated", handleUpd);
      window.removeEventListener("pinkcare:rbac-settings-updated", handleUpd);
      window.removeEventListener("pinkcare:rbac-templates-updated", handleUpd);
      window.removeEventListener("pinkcare:doctors-updated", handleUpd);
      window.removeEventListener("pinkcare:reports-updated", handleUpd);
      window.removeEventListener("pinkcare:community-updated", handleUpd);
    };
  }, []);

  const actor = {
    id: profile?.id || "user-admin-1",
    name: profile ? `${profile.first_name} ${profile.last_name}` : "د. أمين بن علي",
    role: currentRole,
  };

  // Permission guards for entire console vs editor/moderator sub-views
  const isAuthorized =
    hasPermission(currentRole, "manage_users") ||
    hasPermission(currentRole, "moderate_community") ||
    hasPermission(currentRole, "manage_articles");

  if (!isAuthorized) {
    return (
      <div className="glass rounded-3xl p-8 text-center space-y-4 my-8 border border-destructive/30">
        <div className="w-16 h-16 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            {lang === "ar" ? "منطقة الإدارة والإشراف مقيدة" : "Restricted Administration Area"}
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 leading-relaxed">
            {lang === "ar"
              ? "يتطلب الوصول إلى لوحة الإدارة دور [مدير منصة]، [مشرف مجتمع]، أو [محرر محتوى]. بدّلي دوركِ من الشريط العلوي لتجربة الإدارة."
              : "Access requires Platform Admin, Moderator, or Content Editor role. Switch role at the top bar."}
          </p>
        </div>
      </div>
    );
  }

  // Handle changing user role
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const ok = updateUserRole(userId, newRole, actor);
    if (ok) {
      toast.success(lang === "ar" ? "تم تحديث صلاحيات المستخدم بنجاح" : "User role updated");
      refreshAll();
    } else {
      toast.error(lang === "ar" ? "ليس لديكِ صلاحية لتغيير الأدوار" : "Permission denied");
    }
  };

  // Handle toggling account status
  const handleStatusChange = (userId: string, status: "active" | "suspended") => {
    const ok = updateUserStatus(userId, status, actor);
    if (ok) {
      toast.success(lang === "ar" ? "تم تحديث حالة الحساب" : "User status updated");
      refreshAll();
    } else {
      toast.error(lang === "ar" ? "ليس لديكِ صلاحية لتعديل الحسابات" : "Permission denied");
    }
  };

  // Handle doctor verification
  const handleApproveDoctor = (id: string, name: string) => {
    approveDoctorVerification(id, actor.name);
    toast.success(
      lang === "ar" ? `تم اعتماد ترخيص ${name} وتفعيل الحجوزات ✓` : `Verified ${name} ✓`,
    );
    refreshAll();
  };

  const handleRejectDoctor = (id: string, name: string) => {
    const reason = prompt(lang === "ar" ? "سبب رفض الاعتماد:" : "Rejection reason:");
    rejectDoctorVerification(id, reason || "عدم تطابق الوثائق");
    toast.error(lang === "ar" ? `تم رفض طلب اعتماد ${name}` : `Rejected ${name}`);
    refreshAll();
  };

  // Handle reports
  const handleResolveReport = (reportId: string, action: "dismiss" | "remove_post" | "warn") => {
    resolveReport(reportId, action);
    toast.success(lang === "ar" ? "تمت معالجة البلاغ بنجاح ✓" : "Report processed ✓");
    refreshAll();
  };

  // Handle settings toggle
  const handleToggleSetting = (key: keyof PlatformSettings, value: boolean) => {
    const next = { ...platformSettings, [key]: value };
    savePlatformSettings(next, actor);
    setPlatformSettings(next);
    toast.success(lang === "ar" ? "تم حفظ إعدادات المنصة" : "Settings saved");
  };

  const filteredUsers = users.filter((u) => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 pb-16">
      {/* Top Banner */}
      <div className="glass rounded-3xl p-5 border border-purple-500/30 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              {lang === "ar" ? "لوحة التحكم والإدارة المركزية" : "Platform Administration"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {lang === "ar"
                ? `الدور النشط: [${currentRole}] • المستخدم: ${actor.name}`
                : `Active Role: [${currentRole}] • Actor: ${actor.name}`}
            </p>
          </div>
        </div>
        <button
          onClick={refreshAll}
          className="p-2 rounded-xl bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground"
          title="تحديث البيانات"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
            activeTab === "analytics"
              ? "bg-purple-600 text-white shadow-xs"
              : "bg-card/70 border border-border/60 text-muted-foreground hover:bg-muted"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{lang === "ar" ? "الإحصائيات الحقيقية" : "Real Analytics"}</span>
        </button>

        {hasPermission(currentRole, "manage_users") && (
          <button
            onClick={() => setActiveTab("users")}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "users"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-card/70 border border-border/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "إدارة المستخدمين" : "Users"}</span>
          </button>
        )}

        {hasPermission(currentRole, "verify_professionals") && (
          <button
            onClick={() => setActiveTab("doctors")}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "doctors"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-card/70 border border-border/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            <BadgeCheck className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "اعتماد الأطباء" : "Doctors"}</span>
            {analytics.professionals.pending > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
        )}

        {hasPermission(currentRole, "manage_articles") && (
          <button
            onClick={() => setActiveTab("content")}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "content"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-card/70 border border-border/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "المحتوى والفيديوهات" : "Content"}</span>
          </button>
        )}

        {hasPermission(currentRole, "moderate_community") && (
          <button
            onClick={() => setActiveTab("community")}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "community"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-card/70 border border-border/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "إشراف المجتمع" : "Moderation"}</span>
            {analytics.contentAndCommunity.pendingReports > 0 && (
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            )}
          </button>
        )}

        {hasPermission(currentRole, "manage_notification_templates") && (
          <button
            onClick={() => setActiveTab("notifications")}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "notifications"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-card/70 border border-border/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "قوالب الإشعارات" : "Notifications"}</span>
          </button>
        )}

        {hasPermission(currentRole, "manage_platform_settings") && (
          <button
            onClick={() => setActiveTab("settings")}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "settings"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-card/70 border border-border/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "إعدادات المنصة" : "Settings"}</span>
          </button>
        )}

        {hasPermission(currentRole, "view_audit_logs") && (
          <button
            onClick={() => setActiveTab("audit")}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "audit"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-card/70 border border-border/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "سجل العمليات (Audit)" : "Audit Trail"}</span>
          </button>
        )}
      </div>

      {/* TAB 1: REAL DATABASE ANALYTICS (Requirement 5) */}
      {activeTab === "analytics" && (
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 text-[11px] text-muted-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary shrink-0" />
            <span>
              {lang === "ar"
                ? "جميع المؤشرات محسوبة ديناميكياً من سجلات قاعدة البيانات الحقيقية فقط (دون أرقام مصطنعة)."
                : "All metrics are computed in real-time strictly from real stored database records."}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="glass rounded-3xl p-4 border border-border text-center space-y-1">
              <span className="text-[11px] text-muted-foreground">إجمالي المستخدمين</span>
              <p className="text-2xl font-bold font-mono text-foreground">
                {analytics.users.total}
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold block">
                {analytics.users.activeLast7Days} نشطين خلال 7 أيام
              </span>
            </div>

            <div className="glass rounded-3xl p-4 border border-border text-center space-y-1">
              <span className="text-[11px] text-muted-foreground">الأطباء المعتمدون</span>
              <p className="text-2xl font-bold font-mono text-emerald-600">
                {analytics.professionals.verified}
              </p>
              <span className="text-[10px] text-amber-600 font-semibold block">
                {analytics.professionals.pending} بانتظار الاعتماد
              </span>
            </div>

            <div className="glass rounded-3xl p-4 border border-border text-center space-y-1">
              <span className="text-[11px] text-muted-foreground">استشارات محجوزة</span>
              <p className="text-2xl font-bold font-mono text-primary">
                {analytics.consultations.total}
              </p>
              <span className="text-[10px] text-muted-foreground block">
                {analytics.consultations.completed} مكتملة • {analytics.consultations.confirmed}{" "}
                مؤكدة
              </span>
            </div>

            <div className="glass rounded-3xl p-4 border border-border text-center space-y-1">
              <span className="text-[11px] text-muted-foreground">منشورات المجتمع</span>
              <p className="text-2xl font-bold font-mono text-foreground">
                {analytics.contentAndCommunity.totalPosts}
              </p>
              <span className="text-[10px] text-emerald-600 block">
                {analytics.contentAndCommunity.activePosts} نشط •{" "}
                {analytics.contentAndCommunity.removedPosts} محذوف
              </span>
            </div>

            <div className="glass rounded-3xl p-4 border border-border text-center space-y-1">
              <span className="text-[11px] text-muted-foreground">بلاغات الإشراف</span>
              <p className="text-2xl font-bold font-mono text-destructive">
                {analytics.contentAndCommunity.totalReports}
              </p>
              <span className="text-[10px] text-amber-600 block">
                {analytics.contentAndCommunity.pendingReports} بلاغ معلق للمراجعة
              </span>
            </div>

            <div className="glass rounded-3xl p-4 border border-border text-center space-y-1">
              <span className="text-[11px] text-muted-foreground">قوالب الإشعارات</span>
              <p className="text-2xl font-bold font-mono text-foreground">
                {analytics.notifications.templatesCount}
              </p>
              <span className="text-[10px] text-emerald-600 block">
                {analytics.notifications.activeTemplatesCount} مفعل في الجدولة
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER ACCOUNTS & ROLE PERMISSION MANAGEMENT */}
      {activeTab === "users" && hasPermission(currentRole, "manage_users") && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder={lang === "ar" ? "ابحثي بالاسم أو البريد أو الدور..." : "Search users..."}
              className="w-full bg-card border border-border rounded-2xl ps-9 pe-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-purple-500"
            />
          </div>

          <div className="space-y-2.5">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="glass rounded-3xl p-4 border border-border space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-foreground">
                        {u.firstName} {u.lastName}
                      </span>
                      <span
                        className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                          u.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {u.status === "active" ? "نشط" : "معلق"}
                      </span>
                    </div>
                    <p className="text-muted-foreground font-mono text-[11px]">{u.email}</p>
                  </div>

                  <button
                    onClick={() =>
                      handleStatusChange(u.id, u.status === "active" ? "suspended" : "active")
                    }
                    className="text-[11px] text-muted-foreground hover:text-foreground font-medium underline"
                  >
                    {u.status === "active" ? "تعليق الحساب" : "تفعيل الحساب"}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border/40">
                  <span className="text-muted-foreground text-[11px]">
                    الدور الوظيفي والصلاحيات:
                  </span>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                    className="bg-background border border-border rounded-xl px-2.5 py-1 text-xs text-foreground focus:outline-hidden focus:border-purple-500 font-semibold"
                  >
                    <option value="patient">مستفيدة / مريضة (Patient)</option>
                    <option value="professional">طبيبة أخصائية (Healthcare Pro)</option>
                    <option value="content_editor">محررة محتوى (Content Editor)</option>
                    <option value="community_moderator">مشرفة مجتمع (Moderator)</option>
                    <option value="platform_admin">مدير المنصة (Platform Admin)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROFESSIONAL VERIFICATION */}
      {activeTab === "doctors" && hasPermission(currentRole, "verify_professionals") && (
        <div className="space-y-3">
          {doctors.map((doc) => {
            const isPending = doc.verificationStatus === "pending";
            const isVerified = doc.verificationStatus === "verified";
            return (
              <div
                key={doc.id}
                className={`glass rounded-3xl p-4 border text-xs space-y-2.5 ${
                  isPending ? "border-amber-500/40 bg-amber-500/5" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-border shrink-0">
                      <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-foreground">{doc.name}</span>
                        <span
                          className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                            isVerified
                              ? "bg-emerald-500/10 text-emerald-600"
                              : isPending
                                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                                : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {isVerified ? "معتمد" : isPending ? "بانتظار التحقق" : "مرفوض"}
                        </span>
                      </div>
                      <p className="text-primary font-medium text-[11px]">{doc.title}</p>
                      <p className="text-muted-foreground text-[11px]">{doc.hospital}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => handleRejectDoctor(doc.id, doc.name)}
                          className="px-2.5 py-1.5 rounded-xl bg-destructive/10 text-destructive text-xs font-bold"
                        >
                          رفض
                        </button>
                        <button
                          onClick={() => handleApproveDoctor(doc.id, doc.name)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs"
                        >
                          اعتماد الرخصة ✓
                        </button>
                      </>
                    ) : isVerified ? (
                      <button
                        onClick={() => handleRejectDoctor(doc.id, doc.name)}
                        className="px-2.5 py-1 rounded-xl border border-destructive/30 text-destructive text-[11px]"
                      >
                        سحب الاعتماد
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApproveDoctor(doc.id, doc.name)}
                        className="px-2.5 py-1 rounded-xl border border-emerald-500/30 text-emerald-600 text-[11px]"
                      >
                        إعادة الاعتماد
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-muted/40 p-2.5 rounded-2xl border border-border/40 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-muted-foreground block">رقم رخصة الممارسة:</span>
                    <span className="font-mono font-bold text-foreground">{doc.licenseNumber}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">الهيئة أو المجلس:</span>
                    <span className="font-semibold text-foreground">
                      {doc.medicalCouncil || "المجلس الوطني"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: EDUCATIONAL CONTENT & VIDEO LIBRARY */}
      {activeTab === "content" && hasPermission(currentRole, "manage_articles") && (
        <div className="glass rounded-3xl p-5 border border-border space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-primary" />
              <span>
                {lang === "ar" ? "إدارة المحتوى والمكتبة المرئية" : "Educational Content Library"}
              </span>
            </h3>
            <span className="text-[10px] text-muted-foreground">صلاحيات محرر المحتوى</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            يمكن لمحرر المحتوى مراجعة المقالات الطبية المعتمدة، تحديث المراجع العلمية، وإضافة روابط
            الفيديوهات التوعوية.
          </p>
          <div className="space-y-2 pt-2">
            <div className="p-3 rounded-2xl bg-muted/30 border border-border/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-foreground">
                  مكتبة المقالات الصحية (10 أقسام علاجية)
                </span>
                <p className="text-[10px] text-muted-foreground">
                  إعادة التأهيل، العناية بالبشرة، الدعم النفسي، التغذية
                </p>
              </div>
              <span className="text-xs text-primary font-bold">نشط</span>
            </div>
            <div className="p-3 rounded-2xl bg-muted/30 border border-border/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-foreground">مكتبة الفيديوهات التوعوية المدمجة</span>
                <p className="text-[10px] text-muted-foreground">
                  تضم 5 فيديوهات موجهة معتمدة من مشغل YouTube
                </p>
              </div>
              <span className="text-xs text-primary font-bold">نشط</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COMMUNITY MODERATION */}
      {activeTab === "community" && hasPermission(currentRole, "moderate_community") && (
        <div className="space-y-3">
          {reports.length > 0 ? (
            reports.map((rep) => {
              const isPending = rep.status === "pending";
              return (
                <div
                  key={rep.id}
                  className={`glass rounded-3xl p-4 border text-xs space-y-2.5 ${
                    isPending ? "border-destructive/30 bg-destructive/5" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-destructive flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{rep.reason}</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="bg-background p-2.5 rounded-2xl border border-border text-[11px] italic">
                    "{rep.targetPreview}"
                  </div>

                  {rep.details && (
                    <p className="text-[11px] text-foreground/80">
                      <span className="font-bold">ملاحظات المُبلغ: </span>
                      {rep.details}
                    </p>
                  )}

                  {isPending ? (
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/30">
                      <button
                        onClick={() => handleResolveReport(rep.id, "dismiss")}
                        className="px-3 py-1.5 rounded-xl text-muted-foreground hover:bg-muted"
                      >
                        حفظ وتجاهل
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, "remove_post")}
                        className="px-3.5 py-1.5 rounded-xl bg-destructive text-destructive-foreground font-bold shadow-xs"
                      >
                        حذف المنشور فوراً
                      </button>
                    </div>
                  ) : (
                    <p className="text-[10px] text-muted-foreground font-mono">
                      الحالة: {rep.status} — {rep.resolutionNotes}
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <div className="glass rounded-3xl p-6 text-center text-xs text-muted-foreground">
              لا توجد بلاغات مجتمع معلقة حالياً 🌸
            </div>
          )}
        </div>
      )}

      {/* TAB 6: NOTIFICATION TEMPLATES */}
      {activeTab === "notifications" && hasPermission(currentRole, "manage_notifications") && (
        <div className="space-y-3">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="glass rounded-3xl p-4 border border-border space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-sm">{tpl.titleAr}</span>
                <span
                  className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                    tpl.enabled
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tpl.enabled ? "مفعل" : "معطل"}
                </span>
              </div>
              <p className="text-foreground/80 text-[11px] leading-relaxed bg-muted/30 p-2.5 rounded-xl">
                {tpl.bodyAr}
              </p>
              <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
                <span>التصنيف: {tpl.category}</span>
                <button
                  onClick={() => {
                    const next = !tpl.enabled;
                    saveNotificationTemplate({ ...tpl, enabled: next }, actor);
                    refreshAll();
                  }}
                  className="font-semibold text-primary underline"
                >
                  {tpl.enabled ? "تعطيل القالب" : "تفعيل القالب"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 7: PLATFORM SETTINGS */}
      {activeTab === "settings" && hasPermission(currentRole, "manage_settings") && (
        <div className="glass rounded-3xl p-5 border border-border space-y-4 text-xs">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-purple-600" />
            <span>{lang === "ar" ? "إعدادات الأمان والتشفير العامة" : "Platform Settings"}</span>
          </h3>

          <div className="space-y-3 pt-1">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/40 cursor-pointer">
              <div>
                <span className="font-bold text-foreground block">
                  فلتر الأمان الطبي الصارم (Anti-Medical-Advice)
                </span>
                <span className="text-[10px] text-muted-foreground">
                  منع الترويج لجرعات غير معتمدة أو بدائل كيميائية غير موثقة
                </span>
              </div>
              <input
                type="checkbox"
                checked={platformSettings.strictMedicalSafetyFilter}
                onChange={(e) => handleToggleSetting("strictMedicalSafetyFilter", e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/40 cursor-pointer">
              <div>
                <span className="font-bold text-foreground block">
                  اشتراط اعتماد الترخيص الطبي قبل فتح الحجز
                </span>
                <span className="text-[10px] text-muted-foreground">
                  حظر حجوزات الطبيب حتى يوافق المدير الإداري على الرخصة
                </span>
              </div>
              <input
                type="checkbox"
                checked={platformSettings.requireDoctorAccreditationBeforeBooking}
                onChange={(e) =>
                  handleToggleSetting("requireDoctorAccreditationBeforeBooking", e.target.checked)
                }
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/40 cursor-pointer">
              <div>
                <span className="font-bold text-foreground block">
                  النشر باسم مستعار كإعداد افتراضي
                </span>
                <span className="text-[10px] text-muted-foreground">
                  تفعيل إخفاء الهوية لحماية خصوصية مريضات السرطان
                </span>
              </div>
              <input
                type="checkbox"
                checked={platformSettings.anonymousCommunityPostingDefault}
                onChange={(e) =>
                  handleToggleSetting("anonymousCommunityPostingDefault", e.target.checked)
                }
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      )}

      {/* TAB 8: AUDIT TRAIL LOGS (Requirement 6) */}
      {activeTab === "audit" && hasPermission(currentRole, "view_audit_logs") && (
        <div className="space-y-2.5">
          <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 text-[11px] text-muted-foreground flex items-center gap-2">
            <History className="w-4 h-4 text-purple-600 shrink-0" />
            <span>سجل تدقيق زمني غير قابل للتعديل لجميع العمليات الإدارية وتغييرات الصلاحيات.</span>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="glass rounded-2xl p-3 border border-border/60 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{log.action}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    • {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[11px] text-foreground/80">{log.details}</p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5 border-t border-border/30">
                  <span>
                    المنفذ: {log.actorName} ({log.actorRole})
                  </span>
                  <span
                    className={`font-semibold ${
                      log.status === "success"
                        ? "text-emerald-600"
                        : log.status === "denied"
                          ? "text-destructive font-bold"
                          : "text-amber-600"
                    }`}
                  >
                    {log.status === "success" ? "تم بنجاح ✓" : "محاولة محظورة ✗"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
