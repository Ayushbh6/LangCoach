'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import type { Card } from '../data/vocabulary';
import type { Progress } from '../lib/scheduler';
import { AUTO_ROUNDS, repeatOrder, selectRepeatCards } from '../lib/repeat-session';
import Flashcard from './flashcard';
import StudySelect from './study-select';
const speeds=[{label:'Quick',question:5,answer:4},{label:'Steady',question:8,answer:6},{label:'Gentle',question:12,answer:8}];
type Session={cards:Card[];round:number;index:number;phase:'question'|'answer';completed:number;done:boolean};
export default function AutoRepeat({pool,direction,progress,reviews,ready,pausedExternally,onSpeak}:{pool:Card[];direction:'de'|'en';progress:Record<string,Progress>;reviews:{card_id:string}[];ready:boolean;pausedExternally:boolean;onSpeak:(c:Card)=>void}){
 const [session,setSession]=useState<Session|null>(null),[running,setRunning]=useState(false),[seconds,setSeconds]=useState(8),[speed,setSpeed]=useState(1);
 const preview=useMemo(()=>{
  const now=Date.now(),suffix=`:${direction}`;
  const due=pool.filter(c=>progress[c.id+suffix]?.due<=now).sort((a,b)=>progress[a.id+suffix].due-progress[b.id+suffix].due).map(c=>c.id);
  const today=reviews.filter(r=>r.card_id.endsWith(suffix)).map(r=>r.card_id.slice(0,-suffix.length));
  const unseen=pool.filter(c=>!progress[c.id+suffix]).map(c=>c.id);
  return selectRepeatCards(pool,due,today,unseen);
 },[pool,progress,reviews,direction]);
 const current=session&&!session.done?repeatOrder(session.cards,session.round)[session.index]:undefined;
 const reveal=useCallback(()=>{setSession(s=>s?{...s,phase:s.phase==='question'?'answer':'question'}:s);setSeconds(session?.phase==='question'?speeds[speed].answer:speeds[speed].question);},[session?.phase,speed]);
 const advance=useCallback(()=>{
  setSession(s=>{
   if(!s||s.done)return s;
   const completed=s.completed+1,next=s.index+1;
   if(next<s.cards.length)return {...s,index:next,phase:'question',completed};
   if(s.round+1<AUTO_ROUNDS)return {...s,round:s.round+1,index:0,phase:'question',completed};
   return {...s,done:true,completed};
  });setSeconds(speeds[speed].question);
 },[speed]);
 function start(){setSession({cards:preview,round:0,index:0,phase:'question',completed:0,done:false});setSeconds(speeds[speed].question);setRunning(true);}
 useEffect(()=>{
  const hide=()=>{if(document.hidden)setRunning(false);};document.addEventListener('visibilitychange',hide);
  return()=>document.removeEventListener('visibilitychange',hide);
 },[]);
 useEffect(()=>{if(pausedExternally)setRunning(false);},[pausedExternally]);
 useEffect(()=>{
  if(!running||!session||session.done||pausedExternally)return;
  const timer=setTimeout(()=>{
   if(document.hidden){setRunning(false);return;}
   if(seconds>1)setSeconds(s=>s-1);
   else if(session.phase==='question')reveal();else advance();
  },1000);
  return()=>clearTimeout(timer);
 },[running,session,seconds,reveal,advance,pausedExternally]);
 useEffect(()=>{if(session?.done)setRunning(false);},[session?.done]);
 useEffect(()=>{
  function key(e:KeyboardEvent){if(e.defaultPrevented||(e.target instanceof HTMLElement&&e.target.closest('[role="listbox"],[role="combobox"]'))||pausedExternally||e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement||e.target instanceof HTMLButtonElement)return;if(e.code==='Space'&&session&&!session.done){e.preventDefault();setRunning(r=>!r);}}
  window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
 },[session,pausedExternally]);
 if(!session)return <div className="auto-setup"><div className="auto-symbol"><RotateCcw size={30}/></div><p className="eyebrow">LOOK. RECALL. REPEAT.</p><h2>Let the cards come to you.</h2><p>Today’s cards, repeated through three rounds. Take a moment to recall, then the answer reveals itself.</p><StudySelect className="auto-pace" label="Pace" value={String(speed)} onChange={v=>setSpeed(Number(v))} options={speeds.map((s,i)=>({value:String(i),label:s.label,description:`${s.question}s to recall · ${s.answer}s to read`}))}/><button className="primary auto-start" onClick={start} disabled={!ready||!preview.length}><Play size={17}/>Start auto repeat</button><span className="auto-summary">{preview.length} card{preview.length===1?'':'s'} · {AUTO_ROUNDS} rounds · about {Math.max(1,Math.round(preview.length*AUTO_ROUNDS*(speeds[speed].question+speeds[speed].answer)/60))} min</span><small>Practice only. Your saved recall ratings stay in your hands.</small>{!preview.length&&ready&&<p>No new, due, or reviewed-today cards in this selection. Choose another level or topic.</p>}</div>;
 if(session.done)return <div className="card-status auto-finished"><span className="finish-star">✦</span><p className="eyebrow">THREE ROUNDS, ALL DONE</p><h2>You’ve spent time with {session.cards.length} card{session.cards.length===1?'':'s'}.</h2><p>{session.completed} repetitions completed. Switch to Rated recall when you’re ready to test your memory.</p><button className="primary" onClick={()=>{setSession(null);setRunning(false);}}>Set up another session</button></div>;
 if(!current)return null;
 return <div className="auto-session"><div className="auto-session-meta"><span>Round {session.round+1} / {AUTO_ROUNDS}</span><span>Card {session.index+1} / {session.cards.length}</span><span className="auto-timer" role="timer">{running?`${session.phase==='question'?'Reveal':'Next'} in ${seconds}s`:'Paused'}</span></div><Flashcard key={`${session.round}:${session.index}:${current.id}`} current={current} direction={direction} flipped={session.phase==='answer'} onFlip={reveal} practice/><div className="auto-controls"><button className="auto-pause" onClick={()=>setRunning(r=>!r)}>{running?<Pause size={17}/>:<Play size={17}/>} {running?'Pause':'Resume'}</button><button onClick={session.phase==='question'?reveal:advance}>{session.phase==='question'?'Reveal now':'Next card'}</button><button aria-label="Hear this card" onClick={()=>{setRunning(false);onSpeak(current);}} disabled={current.kind==='case'&&session.phase==='question'}><Volume2 size={17}/></button><button className="auto-stop" onClick={()=>{setSession(null);setRunning(false);}}>End session</button></div><div className="auto-meter" role="progressbar" aria-label="Automatic repetitions" aria-valuenow={session.completed} aria-valuemin={0} aria-valuemax={session.cards.length*AUTO_ROUNDS}><span style={{width:`${session.completed/(session.cards.length*AUTO_ROUNDS)*100}%`}}/></div><p className="auto-footnote">{session.completed} / {session.cards.length*AUTO_ROUNDS} repetitions · No ratings needed.<span className="auto-keyboard"> <kbd>space</kbd> pauses.</span></p></div>;
}
