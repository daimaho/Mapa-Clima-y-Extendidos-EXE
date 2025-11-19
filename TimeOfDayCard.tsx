import React from 'react';
import { TimeOfDayForecast } from './types';

interface TimeOfDayCardProps {
  forecast: TimeOfDayForecast;
}

const getWeatherIcon = (weatherId: number, icon: string, pop: string): string => {
  const isDay = icon.endsWith('d');
  const prefix = isDay ? 'day-' : 'night-';
  
  // Si la probabilidad de lluvia es muy baja (< 10%), ignorar códigos de lluvia
  const popValue = parseInt(pop.replace(/[^0-9]/g, '')) || 0;
  
  let condition: string;
  
  if (popValue >= 10) { // Solo mostrar lluvia si >= 10%
    if (weatherId >= 200 && weatherId <= 299) {
      condition = 'storm';
    } else if (weatherId >= 300 && weatherId <= 399) {
      condition = 'drizzle';
    } else if (weatherId >= 500 && weatherId <= 599) {
      condition = 'rain';
    } else if (weatherId >= 600 && weatherId <= 699) {
      condition = 'snow';
    } else if (weatherId >= 700 && weatherId <= 799) {
      condition = 'fog';
    } else if (weatherId === 800) {
      condition = 'clear';
    } else if (weatherId >= 801 && weatherId <= 802) {
      condition = 'partly_cloudy';
    } else {
      condition = 'cloudy';
    }
  } else {
    // Con baja probabilidad de lluvia, ignorar códigos de precipitación
    if (weatherId >= 600 && weatherId <= 699) {
      condition = 'snow';
    } else if (weatherId >= 700 && weatherId <= 799) {
      condition = 'fog';
    } else if (weatherId === 800) {
      condition = 'clear';
    } else if (weatherId >= 801 && weatherId <= 802) {
      condition = 'partly_cloudy';
    } else if (weatherId >= 803) {
      condition = 'cloudy';
    } else {
      // Para códigos de precipitación con baja probabilidad, mostrar despejado o parcialmente nublado
      condition = 'clear';
    }
  }
  
  return `icons/${prefix}${condition}.webm`;
};

const TimeOfDayCard: React.FC<TimeOfDayCardProps> = ({ forecast }) => {
  const iconPath = getWeatherIcon(forecast.weatherId, forecast.icon, forecast.pop);
  const hasData = forecast.pop !== 'Sin datos';
  
  return (
    <div 
        className="relative w-[380px] h-[530px] bg-cover bg-center text-white flex flex-col items-center justify-between p-3 shadow-2xl rounded-2xl overflow-hidden"
        style={{ backgroundImage: "url('cont_3.webp')" }}
    >
        <div className="bg-[#E6007E] text-center w-full py-1.5 rounded-lg mt-1">
            <h3 className="font-bold text-3xl tracking-wider">{forecast.period}</h3>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center w-full -mt-4 pl-1">
            {hasData ? (
              <>
                <div className="w-44 h-44">
                    <video
                        src={iconPath}
                        autoPlay loop muted playsInline
                        className="w-full h-full object-contain drop-shadow-lg"
                        key={iconPath}
                    ></video>
                </div>

                <p className="font-bold text-8xl leading-none mt-2" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}>
                    {forecast.temp}°C
                </p>
              </>
            ) : (
              <p className="font-bold text-4xl" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}>
                Sin datos
              </p>
            )}
        </div>

        <div className="w-full mb-3 px-3 pl-1">
            <div className="bg-[#2D758F] text-center w-full py-2.5 rounded-lg">
                <p className="font-semibold text-3xl tracking-wider">{forecast.pop}</p>
            </div>
        </div>
    </div>
  );
};

export default TimeOfDayCard;


