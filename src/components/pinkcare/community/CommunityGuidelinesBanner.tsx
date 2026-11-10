import { Shield, Info } from "lucide-react";

export function CommunityGuidelinesBanner({ lang = "ar" }: { lang?: "ar" | "en" }) {
  return (
    <div className="glass rounded-2xl p-4 border border-primary/20 space-y-2 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent">
      <div className="flex items-center gap-2 text-primary font-bold text-xs">
        <Shield className="w-4 h-4 text-primary shrink-0" />
        <span>
          {lang === "ar"
            ? "ميثاق مجتمع PinkCare الآمن والدعم المتبادل"
            : "PinkCare Safe Peer Community Charter"}
        </span>
      </div>
      <p className="text-[11px] text-foreground/80 leading-relaxed">
        {lang === "ar"
          ? "هذه المساحة مخصصة حصرياً لتبادل المشاعر الصادقة، التشجيع، والقصص الإنسانية بين المتعافيات والمحاربات. يُمنع منعاً باتاً تقديم نصائح دوائية أو توجيهات علاجية؛ فريقكِ الطبي هو المرجع الوحيد لقراراتكِ الصحية."
          : "This community is exclusively for empathetic peer support, encouragement, and sharing personal journeys. Giving medical or prescription advice is strictly forbidden; always consult your medical team for clinical decisions."}
      </p>
      <div className="flex items-center gap-1.5 text-[10px] text-primary/90 font-medium">
        <Info className="w-3.5 h-3.5" />
        <span>
          {lang === "ar"
            ? "يمكنكِ دائماً النشر باسم مستعار لحماية خصوصيتكِ الكاملة"
            : "You can post anonymously using a nickname for total privacy"}
        </span>
      </div>
    </div>
  );
}
