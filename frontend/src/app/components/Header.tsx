import React from 'react';

// Header component that displays the main title and description for the Good Natured Look Generator
export default function Header() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--color-main)] mb-3">
        Good Natured Look Generator
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Give your pup a fresh new look with AI-powered styling, inspired by Good Natured’s clean, pet-safe care.

      </p>
    </div>
  );
} 