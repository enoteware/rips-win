import { getBonusCards } from '@/lib/bonuses';
import { BonusesAdmin } from './BonusesAdmin';

export default async function AdminBonusesPage() {
  const cards = await getBonusCards(false);
  return <BonusesAdmin initialCards={cards} />;
}
