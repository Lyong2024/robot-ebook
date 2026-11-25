import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const docs = join(root, 'docs')
const outDir = join(root, 'dist-ebook')
const bookPath = join(outDir, 'book.md')

const parts = [
  ['前言', 'intro.md'],
  ['第1章', 'chapters/chapter_01.md'],
  ['第2章', 'chapters/chapter_02.md'],
  ['第3章', 'chapters/chapter_03.md'],
  ['第4章', 'chapters/chapter_04.md'],
  ['第5章', 'chapters/chapter_05.md'],
  ['第6章', 'chapters/chapter_06.md'],
  ['第7章', 'chapters/chapter_07.md'],
  ['第8章', 'chapters/chapter_08.md'],
  ['第9章 全景', 'chapters/chapter_09/index.md'],
  ['9.1', 'chapters/chapter_09/01-distro-workspace.md'],
  ['9.2', 'chapters/chapter_09/02-graph-topics-qos.md'],
  ['9.3', 'chapters/chapter_09/03-interfaces-services-actions.md'],
  ['9.4', 'chapters/chapter_09/04-parameters-launch.md'],
  ['9.5', 'chapters/chapter_09/05-tf-time-rosbag.md'],
  ['9.6', 'chapters/chapter_09/06-executor-components.md'],
  ['9.7', 'chapters/chapter_09/07-cli-debugging.md'],
  ['9.8', 'chapters/chapter_09/08-dds-robot-interface.md'],
  ['第9章 拓展阅读', 'chapters/chapter_09/further-reading.md'],
  ['第10章', 'chapters/chapter_10.md'],
  ['第11章', 'chapters/chapter_11.md'],
  ['第12章', 'chapters/chapter_12.md'],
  ['第13章', 'chapters/chapter_13.md'],
  ['第14章', 'chapters/chapter_14.md'],
  ['第15章', 'chapters/chapter_15.md'],
  ['第16章', 'chapters/chapter_16.md'],
  ['第17章', 'chapters/chapter_17.md'],
  ['第18章', 'chapters/chapter_18.md'],
  ['关于', 'about.md'],
  ['术语表', 'appendix/glossary.md'],
  ['常见问题', 'appendix/faq.md'],
  ['调试指南', 'appendix/debugging_guide.md'],
  ['开源项目', 'appendix/projects.md'],
  ['开源项目详表', 'appendix/open_source_projects.md'],
  ['贡献者', 'appendix/contributors.md'],
  ['高成就者', 'appendix/hall_of_fame.md'],
  ['资源更新', 'appendix/resource_updates.md']
]

function prepare(markdown) {
  let text = markdown.replace(/\r\n/g, '\n')
  text = text.replace(/^---\n[\s\S]*?\n---\n/, '')
  text = text.replace(/<ResourceCard[^>]*>/g, '\n')
  text = text.replace(/<\/ResourceCard>/g, '\n')
  text = text.replace(/:::\s*(tip|warning|danger|info|details)[^\n]*\n/g, '\n')
  text = text.replace(/^:::\s*$/gm, '')
  text = text.replace(/\]\((?!https?:|mailto:)([^)#]+)\.md(#[^)]*)?\)/g, ']($1.html$2)')
  text = text.replace(/\]\(\.\/([^)#]+)\.md(#[^)]*)?\)/g, ']($1.html$2)')
  return text.trim() + '\n'
}

const title = `# 机器人开发：从零基础到动手创造

软件、硬件与前沿趋势的完整实践指南。正文采用 CC BY-NC-SA 4.0。仓库：https://github.com/Lyong2024/robot-ebook

`

const body = parts.map(([, rel]) => {
  const source = readFileSync(join(docs, rel), 'utf8')
  return `\n\n${prepare(source)}`
}).join('\n')

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })
writeFileSync(bookPath, title + body, 'utf8')
console.log(`wrote ${bookPath} (${Buffer.byteLength(title + body)} bytes, ${parts.length} parts)`)
