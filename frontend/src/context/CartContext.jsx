import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { API_BASE_URL } from '../config';

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

  const addToCart = (product, quantity = 1, selectedPurity = '18KT', selectedSize = null, selectedStone = null, weightDetails = null) => {
    requireAuth(() => {
      setCart(prev => {
        const existing = prev[product.id];
        const grossW = weightDetails?.grossWeight || product.grossWeight || product.gross_weight || product.product_weight || product.weight || (existing?.grossWeight) || 0;
        const netW = weightDetails?.goldWeight || weightDetails?.netWeight || product.netWeight || product.goldWeight || product.gold_weight || (existing?.netWeight) || 0;

        if (existing) {
          return {
            ...prev,
            [product.id]: {
              ...existing,
              quantity: existing.quantity + quantity,
              selectedPurity: selectedPurity || existing.selectedPurity || '18KT',
              selectedSize: selectedSize || existing.selectedSize || null,
              selectedStone: selectedStone || existing.selectedStone || null,
              grossWeight: grossW,
              netWeight: netW,
              goldWeight: netW,
              configuration: {
                ...(existing.configuration || {}),
                metal: existing.selectedMetal || existing.configuration?.metal || 'YELLOW GOLD',
                purity: selectedPurity || existing.selectedPurity || '18KT',
                size: selectedSize || existing.selectedSize || null,
                stone: selectedStone || existing.selectedStone || null,
                grossWeight: grossW,
                netWeight: netW
              }
            }
          };
        }
        return {
          ...prev,
          [product.id]: {
            ...product,
            quantity,
            selectedPurity,
            selectedSize: selectedSize || null,
            selectedStone: selectedStone || null,
            grossWeight: grossW,
            netWeight: netW,
            goldWeight: netW,
            configuration: {
              metal: product.selectedMetal || 'YELLOW GOLD',
              purity: selectedPurity,
              size: selectedSize || null,
              stone: selectedStone || null,
              grossWeight: grossW,
              netWeight: netW
            }
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
    const currentSubtotal = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const res = await fetch(`${API_BASE_URL}/api/coupons/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal: currentSubtotal })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid Coupon Code');
    
    setCoupon({
      code: data.code || code.toUpperCase(),
      discountType: data.discountType,
      discountValue: data.discountValue,
      minCartValue: data.minCartValue || 0,
      message: data.message
    });
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
      discount = Math.round(subtotal * (coupon.discountValue / 100));
    } else {
      discount = Math.min(subtotal, Number(coupon.discountValue) || 0);
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
