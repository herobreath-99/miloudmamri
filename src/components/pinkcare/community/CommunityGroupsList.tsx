import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Users,
  MessageSquare,
  Check,
  ChevronLeft,
  ChevronRight,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import type { CommunityGroup, GroupCategory } from "@/types/community";
import { toggleJoinGroup, getCommunityGroups } from "@/lib/communityChatStorage";
import type { Lang } from "@/lib/i18n";

interface CommunityGroupsListProps {
  groups?: CommunityGroup[];
  currentUserId: string;
  lang?: Lang;
  onSelectGroup: (group: CommunityGroup) => void;
  onOpenCreateGroup?: () => void;
  onCreateGroup?: () => void;
}

const CATEGORY_TABS: { id: GroupCategory | "all" | "joined"; labelAr: string; labelFr: string }[] =
  [
    { id: "all", labelAr: "الكل", labelFr: "Tous" },
    { id: "joined", labelAr: "مجموعاتي 🌸", labelFr: "Mes groupes" },
    { id: "emotional", labelAr: "دعم نفسي", labelFr: "Soutien" },
    { id: "journey", labelAr: "تجارب وقصص", labelFr: "Parcours" },
    { id: "chemo", labelAr: "العلاج الكيميائي", labelFr: "Chimiothérapie" },
    { id: "radiation", labelAr: "العلاج الإشعاعي", labelFr: "Radiothérapie" },
    { id: "recovery", labelAr: "التعافي والتأهيل", labelFr: "Récupération" },
    { id: "nutrition", labelAr: "التغذية", labelFr: "Nutrition" },
    { id: "exercise", labelAr: "التمارين والحركة", labelFr: "Activité physique" },
    { id: "survivors", labelAr: "الناجيات", labelFr: "Survivantes" },
    { id: "qa", labelAr: "أسئلة عامة", labelFr: "Q&R" },
  ];

export function CommunityGroupsList({
  groups: propGroups,
  currentUserId,
  lang = "ar",
  onSelectGroup,
  onOpenCreateGroup,
  onCreateGroup,
}: CommunityGroupsListProps) {
  const isRtl = lang === "ar" || lang === "dz";
  const handleOpenCreate = onOpenCreateGroup || onCreateGroup || (() => {});

  const [storedGroups, setStoredGroups] = useState<CommunityGroup[]>(() => getCommunityGroups());
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleUpdate = () => {
      setStoredGroups(getCommunityGroups());
    };
    window.addEventListener("pinkcare:community-chat-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("pinkcare:community-chat-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const activeGroups = propGroups ?? storedGroups;

  const filteredGroups = useMemo(() => {
    const list = Array.isArray(activeGroups) ? activeGroups : [];
    return list.filter((g) => {
      // Tab filter
      if (activeTab === "joined" && !g.memberIds?.includes(currentUserId)) {
        return false;
      }
      if (activeTab !== "all" && activeTab !== "joined" && g.category !== activeTab) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName =
          (g.nameAr || "").toLowerCase().includes(q) || (g.nameFr || "").toLowerCase().includes(q);
        const inDesc =
          (g.descriptionAr || "").toLowerCase().includes(q) ||
          (g.descriptionFr || "").toLowerCase().includes(q);
        if (!inName && !inDesc) return false;
      }

      return true;
    });
  }, [activeGroups, activeTab, searchQuery, currentUserId]);

  const handleToggleJoin = (e: React.MouseEvent, g: CommunityGroup) => {
    e.stopPropagation();
    const joined = toggleJoinGroup(g.id, currentUserId);
    setStoredGroups(getCommunityGroups());
    if (joined) {
      toast.success(isRtl ? `انضممتِ إلى ${g.nameAr} 🌸` : `Joined ${g.nameFr} 🌸`);
    } else {
      toast.info(isRtl ? `تمت مغادرة ${g.nameAr}` : `Left ${g.nameFr}`);
    }
  };

  return (
    <div className="space-y-3.5 pb-8">
      {/* Search & Create Actions */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-fuchsia-300 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? "بحث في مجموعات الدعم والموضوعات..." : "Search groups & topics..."}
            className="w-full bg-slate-950/80 text-xs text-white placeholder-fuchsia-300/40 rounded-2xl py-2.5 ps-9 pe-3 border border-fuchsia-500/25 focus:border-pink-400 focus:outline-none"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? "إنشاء مجموعة" : "New Group"}</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {CATEGORY_TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-2xl whitespace-nowrap text-xs font-semibold transition-all ${
                active
                  ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-md shadow-fuchsia-950/40 border border-pink-300/40"
                  : "glass-dark text-fuchsia-200/80 hover:text-white border border-fuchsia-400/20"
              }`}
            >
              {lang === "fr" ? tab.labelFr : tab.labelAr}
            </button>
          );
        })}
      </div>

      {/* Groups List */}
      <div className="space-y-3">
        {filteredGroups.length === 0 ? (
          <div className="p-8 text-center rounded-3xl glass-dark border border-fuchsia-400/20 space-y-2">
            <p className="text-xs font-bold text-white">
              {isRtl ? "لا توجد مجموعات مطابقة لبحثك" : "No groups found"}
            </p>
            <p className="text-[11px] text-fuchsia-200/70">
              {isRtl
                ? "يمكنكِ إنشاء مجموعة جديدة وتبادل الدعم مع الأخوات"
                : "Create a new group to connect"}
            </p>
          </div>
        ) : (
          filteredGroups.map((group) => {
            const isJoined = (group.memberIds || []).includes(currentUserId);

            return (
              <div
                key={group.id}
                onClick={() => onSelectGroup(group)}
                className="p-3.5 rounded-3xl glass-dark border border-fuchsia-400/25 hover:border-pink-400 transition cursor-pointer shadow-lg space-y-2.5 relative overflow-hidden group"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/80 to-purple-600/80 flex items-center justify-center text-2xl shadow-md shrink-0 border border-pink-300/30">
                      {group.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-white group-hover:text-pink-300 transition truncate">
                          {isRtl ? group.nameAr : group.nameFr}
                        </h4>
                        {group.isOfficial && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-300 font-semibold border border-pink-400/30 shrink-0">
                            {isRtl ? "رسمية" : "Official"}
                          </span>
                        )}
                        {group.isPrivate && <Lock className="w-3 h-3 text-fuchsia-300 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-fuchsia-200/80 line-clamp-2 mt-0.5 leading-relaxed">
                        {isRtl ? group.descriptionAr : group.descriptionFr}
                      </p>
                    </div>
                  </div>

                  {/* Join / Leave Button */}
                  <button
                    onClick={(e) => handleToggleJoin(e, group)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1 shadow-sm ${
                      isJoined
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30"
                        : "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:brightness-110 active:scale-95"
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>{isRtl ? "منضمة" : "Joined"}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>{isRtl ? "انضمام" : "Join"}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Footer snippet & stats */}
                <div className="pt-2 border-t border-fuchsia-400/15 flex items-center justify-between text-[10px] text-fuchsia-300/80">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MessageSquare className="w-3 h-3 text-pink-400 shrink-0" />
                    <span className="truncate">
                      {group.lastMessagePreview || (isRtl ? "محادثة جماعية نشطة" : "Active chat")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-medium">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-purple-400" />
                      <span>{(group.memberIds || []).length}</span>
                    </span>
                    <button className="text-pink-300 font-bold hover:text-white flex items-center gap-0.5">
                      <span>{isRtl ? "دخول الدردشة" : "Open Chat"}</span>
                      {isRtl ? (
                        <ChevronLeft className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
