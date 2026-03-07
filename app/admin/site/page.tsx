import { getSiteSettings } from '@/lib/site-settings';
import { SiteSettingsForm } from './SiteSettingsForm';

export default async function AdminSitePage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-secondary md:text-3xl">
          Site content
        </h1>
        <div className="mt-2 h-2 w-24 border-2 border-border bg-logo-gradient shadow-hard" aria-hidden />
      </div>
      <p className="text-sm text-muted-foreground">
        Edit the welcome code, rakeback, and CTA links shown on the homepage.
      </p>
      <SiteSettingsForm
        initial={{
          welcome_code: settings?.welcome_code ?? '',
          rakeback_pct: settings?.rakeback_pct ?? '',
          stake_us_link: settings?.stake_us_link ?? '',
          stake_com_link: settings?.stake_com_link ?? '',
        }}
      />
    </div>
  );
}
