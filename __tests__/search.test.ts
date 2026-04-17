/**
 * Unit tests for the chat search scoring logic.
 *
 * These exercise the pure scoring math against a fixed in-memory resource
 * set — no DB, no env. For end-to-end recall metrics against the real
 * directory, run `npx tsx prisma/eval-search.ts` instead.
 *
 * Run: npx tsx --test __tests__/search.test.ts
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

// We import indirectly so we can stub `loadResources` without spinning up
// the Prisma client. The search module reads from a process-level cache.
import * as searchModule from '../lib/search'

const fixture: searchModule.SearchableResource[] = [
  {
    id: 'r1',
    name: 'Downtown Evening Soup Kitchen',
    nameEs: 'Cocina Comunitaria del Centro',
    organization: 'St. Anne Church',
    description: 'Free hot meals served nightly to anyone in need. No ID required.',
    descriptionEs: 'Comidas calientes gratis cada noche.',
    categories: ['food'],
    phone: '203-555-0001',
    address: '100 Chapel St',
    hours: 'Daily 6pm-8pm',
    website: null,
    searchText: 'downtown evening soup kitchen cocina comunitaria del centro st. anne church free hot meals served nightly to anyone in need. no id required. comidas calientes gratis cada noche. food',
  },
  {
    id: 'r2',
    name: 'Columbus House Emergency Shelter',
    nameEs: 'Refugio de Emergencia Columbus House',
    organization: 'Columbus House',
    description: 'Emergency shelter for adults experiencing homelessness. Walk-in intake.',
    descriptionEs: 'Refugio de emergencia para adultos sin hogar.',
    categories: ['housing'],
    phone: '203-555-0002',
    address: '586 Ella T Grasso Blvd',
    hours: '24/7',
    website: null,
    searchText: 'columbus house emergency shelter refugio de emergencia columbus house emergency shelter for adults experiencing homelessness. walk-in intake. refugio de emergencia para adultos sin hogar. housing',
  },
  {
    id: 'r3',
    name: 'New Haven Legal Assistance',
    nameEs: 'Asistencia Legal de New Haven',
    organization: 'NHLAA',
    description: 'Free legal help including eviction defense and benefits appeals.',
    descriptionEs: 'Ayuda legal gratuita incluyendo defensa contra desalojo.',
    categories: ['legal', 'housing'],
    phone: '203-555-0003',
    address: '426 State St',
    hours: 'Mon-Fri 9am-5pm',
    website: null,
    searchText: 'new haven legal assistance asistencia legal de new haven nhlaa free legal help including eviction defense and benefits appeals. ayuda legal gratuita incluyendo defensa contra desalojo. legal housing',
  },
  {
    id: 'r4',
    name: 'Cornell Scott Hill Health Center',
    nameEs: 'Centro de Salud Hill',
    organization: 'CSHHC',
    description: 'Federally qualified health center offering primary care, dental, and behavioral health on a sliding scale.',
    descriptionEs: 'Centro de salud calificado federalmente con atención primaria.',
    categories: ['healthcare', 'mental-health'],
    phone: '203-555-0004',
    address: '400 Columbus Ave',
    hours: 'Mon-Fri 8am-6pm',
    website: null,
    searchText: 'cornell scott hill health center centro de salud hill cshhc federally qualified health center offering primary care, dental, and behavioral health on a sliding scale. centro de salud calificado federalmente con atención primaria. healthcare mental-health',
  },
  {
    id: 'r5',
    name: 'Junta for Progressive Action',
    nameEs: 'Junta para Acción Progresiva',
    organization: 'Junta',
    description: 'Immigration legal services, citizenship classes, and family support for the Latino community.',
    descriptionEs: 'Servicios legales de inmigración, clases de ciudadanía y apoyo familiar.',
    categories: ['immigration', 'legal'],
    phone: '203-555-0005',
    address: '169 Grand Ave',
    hours: 'Mon-Fri 9am-5pm',
    website: null,
    searchText: 'junta for progressive action junta para acción progresiva junta immigration legal services, citizenship classes, and family support for the latino community. servicios legales de inmigración, clases de ciudadanía y apoyo familiar. immigration legal',
  },
]

// Patch the module-level cache so loadResources() returns our fixture.
// This avoids opening a Prisma connection during unit tests.
function installFixture() {
  // The cache fields are module-private; the only public knob is
  // invalidateResourceCache(). We re-seed by calling loadResources via a
  // monkey-patched prisma — but simpler: cast the module to access internals.
  type Internals = { _testInjectCache?: (rows: searchModule.SearchableResource[]) => void }
  const internals = searchModule as unknown as Internals
  if (!internals._testInjectCache) {
    throw new Error('lib/search.ts is missing _testInjectCache helper — add it for tests to bypass Prisma.')
  }
  internals._testInjectCache(fixture)
}

describe('searchResources', () => {
  it('keyword-matches against name and description', async () => {
    installFixture()
    const hits = await searchModule.searchResources({ query: 'soup' })
    assert.ok(hits.some(h => h.id === 'r1'), 'should find soup kitchen')
    assert.equal(hits[0].id, 'r1', 'soup kitchen should be top hit')
  })

  it('boosts name matches over description-only matches', async () => {
    installFixture()
    // "legal" appears in r3 (name), r3 (categories), r5 (categories + description).
    // r3 should win because of the name+category boost.
    const hits = await searchModule.searchResources({ query: 'legal' })
    assert.ok(hits.length >= 2)
    assert.equal(hits[0].id, 'r3', 'name match should rank first')
  })

  it('respects category filter', async () => {
    installFixture()
    const hits = await searchModule.searchResources({ category: 'housing', limit: 5 })
    const ids = hits.map(h => h.id).sort()
    assert.deepEqual(ids, ['r2', 'r3'], 'housing should match shelter and legal-aid (which has housing tag)')
  })

  it('returns empty array when nothing matches', async () => {
    installFixture()
    const hits = await searchModule.searchResources({ query: 'cryptocurrency' })
    assert.equal(hits.length, 0)
  })

  it('handles Spanish queries via descriptionEs', async () => {
    installFixture()
    const hits = await searchModule.searchResources({ query: 'inmigración ciudadanía' })
    assert.ok(hits.some(h => h.id === 'r5'), 'should match Junta on Spanish description')
  })

  it('respects the limit parameter', async () => {
    installFixture()
    const hits = await searchModule.searchResources({ query: 'health', limit: 1 })
    assert.equal(hits.length, 1)
  })
})

describe('getResourceDetails', () => {
  it('returns full record minus the searchText helper', async () => {
    installFixture()
    const detail = await searchModule.getResourceDetails('r1')
    assert.ok(detail)
    assert.equal(detail.name, 'Downtown Evening Soup Kitchen')
    assert.equal((detail as unknown as Record<string, unknown>).searchText, undefined, 'searchText is internal — should not leak')
  })

  it('returns null for unknown id', async () => {
    installFixture()
    const detail = await searchModule.getResourceDetails('does-not-exist')
    assert.equal(detail, null)
  })
})
