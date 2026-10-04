export type Rating = 'again' | 'hard' | 'good' | 'easy';
export type Progress = { cardId: string; due: number; interval: number; ease: number; reps: number; lapses: number; state: string; updatedAt: number };
export const DAY = 86400000;
export const isLearning = (p: Progress | undefined) => !!p && (p.state === 'learning' || p.state === 'learning-10m');
// Anki-style 1m/10m learning steps, followed by the existing SM-2-inspired reviews.
// Existing review records keep their due dates; transitions occur only on a rating.
export function schedule(previous: Progress | undefined, rating: Rating, now: number): Omit<Progress, 'cardId'> {
 const p = previous ?? {interval:0,ease:2.5,reps:0,lapses:0,state:'new'};
 let {interval,ease,reps,lapses}=p;
 let state='review', delay=0;
 if(rating==='again') {
  interval=0;reps=0;state='learning';delay=60000;
  if(previous?.state==='review'){lapses+=1;ease=Math.max(1.3,ease-.2);}
 } else if(rating==='hard') {
  if(p.interval<1){state=p.state==='learning-10m'?'learning-10m':'learning';interval=0;delay=state==='learning-10m'?600000:360000;}
  else{ease=Math.max(1.3,ease-.15);interval=Math.max(1,p.interval*1.2);delay=interval*DAY;reps+=1;}
 } else if(rating==='good') {
  if(p.interval<1 && p.state!=='learning-10m'){state='learning-10m';interval=0;delay=600000;}
  else{interval=p.interval<1?1:p.reps<2?6:Math.max(1,p.interval*ease);reps+=1;delay=interval*DAY;}
 } else {
  interval=p.interval<1?4:Math.max(4,p.interval*ease*1.3);ease+=.15;reps+=1;delay=interval*DAY;
 }
 return {due:now+Math.round(delay),interval,ease,reps,lapses,state,updatedAt:now};
}
export function intervalLabel(previous:Progress|undefined,rating:Rating,now:number){
 const delta=schedule(previous,rating,now).due-now;
 if(delta<3600000)return `${Math.round(delta/60000)} min`;
 const days=Math.round(delta/DAY);return days===1?'1 day':`${days} days`;
}
