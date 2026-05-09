import { create } from 'zustand'
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

const LS_KEY = 'rappi-cart'

const load = (): CartItem[] => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') as CartItem[] }
  catch { return [] }
}

const save = (items: CartItem[]): void => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(items)) } catch { /* ignore */ }
}

type Set = (partial: CartState | Partial<CartState> | ((s: CartState) => CartState | Partial<CartState>)) => void
type Get = () => CartState

export const useCartStore = create<CartState>((set: Set, get: Get): CartState => ({
  items: load(),
  isOpen: false,

  addItem: (product: Product, businessId: string, businessName: string): void => {
    const items = get().items
    const existing = items.find((i: CartItem) => i.product.id === product.id)
    const next = existing
      ? items.map((i: CartItem) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...items, { product, quantity: 1, businessId, businessName }]
    save(next)
    set({ items: next, isOpen: true })
  },

  removeItem: (productId: string): void => {
    const next = get().items.filter((i: CartItem) => i.product.id !== productId)
    save(next)
    set({ items: next })
  },

  updateQty: (productId: string, qty: number): void => {
    if (qty <= 0) { get().removeItem(productId); return }
    const next = get().items.map((i: CartItem) => i.product.id === productId ? { ...i, quantity: qty } : i)
    save(next)
    set({ items: next })
  },

  clearCart: (): void => { save([]); set({ items: [], isOpen: false }) },

  toggleCart: (): void => set({ isOpen: !get().isOpen }),

  total: (): number => get().items.reduce((sum: number, i: CartItem) => sum + i.product.price * i.quantity, 0),

  itemCount: (): number => get().items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0),
}))
