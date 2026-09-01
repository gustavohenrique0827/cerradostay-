import React from 'react';
import { motion } from 'motion/react';
import { TIMELINE_STEPS } from '../data/content';
import { Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="como-funciona" className="py-24 bg-white border-y border-[#DEE2E6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Processo 100% Descomplicado</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-4 text-balance">
            Tudo simples, do check-in ao check-out.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-light max-w-xl mx-auto leading-relaxed">
            Eliminamos burocracias para que você foque apenas no que realmente importa: aproveitar ao máximo cada instante da sua viagem.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TIMELINE_STEPS.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-[#F8F9FA] hover:bg-white rounded-2xl p-7 border border-[#DEE2E6] hover:border-[#C5A059]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-serif font-bold text-3xl text-[#C5A059] group-hover:scale-105 transition-transform">
                    {step.number}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white text-neutral-400 group-hover:bg-[#C5A059] group-hover:text-white flex items-center justify-center transition-colors text-xs font-bold shadow-2xs">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-serif font-bold text-lg text-neutral-900 mb-2 group-hover:text-[#C5A059] transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed mb-4">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-200/60 flex items-center gap-2 text-[11px] font-semibold text-[#C5A059]">
                <span>{step.highlight}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
