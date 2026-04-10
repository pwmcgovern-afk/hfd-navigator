'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { TrackerEntry, TrackerContextType } from '@/lib/trackerTypes'

const STORAGE_KEY = 'nhn-tracker-entries'
const TOKEN_KEY = 'nhn-tracker-token'

const TrackerContext = createContext<TrackerContextType | undefined>(undefined)

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

function generateToken(): string {
  return 'anon_' + crypto.randomUUID()
}

function getOrCreateToken(): string {
  let token = localStorage.getItem(TOKEN_KEY)
  if (!token) {
    token = generateToken()
    localStorage.setItem(TOKEN_KEY, token)
  }
  return token
}

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<TrackerEntry[]>([])
  const [mounted, setMounted] = useState(false)

  // Sync entries to server (best-effort, non-blocking)
  const syncToServer = useCallback(async (currentEntries: TrackerEntry[]) => {
    try {
      const token = getOrCreateToken()
      await fetch('/api/tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, entries: currentEntries }),
      })
    } catch {
      // Sync failed — localStorage still has the data, will retry next mutation
    }
  }, [])

  // Initial load: read localStorage, then try to merge with server
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(STORAGE_KEY)
    let localEntries: TrackerEntry[] = []
    if (saved) {
      try {
        localEntries = JSON.parse(saved)
        setEntries(localEntries)
      } catch (e) {
        console.error('Failed to parse tracker entries', e)
      }
    }

    // Fetch server entries and merge
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      fetch(`/api/tracker?token=${encodeURIComponent(token)}`)
        .then(res => res.json())
        .then(data => {
          if (data.entries && data.entries.length > 0) {
            // Merge: server entries take precedence for same resourceId
            const serverMap = new Map<string, TrackerEntry>()
            for (const e of data.entries) {
              serverMap.set(e.resourceId, {
                id: e.id,
                resourceId: e.resourceId,
                resourceName: e.resourceName,
                resourceNameEs: e.resourceNameEs || undefined,
                organizationName: e.organizationName || undefined,
                status: e.status,
                outcome: e.outcome || '',
                contactPerson: e.contactPerson,
                dateContacted: e.dateContacted,
                notes: e.notes,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
              })
            }

            // Add local-only entries (not on server yet)
            for (const le of localEntries) {
              if (!serverMap.has(le.resourceId)) {
                serverMap.set(le.resourceId, le)
              }
            }

            const merged = Array.from(serverMap.values())
            setEntries(merged)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))

            // Push any local-only entries to server
            if (localEntries.some(le => !data.entries.find((se: TrackerEntry) => se.resourceId === le.resourceId))) {
              syncToServer(merged)
            }
          } else if (localEntries.length > 0) {
            // Server has nothing — push local entries up
            syncToServer(localEntries)
          }
        })
        .catch(() => {
          // Server unreachable — local data is fine
        })
    }
  }, [syncToServer])

  // Persist to localStorage on every change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    }
  }, [entries, mounted])

  const addEntry = (entry: Omit<TrackerEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newEntry: TrackerEntry = {
      ...entry,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    }
    setEntries(prev => {
      const updated = [newEntry, ...prev]
      syncToServer(updated)
      return updated
    })
  }

  const updateEntry = (id: string, updates: Partial<Omit<TrackerEntry, 'id' | 'createdAt'>>) => {
    setEntries(prev => {
      const updated = prev.map(entry =>
        entry.id === id
          ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
          : entry
      )
      syncToServer(updated)
      return updated
    })
  }

  const deleteEntry = (id: string) => {
    const entry = entries.find(e => e.id === id)
    setEntries(prev => {
      const updated = prev.filter(e => e.id !== id)
      // Also delete from server
      if (entry) {
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) {
          fetch('/api/tracker', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, resourceId: entry.resourceId }),
          }).catch(() => {})
        }
      }
      return updated
    })
  }

  const getEntryByResourceId = (resourceId: string) => {
    return entries.find(entry => entry.resourceId === resourceId)
  }

  const contextValue: TrackerContextType = {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntryByResourceId
  }

  // Prevent hydration mismatch by rendering with empty entries until mounted
  if (!mounted) {
    return (
      <TrackerContext.Provider value={{
        entries: [],
        addEntry: () => {},
        updateEntry: () => {},
        deleteEntry: () => {},
        getEntryByResourceId: () => undefined
      }}>
        {children}
      </TrackerContext.Provider>
    )
  }

  return (
    <TrackerContext.Provider value={contextValue}>
      {children}
    </TrackerContext.Provider>
  )
}

export function useTracker() {
  const context = useContext(TrackerContext)
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider')
  }
  return context
}
