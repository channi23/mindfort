import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react'

/** Locally adapted Magic UI Magic Card spotlight primitive. */
export function MagicCard({children,className='',style}:{children:ReactNode;className?:string;style?:CSSProperties}){
 const ref=useRef<HTMLDivElement>(null)
 const track=(e:PointerEvent<HTMLDivElement>)=>{
  const r=ref.current?.getBoundingClientRect()
  if(!r)return
  ref.current?.style.setProperty('--magic-x',`${e.clientX-r.left}px`)
  ref.current?.style.setProperty('--magic-y',`${e.clientY-r.top}px`)
 }
 return <div ref={ref} className={'magic-card '+className} style={style} onPointerMove={track}><div className="magic-card-sheen" aria-hidden="true"/>{children}</div>
}
