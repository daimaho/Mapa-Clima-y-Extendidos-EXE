import React from 'react';
import { ProcessedLocationData } from '../types';
import WeatherCard from '../WeatherCard';

interface LocationDisplayProps {
  data: ProcessedLocationData;
  isVisible: boolean;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ data, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
      <div className="bg-black/30 backdrop-blur-sm rounded-3xl p-8 w-full max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
            {data.location.name}
          </h1>
          <p className="text-3xl text-white/90">Pronóstico Extendido - 4 Días</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {data.forecast.map((day, index) => (
            <div key={index} className="h-[280px]">
              <WeatherCard forecast={day} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationDisplay;
