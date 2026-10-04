import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { allVocabulary } from '../../../data/vocabulary';
import { cases } from '../../../data/cases';
import { schedule, type Progress, type Rating } from '../../../lib/scheduler';
export const dynamic = 'force-dynamic';
const ids = new Set([...allVocabulary.flatMap(c=>[`${c.id}:de`,`${c.id}:en`]),...cases.map(c=>`${c.id}:de`)]);
function database() { if(!env.DB) throw new Error('Storage unavailable'); return env.DB; }
function fromRow(r: Record<string, unknown>): Progress {
 return {cardId:String(r.card_id),due:Number(r.due),interval:Number(r.interval),ease:Number(r.ease),reps:Number(r.reps),lapses:Number(r.lapses),state:String(r.state),updatedAt:Number(r.updated_at)};
}
export async function GET() {
 const user=await getChatGPTUser();
 if(!user) return Response.json({error:'Please sign in to save your reviews.'},{status:401});
 try {
 const db=database();
 const [p, r]=await db.batch([
  db.prepare('SELECT * FROM progress WHERE user_id = ?').bind(user.userId),
  db.prepare('SELECT card_id, rating, reviewed_at FROM reviews WHERE user_id = ? AND reviewed_at >= ? ORDER BY reviewed_at DESC').bind(user.userId, Date.now()-366*86400000),
 ]);
 return Response.json({progress:p.results.map(x=>fromRow(x as Record<string, unknown>)),reviews:r.results}, {headers:{'Cache-Control':'private, no-store'}});
 } catch {return Response.json({error:'Your reviews could not be loaded. Please try again.'},{status:503});}
}
export async function POST(request:Request) {
 const user=await getChatGPTUser();
 if(!user) return Response.json({error:'Please sign in to save your reviews.'},{status:401});
 const origin=request.headers.get('origin');
 if(origin && origin !== new URL(request.url).origin) return Response.json({error:'Invalid request origin.'},{status:403});
 let body: {cardId?:unknown;rating?:unknown;requestId?:unknown;updatedAt?:unknown};
 try {body=await request.json();} catch{return Response.json({error:'Invalid request.'},{status:400});}
 if(typeof body.cardId!=='string'||!ids.has(body.cardId)||!['again','hard','good','easy'].includes(String(body.rating))||typeof body.requestId!=='string'||!/^[a-f0-9-]{36}$/.test(body.requestId)||!Number.isSafeInteger(body.updatedAt)||Number(body.updatedAt)<0) return Response.json({error:'Invalid review.'},{status:400});
 try {
 const db=database(), eventId=`${user.userId}:${body.requestId}`;
 const oldEvent=await db.prepare('SELECT card_id, rating, reviewed_at FROM reviews WHERE request_id = ?').bind(eventId).first();
 const row=await db.prepare('SELECT * FROM progress WHERE user_id = ? AND card_id = ?').bind(user.userId,body.cardId).first();
 const previous=row?fromRow(row):undefined;
 if(oldEvent) {
  if(oldEvent.card_id!==body.cardId) return Response.json({error:'Invalid review reference.'},{status:400});
  return Response.json({progress:previous,review:oldEvent,replayed:true});
 }
 if((previous?.updatedAt??0)!==body.updatedAt) return Response.json({error:'This card changed on another device. Reload to continue.'},{status:409});
 const now=Math.max(Date.now(),(previous?.updatedAt??0)+1);
 const next={cardId:body.cardId,...schedule(previous,body.rating as Rating,now)};
 const results=await db.batch([
 db.prepare(`INSERT INTO progress (user_id,card_id,due,interval,ease,reps,lapses,state,updated_at) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(user_id,card_id) DO UPDATE SET due=excluded.due,interval=excluded.interval,ease=excluded.ease,reps=excluded.reps,lapses=excluded.lapses,state=excluded.state,updated_at=excluded.updated_at WHERE progress.updated_at = ?`).bind(user.userId,next.cardId,next.due,next.interval,next.ease,next.reps,next.lapses,next.state,next.updatedAt,body.updatedAt),
 db.prepare('INSERT INTO reviews (request_id,user_id,card_id,rating,reviewed_at) SELECT ?,?,?,?,? WHERE changes() = 1').bind(eventId,user.userId,next.cardId,body.rating,now)
 ]);
 if(!results[0].meta.changes) return Response.json({error:'This card changed on another device. Reload to continue.'},{status:409});
 return Response.json({progress:next,review:{card_id:next.cardId,rating:body.rating,reviewed_at:now}});
 } catch {return Response.json({error:'Your review was not confirmed. Retry to continue.'},{status:503});}
}
