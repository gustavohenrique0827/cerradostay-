import React from 'react';
import { BRAND_CONFIG, getWhatsAppUrl } from '../config';
import { 
  Instagram, MessageCircle, Mail, MapPin, 
  ShieldCheck, Heart, ArrowUp, Phone 
} from 'lucide-react';
import { CerradoLogo } from './CerradoLogo';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#00152B] text-white pt-16 pb-12 border-t border-white/10 relative" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          {/* Column 1: Brand Identity */}
          <div className="space-y-6">
            <div className="flex items-start">
              <CerradoLogo variant="light" size="lg" className="items-start" />
            </div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Curadoria de imóveis premium para estadias de curta temporada com padrão de hotelaria em Palmas-TO. Hospitalidade tocantinense com foco no seu conforto.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={BRAND_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#C5A059] text-white flex items-center justify-center transition-all border border-white/10 hover:border-transparent group"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 transition-transform group-hover:scale-110" />
              </a>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#25D366] text-white flex items-center justify-center transition-all border border-white/10 hover:border-transparent group"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
              </a>
              <a
                href={`mailto:${BRAND_CONFIG.email}`}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#C5A059] text-white flex items-center justify-center transition-all border border-white/10 hover:border-transparent group"
                aria-label="E-mail"
              >
                <Mail className="w-4 h-4 transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-6">
              Navegação
            </h3>
            <ul className="space-y-3 text-xs text-neutral-400 font-medium">
              <li><a href="#sobre" className="hover:text-white transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-[#C5A059] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Sobre Nós</a></li>
              <li><a href="#imoveis" className="hover:text-white transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-[#C5A059] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Nossos Imóveis</a></li>
              <li><a href="#como-funciona" className="hover:text-white transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-[#C5A059] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Como Funciona</a></li>
              <li><a href="#checkout-digital" className="hover:text-white transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-[#C5A059] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Check-out Digital</a></li>
              <li>
                {onOpenAdmin ? (
                  <button onClick={onOpenAdmin} className="hover:text-[#C5A059] transition-colors cursor-pointer flex items-center gap-2 group text-left">
                    <div className="w-1 h-1 bg-[#C5A059] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Painel ADM
                  </button>
                ) : (
                  <a href="#admin" className="hover:text-[#C5A059] transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-[#C5A059] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Painel ADM</a>
                )}
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-6">
              Atendimento
            </h3>
            <ul className="space-y-4 text-xs text-neutral-400">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-white font-bold">{BRAND_CONFIG.phoneDisplay}</span>
                  <span className="text-[10px] text-neutral-500 mt-1">Concierge 24h</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <a href={`mailto:${BRAND_CONFIG.email}`} className="text-white hover:text-[#C5A059] transition-colors font-bold break-all">{BRAND_CONFIG.email}</a>
                  <span className="text-[10px] text-neutral-500 mt-1">E-mail oficial</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Location */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-6">
              Onde Estamos
            </h3>
            <div className="flex items-start gap-3 text-xs text-neutral-400">
              <MapPin className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />
              <p className="leading-relaxed">
                <span className="text-white font-bold block mb-1">Palmas, Tocantins</span>
                {BRAND_CONFIG.address}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Disponível agora em Palmas
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright Bar */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-[11px] text-neutral-500">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-4 h-4 text-emerald-500/30" />
            <p>© 2026 {BRAND_CONFIG.name}. Todos os direitos reservados.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-neutral-600">
              <a href="#faq" className="hover:text-white transition-colors">Termos</a>
              <a href="#faq" className="hover:text-white transition-colors">Privacidade</a>
            </div>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
              aria-label="Voltar ao topo"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
