import { Location, ProcessedLocationData, CurrentWeather, ForecastDay, TimeOfDayForecast } from './types';
import { API_KEY, WEATHER_CONDITION_MAP } from './constants';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function fetchWeatherForLocation(location: Location): Promise<ProcessedLocationData> {
  try {
    // Fetch current weather
    const currentResponse = await fetch(
      `${BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric&lang=es`
    );
    
    if (!currentResponse.ok) {
      throw new Error(`HTTP error! status: ${currentResponse.status}`);
    }
    
    const currentData = await currentResponse.json();

    // Fetch forecast
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric&lang=es`
    );
    
    if (!forecastResponse.ok) {
      throw new Error(`HTTP error! status: ${forecastResponse.status}`);
    }
    
    const forecastData = await forecastResponse.json();

    // Process current weather
    const current: CurrentWeather = {
      temp: Math.round(currentData.main.temp),
      condition: currentData.weather[0].description,
      icon: currentData.weather[0].icon, // Store raw icon code (e.g., "01d" or "01n")
      weatherId: currentData.weather[0].id,
    };

    // Process 4-day forecast
    const forecast: ForecastDay[] = processDailyForecast(forecastData.list);

    function processTodayForecast(list: any[]): TimeOfDayForecast[] {
  const ARGENTINA_OFFSET = -3 * 3600;
  
  const periods = [
    { period: 'MAÑANA' as const, hours: [6, 7, 8, 9, 10, 11] },      // 6am-11am
    { period: 'TARDE' as const, hours: [12, 13, 14, 15, 16, 17] },   // 12pm-5pm
    { period: 'NOCHE' as const, hours: [18, 19, 20, 21, 22, 23] },   // 6pm-11pm
  ];

  return periods.map(({ period, hours }) => {
    let periodData = list.filter((item: any) => {
      const adjustedTimestamp = (item.dt + ARGENTINA_OFFSET) * 1000;
      const hour = new Date(adjustedTimestamp).getHours();
      return hours.includes(hour);
    });

    if (periodData.length === 0) {
      return {
        period,
        temp: 0,
        icon: '01d',
        pop: 'Sin datos',
        weatherId: 800,
      };
    }

    // ✅ CORRECCIÓN: Usar temperatura según período
    let temp: number;
    let representativeData: any;
    
    if (period === 'MAÑANA') {
      // Para MAÑANA: usar temperatura promedio del inicio del rango
      const morningData = periodData.slice(0, Math.ceil(periodData.length / 2));
      temp = Math.round(
        morningData.reduce((sum: number, d: any) => sum + d.main.temp, 0) / morningData.length
      );
      representativeData = morningData[0];
    } else if (period === 'TARDE') {
      // Para TARDE: usar MÁXIMA temperatura del rango
      const temps = periodData.map((d: any) => d.main.temp);
      temp = Math.round(Math.max(...temps));
      representativeData = periodData.reduce((max: any, d: any) =>
        d.main.temp > max.main.temp ? d : max
      );
    } else {
      // Para NOCHE: usar temperatura promedio
      temp = Math.round(
        periodData.reduce((sum: number, d: any) => sum + d.main.temp, 0) / periodData.length
      );
      representativeData = periodData[Math.floor(periodData.length / 2)];
    }

    const avgPop = Math.round(
      (periodData.reduce((sum: number, d: any) => sum + (d.pop || 0), 0) / periodData.length) * 100
    );

    return {
      period,
      temp,
      icon: representativeData.weather[0].icon,
      pop: `${avgPop}% Lluvia`,
      weatherId: representativeData.weather[0].id,
    };
  });
}

function mapWeatherIcon(weatherId: number, iconCode: string): string {
  const isDay = iconCode.endsWith('d');
  const prefix = isDay ? 'day-' : 'night-';
  
  const conditionKey = Object.keys(WEATHER_CONDITION_MAP).find(key => {
    const range = WEATHER_CONDITION_MAP[key].range;
    return weatherId >= range[0] && weatherId <= range[1];
  });

  // Ruta correcta: icons/ + nombre.webm (sin el "1" al final)
  return conditionKey 
    ? `icons/${prefix}${conditionKey}.webm` 
    : `icons/${prefix}clear.webm`;
}

function processDailyForecast(list: any[]): ForecastDay[] {
  const dailyData: { [key: string]: any[] } = {};
  const ARGENTINA_OFFSET = -3 * 3600; // UTC-3 in seconds
  
  list.forEach((item: any) => {
    // Adjust timestamp to Argentina timezone
    const adjustedTimestamp = (item.dt + ARGENTINA_OFFSET) * 1000;
    const date = new Date(adjustedTimestamp);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = [];
    }
    dailyData[dateKey].push(item);
  });

  // Get next 4 days excluding today (index 1 to 4 instead of 0 to 3)
  const allDays = Object.keys(dailyData).sort();
  const days = allDays.slice(1, 5);
  
  const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
  
  return days.map(dateKey => {
    const dayData = dailyData[dateKey];
    const temps = dayData.map(d => d.main.temp);
    const tempMax = Math.round(Math.max(...temps));
    const tempMin = Math.round(Math.min(...temps));
    
    const midDayData = dayData[Math.floor(dayData.length / 2)];
    // Use the adjusted timestamp to get the correct day name in Argentina timezone
    const localDate = new Date((midDayData.dt + ARGENTINA_OFFSET) * 1000);
    const dayName = dayNames[localDate.getUTCDay()];
    
    return {
      dayName,
      tempMax,
      tempMin,
      condition: midDayData.weather[0].description,
      icon: midDayData.weather[0].icon, // Store raw icon code (e.g., "01d" or "01n")
      weatherId: midDayData.weather[0].id,
    };
  });
}

function processTodayForecast(list: any[]): TimeOfDayForecast[] {
  const ARGENTINA_OFFSET = -3 * 3600; // UTC-3 in seconds
  
  const periods = [
    { period: 'MAÑANA' as const, hours: [6, 7, 8, 9, 10, 11], fallbackHours: [6, 7, 8, 9, 10, 11] },
    { period: 'TARDE' as const, hours: [12, 13, 14, 15, 16, 17, 18], fallbackHours: [12, 13, 14, 15, 16, 17, 18] },
    { period: 'NOCHE' as const, hours: [19, 20, 21, 22, 23], fallbackHours: [0, 1, 2, 3, 4, 5] },
  ];

  return periods.map(({ period, hours, fallbackHours }) => {
    // Try to find data matching the period hours in all available data
    let periodData = list.filter((item: any) => {
      const adjustedTimestamp = (item.dt + ARGENTINA_OFFSET) * 1000;
      const hour = new Date(adjustedTimestamp).getHours();
      return hours.includes(hour);
    });

    // If no data found and fallback hours exist, try fallback hours
    if (periodData.length === 0 && fallbackHours) {
      periodData = list.filter((item: any) => {
        const adjustedTimestamp = (item.dt + ARGENTINA_OFFSET) * 1000;
        const hour = new Date(adjustedTimestamp).getHours();
        return fallbackHours.includes(hour);
      });
    }

    // If still no data, use the first available data point
    if (periodData.length === 0) {
      const firstData = list[0];
      if (firstData) {
        return {
          period,
          temp: Math.round(firstData.main.temp),
          icon: firstData.weather[0].icon,
          pop: `${Math.round((firstData.pop || 0) * 100)}% Lluvia`,
          weatherId: firstData.weather[0].id,
        };
      }
      
      // Absolute fallback if no data at all
      return {
        period,
        temp: 0,
        icon: '01d', // Default icon code for clear day
        pop: 'Sin datos',
        weatherId: 800,
      };
    }

    const avgTemp = Math.round(
      periodData.reduce((sum: number, d: any) => sum + d.main.temp, 0) / periodData.length
    );
    
    const avgPop = Math.round(
      (periodData.reduce((sum: number, d: any) => sum + (d.pop || 0), 0) / periodData.length) * 100
    );

    const midPeriodData = periodData[Math.floor(periodData.length / 2)];

    return {
      period,
      temp: avgTemp,
      icon: midPeriodData.weather[0].icon, // Store raw icon code (e.g., "01d" or "01n")
      pop: `${avgPop}% Lluvia`,
      weatherId: midPeriodData.weather[0].id,
    };
  });
}