import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-[#4393FF]"></div>
              <span className="font-semibold">A.I.F.CO.M.</span>
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
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
              Associazione Italiana Famiglie e Coppie Miste
            </p>
            <button className="rounded-md bg-[#4393FF] px-8 py-3 text-lg text-white hover:shadow-lg transition-shadow hover:bg-[#4393FF]/90">
              Contattaci
            </button>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-[#FE4545] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl text-white md:text-4xl">
            "ESSERE DIVERSI NON CI DIVIDE<br />PERCHÉ L'AMORE CI UNISCE"
          </h2>
        </div>
      </section>

      {/* About Section */}
      <section id="chi-siamo" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="flex justify-center">
              <div className="h-64 w-64 rounded-lg bg-[#4393FF]/10"></div>
            </div>
            <div>
              <h2 className="mb-6 text-3xl md:text-4xl">A.I.F.CO.M.</h2>
              <h3 className="mb-4 text-xl text-gray-600">
                Associazione Italiana Famiglie e Coppie Miste
              </h3>
              <p className="mb-4 text-gray-700 leading-relaxed">
                A.i.f.co.m. aps è un'associazione di promozione sociale senza scopo di lucro nata
                dall'unione tra diverse sensibilità e professionalità, con l'obiettivo di essere
                il punto di riferimento per tutte le coppie e le famiglie "miste" in Italia.
              </p>
              <p className="mb-4 text-gray-700 leading-relaxed">
                Siamo convinti che le unioni miste siano il barometro fondamentale con cui misurare
                la qualità dei rapporti tra persone di differente origine nazionale, culturale o religiosa.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Il valore dell'unione che coinvolge due o più persone di nazioni, culture o religioni
                differenti costituisce uno dei motori principali del cambiamento e del rinnovamento
                della società odierna.
              </p>
              <a href="#" className="mt-6 inline-block text-[#4393FF] hover:text-[#4393FF]/80 underline">
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Service Card 1 */}
            <div className="group rounded-lg bg-white p-8 shadow-md hover:shadow-xl transition-shadow border-l-4 border-[#4393FF]">
              <h3 className="mb-3 text-xl">
                Supporto alla Coppia e alla Famiglia
              </h3>
              <p className="text-gray-600 mb-4">
                Offriamo supporto professionale alle coppie e famiglie miste per affrontare
                le sfide quotidiane.
              </p>
              <a href="#" className="text-[#4393FF] hover:text-[#4393FF]/80">Scopri di più →</a>
            </div>

            {/* Service Card 2 */}
            <div className="group rounded-lg bg-white p-8 shadow-md hover:shadow-xl transition-shadow border-l-4 border-[#FE4545]">
              <h3 className="mb-3 text-xl">
                Equipe Multi Professionale
              </h3>
              <p className="text-gray-600 mb-4">
                Un team di professionisti qualificati pronti ad aiutarti in ogni aspetto.
              </p>
              <a href="#" className="text-[#FE4545] hover:text-[#FE4545]/80">Scopri di più →</a>
            </div>

            {/* Service Card 3 */}
            <div className="group rounded-lg bg-white p-8 shadow-md hover:shadow-xl transition-shadow border-l-4 border-[#FFAA3B]">
              <h3 className="mb-3 text-xl">
                Ricerca Scientifica
              </h3>
              <p className="text-gray-600 mb-4">
                Promuoviamo la ricerca scientifica sulle famiglie e coppie miste.
              </p>
              <a href="#" className="text-[#FFAA3B] hover:text-[#FFAA3B]/80">Scopri di più →</a>
            </div>

            {/* Service Card 4 */}
            <div className="group rounded-lg bg-white p-8 shadow-md hover:shadow-xl transition-shadow border-l-4 border-[#4393FF]">
              <h3 className="mb-3 text-xl">
                Attività Territoriali
              </h3>
              <p className="text-gray-600 mb-4">
                Organizziamo eventi e incontri su tutto il territorio nazionale.
              </p>
              <a href="#" className="text-[#4393FF] hover:text-[#4393FF]/80">Scopri di più →</a>
            </div>

            {/* Service Card 5 */}
            <div className="group rounded-lg bg-white p-8 shadow-md hover:shadow-xl transition-shadow border-l-4 border-[#FE4545]">
              <h3 className="mb-3 text-xl">
                Spazio di Parola
              </h3>
              <p className="text-gray-600 mb-4">
                Uno spazio sicuro per condividere esperienze e confrontarsi.
              </p>
              <a href="#" className="text-[#FE4545] hover:text-[#FE4545]/80">Scopri di più →</a>
            </div>

            {/* Service Card 6 */}
            <div className="group rounded-lg bg-white p-8 shadow-md hover:shadow-xl transition-shadow border-l-4 border-[#FFAA3B]">
              <h3 className="mb-3 text-xl">
                Supporto Burocratico Legale
              </h3>
              <p className="text-gray-600 mb-4">
                Assistenza nelle pratiche burocratiche e legali.
              </p>
              <a href="#" className="text-[#FFAA3B] hover:text-[#FFAA3B]/80">Scopri di più →</a>
            </div>
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

      {/* Footer */}
      <footer id="contatti" className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg">A.I.F.CO.M.</h3>
              <p className="text-gray-400">
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
                <p>Email: info@aifcom.org</p>
                <p>Tel: +39 XXX XXX XXXX</p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2026 A.I.F.CO.M. - Tutti i diritti riservati</p>
          </div>
        </div>
      </footer>
    </div>
  );
}