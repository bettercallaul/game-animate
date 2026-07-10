import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceWeb = path.join(root, "web");
const sourceAssets = path.join(root, "asset");
const output = path.join(root, "dist");
const outputAssets = path.join(output, "asset");

await rm(output, { recursive: true, force: true });
await cp(sourceWeb, output, { recursive: true });

const sourceGamePath = path.join(sourceWeb, "src", "game.js");
const outputGamePath = path.join(output, "src", "game.js");
let gameSource = await readFile(sourceGamePath, "utf8");
const assetPattern = /\$\{ASSET_ROOT\}\/([^`]+\.(?:png|mp3|wav))/g;
const referencedAssets = [...gameSource.matchAll(assetPattern)].map((match) => match[1]);
const uniqueAssets = [...new Set(referencedAssets)];

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function buildAsset(relativePath) {
  const sourcePath = path.join(sourceAssets, relativePath);
  if (!(await exists(sourcePath))) return 0;

  if (relativePath.endsWith(".png")) {
    const webpPath = relativePath.replace(/\.png$/, ".webp");
    const outputPath = path.join(outputAssets, webpPath);
    await mkdir(path.dirname(outputPath), { recursive: true });
    const info = await sharp(sourcePath)
      .resize({ width: 768, height: 768, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 84, alphaQuality: 96, effort: 4 })
      .toFile(outputPath);
    gameSource = gameSource.replaceAll(relativePath, webpPath);
    return info.size;
  }

  const outputPath = path.join(outputAssets, relativePath);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await cp(sourcePath, outputPath);
  return (await stat(outputPath)).size;
}

let outputBytes = 0;
const pending = [...uniqueAssets];
const workers = Array.from({ length: 4 }, async () => {
  while (pending.length > 0) {
    const relativePath = pending.shift();
    const assetBytes = await buildAsset(relativePath);
    outputBytes += assetBytes;
  }
});

await Promise.all(workers);
await writeFile(outputGamePath, gameSource, "utf8");

console.log(`Built ${uniqueAssets.length} referenced assets (${(outputBytes / 1024 / 1024).toFixed(2)} MB).`);
