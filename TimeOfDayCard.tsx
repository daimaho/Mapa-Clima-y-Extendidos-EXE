import React from 'react';
import { TimeOfDayForecast } from './types';
import { ICON_PATH } from './constants';

interface TimeOfDayCardProps {
  forecast: TimeOfDayForecast;
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

const TimeOfDayCard: React.FC<TimeOfDayCardProps> = ({ forecast }) => {
  return (
    <div 
        className="relative w-[380px] h-[530px] bg-cover bg-center text-white flex flex-col items-center justify-between p-3 shadow-2xl rounded-2xl overflow-hidden"
        style={{ backgroundImage: "url('cont_3.webp')" }}
    >
        <div className="bg-[#E6007E] text-center w-full py-1.5 rounded-lg mt-1">
            <h3 className="font-bold text-3xl tracking-wider">{forecast.period}</h3>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center w-full -mt-4 pl-1">
            <div className="w-44 h-44">
                <video
                    src={getWeatherIcon(forecast.weatherId, forecast.icon)}
                    autoPlay loop muted playsInline
                    className="w-full h-full object-contain drop-shadow-lg"
                    key={forecast.icon}
                ></video>
            </div>

            <p className="font-bold text-8xl leading-none mt-2" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}>
                {forecast.temp}°C
            </p>
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


