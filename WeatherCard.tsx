import React from 'react';
import { ForecastDay } from './types';
import { ICON_PATH } from './constants';

interface WeatherCardProps {
  forecast: ForecastDay;
}

// Function to map weather ID to icon file name
const getWeatherIcon = (weatherId: number, iconCode: string): string => {
  const isDay = iconCode.endsWith('d');
  const prefix = isDay ? 'day-' : 'night-';
  
  let condition = 'clear';
  if (weatherId >= 200 && weatherId < 300) condition = 'storm';
  else if (weatherId >= 300 && weatherId < 400) condition = 'drizzle';
  else if (weatherId >= 500 && weatherId < 600) condition = 'rain';
  else if (weatherId >= 600 && weatherId < 700) condition = 'snow';
  else if (weatherId >= 700 && weatherId < 800) condition = 'fog';
  else if (weatherId === 800) condition = 'clear';
  else if (weatherId === 801 || weatherId === 802) condition = 'partly_cloudy';
  else if (weatherId >= 803) condition = 'cloudy';
  
  return `${ICON_PATH}${prefix}${condition}.webm`;
};

// NOTA: Este componente espera que un archivo de imagen llamado 'cont_2.webp'
// se encuentre en la carpeta raíz del proyecto para usarlo como fondo.
const WeatherCard: React.FC<WeatherCardProps> = ({ forecast }) => {
  return (
    <div className="relative h-full rounded-2xl overflow-hidden text-white shadow-lg">
      <img 
        src="cont_2.webp" 
        className="absolute inset-0 w-full h-full object-cover z-0" 
        alt="Card background" 
      />
      <div className="relative z-10 flex flex-col h-full p-1">
        <div className="flex-shrink-0 text-center mb-1">
            <h3 
              className="inline-block bg-black/25 backdrop-blur-sm text-white text-2xl font-bold px-6 py-1 rounded-md shadow-lg"
              style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}
            >
                {forecast.dayName}
            </h3>
        </div>
        <div className="flex-grow grid grid-cols-2 items-center gap-14 pl-24">
            <div className="flex flex-col items-center justify-center">
                <div className="w-40 h-40">
                    <video
                        src={getWeatherIcon(forecast.weatherId, forecast.icon)}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                        key={forecast.icon}
                    ></video>
                </div>
                <p 
                  className="text-xl font-semibold text-center mt-2 pl-0 whitespace-nowrap"
                  style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}
                >
                    {forecast.condition}
                </p>
            </div>
            <div 
              className="flex flex-col items-center justify-center font-bold text-7xl leading-tight"
              style={{textShadow: '2px 2px 5px rgba(0,0,0,0.5)'}}
            >
                <p>{forecast.tempMax}°</p>
                <p>{forecast.tempMin}°</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
