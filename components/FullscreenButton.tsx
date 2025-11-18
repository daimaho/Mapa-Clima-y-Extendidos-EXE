import React, { useState } from 'react';

const FullscreenButton: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white px-6 py-3 rounded-lg text-xl font-semibold transition-all"
    >
      {isFullscreen ? '⊡ Salir' : '⛶ Pantalla Completa'}
    </button>
  );
};

export default FullscreenButton;
