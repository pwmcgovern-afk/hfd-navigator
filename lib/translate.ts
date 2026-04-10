import Anthropic from '@anthropic-ai/sdk'
import { prisma } from './db'

const anthropic = new Anthropic()

async function translateOne(resource: {
  id: string; name: string; description: string; howToApply: string | null; tips: string[]
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
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`No JSON found for ${resource.name}`)
  return JSON.parse(jsonMatch[0])
}

export interface TranslateResult {
  translated: number
  failed: number
  errors: string[]
}

export async function runTranslation(): Promise<TranslateResult> {
  const resources = await prisma.resource.findMany({
    where: { OR: [{ nameEs: null }, { nameEs: '' }] },
    select: { id: true, name: true, description: true, howToApply: true, tips: true },
  })

  let translated = 0
  let failed = 0
  const errors: string[] = []

  for (const resource of resources) {
    try {
      const result = await translateOne(resource)

      await prisma.resource.update({
        where: { id: resource.id },
        data: {
          nameEs: result.nameEs || null,
          descriptionEs: result.descriptionEs || null,
          howToApplyEs: result.howToApplyEs || null,
          tipsEs: result.tipsEs || [],
        },
      })
      translated++
    } catch (err) {
      failed++
      errors.push(`${resource.name}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return { translated, failed, errors }
}
