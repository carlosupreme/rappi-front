import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createBusiness, fetchCategories } from '../api/client'

const INITIAL = {
  name: '', description: '', imageUrl: '', coverUrl: '',
  categoryId: '', deliveryTime: 30, deliveryFee: 4000, minOrder: 20000,
  address: '', tagInput: '', tags: [] as string[],
}

export default function RegisterBusiness() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)

  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })

  const mutation = useMutation({
    mutationFn: createBusiness,
    onSuccess: (b) => navigate(`/business/${b.id}`),
  })

  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  const addTag = () => {
    const tag = form.tagInput.trim()
    if (tag && !form.tags.includes(tag)) set('tags', [...form.tags, tag])
    set('tagInput', '')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { tagInput, ...rest } = form
    void tagInput
    mutation.mutate(rest)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#ff6b35] mb-6 transition">
        ← Volver
      </Link>

      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-black text-gray-900 mb-1">Registrar negocio</h1>
        <p className="text-gray-500 text-sm mb-8">Completa los datos para que tu negocio aparezca en la plataforma.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Basic info */}
          <Section title="Información básica">
            <Field label="Nombre del negocio" required>
              <input required placeholder="Ej: Restaurante La Fogata" value={form.name}
                onChange={e => set('name', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Descripción" required>
              <textarea required rows={3} placeholder="Describe tu negocio en pocas palabras..."
                value={form.description} onChange={e => set('description', e.target.value)}
                className={`${inputCls} resize-none`} />
            </Field>
            <Field label="Categoría" required>
              <select required value={form.categoryId} onChange={e => set('categoryId', e.target.value)} className={inputCls}>
                <option value="">Selecciona una categoría</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Dirección" required>
              <input required placeholder="Calle, número, barrio, ciudad" value={form.address}
                onChange={e => set('address', e.target.value)} className={inputCls} />
            </Field>
          </Section>

          {/* Images */}
          <Section title="Imágenes">
            <Field label="URL imagen principal (cuadrada)" required>
              <input required type="url" placeholder="https://..." value={form.imageUrl}
                onChange={e => set('imageUrl', e.target.value)} className={inputCls} />
              {form.imageUrl && (
                <img src={form.imageUrl} alt="preview" className="mt-2 h-20 w-20 rounded-xl object-cover border" />
              )}
            </Field>
            <Field label="URL imagen de portada (banner)" required>
              <input required type="url" placeholder="https://..." value={form.coverUrl}
                onChange={e => set('coverUrl', e.target.value)} className={inputCls} />
              {form.coverUrl && (
                <img src={form.coverUrl} alt="cover preview" className="mt-2 h-20 w-full rounded-xl object-cover border" />
              )}
            </Field>
          </Section>

          {/* Delivery */}
          <Section title="Configuración de entrega">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Tiempo entrega (min)', key: 'deliveryTime', min: 5 },
                { label: 'Costo domicilio ($)', key: 'deliveryFee', min: 0 },
                { label: 'Pedido mínimo ($)', key: 'minOrder', min: 0 },
              ].map(f => (
                <Field key={f.key} label={f.label} required>
                  <input required type="number" min={f.min}
                    value={form[f.key as keyof typeof form] as number}
                    onChange={e => set(f.key, Number(e.target.value))}
                    className={inputCls} />
                </Field>
              ))}
            </div>
          </Section>

          {/* Tags */}
          <Section title="Etiquetas (opcional)">
            <div className="flex gap-2">
              <input placeholder='Ej: Popular, Rápido, 24 horas' value={form.tagInput}
                onChange={e => set('tagInput', e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                className={`${inputCls} flex-1`} />
              <button type="button" onClick={addTag}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition">
                + Agregar
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map(t => (
                  <span key={t} className="flex items-center gap-1.5 bg-orange-50 text-[#ff6b35] text-sm font-medium px-3 py-1 rounded-full">
                    {t}
                    <button type="button" onClick={() => set('tags', form.tags.filter(x => x !== t))}
                      className="text-orange-300 hover:text-red-400 text-xs">✕</button>
                  </span>
                ))}
              </div>
            )}
          </Section>

          {mutation.isError && (
            <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">
              Error al registrar. Verifica los datos e intenta de nuevo.
            </p>
          )}

          <button type="submit" disabled={mutation.isPending}
            className="w-full bg-[#ff6b35] hover:bg-[#e55a28] disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition text-base mt-2">
            {mutation.isPending ? 'Registrando...' : 'Registrar negocio'}
          </button>
        </form>
      </div>
    </div>
  )
}

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35] transition bg-white'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b pb-2">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  )
}
