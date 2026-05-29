#!/usr/bin/env node
/* ------------------------------------------------------------------
   Build a SCORM 1.2 package from the static export.

   Steps:
     1. Move export-incompatible routes aside: the /api handlers
        (force-dynamic) and the root page (uses redirect(), unsupported
        by `output: export`). The SCO launches the pack home directly.
     2. Run `SCORM_BUILD=1 NEXT_PUBLIC_SCORM=1 next build` → out/.
     3. Write imsmanifest.xml (SCORM 1.2) into out/.
     4. Zip out/ → dist/scorm/<pack>-scorm12.zip (system `zip`).
     5. Always restore the moved files.

   Verify the zip in an LMS (SCORM Cloud free tier works) before
   distributing — asset paths and iframe framing are LMS-dependent.
------------------------------------------------------------------ */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const PACK_ID = process.env.NEXT_PUBLIC_CONTENT_PACK_ID || "clean-core-academy";
const TITLE = "Clean Core Academy";

const outDir = path.join(root, "out");
const distDir = path.join(root, "dist", "scorm");

// Files moved aside during the export, restored in finally. These are
// either export-incompatible (force-dynamic / redirect) or irrelevant
// to a self-contained SCO (sitemap/robots/manifest are site-SEO files).
const moves = [
  { live: "src/app/api", parked: ".scorm-park/api" },
  { live: "src/app/page.tsx", parked: ".scorm-park/page.tsx" },
  { live: "src/app/robots.ts", parked: ".scorm-park/robots.ts" },
  { live: "src/app/sitemap.ts", parked: ".scorm-park/sitemap.ts" },
  { live: "src/app/manifest.ts", parked: ".scorm-park/manifest.ts" },
  // The section route reads `?tab=` searchParams (the tabbed view), which
  // `output: export` can't statically render. The SCO launches the
  // single-page player (clean-core-academy/scorm) and reaches every module
  // through client state, so the section route is neither exportable nor
  // needed here — park it for the duration of the export.
  { live: "src/app/[packId]/section", parked: ".scorm-park/section" },
];

const log = (m) => console.log(`[build-scorm] ${m}`);

function parkFiles() {
  fs.mkdirSync(path.join(root, ".scorm-park"), { recursive: true });
  for (const m of moves) {
    const live = path.join(root, m.live);
    const parked = path.join(root, m.parked);
    if (fs.existsSync(live)) {
      fs.renameSync(live, parked);
      log(`parked ${m.live}`);
    }
  }
}

function restoreFiles() {
  for (const m of moves) {
    const live = path.join(root, m.live);
    const parked = path.join(root, m.parked);
    if (fs.existsSync(parked)) {
      fs.mkdirSync(path.dirname(live), { recursive: true });
      fs.renameSync(parked, live);
      log(`restored ${m.live}`);
    }
  }
  const park = path.join(root, ".scorm-park");
  if (fs.existsSync(park)) fs.rmSync(park, { recursive: true, force: true });
}

function manifest(launchHref) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="CCA-${PACK_ID}" version="1.2"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="ORG-1">
    <organization identifier="ORG-1">
      <title>${TITLE}</title>
      <item identifier="ITEM-1" identifierref="RES-1" isvisible="true">
        <title>${TITLE}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES-1" type="webcontent" adlcp:scormtype="sco" href="${launchHref}">
      <file href="${launchHref}"/>
    </resource>
  </resources>
</manifest>
`;
}

function walkHtml(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, acc);
    else if (entry.isFile() && entry.name.endsWith(".html")) acc.push(full);
  }
  return acc;
}

function basePinScript(upPrefix) {
  // Freeze an absolute base at the package root so relative URLs resolve
  // there even after History pushState changes the address bar.
  const up = JSON.stringify(upPrefix);
  return (
    `<script>(function(){try{var u=new URL(${up},location.href).href;` +
    `var b=document.createElement('base');b.setAttribute('href',u);` +
    `var h=document.head||document.getElementsByTagName('head')[0];` +
    `h.insertBefore(b,h.firstChild);}catch(e){}})();</script>`
  );
}

function patchHtml(outDir) {
  for (const file of walkHtml(outDir, [])) {
    let html = fs.readFileSync(file, "utf8");

    // (a) Absolute public-asset URLs → relative (so the <base> applies).
    html = html
      .replace(/(["'])\/images\//g, "$1images/")
      .replace(/(["'])\/(icon\.svg|icon-maskable\.svg)/g, "$1$2");

    // (b) Inject the base pin as the first thing inside <head>. Depth is
    // measured from the export root so the computed base is correct
    // whichever file the LMS happens to launch or reload.
    const relDir = path.dirname(path.relative(outDir, file));
    const depth = relDir === "." ? 0 : relDir.split(path.sep).length;
    const up = depth === 0 ? "./" : "../".repeat(depth);
    if (/<head[^>]*>/.test(html)) {
      html = html.replace(/<head[^>]*>/, (m) => m + basePinScript(up));
    }

    fs.writeFileSync(file, html);
  }
}

function main() {
  parkFiles();
  try {
    if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true, force: true });
    log("building static export (this runs `next build` with output: export)…");
    execSync("next build", {
      stdio: "inherit",
      env: {
        ...process.env,
        SCORM_BUILD: "1",
        NEXT_PUBLIC_SCORM: "1",
        NEXT_PUBLIC_CONTENT_PACK_ID: PACK_ID,
      },
    });
  } finally {
    restoreFiles();
  }

  if (!fs.existsSync(outDir)) {
    throw new Error("static export did not produce out/");
  }

  // The package launches the single-page player (clean-core-academy/
  // scorm), which renders the whole course in one document via client
  // state — so no other route is reachable or needed. Prune every other
  // pack route (they also embed the full curriculum and would bloat the
  // zip). Shared assets under out/_next and out/images are kept.
  const packOut = path.join(outDir, PACK_ID);
  for (const entry of fs.readdirSync(packOut)) {
    if (entry !== "scorm") {
      fs.rmSync(path.join(packOut, entry), { recursive: true, force: true });
    }
  }
  log("pruned to the single-page player (clean-core-academy/scorm)");

  // Make the package path-portable. Static export emits absolute asset
  // URLs (assetPrefix "." → "./_next/…") plus absolute public assets
  // ("/images/…"). Inside an LMS iframe served from a deep path those
  // resolve to the LMS domain root and 404 (the "broken/unstyled page").
  // Fix: (a) rewrite absolute public-asset URLs to relative, and (b)
  // inject a tiny script that pins an absolute <base> to the package
  // root computed from the launch document's own URL — so every relative
  // asset/RSC fetch resolves there and keeps working after client-side
  // navigation changes the address bar.
  patchHtml(outDir);
  log("patched HTML: relative asset URLs + runtime <base> pin");

  // trailingSlash:true emits the player at <pack>/scorm/index.html.
  const launch = `${PACK_ID}/scorm/index.html`;
  if (!fs.existsSync(path.join(outDir, launch))) {
    throw new Error(`expected launch file out/${launch} not found`);
  }
  fs.writeFileSync(path.join(outDir, "imsmanifest.xml"), manifest(launch));
  log(`wrote imsmanifest.xml (launch: ${launch})`);

  fs.mkdirSync(distDir, { recursive: true });
  const zipPath = path.join(distDir, `${PACK_ID}-scorm12.zip`);
  if (fs.existsSync(zipPath)) fs.rmSync(zipPath);
  try {
    execSync(`cd "${outDir}" && zip -r -q -X "${zipPath}" .`, { stdio: "inherit" });
  } catch (e) {
    throw new Error(
      `zip failed — install the \`zip\` CLI (apt-get install zip). ${e.message}`
    );
  }
  log(`SCORM 1.2 package ready: ${path.relative(root, zipPath)}`);
}

try {
  main();
} catch (e) {
  console.error(`[build-scorm] ${e.message}`);
  process.exit(1);
}
