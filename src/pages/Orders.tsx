import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { fetchOrders, fetchOrder } from '../api/client'

const STATUS_MAP = {
  PENDING: { label: 'Recibido', color: 'bg-yellow-100 text-yellow-700', icon: '📋' },
  CONFIRMED: { label: 'Confirmado', color: 'bg-blue-100 text-blue-700', icon: '✅' },
  PREPARING: { label: 'Preparando', color: 'bg-orange-100 text-orange-700', icon: '👨‍🍳' },
  ON_THE_WAY: { label: 'En camino', color: 'bg-purple-100 text-purple-700', icon: '🛵' },
  DELIVERED: { label: 'Entregado', color: 'bg-green-100 text-green-700', icon: '🎉' },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-700', icon: '❌' },
}

export function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrder(id!),
    enabled: !!id,
  })

  if (isLoading) return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="animate-spin text-4xl mb-4">🔄</div>
      <p className="text-gray-500">Cargando pedido...</p>
    </div>
  )

  if (!order) return <div className="text-center py-20 text-gray-400">Pedido no encontrado</div>

  const status = STATUS_MAP[order.status]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#ff6b35] mb-6 transition">
        ← Mis pedidos
      </Link>

      {/* Success banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6 mb-6 text-center">
        <div className="text-5xl mb-2">🎉</div>
        <h1 className="text-2xl font-black text-gray-900">¡Pedido realizado!</h1>
        <p className="text-gray-500 mt-1">Tu pedido en <strong>{order.business.name}</strong> fue recibido</p>
      </div>

      {/* Status */}
      <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Estado del pedido</p>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${status.color}`}>
              {status.icon} {status.label}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Pedido</p>
            <p className="font-mono text-xs text-gray-600">#{order.id.slice(-8).toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4">Productos</h2>
        <div className="flex flex-col gap-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-[#ff6b35] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <span className="text-sm font-semibold">${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>${order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Domicilio</span>
            <span>${order.deliveryFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-base mt-1">
            <span>Total</span>
            <span className="text-[#ff6b35]">${order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Delivery info */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-3">Datos de entrega</h2>
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex gap-3"><span>👤</span><span>{order.customerName}</span></div>
          <div className="flex gap-3"><span>📍</span><span>{order.address}</span></div>
          <div className="flex gap-3"><span>📞</span><span>{order.phone}</span></div>
          {order.notes && <div className="flex gap-3"><span>📝</span><span>{order.notes}</span></div>}
        </div>
      </div>

      <Link to="/" className="mt-6 block w-full text-center bg-[#ff6b35] hover:bg-[#e55a28] text-white font-bold py-3 rounded-full transition">
        Seguir comprando
      </Link>
    </div>
  )
}

export default function Orders() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Mis pedidos</h1>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-white rounded-xl animate-pulse shadow-sm" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <span className="text-5xl block mb-4">📦</span>
          <p className="font-medium">Aún no tienes pedidos</p>
          <Link to="/" className="text-[#ff6b35] hover:underline mt-2 inline-block">Hacer mi primer pedido</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map(order => {
            const status = STATUS_MAP[order.status]
            return (
              <Link key={order.id} to={`/orders/${order.id}`}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center gap-4">
                <img src={order.business.imageUrl} alt={order.business.name}
                  className="w-14 h-14 rounded-xl object-cover bg-gray-100"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900">{order.business.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{order.items.length} producto(s) · ${order.total.toLocaleString()}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                  {status.icon} {status.label}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
