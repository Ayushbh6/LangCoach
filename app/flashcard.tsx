'use client';
import { Check } from 'lucide-react';
import { levels, type Card } from '../data/vocabulary';
export default function Flashcard({current,direction,flipped,onFlip,disabled=false,review=false,practice=false}:{current:Card;direction:'de'|'en';flipped:boolean;onFlip:()=>void;disabled?:boolean;review?:boolean;practice?:boolean}) {
 return <div className="flashcard-wrap">
  <button className="flashcard" aria-label={flipped?'Hide answer':'Reveal answer'} aria-pressed={flipped} onClick={onFlip} disabled={disabled}>
   {flipped ? (
        <span className="card-face card-back">
         <span className="card-top"><span>{current.kind==='case'?'THE ANSWER':direction==='de'?'ENGLISH':'GERMAN'}</span><Check size={20}/></span>
         <span className="answer-center"><span className={`answer-word ${current.kind==='case'?'case-answer':''}`} lang={direction==='en'||current.kind==='case'?'de':'en'}>{current.kind==='case'||direction==='de'?current.english:current.german}</span><span className="answer-original" lang="de">{current.kind==='case'?current.german.replace('___',current.english).replace(/\s*\(my\)/,''):direction==='de'?current.german:current.english}</span>{current.plural&&<span className="plural-note">Plural: <strong lang="de">{current.plural}</strong></span>}{current.note&&<span className="grammar-note">{current.note}</span>}{current.example&&<span className="example-sentence" lang="de">{current.example}</span>}{current.translation&&<span className="sentence-translation">{current.translation}</span>}</span>
         <span className="card-bottom"><span>{practice?'Read it, then recall it again.':'How well did you remember?'}</span><span>Tap to hide</span></span>
        </span>
   ) : (
        <span className="card-face card-front">
         <span className="card-top"><span>{current.kind==='case'?current.topic:`${levels.find(l=>l.value===current.cefr)?.label.toUpperCase()} / ${current.topic.toUpperCase()}`}</span><span>{practice?'REPEAT PRACTICE':review?'REVIEW':'NEW CARD'}</span></span>
         <span className="card-center"><span className="language-label">{current.kind==='case'?'FILL THE GAP':direction==='de'?'GERMAN':'ENGLISH'}</span>{current.kind==='case'?<span className="case-sentence" lang="de">{current.german}</span>:direction==='de'&&current.kind==='noun'?<span className="german-word" lang="de"><span className="article">{current.german.split(' ')[0]}</span>{current.german.slice(current.german.indexOf(' ')+1)}</span>:<span className="german-word" lang={direction==='de'?'de':'en'}>{direction==='de'?current.german:current.english}</span>}</span>
         <span className="card-bottom"><span>{current.kind==='case'?'Which ending belongs here?':'Say it in your head first.'}</span><span>Tap to reveal <span className="mini-key">↵</span></span></span>
        </span>
   )}
  </button>
 </div>;
}
