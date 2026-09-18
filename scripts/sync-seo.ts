import fs from 'node:fs/promises';
import { load } from 'cheerio';
import { routes, SITE_ORIGIN, structuredData } from '../src/data/siteSeo';

const html = load(await fs.readFile('index.html', 'utf8'));
html('meta[name="description"], meta[name="keywords"], meta[name="robots"], meta[name="author"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"], script[type="application/ld+json"]').remove();
html('title').text(routes.home.title);
const addMeta = (key: string, content: string, property = false) => {
  html('head').append(html('<meta>').attr(property ? 'property' : 'name', key).attr('content', content));
};
addMeta('description', routes.home.description);
addMeta('robots', 'index, follow, max-image-preview:large');
html('head').append(html('<link>').attr({ rel: 'canonical', href: `${SITE_ORIGIN}/` }));
for (const [key, value] of Object.entries({ 'og:site_name': 'Future Minds', 'og:title': routes.home.title, 'og:description': routes.home.description, 'og:type': 'website', 'og:url': `${SITE_ORIGIN}/`, 'og:locale': 'en_IN', 'og:image': `${SITE_ORIGIN}/og/future-minds-1200x630.jpg`, 'og:image:width': '1200', 'og:image:height': '630', 'og:image:alt': 'Future Minds - Robotics, AI and Coding for Grades 1-10 in Ananth Nagar, Electronic City' })) addMeta(key, value, true);
for (const [key, value] of Object.entries({ 'twitter:card': 'summary_large_image', 'twitter:title': routes.home.title, 'twitter:description': routes.home.description, 'twitter:image': `${SITE_ORIGIN}/og/future-minds-1200x630.jpg`, 'twitter:image:alt': 'Future Minds robotics, AI and coding classes' })) addMeta(key, value);
html('head').append(html('<script>').attr({ type: 'application/ld+json', id: 'site-schema' }).text(JSON.stringify(structuredData('home')).replace(/</g, '\\u003c')));
html('link[rel="icon"]').attr({ href: '/favicon-48.png', type: 'image/png', sizes: '48x48' });
if (!html('link[rel="apple-touch-icon"]').length) html('head').append('<link rel="apple-touch-icon" href="/apple-touch-icon.png">');
await fs.writeFile('index.html', html.html().replace(/[ \t]+$/gm, ''));
const metadata = JSON.parse(await fs.readFile('metadata.json', 'utf8'));
metadata.name = 'Future Minds';
metadata.description = routes.home.description;
await fs.writeFile('metadata.json', JSON.stringify(metadata, null, 2) + '\n');
await fs.writeFile('public/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`);
await fs.writeFile('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.values(routes).map(route => `  <url><loc>${SITE_ORIGIN}${route.path}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log('Synced source metadata, robots and 12 canonical sitemap URLs.');