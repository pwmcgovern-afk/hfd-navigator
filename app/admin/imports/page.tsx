'use client'

import { useState, useRef } from 'react'

export default function AdminImportsPage() {
  const [importStatus, setImportStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [importResult, setImportResult] = useState<{ added: number; skipped: number; errors: string[] } | null>(null)

  const [translateStatus, setTranslateStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [translateResult, setTranslateResult] = useState<{ translated: number; failed: number; errors: string[] } | null>(null)

  const [csvStatus, setCsvStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [csvResult, setCsvResult] = useState<{ created: number; updated: number; skipped: number; errors: string[] } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const runImport = async () => {
    setImportStatus('running')
    setImportResult(null)
    try {
      const res = await fetch('/api/admin/import-211', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Import failed')
      setImportResult(data)
      setImportStatus('done')
    } catch (err) {
      setImportResult({ added: 0, skipped: 0, errors: [err instanceof Error ? err.message : 'Unknown error'] })
      setImportStatus('error')
    }
  }

  const runTranslate = async () => {
    setTranslateStatus('running')
    setTranslateResult(null)
    try {
      const res = await fetch('/api/admin/translate', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Translation failed')
      setTranslateResult(data)
      setTranslateStatus('done')
    } catch (err) {
      setTranslateResult({ translated: 0, failed: 0, errors: [err instanceof Error ? err.message : 'Unknown error'] })
      setTranslateStatus('error')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Imports & Automation</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 211 Import */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">211 Connecticut Import</h2>
          <p className="text-sm text-gray-500 mb-4">
            Search the 211 database for Hartford area resources and import new ones. Duplicates are automatically skipped.
          </p>

          <button
            onClick={runImport}
            disabled={importStatus === 'running'}
            className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50 transition-colors"
          >
            {importStatus === 'running' ? 'Importing... (this may take a minute)' : 'Run 211 Import'}
          </button>

          {importResult && (
            <div className={`mt-4 p-4 rounded-lg text-sm ${
              importStatus === 'error' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
            }`}>
              <p className="font-medium">
                {importStatus === 'error' ? 'Import failed' : 'Import complete'}
              </p>
              <p className="mt-1">Added: {importResult.added} | Skipped: {importResult.skipped}</p>
              {importResult.errors.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium text-red-700">Errors:</p>
                  <ul className="list-disc list-inside text-xs text-red-600 mt-1">
                    {importResult.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Auto-Translate */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Auto-Translate</h2>
          <p className="text-sm text-gray-500 mb-4">
            Translate all untranslated resources to Spanish using Claude AI. Resources with existing translations are skipped.
          </p>

          <button
            onClick={runTranslate}
            disabled={translateStatus === 'running'}
            className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50 transition-colors"
          >
            {translateStatus === 'running' ? 'Translating... (this may take a few minutes)' : 'Translate Untranslated'}
          </button>

          {translateResult && (
            <div className={`mt-4 p-4 rounded-lg text-sm ${
              translateStatus === 'error' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
            }`}>
              <p className="font-medium">
                {translateStatus === 'error' ? 'Translation failed' : 'Translation complete'}
              </p>
              <p className="mt-1">Translated: {translateResult.translated} | Failed: {translateResult.failed}</p>
              {translateResult.errors.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium text-red-700">Errors:</p>
                  <ul className="list-disc list-inside text-xs text-red-600 mt-1">
                    {translateResult.errors.slice(0, 10).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                    {translateResult.errors.length > 10 && (
                      <li>...and {translateResult.errors.length - 10} more</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CSV Import/Export */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Export CSV</h2>
          <p className="text-sm text-gray-500 mb-4">
            Download all resources as a CSV file for review in Excel or Google Sheets.
          </p>
          <a
            href="/api/admin/export"
            className="inline-block px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
          >
            Download CSV
          </a>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Import CSV</h2>
          <p className="text-sm text-gray-500 mb-4">
            Upload a CSV to update existing resources or add new ones. Matches by ID or name.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              setCsvStatus('running')
              setCsvResult(null)
              try {
                const text = await file.text()
                const res = await fetch('/api/admin/import-csv', {
                  method: 'POST',
                  headers: { 'Content-Type': 'text/csv' },
                  body: text,
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.error)
                setCsvResult(data)
                setCsvStatus('done')
              } catch (err) {
                setCsvResult({ created: 0, updated: 0, skipped: 0, errors: [err instanceof Error ? err.message : 'Upload failed'] })
                setCsvStatus('error')
              }
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={csvStatus === 'running'}
            className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50 transition-colors"
          >
            {csvStatus === 'running' ? 'Importing...' : 'Upload CSV'}
          </button>
          {csvResult && (
            <div className={`mt-4 p-4 rounded-lg text-sm ${csvStatus === 'error' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <p className="font-medium">{csvStatus === 'error' ? 'Import failed' : 'Import complete'}</p>
              <p className="mt-1">Created: {csvResult.created} | Updated: {csvResult.updated} | Skipped: {csvResult.skipped}</p>
              {csvResult.errors.length > 0 && (
                <ul className="list-disc list-inside text-xs text-red-600 mt-2">
                  {csvResult.errors.slice(0, 5).map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/resources?stale=1" className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
            View Stale Resources
          </a>
          <a href="/admin/resources?untranslated=1" className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
            View Untranslated Resources
          </a>
          <a href="/admin/feedback" className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
            View Feedback
          </a>
        </div>
      </div>
    </div>
  )
}
