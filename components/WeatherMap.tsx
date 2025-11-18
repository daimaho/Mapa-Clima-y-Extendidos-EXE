import React from 'react';
import { ProcessedLocationData } from '../types';
import MapLocationCard from '../MapLocationCard';
import { MAP_DISPLAY_LOCATIONS } from '../constants';

interface WeatherMapProps {
  allWeatherData: ProcessedLocationData[];
}

const WeatherMap: React.FC<WeatherMapProps> = ({ allWeatherData }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-8">
      <div className="relative w-full h-full max-w-[90vw] max-h-[90vh] rounded-3xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="/mapa_chaco.png" 
            alt="Mapa del Chaco" 
            className="max-w-full max-h-full object-contain opacity-80"
          />
        </div>
        
        {allWeatherData.map((data) => {
          const mapLocation = MAP_DISPLAY_LOCATIONS.find(loc => loc.name === data.location.name);
          const position = mapLocation?.pos || { top: '50%', left: '50%' };
          return (
            <MapLocationCard
              key={data.location.name}
              locationName={data.location.name}
              weather={data.current}
              position={position}
              isVisible={true}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WeatherMap;
