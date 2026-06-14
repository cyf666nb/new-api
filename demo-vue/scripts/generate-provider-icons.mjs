import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as icons from 'simple-icons'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectDir = dirname(scriptDir)
const repoDir = dirname(dirname(projectDir))
const outputDir = join(projectDir, 'src', 'assets', 'provider-icons')

mkdirSync(outputDir, { recursive: true })

const fromSimpleIcon = (icon) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img"><path fill="currentColor" d="${icon.path}"/></svg>\n`

const fromWordmark = (label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img"><rect width="64" height="64" rx="14" fill="none"/><text x="32" y="38" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="${label.length > 2 ? 15 : 18}" font-weight="800" fill="currentColor">${label}</text></svg>\n`

const openAiSymbol = () => {
  const raw = readFileSync(join(repoDir, 'demo', 'pretext', 'pages', 'assets', 'openai-symbol.svg'), 'utf8')
  const viewBox = raw.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 158.7128 157.296'
  const path = raw.match(/<path d="([^"]+)"/)?.[1]
  if (!path) throw new Error('Could not read OpenAI symbol path')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img"><path fill="currentColor" d="${path}"/></svg>\n`
}

const assets = {
  anthropic: fromSimpleIcon(icons.siAnthropic),
  openai: openAiSymbol(),
  google: fromSimpleIcon(icons.siGoogle),
  deepseek: fromSimpleIcon(icons.siDeepseek),
  xai: fromSimpleIcon(icons.siX),
  mistral: fromSimpleIcon(icons.siMistralai),
  qwen: fromSimpleIcon(icons.siQwen),
  zhipu: fromWordmark('智谱'),
  doubao: fromSimpleIcon(icons.siBytedance),
  moonshot: fromSimpleIcon(icons.siMoonshotai),
}

for (const [name, svg] of Object.entries(assets)) {
  writeFileSync(join(outputDir, `${name}.svg`), svg)
}

console.log(`Generated ${Object.keys(assets).length} provider icons`)
