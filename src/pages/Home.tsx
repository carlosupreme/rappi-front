import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { fetchCategories, fetchBusinesses } from '../api/client'
import BusinessCard from '../components/BusinessCard'

export default function Home() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const [activeCategory, setActiveCategory] = useState('all')

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ['businesses', activeCategory, searchQuery],
    queryFn: () => fetchBusinesses({
      category: activeCategory === 'all' ? undefined : activeCategory,
      search: searchQuery || undefined,
    }),
  })

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#ff6b35] to-[#e55a28] rounded-3xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-black mb-1">¿Qué quieres hoy? 🚀</h1>
        <p className="text-orange-100">Restaurantes, supermercados, farmacias y más cerca de ti</p>
      </div>

      {/* Category pills */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Categorías</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition border-2 ${
              activeCategory === 'all'
                ? 'bg-[#ff6b35] text-white border-[#ff6b35]'
                : 'bg-white text-gray-700 border-gray-100 hover:border-[#ff6b35] hover:text-[#ff6b35]'
            }`}
          >
            🏪 Todos
          </button>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition border-2 ${
                activeCategory === cat.slug
                  ? 'bg-[#ff6b35] text-white border-[#ff6b35]'
                  : 'bg-white text-gray-700 border-gray-100 hover:border-[#ff6b35] hover:text-[#ff6b35]'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Businesses grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            {searchQuery ? `Resultados para "${searchQuery}"` : 'Negocios disponibles'}
          </h2>
          <span className="text-sm text-gray-400">{businesses.length} resultados</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <span className="text-5xl">🔍</span>
            <p className="mt-4 font-medium">No encontramos negocios</p>
            <button onClick={() => setActiveCategory('all')} className="mt-2 text-[#ff6b35] hover:underline text-sm">
              Ver todos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {businesses.map(b => <BusinessCard key={b.id} business={b} />)}
          </div>
        )}
      </section>
    </main>
  )
}
