'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';

interface ContactModalContextProps {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextProps | undefined>(undefined);

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error('useContactModal must be used within a ContactModalProvider');
  }
  return context;
}

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <ContactModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <AnimatePresence>
        {isOpen && <ContactModal />}
      </AnimatePresence>
    </ContactModalContext.Provider>
  );
}

function ContactModal() {
  const { closeModal } = useContactModal();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    jurisdiction: 'Curaçao',
    budget: '$50k - $100k',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        // Reset form data on success
        setFormData({
          name: '',
          email: '',
          company: '',
          jurisdiction: 'Curaçao',
          budget: '$50k - $100k',
          message: '',
        });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to connect to the server. Check your connection and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
        className="absolute inset-0 bg-bg-deep/80 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-brand-500/20 bg-bg-elev p-6 md:p-8 shadow-2xl"
      >
        <div className="hero-curve-orange w-64 h-64 -top-20 -left-20 opacity-20" style={{ borderRadius: '50%' }} />

        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 text-ink-muted hover:text-ink rounded-full hover:bg-white/5 transition-colors z-10 cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="relative z-10">
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-casino-green/10 border border-casino-green/20 text-casino-green rounded-full grid place-items-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="font-display text-2xl font-bold mb-4">Inquiry Received</h2>
              <p className="text-sm text-ink-muted leading-relaxed max-w-sm mx-auto mb-8">
                Thank you! Our engineering team will review your project details and respond to your email within 24 to 48 business hours.
              </p>
              <button onClick={closeModal} className="btn-primary px-8">
                Close
              </button>
            </motion.div>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs text-brand-400 font-medium mb-4">
                <Sparkles size={12} className="text-brand-500" /> Technical Scoping
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                Start your build
              </h2>
              <p className="text-xs text-ink-muted mb-6 leading-relaxed">
                Connect with our senior engineering team. Briefly describe your project target, region, and expectations.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold text-ink-dim uppercase tracking-wider mb-1.5 block">
                      Name
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Rivera"
                      className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none transition-colors placeholder:text-ink-dim/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-ink-dim uppercase tracking-wider mb-1.5 block">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. alex@operator.com"
                      className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none transition-colors placeholder:text-ink-dim/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-ink-dim uppercase tracking-wider mb-1.5 block">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Nexus Gaming Corp"
                    className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none transition-colors placeholder:text-ink-dim/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold text-ink-dim uppercase tracking-wider mb-1.5 block">
                      Jurisdiction
                    </label>
                    <div className="relative">
                      <select
                        name="jurisdiction"
                        value={formData.jurisdiction}
                        onChange={handleChange}
                        className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none transition-colors appearance-none cursor-pointer pr-10"
                      >
                        <option value="Curaçao">Curaçao</option>
                        <option value="Malta (MGA)">Malta (MGA)</option>
                        <option value="United Kingdom (UKGC)">United Kingdom (UKGC)</option>
                        <option value="Canada (AGCO Ontario)">Canada (AGCO)</option>
                        <option value="US State Licensed">US State</option>
                        <option value="Crypto Only">Crypto Only</option>
                        <option value="Other">Other / Multi-region</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-ink-dim uppercase tracking-wider mb-1.5 block">
                      Estimated Budget
                    </label>
                    <div className="relative">
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none transition-colors appearance-none cursor-pointer pr-10"
                      >
                        <option value="Under $50k">Under $50k</option>
                        <option value="$50k - $100k">$50k - $100k</option>
                        <option value="$100k - $300k">$100k - $300k</option>
                        <option value="$300k+">$300k+</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-ink-dim uppercase tracking-wider mb-1.5 block">
                    Message / Project Details
                  </label>
                  <textarea
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your timeline, stack details, or required features..."
                    className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none transition-colors h-24 resize-none placeholder:text-ink-dim/50"
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
                  className="btn-primary w-full justify-center py-3 text-sm font-semibold transition-all hover:scale-[1.01] cursor-pointer"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending Inquiry...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send project brief <Send size={14} />
                    </span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
