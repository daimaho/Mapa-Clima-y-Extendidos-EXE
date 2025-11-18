import { Location } from './types';

export const API_KEY: string = "4fa0bddeed9ab169591bb11fbe01d655";
export const API_BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

export const LOCATIONS: Location[] = [
  { name: "RESISTENCIA", subname: "Chaco", lat: -27.45186, lon: -58.98555 },
  { name: "TACO POZO", subname: "Chaco", lat: -25.61587, lon: -63.26795 },
  { name: "JUAN JOSÉ CASTELLI", subname: "Chaco", lat: -25.94729, lon: -60.62034 },
  { name: "VILLA ÁNGELA", subname: "Chaco", lat: -27.57633, lon: -60.71179 },
  { name: "GRAL. JOSÉ DE SAN MARTÍN", subname: "Chaco", lat: -26.53798, lon: -59.34202 },
  { name: "PCIA. ROQUE SÁENZ PEÑA", subname: "Chaco", lat: -26.80044, lon: -60.43123 },
  { name: "CHARATA", subname: "Chaco", lat: -27.2135, lon: -61.1895 },
  { name: "GANCEDO", subname: "Chaco", lat: -27.4875, lon: -61.6749 },
  { name: "CHARADAI", subname: "Chaco", lat: -27.6713, lon: -59.8821 },
];

export const MAP_DISPLAY_LOCATIONS = [
  { name: "TACO POZO", shortName: "TACO POZO", pos: { top: '25%', left: '26%' } },
  { name: "JUAN JOSÉ CASTELLI", shortName: "J.J. CASTELLI", pos: { top: '24%', left: '44%' } },
  { name: "GANCEDO", shortName: "GANCEDO", pos: { top: '59%', left: '38%' } },
  { name: "CHARATA", shortName: "CHARATA", pos: { top: '49%', left: '46%' } },
  { name: "VILLA ÁNGELA", shortName: "VILLA ANGELA", pos: { top: '71%', left: '48%' } },
  { name: "PCIA. ROQUE SÁENZ PEÑA", shortName: "SAENZ PEÑA", pos: { top: '45%', left: '54%' } },
  { name: "GRAL. JOSÉ DE SAN MARTÍN", shortName: "SAN MARTIN", pos: { top: '43%', left: '64%' } },
  { name: "CHARADAI", shortName: "CHARADAI", pos: { top: '67%', left: '58%' } },
  { name: "RESISTENCIA", shortName: "RESISTENCIA", pos: { top: '64%', left: '69%' } },
];

export const WEATHER_CONDITION_MAP: { [key: number]: string } = {
  200: 'storm', 201: 'storm', 202: 'storm', 210: 'storm', 211: 'storm',
  212: 'storm', 221: 'storm', 230: 'storm', 231: 'storm', 232: 'storm',
  300: 'drizzle', 301: 'drizzle', 302: 'drizzle', 310: 'drizzle', 311: 'drizzle',
  312: 'drizzle', 313: 'drizzle', 314: 'drizzle', 321: 'drizzle',
  500: 'rain', 501: 'rain', 502: 'rain', 503: 'rain', 504: 'rain',
  511: 'rain', 520: 'rain', 521: 'rain', 522: 'rain', 531: 'rain',
  600: 'rain', 601: 'rain', 602: 'rain', 611: 'rain', 612: 'rain',
  613: 'rain', 615: 'rain', 616: 'rain', 620: 'rain', 621: 'rain', 622: 'rain',
  701: 'fog', 711: 'fog', 721: 'fog', 731: 'fog', 741: 'fog',
  751: 'fog', 761: 'fog', 762: 'fog', 771: 'wind', 781: 'wind',
  800: 'clear',
  801: 'partly_cloudy', 802: 'partly_cloudy', 803: 'cloudy', 804: 'cloudy',
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