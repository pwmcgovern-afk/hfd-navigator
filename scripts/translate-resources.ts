import { PrismaClient } from '@prisma/client'
import Anthropic from '@anthropic-ai/sdk'

const prisma = new PrismaClient()
const anthropic = new Anthropic()

async function translateResource(resource: {
  id: string
  name: string
  description: string
  howToApply: string | null
  tips: string[]
}) {
  const prompt = `Translate the following social service resource information from English to Spanish. Keep organization names, addresses, phone numbers, and proper nouns in English. Return ONLY valid JSON with these keys: nameEs, descriptionEs, howToApplyEs, tipsEs (array).

Name: ${resource.name}
Description: ${resource.description}
${resource.howToApply ? `How to Apply: ${resource.howToApply}` : ''}
${resource.tips.length > 0 ? `Tips:\n${resource.tips.map((t, i) => `${i + 1}. ${t}`).join('\n')}` : ''}`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`No JSON found for ${resource.name}`)
  return JSON.parse(jsonMatch[0])
}

async function main() {
  const resources = await prisma.resource.findMany({
    where: {
      OR: [
        { nameEs: null },
        { nameEs: '' },
      ],
    },
    select: {
      id: true,
      name: true,
      description: true,
      howToApply: true,
      tips: true,
    },
  })

  console.log(`Found ${resources.length} resources needing translation`)

  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i]
    try {
      console.log(`[${i + 1}/${resources.length}] Translating: ${resource.name}`)
      const translated = await translateResource(resource)

      await prisma.resource.update({
        where: { id: resource.id },
        data: {
          nameEs: translated.nameEs || null,
          descriptionEs: translated.descriptionEs || null,
          howToApplyEs: translated.howToApplyEs || null,
          tipsEs: translated.tipsEs || [],
        },
      })
      console.log(`  ✓ Done`)
    } catch (err) {
      console.error(`  ✗ Failed: ${err}`)
    }
  }

  console.log('All done!')
  await prisma.$disconnect()
}

main()
