import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const port = Number(process.env.PORT || 3002);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.xml': 'application/xml', '.txt': 'text/plain', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png' };
http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/future_minds_sharable' || pathname === '/future_minds_sharable/') {
      response.writeHead(308, { Location: '/future_minds_sharable.html' }); response.end(); return;
    }
    let file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) && file !== root) throw new Error('Invalid path');
    let stat = await fs.stat(file);
    if (stat.isDirectory()) {
      if (!pathname.endsWith('/')) { response.writeHead(308, { Location: pathname + '/' }); response.end(); return; }
      file = path.join(file, 'index.html');
      stat = await fs.stat(file);
    }
    if (!stat.isFile()) throw new Error('Not a file');
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    response.end(request.method === 'HEAD' ? undefined : await fs.readFile(file));
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(await fs.readFile(path.join(root, '404.html')));
  }
}).listen(port, '127.0.0.1', () => console.log(`Read-only production preview: http://localhost:${port}`));