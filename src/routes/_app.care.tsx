import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Sparkles,
  HandMetal,
  Shirt,
  Dumbbell,
  Droplet,
  Pill,
  Footprints,
  Moon,
  Check,
  Heart,
  Calendar,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n, getLocalizedText } from "@/lib/i18n";
import { getReminders, addReminder, removeReminder, todayISO } from "@/lib/local-db";
import { MedicationManager } from "@/components/pinkcare/MedicationManager";
import { AppointmentManager } from "@/components/pinkcare/AppointmentManager";

export const Route = createFileRoute("/_app/care")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab as "checklist" | "medications" | "appointments") || "checklist",
  }),
  component: CarePage,
});

const REMINDERS = [
  {
    key: "moisturize",
    icon: Sparkles,
    title_ar: "ترطيب الجلد بعناية",
    desc_ar: "استخدمي المرطب الطبي بلطف",
    title_dz: "ترطيب الجلد واليدين",
    desc_dz: "ديري كريم طبي مرطب بلطف وبراحة",
    title_fr: "Hydratation douce de la peau",
    desc_fr: "Appliquez votre crème sans parfum",
    title_en: "Moisturize skin",
    desc_en: "Use medical moisturizer gently",
  },
  {
    key: "gloves",
    icon: HandMetal,
    title_ar: "ارتداء القفازات",
    desc_ar: "أثناء الأعمال المنزلية للحماية",
    title_dz: "لبسي القفازات (Les gants)",
    desc_dz: "كي تخدمي في الدار باش تحمي يديك من الجروح",
    title_fr: "Porter des gants protecteurs",
    desc_fr: "Pendant les tâches ménagères",
    title_en: "Wear gloves",
    desc_en: "During housework for protection",
  },
  {
    key: "loose_clothes",
    icon: Shirt,
    title_ar: "تجنب الملابس الضيقة",
    desc_ar: "اختاري ملابس مريحة وفضفاضة",
    title_dz: "تفاداي الحوايج المزيرين",
    desc_dz: "خيري قش واسع ومريح من القطن",
    title_fr: "Vêtements amples et doux",
    desc_fr: "Préférez le coton sans compression",
    title_en: "Avoid tight clothing",
    desc_en: "Choose comfortable, loose clothes",
  },
  {
    key: "arm_exercises",
    icon: Dumbbell,
    title_ar: "تمارين الذراع",
    desc_ar: "10 دقائق من التمارين اللطيفة",
    title_dz: "التمارين تاع كل نهار",
    desc_dz: "10 دقائق تاع حركات خفيفة للذراع والكتف",
    title_fr: "Exercices doux du bras",
    desc_fr: "10 minutes d'étirements bienveillants",
    title_en: "Arm exercises",
    desc_en: "10 minutes of gentle exercises",
  },
  {
    key: "water",
    icon: Droplet,
    title_ar: "شرب الماء",
    desc_ar: "هدفك اليومي: 8 أكواب",
    title_dz: "شرب الما",
    desc_dz: "الهدف تاع اليوم: 8 كيسان ما لترطيب جسمك",
    title_fr: "Hydratation quotidienne",
    desc_fr: "Objectif du jour : 8 verres d'eau",
    title_en: "Drink water",
    desc_en: "Daily goal: 8 cups",
  },
  {
    key: "medication",
    icon: Pill,
    title_ar: "تناول الأدوية",
    desc_ar: "الجرعة الموصوفة في وقتها",
    title_dz: "الدوايات تاعك",
    desc_dz: "شربي الجرعة تاعك في وقتها بانتظام",
    title_fr: "Prise des traitements",
    desc_fr: "Votre posologie exacte à l'heure prévue",
    title_en: "Take medication",
    desc_en: "Prescribed dose on time",
  },
  {
    key: "walking",
    icon: Footprints,
    title_ar: "المشي اليومي",
    desc_ar: "20-30 دقيقة من المشي",
    title_dz: "مشية خفيفة",
    desc_dz: "20-30 دقيقة مشي في الهواء تبدلي بيها الجو",
    title_fr: "Marche quotidienne",
    desc_fr: "20-30 minutes de promenade douce",
    title_en: "Daily walk",
    desc_en: "20-30 minutes of walking",
  },
  {
    key: "sleep",
    icon: Moon,
    title_ar: "النوم الجيد",
    desc_ar: "7-9 ساعات للتعافي",
    title_dz: "رقاد وراحة مليحة",
    desc_dz: "7-9 سوايع باش يرتاح جسمك ويرجع عافيتو",
    title_fr: "Sommeil réparateur",
    desc_fr: "7-9 heures pour régénérer vos forces",
    title_en: "Good sleep",
    desc_en: "7-9 hours for recovery",
  },
];

function CarePage() {
  const { t, lang } = useI18n();
  const search = Route.useSearch();
  const [careTab, setCareTab] = useState<"checklist" | "medications" | "appointments">(
    search.tab || "checklist",
  );
  const [done, setDone] = useState<Set<string>>(new Set());
  const today = todayISO();

  // Sync tab with URL search parameter reactively
  useEffect(() => {
    if (
      search.tab &&
      (search.tab === "medications" || search.tab === "appointments" || search.tab === "checklist")
    ) {
      setCareTab(search.tab);
    }
  }, [search.tab]);

  useEffect(() => {
    setDone(new Set(getReminders(today).map((r) => r.key)));
  }, [today]);

  const toggle = async (key: string) => {
    if (done.has(key)) {
      removeReminder(key, today);
      const n = new Set(done);
      n.delete(key);
      setDone(n);
    } else {
      addReminder(key, today);
      setDone(new Set(done).add(key));
      toast.success(
        getLocalizedText(lang, {
          ar: "تم تسجيل النشاط بنجاح ✨",
          dz: "تسجل النشاط يعطيك الصحة ✨",
          fr: "Activité enregistrée avec succès ✨",
          en: "Activity recorded successfully ✨",
        }),
      );
    }
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Header */}
      <section className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-primary">{t("daily_reminders")}</h2>
        <p className="text-sm text-muted-foreground">{t("care_subtitle")}</p>
      </section>

      {/* Main Care Section Tabs */}
      <div className="glass rounded-full p-1 grid grid-cols-3 gap-1 text-xs font-bold">
        <button
          onClick={() => setCareTab("checklist")}
          className={`py-2 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            careTab === "checklist"
              ? "gradient-neon text-primary-foreground neon-glow shadow-sm"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {getLocalizedText(lang, {
              ar: "قائمة الرعاية",
              dz: "واش تفكري اليوم",
              fr: "Liste de soins",
              en: "Daily Checklist",
            })}
          </span>
        </button>
        <button
          onClick={() => setCareTab("medications")}
          className={`py-2 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            careTab === "medications"
              ? "gradient-neon text-primary-foreground neon-glow shadow-sm"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>
            {getLocalizedText(lang, {
              ar: "الأدوية الموصوفة",
              dz: "الدوايات تاعك",
              fr: "Médicaments",
              en: "Medications",
            })}
          </span>
        </button>
        <button
          onClick={() => setCareTab("appointments")}
          className={`py-2 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            careTab === "appointments"
              ? "gradient-neon text-primary-foreground neon-glow shadow-sm"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {getLocalizedText(lang, {
              ar: "المواعيد والفحوصات",
              dz: "المواعيد والفحوصات",
              fr: "Rendez-vous",
              en: "Appointments",
            })}
          </span>
        </button>
      </div>

      {/* QUICK LINK TO EMOTIONAL WELL-BEING */}
      <Link
        to="/wellbeing"
        className="block glass rounded-3xl p-3.5 border border-primary/20 hover:border-primary/40 transition bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 shadow-xs"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl gradient-rose flex items-center justify-center text-primary-foreground shadow-xs">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <p className="font-bold text-xs text-foreground">
                {getLocalizedText(lang, {
                  ar: "الدعم النفسي وسجل المشاعر",
                  dz: "راحة البال ودفتر المشاعر",
                  fr: "Bien-être & Journal émotionnel",
                  en: "Emotional Support & Mood Journal",
                })}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {getLocalizedText(lang, {
                  ar: "سجّلي مشاعركِ واكتشفي تمارين الاسترخاء والتنفس",
                  dz: "سجلي واش راكي حاسة واكتشفي تمارين التنفس والاسترخاء",
                  fr: "Exprimez vos ressentis et découvrez les exercices de détente",
                  en: "Check in with your feelings & explore relaxation exercises",
                })}
              </p>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-primary rotate-180 rtl:rotate-0" />
        </div>
      </Link>

      {/* TAB 1: DAILY CARE CHECKLIST */}
      {careTab === "checklist" && (
        <div className="space-y-4 animate-page-enter">
          <div className="space-y-3">
            {REMINDERS.map((r) => {
              const Icon = r.icon;
              const checked = done.has(r.key);
              const title =
                lang === "dz"
                  ? r.title_dz
                  : lang === "ar"
                    ? r.title_ar
                    : lang === "fr"
                      ? r.title_fr
                      : r.title_en;
              const desc =
                lang === "dz"
                  ? r.desc_dz
                  : lang === "ar"
                    ? r.desc_ar
                    : lang === "fr"
                      ? r.desc_fr
                      : r.desc_en;

              return (
                <button
                  key={r.key}
                  onClick={() => toggle(r.key)}
                  className="glass rounded-2xl p-4 w-full flex items-center gap-3 hover:scale-[1.01] transition text-start cursor-pointer"
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      checked ? "bg-primary border-primary" : "border-muted-foreground/40"
                    }`}
                  >
                    {checked && <Check className="w-4 h-4 text-primary-foreground" />}
                  </div>
                  <div className="flex-1 text-end">
                    <p className="font-bold text-primary">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="glass rounded-3xl p-5 text-center border-2 border-dashed border-primary/30 space-y-2">
            <Heart className="w-6 h-6 text-primary mx-auto" fill="currentColor" />
            <p className="font-bold text-primary">{t("you_are_amazing")}</p>
            <p className="text-xs text-muted-foreground">{t("care_encourage")}</p>
          </div>
        </div>
      )}

      {/* TAB 2: MEDICATION MANAGEMENT */}
      {careTab === "medications" && (
        <div className="animate-page-enter">
          <MedicationManager />
        </div>
      )}

      {/* TAB 3: APPOINTMENT & EXAMINATION MANAGEMENT */}
      {careTab === "appointments" && (
        <div className="animate-page-enter">
          <AppointmentManager />
        </div>
      )}
    </div>
  );
}
