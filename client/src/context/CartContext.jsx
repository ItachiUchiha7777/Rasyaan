import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import API from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync with backend if user is logged in, else use localStorage
  const fetchCart = async () => {
    if (user) {
      try {
        setLoading(true);
        const { data } = await API.get('/cart');
        const formattedItems = (data.items || []).map((item) => ({
          _id: item._id,
          product: item.product,
          quantity: item.quantity,
          price: item.price
        }));
        setCartItems(formattedItems);
      } catch (err) {
        console.error('Error fetching cart:', err);
      } finally {
        setLoading(false);
      }
    } else {
      const localCart = localStorage.getItem('rasyaan_local_cart');
      if (localCart) {
        try {
          setCartItems(JSON.parse(localCart));
        } catch (e) {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // Save guest cart locally
  useEffect(() => {
    if (!user) {
      localStorage.setItem('rasyaan_local_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

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
      // Local cart
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
            _id: `local-${Date.now()}`,
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
