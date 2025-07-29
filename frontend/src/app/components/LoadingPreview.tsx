import React from 'react';

type LoadingPreviewProps = {
  imageUrl: string;
};

export default function LoadingPreview({ imageUrl }: LoadingPreviewProps) {
  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <div className="aspect-square w-full rounded-xl overflow-hidden bg-gray-100 shadow-md relative">
        <img
          src={imageUrl}
          alt="Processing"
          className="w-full h-full object-cover blur-md scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white font-semibold text-xl animate-pulse">
            Generating GNB Look...
          </div>
        </div>
      </div>
    </div>
  );
}
