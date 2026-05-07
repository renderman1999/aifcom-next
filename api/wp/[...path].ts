export const config = { runtime: 'edge' as const };

/**
 * Proxy same-origin /api/wp/* -> WordPress REST (es. https://host-del-vps/cms/wp-json/*).
 * Su Vercel imposta CMS_WP_JSON_BASE_URL senza slash finale, es. https://esempio.it/cms/wp-json
 */
export default async function handler(request: Request): Promise<Response> {
  const base = process.env.CMS_WP_JSON_BASE_URL?.replace(/\/+$/, '');
  if (!base) {
    return new Response(
      JSON.stringify({
        message:
          'Configure CMS_WP_JSON_BASE_URL on Vercel (full REST base, e.g. https://your-host/cms/wp-json)',
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

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'follow',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body;
  }

  return fetch(target, init);
}
