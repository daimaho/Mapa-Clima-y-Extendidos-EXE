import React from 'react';
import MapLocationCard from '../MapLocationCard';
import type { ProcessedLocationData } from '../types';
import { MAP_DISPLAY_LOCATIONS } from '../constants';

interface WeatherMapProps {
  allWeatherData: ProcessedLocationData[];
}

const WeatherMap: React.FC<WeatherMapProps> = ({ allWeatherData }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Contenedor del mapa más pequeño */}
      <div 
        className="relative"
        style={{
          width: '85vw',      // ← Mapa más pequeño (era 100vw)
          height: '85vh',     // ← Mapa más pequeño (era 100vh)
          maxWidth: '1600px',
          maxHeight: '1200px',
        }}
      >
        {/* Video del mapa */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain"
          src="/mapa.webm"
        />
        
        {/* Tarjetas posicionadas sobre el mapa */}
        {allWeatherData.map((data) => {
          const locationConfig = MAP_DISPLAY_LOCATIONS.find(
            loc => loc.name === data.location.name
          );
          
          if (!locationConfig) {
            console.warn(`No se encontró configuración para: ${data.location.name}`);
            return null;
          }
          
          return (
            <div
              key={data.location.name}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                top: locationConfig.pos.top,
                left: locationConfig.pos.left,
                zIndex: 10,
              }}
            >
              <MapLocationCard
                locationName={locationConfig.shortName}
                temp={data.current.temp}
                icon={data.current.icon}
                weatherId={data.current.weatherId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherMap;