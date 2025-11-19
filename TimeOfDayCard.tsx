import React from 'react';
import { TimeOfDayForecast } from './types';

interface TimeOfDayCardProps {
  forecast: TimeOfDayForecast;
}

const TimeOfDayCard: React.FC<TimeOfDayCardProps> = ({ forecast }) => {
  const getWeatherIcon = (weatherId: number, iconCode: string, pop: string): string => {
    const isDay = iconCode.endsWith('d');
    const prefix = isDay ? 'day-' : 'night-';
    
    const popValue = parseInt(pop.replace(/[^0-9]/g, '')) || 0;
    
    let condition = 'clear';
    
    if (popValue > 20) {
      if (weatherId >= 200 && weatherId <= 299) condition = 'storm';
      else if (weatherId >= 300 && weatherId <= 399) condition = 'drizzle';
      else if (weatherId >= 500 && weatherId <= 599) condition = 'rain';
    }
    
    if (weatherId >= 600 && weatherId <= 699) condition = 'snow';
    else if (weatherId >= 700 && weatherId <= 799) condition = 'fog';
    else if (weatherId === 800) condition = 'clear';
    else if (weatherId >= 801 && weatherId <= 802) condition = 'partly_cloudy';
    else if (weatherId >= 803) condition = 'cloudy';
    
    return `icons/${prefix}${condition}.webm`;
  };

  return (
    <div className="relative w-80 h-96 rounded-2xl overflow-hidden shadow-2xl">
      {/* Imagen de fondo cont_3.webp */}
      <img
        src="cont_3.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Contenido encima de la imagen */}
      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Encabezado */}
        <h3 className="text-2xl font-bold text-white mb-4 text-center bg-pink-600 rounded-lg py-2">
          {forecast.period}
        </h3>
        
        {/* Icono del clima */}
        <div className="flex justify-center items-center mb-4 flex-1">
          <div className="w-32 h-32">
            <video
              src={getWeatherIcon(forecast.weatherId, forecast.icon, forecast.pop)}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain drop-shadow-lg"
            ></video>
          </div>
        </div>
        
        {/* Temperatura y probabilidad */}
        <div className="text-center">
          <p className="text-6xl font-bold text-white mb-2">{forecast.temp}°C</p>
          <p className="text-xl text-cyan-300 font-semibold bg-cyan-900/50 rounded-lg py-2 px-4">
            {forecast.pop}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimeOfDayCard;