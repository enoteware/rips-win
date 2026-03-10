import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required.');
}
const sql = neon(connectionString);

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export async function getPageBySlug(slug: string): Promise<CmsPage | null> {
  const result = await sql(
    `SELECT * FROM pages WHERE slug = $1 LIMIT 1`,
    [slug]
  ) as CmsPage[];
  return result[0] || null;
}

export async function getAllPages(): Promise<CmsPage[]> {
  return (await sql(`SELECT * FROM pages ORDER BY slug ASC`)) as CmsPage[];
}

export async function createPage(data: {
  slug: string;
  title: string;
  content: string;
  published?: boolean;
}): Promise<CmsPage> {
  const result = await sql(
    `INSERT INTO pages (slug, title, content, published)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.slug, data.title, data.content, data.published ?? true]
  ) as CmsPage[];
  return result[0];
}

export async function updatePage(
  id: string,
  data: Partial<CmsPage>
): Promise<CmsPage> {
  const fields = Object.keys(data).filter((k) => k !== 'id');
  const values = fields.map((f) => data[f as keyof typeof data]);
  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');

  const result = await sql(
    `UPDATE pages SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  ) as CmsPage[];
  return result[0];
}

export async function deletePage(id: string): Promise<void> {
  await sql(`DELETE FROM pages WHERE id = $1`, [id]);
}
