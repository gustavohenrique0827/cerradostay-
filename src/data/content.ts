import { MetricItem, FAQItem, TestimonialItem, TimelineStep } from '../types';

export const METRICS_DATA: MetricItem[] = [
  {
    id: 'properties',
    value: '100%',
    numericValue: 100,
    prefix: '',
    suffix: '%',
    label: 'Self Check-in Digital',
    description: 'Acesso autônomo e seguro 24 horas através de fechaduras eletrônicas inteligentes.'
  },
  {
    id: 'guests',
    value: '24/7',
    numericValue: 24,
    prefix: '',
    suffix: 'h',
    label: 'Suporte Concierge',
    description: 'Atendimento humanizado para qualquer necessidade antes e durante sua estadia.'
  },
  {
    id: 'rating',
    value: '0',
    numericValue: 0,
    prefix: '',
    suffix: '',
    label: 'Taxas Ocultas',
    description: 'Valores transparentes e sem cobranças surpresas no momento do check-out.'
  },
  {
    id: 'satisfaction',
    value: '400',
    numericValue: 400,
    prefix: '',
    suffix: ' fios',
    label: 'Padrão Hotel Boutique',
    description: 'Enxoval de alto padrão, ambientes climatizados e rigoroso protocolo de higiene.'
  }
];

export const TIMELINE_STEPS: TimelineStep[] = [
  {
    number: '01',
    title: 'Escolha seu imóvel em Palmas',
    description: 'Navegue pelo nosso portfólio de imóveis na Orla 14, Alphaville, Plano Diretor e Taquaruçu.',
    highlight: 'Fotos reais e informações detalhadas'
  },
  {
    number: '02',
    title: 'Selecione suas datas',
    description: 'Confira a disponibilidade em tempo real no nosso calendário interativo e escolha os dias da sua estadia.',
    highlight: 'Calendário sincronizado e dinâmico'
  },
  {
    number: '03',
    title: 'Finalize sua Reserva no WhatsApp',
    description: 'Nossa equipe confirma as datas em minutos, tira todas as suas dúvidas e finaliza a reserva e pagamento diretamente no WhatsApp oficial.',
    highlight: 'Atendimento ágil, humanizado e seguro'
  },
  {
    number: '04',
    title: 'Acesse com Fechadura Digital',
    description: 'Receba a senha individual da fechadura eletrônica, rede Wi-Fi e manual completo antes da chegada.',
    highlight: 'Self check-in 24 horas sem burocracia'
  },
  {
    number: '05',
    title: 'Aproveite sua estadia em Palmas',
    description: 'Desfrute de enxoval 400 fios, ar-condicionado de alta potência e suporte de concierge 24/7.',
    highlight: 'Concierge e suporte 24 horas'
  },
  {
    number: '06',
    title: 'Check-out com 1 clique',
    description: 'Finalize sua estadia no portal digital de check-out com checklist rápido e liberação instantânea.',
    highlight: 'Praticidade total na saída'
  }
];

export const GUEST_EXPERIENCE_PILLARS = [
  {
    id: 'conforto',
    icon: 'Sparkles',
    title: 'Climatização & Conforto',
    description: 'Ar-condicionado Inverter potente em todos os cômodos, colchões premium, enxoval 400 fios e ambientes preparados para o clima de Palmas.'
  },
  {
    id: 'praticidade',
    icon: 'KeyRound',
    title: 'Praticidade & Tecnologia',
    description: 'Self check-in 24h via fechadura eletrônica, Wi-Fi de alta velocidade e guias digitais interativos com dicas da capital.'
  },
  {
    id: 'seguranca',
    icon: 'ShieldCheck',
    title: 'Segurança & Limpeza Rigorosa',
    description: 'Higienização profissional com protocolo hoteleiro, vistorias técnicas e condomínios com portaria e segurança 24 horas.'
  },
  {
    id: 'suporte',
    icon: 'Headphones',
    title: 'Concierge Local 24/7',
    description: 'Uma equipe tocantinense apaixonada por hospitalidade pronta para indicar os melhores restaurantes, praias do lago e passeios.'
  }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [];

export const INSTAGRAM_GALLERY = [];

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Como faço uma reserva na Cerrado Stay?',
    answer: 'É muito simples: escolha o imóvel desejado em Palmas, selecione suas datas de check-in e check-out no calendário e clique em "Reservar pelo WhatsApp". Nossa equipe confirma a disponibilidade em tempo real e combina os detalhes da sua estadia e pagamento diretamente com você, de forma rápida, humanizada e segura.',
    category: 'reserva'
  },
  {
    id: 'faq-2',
    question: 'Posso escolher o horário de check-in?',
    answer: 'O horário padrão de check-in é a partir das 15:00h (ou 14:00h para estúdios). Caso necessite de early check-in (entrada antecipada), basta solicitar à nossa equipe com antecedência para verificarmos a disponibilidade da equipe de governança.',
    category: 'checkin'
  },
  {
    id: 'faq-3',
    question: 'Como funciona o Self Check-in com Fechadura Digital?',
    answer: 'Todos os imóveis da Cerrado Stay em Palmas contam com tecnologia de fechaduras eletrônicas inteligentes. Assim que a reserva é confirmada, você recebe a senha exclusiva de acesso ao imóvel, além das orientações do condomínio e rede Wi-Fi.',
    category: 'checkin'
  },
  {
    id: 'faq-4',
    question: 'Como funciona o check-out digital?',
    answer: 'O check-out deve ser realizado até as 11:00h. Você pode utilizar nossa ferramenta de "Check-out Digital" no site para conferir o checklist rápido de saída e confirmar com apenas 1 clique ao trancar a porta.',
    category: 'checkin'
  },
  {
    id: 'faq-5',
    question: 'Os imóveis possuem ar-condicionado potente para o clima de Palmas?',
    answer: 'Sim! Sabemos da importância da climatização em Palmas. Todos os imóveis contam com aparelhos de ar-condicionado Split Inverter modernos e revisados em todos os dormitórios e salas, garantindo conforto térmico absoluto.',
    category: 'estadia'
  },
  {
    id: 'faq-6',
    question: 'Posso cancelar ou alterar as datas da minha reserva?',
    answer: 'Sim. Oferecemos política de cancelamento transparente. Cancelamentos solicitados com até 7 dias de antecedência ao check-in recebem reembolso integral ou crédito para reagendamento em qualquer outro imóvel do nosso portfólio em Palmas.',
    category: 'reserva'
  },
  {
    id: 'faq-7',
    question: 'Posso levar animais de estimação (Pets)?',
    answer: 'Diversos dos nossos imóveis possuem a marcação "Pet Friendly". Ao navegar pela vitrine, você pode conferir as comodidades de cada imóvel para animais de estimação.',
    category: 'estadia'
  },
  {
    id: 'faq-8',
    question: 'Existe suporte de concierge durante a minha estadia em Palmas?',
    answer: 'Com certeza! Contamos com equipe de Concierge através do nosso WhatsApp oficial para auxiliar com qualquer dúvida, manutenção ou recomendações dos melhores restaurantes, praias do lago e passeios em Palmas e Jalapão.',
    category: 'estadia'
  },
  {
    id: 'faq-9',
    question: 'Como funciona o pagamento da reserva?',
    answer: 'Não realizamos cobrança direta automatizada pelo site. Todo o pagamento (seja via PIX, transferência bancária ou cartão) é combinado e finalizado diretamente com nosso concierge de atendimento no WhatsApp oficial após a confirmação das datas.',
    category: 'pagamento'
  }
];

export const DEMO_BOOKINGS_CHECKOUT: Array<{
  code: string;
  guestName: string;
  propertyName: string;
  checkOutDate: string;
  propertyLocation: string;
  passcode: string;
  wifiName: string;
  wifiPass: string;
}> = [];

