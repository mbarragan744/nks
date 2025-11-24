import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user: currentUser } = useAuth();

  const syncCartToFirestore = useCallback(async (updatedCart) => {
    if (currentUser) {
      const cartRef = doc(db, "carts", currentUser.uid);
      try {
        const cartItems = updatedCart.map(item => ({ id: item.id, quantity: item.quantity }));
        await setDoc(cartRef, { items: cartItems }, { merge: true });
      } catch (error) {
        console.error("Error al sincronizar el carrito:", error);
      }
    }
  }, [currentUser]);

  const fetchCartFromFirestore = useCallback(async () => {
    if (currentUser) {
      try {
        const cartRef = doc(db, "carts", currentUser.uid);
        const docSnap = await getDoc(cartRef);
        if (docSnap.exists()) {
          const cartItems = docSnap.data().items || [];
          setCart(cartItems);
        }
      } catch (error) {
        console.error("Error al recuperar el carrito:", error);
      }
    }
  }, [currentUser]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      let updatedCart;

      if (existingItem) {
        updatedCart = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...prevCart, { id: product.id, quantity }];
      }

      syncCartToFirestore(updatedCart);
      return updatedCart;
    });
  }, [syncCartToFirestore]);

  const removeFromCart = useCallback(async (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(item => item.id !== id);
      syncCartToFirestore(updatedCart);
      return updatedCart;
    });
  }, [syncCartToFirestore]);

  const updateQuantity = useCallback(async (id, quantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      syncCartToFirestore(updatedCart);
      return updatedCart;
    });
  }, [syncCartToFirestore]);

  const fetchProductDetails = useCallback(async (productId) => {
    try {
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const netPrice = parseFloat(data.netPrice) || 0;
        const stock = parseInt(data.stock, 10) || 0;

        return {
          ...data,
          price: parseFloat(data.price) || 0,
          netPrice,
          stock,
          discount: data.discount || 0,
        };
      } else {
        console.error("No se encontró el producto:", productId);
        return null;
      }
    } catch (error) {
      console.error("Error al obtener detalles del producto:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchCartFromFirestore();
  }, [fetchCartFromFirestore]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, fetchProductDetails }}>
      {children}
    </CartContext.Provider>
  );
};
