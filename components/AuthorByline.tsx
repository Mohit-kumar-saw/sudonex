'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, RefreshCw, ChevronRight } from 'lucide-react';
import { Author } from '@/lib/authors';

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(s => s[0])
    .join('')
    .toUpperCase();
  return (
    <div
      className="w-12 h-12 rounded-xl bg-brand-500 grid place-items-center font-display font-bold text-white text-sm shrink-0 shadow-md shadow-brand-500/25"
      aria-hidden
    >
      {initials}
    </div>
  );
}

function PersonBlock({
  label,
  person,
  rel,
}: {
  label: string;
  person: Author;
  rel: 'author' | 'noopener';
}) {
  return (
    <div className="flex items-start gap-4 min-w-0">
      <Avatar name={person.name} />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-widest text-ink-dim mb-1">{label}</p>
        <a
          href={person.linkedin}
          target="_blank"
          rel={rel === 'author' ? 'noopener author' : 'noopener'}
          className="block text-base font-semibold text-white hover:text-brand-400 transition-colors truncate"
        >
          {person.name}
        </a>
        <p className="text-sm text-ink-muted mt-0.5">{person.role}</p>
      </div>
    </div>
  );
}

export default function AuthorByline({
  author,
  reviewer,
  published,
  lastUpdated,
}: {
  author: Author;
  reviewer: Author;
  published: string;
  lastUpdated: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto px-6 mt-8 mb-2"
      aria-label="Authorship and review information"
    >
      <div className="rounded-2xl border border-white/10 bg-bg-card/80 backdrop-blur-sm overflow-hidden">
        {/* Author + reviewer */}
        <div className="grid sm:grid-cols-2 gap-8 sm:gap-10 p-6 sm:p-7">
          <PersonBlock label="Written by" person={author} rel="author" />
          <PersonBlock label="Reviewed by" person={reviewer} rel="noopener" />
        </div>

        {/* Dates + editorial */}
        <div className="px-6 sm:px-7 py-4 sm:py-5 border-t border-white/8 bg-bg-elev/40">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4 sm:gap-x-8 sm:gap-y-3">
            <div className="flex items-center gap-2.5 text-sm text-ink-muted">
              <Calendar size={16} className="text-ink-dim shrink-0" aria-hidden />
              <span>
                <span className="text-ink-dim">Published </span>
                <time dateTime={published} className="text-white font-medium">
                  {fmtDate(published)}
                </time>
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-ink-muted">
              <RefreshCw size={16} className="text-ink-dim shrink-0" aria-hidden />
              <span>
                <span className="text-ink-dim">Updated </span>
                <time dateTime={lastUpdated} className="text-white font-medium">
                  {fmtDate(lastUpdated)}
                </time>
              </span>
            </div>
            <a
              href="/about-us/#editorial-standards"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors sm:ml-auto"
            >
              <ShieldCheck size={16} className="shrink-0" aria-hidden />
              Editorial standards
            </a>
          </div>
        </div>

        {/* Credentials */}
        <details className="group border-t border-white/8">
          <summary className="px-6 sm:px-7 py-4 text-sm text-ink-muted cursor-pointer hover:text-white transition-colors list-none flex items-center gap-2 select-none">
            <ChevronRight
              size={16}
              className="text-brand-500 shrink-0 transition-transform group-open:rotate-90"
              aria-hidden
            />
            Author credentials &amp; methodology
          </summary>
          <div className="px-6 sm:px-7 pb-6 pt-1 grid sm:grid-cols-2 gap-6 sm:gap-8 text-sm text-ink-muted leading-relaxed">
            <div className="rounded-xl border border-white/6 bg-bg-deep/50 p-4">
              <p className="font-semibold text-white mb-1">{author.name}</p>
              <p className="text-brand-400 text-xs font-medium mb-2">{author.credentials}</p>
              <p>{author.bio}</p>
            </div>
            <div className="rounded-xl border border-white/6 bg-bg-deep/50 p-4">
              <p className="font-semibold text-white mb-1">{reviewer.name}</p>
              <p className="text-brand-400 text-xs font-medium mb-2">{reviewer.credentials}</p>
              <p>{reviewer.bio}</p>
            </div>
          </div>
        </details>
      </div>
    </motion.section>
  );
}
