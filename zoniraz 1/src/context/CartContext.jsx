import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { requireAuth } = useContext(AuthContext);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('zoniraz_cart');
    return saved ? JSON.parse(saved) : {};
  });

  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem('zoniraz_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, selectedPurity = '18KT') => {
    requireAuth(() => {
      setCart(prev => {
        const existing = prev[product.id];
        if (existing) {
          return {
            ...prev,
            [product.id]: {
              ...existing,
              quantity: existing.quantity + quantity
            }
          };
        }
        return {
          ...prev,
          [product.id]: {
            ...product,
            quantity,
            selectedPurity
          }
        };
      });
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => {
      if (!prev[productId]) return prev;
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity
        }
      };
    });
  };

  const clearCart = () => {
    setCart({});
    setCoupon(null);
  };

  const applyCoupon = async (code) => {
    const res = await fetch('http://localhost:5000/api/coupons/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid Coupon');
    setCoupon({ code, ...data });
    return data;
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Calculations
  const cartList = Object.values(cart);
  const subtotal = cartList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Jewellery GST is typically 3%
  const gst = Math.round(subtotal * 0.03);
  
  // Free delivery above ₹1999
  const shipping = subtotal > 1999 || subtotal === 0 ? 0 : 99;

  let discount = 0;
  if (coupon) {
    if (coupon.discountType === 'percentage') {
      discount = Math.round(subtotal * coupon.value);
    } else {
      discount = coupon.value;
    }
  }

  const grandTotal = Math.max(0, subtotal + gst + shipping - discount);

  return (
    <CartContext.Provider value={{
      cart,
      cartList,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      coupon,
      applyCoupon,
      removeCoupon,
      subtotal,
      gst,
      shipping,
      discount,
      grandTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
