"use client";
import {useState} from "react";
import {films,screenings,type Film,type Screening} from "@/data/films";
import {FilmArtwork} from "./FilmArtwork";
import {FilmDetail} from "./FilmDetail";
import {Programme} from "./Programme";
import {SeatPicker} from "./SeatPicker";

export function CinemaApp(){
  const [film,setFilm]=useState<Film|null>(null);
  const [screening,setScreening]=useState<Screening|null>(null);
  const feature=films[0];
  function openScreening(next:Screening){setFilm(null);setScreening(next);}
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div id="top" className="site-shell"><header className="site-header"><a className="brand" href="#top" aria-label="Velvet Frame, back to top"><span className="brand__symbol" aria-hidden="true">✳</span><span>VELVET<br/>FRAME</span></a><nav className="primary-nav" aria-label="Main navigation"><a href="#programme">Films</a><a href="#showtimes">Showtimes</a><a href="#visit">The cinema</a></nav><a className="header-cta" href="#showtimes">Plan a night <span aria-hidden="true">↗</span></a></header>
    <main id="main"><section className="hero" aria-labelledby="hero-title"><div className="hero__copy"><div className="hero__eyebrow"><span className="live-dot"/> INDEPENDENT CINEMA · TORONTO</div><p className="hero__index">AN EVENING ELSEWHERE / 001</p><h1 id="hero-title">A little more <em>wonder</em> in your week.</h1><p className="hero__intro">Good films deserve a beautiful night out. Discover considered stories, find your screening, and compose the perfect seat.</p><div className="hero__actions"><a className="button button--coral" href="#programme">Explore the programme <span aria-hidden="true">↗</span></a><button type="button" className="text-link text-link--light" onClick={()=>setFilm(feature)}>Meet the featured film <span aria-hidden="true">→</span></button></div><div className="hero__foot"><span>NOW SHOWING</span><strong>06 original stories</strong><span className="hero__foot-line"/><span>12 — 16 NOV</span></div></div><div className="hero__visual"><FilmArtwork film={feature} hero/><div className="hero__caption"><span>FEATURE 01 / 06</span><strong>The Stillwater Hour</strong><button type="button" onClick={()=>openScreening(screenings.find(item=>item.filmId===feature.id)!)}>Find a seat <span aria-hidden="true">↗</span></button></div></div></section>
    <div className="marquee" aria-hidden="true"><span>STORIES THAT STAY WITH YOU</span><span>✳</span><span>THE ART OF GOING OUT</span><span>✳</span><span>STORIES THAT STAY WITH YOU</span><span>✳</span></div>
    <Programme onFilm={setFilm} onScreening={openScreening}/>
    <section className="visit" id="visit" aria-labelledby="visit-heading"><div className="visit__badge">✳</div><div><span className="eyebrow">03 / THE EXPERIENCE</span><h2 id="visit-heading">Stay for the <em>afterglow.</em></h2><p>Velvet Frame is an imagined independent cinema experience: thoughtful programming, an intimate room, and a little time to linger. All screenings and seats shown here are illustrative.</p><a href="#showtimes" className="button button--cream">Find your screening <span aria-hidden="true">↗</span></a></div><div className="visit__details"><div><span>THE GRAND</span><strong>Wide screen. Warm lights.</strong><p>Room for the stories that need a little more space.</p></div><div><span>THE STUDIO</span><strong>Closer to the story.</strong><p>An intimate setting for films worth leaning into.</p></div><div><span>ACCESS</span><strong>Everyone belongs.</strong><p>Step-free access and assistive listening at every show.</p></div></div></section>
    </main><footer className="site-footer"><a className="brand brand--footer" href="#top"><span className="brand__symbol" aria-hidden="true">✳</span><span>VELVET<br/>FRAME</span></a><p>A cinema night, composed. An original illustrative portfolio experience.</p><a href="#top">Back to top ↑</a></footer></div>
    {film&&<FilmDetail film={film} onClose={()=>setFilm(null)} onScreening={openScreening}/ >}
    {screening&&<SeatPicker key={screening.id} screening={screening} onClose={()=>setScreening(null)}/ >}
  </>;
}
