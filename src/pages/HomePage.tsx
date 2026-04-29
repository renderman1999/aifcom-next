import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Seo from '@/components/Seo';
import {
  formatItalianDate,
  getLatestPostsByCategorySlug,
  stripHtml,
  type WordPressPost,
} from '@/lib/wordpress';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type ServiceCard = {
  title: string;
  description: string;
  borderClass: string;
  linkClass: string;
  pageSlug: string;
};

export default function HomePage() {
  const [newsPosts, setNewsPosts] = useState<WordPressPost[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  const serviceCards: ServiceCard[] = [
    {
      title: 'Supporto alla Coppia e alla Famiglia',
      description: 'Offriamo supporto professionale alle coppie e famiglie miste per affrontare le sfide quotidiane.',
      borderClass: 'border-[#4393FF]',
      linkClass: 'text-[#4393FF] hover:text-[#4393FF]/80',
      pageSlug: 'supporto-alla-coppia-e-alla-famiglia',
    },
    {
      title: 'Equipe Multi Professionale',
      description: 'Un team di professionisti qualificati pronti ad aiutarti in ogni aspetto.',
      borderClass: 'border-[#FE4545]',
      linkClass: 'text-[#FE4545] hover:text-[#FE4545]/80',
      pageSlug: 'equipe-multi-professionale',
    },
    {
      title: 'Ricerca Scientifica',
      description: 'Promuoviamo la ricerca scientifica sulle famiglie e coppie miste.',
      borderClass: 'border-[#FFAA3B]',
      linkClass: 'text-[#FFAA3B] hover:text-[#FFAA3B]/80',
      pageSlug: 'ricerca-scientifica',
    },
    {
      title: 'Attivita Territoriali',
      description: 'Organizziamo eventi e incontri su tutto il territorio nazionale.',
      borderClass: 'border-[#4393FF]',
      linkClass: 'text-[#4393FF] hover:text-[#4393FF]/80',
      pageSlug: 'attivita-territoriali',
    },
    {
      title: 'Spazio di Parola',
      description: 'Uno spazio sicuro per condividere esperienze e confrontarsi.',
      borderClass: 'border-[#FE4545]',
      linkClass: 'text-[#FE4545] hover:text-[#FE4545]/80',
      pageSlug: 'spazio-di-parola',
    },
    {
      title: 'Supporto Burocratico Legale',
      description: 'Assistenza nelle pratiche burocratiche e legali.',
      borderClass: 'border-[#FFAA3B]',
      linkClass: 'text-[#FFAA3B] hover:text-[#FFAA3B]/80',
      pageSlug: 'supporto-burocratico-legale',
    },
    {
      title: 'Formazione e Consulenza',
      description: 'Formazione e consulenza per le coppie e famiglie miste.',
      borderClass: 'border-[#4393FF]',
      linkClass: 'text-[#4393FF] hover:text-[#4393FF]/80',
      pageSlug: 'formazione-e-consulenza',
    },
  ];

  useEffect(() => {
    const controller = new AbortController();

    const fetchLatestNews = async () => {
      try {
        setIsNewsLoading(true);
        setNewsError(null);
        const posts = await getLatestPostsByCategorySlug('news', 6, controller.signal);
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
    return () => controller.abort();
  }, []);

  return (
    <>
      <Seo
        title="Home"
        description="A.I.F.CO.M. - Associazione Italiana Famiglie e Coppie Miste. Supporto a coppie e famiglie miste, servizi, attivita territoriali e ultime news."
        canonicalPath="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'A.I.F.CO.M.',
          url: 'https://www.aifcom.org',
          logo: 'https://www.aifcom.org/logo_aifcom_header.png',
        }}
      />

      <section className="relative bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl md:text-6xl">
              Sei una coppia o<br />una famiglia mista?
            </h1>
            <button className="rounded-md bg-[#4393FF] px-8 py-3 text-lg font-bold uppercase text-white transition-shadow hover:bg-[#4393FF]/90 hover:shadow-lg">
              Contattaci
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#FE4545] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            "ESSERE DIVERSI NON CI DIVIDE<br />PERCHÉ L'AMORE CI UNISCE"
          </h2>
        </div>
      </section>

      <section id="chi-siamo" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
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
              <p className="mb-4 text-justify leading-relaxed text-gray-700 md:text-left">
                A.i.f.co.m. aps è un'associazione di promozione sociale senza scopo di lucro nata
                dall'unione tra diverse sensibilità e professionalità, con l'obiettivo di essere
                il punto di riferimento per tutte le coppie e le famiglie "miste" in Italia.
              </p>
              <p className="mb-4 text-justify leading-relaxed text-gray-700 md:text-left">
                Siamo convinti che le unioni miste siano il barometro fondamentale con cui misurare
                la qualità dei rapporti tra persone di differente origine nazionale, culturale o religiosa.
              </p>
              <p className="text-justify leading-relaxed text-gray-700 md:text-left">
                Il valore dell'unione che coinvolge due o più persone di nazioni, culture o religioni
                differenti costituisce uno dei motori principali del cambiamento e del rinnovamento
                della società odierna.
              </p>
              <Link to="/pages?slug=lassociazione" className="mt-6 inline-block w-full text-center text-[#4393FF] underline hover:text-[#4393FF]/80 md:w-auto md:text-left">
                Scopri di più su Aifcom →
              </Link>
            </div>
          </div>
        </div>
      </section>

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
                    <h3 className="mb-3 text-xl font-bold uppercase">{service.title}</h3>
                    <p className="mb-4 flex-1 text-gray-600">{service.description}</p>
                    <Link to={`/pages?slug=${service.pageSlug}`} className={service.linkClass}>
                      Scopri di più →
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map((service) => (
              <div key={service.title} className={`group flex h-full flex-col rounded-lg border-l-4 bg-white p-8 shadow-md transition-shadow hover:shadow-xl ${service.borderClass}`}>
                <h3 className="mb-3 text-xl uppercase">{service.title}</h3>
                <p className="mb-4 flex-1 text-gray-600">{service.description}</p>
                <Link to={`/pages?slug=${service.pageSlug}`} className={service.linkClass}>
                  Scopri di più →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#4393FF] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-3xl text-white md:text-4xl">Unisciti a Noi</h2>
          <p className="mb-8 text-xl text-white/90">
            Diventa parte della nostra comunità e contribuisci a costruire una società più inclusiva.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-md bg-white px-8 py-3 text-lg text-[#4393FF] transition-colors hover:bg-gray-100">
              Associati
            </button>
            <button className="rounded-md border-2 border-white px-8 py-3 text-lg text-white transition-colors hover:bg-white hover:text-[#4393FF]">
              Dona il 5x1000
            </button>
          </div>
        </div>
      </section>

      <section id="news" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl uppercase md:text-4xl">Ultime news</h2>
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
                        <Link to={`/articoli/${post.slug}`} className="text-[#4393FF] hover:text-[#4393FF]/80">
                          Leggi articolo →
                        </Link>
                      </div>
                    </article>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>
      </section>
    </>
  );
}
