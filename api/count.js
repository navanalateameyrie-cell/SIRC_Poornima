// SIRC 2026 — site visitor counter (Vercel Serverless Function)
// Storage: Vercel KV / Upstash Redis via its REST API (no npm deps; uses global fetch).
// GET  /api/count          -> returns the current total (read-only)
// POST /api/count  (or ?hit=1) -> increments the total and returns the new value
// ?debug=1 -> returns which env var NAMES were detected (names only, no secrets), to aid setup.
// If no KV store is connected yet, responds { count: null } so the page hides the counter gracefully.

function detectKV(env) {
  const keys = Object.keys(env);
  // URL: any REST(ful) HTTPS URL from a KV/Redis/Upstash integration (any prefix)
  const urlKey = keys.find(
    (k) => /REST/.test(k) && /URL$/.test(k) && /^https?:/i.test(String(env[k] || ''))
  ) || keys.find((k) => /REST/.test(k) && /URL$/.test(k));
  // Token: prefer a read-write token (skip READ_ONLY)
  const tokenKey =
    keys.find((k) => /REST/.test(k) && /TOKEN$/.test(k) && !/READ_ONLY/i.test(k)) ||
    keys.find((k) => /REST/.test(k) && /TOKEN$/.test(k));
  return {
    base: urlKey ? env[urlKey] : null,
    token: tokenKey ? env[tokenKey] : null,
    urlKey: urlKey || null,
    tokenKey: tokenKey || null,
  };
}

function storageKeyNames(env) {
  return Object.keys(env).filter((k) =>
    /(REST|REDIS|UPSTASH|KV|STORAGE)/i.test(k)
  );
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { base, token, urlKey, tokenKey } = detectKV(process.env);

  if (req.query && req.query.debug === '1') {
    return res.status(200).json({
      urlKey,
      tokenKey,
      hasBase: !!base,
      hasToken: !!token,
      storageKeys: storageKeyNames(process.env),
    });
  }

  if (!base || !token) {
    return res.status(200).json({ count: null, error: 'kv-not-configured' });
  }

  const key = 'sirc_visits';
  const hit = req.method === 'POST' || (req.query && req.query.hit === '1');
  const path = hit ? `incr/${key}` : `get/${key}`;

  try {
    const r = await fetch(`${base.replace(/\/$/, '')}/${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await r.json();
    let count = data && (data.result !== undefined ? data.result : data);
    if (count === null || count === undefined || count === '') count = 0;
    return res.status(200).json({ count: Number(count) });
  } catch (e) {
    return res.status(200).json({ count: null, error: 'kv-error' });
  }
};
