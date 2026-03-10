import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required.');
}
const sql = neon(connectionString);

export interface VideoClip {
  id: string;
  title: string;
  youtube_url: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export { extractYouTubeId } from './youtube';

export async function getClips(
  publishedOnly: boolean = true
): Promise<VideoClip[]> {
  const query = publishedOnly
    ? `SELECT * FROM video_clips WHERE published = true ORDER BY sort_order ASC`
    : `SELECT * FROM video_clips ORDER BY sort_order ASC`;
  return (await sql(query)) as VideoClip[];
}

export async function createClip(data: {
  title: string;
  youtube_url: string;
  sort_order?: number;
  published?: boolean;
}): Promise<VideoClip> {
  const result = await sql(
    `INSERT INTO video_clips (title, youtube_url, sort_order, published)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.title, data.youtube_url, data.sort_order ?? 0, data.published ?? false]
  ) as VideoClip[];
  return result[0];
}

export async function updateClip(
  id: string,
  data: Partial<VideoClip>
): Promise<VideoClip> {
  const fields = Object.keys(data).filter((k) => k !== 'id');
  const values = fields.map((f) => data[f as keyof typeof data]);
  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');

  const result = await sql(
    `UPDATE video_clips SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  ) as VideoClip[];
  return result[0];
}

export async function deleteClip(id: string): Promise<void> {
  await sql(`DELETE FROM video_clips WHERE id = $1`, [id]);
}
