import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  EyeOff, 
  Calendar, 
  Plus, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  MapPin, 
  Clock, 
  ArrowUpRight, 
  ShieldCheck, 
  Download, 
  BellRing, 
  FileSpreadsheet, 
  Users,
  Bed,
  Bath,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { Property, PropertyUnavailability } from '../../types';
import { exportAdminReportCSV } from '../../utils/csvExport';
import { exportAdminDashboardPDF } from '../../utils/pdfExport';
import { exportToGoogleSheetsCSV } from '../../lib/googleSheetsService';

interface AdminDashboardProps {
  properties: Property[];
  unavailabilities: PropertyUnavailability[];
  onNavigateTab: (tab: 'properties' | 'availability' | 'reviews' | 'settings') => void;
  onAddProperty: () => void;
  onManagePropertyAvailability: (propertyId: string) => void;
  onEditProperty: (property: Property) => void;
  onViewPublicSite: () => void;
  onToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  properties,
  unavailabilities,
  onNavigateTab,
  onAddProperty,
  onManagePropertyAvailability,
  onEditProperty,
  onViewPublicSite,
  onToast,
}) => {
  const totalProperties = properties.length;
  const activeProperties = properties.filter((p) => p.status !== 'inactive').length;
  const inactiveProperties = properties.filter((p) => p.status === 'inactive').length;
  const activePercentage = totalProperties > 0 ? Math.round((activeProperties / totalProperties) * 100) : 0;

  // Date calculations for 48h alerts
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const in48h = new Date(today);
  in48h.setDate(today.getDate() + 2);
  const in48hStr = in48h.toISOString().split('T')[0];

  // Helper to format date DD/MM/YYYY
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const getProperty = (propId: string) => {
    return properties.find((p) => p.id === propId);
  };

  const getPropertyName = (propId: string) => {
    const found = getProperty(propId);
    return found ? found.name : 'Imóvel cadastrado';
  };

  const getPropertyLocation = (propId: string) => {
    const found = getProperty(propId);
    return found ? (found.neighborhood || found.location) : 'Palmas, TO';
  };

  // Filter 48h urgent alerts
  const urgentAlerts = unavailabilities
    .filter((u) => {
      const startsToday = u.startDate === todayStr;
      const startsTomorrow = u.startDate === tomorrowStr;
      const startsIn48h = u.startDate === in48hStr;
      const isOngoing = u.startDate <= todayStr && u.endDate >= todayStr;
      return startsToday || startsTomorrow || startsIn48h || isOngoing;
    })
    .map((u) => {
      let urgencyType: 'today' | 'tomorrow' | 'in48h' | 'ongoing' = 'in48h';
      let urgencyLabel = 'Em 48 Horas';
      let urgencyBadgeClass = 'bg-amber-100 text-amber-900 border-amber-300';
      let urgencyDotClass = 'bg-amber-500';

      if (u.startDate === todayStr) {
        urgencyType = 'today';
        urgencyLabel = 'HOJE (Check-in / Início)';
        urgencyBadgeClass = 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
        urgencyDotClass = 'bg-rose-500 animate-ping';
      } else if (u.startDate === tomorrowStr) {
        urgencyType = 'tomorrow';
        urgencyLabel = 'AMANHÃ (Em 24h)';
        urgencyBadgeClass = 'bg-orange-100 text-orange-900 border-orange-300 font-bold';
        urgencyDotClass = 'bg-orange-500';
      } else if (u.startDate === in48hStr) {
        urgencyType = 'in48h';
        urgencyLabel = 'EM 48 HORAS';
        urgencyBadgeClass = 'bg-amber-100 text-amber-900 border-amber-300';
        urgencyDotClass = 'bg-amber-500';
      } else if (u.startDate < todayStr && u.endDate >= todayStr) {
        urgencyType = 'ongoing';
        urgencyLabel = 'EM ANDAMENTO (Ocupado)';
        urgencyBadgeClass = 'bg-emerald-100 text-emerald-900 border-emerald-300';
        urgencyDotClass = 'bg-emerald-500';
      }

      return {
        ...u,
        urgencyType,
        urgencyLabel,
        urgencyBadgeClass,
        urgencyDotClass,
        property: getProperty(u.propertyId),
      };
    })
    .sort((a, b) => {
      const order = { today: 1, tomorrow: 2, in48h: 3, ongoing: 4 };
      return order[a.urgencyType] - order[b.urgencyType];
    });

  // Filter general upcoming unavailabilities (future)
  const upcomingUnavailabilities = [...unavailabilities]
    .filter((u) => u.endDate >= todayStr)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  // Monthly trends data for Recharts (considering full history and future dates)
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const currentYear = new Date().getFullYear().toString();
  const currentMonthNum = String(new Date().getMonth() + 1).padStart(2, '0');
  
  const monthlyBookingData = months.map((monthName, index) => {
    const monthNum = String(index + 1).padStart(2, '0');
    // Count unavailabilities occurring in this month across current year and historical/future records
    const count = unavailabilities.filter(u => {
      if (!u.startDate) return false;
      const parts = u.startDate.split('-');
      return parts[1] === monthNum;
    }).length;

    return {
      month: monthName,
      reservas: count,
      bloqueiosManuais: count
    };
  });

  const reservasEsteMes = unavailabilities.filter(u => {
    if (!u.startDate) return false;
    const parts = u.startDate.split('-');
    return parts[0] === currentYear && parts[1] === currentMonthNum;
  }).length;

  // Occupancy status data for PieChart and weighted occupancy rate by active days since each property's registration
  const activePropertiesList = properties.filter((p) => p.status !== 'inactive');
  let totalActiveDaysWeighted = 0;
  let totalOccupiedDaysWeighted = 0;

  activePropertiesList.forEach(p => {
    // Determine registration date
    let regDate = p.createdAt ? new Date(p.createdAt) : new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    if (isNaN(regDate.getTime())) {
      regDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    // Active days from registration until today (at least 1 day)
    const diffTime = Math.max(0, today.getTime() - regDate.getTime());
    const activeDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    totalActiveDaysWeighted += activeDays;

    // Calculate occupied days for this property within its active lifespan
    const propUnavs = unavailabilities.filter(u => u.propertyId === p.id);
    let occupiedDaysCount = 0;
    
    // To avoid double counting overlapping ranges, we check day by day or use a Set of date strings
    const occupiedDatesSet = new Set<string>();
    propUnavs.forEach(u => {
      if (!u.startDate || !u.endDate) return;
      let curr = new Date(u.startDate);
      const end = new Date(u.endDate);
      while (curr <= end) {
        const dateStr = curr.toISOString().split('T')[0];
        // Only count if within registration and today
        const regStr = regDate.toISOString().split('T')[0];
        if (dateStr >= regStr && dateStr <= todayStr) {
          occupiedDatesSet.add(dateStr);
        }
        curr.setDate(curr.getDate() + 1);
      }
    });
    occupiedDaysCount = occupiedDatesSet.size;
    totalOccupiedDaysWeighted += occupiedDaysCount;
  });

  const occupiedTodayCount = properties.filter(p => 
    unavailabilities.some(u => u.propertyId === p.id && u.startDate <= todayStr && u.endDate >= todayStr)
  ).length;

  const activeFreeCount = Math.max(0, activeProperties - occupiedTodayCount);

  const averageOccupancyRate = totalActiveDaysWeighted > 0
    ? Math.min(100, Math.max(0, Math.round((totalOccupiedDaysWeighted / totalActiveDaysWeighted) * 100)))
    : (activeProperties > 0 ? Math.round((occupiedTodayCount / activeProperties) * 100) : 0);

  const occupancyPieData = [
    { name: 'Disponíveis', value: activeFreeCount, color: '#10B981' },
    { name: 'Ocupados Hoje', value: occupiedTodayCount, color: '#C5A059' },
    { name: 'Ocultos / Inativos', value: inactiveProperties, color: '#9CA3AF' },
  ].filter(item => item.value > 0);

  const finalPieData = occupancyPieData.length > 0 ? occupancyPieData : [
    { name: 'Disponíveis', value: properties.length || 1, color: '#10B981' }
  ];

  const handleExportCSV = () => {
    try {
      exportAdminReportCSV(properties, unavailabilities);
      if (onToast) {
        onToast('Relatório CSV exportado com sucesso!', 'success');
      }
    } catch (err) {
      console.error('Erro ao exportar CSV:', err);
      if (onToast) {
        onToast('Erro ao exportar arquivo CSV.', 'error');
      }
    }
  };

  const handleExportPDF = () => {
    try {
      exportAdminDashboardPDF(properties, unavailabilities);
      if (onToast) {
        onToast('Relatório PDF executivo gerado com sucesso!', 'success');
      }
    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
      if (onToast) {
        onToast('Erro ao gerar relatório em PDF.', 'error');
      }
    }
  };

  const handleExportGoogleSheets = () => {
    try {
      exportToGoogleSheetsCSV(properties, unavailabilities);
      if (onToast) {
        onToast('Planilha Google (CSV) baixada para a equipe!', 'success');
      }
    } catch (err) {
      console.error('Erro ao exportar Planilha Google:', err);
      if (onToast) {
        onToast('Erro ao exportar Planilha Google.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DEE2E6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gestão Operacional de Alto Padrão</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Painel Geral da Administradora
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-light max-w-2xl">
            Acompanhe a disponibilidade em tempo real, monitore bloqueios das próximas 48h e gerencie o portfólio de imóveis de temporada em Palmas.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportGoogleSheets}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-2xs min-h-[40px]"
            title="Exportar base formatada para o Google Planilhas das meninas"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Planilha Google</span>
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            className="bg-[#002147] hover:bg-[#001530] text-white px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-2xs min-h-[40px]"
            title="Exportar relatório executivo em PDF para proprietários"
          >
            <Download className="w-4 h-4 text-[#C5A059]" />
            <span>Exportar PDF</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="bg-[#FAF7F2] hover:bg-[#F2ECE4] text-[#C5A059] border border-[#C5A059]/30 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-2xs min-h-[40px]"
            title="Exportar base completa em planilha CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>

          <button
            type="button"
            onClick={onAddProperty}
            className="bg-[#002147] hover:bg-[#C5A059] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs hover:shadow-md cursor-pointer min-h-[40px] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Imóvel</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Total Properties */}
        <div 
          onClick={() => onNavigateTab('properties')}
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#DEE2E6] shadow-2xs hover:border-[#C5A059]/50 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500">
              Total de Imóveis
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center group-hover:bg-[#002147] group-hover:text-white transition-colors">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
              {totalProperties}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1 font-medium">
              <span>Portfólio cadastrado</span>
              <ChevronRight className="w-3 h-3 text-[#C5A059]" />
            </p>
          </div>
        </div>

        {/* Active Properties */}
        <div 
          onClick={() => onNavigateTab('properties')}
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#DEE2E6] shadow-2xs hover:border-emerald-400 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500">
              Imóveis Ativos
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-600">
              {activeProperties}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1 font-medium">
              {activePercentage}% visíveis no site
            </p>
          </div>
        </div>

        {/* Reservas este Mês */}
        <div 
          onClick={() => onNavigateTab('availability')}
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#DEE2E6] shadow-2xs hover:border-[#C5A059]/50 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500">
              Reservas este Mês
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FAF7F2] text-[#C5A059] flex items-center justify-center group-hover:bg-[#C5A059] group-hover:text-white transition-colors">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#C5A059]">
              {reservasEsteMes}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1 font-medium">
              <span>Neste mês atual</span>
              <ChevronRight className="w-3 h-3 text-[#C5A059]" />
            </p>
          </div>
        </div>

        {/* Taxa de Ocupação Média */}
        <div 
          onClick={() => onNavigateTab('availability')}
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#DEE2E6] shadow-2xs hover:border-[#002147]/50 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500">
              Taxa Ocupação Média
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-[#002147] flex items-center justify-center group-hover:bg-[#002147] group-hover:text-white transition-colors">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#002147]">
              {averageOccupancyRate}%
            </div>
            <p className="text-[11px] text-neutral-500 mt-1 font-medium">
              Baseado no portfólio ativo
            </p>
          </div>
        </div>
      </div>

      {/* 🚨 OPERATIONAL ALERTS (48h) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#DEE2E6] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              urgentAlerts.length > 0
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {urgentAlerts.length > 0 ? (
                <BellRing className="w-5 h-5 animate-pulse" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif font-bold text-lg text-neutral-900">
                  Alertas Operacionais (Próximas 48 Horas)
                </h3>
                {urgentAlerts.length > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {urgentAlerts.length} {urgentAlerts.length === 1 ? 'Aviso' : 'Avisos'}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500">
                Check-ins iminentes, reservas em andamento e manutenções em Palmas.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('availability')}
            className="text-xs font-bold text-[#C5A059] hover:underline flex items-center gap-1 self-start sm:self-center cursor-pointer"
          >
            <span>Ver Calendário Geral</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {urgentAlerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {urgentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-[#FAF9F7] rounded-2xl p-4 border border-[#DEE2E6] hover:border-[#C5A059]/50 transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="space-y-3">
                  {/* Top Urgency Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${alert.urgencyBadgeClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${alert.urgencyDotClass}`} />
                      <span>{alert.urgencyLabel}</span>
                    </span>

                    <span className="text-[11px] font-bold text-neutral-600 truncate max-w-[130px]">
                      {alert.reason || 'Bloqueio de data'}
                    </span>
                  </div>

                  {/* Property Info */}
                  <div className="flex items-start gap-3">
                    <img
                      src={alert.property?.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                      alt={alert.property?.name || 'Imóvel'}
                      className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                        {alert.property?.name || getPropertyName(alert.propertyId)}
                      </h4>
                      <p className="text-[11px] text-neutral-500 flex items-center gap-1 truncate mt-0.5">
                        <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span>{alert.property?.neighborhood || alert.property?.location || 'Palmas - TO'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Period */}
                  <div className="bg-white rounded-xl p-2.5 border border-neutral-200/80 text-xs text-neutral-700 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C5A059]" />
                        <span>Período:</span>
                      </span>
                      <span className="font-bold text-neutral-900">
                        {formatDateDisplay(alert.startDate)} até {formatDateDisplay(alert.endDate)}
                      </span>
                    </div>
                    {alert.notes && (
                      <p className="text-[11px] text-neutral-500 italic truncate border-t border-neutral-100 pt-1 mt-1">
                        &quot;{alert.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onManagePropertyAvailability(alert.propertyId)}
                    className="text-xs font-bold text-[#C5A059] hover:text-[#A68648] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Abrir no Calendário</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => alert.property && onEditProperty(alert.property)}
                    className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
                  >
                    Editar Imóvel
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 px-4 rounded-2xl bg-[#FAF9F7] border border-dashed border-[#DEE2E6] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-neutral-900">
                  Nenhum check-in ou bloqueio iniciando nas próximas 48 horas
                </p>
                <p className="text-[11px] sm:text-xs text-neutral-500">
                  A operação dos seus imóveis em Palmas está 100% livre e pronta para novas reservas.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('availability')}
              className="bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
            >
              + Bloquear Nova Data
            </button>
          </div>
        )}
      </div>

      {/* PERFORMANCE & ANALYTICS DASHBOARD (RECHARTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Line Chart: Monthly Booking Trends (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#DEE2E6] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
            <div>
              <div className="flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-wider mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Análise de Performance</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-neutral-900">
                Tendência de Reservas e Ocupação (Mensal)
              </h3>
            </div>
            <span className="text-xs bg-[#FAF7F2] text-[#C5A059] font-bold px-3 py-1 rounded-xl border border-[#C5A059]/30">
              Ano {currentYear}
            </span>
          </div>

          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyBookingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                  axisLine={{ stroke: '#E5E7EB' }} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#002147', borderRadius: '12px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                  labelStyle={{ color: '#C5A059', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="reservas" 
                  name="Reservas / Estadias" 
                  stroke="#C5A059" 
                  strokeWidth={3} 
                  dot={{ fill: '#C5A059', r: 4 }} 
                  activeDot={{ r: 7, fill: '#002147', stroke: '#C5A059', strokeWidth: 2 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="bloqueiosManuais" 
                  name="Bloqueios / Manutenção" 
                  stroke="#002147" 
                  strokeWidth={2} 
                  dot={{ fill: '#002147', r: 3 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 pt-4 mt-2 border-t border-neutral-100 text-xs text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#C5A059]" />
              <span className="font-medium">Reservas / Estadias</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#002147]" />
              <span className="font-medium">Bloqueios Manuais</span>
            </div>
          </div>
        </div>

        {/* Pie Chart: Property Occupancy Status (1 col) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DEE2E6] shadow-xs flex flex-col justify-between">
          <div className="pb-4 border-b border-neutral-100 mb-6">
            <div className="flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-wider mb-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Status do Portfólio</span>
            </div>
            <h3 className="font-serif font-bold text-xl text-neutral-900">
              Status de Ocupação Hoje
            </h3>
          </div>

          <div className="w-full h-56 sm:h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={finalPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {finalPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#002147', borderRadius: '12px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-4 border-t border-neutral-100">
            {finalPieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-neutral-700">{item.name}</span>
                </div>
                <span className="font-bold text-neutral-900">{item.value} imóveis</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Two Columns: Upcoming Blocks vs Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: Upcoming Blocked Dates (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-8 border border-[#DEE2E6] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
              <div>
                <h3 className="font-serif font-bold text-xl text-neutral-900">
                  Próximas Indisponibilidades & Bloqueios
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Períodos bloqueados no calendário para locação, manutenção ou uso próprio.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab('availability')}
                className="text-xs font-bold text-[#C5A059] hover:text-[#A68648] flex items-center gap-1 uppercase tracking-wider cursor-pointer"
              >
                <span className="hidden sm:inline">Abrir Calendário</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingUnavailabilities.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {upcomingUnavailabilities.slice(0, 5).map((block) => (
                  <div 
                    key={block.id} 
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF9F7] p-2.5 rounded-xl transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900">
                          {getPropertyName(block.propertyId)}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5 flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-neutral-400" />
                            {getPropertyLocation(block.propertyId)}
                          </span>
                          <span>&bull;</span>
                          <span className="font-bold text-neutral-800">
                            {formatDateDisplay(block.startDate)} até {formatDateDisplay(block.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700">
                        {block.reason || 'Bloqueio manual'}
                      </span>
                      <button
                        type="button"
                        onClick={() => onManagePropertyAvailability(block.propertyId)}
                        className="text-xs font-bold text-[#C5A059] hover:underline px-2 py-1 cursor-pointer"
                      >
                        Ajustar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-400 space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-neutral-300" />
                <p className="text-xs font-medium">Nenhuma data futura está bloqueada no momento.</p>
                <button
                  type="button"
                  onClick={() => onNavigateTab('availability')}
                  className="text-xs text-[#C5A059] font-bold hover:underline cursor-pointer"
                >
                  + Bloquear um período agora
                </button>
              </div>
            )}
          </div>

          {upcomingUnavailabilities.length > 5 && (
            <div className="pt-4 mt-2 border-t border-neutral-100 text-center">
              <button
                type="button"
                onClick={() => onNavigateTab('availability')}
                className="text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer inline-flex items-center gap-1"
              >
                <span>Ver todos os {upcomingUnavailabilities.length} bloqueios</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Quick Shortcuts (1 col) */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#C5A059]/25 shadow-2xs">
            <h3 className="font-serif font-bold text-lg text-neutral-900 mb-1.5">
              Ações Rápidas
            </h3>
            <p className="text-xs text-neutral-600 mb-4">
              Atalhos para tarefas diárias de administração.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={onAddProperty}
                className="w-full bg-[#002147] hover:bg-[#C5A059] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors shadow-2xs cursor-pointer min-h-[44px]"
              >
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Imóvel</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="w-full bg-white hover:bg-neutral-50 text-neutral-900 border border-[#DEE2E6] py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer min-h-[44px]"
              >
                <span className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#C5A059]" />
                  <span>Exportar Relatório CSV</span>
                </span>
                <Download className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('properties')}
                className="w-full bg-white hover:bg-neutral-50 text-neutral-900 border border-[#DEE2E6] py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer min-h-[44px]"
              >
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#C5A059]" />
                  <span>Ver Imóveis ({properties.length})</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('availability')}
                className="w-full bg-white hover:bg-neutral-50 text-neutral-900 border border-[#DEE2E6] py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer min-h-[44px]"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#C5A059]" />
                  <span>Gerenciar Calendário</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Quick Property Snapshot */}
          <div className="bg-white rounded-3xl p-6 border border-[#DEE2E6] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-serif font-bold text-base text-neutral-900">
                Imóveis Recentes
              </h4>
              <button
                type="button"
                onClick={() => onNavigateTab('properties')}
                className="text-xs text-[#C5A059] font-bold hover:underline cursor-pointer"
              >
                Ver todos
              </button>
            </div>

            <div className="space-y-2.5">
              {properties.slice(0, 3).map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 border border-neutral-100 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={property.coverImage}
                      alt={property.name}
                      className="w-11 h-11 rounded-lg object-cover border border-neutral-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">
                        {property.name}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate">
                        {property.neighborhood || property.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onManagePropertyAvailability(property.id)}
                      className="p-2 rounded-lg text-neutral-400 hover:text-[#C5A059] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                      title="Abrir calendário deste imóvel"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditProperty(property)}
                      className="p-2 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                      title="Editar imóvel"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
