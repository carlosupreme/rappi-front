import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '../types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, businessId: string, businessName: string) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearCart: () => void
  toggleCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, businessId, businessName) => {
        const items = get().items
        const existing = items.find(i => i.product.id === product.id)
        if (existing) {
          set({ items: items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) })
        } else {
          set({ items: [...items, { product, quantity: 1, businessId, businessName }], isOpen: true })
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter(i => i.product.id !== productId) }),

      updateQty: (productId, qty) => {
        if (qty <= 0) {
          get().removeItem(productId)
          return
        }
        set({ items: get().items.map(i => i.product.id === productId ? { ...i, quantity: qty } : i) })
      },

      clearCart: () => set({ items: [], isOpen: false }),

      toggleCart: () => set({ isOpen: !get().isOpen }),

      total: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'rappi-cart' }
  )
)
