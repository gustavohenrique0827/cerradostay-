import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, CheckCircle2, ShieldCheck, Sparkles, 
  Smartphone, Award, ArrowRight, HeartHandshake, MapPin 
} from 'lucide-react';
import { getWhatsAppUrl } from '../config';
import { Property } from '../types';
import { CerradoLogo } from './CerradoLogo';

interface AboutSectionProps {
  properties?: Property[];
  onSelectProperty?: (property: Property) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ 
  properties = [], 
  onSelectProperty 
}) => {
  const featuredProperty = properties.find(p => p.status !== 'inactive') || properties[0];
  const differentiators = [
    { title: 'Padrão de Hotelaria', desc: 'Enxoval 400 fios, amenidades de banho e limpeza profissional rigorosa em todas as unidades.' },
    { title: 'Check-in Sem Fricção', desc: 'Acesso autônomo via fechadura digital e manual da casa interativo disponível no seu celular.' },
    { title: 'Localização Premium', desc: 'Imóveis estrategicamente posicionados na Orla, Plano Diretor e regiões nobres de Palmas.' },
    { title: 'Concierge Local 24/7', desc: 'Suporte humano contínuo para dicas gastronômicas, passeios e qualquer necessidade durante sua estadia.' },
  ];

  return (
    <section id="sobre" className="py-24 bg-white border-t border-[#DEE2E6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Real Property or Institutional Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative"
          >
            {featuredProperty ? (
              <div 
                onClick={() => onSelectProperty?.(featuredProperty)}
                className={`relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] sm:aspect-[4/4] group ${
                  onSelectProperty ? 'cursor-pointer' : ''
                }`}
              >
                <img
                  src={featuredProperty.coverImage || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85"}
                  alt={featuredProperty.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00152B]/90 via-[#00152B]/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-[#C5A059] text-white text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3" />
                      {featuredProperty.badge || 'Imóvel Cadastrado'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                      R$ {featuredProperty.pricePerNight?.toLocaleString('pt-BR')} / noite
                    </span>
                  </div>
                  <h4 className="font-serif text-xl font-bold text-white group-hover:text-[#E2C792] transition-colors leading-snug">
                    {featuredProperty.name}
                  </h4>
                  <p className="text-xs text-neutral-200 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                    <span>{featuredProperty.location || `${featuredProperty.city} - ${featuredProperty.state}`}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] sm:aspect-[4/4] bg-gradient-to-br from-[#00152B] via-[#002147] to-[#000B18] p-8 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <CerradoLogo size="md" />
                  <span className="px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-bold uppercase tracking-widest">
                    Palmas - TO
                  </span>
                </div>
                <div className="space-y-3">
                  <h4 className="font-serif text-2xl font-bold text-white">
                    Gestão Exclusiva de Temporada
                  </h4>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed">
                    Acomodações selecionadas com alto rigor de qualidade, conforto e atendimento em Palmas.
                  </p>
                </div>
              </div>
            )}

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-6 -right-6 sm:bottom-8 sm:-right-8 z-20 bg-[#002147] text-white p-6 rounded-3xl shadow-2xl max-w-xs border border-white/10 hidden sm:block">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059] text-white flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-serif font-bold text-lg text-white">Administradora</span>
                  <p className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold">Padrão 5 Estrelas</p>
                </div>
              </div>
              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                Hospitalidade que une o conforto de casa com o padrão de atendimento dos melhores hotéis boutique.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Institutional Narrative */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sobre a Cerrado Stay</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#002147] leading-tight">
              Hospitalidade boutique <br />
              <span className="italic font-normal text-[#C5A059]">no coração do Tocantins.</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
              Nascemos em Palmas com o propósito de elevar o padrão do aluguel por temporada, oferecendo imóveis com design autêntico e serviços que facilitam a vida do viajante.
            </p>

            <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
              Nossa missão é garantir que cada estadia seja única, conectando você às melhores experiências da capital, com o suporte de uma equipe local apaixonada pelo que faz.
            </p>

            {/* Differentiators Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
              {differentiators.map((diff, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xs font-bold text-neutral-900">{diff.title}</h3>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">{diff.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA row */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={getWhatsAppUrl('Olá! Gostaria de tirar algumas dúvidas sobre as acomodações da Cerrado Stay.')}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#002147] hover:bg-neutral-800 text-white px-7 py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
              >
                <span>Falar com Concierge</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </a>

              <a
                href="#imoveis"
                className="text-xs font-bold text-neutral-800 hover:text-[#C5A059] underline underline-offset-4 transition-colors"
              >
                Ver Imóveis Disponíveis
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
