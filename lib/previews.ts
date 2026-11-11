import type {TicketMix} from './booking';
import {allSeats} from './booking';
import {getScreening} from '../data/films';
export type SavedPreview={id:string;screeningId:string;seats:string[];tickets:TicketMix;name:string;createdAt:string};
const key='velvet-frame-previews-v1';
export function readPreviews():SavedPreview[]{
  if(typeof window==='undefined')return [];
  try{const raw=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(raw))return[];return raw.filter(isPreview).slice(0,12);}catch{return[];}
}
function isPreview(value:unknown):value is SavedPreview{
  if(!value||typeof value!=='object')return false;
  const item=value as Partial<SavedPreview>;
  return typeof item.id==='string'&&typeof item.screeningId==='string'&&Boolean(getScreening(item.screeningId))&&Array.isArray(item.seats)&&item.seats.length>0&&item.seats.length<=6&&item.seats.every(seat=>typeof seat==='string'&&allSeats.includes(seat))&&typeof item.name==='string'&&typeof item.createdAt==='string'&&Boolean(item.tickets)&&typeof item.tickets?.adult==='number'&&typeof item.tickets?.student==='number'&&typeof item.tickets?.senior==='number';
}
export function savePreview(item:SavedPreview):SavedPreview[]{
  const next=[item,...readPreviews()].slice(0,12);
  try{localStorage.setItem(key,JSON.stringify(next));}catch{}
  return next;
}
export function removePreview(id:string):SavedPreview[]{
  const next=readPreviews().filter(item=>item.id!==id);
  try{localStorage.setItem(key,JSON.stringify(next));}catch{}
  return next;
}
