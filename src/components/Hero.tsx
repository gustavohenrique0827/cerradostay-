import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowDown, Star, Award, ShieldCheck, MapPin } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { SearchFilterState } from '../types';
import { getWhatsAppUrl } from '../config';

import { openExternalUrl } from '../utils/mobileUtils';

interface HeroProps {
  onSearch: (filter: SearchFilterState) => void;
  initialFilters?: Partial<SearchFilterState>;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, initialFilters }) => {
  const scrollToProperties = () => {
    const el = document.getElementById('imoveis');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center pt-20 pb-20 z-20">
      {/* Background Gradient & Architectural Texture */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#00152B]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#003366]/40 via-[#00152B] to-[#000B18]" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center flex flex-col items-center">
        {/* Top Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/80 text-[9px] uppercase tracking-[0.25em] font-bold mb-8 shadow-xl"
        >
          <Sparkles className="w-3 h-3 text-[#C5A059]" />
          <span>Reserve com segurança e exclusividade</span>
        </motion.div>

        {/* Cinematic Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight max-w-4xl leading-[1.05] mb-8"
        >
          Sinta-se em casa, <br />
          mesmo longe <br />
          de casa.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-lg text-white/50 font-light max-w-2xl leading-relaxed mb-10"
        >
          Curadoria exclusiva de imóveis premium em Palmas para estadias memoráveis. <br className="hidden md:inline" />
          Conforto, design e hospitalidade de excelência para sua viagem.
        </motion.p>

        {/* Primary Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pb-12"
        >
          <button
            onClick={scrollToProperties}
            className="bg-[#C5A059] hover:bg-[#D4AF37] text-white px-8 py-4 rounded-xl font-bold text-[10px] tracking-[0.15em] uppercase transition-all shadow-2xl hover:shadow-[#C5A059]/20 hover:-translate-y-0.5 active:scale-95 cursor-pointer touch-manipulation"
          >
            Ver Acomodações
          </button>
          
          <button
            onClick={() => openExternalUrl(getWhatsAppUrl('Olá! Gostaria de tirar algumas dúvidas sobre as acomodações.'))}
            className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-xl font-bold text-[10px] tracking-[0.15em] uppercase transition-all flex items-center gap-2 hover:-translate-y-0.5 cursor-pointer touch-manipulation"
          >
            Falar com Concierge
          </button>
        </motion.div>
      </div>

      {/* Embedded Search Component at Bottom - Clean and Properly Spaced */}
      <div className="relative z-30 max-w-5xl mx-auto px-4 sm:px-6 w-full pt-4">
        <SearchBar onSearch={onSearch} initialFilters={initialFilters} />
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/30"
      >
        <span className="text-[8px] uppercase tracking-[0.3em] font-bold">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </section>
  );
};
