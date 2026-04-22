import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(req: Request) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const url = new URL(req.url)
    const q = url.searchParams.get('q') || ''
    const category = url.searchParams.get('category') || ''
    const source = url.searchParams.get('source') || ''
    const stale = url.searchParams.get('stale') === '1'
    const untranslated = url.searchParams.get('untranslated') === '1'
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
    const pageSize = 20

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const where: Prisma.ResourceWhereInput = {
      AND: [
        q ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { organization: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ]
        } : {},
        category ? { categories: { has: category } } : {},
        source ? { source } : {},
        stale ? { OR: [{ verifiedAt: null }, { verifiedAt: { lt: sixMonthsAgo } }] } : {},
        untranslated ? { nameEs: null } : {},
      ]
    }

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true, name: true, organization: true, categories: true,
          source: true, verifiedAt: true, nameEs: true, phone: true,
        }
      }),
      prisma.resource.count({ where }),
    ])

    return Response.json({ resources, total, page, pageSize })
  } catch (error) {
    console.error('Admin resources GET error:', error)
    return Response.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()

    if (!body.name || !body.description || !body.categories?.length) {
      return Response.json(
        { error: 'Name, description, and at least one category are required' },
        { status: 400 }
      )
    }

    const resource = await prisma.resource.create({
      data: {
        name: body.name,
        organization: body.organization || null,
        organizationEs: body.organizationEs || null,
        description: body.description,
        categories: body.categories,
        address: body.address || null,
        city: body.city || 'Hartford',
        state: body.state || 'CT',
        zip: body.zip || null,
        phone: body.phone || null,
        website: body.website || null,
        email: body.email || null,
        hours: body.hours || null,
        eligibility: body.eligibility || null,
        howToApply: body.howToApply || null,
        tips: body.tips || [],
        nameEs: body.nameEs || null,
        descriptionEs: body.descriptionEs || null,
        howToApplyEs: body.howToApplyEs || null,
        tipsEs: body.tipsEs || [],
        source: 'manual',
        verifiedAt: new Date(),
      }
    })

    // Log creation
    await prisma.changeLog.create({
      data: { resourceId: resource.id, resourceName: resource.name, action: 'created' }
    })

    return Response.json({ success: true, resource }, { status: 201 })
  } catch (error) {
    console.error('Admin resources POST error:', error)
    return Response.json({ error: 'Failed to create resource' }, { status: 500 })
  }
}
