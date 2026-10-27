// IDs must match PropertyCategory exactly (src/types.ts) — this list drives the public
// homepage filter pills, and a mismatched id here silently filters out every property
// (e.g. 'casa' here vs 'casas' on the property never match, so the pill always shows zero results).
export const CATEGORIES_LIST = [
  { id: 'todos', label: 'Todos', icon: 'Sparkles' },
  { id: 'apartamentos', label: 'Apartamentos', icon: 'Building2' },
  { id: 'casas', label: 'Casas', icon: 'Home' },
  { id: 'luxo', label: 'Luxo', icon: 'Crown' },
  { id: 'centro', label: 'Centro', icon: 'Compass' },
  { id: 'praia', label: 'Orla & Praia', icon: 'Palmtree' },
  { id: 'familia', label: 'Família', icon: 'Users' },
  { id: 'pet_friendly', label: 'Pet Friendly', icon: 'Dog' },
];
