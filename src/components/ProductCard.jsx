// components/ProductCard.jsx
import { useState } from 'react';

export default function ProductCard({ p, onQuickView, onAdd, onProductClick }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleProductClick = () => {
    if (onProductClick) {
      onProductClick(p);
    }
  };

  const images = p.images || [p.img];

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="relative overflow-hidden" onClick={handleProductClick}>
        <img
          src={images[currentImageIndex]}
          alt={p.title}
          className="h-72 w-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
          New
        </div>
      </div>

      <div className="p-5">
        <div 
          className="font-semibold text-gray-900 text-lg mb-1 hover:text-gray-700 cursor-pointer"
          onClick={handleProductClick}
        >
          {p.title}
        </div>
        <div className="text-sm text-gray-600 line-clamp-2 mb-3">{p.desc}</div>

        <div className="flex justify-between items-center">
          <div className="font-bold text-gray-900 text-lg">₦{p.price.toLocaleString()}</div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(p);
              }}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              title="Quick View"
            >
              👁️
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd(p);
              }}
              className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
              title="Add to Cart"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}