import React from 'react';
import MapLocationCard from '../MapLocationCard';
import type { ProcessedLocationData } from '../types';
import { MAP_DISPLAY_LOCATIONS } from '../constants';

interface WeatherMapProps {
  allWeatherData: ProcessedLocationData[];
}

const WeatherMap: React.FC<WeatherMapProps> = ({ allWeatherData }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video del mapa con 100% opacidad y más grande */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-110"
        style={{ opacity: 1 }}
        src="mapa.webm"
      />
      
      {/* Tarjetas posicionadas absolutamente sobre el video */}
      {allWeatherData.map((data) => {
        const locationConfig = MAP_DISPLAY_LOCATIONS.find(
          loc => loc.name === data.location.name
        );
        
        if (!locationConfig) return null;
        
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
  );
};

export default WeatherMap;