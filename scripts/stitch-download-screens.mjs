#!/usr/bin/env node
/**
 * Download Stitch project screen images and HTML code into docs/stitch/.
 * Requires STITCH_API_KEY in env (from Stitch Settings) or prior `npx google-stitch-mcp init`.
 *
 * Usage: node scripts/stitch-download-screens.mjs
 *   or:  npm run stitch:download
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "docs", "stitch");

try {
  const { config } = await import("dotenv");
  config({ path: path.join(ROOT, ".env.local") });
} catch {
  // dotenv optional; env may already be set
}

const STITCH_MCP_URL = "https://stitch.googleapis.com/mcp";

const PROJECT_ID = "11010436019750219120";
const SCREENS = [
  { id: "deef04cf30bb454398e33253b7a13ea7", name: "rips-leaderboard-page" },
  { id: "43c40161904f4de08f878e004d3717ca", name: "rips-home-page" },
  { id: "c1b6ab472b8d42c99b9f4ec49e1dde6b", name: "rips-home-official-logo" },
];

let rpcId = 0;
async function callStitchMcp(apiKey, method, params) {
  const res = await fetch(STITCH_MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: ++rpcId,
      method,
      params: params || {},
    }),
  });
  if (!res.ok) throw new Error(`Stitch MCP HTTP ${res.status}: ${res.statusText}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  const result = data.result;
  if (result?.isError) {
    const content = result.content;
    const msg = Array.isArray(content) ? content.find((p) => p.type === "text")?.text : null;
    throw new Error(msg || "Unknown error");
  }
  return result;
}

async function getScreenViaApiKey(apiKey, projectId, screenId) {
  const result = await callStitchMcp(apiKey, "tools/call", {
    name: "get_screen",
    arguments: {
      name: `projects/${projectId}/screens/${screenId}`,
      projectId,
      screenId,
    },
  });
  const content = result?.content;
  if (Array.isArray(content)) {
    const textPart = content.find((p) => p.type === "text" && p.text);
    if (textPart?.text) {
      try {
        return JSON.parse(textPart.text);
      } catch {
        return null;
      }
    }
  }
  return result;
}

async function downloadUrlToFile(apiKey, url, outPath) {
  const headers = { "X-Goog-Api-Key": apiKey };
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Download ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
}

function runTool(toolName, projectId, screenId) {
  const payload = JSON.stringify({ projectId, screenId });
  try {
    const out = execSync(
      `npx google-stitch-mcp tool ${toolName} -d '${payload.replace(/'/g, "'\\''")}' -o raw`,
      {
        encoding: "utf-8",
        maxBuffer: 10 * 1024 * 1024,
        env: { ...process.env, FORCE_COLOR: "0" },
      }
    );
    const str = out.trim();
    const parsed = (() => { try { return JSON.parse(str); } catch { return null; } })();
    if (parsed && parsed.success === false && parsed.error) throw new Error(parsed.error);
    return out;
  } catch (err) {
    if (err.stderr) process.stderr.write(err.stderr);
    throw new Error(`${toolName} failed: ${err.message}`);
  }
}

function extractTextFromContent(content) {
  if (!Array.isArray(content)) return null;
  const part = content.find((p) => p.type === "text" && p.text);
  return part ? part.text : null;
}

function extractImageFromContent(content) {
  if (!Array.isArray(content)) return null;
  const part = content.find(
    (p) => (p.type === "image" || p.type === "image_url") && (p.data != null || p.url != null)
  );
  if (!part) return null;
  if (part.data) return part.data;
  if (part.url && part.url.startsWith("data:image")) {
    const m = part.url.match(/base64,(.+)/);
    if (m) return m[1];
  }
  return null;
}

function extractTextContent(raw) {
  const str = raw.trim();
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed.content)) {
      const t = extractTextFromContent(parsed.content);
      if (t) return t;
    }
    if (typeof parsed.text === "string") return parsed.text;
    if (typeof parsed.content === "string") return parsed.content;
    if (typeof parsed.html === "string") return parsed.html;
    if (typeof parsed.code === "string") return parsed.code;
  } catch {
    // not JSON
  }
  return str;
}

function extractImageBase64(raw) {
  const str = raw.trim();
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed.content)) {
      const b = extractImageFromContent(parsed.content);
      if (b) return b;
    }
    if (typeof parsed.data === "string") return parsed.data;
    if (typeof parsed.base64 === "string") return parsed.base64;
    if (typeof parsed.image === "string") return parsed.image;
  } catch {
    // not JSON
  }
  if (/^[A-Za-z0-9+/=]+$/.test(str) && str.length > 100) return str;
  return null;
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const apiKey = process.env.STITCH_API_KEY;
  const useDirect = Boolean(apiKey);

  console.log("Stitch screens download (project %s)", PROJECT_ID);
  if (!apiKey) {
    console.warn(
      "Warning: STITCH_API_KEY not set. If download fails, set it or run: npx google-stitch-mcp init"
    );
  }

  for (const { id: screenId, name } of SCREENS) {
    console.log("  %s (%s)...", name, screenId);

    if (useDirect) {
      try {
        const screen = await getScreenViaApiKey(apiKey, PROJECT_ID, screenId);
        if (!screen) {
          console.error("    get_screen: no screen data");
          continue;
        }
        const htmlUrl = screen.htmlCode?.downloadUrl;
        const imgUrl = screen.screenshot?.downloadUrl;
        if (htmlUrl) {
          const htmlPath = path.join(OUT_DIR, `${name}.html`);
          await downloadUrlToFile(apiKey, htmlUrl, htmlPath);
          console.log("    -> %s", path.relative(ROOT, htmlPath));
        } else {
          console.warn("    no htmlCode.downloadUrl");
        }
        if (imgUrl) {
          const imgPath = path.join(OUT_DIR, `${name}.png`);
          await downloadUrlToFile(apiKey, imgUrl, imgPath);
          console.log("    -> %s", path.relative(ROOT, imgPath));
        } else {
          console.warn("    no screenshot.downloadUrl");
        }
      } catch (e) {
        console.error("    get_screen / download failed:", e.message);
      }
      continue;
    }

    // CLI path (google-stitch-mcp proxy)
    try {
      const codeRaw = runTool("get_screen_code", PROJECT_ID, screenId);
      const html = extractTextContent(codeRaw);
      const htmlPath = path.join(OUT_DIR, `${name}.html`);
      fs.writeFileSync(htmlPath, html, "utf-8");
      console.log("    -> %s", path.relative(ROOT, htmlPath));
    } catch (e) {
      console.error("    get_screen_code failed:", e.message);
    }
    try {
      const imgRaw = runTool("get_screen_image", PROJECT_ID, screenId);
      const b64 = extractImageBase64(imgRaw);
      if (b64) {
        const buf = Buffer.from(b64, "base64");
        const imgPath = path.join(OUT_DIR, `${name}.png`);
        fs.writeFileSync(imgPath, buf);
        console.log("    -> %s", path.relative(ROOT, imgPath));
      } else {
        console.warn("    get_screen_image: could not parse image from response");
      }
    } catch (e) {
      console.error("    get_screen_image failed:", e.message);
    }
  }

  console.log("Done.");
}

main();
