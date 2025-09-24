import React, { useState, useCallback } from 'react';
import { AppState } from './types';
import UploadScreen from './components/UploadScreen';
import ProcessingScreen from './components/ProcessingScreen';
import ResultScreen from './components/ResultScreen';
import { restoreImage } from './services/geminiService';
import { fileToBase64 } from './utils/imageUtils';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (file: File) => {
    try {
      setError(null);
      setAppState(AppState.PROCESSING);
      
      const base64Image = await fileToBase64(file);
      setOriginalImage(base64Image);

      const restoredImg = await restoreImage(base64Image);
      if (!restoredImg) {
        // Handle cases where the API returns no image (e.g., safety filters)
        throw new Error("A API não retornou uma imagem. Isso pode acontecer devido a filtros de segurança.");
      }
      setRestoredImage(restoredImg);
      setAppState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setError("Não foi possível restaurar esta foto. Por favor, tente outra.");
      setAppState(AppState.UPLOAD);
    }
  }, []);

  const handleReset = useCallback(() => {
    setAppState(AppState.UPLOAD);
    setOriginalImage(null);
    setRestoredImage(null);
    setError(null);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.PROCESSING:
        return <ProcessingScreen message="A mágica está acontecendo..." />;
      case AppState.RESULT:
        if (originalImage && restoredImage) {
          return (
            <ResultScreen
              originalImage={originalImage}
              restoredImage={restoredImage}
              onReset={handleReset}
            />
          );
        }
        // Se as imagens não estiverem prontas no estado de resultado, volta para o upload.
        return <UploadScreen onImageSelect={handleImageSelect} error="Ocorreu um erro inesperado. Por favor, comece de novo." />;
      case AppState.UPLOAD:
      default:
        return <UploadScreen onImageSelect={handleImageSelect} error={error} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 flex flex-col items-center justify-center p-4 transition-colors duration-500">
      {renderContent()}
    </div>
  );
};

export default App;