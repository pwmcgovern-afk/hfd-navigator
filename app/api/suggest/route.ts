import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { resourceId, type, submitterName, submitterEmail, submitterOrg, changes } = body

    if (!changes || Object.keys(changes).length === 0) {
      return Response.json({ error: 'Changes are required' }, { status: 400 })
    }

    if (type === 'update' && !resourceId) {
      return Response.json({ error: 'resourceId required for updates' }, { status: 400 })
    }

    await prisma.suggestion.create({
      data: {
        resourceId: resourceId || null,
        type: type || 'update',
        submitterName: submitterName?.slice(0, 200) || null,
        submitterEmail: submitterEmail?.slice(0, 200) || null,
        submitterOrg: submitterOrg?.slice(0, 200) || null,
        changes,
      }
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Suggestion error:', error)
    return Response.json({ error: 'Failed to submit suggestion' }, { status: 500 })
  }
}
