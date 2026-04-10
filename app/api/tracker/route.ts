import { prisma } from '@/lib/db'

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
    console.error('Tracker GET error:', error)
    return Response.json({ error: 'Failed to fetch entries' }, { status: 500 })
  }
}

// POST /api/tracker — sync entries from client
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, entries } = body

    if (!token || !Array.isArray(entries)) {
      return Response.json({ error: 'Token and entries required' }, { status: 400 })
    }

    // Create or get anonymous user
    let user = await prisma.anonymousUser.findUnique({ where: { token } })
    if (!user) {
      user = await prisma.anonymousUser.create({ data: { token } })
    }

    // Upsert each entry — use resourceId as the dedup key per user
    for (const entry of entries) {
      const existing = await prisma.trackerEntry.findFirst({
        where: { userId: user.id, resourceId: entry.resourceId }
      })

      if (existing) {
        await prisma.trackerEntry.update({
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
        await prisma.trackerEntry.create({
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

    // Return all entries after sync
    const allEntries = await prisma.trackerEntry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    return Response.json({ entries: allEntries })
  } catch (error) {
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
    console.error('Tracker DELETE error:', error)
    return Response.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}
