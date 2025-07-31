'use client';

import React, { useEffect, useState } from 'react';

type LoadingPreviewProps = {
  imageUrl: string;
};

const phrases = [
  "Mixing natural colors…",
  "Brushing your pup's fur…",
  "Picking the comfiest sweater…",
  "Adding a splash of charm…",
  "GNB magic in progress…",
];

export default function LoadingPreview({ imageUrl }: LoadingPreviewProps) {
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => {
        const idx = phrases.indexOf(prev);
        return phrases[(idx + 1) % phrases.length];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Force fixed height */}
      <div className="flex flex-col md:flex-row h-[500px]">
        
        {/* Left: Image */}
        <div className="flex-1 relative">
          <img
            src={imageUrl}
            alt="Processing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200" />

        {/* Right: Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 bg-gradient-to-br from-gray-50 to-white">
          <img
            src="/gnb-green-logo.png"
            alt="GNB Logo"
            className="h-14 object-contain mb-4"
          />

          {/* Spinner */}
          <div className="relative mb-4">
            <div
              className="animate-spin h-10 w-10 border-4 rounded-full"
              style={{ borderColor: "#e5e7eb", borderTopColor: "#017a42" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "#017a42" }}
              />
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-[#017a42]">
              {currentPhrase}
            </p>
            <p className="text-sm text-gray-600 max-w-xs">
              Our AI stylist is working on creating the perfect look for your pup
            </p>
          </div>

          {/* Dots */}
          <div className="flex gap-2 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: "#017a42",
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: "1.5s"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
