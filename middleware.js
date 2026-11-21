// Vercel Edge Middleware — "Launching Soon" gate for the static SIRC site.
// Public visitors see /coming-soon. A secret bypass (?preview=<PREVIEW_SECRET>)
// sets an HttpOnly cookie (7 days) so the client can browse the full site.
// Flip LAUNCH_LIVE=true in Vercel env to remove the wall at launch (no code change).

export const config = {
  // Run on everything EXCEPT the coming-soon page and the favicon
  // (so the wall page and its tab icon always load, and there is no redirect loop).
  matcher: ['/((?!coming-soon|favicon\\.svg).*)'],
};

const COOKIE = 'site_preview=true; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800';

export default function middleware(request) {
  const env = (typeof process !== 'undefined' && process.env) || {};

  // Launch switch: wall removed entirely when LAUNCH_LIVE === 'true'
  if (env.LAUNCH_LIVE === 'true') {
    return new Response(null, { headers: { 'x-middleware-next': '1' } });
  }

  const SECRET = env.PREVIEW_SECRET || 'client2026';
  const url = new URL(request.url);
  const preview = url.searchParams.get('preview');
  const cookie = request.headers.get('cookie') || '';
  const unlocked = /(?:^|;\s*)site_preview=true(?:;|$)/.test(cookie);

  // Secret bypass: set cookie, then redirect to the clean URL (drop ?preview)
  if (preview !== null) {
    if (preview === SECRET) {
      url.searchParams.delete('preview');
      const qs = url.searchParams.toString();
      const dest = url.pathname + (qs ? '?' + qs : '');
      const headers = new Headers();
      headers.set('Location', dest || '/');
      headers.append('Set-Cookie', COOKIE);
      return new Response(null, { status: 307, headers });
    }
    // Wrong code -> back to the wall with an error flag
    return new Response(null, { status: 307, headers: { Location: '/coming-soon?denied=1' } });
  }

  // Already unlocked -> let the real site through
  if (unlocked) {
    return new Response(null, { headers: { 'x-middleware-next': '1' } });
  }

  // Public -> show the Launching Soon page (URL stays; content is the wall)
  const rewriteUrl = new URL('/coming-soon', url.origin);
  return new Response(null, { headers: { 'x-middleware-rewrite': rewriteUrl.toString() } });
}
