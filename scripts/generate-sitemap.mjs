#!/usr/bin/env node
// Generic sitemap generator — walks root *.html and writes sitemap.xml.
// Override origin via SITE_ORIGIN env var (set in deploy.yml or locally).
// Override the priority for individual paths by editing PRIORITIES below.

import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const ORIGIN = process.env.SITE_ORIGIN || 'https://example.pages.dev';
const EXCLUDES = new Set(['404.html']);
const PRIORITIES = {
  '/': '1.0',
  // '/about': '0.7',
};

const slugFor = (f) => (f === 'index.html' ? '/' : `/${f.replace(/\.html$/, '')}`);
const priorityFor = (slug) => PRIORITIES[slug] ?? '0.6';

const files = readdirSync(ROOT)
  .filter((f) => f.endsWith('.html') && !EXCLUDES.has(f))
  .sort();

const entries = files.map((f) => {
  const stat = statSync(join(ROOT, f));
  return {
    slug: slugFor(f),
    lastmod: stat.mtime.toISOString().slice(0, 10),
    priority: priorityFor(slugFor(f)),
    file: f,
  };
});

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map(
    (e) =>
      `  <url>\n    <loc>${ORIGIN}${e.slug}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <priority>${e.priority}</priority>\n  </url>`
  ),
  '</urlset>',
  '',
].join('\n');

writeFileSync(join(ROOT, 'sitemap.xml'), xml);

console.log(`Generated sitemap.xml with ${entries.length} URLs (origin: ${ORIGIN}):`);
for (const e of entries) {
  console.log(`  ${e.priority}  ${e.lastmod}  ${ORIGIN}${e.slug}  (${e.file})`);
}
