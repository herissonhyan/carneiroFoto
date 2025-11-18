"use client";

import React, { useState } from 'react';
import { ResultState } from '@/lib/types';
import ResultCard from './ResultCard';
import BackButton from './BackButton';

interface CtCalculatorProps {
  onBack: () => void;
}

const CtCalculator: React.FC<CtCalculatorProps> = ({ onBack }) => {
  const [ct, setCt] = useState('');
  const [result, setResult] = useState<ResultState | null>(null);

  const handleCalculate = () => {
    const ctValue = parseFloat(ct);

    if (isNaN(ctValue) || ctValue <= 0) {
      setResult({
        type: 'error',
        message: 'Por favor, informe uma circunferência torácica válida e positiva.',
      });
      return;
    }

    // Fórmula quadrática (Peso = 0.00073 * CT² - 0.031 * CT + 2.4)
    const peso = (0.00073 * Math.pow(ctValue, 2)) - (0.031 * ctValue) + 2.4;

    setResult({
      type: 'success',
      message: (
        <>
          <p className="font-bold text-lg">Peso Estimado: {peso.toFixed(2)} kg</p>
          <p className="text-sm text-gray-600 mt-1">Baseado em CT de {ctValue.toFixed(1)} cm.</p>
        </>
      ),
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCt(e.target.value);
    if(result) {
        setResult(null);
    }
  }

  return (
    <div className="animate-fade-in relative">
      <BackButton onClick={onBack} />
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Medida Manual 📏</h2>
        <p className="text-slate-500">Use a Circunferência Torácica.</p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="ct-input" className="block text-sm font-medium text-slate-700">
          Informe a Circunferência Torácica (em cm):
        </label>
        <input
          type="number"
          id="ct-input"
          value={ct}
          onChange={handleInputChange}
          placeholder="Ex: 80.5 cm"
          step="0.1"
          min="10"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
        />
      </div>

      <button
        onClick={handleCalculate}
        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg mt-8 transition-all duration-300 transform hover:scale-105 disabled:bg-sky-300 disabled:cursor-not-allowed"
        disabled={!ct}
      >
        Calcular Peso
      </button>

      {result && <ResultCard result={result} />}
    </div>
  );
};

export default CtCalculator;