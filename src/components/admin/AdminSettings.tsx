import React, { useState, useRef, useEffect } from 'react';
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
  Lock,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Globe
} from 'lucide-react';
import { exportAdminReportCSV } from '../../utils/csvExport';
import { 
  fetchProperties, 
  getUnavailabilities, 
  exportPropertiesBackup, 
  importPropertiesBackup,
  getCachedSupabaseStatus,
  pullPropertiesFromGoogleSheets,
  SupabaseStatus
} from '../../lib/dataService';
import { 
  getGoogleSheetsConfig, 
  saveGoogleSheetsConfig, 
  exportToGoogleSheetsCSV, 
  syncWithGoogleSheetsWebhook,
  GOOGLE_APPS_SCRIPT_TEMPLATE
} from '../../lib/googleSheetsService';
import { 
  downloadFullSystemBackup, 
  restoreFullSystemBackup 
} from '../../lib/backupService';
import { BRAND_CONFIG } from '../../config';
import { ConfirmationModal } from './ConfirmationModal';

interface AdminSettingsProps {
  onResetDemoData: () => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onResetDemoData, onToast }) => {
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fullBackupInputRef = useRef<HTMLInputElement>(null);

  // Google Sheets integration state
  const [sheetsConfig, setSheetsConfig] = useState(() => getGoogleSheetsConfig());
  const [webhookInput, setWebhookInput] = useState(sheetsConfig.webhookUrl);
  const [csvUrlInput, setCsvUrlInput] = useState(sheetsConfig.publishedCsvUrl);
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [hasCopiedScript, setHasCopiedScript] = useState(false);

  // Supabase status check
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus>(getCachedSupabaseStatus());

  useEffect(() => {
    setSupabaseStatus(getCachedSupabaseStatus());
  }, []);

  const handleExportGoogleSheetsCSV = async () => {
    try {
      const props = await fetchProperties();
      const unavs = await getUnavailabilities();
      exportToGoogleSheetsCSV(props, unavs);
      onToast('Planilha Google (CSV) gerada e baixada com sucesso!', 'success');
    } catch (err) {
      console.error('Erro ao exportar Planilha Google:', err);
      onToast('Erro ao gerar planilha Google.', 'error');
    }
  };

  const handleSaveSheetsConfig = async () => {
    const updated = saveGoogleSheetsConfig({
      webhookUrl: webhookInput.trim(),
      publishedCsvUrl: csvUrlInput.trim(),
    });
    setSheetsConfig(updated);
    onToast('Configurações da Planilha Google salvas com sucesso!', 'success');
  };

  const handleManualSyncSheets = async () => {
    if (!webhookInput.trim()) {
      onToast('Cole primeiro a URL do Webhook do Google Apps Script abaixo.', 'info');
      return;
    }
    setIsSyncingSheets(true);
    try {
      saveGoogleSheetsConfig({ webhookUrl: webhookInput.trim() });
      const props = await fetchProperties();
      const unavs = await getUnavailabilities();
      const res = await syncWithGoogleSheetsWebhook(props, unavs);
      if (res.success) {
        onToast('Sincronização com o Google Planilhas realizada com sucesso!', 'success');
        setSheetsConfig(getGoogleSheetsConfig());
      } else {
        onToast(res.message, 'error');
      }
    } catch (err: any) {
      onToast(`Erro ao sincronizar: ${err?.message || 'Falha de rede'}`, 'error');
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const [isPullingSheets, setIsPullingSheets] = useState(false);

  const handlePullFromSheets = async () => {
    setIsPullingSheets(true);
    try {
      saveGoogleSheetsConfig({
        webhookUrl: webhookInput.trim(),
        publishedCsvUrl: csvUrlInput.trim(),
      });
      const res = await pullPropertiesFromGoogleSheets();
      if (res.success) {
        onToast(`Imóveis puxados com sucesso da Planilha Google! (${res.count} imóveis no ar)`, 'success');
        window.dispatchEvent(new CustomEvent('cerrado_stays_properties_updated'));
      } else {
        onToast(`Não foi possível puxar da planilha: ${res.error}`, 'error');
      }
    } catch (err: any) {
      onToast(`Erro ao carregar dados da planilha: ${err?.message || 'Falha de rede'}`, 'error');
    } finally {
      setIsPullingSheets(false);
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
    setHasCopiedScript(true);
    onToast('Código do Apps Script copiado para a área de transferência!', 'success');
    setTimeout(() => setHasCopiedScript(false), 3000);
  };

  const handleDownloadFullBackup = async () => {
    try {
      const props = await fetchProperties();
      const unavs = await getUnavailabilities();
      await downloadFullSystemBackup(props, unavs);
      onToast('Backup completo do sistema (imóveis e calendário) baixado com sucesso!', 'success');
    } catch (err) {
      console.error('Erro ao gerar backup completo:', err);
      onToast('Erro ao exportar backup integral do sistema.', 'error');
    }
  };

  const handleRestoreFullBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const result = await restoreFullSystemBackup(content);
        if (result.success) {
          onToast(`Sistema restaurado com sucesso! (${result.propertiesCount || 0} imóveis e ${result.unavailabilitiesCount || 0} bloqueios recuperados)`, 'success');
          window.dispatchEvent(new CustomEvent('cerrado_stays_properties_updated'));
        } else {
          onToast(`Falha na restauração: ${result.error}`, 'error');
        }
      } catch (err: any) {
        onToast(`Erro ao processar arquivo: ${err?.message || 'Arquivo corrompido'}`, 'error');
      }
    };
    reader.readAsText(file);
    if (fullBackupInputRef.current) {
      fullBackupInputRef.current.value = '';
    }
  };

  const handleExportLegacyCSV = async () => {
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
          <span>Controle do Sistema, Banco de Dados & Backups</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          Configurações Administrativas
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-light mt-0.5">
          Integração com o Google Planilhas para a equipe comercial, backup atômico independente e gerenciamento de status da nuvem.
        </p>
      </div>

      {/* Supabase Status Alert Card */}
      {supabaseStatus === 'quota_restricted' ? (
        <div className="bg-amber-50 border border-amber-300 rounded-3xl p-6 sm:p-7 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-amber-900 flex items-center gap-2">
                  <span>Supabase: Cota de Tráfego Atingida (Erro 402 - exceed_egress_quota)</span>
                  <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Modo Seguro Ativo
                  </span>
                </h3>
                <p className="text-xs text-amber-800 leading-relaxed font-light">
                  O limite mensal de transferência do seu plano gratuito do Supabase foi atingido. O sistema ativou o <strong>modo de segurança local</strong> para continuar funcionando no seu computador sem travar. Para que novos clientes no celular recebam as atualizações, desbloqueie no painel do Supabase.
                </p>
              </div>
            </div>

            <a
              href="https://supabase.com/dashboard/project/yqqtiovnkusoicgamuqd/settings/billing/subscription"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 shadow-xs"
            >
              <span>Desbloquear no Supabase</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-950 block">Conexão do Banco de Dados</span>
              <span className="text-[11px] text-emerald-700">Supabase operacional com redundância em cache local.</span>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-emerald-200 text-emerald-900 rounded-full">
            Online
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. GOOGLE SHEETS BACKUP & LIVE SYNC SECTION */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DEE2E6] shadow-xs space-y-6">
        <div className="flex items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 flex-col sm:flex-row">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-neutral-900 flex items-center gap-2">
                <span>Planilha Google (Google Sheets) da Equipe</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border border-emerald-200">
                  Para as Meninas
                </span>
              </h3>
              <p className="text-xs text-neutral-500">
                Tudo o que estiver publicado no site cai organizado em uma planilha para acompanhamento comercial e backup seguro.
              </p>
            </div>
          </div>

          {/* Quick Download Sheets CSV Button */}
          <button
            type="button"
            onClick={handleExportGoogleSheetsCSV}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs cursor-pointer shrink-0 min-h-[42px]"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Planilha Google (CSV)</span>
          </button>
        </div>

        {/* Sync Settings & Webhook Input */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                URL do Webhook do Google Apps Script (Sincronização em Tempo Real)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={webhookInput}
                  onChange={(e) => setWebhookInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleSaveSheetsConfig}
                  className="bg-neutral-800 hover:bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 min-h-[40px]"
                >
                  <Save className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Quando configurado, cada alteração ou imóvel novo é enviado automaticamente para a planilha da equipe.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                URL do CSV Público da Planilha Google (Fallback Automático)
              </label>
              <input
                type="url"
                value={csvUrlInput}
                onChange={(e) => setCsvUrlInput(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Se o banco Supabase cair, o site usará essa planilha pública para carregar os imóveis no celular das clientes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleManualSyncSheets}
                disabled={isSyncingSheets || isPullingSheets}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 min-h-[38px]"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSheets ? 'animate-spin' : ''}`} />
                <span>{isSyncingSheets ? 'Sincronizando...' : 'Enviar Dados p/ Planilha'}</span>
              </button>

              <button
                type="button"
                onClick={handlePullFromSheets}
                disabled={isPullingSheets || isSyncingSheets}
                className="bg-neutral-800 hover:bg-neutral-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 min-h-[38px]"
              >
                <Download className={`w-3.5 h-3.5 ${isPullingSheets ? 'animate-spin' : ''}`} />
                <span>{isPullingSheets ? 'Puxando...' : 'Puxar da Planilha p/ o Site'}</span>
              </button>

              {sheetsConfig.lastSyncDate && (
                <span className="text-[11px] text-neutral-500">
                  Última sincronização: {new Date(sheetsConfig.lastSyncDate).toLocaleTimeString('pt-BR')}
                </span>
              )}
            </div>
          </div>

          {/* Quick Guide Card */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>Como conectar sua planilha:</span>
            </div>
            <ol className="text-[11px] text-neutral-600 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>Crie uma nova planilha no <strong>Google Sheets</strong>.</li>
              <li>Vá em <strong>Extensões &gt; Apps Script</strong>.</li>
              <li>Copie e cole nosso código pronto.</li>
              <li>Clique em <strong>Implantar &gt; App da Web</strong>.</li>
              <li>Cole a URL gerada aqui no campo ao lado!</li>
            </ol>
            <button
              type="button"
              onClick={() => setShowScriptModal(!showScriptModal)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>{showScriptModal ? 'Ocultar código do Apps Script' : 'Ver código pronto do Apps Script'}</span>
            </button>
          </div>
        </div>

        {/* Expandable Apps Script Code Preview */}
        {showScriptModal && (
          <div className="mt-4 p-5 rounded-2xl bg-neutral-900 text-neutral-100 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="text-neutral-400 text-[11px]">Código do Google Apps Script (Copie e cole na planilha):</span>
              <button
                type="button"
                onClick={handleCopyScript}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {hasCopiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopiedScript ? 'Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>
            <pre className="max-h-60 overflow-y-auto text-[11px] leading-relaxed p-2 bg-neutral-950 rounded-xl">
              {GOOGLE_APPS_SCRIPT_TEMPLATE}
            </pre>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. FULL SYSTEM BACKUP & RESTORE SECTION */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DEE2E6] shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-neutral-900 flex items-center gap-2">
              <span>Backup Integral do Sistema (Imóveis + Calendário + Avaliações)</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border border-blue-200">
                100% Independente
              </span>
            </h3>
            <p className="text-xs text-neutral-500">
              Gere um arquivo único contendo todos os dados do sistema para guardar com segurança ou restaurar em qualquer computador.
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl bg-[#FAF9F7] border border-[#DEE2E6] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>Garantia de Não Dependência do Banco</span>
            </h4>
            <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
              Mesmo que o Supabase pare completamente ou o cartão seja recusado, ao baixar este arquivo você tem todo o seu catálogo, fotos, descrições e bloqueios salvos no seu computador.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleDownloadFullBackup}
              className="bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-2xs min-h-[40px]"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Baixar Backup Completo</span>
            </button>

            <button
              type="button"
              onClick={() => fullBackupInputRef.current?.click()}
              className="bg-[#002147] hover:bg-[#C5A059] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs min-h-[40px]"
            >
              <Upload className="w-4 h-4" />
              <span>Restaurar Backup</span>
            </button>
            <input
              ref={fullBackupInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleRestoreFullBackup}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. RELATÓRIOS CSV TRADICIONAIS */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DEE2E6] shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              Relatório Geral em Planilha CSV
            </h3>
            <p className="text-xs text-neutral-500">
              Exportação tradicional de dados tabulares para controle financeiro e prestação de contas aos donos dos imóveis.
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl bg-[#FAF9F7] border border-[#DEE2E6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-neutral-900">
              Exportação CSV Detalhada
            </h4>
            <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
              Inclui diárias médias, taxas de limpeza, capacidades e histórico temporal de bloqueios.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportLegacyCSV}
            className="bg-[#002147] hover:bg-[#C5A059] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs shrink-0 min-h-[40px]"
          >
            <Download className="w-4 h-4" />
            <span>Baixar CSV</span>
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
                Restaura o catálogo de demonstração de Palmas, TO (Orla 14, Graciosa, Centro) e redefine bloqueios iniciais.
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

      {/* Global Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmingReset}
        title="Restaurar Catálogo de Demonstração"
        description="Esta ação substituirá todos os imóveis atuais, fotos enviadas e bloqueios personalizados pelos dados de demonstração originais de Palmas, TO."
        itemName="Base de Dados de Imóveis & Calendário"
        itemTypeLabel="Dados afetados"
        consequences={[
          'Todos os imóveis cadastrados manualmente nesta sessão serão sobrescritos.',
          'Os bloqueios manuais de calendário serão redefinidos para os períodos padrão.',
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
