"use client";
import {useDialogFocus} from "@/hooks/useDialogFocus";
import {screenings,type Film,type Screening} from "@/data/films";
import {formatTime} from "@/lib/booking";
import {FilmArtwork} from "./FilmArtwork";

export function FilmDetail({film,onClose,onScreening}:{film:Film;onClose:()=>void;onScreening:(screening:Screening)=>void}){
  const dialogRef=useDialogFocus(onClose);
  const next=screenings.filter(screening=>screening.filmId===film.id).slice(0,5);
  return <div className="overlay" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}><section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="film-dialog-title" className="film-dialog"><button type="button" className="icon-button film-dialog__close" onClick={onClose} aria-label="Close film details">×</button><div className="film-dialog__art"><FilmArtwork film={film}/></div><div className="film-dialog__copy"><span className="eyebrow">NOW SHOWING · {film.year}</span><h2 id="film-dialog-title">{film.title}</h2><p className="film-dialog__tagline">{film.subtitle}</p><div className="film-dialog__facts"><span>{film.genre}</span><span>{film.runtime} min</span><span>{film.rating}</span></div><p className="film-dialog__synopsis">{film.synopsis}</p><p className="film-dialog__director">Directed by <strong>{film.director}</strong></p><h3>Upcoming screenings</h3><div className="detail-screenings">{next.map(screening=><button type="button" key={screening.id} onClick={()=>onScreening(screening)}><span>{new Date(`${screening.day}T12:00:00`).toLocaleDateString("en-CA",{weekday:"short",month:"short",day:"numeric"})}</span><strong>{formatTime(screening.time)}</strong><small>{screening.format} · {screening.room}</small><span aria-hidden="true">↗</span></button>)}</div></div></section></div>;
}
