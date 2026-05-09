import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchBusiness } from '../api/client'
import ProductCard from '../components/ProductCard'
import { useCartStore } from '../store/cartStore'

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>()
  const { itemCount, toggleCart } = useCartStore()
  const count = itemCount()

  const { data: business, isLoading, isError } = useQuery({
    queryKey: ['business', id],
    queryFn: () => fetchBusiness(id!),
    enabled: !!id,
  })

  if (isLoading) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="h-56 bg-gray-200 rounded-2xl animate-pulse mb-4" />
      <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3 mb-2" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-xl animate-pulse" />)}
      </div>
    </div>
  )

  if (isError || !business) return (
    <div className="text-center py-20 text-gray-400">
      <p className="text-5xl mb-4">😕</p>
      <p className="font-medium">Negocio no encontrado</p>
      <Link to="/" className="text-[#ff6b35] hover:underline mt-2 inline-block">Volver al inicio</Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#ff6b35] mb-4 transition">
        ← Volver
      </Link>

      {/* Cover */}
      <div className="relative h-52 rounded-2xl overflow-hidden mb-6">
        <img src={business.coverUrl} alt={business.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-2xl font-black">{business.name}</h1>
          <div className="flex items-center gap-3 text-sm mt-1 text-white/90">
            <span>⭐ {business.rating.toFixed(1)} ({business.reviewCount})</span>
            <span>·</span>
            <span>🕐 {business.deliveryTime} min</span>
            <span>·</span>
            <span>🛵 ${business.deliveryFee.toLocaleString()}</span>
          </div>
        </div>
        {!business.isOpen && (
          <div className="absolute top-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">Cerrado</div>
        )}
      </div>

      {/* Info chips */}
      <div className="flex gap-2 flex-wrap mb-8">
        <span className="bg-orange-50 text-[#ff6b35] text-xs font-semibold px-3 py-1.5 rounded-full">
          {business.category.icon} {business.category.name}
        </span>
        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
          Pedido mínimo: ${business.minOrder.toLocaleString()}
        </span>
        {business.tags.map(tag => (
          <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">{tag}</span>
        ))}
      </div>

      {/* Products */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          Productos <span className="text-gray-400 font-normal text-base">({business.products.length})</span>
        </h2>
        <Link to={`/business/${business.id}/add-product`}
          className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition">
          + Agregar producto
        </Link>
      </div>

      {business.products.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p>Este negocio no tiene productos disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {business.products.map(p => (
            <ProductCard key={p.id} product={p} businessId={business.id} businessName={business.name} />
          ))}
        </div>
      )}

      {/* Floating cart button */}
      {count > 0 && (
        <button
          onClick={toggleCart}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:bg-gray-800 transition flex items-center gap-3 z-30"
        >
          <span className="bg-[#ff6b35] text-white text-sm w-6 h-6 rounded-full flex items-center justify-center font-black">
            {count}
          </span>
          Ver carrito
        </button>
      )}
    </div>
  )
}
