import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Excalidraw, convertToExcalidrawElements, MainMenu, WelcomeScreen } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'
import { ArrowLeft, BookOpen, Brain, Check, Download, Edit3, FilePlus2, Home, Save, Sparkles, X } from 'lucide-react'
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types'
import type { ExcalidrawImperativeAPI, BinaryFiles } from '@excalidraw/excalidraw/types'
import type { Palace } from '../model'
import { useRef as useStableRef } from 'react'

export type MemoryNote={title:string;explanation:string;association:string;cue:string}
export type SceneRecord={elements:readonly ExcalidrawElement[];files:BinaryFiles;notes:Record<string,MemoryNote>;appState?:{viewBackgroundColor?:string}}
const storageKey=(id:string)=>'mindfort:excalidraw:'+id
const emptyScene=():SceneRecord=>({elements:[],files:{},notes:{},appState:{viewBackgroundColor:'#ffffff'}})
export function fromLegacy(p:Palace):SceneRecord {
 const cell=70
 const roomSkeletons=p.rooms.map(room=>({type:'rectangle' as const,id:'room-'+room.id,x:room.x*cell,y:room.y*cell,width:room.w*cell,height:room.h*cell,strokeColor:'#138bb6',backgroundColor:room.color,fillStyle:'solid' as const,strokeWidth:2 as const,roughness:1 as const,label:{text:room.name,fontSize:20,strokeColor:'#174b64'}}))
 const furnitureSkeletons=p.items.map(item=>({type:'rectangle' as const,id:'memory-'+item.id,x:item.x*cell,y:item.y*cell,width:cell-8,height:cell-8,strokeColor:item.title?'#e83e90':'#1988ad',backgroundColor:item.title?'#ffe5f1':'#dff6ff',fillStyle:'solid' as const,strokeWidth:2 as const,label:{text:item.title||item.kind,fontSize:14,strokeColor:'#163a50'}}))
 const notes:Record<string,MemoryNote>={}
 for(const item of p.items){if(item.title)notes['memory-'+item.id]={title:item.title,explanation:item.explanation,association:item.association,cue:item.cue}}
 return {elements:convertToExcalidrawElements([...roomSkeletons,...furnitureSkeletons]),files:{},notes,appState:{viewBackgroundColor:'#ffffff'}}
}
export function loadScene(p:Palace):SceneRecord {
 try{
  const raw=localStorage.getItem(storageKey(p.id))
  if(raw){
   const data=JSON.parse(raw) as SceneRecord
   if(data&&Array.isArray(data.elements)&&data.files&&data.notes&&typeof data.notes==='object')return data
  }
 }catch{ /* fall back to legacy scene */ }
 return p.rooms.length||p.items.length?fromLegacy(p):emptyScene()
}
function download(filename:string,content:string) {
 const url=URL.createObjectURL(new Blob([content],{type:'application/json'}))
 const a=document.createElement('a');a.href=url;a.download=filename;a.click()
 window.setTimeout(()=>URL.revokeObjectURL(url),2000)
}
const safeName=(name:string)=>name.replace(/[^a-z0-9-_]+/gi,'-').slice(0,48)||'fortress'
export function Workspace({palace,onBack,onRecall}:{palace:Palace;onBack:()=>void;onRecall:()=>void}){
 const initial=useMemo(()=>loadScene(palace),[palace.id])
 const sceneRef=useStableRef<SceneRecord>(initial)
 const api=useRef<ExcalidrawImperativeAPI|null>(null)
 const selectedRef=useRef('')
 const [selectedId,setSelectedId]=useState<string|null>(null)
 const [note,setNote]=useState<MemoryNote|null>(null)
 const [editorOpen,setEditorOpen]=useState(false)
 const [status,setStatus]=useState('Saved locally')
 const [count,setCount]=useState(initial.elements.length)
 const [activeNotes,setActiveNotes]=useState(Object.keys(initial.notes).length)
 const saveTimer=useRef<ReturnType<typeof setTimeout>|null>(null)
 const updateStatus=useCallback(()=>setStatus('Saved locally'),[])
 const flush=useCallback(()=>{
  try{localStorage.setItem(storageKey(palace.id),JSON.stringify(sceneRef.current));updateStatus()}
  catch{setStatus('Storage full. Export your scene now.')}
 },[palace.id,updateStatus])
 useEffect(()=>()=>{if(saveTimer.current)clearTimeout(saveTimer.current);flush()},[flush])
 function scheduleSave(){
  setStatus('Saving…')
  if(saveTimer.current)clearTimeout(saveTimer.current)
  saveTimer.current=setTimeout(flush,500)
 }
 function sceneChange(elements:readonly ExcalidrawElement[],appState:{selectedElementIds:Record<string,boolean>;viewBackgroundColor:string},files:BinaryFiles){
  sceneRef.current={...sceneRef.current,elements,files,appState:{viewBackgroundColor:appState.viewBackgroundColor}}
  if(elements.length!==count)setCount(elements.length)
  const id=Object.keys(appState.selectedElementIds??{}).find(k=>appState.selectedElementIds[k])??null
  if(selectedRef.current!==(id??'')){selectedRef.current=id??'';setSelectedId(id)}
  scheduleSave()
 }
 function openNote(id:string){
  const current=sceneRef.current.notes[id]??{title:'',explanation:'',association:'',cue:''}
  setNote({...current});setSelectedId(id);setEditorOpen(true)
 }
 function saveNote(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();if(!selectedId||!note)return
  const trimmed=Object.fromEntries(Object.entries(note).map(([k,v])=>[k,v.trim()])) as MemoryNote
  if(!trimmed.title||!trimmed.explanation||!trimmed.association||!trimmed.cue)return
  sceneRef.current.notes[selectedId]=trimmed
  setActiveNotes(Object.keys(sceneRef.current.notes).length)
  setEditorOpen(false);scheduleSave()
 }
 function removeNote(){
  if(!selectedId)return
  delete sceneRef.current.notes[selectedId];setActiveNotes(Object.keys(sceneRef.current.notes).length)
  setEditorOpen(false);scheduleSave()
 }
 function exportScene(){
  flush()
  download(safeName(palace.name)+'-mindfort-scene.json',JSON.stringify({kind:'mindfort-scene-v1',name:palace.name,...sceneRef.current},null,2))
 }
 function addRoom(){api.current?.setActiveTool({type:'rectangle'})}
 function isSelectedValid(){return Boolean(selectedId&&sceneRef.current.elements.some(el=>el.id===selectedId&&!el.isDeleted))}
 return <div className="mf-editor-page">
  <header className="mf-editor-topbar">
   <div className="mf-editor-left"><button onClick={onBack} aria-label="Back to fortresses" className="mf-back"><ArrowLeft size={18}/></button><div><div className="mf-overline">MINDFORT / KNOWLEDGE CANVAS</div><strong>{palace.name}</strong></div></div>
   <div className="mf-editor-actions"><span className="mf-save-status">{status}</span><button className="mf-outline" onClick={exportScene}><Download size={16}/> Export scene</button><button className="mf-pink" onClick={onRecall}><Brain size={16}/> Recall</button></div>
  </header>
  <div className="mf-workspace">
   <div className="mf-excalidraw-frame" data-testid="native-excalidraw-editor">
    <Excalidraw
      key={palace.id}
      excalidrawAPI={value=>{api.current=value}}
      initialData={{elements:initial.elements,files:initial.files,appState:{viewBackgroundColor:initial.appState?.viewBackgroundColor||'#ffffff'},scrollToContent:true}}
      onChange={sceneChange}
      theme="light"
      gridModeEnabled={false}
      name={palace.name}
      UIOptions={{canvasActions:{loadScene:false}}}
    >
      <MainMenu>
       <MainMenu.DefaultItems.ClearCanvas/>
       <MainMenu.DefaultItems.Export/>
       <MainMenu.DefaultItems.SaveAsImage/>
       <MainMenu.DefaultItems.ChangeCanvasBackground/>
       <MainMenu.Separator/>
       <MainMenu.Item onSelect={exportScene}><Download size={14}/> Export Mindfort scene</MainMenu.Item>
      </MainMenu>
      <WelcomeScreen>
       <WelcomeScreen.Hints.ToolbarHint/>
       <WelcomeScreen.Center>
        <WelcomeScreen.Center.Logo><div className="mf-welcome-logo">mindfort.</div></WelcomeScreen.Center.Logo>
        <WelcomeScreen.Center.Heading>Give every idea a place to live.</WelcomeScreen.Center.Heading>
        <WelcomeScreen.Center.Menu>
         <WelcomeScreen.Center.MenuItem icon={<FilePlus2 size={18}/>} onSelect={addRoom}>Draw your first room</WelcomeScreen.Center.MenuItem>
         <WelcomeScreen.Center.MenuItemHelp/>
        </WelcomeScreen.Center.Menu>
       </WelcomeScreen.Center>
      </WelcomeScreen>
    </Excalidraw>
   </div>
   <aside className="mf-memory-panel">
    <div className="mf-panel-kicker"><Sparkles size={16}/> THE MEMORY LAYER</div>
    <h2>Make the drawing memorable.</h2>
    <p>Draw rooms with rectangles, place shapes or text inside them, then select any shape to attach a concept.</p>
    <div className="mf-panel-stats"><span>{count}<small>canvas elements</small></span><span>{activeNotes}<small>memory anchors</small></span></div>
    <div className="mf-selected">
     <div className="mf-selected-heading">{selectedId?'Selected element':'Select a shape'}</div>
     {selectedId?<><p>{sceneRef.current.notes[selectedId]?.title||'This object has no memory yet.'}</p><button className="mf-pink" onClick={()=>openNote(selectedId)}><Edit3 size={16}/>{sceneRef.current.notes[selectedId]?'Edit memory':'Attach memory'}</button></>:<p>Click a rectangle, text, frame or object on the canvas to create a memory anchor.</p>}
    </div>
    <div className="mf-panel-guide"><strong>How to build your fortress</strong><ol><li>Draw room outlines using Excalidraw's rectangle tool.</li><li>Add furniture symbols, text, or freehand sketches.</li><li>Select an object and attach a memorable association.</li><li>Use Recall to test your knowledge.</li></ol></div>
    <button className="mf-outline mf-full" onClick={exportScene}><Save size={15}/> Back up this fortress</button>
   </aside>
  </div>
  {editorOpen&&note&&<div className="mf-modal-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setEditorOpen(false)}}>
   <section className="mf-modal" role="dialog" aria-modal="true" aria-label="Attach memory">
    <div className="mf-modal-header"><div><div className="mf-overline">SPATIAL ASSOCIATION</div><h2>Attach a memory</h2></div><button onClick={()=>setEditorOpen(false)} aria-label="Close memory editor"><X size={18}/></button></div>
    <form onSubmit={saveNote} className="mf-form">
     {(['title','explanation','association','cue'] as const).map(field=><label key={field}>{({title:'Concept',explanation:'Explanation',association:'Visual association',cue:'Recall question'} as const)[field]}{field==='title'?<input required maxLength={120} autoFocus value={note[field]} onChange={e=>setNote(n=>n?{...n,[field]:e.target.value}:n)} placeholder="Threads share process memory"/>:<textarea required rows={field==='explanation'?4:3} maxLength={1800} value={note[field]} onChange={e=>setNote(n=>n?{...n,[field]:e.target.value}:n)} placeholder={field==='association'?'Imagine four chefs sharing one huge refrigerator...':field==='cue'?'What do threads in a process share?':'Explain in your own words'}/>}</label>)}
     <div className="mf-form-actions">{sceneRef.current.notes[selectedId||'']&&<button type="button" onClick={removeNote} className="mf-delete">Remove note</button>}<button type="button" className="mf-outline" onClick={()=>setEditorOpen(false)}>Cancel</button><button type="submit" className="mf-pink"><Check size={16}/> Save memory</button></div>
    </form>
   </section>
  </div>}
 </div>
}
export function getSceneNotes(p:Palace){return loadScene(p).notes}
export function listSceneMemories(p:Palace){const data=loadScene(p);return Object.entries(data.notes).filter(([id])=>data.elements.some(el=>el.id===id&&!el.isDeleted)).map(([id,note])=>({id,...note}))}
