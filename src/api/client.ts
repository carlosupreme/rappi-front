import axios from 'axios'
import type { Category, Business, Product, Order } from '../types'

const api = axios.create({ baseURL: '/api' })

export const fetchCategories = (): Promise<Category[]> =>
  api.get('/categories').then(r => r.data)

export const fetchBusinesses = (params?: {
  category?: string
  search?: string
}): Promise<Business[]> => api.get('/businesses', { params }).then(r => r.data)

export const fetchBusiness = (id: string): Promise<Business & { products: Product[] }> =>
  api.get(`/businesses/${id}`).then(r => r.data)

export const fetchOrders = (): Promise<Order[]> =>
  api.get('/orders').then(r => r.data)

export const fetchOrder = (id: string): Promise<Order> =>
  api.get(`/orders/${id}`).then(r => r.data)

export const createOrder = (data: {
  businessId: string
  customerName: string
  address: string
  phone: string
  notes?: string
  items: { productId: string; quantity: number }[]
}): Promise<Order> => api.post('/orders', data).then(r => r.data)

export const createBusiness = (data: {
  name: string
  description: string
  imageUrl: string
  coverUrl: string
  categoryId: string
  deliveryTime: number
  deliveryFee: number
  minOrder: number
  address: string
  tags: string[]
}): Promise<Business> => api.post('/businesses', data).then(r => r.data)

export const createProduct = (data: {
  name: string
  description: string
  price: number
  imageUrl: string
  businessId: string
  categoryId?: string
}): Promise<Product> => api.post('/products', data).then(r => r.data)
