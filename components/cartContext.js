// handle the cart state with context
// Path: components/cartContext.js
import { createContext, useContext, useState } from 'react';

const CartContext = createContext();
const CartUpdateContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function useCartUpdate() {
  return useContext(CartUpdateContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function add2Cart(item) {
    // handle the case in wich item is an array
    if (Array.isArray(item)) {
      setCart([...cart, ...item]);
      return;
    }
    setCart([...cart, item]);
  }

  function removeFromCart(item) {
    const newCart = cart.filter((cartItem) => cartItem._id !== item._id);
    setCart(newCart);
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      <CartUpdateContext.Provider
        value={{ add2Cart, removeFromCart, clearCart }}
      >
        {children}
      </CartUpdateContext.Provider>
    </CartContext.Provider>
  );
}
