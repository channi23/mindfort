import { useId } from 'react'

type LogoProps={size?:number;className?:string;decorative?:boolean}

/** Six circles form a distinctive, directional memory-map triangle. No emoji, gradients, or shield symbols. */
export function MindfortMark({size=36,className='',decorative=false}:LogoProps){
 const titleId=useId()
 return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} role={decorative?'presentation':'img'} aria-hidden={decorative||undefined} aria-labelledby={decorative?undefined:titleId}>
  {!decorative&&<title id={titleId}>Mindfort</title>}
  <circle cx="24" cy="9" r="5.25" fill="#FA4C98"/>
  <circle cx="16.25" cy="23" r="5.25" fill="#35B6DD"/>
  <circle cx="31.75" cy="23" r="5.25" fill="#35B6DD"/>
  <circle cx="8.5" cy="37" r="5.25" fill="#35B6DD"/>
  <circle cx="24" cy="37" r="5.25" fill="#FA4C98"/>
  <circle cx="39.5" cy="37" r="5.25" fill="#35B6DD"/>
 </svg>
}
