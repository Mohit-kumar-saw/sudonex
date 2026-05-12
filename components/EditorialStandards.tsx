'use client';
import { motion } from 'framer-motion';
import { ShieldCheck, BookOpen, AlertTriangle, RefreshCw, Users, FileSearch } from 'lucide-react';

const PRINCIPLES = [
  { icon: BookOpen, title: 'Source-first research', body: 'Every claim about regulation, certification standards, or technical limits is grounded in primary sources — regulator publications, GLI/iTech standard documents, NIST/OWASP specifications, and operator-disclosed technical filings.' },
  { icon: Users, title: 'Subject-matter review', body: 'Articles are written by Sudonex engineers and product leads, then reviewed by a separate compliance specialist before publication. Both names appear on the byline.' },
  { icon: RefreshCw, title: 'Update cadence', body: 'Pages covering regulation, licensing, or technical standards are reviewed at least every 6 months and re-dated when material changes are made. Minor copy edits do not change the published date.' },
  { icon: AlertTriangle, title: 'Editorial independence', body: 'Sudonex does not accept payment for editorial coverage. Vendors mentioned in guides are referenced because they are technically relevant, not because of commercial relationships. Disclosed relationships, if any, will be marked inline.' },
  { icon: FileSearch, title: 'Fact-checking', body: 'Numerical claims (cost ranges, timelines, regulatory limits) are checked against at least two independent sources. Where we cite directional ranges instead of specific figures, we say so explicitly.' },
  { icon: ShieldCheck, title: 'Corrections', body: 'If you spot a factual error, email corrections@sudonex.com. Material corrections are posted with a dated note at the bottom of the affected page; minor edits are silent. We do not silently rewrite published claims.' },
];

export default function EditorialStandards() {
  return (
    <>
      <section id="editorial-standards" className="py-20 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-cyan-300 mb-3">E-E-A-T</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Editorial standards</h2>
            <p className="text-ink-muted max-w-2xl mx-auto">How Sudonex researches, writes, reviews, dates, and corrects every page on this site.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {PRINCIPLES.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="glow-card p-6">
                  <Icon size={20} className="text-brand-300 mb-3" />
                  <h3 className="font-display font-semibold text-base mb-2">{p.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{p.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="fact-checking" className="py-12 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-6 glow-card p-7">
          <h3 className="font-display text-xl font-bold mb-3">Fact-checking process</h3>
          <ol className="text-sm text-ink-muted space-y-2 list-decimal pl-5">
            <li>Author drafts page using primary regulator/standards documents.</li>
            <li>Numbers and dates are verified against a second independent source.</li>
            <li>Compliance reviewer checks regulatory claims and licensing statements.</li>
            <li>Senior engineering reviewer checks architecture, performance, and security claims.</li>
            <li>Page is published with author, reviewer, and date metadata visible on-page and in Article schema.</li>
          </ol>
        </div>
      </section>

      <section id="corrections" className="py-12 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-6 glow-card p-7">
          <h3 className="font-display text-xl font-bold mb-3">Corrections policy</h3>
          <p className="text-sm text-ink-muted mb-3">Sudonex publishes a corrections log when factual claims change after publication. Email <a href="mailto:corrections@sudonex.com" className="text-brand-300 hover:text-brand-200">corrections@sudonex.com</a> to flag an error. Material corrections are appended to the bottom of the page with the date.</p>
          <p className="text-sm text-ink-muted">For regulatory-sensitive content (licensing requirements, certification thresholds), readers should always verify with the named regulator or with licensed counsel in the relevant jurisdiction. Sudonex content is informational, not legal advice.</p>
        </div>
      </section>
    </>
  );
}
