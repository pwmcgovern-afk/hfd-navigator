'use client'

// Cache bust: 2026-04-02
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'apikey' | 'email'>('email')
  const [apiKey, setApiKey] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const body = mode === 'apikey'
        ? { apiKey }
        : { email, password }

      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        router.push('/admin')
      } else {
        const data = await res.json()
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-sm text-gray-500 mb-6">Hartford Navigator</p>

          {/* Login mode toggle */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMode('email')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'email' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setMode('apikey')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'apikey' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              API Key
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'email' ? (
              <>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3"
                  autoFocus
                />
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </>
            ) : (
              <>
                <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your admin API key"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus
                />
              </>
            )}

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading || (mode === 'apikey' ? !apiKey : !email || !password)}
              className="w-full mt-4 px-4 py-3 bg-teal-700 text-white font-medium rounded-xl hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <a href="/" className="block mt-6 text-center text-sm text-gray-400 hover:text-gray-600">
            Back to public site
          </a>
        </div>
      </div>
    </div>
  )
}
