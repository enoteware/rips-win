import { getSocialLinks } from '@/lib/social-links';
import { SocialsAdmin } from './SocialsAdmin';

export default async function AdminSocialsPage() {
  const links = await getSocialLinks(false);
  return <SocialsAdmin initialLinks={links} />;
}
