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

  return conditionKey ? `${prefix}${conditionKey}.webm` : `${prefix}clear.webm`;
}

function processDailyForecast(list: any[]): ForecastDay[] {
  const dailyData: { [key: string]: any[] } = {};
  
  list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = [];
    }
    dailyData[dateKey].push(item);
  });

  const days = Object.keys(dailyData).slice(0, 4);
  
  return days.map(dateKey => {
    const dayData = dailyData[dateKey];
    const temps = dayData.map(d => d.main.temp);
    const tempMax = Math.round(Math.max(...temps));
    const tempMin = Math.round(Math.min(...temps));
    
    const midDayData = dayData[Math.floor(dayData.length / 2)];
    const date = new Date(dateKey);
    const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase();
    
    return {
      dayName,
      tempMax,
      tempMin,
      condition: midDayData.weather[0].description,
      icon: mapWeatherIcon(midDayData.weather[0].id, midDayData.weather[0].icon),
    };
  });
}

function processTodayForecast(list: any[]): TimeOfDayForecast[] {
  const today = new Date().toISOString().split('T')[0];
  const todayData = list.filter((item: any) => {
    const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
    return itemDate === today;
  });

  const periods = [
    { period: 'MAÑANA', hours: [6, 7, 8, 9, 10, 11] },
    { period: 'TARDE', hours: [12, 13, 14, 15, 16, 17, 18] },
    { period: 'NOCHE', hours: [19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5] },
  ];

  return periods.map(({ period, hours }) => {
    const periodData = todayData.filter((item: any) => {
      const hour = new Date(item.dt * 1000).getHours();
      return hours.includes(hour);
    });

    if (periodData.length === 0) {
      return {
        period,
        temp: 0,
        icon: 'day-clear.mp4',
        pop: 'Sin datos',
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
    };
  });
}