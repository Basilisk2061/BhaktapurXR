'use client';
import {useRef,type ButtonHTMLAttributes} from 'react';
import {createPointerTap} from './gameplay-ui-pointer';
/** Shared exactly-once pointer path, with native keyboard/assistive click fallback. */
export function PointerActionButton({action,...props}:Omit<ButtonHTMLAttributes<HTMLButtonElement>,'onClick'|'onPointerDown'|'onPointerUp'|'onPointerMove'|'onPointerCancel'|'onLostPointerCapture'|'onKeyDown'> & {action:()=>void}){
 const latest=useRef(action);latest.current=action;
 const tap=useRef<ReturnType<typeof createPointerTap>|null>(null);tap.current??=createPointerTap(()=>latest.current());
 return <button {...props} data-gameplay-ui type={props.type??'button'} {...tap.current}/>;
}
