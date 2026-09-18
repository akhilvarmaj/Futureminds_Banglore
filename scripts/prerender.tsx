import React from 'react';
import fs from 'node:fs/promises';
import path from 'node:path';
import { renderToString } from 'react-dom/server';
import { load } from 'cheerio';
import App from '../src/App';
import { routes, SITE_ORIGIN, structuredData, type PageTab } from '../src/data/siteSeo';

const template = await fs.readFile('dist/index.html', 'utf8');
for (const page of Object.keys(routes) as PageTab[]) {
  const route = routes[page];
  const html = load(template);
  html('title').text(route.title);
  html('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]').attr('content', route.description);
  html('meta[property="og:title"], meta[name="twitter:title"]').attr('content', route.title);
  html('meta[property="og:url"]').attr('content', SITE_ORIGIN + route.path);
  html('link[rel="canonical"]').attr('href', SITE_ORIGIN + route.path);
  html('#site-schema').text(JSON.stringify(structuredData(page)).replace(/</g, '\\u003c'));
  html('#root').attr('data-page', page).html(renderToString(<App initialPage={page} />));
  const directory = path.join('dist', route.path);
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, 'index.html'), html.html());
}
await fs.writeFile('dist/404.html', '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Page not found | Future Minds</title></head><body><main><h1>Page not found</h1><p>This address does not exist.</p><a href="/">Return to Future Minds</a></main></body></html>');
console.log(`Prerendered ${Object.keys(routes).length} routes and a genuine error page.`);