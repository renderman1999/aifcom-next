function normalizeCmsWpJsonBase(raw) {
  const trimmed = String(raw ?? '')
    .trim()
    .replace(/\/+$/, '');
  if (!trimmed) return '';
  if (trimmed.endsWith('/wp-json')) return trimmed;
  return `${trimmed}/wp-json`;
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/api/wp/:path*', '/api/wp'],
};

/**
 * Proxy /api/wp/* -> CMS_WP_JSON_BASE_URL/wp-json/...
 * Runtime Node.js: su Vercel l'Edge blocca fetch verso URL con hostname = IP numerico ("Direct IP access is not allowed").
 * In produzione conviene CMS_WP_JSON_BASE_URL con hostname + HTTPS (es. https://cms.tuodominio.it/cms).
 */
export default async function middleware(request) {
  const base = normalizeCmsWpJsonBase(process.env.CMS_WP_JSON_BASE_URL || '');
  if (!base) {
    return new Response(
      JSON.stringify({
        message:
          'Configure CMS_WP_JSON_BASE_URL on Vercel Production (es. http://IP/cms or https://cms.example.com/cms).',
      }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  const url = new URL(request.url);
  const prefix = '/api/wp/';
  const rest = url.pathname.startsWith(prefix)
    ? url.pathname.slice(prefix.length)
    : url.pathname.replace(/^\/api\/wp\/?/, '');
  const target = `${base}/${rest}${url.search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (/^(host|connection|keep-alive)$/i.test(key)) return;
    headers.set(key, value);
  });

  const init = {
    method: request.method,
    headers,
    redirect: 'follow',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body;
  }

  return fetch(target, init);
}
