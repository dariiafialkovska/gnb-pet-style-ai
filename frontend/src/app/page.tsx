'use client';

import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import FinalSection from './components/FinalSection';
import LoadingPreview from './components/LoadingPreview';
import { generateImageWithOpenAI } from '@/lib/api';

export default function Home() {
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

  console.log("📤 Sending file to backend...");

  try {
    setMode('loading');

    const result = await generateImageWithOpenAI(file);

    console.log("✅ Received AI image from backend:", result);

    setAiImage(result);
    setMode('result');
  } catch (err) {
    console.error("❌ Error in handleGenerate:", err);
    alert("Something went wrong");
    setMode('upload');
  }
};


  useEffect(() => {
    if (aiImage) setSliderValue(50);
  }, [aiImage]);

  return (
    <div className="min-h-screen bg-[#fefefa] flex items-center justify-center">
      <div className="max-w-10xl w-full flex flex-col items-center justify-center">
        <Header />
        <div className="bg-[#f4f9f6] rounded-4xl border border-gray-100 overflow-hidden w-full max-w-6xl min-h-[620px] relative px-6 py-8 md:px-10 transition-all duration-500">

          {/* Upload Mode */}
          {mode === 'upload' && (
            <div className="absolute inset-0 z-20 transition-all duration-500">
              <UploadSection
                file={file}
                previewUrl={previewUrl}
                handleFileChange={handleFileChange}
                handleGenerate={handleGenerate}
              />
            </div>
          )}

          {/* Loading Mode */}
          {mode === 'loading' && (
            <div className="absolute inset-0 z-20 flex items-center justify-center transition-all duration-500">
              {previewUrl ? (
                <LoadingPreview imageUrl={previewUrl} />
              ) : (
                <div className="flex flex-col items-center">
                  <div className="animate-spin w-10 h-10 border-4 border-t-[var(--color-main)] border-gray-300 rounded-full" />
                  <p className="mt-4 text-gray-600">Preparing...</p>
                </div>
              )}
            </div>
          )}

          {/* Result Mode */}
          {mode === 'result' && aiImage && previewUrl && (
            <div className="absolute inset-0 z-20 transition-all duration-500">
              <FinalSection
                previewUrl={previewUrl}
                aiImage={aiImage}
                sliderValue={sliderValue}
                setSliderValue={setSliderValue}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
