import React, { useState, useMemo, useEffect } from "react";
import CartContext from "./CartContext";

export function CartProvider({ children }) {
  const [cart, _setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("reapers_cart");
      return savedCart ? JSON.parse(savedCart) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("reapers_cart", JSON.stringify(cart));
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

  const value = {
    cart,
    open,
    setOpen,
    cartCount,
    subtotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
