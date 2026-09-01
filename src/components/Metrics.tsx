import React from 'react';
import { motion } from 'motion/react';
import { METRICS_DATA } from '../data/content';
import { Sparkles, Building, Users, Star, ThumbsUp } from 'lucide-react';

const metricIcons = {
  properties: Building,
  guests: Users,
  rating: Star,
  satisfaction: ThumbsUp,
};

export const Metrics: React.FC = () => {
  return (
    <section id="metricas" className="py-20 sm:py-24 bg-[#002147] text-white relative overflow-hidden">
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Credibilidade Comprovada</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 text-balance">
            Hospitalidade que transforma estadias em experiências.
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 font-light max-w-xl mx-auto leading-relaxed">
            Combinamos processos operacionais de alto padrão com tecnologia de ponta para garantir rentabilidade aos proprietários e memórias inesquecíveis aos hóspedes.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {METRICS_DATA.map((item, index) => {
            const Icon = metricIcons[item.id as keyof typeof metricIcons] || Sparkles;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 rounded-2xl p-6 text-center sm:text-left transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 text-[#D4AF37] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Cerrado Standard</span>
                </div>

                <div>
                  <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-2 flex items-baseline justify-center sm:justify-start gap-0.5">
                    <span>{item.value}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-200 tracking-tight mb-1">
                    {item.label}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
