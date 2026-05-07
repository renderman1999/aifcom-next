function normalizeCmsWpJsonBase(raw) {
  const trimmed = String(raw ?? '')
    .trim()
    .replace(/\/+$/, '');
  if (!trimmed) return '';
  if (trimmed.endsWith('/wp-json')) return trimmed;
  return `${trimmed}/wp-json`;
}

/**
 * Proxy /api/cms/* -> WordPress REST ({CMS…}/wp-json/*).
 * Variabile progetto Vercel: CMS_WP_JSON_BASE_URL (es. http://IP/cms oppure …/cms/wp-json).
 */
export default async function handler(req, res) {
  try {
    const base = normalizeCmsWpJsonBase(process.env.CMS_WP_JSON_BASE_URL || '');
    if (!base) {
      res.status(500).json({
        message:
          'Imposta CMS_WP_JSON_BASE_URL nel progetto Vercel (es. http://TUO_VPS/cms)',
      });
      return;
    }

    const slug = req.query.slug;
    const parts = Array.isArray(slug) ? slug : slug ? [slug] : [];
    const rest = parts.join('/');
    if (!rest) {
      res.status(400).json({ message: 'Path mancante' });
      return;
    }

    const q = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    const target = `${base}/${rest}${q}`;

    const upstream = await fetch(target, {
      method: req.method,
      headers: {
        Accept: req.headers.accept || 'application/json',
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
      },
      redirect: 'follow',
    });

    const body = await upstream.text();
    const ct = upstream.headers.get('content-type');
    if (ct) res.setHeader('Content-Type', ct);
    res.status(upstream.status).send(body);
  } catch (err) {
    res.status(502).json({ message: err instanceof Error ? err.message : String(err) });
  }
}
