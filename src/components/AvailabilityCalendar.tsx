import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info, RotateCcw } from 'lucide-react';

interface AvailabilityCalendarProps {
  bookedDates: string[]; // ['YYYY-MM-DD', ...]
  checkIn: string | null;
  checkOut: string | null;
  onSelectDates: (checkIn: string | null, checkOut: string | null) => void;
  pricePerNight?: number;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  bookedDates = [],
  checkIn,
  checkOut,
  onSelectDates,
  pricePerNight,
}) => {
  // Current view month (starting August 2026 or current date)
  const [viewDate, setViewDate] = useState(() => {
    if (checkIn) return new Date(`${checkIn}T00:00:00`);
    return new Date();
  });

  const [hoverDate, setHoverDate] = useState<string | null>(null);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Calculate days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Helper to format date YYYY-MM-DD
  const formatDateString = (year: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const isDateBooked = (dateStr: string) => {
    return bookedDates.includes(dateStr);
  };

  const isDatePast = (dateStr: string) => {
    return dateStr < todayStr;
  };

  const handleDayClick = (dateStr: string) => {
    if (isDatePast(dateStr) || isDateBooked(dateStr)) return;

    if (!checkIn || (checkIn && checkOut)) {
      // Start new selection
      onSelectDates(dateStr, null);
    } else if (checkIn && !checkOut) {
      if (dateStr < checkIn) {
        // Clicked an earlier date -> make it new checkin
        onSelectDates(dateStr, null);
      } else if (dateStr === checkIn) {
        // Deselect
        onSelectDates(null, null);
      } else {
        // Check if there are booked dates in between
        let hasConflict = false;
        let d = new Date(`${checkIn}T00:00:00`);
        const end = new Date(`${dateStr}T00:00:00`);
        
        while (d <= end) {
          const checkStr = d.toISOString().split('T')[0];
          if (bookedDates.includes(checkStr)) {
            hasConflict = true;
            break;
          }
          d.setDate(d.getDate() + 1);
        }

        if (hasConflict) {
          // Can't select across a booked date
          onSelectDates(dateStr, null);
        } else {
          onSelectDates(checkIn, dateStr);
        }
      }
    }
  };

  // Calculate nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);
    const diff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    return Math.max(0, Math.round(diff));
  };

  const nightsCount = calculateNights();

  // Calendar cells
  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#DEE2E6] shadow-xs">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h4 className="font-serif font-bold text-lg text-[#002147] flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#C5A059]" />
            <span>{monthNames[currentMonth]} {currentYear}</span>
          </h4>
          <p className="text-xs text-neutral-500 mt-0.5">
            {checkIn && !checkOut
              ? 'Selecione a data de check-out'
              : checkIn && checkOut
              ? `${nightsCount} ${nightsCount === 1 ? 'noite selecionada' : 'noites selecionadas'}`
              : 'Selecione a data de check-in'}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {(checkIn || checkOut) && (
            <button
              onClick={() => onSelectDates(null, null)}
              className="text-xs text-neutral-500 hover:text-neutral-900 font-medium px-2 py-1 rounded-md hover:bg-neutral-100 flex items-center gap-1 transition-colors mr-2 cursor-pointer"
              title="Limpar seleção de datas"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          )}

          <button
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-full border border-neutral-200 hover:border-neutral-400 flex items-center justify-center text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-full border border-neutral-200 hover:border-neutral-400 flex items-center justify-center text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
            aria-label="Próximo mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
        {daysOfWeek.map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarCells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-10 sm:h-11" />;
          }

          const dateStr = formatDateString(currentYear, currentMonth, day);
          const isPast = isDatePast(dateStr);
          const isBooked = isDateBooked(dateStr);
          const isCheckIn = checkIn === dateStr;
          const isCheckOut = checkOut === dateStr;
          const isInRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;
          const isHoveredRange = checkIn && !checkOut && hoverDate && dateStr > checkIn && dateStr <= hoverDate;

          const isDisabled = isPast || isBooked;

          let cellStyle = 'bg-transparent text-neutral-800 hover:bg-[#FBF7EF] hover:text-[#C5A059] cursor-pointer';

          if (isDisabled) {
            cellStyle = 'bg-neutral-100 text-neutral-300 line-through cursor-not-allowed';
          } else if (isCheckIn || isCheckOut) {
            cellStyle = 'bg-[#C5A059] text-white font-bold shadow-md z-10 cursor-pointer';
          } else if (isInRange || isHoveredRange) {
            cellStyle = 'bg-[#FBF7EF] text-[#C5A059] font-semibold rounded-none cursor-pointer';
          }

          return (
            <button
              key={dateStr}
              disabled={isDisabled}
              onClick={() => handleDayClick(dateStr)}
              onMouseEnter={() => setHoverDate(dateStr)}
              onMouseLeave={() => setHoverDate(null)}
              className={`h-10 sm:h-11 rounded-lg flex flex-col items-center justify-center text-xs transition-all relative ${cellStyle}`}
            >
              <span>{day}</span>
              {!isDisabled && pricePerNight && (
                <span className="text-[9px] text-neutral-400 scale-90 hidden sm:block font-normal">
                  R${pricePerNight}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend / Status Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-neutral-100 text-xs text-neutral-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#C5A059]" />
            <span>Selecionado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FBF7EF] border border-[#C5A059]/30" />
            <span>Período</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-neutral-200" />
            <span>Reservado / Indisponível</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-neutral-400">
          <Info className="w-3.5 h-3.5" />
          <span>Estadia mínima: 2 noites</span>
        </div>
      </div>
    </div>
  );
};
