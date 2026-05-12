'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { List } from 'lucide-react';

export default function ArticleBody({ html, toc }: { html: string; toc?: { text: string; href: string }[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    document.querySelectorAll('article.prose-sx h2, article.prose-sx h3').forEach(el => {
      (el as HTMLElement).style.scrollMarginTop = '5rem';
    });
    if (!toc?.length) return;
    const ids = toc.map(t => t.href.replace(/^#/, ''));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: 0 }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [html, toc]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-[1fr_280px] gap-10">
        <div className="min-w-0">
          <article className="prose-sx max-w-3xl mx-auto lg:mx-0 lg:max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        {toc && toc.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24 glow-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <List size={14} className="text-brand-300" />
                <p className="text-xs uppercase tracking-widest text-brand-300">On this page</p>
              </div>
              <ul className="space-y-1.5 text-sm border-l border-white/8">
                {toc.map((t, i) => {
                  const id = t.href.replace(/^#/, '');
                  const isActive = activeId === id;
                  return (
                    <li key={i}>
                      <a href={t.href}
                        className={`block pl-4 -ml-px py-1 border-l-2 transition-all ${isActive ? 'border-brand-400 text-ink font-medium' : 'border-transparent text-ink-muted hover:text-ink'}`}>
                        {t.text}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
