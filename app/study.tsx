'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeftRight, BookOpen, Check, ChevronRight, CircleHelp, Layers, LoaderCircle, Search, Sparkles, Volume2, X } from 'lucide-react';
import { vocabulary, topics, type Card } from '../data/vocabulary';
import { cases, articleTable } from '../data/cases';
import { intervalLabel, type Progress, type Rating } from '../lib/scheduler';
type Review = {card_id:string;rating:Rating;reviewed_at:number};
type View = 'words'|'cases'|'library';
const ratings: Rating[] = ['again','hard','good','easy'];
const dayKey = (n:number) => new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Vienna',year:'numeric',month:'2-digit',day:'2-digit'}).format(n);

export default function Study() {
 const [view,setView]=useState<View>('words'),[topic,setTopic]=useState('All topics'),[direction,setDirection]=useState<'de'|'en'>('de');
 const [progress,setProgress]=useState<Record<string,Progress>>({}),[reviews,setReviews]=useState<Review[]>([]);
 const [ready,setReady]=useState(false),[error,setError]=useState(''),[busy,setBusy]=useState(false),[flipped,setFlipped]=useState(false);
 const [newBudget,setNewBudget]=useState(20),[sessionCount,setSessionCount]=useState(0),[now,setNow]=useState(Date.now());
 const [query,setQuery]=useState(''),[guide,setGuide]=useState(false),[soundMessage,setSoundMessage]=useState('');
 const lock=useRef(false),pending=useRef<{cardId:string;rating:Rating;requestId:string;updatedAt:number}|null>(null);
 const load=useCallback(async()=>{
  setReady(false);setError('');
  try { const r=await fetch('/api/progress',{cache:'no-store'}); const data=await r.json() as {error?:string;progress:Progress[];reviews:Review[]}; if(!r.ok) throw Error(data.error); setProgress(Object.fromEntries(data.progress.map((p:Progress)=>[p.cardId,p])));setReviews(data.reviews);setReady(true); }
  catch(e) {setError(e instanceof Error?e.message:'Could not load your reviews.');}
 },[]);
 useEffect(()=>{void load();const timer=setInterval(()=>setNow(Date.now()),15000);return()=>clearInterval(timer);},[load]);
 const pool=useMemo(()=>view==='cases'?cases:topic==='All topics'?vocabulary:vocabulary.filter(c=>c.topic===topic),[view,topic]);
 const actualDirection=view==='cases'?'de':direction;
 const keyOf=useCallback((c:Card)=>`${c.id}:${actualDirection}`,[actualDirection]);
 const dueCards=useMemo(()=>pool.filter(c=>progress[keyOf(c)]?.due<=now).sort((a,b)=>progress[keyOf(a)].due-progress[keyOf(b)].due),[pool,progress,keyOf,now]);
 const newCards=useMemo(()=>pool.filter(c=>!progress[keyOf(c)]),[pool,progress,keyOf]);
 const current=dueCards[0]??(newBudget>0?newCards[0]:undefined),currentKey=current?keyOf(current):'';
 const previous=currentKey?progress[currentKey]:undefined;
 const nextDue=pool.map(c=>progress[keyOf(c)]?.due).filter((d):d is number=>!!d&&d>now).sort((a,b)=>a-b)[0];
 const todays=reviews.filter(r=>dayKey(r.reviewed_at)===dayKey(now));
 const reviewedWords=new Set(Object.values(progress).filter(p=>!p.cardId.startsWith('case-')).map(p=>p.cardId.split(':')[0])).size;
 const mastered=Object.values(progress).filter(p=>p.cardId.endsWith(`:${actualDirection}`)&&p.interval>=7&&!p.cardId.startsWith('case-')).length;
 const consecutive=useMemo(()=>{
  const dates=new Set(reviews.map(r=>dayKey(r.reviewed_at))); let count=0, n=now;
  if(!dates.has(dayKey(n))) n-=86400000;
  while(dates.has(dayKey(n))&&count<366){count++;n-=86400000;}return count;
 },[reviews,now]);
 useEffect(()=>{setFlipped(false);setSoundMessage('');},[currentKey]);
 function switchView(v:View) {if(lock.current||pending.current)return;setView(v);setTopic('All topics');setFlipped(false);setSessionCount(0);setNewBudget(20);}
 const rate=useCallback(async(rating:Rating)=>{
  if(!current||!flipped||lock.current||!ready)return;
  if(pending.current && (pending.current.cardId!==currentKey||pending.current.rating!==rating))return;
  lock.current=true;setBusy(true);setError('');
  const payload=pending.current??{cardId:currentKey,rating,requestId:crypto.randomUUID(),updatedAt:previous?.updatedAt??0};
  pending.current=payload;
  try {
   const r=await fetch('/api/progress',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
   const data=await r.json() as {error?:string;progress:Progress;review?:Review};if(!r.ok) { if(r.status===409){pending.current=null;await load();}throw Error(data.error); }
   setFlipped(false);
   setProgress(p=>({...p,[currentKey]:data.progress}));
   setReviews(rs=>data.review?[data.review,...rs]:rs);
   if(!previous)setNewBudget(n=>Math.max(0,n-1));
   setSessionCount(n=>n+1);setNow(Date.now());pending.current=null;
  }catch(e){setError(e instanceof Error?e.message:'Your review could not be saved.');}
  finally{setBusy(false);lock.current=false;}
 },[current,flipped,ready,currentKey,previous,load]);
 useEffect(()=>{
  const onKey=(e:KeyboardEvent)=>{
   if(guide||view==='library'||e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement||e.target instanceof HTMLButtonElement)return;
   if(e.code==='Space'){e.preventDefault();if(ready&&current&&!busy)setFlipped(v=>!v);}
   if(['1','2','3','4'].includes(e.key)&&flipped){e.preventDefault();void rate(ratings[Number(e.key)-1]);}
  };window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);
 },[guide,view,ready,current,busy,flipped,rate]);
 useEffect(()=>{
  if(guide){const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setGuide(false);};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);}
 },[guide]);
 function speak(c:Card) {
  if(!('speechSynthesis' in window)){setSoundMessage('Pronunciation is unavailable in this browser.');return;}
  speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(c.kind==='case'?c.german.replace('___',c.english).replace(/\s*\(my\)/,''):c.german);
  utterance.lang='de-DE';utterance.rate=.83;const voice=speechSynthesis.getVoices().find(v=>v.lang.startsWith('de'));if(voice)utterance.voice=voice;
  utterance.onerror=()=>setSoundMessage('Pronunciation could not play. Try again.');speechSynthesis.speak(utterance);
 }
 const filtered=vocabulary.filter(c=>(topic==='All topics'||c.topic===topic)&&`${c.german} ${c.english}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
 useEffect(()=>{
  const context=(document as Document & {modelContext?:{registerTool:(tool:unknown,options:unknown)=>unknown}}).modelContext;
  if(!context?.registerTool)return;
  const lifecycle=new AbortController();
  try {Promise.resolve(context.registerTool({name:'open_german_deck',description:'Open the words or cases flashcard deck. Does not submit or rate a review.',inputSchema:{type:'object',properties:{deck:{type:'string',enum:['words','cases']}},required:['deck'],additionalProperties:false},annotations:{readOnlyHint:false},execute:(input:unknown)=>{const d=(input as {deck?:string})?.deck;if(d!=='words'&&d!=='cases')throw Error('Choose words or cases.');if(lock.current||pending.current)throw Error('Finish saving your review first.');switchView(d);return{deck:d};}},{signal:lifecycle.signal})).catch(()=>{});}catch{}
  return()=>lifecycle.abort();
 },[]);
 return <div className="app-shell">
  <header className="topbar">
   <a className="brand" href="/" aria-label="German Me home"><span className="brand-mark">ü</span><span>german<span className="brand-light">me</span><span className="brand-dot">.</span></span></a>
   <nav aria-label="Learning sections">{(['words','cases','library'] as View[]).map(v=><button key={v} className={view===v?'nav-active':''} onClick={()=>switchView(v)} disabled={busy||!!pending.current}>{v==='words'?<Layers size={18}/>:v==='cases'?<Sparkles size={18}/>:<BookOpen size={18}/>}<span>{v==='words'?'Flashcards':v==='cases'?'Cases':'Word library'}</span></button>)}</nav>
   <span className="private-label">Your private space <span className="avatar">me</span></span>
  </header>
  <main>
   <div className="heading-row"><div><p className="eyebrow">DEUTSCH / A2</p><h1>{view==='words'?'One word at a time.':view==='cases'?'Give words their place.':'Your German, word by word.'}</h1><p className="subheading">{view==='words'?'Recall first. Reveal second. Make it stick.':view==='cases'?'Practise the little endings that make a big difference.':'500 everyday words, ready when you are.'}</p></div><div className="streak"><span className="streak-icon">✦</span><span><strong>{consecutive}</strong> day{consecutive===1?'':'s'}<small>learning streak</small></span></div></div>
   {view==='library'?<section className="library-section">
    <div className="library-tools"><label className="search-box"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a German or English word" aria-label="Search vocabulary"/></label><label className="select-label">Topic<select value={topic} onChange={e=>setTopic(e.target.value)}>{['All topics',...topics].map(t=><option key={t}>{t}</option>)}</select></label></div>
    <div className="library-count">{filtered.length} words <span>Articles and plurals included</span></div>
    <div className="word-list">{filtered.map(c=><div className="word-row" key={c.id}><div><span className={`gender ${c.german.startsWith('der ')?'masc':c.german.startsWith('die ')?'fem':'neut'}`} lang="de">{c.german}</span><small>{c.plural?`Plural: ${c.plural}`:c.note}</small></div><span>{c.english}</span><span className="word-topic">{c.topic}</span><button className="icon-button" aria-label={`Hear ${c.german}`} onClick={()=>speak(c)}><Volume2 size={18}/></button></div>)}</div>
    {!filtered.length&&<div className="empty-library">No matching words. Try another spelling or topic.</div>}
   </section>:<div className="workspace">
    <section className="study-area" aria-label="Flashcard study">
     <div className="deck-bar"><label className="select-label">{view==='cases'?'Practice deck':'Your deck'}<select value={topic} onChange={e=>{setTopic(e.target.value);setFlipped(false);setNewBudget(20);}} disabled={view==='cases'||busy||!!pending.current}>{view==='cases'?<option>All topics</option>:['All topics',...topics].map(t=><option key={t}>{t}</option>)}</select></label>{view==='words'?<button className="direction-button" disabled={busy||!!pending.current} onClick={()=>{setDirection(d=>d==='de'?'en':'de');setFlipped(false);setNewBudget(20);}}><ArrowLeftRight size={16}/>{direction==='de'?'German → English':'English → German'}</button>:<button className="direction-button" onClick={()=>setGuide(true)}><CircleHelp size={16}/>Case cheat sheet</button>}</div>
     <div className="queue-meta"><span><i className="dot blue"/>{Math.min(newCards.length,newBudget)} new</span><span><i className="dot orange"/>{dueCards.length} due</span><span className="session-counter">{sessionCount} reviewed this session</span></div>
     {!ready?<div className="card-status"><LoaderCircle className={!error?'spin':''} size={30}/><h2>{error?'Reviews unavailable':'Getting your cards ready…'}</h2>{error&&<button className="primary" onClick={()=>void load()}>Try again</button>}</div>:current?<>
      <div className={`flashcard-wrap ${flipped?'is-flipped':''}`} key={currentKey}>
       <button className="flashcard" aria-label={flipped?'Hide answer':'Reveal answer'} aria-pressed={flipped} onClick={()=>!busy&&setFlipped(f=>!f)} disabled={busy}>
        <span className="card-face card-front" aria-hidden={flipped}>
         <span className="card-top"><span>{current.kind==='case'?current.topic:current.topic.toUpperCase()}</span><span>{previous?'REVIEW':'NEW CARD'}</span></span>
         <span className="card-center"><span className="language-label">{current.kind==='case'?'FILL THE GAP':direction==='de'?'GERMAN':'ENGLISH'}</span>{current.kind==='case'?<span className="case-sentence" lang="de">{current.german}</span>:direction==='de'&&current.kind==='noun'?<span className="german-word" lang="de"><span className="article">{current.german.split(' ')[0]}</span>{current.german.slice(current.german.indexOf(' ')+1)}</span>:<span className="german-word" lang={direction==='de'?'de':'en'}>{direction==='de'?current.german:current.english}</span>}</span>
         <span className="card-bottom"><span>{current.kind==='case'?'Which ending belongs here?':'Say it in your head first.'}</span><span>Tap to reveal <span className="mini-key">↵</span></span></span>
        </span>
        <span className="card-face card-back" aria-hidden={!flipped}>
         <span className="card-top"><span>{current.kind==='case'?'THE ANSWER':direction==='de'?'ENGLISH':'GERMAN'}</span><Check size={20}/></span>
         <span className="answer-center"><span className={`answer-word ${current.kind==='case'?'case-answer':''}`} lang={direction==='en'||current.kind==='case'?'de':'en'}>{current.kind==='case'||direction==='de'?current.english:current.german}</span><span className="answer-original" lang="de">{current.kind==='case'?current.german.replace('___',current.english).replace(/\s*\(my\)/,''):direction==='de'?current.german:current.english}</span>{current.plural&&<span className="plural-note">Plural: <strong lang="de">{current.plural}</strong></span>}{current.note&&<span className="grammar-note">{current.note}</span>}{current.translation&&<span className="sentence-translation">{current.translation}</span>}</span>
         <span className="card-bottom"><span>How well did you remember?</span><span>Tap to hide</span></span>
        </span>
       </button>
      </div>
      <div className="card-actions"><span>{current.kind==='case'?'Read the whole sentence aloud.':'Learn the article with the word.'}</span><button className="listen-button" onClick={()=>speak(current)} disabled={current.kind==='case'&&!flipped}><Volume2 size={17}/>Hear it</button></div>
      <div className={`recall-area ${flipped?'revealed':''}`}>{flipped?<div className="rating-grid">{ratings.map((rating,i)=><button key={rating} className={`rating rating-${rating}`} onClick={()=>void rate(rating)} disabled={busy||!!pending.current&&pending.current.rating!==rating}><span className="rating-name">{busy&&pending.current?.rating===rating?<LoaderCircle size={16} className="spin"/>:rating[0].toUpperCase()+rating.slice(1)}<kbd>{i+1}</kbd></span><small>{intervalLabel(previous,rating,now)}</small></button>)}</div>:<button className="reveal-button" disabled={busy} onClick={()=>setFlipped(true)}>Reveal answer<span>space</span></button>}</div>
     </>:<div className="card-status finished"><span className="finish-star">✦</span><p className="eyebrow">GUT GEMACHT</p><h2>{sessionCount?'A little more German, learned.':'You’re all caught up.'}</h2><p>{nextDue?`Next review ${nextDue-now<3600000?`in ${Math.max(1,Math.ceil((nextDue-now)/60000))} min`:new Date(nextDue).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}.`:'Your next words are waiting when you are.'}</p>{newCards.length>0&&<button className="primary" onClick={()=>{setNewBudget(20);setSessionCount(0);}}>Learn {Math.min(20,newCards.length)} more words</button>}</div>}
     {error&&<div className="error-message" role="alert">{error}{ready&&pending.current&&<button onClick={()=>void rate(pending.current!.rating)}>Retry save</button>}</div>}
     {soundMessage&&<p className="sound-message" role="status">{soundMessage}</p>}
     <p className="keyboard-hint"><kbd>space</kbd> reveal <span>·</span> <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd> rate your recall</p>
    </section>
    <aside className="inspector">
     <div className="progress-header"><p className="eyebrow">YOUR MOMENTUM</p><span className="sparkle">✧</span></div><h2>A little, often.</h2><p className="aside-intro">Small sessions. Stronger recall.</p>
     <div className="daily-progress"><div className="progress-ring" style={{'--progress':`${Math.min(todays.length/20,1)*100}%`} as React.CSSProperties}><div><strong>{todays.length}</strong><span>/ 20</span></div></div><div><strong>Today’s reviews</strong><p>{todays.length>=20?'Daily goal reached. Nicely done.':`${20-todays.length} to your daily goal`}</p></div></div>
     <div className="progress-line"><span>Words introduced</span><strong>{reviewedWords}<small> / 500</small></strong></div><div className="progress-line"><span>7+ day intervals</span><strong>{mastered}</strong></div>
     <div className="recall-note"><span className="eyebrow">A NOTE ON RECALL</span><p>{view==='cases'?'Ask who does it, what receives the action, and to whom. That’s the start of cases.':'A blank moment is part of learning. Choose Again, and the word will return in a minute.'}</p></div>
     <div className="article-guide"><div><h3>{view==='cases'?'Three useful questions':'Tiny word. Big difference.'}</h3><button aria-label="Open grammar guide" onClick={()=>setGuide(true)}><CircleHelp size={18}/></button></div>{view==='cases'?<><p><b>Wer?</b> Who? <span>Nominative</span></p><p><b>Wen / was?</b> Whom / what? <span>Accusative</span></p><p><b>Wem?</b> To whom? <span>Dative</span></p></>:<><p><b className="masc">der</b> masculine</p><p><b className="fem">die</b> feminine <span>+ all plurals</span></p><p><b className="neut">das</b> neuter</p></>}</div>
     <div className="storage-note"><Check size={14}/>{ready?'Progress saved to your account':'Connecting your progress'}</div>
    </aside>
   </div>}
   <footer><span>Built for your next word.</span><button onClick={()=>setGuide(true)}>How recall works <CircleHelp size={14}/></button></footer>
  </main>
  {guide&&<Guide onClose={()=>setGuide(false)}/>}
 </div>;
}
function Guide({onClose}:{onClose:()=>void}) {
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{dialog.current?.showModal();return()=>dialog.current?.close();},[]);
 return <dialog ref={dialog} className="guide-dialog" onCancel={onClose} onClick={e=>{if(e.target===dialog.current)onClose();}}><div className="guide-title"><div><p className="eyebrow">KEEP THIS HANDY</p><h2>Cases & recall</h2></div><button className="icon-button" onClick={onClose} autoFocus aria-label="Close guide"><X/></button></div><h3>The article changes with the job.</h3><p>The subject uses nominative. A direct object usually uses accusative. Recipients and verbs such as helfen use dative. Genitive shows possession.</p><div className="table-scroll"><table><thead><tr>{['Case','Masculine','Feminine','Neuter','Plural'].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{articleTable.map(r=><tr key={r[0]}>{r.map((v,i)=><td key={i}>{v}</td>)}</tr>)}</tbody></table></div><p className="guide-extra">Plural indefinite articles have no ein form. Masculine and neuter genitive nouns usually add -(e)s.</p><h3>Prepositions give you a clue.</h3><p><b>Accusative:</b> durch, für, gegen, ohne, um.<br/><b>Dative:</b> aus, bei, mit, nach, seit, von, zu.<br/><b>Two-way:</b> an, auf, hinter, in, neben, über, unter, vor, zwischen. Location (wo?) uses dative; destination (wohin?) uses accusative. Movement alone doesn’t determine the case.</p><h3>Remember, then rate honestly.</h3><p><b>Again</b> returns in 1 minute. <b>Hard</b> returns in 6 minutes for a new card. <b>Good</b> returns tomorrow, then in 6 days. <b>Easy</b> starts at 4 days. Successful reviews gradually lengthen the interval.</p><p>German → English and English → German have separate schedules. Due cards come first, followed by up to 20 new cards per session. You can add another 20 when you finish.</p><p className="guide-extra">This is a simple SM-2-inspired scheduler, rather than Anki’s exact algorithm. Vocabulary combines A1 foundations with everyday A2 words. This is an independent study deck, not the complete official exam list. Pronunciation uses your browser’s German voice, when available.</p><a href="https://www.goethe.de/en/m/spr/prf/ueb/pa2.html" target="_blank" rel="noreferrer">Official Goethe A2 exam resources</a></dialog>;
}
