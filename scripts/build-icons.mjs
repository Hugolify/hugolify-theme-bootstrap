#!/usr/bin/env node

/**
 * Bootstrap Icons Subset Build Script — hugolify-theme-bootstrap
 *
 * This script optimizes the delivery of Bootstrap Icons by creating a custom font subset
 * containing only the icons actually used in the project.
 *
 * It ships with this module and runs from the Hugo module cache, so the project
 * calls it through `hugo config mounts` (see README, "Icon"):
 *   "build:icons": "node \"$(hugo config mounts | grep -o '\"dir\": *\"[^\"]*hugolify-theme-bootstrap[^\"]*\"' | head -1 | cut -d'\"' -f4)/scripts/build-icons.mjs\" && yarn build"
 *
 * It performs the following operations:
 *
 * 1. Runs 'hugo config mounts' to locate the Hugo modules (no vendoring)
 * 2. Scans multiple sources to extract used icon names:
 *    - Markdown and HTML files in /content
 *    - SASS files in /assets/sass, /assets/scss and in the Hugo modules
 *    - HTML template files in /layouts
 *    - Social menu data in /data/menu/social.yml
 * 3. Extracts unicode mappings from the Bootstrap Icons CSS of the github.com/twbs/icons
 *    module (the version this module imports)
 * 4. Generates optimized WOFF2 and WOFF font subsets in /static/assets/fonts
 * 5. Generates a SASS map in /assets/scss/bootstrap-icons/bootstrap-icons.scss
 *
 * Dependencies (subset-font, js-yaml) come from this module's package.hugo.json:
 *   hugo mod npm pack && yarn install
 * They are loaded from the project's node_modules: the module cache has none.
 */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const FONT_OUTPUT_DIR = "static/assets/fonts/bootstrap-icons";
const SCSS_OUTPUT_PATH = "assets/scss/bootstrap-icons/bootstrap-icons.scss";
const BOOTSTRAP_ICONS_MODULE = "github.com/twbs/icons";

// Resolves packages from the project (the working directory), not from this file
const projectRequire = createRequire(path.join(process.cwd(), "package.json"));

// Utility function for logging with emojis
function log(emoji, message) {
  console.log(`${emoji} ${message}`);
}

// Load a dependency from the project's node_modules
function requireFromProject(pkg) {
  try {
    return projectRequire(pkg);
  } catch (err) {
    console.error(`❌ ${pkg} not found: run "hugo mod npm pack && yarn install"`);
    process.exit(1);
  }
}

// List the files of a directory, recursively, with one of the given extensions
function listFiles(dir, extensions) {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && extensions.includes(path.extname(entry.name)))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

// Get the Hugo modules (path and directory) from 'hugo config mounts'
function getHugoModules() {
  try {
    log("📦", "Running hugo config mounts...");
    const output = execSync("hugo config mounts", { encoding: "utf-8" });
    // One JSON object per module, printed one after the other
    const modules = JSON.parse(`[${output.trim().replace(/}\s*{/g, "},{")}]`);
    // The first one is the project itself
    const dependencies = modules.filter((m) => path.resolve(m.dir) !== process.cwd());
    log("📦", `Found ${dependencies.length} Hugo modules`);
    return dependencies;
  } catch (err) {
    console.error("❌ Failed to run hugo config mounts:", err.message);
    process.exit(1);
  }
}

// Locate the font directory of the github.com/twbs/icons module
function getBootstrapIconsFontDir(modules) {
  const iconsModule = modules.find((m) => m.path === BOOTSTRAP_ICONS_MODULE);

  if (!iconsModule) {
    log("❌", `${BOOTSTRAP_ICONS_MODULE} not found: is hugolify-theme-bootstrap imported?`);
    process.exit(1);
  }

  return path.join(iconsModule.dir, "font");
}

// Extract Bootstrap Icons unicode mapping from the official font CSS
function getBootstrapIconsUnicodeMap(fontDir) {
  const fontCssPath = path.join(fontDir, "bootstrap-icons.css");
  const unicodeMap = new Map();

  if (!fs.existsSync(fontCssPath)) {
    log("⚠️", "Bootstrap Icons CSS not found. Cannot create subset.");
    process.exit(1);
  }

  try {
    const css = fs.readFileSync(fontCssPath, "utf-8");
    // Match patterns like: .bi-arrow-right::before { content: "\f138"; }
    const matches = css.matchAll(/\.bi-([\w-]+)::before\s*{\s*content:\s*"\\([\da-f]+)"/gi);

    for (const match of matches) {
      const iconName = match[1];
      const unicode = match[2];
      unicodeMap.set(iconName, unicode.toUpperCase());
    }

    log("📋", `Loaded ${unicodeMap.size} unicode mappings from Bootstrap Icons`);
  } catch (err) {
    log("⚠️", `Could not read Bootstrap Icons CSS: ${err.message}`);
    process.exit(1);
  }

  return unicodeMap;
}

// 1. Extract icons from content files (MD/HTML)
function extractIconsFromContent() {
  const contentDirs = ["content"];
  const icons = new Set();

  contentDirs.forEach((dir) => {
    const files = listFiles(dir, [".md", ".html"]);

    files.forEach((file) => {
      try {
        const content = fs.readFileSync(file, "utf-8");
        const matches = content.match(/icon:\s*([\w-]+)/g) || [];
        matches.forEach((m) => {
          const name = m.split(":")[1].trim();
          // Validate icon name for security
          if (/^[\w-]+$/.test(name)) {
            icons.add(name);
          }
        });
      } catch (err) {
        console.warn(`⚠️ Could not read file ${file}:`, err.message);
      }
    });
  });

  return icons;
}

// 2. Extract icons from SASS files
function extractIconsFromSass(modules) {
  const sassDirs = ["assets/sass", "assets/scss"];

  // Add the SASS of the Hugo modules
  modules.forEach((m) => {
    const moduleSassPath = path.join(m.dir, "assets/sass");
    if (fs.existsSync(moduleSassPath)) {
      sassDirs.push(moduleSassPath);
    }
  });

  const icons = new Set();

  sassDirs.forEach((dir) => {
    const files = listFiles(dir, [".sass"]);

    files.forEach((file) => {
      try {
        const content = fs.readFileSync(file, "utf-8");
        const matches = content.match(/icon\(["']([\w-]+)["']\)/g) || [];
        matches.forEach((m) => {
          const match = m.match(/icon\(["']([\w-]+)["']\)/);
          if (match && match[1]) {
            const name = match[1];
            // Validate icon name for security
            if (/^[\w-]+$/.test(name)) {
              icons.add(name);
            }
          }
        });
      } catch (err) {
        console.warn(`⚠️ Could not read file ${file}:`, err.message);
      }
    });
  });

  return icons;
}

// 3. Extract icons from layouts
function extractIconsFromLayouts() {
  const layoutDirs = ["layouts"];
  const icons = new Set();

  layoutDirs.forEach((dir) => {
    const files = listFiles(dir, [".html"]);

    files.forEach((file) => {
      try {
        const content = fs.readFileSync(file, "utf-8");

        // Match patterns like: icon "arrow-right"
        const iconMatches = content.match(/icon\s+["']([\w-]+)["']/g) || [];
        iconMatches.forEach((m) => {
          const match = m.match(/icon\s+["']([\w-]+)["']/);
          if (match && match[1]) {
            icons.add(match[1]);
          }
        });

        // Match patterns like: .icon = "arrow-right"
        const assignMatches = content.match(/\.icon\s*=\s*["']([\w-]+)["']/g) || [];
        assignMatches.forEach((m) => {
          const match = m.match(/\.icon\s*=\s*["']([\w-]+)["']/);
          if (match && match[1]) {
            icons.add(match[1]);
          }
        });
      } catch (err) {
        console.warn(`⚠️ Could not read file ${file}:`, err.message);
      }
    });
  });

  return icons;
}

// 4. Extract icons form social menu
function extractIconsFromSocialData() {
  const yaml = requireFromProject("js-yaml");
  const socialFilePath = "data/menu/social.yml";
  const icons = new Set();

  if (!fs.existsSync(socialFilePath)) {
    log("⚠️", "social.yml not found");
    return icons;
  }

  try {
    const content = fs.readFileSync(socialFilePath, "utf-8");
    const data = yaml.load(content);

    if (!data || typeof data !== "object") {
      log("⚠️", "Malformed social.yml file");
      return icons;
    }

    // Tracing all root keys
    Object.keys(data).forEach((key) => {
      const node = data[key];

      // Simple case : key = "links"
      if (key === "links" && Array.isArray(node)) {
        node.forEach((link) => {
          if (link.title && typeof link.title === "string") {
            const iconName = link.title.toLowerCase().trim();
            if (/^[\w-]+$/.test(iconName)) icons.add(iconName);
          }
        });
      }

      // Multilingue case : key = "fr", "en", …
      else if (node && typeof node === "object" && Array.isArray(node.links)) {
        node.links.forEach((link) => {
          if (link.title && typeof link.title === "string") {
            const iconName = link.title.toLowerCase().trim();
            if (/^[\w-]+$/.test(iconName)) icons.add(iconName);
          }
        });
      }
    });

    log("📱", `Found ${icons.size} icons in social.yml`);
  } catch (err) {
    console.warn(`⚠️ Error reading file social.yml: ${err.message}`);
  }

  return icons;
}

// Create font subset using subset-font library
async function createFontSubset(iconNames, unicodeMap, fontDir) {
  const subsetFont = requireFromProject("subset-font");

  if (!fs.existsSync(FONT_OUTPUT_DIR)) {
    fs.mkdirSync(FONT_OUTPUT_DIR, { recursive: true });
  }

  // Get unicode codepoints for the icons we need
  const codepoints = [];
  const notFoundIcons = [];
  const iconMap = new Map(); // Store icon name -> unicode mapping

  iconNames.forEach((iconName) => {
    if (unicodeMap.has(iconName)) {
      const unicode = unicodeMap.get(iconName);
      const codepoint = parseInt(unicode, 16);
      codepoints.push(codepoint);
      iconMap.set(iconName, unicode);
      log("🔤", `${iconName} -> \\${unicode}`);
    } else {
      notFoundIcons.push(iconName);
    }
  });

  if (notFoundIcons.length > 0) {
    console.warn(`⚠️ Icons not found in unicode map: ${notFoundIcons.join(", ")}`);
  }

  if (codepoints.length === 0) {
    log("⚠️", "No valid icons to include in subset");
    return null;
  }

  log("📋", `Creating subset with ${codepoints.length} glyphs...`);

  // Find source font file (prefer WOFF2)
  const woff2SourcePath = path.join(fontDir, "fonts", "bootstrap-icons.woff2");
  const woffSourcePath = path.join(fontDir, "fonts", "bootstrap-icons.woff");

  let sourceFont = null;
  let sourceFormat = null;

  if (fs.existsSync(woff2SourcePath)) {
    sourceFont = woff2SourcePath;
    sourceFormat = "woff2";
  } else if (fs.existsSync(woffSourcePath)) {
    sourceFont = woffSourcePath;
    sourceFormat = "woff";
  } else {
    log("❌", "No Bootstrap Icons font files found");
    process.exit(1);
  }

  try {
    log("🔨", `Creating font subset from ${sourceFormat.toUpperCase()}...`);

    // Read source font
    const fontBuffer = fs.readFileSync(sourceFont);

    // Create text string from codepoints for subset-font
    const text = String.fromCodePoint(...codepoints);

    // Generate WOFF2 subset
    log("🔨", "Generating WOFF2...");
    const woff2Buffer = await subsetFont(fontBuffer, text, {
      targetFormat: "woff2",
    });
    const woff2OutputPath = path.join(FONT_OUTPUT_DIR, "bootstrap-icons.woff2");
    fs.writeFileSync(woff2OutputPath, woff2Buffer);
    log("✅", `WOFF2 generated: ${woff2OutputPath}`);

    // Generate WOFF subset
    log("🔨", "Generating WOFF...");
    const woffBuffer = await subsetFont(fontBuffer, text, {
      targetFormat: "woff",
    });
    const woffOutputPath = path.join(FONT_OUTPUT_DIR, "bootstrap-icons.woff");
    fs.writeFileSync(woffOutputPath, woffBuffer);
    log("✅", `WOFF generated: ${woffOutputPath}`);

    return iconMap;

  } catch (err) {
    console.error("❌ Failed to create font subset:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

// Generate SCSS file with Bootstrap Icons map
function generateIconsSCSS(iconMap) {
  const scssDir = path.dirname(SCSS_OUTPUT_PATH);

  if (!fs.existsSync(scssDir)) {
    fs.mkdirSync(scssDir, { recursive: true });
  }

  // Generate $bootstrap-icons-map
  let scss = `// Auto-generated Bootstrap Icons map
// This file is generated by hugolify-theme-bootstrap/scripts/build-icons.mjs
// Do not edit manually

$bootstrap-icons-map: (
`;

  // Add each icon to the map
  const sortedIcons = Array.from(iconMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  sortedIcons.forEach(([iconName, unicode], index) => {
    const isLast = index === sortedIcons.length - 1;
    scss += `  "${iconName}": "\\${unicode.toLowerCase()}"${isLast ? '' : ','}\n`;
  });

  scss += `);\n`;

  fs.writeFileSync(SCSS_OUTPUT_PATH, scss);
  log("✅", `SCSS generated: ${SCSS_OUTPUT_PATH}`);
}

// Main function
async function main() {
  try {
    log("🚀", "Starting icon font subset generation...");

    // Locate the Hugo modules
    const modules = getHugoModules();
    const fontDir = getBootstrapIconsFontDir(modules);

    // Load unicode mapping from Bootstrap Icons
    const unicodeMap = getBootstrapIconsUnicodeMap(fontDir);

    // Extract icons from all sources
    log("🔍", "Extracting icons from content...");
    const iconsFromContent = extractIconsFromContent();
    log("📄", `Found ${iconsFromContent.size} icons in content`);

    log("🔍", "Extracting icons from SASS...");
    const iconsFromSass = extractIconsFromSass(modules);
    log("🎨", `Found ${iconsFromSass.size} icons in SASS`);

    log("🔍", "Extracting icons from layouts...");
    const iconsFromLayouts = extractIconsFromLayouts();
    log("📐", `Found ${iconsFromLayouts.size} icons in layouts`);

    log("🔍", "Extracting icons from social menu...");
    const iconsFromSocial = extractIconsFromSocialData();
    log("📋", `Found ${iconsFromSocial.size} icons in social menu`);

    // Combine all icons
    const allIcons = new Set([
      ...iconsFromContent,
      ...iconsFromSass,
      ...iconsFromLayouts,
      ...iconsFromSocial
    ]);

    if (allIcons.size === 0) {
      log("⚠️", "No icons found. Exiting...");
      return;
    }

    log("📊", `Total unique icons: ${allIcons.size}`);
    console.log(`   Icons: ${Array.from(allIcons).sort().join(", ")}\n`);

    // Create font subset
    const iconMap = await createFontSubset(allIcons, unicodeMap, fontDir);

    if (iconMap) {
      // Generate SCSS with icon map
      generateIconsSCSS(iconMap);
    }

    log("✨", "Done!");
  } catch (err) {
    console.error("❌ Error:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

// Run the script
main();
