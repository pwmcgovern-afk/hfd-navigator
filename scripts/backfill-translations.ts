import { runTranslation } from '../lib/translate'

async function main() {
  console.log('Starting translation backfill...')
  const result = await runTranslation()
  console.log(`Translated: ${result.translated}, Failed: ${result.failed}`)
  if (result.errors.length > 0) {
    console.log('Errors:')
    result.errors.forEach(e => console.log(`  - ${e}`))
  }
  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
