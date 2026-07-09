#!/usr/bin/env node
/**
 * Patches the static web export (app.json "web.output": "single" only runs a
 * generic SPA template, so app/+html.tsx is never invoked) with:
 *  - PWA <head> tags (manifest, apple touch icon, theme color) so the app
 *    can be added to a phone home screen.
 *  - a static HTML/CSS splash (logo + loading bar + "Cargando…") rendered inside
 *    #root, visible the instant index.html parses — before the ~4MB JS
 *    bundle finishes downloading/executing. React's createRoot() replaces
 *    #root's children on mount, so this is swapped out for the real app
 *    automatically with no flicker (same colors/logo as the in-app loading
 *    screen in app/_layout.tsx).
 *  - a 404.html copy of index.html, the standard trick for making a
 *    client-side-routed SPA work with deep links on GitHub Pages.
 *  - a .nojekyll file, since GitHub Pages runs Jekyll by default and Jekyll
 *    ignores/strips any folder starting with an underscore — which would
 *    silently delete the app's _expo/ JS bundle.
 *
 * Usage: node scripts/postprocess-web-export.js [distDir]
 */
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(process.cwd(), process.argv[2] || 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error(`Could not find ${indexPath}. Run "npx expo export --platform web" first.`);
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

function findBundledLogoPath() {
  const assetsDir = path.join(distDir, 'assets', 'assets');
  if (!fs.existsSync(assetsDir)) return null;
  const match = fs.readdirSync(assetsDir).find((f) => /^logo-transparent\..*\.png$/.test(f));
  return match ? `assets/assets/${match}` : null;
}

const logoPath = findBundledLogoPath();

const splashCss = `
    #root-splash {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #F6F9FC;
      z-index: 0;
    }
    #root-splash img {
      width: 150px;
      height: 144px;
      object-fit: contain;
    }
    #root-splash .bar-track {
      width: 120px;
      height: 4px;
      margin-top: 24px;
      border-radius: 999px;
      background: #E7ECF3;
      overflow: hidden;
    }
    #root-splash .bar-fill {
      width: 45%;
      height: 100%;
      border-radius: 999px;
      background: #0B7CF6;
      animation: root-splash-slide 1.1s ease-in-out infinite;
    }
    #root-splash .label {
      margin-top: 12px;
      font-family: -apple-system, system-ui, sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: #8A96AC;
    }
    @keyframes root-splash-slide {
      0% { transform: translateX(-120px); }
      100% { transform: translateX(120px); }
    }`;

function splashHtml(bundledLogoPath) {
  return `
    <div id="root-splash">
      <img src="/Pymes360/${bundledLogoPath}" alt="Pyme360" />
      <div class="bar-track"><div class="bar-fill"></div></div>
      <div class="label">Cargando…</div>
    </div>`;
}

const headInjection = `
    <meta name="description" content="Pyme360 — Tu negocio, 360° bajo control" />
    <meta name="theme-color" content="#0B7CF6" />
    <link rel="manifest" href="/Pymes360/manifest.json" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Pyme360" />
    <link rel="apple-touch-icon" href="/Pymes360/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/Pymes360/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/Pymes360/favicon-16.png" />
  </head>`;

if (!html.includes('rel="manifest"')) {
  html = html.replace('</head>', headInjection);
  html = html.replace('<html lang="en">', '<html lang="es">');
  fs.writeFileSync(indexPath, html);
  console.log('Injected PWA head tags into index.html');
} else {
  console.log('PWA head tags already present, skipping injection');
}

if (logoPath) {
  html = html.replace(/<div id="root">.*?<\/div>/s, `<div id="root">${splashHtml(logoPath)}</div>`);
  html = html.replace('</style>', `${splashCss}\n  </style>`);
  fs.writeFileSync(indexPath, html);
  console.log('Injected static splash (logo + Cargando) into #root');
} else {
  console.warn('Could not find bundled logo asset, skipping static splash injection');
}

fs.writeFileSync(path.join(distDir, '404.html'), fs.readFileSync(indexPath, 'utf8'));
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('Wrote 404.html (SPA fallback) and .nojekyll');
