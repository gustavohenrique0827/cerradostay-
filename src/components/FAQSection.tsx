import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQ_DATA } from '../data/content';
import { ChevronDown, HelpCircle, Sparkles, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../config';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<'todos' | 'reserva' | 'checkin' | 'estadia' | 'pagamento'>('todos');

  const filteredFaqs = FAQ_DATA.filter(
    (faq) => activeCategory === 'todos' || faq.category === activeCategory
  );

  return (
    <section id="faq" className="py-24 bg-[#F8F9FA] border-t border-[#DEE2E6] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#002147] mb-3">
            Perguntas Frequentes
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
            Reunimos as respostas para as principais dúvidas sobre reservas, check-in, regras e comodidades.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'todos', label: 'Todas as dúvidas' },
            { id: 'reserva', label: 'Reservas & Cancelamentos' },
            { id: 'checkin', label: 'Check-in & Check-out' },
            { id: 'estadia', label: 'Comodidades & Estadia' },
            { id: 'pagamento', label: 'Pagamentos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveCategory(tab.id as any);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-[#002147] text-white shadow-xs'
                  : 'bg-white text-neutral-700 hover:bg-[#F8F9FA] border border-[#DEE2E6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[#DEE2E6] overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 hover:bg-neutral-50/60 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif font-bold text-sm sm:text-base text-neutral-900 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#FBF7EF] text-[#C5A059] flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#C5A059] text-white' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed border-t border-neutral-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-12 text-center bg-white rounded-2xl p-6 sm:p-8 border border-[#DEE2E6] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-serif font-bold text-base text-neutral-900">
              Ainda tem alguma dúvida específica?
            </h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              Nossa equipe de concierge está disponível 24 horas no WhatsApp para lhe atender.
            </p>
          </div>

          <a
            href={getWhatsAppUrl('Olá! Gostaria de tirar uma dúvida sobre uma reserva na Cerrado Stay.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#A68648] text-white px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-xs shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Falar com o Concierge</span>
          </a>
        </div>
      </div>
    </section>
  );
};
