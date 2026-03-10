import { getClips } from '@/lib/clips';
import { ClipsAdmin } from './ClipsAdmin';

export default async function AdminClipsPage() {
  const clips = await getClips(false);
  return <ClipsAdmin initialClips={clips} />;
}
