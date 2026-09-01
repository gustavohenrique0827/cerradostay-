import { jsPDF } from 'jspdf';
import { Property, PropertyUnavailability } from '../types';

/**
 * Generates and downloads a professional PDF owner report consolidating
 * occupancy metrics, active property listings, and reservation trends.
 */
export const exportAdminDashboardPDF = (
  properties: Property[],
  unavailabilities: PropertyUnavailability[]
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

  // Color Palette (Cerrado Stays Luxury Theme)
  const primaryColor = [0, 33, 71]; // #002147 (Navy)
  const accentColor = [197, 160, 89]; // #C5A059 (Gold)
  const neutralDark = [33, 37, 41]; // #212529
  const neutralLight = [248, 249, 250]; // #F8F9FA
  const grayLine = [222, 226, 230]; // #DEE2E6

  let currentY = 15;

  // --- HEADER ---
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('CERRADO STAY - RELATÓRIO EXECUTIVO DE GESTÃO', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(220, 220, 220);
  doc.text(`Emitido em: ${formattedDate} às ${today.toLocaleTimeString('pt-BR')} | Palmas - TO`, 14, 20);

  currentY = 36;

  // --- SUMMARY STATS BOXES ---
  const activeCount = properties.filter((p) => p.status !== 'inactive').length;
  const currentYear = today.getFullYear().toString();
  const currentMonthNum = (today.getMonth() + 1).toString().padStart(2, '0');
  
  const bookingsThisMonth = unavailabilities.filter((u) => {
    if (!u.startDate) return false;
    const parts = u.startDate.split('-');
    return parts[0] === currentYear && parts[1] === currentMonthNum;
  }).length;

  const occupiedTodayCount = properties.filter((p) =>
    unavailabilities.some((u) => u.propertyId === p.id && u.startDate <= todayStr && u.endDate >= todayStr)
  ).length;

  const averageOccupancy = activeCount > 0 ? Math.round((occupiedTodayCount / activeCount) * 100) : 0;

  doc.setFillColor(neutralLight[0], neutralLight[1], neutralLight[2]);
  doc.setDrawColor(grayLine[0], grayLine[1], grayLine[2]);
  doc.roundedRect(14, currentY, 182, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(neutralDark[0], neutralDark[1], neutralDark[2]);

  const colWidth = 45;
  const startX = 18;

  // Stat 1
  doc.text('TOTAL DE IMÓVEIS', startX, currentY + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(String(properties.length), startX, currentY + 16);

  // Stat 2
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(neutralDark[0], neutralDark[1], neutralDark[2]);
  doc.text('IMÓVEIS ATIVOS', startX + colWidth, currentY + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(String(activeCount), startX + colWidth, currentY + 16);

  // Stat 3
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(neutralDark[0], neutralDark[1], neutralDark[2]);
  doc.text('RESERVAS (MÊS)', startX + colWidth * 2, currentY + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(String(bookingsThisMonth), startX + colWidth * 2, currentY + 16);

  // Stat 4
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(neutralDark[0], neutralDark[1], neutralDark[2]);
  doc.text('OCUPAÇÃO HOJE', startX + colWidth * 3, currentY + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(`${averageOccupancy}%`, startX + colWidth * 3, currentY + 16);

  currentY += 30;

  // --- SECTION 1: PROPERTIES TABLE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('1. PORTFÓLIO DE IMÓVEIS CADASTRADOS', 14, currentY);
  currentY += 6;

  // Table header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(14, currentY, 182, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Nome do Imóvel', 18, currentY + 5.5);
  doc.text('Localização', 90, currentY + 5.5);
  doc.text('Status', 135, currentY + 5.5);
  doc.text('Diária (R$)', 165, currentY + 5.5);
  currentY += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(neutralDark[0], neutralDark[1], neutralDark[2]);

  if (properties.length === 0) {
    doc.setFillColor(255, 255, 255);
    doc.rect(14, currentY, 182, 8, 'F');
    doc.text('Nenhum imóvel cadastrado no momento.', 18, currentY + 5.5);
    currentY += 8;
  } else {
    properties.forEach((p, idx) => {
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }
      if (idx % 2 === 1) {
        doc.setFillColor(245, 247, 250);
        doc.rect(14, currentY, 182, 7, 'F');
      }
      doc.text(String(p.name || '').substring(0, 42), 18, currentY + 5);
      doc.text(String(p.location || 'Palmas').substring(0, 24), 90, currentY + 5);
      doc.text(p.status === 'inactive' ? 'Inativo' : 'Ativo', 135, currentY + 5);
      doc.text(`R$ ${Number(p.pricePerNight || 0).toFixed(2)}`, 165, currentY + 5);
      currentY += 7;
    });
  }

  currentY += 10;

  // --- SECTION 2: RECENT UNAVAILABILITIES / RESERVATIONS ---
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('2. HISTÓRICO RECENTE DE RESERVAS E BLOQUEIOS', 14, currentY);
  currentY += 6;

  // Table header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(14, currentY, 182, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Imóvel', 18, currentY + 5.5);
  doc.text('Início', 95, currentY + 5.5);
  doc.text('Término', 125, currentY + 5.5);
  doc.text('Motivo / Status', 155, currentY + 5.5);
  currentY += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(neutralDark[0], neutralDark[1], neutralDark[2]);

  if (unavailabilities.length === 0) {
    doc.setFillColor(255, 255, 255);
    doc.rect(14, currentY, 182, 8, 'F');
    doc.text('Nenhum bloqueio ou reserva registrada.', 18, currentY + 5.5);
    currentY += 8;
  } else {
    const sorted = [...unavailabilities].sort((a, b) => b.startDate.localeCompare(a.startDate)).slice(0, 15);
    sorted.forEach((u, idx) => {
      if (currentY > 275) {
        doc.addPage();
        currentY = 20;
      }
      if (idx % 2 === 1) {
        doc.setFillColor(245, 247, 250);
        doc.rect(14, currentY, 182, 7, 'F');
      }
      const prop = properties.find((p) => p.id === u.propertyId);
      const pName = prop ? prop.name : `Imóvel #${u.propertyId}`;
      const formatBrDate = (dt: string) => {
        if (!dt) return '';
        const pts = dt.split('-');
        return pts.length === 3 ? `${pts[2]}/${pts[1]}/${pts[0]}` : dt;
      };

      doc.text(String(pName).substring(0, 38), 18, currentY + 5);
      doc.text(formatBrDate(u.startDate), 95, currentY + 5);
      doc.text(formatBrDate(u.endDate), 125, currentY + 5);
      doc.text(String(u.reason || 'Bloqueio Manual').substring(0, 20), 155, currentY + 5);
      currentY += 7;
    });
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Cerrado Stay - Palmas/TO | Relatório Gerencial | Página ${i} de ${pageCount}`,
      14,
      290
    );
  }

  // Save PDF
  const filename = `relatorio_gerencial_cerrado_${todayStr}.pdf`;
  doc.save(filename);
};
