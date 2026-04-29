import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '@/components/Breadcrumb';
import Seo from '@/components/Seo';
import { decodeHtmlEntities, getPageBySlug, stripHtml, type WordPressPage as WordPressPageType } from '@/lib/wordpress';

function PageLoadingPlaceholder() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 h-4 w-56 animate-pulse rounded bg-gray-200" />
        <div className="mb-8 h-10 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-10/12 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </section>
  );
}

export default function WordPressPage() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug') ?? '';
  const [page, setPage] = useState<WordPressPageType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    const fetchPage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setPage(null);
        const wpPage = await getPageBySlug(slug, controller.signal);
        if (isActive) {
          setPage(wpPage);
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }
        if (isActive) {
          setError('Errore nel caricamento della pagina.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchPage();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, [slug]);

  if (isLoading) {
    return <PageLoadingPlaceholder />;
  }

  if (error) {
    return <p className="mx-auto max-w-7xl px-4 py-20 text-center text-[#FE4545]">{error}</p>;
  }

  if (!slug) {
    return <p className="mx-auto max-w-7xl px-4 py-20 text-center text-gray-600">Slug pagina mancante.</p>;
  }

  if (!page) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-12 text-center shadow-sm md:px-10">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Pagina non trovata</h2>
            <p className="mb-8 text-gray-600">
              La pagina richiesta non esiste o potrebbe essere stata spostata.
            </p>
            <a
              href="/"
              className="inline-flex rounded-md bg-[#4393FF] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#4393FF]/90"
            >
              Torna alla home
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Seo
          title={decodeHtmlEntities(stripHtml(page.title.rendered))}
          description={stripHtml(page.content.rendered).slice(0, 155)}
          canonicalPath={`/pages?slug=${slug}`}
          type="article"
          jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: decodeHtmlEntities(stripHtml(page.title.rendered)),
            url: `https://www.aifcom.org/pages?slug=${slug}`,
          }}
        />
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: decodeHtmlEntities(stripHtml(page.title.rendered)) },
          ]}
        />
        <h1
          className="mb-8 text-3xl font-bold md:text-4xl"
          dangerouslySetInnerHTML={{ __html: page.title.rendered }}
        />
        <article
          className="wp-content"
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
      </div>
    </section>
  );
}
