import {
  UserRole,
  PermissionKey,
  ROLE_PERMISSIONS,
  UserAccount,
  AuditLogEntry,
  PlatformSettings,
  NotificationTemplate,
} from "@/types/roles";
import { getDoctors, getBookings } from "./teleconsultStorage";
import { getCommunityPosts, getCommunityReports } from "./communityStorage";

const USERS_KEY = "pc_rbac_user_accounts_v1";
const AUDIT_KEY = "pc_rbac_audit_logs_v1";
const SETTINGS_KEY = "pc_rbac_platform_settings_v1";
const TEMPLATES_KEY = "pc_rbac_notification_templates_v1";
const CURRENT_ROLE_OVERRIDE_KEY = "pc_rbac_current_role_override_v1";

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: "user-patient-1",
    email: "sarah.patient@pinkcare.app",
    firstName: "سارة",
    lastName: "المنصوري",
    role: "patient",
    status: "active",
    createdAt: "2025-01-10T08:00:00.000Z",
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: "user-pro-doc1",
    email: "dr.sarah.belkacem@cpmc.dz",
    firstName: "د. سارة",
    lastName: "بلقاسم",
    role: "professional",
    status: "active",
    assignedProfessionalId: "doc-1",
    createdAt: "2025-01-12T10:00:00.000Z",
    lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "user-editor-1",
    email: "nour.editor@pinkcare.app",
    firstName: "نور الهدى",
    lastName: "قاسمي",
    role: "content_editor",
    status: "active",
    createdAt: "2025-01-15T09:30:00.000Z",
    lastLoginAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "user-mod-1",
    email: "khadija.mod@pinkcare.app",
    firstName: "خديجة",
    lastName: "عمراوي",
    role: "community_moderator",
    status: "active",
    createdAt: "2025-01-18T11:00:00.000Z",
    lastLoginAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "user-admin-1",
    email: "dr.amine.admin@pinkcare.app",
    firstName: "د. أمين",
    lastName: "بن علي",
    role: "platform_admin",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    lastLoginAt: new Date().toISOString(),
  },
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "audit-1",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    actorId: "user-admin-1",
    actorName: "د. أمين بن علي",
    actorRole: "platform_admin",
    action: "professional_verified",
    targetId: "doc-1",
    targetName: "د. سارة بلقاسم (جراحة وأورام الثدي)",
    details: "تم اعتماد رخصة الممارسة الطبية DZ-MED-74829-ONC رسمياً.",
    status: "success",
  },
  {
    id: "audit-2",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    actorId: "user-editor-1",
    actorName: "نور الهدى قاسمي",
    actorRole: "content_editor",
    action: "article_created",
    targetId: "art-lymphedema-1",
    targetName: "دليل الوقاية من الوذمة اللمفية بعد استئصال الغدد",
    details: "تمت مراجعة المحتوى العلمي واعتماد المراجع الطبية الموثوقة.",
    status: "success",
  },
  {
    id: "audit-3",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    actorId: "user-mod-1",
    actorName: "خديجة عمراوي",
    actorRole: "community_moderator",
    action: "report_resolved",
    targetId: "rep-109",
    targetName: "بلاغ حول ادعاء علاجي غير موثق",
    details: "تمت مراجعة المنشور وتوجيه تنبيه للكاتبة لعدم نشر جرعات دوائية.",
    status: "success",
  },
];

const INITIAL_SETTINGS: PlatformSettings = {
  siteName: "PinkCare Health & Well-being",
  allowPublicRegistration: true,
  strictMedicalSafetyFilter: true,
  requireDoctorAccreditationBeforeBooking: true,
  anonymousCommunityPostingDefault: true,
  telehealthEncryptionLevel: "HIPAA_AES256",
  maxConsultationMinutes: 45,
  maintenanceMode: false,
  updatedAt: new Date().toISOString(),
  updatedBy: "د. أمين بن علي (مدير المنصة)",
};

const INITIAL_TEMPLATES: NotificationTemplate[] = [
  {
    id: "tpl-1",
    category: "hydration",
    titleAr: "💧 تذكير بشرب الماء",
    titleEn: "💧 Hydration reminder",
    bodyAr: "رشفة ماء لطيفة تحافظ على توازن جسمكِ وتدعم نشاطكِ اليوم 🌸",
    bodyEn: "A gentle sip of water keeps your balance and wellness 🌸",
    enabled: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl-2",
    category: "medication",
    titleAr: "💊 موعد الدواء الموصوف",
    titleEn: "💊 Prescribed medication reminder",
    bodyAr: "حان موعد جرعتكِ المعتمدة من طبيبكِ المعالج، مع أمنياتنا بالعافية التامة 💗",
    bodyEn: "Time for your prescribed dose as instructed by your doctor 💗",
    enabled: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl-3",
    category: "exercise",
    titleAr: "🌸 تمارين الإطالة والتأهيل",
    titleEn: "🌸 Rehab & stretching session",
    bodyAr: "بضع دقائق من تمارين الذراع والكتف اللطيفة تعيد المرونة والراحة لجسمكِ.",
    bodyEn: "A few gentle minutes of arm and shoulder movement for comfort and mobility.",
    enabled: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl-4",
    category: "mood_checkin",
    titleAr: "💗 كيف تشعرين اليوم؟",
    titleEn: "💗 Daily Mood Check-in",
    bodyAr: "خصصي دقيقة واحدة للاستماع لمشاعركِ وتسجيل حالتكِ النفسية بكل حب.",
    bodyEn: "Take one quiet minute to listen to your feelings and check in with love.",
    enabled: true,
    updatedAt: new Date().toISOString(),
  },
];

// Permission check
export function hasPermission(role: UserRole, permission: PermissionKey): boolean {
  const list = ROLE_PERMISSIONS[role] || [];
  return list.includes(permission);
}

// Get user accounts
export function getUserAccounts(): UserAccount[] {
  if (typeof window === "undefined") return INITIAL_USER_ACCOUNTS;
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USER_ACCOUNTS));
    return INITIAL_USER_ACCOUNTS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_USER_ACCOUNTS;
  }
}

export function saveUserAccounts(users: UserAccount[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new CustomEvent("pinkcare:rbac-users-updated"));
}

// Change user role (Admin only)
export function updateUserRole(
  userId: string,
  newRole: UserRole,
  actor: { id: string; name: string; role: UserRole },
): boolean {
  if (!hasPermission(actor.role, "change_user_roles")) {
    logAuditEvent({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: "security_access_denied",
      targetId: userId,
      details: `محاولة غير مصرح بها لتغيير صلاحيات المستخدم إلى ${newRole}`,
      status: "denied",
    });
    return false;
  }

  const users = getUserAccounts();
  const user = users.find((u) => u.id === userId);
  if (!user) return false;

  const oldRole = user.role;
  user.role = newRole;
  saveUserAccounts(users);

  logAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: "user_role_changed",
    targetId: userId,
    targetName: `${user.firstName} ${user.lastName}`,
    details: `تم تغيير الدور من [${oldRole}] إلى [${newRole}]`,
    status: "success",
  });

  return true;
}

// Change user status (Active / Suspended)
export function updateUserStatus(
  userId: string,
  newStatus: "active" | "suspended",
  actor: { id: string; name: string; role: UserRole },
): boolean {
  if (!hasPermission(actor.role, "manage_users")) {
    logAuditEvent({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: "security_access_denied",
      targetId: userId,
      details: "محاولة غير مصرح بها لتغيير حالة حساب مستخدم",
      status: "denied",
    });
    return false;
  }

  const users = getUserAccounts();
  const user = users.find((u) => u.id === userId);
  if (!user) return false;

  user.status = newStatus;
  saveUserAccounts(users);

  logAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: "user_account_status_changed",
    targetId: userId,
    targetName: `${user.firstName} ${user.lastName}`,
    details: `تم تحديث حالة الحساب إلى [${newStatus}]`,
    status: "success",
  });

  return true;
}

// Audit Logs
export function getAuditLogs(): AuditLogEntry[] {
  if (typeof window === "undefined") return INITIAL_AUDIT_LOGS;
  const raw = localStorage.getItem(AUDIT_KEY);
  if (!raw) {
    localStorage.setItem(AUDIT_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
    return INITIAL_AUDIT_LOGS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function logAuditEvent(entry: Omit<AuditLogEntry, "id" | "timestamp">): AuditLogEntry {
  const logs = getAuditLogs();
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
  };

  const next = [newEntry, ...logs];
  if (typeof window !== "undefined") {
    localStorage.setItem(AUDIT_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("pinkcare:rbac-audit-updated"));
  }
  return newEntry;
}

// Platform Settings
export function getPlatformSettings(): PlatformSettings {
  if (typeof window === "undefined") return INITIAL_SETTINGS;
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
    return INITIAL_SETTINGS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_SETTINGS;
  }
}

export function savePlatformSettings(
  settings: PlatformSettings,
  actor: { id: string; name: string; role: UserRole },
): boolean {
  if (!hasPermission(actor.role, "manage_platform_settings")) {
    logAuditEvent({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: "security_access_denied",
      details: "محاولة غير مصرح بها لتعديل إعدادات المنصة العامة",
      status: "denied",
    });
    return false;
  }

  const updated: PlatformSettings = {
    ...settings,
    updatedAt: new Date().toISOString(),
    updatedBy: actor.name,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("pinkcare:rbac-settings-updated"));
  }

  logAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: "platform_settings_updated",
    details: "تم تحديث معايير الخصوصية والتشفير وتكوين المنصة",
    status: "success",
  });

  return true;
}

// Notification Templates
export function getNotificationTemplates(): NotificationTemplate[] {
  if (typeof window === "undefined") return INITIAL_TEMPLATES;
  const raw = localStorage.getItem(TEMPLATES_KEY);
  if (!raw) {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(INITIAL_TEMPLATES));
    return INITIAL_TEMPLATES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_TEMPLATES;
  }
}

export function saveNotificationTemplate(
  template: NotificationTemplate,
  actor: { id: string; name: string; role: UserRole },
): boolean {
  if (!hasPermission(actor.role, "manage_notification_templates")) {
    logAuditEvent({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: "security_access_denied",
      details: "محاولة غير مصرح بها لتعديل قوالب الإشعارات",
      status: "denied",
    });
    return false;
  }

  const list = getNotificationTemplates();
  const idx = list.findIndex((t) => t.id === template.id);
  const updated = { ...template, updatedAt: new Date().toISOString() };

  if (idx >= 0) {
    list[idx] = updated;
  } else {
    list.push(updated);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("pinkcare:rbac-templates-updated"));
  }

  logAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: "notification_template_updated",
    targetId: template.id,
    targetName: template.titleAr,
    details: `تم تحديث قالب الإشعار التذكيري لتصنيف [${template.category}]`,
    status: "success",
  });

  return true;
}

// Active Persona / Role Switcher for Independent Testing (Requirement 8)
export function getActiveUserRole(): UserRole {
  if (typeof window === "undefined") return "patient";
  const override = localStorage.getItem(CURRENT_ROLE_OVERRIDE_KEY);
  if (
    override &&
    ["patient", "professional", "content_editor", "community_moderator", "platform_admin"].includes(
      override,
    )
  ) {
    return override as UserRole;
  }
  return "patient";
}

export function setActiveUserRole(role: UserRole): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_ROLE_OVERRIDE_KEY, role);
  window.dispatchEvent(new CustomEvent("pinkcare:rbac-role-switched", { detail: role }));
}

export function getCurrentUser(): UserAccount {
  const role = getActiveUserRole();
  const users = getUserAccounts();
  const user = users.find((u) => u.role === role);
  return (
    user || {
      id: `user-${role}-active`,
      email: `${role}@pinkcare.app`,
      firstName: role === "patient" ? "سارة" : "مستخدم",
      lastName: "المنصوري",
      role,
      status: "active",
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    }
  );
}

// Real Database Analytics (Requirement 5: Real records only, no fabricated numbers)
export function getRealPlatformAnalytics() {
  const users = getUserAccounts();
  const doctors = getDoctors();
  const bookings = getBookings();
  const posts = getCommunityPosts();
  const reports = getCommunityReports();
  const templates = getNotificationTemplates();

  const totalRegisteredUsers = users.length;
  // Count active in last 7 days based on real timestamps
  const sevenDaysAgo = Date.now() - 7 * 86400000;
  const activeUsersLast7Days = users.filter((u) => {
    const t = new Date(u.lastLoginAt).getTime();
    return !isNaN(t) && t >= sevenDaysAgo;
  }).length;

  const verifiedDoctorsCount = doctors.filter((d) => d.verificationStatus === "verified").length;
  const pendingDoctorsCount = doctors.filter((d) => d.verificationStatus === "pending").length;

  const totalConsultations = bookings.length;
  const confirmedConsultations = bookings.filter((b) => b.status === "confirmed").length;
  const completedConsultations = bookings.filter((b) => b.status === "completed").length;
  const cancelledConsultations = bookings.filter((b) => b.status === "cancelled").length;

  const totalCommunityPosts = posts.length;
  const activeCommunityPosts = posts.filter((p) => p.status === "active").length;
  const removedCommunityPosts = posts.filter((p) => p.status === "removed").length;

  const totalReportsCount = reports.length;
  const pendingReportsCount = reports.filter((r) => r.status === "pending").length;
  const resolvedReportsCount = reports.filter((r) => r.status === "resolved").length;

  const activeNotificationTemplates = templates.filter((t) => t.enabled).length;

  return {
    users: {
      total: totalRegisteredUsers,
      activeLast7Days: activeUsersLast7Days,
      byRole: {
        patients: users.filter((u) => u.role === "patient").length,
        professionals: users.filter((u) => u.role === "professional").length,
        editors: users.filter((u) => u.role === "content_editor").length,
        moderators: users.filter((u) => u.role === "community_moderator").length,
        admins: users.filter((u) => u.role === "platform_admin").length,
      },
    },
    professionals: {
      total: doctors.length,
      verified: verifiedDoctorsCount,
      pending: pendingDoctorsCount,
    },
    consultations: {
      total: totalConsultations,
      confirmed: confirmedConsultations,
      completed: completedConsultations,
      cancelled: cancelledConsultations,
    },
    contentAndCommunity: {
      totalPosts: totalCommunityPosts,
      activePosts: activeCommunityPosts,
      removedPosts: removedCommunityPosts,
      totalReports: totalReportsCount,
      pendingReports: pendingReportsCount,
      resolvedReports: resolvedReportsCount,
    },
    notifications: {
      templatesCount: templates.length,
      activeTemplatesCount: activeNotificationTemplates,
    },
  };
}
