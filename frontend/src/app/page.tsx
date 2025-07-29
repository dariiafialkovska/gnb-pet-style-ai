'use client';

import React, { useState, useRef } from 'react';
import { Download, Share2, Facebook, Instagram, Upload, Sparkles } from 'lucide-react';

export default function GNBStylerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'before' | 'after' | 'slider'>('slider');
  const [sliderValue, setSliderValue] = useState(100); // 0 = before, 100 = after, in between = split
  const sliderRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setAiImage(null);
    }
  };

  const handleGenerate = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    try {
      // Simulate API call - replace with your actual endpoint
      await new Promise(resolve => setTimeout(resolve, 3000));
      // In real implementation:
      // const res = await fetch('http://localhost:8000/generate', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await res.json();
      // if (data?.b64_json) {
      //   setAiImage(`data:image/png;base64,${data.b64_json}`);
      // }
      
      // Demo placeholder
      setAiImage('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzM0OTU0NiIvPjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+R05CIFN0eWxlZCBEb2c8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIyMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn6e54oCN8J+OqDwvdGV4dD48L3N2Zz4=');
    } catch (err) {
      alert('Something went wrong.');
    }

    setLoading(false);
  };

  const handleDownload = () => {
    if (!aiImage) return;
    const link = document.createElement('a');
    link.href = aiImage;
    link.download = 'gnb-styled-dog.png';
    link.click();
  };

  const handleShare = (platform: 'instagram' | 'facebook') => {
    if (!aiImage) return;
    
    if (platform === 'instagram') {
      // In a real app, you'd implement proper Instagram sharing
      alert('Instagram sharing would open here');
    } else if (platform === 'facebook') {
      // In a real app, you'd implement proper Facebook sharing
      alert('Facebook sharing would open here');
    }
  };

  // Handle toggle
  const handleToggle = (mode: 'before' | 'after') => {
    setViewMode('slider');
    if (mode === 'before') setSliderValue(100); // Show original only
    else setSliderValue(0); // Show AI only
  };

  // Handle drag on image
  const handleImageDrag = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const rect = imageContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    let percent = ((clientX - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    setSliderValue(percent);
  };

  // Mouse/touch event handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    handleImageDrag(e);
    document.body.style.userSelect = 'none';
  };
  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.current) return;
    let clientX;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const rect = imageContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    let percent = ((clientX - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    setSliderValue(percent);
  };
  const handleDragEnd = () => {
    isDragging.current = false;
    document.body.style.userSelect = '';
  };
  // Attach/remove global listeners
  React.useEffect(() => {
    const move = (e: any) => handleDragMove(e);
    const up = () => handleDragEnd();
    if (isDragging.current) {
      window.addEventListener('mousemove', move);
      window.addEventListener('touchmove', move);
      window.addEventListener('mouseup', up);
      window.addEventListener('touchend', up);
    } else {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    }
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    };
  }, [isDragging.current]);

  // Set slider to halfway when aiImage is shown
  React.useEffect(() => {
    if (aiImage) setSliderValue(50);
  }, [aiImage]);

  return (
    <div className="min-h-screen bg-[#fefefa] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-main)] mb-3">
           GNB AI Dog Styler
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your furry friend with AI-powered styling using natural, pet-safe products
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#f4f9f6] rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Upload Section - only show if no file is selected */}
          {(!file) && (
            <div className="bg-[#f4f9f6] p-6 sm:p-8 border-b">
              <div className="max-w-lg mx-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-main)] mb-6 text-center">
                  Upload Your Dog's Photo
                </h2>
                <div className="relative mb-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-[var(--color-main)] rounded-xl cursor-pointer hover:bg-[var(--color-main)]/10 transition-all duration-200 group"
                  >
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-[var(--color-main)] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[var(--color-main)] font-medium text-center">
                        {file ? (file as File).name : 'Click to upload photo'}
                      </span>
                      <span className="text-[var(--color-main)] text-sm mt-1">
                        PNG, JPG up to 10MB
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
          {/* Final Section - show if file is selected */}
          {file && (
            <div className="p-6 sm:p-8">
              {/* If loading and no aiImage, show spinner and original image */}
              {loading && !aiImage && (
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
                  <div className="flex flex-col items-center mt-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-main)] mb-2"></div>
                    <span className="text-[var(--color-main)] font-medium">Styling your pup...</span>
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
            </div>
          )}

          {/* Info Footer */}
          <div className="bg-gray-50 px-6 sm:px-8 py-4 border-t">
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
      </div>
    </div>
  );
}