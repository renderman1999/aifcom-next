import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '@/components/Breadcrumb';
import Seo from '@/components/Seo';
import { decodeHtmlEntities, formatItalianDate, getPostBySlug, stripHtml, type WordPressPost as WordPressPostType } from '@/lib/wordpress';

function PostLoadingPlaceholder() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 h-4 w-56 animate-pulse rounded bg-gray-200" />
        <div className="mb-8 h-64 w-full animate-pulse rounded-xl bg-gray-200 md:h-96" />
        <div className="mb-3 h-4 w-40 animate-pulse rounded bg-gray-200" />
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

export default function WordPressPost() {
  const { slug = '' } = useParams();
  const [post, setPost] = useState<WordPressPostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setPost(null);
        const wpPost = await getPostBySlug(slug, controller.signal);
        if (isActive) {
          setPost(wpPost);
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }
        if (isActive) {
          setError('Errore nel caricamento dell’articolo.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchPost();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, [slug]);

  if (isLoading) {
    return <PostLoadingPlaceholder />;
  }

  if (error) {
    return <p className="mx-auto max-w-7xl px-4 py-20 text-center text-[#FE4545]">{error}</p>;
  }

  if (!post) {
    return <p className="mx-auto max-w-7xl px-4 py-20 text-center text-gray-600">Articolo non trovato.</p>;
  }

  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Seo
          title={decodeHtmlEntities(stripHtml(post.title.rendered))}
          description={stripHtml(post.excerpt.rendered).slice(0, 155)}
          canonicalPath={`/articoli/${slug}`}
          image={imageUrl || '/logo_aifcom_header.png'}
          type="article"
          jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: decodeHtmlEntities(stripHtml(post.title.rendered)),
            datePublished: post.date,
            image: imageUrl || 'https://www.aifcom.org/logo_aifcom_header.png',
            mainEntityOfPage: `https://www.aifcom.org/articoli/${slug}`,
          }}
        />
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'News', to: '/#news' },
            { label: decodeHtmlEntities(stripHtml(post.title.rendered)) },
          ]}
        />
        {imageUrl && (
          <img
            src={imageUrl}
            alt={stripHtml(post.title.rendered)}
            className="mb-8 h-64 w-full rounded-xl object-cover md:h-96"
          />
        )}
        <p className="mb-3 text-sm text-gray-500">{formatItalianDate(post.date)}</p>
        <h1
          className="mb-8 text-3xl font-bold md:text-4xl"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <article
          className="wp-content"
          dangerouslySetInnerHTML={{ __html: post.content?.rendered ?? '' }}
        />
      </div>
    </section>
  );
}
