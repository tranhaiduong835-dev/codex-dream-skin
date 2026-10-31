#!/usr/bin/env node

// The shared runtime/ and macos/ generators are not present in this Windows-only
// checkout. Keep this entry point as a read-only preflight; never regenerate
// assets from their own outputs or silently publish unresolved templates.
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
if (args.length !== 1 || args[0] !== "--check") {
  console.error("Windows asset sync write mode disabled: canonical runtime sources are absent. Use --check for a read-only preflight.");
  process.exit(2);
}

const resources = [
  "windows/assets/background.jpg",
  "windows/assets/dream-reference.jpg",
  "windows/assets/dream-skin.css",
  "windows/assets/renderer-inject.js",
  "windows/assets/selectors.json",
  "windows/assets/safe-css-policy.json",
  "windows/assets/safe-css-validator.mjs",
  "windows/assets/theme-package-validator.mjs",
  "windows/assets/theme-preferences.mjs",
  "windows/assets/theme.json",
  "windows/assets/windows-shell.css",
  "windows/scripts/image-metadata.mjs",
  "windows/scripts/validate-safe-css-file.mjs",
];
const contents = new Map();
let problems = 0;
for (const relative of resources) {
  try {
    const value = await fs.readFile(path.join(projectRoot, relative));
    if (value.length === 0) throw new Error("empty");
    contents.set(relative, value);
  } catch {
    console.error(`missing-or-empty=${relative}`);
    problems += 1;
  }
}

function parseJson(relative) {
  const value = contents.get(relative);
  if (!value) return null;
  try {
    return JSON.parse(value.toString("utf8"));
  } catch {
    console.error(`invalid-json=${relative}`);
    problems += 1;
    return null;
  }
}

const contract = parseJson("windows/assets/selectors.json");
if (contract) {
  const entries = contract.selectors;
  if (contract.schema !== "codex-dream-skin-selectors/1" ||
      !Array.isArray(entries) ||
      entries.some((entry) => !entry?.key || !entry?.selector) ||
      new Set(entries.map((entry) => entry.key)).size !== entries.length) {
    console.error("invalid-contract=windows/assets/selectors.json");
    problems += 1;
  }
}
parseJson("windows/assets/safe-css-policy.json");
const theme = parseJson("windows/assets/theme.json");
if (theme && (theme.id !== "preset-gothic-void-crusade" ||
    theme.image !== "background.jpg")) {
  console.error("invalid-theme=windows/assets/theme.json");
  problems += 1;
}

const css = contents.get("windows/assets/dream-skin.css")?.toString("utf8");
if (css && /__DREAM_SELECTOR_[A-Z0-9_]+__/.test(css)) {
  console.error("uncompiled=windows/assets/dream-skin.css");
  problems += 1;
}
const renderer = contents.get("windows/assets/renderer-inject.js")?.toString("utf8");
if (renderer && /__DREAM_SKIN_(?:SELECTORS|CSS_PREDICATES)_JSON__/.test(renderer)) {
  console.error("uncompiled=windows/assets/renderer-inject.js");
  problems += 1;
}
const imageMetadata = contents.get("windows/scripts/image-metadata.mjs")?.toString("utf8");
if (imageMetadata && !imageMetadata.includes('mode !== "--check"')) {
  console.error("missing-cli=windows/scripts/image-metadata.mjs");
  problems += 1;
}

if (problems) process.exitCode = 1;
else console.log("Windows assets passed read-only preflight.");
