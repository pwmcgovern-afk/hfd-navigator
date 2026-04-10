import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        current += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      fields.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  fields.push(current.trim())
  return fields
}

export async function POST(req: Request) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const text = await req.text()
    const lines = text.split('\n').filter(l => l.trim())

    if (lines.length < 2) {
      return Response.json({ error: 'CSV must have a header row and at least one data row' }, { status: 400 })
    }

    const headers = parseCSVLine(lines[0])
    const nameIdx = headers.indexOf('name')
    const idIdx = headers.indexOf('id')

    if (nameIdx === -1) {
      return Response.json({ error: 'CSV must have a "name" column' }, { status: 400 })
    }

    let updated = 0
    let created = 0
    let skipped = 0
    const errors: string[] = []

    for (let i = 1; i < lines.length; i++) {
      try {
        const fields = parseCSVLine(lines[i])
        const row: Record<string, string> = {}
        headers.forEach((h, j) => { row[h] = fields[j] || '' })

        if (!row.name) {
          skipped++
          continue
        }

        const data: Record<string, unknown> = {
          name: row.name,
          organization: row.organization || null,
          description: row.description || '',
          address: row.address || null,
          city: row.city || 'Hartford',
          state: row.state || 'CT',
          zip: row.zip || null,
          phone: row.phone || null,
          website: row.website || null,
          email: row.email || null,
          hours: row.hours || null,
          howToApply: row.howToApply || null,
          nameEs: row.nameEs || null,
          descriptionEs: row.descriptionEs || null,
          howToApplyEs: row.howToApplyEs || null,
        }

        if (row.categories) {
          data.categories = row.categories.split(';').map(c => c.trim()).filter(Boolean)
        }
        if (row.tips) {
          data.tips = row.tips.split('|').map(t => t.trim()).filter(Boolean)
        }
        if (row.tipsEs) {
          data.tipsEs = row.tipsEs.split('|').map(t => t.trim()).filter(Boolean)
        }

        // Try to match by ID first, then by name
        const existingById = row.id ? await prisma.resource.findUnique({ where: { id: row.id } }) : null
        const existingByName = !existingById ? await prisma.resource.findFirst({ where: { name: row.name } }) : null
        const existing = existingById || existingByName

        if (existing) {
          await prisma.resource.update({ where: { id: existing.id }, data })
          updated++
        } else {
          await prisma.resource.create({
            data: {
              name: data.name as string,
              description: (data.description as string) || '',
              organization: (data.organization as string) || null,
              categories: (data.categories as string[]) || [],
              address: (data.address as string) || null,
              city: (data.city as string) || 'Hartford',
              state: (data.state as string) || 'CT',
              zip: (data.zip as string) || null,
              phone: (data.phone as string) || null,
              website: (data.website as string) || null,
              email: (data.email as string) || null,
              hours: (data.hours as string) || null,
              howToApply: (data.howToApply as string) || null,
              tips: (data.tips as string[]) || [],
              nameEs: (data.nameEs as string) || null,
              descriptionEs: (data.descriptionEs as string) || null,
              howToApplyEs: (data.howToApplyEs as string) || null,
              tipsEs: (data.tipsEs as string[]) || [],
              source: 'manual',
              verifiedAt: new Date(),
            }
          })
          created++
        }
      } catch (err) {
        errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    // Log the import
    await prisma.changeLog.create({
      data: {
        resourceId: 'csv-import',
        resourceName: `CSV Import (${created} created, ${updated} updated)`,
        action: 'created',
        changes: { created, updated, skipped, errors: errors.length },
      }
    })

    return Response.json({ created, updated, skipped, errors })
  } catch (error) {
    console.error('CSV import error:', error)
    return Response.json({ error: 'Import failed' }, { status: 500 })
  }
}
