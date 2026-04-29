import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '@/components/Breadcrumb';
import Seo from '@/components/Seo';
import {
  decodeHtmlEntities,
  formatItalianDate,
  getPostsByCategorySlug,
  stripHtml,
  type WordPressPost,
} from '@/lib/wordpress';

function CategoryLoadingPlaceholder() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 h-4 w-56 animate-pulse rounded bg-gray-200" />
        <div className="mb-8 h-10 w-64 animate-pulse rounded bg-gray-200" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="h-72 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-72 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-72 animate-pulse rounded-xl bg-gray-200" />
        </div>
      </div>
    </section>
  );
}

export default function CategoryArchivePage() {
  const { slug = '' } = useParams();
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const categoryPosts = await getPostsByCategorySlug(slug, 18, controller.signal);
        if (isActive) {
          setPosts(categoryPosts);
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        if (isActive) {
          setError('Errore nel caricamento dell’archivio categoria.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchPosts();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, [slug]);

  if (isLoading) return <CategoryLoadingPlaceholder />;

  if (error) {
    return <p className="mx-auto max-w-7xl px-4 py-20 text-center text-[#FE4545]">{error}</p>;
  }

  const title = decodeHtmlEntities(slug.replace(/-/g, ' '));

  return (
    <section className="py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Seo
          title={`Sezione ${title}`}
          description={`Archivio articoli della sezione ${title} su A.I.F.CO.M.`}
          canonicalPath={`/sezione/${slug}`}
          type="website"
        />
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: `Sezione ${title}` },
          ]}
        />

        <h1 className="mb-8 text-3xl font-bold capitalize md:text-4xl">Sezione {title}</h1>

        {posts.length === 0 ? (
          <p className="text-gray-600">Nessun articolo disponibile in questa categoria.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
              const excerpt = stripHtml(post.excerpt.rendered);

              return (
                <article key={post.id} className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                  {imageUrl ? (
                    <img src={imageUrl} alt={stripHtml(post.title.rendered)} className="h-44 w-full object-cover" />
                  ) : (
                    <div className="h-44 w-full bg-gray-100" />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="mb-2 text-sm text-gray-500">{formatItalianDate(post.date)}</p>
                    <h2
                      className="mb-3 text-lg font-semibold text-gray-900"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    <p className="mb-5 flex-1 text-sm text-gray-600">
                      {excerpt.length > 130 ? `${excerpt.slice(0, 130)}...` : excerpt}
                    </p>
                    <Link to={`/articoli/${post.slug}`} className="text-[#4393FF] hover:text-[#4393FF]/80">
                      Leggi articolo →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
