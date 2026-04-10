import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

function escapeCSV(value: string | null | undefined): string {
  if (value == null) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET(req: Request) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const resources = await prisma.resource.findMany({
      orderBy: { name: 'asc' },
    })

    const headers = [
      'id', 'name', 'organization', 'description', 'categories',
      'address', 'city', 'state', 'zip', 'phone', 'website', 'email', 'hours',
      'howToApply', 'tips', 'nameEs', 'descriptionEs', 'howToApplyEs', 'tipsEs',
      'source', 'verifiedAt',
    ]

    const rows = resources.map(r => [
      r.id,
      escapeCSV(r.name),
      escapeCSV(r.organization),
      escapeCSV(r.description),
      escapeCSV(r.categories.join('; ')),
      escapeCSV(r.address),
      escapeCSV(r.city),
      escapeCSV(r.state),
      escapeCSV(r.zip),
      escapeCSV(r.phone),
      escapeCSV(r.website),
      escapeCSV(r.email),
      escapeCSV(r.hours),
      escapeCSV(r.howToApply),
      escapeCSV(r.tips.join(' | ')),
      escapeCSV(r.nameEs),
      escapeCSV(r.descriptionEs),
      escapeCSV(r.howToApplyEs),
      escapeCSV(r.tipsEs.join(' | ')),
      r.source,
      r.verifiedAt?.toISOString() || '',
    ].join(','))

    const csv = [headers.join(','), ...rows].join('\n')

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="hartford-navigator-resources-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return Response.json({ error: 'Export failed' }, { status: 500 })
  }
}
