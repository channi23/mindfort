import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/** Locally adapted Magic UI Blur Fade primitive; reduced-motion aware. */
export function BlurFade({children,className='',delay=0}:{children:ReactNode;className?:string;delay?:number}){
 const reduced=useReducedMotion()
 return <motion.div className={className} initial={reduced?false:{opacity:0,filter:'blur(7px)',y:14}} animate={{opacity:1,filter:'blur(0px)',y:0}} transition={{duration:0.55,delay,ease:[0.22,1,0.36,1]}}>{children}</motion.div>
}
