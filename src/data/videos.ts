export type VideoCategory = "awareness" | "prevention" | "selfcare" | "tips";

export interface VideoItem {
  id: string;
  youtubeId: string;
  isShort: boolean;
  title_ar: string;
  title_en: string;
  category: VideoCategory;
  duration: string;
  views: string;
}

export const VIDEO_CATEGORIES: { key: VideoCategory; ar: string; en: string }[] = [
  { key: "awareness", ar: "التوعية", en: "Awareness" },
  { key: "prevention", ar: "الوقاية", en: "Prevention" },
  { key: "selfcare", ar: "العناية الذاتية", en: "Self-care" },
  { key: "tips", ar: "نصائح قصيرة", en: "Quick tips" },
];

export const VIDEOS: VideoItem[] = [
  {
    id: "v1",
    youtubeId: "a8y4KDyAptQ",
    isShort: false,
    title_ar: "التوعية والوقاية من سرطان الثدي",
    title_en: "Breast cancer awareness & prevention",
    category: "awareness",
    duration: "8:24",
    views: "12K",
  },
  {
    id: "v2",
    youtubeId: "Wk-4ue5tPv8",
    isShort: false,
    title_ar: "نصائح صحية للوقاية من سرطان الثدي",
    title_en: "Health tips to prevent breast cancer",
    category: "prevention",
    duration: "6:10",
    views: "9.5K",
  },
  {
    id: "v3",
    youtubeId: "CYyeZhuJ_1Y",
    isShort: true,
    title_ar: "معلومة صحية قصيرة",
    title_en: "Quick health fact",
    category: "tips",
    duration: "0:45",
    views: "5.2K",
  },
  {
    id: "v4",
    youtubeId: "c8W__jLlmb8",
    isShort: true,
    title_ar: "نصيحة توعوية",
    title_en: "Awareness tip",
    category: "tips",
    duration: "0:38",
    views: "4.1K",
  },
  {
    id: "v5",
    youtubeId: "-ERNhM5sma4",
    isShort: true,
    title_ar: "إرشادات صحية",
    title_en: "Health guidance",
    category: "tips",
    duration: "0:52",
    views: "6.8K",
  },
  {
    id: "v6",
    youtubeId: "EpF52fRrDRM",
    isShort: true,
    title_ar: "العناية والوقاية",
    title_en: "Care & prevention",
    category: "selfcare",
    duration: "0:48",
    views: "3.9K",
  },
  {
    id: "v7",
    youtubeId: "N2mB68976CY",
    isShort: true,
    title_ar: "رسائل توعوية",
    title_en: "Awareness messages",
    category: "awareness",
    duration: "0:42",
    views: "7.3K",
  },
  {
    id: "v8",
    youtubeId: "yCnG-VjsKXY",
    isShort: false,
    title_ar: "التثقيف الصحي حول سرطان الثدي",
    title_en: "Health education on breast cancer",
    category: "awareness",
    duration: "9:15",
    views: "15K",
  },
];

export function getDailyVideo(date = new Date()): VideoItem {
  const i = Math.floor(date.getTime() / 86400000) % VIDEOS.length;
  return VIDEOS[i];
}

export function getRecommendedVideos(excludeId?: string): VideoItem[] {
  return VIDEOS.filter((v) => v.id !== excludeId).slice(0, 4);
}

export function getThumbnail(v: VideoItem): string {
  return `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`;
}

export function getEmbedUrl(v: VideoItem): string {
  return `https://www.youtube.com/embed/${v.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
}
