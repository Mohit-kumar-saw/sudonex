'use client';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, Eye } from 'lucide-react';
import { Author } from '@/lib/authors';

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function Avatar({ name, accent }: { name: string; accent: string }) {
  const initials = name.split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();
  return (
    <div className={`w-10 h-10 rounded-full grid place-items-center font-display font-bold text-white text-sm shrink-0 bg-gradient-to-br ${accent}`}>
      {initials}
    </div>
  );
}

export default function AuthorByline({
  author, reviewer, published, lastUpdated,
}: { author: Author; reviewer: Author; published: string; lastUpdated: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto px-6 mt-6"
      aria-label="Authorship & review information"
    >
      <div className="glow-card p-5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-3">
            <Avatar name={author.name} accent="from-brand-500 to-cyan-500" />
            <div className="min-w-0">
              <p className="text-xs text-ink-dim uppercase tracking-widest mb-0.5">Written by</p>
              <a href={author.linkedin} target="_blank" rel="noopener author" className="text-sm font-semibold text-ink hover:text-brand-300">{author.name}</a>
              <p className="text-xs text-ink-muted">{author.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar name={reviewer.name} accent="from-gold-400 to-casino-red" />
            <div className="min-w-0">
              <p className="text-xs text-ink-dim uppercase tracking-widest mb-0.5">Reviewed by</p>
              <a href={reviewer.linkedin} target="_blank" rel="noopener" className="text-sm font-semibold text-ink hover:text-gold-300">{reviewer.name}</a>
              <p className="text-xs text-ink-muted">{reviewer.role}</p>
            </div>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1.5"><Calendar size={12} /> Published <time dateTime={published}>{fmtDate(published)}</time></span>
            <span className="inline-flex items-center gap-1.5"><Eye size={12} /> Updated <time dateTime={lastUpdated}>{fmtDate(lastUpdated)}</time></span>
            <a href="/about-us/#editorial-standards" className="inline-flex items-center gap-1.5 text-brand-300 hover:text-brand-200">
              <ShieldCheck size={12} /> Editorial standards
            </a>
          </div>
        </div>
        <details className="mt-4 group">
          <summary className="text-xs text-ink-muted cursor-pointer hover:text-ink list-none flex items-center gap-1">
            <span className="text-brand-300 group-open:rotate-90 transition-transform inline-block">▸</span> Author credentials & methodology
          </summary>
          <div className="mt-3 pt-3 border-t border-white/5 grid sm:grid-cols-2 gap-4 text-xs text-ink-muted leading-relaxed">
            <div>
              <p className="font-semibold text-ink mb-1">{author.name}</p>
              <p className="text-brand-300 mb-1">{author.credentials}</p>
              <p>{author.bio}</p>
            </div>
            <div>
              <p className="font-semibold text-ink mb-1">{reviewer.name}</p>
              <p className="text-gold-300 mb-1">{reviewer.credentials}</p>
              <p>{reviewer.bio}</p>
            </div>
          </div>
        </details>
      </div>
    </motion.section>
  );
}
