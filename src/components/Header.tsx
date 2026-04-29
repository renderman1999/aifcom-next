import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMenuTree, type WordPressMenuItem } from '@/lib/wordpress';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<WordPressMenuItem[]>([]);
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const fallbackMenu: WordPressMenuItem[] = [
    { id: 1, label: 'Chi Siamo', url: '/#chi-siamo', target: null, classes: [], children: [] },
    { id: 2, label: 'Servizi', url: '/#servizi', target: null, classes: [], children: [] },
    { id: 3, label: 'News', url: '/#news', target: null, classes: [], children: [] },
    { id: 4, label: 'Contatti', url: '/#contatti', target: null, classes: [], children: [] },
  ];
  const visibleMenu = menuItems.length > 0 ? menuItems : fallbackMenu;

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    const fetchMenu = async () => {
      try {
        setIsMenuLoading(true);
        const menu = await getMenuTree(controller.signal);
        if (isActive) {
          setMenuItems(menu);
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }
      } finally {
        if (isActive) {
          setIsMenuLoading(false);
        }
      }
    };

    fetchMenu();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  const renderMenuLink = (item: WordPressMenuItem, className: string) => {
    const mergedClassName = `${className} ${item.classes.join(' ')}`.trim();

    if (!item.url) {
      return (
        <span className={`${mergedClassName} cursor-default opacity-70`}>
          {item.label}
        </span>
      );
    }

    const isExternal = /^https?:\/\//i.test(item.url);
    if (isExternal) {
      return (
        <a
          href={item.url}
          target={item.target || '_self'}
          rel={item.target === '_blank' ? 'noreferrer' : undefined}
          className={mergedClassName}
        >
          {item.label}
        </a>
      );
    }

    if (item.url.includes('#')) {
      return (
        <a href={item.url} className={mergedClassName}>
          {item.label}
        </a>
      );
    }

    return (
      <Link to={item.url} className={mergedClassName}>
        {item.label}
      </Link>
    );
  };

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

          <div className="hidden md:flex md:items-center md:space-x-6">
            {isMenuLoading ? (
              <>
                <div className="h-5 w-24 animate-pulse rounded bg-black/15" />
                <div className="h-5 w-20 animate-pulse rounded bg-black/15" />
                <div className="h-5 w-16 animate-pulse rounded bg-black/15" />
                <div className="h-5 w-24 animate-pulse rounded bg-black/15" />
              </>
            ) : (
              visibleMenu.map((item) => (
                <div key={item.id} className="group relative">
                  {renderMenuLink(item, 'transition-colors hover:text-[#4393FF]')}
                  {item.children.length > 0 && (
                    <div className="invisible absolute left-0 top-full z-20 mt-2 min-w-64 rounded-lg bg-white p-3 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                      <div className="space-y-2">
                        {item.children.map((child) => (
                          <div key={child.id}>
                            {renderMenuLink(child, 'block rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100')}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
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
            {isMenuLoading ? (
              <>
                <div className="h-6 w-2/3 animate-pulse rounded bg-black/15" />
                <div className="h-6 w-1/2 animate-pulse rounded bg-black/15" />
                <div className="h-6 w-3/4 animate-pulse rounded bg-black/15" />
              </>
            ) : (
              visibleMenu.map((item) => (
                <div key={item.id} className="space-y-1">
                  {renderMenuLink(item, 'block py-2 hover:text-[#4393FF]')}
                  {item.children.length > 0 && (
                    <div className="ml-4 border-l border-black/10 pl-3">
                      {item.children.map((child) => (
                        <div key={child.id}>
                          {renderMenuLink(child, 'block py-1 text-sm text-gray-800 hover:text-[#4393FF]')}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
