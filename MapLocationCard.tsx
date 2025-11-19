import React from 'react';

interface MapLocationCardProps {
  locationName: string;
  temp: number;
  icon: string;
  weatherId: number;
}

const MapLocationCard: React.FC<MapLocationCardProps> = ({ 
  locationName, 
  temp, 
  icon, 
  weatherId 
}) => {
  const getWeatherIcon = (weatherId: number, iconCode: string): string => {
    const isDay = iconCode.endsWith('d');
    const prefix = isDay ? 'day-' : 'night-';
    
    let condition = 'clear';
    
    if (weatherId >= 200 && weatherId <= 299) condition = 'storm';
    else if (weatherId >= 300 && weatherId <= 399) condition = 'drizzle';
    else if (weatherId >= 500 && weatherId <= 599) condition = 'rain';
    else if (weatherId >= 600 && weatherId <= 699) condition = 'snow';
    else if (weatherId >= 700 && weatherId <= 799) condition = 'fog';
    else if (weatherId === 800) condition = 'clear';
    else if (weatherId === 801 || weatherId === 802) condition = 'partly_cloudy';
    else if (weatherId >= 803) condition = 'cloudy';
    
    return `icons/${prefix}${condition}.webm`;
  };

  return (
    <div className="relative rounded-lg overflow-hidden shadow-2xl" style={{ width: '120px', height: '165px' }}>
      {/* Imagen de fondo cont_3.webp */}
      <img
        src="/cont_3.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Contenido encima de la imagen */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Nombre de la localidad con fondo #e50077 */}
        <div 
          className="text-center px-2 py-1"
          style={{ backgroundColor: '#e50077' }}
        >
          <h3 className="text-xs font-bold text-white uppercase leading-tight">
            {locationName}
          </h3>
        </div>
        
        {/* Temperatura en el medio - MÁS GRANDE */}
        <div className="flex-1 flex items-center justify-center">
          <p className="text-5xl font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            {temp}°
          </p>
        </div>
        
        {/* Icono abajo */}
        <div className="flex justify-center pb-2">
          <div style={{ width: '70px', height: '70px' }}>
            <video
              src={getWeatherIcon(weatherId, icon)}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain drop-shadow-lg"
            ></video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLocationCard;