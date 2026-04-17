import { prisma } from '@/lib/db'
import * as Sentry from '@sentry/nextjs'

// GET /api/tracker?token=xxx — fetch all entries for a user
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const token = url.searchParams.get('token')

    if (!token) {
      return Response.json({ error: 'Token required' }, { status: 400 })
    }

    const user = await prisma.anonymousUser.findUnique({
      where: { token },
      include: { entries: { orderBy: { createdAt: 'desc' } } }
    })

    if (!user) {
      return Response.json({ entries: [] })
    }

    return Response.json({ entries: user.entries })
  } catch (error) {
    Sentry.captureException(error, { tags: { route: 'api/tracker', method: 'GET' } })
    console.error('Tracker GET error:', error)
    return Response.json({ error: 'Failed to fetch entries' }, { status: 500 })
  }
}

// POST /api/tracker — sync entries from client
//
// All writes for a single sync run inside one transaction so two concurrent
// requests from the same user can't both miss the findFirst and create
// duplicate (userId, resourceId) rows. The schema has no unique constraint
// on that pair yet — when we add one we can switch to prisma.upsert and drop
// the transaction wrapper.
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, entries } = body

    if (!token || typeof token !== 'string' || !Array.isArray(entries)) {
      return Response.json({ error: 'Token and entries required' }, { status: 400 })
    }

    const allEntries = await prisma.$transaction(async (tx) => {
      let user = await tx.anonymousUser.findUnique({ where: { token } })
      if (!user) {
        user = await tx.anonymousUser.create({ data: { token } })
      }

      for (const entry of entries) {
        const existing = await tx.trackerEntry.findFirst({
          where: { userId: user.id, resourceId: entry.resourceId }
        })

        if (existing) {
          await tx.trackerEntry.update({
            where: { id: existing.id },
            data: {
              resourceName: entry.resourceName,
              resourceNameEs: entry.resourceNameEs || null,
              organizationName: entry.organizationName || null,
              status: entry.status,
              outcome: entry.outcome || '',
              contactPerson: entry.contactPerson || '',
              dateContacted: entry.dateContacted || '',
              notes: entry.notes || '',
              updatedAt: new Date(),
            }
          })
        } else {
          await tx.trackerEntry.create({
            data: {
              userId: user.id,
              resourceId: entry.resourceId,
              resourceName: entry.resourceName,
              resourceNameEs: entry.resourceNameEs || null,
              organizationName: entry.organizationName || null,
              status: entry.status,
              outcome: entry.outcome || '',
              contactPerson: entry.contactPerson || '',
              dateContacted: entry.dateContacted || '',
              notes: entry.notes || '',
            }
          })
        }
      }

      return tx.trackerEntry.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })
    })

    return Response.json({ entries: allEntries })
  } catch (error) {
    Sentry.captureException(error, { tags: { route: 'api/tracker', method: 'POST' } })
    console.error('Tracker POST error:', error)
    return Response.json({ error: 'Failed to sync entries' }, { status: 500 })
  }
}

// DELETE /api/tracker — delete an entry
export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { token, resourceId } = body

    if (!token || !resourceId) {
      return Response.json({ error: 'Token and resourceId required' }, { status: 400 })
    }

    const user = await prisma.anonymousUser.findUnique({ where: { token } })
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    await prisma.trackerEntry.deleteMany({
      where: { userId: user.id, resourceId }
    })

    return Response.json({ success: true })
  } catch (error) {
    Sentry.captureException(error, { tags: { route: 'api/tracker', method: 'DELETE' } })
    console.error('Tracker DELETE error:', error)
    return Response.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}
