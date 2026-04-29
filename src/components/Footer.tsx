export default function Footer() {
  return (
    <footer id="contatti" className="bg-gray-900 py-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-gray-400">
              <img src="/logo_aifcom_footer.svg" alt="A.I.F.CO.M." className="h-auto w-60" />
              Associazione Italiana Famiglie e Coppie Miste a.p.s.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg">Link Utili</h3>
            <div className="space-y-2">
              <a href="/#chi-siamo" className="block text-gray-400 hover:text-white">Chi Siamo</a>
              <a href="/#servizi" className="block text-gray-400 hover:text-white">Progetti</a>
              <a href="/#news" className="block text-gray-400 hover:text-white">News</a>
              <a href="/#contatti" className="block text-gray-400 hover:text-white">Contatti</a>
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
  );
}
