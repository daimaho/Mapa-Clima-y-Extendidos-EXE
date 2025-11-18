import React from 'react';
import { ProcessedLocationData } from '../types';
import TimeOfDayCard from '../TimeOfDayCard';

interface ResistenciaForecastProps {
  data: ProcessedLocationData;
}

const ResistenciaForecast: React.FC<ResistenciaForecastProps> = ({ data }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
      <div className="bg-black/30 backdrop-blur-sm rounded-3xl p-8 w-full max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
            Resistencia - Pronóstico del Día
          </h1>
          <p className="text-3xl text-white/90">Mañana, Tarde y Noche</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          {data.todayForecast.map((period, index) => (
            <TimeOfDayCard key={index} forecast={period} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResistenciaForecast;
