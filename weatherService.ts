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
      icon: mapWeatherIcon(currentData.weather[0].id, currentData.weather[0].icon),
    };

    // Process 4-day forecast
    const forecast: ForecastDay[] = processDailyForecast(forecastData.list);

    // Process today's forecast (morning, afternoon, night)
    const todayForecast: TimeOfDayForecast[] = processTodayForecast(forecastData.list);

    return {
      location,
      current,
      forecast,
      todayForecast,
    };
  } catch (error) {
    console.error(`Error fetching weather for ${location.name}:`, error);
    throw error;
  }
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
      icon: mapWeatherIcon(midDayData.weather[0].id, midDayData.weather[0].icon),
      weatherId: midDayData.weather[0].id,
    };
  });
}

function processTodayForecast(list: any[]): TimeOfDayForecast[] {
  const ARGENTINA_OFFSET = -3 * 3600; // UTC-3 in seconds
  // Get current time in Argentina timezone
  const now = new Date();
  const argentinaTime = new Date(now.getTime() + ARGENTINA_OFFSET * 1000);
  const today = argentinaTime.toISOString().split('T')[0];
  const todayData = list.filter((item: any) => {
    const adjustedTimestamp = (item.dt + ARGENTINA_OFFSET) * 1000;
    const itemDate = new Date(adjustedTimestamp).toISOString().split('T')[0];
    return itemDate === today;
  });

  const periods = [
    { period: 'MAÑANA' as const, hours: [6, 7, 8, 9, 10, 11] },
    { period: 'TARDE' as const, hours: [12, 13, 14, 15, 16, 17, 18] },
    { period: 'NOCHE' as const, hours: [19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5] },
  ];

  return periods.map(({ period, hours }) => {
    const periodData = todayData.filter((item: any) => {
      const adjustedTimestamp = (item.dt + ARGENTINA_OFFSET) * 1000;
      const hour = new Date(adjustedTimestamp).getHours();
      return hours.includes(hour);
    });

    if (periodData.length === 0) {
      return {
        period,
        temp: 0,
        icon: 'icons/day-clear.webm',
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
      icon: mapWeatherIcon(midPeriodData.weather[0].id, midPeriodData.weather[0].icon),
      pop: `${avgPop}% Lluvia`,
      weatherId: midPeriodData.weather[0].id,
    };
  });
}