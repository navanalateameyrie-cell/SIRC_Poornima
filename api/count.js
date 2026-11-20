// SIRC 2026 — site visitor counter (Vercel Serverless Function)
// Storage: Vercel KV / Upstash Redis via its REST API (no npm deps; uses global fetch).
// GET  /api/count          -> returns the current total (read-only)
// POST /api/count  (or ?hit=1) -> increments the total and returns the new value
// If no KV store is connected yet, responds { count: null } so the page hides the counter gracefully.

module.exports = async (req, res) => {
  const base =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.STORAGE_KV_REST_API_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.STORAGE_KV_REST_API_TOKEN;

  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');

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
