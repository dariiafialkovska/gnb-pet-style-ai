'use client';

import React, { useState, useRef } from 'react';
import { Download, Share2, Facebook, Instagram, Upload, Sparkles } from 'lucide-react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import FinalSection from './components/FinalSection';

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
    <div className="min-h-screen bg-[#fefefa] flex items-center justify-center">
      <div className="max-w-6xl w-full flex flex-col items-center justify-center">
        <Header />
        <div className="bg-[#f4f9f6] rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-2xl flex flex-col items-center justify-center">
          {/* Upload Section - only show if no file is selected */}
          {(!file) && (
            <UploadSection
              file={file}
              handleFileChange={handleFileChange}
            />
          )}
          {/* Final Section - show if file is selected */}
          {file && (
            <FinalSection
              file={file}
              previewUrl={previewUrl}
              aiImage={aiImage}
              loading={loading}
              sliderValue={sliderValue}
              setSliderValue={setSliderValue}
              handleGenerate={handleGenerate}
              handleToggle={handleToggle}
              handleDragStart={handleDragStart}
              imageContainerRef={imageContainerRef}
              handleDownload={handleDownload}
              handleShare={handleShare}
            />
          )}
        </div>
      </div>
    </div>
  );
}