import { useState } from 'react';

export default function Modal({ product, open, onClose, onAdd }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  if (open && product && (!selectedSize || !product.sizes.includes(selectedSize))) {
    if (product.sizes?.length > 0) setSelectedSize(product.sizes[0]);
    if (product.colors?.length > 0) setSelectedColor(product.colors[0]);
  }

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row shadow-2xl max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors duration-200 cursor-pointer z-10 shadow-sm"
        >
          ✕
        </button>
        <div className="md:w-1/2 flex flex-col">
          <div className='relative'>
            <img
              src={product.images[selectedImageIndex]}
              className="w-full h-96 md:h-105 object-cover object-top"
              alt={product.title}
            />

            {(() => {
              if (!product.created_at) return null;
              const date = new Date(product.created_at);
              const twoWeeksAgo = new Date();
              twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
              if (date >= twoWeeksAgo) {
                return (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium shadow">
                    New Arrival
                  </div>
                );
              }
              return null;
            })()}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 px-4 py-3 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-12 h-12 shrink-0 rounded-lg overflow-hidden border-2 transition ${index === selectedImageIndex
                    ? "border-gray-900"
                    : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                >
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 md:w-1/2 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-bold text-2xl text-gray-900">{product.title}</h2>
              <div className="text-xl font-bold mt-2 text-gray-900">
                ₦{product.price.toLocaleString()}
              </div>
            </div>
          </div>

          <p className="text-gray-600 mt-4 leading-relaxed grow">{product.description}</p>

          <div className="mt-4 space-y-3 text-sm text-gray-600">
            {product.category && (
              <div><span className="font-medium">Category:</span> {product.category}</div>
            )}
          </div>

          <div className="space-y-6 mt-6">
            {product.sizes?.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-2">Size</span>
                <div className="flex space-x-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${selectedSize === size
                        ? "bg-gray-900 text-white border-gray-900"
                        : "border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-2">Color</span>
                <div className="flex space-x-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        if (index < product.images.length) {
                          setSelectedImageIndex(index);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${selectedColor === color
                        ? "bg-gray-900 text-white border-gray-900"
                        : "border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => onAdd(product, 1, selectedSize, selectedColor)}
              className="w-full py-3.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.02] shadow-lg cursor-pointer"
            >
              Add to Cart
            </button>

            <button className="w-full py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}