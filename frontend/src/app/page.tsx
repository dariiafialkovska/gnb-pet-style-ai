'use client';

import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import FinalSection from './components/FinalSection';
import LoadingPreview from './components/LoadingPreview';
import { generateImageWithOpenAI } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState(100);
  const [mode, setMode] = useState<'upload' | 'loading' | 'result'>('upload');
  const [isMobile, setIsMobile] = useState(false);
  const [scenario, setScenario] = useState('Lemon Fresh Morning');
  const [clothing, setClothing] = useState('Hoodie');


  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes

    if (!allowedTypes.includes(selected.type)) {
      toast.error('Only PNG and JPEG files are allowed.');
      return;
    }

    if (selected.size > maxSize) {
      toast.error('Image size must be less than 10MB.');
      return;
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setAiImage(null);
    setMode('upload');
  };


  const handleGenerate = async () => {
    if (!file) return;

    console.log("📤 Sending file to backend with:", scenario, clothing);

    try {
      setMode('loading');

      const result = await generateImageWithOpenAI(file, scenario, clothing);

      console.log("✅ Received AI image from backend:", result);

      setAiImage(result);
      setMode('result');
    } catch (err) {
      console.error("❌ Error in handleGenerate:", err);
      toast.error("Something went wrong");
      setMode('upload');
    }
  };


  useEffect(() => {
    if (aiImage) setSliderValue(50);
  }, [aiImage]);

  return (
    <div className="min-h-screen bg-[#fefefa] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-6xl w-full flex flex-col items-center justify-center">
        <Header />
        <div className={`bg-[#f4f9f6] rounded-2xl sm:rounded-4xl border border-gray-100 overflow-hidden w-full transition-all duration-500 ${isMobile
          ? 'min-h-fit' // Let content determine height on mobile
          : 'min-h-[620px] relative' // Fixed height on desktop
          } ${!isMobile ? 'p-4 sm:px-6 sm:py-8 md:px-10' : ''}`}>

          {/* Upload Mode */}
          {mode === 'upload' && (
            <div className={isMobile ? '' : 'absolute inset-0 z-20 transition-all duration-500'}>
              <UploadSection
                file={file}
                previewUrl={previewUrl}
                handleFileChange={handleFileChange}
                handleGenerate={handleGenerate}
                selectedScenario={scenario}
                setSelectedScenario={setScenario}
                selectedClothing={clothing}
                setSelectedClothing={setClothing}
              />
            </div>
          )}

          {/* Loading Mode */}
          {mode === 'loading' && (
            <div className={isMobile ? 'flex items-center justify-center py-20' : 'absolute inset-0 z-20 flex items-center justify-center transition-all duration-500'}>
              {previewUrl ? (
                <LoadingPreview imageUrl={previewUrl} />
              ) : (
                <div className="flex flex-col items-center px-4">
                  <div className="animate-spin w-8 h-8 sm:w-10 sm:h-10 border-4 border-t-[var(--color-main)] border-gray-300 rounded-full" />
                  <p className="mt-4 text-gray-600 text-sm sm:text-base text-center">Preparing...</p>
                </div>
              )}
            </div>
          )}

          {/* Result Mode */}
          {mode === 'result' && aiImage && previewUrl && (
            <div className={isMobile ? '' : 'absolute inset-0 z-20 transition-all duration-500'}>
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