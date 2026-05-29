'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SERVICES } from '@/lib/services';

export default function ServiceCards() {
  return (
    <section className="relative py-24" id="services">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs uppercase tracking-widest text-brand-500 mb-3">What We Build</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-white">
              iGaming engineering, <span className="text-brand-500">end-to-end</span>
            </h2>
            <p className="text-ink-muted max-w-2xl mx-auto">
              Every product surface for licensed operators, startups, and game studios — built once, built right.
            </p>
          </motion.div>
        </div>

        {/* Service cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20 md:mb-28">
          {SERVICES.map((service, idx) => {
            const Icon = service.icon;
            const isLast = idx === SERVICES.length - 1;
            const centerAlone = (cols: number) => isLast && SERVICES.length % cols === 1;

            return (
              <motion.div
                key={service.path}
                className={[
                  centerAlone(2) && 'sm:col-span-2 sm:max-w-[calc((100%-1.25rem)/2)] sm:mx-auto',
                  centerAlone(3) && 'lg:col-start-2 lg:col-span-1 lg:max-w-none lg:mx-0',
                ]
                  .filter(Boolean)
                  .join(' ')}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link href={service.path} className="glow-card block p-6 h-full group">
                  <div className="w-12 h-12 rounded-lg bg-brand-500/10 border border-brand-500/20 grid place-items-center mb-4 group-hover:bg-brand-500 group-hover:border-brand-500 transition-all">
                    <Icon size={22} className="text-brand-500 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex items-center justify-between mb-2 gap-3">
                    <h3 className="font-display font-semibold text-lg text-white">{service.title}</h3>
                    <ArrowUpRight
                      size={16}
                      className="text-ink-dim group-hover:text-brand-500 transition-colors shrink-0"
                    />
                  </div>
                  <p className="text-sm text-ink-muted leading-relaxed">{service.summary}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Detail rows with images */}
        <div className="border-t border-white/8 pt-16 md:pt-20">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-widest text-brand-500 mb-3">Deep dive</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white">
              How we deliver each <span className="text-brand-500">service</span>
            </h3>
          </div>

          <div className="flex flex-col gap-20 md:gap-28">
            {SERVICES.map((service, idx) => {
              const imageFirst = idx % 2 === 1;
              return (
                <motion.article
                  key={`detail-${service.path}`}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55 }}
                  className={`grid lg:grid-cols-2 gap-10 lg:gap-14 items-center ${
                    imageFirst ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''
                  }`}
                >
                  <div className="max-w-xl">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/25 mb-5">
                      {service.tag}
                    </span>
                    <h4 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-5">
                      {service.headline}
                    </h4>
                    <p className="text-ink-muted text-base md:text-lg leading-relaxed mb-8">
                      {service.description}
                    </p>
                    <Link
                      href={service.path}
                      className="inline-flex items-center gap-4 group text-white font-medium hover:text-brand-400 transition-colors"
                    >
                      <span>Explore {service.title}</span>
                      <span className="w-11 h-11 rounded-full bg-brand-500 grid place-items-center shrink-0 group-hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/30">
                        <ArrowRight size={18} className="text-white" aria-hidden />
                      </span>
                    </Link>
                  </div>

                  <Link
                    href={service.path}
                    className="block relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-bg-elev group"
                  >
                    <Image
                      src={service.image}
                      alt={service.imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-sm font-semibold text-white drop-shadow-md">{service.title}</p>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
