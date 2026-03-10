import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required.');
}
const sql = neon(connectionString);

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export async function getSocialLinks(
  publishedOnly: boolean = true
): Promise<SocialLink[]> {
  const query = publishedOnly
    ? `SELECT * FROM social_links WHERE published = true ORDER BY sort_order ASC`
    : `SELECT * FROM social_links ORDER BY sort_order ASC`;
  return (await sql(query)) as SocialLink[];
}

export async function createSocialLink(data: {
  platform: string;
  label: string;
  url: string;
  icon: string;
  sort_order?: number;
  published?: boolean;
}): Promise<SocialLink> {
  const result = await sql(
    `INSERT INTO social_links (platform, label, url, icon, sort_order, published)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.platform,
      data.label,
      data.url,
      data.icon,
      data.sort_order ?? 0,
      data.published ?? true,
    ]
  ) as SocialLink[];
  return result[0];
}

export async function updateSocialLink(
  id: string,
  data: Partial<SocialLink>
): Promise<SocialLink> {
  const fields = Object.keys(data).filter((k) => k !== 'id');
  const values = fields.map((f) => data[f as keyof typeof data]);
  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');

  const result = await sql(
    `UPDATE social_links SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  ) as SocialLink[];
  return result[0];
}

export async function deleteSocialLink(id: string): Promise<void> {
  await sql(`DELETE FROM social_links WHERE id = $1`, [id]);
}
