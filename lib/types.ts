export interface EligibilityCriteria {
  incomeLimitPctFpl?: number | null
  housingStatus?: string[]
  populations?: string[]
  insuranceRequired?: boolean | null
  documentsRequired?: string[]
  ageMin?: number | null
  ageMax?: number | null
  residencyRequired?: boolean
  citizenshipRequired?: boolean
}

export interface Resource {
  id: string
  name: string
  organization: string | null
  description: string
  categories: string[]
  address: string | null
  city: string
  state: string
  zip: string | null
  latitude: number | null
  longitude: number | null
  phone: string | null
  website: string | null
  email: string | null
  hours: string | null
  // Healthcare-specific
  languages: string[]
  insuranceAccepted: string[]
  cost: string | null
  acceptingClients: boolean
  waitTime: string | null
  referralRequired: boolean
  eligibility: EligibilityCriteria | null
  howToApply: string | null
  tips: string[]
  // Spanish translations
  nameEs: string | null
  descriptionEs: string | null
  howToApplyEs: string | null
  tipsEs: string[]
  source: string
  sourceId: string | null
  verificationMethod: string | null
  verifiedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  displayOrder: number
}

// For list views with only needed fields
export interface ResourceListItem {
  id: string
  name: string
  organization: string | null
  description: string
  categories: string[]
  address: string | null
  phone: string | null
}
