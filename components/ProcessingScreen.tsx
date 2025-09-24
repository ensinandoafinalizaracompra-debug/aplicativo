
import React from 'react';

interface ProcessingScreenProps {
  message: string;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ message }) => {
  return (
    <div className="w-full max-w-xl text-center flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{message}</h2>
      <p className="text-gray-500 mb-8">Por favor, aguarde um momento...</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div className="h-2.5 rounded-full bg-blue-500 w-full animate-pulse" style={{ animation: 'loading-progress 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
      </div>
      <style>{`
        @keyframes loading-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ProcessingScreen;
