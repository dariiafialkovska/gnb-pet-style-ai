import React from 'react';
import { Download, Facebook, Instagram, Sparkles } from 'lucide-react';

type FinalSectionProps = {
  file: File;
  previewUrl: string | null;
  aiImage: string | null;
  loading: boolean;
  sliderValue: number;
  setSliderValue: (v: number) => void;
  handleGenerate: () => void;
  handleToggle: (mode: 'before' | 'after') => void;
  handleDragStart: (e: React.MouseEvent | React.TouchEvent) => void;
  imageContainerRef: React.RefObject<HTMLDivElement>;
  handleDownload: () => void;
  handleShare: (platform: 'instagram' | 'facebook') => void;
};

export default function FinalSection({
  file,
  previewUrl,
  aiImage,
  loading,
  sliderValue,
  setSliderValue,
  handleGenerate,
  handleToggle,
  handleDragStart,
  imageContainerRef,
  handleDownload,
  handleShare,
}: FinalSectionProps) {
  return (
    <div className="p-6 sm:p-8 w-full flex flex-col items-center">
      {/* If loading and no aiImage, show spinner and original image */}
      {loading && !aiImage && (
        <div className="flex flex-col items-center justify-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-[var(--color-main)] rounded-full"></div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-[var(--color-main)]">Original</h3>
            </div>
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-lg relative">
              <img 
                src={previewUrl!} 
                alt="Original dog photo"
                className="w-full h-full object-cover filter blur-sm"
              />
              {/* Overlay spinner and message */}
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-main)] mb-4"></div>
                <span className="text-white text-lg font-semibold">Styling your pup...</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* If not loading and no aiImage, show original image and Generate button */}
      {!loading && !aiImage && (
        <div className="flex flex-col items-center justify-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-[var(--color-main)] rounded-full"></div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-[var(--color-main)]">Original</h3>
            </div>
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-lg">
              <img 
                src={previewUrl!} 
                alt="Original dog photo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-8 w-full sm:w-auto flex items-center justify-center space-x-2 bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 border-2 border-transparent hover:border-[var(--color-main)] focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate GNB Look</span>
          </button>
        </div>
      )}
      {/* If aiImage is available, show toggles, slider, and before/after UI */}
      {aiImage && (
        <>
          {/* Toggle Buttons */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => handleToggle('before')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base border-2 ${
                sliderValue === 100
                  ? 'bg-[#e1efe6] text-[var(--color-main)] shadow-md border-[var(--color-main)]'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Before
            </button>
            <button
              onClick={() => handleToggle('after')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base border-2 ${
                sliderValue === 0
                  ? 'bg-[#e1efe6] text-[var(--color-main)] shadow-md border-[var(--color-main)]'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              After
            </button>
          </div>
          {/* Image Display with slider */}
          <div className="max-w-5xl mx-auto">
            <div
              ref={imageContainerRef}
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-lg w-full max-w-2xl mx-auto select-none cursor-ew-resize"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              {/* Before image (left side) */}
              <img 
                src={previewUrl!} 
                alt="Original dog photo"
                className="w-full h-full object-cover absolute top-0 left-0"
                style={{ clipPath: `inset(0 ${100-sliderValue}% 0 0)` }}
                draggable={false}
              />
              {/* After image (right side) */}
              <img 
                src={aiImage} 
                alt="AI styled dog"
                className="w-full h-full object-cover absolute top-0 left-0"
                style={{ clipPath: `inset(0 0 0 ${sliderValue}%)` }}
                draggable={false}
              />
              {/* Slider handle */}
              {sliderValue > 0 && sliderValue < 100 && (
                <div
                  className="absolute top-0 left-0 h-full z-10 flex items-center group"
                  style={{ left: `calc(${sliderValue}% - 12px)` }}
                  onMouseDown={handleDragStart}
                  onTouchStart={handleDragStart}
                >
                  <div className="w-3 h-full bg-[var(--color-main)] opacity-90 rounded relative flex items-center justify-center border-2 border-white shadow-lg transition-all duration-200" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-white border-2 border-[var(--color-main)] rounded-full shadow-lg group-hover:scale-110 transition-transform flex items-center justify-center">
                    <div className="w-3 h-3 bg-[var(--color-main)] rounded-full" />
                  </div>
                </div>
              )}
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-8">
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 border-2 border-transparent hover:border-[var(--color-main)] focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
              <button
                onClick={() => handleShare('instagram')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Instagram className="w-5 h-5" />
                <span>Instagram</span>
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Facebook className="w-5 h-5" />
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </>
      )}
      {/* Info Footer */}
      <div className="bg-gray-50 px-6 sm:px-8 py-4 border-t mt-8 w-full rounded-b-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-1">
            <span className="text-[var(--color-main)]">🌿</span>
            <span>Pet-safe & Natural ingredients</span>
          </div>
          <div className="flex items-center space-x-1">
            <Sparkles className="w-4 h-4 text-[var(--color-main)]" />
            <span>AI-powered styling</span>
          </div>
        </div>
      </div>
    </div>
  );
} 