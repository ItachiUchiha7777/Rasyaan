import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import API from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const syncAndFetchCart = async () => {
    if (authLoading) return;

    if (user) {
      try {
        setLoading(true);
        // Check if there are guest cart items to merge upon login
        const guestCartRaw = localStorage.getItem('rasyaan_guest_cart') || localStorage.getItem('rasyaan_local_cart');
        let guestItems = [];
        if (guestCartRaw) {
          try {
            guestItems = JSON.parse(guestCartRaw);
          } catch (e) {
            guestItems = [];
          }
        }

        if (Array.isArray(guestItems) && guestItems.length > 0) {
          const formattedGuestItems = guestItems.map((item) => ({
            productId: item.productId || (item.product && (item.product._id || item.product)),
            quantity: item.quantity || 1
          }));

          const { data: mergedData } = await API.post('/cart/merge', { items: formattedGuestItems });
          localStorage.removeItem('rasyaan_guest_cart');
          localStorage.removeItem('rasyaan_local_cart');

          const formatted = (mergedData.items || []).map((item) => ({
            _id: item._id,
            product: item.product,
            quantity: item.quantity,
            price: item.price
          }));
          setCartItems(formatted);
        } else {
          // Fetch existing user cart
          const { data } = await API.get('/cart');
          const formatted = (data.items || []).map((item) => ({
            _id: item._id,
            product: item.product,
            quantity: item.quantity,
            price: item.price
          }));
          setCartItems(formatted);
        }
      } catch (err) {
        console.error('Error fetching/merging cart:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest User: restore guest cart from localStorage
      const guestCartRaw = localStorage.getItem('rasyaan_guest_cart') || localStorage.getItem('rasyaan_local_cart');
      if (guestCartRaw) {
        try {
          setCartItems(JSON.parse(guestCartRaw));
        } catch (e) {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    }
  };

  useEffect(() => {
    syncAndFetchCart();
  }, [user, authLoading]);

  // Persist guest cart to localStorage when not logged in
  useEffect(() => {
    if (!user && !authLoading) {
      localStorage.setItem('rasyaan_guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user, authLoading]);

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        setLoading(true);
        const { data } = await API.post('/cart', {
          productId: product._id,
          quantity
        });
        const formattedItems = (data.items || []).map((item) => ({
          _id: item._id,
          product: item.product,
          quantity: item.quantity,
          price: item.price
        }));
        setCartItems(formattedItems);
        setIsCartOpen(true);
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      // Local Guest Cart
      const existingIdx = cartItems.findIndex((item) => item.product._id === product._id);
      let updated;
      if (existingIdx > -1) {
        const targetQty = cartItems[existingIdx].quantity + quantity;
        if (targetQty > product.stock) {
          throw new Error(`Only ${product.stock} items available in mountain stock.`);
        }
        updated = [...cartItems];
        updated[existingIdx].quantity = targetQty;
      } else {
        if (quantity > product.stock) {
          throw new Error(`Only ${product.stock} items available in mountain stock.`);
        }
        const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
        updated = [
          ...cartItems,
          {
            _id: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            productId: product._id,
            product,
            quantity,
            price: effectivePrice
          }
        ];
      }
      setCartItems(updated);
      setIsCartOpen(true);
    }
  };

  const updateQuantity = async (itemId, productObj, newQty) => {
    if (newQty <= 0) {
      return removeFromCart(itemId, productObj);
    }
    if (user) {
      try {
        setLoading(true);
        const { data } = await API.put(`/cart/${itemId}`, { quantity: newQty });
        const formattedItems = (data.items || []).map((item) => ({
          _id: item._id,
          product: item.product,
          quantity: item.quantity,
          price: item.price
        }));
        setCartItems(formattedItems);
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      const updated = cartItems.map((item) => {
        if (item._id === itemId || item.product._id === productObj?._id) {
          return { ...item, quantity: newQty };
        }
        return item;
      });
      setCartItems(updated);
    }
  };

  const removeFromCart = async (itemId, productObj) => {
    if (user) {
      try {
        setLoading(true);
        const { data } = await API.delete(`/cart/${itemId}`);
        const formattedItems = (data.items || []).map((item) => ({
          _id: item._id,
          product: item.product,
          quantity: item.quantity,
          price: item.price
        }));
        setCartItems(formattedItems);
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      const updated = cartItems.filter(
        (item) => item._id !== itemId && item.product._id !== productObj?._id
      );
      setCartItems(updated);
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await API.delete('/cart');
      } catch (err) {
        // Ignore
      }
    }
    setCartItems([]);
    localStorage.removeItem('rasyaan_guest_cart');
    localStorage.removeItem('rasyaan_local_cart');
  };

  // Calculations
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cartItems.reduce((total, item) => {
    const p = item.product;
    const itemPrice = p ? (p.discountPrice > 0 ? p.discountPrice : p.price) : item.price;
    return total + itemPrice * item.quantity;
  }, 0);

  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal,
        shippingFee,
        total,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
