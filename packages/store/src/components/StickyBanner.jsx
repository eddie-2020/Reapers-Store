
import { useState } from 'react';

export default function StickyBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="sticky top-0 z-40 bg-linear-to-r from-orange-500 to-red-500 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <span className="text-sm font-medium mr-4">
          🎉 Limited Time: Buy 2 Get 1 Free on Swimwear!
        </span>
        <button className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors">
          Learn More
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}