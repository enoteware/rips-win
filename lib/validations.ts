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
});

export const leaderboardUpdateSchema = leaderboardEntrySchema.partial().extend({
  id: z.string().uuid(),
});

export const siteSettingsSchema = z.object({
  welcome_code: z.string().max(100).nullable(),
  rakeback_pct: z.string().max(20).nullable(),
  stake_us_link: z.string().url().max(500).nullable().or(z.literal('')),
  stake_com_link: z.string().url().max(500).nullable().or(z.literal('')),
});

export type LeaderboardEntryInput = z.infer<typeof leaderboardEntrySchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
