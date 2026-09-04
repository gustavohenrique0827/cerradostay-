/**
 * Geo & Mapping Utilities for Palmas - Tocantins
 * Cerrado Stays - Luxury Vacation Rentals
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PalmasRegionPreset {
  id: string;
  name: string;
  shortLabel: string;
  keywords: string[];
  coordinates: Coordinates;
}

export const PALMAS_REGIONS: PalmasRegionPreset[] = [
  {
    id: 'orla-14',
    name: 'Orla 14 (Graciosa)',
    shortLabel: 'Orla 14',
    keywords: ['orla 14', 'orla14', 'orla sul', 'graciosa', 'lago', 'lago de palmas', 'alameda dos buritis'],
    coordinates: { lat: -10.1837, lng: -48.3582 },
  },
  {
    id: 'praia-graciosa',
    name: 'Praia da Graciosa',
    shortLabel: 'Praia da Graciosa',
    keywords: ['praia da graciosa', 'graciosa beach', 'orla graciosa', 'porto real'],
    coordinates: { lat: -10.1882, lng: -48.3615 },
  },
  {
    id: 'orla-13',
    name: 'Orla 13 / Praia do Caju',
    shortLabel: 'Orla 13',
    keywords: ['orla 13', 'orla13', 'praia do caju'],
    coordinates: { lat: -10.1765, lng: -48.3560 },
  },
  {
    id: 'plano-diretor-sul',
    name: 'Plano Diretor Sul (104 Sul / 204 Sul)',
    shortLabel: '104 Sul / Centro Sul',
    keywords: ['104 sul', '104s', '204 sul', '204s', 'plano diretor sul', 'arso', 'acsu'],
    coordinates: { lat: -10.1885, lng: -48.3325 },
  },
  {
    id: 'praca-girassois',
    name: 'Praça dos Girassóis / Centro Cívico',
    shortLabel: 'Praça dos Girassóis',
    keywords: ['girassois', 'girassóis', 'centro', 'palacio araguaia', 'palácio araguaia', 'acne'],
    coordinates: { lat: -10.1839, lng: -48.3336 },
  },
  {
    id: 'capim-dourado',
    name: 'Capim Dourado Shopping / 107 Norte',
    shortLabel: 'Capim Dourado',
    keywords: ['capim dourado', 'shopping', '107 norte', '105 norte', 'jk'],
    coordinates: { lat: -10.1698, lng: -48.3440 },
  },
  {
    id: 'parque-cesamar',
    name: 'Parque Cesamar / 110 Sul',
    shortLabel: 'Parque Cesamar',
    keywords: ['cesamar', 'parque cesamar', '110 sul', '210 sul', 'arso 111'],
    coordinates: { lat: -10.2080, lng: -48.3240 },
  },
  {
    id: 'plano-diretor-norte',
    name: 'Plano Diretor Norte (104 Norte / 204 Norte)',
    shortLabel: '104 Norte',
    keywords: ['104 norte', '104n', '204 norte', '204n', 'plano diretor norte', 'arne'],
    coordinates: { lat: -10.1780, lng: -48.3310 },
  },
  {
    id: 'taquarucu',
    name: 'Taquaruçu (Distrito Ecológico)',
    shortLabel: 'Taquaruçu',
    keywords: ['taquarucu', 'taquaruçu', 'cachoeira', 'roncador', 'ecoturismo'],
    coordinates: { lat: -10.3128, lng: -48.1567 },
  },
  {
    id: 'praia-prata',
    name: 'Praia do Prata',
    shortLabel: 'Praia do Prata',
    keywords: ['prata', 'praia do prata'],
    coordinates: { lat: -10.2310, lng: -48.3810 },
  },
];

/**
 * Intelligent geocoding helper that detects Palmas region coordinates
 * from property name, location description, neighborhood, or address.
 */
export function resolvePalmasCoordinates(
  text: string,
  existingCoords?: Coordinates | null
): Coordinates {
  if (
    existingCoords &&
    Number.isFinite(existingCoords.lat) &&
    Number.isFinite(existingCoords.lng) &&
    // Check if it's not the old generic center point
    (Math.abs(existingCoords.lat - (-10.184)) > 0.001 || Math.abs(existingCoords.lng - (-48.333)) > 0.001)
  ) {
    return existingCoords;
  }

  if (!text) {
    return { lat: -10.1837, lng: -48.3582 }; // Default to Orla 14 (Graciosa)
  }

  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  for (const region of PALMAS_REGIONS) {
    for (const kw of region.keywords) {
      const normKw = kw
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      if (normalized.includes(normKw)) {
        return region.coordinates;
      }
    }
  }

  // If text mentions "orla" anywhere, return Orla 14
  if (normalized.includes('orla')) {
    return { lat: -10.1837, lng: -48.3582 };
  }

  // Default to Orla 14
  return { lat: -10.1837, lng: -48.3582 };
}

/**
 * Generates direct Google Maps search URL (opens place pin in Google Maps).
 */
export function getGoogleMapsSearchUrl(lat: number, lng: number, placeName?: string): string {
  if (placeName && placeName.trim().length > 0) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${placeName.trim()}, Palmas - TO`)}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/**
 * Generates direct real-time GPS navigation / directions URL in Google Maps.
 */
export function getGoogleMapsDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/**
 * Generates embed iframe URL for Google Maps.
 */
export function getGoogleMapsEmbedUrl(lat: number, lng: number): string {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed&hl=pt-BR`;
}
