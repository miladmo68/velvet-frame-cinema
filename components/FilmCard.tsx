import type { Film } from "@/data/films";
import { FilmArtwork } from "./FilmArtwork";

export function FilmCard({film,onSelect}:{film:Film;onSelect:(id:string)=>void}){
  return <article className="film-card">
    <button className="film-card__art" type="button" onClick={()=>onSelect(film.id)} aria-label={`Explore ${film.title}`}><FilmArtwork film={film}/></button>
    <div className="film-card__body"><div className="film-card__meta"><span>{film.genre}</span><span>{film.runtime} MIN</span></div><h3>{film.title}</h3><p>{film.subtitle}</p><button className="text-link" type="button" onClick={()=>onSelect(film.id)}>Explore film <span aria-hidden="true">↗</span></button></div>
  </article>;
}
