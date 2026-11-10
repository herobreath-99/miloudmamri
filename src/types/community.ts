export type CommunityCategory =
  | "treatment" // Treatment experiences
  | "emotional" // Emotional support
  | "recovery" // Recovery experiences
  | "self_care" // Daily self-care
  | "qa" // Questions and answers
  | "motivation"; // Motivation and encouragement

export type GroupCategory =
  | "emotional"
  | "journey"
  | "diagnosis"
  | "chemo"
  | "radiation"
  | "recovery"
  | "nutrition"
  | "exercise"
  | "survivors"
  | "qa"
  | "custom";

export type ReactionType = "love" | "hug" | "strength" | "hope";

export type CommunityComment = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorNickname: string;
  useNickname: boolean;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
};

export type CommunityPost = {
  id: string;
  authorId: string;
  authorName: string;
  authorNickname: string;
  useNickname: boolean;
  authorAvatar?: string;
  category: CommunityCategory;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  reactions: Record<ReactionType, number>;
  userReactions?: Record<string, ReactionType>; // userId -> ReactionType
  commentsCount: number;
  comments: CommunityComment[];
  sensitiveContent: boolean;
  sensitiveConsentGiven: boolean;
  hasMedicalDisclaimer: boolean;
  status: "active" | "flagged" | "removed";
  moderationNotes?: string;
  savedBy: string[]; // user IDs
};

export type ReportReason =
  | "unverified_medical_advice"
  | "inappropriate_content"
  | "privacy_exposure"
  | "harassment"
  | "spam"
  | "other";

export type CommunityReport = {
  id: string;
  targetType: "post" | "comment" | "chat_message" | "direct_message";
  targetId: string;
  targetPreview: string;
  authorId: string;
  reporterId: string;
  reporterName: string;
  reason: ReportReason;
  details: string;
  createdAt: string;
  status: "pending" | "resolved" | "dismissed";
  resolutionNotes?: string;
};

export type BlockedUser = {
  id: string;
  blockedUserId: string;
  blockedUserName: string;
  blockedAt: string;
};

// ----------------- Real-Time Chat & Groups Types -----------------

export type CommunityGroup = {
  id: string;
  key: string;
  nameAr: string;
  nameFr: string;
  nameDz: string;
  nameEn: string;
  descriptionAr: string;
  descriptionFr: string;
  descriptionDz: string;
  descriptionEn: string;
  category: GroupCategory;
  icon: string;
  rulesAr: string;
  rulesFr: string;
  rulesEn: string;
  isPrivate: boolean;
  isOfficial: boolean;
  createdBy: string;
  createdAt: string;
  memberIds: string[];
  lastMessageAt?: string;
  lastMessagePreview?: string;
  messageCount: number;
  unreadCount?: number;
};

export type ChatAttachment = {
  type: "image" | "file";
  url: string;
  name: string;
  sizeBytes: number;
};

export type ChatMessage = {
  id: string;
  groupId?: string; // set for group chat
  conversationId?: string; // set for 1-on-1 direct chat
  senderId: string;
  senderName: string;
  senderNickname?: string;
  senderAvatar?: string;
  senderRole?: string; // "patient" | "professional" | "community_moderator" | "platform_admin"
  content: string;
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  };
  attachment?: ChatAttachment;
  reactions: Record<string, string[]>; // emoji -> [userId1, userId2...]
  mentions?: string[]; // @mentions
  isEdited?: boolean;
  isDeleted?: boolean;
  deletedBy?: string;
  createdAt: string;
  readBy: string[]; // userIds who saw this message
};

export type DirectConversation = {
  id: string;
  participantIds: [string, string];
  participantDetails: Record<
    string,
    {
      name: string;
      nickname?: string;
      avatar?: string;
      role?: string;
    }
  >;
  lastMessageAt: string;
  lastMessagePreview: string;
  unreadCount: Record<string, number>;
  createdAt: string;
  isBlocked?: boolean;
  blockedBy?: string;
};

export type CommunityUserProfile = {
  userId: string;
  displayName: string;
  nickname: string;
  avatarUrl?: string;
  bio?: string;
  interests: string[];
  joinedGroupIds: string[];
  allowDirectMessages: boolean;
  notificationSettings: {
    groupMessages: boolean;
    directMessages: boolean;
    mentions: boolean;
    postReplies: boolean;
  };
  createdAt: string;
};

export type CommunityAnnouncement = {
  id: string;
  titleAr: string;
  titleFr: string;
  contentAr: string;
  contentFr: string;
  authorName: string;
  authorRole: string;
  isPinned: boolean;
  createdAt: string;
};
