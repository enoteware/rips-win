import { getSiteSettings } from '@/lib/site-settings';
import { SiteSettingsForm } from './SiteSettingsForm';

export default async function AdminSitePage() {
  let settings: Awaited<ReturnType<typeof getSiteSettings>> = null;
  try {
    settings = await getSiteSettings();
  } catch {
    settings = null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black uppercase tracking-tighter text-secondary md:text-3xl">
          Site content
        </h1>
        <div className="mt-2 h-2 w-24 border-2 border-border bg-logo-gradient shadow-hard" aria-hidden />
      </div>
      {settings === null && (
        <p className="text-sm text-destructive font-mono" role="alert">
          Error
        </p>
      )}
      <p className="text-sm text-muted-foreground">
        Edit the welcome code, rakeback, and CTA links shown on the homepage.
      </p>
      <SiteSettingsForm
        initial={{
          welcome_code: settings?.welcome_code ?? '',
          rakeback_pct: settings?.rakeback_pct ?? '',
          stake_us_link: settings?.stake_us_link ?? '',
          stake_com_link: settings?.stake_com_link ?? '',
          prize_pool: settings?.prize_pool ?? '',
          prizes: settings?.prizes ?? null,
          hero_title: settings?.hero_title ?? '',
          hero_subtitle: settings?.hero_subtitle ?? '',
          section_leaderboard_title: settings?.section_leaderboard_title ?? '',
          section_bonuses_title: settings?.section_bonuses_title ?? '',
          section_clips_title: settings?.section_clips_title ?? '',
          section_community_heading: settings?.section_community_heading ?? '',
          section_community_subtext: settings?.section_community_subtext ?? '',
          community_stats: settings?.community_stats != null ? JSON.stringify(settings.community_stats) : '',
          live_now_url: settings?.live_now_url ?? '',
        }}
      />
    </div>
  );
}
