"use client";

import React from 'react';
import { ScreenType } from '@/lib/types';

interface SplashScreenProps {
  onSelect: (screen: ScreenType) => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
      <div className="text-8xl mb-4 animate-bounce" role="img" aria-label="goat">🐐</div>
      <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">Calculadora Caprina IA</h1>
      <p className="text-slate-600 mb-10 max-w-xs">Escolha o método para estimar o peso do seu animal.</p>
      
      <div className="space-y-4 w-full">
        <button 
          onClick={() => onSelect('ct')}
          className="w-full text-left p-5 border border-slate-200 rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-all duration-300 group"
        >
          <div className="flex items-center">
              <div className="bg-sky-100 text-sky-600 rounded-lg p-3 mr-4">
                  <span className="text-3xl">📏</span>
              </div>
              <div>
                  <h2 className="font-bold text-slate-800 text-lg">Medida Manual</h2>
                  <p className="text-slate-500 text-sm">Use a fita métrica.</p>
              </div>
          </div>
        </button>

        <button 
          onClick={() => onSelect('photo')}
          className="w-full text-left p-5 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 group"
        >
          <div className="flex items-center">
              <div className="bg-emerald-100 text-emerald-600 rounded-lg p-3 mr-4">
                  <span className="text-3xl">📸</span>
              </div>
              <div>
                  <h2 className="font-bold text-slate-800 text-lg">Análise com IA</h2>
                  <p className="text-slate-500 text-sm">Envie uma foto do animal.</p>
              </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;