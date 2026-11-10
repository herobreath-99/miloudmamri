import { INITIAL_EDUCATIONAL_ARTICLES, EDUCATION_CATEGORIES } from "@/data/educationalArticles";
import type { EducationalArticle, EducationalVideo, EducationCategoryId } from "@/types/education";

const ARTICLES_STORAGE_KEY = "pc_educational_articles_v2";
const VIDEOS_STORAGE_KEY = "pc_educational_videos_v2";
const FAV_ARTICLES_KEY = "pc_fav_articles";
const FAV_VIDEOS_KEY = "pc_fav_videos";
const RECENT_VIDEOS_KEY = "pc_recent_videos_v2";
const ADMIN_MODE_KEY = "pc_education_admin_mode";

// 8 User-Provided YouTube links with verified IDs and attributes
export const SEED_VIDEOS: EducationalVideo[] = [
  {
    id: "yt-1",
    youtubeId: "a8y4KDyAptQ",
    originalUrl: "https://www.youtube.com/watch?v=a8y4KDyAptQ",
    title_ar: "التوعية والوقاية من سرطان الثدي والفحص الدوري",
    title_en: "Breast Cancer Awareness, Prevention & Screening",
    description_ar: "شرح شامل ومبسط لأهمية الكشف المبكر والوقاية والفحص الذاتي الدوري للثدي.",
    description_en: "Comprehensive guide on early detection, screening, and breast health.",
    categoryId: "understanding",
    isShort: false,
    duration: "8:24",
    views: "12.4K",
    channelTitle: "PinkCare Education",
  },
  {
    id: "yt-2",
    youtubeId: "Wk-4ue5tPv8",
    originalUrl: "https://www.youtube.com/watch?v=Wk-4ue5tPv8",
    title_ar: "نصائح وإرشادات وقائية لتعزيز صحة الثدي ونمط الحياة",
    title_en: "Protective Guidelines & Lifestyle Tips for Breast Health",
    description_ar: "إرشادات عملية حول العادات الغذائية والنشاط البدني ودورها في تعزيز العافية.",
    description_en: "Practical lifestyle advice and nutrition habits supporting recovery.",
    categoryId: "nutrition",
    isShort: false,
    duration: "6:10",
    views: "9.8K",
    channelTitle: "Health & Care",
  },
  {
    id: "yt-3",
    youtubeId: "CYyeZhuJ_1Y",
    originalUrl: "https://www.youtube.com/shorts/CYyeZhuJ_1Y",
    title_ar: "معلومة صحية مركزة: أهمية الفحص الدوري",
    title_en: "Quick Fact: Importance of Regular Screening",
    description_ar: "رسالة توعوية سريعة تركز على أهمية الاطمئنان المبكر دون تأخير.",
    description_en: "Short awareness message highlighting regular checkups.",
    categoryId: "followup",
    isShort: true,
    duration: "0:45",
    views: "5.2K",
    channelTitle: "PinkCare Shorts",
  },
  {
    id: "yt-4",
    youtubeId: "c8W__jLlmb8",
    originalUrl: "https://www.youtube.com/shorts/c8W__jLlmb8",
    title_ar: "نصيحة توعوية: العناية اليومية والراحة الجسدية",
    title_en: "Awareness Tip: Daily Self-care & Physical Comfort",
    description_ar: "خطوة سريعة للاهتمام بالنفس والراحة اليومية للمتعافيات.",
    description_en: "Practical quick tip on daily self-care and posture.",
    categoryId: "rehabilitation",
    isShort: true,
    duration: "0:38",
    views: "4.1K",
    channelTitle: "PinkCare Shorts",
  },
  {
    id: "yt-5",
    youtubeId: "-ERNhM5sma4",
    originalUrl: "https://www.youtube.com/shorts/-ERNhM5sma4",
    title_ar: "إرشادات هامة حول الوقاية من تورم الذراع",
    title_en: "Key Advice on Lymphedema Prevention",
    description_ar: "تذكير سريع بالاحتياطات اليومية لحماية الذراع المعرضة للخطر.",
    description_en: "Quick reminder on arm protection and gentle movement.",
    categoryId: "lymphedema",
    isShort: true,
    duration: "0:52",
    views: "6.8K",
    channelTitle: "PinkCare Shorts",
  },
  {
    id: "yt-6",
    youtubeId: "EpF52fRrDRM",
    originalUrl: "https://www.youtube.com/shorts/EpF52fRrDRM",
    title_ar: "العناية بالبشرة والترطيب المستمر أثناء مرحلة التعافي",
    title_en: "Skin Care & Hydration During Healing",
    description_ar: "نصائح مركزة للحفاظ على رطوبة الجلد وتجنب المواد العطرية المسببة للتهيج.",
    description_en: "Short guide on fragrance-free moisturizers and skin hygiene.",
    categoryId: "skin_care",
    isShort: true,
    duration: "0:48",
    views: "3.9K",
    channelTitle: "PinkCare Shorts",
  },
  {
    id: "yt-7",
    youtubeId: "N2mB68976CY",
    originalUrl: "https://www.youtube.com/shorts/N2mB68976CY",
    title_ar: "رسالة أمل ودعم نفسي: أنتِ لستِ وحدكِ في هذه الرحلة",
    title_en: "Hope & Emotional Strength: You Are Not Alone",
    description_ar: "كلمات تشجيعية ودعم معنوي للمرأة في مسار تعافيها اليومي.",
    description_en: "Empowering message fostering peace of mind and resilience.",
    categoryId: "emotional",
    isShort: true,
    duration: "0:42",
    views: "7.3K",
    channelTitle: "PinkCare Shorts",
  },
  {
    id: "yt-8",
    youtubeId: "yCnG-VjsKXY",
    originalUrl: "https://www.youtube.com/watch?v=yCnG-VjsKXY",
    title_ar: "التثقيف الطبي المتكامل: مراحل العلاج وما بعد الجراحة",
    title_en: "Full Health Education: Treatment Phases & Post-Surgery",
    description_ar: "محاضرة تثقيفية موثوقة تستعرض خطوات الاستشفاء والدعم السريري المتواصل.",
    description_en: "Clinical educational session reviewing recovery milestones and support.",
    categoryId: "journey",
    isShort: false,
    duration: "9:15",
    views: "15.1K",
    channelTitle: "Medical Academy",
  },
];

// Helper to extract YouTube video ID from various link formats
export function extractYouTubeId(urlOrId: string): string | null {
  const clean = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }
  const match = clean.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/,
  );
  return match ? match[1] : null;
}

export function getYouTubeThumbnail(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

export function getYouTubeEmbedUrl(youtubeId: string, autoplay = true): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
}

// Client-side YouTube oEmbed fetcher with cache
const oEmbedCache: Record<string, { title?: string; author_name?: string }> = {};

export async function fetchYouTubeOEmbed(
  youtubeId: string,
): Promise<{ title?: string; author_name?: string } | null> {
  if (oEmbedCache[youtubeId]) return oEmbedCache[youtubeId];
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    oEmbedCache[youtubeId] = { title: data.title, author_name: data.author_name };
    return oEmbedCache[youtubeId];
  } catch {
    return null;
  }
}

// ---------------- Articles Storage ----------------
export function getStoredArticles(): EducationalArticle[] {
  if (typeof window === "undefined") return INITIAL_EDUCATIONAL_ARTICLES;
  try {
    const raw = localStorage.getItem(ARTICLES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(INITIAL_EDUCATIONAL_ARTICLES));
      return INITIAL_EDUCATIONAL_ARTICLES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_EDUCATIONAL_ARTICLES;
  } catch {
    return INITIAL_EDUCATIONAL_ARTICLES;
  }
}

export function saveStoredArticles(articles: EducationalArticle[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
  window.dispatchEvent(new CustomEvent("pc:articles-changed"));
}

export function upsertArticle(article: EducationalArticle): void {
  const current = getStoredArticles();
  const index = current.findIndex((a) => a.id === article.id);
  if (index >= 0) {
    current[index] = { ...article, lastUpdated: new Date().toISOString() };
  } else {
    current.unshift({ ...article, isCustom: true, publishedDate: new Date().toISOString() });
  }
  saveStoredArticles(current);
}

export function deleteArticle(articleId: string): void {
  const current = getStoredArticles();
  const next = current.filter((a) => a.id !== articleId);
  saveStoredArticles(next);
}

export function resetArticlesToDefault(): void {
  saveStoredArticles(INITIAL_EDUCATIONAL_ARTICLES);
}

// ---------------- Videos Storage ----------------
export function getStoredVideos(): EducationalVideo[] {
  if (typeof window === "undefined") return SEED_VIDEOS;
  try {
    const raw = localStorage.getItem(VIDEOS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(SEED_VIDEOS));
      return SEED_VIDEOS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_VIDEOS;
  } catch {
    return SEED_VIDEOS;
  }
}

export function saveStoredVideos(videos: EducationalVideo[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(videos));
  window.dispatchEvent(new CustomEvent("pc:videos-changed"));
}

export function upsertVideo(video: EducationalVideo): void {
  const current = getStoredVideos();
  const index = current.findIndex((v) => v.id === video.id || v.youtubeId === video.youtubeId);
  if (index >= 0) {
    current[index] = { ...current[index], ...video };
  } else {
    current.unshift({ ...video, isCustom: true });
  }
  saveStoredVideos(current);
}

export function deleteVideo(videoId: string): void {
  const current = getStoredVideos();
  const next = current.filter((v) => v.id !== videoId && v.youtubeId !== videoId);
  saveStoredVideos(next);
}

export function resetVideosToDefault(): void {
  saveStoredVideos(SEED_VIDEOS);
}

// ---------------- Favorites & History ----------------
export function getFavoriteArticleIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAV_ARTICLES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleFavoriteArticle(articleId: string): boolean {
  if (typeof window === "undefined") return false;
  const current = getFavoriteArticleIds();
  const exists = current.includes(articleId);
  const next = exists ? current.filter((id) => id !== articleId) : [...current, articleId];
  localStorage.setItem(FAV_ARTICLES_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("pc:fav-articles-changed"));
  return !exists;
}

export function getFavoriteVideoIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAV_VIDEOS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleFavoriteVideo(videoId: string): boolean {
  if (typeof window === "undefined") return false;
  const current = getFavoriteVideoIds();
  const exists = current.includes(videoId);
  const next = exists ? current.filter((id) => id !== videoId) : [...current, videoId];
  localStorage.setItem(FAV_VIDEOS_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("pc:fav-videos-changed"));
  return !exists;
}

export interface RecentVideoEntry {
  videoId: string;
  watchedAt: number;
}

export function getRecentVideos(): RecentVideoEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_VIDEOS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function recordRecentVideo(videoId: string): void {
  if (typeof window === "undefined") return;
  const current = getRecentVideos().filter((e) => e.videoId !== videoId);
  current.unshift({ videoId, watchedAt: Date.now() });
  localStorage.setItem(RECENT_VIDEOS_KEY, JSON.stringify(current.slice(0, 10)));
}

// ---------------- Admin Mode ----------------
export function isEducationAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_MODE_KEY) === "true";
}

export function setEducationAdmin(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_MODE_KEY, enabled ? "true" : "false");
  window.dispatchEvent(new CustomEvent("pc:admin-mode-changed"));
}
