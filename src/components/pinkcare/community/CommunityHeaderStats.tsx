import { useState, useEffect } from "react";
import { Users, Wifi, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { getCommunityStats } from "@/lib/communityChatStorage";

interface CommunityHeaderStatsProps {
  registeredCount?: number;
  onlineCount?: number;
  totalGroupsCount?: number;
  lang?: Lang;
}

export function CommunityHeaderStats({
  registeredCount: propRegistered,
  onlineCount: propOnline,
  totalGroupsCount: propGroups,
  lang = "ar",
}: CommunityHeaderStatsProps) {
  const isRtl = lang === "ar" || lang === "dz";

  const [stats, setStats] = useState(() => getCommunityStats());

  useEffect(() => {
    const updateStats = () => {
      setStats(getCommunityStats());
    };
    window.addEventListener("pinkcare:community-chat-updated", updateStats);
    window.addEventListener("storage", updateStats);
    return () => {
      window.removeEventListener("pinkcare:community-chat-updated", updateStats);
      window.removeEventListener("storage", updateStats);
    };
  }, []);

  const registeredCount = propRegistered ?? stats.registeredCount ?? 1425;
  const onlineCount = propOnline ?? stats.onlineCount ?? 32;
  const totalGroupsCount = propGroups ?? stats.totalGroupsCount ?? 10;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/80 via-fuchsia-950/70 to-slate-950/90 border border-fuchsia-400/30 p-4 shadow-xl backdrop-blur-md">
      {/* Decorative ambient glows */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-pink-500/20 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-purple-600/20 blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-3">
        {/* Welcome Text */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-fuchsia-950/60">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                {isRtl ? "مرحباً بكِ في مجتمع PinkCare 🌸" : "Welcome to PinkCare Community 🌸"}
              </h2>
              <p className="text-[11px] text-fuchsia-200/80">
                {isRtl
                  ? "مساحتكِ الدافئة للدعم النفسي، الدردشة الجماعية، وتبادل التجارب"
                  : "Your safe haven for emotional support, group chat, and shared hope"}
              </p>
            </div>
          </div>

          {/* Live Online Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>
              {onlineCount} {isRtl ? "متصلة الآن" : "online"}
            </span>
          </div>
        </div>

        {/* Real Stats Metric Cards */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-fuchsia-400/20 text-center">
          <div className="p-2 rounded-2xl glass-dark border border-fuchsia-400/20">
            <div className="flex items-center justify-center gap-1 text-[10px] text-fuchsia-200/70 mb-0.5">
              <Users className="w-3 h-3 text-pink-400" />
              <span>{isRtl ? "العضوات" : "Members"}</span>
            </div>
            <p className="text-sm font-bold text-white tabular-nums">
              {(registeredCount ?? 0).toLocaleString()}
            </p>
          </div>

          <div className="p-2 rounded-2xl glass-dark border border-fuchsia-400/20">
            <div className="flex items-center justify-center gap-1 text-[10px] text-fuchsia-200/70 mb-0.5">
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>{isRtl ? "نشطات الآن" : "Active Now"}</span>
            </div>
            <p className="text-sm font-bold text-emerald-300 tabular-nums">{onlineCount}</p>
          </div>

          <div className="p-2 rounded-2xl glass-dark border border-fuchsia-400/20">
            <div className="flex items-center justify-center gap-1 text-[10px] text-fuchsia-200/70 mb-0.5">
              <MessageSquare className="w-3 h-3 text-purple-400" />
              <span>{isRtl ? "المجموعات" : "Groups"}</span>
            </div>
            <p className="text-sm font-bold text-white tabular-nums">{totalGroupsCount}</p>
          </div>
        </div>

        {/* Medical Safety Disclaimer Pill */}
        <div className="p-2 px-3 rounded-xl bg-black/40 border border-fuchsia-400/20 flex items-center gap-2 text-[10px] text-fuchsia-200/90 leading-tight">
          <ShieldCheck className="w-4 h-4 text-pink-400 shrink-0" />
          <span>
            {isRtl
              ? "تنبيه طبي: التجارب الشخصية المتبادلة هي للدعم المعنوي فقط ولا تغني عن استشارة طبيبك المعالج."
              : "Medical note: Shared personal stories are for peer emotional support and never replace your doctor."}
          </span>
        </div>
      </div>
    </div>
  );
}
