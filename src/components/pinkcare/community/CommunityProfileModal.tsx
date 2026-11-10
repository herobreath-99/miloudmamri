import { useState, useEffect } from "react";
import {
  X,
  User,
  Shield,
  Lock,
  Sparkles,
  Bell,
  MessageSquare,
  UserX,
  Check,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import type { CommunityUserProfile } from "@/types/community";
import { getCommunityUserProfile, saveCommunityUserProfile } from "@/lib/communityChatStorage";
import {
  getBlockedUsers,
  unblockUser,
  getUserCommunityNickname,
  setUserCommunityNickname,
} from "@/lib/communityStorage";
import type { Lang } from "@/lib/i18n";

interface CommunityProfileModalProps {
  userId: string;
  defaultName: string;
  lang?: Lang;
  onClose: () => void;
}

const AVAILABLE_INTERESTS = [
  "الدعم النفسي والمعنوي",
  "تمارين استعادة مرونة الذراع",
  "العناية بالبشرة والترطيب",
  "التغذية الداعمة للمناعة",
  "تجارب العلاج الكيميائي",
  "نصائح العلاج الإشعاعي",
  "العودة للعمل والنشاط",
  "قصص الشفاء والأمل",
];

export function CommunityProfileModal({
  userId,
  defaultName,
  lang = "ar",
  onClose,
}: CommunityProfileModalProps) {
  const isRtl = lang === "ar" || lang === "dz";

  const [profile, setProfile] = useState<CommunityUserProfile | null>(null);
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [allowDirect, setAllowDirect] = useState(true);
  const [groupNotifs, setGroupNotifs] = useState(true);
  const [directNotifs, setDirectNotifs] = useState(true);
  const [blockedList, setBlockedList] = useState(getBlockedUsers());

  useEffect(() => {
    const prof = getCommunityUserProfile(userId);
    setProfile(prof);
    setNickname(prof.nickname || getUserCommunityNickname() || "زهرة الأمل 🌸");
    setBio(prof.bio || "");
    setSelectedInterests(prof.interests || []);
    setAllowDirect(prof.allowDirectMessages !== false);
    setGroupNotifs(prof.notificationSettings?.groupMessages !== false);
    setDirectNotifs(prof.notificationSettings?.directMessages !== false);
    setBlockedList(getBlockedUsers());
  }, [userId]);

  const toggleInterest = (tag: string) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    setUserCommunityNickname(nickname);

    saveCommunityUserProfile({
      userId,
      displayName: defaultName,
      nickname: nickname.trim(),
      bio: bio.trim(),
      interests: selectedInterests,
      joinedGroupIds: profile?.joinedGroupIds || [],
      allowDirectMessages: allowDirect,
      notificationSettings: {
        groupMessages: groupNotifs,
        directMessages: directNotifs,
        mentions: true,
        postReplies: true,
      },
      createdAt: profile?.createdAt || new Date().toISOString(),
    });

    toast.success(isRtl ? "تم حفظ إعدادات ملفكِ المجتمعي 🌸" : "Community profile updated 🌸");
    onClose();
  };

  const handleUnblock = (id: string, name: string) => {
    unblockUser(id);
    setBlockedList(getBlockedUsers());
    toast.info(isRtl ? `تم إلغاء حظر ${name}` : `Unblocked ${name}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-950 border border-fuchsia-400/40 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-fuchsia-400/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-300">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">
                {isRtl ? "ملفي المجتمعي والخصوصية" : "Community Profile & Privacy"}
              </h3>
              <p className="text-[10px] text-fuchsia-200/80">
                {isRtl
                  ? "تحكمي بما يظهر للأخوات وإعدادات الرسائل"
                  : "Manage your public persona & chat settings"}
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

        {/* Absolute Health Privacy Guarantee */}
        <div className="p-3 rounded-2xl bg-purple-950/40 border border-fuchsia-400/30 flex items-start gap-2.5 text-[11px] text-fuchsia-100/90 leading-relaxed">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-300 block mb-0.5">
              {isRtl ? "ضمان الخصوصية الصحية المطلقة:" : "Strict Privacy Assurance:"}
            </span>
            <p className="text-[10px]">
              {isRtl
                ? "لا يتم أبداً إظهار أرقام الهواتف، البريد الإلكتروني، أو السجلات الطبية الشخصية للعضوات. الإفصاح عن تفاصيل حالتكِ هو اختيار شخصي بالكامل."
                : "Phone numbers, emails, and medical history are never exposed to other members."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5 text-xs">
          {/* Nickname */}
          <div>
            <label className="font-bold text-fuchsia-200 mb-1 block">
              {isRtl ? "الاسم المستعار في المجتمع:" : "Community Nickname:"}
            </label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={isRtl ? "مثال: زهرة الأمل 🌸" : "e.g. Hope Warrior 🌸"}
              className="w-full bg-slate-900 text-white rounded-xl p-2.5 border border-fuchsia-400/30 focus:border-pink-400 focus:outline-none"
            />
            <span className="text-[10px] text-fuchsia-300/60 mt-1 block">
              {isRtl
                ? "يظهر هذا الاسم في رسائل المجموعات والمنشورات بدلاً من اسمكِ الكامل لحماية خصوصيتكِ."
                : "This nickname appears on your messages and posts."}
            </span>
          </div>

          {/* Bio */}
          <div>
            <label className="font-bold text-fuchsia-200 mb-1 block">
              {isRtl ? "نبذة تعريفية أو رسالة أمل (اختياري):" : "Bio / Message of Hope:"}
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={
                isRtl ? "كلمات دافئة أو أهداف ترغبين في تحقيقها..." : "A warm brief intro..."
              }
              className="w-full bg-slate-900 text-white placeholder-fuchsia-300/40 rounded-xl p-2.5 border border-fuchsia-400/30 focus:border-pink-400 focus:outline-none resize-none"
            />
          </div>

          {/* Interests Tags */}
          <div>
            <label className="font-bold text-fuchsia-200 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-pink-400" />
              <span>{isRtl ? "الموضوعات والاهتمامات:" : "Interests & Topics:"}</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_INTERESTS.map((int) => {
                const active = selectedInterests.includes(int);
                return (
                  <button
                    key={int}
                    type="button"
                    onClick={() => toggleInterest(int)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold transition ${
                      active
                        ? "bg-pink-500 text-white shadow-xs border border-pink-300"
                        : "glass-dark text-fuchsia-200 border border-fuchsia-400/20 hover:border-pink-400"
                    }`}
                  >
                    {active && <Check className="w-2.5 h-2.5 inline-block me-1" />}
                    {int}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy & Direct Messages Toggle */}
          <div className="space-y-2 pt-2 border-t border-fuchsia-400/20">
            <span className="font-bold text-fuchsia-200 block">
              {isRtl ? "إعدادات الأمان والمراسلة:" : "Privacy & Messages:"}
            </span>

            <div className="p-2.5 rounded-2xl glass-dark border border-fuchsia-400/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-pink-400" />
                <div>
                  <span className="font-bold text-white block text-[11px]">
                    {isRtl ? "السماح بالرسائل الخاصة الفردية" : "Allow Direct Messages"}
                  </span>
                  <span className="text-[10px] text-fuchsia-200/70">
                    {isRtl
                      ? "يمكن للعضوات مراسلتكِ بشكل فردي وخاص"
                      : "Members can message you 1-on-1"}
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={allowDirect}
                onChange={(e) => setAllowDirect(e.target.checked)}
                className="w-4 h-4 accent-pink-500 rounded"
              />
            </div>

            <div className="p-2.5 rounded-2xl glass-dark border border-fuchsia-400/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="font-bold text-white block text-[11px]">
                    {isRtl ? "إشعارات رسائل المجموعات" : "Group Chat Notifications"}
                  </span>
                  <span className="text-[10px] text-fuchsia-200/70">
                    {isRtl
                      ? "تنبيهكِ بالرسائل الجديدة في مجموعاتكِ"
                      : "Notify on new group messages"}
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={groupNotifs}
                onChange={(e) => setGroupNotifs(e.target.checked)}
                className="w-4 h-4 accent-pink-500 rounded"
              />
            </div>
          </div>

          {/* Blocked Users Section */}
          {blockedList.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-fuchsia-400/20">
              <span className="font-bold text-rose-300 flex items-center gap-1.5">
                <UserX className="w-3.5 h-3.5" />
                <span>{isRtl ? "قائمة العضوات المحظورات:" : "Blocked Users:"}</span>
              </span>
              <div className="space-y-1">
                {blockedList.map((b) => (
                  <div
                    key={b.id}
                    className="p-2 rounded-xl bg-slate-900 flex items-center justify-between text-[11px]"
                  >
                    <span className="text-white">{b.blockedUserName}</span>
                    <button
                      type="button"
                      onClick={() => handleUnblock(b.blockedUserId, b.blockedUserName)}
                      className="text-pink-300 hover:text-white text-[10px] font-bold"
                    >
                      {isRtl ? "إلغاء الحظر" : "Unblock"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition"
          >
            {isRtl ? "حفظ التغييرات 🌸" : "Save Settings 🌸"}
          </button>
        </form>
      </div>
    </div>
  );
}
