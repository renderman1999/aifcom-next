import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#F3A419] shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center justify-center gap-3 md:justify-start">
            <img src="/logo_aifcom_header.png" alt="A.I.F.CO.M." className="h-12 w-auto" />
            <span className="text-center text-left font-semibold leading-tight md:text-left">
              A.i.f.co.m.<br className="hidden md:block" />
              Associazione Italiana Famiglie e Coppie Miste
            </span>
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <a href="/#chi-siamo" className="transition-colors hover:text-[#4393FF]">Chi Siamo</a>
            <a href="/#cosa-facciamo" className="transition-colors hover:text-[#4393FF]">Cosa Facciamo</a>
            <a href="/#servizi" className="transition-colors hover:text-[#4393FF]">Servizi</a>
            <a href="/#contatti" className="transition-colors hover:text-[#4393FF]">Contatti</a>
            <button className="rounded-md bg-[#FE4545] px-6 py-2 text-white transition-shadow hover:bg-[#FE4545]/90 hover:shadow-lg">
              Dona Ora
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Apri menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="space-y-3 pb-4 md:hidden">
            <a href="/#chi-siamo" className="block py-2 hover:text-[#4393FF]">Chi Siamo</a>
            <a href="/#cosa-facciamo" className="block py-2 hover:text-[#4393FF]">Cosa Facciamo</a>
            <a href="/#servizi" className="block py-2 hover:text-[#4393FF]">Servizi</a>
            <a href="/#contatti" className="block py-2 hover:text-[#4393FF]">Contatti</a>
            <button className="w-full rounded-md bg-[#FE4545] px-6 py-2 text-white hover:bg-[#FE4545]/90">
              Dona Ora
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
