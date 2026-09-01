import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  message: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length === 0) return;
    const latestToast = toasts[toasts.length - 1];
    const timer = setTimeout(() => {
      onDismiss(latestToast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none w-[90vw] max-w-md" id="toast-notifications-root">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto bg-[#002147] text-white px-4 py-3.5 rounded-2xl shadow-2xl border border-white/10 flex items-start justify-between gap-3 backdrop-blur-md"
          >
            <div className="flex items-start gap-3">
              {toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : toast.type === 'info' ? (
                <Info className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
              )}
              <div className="text-xs sm:text-sm">
                <p className="font-semibold text-white tracking-tight">{toast.message}</p>
                {toast.description && (
                  <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">{toast.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-neutral-400 hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded-md cursor-pointer"
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
