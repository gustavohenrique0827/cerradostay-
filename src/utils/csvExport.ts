import { Property, PropertyUnavailability } from '../types';

/**
 * Generates and downloads a comprehensive CSV report of properties,
 * occupancy rates, and date unavailability history for external administrative tracking.
 */
export const exportAdminReportCSV = (
  properties: Property[],
  unavailabilities: PropertyUnavailability[]
) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // 90-day window for occupancy calculations
  const next90DaysDate = new Date();
  next90DaysDate.setDate(today.getDate() + 90);
  const next90DaysStr = next90DaysDate.toISOString().split('T')[0];

  // Helper to format date DD/MM/YYYY
  const formatDateBR = (isoDate: string) => {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return isoDate;
  };

  // Helper to escape CSV text cell
  const escapeCSV = (value: any) => {
    if (value === null || value === undefined) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  // Calculate days between two dates
  const calculateDays = (start: string, end: string) => {
    try {
      const d1 = new Date(start);
      const d2 = new Date(end);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    } catch {
      return 1;
    }
  };

  const rows: string[] = [];

  // ==========================================
  // SECTION 1: CABEÇALHO DO RELATÓRIO
  // ==========================================
  rows.push(escapeCSV('RELATÓRIO GERAL DE GESTÃO - CERRADO STAY PALMAS/TO'));
  rows.push(`${escapeCSV('Data de Emissão:')};${escapeCSV(formatDateBR(todayStr))};${escapeCSV('Horário:')};${escapeCSV(today.toLocaleTimeString('pt-BR'))}`);
  rows.push(`${escapeCSV('Total de Imóveis Cadastrados:')};${escapeCSV(properties.length)};${escapeCSV('Total de Bloqueios Registrados:')};${escapeCSV(unavailabilities.length)}`);
  rows.push(''); // Blank line

  // ==========================================
  // SECTION 2: RESUMO DOS IMÓVEIS & OCUPAÇÃO
  // ==========================================
  rows.push(escapeCSV('--- 1. CATÁLOGO DE IMÓVEIS E TAXA DE OCUPAÇÃO ESTIMADA (PRÓXIMOS 90 DIAS) ---'));
  
  const propertyHeaders = [
    'ID do Imóvel',
    'Nome / Título do Imóvel',
    'Localização / Bairro',
    'Cidade / UF',
    'Status no Site',
    'Diária Base (R$)',
    'Taxa de Limpeza (R$)',
    'Hóspedes Máx.',
    'Quartos',
    'Camas',
    'Banheiros',
    'Total de Bloqueios',
    'Dias Bloqueados (Próx. 90d)',
    'Taxa de Ocupação Estimada (%)',
  ];
  rows.push(propertyHeaders.map(escapeCSV).join(';'));

  properties.forEach((p) => {
    // Calculate unavailabilities for this property
    const propBlocks = unavailabilities.filter((u) => u.propertyId === p.id);
    
    // Calculate blocked days in the next 90 days window
    let daysBlockedNext90 = 0;
    propBlocks.forEach((u) => {
      // Check if block overlaps with [today, next90Days]
      if (u.endDate >= todayStr && u.startDate <= next90DaysStr) {
        const effectiveStart = u.startDate < todayStr ? todayStr : u.startDate;
        const effectiveEnd = u.endDate > next90DaysStr ? next90DaysStr : u.endDate;
        daysBlockedNext90 += calculateDays(effectiveStart, effectiveEnd);
      }
    });

    const occupancyRate = Math.min(100, Math.round((daysBlockedNext90 / 90) * 100));

    const row = [
      p.id,
      p.name,
      p.location,
      `${p.city || 'Palmas'} - ${p.state || 'TO'}`,
      p.status === 'inactive' ? 'Inativo (Oculto)' : 'Ativo (Publicado)',
      p.pricePerNight.toFixed(2).replace('.', ','),
      p.cleaningFee.toFixed(2).replace('.', ','),
      p.maxGuests,
      p.bedrooms,
      p.beds,
      p.bathrooms,
      propBlocks.length,
      daysBlockedNext90,
      `${occupancyRate}%`,
    ];
    rows.push(row.map(escapeCSV).join(';'));
  });

  rows.push(''); // Blank line
  rows.push(''); // Blank line

  // ==========================================
  // SECTION 3: HISTÓRICO DETALHADO DE BLOQUEIOS
  // ==========================================
  rows.push(escapeCSV('--- 2. HISTÓRICO DE INDISPONIBILIDADES E BLOQUEIOS DE CALENDÁRIO ---'));
  
  const blockHeaders = [
    'ID do Bloqueio',
    'Nome do Imóvel',
    'Localização',
    'Data de Início',
    'Data de Término',
    'Total de Noites',
    'Motivo / Tipo',
    'Observações / Notas',
    'Status Temporal',
    'Data de Criação do Registro',
  ];
  rows.push(blockHeaders.map(escapeCSV).join(';'));

  if (unavailabilities.length === 0) {
    rows.push(escapeCSV('Nenhum bloqueio ou indisponibilidade registrado até o momento.'));
  } else {
    // Sort blocks by start date descending
    const sortedBlocks = [...unavailabilities].sort((a, b) => b.startDate.localeCompare(a.startDate));

    sortedBlocks.forEach((u) => {
      const prop = properties.find((p) => p.id === u.propertyId);
      const propName = prop ? prop.name : `Imóvel #${u.propertyId}`;
      const propLocation = prop ? prop.location : 'Palmas, TO';
      const nightsCount = calculateDays(u.startDate, u.endDate);

      let temporalStatus = 'Concluído (Passado)';
      if (u.startDate <= todayStr && u.endDate >= todayStr) {
        temporalStatus = 'Em Andamento (Hoje)';
      } else if (u.startDate > todayStr) {
        temporalStatus = 'Agendado (Futuro)';
      }

      const row = [
        u.id,
        propName,
        propLocation,
        formatDateBR(u.startDate),
        formatDateBR(u.endDate),
        nightsCount,
        u.reason || 'Bloqueio Manual',
        u.notes || 'Sem observações adicionais',
        temporalStatus,
        formatDateBR(u.createdAt || todayStr),
      ];
      rows.push(row.map(escapeCSV).join(';'));
    });
  }

  // Combine rows with CRLF for standard CSV
  // Prepend UTF-8 Byte Order Mark (BOM) \uFEFF to ensure Excel opens accented characters seamlessly
  const csvContent = '\uFEFF' + rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const filename = `relatorio_cerrado_stay_${todayStr}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
