import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useCartStore } from '../store/cartStore'
import { createOrder } from '../api/client'
import type { CartItem } from '../types'

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQty, clearCart, total } = useCartStore()
  const navigate = useNavigate()
  const [showCheckout, setShowCheckout] = useState(false)
  const [form, setForm] = useState({ customerName: '', address: '', phone: '', notes: '' })

  const businessId = items[0]?.businessId
  const businessName = items[0]?.businessName
  const deliveryFee = 4000
  const subtotal = total()

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      clearCart()
      setShowCheckout(false)
      navigate(`/orders/${order.id}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessId) return
    mutation.mutate({
      businessId,
      ...form,
      items: items.map((i: CartItem) => ({ productId: i.product.id, quantity: i.quantity })),
    })
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={toggleCart} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-xl font-bold">Tu carrito</h2>
            {businessName && <p className="text-sm text-gray-500">{businessName}</p>}
          </div>
          <button onClick={toggleCart} className="text-gray-400 hover:text-gray-600 text-2xl transition">×</button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
            <span className="text-6xl">🛒</span>
            <p className="font-medium">Tu carrito está vacío</p>
            <button onClick={toggleCart} className="text-[#ff6b35] font-semibold hover:underline">
              Explorar negocios
            </button>
          </div>
        ) : !showCheckout ? (
          <>
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              {items.map((item: CartItem) => (
                <div key={item.product.id} className="flex gap-3 items-center">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-lg object-cover bg-gray-100"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.product.name}</p>
                    <p className="text-[#ff6b35] font-semibold text-sm">${item.product.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => updateQty(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold transition">−</button>
                    <span className="font-semibold text-sm w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-[#ff6b35] hover:bg-[#e55a28] flex items-center justify-center font-bold text-white transition">+</button>
                  </div>
                  <button onClick={() => removeItem(item.product.id)} className="text-gray-300 hover:text-red-400 text-lg transition ml-1">🗑</button>
                </div>
              ))}
            </div>

            <div className="border-t p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Domicilio</span>
                  <span>${deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Total</span>
                  <span>${(subtotal + deliveryFee).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-[#ff6b35] hover:bg-[#e55a28] text-white font-bold py-3 rounded-full transition"
              >
                Ir a pagar
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 p-5 flex flex-col gap-4">
              <h3 className="font-bold text-lg">Datos de entrega</h3>

              {[
                { name: 'customerName', label: 'Nombre completo', placeholder: 'Tu nombre', type: 'text' },
                { name: 'address', label: 'Dirección', placeholder: 'Calle, número, barrio', type: 'text' },
                { name: 'phone', label: 'Teléfono', placeholder: '+57 300 000 0000', type: 'tel' },
              ].map(field => (
                <div key={field.name} className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">{field.label}</label>
                  <input
                    type={field.type}
                    required
                    placeholder={field.placeholder}
                    value={form[field.name as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [field.name]: e.target.value }))}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35] transition"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Notas (opcional)</label>
                <textarea
                  placeholder="Instrucciones especiales..."
                  value={form.notes}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35] resize-none transition"
                />
              </div>

              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 text-sm">
                <div className="flex justify-between font-bold text-base">
                  <span>Total a pagar</span>
                  <span className="text-[#ff6b35]">${(subtotal + deliveryFee).toLocaleString()}</span>
                </div>
              </div>

              {mutation.isError && (
                <p className="text-red-500 text-sm">Error al crear el pedido. Intenta de nuevo.</p>
              )}
            </div>

            <div className="border-t p-5 flex gap-3">
              <button type="button" onClick={() => setShowCheckout(false)}
                className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-full hover:bg-gray-50 transition">
                Volver
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 bg-[#ff6b35] hover:bg-[#e55a28] disabled:opacity-60 text-white font-bold py-3 rounded-full transition"
              >
                {mutation.isPending ? 'Procesando...' : 'Confirmar pedido'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
