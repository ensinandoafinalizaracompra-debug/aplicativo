
import React from 'react';
import ImageSlider from './ImageSlider';
import { DownloadIcon, RefreshIcon } from './IconComponents';

interface ResultScreenProps {
  originalImage: string;
  restoredImage: string;
  onReset: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ originalImage, restoredImage, onReset }) => {

  const handleSave = () => {
    const link = document.createElement('a');
    link.href = restoredImage;
    link.download = 'foto_restaurada.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg animate-fade-in">
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
      <h1 className="text-3xl font-bold text-gray-800 mb-1">Restauração Concluída!</h1>
      <p className="text-gray-500 mb-6">Deslize para comparar o antes e o depois.</p>

      <div className="w-full mb-8 rounded-lg overflow-hidden shadow-md">
        <ImageSlider original={originalImage} restored={restoredImage} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
        >
          <DownloadIcon className="w-6 h-6" />
          Salvar Foto
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300"
        >
          <RefreshIcon className="w-6 h-6" />
          Restaurar Outra Foto
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
