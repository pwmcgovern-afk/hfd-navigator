import { prisma } from '@/lib/db'
import HomeClient from './HomeClient'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const resourceCount = await prisma.resource.count()
  return <HomeClient resourceCount={resourceCount} />
}
