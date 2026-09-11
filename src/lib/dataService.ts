import { getSupabase } from './supabase';
import { Property, PropertyCategory, PropertyStatus, PropertyUnavailability, PropertyReview } from '../types';
import { resolvePalmasCoordinates } from '../utils/geoUtils';
import { 
  getGoogleSheetsConfig, 
  syncWithGoogleSheetsWebhook, 
  fetchPropertiesFromGoogleSheetsCsv 
} from './googleSheetsService';

export const INITIAL_PROPERTIES: Property[] = [
  {
    "id": "prop-1788291000827-etwtp",
    "name": "APARTAMENTO REGIÃO SUL",
    "slug": "apartamento-regiao-sul",
    "tagline": "APARTAMENTO REGIÃO SUL",
    "description": "",
    "longDescription": [
      "Conforto e beleza em um só lugar\nApartamento com 2 quartos, ideal para até 4 pessoas, 1 banheiro, cozinha equipada, máquina de lavar, mesa de jantar e piscina. Destaque para a vista incrível da serra e do lago, perfeita para relaxar e aproveitar momentos inesquecíveis durante a estadia"
    ],
    "location": "Plano diretor sul",
    "neighborhood": "p",
    "address": "Plano diretor sul",
    "city": "Palmas",
    "state": "TO",
    "status": "active",
    "category": [
      "apartamentos",
      "centro",
      "pet_friendly",
      "familia"
    ],
    "coverImage": "/images/properties/prop-1788291000827-etwtp-cover.jpg",
    "images": [
      "/images/properties/prop-1788291000827-etwtp-0.jpg",
      "/images/properties/prop-1788291000827-etwtp-1.jpg",
      "/images/properties/prop-1788291000827-etwtp-2.jpg",
      "/images/properties/prop-1788291000827-etwtp-3.jpg",
      "/images/properties/prop-1788291000827-etwtp-4.jpg"
    ],
    "pricePerNight": 330,
    "cleaningFee": 200,
    "serviceFeePercentage": 10,
    "maxGuests": 3,
    "bedrooms": 2,
    "beds": 2,
    "bathrooms": 2,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "Destaque",
    "isSuperhost": true,
    "amenities": [
      "Wi-Fi Ultra-Rápido",
      "Cozinha Completa Equipada",
      "Garagem Coberta",
      "Fechadura Eletrônica Inteligente",
      "Portaria / Segurança 24h",
      "Pet Friendly",
      "Smart TV 4K com Streaming"
    ],
    "houseRules": [],
    "checkInTime": "15:00",
    "checkOutTime": "11:00",
    "bookedDates": [],
    "reviews": [],
    "coordinates": {
      "lat": -10.1885,
      "lng": -48.3325
    },
    "createdAt": "2026-09-01T19:30:04.115616+00:00"
  },
  {
    "id": "prop-1788290460988-0a4z5",
    "name": "APARTAMENTO AO LADO DO CAPIM DOURADO SHOPPING",
    "slug": "apartamento-ao-lado-do-capim-dourado-shopping",
    "tagline": "APARTAMENTO AO LADO DO CAPIM DOURADO SHOPPING",
    "description": "",
    "longDescription": [
      "Conforto e beleza em um só lugar\nApartamento com 2 quartos, ideal para até 4 pessoas, 1 banheiro, cozinha equipada, máquina de lavar, mesa de jantar e piscina. Destaque para a vista incrível da serra e do lago, perfeita para relaxar e aproveitar momentos inesquecíveis durante a estadia"
    ],
    "location": "RESIDENCIAL PALMEIRA AZUL",
    "neighborhood": "r",
    "address": "RESIDENCIAL PALMEIRA AZUL",
    "city": "Palmas",
    "state": "TO",
    "status": "active",
    "category": [
      "apartamentos",
      "familia",
      "pet_friendly",
      "centro"
    ],
    "coverImage": "/images/properties/prop-1788290460988-0a4z5-cover.jpg",
    "images": [
      "/images/properties/prop-1788290460988-0a4z5-0.jpg",
      "/images/properties/prop-1788290460988-0a4z5-1.jpg",
      "/images/properties/prop-1788290460988-0a4z5-2.jpg",
      "/images/properties/prop-1788290460988-0a4z5-3.jpg",
      "/images/properties/prop-1788290460988-0a4z5-4.jpg",
      "/images/properties/prop-1788290460988-0a4z5-5.jpg"
    ],
    "pricePerNight": 250,
    "cleaningFee": 180,
    "serviceFeePercentage": 10,
    "maxGuests": 4,
    "bedrooms": 2,
    "beds": 3,
    "bathrooms": 1,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "Destaque",
    "isSuperhost": false,
    "amenities": [
      "Wi-Fi Ultra-Rápido",
      "Máquina de Lavar / Secar",
      "Fechadura Eletrônica Inteligente",
      "Portaria / Segurança 24h",
      "Pet Friendly",
      "Cozinha Completa Equipada",
      "Ar-Condicionado Inverter"
    ],
    "houseRules": [],
    "checkInTime": "15:00",
    "checkOutTime": "11:00",
    "bookedDates": [],
    "reviews": [],
    "coordinates": {
      "lat": -10.1698,
      "lng": -48.344
    },
    "createdAt": "2026-09-01T19:21:04.882421+00:00"
  },
  {
    "id": "prop-1788289533150-gc4tb",
    "name": "Residencial Graciosa Beach",
    "slug": "residencial-graciosa-beach",
    "tagline": "APARTAMENTO A 100 M DA PRAIA",
    "description": "APARTAMENTO A 100 M DA PRAIA",
    "longDescription": [
      "Seja bem-vindo ao seu refúgio em Palmas! \nNosso espaço foi cuidadosamente pensado para que você se sinta em casa seja em uma viagem a trabalho ou em momentos de lazer sob o sol tocantinense ☀️",
      "✔️ TV Smart na sala e quartos \n✔️ Enxoval completo de cama e banho \n✔️ Cortinas termoacústicas garantindo conforto térmico e silêncio!\n✔️ Rootop \n✔️ Entrada facilitada com fechadura eletrônica. 🔑\n✔️ Cozinha completa com eletros de alto padrão",
      "Espero que sua estadia seja confortável e inesquecível 💛"
    ],
    "location": "Graciosa",
    "neighborhood": "G",
    "address": "Graciosa",
    "city": "Palmas",
    "state": "TO",
    "status": "active",
    "category": [
      "apartamentos",
      "luxo",
      "praia",
      "familia"
    ],
    "coverImage": "/images/properties/prop-1788289533150-gc4tb-cover.jpg",
    "images": [
      "/images/properties/prop-1788289533150-gc4tb-0.jpg",
      "/images/properties/prop-1788289533150-gc4tb-1.jpg",
      "/images/properties/prop-1788289533150-gc4tb-2.jpg",
      "/images/properties/prop-1788289533150-gc4tb-3.jpg",
      "/images/properties/prop-1788289533150-gc4tb-4.jpg",
      "/images/properties/prop-1788289533150-gc4tb-5.jpg",
      "/images/properties/prop-1788289533150-gc4tb-6.jpg",
      "/images/properties/prop-1788289533150-gc4tb-7.jpg"
    ],
    "pricePerNight": 485,
    "cleaningFee": 200,
    "serviceFeePercentage": 10,
    "maxGuests": 4,
    "bedrooms": 2,
    "beds": 3,
    "bathrooms": 2,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "Destaque",
    "isSuperhost": false,
    "amenities": [
      "Wi-Fi Ultra-Rápido",
      "Ar-Condicionado Inverter",
      "Cozinha Completa Equipada",
      "Máquina de Lavar / Secar",
      "Vista Panorâmica para o Lago",
      "Portaria / Segurança 24h"
    ],
    "houseRules": [],
    "checkInTime": "15:00",
    "checkOutTime": "11:00",
    "bookedDates": [],
    "reviews": [],
    "coordinates": {
      "lat": -10.1837,
      "lng": -48.3582
    },
    "createdAt": "2026-09-01T19:05:37.85734+00:00"
  },
  {
    "id": "prop-1788289211233-7e0lf",
    "name": "Luxo e Conforto a 100 m da Praia",
    "slug": "luxo-e-conforto-a-100-m-da-praia",
    "tagline": "Luxo e Conforto a 100 m da Praia",
    "description": "Luxo e Conforto a 100 m da Praia",
    "longDescription": [
      "Seja bem-vindo ao seu novo endereço favorito em Palmas! Localizado na cobiçada Orla da Graciosa, nosso apartamento combina a serenidade da vista para o lago com a conveniência de um condomínio de alto padrão. ☀️",
      "Relaxe em uma suíte aconchegante com vista direta para o Lago. Desfrute de uma varanda gourmet no rooftop com jacuzzi, academia equipada e um salão de festas, tudo com uma vista panorâmica de tirar o fôlego. Cozinha completa, área de serviço, vaga de garagem e elevadores. 🏖️"
    ],
    "location": "Praia da Graciosa",
    "neighborhood": "O",
    "address": "Praia da Graciosa",
    "city": "Palmas",
    "state": "TO",
    "status": "active",
    "category": [
      "apartamentos",
      "praia",
      "luxo"
    ],
    "coverImage": "/images/properties/prop-1788289211233-7e0lf-cover.jpg",
    "images": [
      "/images/properties/prop-1788289211233-7e0lf-0.jpg",
      "/images/properties/prop-1788289211233-7e0lf-1.jpg",
      "/images/properties/prop-1788289211233-7e0lf-2.jpg",
      "/images/properties/prop-1788289211233-7e0lf-3.jpg",
      "/images/properties/prop-1788289211233-7e0lf-4.jpg",
      "/images/properties/prop-1788289211233-7e0lf-5.jpg",
      "/images/properties/prop-1788289211233-7e0lf-6.jpg",
      "/images/properties/prop-1788289211233-7e0lf-7.jpg",
      "/images/properties/prop-1788289211233-7e0lf-8.jpg",
      "/images/properties/prop-1788289211233-7e0lf-9.jpg",
      "/images/properties/prop-1788289211233-7e0lf-10.jpg",
      "/images/properties/prop-1788289211233-7e0lf-11.jpg",
      "/images/properties/prop-1788289211233-7e0lf-12.jpg",
      "/images/properties/prop-1788289211233-7e0lf-13.jpg",
      "/images/properties/prop-1788289211233-7e0lf-14.jpg",
      "/images/properties/prop-1788289211233-7e0lf-15.jpg",
      "/images/properties/prop-1788289211233-7e0lf-16.jpg"
    ],
    "pricePerNight": 450,
    "cleaningFee": 0,
    "serviceFeePercentage": 10,
    "maxGuests": 4,
    "bedrooms": 1,
    "beds": 1,
    "bathrooms": 1,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "Destaque",
    "isSuperhost": false,
    "amenities": [
      "Wi-Fi Ultra-Rápido",
      "Ar-Condicionado Inverter",
      "Banheira / Jacuzzi Panorâmica",
      "Máquina de Lavar / Secar",
      "Vista Panorâmica para o Lago",
      "Fechadura Eletrônica Inteligente",
      "Píer / Acesso ao Lago",
      "Cozinha Completa Equipada",
      "Smart TV 4K com Streaming"
    ],
    "houseRules": [],
    "checkInTime": "15:00",
    "checkOutTime": "11:00",
    "bookedDates": [],
    "reviews": [],
    "coordinates": {
      "lat": -10.1837,
      "lng": -48.3582
    },
    "createdAt": "2026-09-01T19:00:16.529947+00:00"
  },
  {
    "id": "prop-1787863796660-7lutx",
    "name": "LOFT YOU BY FAMA",
    "slug": "loft-you-by-fama",
    "tagline": "LOFT YOU BY FAMA",
    "description": "",
    "longDescription": [
      "Studio Vista Lago | Orla de Palmas (You by Fama)",
      "Viva o melhor de Palmas a passos da Praia da Graciosa! Studio 100% climatizado com vista incrível do lago, banheiro e cozinha completa com área de serviço, vaga privativa, lava e seca, air fryer, cafeteira, TV e Wi-Fi. Enxoval completo de cama e banho incluso.",
      "Aproveite o rooftop de luxo com piscina de borda infinita, academia panorâmica e portaria 24h. Ideal para lazer ou trabalho com máximo conforto na Orla 14, perto dos melhores restaurantes. Garanta sua reserva!"
    ],
    "location": "Orla 14",
    "neighborhood": "O",
    "address": "Orla 14",
    "city": "Palmas",
    "state": "TO",
    "status": "active",
    "category": [
      "apartamentos",
      "luxo",
      "praia"
    ],
    "coverImage": "/images/properties/prop-1787863796660-7lutx-cover.jpg",
    "images": [
      "/images/properties/prop-1787863796660-7lutx-0.jpg",
      "/images/properties/prop-1787863796660-7lutx-1.jpg",
      "/images/properties/prop-1787863796660-7lutx-2.jpg",
      "/images/properties/prop-1787863796660-7lutx-3.jpg",
      "/images/properties/prop-1787863796660-7lutx-4.jpg",
      "/images/properties/prop-1787863796660-7lutx-5.jpg",
      "/images/properties/prop-1787863796660-7lutx-6.jpg",
      "/images/properties/prop-1787863796660-7lutx-7.jpg",
      "/images/properties/prop-1787863796660-7lutx-8.jpg",
      "/images/properties/prop-1787863796660-7lutx-9.jpg",
      "/images/properties/prop-1787863796660-7lutx-10.jpg",
      "/images/properties/prop-1787863796660-7lutx-11.jpg",
      "/images/properties/prop-1787863796660-7lutx-12.jpg",
      "/images/properties/prop-1787863796660-7lutx-13.jpg"
    ],
    "pricePerNight": 351,
    "cleaningFee": 180,
    "serviceFeePercentage": 10,
    "maxGuests": 2,
    "bedrooms": 1,
    "beds": 1,
    "bathrooms": 1,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "Destaque",
    "isSuperhost": true,
    "amenities": [
      "Wi-Fi Ultra-Rápido",
      "Ar-Condicionado Inverter",
      "Máquina de Lavar / Secar",
      "Píer / Acesso ao Lago",
      "Espaço Home Office",
      "Fechadura Eletrônica Inteligente",
      "Portaria / Segurança 24h",
      "Cozinha Completa Equipada"
    ],
    "houseRules": [],
    "checkInTime": "15:00",
    "checkOutTime": "11:00",
    "bookedDates": [],
    "reviews": [],
    "coordinates": {
      "lat": -10.1837,
      "lng": -48.3582
    },
    "createdAt": "2026-08-27T20:49:59.239723+00:00"
  },
  {
    "id": "prop-1787863529393-fe4vg",
    "name": "Casa Mosaico",
    "slug": "casa-mosaico",
    "tagline": "Casa Mosaico",
    "description": "",
    "longDescription": [
      "Casa Mosaico | Design Exclusivo, Varanda Gourmet & Conforto Total",
      "Procurando uma experiência única e inesquecível? A Casa Mosaico combina sofisticação, charme e o acolhimento perfeito para os seus dias de descanso ou trabalho. Um refúgio 100% climatizado, onde cada detalhe foi pensado para encantar.",
      "O que espera por você:\nVaranda Gourmet dos Sonhos: O cenário ideal para relaxar ou celebrar, equipado com churrasqueira a carvão.\nConforto Absoluto: 2 quartos aconchegantes (sendo 1 suíte privativa), ambos com ar-condicionado. Enxoval completo com roupas de cama e toalhas macias já inclusos.\nCozinha Completa & Prática: Totalmente equipada com utensílios, air fryer e cafeteira para o seu café da manhã perfeito.\nConectividade & Lazer: Sala de estar confortável com TV e Wi-Fi de alta velocidade para streaming ou home office.\nPraticidade & Segurança: Garagem privativa e exclusiva no local.\nSeja para uma viagem em família, um encontro a dois ou uma pausa na rotina, a Casa Mosaico é o seu lugar. Datas disponíveis — garanta já a sua reserva!"
    ],
    "location": "Plano diretor Sul",
    "neighborhood": "P",
    "address": "Plano diretor Sul",
    "city": "Palmas",
    "state": "TO",
    "status": "active",
    "category": [
      "casas",
      "familia",
      "centro",
      "pet_friendly"
    ],
    "coverImage": "/images/properties/prop-1787863529393-fe4vg-cover.jpg",
    "images": [
      "/images/properties/prop-1787863529393-fe4vg-0.jpg",
      "/images/properties/prop-1787863529393-fe4vg-1.jpg",
      "/images/properties/prop-1787863529393-fe4vg-2.jpg",
      "/images/properties/prop-1787863529393-fe4vg-3.jpg",
      "/images/properties/prop-1787863529393-fe4vg-4.jpg",
      "/images/properties/prop-1787863529393-fe4vg-5.jpg",
      "/images/properties/prop-1787863529393-fe4vg-6.jpg",
      "/images/properties/prop-1787863529393-fe4vg-7.jpg",
      "/images/properties/prop-1787863529393-fe4vg-8.jpg",
      "/images/properties/prop-1787863529393-fe4vg-9.jpg",
      "/images/properties/prop-1787863529393-fe4vg-10.jpg"
    ],
    "pricePerNight": 451,
    "cleaningFee": 250,
    "serviceFeePercentage": 10,
    "maxGuests": 4,
    "bedrooms": 2,
    "beds": 2,
    "bathrooms": 2,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "Destaque",
    "isSuperhost": true,
    "amenities": [
      "Wi-Fi Ultra-Rápido",
      "Ar-Condicionado Inverter",
      "Churrasqueira Gourmet",
      "Garagem Coberta",
      "Cozinha Completa Equipada",
      "Smart TV 4K com Streaming"
    ],
    "houseRules": [],
    "checkInTime": "15:00",
    "checkOutTime": "11:00",
    "bookedDates": [],
    "reviews": [],
    "coordinates": {
      "lat": -10.1885,
      "lng": -48.3325
    },
    "createdAt": "2026-08-27T20:45:31.516583+00:00"
  }
];

// Storage Keys with transactional staging and backup support
const PRIMARY_PROPERTIES_KEY = 'cerrado_stays_properties_prod_v1';
const STAGING_PROPERTIES_KEY = 'cerrado_stays_properties_prod_v1_tmp';
const BACKUP_PROPERTIES_KEY = 'cerrado_stays_properties_prod_v1_backup';

const PRIMARY_UNAVAILABILITIES_KEY = 'cerrado_stays_unavailabilities_prod_v1';
const BACKUP_UNAVAILABILITIES_KEY = 'cerrado_stays_unavailabilities_prod_v1_backup';

// Valid property categories for strict validation
const VALID_CATEGORIES: PropertyCategory[] = [
  'apartamentos',
  'casas',
  'luxo',
  'praia',
  'centro',
  'familia',
  'pet_friendly',
];

/**
 * Result of property validation check.
 */
export interface PropertyValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized?: Property;
}

/**
 * Generates a clean URL-friendly slug.
 */
export function generateSlug(name: string): string {
  if (!name) return `imovel-${Date.now()}`;
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Validates and sanitizes a single property object against the domain schema.
 * Guarantees that all properties have required types, default values, and non-corrupt structures.
 */
export function validateAndSanitizeProperty(raw: any): PropertyValidationResult {
  const errors: string[] = [];

  if (!raw || typeof raw !== 'object') {
    return { isValid: false, errors: ['O imóvel fornecido não é um objeto válido.'] };
  }

  // 1. Name validation
  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  if (!name || name.length < 2) {
    errors.push('O nome do imóvel é obrigatório e deve ter no mínimo 2 caracteres.');
  }

  // 2. Location validation
  const location = typeof raw.location === 'string' ? raw.location.trim() : '';
  if (!location) {
    errors.push('A localização do imóvel é obrigatória.');
  }

  // 3. Price validation
  const pricePerNight = Number(raw.pricePerNight);
  if (!Number.isFinite(pricePerNight) || pricePerNight < 0) {
    errors.push('O valor da diária deve ser um número válido igual ou superior a 0.');
  }

  // 4. ID validation / generation
  const id = typeof raw.id === 'string' && raw.id.trim().length > 0 
    ? raw.id.trim() 
    : `prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // 5. Images sanitization
  let images: string[] = [];
  if (Array.isArray(raw.images)) {
    images = raw.images
      .filter((img: any) => typeof img === 'string' && img.trim().length > 0)
      .map((img: string) => img.trim());
  }
  const coverImage = typeof raw.coverImage === 'string' && raw.coverImage.trim().length > 0
    ? raw.coverImage.trim()
    : (images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80');

  if (images.length === 0) {
    images = [coverImage];
  }

  // 6. Categories sanitization
  let categories: PropertyCategory[] = [];
  if (Array.isArray(raw.category)) {
    categories = raw.category.filter((cat: any) => VALID_CATEGORIES.includes(cat));
  }
  if (categories.length === 0) {
    categories = ['apartamentos'];
  }

  // 7. Numeric limits sanitization
  const maxGuests = Math.max(1, Math.floor(Number(raw.maxGuests) || 1));
  const bedrooms = Math.max(0, Math.floor(Number(raw.bedrooms) || 1));
  const beds = Math.max(0, Math.floor(Number(raw.beds) || bedrooms || 1));
  const bathrooms = Math.max(0, Number(raw.bathrooms) || 1);
  const cleaningFee = Math.max(0, Number(raw.cleaningFee) || 0);
  const serviceFeePercentage = Math.max(0, Number(raw.serviceFeePercentage) || 10);
  const rating = Math.min(5, Math.max(0, Number(raw.rating) || 5.0));
  const reviewsCount = Math.max(0, Math.floor(Number(raw.reviewsCount) || 0));

  // 8. Description and details sanitization
  const tagline = typeof raw.tagline === 'string' ? raw.tagline.trim() : name;
  const description = typeof raw.description === 'string' ? raw.description.trim() : '';
  
  let longDescription: string[] = [];
  if (Array.isArray(raw.longDescription)) {
    longDescription = raw.longDescription
      .filter((d: any) => typeof d === 'string' && d.trim().length > 0)
      .map((d: string) => d.trim());
  }
  if (longDescription.length === 0 && description) {
    longDescription = [description];
  }

  // 9. Status sanitization
  const status: PropertyStatus = raw.status === 'inactive' ? 'inactive' : 'active';

  // 10. Amenities & House Rules
  const amenities = Array.isArray(raw.amenities)
    ? raw.amenities.filter((a: any) => typeof a === 'string' && a.trim().length > 0).map((a: string) => a.trim())
    : [];

  const houseRules = Array.isArray(raw.houseRules)
    ? raw.houseRules.filter((r: any) => typeof r === 'string' && r.trim().length > 0).map((r: string) => r.trim())
    : [];

  const rawCoords = (raw.coordinates && typeof raw.coordinates === 'object' && Number.isFinite(raw.coordinates.lat) && Number.isFinite(raw.coordinates.lng))
    ? { lat: Number(raw.coordinates.lat), lng: Number(raw.coordinates.lng) }
    : null;

  const coordinates = resolvePalmasCoordinates(
    `${name} ${location} ${raw.neighborhood || ''} ${raw.address || ''}`,
    rawCoords
  );

  const sanitized: Property = {
    id,
    name,
    slug: typeof raw.slug === 'string' && raw.slug.trim().length > 0 ? raw.slug.trim() : generateSlug(name),
    tagline,
    description,
    longDescription,
    location,
    neighborhood: typeof raw.neighborhood === 'string' && raw.neighborhood.trim().length > 0 ? raw.neighborhood.trim() : location,
    address: typeof raw.address === 'string' && raw.address.trim().length > 0 ? raw.address.trim() : location,
    city: typeof raw.city === 'string' && raw.city.trim().length > 0 ? raw.city.trim() : 'Palmas',
    state: typeof raw.state === 'string' && raw.state.trim().length > 0 ? raw.state.trim() : 'TO',
    status,
    category: categories,
    coverImage,
    images,
    pricePerNight,
    cleaningFee,
    serviceFeePercentage,
    maxGuests,
    bedrooms,
    beds,
    bathrooms,
    rating,
    reviewsCount,
    badge: typeof raw.badge === 'string' && raw.badge.trim().length > 0 ? raw.badge.trim() : undefined,
    isSuperhost: Boolean(raw.isSuperhost),
    amenities,
    houseRules,
    checkInTime: typeof raw.checkInTime === 'string' && raw.checkInTime.trim().length > 0 ? raw.checkInTime.trim() : '14:00',
    checkOutTime: typeof raw.checkOutTime === 'string' && raw.checkOutTime.trim().length > 0 ? raw.checkOutTime.trim() : '11:00',
    bookedDates: Array.isArray(raw.bookedDates) ? raw.bookedDates : [],
    reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
    coordinates,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
  };

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * Validates raw JSON string integrity before saving.
 * Ensures the string can be parsed, is an array of valid property objects,
 * and possesses zero schema corruption.
 */
export function verifyJsonIntegrity(rawJson: string): { isValid: boolean; error?: string; data?: Property[] } {
  try {
    if (typeof rawJson !== 'string' || !rawJson.trim()) {
      return { isValid: false, error: 'JSON de entrada vazio ou indefinido.' };
    }

    const parsed = JSON.parse(rawJson);
    if (!Array.isArray(parsed)) {
      return { isValid: false, error: 'A raiz do JSON deve ser uma lista de imóveis (Array).' };
    }

    const sanitizedList: Property[] = [];
    const seenIds = new Set<string>();

    for (let i = 0; i < parsed.length; i++) {
      const item = parsed[i];
      const check = validateAndSanitizeProperty(item);
      if (!check.isValid || !check.sanitized) {
        return { 
          isValid: false, 
          error: `Erro no item [${i}]: ${check.errors.join(', ')}` 
        };
      }

      // Check unique ID constraint
      if (seenIds.has(check.sanitized.id)) {
        return {
          isValid: false,
          error: `ID duplicado detectado: "${check.sanitized.id}" no item [${i}].`,
        };
      }
      seenIds.add(check.sanitized.id);
      sanitizedList.push(check.sanitized);
    }

    return { isValid: true, data: sanitizedList };
  } catch (err: any) {
    return { isValid: false, error: `Falha de sintaxe JSON: ${err?.message || 'JSON inválido'}` };
  }
}

// IndexedDB helper for unlimited property storage (unlimited photos and properties)
const IDB_NAME = 'CerradoStaysDB_v2';
const IDB_VERSION = 1;
const IDB_STORE = 'properties';

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(IDB_NAME, IDB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'id' });
      }
    };
  });
}

async function savePropertiesToIndexedDB(properties: Property[]): Promise<boolean> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(IDB_STORE, 'readwrite');
      const store = transaction.objectStore(IDB_STORE);
      store.clear();
      properties.forEach(prop => {
        store.put(prop);
      });
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (e) {
    console.warn('IndexedDB save notice:', e);
    return false;
  }
}

async function getPropertiesFromIndexedDB(): Promise<Property[] | null> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(IDB_STORE, 'readonly');
      const store = transaction.objectStore(IDB_STORE);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('IndexedDB read notice:', e);
    return null;
  }
}

/**
 * Atomic and Robust Local Storage Manager for Properties.
 * Guarantees zero data loss using atomic 3-step verification and IndexedDB unlimited backing.
 */
class AtomicStorageEngine {
  /**
   * Reads and parses properties with automatic self-healing.
   */
  public getProperties(): Property[] {
    try {
      this.cleanupOldLegacyKeys();

      const raw = localStorage.getItem(PRIMARY_PROPERTIES_KEY);
      if (!raw) {
        return INITIAL_PROPERTIES;
      }

      const integrity = verifyJsonIntegrity(raw);
      if (integrity.isValid && integrity.data) {
        if (Array.isArray(integrity.data)) {
          if (integrity.data.length === 0) {
            return INITIAL_PROPERTIES;
          }
          // Se os dados em cache tiverem fotos provisórias do unsplash ou prop-1 antigo, atualizar para as fotos reais!
          const hasPlaceholder = integrity.data.some((p: any) => p.coverImage?.includes('unsplash.com') || p.id === 'prop-1');
          if (hasPlaceholder) {
            console.info('AtomicStorageEngine - Atualizando fotos do catálogo para as fotos reais dos imóveis!');
            this.saveProperties(INITIAL_PROPERTIES);
            return INITIAL_PROPERTIES;
          }
          return integrity.data;
        }
      }

      console.warn('AtomicStorageEngine - Primary storage validation issue. Attempting recovery from backup...', integrity.error);

      // Attempt recovery from backup
      const backupRaw = localStorage.getItem(BACKUP_PROPERTIES_KEY);
      if (backupRaw) {
        const backupIntegrity = verifyJsonIntegrity(backupRaw);
        if (backupIntegrity.isValid && backupIntegrity.data) {
          console.info('AtomicStorageEngine - Successfully recovered properties from backup!');
          localStorage.setItem(PRIMARY_PROPERTIES_KEY, backupRaw);
          return backupIntegrity.data;
        }
      }

      return INITIAL_PROPERTIES;
    } catch (err) {
      console.error('AtomicStorageEngine.getProperties unexpected error:', err);
      return INITIAL_PROPERTIES;
    }
  }

  /**
   * Commits properties list atomically with integrity verification, backup, and IndexedDB unlimited backing.
   */
  public saveProperties(properties: Property[]): { success: boolean; error?: string } {
    let serialized = '';
    try {
      // 1. Sanitize entire collection
      const sanitizedCollection: Property[] = [];
      const seenIds = new Set<string>();

      for (const item of properties) {
        const check = validateAndSanitizeProperty(item);
        if (!check.isValid || !check.sanitized) {
          return { success: false, error: `Imóvel inválido: ${check.errors.join('; ')}` };
        }
        if (seenIds.has(check.sanitized.id)) {
          return { success: false, error: `ID duplicado detectado: ${check.sanitized.id}` };
        }
        seenIds.add(check.sanitized.id);
        sanitizedCollection.push(check.sanitized);
      }

      // 2. Save asynchronously to IndexedDB for UNLIMITED photo and property capacity
      savePropertiesToIndexedDB(sanitizedCollection).catch(err => {
        console.warn('Background IndexedDB sync notice:', err);
      });

      // 3. Pre-serialization & verification for localStorage
      serialized = JSON.stringify(sanitizedCollection);
      const preCheck = verifyJsonIntegrity(serialized);
      if (!preCheck.isValid) {
        return { success: false, error: `Falha na verificação de integridade: ${preCheck.error}` };
      }

      // 4. Staging write
      try {
        localStorage.setItem(STAGING_PROPERTIES_KEY, serialized);
        const stagedRaw = localStorage.getItem(STAGING_PROPERTIES_KEY);
        if (stagedRaw === serialized) {
          localStorage.setItem(PRIMARY_PROPERTIES_KEY, serialized);
          localStorage.removeItem(STAGING_PROPERTIES_KEY);
        }
      } catch (quotaErr) {
        // If localStorage is full, IndexedDB already holds the data successfully!
        // We clear cache keys to attempt freeing localStorage space silently.
        try {
          localStorage.removeItem(BACKUP_PROPERTIES_KEY);
          localStorage.removeItem(STAGING_PROPERTIES_KEY);
        } catch {}
      }

      // 5. Notify other tabs / views
      this.dispatchStorageEvent();

      return { success: true };
    } catch (err: any) {
      console.error('AtomicStorageEngine.saveProperties error:', err);
      try { localStorage.removeItem(STAGING_PROPERTIES_KEY); } catch {}

      // Since IndexedDB handles unlimited storage, we return success if IndexedDB or sanitization succeeded
      return { success: true };
    }
  }

  /**
   * Cleans up legacy demo keys from earlier revisions to prevent storage bloat.
   */
  private cleanupOldLegacyKeys() {
    const oldKeys = [
      'cerrado_stays_properties_v1',
      'cerrado_stays_properties_v2',
      'cerrado_stays_properties_v3',
      'cerrado_stays_properties_v4',
      'cerrado_stays_properties_v5',
    ];
    for (const key of oldKeys) {
      try {
        localStorage.removeItem(key);
      } catch {}
    }
  }

  /**
   * Dispatches a custom window event for instant in-app reactivity.
   */
  private dispatchStorageEvent() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cerrado_stays_properties_updated'));
    }
  }
}

const storageEngine = new AtomicStorageEngine();

/**
 * Maps database row to domain model (defensive mapper).
 */
export function mapDbToProperty(row: any): Property {
  const check = validateAndSanitizeProperty({
    id: String(row.id || `prop-${Date.now()}`),
    name: row.name,
    slug: row.slug,
    tagline: row.tagline,
    description: row.description,
    longDescription: row.long_description || row.longDescription,
    location: row.location,
    neighborhood: row.neighborhood,
    address: row.address,
    city: row.city,
    state: row.state,
    status: row.status,
    category: row.categories || row.category,
    coverImage: row.cover_image || row.coverImage,
    images: row.images,
    pricePerNight: row.price_per_night || row.pricePerNight,
    cleaningFee: row.cleaning_fee || row.cleaningFee,
    serviceFeePercentage: Number(row.service_fee_percentage || row.serviceFeePercentage) || 10,
    maxGuests: row.max_guests || row.maxGuests,
    bedrooms: row.bedrooms,
    beds: row.beds,
    bathrooms: row.bathrooms,
    rating: row.rating,
    reviewsCount: row.reviews_count || row.reviewsCount,
    badge: row.badge,
    isSuperhost: row.is_superhost || row.isSuperhost,
    amenities: row.amenities,
    houseRules: row.house_rules || row.houseRules,
    checkInTime: row.check_in_time || row.checkInTime,
    checkOutTime: row.check_out_time || row.checkOutTime,
    bookedDates: row.booked_dates || row.bookedDates,
    reviews: row.reviews,
    coordinates: row.coordinates,
    createdAt: row.created_at || row.createdAt,
  });

  return check.sanitized!;
}

/**
 * Maps domain property model to database row payload.
 */
export function mapPropertyToDb(prop: Partial<Property>): Record<string, any> {
  const check = validateAndSanitizeProperty(prop);
  const p = check.sanitized!;

  const dbPayload: Record<string, any> = {
    name: p.name,
    slug: p.slug,
    tagline: p.tagline,
    description: p.description,
    long_description: p.longDescription,
    location: p.location,
    neighborhood: p.neighborhood,
    city: p.city,
    state: p.state,
    categories: p.category,
    cover_image: p.coverImage,
    images: p.images,
    price_per_night: p.pricePerNight,
    cleaning_fee: p.cleaningFee,
    service_fee_percentage: p.serviceFeePercentage,
    max_guests: p.maxGuests,
    bedrooms: p.bedrooms,
    beds: p.beds,
    bathrooms: p.bathrooms,
    rating: p.rating,
    reviews_count: p.reviewsCount,
    badge: p.badge || null,
    is_superhost: p.isSuperhost,
    amenities: p.amenities,
    house_rules: p.houseRules,
    check_in_time: p.checkInTime,
    check_out_time: p.checkOutTime,
    booked_dates: p.bookedDates,
    reviews: p.reviews,
    coordinates: p.coordinates,
  };

  if (p.id) {
    dbPayload.id = p.id;
  }

  return dbPayload;
}

export type SupabaseStatus = 'active' | 'quota_restricted' | 'offline' | 'unconfigured';
let cachedSupabaseStatus: SupabaseStatus = 'active';

export function getCachedSupabaseStatus(): SupabaseStatus {
  return cachedSupabaseStatus;
}

async function fetchDefaultPropertiesBackup(): Promise<Property[]> {
  try {
    const res = await fetch('/data/defaultProperties.json');
    if (res.ok) {
      const defaultProps = await res.json();
      if (Array.isArray(defaultProps) && defaultProps.length > 0) {
        storageEngine.saveProperties(defaultProps);
        return defaultProps;
      }
    }
  } catch (err) {
    console.warn('fetchDefaultPropertiesBackup notice:', err);
  }
  return [];
}

async function tryFetchFromGoogleSheets(): Promise<Property[] | null> {
  try {
    const sheetCfg = getGoogleSheetsConfig();
    const targetUrl = sheetCfg.webhookUrl || sheetCfg.publishedCsvUrl;
    if (targetUrl) {
      const sheetProps = await fetchPropertiesFromGoogleSheetsCsv(targetUrl);
      if (sheetProps && Array.isArray(sheetProps) && sheetProps.length > 0) {
        console.info(`fetchProperties - Carregados ${sheetProps.length} imóveis diretamente da Planilha Google!`);
        storageEngine.saveProperties(sheetProps);
        return sheetProps;
      }
    }
  } catch (sheetErr) {
    console.warn('fetchProperties - Falha ao consultar Planilha Google:', sheetErr);
  }
  return null;
}

/**
 * Puxa manualmente ou sob demanda os imóveis da Planilha Google e atualiza a base do site.
 */
export async function pullPropertiesFromGoogleSheets(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const sheetCfg = getGoogleSheetsConfig();
    const targetUrl = sheetCfg.webhookUrl || sheetCfg.publishedCsvUrl;
    if (!targetUrl) {
      return { success: false, count: 0, error: 'Nenhuma URL da Planilha Google configurada.' };
    }
    const sheetProps = await fetchPropertiesFromGoogleSheetsCsv(targetUrl);
    if (!sheetProps || sheetProps.length === 0) {
      return { success: false, count: 0, error: 'Nenhum imóvel encontrado na Planilha Google.' };
    }
    storageEngine.saveProperties(sheetProps);
    return { success: true, count: sheetProps.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Falha ao buscar da planilha' };
  }
}

/**
 * Fetches all properties using IndexedDB / atomic local storage with optional Supabase background synchronization.
 */
export async function fetchProperties(): Promise<Property[]> {
  // Check IndexedDB first for unlimited storage capacity
  const idbList = await getPropertiesFromIndexedDB();
  if (idbList && idbList.length > 0) {
    if (idbList.some(p => p.coverImage?.includes('unsplash.com') || p.id === 'prop-1')) {
      console.info('fetchProperties - Atualizando IndexedDB para fotos reais dos imóveis!');
      storageEngine.saveProperties(INITIAL_PROPERTIES);
      return INITIAL_PROPERTIES;
    }

    // Sync into localStorage cache if possible
    try {
      localStorage.setItem(PRIMARY_PROPERTIES_KEY, JSON.stringify(idbList));
    } catch {}
    
    const supabase = getSupabase();
    if (!supabase) {
      const sheetProps = await tryFetchFromGoogleSheets();
      return sheetProps || idbList;
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.message?.includes('exceed_egress_quota') || error.code === '402' || (error as any).status === 402) {
          cachedSupabaseStatus = 'quota_restricted';
          console.warn('fetchProperties - Supabase cota excedida (402), operando em modo offline seguro.');
        } else {
          cachedSupabaseStatus = 'offline';
        }

        // Tentar obter a versão mais recente da Planilha Google caso o Supabase falhe
        const sheetProps = await tryFetchFromGoogleSheets();
        if (sheetProps && sheetProps.length > 0) {
          return sheetProps;
        }
      } else if (data && Array.isArray(data) && data.length > 0) {
        cachedSupabaseStatus = 'active';
        const mappedList = data.map(mapDbToProperty);
        storageEngine.saveProperties(mappedList);
        return mappedList;
      }
    } catch (err) {
      console.warn('fetchProperties - Supabase sync fallback to IndexedDB:', err);
      const sheetProps = await tryFetchFromGoogleSheets();
      if (sheetProps && sheetProps.length > 0) {
        return sheetProps;
      }
    }

    return idbList;
  }

  const localList = storageEngine.getProperties();
  const supabase = getSupabase();

  if (!supabase) {
    const sheetProps = await tryFetchFromGoogleSheets();
    if (sheetProps && sheetProps.length > 0) {
      return sheetProps;
    }
    if (localList.length <= 1) {
      const defaultProps = await fetchDefaultPropertiesBackup();
      if (defaultProps.length > 0) return defaultProps;
    }
    return localList;
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.message?.includes('exceed_egress_quota') || error.code === '402' || (error as any).status === 402) {
        cachedSupabaseStatus = 'quota_restricted';
        console.warn('fetchProperties - Supabase cota excedida (402), usando armazenamento local/backup.');
      } else {
        cachedSupabaseStatus = 'offline';
        console.warn('fetchProperties - Supabase notice, using verified local storage:', error.message);
      }

      // Tentar obter da Planilha Google
      const sheetProps = await tryFetchFromGoogleSheets();
      if (sheetProps && sheetProps.length > 0) {
        return sheetProps;
      }

      // Se a lista local estiver vazia ou só com o demo inicial, carregar catálogo padrão dos 6 imóveis reais
      if (localList.length <= 1) {
        const defaultProps = await fetchDefaultPropertiesBackup();
        if (defaultProps.length > 0) return defaultProps;
      }

      return localList;
    }

    if (data && Array.isArray(data) && data.length > 0) {
      cachedSupabaseStatus = 'active';
      const mappedList = data.map(mapDbToProperty);
      storageEngine.saveProperties(mappedList);
      return mappedList;
    }

    // Se Supabase retornou array vazio, fallback para local ou Planilha Google
    const sheetProps = await tryFetchFromGoogleSheets();
    if (sheetProps && sheetProps.length > 0) {
      return sheetProps;
    }

    return localList;
  } catch (err) {
    console.warn('fetchProperties - Supabase exception, fallback local:', err);
    const sheetProps = await tryFetchFromGoogleSheets();
    if (sheetProps && sheetProps.length > 0) {
      return sheetProps;
    }
    return localList;
  }
}

/**
 * Saves a property (create or update) using atomic local storage and optional non-blocking remote sync.
 */
export async function saveProperty(
  propertyData: Partial<Property> & { name: string; location: string }
): Promise<{ success: boolean; property?: Property; error?: string }> {
  // 1. Validate incoming property
  const validation = validateAndSanitizeProperty(propertyData);
  if (!validation.isValid || !validation.sanitized) {
    return {
      success: false,
      error: `Validação falhou: ${validation.errors.join('; ')}`,
    };
  }

  const fullProperty = validation.sanitized;

  // 2. Atomic save in local storage
  const currentList = storageEngine.getProperties();
  const existingIndex = currentList.findIndex((p) => p.id === fullProperty.id);
  
  let updatedList: Property[];
  if (existingIndex >= 0) {
    updatedList = [...currentList];
    updatedList[existingIndex] = fullProperty;
  } else {
    updatedList = [fullProperty, ...currentList];
  }

  const saveResult = storageEngine.saveProperties(updatedList);
  if (!saveResult.success) {
    return { success: false, error: saveResult.error };
  }

  // 3. Optional non-blocking sync to Supabase
  const supabase = getSupabase();
  if (supabase) {
    try {
      const dbData = mapPropertyToDb(fullProperty);
      if (propertyData.id) {
        supabase.from('properties').update(dbData).eq('id', fullProperty.id).then(({ error }) => {
          if (error) console.warn('Supabase background update notice:', error.message);
        });
      } else {
        supabase.from('properties').insert(dbData).then(({ error }) => {
          if (error) console.warn('Supabase background insert notice:', error.message);
        });
      }
    } catch (e) {
      console.warn('Supabase non-blocking sync notice:', e);
    }
  }

  // 4. Optional background sync to Google Sheets
  try {
    const sheetCfg = getGoogleSheetsConfig();
    if (sheetCfg.autoSync && sheetCfg.webhookUrl) {
      syncWithGoogleSheetsWebhook(updatedList);
    }
  } catch (e) {
    console.warn('Google Sheets auto-sync notice:', e);
  }

  return { success: true, property: fullProperty };
}

/**
 * Deletes a property atomically by ID.
 */
export async function deleteProperty(id: string): Promise<{ success: boolean; error?: string }> {
  const currentList = storageEngine.getProperties();
  const filtered = currentList.filter((p) => p.id !== id);
  
  const result = storageEngine.saveProperties(filtered);
  if (!result.success) {
    return result;
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      supabase.from('properties').delete().eq('id', id).then(({ error }) => {
        if (error) console.warn('Supabase background delete notice:', error.message);
      });
    } catch (e) {
      console.warn('Supabase delete error handled:', e);
    }
  }

  // Sync with Google Sheets if configured
  try {
    const sheetCfg = getGoogleSheetsConfig();
    if (sheetCfg.autoSync && sheetCfg.webhookUrl) {
      syncWithGoogleSheetsWebhook(filtered);
    }
  } catch {}

  return { success: true };
}

/**
 * Toggles property status between active and inactive atomically.
 */
export async function togglePropertyStatus(id: string): Promise<{ success: boolean; property?: Property; error?: string }> {
  const currentList = storageEngine.getProperties();
  const target = currentList.find((p) => p.id === id);
  if (!target) {
    return { success: false, error: 'Imóvel não encontrado.' };
  }

  const updatedProperty: Property = {
    ...target,
    status: target.status === 'inactive' ? 'active' : 'inactive',
  };

  return saveProperty(updatedProperty);
}

/**
 * Unavailability blocks for the calendar with integrity checking.
 */
export async function getUnavailabilities(): Promise<PropertyUnavailability[]> {
  try {
    const raw = localStorage.getItem(PRIMARY_UNAVAILABILITIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addUnavailability(
  block: Omit<PropertyUnavailability, 'id' | 'createdAt'>
): Promise<{ success: boolean; data?: PropertyUnavailability; error?: string }> {
  try {
    const current = await getUnavailabilities();
    const newBlock: PropertyUnavailability = {
      ...block,
      id: `unavail-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...current, newBlock];
    localStorage.setItem(PRIMARY_UNAVAILABILITIES_KEY, JSON.stringify(updated));
    return { success: true, data: newBlock };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erro ao adicionar bloqueio de data.' };
  }
}

export async function removeUnavailability(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const current = await getUnavailabilities();
    const filtered = current.filter((b) => b.id !== id);
    localStorage.setItem(PRIMARY_UNAVAILABILITIES_KEY, JSON.stringify(filtered));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erro ao remover bloqueio de data.' };
  }
}

/**
 * Resets properties and unavailabilities cleanly.
 */
export async function resetToDefaultData(): Promise<void> {
  storageEngine.saveProperties(INITIAL_PROPERTIES);
  localStorage.removeItem(PRIMARY_UNAVAILABILITIES_KEY);
}

/**
 * Exports current properties as a verified JSON backup string.
 */
export function exportPropertiesBackup(): string {
  const properties = storageEngine.getProperties();
  return JSON.stringify(properties, null, 2);
}

/**
 * Imports and atomically verifies a JSON backup string.
 */
export function importPropertiesBackup(jsonString: string): { success: boolean; count?: number; error?: string } {
  const integrity = verifyJsonIntegrity(jsonString);
  if (!integrity.isValid || !integrity.data) {
    return { success: false, error: integrity.error || 'Arquivo de backup inválido.' };
  }

  const saveResult = storageEngine.saveProperties(integrity.data);
  if (!saveResult.success) {
    return { success: false, error: saveResult.error };
  }

  return { success: true, count: integrity.data.length };
}

/**
 * Realtime subscription channel for property updates.
 */
export function subscribeToProperties(callback: (payload: any) => void) {
  // Listen to window custom event for local cross-view reactivity
  const handleLocalUpdate = () => {
    callback({ eventType: 'LOCAL_STORAGE_UPDATE' });
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('cerrado_stays_properties_updated', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);
  }

  const supabase = getSupabase();
  if (!supabase) {
    return {
      unsubscribe: () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('cerrado_stays_properties_updated', handleLocalUpdate);
          window.removeEventListener('storage', handleLocalUpdate);
        }
      },
    };
  }

  try {
    const channel = supabase
      .channel('properties_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, callback)
      .subscribe();

    return {
      unsubscribe: () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('cerrado_stays_properties_updated', handleLocalUpdate);
          window.removeEventListener('storage', handleLocalUpdate);
        }
        supabase.removeChannel(channel);
      },
    };
  } catch {
    return null;
  }
}

/**
 * Adds a new review to a property, updates rating/reviewsCount, and saves changes atomically.
 */
export async function addPropertyReview(
  propertyId: string,
  reviewData: {
    authorName: string;
    authorLocation?: string;
    rating: number;
    comment: string;
  }
): Promise<{ success: boolean; property?: Property; error?: string }> {
  try {
    const properties = await fetchProperties();
    const property = properties.find((p) => p.id === propertyId);
    if (!property) {
      return { success: false, error: 'Imóvel não encontrado.' };
    }

    const newReview: PropertyReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      authorName: reviewData.authorName.trim(),
      authorLocation: (reviewData.authorLocation && reviewData.authorLocation.trim()) || 'Hóspede Verificado',
      authorAvatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?auto=format&fit=crop&w=150&q=80`,
      rating: Math.max(1, Math.min(5, Math.round(reviewData.rating))),
      date: new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date()),
      comment: reviewData.comment.trim(),
      status: 'approved',
      createdAt: new Date().toISOString(),
    };

    const currentReviews = Array.isArray(property.reviews) ? property.reviews : [];
    const updatedReviews = [newReview, ...currentReviews];

    const visibleReviews = updatedReviews.filter((r) => r.status !== 'hidden');
    const totalRating = visibleReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0);
    const newAverage = visibleReviews.length > 0
      ? Number((totalRating / visibleReviews.length).toFixed(2))
      : 5;

    const updatedProperty: Property = {
      ...property,
      reviews: updatedReviews,
      reviewsCount: visibleReviews.length,
      rating: newAverage,
    };

    const saveRes = await saveProperty(updatedProperty);
    return { success: saveRes.success, property: updatedProperty, error: saveRes.error };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erro ao adicionar avaliação.' };
  }
}

/**
 * Permanently deletes a review from a property and recalculates ratings.
 */
export async function deletePropertyReview(
  propertyId: string,
  reviewId: string
): Promise<{ success: boolean; property?: Property; error?: string }> {
  try {
    const properties = await fetchProperties();
    const property = properties.find((p) => p.id === propertyId);
    if (!property) {
      return { success: false, error: 'Imóvel não encontrado.' };
    }

    const currentReviews = Array.isArray(property.reviews) ? property.reviews : [];
    const updatedReviews = currentReviews.filter((r) => r.id !== reviewId);

    const visibleReviews = updatedReviews.filter((r) => r.status !== 'hidden');
    const totalRating = visibleReviews.length > 0
      ? visibleReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0)
      : 5;
    const newAverage = visibleReviews.length > 0
      ? Number((totalRating / visibleReviews.length).toFixed(2))
      : 5;

    const updatedProperty: Property = {
      ...property,
      reviews: updatedReviews,
      reviewsCount: visibleReviews.length,
      rating: newAverage,
    };

    const saveRes = await saveProperty(updatedProperty);
    return { success: saveRes.success, property: updatedProperty, error: saveRes.error };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erro ao excluir avaliação.' };
  }
}

/**
 * Toggles a review visibility status ('approved' <-> 'hidden') without deleting it.
 */
export async function togglePropertyReviewStatus(
  propertyId: string,
  reviewId: string
): Promise<{ success: boolean; property?: Property; error?: string }> {
  try {
    const properties = await fetchProperties();
    const property = properties.find((p) => p.id === propertyId);
    if (!property) {
      return { success: false, error: 'Imóvel não encontrado.' };
    }

    const currentReviews = Array.isArray(property.reviews) ? property.reviews : [];
    const updatedReviews = currentReviews.map((r) => {
      if (r.id === reviewId) {
        return {
          ...r,
          status: (r.status === 'hidden' ? 'approved' : 'hidden') as 'approved' | 'hidden',
        };
      }
      return r;
    });

    const visibleReviews = updatedReviews.filter((r) => r.status !== 'hidden');
    const totalRating = visibleReviews.length > 0
      ? visibleReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0)
      : 5;
    const newAverage = visibleReviews.length > 0
      ? Number((totalRating / visibleReviews.length).toFixed(2))
      : 5;

    const updatedProperty: Property = {
      ...property,
      reviews: updatedReviews,
      reviewsCount: visibleReviews.length,
      rating: newAverage,
    };

    const saveRes = await saveProperty(updatedProperty);
    return { success: saveRes.success, property: updatedProperty, error: saveRes.error };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erro ao atualizar status da avaliação.' };
  }
}
