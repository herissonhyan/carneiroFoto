import React, { useState } from 'react';
import { ScreenType } from './types';
import SplashScreen from './components/SplashScreen';
import CtCalculator from './components/CtCalculator';
import PhotoCalculator from './components/PhotoCalculator';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenType>('splash');

  const renderScreen = () => {
    switch (screen) {
      case 'ct':
        return <CtCalculator onBack={() => setScreen('splash')} />;
      case 'photo':
        return <PhotoCalculator onBack={() => setScreen('splash')} />;
      case 'splash':
      default:
        return <SplashScreen onSelect={setScreen} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen w-full flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 transition-all duration-300">
        {renderScreen()}
      </div>
       <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Calculadora Caprina IA. All rights reserved.</p>
        </footer>
    </div>
  );
};

export default App;