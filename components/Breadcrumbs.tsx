import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ path, h1 }: { path: string; h1: string }) {
  if (path === '/') return null;
  const parts = path.split('/').filter(Boolean);
  const crumbs: { label: string; href: string }[] = [{ label: 'Home', href: '/' }];
  let cur = '';
  parts.forEach((seg, i) => {
    cur += '/' + seg;
    const last = i === parts.length - 1;
    crumbs.push({ label: last ? h1 : seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), href: cur + '/' });
  });
  return (
    <nav aria-label="Breadcrumb" className="max-w-3xl mx-auto px-6 pt-8">
      <ol className="flex items-center flex-wrap gap-1 text-xs text-ink-dim">
        {crumbs.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={12} className="text-ink-dim/50" />}
            {i < crumbs.length - 1 ? <Link href={c.href} className="hover:text-ink transition-colors">{c.label}</Link> : <span className="text-ink truncate max-w-[300px]">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
