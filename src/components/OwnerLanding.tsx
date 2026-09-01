import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Camera, 
  Key, 
  Banknote,
  Users
} from 'lucide-react';
import { BRAND_CONFIG } from '../config';

export const OwnerLanding: React.FC = () => {
  // Simulator State
  const [location, setLocation] = useState('Orla 14');
  const [bedrooms, setBedrooms] = useState(2);
  
  const estimates: Record<string, number> = {
    'Orla 14': 450,
    'Graciosa': 400,
    'Centro': 350,
    'Plano Diretor': 320,
    'Alphaville': 550,
  };

  const basePrice = estimates[location] || 300;
  const occupancy = 0.75; // 75% occupancy
  const monthlyRevenue = basePrice * 30 * occupancy * (1 + (bedrooms - 1) * 0.4);

  return (
    <section id="proprietarios" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBF7EF] text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-4"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Para Proprietários</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-bold text-neutral-900 mb-6"
          >
            Sua propriedade, <span className="text-[#C5A059] italic font-normal">nossa gestão.</span> <br />
            Rentabilidade máxima, esforço zero.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-neutral-600 font-light"
          >
            Transformamos seu imóvel em um negócio lucrativo em Palmas com gestão 100% turnkey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Simulator Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#002147] rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Calculator className="w-32 h-32" />
            </div>
            
            <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
              <Calculator className="w-6 h-6 text-[#D4AF37]" />
              Simulador de Rentabilidade
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3 uppercase tracking-wider">
                  Localização do Imóvel
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.keys(estimates).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setLocation(loc)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        location === loc 
                        ? 'bg-[#C5A059] border-[#C5A059] text-white' 
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3 uppercase tracking-wider">
                  Número de Quartos
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setBedrooms(n)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all border ${
                        bedrooms === n 
                        ? 'bg-[#C5A059] border-[#C5A059] text-white' 
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-white/10">
                <p className="text-sm text-neutral-400 mb-2">Estimativa de Faturamento Mensal</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-serif font-bold text-[#D4AF37]">
                    R$ {monthlyRevenue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-neutral-400 text-sm">/mês*</span>
                </div>
                <p className="text-[10px] text-neutral-500 mt-4 leading-tight italic">
                  *Estimativa baseada em média de mercado para {location}. Valores podem variar conforme mobília, decoração e sazonalidade.
                </p>
                
                <button className="w-full mt-8 bg-white text-[#002147] hover:bg-[#D4AF37] hover:text-white py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2">
                  Quero uma avaliação gratuita
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Comparison Side */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-8">
                Por que escolher a gestão Cerrado Stay?
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-neutral-100">
                  <h4 className="font-bold text-neutral-400 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    Aluguel Tradicional
                  </h4>
                  <ul className="space-y-3 text-sm text-neutral-500">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      Baixo rendimento mensal
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      Risco de inadimplência
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      Desgaste e falta de manutenção
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      Contratos longos e burocráticos
                    </li>
                  </ul>
                </div>

                <div className="bg-[#002147]/5 rounded-2xl p-6 border border-[#C5A059]/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp className="w-12 h-12" />
                  </div>
                  <h4 className="font-bold text-[#C5A059] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                    Gestão Cerrado Stay
                  </h4>
                  <ul className="space-y-3 text-sm text-neutral-900 font-medium">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                      Até 50% mais rentabilidade
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                      Pagamento antecipado (sem risco)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                      Imóvel sempre limpo e revisado
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                      Uso próprio quando desejar
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* 3 Steps */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pt-8 border-t border-neutral-100"
            >
              <h4 className="font-bold text-neutral-900 mb-8 uppercase tracking-widest text-xs">Transparência em 3 Passos</h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#002147] text-[#D4AF37] flex items-center justify-center font-bold shrink-0">1</div>
                  <div>
                    <h5 className="font-bold text-neutral-900">Avaliação & Setup</h5>
                    <p className="text-sm text-neutral-500">Visitamos o imóvel, sugerimos melhorias e fazemos fotos profissionais.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#002147] text-[#D4AF37] flex items-center justify-center font-bold shrink-0">2</div>
                  <div>
                    <h5 className="font-bold text-neutral-900">Publicação & Operação</h5>
                    <p className="text-sm text-neutral-500">Anunciamos em +5 canais com precificação dinâmica e cuidamos de toda hospitalidade.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#002147] text-[#D4AF37] flex items-center justify-center font-bold shrink-0">3</div>
                  <div>
                    <h5 className="font-bold text-neutral-900">Lucro no Bolso</h5>
                    <p className="text-sm text-neutral-500">Você acompanha tudo pelo portal e recebe seus repasses mensalmente.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
