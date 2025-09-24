import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon, SparklesIcon } from './IconComponents';

interface UploadScreenProps {
  onImageSelect: (file: File) => void;
  error: string | null;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onImageSelect, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      } else {
        // A simple alert is fine for now. In a real app, you'd use a state for this error.
        alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, etc.).');
      }
    }
  }, [onImageSelect]);

  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };
  
  const onContainerClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl text-center flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg transition-all duration-300 animate-fade-in">
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
      <div className="p-3 bg-blue-100 rounded-full mb-4">
        <SparklesIcon className="w-8 h-8 text-blue-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Restaure Suas Fotos Antigas</h1>
      <p className="text-gray-500 mb-6">Dê nova vida às suas memórias com o poder da IA.</p>
      
      <div
        onClick={onContainerClick}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`w-full p-10 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onFileInputChange}
        />
        <div className="flex flex-col items-center justify-center text-gray-500">
            <UploadIcon className="w-12 h-12 mb-4 text-gray-400" />
            <p className="font-semibold">
              <span className="text-blue-600">Clique para enviar</span> ou arraste e solte
            </p>
            <p className="text-sm text-gray-400 mt-1">PNG, JPG, WEBP, etc.</p>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 text-red-600 bg-red-100 border border-red-200 rounded-lg px-4 py-2 w-full text-sm" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default UploadScreen;
