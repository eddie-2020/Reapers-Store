import { useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";

import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import ProductGrid from './components/ProductGrid';
import ProductPreview from './components/ProductPreview';
import Modal from './components/Modal';
import CartDrawer from './components/CartDrawer';
import AnimatedBanner from './components/AnnouncementBanner';
import Footer from './components/Footer';

import { PRODUCTS } from './data/products';
import { useCart } from "./context/CartContext";

export default function App() {
  const navigate = useNavigate();
  const { addToCart, openCart, cartCount } = useCart();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // QUICK VIEW
  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // NAVIGATION HELPERS
  const goToHome = () => navigate("/");
  const goToCatalog = () => navigate("/catalog");
  const goToProduct = (product) => navigate(`/product/${product.id}`);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <AnimatedBanner />

      <Header 
        cartCount={cartCount}
        onCartOpen={openCart}
      />

      <main className="flex-grow">
        <Routes>
          {/* HOME */}
          <Route 
            path="/" 
            element={
              <>
                <HeroBanner onShopClick={goToCatalog} />
                <div className="max-w-7xl mx-auto px-6 py-12">
                  <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                      Featured Collection
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Discover our carefully curated selection of premium fashion pieces.
                    </p>
                  </div>

                  <ProductGrid 
                    items={PRODUCTS.slice(0, 4)}
                    onQuickView={handleQuickView}
                    onAdd={addToCart}
                    onProductClick={goToProduct}
                  />
                </div>
              </>
            }
          />

          {/* CATALOG */}
          <Route 
            path="/catalog"
            element={
              <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                  <button 
                    onClick={goToHome}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <span>←</span>
                    <span>Back to Home</span>
                  </button>

                  <h1 className="text-3xl font-serif font-bold text-gray-900">
                    All Products
                  </h1>

                  <div className="w-24"></div>
                </div>

                <ProductGrid 
                  items={PRODUCTS}
                  onQuickView={handleQuickView}
                  onAdd={addToCart}
                  onProductClick={goToProduct}
                />
              </div>
            }
          />

          {/* PRODUCT PAGE */}
          <Route 
            path="/product/:productId"
            element={<ProductPreview onAddToCart={addToCart} />}
          />
        </Routes>
      </main>

      <Footer />

      {/* QUICK VIEW MODAL */}
      <Modal
        product={selectedProduct}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addToCart}
      />

      {/* CART DRAWER */}
      <CartDrawer />
    </div>
  );
}
