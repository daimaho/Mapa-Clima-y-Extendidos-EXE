import { 
  Location, 
  ProcessedLocationData, 
  OpenWeatherResponse, 
  ForecastDay,
  CurrentWeather,
  TimeOfDayForecast,
  ForecastListItem
} from '../types';
import { 
  API_KEY, 
  API_BASE_URL, 
  WEATHER_CONDITION_MAP, 
  CONDITION_PRIORITY,
  CONDITION_TEXT_MAP_ES
} from '../constants';

function getWeatherCondition(weatherId: number): string {
  return WEATHER_CONDITION_MAP[weatherId] || 'clear';
}

function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[date.getDay()];
}

function getDominantCondition(items: ForecastListItem[]): { condition: string; icon: string } {
  let dominantCondition = 'clear';
  let maxPriority = 0;
  let icon = '01d.mp4';

  items.forEach(item => {
    if (item.weather && item.weather.length > 0) {
      const condition = getWeatherCondition(item.weather[0].id);
      const priority = CONDITION_PRIORITY[condition] || 0;
      
      if (priority > maxPriority) {
        maxPriority = priority;
        dominantCondition = condition;
        icon = `${item.weather[0].icon}.mp4`;
      }
    }
  });

  return { condition: dominantCondition, icon };
}

function processForecastData(data: OpenWeatherResponse): ForecastDay[] {
  const dailyData: { [key: string]: ForecastListItem[] } = {};
  
  // Group forecast items by day
  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(item);
  });

  // Process each day
  const forecastDays: ForecastDay[] = [];
  const dates = Object.keys(dailyData).slice(0, 4); // Get first 4 days

  dates.forEach(date => {
    const dayItems = dailyData[date];
    const temps = dayItems.map(item => item.main.temp);
    const tempMax = Math.round(Math.max(...temps));
    const tempMin = Math.round(Math.min(...temps));
    
    const { condition, icon } = getDominantCondition(dayItems);
    
    forecastDays.push({
      dayName: getDayName(date),
      tempMax,
      tempMin,
      condition: CONDITION_TEXT_MAP_ES[condition] || 'Despejado',
      icon
    });
  });

  return forecastDays;
}

function processTimeOfDayForecasts(data: OpenWeatherResponse): TimeOfDayForecast[] {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Filter for today's data
  const todayItems = data.list.filter(item => item.dt_txt.startsWith(todayStr));
  
  const periods: TimeOfDayForecast[] = [];
  
  // Morning (6:00 - 12:00)
  const morningItems = todayItems.filter(item => {
    const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0]);
    return hour >= 6 && hour < 12;
  });
  
  if (morningItems.length > 0) {
    const avgTemp = Math.round(morningItems.reduce((sum, item) => sum + item.main.temp, 0) / morningItems.length);
    const avgPop = morningItems.reduce((sum, item) => sum + (item.pop || 0), 0) / morningItems.length;
    const { icon } = getDominantCondition(morningItems);
    
    periods.push({
      period: 'MAÑANA',
      temp: avgTemp,
      icon,
      pop: `${Math.round(avgPop * 100)}%`
    });
  }
  
  // Afternoon (12:00 - 18:00)
  const afternoonItems = todayItems.filter(item => {
    const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0]);
    return hour >= 12 && hour < 18;
  });
  
  if (afternoonItems.length > 0) {
    const avgTemp = Math.round(afternoonItems.reduce((sum, item) => sum + item.main.temp, 0) / afternoonItems.length);
    const avgPop = afternoonItems.reduce((sum, item) => sum + (item.pop || 0), 0) / afternoonItems.length;
    const { icon } = getDominantCondition(afternoonItems);
    
    periods.push({
      period: 'TARDE',
      temp: avgTemp,
      icon,
      pop: `${Math.round(avgPop * 100)}%`
    });
  }
  
  // Night (18:00 - 23:59)
  const nightItems = todayItems.filter(item => {
    const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0]);
    return hour >= 18;
  });
  
  if (nightItems.length > 0) {
    const avgTemp = Math.round(nightItems.reduce((sum, item) => sum + item.main.temp, 0) / nightItems.length);
    const avgPop = nightItems.reduce((sum, item) => sum + (item.pop || 0), 0) / nightItems.length;
    const { icon } = getDominantCondition(nightItems);
    
    periods.push({
      period: 'NOCHE',
      temp: avgTemp,
      icon,
      pop: `${Math.round(avgPop * 100)}%`
    });
  }
  
  return periods;
}

function getCurrentWeather(data: OpenWeatherResponse): CurrentWeather {
  const current = data.list[0]; // First item is the current/nearest forecast
  const condition = getWeatherCondition(current.weather[0].id);
  
  return {
    temp: Math.round(current.main.temp),
    condition: CONDITION_TEXT_MAP_ES[condition] || 'Despejado',
    icon: `${current.weather[0].icon}.mp4`
  };
}

export async function fetchWeatherForLocation(location: Location): Promise<ProcessedLocationData> {
  const url = `${API_BASE_URL}?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric&lang=es`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: OpenWeatherResponse = await response.json();
    
    return {
      location,
      forecast: processForecastData(data),
      current: getCurrentWeather(data),
      todayForecast: processTimeOfDayForecasts(data)
    };
  } catch (error) {
    console.error(`Error fetching weather for ${location.name}:`, error);
    throw error;
  }
}
