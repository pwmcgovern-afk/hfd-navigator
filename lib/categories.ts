import type { Language } from './translations'

// Centralized bilingual category data — single source of truth
export const CATEGORIES_I18N = [
  {
    slug: 'housing', icon: '🏠',
    en: 'Housing', es: 'Vivienda',
    descEn: 'Shelter, rent help, Section 8', descEs: 'Refugio, ayuda con alquiler',
    ariaEn: 'Housing resources including shelter, rent help, and Section 8',
    ariaEs: 'Recursos de vivienda incluyendo refugio y ayuda con alquiler',
  },
  {
    slug: 'food', icon: '🍎',
    en: 'Food', es: 'Comida',
    descEn: 'Food pantries, SNAP, meals', descEs: 'Despensas, SNAP, comidas',
    ariaEn: 'Food resources including food pantries, SNAP, and meals',
    ariaEs: 'Recursos de comida incluyendo despensas y SNAP',
  },
  {
    slug: 'cash', icon: '💵',
    en: 'Cash Assistance', es: 'Asistencia en Efectivo',
    descEn: 'Emergency funds, TANF', descEs: 'Fondos de emergencia, TANF',
    ariaEn: 'Cash assistance including emergency funds and TANF',
    ariaEs: 'Asistencia de efectivo incluyendo fondos de emergencia',
  },
  {
    slug: 'harm-reduction', icon: '💊',
    en: 'Harm Reduction', es: 'Reduccion de Danos',
    descEn: 'Narcan, syringe services', descEs: 'Narcan, servicios de jeringas',
    ariaEn: 'Harm reduction services including Narcan and syringe services',
    ariaEs: 'Servicios de reduccion de danos incluyendo Narcan',
  },
  {
    slug: 'healthcare', icon: '🏥',
    en: 'Healthcare', es: 'Salud',
    descEn: 'Free clinics, Medicaid', descEs: 'Clinicas gratis, Medicaid',
    ariaEn: 'Healthcare resources including free clinics and Medicaid',
    ariaEs: 'Recursos de salud incluyendo clinicas gratis',
  },
  {
    slug: 'mental-health', icon: '🧠',
    en: 'Mental Health', es: 'Salud Mental',
    descEn: 'Counseling, crisis support', descEs: 'Consejeria, apoyo en crisis',
    ariaEn: 'Mental health resources including counseling and crisis support',
    ariaEs: 'Recursos de salud mental incluyendo consejeria',
  },
  {
    slug: 'employment', icon: '💼',
    en: 'Jobs', es: 'Empleo',
    descEn: 'Job training, employment', descEs: 'Capacitacion, trabajo',
    ariaEn: 'Employment resources including job training',
    ariaEs: 'Recursos de empleo incluyendo capacitacion',
  },
  {
    slug: 'childcare', icon: '👶',
    en: 'Childcare', es: 'Cuidado Infantil',
    descEn: 'Head Start, subsidized care', descEs: 'Head Start, subsidios',
    ariaEn: 'Childcare resources including Head Start and subsidized care',
    ariaEs: 'Recursos de cuidado infantil incluyendo Head Start',
  },
  {
    slug: 'legal', icon: '⚖️',
    en: 'Legal Aid', es: 'Ayuda Legal',
    descEn: 'Eviction defense, expungement', descEs: 'Defensa contra desalojo',
    ariaEn: 'Legal aid including eviction defense and expungement',
    ariaEs: 'Ayuda legal incluyendo defensa contra desalojo',
  },
  {
    slug: 'transportation', icon: '🚌',
    en: 'Transportation', es: 'Transporte',
    descEn: 'Bus passes, medical rides', descEs: 'Pases de autobus, viajes',
    ariaEn: 'Transportation resources including bus passes and medical rides',
    ariaEs: 'Recursos de transporte incluyendo pases de autobus',
  },
  {
    slug: 'utilities', icon: '💡',
    en: 'Utilities', es: 'Servicios',
    descEn: 'LIHEAP, bill assistance', descEs: 'LIHEAP, ayuda con facturas',
    ariaEn: 'Utility assistance including LIHEAP and bill help',
    ariaEs: 'Asistencia de servicios publicos incluyendo LIHEAP',
  },
  {
    slug: 'immigration', icon: '📄',
    en: 'Immigration', es: 'Inmigracion',
    descEn: 'Legal services, asylum', descEs: 'Servicios legales, asilo',
    ariaEn: 'Immigration resources including legal services and asylum help',
    ariaEs: 'Recursos de inmigracion incluyendo servicios legales',
  },
] as const

export type CategorySlug = typeof CATEGORIES_I18N[number]['slug']

export function getCategoryInfo(slug: string, language: Language) {
  const cat = CATEGORIES_I18N.find(c => c.slug === slug)
  if (!cat) return null
  return {
    slug: cat.slug,
    icon: cat.icon,
    name: language === 'es' ? cat.es : cat.en,
  }
}

export function getCategoriesForLanguage(language: Language) {
  return CATEGORIES_I18N.map(cat => ({
    slug: cat.slug,
    icon: cat.icon,
    name: language === 'es' ? cat.es : cat.en,
  }))
}

// Extended version with descriptions and aria labels (for home page grid)
export function getCategoriesWithDetails(language: Language) {
  return CATEGORIES_I18N.map(cat => ({
    slug: cat.slug,
    icon: cat.icon,
    name: language === 'es' ? cat.es : cat.en,
    description: language === 'es' ? cat.descEs : cat.descEn,
    ariaLabel: language === 'es' ? cat.ariaEs : cat.ariaEn,
  }))
}
