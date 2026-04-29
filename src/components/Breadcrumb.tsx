import { Link } from 'react-router-dom';

type BreadcrumbItem = {
  label: string;
  to?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.to && !isLast ? (
                item.to.includes('#') ? (
                  <a href={item.to} className="transition-colors hover:text-[#4393FF]">
                    {item.label}
                  </a>
                ) : (
                  <Link to={item.to} className="transition-colors hover:text-[#4393FF]">
                    {item.label}
                  </Link>
                )
              ) : (
                <span className={isLast ? 'font-semibold text-gray-700' : ''}>{item.label}</span>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
