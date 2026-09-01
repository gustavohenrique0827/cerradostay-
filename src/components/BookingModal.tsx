import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Property, BookingRequest } from '../types';
import { 
  X, MessageCircle, Calendar, Users, ShieldCheck, 
  Sparkles, CheckCircle2, Clock, Copy, Check, 
  MapPin, ArrowRight, Phone, User, MessageSquare
} from 'lucide-react';
import { BRAND_CONFIG, getPropertyWhatsAppBookingUrl } from '../config';
import { saveBooking } from '../utils/bookingStorage';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  checkIn: string;
  checkOut: string;
  adults: number;
  childrenCount: number;
  onSuccessToast?: (msg: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  property,
  checkIn,
  checkOut,
  adults,
  childrenCount,
  onSuccessToast,
}) => {
  const [step, setStep] = useState<'details' | 'sent'>('details');

  // Guest Information
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [arrivalTime, setArrivalTime] = useState('15:00 - 18:00');
  const [specialRequests, setSpecialRequests] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Reference Code
  const [requestCode, setRequestCode] = useState('');

  // Calculate stay duration & pricing
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 3;
    const start = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);
    const diff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    return Math.max(1, Math.round(diff));
  };

  const nights = calculateNights();
  const totalGuests = adults + childrenCount;
  const totalNightsCost = property.pricePerNight * nights;
  const cleaningFee = property.cleaningFee;
  const serviceFee = Math.round(totalNightsCost * (property.serviceFeePercentage / 100));
  const totalAmount = totalNightsCost + cleaningFee + serviceFee;

  // Format dates for display
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr || dateStr === 'A definir') return 'A definir';
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      const randomRef = `CER-${Math.floor(1000 + Math.random() * 9000)}`;
      setRequestCode(randomRef);
      setCopiedLink(false);
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const generateWhatsAppUrl = () => {
    return getPropertyWhatsAppBookingUrl({
      propertyName: property.name,
      checkIn: checkIn ? formatDateDisplay(checkIn) : 'A definir',
      checkOut: checkOut ? formatDateDisplay(checkOut) : 'A definir',
      nights,
      adults,
      childrenCount,
      totalAmount,
      guestName,
      guestPhone,
      specialRequests: specialRequests ? `${specialRequests} (Chegada prevista: ${arrivalTime})` : `Chegada prevista: ${arrivalTime}`,
      bookingCode: requestCode,
    });
  };

  const handleFinalizeWhatsApp = () => {
    // 1. Generate URL
    const url = generateWhatsAppUrl();

    // 2. Save booking inquiry locally for user tracking
    const newInquiry: BookingRequest = {
      id: requestCode,
      propertyId: property.id,
      propertyName: property.name,
      propertyLocation: `${property.location}, ${property.city} - ${property.state}`,
      propertyImage: property.coverImage,
      guestName: guestName.trim() || 'Hóspede Cerrado Stay',
      guestEmail: '',
      guestPhone: guestPhone.trim(),
      checkIn,
      checkOut,
      adults,
      children: childrenCount,
      specialRequests,
      arrivalTime,
      nights,
      pricePerNight: property.pricePerNight,
      totalNightsCost,
      cleaningFee,
      serviceFee,
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    saveBooking(newInquiry);

    // 3. Open WhatsApp in new window/tab
    window.open(url, '_blank');

    // 4. Update UI to Sent state
    setStep('sent');
    if (onSuccessToast) {
      onSuccessToast('Redirecionando para o WhatsApp oficial da Cerrado Stay...');
    }
  };

  const handleCopyMessage = () => {
    const text = `Solicitação de Reserva Cerrado Stay (${requestCode})\nImóvel: ${property.name}\nPeríodo: ${formatDateDisplay(checkIn)} a ${formatDateDisplay(checkOut)} (${nights} noites)\nHóspedes: ${totalGuests}\nValor Total Estimado: R$ ${totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
    if (onSuccessToast) {
      onSuccessToast('Dados da reserva copiados!');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#DEE2E6] overflow-hidden flex flex-col my-auto max-h-[92vh]"
        >
          {/* Top Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#DEE2E6] bg-[#F8F9FA] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center font-bold">
                <MessageCircle className="w-4 h-4 fill-[#25D366]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#002147]">
                  Finalizar Reserva no WhatsApp
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Atendimento direto e confirmação instantânea
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-full bg-white hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              aria-label="Fechar modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {step === 'details' ? (
              <>
                {/* Property Summary Card */}
                <div className="flex gap-4 p-4 rounded-2xl bg-[#F8F9FA] border border-[#DEE2E6]">
                  <img
                    src={property.coverImage}
                    alt={property.name}
                    className="w-24 h-24 rounded-xl object-cover shrink-0 border border-neutral-200"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#C5A059] mb-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{property.location}, {property.city} - {property.state}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-neutral-900 truncate">
                        {property.name}
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 text-[11px]">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-700 font-medium">
                        <Calendar className="w-3 h-3 text-[#C5A059]" />
                        {checkIn ? formatDateDisplay(checkIn) : 'A definir'} a {checkOut ? formatDateDisplay(checkOut) : 'A definir'} ({nights} noites)
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-700 font-medium">
                        <Users className="w-3 h-3 text-[#C5A059]" />
                        {totalGuests} {totalGuests === 1 ? 'hóspede' : 'hóspedes'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 space-y-2 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Diárias (R$ {property.pricePerNight} × {nights} noites)</span>
                    <span className="font-semibold text-neutral-900">R$ {totalNightsCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de limpeza profissional</span>
                    <span className="font-semibold text-neutral-900">R$ {cleaningFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de serviço da plataforma (10%)</span>
                    <span className="font-semibold text-neutral-900">R$ {serviceFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between text-sm font-bold text-neutral-900 pt-3 border-t border-neutral-200">
                    <span>Valor Total Estimado:</span>
                    <span className="text-base font-serif text-[#C5A059]">R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Optional Guest Identification */}
                <div className="space-y-4 pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-700">
                    <User className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Seus Dados de Contato (Opcional)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Seu Nome Completo
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Ex: João Silva"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Seu WhatsApp com DDD
                      </label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="Ex: (63) 99999-9999"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Previsão de Chegada (Check-in)
                      </label>
                      <select
                        value={arrivalTime}
                        onChange={(e) => setArrivalTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                      >
                        <option value="15:00 - 18:00">15:00 às 18:00 (Padrão)</option>
                        <option value="18:00 - 21:00">18:00 às 21:00 (Noite)</option>
                        <option value="Após as 21:00">Após as 21:00 (Madrugada)</option>
                        <option value="Early check-in (Sob consulta)">Early check-in (Sob consulta)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Observações ou Pedidos Especiais
                      </label>
                      <input
                        type="text"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Ex: berço infantil, vaga extra..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                      />
                    </div>
                  </div>
                </div>

                {/* Trust Information Callout */}
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-emerald-950">
                      Como funciona a finalização no WhatsApp:
                    </p>
                    <p className="text-emerald-800 leading-relaxed text-[11px]">
                      Ao clicar no botão abaixo, você será direcionado para o WhatsApp oficial da Cerrado Stay com todas as informações da sua estadia já preenchidas. Nossa equipe confirma a disponibilidade e combina os detalhes de pagamento diretamente com você.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* Step 2: SENT CONFIRMATION */
              <div className="py-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mx-auto shadow-xs">
                  <MessageCircle className="w-8 h-8 fill-[#25D366]" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] bg-[#FBF7EF] px-3 py-1 rounded-full">
                    Solicitação #{requestCode}
                  </span>
                  <h4 className="font-serif font-bold text-2xl text-neutral-900">
                    Conversa iniciada no WhatsApp!
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Se o WhatsApp não abriu automaticamente no seu navegador ou aplicativo, clique no botão abaixo para conversar agora mesmo com nossa equipe de concierge.
                  </p>
                </div>

                {/* Action Buttons in Confirmation */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-sm mx-auto">
                  <a
                    href={generateWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Abrir WhatsApp Novamente</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copiado!' : 'Copiar Dados'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="px-6 py-4 border-t border-[#DEE2E6] bg-[#F8F9FA] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              {step === 'sent' ? 'Fechar' : 'Cancelar'}
            </button>

            {step === 'details' && (
              <button
                type="button"
                onClick={handleFinalizeWhatsApp}
                id="modal-finalize-whatsapp-btn"
                className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Finalizar Reserva no WhatsApp</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
