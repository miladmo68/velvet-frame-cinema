import type { Screening } from "../data/films";
export type TicketKind="adult"|"student"|"senior";
export type TicketMix=Record<TicketKind,number>;
export type BookingPreview={screeningId:string;seats:string[];tickets:TicketMix;name:string;email:string;createdAt:string};
export const ticketPrices:Record<TicketKind,number>={adult:18,student:14,senior:15};
export const emptyMix:TicketMix={adult:0,student:0,senior:0};
export const seatRows=["A","B","C","D","E","F"] as const;
export const seatNumbers=[1,2,3,4,5,6,7,8] as const;
export const accessibleSeats=["A1","A8"];
export const companionSeats=["A2","A7"];
export const allSeats=seatRows.flatMap(row=>seatNumbers.map(number=>`${row}${number}`));
export function seatStatus(screening:Screening,seat:string):"occupied"|"accessible"|"companion"|"available"{if(screening.occupied.includes(seat))return"occupied";if(accessibleSeats.includes(seat))return"accessible";if(companionSeats.includes(seat))return"companion";return"available";}
export function toggleSeat(selected:string[],seat:string,screening:Screening):string[]{if(!allSeats.includes(seat)||seatStatus(screening,seat)==="occupied")return selected;if(selected.includes(seat))return selected.filter(item=>item!==seat);if(selected.length>=6)return selected;return[...selected,seat].sort((a,b)=>allSeats.indexOf(a)-allSeats.indexOf(b));}
export function ticketCount(mix:TicketMix):number{return Object.values(mix).reduce((total,n)=>total+n,0);}
export function ticketTotal(mix:TicketMix):number{return(Object.keys(ticketPrices) as TicketKind[]).reduce((total,kind)=>total+mix[kind]*ticketPrices[kind],0);}
export function updateTicket(mix:TicketMix,kind:TicketKind,delta:number,max:number):TicketMix{const next=Math.max(0,Math.min(6,mix[kind]+delta));const result={...mix,[kind]:next};return ticketCount(result)>max?mix:result;}
export function bookingError(screening:Screening|undefined,seats:string[],mix:TicketMix,name:string,email:string):string|null{if(!screening)return"Choose a screening first.";if(seats.length===0)return"Choose at least one seat.";if(seats.length>6)return"Choose no more than six seats.";if(seats.some(seat=>!allSeats.includes(seat)||screening.occupied.includes(seat)))return"One or more seats are unavailable. Please choose again.";if(ticketCount(mix)!==seats.length)return"Add one ticket for each selected seat.";if(name.trim().length<2)return"Enter your name to label this preview.";if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))return"Enter a valid email address.";return null;}
export function formatMoney(value:number):string{return new Intl.NumberFormat("en-CA",{style:"currency",currency:"CAD",maximumFractionDigits:0}).format(value);}
export function formatTime(time:string):string{const[h,m]=time.split(":").map(Number);return`${h%12||12}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`;}
