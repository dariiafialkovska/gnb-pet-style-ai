'use client';

import { useState, useEffect } from 'react';

const EXAMPLES = [
  '/example-1.jpg',
  '/example-2.png',
  '/example-3.jpg',
];

export default function ExampleCarousel() {
  const [index, setIndex] = useState(0);
  const total = EXAMPLES.length;

  const go = (dir: number) => {
    setIndex((prev) => (prev + dir + total) % total);
  };

  useEffect(() => {
    const interval = setInterval(() => go(1), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col relative justify-center">
      {/* Arrows Outside */}
      <button
        onClick={() => go(-1)}
        className="absolute -left-10 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--color-main)] rounded-full p-2 shadow z-20 transition"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => go(1)}
        className="absolute -right-10 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--color-main)] rounded-full p-2 shadow z-20 transition"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Image Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-100 shadow-lg">
        {EXAMPLES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Example ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              i === index ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
            }`}
          />
        ))}
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center mt-3 gap-2">
        {EXAMPLES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === index
                ? 'scale-125 bg-[var(--color-main)] shadow'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
