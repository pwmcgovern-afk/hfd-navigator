import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const resource = await prisma.resource.findUnique({ where: { id: params.id } })
    if (!resource) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    return Response.json(resource)
  } catch (error) {
    console.error('Admin resource GET error:', error)
    return Response.json({ error: 'Failed to fetch resource' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()

    // Fetch current resource to compute changes
    const before = await prisma.resource.findUnique({ where: { id: params.id } })
    if (!before) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    const resource = await prisma.resource.update({
      where: { id: params.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.organization !== undefined && { organization: body.organization || null }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.categories !== undefined && { categories: body.categories }),
        ...(body.address !== undefined && { address: body.address || null }),
        ...(body.city !== undefined && { city: body.city }),
        ...(body.state !== undefined && { state: body.state }),
        ...(body.zip !== undefined && { zip: body.zip || null }),
        ...(body.phone !== undefined && { phone: body.phone || null }),
        ...(body.website !== undefined && { website: body.website || null }),
        ...(body.email !== undefined && { email: body.email || null }),
        ...(body.hours !== undefined && { hours: body.hours || null }),
        ...(body.eligibility !== undefined && { eligibility: body.eligibility }),
        ...(body.howToApply !== undefined && { howToApply: body.howToApply || null }),
        ...(body.tips !== undefined && { tips: body.tips }),
        ...(body.nameEs !== undefined && { nameEs: body.nameEs || null }),
        ...(body.descriptionEs !== undefined && { descriptionEs: body.descriptionEs || null }),
        ...(body.howToApplyEs !== undefined && { howToApplyEs: body.howToApplyEs || null }),
        ...(body.tipsEs !== undefined && { tipsEs: body.tipsEs }),
        ...(body.verifiedAt !== undefined && { verifiedAt: body.verifiedAt ? new Date(body.verifiedAt) : null }),
      }
    })

    // Log the changes
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    const trackFields = ['name', 'organization', 'description', 'categories', 'address', 'phone', 'website', 'hours', 'howToApply', 'nameEs', 'descriptionEs']
    for (const field of trackFields) {
      if (body[field] !== undefined && JSON.stringify((before as Record<string, unknown>)[field]) !== JSON.stringify(body[field])) {
        changes[field] = { from: (before as Record<string, unknown>)[field], to: body[field] }
      }
    }
    if (Object.keys(changes).length > 0) {
      await prisma.changeLog.create({
        data: { resourceId: params.id, resourceName: resource.name, action: 'updated', changes: JSON.parse(JSON.stringify(changes)) }
      })
    }

    return Response.json({ success: true, resource })
  } catch (error) {
    console.error('Admin resource PUT error:', error)
    return Response.json({ error: 'Failed to update resource' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    // Log deletion before removing
    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
      select: { name: true }
    })
    if (resource) {
      await prisma.changeLog.create({
        data: { resourceId: params.id, resourceName: resource.name, action: 'deleted' }
      })
    }

    await prisma.feedback.deleteMany({ where: { resourceId: params.id } })
    await prisma.resource.delete({ where: { id: params.id } })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Admin resource DELETE error:', error)
    return Response.json({ error: 'Failed to delete resource' }, { status: 500 })
  }
}
