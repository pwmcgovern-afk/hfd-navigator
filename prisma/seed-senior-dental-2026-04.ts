/**
 * One-time seed: add senior + dental resources for Hartford.
 * Idempotent — skips any resource whose name already exists.
 *
 * Run once: npx tsx prisma/seed-senior-dental-2026-04.ts
 *
 * Phone + address left blank for admin to fill in after verification.
 * Translation cron auto-populates *Es fields.
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const resources = [
  // --- Senior services ---
  {
    name: 'North Central Area Agency on Aging',
    organization: 'North Central Area Agency on Aging',
    description:
      'Regional Area Agency on Aging (AAA) serving Hartford and Tolland counties. Free programs for adults 60+: Meals on Wheels, CHOICES Medicare counseling, case management, caregiver support, and benefits screening.',
    categories: ['senior'],
    website: 'https://ncaaact.org',
    city: 'Hartford',
  },
  {
    name: 'Hartford Senior Center — Bowles Park',
    organization: 'City of Hartford',
    description:
      'City-run senior center offering hot lunch, exercise programs, social activities, and benefits help for Hartford residents 60+. Multiple sites across the city.',
    categories: ['senior'],
    website: 'https://www.hartfordct.gov/Government/Departments/Families-Children-Youth-Recreation',
    city: 'Hartford',
  },
  {
    name: 'Hispanic Senior Center of Hartford',
    organization: 'Hispanic Senior Center of Hartford',
    description:
      'Senior services with bilingual (English/Spanish) staff. Hot meals, ESL classes, health screenings, social activities, and case management for Latino seniors and their families.',
    categories: ['senior'],
    city: 'Hartford',
  },

  // --- Dental services ---
  {
    name: 'Community Health Services — Dental',
    organization: 'Community Health Services',
    description:
      'Federally Qualified Health Center dental clinic in Hartford on a sliding-fee scale. Accepts Medicaid/HUSKY, Medicare, and uninsured patients. Cleanings, fillings, extractions, and preventive care for all ages.',
    categories: ['dental', 'healthcare'],
    website: 'https://www.chsct.org',
    city: 'Hartford',
  },
  {
    name: 'Charter Oak Health Center — Dental',
    organization: 'Charter Oak Health Center',
    description:
      'FQHC dental services for adults and children on a sliding-fee scale. Accepts HUSKY, Medicaid, Medicare, and most insurance. Bilingual (English/Spanish) staff.',
    categories: ['dental', 'healthcare'],
    website: 'https://www.thecharteroak.org',
    city: 'Hartford',
  },
  {
    name: 'UConn Health Dental Clinic',
    organization: 'UConn Health',
    description:
      'Low-cost dental care from supervised dental students and residents. General dentistry, oral surgery, specialty services. Located in Farmington, accessible to Hartford area patients.',
    categories: ['dental'],
    website: 'https://health.uconn.edu/dental-medicine/dental-services/',
    city: 'Hartford',
  },
]

async function main() {
  let added = 0
  let skipped = 0
  for (const r of resources) {
    const existing = await prisma.resource.findFirst({ where: { name: r.name } })
    if (existing) {
      console.log(`- Skip (exists): ${r.name}`)
      skipped++
      continue
    }
    await prisma.resource.create({
      data: {
        name: r.name,
        organization: r.organization,
        description: r.description,
        categories: r.categories,
        city: r.city,
        state: 'CT',
        website: r.website,
        source: 'manual',
      },
    })
    console.log(`+ Added: ${r.name}`)
    added++
  }
  console.log(`\nSummary: ${added} added, ${skipped} skipped`)
}

main()
  .catch(err => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
