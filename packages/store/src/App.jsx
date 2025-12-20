import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import ProductGrid from './components/ProductGrid';
import ProductPreview from './components/ProductPreview';
import Modal from './components/Modal';
import CartDrawer from './components/CartDrawer';
import AnimatedBanner from './components/AnnouncementBanner';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import FilterDrawer from './components/FilterDrawer';

import { useCart } from "./context/CartContext";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, openCart, cartCount } = useCart(); // Updated destructuring

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  // FILTERS STATE
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [priceRange, setPriceRange] = useState(500000);

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products/');
        const mappedProducts = response.data.map(p => ({
          id: p.id,
          title: p.name,
          price: Number(p.price),
          description: p.description,
          images: p.images.length > 0 ? p.images.map(img => img.image) : [],
          category: p.category,
          colors: p.color || [],
          sizes: p.size || [],
          created_at: p.created_at
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // DERIVED STATE
  const featuredProducts = products.filter(p => {
    if (!p.created_at) return false;
    const date = new Date(p.created_at);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return date >= oneWeekAgo;
  }).slice(0, 4);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesColor = selectedColor ? p.colors.includes(selectedColor) : true;
    const matchesSize = selectedSize ? p.sizes.includes(selectedSize) : true;
    const matchesPrice = p.price <= priceRange;

    return matchesSearch && matchesCategory && matchesColor && matchesSize && matchesPrice;
  });

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const goToHome = () => navigate("/");
  const goToCatalog = () => navigate("/catalog");
  const goToProduct = (product) => navigate(`/product/${product.id}`);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fadeIn">
      <AnimatedBanner />

      <Header
        cartCount={cartCount}
        onCartOpen={openCart}
        products={products}
        searchValue={location.pathname === '/catalog' ? searchQuery : undefined}
        onSearchChange={location.pathname === '/catalog' ? setSearchQuery : undefined}
      />

      <CartDrawer />

      <main className="grow">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroBanner onShopClick={goToCatalog} />
                <div className="max-w-7xl mx-auto px-6 py-12">
                  <div className="text-center mb-12">
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                      Featured Collection
                    </h1>
                    <div className="h-1 w-20 bg-gray-300 mx-auto rounded-full mb-4"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Discover our carefully curated selection of premium fashion pieces.
                    </p>
                  </div>

                  <ProductGrid
                    items={featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4)}
                    onQuickView={handleQuickView}
                    onAdd={addToCart}
                    onProductClick={goToProduct}
                    loading={loading}
                    emptyMessage="No featured products available right now."
                  />
                </div>
              </>
            }
          />

          <Route
            path="/catalog"
            element={
              <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                  <button
                    onClick={goToHome}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors self-start md:self-auto cursor-pointer"
                  >
                    <span>←</span>
                    <span>Back to Home</span>
                  </button>

                  <div className="text-center">
                    <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                      All Products
                    </h1>
                    <div className="h-1 w-20 bg-gray-300 mx-auto mt-2 rounded-full"></div>
                  </div>

                  <button
                    onClick={() => setFilterOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium self-end md:self-auto cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <span>Filters</span>
                  </button>
                </div>

                <ProductGrid
                  items={filteredProducts}
                  onQuickView={handleQuickView}
                  onAdd={addToCart}
                  onProductClick={goToProduct}
                  loading={loading}
                  emptyMessage="No products match your filters."
                />
              </div>
            }
          />

          <Route path="/product/:productId" element={<ProductPreview onAddToCart={addToCart} />} />
        </Routes>
      </main>

      <Footer />

      <Modal
        product={selectedProduct}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addToCart}
      />

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={{
          category: selectedCategory, setCategory: setSelectedCategory,
          color: selectedColor, setColor: setSelectedColor,
          size: selectedSize, setSize: setSelectedSize,
          priceRange: priceRange, setPriceRange: setPriceRange
        }}
        products={products}
      />

    </div>
  );
}


