// components/Modal.jsx
import { useState } from 'react';

export default function Modal({ product, open, onClose, onAdd }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row shadow-2xl max-h-[90vh]">
        {/* Image Gallery Section */}
        <div className="md:w-1/2 relative">
          <img
            src={product.images[selectedImageIndex]}
            className="w-full h-64 md:h-96 object-cover"
            alt={product.title}
          />
          
          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-12 h-12 border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                    index === selectedImageIndex 
                      ? 'border-gray-900' 
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
            New Arrival
          </div>
        </div>

        {/* Product Details Section */}
        <div className="p-6 md:w-1/2 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-bold text-2xl text-gray-900">{product.title}</h2>
              <div className="text-xl font-bold mt-2 text-gray-900">
                ₦{product.price.toLocaleString()}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              ✕
            </button>
          </div>

          <p className="text-gray-600 mt-4 leading-relaxed flex-grow">{product.desc}</p>

          {/* Additional Product Info */}
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            {product.category && (
              <div><span className="font-medium">Category:</span> {product.category}</div>
            )}
            {product.colors && (
              <div><span className="font-medium">Colors:</span> {product.colors.join(', ')}</div>
            )}
          </div>

          <div className="space-y-4 mt-6">
            {/* Size Selection */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Size:</span>
              <div className="flex space-x-2">
                {product.sizes?.map((size) => (
                  <button 
                    key={size} 
                    className="w-10 h-10 border border-gray-300 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => onAdd(product)}
              className="w-full py-3.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              Add to Cart
            </button>
            
            <button className="w-full py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}