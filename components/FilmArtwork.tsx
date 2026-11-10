import type { Film } from "@/data/films";

export function FilmArtwork({film,hero=false}:{film:Film;hero?:boolean}){
  return <div className={`film-art film-art--${film.motif}${hero?" film-art--hero":""}`} style={{"--poster-base":film.palette,"--poster-accent":film.accent} as React.CSSProperties} role="img" aria-label={`Original abstract artwork for ${film.title}`}>
    <div className="film-art__grain" aria-hidden="true"/>
    <div className="film-art__shape film-art__shape--one" aria-hidden="true"/>
    <div className="film-art__shape film-art__shape--two" aria-hidden="true"/>
    <div className="film-art__shape film-art__shape--three" aria-hidden="true"/>
    <div className="film-art__top"><span>VELVET FRAME <span className="film-art__dot">✦</span> ORIGINALS</span><span>{film.year}</span></div>
    <div className="film-art__bottom"><span>{film.label}</span><strong>{film.title}</strong><em>{film.subtitle}</em></div>
  </div>;
}
