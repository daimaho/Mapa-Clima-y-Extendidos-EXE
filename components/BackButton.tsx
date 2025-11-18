import React from 'react';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 left-4 z-50 bg-black/50 hover:bg-black/70 text-white px-6 py-3 rounded-lg text-xl font-semibold transition-all opacity-0 group-hover:opacity-100"
    >
      ← Volver
    </button>
  );
};

export default BackButton;
