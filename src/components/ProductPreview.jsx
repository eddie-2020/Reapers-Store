import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';

export default function ProductPreview({ onAddToCart }) {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    const foundProduct = PRODUCTS.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedColor(foundProduct.colors?.[0] || "");
      setSelectedSize(foundProduct.sizes?.[0] || "");
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</div>
          <button 
            onClick={() => navigate('/')}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [product.img];

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedSize, selectedColor);
  };

  return (
    <div className="bg-white">

      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex space-x-2 text-sm text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-gray-700">Home</button>
            <span>/</span>
            <button onClick={() => navigate('/catalog')} className="hover:text-gray-700">Catalog</button>
            <span>/</span>
            <span className="text-gray-900">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Gallery Section */}
        <div>
          <div className="bg-gray-100 rounded-2xl overflow-hidden mb-4">
            <img
              src={images[selectedImageIndex]}
              alt={product.title}
              className="w-full h-[450px] object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-20 h-20 rounded-xl overflow-hidden border ${
                  selectedImageIndex === index ? "border-gray-900" : "border-transparent"
                }`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-2xl font-semibold mt-2">₦{product.price.toLocaleString()}</p>
          </div>

          <p className="text-gray-600">{product.desc}</p>

          {/* Sizes */}
          {product.sizes && (
            <div>
              <p className="font-medium mb-2">Size</p>
              <div className="flex space-x-3">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedSize === size 
                        ? "bg-gray-900 text-white"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && (
            <div>
              <p className="font-medium mb-2">Color</p>
              <div className="flex space-x-3">
                {product.colors.map(color => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedColor === color 
                        ? "bg-gray-900 text-white"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="font-medium mb-2">Quantity</p>
            <div className="flex items-center border border-gray-300 rounded-lg w-fit">
              <button className="px-3 py-2" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <span className="px-4 py-2">{quantity}</span>
              <button className="px-3 py-2" onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAdd}
            className="w-full bg-gray-900 text-white py-4 rounded-lg text-lg font-medium hover:bg-gray-800"
          >
            Add to Cart
          </button>
        </div>

      </div>

      {/* Description / Reviews / More info */}
      <div className="max-w-7xl mx-auto px-6 py-12 border-t">
        <h2 className="text-2xl font-bold mb-4">Product Details</h2>
        <p className="text-gray-600 leading-relaxed">
          {product.longDesc || "This is a high-quality, premium product designed for comfort, durability, and everyday use."}
        </p>
      </div>

      {/* Related Products */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">Related Products</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.slice(0, 4).map(p => (
            <button
              key={p.id}
              onClick={() => navigate(`/product/${p.id}`)}
              className="border rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <img src={p.img} className="w-full h-48 object-cover" />
              <div className="p-4 text-left">
                <p className="font-medium">{p.title}</p>
                <p className="text-gray-600 text-sm">₦{p.price.toLocaleString()}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
