import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required.');
}
const sql = neon(connectionString);

export interface BonusCard {
  id: string;
  headline: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  cta_text: string;
  cta_link: string;
  promo_code: string | null;
  badge_text: string | null;
  sort_order: number;
  published: boolean;
  show_on_homepage: boolean;
  created_at: string;
  updated_at: string;
}

export async function getBonusCards(
  publishedOnly: boolean = true,
  homepageOnly: boolean = false
): Promise<BonusCard[]> {
  let query = 'SELECT * FROM bonus_cards';
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (publishedOnly) {
    conditions.push(`published = true`);
  }
  if (homepageOnly) {
    conditions.push(`show_on_homepage = true`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY sort_order ASC';

  return (await sql(query, params)) as BonusCard[];
}

export async function createBonusCard(data: {
  headline: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  cta_text: string;
  cta_link: string;
  promo_code?: string;
  badge_text?: string;
  sort_order?: number;
  published?: boolean;
  show_on_homepage?: boolean;
}): Promise<BonusCard> {
  const result = await sql(
    `INSERT INTO bonus_cards
     (headline, subtitle, description, image_url, cta_text, cta_link, promo_code, badge_text, sort_order, published, show_on_homepage)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      data.headline,
      data.subtitle || null,
      data.description || null,
      data.image_url || null,
      data.cta_text,
      data.cta_link,
      data.promo_code || null,
      data.badge_text || null,
      data.sort_order ?? 0,
      data.published ?? false,
      data.show_on_homepage ?? false,
    ]
  ) as BonusCard[];
  return result[0];
}

export async function updateBonusCard(
  id: string,
  data: Partial<BonusCard>
): Promise<BonusCard> {
  const fields = Object.keys(data).filter((k) => k !== 'id');
  const values = fields.map((f) => data[f as keyof typeof data]);
  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');

  const result = await sql(
    `UPDATE bonus_cards SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  ) as BonusCard[];
  return result[0];
}

export async function deleteBonusCard(id: string): Promise<void> {
  await sql(`DELETE FROM bonus_cards WHERE id = $1`, [id]);
}
