import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import ResourcesClient from './ResourcesClient'

export const dynamic = 'force-dynamic'

export default async function ResourcesPage({
  searchParams
}: {
  searchParams: {
    q?: string; category?: string; insurance?: string;
    language?: string; accepting?: string
  }
}) {
  const { q, category, insurance, language: langFilter, accepting } = searchParams
  const safeQ = q?.slice(0, 200)?.trim()

  // Build filter conditions
  const conditions: Prisma.ResourceWhereInput[] = []

  if (safeQ && safeQ.length > 0) {
    conditions.push({
      OR: [
        { name: { contains: safeQ, mode: 'insensitive' } },
        { nameEs: { contains: safeQ, mode: 'insensitive' } },
        { description: { contains: safeQ, mode: 'insensitive' } },
        { descriptionEs: { contains: safeQ, mode: 'insensitive' } },
        { organization: { contains: safeQ, mode: 'insensitive' } },
        { address: { contains: safeQ, mode: 'insensitive' } },
      ]
    })
  }

  if (category) conditions.push({ categories: { has: category } })
  // Note: insurance, language, accepting filters temporarily disabled

  const where: Prisma.ResourceWhereInput = conditions.length > 0
    ? { AND: conditions }
    : {}

  const resources = await prisma.resource.findMany({
    where,
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      nameEs: true,
      organization: true,
      description: true,
      descriptionEs: true,
      categories: true,
      address: true,
      phone: true,
      hours: true,
      latitude: true,
      longitude: true,
    }
  })

  return <ResourcesClient
    resources={resources}
    query={safeQ}
    category={category}
    insurance={insurance}
    langFilter={langFilter}
    accepting={accepting}
  />
}
