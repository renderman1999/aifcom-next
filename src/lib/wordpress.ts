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
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string }>;
  };
};

export type WordPressPage = {
  id: number;
  slug: string;
  link: string;
  title: WordPressRenderedText;
  content: WordPressRenderedText;
};

const configuredApiRoot = import.meta.env.VITE_WP_API_URL?.trim();
const hasUnresolvedTemplate = configuredApiRoot?.includes('${');
const sanitizedApiRoot = hasUnresolvedTemplate ? undefined : configuredApiRoot;

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

export async function getPageBySlug(slug: string, signal?: AbortSignal) {
  const pages = await fetchWp<WordPressPage[]>(`/pages?slug=${encodeURIComponent(slug)}`, signal);
  return pages[0] ?? null;
}

export async function getPostBySlug(slug: string, signal?: AbortSignal) {
  const posts = await fetchWp<WordPressPost[]>(`/posts?slug=${encodeURIComponent(slug)}&_embed`, signal);
  return posts[0] ?? null;
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
