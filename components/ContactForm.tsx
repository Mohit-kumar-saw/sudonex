'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Mail,
  Phone,
  Clock,
  MapPin,
} from 'lucide-react';

export type ContactFormData = {
  name: string;
  email: string;
  company: string;
  jurisdiction: string;
  budget: string;
  message: string;
};

export const INITIAL_CONTACT_FORM: ContactFormData = {
  name: '',
  email: '',
  company: '',
  jurisdiction: 'Curaçao',
  budget: '$50k - $100k',
  message: '',
};

const inputClass =
  'w-full bg-bg-card border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500 focus:outline-none transition-colors placeholder:text-ink-dim/50';
const labelClass = 'text-[10px] font-semibold text-ink-dim uppercase tracking-wider mb-1.5 block';

function SelectField({
  name,
  value,
  onChange,
  children,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`${inputClass} appearance-none cursor-pointer pr-10`}
      >
        {children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted">
        <ChevronDown size={14} />
      </div>
    </div>
  );
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_CONTACT_FORM);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData(INITIAL_CONTACT_FORM);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Failed to connect to the server. Check your connection and try again.');
    }
  };

  return (
    <section id="contact-form" className="relative py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 relative overflow-hidden rounded-2xl border border-brand-500/20 bg-bg-card p-6 md:p-8 shadow-xl"
          >
            <div
              className="hero-curve-orange w-64 h-64 -top-20 -left-20 opacity-15 pointer-events-none absolute"
              style={{ borderRadius: '50%' }}
            />

            {status === 'success' ? (
              <div className="relative z-10 text-center py-10 md:py-14">
                <div className="w-16 h-16 bg-casino-green/10 border border-casino-green/20 text-casino-green rounded-full grid place-items-center mx-auto mb-6">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="font-display text-2xl font-bold text-white mb-4">Inquiry sent</h2>
                <p className="text-sm text-ink-muted leading-relaxed max-w-md mx-auto mb-8">
                  Thank you. Our engineering team will review your brief and respond within 24–48 business
                  hours.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="btn-primary px-8"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs text-brand-400 font-medium mb-4">
                  <Sparkles size={12} className="text-brand-500" /> Project inquiry
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                  Tell us about your build
                </h2>
                <p className="text-sm text-ink-muted mb-8 leading-relaxed">
                  Share your jurisdiction, timeline, and stack. The more detail you include, the faster we
                  can scope a useful response.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass} htmlFor="contact-name">
                        Name *
                      </label>
                      <input
                        id="contact-name"
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="contact-email">
                        Email *
                      </label>
                      <input
                        id="contact-email"
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@company.com"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="contact-company">
                      Company
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Operator or studio name"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass} htmlFor="contact-jurisdiction">
                        Target jurisdiction
                      </label>
                      <SelectField
                        name="jurisdiction"
                        value={formData.jurisdiction}
                        onChange={handleChange}
                      >
                        <option value="Curaçao">Curaçao</option>
                        <option value="Malta (MGA)">Malta (MGA)</option>
                        <option value="United Kingdom (UKGC)">United Kingdom (UKGC)</option>
                        <option value="Canada (AGCO Ontario)">Canada (AGCO)</option>
                        <option value="US State Licensed">US State</option>
                        <option value="Crypto Only">Crypto Only</option>
                        <option value="Other">Other / Multi-region</option>
                      </SelectField>
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="contact-budget">
                        Estimated budget
                      </label>
                      <SelectField name="budget" value={formData.budget} onChange={handleChange}>
                        <option value="Under $50k">Under $50k</option>
                        <option value="$50k - $100k">$50k – $100k</option>
                        <option value="$100k - $300k">$100k – $300k</option>
                        <option value="$300k+">$300k+</option>
                      </SelectField>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="contact-message">
                      Project details *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Platform type, current stack, timeline, licensing status, integrations needed..."
                      className={`${inputClass} h-32 resize-none`}
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-start gap-2 text-xs text-casino-red bg-casino-red/10 border border-casino-red/20 rounded-xl p-3">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full sm:w-auto justify-center px-8 py-3 text-sm font-semibold cursor-pointer disabled:opacity-70"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Send inquiry <Send size={14} />
                      </span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-5"
          >
            <div className="rounded-2xl border border-white/10 bg-bg-elev p-6">
              <h3 className="font-display font-semibold text-white mb-4">Direct contact</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail size={16} className="text-brand-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-ink-dim text-xs mb-0.5">Email</p>
                    <a
                      href="mailto:Sudonexofficial@gmail.com"
                      className="text-white hover:text-brand-400 transition-colors"
                    >
                      Sudonexofficial@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={16} className="text-brand-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-ink-dim text-xs mb-0.5">Phone</p>
                    <a href="tel:+919691684577" className="text-white hover:text-brand-400 transition-colors">
                      +91 9691684577
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={16} className="text-brand-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-ink-dim text-xs mb-0.5">Response time</p>
                    <p className="text-ink-muted">24–48 business hours</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-brand-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-ink-dim text-xs mb-0.5">Delivery</p>
                    <p className="text-ink-muted">Global · 17 jurisdictions</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-bg-elev p-6">
              <h3 className="font-display font-semibold text-white mb-3">What to include</h3>
              <ul className="space-y-2 text-sm text-ink-muted">
                <li>· Target region and licence (MGA, UKGC, Curaçao, US state, etc.)</li>
                <li>· Greenfield vs replatform vs inherited codebase</li>
                <li>· Product scope (casino, sportsbook, exchange, slots)</li>
                <li>· Timeline and budget range</li>
              </ul>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
