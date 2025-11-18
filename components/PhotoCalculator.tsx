"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ResultState } from '@/lib/types';
import ResultCard from './ResultCard';
import BackButton from './BackButton';
import Spinner from './Spinner';
import { estimateWeightFromImage } from '@/services/geminiService';

interface PhotoCalculatorProps {
  onBack: () => void;
}

const PhotoCalculator: React.FC<PhotoCalculatorProps> = ({ onBack }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    setResult(null);
    
    // First, try to get the environment-facing camera
    try {
      const environmentStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(environmentStream);
      if (videoRef.current) {
        videoRef.current.srcObject = environmentStream;
      }
    } catch (err) {
      console.warn('Could not get environment camera, trying default camera.', err);
      // If that fails, try to get any available camera
      try {
        const anyStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(anyStream);
        if (videoRef.current) {
          videoRef.current.srcObject = anyStream;
        }
      } catch (finalErr) {
        console.error('Error accessing camera:', finalErr);
        let message = 'Não foi possível acessar a câmera.';
        if (finalErr instanceof Error) {
            switch (finalErr.name) {
                case 'NotAllowedError':
                    message = 'Você precisa dar permissão para a câmera no seu navegador.';
                    break;
                case 'NotFoundError':
                    message = 'Nenhuma câmera foi encontrada no seu dispositivo.';
                    break;
                default:
                    message = 'Ocorreu um erro ao tentar acessar a câmera. Verifique as permissões.';
            }
        }
        setError(message);
      }
    }
  }, []);
  
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const capturedFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
          setImageFile(capturedFile);
          setCapturedImage(URL.createObjectURL(blob));
          stopCamera();
        }
      }, 'image/jpeg');
    }
  }, [stopCamera]);

  const handleRetake = useCallback(() => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(null);
    setImageFile(null);
    setResult(null);
    startCamera();
  }, [capturedImage, startCamera]);

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) {
      setError('Nenhuma imagem capturada para analisar.');
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const estimation = await estimateWeightFromImage(imageFile);
      setResult({
        type: 'success',
        message: (
          <>
            <p className="font-bold text-lg">Peso Estimado: {estimation.estimatedWeightKg.toFixed(2)} kg</p>
            <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold">Justificativa da IA:</span> {estimation.reasoning}
            </p>
          </>
        )
      });
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
      setResult({
        type: 'error',
        message: `Falha na análise da IA: ${errorMessage}`
      });
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (capturedImage) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, [capturedImage]);

  return (
    <div className="animate-fade-in relative">
      <BackButton onClick={onBack} />
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Análise com IA 📸</h2>
        <p className="text-slate-500">Aponte a câmera para o animal.</p>
      </div>
      
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-md mb-6">
        {capturedImage ? (
          <img src={capturedImage} alt="Animal capturado" className="w-full h-full object-cover" />
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        )}
        {!stream && !capturedImage && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Spinner />
                <p className="text-white ml-3">Iniciando câmera...</p>
            </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {error && !result && <ResultCard result={{type: 'error', message: error}} />}
      
      <div className="flex flex-col space-y-4">
        {!capturedImage ? (
           <button
            onClick={handleCapture}
            disabled={!stream || isLoading}
            aria-label="Tirar Foto"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center disabled:bg-sky-300 disabled:cursor-not-allowed"
          >
            Tirar Foto
          </button>
        ) : (
          <>
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center disabled:bg-emerald-300 disabled:cursor-not-allowed"
            >
              {isLoading ? <Spinner /> : 'Analisar com IA'}
            </button>
            <button
              onClick={handleRetake}
              disabled={isLoading}
              className="w-full bg-slate-500 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-all"
            >
              Tirar Outra Foto
            </button>
          </>
        )}
      </div>

      {isLoading && !result && (
        <div className="text-center mt-4 text-slate-600 text-sm">
            <p>A IA está analisando a imagem...</p>
            <p>Isso pode levar alguns segundos.</p>
        </div>
      )}

      {result && <ResultCard result={result} />}
    </div>
  );
};

export default PhotoCalculator;