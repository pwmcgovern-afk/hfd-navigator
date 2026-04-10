import { PrismaClient } from '@prisma/client'
import { coreResources, categorySeeds } from './data-core'

const prisma = new PrismaClient()

// All resources combined from all data sources
const allResources = [
  ...coreResources,
]

async function main() {
  const mode = process.argv[2] || 'upsert'

  if (mode === 'reset') {
    // Full reset: delete everything and recreate
    console.log('RESETTING database — deleting all data...')
    await prisma.feedback.deleteMany()
    await prisma.trackerEntry.deleteMany()
    await prisma.anonymousUser.deleteMany()
    await prisma.resource.deleteMany()
    await prisma.category.deleteMany()

    // Seed categories
    for (const cat of categorySeeds) {
      await prisma.category.create({ data: cat })
    }
    console.log(`Created ${categorySeeds.length} categories`)

    // Seed all resources
    for (const resource of allResources) {
      await prisma.resource.create({
        data: { ...resource, verifiedAt: new Date() }
      })
    }
    console.log(`Created ${allResources.length} resources`)
  } else {
    // Upsert mode: add new resources, skip existing ones
    console.log('UPSERTING resources (adding new, skipping existing)...')

    // Ensure categories exist
    for (const cat of categorySeeds) {
      const existing = await prisma.category.findUnique({ where: { slug: cat.slug } })
      if (!existing) {
        await prisma.category.create({ data: cat })
        console.log(`Created category: ${cat.name}`)
      }
    }

    let added = 0
    let skipped = 0
    for (const resource of allResources) {
      const existing = await prisma.resource.findFirst({
        where: { name: resource.name }
      })

      if (!existing) {
        await prisma.resource.create({
          data: { ...resource, verifiedAt: new Date() }
        })
        added++
        console.log(`Added: ${resource.name}`)
      } else {
        skipped++
      }
    }

    console.log(`\nAdded ${added} new resources, skipped ${skipped} existing`)
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
