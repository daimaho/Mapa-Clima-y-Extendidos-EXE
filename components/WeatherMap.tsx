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
        {/* Video de fondo del mapa */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain opacity-80"
          src="mapa.webm"
        />
        
        {/* Overlay para oscurecer un poco */}
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Tarjetas de ubicaciones encima del video */}
        <div className="relative z-10">
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
    </div>
  );
};

export default WeatherMap;
