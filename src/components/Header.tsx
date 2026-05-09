import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'

export default function Header() {
  const { itemCount, toggleCart } = useCartStore()
  const count = itemCount()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link to="/" className="text-2xl font-black text-[#ff6b35] tracking-tight shrink-0">
          rappi<span className="text-gray-800">·ts</span>
        </Link>

        <div className="flex-1 max-w-xl">
          <input
            type="search"
            placeholder="Buscar negocios, productos..."
            className="w-full px-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:bg-white transition"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const q = (e.target as HTMLInputElement).value.trim()
                if (q) navigate(`/?search=${encodeURIComponent(q)}`)
              }
            }}
          />
        </div>

        <nav className="flex items-center gap-4 ml-auto text-sm text-gray-600">
          <Link to="/orders" className="hover:text-[#ff6b35] font-medium transition">
            Mis pedidos
          </Link>
          <Link to="/register/business"
            className="hidden sm:inline-flex items-center gap-1.5 border border-[#ff6b35] text-[#ff6b35] hover:bg-orange-50 font-semibold px-3 py-1.5 rounded-full transition">
            🏪 Registrar negocio
          </Link>
          <button
            onClick={toggleCart}
            className="relative flex items-center gap-2 bg-[#ff6b35] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#e55a28] transition"
          >
            <span>🛒</span>
            <span>Carrito</span>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}
