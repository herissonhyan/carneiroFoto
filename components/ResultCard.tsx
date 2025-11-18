import React from 'react';
import { ResultState } from '../types';

interface ResultCardProps {
  result: ResultState;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const baseClasses = "mt-6 p-4 border-l-4 rounded-r-lg animate-fade-in flex items-start space-x-3";
  
  const typeClasses = {
    success: "bg-emerald-50 border-emerald-500 text-emerald-800",
    error: "bg-rose-50 border-rose-500 text-rose-800",
    info: "bg-sky-50 border-sky-500 text-sky-800",
  };

  const icons = {
    success: (
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    info: (
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className={`${baseClasses} ${typeClasses[result.type]}`}>
      <div>{icons[result.type]}</div>
      <div className="flex-1">
        {result.message}
      </div>
    </div>
  );
};

export default ResultCard;