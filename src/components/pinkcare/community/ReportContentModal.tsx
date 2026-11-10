import { useState } from "react";
import { AlertTriangle, ShieldAlert, X } from "lucide-react";
import { toast } from "sonner";
import type { ReportReason } from "@/types/community";
import { submitCommunityReport } from "@/lib/communityStorage";

type ReportContentModalProps = {
  targetType: "post" | "comment" | "chat_message" | "direct_message";
  targetId: string;
  targetPreview: string;
  authorId: string;
  reporterId: string;
  reporterName: string;
  onClose: () => void;
  lang?: "ar" | "en";
};

export function ReportContentModal({
  targetType,
  targetId,
  targetPreview,
  authorId,
  reporterId,
  reporterName,
  onClose,
  lang = "ar",
}: ReportContentModalProps) {
  const [reason, setReason] = useState<ReportReason>("unverified_medical_advice");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reasonsList: { value: ReportReason; labelAr: string; labelEn: string; descAr: string }[] = [
    {
      value: "unverified_medical_advice",
      labelAr: "تقديم نصائح أو ادعاءات علاجية غير مصرح بها",
      labelEn: "Unverified medical claims or advice",
      descAr: "وصف جرعات، الترويج لبدائل عن الكيماوي، أو التشجيع على وقف العلاج",
    },
    {
      value: "privacy_exposure",
      labelAr: "انتهاك الخصوصية أو نشر بيانات شخصية حساسة",
      labelEn: "Privacy breach / sensitive medical disclosure",
      descAr: "نشر هويات أو أرقام هواتف أو تقارير خاصة دون موافقة",
    },
    {
      value: "inappropriate_content",
      labelAr: "محتوى غير لائق أو جارح للمشاعر",
      labelEn: "Inappropriate or insensitive content",
      descAr: "كلمات مسيئة أو غير ملائمة لطبيعة المجتمع الداعم",
    },
    {
      value: "harassment",
      labelAr: "تنمر أو مضايقة موجهة لعضوة أخرى",
      labelEn: "Harassment or bullying",
      descAr: "سلوك عدائي أو استهداف متكرر",
    },
    {
      value: "spam",
      labelAr: "إعلانات تجارية أو روابط مجهولة",
      labelEn: "Commercial spam or external links",
      descAr: "تسويق منتجات تجارية أو نشر روابط خارجية مريبة",
    },
    {
      value: "other",
      labelAr: "سبب آخر",
      labelEn: "Other issue",
      descAr: "ملاحظة أخرى تتطلب تدخلاً إشرافياً",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    submitCommunityReport({
      targetType,
      targetId,
      targetPreview: targetPreview.slice(0, 140),
      authorId,
      reporterId,
      reporterName,
      reason,
      details,
    });

    toast.success(
      lang === "ar"
        ? "شكراً لحرصكِ. تم رفع البلاغ لفريق الإشراف الطبي للمراجعة الفورية."
        : "Thank you. Your report has been submitted to medical moderation.",
    );
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center gap-2 text-destructive font-bold text-base">
            <ShieldAlert className="w-5 h-5" />
            <span>{lang === "ar" ? "الإبلاغ عن مخالفة في المجتمع" : "Report Content"}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target preview */}
        <div className="bg-muted/40 rounded-2xl p-3 text-xs border border-border/40">
          <p className="text-[10px] text-muted-foreground font-semibold mb-1">
            {lang === "ar" ? "معاينة المحتوى المُبلغ عنه:" : "Reported preview:"}
          </p>
          <p className="text-foreground/80 line-clamp-2 italic font-mono text-[11px]">
            "{targetPreview}"
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">
              {lang === "ar" ? "حددي نوع المخالفة:" : "Select Violation Type:"}
            </label>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {reasonsList.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition text-xs ${
                    reason === r.value
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border/60 hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    name="report_reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={() => setReason(r.value)}
                    className="mt-0.5 accent-primary"
                  />
                  <div>
                    <p className="font-semibold">{lang === "ar" ? r.labelAr : r.labelEn}</p>
                    <p className="text-[10px] text-muted-foreground">{r.descAr}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              {lang === "ar" ? "تفاصيل إضافية لمساعدة المشرفين:" : "Additional details (optional):"}
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={2}
              placeholder={
                lang === "ar"
                  ? "مثال: هذا المنشور يطلب تجربة دواء بدون استشارة الطبيب..."
                  : "Explain why this violates community safety..."
              }
              className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-foreground focus:outline-hidden focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 pt-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:bg-muted"
            >
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-destructive text-destructive-foreground font-bold text-xs flex items-center gap-1.5 shadow-md hover:opacity-90"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{lang === "ar" ? "تأكيد وإرسال البلاغ" : "Submit Report"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
