import { useState } from "react";
import {
  X,
  FlaskConical,
  ShieldCheck,
  ShieldAlert,
  Play,
  CheckCircle2,
  XCircle,
  Lock,
  ArrowRight,
} from "lucide-react";
import type { UserRole, PermissionKey } from "@/types/roles";
import type { Lang } from "@/lib/i18n";

type TestResult = {
  endpoint: string;
  roleTested: UserRole;
  attemptedAction: string;
  expectedStatus: 200 | 403;
  actualStatus?: number;
  responseMessage?: string;
  passed?: boolean;
};

type RoleSecurityTesterModalProps = {
  currentRole: UserRole;
  onClose: () => void;
  lang?: Lang;
};

export function RoleSecurityTesterModal({
  currentRole,
  onClose,
  lang = "ar",
}: RoleSecurityTesterModalProps) {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const runRoleSecurityAudit = async () => {
    setRunning(true);
    const testCases: Omit<TestResult, "actualStatus" | "responseMessage" | "passed">[] = [
      {
        endpoint: "/api/rbac/verify-access",
        roleTested: "patient",
        attemptedAction: "Patient attempting to invoke [manage_users]",
        expectedStatus: 403,
      },
      {
        endpoint: "/api/rbac/verify-access",
        roleTested: "patient",
        attemptedAction: "Patient attempting to invoke [verify_professionals]",
        expectedStatus: 403,
      },
      {
        endpoint: "/api/admin/users",
        roleTested: "patient",
        attemptedAction: "Patient directly calling Backend Admin Users API",
        expectedStatus: 403,
      },
      {
        endpoint: "/api/professional/consultations",
        roleTested: "patient",
        attemptedAction: "Patient requesting clinical doctor records directly",
        expectedStatus: 403,
      },
      {
        endpoint: "/api/professional/consultations",
        roleTested: "professional",
        attemptedAction: "Doctor A attempting to query Doctor B's patient records (Isolation)",
        expectedStatus: 403,
      },
      {
        endpoint: "/api/rbac/verify-access",
        roleTested: "community_moderator",
        attemptedAction: "Moderator calling [verify_professionals]",
        expectedStatus: 403,
      },
      {
        endpoint: "/api/rbac/verify-access",
        roleTested: "content_editor",
        attemptedAction: "Content Editor calling [manage_articles]",
        expectedStatus: 200,
      },
      {
        endpoint: "/api/rbac/verify-access",
        roleTested: "platform_admin",
        attemptedAction: "Platform Administrator invoking [manage_users]",
        expectedStatus: 200,
      },
      {
        endpoint: "/api/admin/users",
        roleTested: "platform_admin",
        attemptedAction: "Platform Administrator calling Admin Users Backend API",
        expectedStatus: 200,
      },
    ];

    const executedResults: TestResult[] = [];

    for (const test of testCases) {
      try {
        let res: Response;

        if (test.endpoint === "/api/rbac/verify-access") {
          const perm = test.attemptedAction.includes("manage_users")
            ? "manage_users"
            : test.attemptedAction.includes("verify_professionals")
              ? "verify_professionals"
              : "manage_articles";

          res = await fetch("/api/rbac/verify-access", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: test.roleTested, permission: perm }),
          });
        } else if (test.endpoint === "/api/admin/users") {
          res = await fetch("/api/admin/users", {
            method: "GET",
            headers: { "x-user-role": test.roleTested },
          });
        } else {
          // /api/professional/consultations
          const isCrossTest = test.attemptedAction.includes("Doctor B");
          res = await fetch(
            `/api/professional/consultations?doctorId=doc-2&authDoctorId=${
              isCrossTest ? "doc-1" : "doc-2"
            }`,
            {
              method: "GET",
              headers: {
                "x-user-role": test.roleTested,
                "x-doctor-id": isCrossTest ? "doc-1" : "doc-2",
              },
            },
          );
        }

        const data = (await res.json()) as { message?: string; error?: string };
        const passed = res.status === test.expectedStatus;

        executedResults.push({
          ...test,
          actualStatus: res.status as 200 | 403,
          responseMessage: data.message || data.error || (res.ok ? "OK" : "Forbidden"),
          passed,
        });
      } catch (err) {
        executedResults.push({
          ...test,
          actualStatus: 500,
          responseMessage: (err as Error).message,
          passed: false,
        });
      }
    }

    setResults(executedResults);
    setRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border rounded-3xl p-5 max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-foreground">
                {lang === "ar" || lang === "dz"
                  ? "وحدة اختبار أمان الصلاحيات (Security & RBAC Tester)"
                  : lang === "fr"
                    ? "Audit de sécurité & contrôle d'accès RBAC"
                    : "Role Security & Backend Enforcement Tester"}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                {lang === "ar" || lang === "dz"
                  ? "فحص منع الوصول غير المصرح به على مستوى الخادم (Backend 403 Enforcement)"
                  : lang === "fr"
                    ? "Vérifie le blocage HTTP 403 des requêtes non autorisées"
                    : "Verifies HTTP 403 rejection of unauthorized endpoints per role"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Box */}
        <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 text-xs space-y-1.5 my-3 shrink-0">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span>
              {lang === "ar" || lang === "dz"
                ? `دورك الحالي قيد الاختبار: [${currentRole}]`
                : lang === "fr"
                  ? `Rôle actuellement actif testé : [${currentRole}]`
                  : `Currently active role: [${currentRole}]`}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {lang === "ar" || lang === "dz"
              ? "يقوم هذا الفحص بإرسال طلبات حقيقية لنقاط النهاية في الخادم للتحقق من أن الأدوار غير المصرح بها تُحجب فوراً برمز 403 Forbidden ولا يمكنها الوصول لسجلات المرضى أو إعدادات الإدارة."
              : lang === "fr"
                ? "Envoie de vraies requêtes HTTP pour vérifier que les rôles non autorisés reçoivent un code HTTP 403 Forbidden et ne peuvent accéder aux dossiers patients ni à l'administration."
                : "Sends live HTTP requests to verify that unauthorized roles are blocked with HTTP 403 Forbidden."}
          </p>
        </div>

        {/* Trigger Button */}
        <div className="flex items-center justify-between pb-2 shrink-0">
          <span className="text-xs font-bold text-foreground">
            {lang === "ar" || lang === "dz"
              ? "قائمة سيناريوهات الفحص الأمني:"
              : lang === "fr"
                ? "Scénarios de test de sécurité :"
                : "Security Test Cases:"}
          </span>
          <button
            onClick={runRoleSecurityAudit}
            disabled={running}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center gap-1.5 shadow-sm disabled:opacity-50 transition active:scale-95"
          >
            <Play className="w-3.5 h-3.5" />
            <span>
              {running
                ? lang === "ar" || lang === "dz"
                  ? "جارِ الفحص..."
                  : lang === "fr"
                    ? "Audit en cours..."
                    : "Running..."
                : lang === "ar" || lang === "dz"
                  ? "بدء فحص الأمان الشامل"
                  : lang === "fr"
                    ? "Lancer l'audit de sécurité"
                    : "Run Security Audit"}
            </span>
          </button>
        </div>

        {/* Results Stream */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {results.length > 0 ? (
            results.map((r, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl border text-xs space-y-1 transition ${
                  r.passed
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-destructive/5 border-destructive/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {r.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive shrink-0" />
                    )}
                    <span className="font-bold text-foreground">{r.attemptedAction}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                      r.actualStatus === 200
                        ? "bg-emerald-500/10 text-emerald-600"
                        : r.actualStatus === 403
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    HTTP {r.actualStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                  <span className="font-mono text-[10px]">{r.endpoint}</span>
                  <span className="font-semibold text-foreground/80">
                    {r.passed
                      ? lang === "ar" || lang === "dz"
                        ? "تم التحقق بنجاح ✓"
                        : lang === "fr"
                          ? "Test réussi ✓"
                          : "Passed ✓"
                      : lang === "ar" || lang === "dz"
                        ? "فشل الاختبار ✗"
                        : lang === "fr"
                          ? "Échec du test ✗"
                          : "Failed ✗"}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground italic truncate">
                  {lang === "ar" || lang === "dz"
                    ? `رد الخادم: ${r.responseMessage}`
                    : lang === "fr"
                      ? `Réponse serveur : ${r.responseMessage}`
                      : `Server response: ${r.responseMessage}`}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-10 border border-dashed border-border rounded-2xl text-xs text-muted-foreground space-y-2">
              <ShieldCheck className="w-8 h-8 mx-auto text-primary/50" />
              <p>
                {lang === "ar" || lang === "dz"
                  ? 'اضغطي على "بدء فحص الأمان الشامل" لتشغيل الاختبارات المستقلة لكل دور'
                  : lang === "fr"
                    ? "Cliquez sur \"Lancer l'audit de sécurité\" pour exécuter les tests d'autorisation."
                    : 'Click "Run Security Audit" to execute role enforcement checks.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-emerald-600 font-medium">
            {results.length > 0 && results.every((r) => r.passed)
              ? lang === "ar" || lang === "dz"
                ? "✓ جميع فحوصات الأمان والحظر الخلفي اجتازت الاختبار 100%"
                : lang === "fr"
                  ? "✓ 100% des tests de sécurité et restrictions backend validés"
                  : "✓ 100% of security checks and backend isolation tests passed"
              : ""}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-bold"
          >
            {lang === "ar" || lang === "dz" ? "إغلاق" : lang === "fr" ? "Fermer" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
