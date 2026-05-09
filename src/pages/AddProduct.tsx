import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createProduct, fetchBusiness, fetchCategories } from '../api/client'

const INITIAL = { name: '', description: '', price: 0, imageUrl: '', categoryId: '' }

export default function AddProduct() {
  const { id: businessId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)

  const { data: business } = useQuery({
    queryKey: ['business', businessId],
    queryFn: () => fetchBusiness(businessId!),
    enabled: !!businessId,
  })

  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => navigate(`/business/${businessId}`),
  })

  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      ...form,
      price: Number(form.price),
      businessId: businessId!,
      categoryId: form.categoryId || undefined,
    })
  }

  const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35] transition'

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link to={`/business/${businessId}`}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#ff6b35] mb-6 transition">
        ← Volver a {business?.name ?? 'negocio'}
      </Link>

      <div className="bg-white rounded-2xl shadow-sm p-8">
        {business && (
          <div className="flex items-center gap-3 mb-6 pb-6 border-b">
            <img src={business.imageUrl} alt={business.name} className="w-12 h-12 rounded-xl object-cover" />
            <div>
              <p className="text-xs text-gray-400">Agregando producto a</p>
              <p className="font-bold text-gray-900">{business.name}</p>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-black text-gray-900 mb-1">Nuevo producto</h1>
        <p className="text-gray-500 text-sm mb-8">El producto aparecerá en la página del negocio al instante.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Nombre <span className="text-red-400">*</span></label>
            <input required placeholder="Ej: Hamburguesa Especial" value={form.name}
              onChange={e => set('name', e.target.value)} className={inputCls} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Descripción <span className="text-red-400">*</span></label>
            <textarea required rows={3} placeholder="Ingredientes, tamaño, sabor..."
              value={form.description} onChange={e => set('description', e.target.value)}
              className={`${inputCls} resize-none`} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Precio (COP) <span className="text-red-400">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input required type="number" min={100} placeholder="15000"
                value={form.price || ''} onChange={e => set('price', e.target.value)}
                className={`${inputCls} pl-8`} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">URL de imagen <span className="text-red-400">*</span></label>
            <input required type="url" placeholder="https://images.unsplash.com/..."
              value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} className={inputCls} />
            {form.imageUrl && (
              <img src={form.imageUrl} alt="preview" className="mt-2 h-24 w-24 rounded-xl object-cover border" />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Categoría (opcional)</label>
            <select value={form.categoryId} onChange={e => set('categoryId', e.target.value)} className={inputCls}>
              <option value="">Sin categoría específica</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          {mutation.isError && (
            <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">
              Error al crear el producto. Verifica los datos.
            </p>
          )}

          <button type="submit" disabled={mutation.isPending}
            className="w-full bg-[#ff6b35] hover:bg-[#e55a28] disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition text-base mt-2">
            {mutation.isPending ? 'Guardando...' : '+ Agregar producto'}
          </button>
        </form>
      </div>
    </div>
  )
}
