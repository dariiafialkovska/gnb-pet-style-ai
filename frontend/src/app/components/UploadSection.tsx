import React, { useState } from 'react';
import { Upload } from 'lucide-react';

const EXAMPLES = [
  { before: '/example-before.jpg', after: '/example-after.jpg' },
  { before: '/example2-before.jpg', after: '/example2-after.jpg' },
  { before: '/example3-before.jpg', after: '/example3-after.jpg' },
];

function ExampleCarousel() {
  const [index, setIndex] = useState(0);
  const total = EXAMPLES.length;
  const go = (dir: number) => setIndex(i => (i + dir + total) % total);

  return (
    <div className="w-full max-w-xs mx-auto flex flex-col items-center">
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-100 shadow-lg flex items-center justify-center">
        <img src={EXAMPLES[index].before} alt="Before" className="w-1/2 h-full object-cover absolute left-0 top-0" />
        <img src={EXAMPLES[index].after} alt="After" className="w-1/2 h-full object-cover absolute right-0 top-0" />
        {/* Arrows */}
        <button onClick={() => go(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--color-main)] rounded-full p-1 shadow-md z-10">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={() => go(1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--color-main)] rounded-full p-1 shadow-md z-10">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      {/* Dots */}
      <div className="flex justify-center mt-2 gap-2">
        {EXAMPLES.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`w-2.5 h-2.5 rounded-full ${i === index ? 'bg-[var(--color-main)]' : 'bg-gray-300'}`}></button>
        ))}
      </div>
      <div className="flex justify-between w-full mt-2 text-xs text-gray-500">
        <span>Before</span>
        <span>After</span>
      </div>
    </div>
  );
}

type UploadSectionProps = {
  file: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function UploadSection({ file, handleFileChange }: UploadSectionProps) {
  return (
    <div className="bg-[#f4f9f6] p-6 sm:p-8 border-b w-full flex flex-col md:flex-row items-center md:items-start gap-8">
      {/* Left: Texts and Upload */}
      <div className="flex-1 flex flex-col items-center md:items-start">
        <h2 className="text-2xl font-bold text-[var(--color-main)] mb-2 text-center md:text-left">Unleash Your Pup's Style!</h2>
        <p className="text-gray-600 mb-6 text-center md:text-left max-w-xs">
          Upload a photo of your dog and let our AI give them a fabulous GNB-inspired makeover. See the magic happen in one click!
        </p>
        <div className="relative mb-2 w-full max-w-xs">
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
      {/* Right: Example Carousel */}
      <div className="flex-1 flex flex-col items-center">
        <span className="mb-2 text-gray-500 text-sm">See the magic:</span>
        <ExampleCarousel />
      </div>
    </div>
  );
} 