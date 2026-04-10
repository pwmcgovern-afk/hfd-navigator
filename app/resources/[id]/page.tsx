import { notFound } from 'next/navigation'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import type { Resource } from '@/lib/types'
import ResourceDetailClient from './ResourceDetailClient'

export const dynamic = 'force-dynamic'

export default async function ResourceDetailPage({
  params
}: {
  params: { id: string }
}) {
  // Use raw SQL to bypass any Prisma client deserialization issues.
  // Use Prisma.sql for proper parameterization without type casts.
  const rows = await prisma.$queryRaw<Record<string, unknown>[]>(
    Prisma.sql`
      SELECT
        id, name, organization, description, categories,
        address, city, state, zip, latitude, longitude,
        phone, website, email, hours,
        languages, "insuranceAccepted", cost, "acceptingClients",
        "waitTime", "referralRequired",
        eligibility, "howToApply", tips,
        "nameEs", "descriptionEs", "howToApplyEs", "tipsEs",
        source, "sourceId", "verificationMethod",
        "verifiedAt", "createdAt", "updatedAt"
      FROM "Resource"
      WHERE id = ${params.id}
    `
  )

  if (!rows || rows.length === 0) {
    notFound()
  }

  const row = rows[0]
  const resource = {
    ...row,
    tips: (row.tips as string[] | null) || [],
    tipsEs: (row.tipsEs as string[] | null) || [],
    languages: (row.languages as string[] | null) || [],
    insuranceAccepted: (row.insuranceAccepted as string[] | null) || [],
    acceptingClients: row.acceptingClients ?? true,
    referralRequired: row.referralRequired ?? false,
  } as unknown as Resource

  return <ResourceDetailClient resource={resource} />
}
