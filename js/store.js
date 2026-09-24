const KEY='vri5000_lab_state_v03';
const OLD_KEYS=['vri5000_lab_state_v02','vri5000_lab_state_v01'];
const defaults={settings:{section:'conservative',duration:20},seen:{},concepts:{},errors:[],sessions:[],speaking:[],examRuns:[]};
const clone=x=>structuredClone(x);

function ensureTransfer(t={}){
  const cv=x=>typeof x==='number'?{attempts:x,correct:x}:x||{attempts:0,correct:0};
  return {controlled:cv(t.controlled),guided:cv(t.guided),free:cv(t.free)};
}
function migrate(old={}){
  const s={...clone(defaults),...old};
  s.settings={...defaults.settings,...(old.settings||{})};
  s.seen=s.seen||{};s.concepts=s.concepts||{};s.errors=s.errors||[];s.sessions=s.sessions||[];s.speaking=s.speaking||[];s.examRuns=s.examRuns||[];
  for(const [id,v0] of Object.entries(s.seen)){
    const v={...v0};
    if(v.attempts==null)v.attempts=1;
    if(v.correctCount==null)v.correctCount=v.correct?1:0;
    if(v.lastCorrect==null)v.lastCorrect=!!v.correct;
    if(v.streak==null)v.streak=v.lastCorrect?1:0;
    if(v.reviewAt===undefined)v.reviewAt=null;
    s.seen[id]=v;
  }
  for(const c of Object.values(s.concepts)){
    c.transfer=ensureTransfer(c.transfer);
    c.attempts=c.attempts||0;c.correct=c.correct||0;c.errors=c.errors||0;
    if(c.reviewAt===undefined)c.reviewAt=null;
  }
  return s;
}
export function loadState(){
  try{
    const current=localStorage.getItem(KEY);if(current)return migrate(JSON.parse(current));
    for(const k of OLD_KEYS){const old=localStorage.getItem(k);if(old){const m=migrate(JSON.parse(old));saveState(m);return m}}
    return clone(defaults);
  }catch{return clone(defaults)}
}
export function saveState(s){localStorage.setItem(KEY,JSON.stringify(s))}
export function resetState(){localStorage.removeItem(KEY);for(const k of OLD_KEYS)localStorage.removeItem(k)}

function exactIntervalHours(streak){return [0,168,336,720,1440][Math.min(streak,4)]||1440}
function conceptIntervalHours(c,correct){
  if(!correct)return 12;
  const acc=c.attempts?c.correct/c.attempts:0;
  if(c.attempts<8)return 24;
  if(c.attempts<18||acc<.8)return 72;
  if(c.attempts<28||acc<.86)return 168;
  return 336;
}
function ensureConcept(state,id){
  if(!state.concepts[id])state.concepts[id]={attempts:0,correct:0,lastSeen:null,reviewAt:null,transfer:ensureTransfer(),errors:0};
  return state.concepts[id];
}
export function recordAttempt(state,exercise,correct,userAnswer,{confidence='unknown'}={}){
  const now=new Date(),iso=now.toISOString();
  const prev=state.seen[exercise.id]||{attempts:0,correctCount:0,streak:0};
  prev.attempts++;if(correct)prev.correctCount++;prev.lastCorrect=!!correct;prev.correct=!!correct;prev.lastSeen=iso;prev.userAnswer=userAnswer;prev.confidence=confidence;
  prev.streak=correct?(prev.streak||0)+1:0;
  let itemHours=correct?exactIntervalHours(prev.streak):12;
  if(confidence==='guess')itemHours=Math.min(itemHours,24);
  if(confidence==='unsure'&&correct)itemHours=Math.min(itemHours,72);
  prev.reviewAt=new Date(now.getTime()+itemHours*3600e3).toISOString();state.seen[exercise.id]=prev;

  const c=ensureConcept(state,exercise.concept);c.attempts++;if(correct)c.correct++;else c.errors++;c.lastSeen=iso;
  const bucket=exercise.transfer==='guided'?'guided':exercise.transfer==='free'?'free':'controlled';
  c.transfer[bucket].attempts++;if(correct)c.transfer[bucket].correct++;
  c.reviewAt=new Date(now.getTime()+conceptIntervalHours(c,correct)*3600e3).toISOString();

  const key=exercise.misconception||exercise.id;
  if(!correct){
    let err=state.errors.find(e=>!e.resolved&&e.concept===exercise.concept&&(e.misconception||e.exerciseId)===key);
    if(err){
      err.occurrences=(err.occurrences||1)+1;err.lastSeen=iso;err.userAnswer=userAnswer;err.correctAnswer=exercise.answer;err.explanation=exercise.explanation;err.exerciseId=exercise.id;err.repairStreak=0;
    } else {
      state.errors.unshift({id:crypto.randomUUID(),exerciseId:exercise.id,concept:exercise.concept,prompt:exercise.prompt,userAnswer,correctAnswer:exercise.answer,explanation:exercise.explanation,misconception:exercise.misconception,createdAt:iso,lastSeen:iso,occurrences:1,repairStreak:0,resolved:false});
    }
    state.errors=state.errors.slice(0,100);
  } else {
    const related=state.errors.filter(e=>!e.resolved&&e.concept===exercise.concept&&(e.misconception||e.exerciseId)===key);
    for(const err of related){
      err.repairStreak=(err.repairStreak||0)+1;
      err.lastRepair=iso;
      if(err.repairStreak>=3){
        err.resolved=true;
        err.resolvedAt=iso;
      }
    }
  }
  saveState(state);return state;
}
export function updateConfidence(state,exerciseId,confidence){
  const item=state.seen[exerciseId];if(!item)return;
  item.confidence=confidence;const now=Date.now();
  if(confidence==='guess')item.reviewAt=new Date(now+12*3600e3).toISOString();
  if(confidence==='unsure'&&item.lastCorrect)item.reviewAt=new Date(now+48*3600e3).toISOString();
  saveState(state);
}
export function recordSpeaking(state,prompt,checks=[]){
  const total=(prompt.targets||[]).length||1;
  const coverage=Math.round(checks.length/total*100);
  const successful=coverage>=75;
  const now=new Date(),iso=now.toISOString();
  const row={id:crypto.randomUUID(),promptId:prompt.id||null,concept:prompt.concept,date:iso,checks,totalTargets:total,coverage,successful,assessment:prompt.assessment||null};
  state.speaking.unshift(row);state.speaking=state.speaking.slice(0,80);
  const c=ensureConcept(state,prompt.concept);
  c.attempts++;if(successful)c.correct++;else c.errors++;
  c.lastSeen=iso;c.transfer.free.attempts++;if(successful)c.transfer.free.correct++;
  c.reviewAt=new Date(now.getTime()+(successful?72:24)*3600e3).toISOString();
  saveState(state);return row;
}
export function recordExamRun(state,run){state.examRuns.unshift({...run,id:crypto.randomUUID(),date:new Date().toISOString()});state.examRuns=state.examRuns.slice(0,30);saveState(state)}
