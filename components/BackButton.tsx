import React from 'react';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
     <button
      onClick={onClick}
      className="absolute top-6 left-6 flex items-center justify-center w-10 h-10 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors duration-200 text-slate-600"
      aria-label="Voltar ao início"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button> 
  );
};

export default BackButton;