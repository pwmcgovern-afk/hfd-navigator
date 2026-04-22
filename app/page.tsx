import { prisma } from '@/lib/db'
import { SERVED_CITIES } from '@/lib/constants'
import HomeClient from './HomeClient'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const resourceCount = await prisma.resource.count({
    where: { city: { in: [...SERVED_CITIES] } },
  })
  return <HomeClient resourceCount={resourceCount} />
}
