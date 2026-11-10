"use client";
import {useMemo,useState} from "react";
import {days,films,screenings,type Film,type Screening} from "@/data/films";
import {formatTime} from "@/lib/booking";
import {FilmCard} from "./FilmCard";

const genres=["All films","Drama","Documentary","Mystery","Animation"] as const;
export function Programme({onFilm,onScreening}:{onFilm:(film:Film)=>void;onScreening:(screening:Screening)=>void}){
  const [genre,setGenre]=useState<(typeof genres)[number]>("All films");
  const [query,setQuery]=useState("");
  const [day,setDay]=useState<string>(days[0].id);
  const visible=useMemo(()=>films.filter(film=>(genre==="All films"||film.genre===genre)&&`${film.title} ${film.director} ${film.genre}`.toLowerCase().includes(query.trim().toLowerCase())),[genre,query]);
  const dayScreenings=screenings.filter(screening=>screening.day===day);
  return <section className="section programme" id="programme" aria-labelledby="programme-heading">
    <div className="section-heading"><div><span className="eyebrow">01 / THE PROGRAMME</span><h2 id="programme-heading">Stories worth <em>stepping into.</em></h2></div><p>Six original stories, five days on the calendar. Find the film that stays with you.</p></div>
    <div className="programme-tools"><div className="genre-tabs" role="group" aria-label="Filter by genre">{genres.map(item=><button key={item} type="button" className={genre===item?"active":""} aria-pressed={genre===item} onClick={()=>setGenre(item)}>{item}</button>)}</div><label className="search-field"><span className="sr-only">Search films</span><span aria-hidden="true">⌕</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search films or directors" type="search" /></label></div>
    {visible.length?<div className="film-grid">{visible.map(film=><FilmCard key={film.id} film={film} onSelect={()=>onFilm(film)}/>)}</div>:<div className="empty-state"><span aria-hidden="true">✳</span><h3>No films found</h3><p>Try a different title, director or genre.</p><button type="button" className="button button--dark" onClick={()=>{setQuery("");setGenre("All films");}}>Show all films</button></div>}
    <div className="showtimes" id="showtimes"><div className="section-heading section-heading--compact"><div><span className="eyebrow">02 / MAKE A DATE</span><h2>Choose your <em>moment.</em></h2></div><p>Intimate screenings, generous seats, and the best kind of plans.</p></div>
      <div className="date-row" role="group" aria-label="Choose a screening date">{days.map(item=><button type="button" key={item.id} className={`date-pill ${day===item.id?"active":""}`} aria-pressed={day===item.id} onClick={()=>setDay(item.id)}><span>{item.weekday}</span><strong>{item.date}</strong><small>NOV</small></button>)}</div>
      <div className="screening-list">{dayScreenings.filter(screening=>!query||visible.some(film=>film.id===screening.filmId)).map(screening=>{const film=films.find(item=>item.id===screening.filmId)!;return <article className="screening-row" key={screening.id}><div className="screening-row__time"><strong>{formatTime(screening.time)}</strong><span>{screening.format}</span></div><div className="screening-row__film"><h3>{film.title}</h3><p>{film.genre} · {film.runtime} min · {screening.room}</p></div><div className="screening-row__action">{screening.lowAvailability&&<span className="small-alert">Filling up</span>}<button className="button button--outline" type="button" onClick={()=>onScreening(screening)}>Choose seats <span aria-hidden="true">↗</span></button></div></article>;})}</div>
    </div>
  </section>;
}
