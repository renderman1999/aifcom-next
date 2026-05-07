function normalizeCmsWpJsonBase(raw) {
  const trimmed = String(raw ?? '')
    .trim()
    .replace(/\/+$/, '');
  if (!trimmed) return '';
  if (trimmed.endsWith('/wp-json')) return trimmed;
  return `${trimmed}/wp-json`;
}

export const config = {
  matcher: ['/api/wp/:path*', '/api/wp'],
};

/**
 * Proxy Edge: /api/wp/* -> {CMS_WP_JSON_BASE_URL}/*
 * Necessario perché le cartelle /api con Vite SPA spesso non diventano Serverless Functions su Vercel.
 */
export default async function middleware(request) {
  const base = normalizeCmsWpJsonBase(process.env.CMS_WP_JSON_BASE_URL || '');
  if (!base) {
    return new Response(
      JSON.stringify({
        message:
          'Configure CMS_WP_JSON_BASE_URL for Production on Vercel (and enable it for Edge if prompted).',
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
