// SIRC 2026 — site visitor counter (Vercel Serverless Function)
// Storage: Vercel KV / Upstash Redis via its REST API (no npm deps; uses global fetch).
// GET  /api/count          -> returns the current total (read-only)
// POST /api/count  (or ?hit=1) -> increments the total and returns the new value
// ?debug=1 -> returns which env var NAMES were detected (names only, no secrets), to aid setup.
// If no KV store is connected yet, responds { count: null } so the page hides the counter gracefully.

function detectKV(env) {
  const keys = Object.keys(env);
  // URL: a REST URL from a KV/Redis/Upstash integration (any prefix the integration used)
  const urlKey = keys.find(
    (k) => /REST/.test(k) && /URL$/.test(k) && /(KV|REDIS|UPSTASH)/i.test(k)
  );
  // Token: prefer a read-write token (skip READ_ONLY) from the same family
  const tokenKey =
    keys.find(
      (k) =>
        /REST/.test(k) &&
        /TOKEN$/.test(k) &&
        /(KV|REDIS|UPSTASH)/i.test(k) &&
        !/READ_ONLY/i.test(k)
    ) ||
    keys.find((k) => /REST/.test(k) && /TOKEN$/.test(k) && /(KV|REDIS|UPSTASH)/i.test(k));
  return {
    base: urlKey ? env[urlKey] : null,
    token: tokenKey ? env[tokenKey] : null,
    urlKey: urlKey || null,
    tokenKey: tokenKey || null,
  };
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { base, token, urlKey, tokenKey } = detectKV(process.env);

  if (req.query && req.query.debug === '1') {
    return res.status(200).json({ urlKey, tokenKey, hasBase: !!base, hasToken: !!token });
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
