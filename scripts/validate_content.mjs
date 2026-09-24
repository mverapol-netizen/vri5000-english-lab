import {concepts,domains,exercises,speaking,pronunciation,schedules} from '../js/content.js';

const errors=[];
const conceptIds=new Set(concepts.map(c=>c.id));
const ids=new Set();
const exact=new Set();
const usedDomains=[...new Set(exercises.map(e=>e.domain))];
for(const d of usedDomains) if(!domains.includes(d)) errors.push('undeclared domain: '+d);

for(const e of exercises){
  if(!e.id||ids.has(e.id)) errors.push('duplicate/missing id: '+e.id); else ids.add(e.id);
  if(!conceptIds.has(e.concept)) errors.push(e.id+': unknown concept '+e.concept);
  if(!e.prompt?.trim()) errors.push(e.id+': missing prompt');
  if(!e.answer?.trim()) errors.push(e.id+': missing answer/model');
  if(!e.explanation?.trim()) errors.push(e.id+': missing explanation');
  if(!['controlled','guided','free'].includes(e.transfer)) errors.push(e.id+': invalid transfer');
  const allowedTypes=['mcq','selfcheck','builder','text','timeline'];
  if(!allowedTypes.includes(e.type)) errors.push(e.id+': invalid type '+e.type);
  if(e.type==='mcq'){
    if(!Array.isArray(e.options)||e.options.length<2) errors.push(e.id+': invalid options');
    if(!e.options?.includes(e.answer)) errors.push(e.id+': answer not in options');
  }
  if(e.type==='timeline'){
    if(!Array.isArray(e.timeline)||e.timeline.length<1) errors.push(e.id+': missing timeline points');
    if(!Array.isArray(e.options)||e.options.length<2) errors.push(e.id+': invalid timeline options');
    if(!e.options?.includes(e.answer)) errors.push(e.id+': timeline answer not in options');
  }
  if(e.type==='builder'){
    if(!Array.isArray(e.tokens)||e.tokens.length<2) errors.push(e.id+': missing builder tokens');
    if(!e.tokens?.every(x=>typeof x==='string'&&x.trim())) errors.push(e.id+': invalid builder token');
  }
  if(e.type==='text' && e.acceptedAnswers && (!Array.isArray(e.acceptedAnswers)||!e.acceptedAnswers.length)) errors.push(e.id+': invalid acceptedAnswers');
  if(e.type==='selfcheck' && e.transfer!=='free') errors.push(e.id+': selfcheck must be free transfer');
  const k=e.prompt+'\u0000'+e.answer;
  if(exact.has(k)) errors.push(e.id+': exact duplicate prompt+answer');
  exact.add(k);
}

for(const c of concepts){
  const family=exercises.filter(e=>e.concept===c.id);
  if(family.length<15) errors.push(c.id+': too little practice ('+family.length+')');
  if(!family.some(e=>e.transfer==='free')) errors.push(c.id+': no free-transfer task');
}

for(const p of speaking){
  if(!conceptIds.has(p.concept)) errors.push('speaking '+p.prompt+': unknown concept');
  if(!p.prompt||!p.targets?.length||!p.seconds) errors.push('invalid speaking prompt');
}

for(const p of pronunciation){
  if(!p.id||!p.focus||!p.sentence||!p.tip||!p.seconds) errors.push('invalid pronunciation item');
}

for(const [section,events] of Object.entries(schedules)){
  for(let i=1;i<events.length;i++) if(events[i].date<events[i-1].date) errors.push(section+': dates not sorted');
  for(const ev of events) for(const c of ev.concepts||[]) if(!conceptIds.has(c)) errors.push(section+': unknown event concept '+c);
}

if(errors.length){
  console.error('\nCONTENT VALIDATION FAILED');
  for(const e of errors) console.error(' - '+e);
  process.exit(1);
}
console.log('CONTENT VALIDATION OK');
console.log(JSON.stringify({
  concepts:concepts.length,
  exercises:exercises.length,
  controlled:exercises.filter(e=>e.transfer==='controlled').length,
  guided:exercises.filter(e=>e.transfer==='guided').length,
  free:exercises.filter(e=>e.transfer==='free').length,
  speaking:speaking.length,
  pronunciation:pronunciation.length,
  exactDuplicates:0,
  byType:Object.fromEntries([...new Set(exercises.map(e=>e.type))].map(t=>[t,exercises.filter(e=>e.type===t).length]))
},null,2));
