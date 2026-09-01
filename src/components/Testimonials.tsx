import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TESTIMONIALS_DATA } from '../data/content';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!TESTIMONIALS_DATA || TESTIMONIALS_DATA.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  return (
    <section id="avaliacoes" className="py-24 bg-[#F8F9FA] border-t border-[#DEE2E6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Carousel Navigation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Depoimentos Reais</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#002147] leading-tight">
              Quem se hospeda, recomenda.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 font-light mt-2 max-w-lg">
              Mais de 1.000 viajantes já viveram momentos memoráveis em nossos imóveis com nota média de 4.9 estrelas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full bg-white hover:bg-[#FBF7EF] text-neutral-800 border border-[#DEE2E6] flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full bg-white hover:bg-[#FBF7EF] text-neutral-800 border border-[#DEE2E6] flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS_DATA.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-7 border border-[#DEE2E6] hover:border-[#C5A059]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#DEE2E6]" />
                </div>

                {/* Comment Text */}
                <p className="text-xs sm:text-sm text-neutral-700 font-light leading-relaxed mb-6 italic">
                  "{item.comment}"
                </p>
              </div>

              {/* Author & Stay Info */}
              <div className="pt-4 border-t border-neutral-100 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-xs text-neutral-900 flex items-center gap-1">
                    <span>{item.name}</span>
                    <CheckCircle2 className="w-3 h-3 text-[#C5A059] shrink-0" />
                  </h4>
                  <p className="text-[10px] text-neutral-500 truncate">{item.city} · {item.date}</p>
                  <p className="text-[10px] text-[#C5A059] font-semibold truncate mt-0.5">{item.propertyName}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
