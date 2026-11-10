import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MessageSquare, MessagesSquare, Plus, ShieldAlert, HeartHandshake } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { CommunityHeaderStats } from "@/components/pinkcare/community/CommunityHeaderStats";
import { CommunityGroupsList } from "@/components/pinkcare/community/CommunityGroupsList";
import { GroupChatRoom } from "@/components/pinkcare/community/GroupChatRoom";
import { DirectMessagesView } from "@/components/pinkcare/community/DirectMessagesView";
import { CommunityFeed } from "@/components/pinkcare/community/CommunityFeed";
import { CreateGroupModal } from "@/components/pinkcare/community/CreateGroupModal";
import { CommunityProfileModal } from "@/components/pinkcare/community/CommunityProfileModal";
import { AdminPortalModal } from "@/components/pinkcare/admin/AdminPortalModal";
import { ReportContentModal } from "@/components/pinkcare/community/ReportContentModal";
import {
  getCommunityGroups,
  getCommunityUserProfile,
  getDirectConversations,
} from "@/lib/communityChatStorage";
import type { CommunityGroup } from "@/types/community";

export const Route = createFileRoute("/_app/community")({
  component: CommunityPage,
});

type TabType = "groups" | "direct" | "feed";

function CommunityPage() {
  const { profile } = useAuth();
  const { lang } = useI18n();

  const currentUserId = profile?.id || "user-current";
  const currentUserName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : "مستفيدة PinkCare";
  const currentUserRole = profile?.role || "patient";

  const [activeTab, setActiveTab] = useState<TabType>("groups");
  const [selectedGroup, setSelectedGroup] = useState<CommunityGroup | null>(null);

  // Modals
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAdminPortal, setShowAdminPortal] = useState(false);

  // Reporting
  const [reportingItem, setReportingItem] = useState<{
    targetType: "post" | "comment" | "chat_message" | "direct_message";
    targetId: string;
    targetPreview: string;
    authorId: string;
  } | null>(null);

  // Community user profile
  const [userCommunityProfile, setUserCommunityProfile] = useState(() =>
    getCommunityUserProfile(currentUserId, currentUserName),
  );

  // Direct unread badge
  const [directUnreadCount, setDirectUnreadCount] = useState(0);

  useEffect(() => {
    const updateStats = () => {
      const convos = getDirectConversations(currentUserId);
      const totalUnread = convos.reduce((sum, c) => sum + (c.unreadCount[currentUserId] || 0), 0);
      setDirectUnreadCount(totalUnread);
      setUserCommunityProfile(getCommunityUserProfile(currentUserId, currentUserName));
    };

    updateStats();
    window.addEventListener("pinkcare:community-chat-updated", updateStats);
    window.addEventListener("storage", updateStats);
    return () => {
      window.removeEventListener("pinkcare:community-chat-updated", updateStats);
      window.removeEventListener("storage", updateStats);
    };
  }, [currentUserId, currentUserName]);

  // Keep selected group updated if messages come in
  useEffect(() => {
    if (!selectedGroup) return;
    const handleUpdate = () => {
      const allGroups = getCommunityGroups();
      const updated = allGroups.find((g) => g.id === selectedGroup.id);
      if (updated) setSelectedGroup(updated);
    };
    window.addEventListener("pinkcare:community-chat-updated", handleUpdate);
    return () => window.removeEventListener("pinkcare:community-chat-updated", handleUpdate);
  }, [selectedGroup]);

  return (
    <div className="space-y-4 pb-12 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* 1. Header & Community Statistics */}
      <CommunityHeaderStats lang={lang} />

      {/* 2. Top Action & Navigation Controls */}
      <div className="bg-card/70 backdrop-blur-md border border-border/60 rounded-3xl p-3 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-2xl w-full md:w-auto overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              setActiveTab("groups");
              setSelectedGroup(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "groups"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <MessagesSquare className="w-4 h-4" />
            <span>
              {lang === "ar"
                ? "الدردشات والمجموعات"
                : lang === "dz"
                  ? "المجموعات والشات"
                  : "Groupes & Tchat"}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("direct");
              setSelectedGroup(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap relative ${
              activeTab === "direct"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>
              {lang === "ar"
                ? "الرسائل الخاصة"
                : lang === "dz"
                  ? "المساجات الخاصة"
                  : "Messages privés"}
            </span>
            {directUnreadCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-pink-500 text-white font-black rounded-full ring-2 ring-background animate-pulse">
                {directUnreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("feed");
              setSelectedGroup(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "feed"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>
              {lang === "ar"
                ? "حائط التجارب والمنشورات"
                : lang === "dz"
                  ? "تجارب المحاربات"
                  : "Mur d'expériences"}
            </span>
          </button>
        </div>

        {/* Action Buttons: Community Profile, Create Group, Moderation */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Create Group Button */}
          <button
            onClick={() => setShowCreateGroup(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary/15 text-primary hover:bg-primary/25 border border-primary/25 transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>
              {lang === "ar" ? "مجموعة جديدة" : lang === "dz" ? "قروب جديد" : "Nouveau groupe"}
            </span>
          </button>

          {/* Community Profile Button */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground border border-border/50 transition"
          >
            <div className="w-5 h-5 rounded-full bg-linear-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
              {userCommunityProfile.avatarUrl ? (
                <img
                  src={userCommunityProfile.avatarUrl}
                  alt="avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                userCommunityProfile.nickname.charAt(0) || "🌸"
              )}
            </div>
            <span className="truncate max-w-[100px]">{userCommunityProfile.nickname}</span>
          </button>

          {/* Medical Moderation Portal for Doctors & Admins */}
          <button
            onClick={() => setShowAdminPortal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition"
            title={lang === "ar" ? "لوحة الإشراف الطبي ومراجعة البلاغات" : "Moderation Portal"}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {lang === "ar" ? "الإشراف الطبي" : "Modération"}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Main Content Views */}
      {activeTab === "groups" && (
        <div>
          {selectedGroup ? (
            <GroupChatRoom
              group={selectedGroup}
              currentUserId={currentUserId}
              currentUserName={userCommunityProfile.nickname || currentUserName}
              currentUserRole={currentUserRole}
              onBack={() => setSelectedGroup(null)}
              onReportMessage={(msgId, preview, authorId) => {
                setReportingItem({
                  targetType: "chat_message",
                  targetId: msgId,
                  targetPreview: preview,
                  authorId,
                });
              }}
              lang={lang}
            />
          ) : (
            <CommunityGroupsList
              currentUserId={currentUserId}
              onSelectGroup={(group) => setSelectedGroup(group)}
              onCreateGroup={() => setShowCreateGroup(true)}
              lang={lang}
            />
          )}
        </div>
      )}

      {activeTab === "direct" && (
        <DirectMessagesView
          currentUserId={currentUserId}
          currentUserName={userCommunityProfile.nickname || currentUserName}
          currentUserRole={currentUserRole}
          onReportUser={(userId, userName) => {
            setReportingItem({
              targetType: "direct_message",
              targetId: userId,
              targetPreview: `Direct conversation with ${userName}`,
              authorId: userId,
            });
          }}
          lang={lang}
        />
      )}

      {activeTab === "feed" && (
        <CommunityFeed
          currentUserId={currentUserId}
          currentUserName={userCommunityProfile.nickname || currentUserName}
          lang={lang === "fr" ? "en" : "ar"}
        />
      )}

      {/* 4. Modals */}
      {showCreateGroup && (
        <CreateGroupModal
          currentUserId={currentUserId}
          onClose={() => setShowCreateGroup(false)}
          onCreated={(group) => {
            setShowCreateGroup(false);
            setSelectedGroup(group);
            setActiveTab("groups");
          }}
          lang={lang}
        />
      )}

      {showProfileModal && (
        <CommunityProfileModal
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          onClose={() => setShowProfileModal(false)}
          onUpdated={(profile) => setUserCommunityProfile(profile)}
          lang={lang}
        />
      )}

      {showAdminPortal && (
        <AdminPortalModal
          onClose={() => setShowAdminPortal(false)}
          lang={lang === "fr" ? "en" : "ar"}
        />
      )}

      {reportingItem && (
        <ReportContentModal
          targetType={reportingItem.targetType}
          targetId={reportingItem.targetId}
          targetPreview={reportingItem.targetPreview}
          authorId={reportingItem.authorId}
          reporterId={currentUserId}
          reporterName={userCommunityProfile.nickname || currentUserName}
          onClose={() => setReportingItem(null)}
          lang={lang === "fr" ? "en" : "ar"}
        />
      )}
    </div>
  );
}
