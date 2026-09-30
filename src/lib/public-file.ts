import fs from "node:fs";
import path from "node:path";

function resolvePublicFile(publicPath: string): string | null {
  if (!publicPath.startsWith("/") || publicPath.includes("..")) return null;
  return path.join(process.cwd(), "public", publicPath.slice(1));
}

export function publicAssetExists(publicPath: string): boolean {
  const file = resolvePublicFile(publicPath);
  if (!file) return false;
  try {
    return fs.statSync(file).isFile() && fs.statSync(file).size > 0;
  } catch {
    return false;
  }
}

export function isPdfAsset(publicPath: string): boolean {
  const file = resolvePublicFile(publicPath);
  if (!file) return false;
  try {
    const stats = fs.statSync(file);
    if (!stats.isFile() || stats.size < 5) return false;
    const header = Buffer.alloc(5);
    const handle = fs.openSync(file, "r");
    try {
      fs.readSync(handle, header, 0, 5, 0);
    } finally {
      fs.closeSync(handle);
    }
    return header.toString("utf8") === "%PDF-";
  } catch {
    return false;
  }
}
