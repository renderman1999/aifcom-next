export type WordPressCategory = {
  id: number;
  slug: string;
};

export type WordPressRenderedText = {
  rendered: string;
};

export type WordPressPost = {
  id: number;
  slug: string;
  date: string;
  link: string;
  title: WordPressRenderedText;
  excerpt: WordPressRenderedText;
  content?: WordPressRenderedText;
  categories?: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string }>;
    'wp:term'?: Array<Array<{ id: number; slug: string; name: string; taxonomy: string }>>;
  };
};

export type WordPressPage = {
  id: number;
  slug: string;
  link: string;
  title: WordPressRenderedText;
  content: WordPressRenderedText;
};

export type WordPressMenuItemApi = {
  ID: number;
  title: string;
  url: string;
  target: string;
  classes?: string[];
  menu_order: number;
  menu_item_parent: string;
  object: string;
  type?: string;
};

export type WordPressMenuItem = {
  id: number;
  label: string;
  url: string | null;
  target: string | null;
  classes: string[];
  children: WordPressMenuItem[];
};

const configuredApiRoot = import.meta.env.VITE_WP_API_URL?.trim();
const hasUnresolvedTemplate = configuredApiRoot?.includes('${');
const sanitizedApiRoot = hasUnresolvedTemplate ? undefined : configuredApiRoot;

/**
 * Production should use the full REST base in VITE_WP_API_URL (e.g. https://www.../cms/wp-json).
 * Same-origin /api/wp only works if both the apex and www are on Vercel: if the apex redirects
 * to www and www still points to the old host, /api/wp never hits the Vercel rewrite. Direct
 * calls to the CMS host work: WordPress already sends Access-Control-Allow-Origin for the
 * requesting site (aifcom.org, Vercel previews, etc.).
 * On Vercel, /api/wp is proxied by api/wp/[...path].ts using env CMS_WP_JSON_BASE_URL (full base, no trailing slash).
 */
const WP_API_ROOT = import.meta.env.DEV
  ? '/wp-json'
  : (sanitizedApiRoot ?? '/api/wp');

const WP_API_BASE = `${WP_API_ROOT}/wp/${import.meta.env.VITE_WP_API_VERSION ?? 'v2'}`;

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWp<T>(path: string, signal?: AbortSignal): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(`${WP_API_BASE}${path}`, { signal });
      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`);
      }
      return response.json() as Promise<T>;
    } catch (error) {
      const typedError = error as Error;
      if (typedError.name === 'AbortError') {
        throw typedError;
      }
      lastError = typedError;
      if (attempt < 2) {
        await sleep(250 * (attempt + 1));
      }
    }
  }

  throw lastError ?? new Error('WordPress API error');
}

export async function getCategoryBySlug(slug: string, signal?: AbortSignal) {
  const categories = await fetchWp<WordPressCategory[]>(`/categories?slug=${encodeURIComponent(slug)}`, signal);
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getLatestPostsByCategorySlug(slug: string, limit = 6, signal?: AbortSignal) {
  const category = await getCategoryBySlug(slug, signal);
  if (!category) {
    return [];
  }

  return fetchWp<WordPressPost[]>(
    `/posts?categories=${category.id}&per_page=${limit}&_embed`,
    signal,
  );
}

export async function getPostsByCategorySlug(slug: string, limit = 12, signal?: AbortSignal) {
  const category = await getCategoryBySlug(slug, signal);
  if (!category) {
    return [];
  }

  return fetchWp<WordPressPost[]>(
    `/posts?categories=${category.id}&per_page=${limit}&_embed`,
    signal,
  );
}

export async function getPageBySlug(slug: string, signal?: AbortSignal) {
  const pages = await fetchWp<WordPressPage[]>(`/pages?slug=${encodeURIComponent(slug)}`, signal);
  return pages[0] ?? null;
}

export async function getPostBySlug(slug: string, signal?: AbortSignal) {
  const posts = await fetchWp<WordPressPost[]>(`/posts?slug=${encodeURIComponent(slug)}&_embed`, signal);
  return posts[0] ?? null;
}

function normalizeWordPressMenuUrl(item: WordPressMenuItemApi) {
  if (!item.url || item.url === '#') {
    return null;
  }

  const normalized = item.url.trim();
  const isAbsolute = /^https?:\/\//i.test(normalized);
  const isAifcomDomain = /^https?:\/\/(www\.)?aifcom\.org/i.test(normalized);
  const canParseAsUrl = isAbsolute || normalized.startsWith('/');

  if (canParseAsUrl) {
    const parsed = new URL(normalized, 'https://www.aifcom.org');
    const pathname = parsed.pathname.replace(/\/+$/, '');
    const routingPath = pathname.replace(/^\/cms(?=\/|$)/, '') || '/';
    const segments = routingPath.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] ?? '';

    if (item.object === 'page' && lastSegment) {
      return `/pages?slug=${lastSegment}`;
    }

    if (item.object === 'post' && lastSegment) {
      return `/articoli/${lastSegment}`;
    }

    if (item.object === 'category' && lastSegment) {
      return `/sezione/${lastSegment}`;
    }

    if (isAifcomDomain && lastSegment) {
      if (routingPath.startsWith('/sezione/')) {
        return `/sezione/${lastSegment}`;
      }

      if (routingPath.startsWith('/category/') || routingPath.startsWith('/categoria/')) {
        return `/sezione/${lastSegment}`;
      }

      return `/pages?slug=${lastSegment}`;
    }

    if (isAifcomDomain && !lastSegment) {
      return '/';
    }
  }

  return normalized;
}

export async function getMenuTree(signal?: AbortSignal) {
  const rawItems = await fetchWp<WordPressMenuItemApi[]>('/menu', signal);
  const sortedItems = [...rawItems].sort((a, b) => a.menu_order - b.menu_order);
  const byId = new Map<number, WordPressMenuItem>();
  const roots: WordPressMenuItem[] = [];

  sortedItems.forEach((item) => {
    byId.set(item.ID, {
      id: item.ID,
      label: decodeHtmlEntities(item.title),
      url: normalizeWordPressMenuUrl(item),
      target: item.target || null,
      classes: (item.classes ?? []).filter((className) => className.trim().length > 0),
      children: [],
    });
  });

  sortedItems.forEach((item) => {
    const current = byId.get(item.ID);
    if (!current) return;

    const parentId = Number(item.menu_item_parent);
    if (!parentId) {
      roots.push(current);
      return;
    }

    const parent = byId.get(parentId);
    if (parent) {
      parent.children.push(current);
    } else {
      roots.push(current);
    }
  });

  return roots;
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function decodeHtmlEntities(value: string) {
  if (typeof window === 'undefined') {
    return value;
  }

  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
}

export function formatItalianDate(date: string) {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function getPrimaryCategoryFromPost(post: WordPressPost) {
  const embeddedTerms = post._embedded?.['wp:term'] ?? [];
  const flatTerms = embeddedTerms.flat();
  const categories = flatTerms.filter((term) => term.taxonomy === 'category');

  if (categories.length > 0) {
    return categories[0];
  }

  return null;
}
