import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

// Force dynamic so sitemap doesn't try to query DB at build time
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const resources = await prisma.resource.findMany({
    select: { id: true, updatedAt: true },
  })

  const resourceUrls = resources.map((r) => ({
    url: `https://www.hfdnavigator.com/resources/${r.id}`,
    lastModified: r.updatedAt,
  }))

  const categories = [
    'housing', 'food', 'cash', 'harm-reduction', 'healthcare',
    'mental-health', 'employment', 'childcare', 'legal',
    'transportation', 'utilities', 'immigration',
  ]

  const categoryUrls = categories.map((slug) => ({
    url: `https://www.hfdnavigator.com/category/${slug}`,
    lastModified: new Date(),
  }))

  return [
    { url: 'https://www.hfdnavigator.com', lastModified: new Date() },
    { url: 'https://www.hfdnavigator.com/resources', lastModified: new Date() },
    { url: 'https://www.hfdnavigator.com/wizard', lastModified: new Date() },
    ...categoryUrls,
    ...resourceUrls,
  ]
}
