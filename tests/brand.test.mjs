import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const files=[
 'src/App.tsx',
 'src/components/ExcalidrawWorkspace.tsx',
 'src/components/FortressBlueprint.tsx',
 'src/components/MindfortMark.tsx',
 'src/native-editor.css',
 'src/styles.css',
 'index.html',
 'public/memory-palace-guide.html',
 'public/privacy.html'
]

test('Mindfort application and public pages contain no emoji characters',()=>{
 const unicodeEmoji=/\p{Extended_Pictographic}/gu
 for(const file of files){
  const content=readFileSync(join(process.cwd(),file),'utf8')
  const found=[...content.matchAll(unicodeEmoji)].map(match=>match[0])
  assert.deepEqual(found,[],file+' contains emoji characters: '+found.join(', '))
 }
})

test('the same dotmark is used in the app and browser icon',()=>{
 const logo=readFileSync('src/components/MindfortMark.tsx','utf8')
 const icon=readFileSync('public/favicon.svg','utf8')
 const app=readFileSync('src/App.tsx','utf8')
 const workspace=readFileSync('src/components/ExcalidrawWorkspace.tsx','utf8')
 assert.equal((logo.match(/<circle/g)||[]).length,6)
 assert.equal((icon.match(/<circle/g)||[]).length,6)
 assert.match(app,/<MindfortMark/)
 assert.match(workspace,/<MindfortMark/)
 assert.match(readFileSync('index.html','utf8'),/favicon\.svg/)
})
