import React, { createContext, useContext, useState, useMemo, useEffect } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("reapers_cart");
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
      return {};
    }
  });


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
      const size = selectedSize || product.selectedSize || "";
      const color = selectedColor || product.selectedColor || "";

      const baseId = product.productId || product.id;


      const cartItemId = `${baseId}-${color}-${size}`;

      const prevItem = prev[cartItemId] || {};
      const newQty = (prevItem.qty || 0) + (quantity || 1);



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
          title: product.title || product.name,
          id: cartItemId,
          productId: baseId,
          price: product.price,
          image: imageToUse,
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
