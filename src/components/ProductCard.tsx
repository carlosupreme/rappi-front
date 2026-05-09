import type { Product, CartItem } from '../types'
import { useCartStore } from '../store/cartStore'

interface Props {
  product: Product
  businessId: string
  businessName: string
}

export default function ProductCard({ product, businessId, businessName }: Props) {
  const { items, addItem, updateQty } = useCartStore()
  const cartItem = items.find((i: CartItem) => i.product.id === product.id)

  return (
    <div className="bg-white rounded-xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop' }}
        />
      </div>

      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm leading-tight">{product.name}</h4>
        <p className="text-gray-500 text-xs line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold text-gray-900">${product.price.toLocaleString()}</span>

          {cartItem ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(product.id, cartItem.quantity - 1)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 transition"
              >
                −
              </button>
              <span className="font-semibold text-sm w-4 text-center">{cartItem.quantity}</span>
              <button
                onClick={() => updateQty(product.id, cartItem.quantity + 1)}
                className="w-7 h-7 rounded-full bg-[#ff6b35] hover:bg-[#e55a28] flex items-center justify-center font-bold text-white transition"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addItem(product, businessId, businessName)}
              disabled={!product.isAvailable}
              className="bg-[#ff6b35] hover:bg-[#e55a28] disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-1.5 rounded-full transition"
            >
              {product.isAvailable ? '+ Agregar' : 'Agotado'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
