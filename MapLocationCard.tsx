import React from 'react';
import { CurrentWeather } from './types';
import { ICON_PATH } from './constants';

interface MapLocationCardProps {
  locationName: string;
  weather: CurrentWeather;
  position: { top: string; left: string };
  isVisible: boolean;
}

const getWeatherIcon = (weatherId: number, icon: string): string => {
  const isDay = icon.endsWith('d');
  const prefix = isDay ? 'day-' : 'night-';
  
  let condition: string;
  
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
  
  return `icons/${prefix}${condition}.webm`;
};

const MapLocationCard: React.FC<MapLocationCardProps> = ({ locationName, weather, position, isVisible }) => {
  const iconPath = getWeatherIcon(weather.weatherId, weather.icon);
  
  return (
    <div
      className="absolute w-[145px] h-[185px] transition-opacity duration-300"
      style={{
        ...position,
        opacity: isVisible ? 1 : 0,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div 
        className="relative w-full h-full bg-cover bg-center text-white flex flex-col items-center justify-between p-1 rounded-lg shadow-2xl"
        style={{ backgroundImage: "url('cont_1.webp')" }}
      >
        <div className="bg-[#E6007E] text-center w-full py-1 rounded-md">
          <h3 className="font-bold text-base leading-tight tracking-wide">{locationName}</h3>
        </div>
        
        <div className="flex-grow flex items-center justify-center">
          <p 
            className="font-bold text-6xl"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
          >
            {weather.temp}°
          </p>
        </div>

        <div className="w-24 h-24 mb-1">
          <video
            src={iconPath}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain drop-shadow-lg"
            key={iconPath}
          ></video>
        </div>
      </div>
    </div>
  );
};

export default MapLocationCard;


