"use client";
import {useEffect,useRef} from "react";

const focusable='button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
export function useDialogFocus(onClose:()=>void){
  const dialogRef=useRef<HTMLElement>(null);
  const onCloseRef=useRef(onClose);
  onCloseRef.current=onClose;
  useEffect(()=>{
    const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const dialog=dialogRef.current;
    dialog?.querySelector<HTMLElement>(focusable)?.focus();
    const onKey=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){event.preventDefault();onCloseRef.current();return;}
      if(event.key!=='Tab'||!dialog)return;
      const controls=Array.from(dialog.querySelectorAll<HTMLElement>(focusable)).filter(el=>el.getClientRects().length>0);
      if(!controls.length)return;
      const first=controls[0],last=controls[controls.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    };
    document.addEventListener('keydown',onKey);
    return()=>{document.removeEventListener('keydown',onKey);previous?.focus();};
  },[]);
  return dialogRef;
}
