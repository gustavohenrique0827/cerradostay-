import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookingRequest } from '../types';
import { 
  KeyRound, Search, CheckCircle2, AlertCircle, Clock, 
  Sparkles, CheckSquare, Square, ThumbsUp, ArrowRight, ShieldCheck,
  CreditCard, QrCode, Wifi, Lock, Printer, MessageSquare, Copy, Check,
  ExternalLink, Calendar, Users, RefreshCw
} from 'lucide-react';
import { getSavedBookings, findBookingByCode, updateBookingStatus } from '../utils/bookingStorage';

interface DigitalCheckoutProps {
  onToast: (msg: string) => void;
  onOpenPaymentModal?: (booking: BookingRequest) => void;
}

export const DigitalCheckout: React.FC<DigitalCheckoutProps> = ({ onToast, onOpenPaymentModal }) => {
  const [activeTab, setActiveTab] = useState<'access_and_bookings' | 'checkout_inspection'>('access_and_bookings');
  const [bookingCodeInput, setBookingCodeInput] = useState('');
  const [activeBooking, setActiveBooking] = useState<BookingRequest | null>(null);
  const [userBookings, setUserBookings] = useState<BookingRequest[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Checkout inspection state
  const [checklist, setChecklist] = useState({
    airConditioning: false,
    trashDisposed: false,
    windowsClosed: false,
    doorLocked: false,
  });
  const [feedbackRating, setFeedbackRating] = useState<number | null>(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load saved bookings on mount
  useEffect(() => {
    const loaded = getSavedBookings();
    setUserBookings(loaded);
    if (loaded.length > 0 && !activeBooking) {
      setActiveBooking(loaded[0]);
    }
  }, []);

  const handleSearchCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!bookingCodeInput.trim()) return;

    const found = findBookingByCode(bookingCodeInput.trim());
    if (found) {
      setActiveBooking(found);
      setIsCompleted(false);
      onToast(`Reserva ${found.id} localizada com sucesso!`);
    } else {
      setErrorMessage('Nenhuma reserva encontrada com este código localizador. Verifique o código e tente novamente.');
    }
  };

  const handleToggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFinalizeCheckout = () => {
    if (!activeBooking) return;
    setIsCompleted(true);
    if (activeBooking.id) {
      updateBookingStatus(activeBooking.id, 'completed');
    }
    onToast('Check-out concluído com sucesso! Obrigado pela sua estadia com a Cerrado Stay.');
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
    onToast('Copiado para a área de transferência!');
  };

  const allChecked = Object.values(checklist).every(Boolean);

  return (
    <section id="checkout-digital" className="py-24 bg-[#F8F9FA] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-3">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Portal do Hóspede</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#002147] mb-3">
            Área do Hóspede & Check-out Digital
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
            Consulte seus comprovantes de pagamento digital, acesse a senha da fechadura eletrônica e finalize sua estadia com apenas um clique.
          </p>
        </div>

        {/* Navigation Tabs (Meus Acessos / Check-out) */}
        <div className="flex justify-center mb-8">
          <div className="bg-neutral-200/80 p-1 rounded-2xl flex max-w-md w-full border border-neutral-300">
            <button
              onClick={() => setActiveTab('access_and_bookings')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'access_and_bookings'
                  ? 'bg-white text-[#002147] shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Acessos & Comprovantes</span>
            </button>

            <button
              onClick={() => setActiveTab('checkout_inspection')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'checkout_inspection'
                  ? 'bg-white text-[#002147] shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Check-out Rápido</span>
            </button>
          </div>
        </div>

        {/* Main Interactive Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-[#DEE2E6] shadow-xl">
          {/* Lookup Input Form */}
          <form onSubmit={handleSearchCode} className="mb-6">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 block mb-2">
              Digite seu Código Localizador de Reserva
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ex: CER-2026-8942 ou RES-2026-884"
                  value={bookingCodeInput}
                  onChange={(e) => setBookingCodeInput(e.target.value)}
                  className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-neutral-300 text-sm font-semibold uppercase tracking-wider focus:border-[#C5A059] outline-none"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="bg-[#C5A059] hover:bg-[#A68648] text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                Localizar Reserva
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-xs text-rose-500 mt-2 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errorMessage}
              </p>
            )}
          </form>

          {/* User's Recent Saved Bookings List (if any from localStorage) */}
          {userBookings.length > 0 && (
            <div className="mb-6 pt-4 border-t border-neutral-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                Suas Reservas Realizadas Neste Navegador:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {userBookings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setActiveBooking(b);
                      setBookingCodeInput(b.id || '');
                      setIsCompleted(false);
                    }}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      activeBooking?.id === b.id
                        ? 'border-[#C5A059] bg-[#FBF7EF]/70 ring-1 ring-[#C5A059]'
                        : 'border-neutral-200 bg-neutral-50 hover:bg-white'
                    }`}
                  >
                    <div>
                      <strong className="text-neutral-900 block font-serif truncate max-w-[200px]">
                        {b.propertyName}
                      </strong>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {b.id} · {b.checkIn} a {b.checkOut}
                      </span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      ✓ Confirmada
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVE BOOKING DISPLAY */}
          {activeBooking && (
            <div className="pt-6 border-t border-neutral-100 space-y-6">

              {/* ================= TAB 1: ACESSOS E COMPROVANTE ================= */}
              {activeTab === 'access_and_bookings' && (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                            Reserva Confirmada
                          </span>
                          <span className="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.2 rounded font-mono">
                            {activeBooking.id}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-base text-neutral-900 mt-0.5">
                          {activeBooking.propertyName}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-neutral-500 block uppercase font-bold">Valor Total</span>
                      <strong className="text-base font-serif text-[#C5A059]">
                        R$ {activeBooking.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </strong>
                    </div>
                  </div>

                  {/* Digital Passcode & Wi-Fi Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#002147] text-white p-5 rounded-2xl border border-white/10 space-y-2 relative overflow-hidden">
                      <div className="flex items-center justify-between text-neutral-300 text-xs">
                        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-[#D4AF37]">
                          <KeyRound className="w-3.5 h-3.5" />
                          Fechadura Eletrônica
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(activeBooking.payment?.digitalLockPasscode || '4092#', 'lock')}
                          className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded cursor-pointer"
                        >
                          {copiedKey === 'lock' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copiar</span>
                        </button>
                      </div>

                      <div className="pt-1">
                        <span className="text-2xl font-mono font-bold text-[#D4AF37] tracking-widest block">
                          {activeBooking.payment?.digitalLockPasscode || '4092#'}
                        </span>
                        <span className="text-[11px] text-neutral-400 block mt-1">
                          Digite a senha e pressione a tecla # na maçaneta inteligente.
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#002147] text-white p-5 rounded-2xl border border-white/10 space-y-2 relative overflow-hidden">
                      <div className="flex items-center justify-between text-neutral-300 text-xs">
                        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-[#D4AF37]">
                          <Wifi className="w-3.5 h-3.5" />
                          Wi-Fi de Alta Velocidade
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(activeBooking.payment?.wifiPassword || 'cerradostay2026', 'wifi')}
                          className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded cursor-pointer"
                        >
                          {copiedKey === 'wifi' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copiar</span>
                        </button>
                      </div>

                      <div className="pt-1">
                        <span className="text-sm font-mono font-bold text-white block">
                          Rede: {activeBooking.payment?.wifiNetwork || 'CERRADO_STAY_FIBRA'}
                        </span>
                        <span className="text-sm font-mono text-[#D4AF37] font-bold block mt-0.5">
                          Senha: {activeBooking.payment?.wifiPassword || 'cerradostay2026'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Details Table */}
                  <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-[#DEE2E6] text-xs space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-neutral-200 pb-3">
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold">Hóspede</span>
                        <strong className="text-neutral-900">{activeBooking.guestName}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold">Check-in</span>
                        <strong className="text-neutral-900">{activeBooking.checkIn}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold">Check-out</span>
                        <strong className="text-neutral-900">{activeBooking.checkOut}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold">Canal de Reserva</span>
                        <strong className="text-neutral-900 uppercase">WhatsApp Oficial</strong>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <span className="text-neutral-500 text-[11px]">
                        📍 {activeBooking.propertyLocation || 'Palmas, TO'}
                      </span>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 font-bold text-xs text-[#C5A059] hover:underline cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Imprimir Comprovante Oficial</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 2: CHECK-OUT INSPECTION ================= */}
              {activeTab === 'checkout_inspection' && !isCompleted && (
                <div className="space-y-6">
                  <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-[#DEE2E6] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Imóvel Atual</span>
                      <strong className="text-neutral-900 font-serif text-sm">{activeBooking.propertyName}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Horário Limite</span>
                      <strong className="text-[#C5A059] font-bold">Até as 11:00h</strong>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div>
                    <h4 className="font-serif font-bold text-base text-neutral-900 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      <span>Checklist de Saída do Imóvel</span>
                    </h4>
                    <p className="text-xs text-neutral-500 mb-3">
                      Marque as etapas concluídas antes de trancar a fechadura:
                    </p>

                    <div className="space-y-2 text-xs">
                      <div
                        onClick={() => handleToggleCheck('airConditioning')}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          checklist.airConditioning ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {checklist.airConditioning ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-neutral-400" />}
                        <span className="font-semibold">Ar-condicionado e luzes desligados</span>
                      </div>

                      <div
                        onClick={() => handleToggleCheck('trashDisposed')}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          checklist.trashDisposed ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {checklist.trashDisposed ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-neutral-400" />}
                        <span className="font-semibold">Lixo recolhido e depositado na lixeira</span>
                      </div>

                      <div
                        onClick={() => handleToggleCheck('windowsClosed')}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          checklist.windowsClosed ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {checklist.windowsClosed ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-neutral-400" />}
                        <span className="font-semibold">Janelas e sacada devidamente travadas</span>
                      </div>

                      <div
                        onClick={() => handleToggleCheck('doorLocked')}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          checklist.doorLocked ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {checklist.doorLocked ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-neutral-400" />}
                        <span className="font-semibold">Porta trancada com a fechadura eletrônica</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-2">
                      Como foi sua experiência na estadia?
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className={`w-10 h-10 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                            feedbackRating === star
                              ? 'bg-[#C5A059] text-white shadow-md'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          }`}
                        >
                          {star}★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleFinalizeCheckout}
                    className="w-full bg-[#002147] hover:bg-black text-white py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>Confirmar Saída & Finalizar Check-out</span>
                  </button>
                </div>
              )}

              {/* Check-out Completed State */}
              {activeTab === 'checkout_inspection' && isCompleted && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-neutral-900">
                    Check-out Concluído com Sucesso!
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
                    Nossa equipe foi notificada sobre a sua saída do <strong>{activeBooking.propertyName}</strong>. Foi um enorme prazer recebê-lo!
                  </p>
                  <button
                    onClick={() => {
                      setIsCompleted(false);
                      setActiveTab('access_and_bookings');
                    }}
                    className="mt-4 text-xs font-bold text-[#C5A059] hover:underline cursor-pointer"
                  >
                    Voltar aos meus comprovantes
                  </button>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </section>
  );
};
