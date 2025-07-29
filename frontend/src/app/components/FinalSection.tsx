'use client';

import React, { useState, useEffect } from 'react';
import { Download, Facebook, Instagram, Sparkle } from 'lucide-react';
import CustomButton from './CustomButton';

type FinalSectionProps = {
  file: File;
  previewUrl: string;
  onBack: () => void;
};

export default function FinalSection({ file, previewUrl, onBack }: FinalSectionProps) {
  const [mode, setMode] = useState<'loading' | 'result'>('loading');
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [view, setView] = useState<'before' | 'after'>('after');

  useEffect(() => {
    const generate = async () => {
      try {
        await new Promise((res) => setTimeout(res, 3000));
        setAiImage('data:image/svg+xml;base64,...');
        setMode('result');
      } catch {
        alert('Something went wrong.');
        onBack();
      }
    };
    generate();
  }, [file]);

  const handleDownload = () => {
    if (!aiImage) return;
    const link = document.createElement('a');
    link.href = aiImage;
    link.download = 'gnb-styled-dog.png';
    link.click();
  };

  const handleShare = (platform: 'instagram' | 'facebook') => {
    alert(`${platform} sharing would open here`);
  };

  return (
    <div className="w-full h-full px-6 py-10 flex flex-col items-center">
      {mode === 'loading' && (
        <div className="flex flex-col justify-center space-y-6">
          <h3 className="text-xl font-semibold text-[var(--color-main)]">Styling your pup...</h3>
          <div className="aspect-square w-full max-w-md relative rounded-xl overflow-hidden bg-gray-100 shadow-lg">
            <img src={previewUrl} alt="Loading" className="w-full h-full object-contain blur-sm" />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
              <div className="animate-spin h-10 w-10 border-4 border-t-[var(--color-main)] border-white rounded-full" />
              <span className="text-white mt-4">Please wait...</span>
            </div>
          </div>
        </div>
      )}

      {mode === 'result' && aiImage && (
        <div className="w-full flex flex-col lg:flex-row gap-10 mt-6 mb-6 max-w-4xl items-center justify-center">
          {/* Left: Image */}
          <div className="flex-1 flex flex-col items-center mb-6">
            <div className="flex gap-4 mb-4">
              {['before', 'after'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v as 'before' | 'after')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200 ${view === v
                    ? 'bg-[#e1efe6] text-[var(--color-main)] border-[var(--color-main)]'
                    : 'text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {v[0].toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative w-full aspect-square max-w-md bg-gray-100 rounded-xl overflow-hidden shadow-lg">
              <img
                src={view === 'before' ? previewUrl : aiImage}
                alt="Styled Result"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>



          </div>

          {/* Right: Buttons & Message */}
          <div className="w-full lg:w-64 flex flex-col items-center text-center space-y-6">
            {/* Headline */}
            <div className="space-y-2">
              <p className="text-lg font-semibold text-[var(--color-main)]">
                Your pup is looking pawsitively stunning! 🐾
              </p>
              <p className="text-sm text-gray-600">
                Download the look or share it with your friends!
              </p>
            </div>

            {/* Download button */}
            <CustomButton onClick={handleDownload}>
              <Download className="w-4 h-4" />
              Download
            </CustomButton>
            <div className="w-full border-t border-gray-200 my-4" />

            {/* Share section */}
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={() => handleShare('instagram')}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm hover:bg-white transition-all"
              >
                <Instagram className="w-5 h-5 text-[var(--color-main)]" />
                <span className="text-sm font-medium text-gray-900">Post to Instagram</span>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm hover:bg-white transition-all"
              >
                <Facebook className="w-5 h-5 text-[var(--color-main)]" />
                <span className="text-sm font-medium text-gray-900">Post to Facebook</span>
              </button>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
