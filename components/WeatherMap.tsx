import React from 'react';
import { ProcessedLocationData } from '../types';
import MapLocationCard from '../MapLocationCard';
import { MAP_DISPLAY_LOCATIONS } from '../constants';

interface WeatherMapProps {
  allWeatherData: ProcessedLocationData[];
}

const WeatherMap: React.FC<WeatherMapProps> = ({ allWeatherData }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video del mapa como fondo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="mapa.webm"
      />
      
      {/* Overlay oscuro opcional */}
      <div className="absolute inset-0 bg-black/10" />
      
      {/* Contenedor de tarjetas con posicionamiento absoluto */}
      <div className="absolute inset-0">
        {allWeatherData.map((data) => {
          // Buscar posición en MAP_DISPLAY_LOCATIONS
          const locationConfig = MAP_DISPLAY_LOCATIONS.find(
            loc => loc.name === data.location.name
          );
          
          if (!locationConfig) return null;
          
          return (
            <MapLocationCard
              key={data.location.name}
              locationName={locationConfig.shortName}
              weather={data.current}
              position={locationConfig.pos}
              isVisible={true}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WeatherMap;
