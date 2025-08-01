'use client';

import React, { useState } from 'react';
import { Download, Facebook, Instagram } from 'lucide-react';
import CustomButton from './CustomButton';

type FinalSectionProps = {
  previewUrl: string;
  aiImage: string;
  sliderValue: number;
  setSliderValue: (value: number) => void;
};
// FinalSection component that displays the final styled image and options to download or share
export default function FinalSection({
  previewUrl,
  aiImage,
  sliderValue,
  setSliderValue,
}: FinalSectionProps) {
  const [view, setView] = useState<'before' | 'after'>('after');
  // Function to handle downloading the AI-styled image
  const handleDownload = async () => {
    try {
      // Fetch the image as a blob to handle cross-origin issues
      const response = await fetch(aiImage);
      const blob = await response.blob();
      
      // Create object URL from blob
      const url = window.URL.createObjectURL(blob);
      
      // Create and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'goodnatured-pup.png';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab if download fails
      window.open(aiImage, '_blank');
    }
  };

  // Function to handle sharing on social media
  const handleShare = (platform: 'instagram' | 'facebook') => {
    const hashtags = '#GoodNaturedPup';
    const mention = '@goodnaturedbrand';
    const text = `Check out my pup's AI-styled make-over! 🐶✨ ${hashtags} ${mention}`;
    
    if (platform === 'instagram') {
      // Instagram doesn't support direct URL sharing with pre-filled content
      // Copy text to clipboard and open Instagram
      navigator.clipboard.writeText(`${text}\n\nImage: ${aiImage}`).then(() => {
        alert('Caption copied to clipboard! Paste it when sharing on Instagram.');
        window.open('https://www.instagram.com/', '_blank');
      }).catch(() => {
        alert('Please copy this caption for Instagram: ' + text);
        window.open('https://www.instagram.com/', '_blank');
      });
    } else if (platform === 'facebook') {
      // Facebook sharing with URL
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(aiImage)}&quote=${encodeURIComponent(text)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="w-full h-full px-6 py-10 flex flex-col items-center">
      <div className="w-full flex flex-col lg:flex-row gap-10 mt-6 mb-6 max-w-4xl items-center justify-center lg:gap-16">
        {/* Left: Image */}
        <div className="flex-1 flex flex-col items-center mb-6">
          <div className="flex gap-4 mb-4">
            {['before', 'after'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v as 'before' | 'after')}
                className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200 ${
                  view === v
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
              crossOrigin="anonymous"
            />
          </div>
        </div>

        {/* Middle: Seperator*/}
        <div className="hidden lg:block w-px bg-gray-200 h-90" />
        {/* Right: Buttons & Message */}
        <div className="w-full lg:w-64 flex flex-col items-center text-center space-y-6">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-[var(--color-main)]">
              Your pup is glowing—naturally good, naturally you! 🐾
            </p>
            <p className="text-sm text-gray-600">
              Download the look or share it with your friends!
            </p>
          </div>

          <CustomButton onClick={handleDownload}>
            <Download className="w-4 h-4" />
            Download
          </CustomButton>

          <div className="w-full border-t border-gray-200 my-4" />

          {/* Share paragraph */}
          <p className="text-sm text-gray-600 mb-4">
            Share your pup&apos;s new look on social media!
          </p>

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => handleShare('instagram')}
              className="cursor-pointer flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm hover:bg-white transition-all"
            >
              <Instagram className="w-5 h-5 text-[var(--color-main)]" />
              <span className="text-sm font-medium text-gray-900">Post to Instagram</span>
            </button>

            <button
              onClick={() => handleShare('facebook')}
              className="cursor-pointer flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm hover:bg-white transition-all"
            >
              <Facebook className="w-5 h-5 text-[var(--color-main)]" />
              <span className="text-sm font-medium text-gray-900">Post to Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}