'use client';

import { Plus } from 'lucide-react';

export function QuickCaptureFAB() {
  return (
    <button
      title="Quick Capture"
      className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}
