import test from 'node:test';
import assert from 'node:assert/strict';
import {schedule, DAY, intervalLabel} from '../lib/scheduler.ts';
import {selectRepeatCards, repeatOrder} from '../lib/repeat-session.ts';
const now=1800000000000;
const record=p=>({cardId:'test:de',...p});
test('new Good repeats today, then graduates tomorrow',()=>{
 const first=schedule(undefined,'good',now);
 assert.equal(first.due-now,600000);assert.equal(first.state,'learning-10m');
 const second=schedule(record(first),'good',first.due);
 assert.equal(second.due-first.due,DAY);assert.equal(second.state,'review');
 assert.equal(schedule(record(second),'good',second.due).interval,6);
});
test('Again resets learning; Hard respects current step',()=>{
 const first=schedule(undefined,'again',now);
 assert.equal(first.due-now,60000);
 assert.equal(intervalLabel(record(first),'hard',now),'6 min');
 const second=schedule(record(first),'good',now);
 assert.equal(intervalLabel(record(second),'hard',now),'10 min');
 assert.equal(schedule(record(second),'again',now).state,'learning');
});
test('legacy mature reviews retain interval behavior without mutating progress',()=>{
 const p={cardId:'test:en',due:now,interval:12,ease:2.5,reps:4,lapses:0,state:'review',updatedAt:now-1000};
 const copy={...p};assert.equal(schedule(p,'good',now).interval,30);
 assert.equal(schedule(p,'again',now).lapses,1);assert.deepEqual(p,copy);
 assert.equal(schedule(undefined,'easy',now).interval,4);
});
test('automatic set prioritises due and today, stays unique and filtered',()=>{
 const pool=['a','b','c','d'].map(id=>({id}));
 assert.deepEqual(selectRepeatCards(pool,['c','outside'],['a','c'],['b','d'],3).map(c=>c.id),['c','a','b']);
 assert.deepEqual(selectRepeatCards([],['a'],[],[]),[]);
});
test('three rounds include every card and avoid boundary repeats when possible',()=>{
 for(const count of [1,2,3,20]){
  const cards=Array.from({length:count},(_,i)=>({id:String(i)}));
  let last;
  for(let round=0;round<3;round++){
   const order=repeatOrder(cards,round);
   assert.equal(new Set(order.map(c=>c.id)).size,count);
   if(count>1&&last)assert.notEqual(order[0].id,last);
   last=order.at(-1).id;
  }
  assert.deepEqual(cards.map(c=>c.id),Array.from({length:count},(_,i)=>String(i)));
 }
});
