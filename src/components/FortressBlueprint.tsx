import { BookOpen, Brain, Lightbulb, Layers3 } from 'lucide-react'
/** Decorative blueprint preview: real project geometry, never emoji or stock art. */
export function FortressBlueprint({compact=false}:{compact?:boolean}){
 return <div className={'blueprint-shell'+(compact?' compact':'')} aria-hidden="true">
  <svg className="blueprint-map" viewBox="0 0 360 270" fill="none" xmlns="http://www.w3.org/2000/svg">
   <defs>
    <pattern id="blueprint-dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="#78c9e8" opacity=".55"/></pattern>
    <linearGradient id="room-a" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d4f6ff"/><stop offset="1" stopColor="#bceaf7"/></linearGradient>
    <linearGradient id="room-b" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffe2f0"/><stop offset="1" stopColor="#ffcce3"/></linearGradient>
   </defs>
   <rect x="8" y="8" width="344" height="254" rx="22" fill="#fff" stroke="#c2e5f2" strokeWidth="2"/>
   <rect x="12" y="12" width="336" height="246" rx="19" fill="url(#blueprint-dots)"/>
   <g stroke="#264455" strokeWidth="5" strokeLinejoin="round">
    <rect x="43" y="34" width="142" height="115" rx="4" fill="url(#room-a)"/>
    <rect x="185" y="34" width="130" height="115" rx="4" fill="url(#room-b)"/>
    <rect x="43" y="149" width="164" height="81" rx="4" fill="#f5fcff"/>
    <rect x="207" y="149" width="108" height="81" rx="4" fill="#eaf9fb"/>
   </g>
   <path d="M165 149v-28m0 0a28 28 0 0 0 28 28M237 149v22m0 0a22 22 0 0 0-22-22" stroke="#ff499b" strokeWidth="3" strokeDasharray="5 4" strokeLinecap="round"/>
   <rect x="57" y="50" width="35" height="54" rx="5" fill="#fff" stroke="#278cb2" strokeWidth="3"/>
   <path d="M57 76h35m-29-16v9m0 13v9" stroke="#278cb2" strokeWidth="3" strokeLinecap="round"/>
   <rect x="106" y="54" width="57" height="36" rx="6" fill="#8cddf2" stroke="#278cb2" strokeWidth="3"/>
   <circle cx="120" cy="68" r="7" fill="#effdff"/><circle cx="148" cy="68" r="7" fill="#effdff"/>
   <rect x="207" y="55" width="86" height="58" rx="8" fill="#ff85bb" stroke="#c6347b" strokeWidth="3"/>
   <rect x="216" y="66" width="67" height="19" rx="5" fill="#ffe8f2"/>
   <rect x="58" y="169" width="76" height="43" rx="7" fill="#9cdeee" stroke="#378eab" strokeWidth="3"/>
   <rect x="151" y="174" width="39" height="33" rx="3" fill="#fff" stroke="#378eab" strokeWidth="3"/>
   <rect x="226" y="171" width="63" height="29" rx="5" fill="#bbf0f9" stroke="#378eab" strokeWidth="3"/>
   <g fill="#ff4fa3" stroke="#fff" strokeWidth="3"><circle cx="98" cy="45" r="9"/><circle cx="295" cy="105" r="9"/><circle cx="181" cy="197" r="9"/></g>
  </svg>
  <div className="blueprint-floating-icon icon-one"><Brain size={17}/></div>
  <div className="blueprint-floating-icon icon-two"><Lightbulb size={17}/></div>
  <div className="blueprint-floating-icon icon-three"><Layers3 size={16}/></div>
  {!compact&&<div className="blueprint-note"><BookOpen size={14}/> Your thoughts, placed in space</div>}
 </div>
}
