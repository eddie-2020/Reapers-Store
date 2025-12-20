import React, { createContext, useContext, useState, useMemo, useEffect } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  // cart keyed by product id
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("reapers_cart");
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
      return {};
    }
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("reapers_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);
  const [open, setOpen] = useState(false);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((s, it) => s + (it.qty || 0), 0),
    [cart]
  );

  const subtotal = useMemo(
    () => Object.values(cart).reduce((s, it) => s + (it.qty || 0) * (it.price || 0), 0),
    [cart]
  );

  const openCart = () => setOpen(true);
  const closeCart = () => setOpen(false);

  function addToCart(product, quantity = 1, selectedSize = "", selectedColor = "") {
    setCart(prev => {
      // Determine the ultimate variant properties
      const size = selectedSize || product.selectedSize || "";
      const color = selectedColor || product.selectedColor || "";

      // Determine the base product ID (handle if 'product' is already a cart item or raw product)
      // If it's a cart item, it might have .productId. If raw, use .id.
      const baseId = product.productId || product.id;

      // Create a unique key for this variant
      const cartItemId = `${baseId}-${color}-${size}`;

      const prevItem = prev[cartItemId] || {};
      const newQty = (prevItem.qty || 0) + (quantity || 1);

      // Determine correct image for this color variant
      let imageToUse = product.images?.[0] || product.img || product.image;
      if (color && product.colors && product.images) {
        const colorIdx = product.colors.indexOf(color);
        if (colorIdx > -1 && product.images[colorIdx]) {
          imageToUse = product.images[colorIdx];
        }
      }

      return {
        ...prev,
        [cartItemId]: {
          ...product,
          // Ensure we preserve or set the specific fields we need
          title: product.title || product.name,
          id: cartItemId, // The unique key for the cart
          productId: baseId, // Creating a reference to original ID
          price: product.price,
          image: imageToUse, // Fallbacks handled above
          qty: newQty,
          selectedSize: size,
          selectedColor: color
        }
      };
    });
    setOpen(true);
  }

  function removeOne(productId) {
    setCart(prev => {
      const copy = { ...prev };
      if (!copy[productId]) return prev;
      if (copy[productId].qty > 1) {
        copy[productId].qty -= 1;
      } else {
        delete copy[productId];
      }
      return copy;
    });
  }

  function removeItem(productId) {
    setCart(prev => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  }

  function clearCart() {
    setCart({});
    setOpen(false);
  }

  const value = {
    cart,
    open,
    openCart,
    closeCart,
    addToCart,
    removeOne,
    removeItem,
    clearCart,
    cartCount,
    subtotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
