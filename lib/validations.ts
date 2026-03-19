import { z } from 'zod';

const periodEnum = z.enum(['daily', 'weekly', 'monthly', 'all_time']);
const platformEnum = z.enum(['stake_us', 'stake_com', 'both']);

export const leaderboardEntrySchema = z.object({
  player_name: z.string().min(1, 'Player name is required').max(200),
  rank: z.number().int().min(1),
  total_wagered: z.number().min(0),
  biggest_win: z.number().min(0),
  current_streak: z.number().int().min(0),
  platform: platformEnum,
  period: periodEnum,
  avatar_url: z.string().url().optional().or(z.literal('')),
  month_key: z.string().regex(/^\d{4}-\d{2}$/, 'Must be YYYY-MM format').optional().or(z.literal('')),
});

export const leaderboardUpdateSchema = leaderboardEntrySchema.partial().extend({
  id: z.string().uuid(),
});

export const siteSettingsSchema = z.object({
  welcome_code: z.string().max(100).nullable(),
  rakeback_pct: z.string().max(20).nullable(),
  stake_us_link: z.string().url().max(500).nullable().or(z.literal('')),
  stake_com_link: z.string().url().max(500).nullable().or(z.literal('')),
  prize_pool: z.string().max(50).nullable(),
  prizes: z.string().nullable().optional(),
  hero_title: z.string().max(200).nullable(),
  hero_subtitle: z.string().max(200).nullable(),
  section_leaderboard_title: z.string().max(100).nullable(),
  section_bonuses_title: z.string().max(100).nullable(),
  section_clips_title: z.string().max(100).nullable(),
  section_community_heading: z.string().max(200).nullable(),
  section_community_subtext: z.string().max(500).nullable(),
  community_stats: z.string().nullable().optional(), // JSON string for form submit
  live_now_url: z.string().url().max(500).nullable().or(z.literal('')),
});

export const bonusCardSchema = z.object({
  headline: z.string().min(1, 'Headline is required').max(200),
  subtitle: z.string().max(100).optional().or(z.literal('')),
  description: z.string().max(1000).optional().or(z.literal('')),
  image_url: z.string().url().optional().or(z.literal('')),
  cta_text: z.string().min(1, 'Button text is required').max(100),
  cta_link: z.string().url('Must be a valid URL').max(500),
  promo_code: z.string().max(50).optional().or(z.literal('')),
  badge_text: z.string().max(50).optional().or(z.literal('')),
  sort_order: z.number().int().min(0).default(0),
  published: z.boolean().default(false),
  show_on_homepage: z.boolean().default(false),
});

export const bonusCardUpdateSchema = bonusCardSchema.partial().extend({
  id: z.string().uuid(),
});

export const videoClipSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  youtube_url: z.string().url('Must be a valid URL').max(500),
  sort_order: z.number().int().min(0).default(0),
  published: z.boolean().default(false),
});

export const videoClipUpdateSchema = videoClipSchema.partial().extend({
  id: z.string().uuid(),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required').max(50),
  label: z.string().min(1, 'Label is required').max(100),
  url: z.string().url('Must be a valid URL').max(500),
  icon: z.string().min(1, 'Icon is required').max(100),
  sort_order: z.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export const socialLinkUpdateSchema = socialLinkSchema.partial().extend({
  id: z.string().uuid(),
});

export const cmsPageSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string(),
  published: z.boolean().default(true),
});

export const cmsPageUpdateSchema = cmsPageSchema.partial().extend({
  id: z.string().uuid(),
});

export type LeaderboardEntryInput = z.infer<typeof leaderboardEntrySchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
export type BonusCardInput = z.infer<typeof bonusCardSchema>;
export type VideoClipInput = z.infer<typeof videoClipSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
export type CmsPageInput = z.infer<typeof cmsPageSchema>;
