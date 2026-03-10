import { getAllPages } from '@/lib/pages';
import { PagesAdmin } from './PagesAdmin';

export default async function AdminPagesPage() {
  const pages = await getAllPages();
  return <PagesAdmin initialPages={pages} />;
}
