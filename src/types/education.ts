export type EducationCategoryId =
  | "understanding"
  | "journey"
  | "surgery_recovery"
  | "rehabilitation"
  | "lymphedema"
  | "skin_care"
  | "nutrition"
  | "emotional"
  | "sleep_fatigue"
  | "followup";

export interface EducationCategory {
  id: EducationCategoryId;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  iconName: string;
  badge_ar: string;
  badge_en: string;
}

export interface TrustedReference {
  title: string;
  organization: string;
  url?: string;
}

export interface EducationalArticle {
  id: string;
  categoryId: EducationCategoryId;
  title_ar: string;
  title_en: string;
  summary_ar: string;
  summary_en: string;
  detailedContent_ar: string;
  detailedContent_en: string;
  practicalRecommendations_ar: string[];
  practicalRecommendations_en: string[];
  precautions_ar: string[];
  precautions_en: string[];
  whenToContactDoctor_ar: string[];
  whenToContactDoctor_en: string[];
  references: TrustedReference[];
  readingTimeMinutes: number;
  publishedDate?: string;
  lastUpdated?: string;
  isCustom?: boolean;
}

export interface EducationalVideo {
  id: string;
  youtubeId: string;
  originalUrl: string;
  title_ar: string;
  title_en: string;
  description_ar?: string;
  description_en?: string;
  categoryId: EducationCategoryId | "general";
  isShort: boolean;
  duration: string;
  views?: string;
  channelTitle?: string;
  thumbnailUrl?: string;
  isCustom?: boolean;
}
