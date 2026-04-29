import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type WordPressCategory = {
  id: number;
  slug: string;
};

type WordPressPost = {
  id: number;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string }>;
  };
};

type ServiceCard = {
  title: string;
  description: string;
  borderClass: string;
  linkClass: string;
};

const WP_API_BASE = `${import.meta.env.VITE_WP_API_URL ?? 'https://www.aifcom.org/wp-json'}/wp/${import.meta.env.VITE_WP_API_VERSION ?? 'v2'}`;

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function formatItalianDate(date: string) {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsPosts, setNewsPosts] = useState<WordPressPost[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const serviceCards: ServiceCard[] = [
    {
      title: 'Supporto alla Coppia e alla Famiglia',
      description: 'Offriamo supporto professionale alle coppie e famiglie miste per affrontare le sfide quotidiane.',
      borderClass: 'border-[#4393FF]',
      linkClass: 'text-[#4393FF] hover:text-[#4393FF]/80',
    },
    {
      title: 'Equipe Multi Professionale',
      description: 'Un team di professionisti qualificati pronti ad aiutarti in ogni aspetto.',
      borderClass: 'border-[#FE4545]',
      linkClass: 'text-[#FE4545] hover:text-[#FE4545]/80',
    },
    {
      title: 'Ricerca Scientifica',
      description: 'Promuoviamo la ricerca scientifica sulle famiglie e coppie miste.',
      borderClass: 'border-[#FFAA3B]',
      linkClass: 'text-[#FFAA3B] hover:text-[#FFAA3B]/80',
    },
    {
      title: 'Attivita Territoriali',
      description: 'Organizziamo eventi e incontri su tutto il territorio nazionale.',
      borderClass: 'border-[#4393FF]',
      linkClass: 'text-[#4393FF] hover:text-[#4393FF]/80',
    },
    {
      title: 'Spazio di Parola',
      description: 'Uno spazio sicuro per condividere esperienze e confrontarsi.',
      borderClass: 'border-[#FE4545]',
      linkClass: 'text-[#FE4545] hover:text-[#FE4545]/80',
    },
    {
      title: 'Supporto Burocratico Legale',
      description: 'Assistenza nelle pratiche burocratiche e legali.',
      borderClass: 'border-[#FFAA3B]',
      linkClass: 'text-[#FFAA3B] hover:text-[#FFAA3B]/80',
    },
  ];

  useEffect(() => {
    const controller = new AbortController();

    const fetchLatestNews = async () => {
      try {
        setIsNewsLoading(true);
        setNewsError(null);

        const categoryResponse = await fetch(`${WP_API_BASE}/categories?slug=news`, {
          signal: controller.signal,
        });

        if (!categoryResponse.ok) {
          throw new Error('Impossibile recuperare la categoria news.');
        }

        const categories: WordPressCategory[] = await categoryResponse.json();
        const newsCategory = categories.find((category) => category.slug === 'news');

        if (!newsCategory) {
          setNewsPosts([]);
          return;
        }

        const postsResponse = await fetch(
          `${WP_API_BASE}/posts?categories=${newsCategory.id}&per_page=6&_embed`,
          { signal: controller.signal },
        );

        if (!postsResponse.ok) {
          throw new Error('Impossibile recuperare gli articoli.');
        }

        const posts: WordPressPost[] = await postsResponse.json();
        setNewsPosts(posts);
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }

        setNewsError('Non siamo riusciti a caricare le ultime news.');
      } finally {
        setIsNewsLoading(false);
      }
    };

    fetchLatestNews();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#F3A419] shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <img src="/logo_aifcom_header.png" alt="A.I.F.CO.M." className="h-12 w-auto" />
              <span className="text-center font-semibold leading-tight md:text-left text-left">
                A.i.f.co.m.<br className="hidden md:block"/>Associazione Italiana Famiglie e Coppie Miste
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <a href="#chi-siamo" className="hover:text-[#4393FF] transition-colors">Chi Siamo</a>
              <a href="#cosa-facciamo" className="hover:text-[#4393FF] transition-colors">Cosa Facciamo</a>
              <a href="#servizi" className="hover:text-[#4393FF] transition-colors">Servizi</a>
              <a href="#contatti" className="hover:text-[#4393FF] transition-colors">Contatti</a>
              <button className="rounded-md bg-[#FE4545] px-6 py-2 text-white hover:shadow-lg transition-shadow hover:bg-[#FE4545]/90">
                Dona Ora
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-3">
              <a href="#chi-siamo" className="block py-2 hover:text-[#4393FF]">Chi Siamo</a>
              <a href="#cosa-facciamo" className="block py-2 hover:text-[#4393FF]">Cosa Facciamo</a>
              <a href="#servizi" className="block py-2 hover:text-[#4393FF]">Servizi</a>
              <a href="#contatti" className="block py-2 hover:text-[#4393FF]">Contatti</a>
              <button className="w-full rounded-md bg-[#FE4545] px-6 py-2 text-white hover:bg-[#FE4545]/90">
                Dona Ora
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl md:text-6xl">
              Sei una coppia o<br />una famiglia mista?
            </h1>
     
            <button className="rounded-md bg-[#4393FF] px-8 py-3 text-lg uppercase font-bold text-white hover:shadow-lg transition-shadow hover:bg-[#4393FF]/90">
              Contattaci
            </button>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-[#FE4545] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl text-white md:text-4xl font-bold">
            "ESSERE DIVERSI NON CI DIVIDE<br />PERCHÉ L'AMORE CI UNISCE"
          </h2>
        </div>
      </section>

      {/* About Section */}
      <section id="chi-siamo" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="flex justify-center">
              <img
                src="/logo_aifcom_header.png"
                alt="Logo A.I.F.CO.M."
                className="h-30 w-auto object-contain"
              />
            </div>
            <div>
              <h2 className="mb-6 text-center text-3xl md:text-left md:text-4xl">A.I.F.CO.M.</h2>
              <h3 className="mb-4 text-center text-xl text-gray-600 md:text-left">
                Associazione Italiana Famiglie e Coppie Miste
              </h3>
              <p className="mb-4 text-justify text-gray-700 leading-relaxed md:text-left">
                A.i.f.co.m. aps è un'associazione di promozione sociale senza scopo di lucro nata
                dall'unione tra diverse sensibilità e professionalità, con l'obiettivo di essere
                il punto di riferimento per tutte le coppie e le famiglie "miste" in Italia.
              </p>
              <p className="mb-4 text-justify text-gray-700 leading-relaxed md:text-left">
                Siamo convinti che le unioni miste siano il barometro fondamentale con cui misurare
                la qualità dei rapporti tra persone di differente origine nazionale, culturale o religiosa.
              </p>
              <p className="text-justify text-gray-700 leading-relaxed md:text-left">
                Il valore dell'unione che coinvolge due o più persone di nazioni, culture o religioni
                differenti costituisce uno dei motori principali del cambiamento e del rinnovamento
                della società odierna.
              </p>
              <a href="#" className="mt-6 inline-block w-full text-center text-[#4393FF] underline hover:text-[#4393FF]/80 md:w-auto md:text-left">
                Scopri di più su Aifcom →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servizi" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl md:text-4xl">COSA FACCIAMO?</h2>
          </div>

          <div className="md:hidden">
            <Swiper
              modules={[Pagination]}
              spaceBetween={16}
              slidesPerView={1.1}
              pagination={{ clickable: true }}
              className="pb-12"
            >
              {serviceCards.map((service) => (
                <SwiperSlide key={service.title}>
                  <div className={`group flex h-full flex-col rounded-lg border-l-4 bg-white p-8 shadow-md transition-shadow hover:shadow-xl ${service.borderClass}`}>
                    <h3 className="mb-3 text-xl uppercase font-bold">
                      {service.title}
                    </h3>
                    <p className="mb-4 flex-1 text-gray-600">{service.description}</p>
                    <a href="#" className={service.linkClass}>
                      Scopri di più →
                    </a>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map((service) => (
              <div key={service.title} className={`group flex h-full flex-col rounded-lg border-l-4 bg-white p-8 shadow-md transition-shadow hover:shadow-xl ${service.borderClass}`}>
                <h3 className="mb-3 text-xl uppercase">
                  {service.title}
                </h3>
                <p className="mb-4 flex-1 text-gray-600">{service.description}</p>
                <a href="#" className={service.linkClass}>
                  Scopri di più →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#4393FF] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-3xl text-white md:text-4xl">
            Unisciti a Noi
          </h2>
          <p className="mb-8 text-xl text-white/90">
            Diventa parte della nostra comunità e contribuisci a costruire una società più inclusiva.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="rounded-md bg-white px-8 py-3 text-lg text-[#4393FF] hover:bg-gray-100 transition-colors">
              Associati
            </button>
            <button className="rounded-md border-2 border-white px-8 py-3 text-lg text-white hover:bg-white hover:text-[#4393FF] transition-colors">
              Dona il 5x1000
            </button>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl md:text-4xl uppercase">Ultime news</h2>
         
          </div>

          {isNewsLoading && (
            <p className="text-center text-gray-600">Caricamento news in corso...</p>
          )}

          {!isNewsLoading && newsError && (
            <p className="text-center text-[#FE4545]">{newsError}</p>
          )}

          {!isNewsLoading && !newsError && newsPosts.length === 0 && (
            <p className="text-center text-gray-600">Nessun articolo disponibile nella categoria news.</p>
          )}

          {!isNewsLoading && !newsError && newsPosts.length > 0 && (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1280: { slidesPerView: 4 },
              }}
            >
              {newsPosts.map((post) => {
                const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                const excerpt = stripHtml(post.excerpt.rendered);

                return (
                  <SwiperSlide key={post.id} className="pb-12">
                    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={stripHtml(post.title.rendered)}
                          className="h-52 w-full object-cover"
                        />
                      ) : (
                        <div className="h-52 w-full bg-gray-100" />
                      )}

                      <div className="flex flex-1 flex-col p-6">
                        <p className="mb-3 text-sm text-gray-500">{formatItalianDate(post.date)}</p>
                        <h3
                          className="mb-3 text-xl font-semibold text-gray-900"
                          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                        />
                        <p className="mb-6 flex-1 text-gray-600">
                          {excerpt.length > 140 ? `${excerpt.slice(0, 140)}...` : excerpt}
                        </p>
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#4393FF] hover:text-[#4393FF]/80"
                        >
                          Leggi articolo →
                        </a>
                      </div>
                    </article>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer id="contatti" className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-gray-400">
                <img src="/logo_aifcom_footer.svg" alt="A.I.F.CO.M." className="w-60 h-auto" />
                Associazione Italiana Famiglie e Coppie Miste a.p.s.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg">Link Utili</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white">Chi Siamo</a>
                <a href="#" className="block text-gray-400 hover:text-white">Progetti</a>
                <a href="#" className="block text-gray-400 hover:text-white">News</a>
                <a href="#" className="block text-gray-400 hover:text-white">Contatti</a>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-lg">Contatti</h3>
              <div className="space-y-2 text-gray-400">
                <p>Roma (RM) Via Salaria 1388, 00138</p>
                <p>CF: 97844810586</p>
                <p>E-mail: info@aifcom.org</p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2026 A.I.F.CO.M. Associazione Italiana Famiglie e Coppie Miste – Associazione di Promozione Sociale - Tutti i diritti riservati</p>
          </div>
        </div>
      </footer>
    </div>
  );
}