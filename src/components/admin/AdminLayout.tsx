import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Building2, 
  Calendar, 
  Settings as SettingsIcon, 
  LogOut, 
  ArrowUpRight, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles,
  Plus,
  Home,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { BRAND_CONFIG } from '../../config';
import { CerradoLogo } from '../CerradoLogo';

export type AdminTab = 'dashboard' | 'properties' | 'availability' | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onBackToSite: () => void;
  onQuickAddProperty?: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  onBackToSite,
  onQuickAddProperty,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const adminUser = { name: 'Administrador', email: 'admin@cerradostays.com.br' };

  const navItems: { id: AdminTab; label: string; shortLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', shortLabel: 'Início', icon: LayoutDashboard },
    { id: 'properties', label: 'Imóveis', shortLabel: 'Imóveis', icon: Building2 },
    { id: 'availability', label: 'Disponibilidade', shortLabel: 'Calendário', icon: Calendar },
    { id: 'settings', label: 'Configurações', shortLabel: 'Ajustes', icon: SettingsIcon },
  ];

  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Visão Geral do Negócio';
      case 'properties':
        return 'Gestão do Portfólio de Imóveis';
      case 'availability':
        return 'Calendário & Disponibilidade';
      case 'settings':
        return 'Configurações do Sistema';
      default:
        return 'Painel Administrativo';
    }
  };

  const getPageSubtitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Métricas, alertas de 48h e resumo operacional';
      case 'properties':
        return 'Cadastro, edição, fotos e status dos imóveis';
      case 'availability':
        return 'Bloqueios, reservas e controle de datas';
      case 'settings':
        return 'Backups atômicos, relatórios e dados do sistema';
      default:
        return 'Palmas - Tocantins';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans selection:bg-[#C5A059] selection:text-white pb-16 lg:pb-0">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#00152B] text-white fixed h-screen z-50 shadow-2xl">
        {/* Brand Logo Section */}
        <div className="p-6 border-b border-white/10 flex items-center justify-center">
          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center justify-center transition-transform hover:scale-[1.02] cursor-pointer text-left w-full group py-1"
          >
            <CerradoLogo size="lg" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            Navegação Principal
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-[0.08em] transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-[#C5A059] text-white shadow-lg shadow-[#C5A059]/25 font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-4 h-4 transition-colors shrink-0 ${isActive ? 'text-white' : 'text-[#C5A059]/70 group-hover:text-[#C5A059]'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            Atalhos Externos
          </div>
          <button
            type="button"
            onClick={onBackToSite}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <Home className="w-4 h-4 text-neutral-400" />
              <span>Ver Site Público</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-white/30" />
          </button>
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="p-5 border-t border-white/10 bg-black/15">
          <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-white/5 border border-white/10">
            <div className="w-9 h-9 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-xs font-serif font-bold text-[#C5A059]">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="overflow-hidden min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                {adminUser.name}
              </span>
              <span className="text-[10px] text-white/50 block truncate">
                {adminUser.email}
              </span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-300 hover:text-white hover:bg-rose-600 transition-all border border-rose-400/20 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 min-h-screen">
        {/* Top Header */}
        <header className="bg-white/95 backdrop-blur-md border-b border-[#DEE2E6] sticky top-0 z-40 h-20 flex items-center px-4 sm:px-8 shadow-2xs">
          <div className="flex-1 flex items-center justify-between gap-4">
            {/* Page Title / Info */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl text-neutral-700 hover:bg-neutral-100 cursor-pointer shrink-0 border border-neutral-200"
                aria-label="Abrir menu lateral"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] text-[#C5A059] font-bold uppercase tracking-widest truncate">
                  <span>Cerrado Stay</span>
                  <ChevronRight className="w-3 h-3 text-neutral-300" />
                  <span className="text-neutral-400 capitalize">{currentTab}</span>
                </div>
                <h1 className="text-base sm:text-lg font-serif font-bold text-[#00152B] truncate tracking-tight">
                  {getPageTitle()}
                </h1>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={onBackToSite}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#00152B] hover:bg-neutral-50 border border-neutral-200 transition-all cursor-pointer min-h-[38px]"
                title="Abrir site público em nova aba"
              >
                <Home className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Site Público</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {onQuickAddProperty && (
                <button
                  type="button"
                  onClick={onQuickAddProperty}
                  className="bg-[#002147] hover:bg-[#C5A059] text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs hover:shadow-md flex items-center gap-2 cursor-pointer min-h-[38px] active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Adicionar Imóvel</span>
                  <span className="sm:hidden">Novo</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              />

              {/* Slide Drawer */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                className="relative w-4/5 max-w-xs bg-[#00152B] text-white h-full flex flex-col shadow-2xl z-10"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CerradoLogo size="md" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                          isActive
                            ? 'bg-[#C5A059] text-white shadow-md'
                            : 'text-white/70 hover:bg-white/5'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#C5A059]'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}

                  <div className="pt-4 border-t border-white/10 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onBackToSite();
                      }}
                      className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-white/70 hover:bg-white/5"
                    >
                      <Home className="w-4 h-4 text-neutral-400" />
                      <span>Voltar ao Site Público</span>
                    </button>
                  </div>
                </nav>

                <div className="p-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-300 bg-rose-500/10 border border-rose-400/20"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Encerrar Sessão</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Scrollable Content View */}
        <main className="p-3.5 sm:p-6 lg:p-8 flex-1">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>

        {/* Simple Footer */}
        <footer className="px-6 sm:px-8 py-5 border-t border-[#DEE2E6] bg-white flex flex-col sm:flex-row justify-between items-center gap-3 text-center">
          <p className="text-[11px] text-neutral-400 font-medium">
            &copy; 2026 <strong className="text-neutral-600">Cerrado Stay Palmas</strong> &bull; Gestão Imobiliária Profissional
          </p>
          <div className="flex items-center gap-4 text-[10px] font-bold text-[#C5A059] uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Sessão Segura</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Sincronização em Tempo Real</span>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation Bar (Ultra-convenient for mobile phone administration) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all min-w-[64px] ${
                isActive ? 'text-[#002147] font-bold' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-[#FAF7F2] text-[#C5A059]' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-[#002147]' : 'font-medium'}`}>
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
