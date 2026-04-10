import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import { filterAndRankResources, UserProfile, ResourceWithEligibility } from '@/lib/eligibility'
import ResultsClient from './ResultsClient'

interface SearchParams {
  zip?: string
  household?: string
  income?: string
  housing?: string
  insurance?: string
  populations?: string
  categories?: string
}

async function ResultsContent({ searchParams }: { searchParams: SearchParams }) {
  const userProfile: UserProfile = {
    zipCode: searchParams.zip || '',
    householdSize: parseInt(searchParams.household || '1'),
    monthlyIncome: parseInt(searchParams.income || '0'),
    housingStatus: searchParams.housing || 'housed',
    insuranceStatus: searchParams.insurance || 'uninsured',
    populations: searchParams.populations?.split(',').filter(Boolean) || [],
    categoriesNeeded: searchParams.categories?.split(',').filter(Boolean) || []
  }

  // Filter at DB level by selected categories to avoid loading all resources
  const dbResources = await prisma.resource.findMany({
    where: userProfile.categoriesNeeded.length > 0
      ? { categories: { hasSome: userProfile.categoriesNeeded } }
      : {},
    select: {
      id: true,
      name: true,
      nameEs: true,
      organization: true,
      description: true,
      descriptionEs: true,
      categories: true,
      address: true,
      city: true,
      phone: true,
      website: true,
      eligibility: true,
      howToApply: true
    }
  })

  const resources: ResourceWithEligibility[] = dbResources.map(r => ({
    ...r,
    eligibility: r.eligibility as ResourceWithEligibility['eligibility']
  }))

  const rankedResources = filterAndRankResources(userProfile, resources)

  return (
    <ResultsClient
      resources={rankedResources}
      selectedCategories={userProfile.categoriesNeeded}
    />
  )
}

export default function ResultsPage({
  searchParams
}: {
  searchParams: SearchParams
}) {
  return (
    <Suspense fallback={
      <div className="px-5 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-[var(--color-border)] rounded-lg w-48 mb-4" />
          <div className="h-4 bg-[var(--color-border)] rounded w-32 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-[var(--color-border)] rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    }>
      <ResultsContent searchParams={searchParams} />
    </Suspense>
  )
}
