export type FurnitureKind = 'fridge'|'stove'|'table'|'sofa'|'bed'|'desk'|'shelf'|'plant'|'lamp'|'chest'|'board'|'door'
export type Room = { id:string; name:string; x:number; y:number; w:number; h:number; color:string }
export type Item = { id:string; kind:FurnitureKind; x:number; y:number; rotation:number; title:string; explanation:string; association:string; cue:string }
export type Palace = { id:string; name:string; rooms:Room[]; items:Item[]; reviews: {itemId:string;remembered:boolean;at:string}[]; updatedAt:number }
export type State = { palaces:Palace[] }
export const GRID={cols:24,rows:16,size:42}
export const palette: {kind:FurnitureKind; label:string; symbol:string; category:string}[]=[
 {kind:'fridge',label:'Refrigerator',symbol:'▤',category:'Kitchen'},
 {kind:'stove',label:'Stove',symbol:'♨',category:'Kitchen'},
 {kind:'table',label:'Table',symbol:'▦',category:'Living'},
 {kind:'sofa',label:'Sofa',symbol:'▰',category:'Living'},
 {kind:'bed',label:'Bed',symbol:'▥',category:'Bedroom'},
 {kind:'desk',label:'Desk',symbol:'▣',category:'Study'},
 {kind:'shelf',label:'Bookshelf',symbol:'▤',category:'Study'},
 {kind:'plant',label:'Plant',symbol:'✿',category:'Decor'},
 {kind:'lamp',label:'Lamp',symbol:'☼',category:'Decor'},
 {kind:'chest',label:'Chest',symbol:'▣',category:'Storage'},
 {kind:'board',label:'Whiteboard',symbol:'▭',category:'Study'},
 {kind:'door',label:'Door',symbol:'▯',category:'Build'}]
export const roomColors=['#fbe6ce','#e4ddfa','#dcf1e4','#ffe0df','#dbeaf8','#f8edcc']
export const uid=()=>globalThis.crypto?.randomUUID?.()??Math.random().toString(36).slice(2)
export const within=(x:number,y:number,r:Room)=>x>=r.x&&y>=r.y&&x<r.x+r.w&&y<r.y+r.h
export const roomAt=(p:Palace,x:number,y:number)=>p.rooms.find(r=>within(x,y,r))
export const overlaps=(a:Pick<Room,'x'|'y'|'w'|'h'>,b:Pick<Room,'x'|'y'|'w'|'h'>)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y
export function validRoom(p:Palace,r:Room,ignoreId?:string){return r.w>=2&&r.h>=2&&r.x>=0&&r.y>=0&&r.x+r.w<=GRID.cols&&r.y+r.h<=GRID.rows&&!p.rooms.some(other=>other.id!==ignoreId&&overlaps(r,other))}
export function validItemLocation(p:Palace,x:number,y:number,ignoreId?:string){return Boolean(roomAt(p,x,y))&&!p.items.some(i=>i.id!==ignoreId&&i.x===x&&i.y===y)}
export function demo():Palace {
 const rooms:Room[]=[
 {id:'kitchen',name:'Kitchen',x:2,y:2,w:8,h:7,color:roomColors[0]},
 {id:'study',name:'Study',x:10,y:2,w:7,h:7,color:roomColors[1]},
 {id:'bedroom',name:'Bedroom',x:2,y:9,w:9,h:5,color:roomColors[2]},
 {id:'lounge',name:'Living Room',x:11,y:9,w:6,h:5,color:roomColors[3]}]
 const notes=[
 ['fridge',4,4,'Shared memory','Threads of the same process share an address space, while retaining separate stacks and registers.','Four chefs use the SAME refrigerator, but each carries a private recipe notebook.','What do threads share and what stays private?'],
 ['stove',7,5,'Concurrency','Concurrent tasks make progress in overlapping time; parallel tasks can execute simultaneously on different cores.','Two chefs take turns at one stove, while two stoves let them cook in parallel.','How do concurrency and parallelism differ?'],
 ['desk',12,4,'Critical section','A critical section accesses shared state and must be protected from problematic concurrent access.','Only one student gets the gold desk key at a time.','Why do critical sections need synchronization?'],
 ['bed',4,11,'Process isolation','Processes typically own separate virtual address spaces, unlike threads in one process.','Each sleeper has a locked private bedroom.','How is memory isolation different for processes and threads?'],
 ['shelf',14,11,'Virtual memory','Virtual pages map to physical frames; missing mappings can produce page faults.','The librarian fetches a missing book from storage when the shelf is empty.','What happens on a page fault?']
 ] as const
 return {id:uid(),name:'Operating Systems',rooms,items:notes.map(([kind,x,y,title,explanation,association,cue])=>({id:uid(),kind:kind as FurnitureKind,x,y,rotation:0,title,explanation,association,cue})),reviews:[],updatedAt:Date.now()}
}
export const fresh=(name:string):Palace=>({id:uid(),name,rooms:[],items:[],reviews:[],updatedAt:Date.now()})
export function isPalace(v:unknown):v is Palace {if(!v||typeof v!=='object')return false;const p=v as Record<string,unknown>;return typeof p.id==='string'&&typeof p.name==='string'&&Array.isArray(p.rooms)&&Array.isArray(p.items)&&Array.isArray(p.reviews)&&p.rooms.length<=100&&p.items.length<=500&&p.rooms.every((r:unknown)=>{const q=r as Room;return q&&typeof q.id==='string'&&typeof q.name==='string'&&[q.x,q.y,q.w,q.h].every(n=>Number.isInteger(n))&&typeof q.color==='string'})&&p.items.every((i:unknown)=>{const q=i as Item;return q&&typeof q.id==='string'&&palette.some(e=>e.kind===q.kind)&&Number.isInteger(q.x)&&Number.isInteger(q.y)&&['title','explanation','association','cue'].every(k=>typeof q[k as keyof Item]==='string')})}
export function load():State {try{const parsed=JSON.parse(localStorage.getItem('mindfort:builder-v2')||'null') as unknown;if(parsed&&typeof parsed==='object'&&Array.isArray((parsed as State).palaces)&&(parsed as State).palaces.every(isPalace))return parsed as State}catch{/* recover with demo */}return {palaces:[demo()]}}
