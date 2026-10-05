import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { documentRoutes as documents } from './lib/documents.js';

const root = fileURLToPath(new URL('.', import.meta.url));
const workspace = path.resolve(process.env.CDA_WORKSPACE || path.dirname(root));
const port = Number(process.env.CDA_PORT || 4173);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('CDA_PORT doit être compris entre 1024 et 65535.');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.pdf': 'application/pdf', '.svg': 'image/svg+xml' };
const server = http.createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${port}`).pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    const permitted = ['index.html', 'styles.css', 'app.js', 'favicon.svg'].includes(relative) || /^(data|lib)\/[a-zA-Z0-9_-]+\.js$/.test(relative);
    if (!documents[pathname] && !permitted) { res.writeHead(404); res.end('Page introuvable'); return; }
    const target = documents[pathname] ? path.join(workspace, documents[pathname]) : path.join(root, relative);
    const bytes = await readFile(target);
    res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'" });
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch { res.writeHead(404); res.end('Document introuvable'); }
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `Le port ${port} est déjà utilisé. Ouvre http://127.0.0.1:${port} si CDA Studio tourne déjà, ou choisis un autre port avec CDA_PORT=4174 npm start.` : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${port}`;
  console.log(`\n  CDA Studio est prêt → ${url}\n  Arrêter : Ctrl+C\n`);
  if (process.argv.includes('--open')) {
    const command = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'explorer.exe' : 'xdg-open';
    const child = spawn(command, [url], { stdio: 'ignore' });
    child.on('error', () => {});
    child.unref();
  }
});
