import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  Trash2, 
  RotateCcw, 
  AlertCircle, 
  X, 
  ShieldAlert, 
  Check, 
  Loader2,
  Lock
} from 'lucide-react';

export type ConfirmationVariant = 'danger' | 'warning' | 'info';

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  itemName?: string;
  itemTypeLabel?: string;
  consequences?: string[];
  confirmButtonText?: string;
  cancelButtonText?: string;
  variant?: ConfirmationVariant;
  icon?: 'trash' | 'reset' | 'warning' | 'shield';
  requireCheckboxConfirmation?: boolean;
  checkboxLabel?: string;
  isProcessing?: boolean;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  itemName,
  itemTypeLabel = 'Item selecionado',
  consequences = ['Esta ação é definitiva e não poderá ser desfeita.'],
  confirmButtonText = 'Confirmar Ação',
  cancelButtonText = 'Cancelar',
  variant = 'danger',
  icon = 'trash',
  requireCheckboxConfirmation = true,
  checkboxLabel = 'Estou ciente do impacto e confirmo que desejo prosseguir.',
  isProcessing = false,
  onConfirm,
  onCancel,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [internalProcessing, setInternalProcessing] = useState(false);

  // Reset checkbox state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsChecked(false);
      setInternalProcessing(false);
    }
  }, [isOpen]);

  // Lock body scroll and listen for ESC key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing && !internalProcessing) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isProcessing, internalProcessing, onCancel]);

  if (!isOpen) return null;

  const handleConfirmAction = async () => {
    if (requireCheckboxConfirmation && !isChecked) return;
    if (isProcessing || internalProcessing) return;

    try {
      setInternalProcessing(true);
      await onConfirm();
    } finally {
      setInternalProcessing(false);
    }
  };

  const isBusy = isProcessing || internalProcessing;
  const canSubmit = !requireCheckboxConfirmation || isChecked;

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-600',
          badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
          btnConfirm: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
          cardBorder: 'border-amber-200/80',
          accent: 'text-amber-600',
        };
      case 'info':
        return {
          iconBg: 'bg-[#002147]/10 border-[#002147]/20 text-[#002147]',
          badgeBg: 'bg-blue-50 border-blue-200 text-blue-800',
          btnConfirm: 'bg-[#002147] hover:bg-[#C5A059] text-white shadow-[#002147]/20',
          cardBorder: 'border-blue-200/80',
          accent: 'text-[#002147]',
        };
      case 'danger':
      default:
        return {
          iconBg: 'bg-rose-500/10 border-rose-500/20 text-rose-600',
          badgeBg: 'bg-rose-50 border-rose-200 text-rose-800',
          btnConfirm: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25',
          cardBorder: 'border-rose-200/80',
          accent: 'text-rose-600',
        };
    }
  };

  const styles = getVariantStyles();

  const renderIcon = () => {
    switch (icon) {
      case 'reset':
        return <RotateCcw className="w-6 h-6 animate-spin-reverse" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6" />;
      case 'shield':
        return <ShieldAlert className="w-6 h-6" />;
      case 'trash':
      default:
        return <Trash2 className="w-6 h-6" />;
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isBusy) {
            onCancel();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Decorative Alert Banner */}
          <div className={`h-2.5 w-full ${variant === 'danger' ? 'bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700' : variant === 'warning' ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600' : 'bg-gradient-to-r from-[#002147] via-[#C5A059] to-[#002147]'}`} />

          <div className="p-6 sm:p-8 space-y-6">
            {/* Header & Icon */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-13 h-13 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs ${styles.iconBg}`}>
                  {renderIcon()}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 block mb-0.5">
                    Confirmação de Segurança
                  </span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-neutral-900 leading-tight">
                    {title}
                  </h3>
                </div>
              </div>

              {!isBusy && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer shrink-0"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Main Description */}
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
              {description}
            </p>

            {/* Target Item Highlight Card (if provided) */}
            {itemName && (
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    {itemTypeLabel}
                  </span>
                  <span className="font-serif font-bold text-sm sm:text-base text-neutral-900 truncate block">
                    {itemName}
                  </span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${styles.badgeBg}`}>
                  {variant === 'danger' ? 'Exclusão' : 'Restauração'}
                </span>
              </div>
            )}

            {/* Warning Consequences Checklist */}
            {consequences.length > 0 && (
              <div className={`p-4 rounded-2xl border space-y-2 text-xs ${styles.badgeBg}`}>
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Impacto da ação:</span>
                </div>
                <ul className="space-y-1.5 pl-6 list-disc text-[11px] leading-relaxed">
                  {consequences.map((item, idx) => (
                    <li key={idx} className="font-medium">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Safeguard: Explicit Checkbox to Prevent Accidental Clicks */}
            {requireCheckboxConfirmation && (
              <label 
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                  isChecked 
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs' 
                    : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100/80 text-neutral-800'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  disabled={isBusy}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors border ${
                  isChecked 
                    ? 'bg-[#C5A059] border-[#C5A059] text-white' 
                    : 'bg-white border-neutral-300'
                }`}>
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div className="text-xs">
                  <span className="font-bold block">Trava de Segurança</span>
                  <span className={`text-[11px] font-normal leading-snug ${isChecked ? 'text-white/80' : 'text-neutral-500'}`}>
                    {checkboxLabel}
                  </span>
                </div>
              </label>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={isBusy}
                className="flex-1 py-3.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 min-h-[46px]"
              >
                {cancelButtonText}
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={!canSubmit || isBusy}
                className={`flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none min-h-[46px] active:scale-[0.98] ${styles.btnConfirm}`}
              >
                {isBusy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    {icon === 'trash' && <Trash2 className="w-4 h-4" />}
                    {icon === 'reset' && <RotateCcw className="w-4 h-4" />}
                    {icon === 'warning' && <AlertTriangle className="w-4 h-4" />}
                    <span>{confirmButtonText}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
