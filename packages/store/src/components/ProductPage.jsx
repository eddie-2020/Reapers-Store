// components/ProductPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function ProductPage({ onAddToCart, cartItems }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/api/products/${productId}/`);
        const p = response.data;

        const mappedProduct = {
          id: p.id,
          title: p.name,
          price: Number(p.price),
          desc: p.description, // Note: ProductPage uses 'desc' prop for description
          images: p.images.length > 0 ? p.images.map(img => img.image) : [],
          category: p.category, // This now contains the subcategory (e.g. Hoodie)
          colors: p.color || [],
          sizes: p.size || [],
          created_at: p.created_at
        };

        setProduct(mappedProduct);
        setSelectedSize(mappedProduct.sizes?.[0] || "");
        setSelectedColor(mappedProduct.colors?.[0] || "");

        // Check if product is already in cart
        if (cartItems && cartItems[mappedProduct.id]) {
          setAddedToCart(true);
        }
      } catch (error) {
        console.error("Error fetching product", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, cartItems]);

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      ...product,
      selectedSize,
      selectedColor,
      quantity,
    };

    onAddToCart(cartItem, quantity, selectedSize, selectedColor);
    setAddedToCart(true);

    // Reset after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-xl font-medium text-gray-600">Loading Product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </div>
          <button
            onClick={() => navigate("/catalog")}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const images = (product.images && product.images.length > 0)
    ? product.images
    : ["https://via.placeholder.com/600?text=No+Image"];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex space-x-2 text-sm text-gray-500">
            <button
              onClick={() => navigate("/")}
              className="hover:text-gray-700 transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => navigate("/catalog")}
              className="hover:text-gray-700 transition-colors"
            >
              Catalog
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-square">
              <img
                src={images[selectedImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto py-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all duration-200 ${index === selectedImageIndex
                      ? "border-gray-900 shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300"
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
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {product.title}
            </h1>
            <div className="text-2xl font-bold text-gray-900">
              ₦{product.price.toLocaleString()}
            </div>

            <p className="text-gray-600 leading-relaxed text-lg">
              {product.desc}
            </p>

            <div className="mt-4 space-y-3 text-sm text-gray-600">
              {product.category && (
                <div>
                  <span className="font-semibold">Category:</span>{" "}
                  {product.category}
                </div>
              )}
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <span className="font-semibold text-gray-900">Size</span>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition-all duration-200 ${selectedSize === size
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <span className="font-semibold text-gray-900">Color</span>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg transition-all duration-200 ${selectedColor === color
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-gray-900">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 min-w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addedToCart}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${addedToCart
                  ? "bg-green-600 text-white"
                  : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
              >
                {addedToCart ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
