import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Property } from '../types';
import { Star, MapPin, Users, Bed, Bath, Heart, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { getOptimizedImageUrl } from '../lib/imageUtils';

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
  onSelectProperty?: (property: Property) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (propertyId: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onSelectProperty,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = property.images && property.images.length > 0 ? property.images : [property.coverImage];

  const handleCardClick = () => {
    if (typeof onSelect === 'function') {
      onSelect(property);
    } else if (typeof onSelectProperty === 'function') {
      onSelectProperty(property);
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(property.id);
    }
  };

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swipe left -> next image
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      } else {
        // Swipe right -> prev image
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    }
    setTouchStartX(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      onClick={handleCardClick}
      id={`property-card-${property.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-[#DEE2E6] hover:border-[#C5A059]/40 transition-all duration-300 hover:shadow-xl flex flex-col cursor-pointer touch-manipulation"
    >
      {/* Image Gallery Container */}
      <div 
        className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={getOptimizedImageUrl(images[currentImageIndex], 400)}
          alt={property.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out select-none"
        />

        {/* Gradient vignette on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {property.badge && (
            <span className="bg-[#002147]/85 backdrop-blur-md text-[#ECE7E0] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
              {property.badge}
            </span>
          )}
          {property.isSuperhost && !property.badge && (
            <span className="bg-[#C5A059]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
              Administradora
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm flex items-center justify-center text-neutral-700 hover:text-rose-500 transition-all active:scale-90 shadow-xs"
          title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          aria-label="Favoritar imóvel"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-neutral-700'}`} />
        </button>

        {/* Carousel Image Controls (if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 shadow-md z-10"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 shadow-md z-10"
              aria-label="Próxima foto"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* City tag on bottom left of image */}
        <div className="absolute bottom-2.5 left-3 text-white text-xs font-semibold flex items-center gap-1 drop-shadow-md z-10">
          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{property.city}, {property.state}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Title & Rating */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-serif font-bold text-base text-[#002147] group-hover:text-[#C5A059] transition-colors leading-snug line-clamp-1">
              {property.name}
            </h3>
            <div className="flex items-center gap-1 text-xs font-bold text-neutral-800 shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{property.rating.toFixed(2)}</span>
              <span className="text-neutral-400 font-normal">({property.reviewsCount})</span>
            </div>
          </div>

          {/* Neighborhood & Tagline */}
          <p className="text-xs text-neutral-500 font-medium mb-3 line-clamp-1">
            {property.location} · {property.tagline}
          </p>

          {/* Specs Row */}
          <div className="flex items-center gap-3 text-xs text-neutral-600 pb-3 mb-3 border-b border-neutral-100 flex-wrap">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-neutral-400" />
              Até {property.maxGuests} hóspedes
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-neutral-400" />
              {property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-neutral-400" />
              {property.bathrooms} {property.bathrooms === 1 ? 'banheiro' : 'banheiros'}
            </span>
          </div>
        </div>

        {/* Footer Row: Price & CTA */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold">A partir de</span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif font-bold text-lg text-neutral-900">
                R$ {property.pricePerNight}
              </span>
              <span className="text-xs text-neutral-500 font-normal">/ noite</span>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A059] group-hover:text-white bg-[#FBF7EF] group-hover:bg-[#C5A059] px-3.5 py-2 rounded-xl transition-all duration-200"
          >
            <span>Ver imóvel</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
