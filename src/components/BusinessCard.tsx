import { Link } from 'react-router-dom'
import type { Business } from '../types'

interface Props { business: Business }

export default function BusinessCard({ business }: Props) {
  return (
    <Link
      to={`/business/${business.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={business.imageUrl}
          alt={business.name}
          className="w-full h-full object-cover"
          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' }}
        />
        {!business.isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold bg-black/70 px-3 py-1 rounded-full text-sm">Cerrado</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
          {business.tags.slice(0, 2).map(tag => (
            <span key={tag} className="bg-white/90 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-1 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 text-base leading-tight">{business.name}</h3>
          <span className="flex items-center gap-1 text-sm font-semibold text-amber-500 shrink-0">
            ⭐ {business.rating.toFixed(1)}
          </span>
        </div>
        <p className="text-gray-500 text-xs line-clamp-2">{business.description}</p>
        <div className="mt-auto pt-3 flex items-center gap-3 text-xs text-gray-500 border-t border-gray-50">
          <span>🕐 {business.deliveryTime} min</span>
          <span>·</span>
          <span>🛵 ${business.deliveryFee.toLocaleString()}</span>
          <span>·</span>
          <span>{business.category.icon} {business.category.name}</span>
        </div>
      </div>
    </Link>
  )
}
