import React, { useState, useRef } from 'react';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Key, 
  RotateCcw, 
  Save, 
  Mail, 
  User, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Phone, 
  MapPin, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  FileCode, 
  Calendar, 
  Sparkles,
  Database,
  Lock
} from 'lucide-react';
import { exportAdminReportCSV } from '../../utils/csvExport';
import { 
  fetchProperties, 
  getUnavailabilities, 
  exportPropertiesBackup, 
  importPropertiesBackup 
} from '../../lib/dataService';
import { BRAND_CONFIG } from '../../config';
import { ConfirmationModal } from './ConfirmationModal';

interface AdminSettingsProps {
  onResetDemoData: () => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onResetDemoData, onToast }) => {
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportCSV = async () => {
    try {
      const props = await fetchProperties();
      const unavs = await getUnavailabilities();
      exportAdminReportCSV(props, unavs);
      onToast('Relatório gerencial CSV exportado com sucesso!', 'success');
    } catch (err) {
      console.error('Erro ao exportar CSV:', err);
      onToast('Erro ao gerar relatório CSV.', 'error');
    }
  };

  const handleExportJSON = () => {
    try {
      const jsonBackup = exportPropertiesBackup();
      const blob = new Blob([jsonBackup], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cerrado_stays_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onToast('Backup JSON verificado e baixado com sucesso!', 'success');
    } catch (err) {
      console.error('Erro ao exportar JSON:', err);
      onToast('Erro ao exportar backup JSON.', 'error');
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const result = importPropertiesBackup(content);
        if (result.success) {
          onToast(`Backup importado com sucesso! (${result.count || 0} imóveis carregados com integridade verificada)`, 'success');
          // Reload view data
          window.dispatchEvent(new CustomEvent('cerrado_stays_properties_updated'));
        } else {
          onToast(`Falha na integridade do backup: ${result.error}`, 'error');
        }
      } catch (err: any) {
        onToast(`Erro ao processar arquivo: ${err?.message || 'Arquivo corrompido'}`, 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmReset = () => {
    onResetDemoData();
    setIsConfirmingReset(false);
    onToast('Dados padrão de Palmas, TO restaurados com sucesso!', 'info');
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">
      {/* Settings Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DEE2E6] shadow-xs">
        <div className="inline-flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-wider mb-2">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Controle do Sistema & Dados</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          Configurações Administrativas
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-light mt-0.5">
          Gerencie backups atômicos em JSON, exporte auditorias em formato CSV e visualize informações operacionais da administradora.
        </p>
      </div>

      {/* JSON Atomic Backup & Data Persistence Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DEE2E6] shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-neutral-900 flex items-center gap-2">
              <span>Persistência & Backup Atômico JSON</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-200">
                Seguro & Verificado
              </span>
            </h3>
            <p className="text-xs text-neutral-500">
              Faça backup integral estruturado ou restaure imóveis a partir de um arquivo JSON validado com integridade estrita.
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl bg-[#FAF9F7] border border-[#DEE2E6] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#C5A059]" />
              <span>Base Local de Imóveis & Bloqueios</span>
            </h4>
            <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
              O verificador de integridade analisa cada campo, tipos de dados e sanitização antes de aplicar no armazenamento local, prevenindo corrupção de dados e garantindo confiabilidade máxima.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleExportJSON}
              className="bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-2xs min-h-[40px]"
            >
              <Download className="w-4 h-4 text-[#C5A059]" />
              <span>Exportar JSON</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#002147] hover:bg-[#C5A059] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs min-h-[40px]"
            >
              <Upload className="w-4 h-4" />
              <span>Importar JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Export Reports & CSV Downloads */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DEE2E6] shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              Exportação de Relatórios Gerenciais (Planilhas CSV)
            </h3>
            <p className="text-xs text-neutral-500">
              Gere relatórios tabulares para controle contábil, prestação de contas aos proprietários e auditoria.
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl bg-[#FAF9F7] border border-[#DEE2E6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <span>Relatório Completo de Imóveis & Bloqueios</span>
              <span className="bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-[#C5A059]/20">
                Excel / Calc
              </span>
            </h4>
            <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
              Inclui diárias médias, taxas de limpeza, capacidades, endereços e a lista completa de períodos bloqueados no calendário.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="bg-[#002147] hover:bg-[#C5A059] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs shrink-0 min-h-[40px]"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Planilha CSV</span>
          </button>
        </div>
      </div>

      {/* Enterprise Info Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DEE2E6] shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="w-11 h-11 rounded-2xl bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              Identidade do Negócio & Suporte
            </h3>
            <p className="text-xs text-neutral-500">
              Parâmetros operacionais e canais de contato ativos no portal público.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block">Marca Comercial</span>
            <span className="font-bold text-neutral-900 text-sm block">{BRAND_CONFIG.name}</span>
            <span className="text-neutral-500 text-[11px] block">{BRAND_CONFIG.tagline}</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block">Sede Operacional</span>
            <span className="font-bold text-neutral-900 text-sm block">{BRAND_CONFIG.city}, {BRAND_CONFIG.state}</span>
            <span className="text-neutral-500 text-[11px] block">{BRAND_CONFIG.address}</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block">Atendimento WhatsApp</span>
            <span className="font-bold text-neutral-900 text-sm block">{BRAND_CONFIG.whatsappDisplay}</span>
            <span className="text-neutral-500 text-[11px] block">Canal oficial de atendimento aos hóspedes</span>
          </div>
        </div>
      </div>

      {/* Danger Zone: Restore Demo Data */}
      <div className="bg-rose-50/60 rounded-3xl p-6 sm:p-8 border border-rose-200/80 shadow-xs space-y-4">
        <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-rose-950">
                Restaurar Catálogo Padrão de Demonstração
              </h3>
              <p className="text-xs text-rose-700 font-light mt-0.5">
                Restaura o catálogo de demonstração curado de Palmas, TO (Orla 14, Graciosa, Centro) e redefine bloqueios iniciais.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsConfirmingReset(true)}
            className="px-5 py-2.5 rounded-xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-600 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-2xs shrink-0 min-h-[42px] active:scale-[0.98]"
          >
            Restaurar Demonstração
          </button>
        </div>
      </div>

      {/* Global Modern Confirmation Modal for Resetting Demo Data */}
      <ConfirmationModal
        isOpen={isConfirmingReset}
        title="Restaurar Catálogo de Demonstração"
        description="Esta ação substituirá todos os imóveis atuais, fotos enviadas e bloqueios personalizados pelos dados de demonstração originais de Palmas, TO."
        itemName="Base de Dados de Imóveis & Calendário"
        itemTypeLabel="Dados afetados"
        consequences={[
          'Todos os imóveis cadastrados manualmente nesta sessão serão sobrescritos.',
          'Os bloqueios manuais de calendário serão redefinidos para os períodos padrão.',
          'Será restaurado o portfólio de 6 acomodações de alto padrão de Palmas, TO.',
        ]}
        confirmButtonText="Sim, Restaurar Catálogo"
        cancelButtonText="Cancelar"
        variant="warning"
        icon="reset"
        requireCheckboxConfirmation={true}
        checkboxLabel="Compreendo que os dados atuais não salvos em backup externo serão substituídos."
        onConfirm={handleConfirmReset}
        onCancel={() => setIsConfirmingReset(false)}
      />
    </div>
  );
};
