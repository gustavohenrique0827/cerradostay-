import React from 'react';
import { motion } from 'motion/react';
import { GUEST_EXPERIENCE_PILLARS } from '../data/content';
import { Sparkles, KeyRound, ShieldCheck, Headphones, HeartHandshake } from 'lucide-react';

const iconMap = {
  Sparkles,
  KeyRound,
  ShieldCheck,
  Headphones,
};

export const GuestExperience: React.FC = () => {
  return (
    <section id="experiencia" className="py-24 bg-[#F8F9FA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Padrão de Excelência</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#002147] mb-4 text-balance">
            Pensamos em cada detalhe da sua estadia.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-light max-w-xl mx-auto leading-relaxed">
            Unimos o conforto acolhedor de um lar com os serviços e padrões de limpeza de um hotel boutique de alta classe.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GUEST_EXPERIENCE_PILLARS.map((pillar, idx) => {
            const Icon = iconMap[pillar.icon as keyof typeof iconMap] || Sparkles;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-7 border border-[#DEE2E6] hover:border-[#C5A059]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#FBF7EF] group-hover:bg-[#C5A059] text-[#C5A059] group-hover:text-white flex items-center justify-center transition-colors duration-300 mb-6 shadow-2xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-serif font-bold text-xl text-neutral-900 mb-3 group-hover:text-[#C5A059] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">
                  <span>Padrão Cerrado Stay</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
