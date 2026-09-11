/**
 * Configurações Centrais da Cerrado Stay
 * Modifique aqui os dados de contato, WhatsApp e informações da empresa.
 */
export const BRAND_CONFIG = {
  name: 'Cerrado Stay',
  tagline: 'Sua Estadia Boutique em Palmas',
  description: 'Portfólio exclusivo de imóveis por temporada com padrão de excelência em Palmas/TO. Transformamos estadias em experiências memoráveis com atendimento personalizado e conforto absoluto.',
  
  // WhatsApp oficial (apenas números para o link)
  whatsappNumber: '5563992003020',
  whatsappDisplay: '+55 (63) 99200-3020',
  defaultWhatsappMessage: 'Olá! Gostaria de saber mais sobre as acomodações e fazer uma reserva na Cerrado Stay.',
  
  // Contato
  email: 'contato@cerradostay.com.br',
  reservasEmail: 'reservas@cerradostay.com.br',
  phoneDisplay: '+55 (63) 99200-3020',
  
  // Localização Principal
  address: 'Palmas',
  city: 'Palmas',
  state: 'TO',
  country: 'Brasil',
  
  // Redes Sociais
  instagram: 'https://www.instagram.com/cerrado.stay/?hl=pt-br',
  instagramHandle: '@cerrado.stay',
  airbnbProfile: 'https://airbnb.com',
  bookingProfile: 'https://booking.com',
  
  // Regras operacionais padrão
  defaultCheckIn: '14:00',
  defaultCheckOut: '11:00',
  serviceFeePercent: 0.10, // 10% taxa de serviço da plataforma
  
  // URL de Contingência do Google Planilhas (Fallback invisível para quando o Supabase estiver fora do ar)
  googleSheetsFallbackUrl: (import.meta.env as any)?.VITE_GOOGLE_SHEETS_FALLBACK_URL || '',
  
  // Links de navegação
  navLinks: [
    { label: 'Início', href: '#hero' },
    { label: 'Acomodações', href: '#imoveis' },
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'Check-out Digital', href: '#checkout-digital' },
    { label: 'Experiência', href: '#sobre' },
    { label: 'Depoimentos', href: '#avaliacoes' },
    { label: 'FAQ', href: '#faq' },
  ]
};

export function getWhatsAppUrl(customMessage?: string): string {
  const text = encodeURIComponent(customMessage || BRAND_CONFIG.defaultWhatsappMessage);
  return `https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${text}`;
}

export function getPropertyWhatsAppBookingUrl(params: {
  propertyName: string;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  adults?: number;
  childrenCount?: number;
  guests?: number;
  totalAmount?: number;
  guestName?: string;
  guestPhone?: string;
  specialRequests?: string;
  bookingCode?: string;
}): string {
  const lines: string[] = [
    'Olá equipe Cerrado Stay! Gostaria de finalizar a reserva para o seguinte imóvel em Palmas:\n',
    `🏠 *Imóvel:* ${params.propertyName}`,
  ];

  if (params.checkIn && params.checkOut && params.checkIn !== 'A definir') {
    const formattedIn = params.checkIn.includes('-') ? params.checkIn.split('-').reverse().join('/') : params.checkIn;
    const formattedOut = params.checkOut.includes('-') ? params.checkOut.split('-').reverse().join('/') : params.checkOut;
    const nightsStr = params.nights ? ` (${params.nights} ${params.nights === 1 ? 'noite' : 'noites'})` : '';
    lines.push(`📅 *Período:* ${formattedIn} até ${formattedOut}${nightsStr}`);
  }

  const totalPax = params.guests || ((params.adults || 1) + (params.childrenCount || 0));
  if (totalPax) {
    const adultsStr = params.adults ? `${params.adults} ${params.adults === 1 ? 'adulto' : 'adultos'}` : `${totalPax} pessoa(s)`;
    const childrenStr = params.childrenCount && params.childrenCount > 0 ? `, ${params.childrenCount} ${params.childrenCount === 1 ? 'criança' : 'crianças'}` : '';
    lines.push(`👥 *Hóspedes:* ${adultsStr}${childrenStr}`);
  }

  if (params.totalAmount && params.totalAmount > 0) {
    lines.push(`💰 *Valor Total Estimado:* R$ ${params.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  }

  if (params.guestName && params.guestName.trim()) {
    lines.push(`👤 *Hóspede Principal:* ${params.guestName.trim()}`);
  }

  if (params.guestPhone && params.guestPhone.trim()) {
    lines.push(`📱 *WhatsApp:* ${params.guestPhone.trim()}`);
  }

  if (params.specialRequests && params.specialRequests.trim()) {
    lines.push(`💬 *Observações:* ${params.specialRequests.trim()}`);
  }

  if (params.bookingCode) {
    lines.push(`🔖 *Ref. Solicitação:* ${params.bookingCode}`);
  }

  lines.push('\nPoderiam confirmar a disponibilidade para essas datas e me orientar para concluirmos a reserva?');

  const message = lines.join('\n');
  return `https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
