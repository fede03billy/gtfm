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
    setCart([...cart, item]);
  }

  function removeFromCart(item) {
    const newCart = cart.filter((cartItem) => cartItem.id !== item.id);
    setCart(newCart);
  }

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      <CartUpdateContext.Provider value={{ add2Cart, removeFromCart }}>
        {children}
      </CartUpdateContext.Provider>
    </CartContext.Provider>
  );
}
