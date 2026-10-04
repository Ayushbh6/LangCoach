export type RepeatItem = {id:string};
// Freeze the day's set on Start: due cards, today's rated cards, then unseen cards.
export function selectRepeatCards<T extends RepeatItem>(pool:T[],dueIds:string[],todayIds:string[],newIds:string[],limit=20):T[]{
 const lookup=new Map(pool.map(c=>[c.id,c]));
 const ids=[...new Set([...dueIds,...todayIds,...newIds])];
 return ids.flatMap(id=>lookup.has(id)?[lookup.get(id)!]:[]).slice(0,limit);
}
// Each round repeats the same cards in a different order, with no boundary duplicate.
export function repeatOrder<T extends RepeatItem>(cards:T[],round:number):T[]{
 if(round%2===0||cards.length<3)return [...cards];
 const order=[...cards].reverse();
 // Reverse alone would put the previous round's last item first.
 return [...order.slice(1),order[0]];
}
export const AUTO_ROUNDS=3;
