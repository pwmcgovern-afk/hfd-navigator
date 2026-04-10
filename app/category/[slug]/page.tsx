import { notFound } from 'next/navigation'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { CATEGORIES } from '@/lib/constants'
import CategoryClient from './CategoryClient'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({
  params
}: {
  params: { slug: string }
}) {
  const category = CATEGORIES.find(c => c.slug === params.slug)

  if (!category) {
    notFound()
  }

  const resources = await prisma.$queryRaw<Record<string, unknown>[]>(
    Prisma.sql`
      SELECT id, name, "nameEs", organization, description, "descriptionEs",
             categories, address, phone
      FROM "Resource"
      WHERE ${params.slug} = ANY(categories)
      ORDER BY name ASC
    `
  )

  return <CategoryClient slug={params.slug} resources={resources as any[]} />
}
