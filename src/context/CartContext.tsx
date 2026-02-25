'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ICartItem, IProduct } from '@/types';

interface CartContextType {
  items: ICartItem[];
  storeSlug: string | null;
  addToCart: (product: IProduct, storeSlug: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ICartItem[]>([]);
  const [storeSlug, setStoreSlug] = useState<string | null>(null);

  const addToCart = useCallback((product: IProduct, slug: string) => {
    setItems((prev) => {
      // If cart has items from different store, clear it
      if (storeSlug && storeSlug !== slug) {
        setStoreSlug(slug);
        return [{ productId: product._id, product, quantity: 1 }];
      }

      setStoreSlug(slug);
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...prev, { productId: product._id, product, quantity: 1 }];
    });
  }, [storeSlug]);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => {
      const filtered = prev.filter((item) => item.productId !== productId);
      if (filtered.length === 0) setStoreSlug(null);
      return filtered;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    setStoreSlug(null);
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, storeSlug, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getItemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
