import { useState } from "react";
import { X, Sparkles, Users, ShieldAlert, Lock, Globe } from "lucide-react";
import { toast } from "sonner";
import type { GroupCategory } from "@/types/community";
import { createCommunityGroup } from "@/lib/communityChatStorage";
import type { Lang } from "@/lib/i18n";

interface CreateGroupModalProps {
  currentUserId: string;
  lang?: Lang;
  onClose: () => void;
  onCreated: (groupId: string) => void;
}

const CATEGORIES: { id: GroupCategory; labelAr: string; labelFr: string }[] = [
  { id: "emotional", labelAr: "دعم نفسي ومعنوي", labelFr: "Soutien émotionnel" },
  { id: "journey", labelAr: "تجارب وقصص شخصية", labelFr: "Parcours de vie" },
  { id: "diagnosis", labelAr: "مرحلة التشخيص والفحوصات", labelFr: "Diagnostic & Bilans" },
  { id: "chemo", labelAr: "مرحلة العلاج الكيميائي", labelFr: "Chimiothérapie" },
  { id: "radiation", labelAr: "العلاج الإشعاعي والعناية", labelFr: "Radiothérapie" },
  { id: "recovery", labelAr: "التعافي وإعادة التأهيل", labelFr: "Récupération" },
  { id: "nutrition", labelAr: "التغذية ونمط الحياة", labelFr: "Nutrition" },
  { id: "exercise", labelAr: "التمارين والحركة", labelFr: "Activité physique" },
  { id: "survivors", labelAr: "تجارب الناجيات والمتعافيات", labelFr: "Survivantes" },
  { id: "qa", labelAr: "استفسارات وأسئلة عامة", labelFr: "Questions & Réponses" },
  { id: "custom", labelAr: "مجموعة مخصصة أخرى", labelFr: "Groupe personnalisé" },
];

const ICONS = ["🌸", "💗", "🩺", "🥗", "🏃‍♀️", "👑", "💧", "🔬", "🕊️", "☀️", "☕", "🌿", "🦋", "✨"];

export function CreateGroupModal({
  currentUserId,
  lang = "ar",
  onClose,
  onCreated,
}: CreateGroupModalProps) {
  const isRtl = lang === "ar" || lang === "dz";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GroupCategory>("emotional");
  const [selectedIcon, setSelectedIcon] = useState("🌸");
  const [isPrivate, setIsPrivate] = useState(false);
  const [rules, setRules] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(isRtl ? "يرجى كتابة اسم المجموعة" : "Group name is required");
      return;
    }
    if (!description.trim()) {
      toast.error(isRtl ? "يرجى كتابة وصف أو هدف المجموعة" : "Group description is required");
      return;
    }

    const created = createCommunityGroup({
      nameAr: name.trim(),
      descriptionAr: description.trim(),
      category,
      icon: selectedIcon,
      isPrivate,
      rulesAr: rules.trim(),
      createdBy: currentUserId,
    });

    toast.success(
      isRtl
        ? `✨ تم إنشاء مجموعة "${created.nameAr}" بنجاح!`
        : `Group "${created.nameAr}" created!`,
    );
    onCreated(created.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-950 border border-fuchsia-400/40 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-fuchsia-400/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-300">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">
                {isRtl ? "إنشاء مجموعة دعم جديدة" : "Create New Support Group"}
              </h3>
              <p className="text-[10px] text-fuchsia-200/80">
                {isRtl
                  ? "مساحة تجمع المحاربات حول موضوع محدد"
                  : "A dedicated topic for peer support"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full glass-dark text-fuchsia-200 hover:text-white flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Icon Picker */}
          <div>
            <label className="font-bold text-fuchsia-200 mb-1.5 block">
              {isRtl ? "أيقونة ورمز المجموعة:" : "Group Icon:"}
            </label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setSelectedIcon(ic)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition ${
                    selectedIcon === ic
                      ? "bg-pink-500 text-white scale-110 shadow-md shadow-pink-500/40 border border-pink-300"
                      : "glass-dark hover:border-pink-400 border border-fuchsia-400/20"
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Group Name */}
          <div>
            <label className="font-bold text-fuchsia-200 mb-1 block">
              {isRtl ? "اسم المجموعة:" : "Group Name:"}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isRtl ? "مثال: رفيقات العلاج الإشعاعي في الجزائر" : "e.g. Hope Warriors"}
              className="w-full bg-slate-900 text-white placeholder-fuchsia-300/40 rounded-xl p-2.5 border border-fuchsia-400/30 focus:border-pink-400 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-bold text-fuchsia-200 mb-1 block">
              {isRtl ? "التصنيف الرئيسي:" : "Category:"}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GroupCategory)}
              className="w-full bg-slate-900 text-white rounded-xl p-2.5 border border-fuchsia-400/30 focus:border-pink-400 focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {isRtl ? c.labelAr : c.labelFr}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-fuchsia-200 mb-1 block">
              {isRtl ? "وصف وهدف المجموعة:" : "Description & Mission:"}
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isRtl
                  ? "ما هو موضوع النقاش والهدف من هذه المساحة؟"
                  : "Describe the group purpose..."
              }
              className="w-full bg-slate-900 text-white placeholder-fuchsia-300/40 rounded-xl p-2.5 border border-fuchsia-400/30 focus:border-pink-400 focus:outline-none resize-none"
            />
          </div>

          {/* Privacy Toggle */}
          <div className="p-2.5 rounded-2xl glass-dark border border-fuchsia-400/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPrivate ? (
                <Lock className="w-4 h-4 text-pink-400" />
              ) : (
                <Globe className="w-4 h-4 text-emerald-400" />
              )}
              <div>
                <span className="font-bold text-white block text-[11px]">
                  {isPrivate
                    ? isRtl
                      ? "مجموعة خاصة (للأعضاء المنضمين)"
                      : "Private Group"
                    : isRtl
                      ? "مجموعة عامة (مرئية للجميع)"
                      : "Public Group"}
                </span>
                <span className="text-[10px] text-fuchsia-200/70">
                  {isPrivate
                    ? isRtl
                      ? "الرسائل تظهر فقط لمن تنضم للمجموعة"
                      : "Members only"
                    : isRtl
                      ? "يمكن لجميع عضوات PinkCare الانضمام والمشاركة"
                      : "Open for all members"}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 accent-pink-500 rounded"
            />
          </div>

          {/* Custom Rules (Optional) */}
          <div>
            <label className="font-bold text-fuchsia-200 mb-1 block">
              {isRtl ? "قواعد خاصة بالمجموعة (اختياري):" : "Custom Rules (Optional):"}
            </label>
            <textarea
              rows={2}
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder={
                isRtl
                  ? "مثال: عدم تداول صور أدوية، الالتزام باللطف..."
                  : "Rules and code of conduct..."
              }
              className="w-full bg-slate-900 text-white placeholder-fuchsia-300/40 rounded-xl p-2.5 border border-fuchsia-400/30 focus:border-pink-400 focus:outline-none resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition"
          >
            {isRtl ? "إنشاء المجموعة والبدء 🌸" : "Create Group 🌸"}
          </button>
        </form>
      </div>
    </div>
  );
}
