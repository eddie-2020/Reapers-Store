import { useState } from 'react';
import { AiOutlineEye } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";

export default function ProductCard({ p, onQuickView, onAdd, onProductClick }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleProductClick = () => {
    if (onProductClick) {
      onProductClick(p);
    }
  };

  const images = p.images || [p.img];

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="relative overflow-hidden h-72" onClick={handleProductClick}>


        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
        )}

        <img
          src={images[currentImageIndex]}
          alt={p.title}
          onLoad={() => setIsLoaded(true)}
          className={`h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500 cursor-pointer ${isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        />
        {(() => {
          if (!p.created_at) return null;
          const date = new Date(p.created_at);
          const twoWeeksAgo = new Date();
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
          if (date >= twoWeeksAgo) {
            return (
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                New
              </div>
            );
          }
          return null;
        })()}
      </div>

      <div className="p-5">
        <div
          className="font-bold text-gray-900 text-lg mb-1 hover:text-gray-700 cursor-pointer"
          onClick={handleProductClick}
        >
          {p.title}
        </div>
        <div className="text-sm text-gray-600 line-clamp-2 mb-3">{p.description}</div>

        <div className="flex justify-between items-center">
          <div className="font-semibold text-gray-900 text-md">₦{p.price.toLocaleString()}</div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(p);
              }}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              title="Quick View"
            >
              <AiOutlineEye size={20} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd(p);
              }}
              className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 cursor-pointer"
              title="Add to Cart"
            >
              <FiPlus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}