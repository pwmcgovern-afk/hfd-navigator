import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function geocodeAddress(address: string, city: string, state: string, zip: string | null): Promise<{ lat: number; lng: number } | null> {
  const query = `${address}, ${city}, ${state}${zip ? ' ' + zip : ''}`
  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=us`

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'NewHavenNavigator/1.0 (pwmcgovern@gmail.com)' }
    })
    const data = await res.json()
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    }
    return null
  } catch (err) {
    console.error(`Failed to geocode: ${query}`, err)
    return null
  }
}

async function main() {
  console.log('Geocoding resources...')

  const resources = await prisma.resource.findMany({
    where: {
      address: { not: null },
      OR: [
        { latitude: null },
        { longitude: null }
      ]
    },
    select: {
      id: true,
      name: true,
      address: true,
      city: true,
      state: true,
      zip: true
    }
  })

  console.log(`Found ${resources.length} resources to geocode`)

  let geocoded = 0
  let failed = 0

  for (const resource of resources) {
    if (!resource.address) continue

    // Rate limit: 1 request per second (Nominatim policy)
    await sleep(1100)

    const result = await geocodeAddress(resource.address, resource.city, resource.state, resource.zip)

    if (result) {
      await prisma.resource.update({
        where: { id: resource.id },
        data: { latitude: result.lat, longitude: result.lng }
      })
      console.log(`Geocoded: ${resource.name} -> ${result.lat}, ${result.lng}`)
      geocoded++
    } else {
      console.log(`Failed: ${resource.name} (${resource.address}, ${resource.city})`)
      failed++
    }
  }

  console.log(`\nDone! Geocoded: ${geocoded}, Failed: ${failed}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
