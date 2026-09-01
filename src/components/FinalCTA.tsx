import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, MessageCircle, Calendar } from 'lucide-react';
import { getWhatsAppUrl } from '../config';

export const FinalCTA: React.FC = () => {
  const scrollToProperties = () => {
    const el = document.getElementById('imoveis');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-[#002147] text-white relative overflow-hidden">
      {/* Background with Ambient Overlay */}
      <div className="absolute inset-0 z-0 bg-[#002147]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00152B] via-[#002147] to-[#00152B]" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#F8F9FA] text-xs uppercase tracking-widest font-semibold border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Reserve com Segurança e Exclusividade</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-3xl mx-auto text-balance leading-tight">
            Seu próximo destino está mais perto do que você imagina.
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-neutral-300 font-light max-w-xl mx-auto text-balance leading-relaxed">
            Escolha seu imóvel, selecione suas datas e prepare-se para viver uma nova experiência com o padrão de atendimento Cerrado Stay.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={scrollToProperties}
              id="final-cta-find-property-btn"
              className="bg-[#C5A059] hover:bg-[#A68648] text-white px-8 py-4 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl hover:shadow-2xl active:scale-98 flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Encontrar meu imóvel</span>
            </button>

            <a
              href={getWhatsAppUrl('Olá! Gostaria de falar com a equipe de atendimento da Cerrado Stay.')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/25 px-7 py-4 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all backdrop-blur-md flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Falar com nossa equipe</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
