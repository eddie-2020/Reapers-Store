import React, { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  // cart keyed by product id
  const [cart, setCart] = useState({});
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
      const prevItem = prev[product.id] || {};
      const newQty = (prevItem.qty || 0) + (quantity || 1);
      return {
        ...prev,
        [product.id]: {
          ...product,
          title: product.title || product.name,
          id: product.id,
          price: product.price,
          image: product.images?.[0] || product.img,
          qty: newQty,
          selectedSize: selectedSize || prevItem.selectedSize || "",
          selectedColor: selectedColor || prevItem.selectedColor || ""
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
