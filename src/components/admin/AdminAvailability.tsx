import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Lock, 
  Unlock, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Trash2, 
  Edit3, 
  MapPin, 
  Building2,
  Filter,
  Check,
  AlertTriangle,
  X,
  Sparkles,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { Property, PropertyUnavailability } from '../../types';
import { getDatesInRange } from '../../lib/dateUtils';

interface AdminAvailabilityProps {
  properties: Property[];
  selectedPropertyId?: string;
  unavailabilities: PropertyUnavailability[];
  onAddBlock: (block: Omit<PropertyUnavailability, 'id' | 'createdAt'>) => { success: boolean; error?: string };
  onRemoveBlock: (id: string) => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

const REASON_PRESETS = [
  'Imóvel reservado',
  'Manutenção preventiva / reparos',
  'Uso próprio do proprietário',
  'Bloqueio manual de temporada',
  'Limpeza profunda & higienização',
  'Outro motivo',
];

export const AdminAvailability: React.FC<AdminAvailabilityProps> = ({
  properties,
  selectedPropertyId,
  unavailabilities,
  onAddBlock,
  onRemoveBlock,
  onToast,
}) => {
  // Current active property
  const [activePropertyId, setActivePropertyId] = useState<string>(() => {
    if (selectedPropertyId && properties.some((p) => p.id === selectedPropertyId)) {
      return selectedPropertyId;
    }
    return properties[0]?.id || '';
  });

  // Current view month (e.g. August 2026 or current)
  const [viewDate, setViewDate] = useState(() => new Date(2026, 7, 1)); // August 2026

  // Block Modal State
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockStartDate, setBlockStartDate] = useState('');
  const [blockEndDate, setBlockEndDate] = useState('');
  const [blockReason, setBlockReason] = useState('Imóvel reservado');
  const [blockCustomReason, setBlockCustomReason] = useState('');
  const [blockNotes, setBlockNotes] = useState('');
  const [blockError, setBlockError] = useState<string | null>(null);

  // Detail / Unlock Modal State
  const [selectedBlockForDetail, setSelectedBlockForDetail] = useState<PropertyUnavailability | null>(null);
  const [isConfirmingUnlock, setIsConfirmingUnlock] = useState(false);

  const currentProperty = properties.find((p) => p.id === activePropertyId) || properties[0];

  // Property Unavailabilities
  const propertyBlocks = unavailabilities.filter((u) => u.propertyId === activePropertyId);

  // Month navigation
  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    setViewDate(new Date());
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Calculate days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const formatDateString = (year: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  // Helper: Find which block (if any) contains this date
  const findBlockForDate = (dateStr: string): PropertyUnavailability | undefined => {
    return propertyBlocks.find((b) => dateStr >= b.startDate && dateStr <= b.endDate);
  };

  // Day Click handler in calendar
  const handleCalendarDayClick = (dateStr: string) => {
    const existingBlock = findBlockForDate(dateStr);
    if (existingBlock) {
      // Open block details / unlock modal
      setSelectedBlockForDetail(existingBlock);
      setIsConfirmingUnlock(false);
    } else {
      // Open create block modal with this date preselected as start
      setBlockStartDate(dateStr);
      setBlockEndDate(dateStr);
      setBlockReason('Imóvel reservado');
      setBlockCustomReason('');
      setBlockNotes('');
      setBlockError(null);
      setIsBlockModalOpen(true);
    }
  };

  // Submit Block Form
  const handleSaveBlock = (e: React.FormEvent) => {
    e.preventDefault();
    setBlockError(null);

    if (!blockStartDate || !blockEndDate) {
      setBlockError('Informe as datas inicial e final.');
      return;
    }

    if (blockEndDate < blockStartDate) {
      setBlockError('A data final não pode ser anterior à data inicial.');
      return;
    }

    const finalReason = blockReason === 'Outro motivo' && blockCustomReason.trim()
      ? blockCustomReason.trim()
      : blockReason;

    const res = onAddBlock({
      propertyId: activePropertyId,
      startDate: blockStartDate,
      endDate: blockEndDate,
      reason: finalReason,
      notes: blockNotes.trim(),
    });

    if (res.success) {
      setIsBlockModalOpen(false);
      onToast(`Período de ${formatDateDisplay(blockStartDate)} a ${formatDateDisplay(blockEndDate)} bloqueado com sucesso!`, 'success');
    } else {
      const errorMessage = typeof res.error === 'string' 
        ? res.error 
        : (res.error && typeof res.error === 'object' && 'message' in res.error ? (res.error as any).message : 'Não foi possível bloquear o período.');
      setBlockError(errorMessage);
    }
  };

  // Unlock block
  const handleConfirmUnlock = () => {
    if (selectedBlockForDetail) {
      onRemoveBlock(selectedBlockForDetail.id);
      const start = formatDateDisplay(selectedBlockForDetail.startDate);
      const end = formatDateDisplay(selectedBlockForDetail.endDate);
      setSelectedBlockForDetail(null);
      setIsConfirmingUnlock(false);
      onToast(`Período de ${start} a ${end} liberado! As datas já estão disponíveis no site.`, 'success');
    }
  };

  // Build calendar matrix
  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header & Property Switcher */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DEE2E6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-wider mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Controle de Disponibilidade & Bloqueios</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Calendário de Reservas
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-light mt-0.5 max-w-xl">
            Bloqueie períodos para locação, manutenção ou uso próprio. Qualquer alteração aqui reflete instantaneamente na busca do site.
          </p>
        </div>

        {/* Action Button: + Bloquear Período */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setBlockStartDate('');
              setBlockEndDate('');
              setBlockReason('Imóvel reservado');
              setBlockCustomReason('');
              setBlockNotes('');
              setBlockError(null);
              setIsBlockModalOpen(true);
            }}
            className="bg-[#002147] hover:bg-[#C5A059] text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs hover:shadow-md cursor-pointer min-h-[42px] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Bloquear Período</span>
          </button>
        </div>
      </div>

      {/* Property Selector Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-[#DEE2E6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <img
            src={currentProperty?.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80'}
            alt={currentProperty?.name || 'Imóvel'}
            className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0"
          />
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block">
              Imóvel em Edição:
            </span>
            <div className="font-serif font-bold text-base sm:text-lg text-neutral-900 truncate">
              {currentProperty?.name || 'Selecione um imóvel'}
            </div>
            <div className="text-xs text-neutral-500 truncate">
              {currentProperty?.neighborhood || currentProperty?.location || 'Palmas, TO'}
            </div>
          </div>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs font-bold text-neutral-600 whitespace-nowrap hidden sm:block">
            Trocar imóvel:
          </label>
          <select
            value={activePropertyId}
            onChange={(e) => setActivePropertyId(e.target.value)}
            className="w-full md:w-72 px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900 bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all cursor-pointer min-h-[42px]"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.neighborhood || p.location})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Calendar View */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#DEE2E6] shadow-xs space-y-6">
        {/* Month Header / Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-neutral-900">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-1 rounded-full text-xs font-bold text-[#C5A059] bg-[#FAF7F2] border border-[#C5A059]/30 hover:bg-[#F2ECE4] transition-colors cursor-pointer"
            >
              Mês Atual
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer"
              title="Mês Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer"
              title="Próximo Mês"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold text-neutral-600 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Data Disponível (clique para bloquear)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Data Bloqueada / Reservada (clique para liberar)</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Weekday headers */}
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center py-2 text-xs font-bold uppercase tracking-wider text-neutral-400"
            >
              {day}
            </div>
          ))}

          {/* Day Cells */}
          {calendarCells.map((day, idx) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[70px] sm:min-h-[90px] rounded-2xl bg-neutral-50/50 border border-neutral-100/50"
                />
              );
            }

            const dateStr = formatDateString(currentYear, currentMonth, day);
            const blockInfo = findBlockForDate(dateStr);
            const isBlocked = !!blockInfo;

            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => handleCalendarDayClick(dateStr)}
                className={`min-h-[70px] sm:min-h-[90px] p-2 sm:p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative group ${
                  isBlocked
                    ? 'bg-rose-50/70 border-rose-200 hover:border-rose-400 hover:shadow-xs'
                    : 'bg-white border-neutral-200 hover:border-[#C5A059] hover:bg-[#FAF7F2]/40 hover:shadow-xs'
                }`}
              >
                {/* Top: Day Number & Status Dot */}
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs sm:text-sm font-bold ${isBlocked ? 'text-rose-900' : 'text-neutral-800'}`}>
                    {day}
                  </span>

                  <span className={`w-2 h-2 rounded-full ${isBlocked ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                </div>

                {/* Bottom: Status label or Block Reason */}
                <div className="w-full">
                  {isBlocked ? (
                    <div className="text-[10px] font-semibold text-rose-700 bg-rose-100/80 px-1.5 py-0.5 rounded-lg truncate flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{blockInfo?.reason || 'Bloqueado'}</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-emerald-700 font-medium hidden sm:block">
                      Disponível
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Unavailabilities Table / List for this Property */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DEE2E6] shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <div>
            <h3 className="font-serif font-bold text-xl text-neutral-900">
              Bloqueios Registrados para este Imóvel ({propertyBlocks.length})
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Visualize, edite ou libere datas bloqueadas para <strong className="text-neutral-800">{currentProperty?.name}</strong>.
            </p>
          </div>
        </div>

        {propertyBlocks.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {propertyBlocks.map((block) => {
              const nights = getDatesInRange(block.startDate, block.endDate).length;

              return (
                <div
                  key={block.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/60 p-3.5 rounded-2xl transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-neutral-900">
                          {formatDateDisplay(block.startDate)} até {formatDateDisplay(block.endDate)}
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                          {nights} {nights === 1 ? 'dia bloqueado' : 'dias bloqueados'}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-600 mt-1 font-medium">
                        Motivo: <span className="text-neutral-900 font-bold">{block.reason || 'Bloqueio manual'}</span>
                      </p>
                      {block.notes && (
                        <p className="text-[11px] text-neutral-400 mt-0.5 italic">
                          &quot;{block.notes}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBlockForDetail(block);
                        setIsConfirmingUnlock(false);
                      }}
                      className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Detalhes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBlockForDetail(block);
                        setIsConfirmingUnlock(true);
                      }}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-200 min-h-[38px]"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Liberar Datas</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-neutral-400 space-y-2">
            <CalendarIcon className="w-8 h-8 mx-auto text-neutral-300" />
            <p className="text-xs font-medium">Nenhum bloqueio cadastrado para este imóvel.</p>
            <p className="text-[11px] text-neutral-500">Todas as datas estão liberadas para reserva no site.</p>
          </div>
        )}
      </div>

      {/* MODAL 1: + BLOQUEAR PERÍODO */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-neutral-200 shadow-2xl space-y-5 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-neutral-900">
                    Bloquear Período de Datas
                  </h3>
                  <p className="text-[11px] text-neutral-500 truncate max-w-xs">
                    {currentProperty?.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBlockModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error banner */}
            {blockError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{blockError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveBlock} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Data Inicial *
                  </label>
                  <input
                    type="date"
                    required
                    value={blockStartDate}
                    onChange={(e) => setBlockStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900 bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Data Final *
                  </label>
                  <input
                    type="date"
                    required
                    value={blockEndDate}
                    onChange={(e) => setBlockEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900 bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 min-h-[42px]"
                  />
                </div>
              </div>

              {/* Motivo do Bloqueio */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Motivo do Bloqueio
                </label>
                <select
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900 bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 cursor-pointer min-h-[42px]"
                >
                  {REASON_PRESETS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              {blockReason === 'Outro motivo' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Especifique o Motivo
                  </label>
                  <input
                    type="text"
                    required
                    value={blockCustomReason}
                    onChange={(e) => setBlockCustomReason(e.target.value)}
                    placeholder="Ex: Reforma do deck da piscina"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-[#C5A059] min-h-[42px]"
                  />
                </div>
              )}

              {/* Notas Opcionais */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Notas / Observações Internas (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={blockNotes}
                  onChange={(e) => setBlockNotes(e.target.value)}
                  placeholder="Ex: Alugado diretamente para a família do Dr. Marcos"
                  className="w-full p-3 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20"
                />
              </div>

              {/* Notice */}
              <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#C5A059]/20 text-[11px] text-neutral-600 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>
                  Ao confirmar, todas as datas deste intervalo ficarão indisponíveis para seleção no site público.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBlockModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-neutral-200 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 cursor-pointer min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs min-h-[44px]"
                >
                  Bloquear Datas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DETALHES DO BLOQUEIO / LIBERAR DATAS */}
      {selectedBlockForDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-neutral-200 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-neutral-900">
                    Detalhes da Indisponibilidade
                  </h3>
                  <p className="text-[11px] text-neutral-500 truncate max-w-xs">
                    {currentProperty?.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedBlockForDetail(null);
                  setIsConfirmingUnlock(false);
                }}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Block Details Info Box */}
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2.5 text-xs text-neutral-700">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 font-medium">Período Bloqueado:</span>
                <span className="font-bold text-neutral-900">
                  {formatDateDisplay(selectedBlockForDetail.startDate)} até {formatDateDisplay(selectedBlockForDetail.endDate)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500 font-medium">Duração:</span>
                <span className="font-bold text-neutral-900">
                  {getDatesInRange(selectedBlockForDetail.startDate, selectedBlockForDetail.endDate).length} noites/dias
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500 font-medium">Motivo Registrado:</span>
                <span className="font-bold text-neutral-900">
                  {selectedBlockForDetail.reason || 'Bloqueio manual'}
                </span>
              </div>

              {selectedBlockForDetail.notes && (
                <div className="pt-2 border-t border-neutral-200/60 text-neutral-600 italic">
                  &quot;{selectedBlockForDetail.notes}&quot;
                </div>
              )}
            </div>

            {/* Confirmation Alert Box if in confirm mode */}
            {isConfirmingUnlock ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Confirma a liberação deste período?</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  As datas voltarão a ficar disponíveis no calendário público e os hóspedes poderão realizar reservas para estes dias.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsConfirmingUnlock(false)}
                    className="flex-1 bg-white border border-amber-300 text-amber-900 py-2.5 rounded-xl font-bold uppercase text-[10px] cursor-pointer min-h-[40px]"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmUnlock}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold uppercase text-[10px] cursor-pointer shadow-xs min-h-[40px]"
                  >
                    Confirmar Liberação
                  </button>
                </div>
              </div>
            ) : (
              /* Action Buttons */
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBlockForDetail(null)}
                  className="flex-1 py-3 rounded-xl border border-neutral-200 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 cursor-pointer min-h-[44px]"
                >
                  Fechar
                </button>

                <button
                  type="button"
                  onClick={() => setIsConfirmingUnlock(true)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs min-h-[44px]"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Liberar Datas</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
