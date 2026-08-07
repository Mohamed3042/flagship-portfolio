/**
 * Static file server for verifying the worlds pages locally.
 *
 * Exists for one reason: the pages scrub video by assigning `currentTime`, and
 * Chrome only allows that if the server advertises `Accept-Ranges: bytes`.
 * Python's `http.server` answers a Range request with a correct 206 but never
 * sends that header, so Chrome reports `video.seekable.length === 0`, every
 * seek is silently a no-op, and a perfectly good page grades as "does not
 * scrub". GitHub Pages does send it; a local harness has to as well or the
 * evidence is about the server.
 *
 *   node scripts/serve-static.mjs <dir> [port]
 */
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { join, normalize, extname, resolve } from 'node:path';

const root = resolve(process.argv[2] || 'dist');
const port = Number(process.argv[3] || 4602);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.mp4': 'video/mp4',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
};

const server = createServer((req, res) => {
  // A scrubbing page abandons range requests constantly, and an abandoned
  // response has written fewer bytes than its Content-Length — which poisons a
  // keep-alive socket for whatever request is pooled onto it next. Closing
  // every connection costs nothing on localhost and removes the whole class.
  res.setHeader('connection', 'close');
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  // the built site may be mounted under a base path; accept it either way
  p = p.replace(/^\/flagship-portfolio/, '') || '/';
  let file = normalize(join(root, p));
  if (!file.startsWith(root)) { res.writeHead(403).end('forbidden'); return; }
  let st;
  try {
    st = statSync(file);
    if (st.isDirectory()) { file = join(file, 'index.html'); st = statSync(file); }
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('not found: ' + p);
    return;
  }
  const type = TYPES[extname(file).toLowerCase()] || 'application/octet-stream';
  const range = req.headers.range;
  if (range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (m) {
      const start = m[1] ? Number(m[1]) : Math.max(0, st.size - Number(m[2]));
      const end = m[1] && m[2] ? Number(m[2]) : st.size - 1;
      if (start >= st.size || end >= st.size || start > end) {
        res.writeHead(416, { 'content-range': `bytes */${st.size}` }).end();
        return;
      }
      res.writeHead(206, {
        'content-type': type,
        'content-length': end - start + 1,
        'content-range': `bytes ${start}-${end}/${st.size}`,
        'accept-ranges': 'bytes',
        'cache-control': 'no-cache',
      });
      if (req.method === 'HEAD') { res.end(); return; }
      pipe(createReadStream(file, { start, end }), res);
      return;
    }
  }
  res.writeHead(200, {
    'content-type': type,
    'content-length': st.size,
    'accept-ranges': 'bytes',      // the whole point of this file
    'cache-control': 'no-cache',
  });
  if (req.method === 'HEAD') { res.end(); return; }
  pipe(createReadStream(file), res);
});
server.keepAliveTimeout = 0;
server.listen(port, () => console.log(`serving ${root} on http://127.0.0.1:${port} (Accept-Ranges: bytes)`));

/**
 * A scrubbing page abandons media fetches constantly — every re-seek and every
 * double-buffer swap aborts one. If the read stream keeps writing into a
 * response the client has already gone away from, the next request on that
 * keep-alive socket gets the tail of the previous body and Chrome reports
 * ERR_INVALID_HTTP_RESPONSE. Tear the stream down with the response.
 */
function pipe(stream, res) {
  stream.on('error', () => res.destroy());
  // Only ever tear down the FILE stream. An earlier version also destroyed the
  // response whenever `writableEnded` was false on 'close' — but 'close' fires
  // on normal completion too, and it can win the race against that flag, so it
  // was resetting sockets on responses that had finished perfectly well and
  // Chrome reported them as ERR_INVALID_HTTP_RESPONSE. Connection: close above
  // already means an abandoned response cannot poison a pooled socket.
  res.on('close', () => stream.destroy());
  stream.pipe(res);
}
