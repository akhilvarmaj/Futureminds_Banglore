import fs from 'fs';
import path from 'path';

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
      html = html.replace(cssMatch[0], `<style>\n${cssContent}\n</style>`);
    }
  }

  // Find js file
  const jsMatch = html.match(/<script type="module"[^>]*src="\/assets\/([^"]+)"[^>]*><\/script>/);
  if (jsMatch && jsMatch[1]) {
    const jsFileName = jsMatch[1];
    const jsPath = path.join(distDir, 'assets', jsFileName);
    if (fs.existsSync(jsPath)) {
      const jsContent = fs.readFileSync(jsPath, 'utf8');
      html = html.replace(jsMatch[0], `<script type="module">\n${jsContent}\n</script>`);
    }
  }

  // Base64 encode logo if available
  const logoPath = path.resolve('public/future_minds_logo.jpg');
  if (fs.existsSync(logoPath)) {
    const logoData = fs.readFileSync(logoPath).toString('base64');
    const dataUri = `data:image/jpeg;base64,${logoData}`;
    html = html.replaceAll('/future_minds_logo.jpg', dataUri);
  }

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
