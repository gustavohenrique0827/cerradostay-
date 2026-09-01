import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Calendar, Heart, ShieldCheck } from 'lucide-react';
import { CerradoLogo } from './CerradoLogo';
import { BRAND_CONFIG } from '../config';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onOpenSearch?: () => void;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
  onNavigateHome?: () => void;
  isPropertyDetailOpen?: boolean;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  favoritesCount = 0,
  onOpenFavorites,
  onNavigateHome,
  isPropertyDetailOpen = false,
  onOpenAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (isPropertyDetailOpen && onNavigateHome) {
      onNavigateHome();
    }
    
    if (href.startsWith('#')) {
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-xs py-3.5 border-b border-[#DEE2E6]'
          : 'bg-gradient-to-b from-black/60 via-black/30 to-transparent py-5 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => scrollToSection(e, '#hero')}
          className="flex items-center group cursor-pointer"
          id="brand-logo"
        >
          <CerradoLogo 
            variant={isScrolled ? 'dark' : 'light'} 
            size="md"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {BRAND_CONFIG.navLinks.slice(0, 4).map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className={`text-[12px] font-bold uppercase tracking-[0.12em] transition-all hover:text-[#C5A059] ${
                isScrolled ? 'text-neutral-700' : 'text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle />
        </nav>

        {/* Right CTA / Action Area */}
        <div className="hidden md:flex items-center gap-3">
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all cursor-pointer border ${
                isScrolled
                  ? 'border-neutral-200 text-neutral-400 hover:text-[#00152B] hover:border-[#00152B]'
                  : 'border-white/20 text-white/60 hover:text-white hover:border-white/40'
              }`}
              title="Acessar Painel Administrativo"
            >
              Admin
            </button>
          )}

          {onOpenFavorites && (
            <button
              onClick={onOpenFavorites}
              id="header-favorites-button"
              className={`relative p-2 rounded-full transition-colors ${
                isScrolled
                  ? 'text-neutral-600 hover:bg-neutral-100'
                  : 'text-white hover:bg-white/10'
              }`}
              title="Ver favoritos salvos"
            >
              <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
                  {favoritesCount}
                </span>
              )}
            </button>
          )}

          <a
            href="#imoveis"
            onClick={(e) => {
              scrollToSection(e, '#imoveis');
              if (onOpenSearch) onOpenSearch();
            }}
            id="header-cta-button"
            className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#D4AF37] text-white px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-[0.1em] uppercase transition-all shadow-lg active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Reservar</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {onOpenFavorites && favoritesCount > 0 && (
            <button
              onClick={onOpenFavorites}
              className={`p-2 rounded-full ${isScrolled ? 'text-neutral-700' : 'text-white'}`}
              aria-label="Favoritos"
            >
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </button>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            id="mobile-menu-toggle"
            className={`p-2 rounded-lg transition-colors ${
              isScrolled
                ? 'text-neutral-900 hover:bg-neutral-100'
                : 'text-white hover:bg-white/10'
            }`}
            aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-b border-[#DEE2E6] text-[#002147] shadow-xl overflow-hidden"
          >
            <div className="px-5 pt-4 pb-6 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 text-xs text-neutral-500">
                <span className="font-semibold text-[#C5A059] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" /> Acomodações Premium em Palmas
                </span>
                <span>{BRAND_CONFIG.city} - {BRAND_CONFIG.state}</span>
              </div>

              <div className="flex flex-col space-y-2 pt-1">
                <a
                  href="#hero"
                  onClick={(e) => scrollToSection(e, '#hero')}
                  className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-neutral-50 text-neutral-800"
                >
                  Início
                </a>
                <a
                  href="#imoveis"
                  onClick={(e) => scrollToSection(e, '#imoveis')}
                  className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-neutral-50 text-neutral-800"
                >
                  Nossos Imóveis
                </a>
                <a
                  href="#como-funciona"
                  onClick={(e) => scrollToSection(e, '#como-funciona')}
                  className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-neutral-50 text-neutral-800"
                >
                  Como Funciona
                </a>
                <a
                  href="#sobre"
                  onClick={(e) => scrollToSection(e, '#sobre')}
                  className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-neutral-50 text-neutral-800"
                >
                  Sobre a Cerrado Stay
                </a>
                <a
                  href="#avaliacoes"
                  onClick={(e) => scrollToSection(e, '#avaliacoes')}
                  className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-neutral-50 text-neutral-800"
                >
                  Avaliações dos Hóspedes
                </a>
                <a
                  href="#faq"
                  onClick={(e) => scrollToSection(e, '#faq')}
                  className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-neutral-50 text-neutral-800"
                >
                  Perguntas Frequentes (FAQ)
                </a>
                <a
                  href="#checkout-digital"
                  onClick={(e) => scrollToSection(e, '#checkout-digital')}
                  className="px-3 py-2 text-sm font-medium rounded-lg bg-[#F8F9FA] text-[#C5A059] font-semibold"
                >
                  Área do Hóspede & Check-out Digital
                </a>
                {onOpenAdmin && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-between"
                  >
                    <span>Painel Administrativo (/admin)</span>
                    <span className="text-[10px] uppercase font-bold text-[#C5A059] bg-white px-2 py-0.5 rounded">Acesso</span>
                  </button>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
                <a
                  href="#imoveis"
                  onClick={(e) => {
                    scrollToSection(e, '#imoveis');
                    if (onOpenSearch) onOpenSearch();
                  }}
                  className="w-full text-center bg-[#C5A059] hover:bg-[#A68648] text-white py-3 rounded-xl text-sm font-semibold tracking-wide uppercase shadow-sm"
                >
                  Consultar Disponibilidade
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
