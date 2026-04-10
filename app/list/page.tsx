import { prisma } from '@/lib/db'
import ListClient from './ListClient'

export default async function SharedListPage({
  searchParams
}: {
  searchParams: { ids?: string; title?: string }
}) {
  const ids = searchParams.ids?.split(',').filter(Boolean) || []
  const title = searchParams.title || ''

  if (ids.length === 0) {
    return <ListClient resources={[]} title={title} />
  }

  const resources = await prisma.resource.findMany({
    where: { id: { in: ids } },
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
      website: true,
    }
  })

  // Maintain the order from the URL
  const ordered = ids
    .map(id => resources.find(r => r.id === id))
    .filter(Boolean)

  return <ListClient resources={ordered as typeof resources} title={title} />
}
