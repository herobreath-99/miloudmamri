import { useState } from "react";
import {
  ShieldAlert,
  PhoneCall,
  HeartHandshake,
  AlertTriangle,
  X,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle,
  HelpCircle,
  Stethoscope,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Props {
  open: boolean;
  onClose: () => void;
  isUrgent?: boolean;
}

export function ProfessionalSupportModal({ open, onClose, isUrgent = false }: Props) {
  const { lang } = useI18n();
  const [activeTab, setActiveTab] = useState<"urgent" | "specialist" | "grounding">(
    isUrgent ? "urgent" : "specialist",
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-card text-card-foreground rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-primary/20 animate-slide-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border/50 flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isUrgent ? "bg-rose-500/20 text-rose-600 animate-pulse" : "bg-primary/20 text-primary"}`}
            >
              {isUrgent ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <HeartHandshake className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {lang === "ar" ? "الدعم النفسي وخطوط المساعدة" : "Mental Health & Crisis Support"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {lang === "ar"
                  ? "أنتِ لستِ وحدكِ؛ المساعدة المتخصصة متاحة دائماً"
                  : "You are not alone; professional care is always available"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition text-muted-foreground"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-border/50 bg-muted/30 px-3 pt-2 gap-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab("urgent")}
            className={`flex-1 py-2 px-2 border-b-2 font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === "urgent"
                ? "border-rose-500 text-rose-600 bg-rose-500/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "أرقام الطوارئ والمساعدة" : "Emergency Helplines"}</span>
          </button>
          <button
            onClick={() => setActiveTab("specialist")}
            className={`flex-1 py-2 px-2 border-b-2 font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === "specialist"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "أخصائي علم النفس الأورامي" : "Psycho-Oncology"}</span>
          </button>
          <button
            onClick={() => setActiveTab("grounding")}
            className={`flex-1 py-2 px-2 border-b-2 font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === "grounding"
                ? "border-emerald-500 text-emerald-600 bg-emerald-500/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "تهدئة الأزمة الآن" : "Crisis Grounding"}</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-sm leading-relaxed flex-1">
          {/* TAB 1: EMERGENCY HELPLINES */}
          {activeTab === "urgent" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-950 dark:text-rose-200 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    {lang === "ar"
                      ? "إذا كنتِ في ضيق نفسي شديد أو تشعرين بخطر داهم:"
                      : "If you are experiencing severe distress or immediate crisis:"}
                  </span>
                </p>
                <p className="text-xs">
                  {lang === "ar"
                    ? "أنتِ شخص غالٍ وحياتكِ ثمينة جداً. لا تترددي في الاتصال بأحد الأرقام المجانية الفورية أدناه أو التوجه لأقرب مصلحة استعجالات طبية."
                    : "You matter deeply. Please reach out to one of the free confidential helplines below or visit the nearest emergency room."}
                </p>
              </div>

              {/* Algeria Helplines */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🇩🇿</span>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    {lang === "ar"
                      ? "الجزائر (أرقام مجانية 24/7)"
                      : "Algeria (24/7 Free Helplines)"}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href="tel:14"
                    className="flex items-center justify-between p-3 rounded-2xl bg-secondary/60 hover:bg-rose-50 hover:border-rose-300 border border-transparent transition"
                  >
                    <div>
                      <p className="font-bold text-rose-600 text-base tabular-nums num-en">14</p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {lang === "ar"
                          ? "الحماية المدنية والإسعاف"
                          : "Civil Protection / Ambulance"}
                      </p>
                    </div>
                    <PhoneCall className="w-4 h-4 text-rose-600" />
                  </a>

                  <a
                    href="tel:3033"
                    className="flex items-center justify-between p-3 rounded-2xl bg-secondary/60 hover:bg-purple-50 hover:border-purple-300 border border-transparent transition"
                  >
                    <div>
                      <p className="font-bold text-purple-600 text-base tabular-nums num-en">
                        3033
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {lang === "ar"
                          ? "خلية الإصغاء والمرافقة النفسية"
                          : "Psychological Support Cell"}
                      </p>
                    </div>
                    <PhoneCall className="w-4 h-4 text-purple-600" />
                  </a>

                  <a
                    href="tel:1548"
                    className="flex items-center justify-between p-3 rounded-2xl bg-secondary/60 hover:bg-emerald-50 hover:border-emerald-300 border border-transparent transition"
                  >
                    <div>
                      <p className="font-bold text-emerald-600 text-base tabular-nums num-en">
                        1548
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {lang === "ar" ? "الخط الأخضر للأمن الوطني" : "National Police Green Line"}
                      </p>
                    </div>
                    <PhoneCall className="w-4 h-4 text-emerald-600" />
                  </a>

                  <a
                    href="tel:17"
                    className="flex items-center justify-between p-3 rounded-2xl bg-secondary/60 hover:bg-blue-50 hover:border-blue-300 border border-transparent transition"
                  >
                    <div>
                      <p className="font-bold text-blue-600 text-base tabular-nums num-en">17</p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {lang === "ar"
                          ? "شرطة النجدة والطوارئ"
                          : "Emergency Police (Police Secours)"}
                      </p>
                    </div>
                    <PhoneCall className="w-4 h-4 text-blue-600" />
                  </a>
                </div>
              </div>

              {/* France Helplines */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <span className="text-base">🇫🇷</span>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    {lang === "ar" ? "فرنسا (أرقام مجانية 24/7)" : "France (24/7 Toll-free)"}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href="tel:3114"
                    className="flex items-center justify-between p-3 rounded-2xl bg-secondary/60 hover:bg-rose-50 hover:border-rose-300 border border-transparent transition"
                  >
                    <div>
                      <p className="font-bold text-rose-600 text-base tabular-nums num-en">3114</p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {lang === "ar"
                          ? "الرقم الوطني للوقاية من الانتحار"
                          : "National Suicide Prevention (3114)"}
                      </p>
                    </div>
                    <PhoneCall className="w-4 h-4 text-rose-600" />
                  </a>

                  <a
                    href="tel:15"
                    className="flex items-center justify-between p-3 rounded-2xl bg-secondary/60 hover:bg-blue-50 hover:border-blue-300 border border-transparent transition"
                  >
                    <div>
                      <p className="font-bold text-blue-600 text-base tabular-nums num-en">15</p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {lang === "ar" ? "طوارئ الإسعاف الطبي SAMU" : "Medical Emergency SAMU (15)"}
                      </p>
                    </div>
                    <PhoneCall className="w-4 h-4 text-blue-600" />
                  </a>
                </div>
              </div>

              {/* Global / International */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <span className="text-base">🌍</span>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    {lang === "ar" ? "دليل المساعدة الدولي" : "International Helplines"}
                  </h4>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://findahelpline.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-secondary/40 hover:bg-secondary transition text-xs font-medium"
                  >
                    <span>
                      {lang === "ar"
                        ? "ابحثي عن خط مساعدة مجاني في بلدك (Find A Helpline)"
                        : "Find a free confidential helpline in your country"}
                    </span>
                    <ExternalLink className="w-4 h-4 text-primary" />
                  </a>
                  <a
                    href="https://www.befrienders.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-secondary/40 hover:bg-secondary transition text-xs font-medium"
                  >
                    <span>
                      Befrienders Worldwide —{" "}
                      {lang === "ar" ? "دعم نفسي سري عالمي" : "Global emotional support"}
                    </span>
                    <ExternalLink className="w-4 h-4 text-primary" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PSYCHO-ONCOLOGY SPECIALIST */}
          {activeTab === "specialist" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <HeartHandshake className="w-5 h-5" />
                  <h4>
                    {lang === "ar"
                      ? "ما هو الدعم النفسي للأورام (Psycho-Oncology)؟"
                      : "What is Psycho-Oncology?"}
                  </h4>
                </div>
                <p className="text-xs leading-relaxed text-foreground/85">
                  {lang === "ar"
                    ? "هو تخصص معتمد يجمع بين طب الأورام وعلم النفس الإكلينيكي، لمساعدة النساء على التكيف مع مشاعر الصدمة، القلق من الفحوصات، التغيرات الجسدية، وتحسين جودة الحياة خلال رحلة العلاج والتعافي."
                    : "Psycho-oncology is an established discipline supporting patients and families with the emotional, behavioral, and social challenges of cancer, from diagnosis through recovery."}
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-xs text-primary uppercase tracking-wide">
                  {lang === "ar"
                    ? "متى يُنصح باستشارة أخصائي نفسي؟"
                    : "When is speaking to a specialist recommended?"}
                </h5>
                <ul className="space-y-2 text-xs text-foreground/80">
                  <li className="flex items-start gap-2 bg-secondary/40 p-2.5 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      {lang === "ar"
                        ? "استمرار مشاعر الحزن أو التوتر والقلق الشديد لأكثر من أسبوعين متتاليين."
                        : "Persistent sadness, anxiety, or feelings of hopelessness lasting more than two weeks."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 bg-secondary/40 p-2.5 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      {lang === "ar"
                        ? "صعوبة النوم الشديدة أو الكوابيس المتكررة المرتبطة بالفحوصات والجراحة."
                        : "Severe sleep disturbances or intense medical scan anxiety (scanxiety)."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 bg-secondary/40 p-2.5 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      {lang === "ar"
                        ? "الشعور بالعزلة أو صعوبة التواصل مع العائلة والأحباء."
                        : "Feeling isolated or finding it hard to communicate emotions with family."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 bg-secondary/40 p-2.5 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      {lang === "ar"
                        ? "الرغبة في تعلم استراتيجيات تكيف مثبتة علمياً للتعامل مع الآثار الجانبية."
                        : "Wanting evidence-based cognitive strategies to navigate treatment and body changes."}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
                <p className="font-bold mb-1 flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>
                    {lang === "ar" ? "كيف تبدئين الاستشارة؟" : "How to request a referral:"}
                  </span>
                </p>
                <p>
                  {lang === "ar"
                    ? "أخبري طبيب الأورام المعالج أو الممرضة المنسقة في موعدكِ القادم: 'أرغب في مقابلة الأخصائي النفسي التابع لمركز الأورام'. معظم مراكز علاج الأورام توفر هذه الخدمة كجزء أساسي ومجاني من الرعاية."
                    : "Simply ask your oncologist or oncology nurse coordinator: 'I would like to speak with the hospital's psycho-oncologist or oncology social worker.' Most specialized cancer centers provide this complementary care."}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: IMMEDIATE CRISIS GROUNDING */}
          {activeTab === "grounding" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200">
                <p className="font-bold mb-1 text-emerald-700 dark:text-emerald-300">
                  {lang === "ar"
                    ? "خطوات عملية فورية لتهدئة نوبة الهلع أو الضيق النفسي الشديد:"
                    : "Immediate 4-Step Panic & Overwhelm Grounding Protocol:"}
                </p>
                <p>
                  {lang === "ar"
                    ? "أنتِ الآن في أمان. هذا الشعور مؤقت وسيمر بعد دقائق قليلة مثل سحابة عابرة."
                    : "You are safe right now. This intense wave is physical and temporary; it will peak and subside."}
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-secondary/50 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-xs text-primary">
                      {lang === "ar" ? "تثبيت القدمين" : "Feet on Ground"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lang === "ar"
                        ? "ضعي باطن قدميكِ بثبات على الأرض واستشعري ثقل جسدكِ المستند بأمان."
                        : "Plant both feet flat on the floor. Feel the solid earth supporting you."}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-secondary/50 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-xs text-primary">
                      {lang === "ar" ? "رشفة ماء بارد" : "Cool Water"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lang === "ar"
                        ? "اشربي رشفات بطيئة من الماء البارد أو بللي وجهكِ؛ هذا يُهدئ العصب المبهم فوراً."
                        : "Sip cold water slowly or splash cool water on your wrists to soothe the vagus nerve."}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-secondary/50 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-xs text-primary">
                      {lang === "ar" ? "زفير أطول من الشهيق" : "Long Gentle Exhales"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lang === "ar"
                        ? "استنشقي لمدة 3 ثوانٍ وأطلقي الزفير ببطء شديد لمدة 6 ثوانٍ."
                        : "Inhale for 3 seconds, then exhale very slowly for 6 seconds."}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-secondary/50 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                    4
                  </div>
                  <div>
                    <p className="font-bold text-xs text-primary">
                      {lang === "ar" ? "التواصل مع شخص تثقين به" : "Reach Out"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lang === "ar"
                        ? "لا تبقي وحدكِ مع الأفكار الصعبة؛ اتصلي بصديقة، أحد أفراد العائلة أو خط المساعدة."
                        : "Do not sit alone with heavy thoughts; message a trusted loved one or call a helpline."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 bg-muted/20 flex items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground leading-tight">
            {lang === "ar"
              ? "الدعم متاح 24 ساعة دون أي حكم وبسرية تامة"
              : "Support is free, confidential, and compassionate 24/7"}
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl gradient-rose text-primary-foreground font-bold text-xs hover:opacity-90 transition shrink-0"
          >
            {lang === "ar" ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
