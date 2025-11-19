import { Location } from './types';

export const API_KEY: string = "4fa0bddeed9ab169591bb11fbe01d655";
export const API_BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

export const LOCATIONS: Location[] = [
  { name: "RESISTENCIA", subname: "Chaco", lat: -27.45186, lon: -58.98555 },
  { name: "TACO POZO", subname: "Chaco", lat: -25.61587, lon: -63.26795 },
  { name: "J.J. CASTELLI", subname: "Chaco", lat: -25.94729, lon: -60.62034 },
  { name: "VILLA ÁNGELA", subname: "Chaco", lat: -27.57633, lon: -60.71179 },
  { name: "SAN MARTÍN", subname: "Chaco", lat: -26.53798, lon: -59.34202 },
  { name: "SÁENZ PEÑA", subname: "Chaco", lat: -26.80044, lon: -60.43123 },
  { name: "CHARATA", subname: "Chaco", lat: -27.2135, lon: -61.1895 },
  { name: "GANCEDO", subname: "Chaco", lat: -27.4875, lon: -61.6749 },
  { name: "CHARADAI", subname: "Chaco", lat: -27.6713, lon: -59.8821 },
];

export const MAP_DISPLAY_LOCATIONS = [
  { name: "TACO POZO", shortName: "TACO POZO", pos: { top: '25%', left: '26%' } },
  { name: "J.J. CASTELLI", shortName: "J.J. CASTELLI", pos: { top: '24%', left: '44%' } },
  { name: "GANCEDO", shortName: "GANCEDO", pos: { top: '59%', left: '38%' } },
  { name: "CHARATA", shortName: "CHARATA", pos: { top: '49%', left: '46%' } },
  { name: "VILLA ÁNGELA", shortName: "VILLA ÁNGELA", pos: { top: '71%', left: '48%' } },
  { name: "SÁENZ PEÑA", shortName: "SÁENZ PEÑA", pos: { top: '45%', left: '54%' } },
  { name: "SAN MARTÍN", shortName: "SAN MARTÍN", pos: { top: '43%', left: '64%' } },
  { name: "CHARADAI", shortName: "CHARADAI", pos: { top: '67%', left: '58%' } },
  { name: "RESISTENCIA", shortName: "RESISTENCIA", pos: { top: '64%', left: '69%' } },
];

export const WEATHER_CONDITION_MAP: { [key: string]: { range: [number, number] } } = {
  storm: { range: [200, 232] },
  drizzle: { range: [300, 321] },
  rain: { range: [500, 622] },
  fog: { range: [701, 762] },
  wind: { range: [771, 781] },
  clear: { range: [800, 800] },
  partly_cloudy: { range: [801, 802] },
  cloudy: { range: [803, 804] },
};

export const CONDITION_PRIORITY: { [key: string]: number } = {
  storm: 8,
  rain: 7,
  drizzle: 6,
  wind: 5,
  fog: 4,
  cloudy: 3,
  partly_cloudy: 2,
  clear: 1,
};

export const CONDITION_TEXT_MAP_ES: { [key: string]: string } = {
    storm: 'Tormenta',
    rain: 'Lluvia',
    drizzle: 'Llovizna',
    wind: 'Viento',
    fog: 'Niebla',
    cloudy: 'Mayormente nublado',
    partly_cloudy: 'Parcialmente nublado',
    clear: 'Despejado',
};

// ✅ Cambiar rutas absolutas por relativas (Vite busca automáticamente en public/)
export const BACKGROUND_VIDEO_URL = 'bg.webm';
export const ICON_PATH = 'icons/';
