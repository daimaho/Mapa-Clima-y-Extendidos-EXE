import React from 'react';
import { ProcessedLocationData } from '../types';
import MapLocationCard from '../MapLocationCard';

interface WeatherMapProps {
  allWeatherData: ProcessedLocationData[];
}

const locationPositions: { [key: string]: { top: string; left: string } } = {
  'Resistencia': { top: '45%', left: '50%' },
  'Presidencia Roque Sáenz Peña': { top: '35%', left: '65%' },
  'Villa Ángela': { top: '25%', left: '55%' },
  'Charata': { top: '30%', left: '75%' },
  'General San Martín': { top: '50%', left: '70%' },
  'Las Breñas': { top: '40%', left: '80%' },
  'Corzuela': { top: '45%', left: '85%' },
  'Makallé': { top: '55%', left: '60%' },
  'Hermoso Campo': { top: '35%', left: '40%' },
};

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
          const position = locationPositions[data.location.name] || { top: '50%', left: '50%' };
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
