import React from 'react';
import { INSTAGRAM_GALLERY } from '../data/content';

export const VisualGallery: React.FC = () => {
  if (INSTAGRAM_GALLERY.length === 0) {
    return null;
  }

  return (
    <section id="galeria-visual" className="py-24 bg-white border-t border-[#DEE2E6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-serif text-3xl font-bold text-[#002147]">Galeria</h2>
        </div>
      </div>
    </section>
  );
};
