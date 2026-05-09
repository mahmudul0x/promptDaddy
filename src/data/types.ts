export interface Prompt {
  id: string;
  title: string;
  content: string;
  description: string;
  category: string;
  tags: string[] | null;
  is_premium: boolean;
  is_free_accessible: boolean;
  is_featured: boolean;
  is_recommended: boolean;
  search_keywords: string | null;
  type: string;
  likes_count: number;
  views_count: number;
  thumbnail_url: string;
  created_at: string;
  prompt_items: { title: string; content: string }[] | null;
}

export interface GalleryPrompt {
  prompt: string;
  generated_image_url: string;
  generation_status: string;
  error?: string | null;
}

export interface ImagePrompt {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt_text: string | null;
  gallery_prompts: GalleryPrompt[] | null;
  content_mode: string | null;
  thumbnail_url: string;
  is_premium: boolean;
  is_free_accessible: boolean;
  is_featured: boolean;
  is_recommended: boolean;
  search_keywords: string | null;
  likes_count: number;
  views_count: number;
  created_at: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string | null;
  thumbnail_url: string;
  category: string;
  categories: string[];
  html_file_url: string | null;
  html_render_mode: string | null;
  is_premium: boolean;
  is_free_accessible: boolean;
  is_featured: boolean;
  is_recommended: boolean;
  search_keywords: string | null;
  duration: string | null;
  created_at: string;
}

export interface Guide {
  id: string;
  title: string;
  content: string;
  description: string;
  category: string;
  categories: string[];
  thumbnail_url: string;
  is_premium: boolean;
  is_free_accessible: boolean;
  is_recommended: boolean;
  rich_content: {
    iframeUrl?: string;
    htmlContent?: string;
    promptItems?: unknown[];
  } | null;
  video_url: string | null;
  created_at: string;
}

export interface TutorialResourceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  categories: string[];
  thumbnail_url: string;
  resource_type: 'blog' | 'research' | 'news';
  url: string;
  publisher: string;
  is_premium: boolean;
  is_free_accessible: boolean;
  is_recommended: boolean;
  created_at: string;
}

export interface AiStarterKitCategory {
  title: string;
  image_url: string;
  prompts: {
    title: string;
    tags: string[];
    image_url: string;
    prompt: string;
  }[];
}

export interface AiStarterKitSkill {
  name: string;
  slug: string;
  description: string;
  tags: string[];
  image_url?: string;
}

export interface AiStarterKitMeta {
  title: string;
  copyright: string;
  total_sections: number;
  total_prompts: number;
  total_skills: number;
  promo: AiStarterKitPromo;
}

export interface AiStarterKitSection {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

export interface AiStarterKitPrompt {
  title: string;
  category: string;
  section: string;
  tags: string[];
  prompt: string;
  image_url?: string;
}

export interface AiStarterKitSkill {
  name: string;
  slug: string;
  description: string;
  tags: string[];
  image_url?: string;
}

export interface AiStarterKitPromo {
  title: string;
  body: string;
  features: string[];
  cta_text: string;
  cta_url: string;
}

export interface AiStarterKitData {
  sections: AiStarterKitSection[];
  prompts: AiStarterKitPrompt[];
  claude_skills: AiStarterKitSkill[];
  guides?: unknown[];
  promo: AiStarterKitPromo;
  footer: string;
}

export interface AiStarterKitMeta {
  title: string;
  copyright: string;
  total_counts: {
    prompts: number;
    skills: number;
  };
  promo: AiStarterKitPromo;
}

export interface AiStarterKitData {
  meta: AiStarterKitMeta;
  sections: AiStarterKitSection[];
  guides?: unknown[];
  footer: string;
}

export interface CustomGpt {
  id: string;
  title: string;
  description: string;
  instructions: string;
  category: string;
  categories: string[];
  thumbnail_url: string;
  is_premium: boolean;
  is_free_accessible: boolean;
  is_featured: boolean;
  is_recommended: boolean;
  search_keywords: string | null;
  prompt_items: { title: string; content: string }[] | null;
  created_at: string;
}

export interface AutomationTemplate {
  id: string;
  title: string;
  description: string;
  template_content: {
    overview: string;
    downloadUrl: string | null;
  };
  category: string;
  categories: string[];
  platform: string;
  thumbnail_url: string;
  is_premium: boolean;
  is_free_accessible: boolean;
  is_featured: boolean;
  video_url: string | null;
  video_text: string | null;
  created_at: string;
}

export interface ClaudeSkill {
  id: string;
  title: string;
  description: string;
  instructions: string;
  category: string;
  categories: string[];
  thumbnail_url: string;
  skill_url: string;
  is_premium: boolean;
  is_free_accessible: boolean;
  is_featured: boolean;
  is_recommended: boolean;
  search_keywords: string | null;
  created_at: string;
}

export type ContentType =
  | 'prompt'
  | 'image_prompt'
  | 'video'
  | 'guide'
  | 'tutorial_resource'
  | 'custom_gpt'
  | 'automation'
  | 'claude_skill';

export interface AiModelRecommendation {
  id: string;
  task_name: string;
  model_name: string;
  provider: string;
  description: string;
  performance_score: number;
  cost_rating: 'Low' | 'Medium' | 'High';
  speed_rating: 'Slow' | 'Medium' | 'Fast';
  is_featured: boolean;
  model_url: string;
  sort_order: number;
  created_at: string;
}

export interface ClaudeSkillBundleItem {
  id: string;
  name: string;
  category: string;
  description: string;
  author: string;
  version: string;
  allowed_tools: string[];
  file_size_kb: number;
  md_content_b64: string;
}

export interface ClaudeSkillBundleMeta {
  title: string;
  version: string;
  author: string;
  total_skills: number;
  total_categories: number;
  categories: string[];
  category_counts: Record<string, number>;
}

export interface ClaudeSkillBundle {
  meta: ClaudeSkillBundleMeta;
  skills: ClaudeSkillBundleItem[];
}

export interface FavoriteItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  category: string;
  savedAt: string;
}

export interface SearchResult {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  category: string;
  is_premium: boolean;
}

// ── New AI-generation prompt tables ──────────────────────────────────────────

export interface GrokImaginePrompt {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string | null;
  sourceLink: string | null;
  sourcePublishedAt: string | null;
  author: { name: string; link: string } | null;
  sourceMedia: string[] | null;
  sourceReferenceImages: string[] | null;
  sourceVideos: { url: string; thumbnail: string }[] | null;
}

export interface SeedancePrompt {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string | null;
  sourceLink: string | null;
  sourcePublishedAt: string | null;
  author: { name: string; link: string } | null;
  sourceMedia: string[] | null;
  sourceReferenceImages: string[] | null;
  sourceVideos: { url: string; thumbnail: string }[] | null;
}

export interface NanoBananaPrompt {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string | null;
  sourceLink: string | null;
  sourcePublishedAt: string | null;
  author: { name: string; link: string } | null;
  sourceMedia: string[] | null;
}

export interface GptImagePrompt {
  id: string;
  rank: number | null;
  model: string | null;
  categories: string[] | null;
  prompt: string | null;
  author: string | null;
  likes: number | null;
  views: number | null;
  rating: number | null;
  score: number | null;
  date: string | null;
  source_url: string | null;
  image_url: string | null;
  created_at: string | null;
}
