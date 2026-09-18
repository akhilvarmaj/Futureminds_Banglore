import fs from 'fs';
import path from 'path';
import { buildSync } from 'esbuild';
import { load } from 'cheerio';

function generateSingleHtml() {
  const distDir = path.resolve('dist');
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('dist/index.html not found. Run npm run build first.');
    return;
  }

  let html = fs.readFileSync(indexHtmlPath, 'utf8');

  // Find css file
  const cssMatch = html.match(/<link rel="stylesheet"[^>]*href="\/assets\/([^"]+)"[^>]*>/);
  if (cssMatch && cssMatch[1]) {
    const cssFileName = cssMatch[1];
    const cssPath = path.join(distDir, 'assets', cssFileName);
    if (fs.existsSync(cssPath)) {
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      html = html.replace(cssMatch[0], () => `<style>\n${cssContent}\n</style>`);
    }
  }

  // Find js file
  const jsMatch = html.match(/<script type="module"[^>]*src="\/assets\/([^"]+)"[^>]*><\/script>/);
  if (jsMatch && jsMatch[1]) {
    const jsFileName = jsMatch[1];
    const jsPath = path.join(distDir, 'assets', jsFileName);
    if (fs.existsSync(jsPath)) {
      const jsContent = buildSync({ entryPoints: [jsPath], bundle: true, write: false, format: 'iife', minify: true }).outputFiles[0].text;
      html = html.replace(jsMatch[0], () => `<script type="module">\n${jsContent.replace(/<\/script/gi, '<\\/script')}\n</script>`);
    }
  }

  const document = load(html);
  document('meta[name="robots"]').attr('content', 'noindex, follow');
  for (const [asset, type] of [['future_minds_logo-96.webp', 'image/webp'], ['favicon-48.png', 'image/png'], ['apple-touch-icon.png', 'image/png']]) {
    const dataUri = `data:${type};base64,${fs.readFileSync(path.resolve('public', asset)).toString('base64')}`;
    document(`img[src="/${asset}"], link[href="/${asset}"]`).each((_, element) => {
      document(element).attr(element.tagName === 'img' ? 'src' : 'href', dataUri);
    });
    document('script[type="module"]').each((_, element) => {
      document(element).text(document(element).text().replaceAll(`"/${asset}"`, JSON.stringify(dataUri)));
    });
  }
  html = document.html();

  // Write single-file html to root, public, and dist
  const outRoot = path.resolve('future_minds_sharable.html');
  fs.writeFileSync(outRoot, html, 'utf8');

  const outPublic = path.resolve('public/future_minds_sharable.html');
  fs.writeFileSync(outPublic, html, 'utf8');

  const outDist = path.resolve('dist/future_minds_sharable.html');
  fs.writeFileSync(outDist, html, 'utf8');

  console.log(`Successfully generated self-contained HTML: ${outRoot}`);
}

generateSingleHtml();
