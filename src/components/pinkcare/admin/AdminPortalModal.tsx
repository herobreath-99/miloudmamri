import { useState, useEffect } from "react";
import {
  ShieldAlert,
  BadgeCheck,
  Check,
  X,
  AlertTriangle,
  FileCheck2,
  Users,
  Building2,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import type { CommunityReport } from "@/types/community";
import type { DoctorProfile } from "@/types/teleconsult";
import {
  getCommunityReports,
  resolveReport,
  removePostDirectly,
  restorePostDirectly,
  getCommunityPosts,
} from "@/lib/communityStorage";
import {
  getDoctors,
  approveDoctorVerification,
  rejectDoctorVerification,
} from "@/lib/teleconsultStorage";

type AdminPortalModalProps = {
  onClose: () => void;
  lang?: "ar" | "en";
};

export function AdminPortalModal({ onClose, lang = "ar" }: AdminPortalModalProps) {
  const [activeTab, setActiveTab] = useState<"doctors" | "reports">("doctors");
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);

  const loadData = () => {
    setReports(getCommunityReports());
    setDoctors(getDoctors());
  };

  useEffect(() => {
    loadData();
    const handleUpd = () => loadData();
    window.addEventListener("pinkcare:reports-updated", handleUpd);
    window.addEventListener("pinkcare:doctors-updated", handleUpd);
    window.addEventListener("pinkcare:community-updated", handleUpd);
    return () => {
      window.removeEventListener("pinkcare:reports-updated", handleUpd);
      window.removeEventListener("pinkcare:doctors-updated", handleUpd);
      window.removeEventListener("pinkcare:community-updated", handleUpd);
    };
  }, []);

  // Doctor Verification Actions
  const handleApproveDoctor = (doctorId: string, doctorName: string) => {
    approveDoctorVerification(doctorId, "الإدارة الطبية - PinkCare");
    toast.success(
      lang === "ar"
        ? `تم اعتماد ترخيص ${doctorName} وتفعيل الحجوزات والشارة الرسمية ✓`
        : `Approved ${doctorName}'s license and enabled bookings ✓`,
    );
    loadData();
  };

  const handleRejectDoctor = (doctorId: string, doctorName: string) => {
    const reason = prompt(
      lang === "ar" ? "أدخلي سبب رفض الاعتماد:" : "Enter reason for rejection:",
    );
    rejectDoctorVerification(doctorId, reason || "عدم تطابق وثائق الترخيص الطبي");
    toast.error(
      lang === "ar" ? `تم رفض طلب اعتماد ${doctorName}` : `Rejected ${doctorName}'s request`,
    );
    loadData();
  };

  // Report Actions
  const handleResolveReport = (reportId: string, action: "dismiss" | "remove_post" | "warn") => {
    resolveReport(reportId, action);
    toast.success(
      lang === "ar"
        ? action === "remove_post"
          ? "تم حذف المنشور المخالف وحل البلاغ ✓"
          : "تمت معالجة البلاغ بنجاح ✓"
        : "Report handled successfully ✓",
    );
    loadData();
  };

  const pendingDoctors = doctors.filter((d) => d.verificationStatus === "pending");
  const pendingReports = reports.filter((r) => r.status === "pending");

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border rounded-3xl p-5 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl my-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">
                {lang === "ar"
                  ? "بوابة الإشراف الإداري والاعتماد الطبي"
                  : "Administrative & Verification Portal"}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                {lang === "ar"
                  ? "مراجعة تراخيص الأطباء وفحص بلاغات المجتمع والمحتوى الطبي غير الموثق"
                  : "Review doctor medical licenses & community moderation reports"}
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

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 shrink-0">
          <div className="bg-muted/40 p-2.5 rounded-2xl border border-border/40 text-center">
            <span className="text-[10px] text-muted-foreground block">
              {lang === "ar" ? "طلبات أطباء معلقة" : "Pending Doctors"}
            </span>
            <span className="text-base font-bold text-amber-600 font-mono">
              {pendingDoctors.length}
            </span>
          </div>

          <div className="bg-muted/40 p-2.5 rounded-2xl border border-border/40 text-center">
            <span className="text-[10px] text-muted-foreground block">
              {lang === "ar" ? "بلاغات مجتمع معلقة" : "Pending Reports"}
            </span>
            <span className="text-base font-bold text-destructive font-mono">
              {pendingReports.length}
            </span>
          </div>

          <div className="bg-muted/40 p-2.5 rounded-2xl border border-border/40 text-center">
            <span className="text-[10px] text-muted-foreground block">
              {lang === "ar" ? "أطباء معتمدون" : "Verified Doctors"}
            </span>
            <span className="text-base font-bold text-emerald-600 font-mono">
              {doctors.filter((d) => d.verificationStatus === "verified").length}
            </span>
          </div>

          <div className="bg-muted/40 p-2.5 rounded-2xl border border-border/40 text-center">
            <span className="text-[10px] text-muted-foreground block">
              {lang === "ar" ? "منشورات نشطة" : "Active Posts"}
            </span>
            <span className="text-base font-bold text-primary font-mono">
              {getCommunityPosts().filter((p) => p.status === "active").length}
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-muted/50 p-1 border border-border/50 shrink-0 mb-2">
          <button
            onClick={() => setActiveTab("doctors")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === "doctors"
                ? "bg-card text-primary shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>
              {lang === "ar" ? "اعتماد تراخيص الأطباء" : "Doctor Verification"} (
              {pendingDoctors.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === "reports"
                ? "bg-card text-primary shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>
              {lang === "ar" ? "بلاغات المجتمع والإشراف" : "Community Reports"} (
              {pendingReports.length})
            </span>
          </button>
        </div>

        {/* Tab 1: Doctor Verification Queue */}
        {activeTab === "doctors" && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {doctors.map((doc) => {
              const isPending = doc.verificationStatus === "pending";
              const isVerified = doc.verificationStatus === "verified";
              return (
                <div
                  key={doc.id}
                  className={`p-4 rounded-3xl border text-xs space-y-2.5 transition ${
                    isPending
                      ? "bg-amber-500/5 border-amber-500/30"
                      : isVerified
                        ? "bg-muted/20 border-border/50"
                        : "bg-destructive/5 border-destructive/20 opacity-70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-border shrink-0">
                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          className="w-full h-full object-cover"
                        />
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
                            {isVerified
                              ? lang === "ar"
                                ? "معتمد رسمياً"
                                : "Verified"
                              : isPending
                                ? lang === "ar"
                                  ? "بانتظار التحقق"
                                  : "Pending Review"
                                : lang === "ar"
                                  ? "مرفوض"
                                  : "Rejected"}
                          </span>
                        </div>
                        <p className="text-primary font-medium text-[11px]">{doc.title}</p>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          <span>{doc.hospital}</span>
                        </p>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleRejectDoctor(doc.id, doc.name)}
                            className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 font-bold flex items-center gap-1"
                            title="رفض الاعتماد"
                          >
                            <X className="w-4 h-4" />
                            <span className="hidden sm:inline">رفض</span>
                          </button>
                          <button
                            onClick={() => handleApproveDoctor(doc.id, doc.name)}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm"
                          >
                            <Check className="w-4 h-4" />
                            <span>{lang === "ar" ? "اعتماد الرخصة ✓" : "Approve License"}</span>
                          </button>
                        </>
                      ) : isVerified ? (
                        <button
                          onClick={() => handleRejectDoctor(doc.id, doc.name)}
                          className="px-2.5 py-1.5 rounded-xl border border-destructive/30 text-destructive text-[11px] hover:bg-destructive/10"
                        >
                          {lang === "ar" ? "سحب الاعتماد" : "Revoke"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApproveDoctor(doc.id, doc.name)}
                          className="px-2.5 py-1.5 rounded-xl border border-emerald-500/30 text-emerald-600 text-[11px] hover:bg-emerald-500/10"
                        >
                          {lang === "ar" ? "إعادة الاعتماد" : "Re-approve"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* License Info Box */}
                  <div className="bg-muted/40 p-2.5 rounded-2xl border border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-muted-foreground block">رقم رخصة الممارسة:</span>
                      <span className="font-mono font-bold text-foreground">
                        {doc.licenseNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">الهيئة أو العمادة:</span>
                      <span className="font-medium text-foreground">
                        {doc.medicalCouncil || "غير محدد"}
                      </span>
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-1 text-muted-foreground">
                      <FileCheck2 className="w-3.5 h-3.5 text-primary" />
                      <span>الوثيقة المرفقة:</span>
                      <span className="font-mono text-foreground">
                        {doc.licenseDocumentName || "license.pdf"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Community Moderation Reports */}
        {activeTab === "reports" && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {reports.length > 0 ? (
              reports.map((rep) => {
                const isPending = rep.status === "pending";
                return (
                  <div
                    key={rep.id}
                    className={`p-4 rounded-3xl border text-xs space-y-2.5 ${
                      isPending
                        ? "bg-destructive/5 border-destructive/20"
                        : "bg-muted/30 border-border/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-destructive flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>سبب البلاغ: {rep.reason}</span>
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
                        <span className="font-bold">ملاحظات المُبلّغة: </span>
                        {rep.details}
                      </p>
                    )}

                    {isPending ? (
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/30">
                        <button
                          onClick={() => handleResolveReport(rep.id, "dismiss")}
                          className="px-3 py-1.5 rounded-xl text-muted-foreground hover:bg-muted text-[11px]"
                        >
                          تجاهل وحفظ البلاغ
                        </button>
                        <button
                          onClick={() => handleResolveReport(rep.id, "remove_post")}
                          className="px-3.5 py-1.5 rounded-xl bg-destructive text-destructive-foreground font-bold text-[11px] flex items-center gap-1 shadow-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف المنشور فوراً</span>
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
              <div className="text-center py-8 text-xs text-muted-foreground">
                لا توجد بلاغات معلقة حالياً في المجتمع 🌸
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between shrink-0">
          <button
            onClick={loadData}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تحديث السجلات</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
          >
            {lang === "ar" ? "إغلاق البوابة" : "Close Portal"}
          </button>
        </div>
      </div>
    </div>
  );
}
