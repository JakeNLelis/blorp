import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tables } from '@/types/supabase';

export interface CartItem {
  product: Tables<"products">;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Tables<"products">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const sanitizedQuantity = Math.max(1, Math.floor(Number.isFinite(quantity) ? quantity : 1));
        set((state) => {
          const existingItem = state.items.find((item) => item.product.id === product.id);

          if (existingItem) {
            const finalQty = Math.min(product.stock ?? 50, existingItem.quantity + sanitizedQuantity);
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: finalQty }
                  : item
              ),
            };
          }

          const finalQty = Math.min(product.stock ?? 50, sanitizedQuantity);
          return { items: [...state.items, { product, quantity: finalQty }] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        const sanitizedQuantity = Math.max(1, Math.floor(Number.isFinite(quantity) ? quantity : 1));
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId 
              ? { ...item, quantity: Math.min(item.product.stock ?? 50, sanitizedQuantity) } 
              : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      totalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.sale_price !== null && item.product.sale_price !== undefined
            ? Number(item.product.sale_price)
            : Number(item.product.price);
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'blorp-cart',
    }
  )
);
