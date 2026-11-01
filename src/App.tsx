import { useMemo, useState } from 'react'
import { ArrowLeft, BookOpen, Brain, Check, Download, FolderPlus, LayoutTemplate, Plus, Sparkles, Trash2, Upload, X } from 'lucide-react'
import { BlurFade } from './components/magicui/blur-fade'
import { MagicCard } from './components/magicui/magic-card'
import { MindfortMark } from './components/MindfortMark'
import { FortressBlueprint } from './components/FortressBlueprint'
import { Workspace, listSceneMemories, loadScene } from './components/ExcalidrawWorkspace'
import { demo, fresh, isPalace, load, type State } from './model'
import './native-editor.css'

type Screen='library'|'editor'|'review'
type Backup={kind:'mindfort-workspace-v2';state:State;scenes:Record<string,ReturnType<typeof loadScene>>}
const stateKey='mindfort:builder-v2'
const sceneKey=(id:string)=>'mindfort:excalidraw:'+id
const freshData=()=>{try{return load()}catch{return {palaces:[demo()]}}}
function download(name:string,body:string){
 const url=URL.createObjectURL(new Blob([body],{type:'application/json'}))
 const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1200)
}
export function App(){
 const [state,setState]=useState<State>(freshData)
 const [screen,setScreen]=useState<Screen>('library')
 const [selected,setSelected]=useState<string|null>(null)
 const [showCreate,setShowCreate]=useState(false)
 const [newName,setNewName]=useState('')
 const [showImport,setShowImport]=useState(false)
 const [reviewIndex,setReviewIndex]=useState(0)
 const [revealed,setRevealed]=useState(false)
 const [message,setMessage]=useState('')
 const p=state.palaces.find(q=>q.id===selected)??null
 const memories=useMemo(()=>p?listSceneMemories(p):[],[p,screen,reviewIndex])
 const active=memories[reviewIndex%Math.max(memories.length,1)]
 const rememberedCount=p?.reviews.filter(r=>r.remembered).length??0
 function persist(next:State){try{localStorage.setItem(stateKey,JSON.stringify(next));setState(next)}catch{setMessage('Storage is full. Please export your fortresses.')}}
 function create(e:React.FormEvent){e.preventDefault();const name=newName.trim();if(!name)return;const palace=fresh(name);persist({palaces:[palace,...state.palaces]});setShowCreate(false);setNewName('');open(palace.id)}
 function open(id:string){setSelected(id);setScreen('editor');setReviewIndex(0);setRevealed(false)}
 function startReview(){setReviewIndex(0);setRevealed(false);setScreen('review')}
 function grade(remembered:boolean){if(!p||!active)return;persist({palaces:state.palaces.map(v=>v.id===p.id?{...v,reviews:[...v.reviews,{itemId:active.id,remembered,at:new Date().toISOString()}]}:v)});setReviewIndex(v=>v+1);setRevealed(false)}
 function remove(id:string){if(!confirm('Delete this fortress and all its saved memories?'))return;localStorage.removeItem(sceneKey(id));persist({palaces:state.palaces.filter(v=>v.id!==id)});setScreen('library');setSelected(null)}
 function exportAll(){
  const scenes:Backup['scenes']={}
  for(const palace of state.palaces)scenes[palace.id]=loadScene(palace)
  const backup:Backup={kind:'mindfort-workspace-v2',state,scenes}
  download('mindfort-all-fortresses.json',JSON.stringify(backup,null,2))
 }
 async function importAll(file?:File){
  if(!file)return
  try{
   if(file.size>12000000)throw Error('Backup too large')
   const obj=JSON.parse(await file.text()) as unknown
   if(!obj||typeof obj!=='object')throw Error('Invalid backup')
   const b=obj as Backup
   if(b.kind!=='mindfort-workspace-v2'||!b.state||!Array.isArray(b.state.palaces)||!b.state.palaces.every(isPalace)||!b.scenes||typeof b.scenes!=='object')throw Error('Invalid backup structure')
   if(!confirm('Replace all local fortresses and their canvas scenes with this backup?'))return
   for(const palace of b.state.palaces){const scene=b.scenes[palace.id];if(scene&&Array.isArray(scene.elements)&&scene.notes&&scene.files)localStorage.setItem(sceneKey(palace.id),JSON.stringify(scene))}
   persist(b.state);setSelected(null);setScreen('library');setMessage('Backup restored')
  }catch(err){setMessage(err instanceof Error?err.message:'Invalid backup')}
  finally{setShowImport(false)}
 }
 if(screen==='editor'&&p)return <Workspace key={p.id} palace={p} onBack={()=>setScreen('library')} onRecall={startReview}/>
 return <div className="mf-shell">
  <header className="mf-top">
   <button className="mf-logo" onClick={()=>setScreen('library')}><MindfortMark size={38}/>mindfort<b>.</b></button>
   <nav><button className={screen==='library'?'active':''} onClick={()=>setScreen('library')}><LayoutTemplate size={16}/> Fortresses</button>{p&&<button onClick={()=>open(p.id)}><BookOpen size={16}/> Open canvas</button>}</nav>
   <div className="mf-head-actions"><button onClick={exportAll}><Download size={16}/> Export all</button><button onClick={()=>setShowImport(true)}><Upload size={16}/> Import</button></div>
  </header>
  {screen==='library'&&<main className="mf-library">
   <section className="mf-hero"><BlurFade className="mf-hero-text"><div className="mf-kicker">A CANVAS FOR YOUR MIND</div><h1>Think freely.<br/><em>Remember spatially.</em></h1><p>Draw a familiar place, attach a concept to an object, then test yourself without looking. A free, visual memory palace for real study sessions.</p><button className="mf-cta" onClick={()=>setShowCreate(true)}><Plus size={19}/> Create a fortress</button></BlurFade><BlurFade delay={.12} className="mf-hero-graphic"><FortressBlueprint/></BlurFade></section>
   <section className="mf-library-section"><div className="mf-section-heading"><div><div className="mf-kicker">YOUR MEMORY WORLDS</div><h2>Fortresses</h2></div><span>{state.palaces.length} spaces</span></div>
   <div className="mf-fortresses">{state.palaces.map((fortress,i)=><MagicCard key={fortress.id} className="mf-fort-card"><button onClick={()=>open(fortress.id)} className="mf-fort-open"><div className={'mf-fort-image tone-'+i%3}><FortressBlueprint compact/></div><div className="mf-fort-description"><span>KNOWLEDGE CANVAS</span><h3>{fortress.name}</h3><p>{fortress.rooms.length?fortress.rooms.length+' legacy rooms · ':''}{fortress.items.length?fortress.items.length+' existing objects · ':''}{fortress.reviews.length} reviews</p><strong>Open canvas <ArrowLeft size={14}/></strong></div></button><button title={'Delete '+fortress.name} aria-label={'Delete '+fortress.name} className="mf-fort-delete" onClick={()=>remove(fortress.id)}><Trash2 size={15}/></button></MagicCard>)}
   <button className="mf-add-fort" onClick={()=>setShowCreate(true)}><FolderPlus size={34}/><strong>New memory fortress</strong><span>Sketch your own space and add memories.</span></button></div></section>
   <section className="mf-feature-strip"><div><span>01 / DRAW</span><h3>Build your world</h3><p>Draw a familiar house with simple shapes, labels and arrows.</p></div><div><span>02 / ANCHOR</span><h3>Link a memory</h3><p>Choose an object, explain your concept, and make the association memorable.</p></div><div><span>03 / RECALL</span><h3>Bring it back</h3><p>Revisit your place and try recalling before revealing your notes.</p></div></section><footer className="mf-public-footer"><span>Mindfort · Memory palace builder and active recall</span><nav aria-label="Website information"><a href="./memory-palace-guide.html">How to build a memory palace</a><a href="./privacy.html">Privacy policy</a><a href="https://github.com/channi23/mindfort">GitHub</a></nav></footer>
  </main>}
  {screen==='review'&&p&&<main className="mf-review"><button className="mf-review-back" onClick={()=>open(p.id)}><ArrowLeft size={17}/> Back to canvas</button><div className="mf-kicker">RECALL PRACTICE</div><h1>Explore what you remember.</h1><p className="mf-review-intro">Picture the shape and place where you stored the idea. Answer first. Reveal second.</p>
   {active?<article className="mf-review-card"><div className="mf-review-label">MEMORY {reviewIndex%memories.length+1} OF {memories.length} · {rememberedCount} RECALLS</div><h2>{active.cue}</h2>{revealed?<div className="mf-review-answer"><h3>{active.title}</h3><p>{active.explanation}</p><div className="mf-association"><strong><Sparkles size={16}/> Visual association</strong><p>{active.association}</p></div><div className="mf-review-controls"><button onClick={()=>grade(false)}>Need to revisit</button><button onClick={()=>grade(true)}><Check size={17}/> Remembered</button></div></div>:<><p>Recall the answer and its visual association before revealing.</p><button className="mf-cta" onClick={()=>setRevealed(true)}>Reveal memory</button></>}</article>:<div className="mf-review-empty"><Brain size={40}/><h2>No memories attached yet</h2><p>Draw a shape in your fortress, select it, and attach an explanation and recall question.</p><button className="mf-cta" onClick={()=>open(p.id)}>Go to canvas</button></div>}
  </main>}
  {showCreate&&<div className="mf-modal-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setShowCreate(false)}}><section className="mf-modal" role="dialog" aria-label="Create a knowledge fortress" aria-modal="true"><div className="mf-modal-header"><div><div className="mf-kicker">NEW KNOWLEDGE WORLD</div><h2>Name your fortress</h2></div><button aria-label="Close" onClick={()=>setShowCreate(false)}><X size={18}/></button></div><form className="mf-form" onSubmit={create}><label>Fortress name<input required autoFocus placeholder="e.g. Operating Systems" maxLength={80} value={newName} onChange={e=>setNewName(e.target.value)}/></label><p>Start with a blank canvas. Draw a room, select an object, and attach your first idea.</p><div className="mf-form-actions"><button type="button" onClick={()=>setShowCreate(false)}>Cancel</button><button className="mf-cta" type="submit">Create fortress</button></div></form></section></div>}
  {showImport&&<div className="mf-modal-overlay"><section className="mf-modal" role="dialog" aria-modal="true" aria-label="Import Mindfort backup"><div className="mf-modal-header"><h2>Import your fortresses</h2><button aria-label="Close" onClick={()=>setShowImport(false)}><X size={18}/></button></div><p>Choose a Mindfort all-fortresses JSON backup. This replaces your existing data after confirmation.</p><input aria-label="Backup file" type="file" accept=".json,application/json" onChange={e=>void importAll(e.target.files?.[0])}/></section></div>}
  {message&&<div role="status" className="mf-notice" onClick={()=>setMessage('')}>{message}<X size={15}/></div>}
 </div>
}
