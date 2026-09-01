import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X } from 'lucide-react';
import { getWhatsAppUrl, BRAND_CONFIG } from '../config';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

  React.useEffect(() => {
    // Show tooltip after 4 seconds if it hasn't been dismissed
    const timer = setTimeout(() => {
      if (!hasBeenDismissed) {
        setShowTooltip(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [hasBeenDismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTooltip(false);
    setHasBeenDismissed(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none" id="whatsapp-floating-container">
      {/* Interactive Tooltip Card - More Discreet */}
      <AnimatePresence>
        {showTooltip && !hasBeenDismissed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10, x: 20 }}
            className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#C5A059]/30 p-4 max-w-[280px] relative group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 pr-4">
                <p className="font-bold text-[#00152B] text-sm leading-tight">Dúvidas sobre reservas?</p>
                <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                  Fale com nosso concierge agora mesmo no WhatsApp.
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-900 p-1 transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Action Link inside tooltip */}
            <a 
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-center w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              Iniciar Conversa
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="pointer-events-auto w-16 h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_30px_rgb(37,211,102,0.4)] transition-all relative cursor-pointer group"
      >
        <MessageCircle className="w-8 h-8 fill-white text-transparent transition-transform group-hover:rotate-12" />
        
        {/* Pulse indicator */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
      </motion.a>
    </div>
  );
};
