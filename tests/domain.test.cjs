const test=require('node:test');
const assert=require('node:assert/strict');
const {films,screenings,days}=require('../.test-dist/data/films.js');
const {allSeats,seatStatus,toggleSeat,ticketCount,ticketTotal,updateTicket,bookingError}=require('../.test-dist/lib/booking.js');

test('programme has coherent screenings for every film and day',()=>{
  assert.equal(films.length,6);assert.equal(days.length,5);
  for(const screening of screenings){assert.ok(films.some(film=>film.id===screening.filmId));assert.ok(days.some(day=>day.id===screening.day));assert.equal(new Set(screening.occupied).size,screening.occupied.length);assert.ok(screening.occupied.every(seat=>allSeats.includes(seat)));}
  for(const film of films)assert.ok(screenings.some(screening=>screening.filmId===film.id));
});

test('occupied seats cannot be selected and a group is capped at six',()=>{
  const screening=screenings[0];const taken=screening.occupied[0];assert.equal(seatStatus(screening,taken),'occupied');assert.deepEqual(toggleSeat([],taken,screening),[]);
  let selected=[];for(const seat of allSeats.filter(seat=>!screening.occupied.includes(seat)).slice(0,7))selected=toggleSeat(selected,seat,screening);
  assert.equal(selected.length,6);assert.equal(toggleSeat(selected,selected[0],screening).length,5);
});

test('ticket mix follows seat count and computes a deterministic CAD total',()=>{
  let mix={adult:0,student:0,senior:0};mix=updateTicket(mix,'adult',1,2);mix=updateTicket(mix,'student',1,2);mix=updateTicket(mix,'senior',1,2);
  assert.equal(ticketCount(mix),2);assert.equal(ticketTotal(mix),32);assert.equal(mix.senior,0);
});

test('preview validation checks seat inventory, ticket count and contact fields',()=>{
  const screening=screenings[0];const seat=allSeats.find(item=>!screening.occupied.includes(item));const mix={adult:1,student:0,senior:0};
  assert.equal(bookingError(screening,[seat],mix,'Milad Mohammadi','milad@example.com'),null);
  assert.match(bookingError(screening,[],mix,'Milad Mohammadi','milad@example.com'),/seat/);
  assert.match(bookingError(screening,[seat],{adult:0,student:0,senior:0},'Milad Mohammadi','milad@example.com'),/ticket/);
  assert.match(bookingError(screening,[seat],mix,'M','milad@example.com'),/name/);
  assert.match(bookingError(screening,[seat],mix,'Milad Mohammadi','invalid'),/email/);
});

const {readPreviews,savePreview,removePreview}=require('../.test-dist/lib/previews.js');
test('local previews recover from malformed storage and can be removed',()=>{
  const oldWindow=global.window,oldStorage=global.localStorage;
  const store=new Map();global.window={};global.localStorage={getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value)};
  try{store.set('velvet-frame-previews-v1','not json');assert.deepEqual(readPreviews(),[]);
    const preview={id:'test-1',screeningId:screenings[0].id,seats:[allSeats.find(seat=>!screenings[0].occupied.includes(seat))],tickets:{adult:1,student:0,senior:0},name:'Alex Rivera',createdAt:'2026-11-11T12:00:00.000Z'};
    assert.equal(savePreview(preview).length,1);assert.equal(readPreviews()[0].name,'Alex Rivera');assert.deepEqual(removePreview('test-1'),[]);
  }finally{global.window=oldWindow;global.localStorage=oldStorage;}
});
