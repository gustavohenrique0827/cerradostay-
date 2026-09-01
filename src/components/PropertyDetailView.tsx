import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Property } from '../types';
import { 
  Star, MapPin, Users, Bed, Bath, Heart, Share2, ArrowLeft, 
  ShieldCheck, Sparkles, Check, Copy, Wifi, Wind, Tv, 
  Utensils, Waves, Car, Shirt, Eye, Key, Dog, Coffee, Laptop, 
  Flame, Dumbbell, Calendar, Clock, ChevronRight, MessageCircle, Lock 
} from 'lucide-react';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { PropertyGalleryModal } from './PropertyGalleryModal';
import { BookingModal } from './BookingModal';
import { BRAND_CONFIG, getPropertyWhatsAppBookingUrl } from '../config';

interface PropertyDetailViewProps {
  property: Property;
  onBack: () => void;
  onSelectProperty: (property: Property) => void;
  allProperties: Property[];
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onToast: (msg: string) => void;
}

const iconAmenityMap: Record<string, any> = {
  'Wi-Fi': Wifi,
  'Ar-condicionado': Wind,
  'Smart TV': Tv,
  'Cozinha': Utensils,
  'Piscina': Waves,
  'Vaga de Garagem': Car,
  'Garagem': Car,
  'Estacionamento': Car,
  'Máquina Lava': Shirt,
  'Varanda': Eye,
  'Fechadura': Key,
  'Pet': Dog,
  'Cafeteira': Coffee,
  'Espaço de Trabalho': Laptop,
  'Churrasqueira': Flame,
  'Academia': Dumbbell,
  'Roupas de Cama': Sparkles,
};

export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({
  property,
  onBack,
  onSelectProperty,
  allProperties,
  isFavorite = false,
  onToggleFavorite,
  onToast,
}) => {
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [adults, setAdults] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Scroll to top when property changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [property.id]);

  const images = property.images && property.images.length > 0 ? property.images : [property.coverImage];

  // Calculate nights and pricing
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 3; // default estimate
    const start = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);
    const diff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    return Math.max(1, Math.round(diff));
  };

  const nights = calculateNights();
  const totalNightsCost = property.pricePerNight * nights;
  const cleaningFee = property.cleaningFee;
  const serviceFee = Math.round(totalNightsCost * (property.serviceFeePercentage / 100));
  const totalAmount = totalNightsCost + cleaningFee + serviceFee;

  const totalGuests = adults + childrenCount;

  const handleShareWhatsApp = () => {
    const url = window.location.href;
    const text = encodeURIComponent(`Confira este imóvel incrível para nossa próxima estadia: ${property.name} em ${property.city}!\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowShareMenu(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    onToast('Link do imóvel copiado para a área de transferência!');
    setShowShareMenu(false);
  };

  const openLightboxAt = (index: number) => {
    setGalleryStartIndex(index);
    setIsGalleryOpen(true);
  };

  const getAmenityIcon = (name: string) => {
    for (const key in iconAmenityMap) {
      if (name.toLowerCase().includes(key.toLowerCase())) {
        return iconAmenityMap[key];
      }
    }
    return Sparkles;
  };

  const similarProperties = allProperties
    .filter((p) => p.id !== property.id && (p.city === property.city || (Array.isArray(p.category) && Array.isArray(property.category) && p.category.some((c) => property.category.includes(c)))))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-20 text-[#002147]" id="property-detail-page">
      {/* Lightbox Modal */}
      <PropertyGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={images}
        propertyName={property.name}
        initialIndex={galleryStartIndex}
      />

      {/* Booking Checkout Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        property={property}
        checkIn={checkIn || new Date().toISOString().split('T')[0]}
        checkOut={checkOut || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]}
        adults={adults}
        childrenCount={childrenCount}
        onSuccessToast={onToast}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumbs & Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={onBack}
            id="back-to-properties-btn"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-white px-4 py-2 rounded-full border border-[#DEE2E6] shadow-2xs hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para todos os imóveis</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Share Button & Popover */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-neutral-50 text-neutral-700 px-3.5 py-2 rounded-full border border-[#DEE2E6] transition-colors"
                id="share-property-btn"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartilhar</span>
              </button>

              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#DEE2E6] p-2 z-30 space-y-1">
                  <button
                    onClick={handleShareWhatsApp}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-700 hover:bg-[#FBF7EF] hover:text-[#C5A059] rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Enviar no WhatsApp</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-700 hover:bg-[#FBF7EF] hover:text-[#C5A059] rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <Copy className="w-4 h-4 text-neutral-500" />
                    <span>Copiar Link Direto</span>
                  </button>
                </div>
              )}
            </div>

            {/* Favorite Button */}
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(property.id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-neutral-50 text-neutral-700 px-3.5 py-2 rounded-full border border-[#DEE2E6] transition-colors cursor-pointer"
                id="favorite-property-btn"
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-neutral-600'}`} />
                <span>{isFavorite ? 'Salvo' : 'Salvar'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Property Title & Meta Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {property.badge && (
              <span className="bg-[#002147] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">
                {property.badge}
              </span>
            )}
            {property.isSuperhost && (
              <span className="bg-[#C5A059] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">
                Administradora Cerrado
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#002147] tracking-tight leading-tight mb-2">
            {property.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-neutral-600">
            <div className="flex items-center gap-1 font-bold text-[#002147]">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{property.rating.toFixed(2)}</span>
              <span className="text-neutral-500 font-normal">({property.reviewsCount} avaliações)</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1 font-medium">
              <MapPin className="w-4 h-4 text-[#C5A059]" />
              <span>{property.location}, {property.city} - {property.state}</span>
            </div>
          </div>
        </div>

        {/* Asymmetrical High-End Photo Gallery */}
        <div className="relative mb-10 rounded-2xl overflow-hidden shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 aspect-[4/3] md:aspect-[21/9]">
            {/* Main Primary Image */}
            <div
              onClick={() => openLightboxAt(0)}
              className="md:col-span-2 relative overflow-hidden group cursor-pointer bg-neutral-200"
            >
              <img
                src={images[0]}
                alt={`${property.name} Foto Principal`}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* 4 Secondary Images Grid */}
            <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2">
              {images.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => openLightboxAt(idx + 1)}
                  className="relative overflow-hidden group cursor-pointer bg-neutral-200"
                >
                  <img
                    src={img}
                    alt={`${property.name} Foto ${idx + 2}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* View All Photos Floating Button */}
          <button
            onClick={() => openLightboxAt(0)}
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-neutral-900 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-xs flex items-center gap-2 transition-all cursor-pointer"
            id="view-all-photos-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Ver todas as {images.length} fotos</span>
          </button>
        </div>

        {/* Layout Grid: Left Details & Right Sticky Reservation Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* LEFT COLUMN: SPECS, AMENITIES, CALENDAR, REVIEWS */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Specs Highlight Box */}
            <div className="bg-white rounded-2xl p-6 border border-[#DEE2E6] shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                  <h3 className="font-serif font-bold text-xl text-neutral-900">
                    Hospedagem inteira administrada por Cerrado Stay
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Até {property.maxGuests} hóspedes · {property.bedrooms} quartos · {property.beds} camas · {property.bathrooms} banheiros
                  </p>
                </div>

                <div className="w-12 h-12 rounded-full bg-[#002147] text-[#F8F9FA] flex items-center justify-center font-serif font-bold text-xl shadow-xs">
                  A
                </div>
              </div>

              {/* Guarantees Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FBF7EF] text-[#C5A059] flex items-center justify-center shrink-0">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900">Self Check-in Digital</h4>
                    <p className="text-neutral-500 mt-0.5">Fechadura eletrônica com senha única para sua estadia.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FBF7EF] text-[#C5A059] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900">Limpeza Padrão Hotel</h4>
                    <p className="text-neutral-500 mt-0.5">Protocolo hoteleiro rigoroso com enxoval higienizado.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FBF7EF] text-[#C5A059] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900">Concierge 24 Horas</h4>
                    <p className="text-neutral-500 mt-0.5">Suporte dedicado para garantir sua experiência perfeita.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DEE2E6] shadow-2xs space-y-4">
              <h3 className="font-serif font-bold text-2xl text-neutral-900">
                Sobre este espaço
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed font-normal">
                {property.description}
              </p>
              {property.longDescription && (
                <div className="space-y-3 pt-2 text-sm text-neutral-600 leading-relaxed font-light">
                  {property.longDescription.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Amenities Grid ("O que este espaço oferece") */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DEE2E6] shadow-2xs">
              <h3 className="font-serif font-bold text-2xl text-neutral-900 mb-6">
                O que este espaço oferece
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.amenities.map((amenityName, idx) => {
                  const Icon = getAmenityIcon(amenityName);
                  return (
                    <div key={idx} className="flex items-center gap-3.5 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                      <div className="w-8 h-8 rounded-lg bg-white text-[#C5A059] flex items-center justify-center shrink-0 shadow-2xs">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-neutral-800">{amenityName}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Availability Calendar */}
            <div>
              <h3 className="font-serif font-bold text-2xl text-neutral-900 mb-2">
                Escolha suas datas
              </h3>
              <p className="text-xs text-neutral-500 mb-4">
                Selecione as datas para consultar disponibilidade e calcular os valores exatos da sua estadia.
              </p>
              <AvailabilityCalendar
                bookedDates={property.bookedDates}
                checkIn={checkIn}
                checkOut={checkOut}
                onSelectDates={(inD, outD) => {
                  setCheckIn(inD);
                  setCheckOut(outD);
                }}
                pricePerNight={property.pricePerNight}
              />
            </div>

            {/* House Rules & Check-in Details */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DEE2E6] shadow-2xs">
              <h3 className="font-serif font-bold text-xl text-neutral-900 mb-4">
                Regras e Informações da Estadia
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-neutral-600">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-bold text-neutral-900">
                    <Clock className="w-4 h-4 text-[#C5A059]" />
                    <span>Horários de Entrada e Saída</span>
                  </div>
                  <ul className="space-y-1.5 pl-6 list-disc">
                    <li>Check-in a partir das <strong>{property.checkInTime}</strong></li>
                    <li>Check-out até as <strong>{property.checkOutTime}</strong></li>
                    <li>Early check-in ou late check-out sob consulta prévia</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-bold text-neutral-900">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    <span>Regras da Casa</span>
                  </div>
                  <ul className="space-y-1.5 pl-6 list-disc">
                    {property.houseRules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Location & Neighborhood Highlights in Palmas */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DEE2E6] shadow-2xs">
              <div className="flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4" />
                <span>Localização em Palmas, TO</span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-neutral-900 mb-2">
                {property.location}
              </h3>
              <p className="text-xs text-neutral-500 mb-6">
                Região nobre com acesso facilitado às principais atrações, gastronomia e belezas naturais da capital tocantinense.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059]">Lago & Orla</p>
                  <p className="text-xs font-semibold text-neutral-900 mt-1">Praia da Graciosa</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Pôr do sol, calçadão e esportes náuticos</p>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059]">Centro & Negócios</p>
                  <p className="text-xs font-semibold text-neutral-900 mt-1">Praça dos Girassóis</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Centro cívico, palácios e bistrôs</p>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059]">Ecoturismo</p>
                  <p className="text-xs font-semibold text-neutral-900 mt-1">Serra do Carmo / Taquaruçu</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Cachoeiras e mirantes panorâmicos</p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DEE2E6] shadow-2xs">
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100 mb-6">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-neutral-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>{property.rating.toFixed(2)} · {property.reviewsCount} avaliações</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Avaliações verificadas de hóspedes reais</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {property.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={rev.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={rev.authorName}
                          className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-neutral-900">{rev.authorName}</h4>
                          <p className="text-[11px] text-neutral-500">{rev.authorLocation} · {rev.date}</p>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 pt-3 mt-3 border-t border-neutral-200/50">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING SUMMARY CARD */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-7 border border-[#DEE2E6] shadow-xl space-y-5">
              {/* Header Price */}
              <div className="flex items-baseline justify-between pb-4 border-b border-neutral-100">
                <div>
                  <span className="font-serif font-bold text-3xl text-neutral-900">
                    R$ {property.pricePerNight}
                  </span>
                  <span className="text-xs text-neutral-500 font-normal ml-1">/ noite</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-neutral-800">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{property.rating.toFixed(2)}</span>
                  <span className="text-neutral-400 font-normal">({property.reviewsCount})</span>
                </div>
              </div>

              {/* Date & Guest Selectors Box */}
              <div className="border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-200 text-xs">
                <div className="grid grid-cols-2 divide-x divide-neutral-200">
                  <div className="p-3 bg-neutral-50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Check-in</span>
                    <strong className="text-neutral-900 text-xs font-semibold">
                      {checkIn ? checkIn.split('-').reverse().join('/') : 'Selecionar data'}
                    </strong>
                  </div>
                  <div className="p-3 bg-neutral-50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Check-out</span>
                    <strong className="text-neutral-900 text-xs font-semibold">
                      {checkOut ? checkOut.split('-').reverse().join('/') : 'Selecionar data'}
                    </strong>
                  </div>
                </div>

                {/* Guests counter */}
                <div className="p-3 bg-neutral-50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Hóspedes</span>
                    <strong className="text-neutral-900 text-xs font-semibold">
                      {totalGuests} {totalGuests === 1 ? 'hóspede' : 'hóspedes'}
                    </strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      disabled={adults <= 1}
                      className="w-6 h-6 rounded-full bg-white border border-neutral-300 flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(Math.min(property.maxGuests, adults + 1))}
                      disabled={totalGuests >= property.maxGuests}
                      className="w-6 h-6 rounded-full bg-white border border-neutral-300 flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Calculation details */}
              <div className="space-y-2 text-xs text-neutral-600 pt-2">
                <div className="flex justify-between">
                  <span>R$ {property.pricePerNight} × {nights} noites</span>
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

                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-3 border-t border-neutral-100">
                  <span>Total estimado:</span>
                  <span className="text-lg font-serif text-[#C5A059]">R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Main Booking Action */}
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(true)}
                id="request-booking-btn"
                className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Reservar pelo WhatsApp</span>
              </button>

              <div className="space-y-1.5 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#25D366] font-semibold bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200">
                  <span>⚡ Atendimento rápido e confirmação direta no WhatsApp</span>
                </div>
                <p className="text-[10px] text-neutral-400 font-medium">
                  A confirmação das datas, dúvidas e opções de pagamento são finalizadas diretamente com nosso concierge.
                </p>
              </div>

              {/* Direct WhatsApp Contact */}
              <a
                href={getPropertyWhatsAppBookingUrl({
                  propertyName: property.name,
                  checkIn: checkIn || 'A definir',
                  checkOut: checkOut || 'A definir',
                  guests: totalGuests,
                  totalAmount,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#FBF7EF] hover:bg-[#EAE2D8] text-[#C5A059] py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-[#C5A059]/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Tirar dúvidas com o Concierge</span>
              </a>
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="mt-16 sm:mt-20 pt-8 sm:pt-12 border-t border-[#DEE2E6]">
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-neutral-900 mb-6">
              Outros imóveis que você pode gostar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {similarProperties.map((simProp) => (
                <div
                  key={simProp.id}
                  onClick={() => onSelectProperty(simProp)}
                  className="bg-white rounded-2xl overflow-hidden border border-[#DEE2E6] hover:border-[#C5A059]/40 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={simProp.coverImage}
                      alt={simProp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-serif font-bold text-sm text-neutral-900 group-hover:text-[#C5A059] truncate">
                      {simProp.name}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">{simProp.city}, {simProp.state}</p>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100 text-xs">
                      <span className="font-bold text-neutral-900">R$ {simProp.pricePerNight} / noite</span>
                      <span className="text-[#C5A059] font-semibold flex items-center gap-1">
                        Ver detalhes <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Mobile Sticky Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-3 shadow-[0_-10px_25px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-lg font-bold text-neutral-900">R$ {property.pricePerNight}</span>
            <span className="text-[11px] text-neutral-500 font-normal">/ noite</span>
          </div>
          <span className="text-[10px] text-neutral-400">
            {checkIn && checkOut ? `${nights} noites selecionadas` : 'Datas flexíveis'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsBookingModalOpen(true)}
          className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Reservar</span>
        </button>
      </div>
    </div>
  );
};
