import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import ExampleCarousel from './ExampleCarousel';
import CustomButton from './CustomButton';
// Define scenarios and clothing options for the upload section
const SCENARIOS = [
  { label: 'Lemon Fresh Morning', color: '#fef08a' },
  { label: 'Lavender Chill Evening', color: '#c084fc' },
  { label: 'Orange Grove Adventure', color: '#f59e0b' },
  { label: 'Grapefruit Getaway', color: '#f87171' },
  { label: 'Mahogany Coconut Lounge', color: '#92400e' },
];
// Define clothing options for the upload section
const CLOTHING_OPTIONS = [
  'Hoodie',
  'T-shirt',
  'Sweater',
  'Bandana',
  'Poncho',
  'Scarf',
];

type UploadSectionProps = {
  file: File | null;
  previewUrl: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenerate: () => void;
  selectedScenario: string;
  setSelectedScenario: (value: string) => void;
  selectedClothing: string;
  setSelectedClothing: (value: string) => void;
};

// UploadSection component that allows users to upload a photo, select scenarios and clothing options
export default function UploadSection({
  file,
  previewUrl,
  handleFileChange,
  handleGenerate,
  selectedScenario,
  setSelectedScenario,
  selectedClothing,
  setSelectedClothing,
}: UploadSectionProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const fakeEvent = {
        target: { files: [droppedFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(fakeEvent);
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-10 px-4 py-10 sm:px-8 md:px-12 lg:px-20 xl:px-24 h-full justify-center">
      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-main)] mb-2 text-center lg:text-left">
          Unleash Your Pup&apos;s Style!
        </h2>
        <p className="text-gray-600 mb-4 text-center lg:text-left max-w-md">
          Upload a photo of your dog and let our AI give them a fabulous GNB-inspired makeover.
        </p>

        {/* Upload Box */}
        <div className="relative w-full max-w-md mb-6">
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full h-36 sm:h-30 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 group ${dragging ? 'bg-[var(--color-main)]/10 border-[var(--color-main)]' : 'border-[var(--color-main)]'
              }`}
          >
            <Upload className="w-6 h-6 text-[var(--color-main)] mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[var(--color-main)] font-medium text-center text-sm break-words">
              {file ? file.name : 'Click or drag to upload photo'}
            </span>
            <span className="text-[var(--color-main)] text-xs mt-1">PNG, JPG up to 10MB</span>
          </label>
        </div>

        {/* Scenario Selector */}
        <div className="mb-4 w-full max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">Scenario:</label>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {SCENARIOS.map((item) => (
              <button
                key={item.label}
                onClick={() => setSelectedScenario(item.label)}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-150 text-sm ${selectedScenario === item.label
                    ? 'border-[var(--color-main)] bg-[var(--color-main)]/10'
                    : 'border-gray-300 bg-white hover:border-[var(--color-main)]'
                  }`}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="whitespace-nowrap break-keep">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Clothing Selector */}
        <div className="mb-6 w-full max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">Clothing:</label>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {CLOTHING_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedClothing(option)}
                className={`cursor-pointer px-4 py-2 rounded-full border transition-all duration-150 text-sm whitespace-nowrap ${selectedClothing === option
                    ? 'border-[var(--color-main)] bg-[var(--color-main)]/10'
                    : 'border-gray-300 bg-white hover:border-[var(--color-main)]'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center">
        {previewUrl ? (
          <div className="w-full max-w-md flex flex-col items-center">
            <div className="aspect-square w-full rounded-xl overflow-hidden shadow-md bg-gray-100 mb-4">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <CustomButton
              onClick={() => handleGenerate()}
            >
              Generate GNB Look
            </CustomButton>
          </div>
        ) : (
          <ExampleCarousel />
        )}
      </div>
    </div>
  );
}