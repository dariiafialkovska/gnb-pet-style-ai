'use client';

import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import FinalSection from './components/FinalSection';
import LoadingPreview from './components/LoadingPreview'; // adjust the path

export default function GNBStylerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState(100);
  const [mode, setMode] = useState<'upload' | 'loading' | 'result'>('upload');

  const isDragging = useRef(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setAiImage(null);
      setMode('upload');
    }
  };

  const handleGenerate = async () => {
    if (!file) return;
    setMode('loading');
    await new Promise((r) => setTimeout(r, 3000));
    setAiImage('data:image/svg+xml;base64,...');
    setMode('result');
  };

  useEffect(() => {
    if (aiImage) setSliderValue(50);
  }, [aiImage]);

  return (
    <div className="min-h-screen bg-[#fefefa] flex items-center justify-center">
      <div className="max-w-10xl w-full flex flex-col items-center justify-center">
        <Header />
        <div className="bg-[#f4f9f6] rounded-4xl border border-gray-100 overflow-hidden w-full max-w-6xl min-h-[620px] relative px-6 py-8 md:px-10 transition-all duration-500">
          <div
            className={`absolute inset-0 transition-all duration-500 ease-in-out transform ${mode === 'upload'
              ? 'opacity-100 scale-100 z-20 pointer-events-auto'
              : 'opacity-0 scale-95 z-0 pointer-events-none'
              }`}
          >
            <UploadSection
              file={file}
              previewUrl={previewUrl}
              handleFileChange={handleFileChange}
              handleGenerate={handleGenerate}
            />
          </div>
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out transform ${mode === 'loading'
              ? 'opacity-100 scale-100 z-20 pointer-events-auto'
              : 'opacity-0 scale-95 z-0 pointer-events-none'
              }`}
          >
            {previewUrl ? (
              <LoadingPreview imageUrl={previewUrl} />
            ) : (
              <div className="flex flex-col items-center">
                <div className="animate-spin w-10 h-10 border-4 border-t-[var(--color-main)] border-gray-300 rounded-full" />
                <p className="mt-4 text-gray-600">Preparing...</p>
              </div>
            )}
          </div>

          <div
            className={`absolute inset-0 transition-all duration-500 ease-in-out transform ${mode === 'result'
                ? 'opacity-100 scale-100 z-20 pointer-events-auto'
                : 'opacity-0 scale-95 z-0 pointer-events-none'
              }`}
          >
            <FinalSection
              file={file}
              previewUrl={previewUrl}
              aiImage={aiImage}
              sliderValue={sliderValue}
              setSliderValue={setSliderValue}
            />
          </div>

        </div>
      </div>
    </div>
  );
}