import { Property, PropertyUnavailability } from '../types';
import { BRAND_CONFIG } from '../config';

export interface GoogleSheetsConfig {
  webhookUrl: string;       // URL do Google Apps Script Webhook (POST)
  publishedCsvUrl: string;  // URL pública do CSV da Planilha Google (GET)
  autoSync: boolean;        // Se true, dispara sync a cada salvamento
  lastSyncDate?: string;
}

const GOOGLE_SHEETS_CONFIG_KEY = 'cerrado_google_sheets_config_v1';

/**
 * Retorna as configurações salvas da Planilha Google.
 */
export function getGoogleSheetsConfig(): GoogleSheetsConfig {
  let webhookUrl = (import.meta.env as any)?.VITE_GOOGLE_SHEETS_API_URL || '';
  let publishedCsvUrl = (import.meta.env as any)?.VITE_GOOGLE_SHEETS_FALLBACK_URL || BRAND_CONFIG.googleSheetsFallbackUrl || '';
  let autoSync = true;
  let lastSyncDate: string | undefined = undefined;

  try {
    const raw = localStorage.getItem(GOOGLE_SHEETS_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.webhookUrl) webhookUrl = parsed.webhookUrl;
      if (parsed.publishedCsvUrl) publishedCsvUrl = parsed.publishedCsvUrl;
      if (parsed.autoSync !== undefined) autoSync = parsed.autoSync;
      lastSyncDate = parsed.lastSyncDate;
    }
  } catch {}

  return {
    webhookUrl,
    publishedCsvUrl,
    autoSync,
    lastSyncDate,
  };
}

/**
 * Salva as configurações da Planilha Google.
 */
export function saveGoogleSheetsConfig(config: Partial<GoogleSheetsConfig>): GoogleSheetsConfig {
  const current = getGoogleSheetsConfig();
  const updated: GoogleSheetsConfig = { ...current, ...config };
  try {
    localStorage.setItem(GOOGLE_SHEETS_CONFIG_KEY, JSON.stringify(updated));
  } catch {}
  return updated;
}

/**
 * Gera e faz download de um arquivo CSV formatado exclusivamente para abrir
 * perfeitamente no Google Planilhas (Google Sheets) com colunas organizadas para a equipe.
 */
export function exportToGoogleSheetsCSV(
  properties: Property[],
  unavailabilities: PropertyUnavailability[] = []
): void {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const escapeCSV = (val: any) => {
    if (val === null || val === undefined) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows: string[] = [];

  // Cabeçalho da Planilha Google
  rows.push(escapeCSV('CERRADO STAY - BASE GERAL DE IMÓVEIS E BACKUP DO SISTEMA'));
  rows.push(`${escapeCSV('Data de Atualização:')};${escapeCSV(today.toLocaleDateString('pt-BR'))};${escapeCSV('Horário:')};${escapeCSV(today.toLocaleTimeString('pt-BR'))}`);
  rows.push(`${escapeCSV('Total de Imóveis:')};${escapeCSV(properties.length)};${escapeCSV('Bloqueios de Calendário:')};${escapeCSV(unavailabilities.length)}`);
  rows.push('');

  // Colunas da Planilha
  const headers = [
    'ID',
    'Nome do Imóvel',
    'Status',
    'Categorias',
    'Diária Base (R$)',
    'Taxa Limpeza (R$)',
    'Taxa Serviço (%)',
    'Capacidade Máx (Hóspedes)',
    'Quartos',
    'Camas',
    'Banheiros',
    'Localização',
    'Bairro',
    'Cidade',
    'UF',
    'Endereço',
    'Superhost',
    'Selo Exclusivo',
    'Avaliação (0-5)',
    'Total Avaliações',
    'Horário Check-in',
    'Horário Check-out',
    'Comodidades Principais',
    'Regras da Casa',
    'Foto Principal (Capa)',
    'Outras Fotos (URLs)',
    'Descrição Resumida',
    'Bloqueios Cadastrados'
  ];

  rows.push(headers.map(escapeCSV).join(';'));

  properties.forEach((p) => {
    const propBlocks = unavailabilities
      .filter((u) => u.propertyId === p.id)
      .map((u) => `${u.startDate} a ${u.endDate} (${u.reason || 'Bloqueio'})`)
      .join(' | ');

    const row = [
      p.id,
      p.name,
      p.status === 'inactive' ? 'Inativo (Oculto)' : 'Ativo (Publicado)',
      (p.category || []).join(', '),
      p.pricePerNight.toFixed(2).replace('.', ','),
      p.cleaningFee.toFixed(2).replace('.', ','),
      `${p.serviceFeePercentage || 10}%`,
      p.maxGuests,
      p.bedrooms,
      p.beds,
      p.bathrooms,
      p.location,
      p.neighborhood || '',
      p.city || 'Palmas',
      p.state || 'TO',
      p.address || '',
      p.isSuperhost ? 'Sim' : 'Não',
      p.badge || 'Padrão Cerrado Stay',
      p.rating ? p.rating.toFixed(2).replace('.', ',') : '5,00',
      p.reviewsCount || 0,
      p.checkInTime || '14:00',
      p.checkOutTime || '11:00',
      (p.amenities || []).join(', '),
      (p.houseRules || []).join('; '),
      p.coverImage || '',
      (p.images || []).join(' | '),
      p.description || '',
      propBlocks || 'Nenhum bloqueio registrado'
    ];

    rows.push(row.map(escapeCSV).join(';'));
  });

  // UTF-8 BOM (\uFEFF) garante que o Google Planilhas e o Excel abram os acentos perfeitamente
  const csvContent = '\uFEFF' + rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `cerrado_stay_planilha_google_${todayStr}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Envia os dados atuais para o Webhook do Google Apps Script configurado.
 */
export async function syncWithGoogleSheetsWebhook(
  properties: Property[],
  unavailabilities: PropertyUnavailability[] = []
): Promise<{ success: boolean; message: string }> {
  const config = getGoogleSheetsConfig();
  if (!config.webhookUrl) {
    return {
      success: false,
      message: 'Nenhuma URL de Webhook do Google Planilhas configurada. Configure na aba Configurações.',
    };
  }

  try {
    const payload = {
      action: 'SYNC_PROPERTIES',
      timestamp: new Date().toISOString(),
      propertiesCount: properties.length,
      properties: properties.map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        category: (p.category || []).join(', '),
        pricePerNight: p.pricePerNight,
        cleaningFee: p.cleaningFee,
        maxGuests: p.maxGuests,
        bedrooms: p.bedrooms,
        beds: p.beds,
        bathrooms: p.bathrooms,
        location: p.location,
        neighborhood: p.neighborhood,
        city: p.city,
        state: p.state,
        coverImage: p.coverImage,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        amenities: (p.amenities || []).join(', '),
      })),
      unavailabilities,
    };

    const res = await fetch(config.webhookUrl, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script Webhook costuma requerer no-cors em chamadas clientside
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    saveGoogleSheetsConfig({ lastSyncDate: new Date().toISOString() });

    return {
      success: true,
      message: 'Sincronização com o Google Planilhas enviada com sucesso!',
    };
  } catch (err: any) {
    console.error('Erro ao sincronizar com Google Sheets:', err);
    return {
      success: false,
      message: `Erro ao enviar dados para a planilha: ${err?.message || 'Falha de rede'}`,
    };
  }
}

/**
 * Script pronto para ser copiado no Google Apps Script da planilha da empresa.
 */
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `
/**
 * GOOGLE APPS SCRIPT - CERRADO STAY BACKUP
 * 
 * Como instalar em 1 minuto:
 * 1. Crie uma nova planilha no Google Planilhas (sheets.google.com).
 * 2. Clique no menu superior em: "Extensões" > "Apps Script".
 * 3. Apague qualquer código existente lá e cole todo este código.
 * 4. Clique no botão azul "Implantar" (Deploy) > "Nova implantação".
 * 5. Selecione o tipo "App da Web" (Web app).
 * 6. Em "Quem pode acessar" escolha: "Qualquer pessoa" (Anyone).
 * 7. Copie a "URL do app da Web" gerada e cole nas Configurações da Cerrado Stay!
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Imoveis") || ss.insertSheet("Imoveis");
    
    // Configurar cabeçalhos se estiver vazio
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ID", "Nome do Imóvel", "Status", "Diária (R$)", "Taxa Limpeza (R$)", 
        "Hóspedes", "Quartos", "Camas", "Banheiros", "Localização", "Cidade/UF", 
        "Capa (URL)", "Avaliação", "Última Sincronização"
      ]);
      sheet.getRange(1, 1, 1, 14).setFontWeight("bold").setBackground("#F4EFEA");
    }
    
    // Limpar linhas antigas e reescrever catálogo atualizado
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, 14).clearContent();
    }
    
    if (data.properties && data.properties.length > 0) {
      var rows = [];
      var syncTime = new Date().toLocaleString("pt-BR");
      
      for (var i = 0; i < data.properties.length; i++) {
        var p = data.properties[i];
        rows.push([
          p.id,
          p.name,
          p.status === "inactive" ? "Inativo" : "Ativo",
          p.pricePerNight,
          p.cleaningFee,
          p.maxGuests,
          p.bedrooms,
          p.beds,
          p.bathrooms,
          p.location,
          (p.city || "Palmas") + " - " + (p.state || "TO"),
          p.coverImage,
          p.rating,
          syncTime
        ]);
      }
      
      if (rows.length > 0) {
        sheet.getRange(2, 1, rows.length, 14).setValues(rows);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", count: data.properties.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Imoveis");
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }
    
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }
    
    var properties = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[0] && row[1]) {
        properties.push({
          id: String(row[0]),
          name: String(row[1]),
          slug: String(row[1]).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          status: String(row[2]).toLowerCase().indexOf("inativo") >= 0 ? "inactive" : "active",
          pricePerNight: Number(row[3]) || 500,
          cleaningFee: Number(row[4]) || 150,
          serviceFeePercentage: 10,
          maxGuests: Number(row[5]) || 4,
          bedrooms: Number(row[6]) || 2,
          beds: Number(row[7]) || 2,
          bathrooms: Number(row[8]) || 2,
          location: String(row[9]) || "Palmas - TO",
          neighborhood: String(row[9]) || "Palmas",
          city: "Palmas",
          state: "TO",
          address: String(row[9]) || "",
          coverImage: String(row[11]) || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
          images: [String(row[11]) || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85"],
          rating: Number(row[12]) || 5.0,
          reviewsCount: 12,
          badge: "Exclusivo Cerrado Stay",
          isSuperhost: true,
          amenities: ["Wi-Fi Fibra", "Ar-condicionado", "Piscina", "Cozinha Completa", "Estacionamento"],
          houseRules: ["Respeitar horário de silêncio após as 22h"],
          checkInTime: "14:00",
          checkOutTime: "11:00",
          category: ["casas", "apartamentos"],
          description: String(row[1]),
          longDescription: [String(row[1])],
          bookedDates: [],
          reviews: [],
          coordinates: { lat: -10.1837, lng: -48.3582 }
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify(properties))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`.trim();

/**
 * Normaliza qualquer URL da Planilha Google (link de compartilhamento ou CSV publicado)
 * para a URL correta de download dos dados.
 */
export function normalizeGoogleSheetsUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();

  // Se já for Google Apps Script Webhook (/exec) ou CSV direto
  if (trimmed.includes('/macros/s/') || trimmed.endsWith('.csv') || trimmed.includes('output=csv')) {
    return trimmed;
  }

  // Se for link comum do Google Sheets: https://docs.google.com/spreadsheets/d/{ID}/edit...
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
  }

  return trimmed;
}

/**
 * Baixa e converte dados da Planilha Google (seja via Apps Script Web App JSON ou CSV)
 * para alimentar os imóveis nos bastidores quando o Supabase estiver fora do ar.
 */
export async function fetchPropertiesFromGoogleSheetsCsv(rawUrl: string): Promise<Property[]> {
  if (!rawUrl) return [];
  const normalizedUrl = normalizeGoogleSheetsUrl(rawUrl);

  try {
    const res = await fetch(normalizedUrl);
    if (!res.ok) return [];

    const contentType = res.headers.get('content-type') || '';

    // Caso a resposta seja JSON direto (ex: Google Apps Script Web App)
    if (contentType.includes('application/json') || normalizedUrl.includes('/macros/s/')) {
      try {
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) {
          return json;
        }
      } catch {}
    }

    const text = await res.text();

    // Se o texto for JSON
    if (text.trim().startsWith('[') && text.trim().endsWith(']')) {
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {}
    }

    // Se for CSV
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) return [];

    const dataRows = lines.slice(1);
    const properties: Property[] = [];

    dataRows.forEach((rowStr, idx) => {
      const delimiter = rowStr.includes(';') ? ';' : ',';
      const cols = rowStr.split(delimiter).map((c) => c.replace(/^"|"$/g, '').trim());
      if (cols.length >= 5 && cols[1]) {
        const id = cols[0] || `prop-sheet-${idx + 1}`;
        const name = cols[1];
        const status = cols[2]?.toLowerCase().includes('inativo') ? 'inactive' : 'active';
        const pricePerNight = parseFloat(cols[4]?.replace(',', '.')) || 500;
        const cleaningFee = parseFloat(cols[5]?.replace(',', '.')) || 150;
        const maxGuests = parseInt(cols[7]) || 4;
        const bedrooms = parseInt(cols[8]) || 2;
        const beds = parseInt(cols[9]) || 2;
        const bathrooms = parseInt(cols[10]) || 2;
        const location = cols[11] || 'Palmas - TO';
        const coverImage = cols[24] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85';

        properties.push({
          id,
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          tagline: name,
          description: cols[26] || name,
          longDescription: [cols[26] || name],
          location,
          neighborhood: cols[12] || '',
          city: cols[13] || 'Palmas',
          state: cols[14] || 'TO',
          address: cols[15] || '',
          status,
          category: ['casas', 'apartamentos'],
          coverImage,
          images: [coverImage],
          pricePerNight,
          cleaningFee,
          serviceFeePercentage: 10,
          maxGuests,
          bedrooms,
          beds,
          bathrooms,
          rating: 4.9,
          reviewsCount: 15,
          badge: cols[17] || 'Exclusivo Cerrado Stay',
          isSuperhost: cols[16]?.toLowerCase() === 'sim',
          amenities: cols[22] ? cols[22].split(',').map((a) => a.trim()) : ['Wi-Fi', 'Ar-condicionado'],
          houseRules: ['Respeitar horário de silêncio após as 22h'],
          checkInTime: cols[20] || '14:00',
          checkOutTime: cols[21] || '11:00',
          bookedDates: [],
          reviews: [],
          coordinates: { lat: -10.1837, lng: -48.3582 },
          createdAt: new Date().toISOString(),
        });
      }
    });

    return properties;
  } catch (err) {
    console.warn('fetchPropertiesFromGoogleSheetsCsv error:', err);
    return [];
  }
}

