export type UserRole =
  "patient" | "professional" | "content_editor" | "community_moderator" | "platform_admin";

export type PermissionKey =
  | "manage_own_profile"
  | "access_own_health_records"
  | "manage_own_plans"
  | "manage_own_appointments"
  | "control_own_privacy"
  | "manage_professional_profile"
  | "view_authorized_patient_consultations"
  | "record_consultation_notes"
  | "recommend_educational_content"
  | "manage_articles"
  | "manage_videos"
  | "moderate_community"
  | "resolve_reports"
  | "manage_users"
  | "change_user_roles"
  | "verify_professionals"
  | "view_audit_logs"
  | "view_platform_analytics"
  | "manage_platform_settings"
  | "manage_notification_templates";

export const ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  patient: [
    "manage_own_profile",
    "access_own_health_records",
    "manage_own_plans",
    "manage_own_appointments",
    "control_own_privacy",
  ],
  professional: [
    "manage_own_profile",
    "manage_professional_profile",
    "view_authorized_patient_consultations",
    "record_consultation_notes",
    "recommend_educational_content",
  ],
  content_editor: [
    "manage_own_profile",
    "manage_articles",
    "manage_videos",
    "recommend_educational_content",
  ],
  community_moderator: ["manage_own_profile", "moderate_community", "resolve_reports"],
  platform_admin: [
    "manage_own_profile",
    "manage_professional_profile",
    "manage_articles",
    "manage_videos",
    "moderate_community",
    "resolve_reports",
    "manage_users",
    "change_user_roles",
    "verify_professionals",
    "view_audit_logs",
    "view_platform_analytics",
    "manage_platform_settings",
    "manage_notification_templates",
  ],
};

export type AuditActionType =
  | "user_role_changed"
  | "user_account_status_changed"
  | "professional_verified"
  | "professional_rejected"
  | "professional_revoked"
  | "article_created"
  | "article_updated"
  | "article_deleted"
  | "video_created"
  | "video_deleted"
  | "community_post_removed"
  | "community_post_restored"
  | "report_resolved"
  | "report_dismissed"
  | "platform_settings_updated"
  | "notification_template_updated"
  | "security_access_denied";

export type AuditLogEntry = {
  id: string;
  timestamp: string; // ISO
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: AuditActionType;
  targetId?: string;
  targetName?: string;
  details: string;
  status: "success" | "warning" | "denied";
};

export type UserAccount = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: "active" | "suspended" | "pending";
  assignedProfessionalId?: string; // links to doctor profile if professional
  createdAt: string;
  lastLoginAt: string;
};

export type NotificationTemplate = {
  id: string;
  category: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  enabled: boolean;
  updatedAt: string;
};

export type PlatformSettings = {
  siteName: string;
  allowPublicRegistration: boolean;
  strictMedicalSafetyFilter: boolean;
  requireDoctorAccreditationBeforeBooking: boolean;
  anonymousCommunityPostingDefault: boolean;
  telehealthEncryptionLevel: "HIPAA_AES256" | "STANDARD_TLS";
  maxConsultationMinutes: number;
  maintenanceMode: boolean;
  updatedAt: string;
  updatedBy: string;
};
