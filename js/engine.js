export const norm=s=>(s??'').toString().trim().toLowerCase().replace(/[’']/g,"'").replace(/[?.!,;:]+$/,'').replace(/\s+/g,' ');
export function isCorrect(ex,answer){if(ex.type==='selfcheck')return null;return (ex.acceptedAnswers||[ex.answer]).some(a=>norm(a)===norm(answer))}
const shuffle=a=>[...a].sort(()=>Math.random()-.5),nowMs=()=>Date.now();
const seenInfo=(state,id)=>state.seen[id]||null;
const itemDue=(state,e)=>{const s=seenInfo(state,e.id);return !!(s?.reviewAt&&new Date(s.reviewAt).getTime()<=nowMs())};
const conceptDue=(state,id)=>{const c=state.concepts[id];return !!(c?.reviewAt&&new Date(c.reviewAt).getTime()<=nowMs())};
const lastSeen=(state,e)=>new Date(seenInfo(state,e.id)?.lastSeen||0).getTime();

export function pickExercises(all,state,{concept='mixed',concepts=null,type='mixed',domain='all',count=10,minDifficulty=0,maxDifficulty=9,transfer='all'}={}){
  const allowed=concepts?.length?new Set(concepts):null;
  let pool=all.filter(e=>(concept==='mixed'||e.concept===concept)&&(!allowed||allowed.has(e.concept))&&(type==='mixed'||e.type===type)&&(domain==='all'||e.domain===domain)&&(transfer==='all'||e.transfer===transfer)&&((e.difficulty||2)>=minDifficulty)&&((e.difficulty||2)<=maxDifficulty));
  if(!pool.length)return [];
  const unresolvedIds=new Set(state.errors.filter(e=>!e.resolved).map(e=>e.exerciseId));
  const failed=shuffle(pool.filter(e=>state.seen[e.id]?.lastCorrect===false));
  const unseen=shuffle(pool.filter(e=>!state.seen[e.id]));
  const due=shuffle(pool.filter(e=>itemDue(state,e))).sort((a,b)=>lastSeen(state,a)-lastSeen(state,b));
  const repair=shuffle(pool.filter(e=>unresolvedIds.has(e.id)&&!itemDue(state,e)));
  const oldSeen=pool.filter(e=>state.seen[e.id]&&!itemDue(state,e)).sort((a,b)=>lastSeen(state,a)-lastSeen(state,b));
  const ordered=[...failed,...unseen,...due,...repair,...oldSeen],out=[],ids=new Set();
  for(const e of ordered){if(!ids.has(e.id)){out.push(e);ids.add(e.id)}if(out.length>=count)break}
  return out;
}
function pickNovelForConcept(all,state,concept,count=2){
  const pool=all.filter(e=>e.concept===concept),unseen=shuffle(pool.filter(e=>!state.seen[e.id]));
  const guided=unseen.filter(e=>e.transfer!=='controlled');const controlled=unseen.filter(e=>e.transfer==='controlled');
  const old=pool.filter(e=>state.seen[e.id]).sort((a,b)=>lastSeen(state,a)-lastSeen(state,b));
  return [...guided,...controlled,...old].slice(0,count);
}
export function reviewMix(all,state,count=10){
  const dueConcepts=Object.keys(state.concepts).filter(c=>conceptDue(state,c));
  const errorConcepts=[...new Set(state.errors.filter(e=>!e.resolved).map(e=>e.concept))];
  const targets=[...new Set([...errorConcepts,...dueConcepts])],out=[],ids=new Set();
  for(const c of targets){for(const e of pickNovelForConcept(all,state,c,2)){if(!ids.has(e.id)){out.push(e);ids.add(e.id)}if(out.length>=count)return out}}
  const exactDue=all.filter(e=>itemDue(state,e)).sort((a,b)=>lastSeen(state,a)-lastSeen(state,b));
  for(const e of exactDue){if(!ids.has(e.id)){out.push(e);ids.add(e.id)}if(out.length>=count)break}
  return out;
}
export function todayMix(all,state,count=12,{courseConcepts=[]}={}){
  const dueConcepts=Object.keys(state.concepts).filter(c=>conceptDue(state,c));
  const errorConcepts=[...new Set(state.errors.filter(e=>!e.resolved).map(e=>e.concept))];
  const weak=Object.entries(state.concepts).filter(([,v])=>(v.attempts||0)>=3).sort((a,b)=>conceptNeedScore(b[1])-conceptNeedScore(a[1])).map(([k])=>k);
  const fallback=['narrative','questions','conditionals','usedto','agreement','prepositions'];
  const targets=[...new Set([...courseConcepts,...errorConcepts,...dueConcepts,...weak,...fallback])].filter(Boolean);let out=[];
  for(let cursor=0;out.length<count&&cursor<targets.length*4;cursor++){
    const c=targets[cursor%targets.length],one=pickExercises(all,state,{concept:c,count:2});out.push(...one);out=[...new Map(out.map(x=>[x.id,x])).values()];
  }
  if(out.length<count)out.push(...pickExercises(all,state,{count:count-out.length}));
  return [...new Map(out.map(x=>[x.id,x])).values()].slice(0,count);
}
export function challengeMix(all,state,count=10){
  const guided=pickExercises(all,state,{count:Math.ceil(count*.65),minDifficulty:2,transfer:'guided'});
  const free=pickExercises(all,state,{count:Math.max(2,Math.floor(count*.35)),transfer:'free'});
  const out=[...guided,...free];if(out.length<count)out.push(...pickExercises(all,state,{count:count-out.length,minDifficulty:2}));return [...new Map(out.map(x=>[x.id,x])).values()].slice(0,count);
}
export function eventPack(all,state,event,phase='prepare',count=10){
  const concepts=event?.concepts||[];if(!concepts.length)return [];
  let out=[];
  if(phase==='prepare'){
    out=[...pickExercises(all,state,{concepts,transfer:'controlled',count:Math.ceil(count*.55)}),...pickExercises(all,state,{concepts,transfer:'guided',count:Math.floor(count*.45)})];
  }else if(phase==='consolidate'){
    const review=reviewMix(all,state,Math.ceil(count*.45)).filter(e=>concepts.includes(e.concept));
    out=[...review,...pickExercises(all,state,{concepts,transfer:'guided',count:count-review.length})];
  }else{
    out=[...pickExercises(all,state,{concepts,transfer:'free',count:Math.max(2,Math.floor(count*.4))}),...pickExercises(all,state,{concepts,transfer:'guided',count:count})];
  }
  if(out.length<count)out.push(...pickExercises(all,state,{concepts,count:count-out.length}));
  return [...new Map(out.map(x=>[x.id,x])).values()].slice(0,count);
}
function bucketRate(b){if(!b?.attempts)return 0;return b.correct/b.attempts}
export function conceptNeedScore(c={}){
  if(!(c.attempts||0))return 0;
  const mastery=conceptMastery(c);
  const t=c.transfer||{};
  const controlled=bucketRate(t.controlled),free=bucketRate(t.free);
  const transferGap=Math.max(0,controlled-free);
  const responsePressure=Math.min(1,Math.max(0,((c.avgResponseMs||0)-5000)/10000));
  const conf=c.confidence||{},confTotal=(conf.sure||0)+(conf.unsure||0)+(conf.guess||0);
  const uncertainty=confTotal?((conf.unsure||0)+(conf.guess||0))/confTotal:0;
  return (1-mastery)*.55+transferGap*.25+responsePressure*.10+uncertainty*.10;
}
export function conceptMastery(c={}){const t=c.transfer||{},controlled=bucketRate(t.controlled),guided=bucketRate(t.guided),free=bucketRate(t.free),base=c.attempts?c.correct/c.attempts:0;return .2*base+.25*controlled+.3*guided+.25*free}
export function conceptStats(state,id){
  const c=state.concepts[id]||{attempts:0,correct:0,transfer:{controlled:{attempts:0,correct:0},guided:{attempts:0,correct:0},free:{attempts:0,correct:0}}};
  const accuracy=c.attempts?Math.round(c.correct/c.attempts*100):0,rates={},counts={};
  for(const k of ['controlled','guided','free']){const b=c.transfer?.[k]||{};rates[k]=b.attempts?Math.round(b.correct/b.attempts*100):0;counts[k]=b.attempts||0}
  const mastery=Math.round(conceptMastery(c)*100);let status='NEW';
  if(c.attempts>=3)status='LEARNING';
  if(c.attempts>=8&&rates.controlled>=80)status='CONTROLLED';
  if(c.attempts>=14&&rates.guided>=75&&rates.controlled>=85)status='GUIDED';
  if(c.attempts>=18&&counts.free>=2&&rates.free>=60&&rates.guided>=80)status='MAINTENANCE';
  if(c.attempts>=28&&counts.free>=3&&mastery>=86&&rates.guided>=85&&rates.free>=75)status='MASTERED';
  const conf=c.confidence||{},confTotal=(conf.sure||0)+(conf.unsure||0)+(conf.guess||0);
  const uncertainty=confTotal?Math.round(((conf.unsure||0)+(conf.guess||0))/confTotal*100):0;
  return {...c,accuracy,mastery,rates,counts,status,avgResponseMs:c.avgResponseMs||0,uncertainty,needScore:Math.round(conceptNeedScore(c)*100)};
}
export function courseNow(events){const now=new Date();let next=events.find(e=>new Date(e.date+'T23:59:59')>=now);if(!next)next=events.at(-1);return next}
export function nextAssessment(events){const now=new Date();return events.find(e=>e.assessment&&new Date(e.date+'T23:59:59')>=now)||events.filter(e=>e.assessment).at(-1)}
export function dueCount(all,state){return Object.keys(state.concepts).filter(c=>conceptDue(state,c)).length+state.errors.filter(e=>!e.resolved).length}
export function daysUntil(date){return Math.max(0,Math.ceil((new Date(date+'T23:59:59').getTime()-Date.now())/86400000))}
