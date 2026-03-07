#!/usr/bin/env node
/**
 * Fetch Stitch screen metadata (and optionally image/code) for Rips CMS - Leaderboard Management.
 * Requires STITCH_API_KEY in env (from https://stitch.withgoogle.com → Create API Key).
 *
 * Usage: STITCH_API_KEY=your_key node scripts/stitch-fetch-screen.mjs
 *
 * If the MCP returns hosted URLs, the script prints curl commands to download them.
 * If it returns inline base64/code, we write to docs/stitch/.
 */

const PROJECT_ID = '11010436019750219120';
const SCREEN_ID = '3ef30c10751c4bbbb39eba5578e66b63';
const MCP_URL = 'https://stitch.googleapis.com/mcp';

async function main() {
  const apiKey = process.env.STITCH_API_KEY;
  if (!apiKey) {
    console.error('Set STITCH_API_KEY (from stitch.withgoogle.com → Create API Key).');
    process.exit(1);
  }

  // MCP JSON-RPC: list tools or call get_screen
  const body = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'get_screen',
      arguments: {
        project_id: PROJECT_ID,
        screen_id: SCREEN_ID,
      },
    },
  };

  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error('Stitch API error:', res.status, await res.text());
    process.exit(1);
  }

  const data = await res.json();
  if (data.error) {
    console.error('Stitch MCP error:', data.error);
    process.exit(1);
  }

  const result = data.result?.content?.[0]?.text ?? data.result;
  const parsed = typeof result === 'string' ? tryParse(result) : result;
  const screen = parsed ?? result;

  console.log('Screen metadata:');
  console.log(JSON.stringify(screen, null, 2));

  const imageUrl = screen?.screenshot?.downloadUrl;
  const htmlUrl = screen?.htmlCode?.downloadUrl;
  if (imageUrl) {
    console.log('\nDownload image:');
    console.log(`  curl -L -o docs/stitch/rips-cms-leaderboard.png "${imageUrl}"`);
  }
  if (htmlUrl) {
    console.log('\nDownload HTML:');
    console.log(`  curl -L -o docs/stitch/rips-cms-leaderboard.html "${htmlUrl}"`);
  }
}

function tryParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
