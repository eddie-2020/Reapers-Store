// // components/ProductPage.jsx
// import { useState, useEffect } from 'react';
// import { PRODUCTS } from '../data/products';
// import ProductGrid from './ProductGrid';
// import Modal from './Modal';
// import CartDrawer from './CartDrawer';

// export default function ProductPage({ onAddToCart, onQuickView }) {
//   const [currentView, setCurrentView] = useState('home'); // 'home', 'catalog', 'product'
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [cart, setCart] = useState({});
//   const [cartOpen, setCartOpen] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);

//   const cartCount = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);

//   const handleAddToCart = (product, quantity = 1, selectedSize = '', selectedColor = '') => {
//     setCart(prev => ({
//       ...prev,
//       [product.id]: {
//         ...product,
//         qty: (prev[product.id]?.qty || 0) + (quantity || 1),
//         selectedSize: selectedSize || prev[product.id]?.selectedSize,
//         selectedColor: selectedColor || prev[product.id]?.selectedColor
//       }
//     }));
//   };

//   const handleRemoveFromCart = (productId) => {
//     setCart(prev => {
//       const updated = { ...prev };
//       if (updated[productId].qty > 1) {
//         updated[productId].qty -= 1;
//       } else {
//         delete updated[productId];
//       }
//       return updated;
//     });
//   };

//   const handleProductClick = (product) => {
//     setSelectedProduct(product);
//     setCurrentView('product');
//   };

//   const handleQuickView = (product) => {
//     setSelectedProduct(product);
//     setModalOpen(true);
//   };

//   const handleBackToCatalog = () => {
//     setCurrentView('catalog');
//     setSelectedProduct(null);
//   };

//   const handleBackToHome = () => {
//     setCurrentView('home');
//     setSelectedProduct(null);
//   };

//   // Render different views based on currentView state
//   const renderView = () => {
//     switch (currentView) {
//       case 'product':
//         return selectedProduct ? (
//           <ProductDetailView 
//             product={selectedProduct} 
//             onAddToCart={handleAddToCart}
//             onBack={handleBackToCatalog}
//           />
//         ) : null;
      
//       case 'catalog':
//         return (
//           <div className="max-w-7xl mx-auto px-6 py-12">
//             <div className="flex items-center justify-between mb-8">
//               <button 
//                 onClick={handleBackToHome}
//                 className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
//               >
//                 <span>←</span>
//                 <span>Back to Home</span>
//               </button>
//               <h1 className="text-3xl font-serif font-bold text-gray-900">All Products</h1>
//               <div className="w-24"></div> {/* Spacer for alignment */}
//             </div>
//             <ProductGrid 
//               items={PRODUCTS} 
//               onQuickView={handleQuickView}
//               onAdd={handleAddToCart}
//               onProductClick={handleProductClick}
//             />
//           </div>
//         );
      
//       default: // home
//         return (
//           <>
//             <HeroBanner onShopClick={() => setCurrentView('catalog')} />
//             <div className="max-w-7xl mx-auto px-6 py-12">
//               <div className="text-center mb-12">
//                 <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Featured Collection</h1>
//                 <p className="text-gray-600 max-w-2xl mx-auto">
//                   Discover our carefully curated selection of premium fashion pieces.
//                 </p>
//               </div>
//               <ProductGrid 
//                 items={PRODUCTS} 
//                 onQuickView={handleQuickView}
//                 onAdd={handleAddToCart}
//                 onProductClick={handleProductClick}
//               />
//             </div>
//           </>
//         );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       {renderView()}

//       <Modal
//         product={selectedProduct}
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onAdd={handleAddToCart}
//       />

//       <CartDrawer
//         open={cartOpen}
//         onClose={() => setCartOpen(false)}
//         cart={cart}
//         onAdd={handleAddToCart}
//         onRemove={handleRemoveFromCart}
//       />

//       {modalOpen && <div className="fixed inset-0 bg-black/20 z-40" />}
//       {cartOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setCartOpen(false)} />}
//     </div>
//   );
// }

// // Product Detail Component
// function ProductDetailView({ product, onAddToCart, onBack }) {
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [selectedSize, setSelectedSize] = useState('');
//   const [selectedColor, setSelectedColor] = useState('');
//   const [quantity, setQuantity] = useState(1);
//   const [activeTab, setActiveTab] = useState('description');

//   useEffect(() => {
//     setSelectedSize(product.sizes?.[0] || '');
//     setSelectedColor(product.colors?.[0] || '');
//   }, [product]);

//   const handleAddToCart = () => {
//     const cartItem = {
//       ...product,
//       selectedSize,
//       selectedColor,
//       quantity
//     };
    
//     onAddToCart(cartItem);
    
//     // Show success feedback
//     const addButton = document.getElementById('add-to-cart-btn');
//     if (addButton) {
//       const originalText = addButton.textContent;
//       addButton.textContent = '✓ Added to Cart!';
//       addButton.classList.add('bg-green-600');
//       setTimeout(() => {
//         addButton.textContent = originalText;
//         addButton.classList.remove('bg-green-600');
//       }, 2000);
//     }
//   };

//   const incrementQuantity = () => setQuantity(prev => prev + 1);
//   const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

//   const images = product.images || [product.img];

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Breadcrumb */}
//       <div className="mb-6">
//         <button 
//           onClick={onBack}
//           className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
//         >
//           <span>←</span>
//           <span>Back to Catalog</span>
//         </button>
//       </div>

//       {/* Product Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
//         {/* Image Gallery */}
//         <div className="space-y-4">
//           <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-square">
//             <img
//               src={images[selectedImageIndex]}
//               alt={product.title}
//               className="w-full h-full object-cover"
//             />
            
//             {images.length > 1 && (
//               <>
//                 <button
//                   onClick={() => setSelectedImageIndex(prev => 
//                     prev === 0 ? images.length - 1 : prev - 1
//                   )}
//                   className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
//                 >
//                   ‹
//                 </button>
//                 <button
//                   onClick={() => setSelectedImageIndex(prev => 
//                     prev === images.length - 1 ? 0 : prev + 1
//                   )}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
//                 >
//                   ›
//                 </button>
//               </>
//             )}
//           </div>

//           {images.length > 1 && (
//             <div className="flex space-x-3 overflow-x-auto py-2">
//               {images.map((image, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImageIndex(index)}
//                   className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all duration-200 ${
//                     index === selectedImageIndex 
//                       ? 'border-gray-900 shadow-md' 
//                       : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
//                   }`}
//                 >
//                   <img
//                     src={image}
//                     alt={`${product.title} view ${index + 1}`}
//                     className="w-full h-full object-cover"
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Product Info */}
//         <div className="space-y-6">
//           <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.title}</h1>
//           <div className="text-2xl font-bold text-gray-900">₦{product.price.toLocaleString()}</div>
          
//           <p className="text-gray-600 leading-relaxed text-lg">{product.desc}</p>

//           {/* Size Selection */}
//           {product.sizes && (
//             <div className="space-y-3">
//               <span className="font-semibold text-gray-900">Size</span>
//               <div className="flex flex-wrap gap-3">
//                 {product.sizes.map((size) => (
//                   <button
//                     key={size}
//                     onClick={() => setSelectedSize(size)}
//                     className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
//                       selectedSize === size
//                         ? 'border-gray-900 bg-gray-900 text-white'
//                         : 'border-gray-300 text-gray-700 hover:border-gray-400'
//                     }`}
//                   >
//                     {size}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Color Selection */}
//           {product.colors && (
//             <div className="space-y-3">
//               <span className="font-semibold text-gray-900">Color</span>
//               <div className="flex flex-wrap gap-3">
//                 {product.colors.map((color) => (
//                   <button
//                     key={color}
//                     onClick={() => setSelectedColor(color)}
//                     className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
//                       selectedColor === color
//                         ? 'border-gray-900 bg-gray-900 text-white'
//                         : 'border-gray-300 text-gray-700 hover:border-gray-400'
//                     }`}
//                   >
//                     {color}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Quantity & Add to Cart */}
//           <div className="space-y-4 pt-4">
//             <div className="flex items-center space-x-4">
//               <span className="font-semibold text-gray-900">Quantity</span>
//               <div className="flex items-center border border-gray-300 rounded-lg">
//                 <button
//                   onClick={decrementQuantity}
//                   className="px-3 py-2 hover:bg-gray-50 transition-colors"
//                 >
//                   -
//                 </button>
//                 <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
//                 <button
//                   onClick={incrementQuantity}
//                   className="px-3 py-2 hover:bg-gray-50 transition-colors"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             <button
//               id="add-to-cart-btn"
//               onClick={handleAddToCart}
//               className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
//             >
//               Add to Cart
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Simple Hero Banner Component
// function HeroBanner({ onShopClick }) {
//   return (
//     <div className="relative h-96 md:h-[500px] w-full overflow-hidden">
//       <img
//         src="/hero.jpeg"
//         alt="REAPERS Premium Fashion"
//         className="w-full h-full object-cover"
//       />
      
//       <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
      
//       <div className="absolute inset-0 flex items-center">
//         <div className="max-w-7xl mx-auto px-6 w-full">
//           <div className="max-w-2xl">
//             <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-serif">
//               Welcome to REAPERS
//             </h1>
//             <p className="text-xl text-gray-200 mb-8 leading-relaxed">
//               Discover premium fashion curated with exceptional taste.
//             </p>
//             <button 
//               onClick={onShopClick}
//               className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200"
//             >
//               Shop Collection
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// components/ProductPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';

export default function ProductPage({ onAddToCart, cartItems }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const foundProduct = PRODUCTS.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedSize(foundProduct.sizes?.[0] || '');
      setSelectedColor(foundProduct.colors?.[0] || '');
      
      // Check if product is already in cart
      const cartItem = cartItems[foundProduct.id];
      if (cartItem) {
        setAddedToCart(true);
      }
    }
  }, [productId, cartItems]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      ...product,
      selectedSize,
      selectedColor,
      quantity
    };
    
    onAddToCart(cartItem, quantity, selectedSize, selectedColor);
    setAddedToCart(true);
    
    // Reset after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</div>
          <button 
            onClick={() => navigate('/catalog')}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [product.img];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex space-x-2 text-sm text-gray-500">
            <button 
              onClick={() => navigate('/')} 
              className="hover:text-gray-700 transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <button 
              onClick={() => navigate('/catalog')} 
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
                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                      index === selectedImageIndex 
                        ? 'border-gray-900 shadow-md' 
                        : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
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
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.title}</h1>
            <div className="text-2xl font-bold text-gray-900">₦{product.price.toLocaleString()}</div>
            
            <p className="text-gray-600 leading-relaxed text-lg">{product.desc}</p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <span className="font-semibold text-gray-900">Size</span>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
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
                      className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
                        selectedColor === color
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
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
                  <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
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
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}