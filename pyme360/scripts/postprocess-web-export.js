#!/usr/bin/env node
/**
 * Patches the static web export (app.json "web.output": "single" only runs a
 * generic SPA template, so app/+html.tsx is never invoked) with:
 *  - PWA <head> tags (manifest, apple touch icon, theme color) so the app
 *    can be added to a phone home screen.
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

const headInjection = `
    <meta name="description" content="Pyme360 — Tu negocio, 360° bajo control" />
    <meta name="theme-color" content="#0B7CF6" />
    <link rel="manifest" href="/Demo-Pedidos-Ya/manifest.json" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Pyme360" />
    <link rel="apple-touch-icon" href="/Demo-Pedidos-Ya/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/Demo-Pedidos-Ya/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/Demo-Pedidos-Ya/favicon-16.png" />
  </head>`;

if (!html.includes('rel="manifest"')) {
  html = html.replace('</head>', headInjection);
  html = html.replace('<html lang="en">', '<html lang="es">');
  fs.writeFileSync(indexPath, html);
  console.log('Injected PWA head tags into index.html');
} else {
  console.log('PWA head tags already present, skipping injection');
}

fs.writeFileSync(path.join(distDir, '404.html'), fs.readFileSync(indexPath, 'utf8'));
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('Wrote 404.html (SPA fallback) and .nojekyll');
