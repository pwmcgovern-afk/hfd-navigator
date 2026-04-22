'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORIES_I18N } from '@/lib/categories'

interface ResourceFormProps {
  initialData?: {
    id?: string
    name: string
    organization: string | null
    description: string
    categories: string[]
    address: string | null
    city: string
    state: string
    zip: string | null
    phone: string | null
    website: string | null
    email: string | null
    hours: string | null
    eligibility: Record<string, unknown> | null
    howToApply: string | null
    tips: string[]
    organizationEs: string | null
    nameEs: string | null
    descriptionEs: string | null
    howToApplyEs: string | null
    tipsEs: string[]
  }
  mode: 'create' | 'edit'
}

export default function ResourceForm({ initialData, mode }: ResourceFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: initialData?.name || '',
    organization: initialData?.organization || '',
    description: initialData?.description || '',
    categories: initialData?.categories || [],
    address: initialData?.address || '',
    city: initialData?.city || 'Hartford',
    state: initialData?.state || 'CT',
    zip: initialData?.zip || '',
    phone: initialData?.phone || '',
    website: initialData?.website || '',
    email: initialData?.email || '',
    hours: initialData?.hours || '',
    howToApply: initialData?.howToApply || '',
    tips: (initialData?.tips || []).join('\n'),
    organizationEs: initialData?.organizationEs || '',
    nameEs: initialData?.nameEs || '',
    descriptionEs: initialData?.descriptionEs || '',
    howToApplyEs: initialData?.howToApplyEs || '',
    tipsEs: (initialData?.tipsEs || []).join('\n'),
    eligibility: initialData?.eligibility ? JSON.stringify(initialData.eligibility, null, 2) : '',
  })

  const toggleCategory = (slug: string) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(slug)
        ? prev.categories.filter(c => c !== slug)
        : [...prev.categories, slug]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    // Parse eligibility JSON before the network call so the user gets a
    // precise error in the form instead of a generic "save failed".
    let eligibility: unknown = null
    if (form.eligibility.trim()) {
      try {
        eligibility = JSON.parse(form.eligibility)
      } catch (err) {
        setSaving(false)
        const reason = err instanceof Error ? err.message : 'invalid JSON'
        setError(`Eligibility field is not valid JSON: ${reason}`)
        return
      }
    }

    try {
      const body = {
        name: form.name,
        organization: form.organization || null,
        description: form.description,
        categories: form.categories,
        address: form.address || null,
        city: form.city,
        state: form.state,
        zip: form.zip || null,
        phone: form.phone || null,
        website: form.website || null,
        email: form.email || null,
        hours: form.hours || null,
        howToApply: form.howToApply || null,
        tips: form.tips.split('\n').map(t => t.trim()).filter(Boolean),
        organizationEs: form.organizationEs || null,
        nameEs: form.nameEs || null,
        descriptionEs: form.descriptionEs || null,
        howToApplyEs: form.howToApplyEs || null,
        tipsEs: form.tipsEs.split('\n').map(t => t.trim()).filter(Boolean),
        eligibility,
      }

      const url = mode === 'edit'
        ? `/api/admin/resources/${initialData?.id}`
        : '/api/admin/resources'

      const res = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }

      router.push(`/admin/resources?success=${mode === 'edit' ? 'updated' : 'created'}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save resource')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!initialData?.id) return
    if (!confirm('Delete this resource permanently? This cannot be undone.')) return

    try {
      await fetch(`/api/admin/resources/${initialData.id}`, { method: 'DELETE' })
      router.push('/admin/resources?success=deleted')
    } catch {
      setError('Failed to delete resource')
    }
  }

  const fieldClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Name *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Organization</label>
            <input type="text" value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} className={fieldClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description *</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={3} className={fieldClass} />
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClass}>Categories *</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES_I18N.map(cat => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => toggleCategory(cat.slug)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  form.categories.includes(cat.slug)
                    ? 'bg-teal-100 border-teal-300 text-teal-800'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat.icon} {cat.en}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Zip</label>
            <input type="text" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} className={fieldClass} maxLength={5} />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Phone</label>
            <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Website</label>
            <input type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Hours</label>
            <input type="text" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} className={fieldClass} placeholder="Mon-Fri 9am-5pm" />
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>How to Get Help</label>
            <textarea value={form.howToApply} onChange={e => setForm({ ...form, howToApply: e.target.value })} rows={2} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Tips (one per line)</label>
            <textarea value={form.tips} onChange={e => setForm({ ...form, tips: e.target.value })} rows={3} className={fieldClass} placeholder="Arrive early for shorter wait times&#10;Bring photo ID and proof of address" />
          </div>
          <div>
            <label className={labelClass}>Eligibility (JSON)</label>
            <textarea value={form.eligibility} onChange={e => setForm({ ...form, eligibility: e.target.value })} rows={3} className={`${fieldClass} font-mono text-xs`} placeholder='{"incomeLimitPctFpl": 200, "housingStatus": ["homeless", "at_risk"]}' />
          </div>
        </div>
      </section>

      {/* Spanish */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Spanish Translations</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Nombre (Name)</label>
            <input type="text" value={form.nameEs} onChange={e => setForm({ ...form, nameEs: e.target.value })} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Organización (Organization)</label>
            <input type="text" value={form.organizationEs} onChange={e => setForm({ ...form, organizationEs: e.target.value })} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Descripción (Description)</label>
            <textarea value={form.descriptionEs} onChange={e => setForm({ ...form, descriptionEs: e.target.value })} rows={3} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Como Obtener Ayuda (How to Get Help)</label>
            <textarea value={form.howToApplyEs} onChange={e => setForm({ ...form, howToApplyEs: e.target.value })} rows={2} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Consejos (Tips, one per line)</label>
            <textarea value={form.tipsEs} onChange={e => setForm({ ...form, tipsEs: e.target.value })} rows={3} className={fieldClass} />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          {mode === 'edit' && (
            <button type="button" onClick={handleDelete} className="px-4 py-2 text-sm text-red-600 hover:text-red-800 font-medium">
              Delete Resource
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <a href="/admin/resources" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">
            Cancel
          </a>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-teal-700 text-white text-sm font-medium rounded-lg hover:bg-teal-800 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : mode === 'edit' ? 'Update Resource' : 'Create Resource'}
          </button>
        </div>
      </div>
    </form>
  )
}
