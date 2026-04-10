export type ConnectionType = 'local' | 'online' | null;

export const CATEGORIES = [
  {
    id: 'food',
    name: 'Comida',
    icon: 'restaurant',
    color: 'secondary' as const,
    subcategories: [
      { id: 'desserts', name: 'Postres y Dulces' },
      { id: 'savory', name: 'Comida Salada' },
      { id: 'fastfood', name: 'Comida Rápida' },
      { id: 'drinks', name: 'Bebidas' },
    ]
  },
  {
    id: 'cinema',
    name: 'Cine',
    icon: 'movie',
    color: 'primary' as const,
    subcategories: [
      { id: 'horror', name: 'Terror' },
      { id: 'comedy', name: 'Comedia' },
      { id: 'action', name: 'Acción' },
      { id: 'scifi', name: 'Ciencia Ficción' },
    ]
  },
  {
    id: 'animals',
    name: 'Animales',
    icon: 'pets',
    color: 'accent' as const,
    subcategories: [
      { id: 'pets', name: 'Mascotas' },
      { id: 'wild', name: 'Salvajes' },
      { id: 'marine', name: 'Marinos' },
      { id: 'birds', name: 'Aves' },
    ]
  },
  {
    id: 'world',
    name: 'Mundo',
    icon: 'travel_explore',
    color: 'purple' as const,
    subcategories: [
      { id: 'countries', name: 'Países' },
      { id: 'cities', name: 'Ciudades' },
      { id: 'landmarks', name: 'Monumentos' },
      { id: 'nature', name: 'Naturaleza' },
    ]
  },
];

export const TIME_OPTIONS = {
  clues: [30, 45, 60, 90],
  discussion: [60, 90, 120, 180],
  voting: [15, 30, 45, 60],
};
