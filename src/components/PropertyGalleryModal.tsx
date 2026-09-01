import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Maximize2, Share2, Heart } from 'lucide-react';

interface PropertyGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  propertyName: string;
  initialIndex?: number;
}

export const PropertyGalleryModal: React.FC<PropertyGalleryModalProps> = ({
  isOpen,
  onClose,
  images,
  propertyName,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md"
        id="property-gallery-lightbox"
      >
        {/* Top Header Controls */}
        <div className="flex items-center justify-between text-white z-10 max-w-7xl mx-auto w-full">
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-white truncate max-w-md">
              {propertyName}
            </h3>
            <p className="text-xs text-neutral-400">
              Foto {currentIndex + 1} de {images.length}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar galeria"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Main Image Stage */}
        <div className="relative flex-1 flex items-center justify-center my-4 max-w-6xl mx-auto w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`${propertyName} - Foto ${currentIndex + 1}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="max-h-[72vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
          </AnimatePresence>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all border border-white/20 shadow-lg"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all border border-white/20 shadow-lg"
                aria-label="Próxima foto"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Bottom Thumbnail Strip */}
        <div className="max-w-4xl mx-auto w-full overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center justify-center gap-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  idx === currentIndex ? 'border-[#C5A059] scale-105 opacity-100 shadow-md' : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
