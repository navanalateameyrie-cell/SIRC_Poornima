// SIRC 2026 — site visitor counter (Vercel Serverless Function)
// Works with EITHER an Upstash REST store (KV_REST_API_URL/TOKEN) OR a native
// Redis connection string (REDIS_URL / rediss://). No npm dependencies.
// GET  /api/count          -> read current total
// POST /api/count (or ?hit=1) -> increment and return new total
// ?debug=1 -> report what credentials were detected (names only, no secrets)

const tls = require('tls');
const net = require('net');

function detectRest(env) {
  const keys = Object.keys(env);
  const urlKey =
    keys.find((k) => /REST/.test(k) && /URL$/.test(k) && /^https?:/i.test(String(env[k] || ''))) ||
    null;
  const tokenKey =
    keys.find((k) => /REST/.test(k) && /TOKEN$/.test(k) && !/READ_ONLY/i.test(k)) ||
    keys.find((k) => /REST/.test(k) && /TOKEN$/.test(k)) ||
    null;
  return { base: urlKey ? env[urlKey] : null, token: tokenKey ? env[tokenKey] : null, urlKey, tokenKey };
}

function detectRedisUrl(env) {
  const key = Object.keys(env).find((k) => /^rediss?:\/\//i.test(String(env[k] || '')));
  return { redisUrl: key ? env[key] : null, redisKey: key || null };
}

// Minimal RESP client: AUTH then run one command, return its reply value.
function redisCommand(redisUrl, args) {
  return new Promise((resolve, reject) => {
    let u;
    try { u = new URL(redisUrl); } catch (e) { return reject(new Error('bad-redis-url')); }
    const useTls = u.protocol === 'rediss:';
    const host = u.hostname;
    const port = Number(u.port || 6379);
    const password = decodeURIComponent(u.password || '');
    const username = decodeURIComponent(u.username || '');

    const encode = (arr) => {
      let s = '*' + arr.length + '\r\n';
      for (const a of arr) { const v = String(a); s += '$' + Buffer.byteLength(v) + '\r\n' + v + '\r\n'; }
      return s;
    };
    const cmds = [];
    if (password) cmds.push(username && username !== 'default' ? ['AUTH', username, password] : ['AUTH', password]);
    cmds.push(args);
    const payload = cmds.map(encode).join('');
    const need = cmds.length;

    const socket = useTls
      ? tls.connect({ host, port, servername: host }, () => socket.write(payload))
      : net.connect({ host, port }, () => socket.write(payload));
    socket.setTimeout(4500);

    let buf = Buffer.alloc(0);
    const replies = [];
    let done = false;

    function parseOne(start) {
      if (start >= buf.length) return null;
      const type = String.fromCharCode(buf[start]);
      const nl = buf.indexOf('\r\n', start);
      if (nl === -1) return null;
      const line = buf.slice(start + 1, nl).toString();
      if (type === '+' || type === '-' || type === ':') return { value: type === ':' ? Number(line) : line, next: nl + 2 };
      if (type === '$') {
        const len = Number(line);
        if (len === -1) return { value: null, next: nl + 2 };
        const ds = nl + 2, de = ds + len;
        if (de + 2 > buf.length) return null;
        return { value: buf.slice(ds, de).toString(), next: de + 2 };
      }
      if (type === '*') {
        const len = Number(line);
        if (len === -1) return { value: null, next: nl + 2 };
        let next = nl + 2; const items = [];
        for (let i = 0; i < len; i++) { const r = parseOne(next); if (!r) return null; items.push(r.value); next = r.next; }
        return { value: items, next };
      }
      return null;
    }
    function finish() {
      if (done) return; done = true;
      try { socket.end(); } catch (e) {}
      const last = replies[replies.length - 1];
      if (!last) return reject(new Error('no-reply'));
      resolve(last.value);
    }
    function pump() {
      let off = 0;
      while (replies.length < need) { const r = parseOne(off); if (!r) break; replies.push(r); off = r.next; }
      if (off > 0) buf = buf.slice(off);
      if (replies.length >= need) finish();
    }
    socket.on('data', (d) => { buf = Buffer.concat([buf, d]); pump(); });
    socket.on('timeout', () => { if (!done) { done = true; try { socket.destroy(); } catch (e) {} reject(new Error('timeout')); } });
    socket.on('error', (e) => { if (!done) { done = true; reject(e); } });
    socket.on('end', () => { if (!done) { done = true; reject(new Error('closed')); } });
  });
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const rest = detectRest(process.env);
  const { redisUrl, redisKey } = detectRedisUrl(process.env);

  if (req.query && req.query.debug === '1') {
    return res.status(200).json({
      mode: rest.base && rest.token ? 'rest' : redisUrl ? 'redis' : 'none',
      urlKey: rest.urlKey, tokenKey: rest.tokenKey, redisKey,
    });
  }

  const key = 'sirc_visits';
  const hit = req.method === 'POST' || (req.query && req.query.hit === '1');

  try {
    // Preferred: native Redis (what this project has via REDIS_URL)
    if (redisUrl) {
      const v = await redisCommand(redisUrl, hit ? ['INCR', key] : ['GET', key]);
      const count = v === null || v === undefined || v === '' ? 0 : Number(v);
      return res.status(200).json({ count });
    }
    // Fallback: Upstash REST
    if (rest.base && rest.token) {
      const path = hit ? `incr/${key}` : `get/${key}`;
      const r = await fetch(`${rest.base.replace(/\/$/, '')}/${path}`, { headers: { Authorization: `Bearer ${rest.token}` } });
      const data = await r.json();
      let count = data && (data.result !== undefined ? data.result : data);
      if (count === null || count === undefined || count === '') count = 0;
      return res.status(200).json({ count: Number(count) });
    }
    return res.status(200).json({ count: null, error: 'kv-not-configured' });
  } catch (e) {
    return res.status(200).json({ count: null, error: 'kv-error', detail: String(e && e.message || e) });
  }
};
