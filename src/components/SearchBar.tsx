import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Calendar as CalendarIcon, Users, Plus, Minus, X, ArrowRight, Sparkles } from 'lucide-react';
import { SearchFilterState } from '../types';

interface SearchBarProps {
  onSearch: (filter: SearchFilterState) => void;
  initialFilters?: Partial<SearchFilterState>;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialFilters }) => {
  const [destination, setDestination] = useState(initialFilters?.destination || '');
  const [checkIn, setCheckIn] = useState<string | null>(initialFilters?.checkIn || null);
  const [checkOut, setCheckOut] = useState<string | null>(initialFilters?.checkOut || null);
  const [adults, setAdults] = useState<number>(initialFilters?.guests?.adults || 2);
  const [childrenCount, setChildrenCount] = useState<number>(initialFilters?.guests?.children || 0);

  const [activePopover, setActivePopover] = useState<'destination' | 'dates' | 'guests' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalGuests = adults + childrenCount;

  const popularDestinations = [
    { name: 'Orla 14 & Graciosa', desc: 'Palmas, TO • Orla nobre, Lago & Pôr do Sol', query: 'Graciosa' },
    { name: 'Alphaville Palmas', desc: 'Palmas, TO • Condomínio de luxo beira-lago', query: 'Alphaville' },
    { name: '104 Sul & Plano Diretor', desc: 'Palmas, TO • Centro executivo e bistrôs', query: '104 Sul' },
    { name: 'Praia da Graciosa', desc: 'Palmas, TO • Píer, naus e beach clubs', query: 'Praia da Graciosa' },
    { name: 'Taquaruçu & Serra do Carmo', desc: 'Palmas, TO • Chalets, mirantes & clima fresco', query: 'Taquaruçu' },
    { name: '204 Sul & Gastronomia', desc: 'Palmas, TO • Lofts urbanos & vida cosmopolita', query: '204 Sul' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActivePopover(null);
    onSearch({
      destination,
      checkIn,
      checkOut,
      guests: { adults, children: childrenCount },
      category: 'todos',
    });

    const element = document.getElementById('imoveis');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatDateDisplay = (dateStr: string | null) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${day} ${months[parseInt(month, 10) - 1]}`;
  };

  return (
    <div ref={containerRef} className="w-full relative z-40" id="hero-search-component">
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white rounded-2xl md:rounded-full p-1.5 md:p-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-neutral-100 flex flex-col md:flex-row items-stretch md:items-center transition-all"
      >
        {/* DESTINO */}
        <div
          onClick={() => setActivePopover(activePopover === 'destination' ? null : 'destination')}
          className={`relative flex-[1.5] px-6 py-3 cursor-pointer rounded-xl md:rounded-full transition-all ${
            activePopover === 'destination' ? 'bg-neutral-50 shadow-inner' : 'hover:bg-neutral-50/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-[#C5A059] shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-400">Onde?</span>
              <input
                type="text"
                placeholder="Bairro ou condomínio..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePopover('destination');
                }}
                className="text-[13px] font-bold text-[#00152B] placeholder:text-neutral-300 bg-transparent outline-none w-full truncate cursor-pointer"
              />
            </div>
          </div>

          {/* Destino Popover */}
          <AnimatePresence>
            {activePopover === 'destination' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute top-full left-0 mt-4 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.25)] border border-neutral-100 p-4 z-50 text-left"
                onClick={(e) => e.stopPropagation()}
              >
                {/* ... existing popover content ... */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">
                    <Sparkles className="w-3 h-3" />
                    <span>Destinos Populares em Palmas</span>
                  </div>
                </div>

                <div className="space-y-1">
                  {popularDestinations.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        setDestination(item.query);
                        setActivePopover('dates');
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left group"
                    >
                      <MapPin className="w-4 h-4 text-neutral-300 group-hover:text-[#C5A059]" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-800 group-hover:text-[#C5A059] truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-neutral-500 truncate">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-neutral-100 mx-1" />

        {/* CHECK-IN */}
        <div
          onClick={() => setActivePopover(activePopover === 'dates' ? null : 'dates')}
          className={`relative flex-1 px-6 py-3 cursor-pointer rounded-xl md:rounded-full transition-all ${
            activePopover === 'dates' ? 'bg-neutral-50 shadow-inner' : 'hover:bg-neutral-50/80'
          }`}
        >
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-400">Check-in</span>
            <span className="text-[13px] font-bold text-[#00152B] truncate">
              {formatDateDisplay(checkIn) || <span className="text-neutral-300 font-normal italic">Quando?</span>}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-neutral-100 mx-1" />

        {/* CHECK-OUT */}
        <div
          onClick={() => setActivePopover(activePopover === 'dates' ? null : 'dates')}
          className={`relative flex-1 px-6 py-3 cursor-pointer rounded-xl md:rounded-full transition-all ${
            activePopover === 'dates' ? 'bg-neutral-50 shadow-inner' : 'hover:bg-neutral-50/80'
          }`}
        >
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-400">Check-out</span>
            <span className="text-[13px] font-bold text-[#00152B] truncate">
              {formatDateDisplay(checkOut) || <span className="text-neutral-300 font-normal italic">Até quando?</span>}
            </span>
          </div>

          {/* Dates Popover */}
          <AnimatePresence>
            {activePopover === 'dates' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute top-full right-0 md:-left-20 mt-4 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.25)] border border-neutral-100 p-5 z-50 text-left"
                onClick={(e) => e.stopPropagation()}
              >
                {/* ... existing dates popover content ... */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Selecione o Período</p>
                  {(checkIn || checkOut) && (
                    <button
                      type="button"
                      onClick={() => {
                        setCheckIn(null);
                        setCheckOut(null);
                      }}
                      className="text-[10px] text-[#C5A059] font-bold uppercase hover:underline"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[9px] font-bold text-neutral-400 uppercase block mb-1.5 ml-1">Check-in</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={checkIn || ''}
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        if (checkOut && e.target.value >= checkOut) {
                          setCheckOut(null);
                        }
                      }}
                      className="w-full text-xs font-bold px-3 py-2.5 border border-neutral-100 bg-neutral-50 rounded-xl focus:bg-white focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-neutral-400 uppercase block mb-1.5 ml-1">Check-out</label>
                    <input
                      type="date"
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      value={checkOut || ''}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2.5 border border-neutral-100 bg-neutral-50 rounded-xl focus:bg-white focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      const inDate = new Date(today);
                      inDate.setDate(today.getDate() + 2);
                      const outDate = new Date(inDate);
                      outDate.setDate(inDate.getDate() + 3);
                      setCheckIn(inDate.toISOString().split('T')[0]);
                      setCheckOut(outDate.toISOString().split('T')[0]);
                      setActivePopover('guests');
                    }}
                    className="text-[10px] bg-neutral-50 hover:bg-[#FBF7EF] hover:text-[#C5A059] px-3 py-2 rounded-lg font-bold uppercase transition-colors"
                  >
                    Fim de Semana
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      const inDate = new Date(today);
                      inDate.setDate(today.getDate() + 5);
                      const outDate = new Date(inDate);
                      outDate.setDate(inDate.getDate() + 7);
                      setCheckIn(inDate.toISOString().split('T')[0]);
                      setCheckOut(outDate.toISOString().split('T')[0]);
                      setActivePopover('guests');
                    }}
                    className="text-[10px] bg-neutral-50 hover:bg-[#FBF7EF] hover:text-[#C5A059] px-3 py-2 rounded-lg font-bold uppercase transition-colors"
                  >
                    Próxima Semana
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-neutral-100 mx-1" />

        {/* HÓSPEDES */}
        <div
          onClick={() => setActivePopover(activePopover === 'guests' ? null : 'guests')}
          className={`relative flex-1 px-6 py-3 cursor-pointer rounded-xl md:rounded-full transition-all ${
            activePopover === 'guests' ? 'bg-neutral-50 shadow-inner' : 'hover:bg-neutral-50/80'
          }`}
        >
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-400">Hóspedes</span>
            <span className="text-[13px] font-bold text-[#00152B] truncate">
              {totalGuests} {totalGuests === 1 ? 'Hóspede' : 'Hóspedes'}
            </span>
          </div>

          {/* Guests Popover */}
          <AnimatePresence>
            {activePopover === 'guests' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute top-full right-0 mt-4 w-72 bg-white rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.25)] border border-neutral-100 p-5 z-50 text-left"
                onClick={(e) => e.stopPropagation()}
              >
                {/* ... existing guests content ... */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-neutral-800">Adultos</p>
                      <p className="text-[10px] text-neutral-400 font-medium">Acima de 12 anos</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-400 hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(Math.min(16, adults + 1))}
                        className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-400 hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-50">
                    <div>
                      <p className="text-xs font-bold text-neutral-800">Crianças</p>
                      <p className="text-[10px] text-neutral-400 font-medium">Até 12 anos</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                        className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-400 hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{childrenCount}</span>
                      <button
                        type="button"
                        onClick={() => setChildrenCount(Math.min(10, childrenCount + 1))}
                        className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-400 hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActivePopover(null)}
                    className="w-full bg-[#00152B] text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl mt-2"
                  >
                    Confirmar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="p-1 md:pr-2">
          <button
            type="submit"
            id="hero-search-submit-btn"
            className="w-full md:w-auto bg-[#C5A059] hover:bg-[#A68648] text-white px-8 py-4 md:py-4 rounded-xl md:rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-[#C5A059]/30 active:scale-95 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Buscar</span>
          </button>
        </div>
      </form>
    </div>
  );
};
