"use client";
import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import type { Flashcard, Task } from '../lib/learning/types';
export function CardDetails({ card }: { card: Flashcard }) {
  return <div className="card-details">
    {card.example && <p lang="de" className="card-example">{card.example}</p>}
    {card.translation && <p className="muted">{card.translation}</p>}
    {card.plural && <p><strong>Plural:</strong> {card.plural}</p>}
    {card.note && <p>{card.note}</p>}
    {card.forms.length > 0 && <details open={card.kind==='noun'}>
      <summary>{card.kind==='verb'?'Present-tense forms':'Cases · singular and plural'}</summary>
      <dl className="card-forms">{card.forms.map(f=><div key={f.label}><dt>{f.label}</dt><dd lang="de">{f.value}</dd></div>)}</dl>
    </details>}
    {card.source && <a className="small text-button" href={card.source} target="_blank" rel="noreferrer">{card.kind==='case'?'Grammar reference · IDS':'Vocabulary reference · Goethe'}</a>}
  </div>;
}
export function RecallCard({ task, busy, pending, onFlip, onRate }: {
  task: Task; busy: boolean; pending: boolean; onFlip:()=>void;
  onRate:(rating:'again'|'hard'|'good'|'easy')=>void;
}) {
  const [back,setBack]=useState(!!task.revealed);
  useEffect(()=>setBack(!!task.revealed),[task.revealed]);
  const card=task.flashcard;
  return <div className="recall-player">
    <p className="muted small">{task.cardId?.startsWith('case-')?'Cases · recall the missing form':task.cardId?.endsWith(':en')?'English → German · existing reverse card':'German → English'}{task.supports.includes('initial teaching')?' · New card':''}{task.repair?' · Another look':''}</p>
    <button type="button" className={`flip-card ${back?'is-turned':''}`} disabled={busy || pending}
      aria-label={back?'Show card front':'Flip card to reveal meaning'} aria-pressed={back}
      onClick={()=>{if(task.revealed) setBack(!back); else onFlip();}}>
      <span className="eyebrow">{back ? (card?.level ?? 'Answer') : 'Recall first'}</span>
      <span className="card-word" lang={!back && task.skill==='recognition'?'de':undefined}>
        {back ? (task.cardId?.endsWith(':en')?card?.german:card?.english) : task.prompt}
      </span>
      {back && <span lang="de" className="card-original">{card?.german}</span>}
      <span className="card-flip-hint"><RotateCcw size={16}/>{busy?'Opening…':back?'Tap to see the front':'Think of the answer, then tap to flip'}</span>
    </button>
    <div className="flash-ratings" aria-label="Rate your flashcard recall">
      {([['again','Again','Forgot'],['hard','Hard','Remembered with effort'],['good','Good','Remembered'],['easy','Easy','Immediate recall']] as const).map(([rating,title,hint])=>
        <button key={rating} disabled={!back || !task.revealed || busy || pending} onClick={()=>onRate(rating)}><strong>{title}</strong><small>{hint}</small></button>)}
    </div>
    <p className="small muted">{back?'Choose how well you remembered before flipping. Each rating saves and advances.':'Flip to unlock the ratings. No typing needed.'}</p>
    {back && card && <CardDetails card={card}/>}
    <p className="recall-save-note small muted">Your position is saved. Leave before rating and you’ll return to this card. Ratings are self-reported recall, separate from checked answers.</p>
  </div>;
}
