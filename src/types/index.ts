export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  _count?: { businesses: number }
}

export interface Business {
  id: string
  name: string
  description: string
  imageUrl: string
  coverUrl: string
  categoryId: string
  category: Category
  rating: number
  reviewCount: number
  deliveryTime: number
  deliveryFee: number
  minOrder: number
  address: string
  isOpen: boolean
  tags: string[]
  _count?: { products: number }
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  businessId: string
  isAvailable: boolean
}

export interface OrderItem {
  productId: string
  quantity: number
  price: number
  name: string
}

export interface Order {
  id: string
  businessId: string
  business: { name: string; imageUrl: string }
  customerName: string
  address: string
  phone: string
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED'
  items: (OrderItem & { product?: { imageUrl: string } })[]
  subtotal: number
  deliveryFee: number
  total: number
  notes?: string
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
  businessId: string
  businessName: string
}
