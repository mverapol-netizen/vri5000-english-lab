import {loadState,saveState,recordAttempt,updateConfidence,resetState,recordSpeaking,recordExamRun} from './store.js';
import {pickExercises,todayMix,reviewMix,challengeMix,eventPack,conceptStats,daysUntil,isCorrect} from './engine.js';
import {concepts,C,domains,exercises,speaking,listening,pronunciation,schedules} from './content.js';

const app=document.getElementById('app');
const title=document.getElementById('pageTitle');
let state=loadState();
let route='today';
let session=null;
let mediaRecorder=null,mediaChunks=[],recordingUrl=null,timerHandle=null,timerStarted=0;
let oralSim=null;
let presentationSim=null;
let finalOralSim=null;

function esc(s){return String(s??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]))}
function setTitle(t){title.textContent=t}
function card(html,cls=''){return '<section class="card '+cls+'">'+html+'</section>'}
function pill(x,cls=''){return '<span class="pill '+cls+'">'+esc(x)+'</span>'}
function currentEvents(){return schedules[state.settings.section]||schedules.conservative}
function nextEvent(){const now=new Date();return currentEvents().find(e=>new Date(e.date+'T23:59:59')>=now)||currentEvents().at(-1)}
function countForMinutes(m){return Math.max(5,Math.round(m*.55))}
function nav(r){route=r;document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.route===r));render()}

document.querySelectorAll('.bottom-nav button').forEach(b=>b.addEventListener('click',()=>nav(b.dataset.route)));
document.getElementById('settingsBtn').onclick=()=>{document.getElementById('sectionSelect').value=state.settings.section;document.getElementById('durationSelect').value=state.settings.duration;document.getElementById('settingsDialog').showModal()};
document.getElementById('saveSettings').onclick=()=>{state.settings.section=document.getElementById('sectionSelect').value;state.settings.duration=+document.getElementById('durationSelect').value;saveState(state);setTimeout(render,0)};
document.getElementById('resetProgress').onclick=()=>{if(confirm('¿Borrar todo el progreso local?')){resetState();state=loadState();document.getElementById('settingsDialog').close();render()}};
document.getElementById('exportProgress').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.download='vri5000-progress.json';a.click()};
document.getElementById('importProgress').onclick=()=>document.getElementById('importProgressFile').click();
document.getElementById('importProgressFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const incoming=JSON.parse(await f.text());localStorage.setItem('vri5000_lab_state_v03',JSON.stringify(incoming));state=loadState();document.getElementById('settingsDialog').close();render()}catch{alert('Backup inválido')}};

function render(){if(route==='today')return renderToday();if(route==='learn')return renderLearn();if(route==='practice')return renderPractice();if(route==='course')return renderCourse();if(route==='progress')return renderProgress()}
function renderToday(){setTitle('Today');const ev=nextEvent();const due=reviewMix(exercises,state,10).length;const now=new Date();const assessment=currentEvents().find(e=>e.assessment&&new Date(e.date+'T23:59:59')>=now);const assessmentDays=assessment?daysUntil(assessment.date):999;const oral=assessmentDays<=14&&assessment?.title.includes('Oral Midterm');const finalOral=assessmentDays<=21&&assessment?.title.includes('Final Oral');const academic=assessmentDays<=14&&assessment?.title.includes('Academic Project');const written=(assessmentDays<=14&&assessment?.title.includes('Written Exam'))||ev?.title.includes('Unit 4');const unit5=ev?.title.includes('Unit 5');app.innerHTML=card('<div class="kicker">Adaptive session</div><h2>'+esc(ev.title)+'</h2><p class="muted">'+daysUntil(ev.date)+' días · '+esc(ev.date)+'</p><div class="grid"><button class="primary" id="todayStart">Start '+state.settings.duration+' min</button><button class="secondary" id="quickStart">Quick 5 min</button><button class="secondary" id="reviewStart">Review due ('+due+')</button><button class="secondary" id="challengeStart">Challenge me</button><button class="secondary" id="speakStart">Speaking Studio</button><button class="secondary" id="listenStart">Listening</button><button class="secondary" id="pronStart">Pronunciation</button></div>','hero')+(oral?card('<div class="kicker">Immediate priority · '+assessmentDays+' days</div><h3>Oral Midterm Lab</h3><p>Questions, narrative tenses, conditionals, agreement, chunks and productive transfer.</p><button class="primary" id="oralLab">Open Oral Lab</button>','urgent-card'):'')+(academic?card('<div class="kicker">Next assessment · '+assessmentDays+' days</div><h3>Academic Project Lab</h3><p>Thesis, signposting, hedging, sentence control and Q&A.</p><button class="primary" id="academicLab">Open Presentation Lab</button>','urgent-card'):'')+(written?card('<div class="kicker">'+(assessment?.title.includes('Written Exam')?'Written Exam · '+assessmentDays+' days':'Course preparation')+'</div><h3>Unit 4 / Written Exam Lab</h3><p>Future forms, intensifiers and short for-and-against writing.</p><button class="primary" id="writtenLab">Open Written Lab</button>','urgent-card'):'')+(unit5?card('<div class="kicker">Course preparation</div><h3>Unit 5 Change Lab</h3><p>Passive & causative, -ing/infinitive forms, conditional counterarguments and problem/solution writing.</p><button class="primary" id="unit5Lab">Open Unit 5 Lab</button>','urgent-card'):'')+(finalOral?card('<div class="kicker">Final assessment · '+assessmentDays+' days</div><h3>Final Oral Lab</h3><p>Integrated productive transfer across the semester with timed speaking and repair.</p><button class="primary" id="finalOralLab">Open Final Oral Lab</button>','urgent-card'):'')+card('<h3>How the engine works</h3><p>It prefers unseen exercises, active errors and due concepts. Correct items are normally replaced by new items testing the same structure.</p>');
 document.getElementById('todayStart').onclick=()=>startSession(todayMix(exercises,state,countForMinutes(state.settings.duration),{courseConcepts:ev.concepts}),'Today');
 document.getElementById('quickStart').onclick=()=>startSession(todayMix(exercises,state,5,{courseConcepts:ev.concepts}),'Quick 5');
 document.getElementById('reviewStart').onclick=()=>startSession(reviewMix(exercises,state,10),'Review');
 document.getElementById('challengeStart').onclick=()=>startSession(challengeMix(exercises,state,10),'Challenge');
 document.getElementById('speakStart').onclick=()=>renderSpeaking();document.getElementById('listenStart').onclick=()=>renderListeningLab();document.getElementById('pronStart').onclick=()=>renderPronunciationLab();
 if(oral)document.getElementById('oralLab').onclick=renderOralLab;if(academic)document.getElementById('academicLab').onclick=renderAcademicLab;if(written)document.getElementById('writtenLab').onclick=renderWrittenLab;if(unit5)document.getElementById('unit5Lab').onclick=renderUnit5Lab;if(finalOral)document.getElementById('finalOralLab').onclick=renderFinalOralLab;
}
function renderLearn(){setTitle('Learn');app.innerHTML='<div class="section-title">Concept library</div>'+concepts.sort((a,b)=>b.priority-a.priority).map(c=>card('<div class="row between"><div><div class="kicker">Priority '+c.priority+'</div><h3>'+esc(c.name)+'</h3></div>'+pill(c.id)+'</div><p>'+esc(c.summary)+'</p><button class="secondary learnBtn" data-id="'+c.id+'">Open</button>')).join('');document.querySelectorAll('.learnBtn').forEach(b=>b.onclick=()=>renderConcept(b.dataset.id))}
function renderConcept(cid){const c=C[cid];setTitle(c.name);app.innerHTML=card('<button class="ghost small-btn" id="backLearn">← Learn</button><h2>'+esc(c.name)+'</h2><p>'+esc(c.summary)+'</p><div class="example"><strong>Rule</strong><br>'+esc(c.rule)+'</div><h3>Examples</h3>'+c.examples.map(x=>'<div class="example">'+esc(x)+'</div>').join('')+'<button class="primary" id="practiceConcept">Practice this</button>');document.getElementById('backLearn').onclick=()=>nav('learn');document.getElementById('practiceConcept').onclick=()=>startSession(pickExercises(exercises,state,{concept:cid,count:12}),'Practice · '+c.name)}
function renderPractice(){
  setTitle('Practice');
  app.innerHTML=card('<h2>Choose your practice</h2><label>Content<select id="pConcept"><option value="mixed">Mixed</option>'+concepts.map(c=>'<option value="'+c.id+'">'+esc(c.name)+'</option>').join('')+'</select></label><label>Exercise type<select id="pType"><option value="mixed">Mixed formats</option><option value="mcq">Choice / contrast</option><option value="text">Correction / transformation</option><option value="builder">Sentence builder</option><option value="timeline">Timeline</option><option value="selfcheck">Free production</option></select></label><label>Context<select id="pDomain"><option value="all">All contexts</option>'+domains.map(d=>'<option>'+d+'</option>').join('')+'</select></label><label>Length<select id="pCount"><option>8</option><option selected>12</option><option>20</option></select></label><button class="primary" id="pStart">Start practice</button>')+
  card('<h3>Production-first options</h3><div class="grid"><button class="secondary" id="guidedStart">Guided production</button><button class="secondary" id="freeStart">Free transfer</button><button class="secondary" id="correctionStart">Error correction</button><button class="secondary" id="builderStart">Sentence builders</button><button class="secondary" id="timelineStart">Timeline practice</button><button class="secondary" id="mixedStart">Mixed challenge</button></div>');
  document.getElementById('pStart').onclick=()=>startSession(pickExercises(exercises,state,{concept:document.getElementById('pConcept').value,type:document.getElementById('pType').value,domain:document.getElementById('pDomain').value,count:+document.getElementById('pCount').value}),'Practice');
  document.getElementById('guidedStart').onclick=()=>startSession(pickExercises(exercises,state,{count:12,transfer:'guided'}),'Guided production');
  document.getElementById('freeStart').onclick=()=>startSession(pickExercises(exercises,state,{count:8,transfer:'free'}),'Free transfer');
  document.getElementById('correctionStart').onclick=()=>startSession(pickExercises(exercises,state,{count:10,type:'text'}),'Error correction & transformation');
  document.getElementById('builderStart').onclick=()=>startSession(pickExercises(exercises,state,{count:10,type:'builder'}),'Sentence builder');
  document.getElementById('timelineStart').onclick=()=>startSession(pickExercises(exercises,state,{count:10,type:'timeline'}),'Timeline practice');
  document.getElementById('mixedStart').onclick=()=>startSession(challengeMix(exercises,state,12),'Mixed challenge');
}
function renderCourse(){setTitle('Course Path');const evs=currentEvents();const next=nextEvent();app.innerHTML=card('<div class="kicker">Current section</div><h2>'+esc(state.settings.section)+'</h2><p>Next: <strong>'+esc(next.title)+'</strong> · '+daysUntil(next.date)+' days</p><div class="study-pack"><button class="secondary" data-phase="prepare">Prepare</button><button class="secondary" data-phase="consolidate">Consolidate</button><button class="secondary" data-phase="transfer">Transfer test</button></div>')+'<div class="section-title">Timeline</div>'+evs.map((e,i)=>card('<div class="row between"><div><strong>'+esc(e.date)+'</strong><h3>'+esc(e.title)+'</h3><div>'+e.concepts.slice(0,4).map(x=>pill(C[x]?.name||x)).join('')+'</div></div>'+(e.assessment?pill('ASSESSMENT','gold'):'')+'</div><button class="ghost event-prep" data-event="'+i+'">Practice this event</button>')).join('');document.querySelectorAll('[data-phase]').forEach(b=>b.onclick=()=>startSession(eventPack(exercises,state,next,b.dataset.phase,12),next.title+' · '+b.dataset.phase));document.querySelectorAll('[data-event]').forEach(b=>b.onclick=()=>{const e=evs[+b.dataset.event];startSession(eventPack(exercises,state,e,'prepare',12),e.title+' · prepare')})}
function renderProgress(){
  setTitle('Progress');
  const total=Object.values(state.seen).reduce((a,x)=>a+(x.attempts||0),0);
  const active=state.errors.filter(e=>!e.resolved);
  const ranked=concepts.map(c=>({c,s:conceptStats(state,c.id)})).sort((a,b)=>{
    const aa=a.s.attempts? a.s.mastery : -1;
    const bb=b.s.attempts? b.s.mastery : -1;
    return aa-bb;
  });
  const weak=ranked.filter(x=>x.s.attempts>=3).slice(0,3);
  const speakingRuns=state.speaking||[];
  const speakingAvg=speakingRuns.length?Math.round(speakingRuns.slice(0,12).reduce((a,x)=>a+(x.coverage||0),0)/Math.min(12,speakingRuns.length)):0;
  const exams=state.examRuns||[];

  app.innerHTML=
  card('<div class="grid"><div class="metric"><strong>'+total+'</strong><span>attempts</span></div><div class="metric"><strong>'+Object.keys(state.seen).length+'</strong><span>unique items</span></div><div class="metric"><strong>'+active.length+'</strong><span>active errors</span></div><div class="metric"><strong>'+exercises.length+'</strong><span>available items</span></div></div>')+
  (weak.length?card('<div class="kicker">Recommended focus</div><h3>Weakest active areas</h3>'+weak.map(x=>'<div class="mini-row"><strong>'+esc(x.c.name)+'</strong><span style="float:right">'+x.s.mastery+'%</span></div>').join('')+'<button class="primary" id="weakMix">Practice weak areas</button>','urgent-card'):'')+
  card('<div class="grid"><div class="metric"><strong>'+speakingRuns.length+'</strong><span>speaking audits</span></div><div class="metric"><strong>'+speakingAvg+'%</strong><span>recent speaking coverage</span></div><div class="metric"><strong>'+exams.length+'</strong><span>full rehearsals</span></div><div class="metric"><strong>'+state.sessions.filter(x=>x.type==='writing').length+'</strong><span>writing audits</span></div></div>')+
  '<div class="section-title">Mastery by concept</div>'+
  ranked.map(({c,s})=>card('<div class="row between"><strong>'+esc(c.name)+'</strong>'+pill(s.status)+'</div><div class="progressbar"><span style="width:'+s.mastery+'%"></span></div><div class="transfer-row"><span>Controlled</span><div class="progressbar"><span style="width:'+s.rates.controlled+'%"></span></div><strong>'+s.rates.controlled+'%</strong></div><div class="transfer-row"><span>Guided</span><div class="progressbar"><span style="width:'+s.rates.guided+'%"></span></div><strong>'+s.rates.guided+'%</strong></div><div class="transfer-row"><span>Transfer</span><div class="progressbar"><span style="width:'+s.rates.free+'%"></span></div><strong>'+s.rates.free+'%</strong></div><p class="muted small">'+(s.attempts||0)+' attempts · '+(s.counts?.free||0)+' transfer attempts</p>')).join('')+
  (exams.length?'<div class="section-title">Recent rehearsals</div>'+exams.slice(0,5).map(e=>card('<div class="row between"><strong>'+esc((e.type||'rehearsal').replaceAll('_',' '))+'</strong>'+pill((e.coverage??0)+'%','gold')+'</div><p class="muted small">'+new Date(e.date).toLocaleDateString()+'</p>')).join(''):'')+
  (active.length?'<div class="section-title">Error Bank</div>'+active.slice(0,10).map(e=>card('<strong>'+esc(C[e.concept]?.name||e.concept)+'</strong><p>'+esc(e.prompt)+'</p><p class="small">Your answer: '+esc(e.userAnswer)+'<br>Correct: '+esc(e.correctAnswer)+'</p><p class="muted small">'+(e.occurrences||1)+' occurrence(s) · repair '+(e.repairStreak||0)+'/3</p><button class="secondary repairBtn" data-c="'+e.concept+'">Repair this area</button>')).join(''):'');

  if(weak.length)document.getElementById('weakMix').onclick=()=>startSession(pickExercises(exercises,state,{concepts:weak.map(x=>x.c.id),count:14}),'Weak-area repair');
  document.querySelectorAll('.repairBtn').forEach(b=>b.onclick=()=>startSession(pickExercises(exercises,state,{concept:b.dataset.c,count:8}),'Error repair'));
}

function startSession(items,label,after=null){if(!items.length){alert('No exercises available for this selection yet.');return}session={items,index:0,correct:0,label,log:[],after};renderExercise()}
function renderExercise(){
  const ex=session.items[session.index];
  setTitle(session.label);
  if(!ex)return finishSession();
  if(ex.type==='selfcheck'){
    app.innerHTML=card('<div class="row between">'+pill((session.index+1)+' / '+session.items.length)+pill(C[ex.concept]?.name||ex.concept)+'</div><div class="exercise-prompt">'+esc(ex.prompt)+'</div><textarea class="input textarea" id="freeAnswer" placeholder="Write notes or your response here…"></textarea><button class="primary" id="revealModel">Reveal model & self-check</button><div id="feedbackBox"></div>');
    document.getElementById('revealModel').onclick=()=>answerSelfcheck(ex);
    return;
  }
  if(ex.type==='builder')return renderBuilderExercise(ex);
  if(ex.type==='text')return renderTextExercise(ex);
  if(ex.type==='timeline')return renderTimelineExercise(ex);
  return renderChoiceExercise(ex);
}
function exerciseHeader(ex){
  return '<div class="row between">'+pill((session.index+1)+' / '+session.items.length)+pill(C[ex.concept]?.name||ex.concept)+'</div>';
}
function renderChoiceExercise(ex,extra=''){
  app.innerHTML=card(exerciseHeader(ex)+extra+'<div class="exercise-prompt">'+esc(ex.prompt)+'</div>'+ex.options.map(o=>'<button class="choice exChoice" data-v="'+esc(o)+'">'+esc(o)+'</button>').join('')+'<div id="feedbackBox"></div>');
  document.querySelectorAll('.exChoice').forEach(b=>b.onclick=()=>answerExercise(ex,b.dataset.v,b));
}
function renderTimelineExercise(ex){
  const strip='<div class="time-strip">'+(ex.timeline||[]).map((x,i)=>'<div class="time-point"><span>'+(i+1)+'</span><div>'+esc(x)+'</div></div>').join('')+'</div>';
  renderChoiceExercise(ex,strip);
}
function renderTextExercise(ex){
  app.innerHTML=card(exerciseHeader(ex)+'<div class="exercise-prompt">'+esc(ex.prompt)+'</div><textarea class="input textarea" id="textAnswer" placeholder="Type your answer…"></textarea><button class="primary" id="checkText">Check</button><div id="feedbackBox"></div>');
  const input=document.getElementById('textAnswer');
  document.getElementById('checkText').onclick=()=>answerTextExercise(ex,input.value);
}
function renderBuilderExercise(ex){
  let chosen=[];
  const tokens=(ex.tokens||[]).map((t,i)=>({t,i}));
  app.innerHTML=card(exerciseHeader(ex)+'<div class="exercise-prompt">'+esc(ex.prompt)+'</div><div class="builder-answer" id="builderAnswer"><span class="muted">Tap words below to build the sentence.</span></div><div class="token-bank" id="tokenBank"></div><div class="row"><button class="ghost small-btn" id="builderUndo">Undo</button><button class="ghost small-btn" id="builderClear">Clear</button></div><button class="primary" id="builderCheck">Check sentence</button><div id="feedbackBox"></div>');
  const bank=document.getElementById('tokenBank'),ans=document.getElementById('builderAnswer');
  function draw(){
    ans.innerHTML=chosen.length?esc(chosen.map(x=>x.t).join(' ')):'<span class="muted">Tap words below to build the sentence.</span>';
    bank.innerHTML=tokens.map(x=>'<button class="token" data-i="'+x.i+'" '+(chosen.some(y=>y.i===x.i)?'disabled':'')+'>'+esc(x.t)+'</button>').join('');
    bank.querySelectorAll('.token').forEach(b=>b.onclick=()=>{const x=tokens.find(z=>z.i===+b.dataset.i);chosen.push(x);draw()});
  }
  draw();
  document.getElementById('builderUndo').onclick=()=>{chosen.pop();draw()};
  document.getElementById('builderClear').onclick=()=>{chosen=[];draw()};
  document.getElementById('builderCheck').onclick=()=>answerTextExercise(ex,chosen.map(x=>x.t).join(' '));
}
function feedbackHTML(ex,answer,ok){
  const specific=!ok&&ex.optionFeedback?.[answer]?'<div class="specific-feedback">'+esc(ex.optionFeedback[answer])+'</div>':'';
  return '<div class="feedback '+(ok?'':'error')+'"><h3>'+(ok?'Correct':'Not yet')+'</h3><p><strong>Answer:</strong> '+esc(ex.answer)+'</p>'+specific+'<p>'+esc(ex.explanation)+'</p><div class="confidence"><span>Confidence:</span><button data-c="sure">Sure</button><button data-c="unsure">Unsure</button><button data-c="guess">Guess</button></div><button class="primary" id="nextEx">'+(session.index===session.items.length-1?'Finish':'Next')+'</button></div>';
}
function finishAnswer(ex,answer,ok){
  if(ok)session.correct++;
  recordAttempt(state,ex,ok,answer);
  session.log.push({id:ex.id,concept:ex.concept,type:ex.type,answer,correct:ok});
  const f=document.getElementById('feedbackBox');
  f.innerHTML=feedbackHTML(ex,answer,ok);
  f.querySelectorAll('[data-c]').forEach(x=>x.onclick=()=>{f.querySelectorAll('[data-c]').forEach(z=>z.classList.remove('selected'));x.classList.add('selected');updateConfidence(state,ex.id,x.dataset.c)});
  document.getElementById('nextEx').onclick=()=>{session.index++;renderExercise()};
}
function answerExercise(ex,answer,btn){
  document.querySelectorAll('.exChoice').forEach(x=>x.disabled=true);
  const ok=isCorrect(ex,answer);
  btn.classList.add(ok?'correct':'wrong');
  if(!ok)document.querySelectorAll('.exChoice').forEach(x=>{if(isCorrect(ex,x.dataset.v))x.classList.add('correct')});
  finishAnswer(ex,answer,ok);
}
function answerTextExercise(ex,answer){
  const controls=[document.getElementById('checkText'),document.getElementById('builderCheck')].filter(Boolean);
  controls.forEach(x=>x.disabled=true);
  const ok=isCorrect(ex,answer);
  finishAnswer(ex,answer,ok);
}

function answerSelfcheck(ex){const answer=document.getElementById('freeAnswer').value.trim();const f=document.getElementById('feedbackBox');f.innerHTML='<div class="feedback"><h3>Model, not a script</h3><p>'+esc(ex.answer)+'</p><p>'+esc(ex.explanation)+'</p><p><strong>Did you use the target structure accurately?</strong></p><div class="selfcheck-row"><button class="primary" id="selfYes">Yes</button><button class="ghost" id="selfNo">Not yet</button></div></div>';document.getElementById('revealModel').disabled=true;document.getElementById('selfYes').onclick=()=>completeSelfcheck(ex,answer,true);document.getElementById('selfNo').onclick=()=>completeSelfcheck(ex,answer,false)}
function completeSelfcheck(ex,answer,ok){recordAttempt(state,ex,ok,answer);if(ok)session.correct++;session.log.push({id:ex.id,concept:ex.concept,answer,correct:ok});document.getElementById('feedbackBox').insertAdjacentHTML('beforeend','<button class="primary" id="nextSelf" style="margin-top:10px">'+(session.index===session.items.length-1?'Finish':'Next')+'</button>');document.getElementById('nextSelf').onclick=()=>{session.index++;renderExercise()}}

function finishSession(){const pct=Math.round(session.correct/session.items.length*100);const after=session.after;state.sessions.unshift({date:new Date().toISOString(),label:session.label,total:session.items.length,correct:session.correct,log:session.log});state.sessions=state.sessions.slice(0,50);saveState(state);app.innerHTML=card('<div class="kicker">Session complete</div><h2>'+pct+'%</h2><p>'+session.correct+' / '+session.items.length+' correct.</p><p class="muted">The engine will reuse the structure before it reuses the exact successful item.</p><div class="grid">'+(after?'<button class="primary" id="continueAfter">Continue rehearsal</button>':'')+'<button class="secondary" id="homeAfter">Back to Today</button></div>','hero');if(after)document.getElementById('continueAfter').onclick=after;document.getElementById('homeAfter').onclick=()=>nav('today')}

function renderOralLab(){setTitle('Oral Midterm Lab');const routeDays=[['D−5','Questions + agreement'],['D−4','Narrative tenses'],['D−3','Conditionals + chunks'],['D−2','Integrated speaking'],['D−1','Full rehearsal']];app.innerHTML=card('<div class="kicker">Oral Midterm</div><h2>Productive control under pressure</h2><p>This is a personal practice lab based on course content and your diagnostic priorities; it is not a reconstruction of the official exam.</p><div class="grid"><button class="primary" id="oralMix">10 min warm-up</button><button class="secondary" id="oralSpeak">Speaking bank</button><button class="secondary" id="storyLab">Unit 3 Story Lab</button><button class="secondary" id="oralTransfer">Free transfer</button><button class="secondary" id="oralSim">Full rehearsal</button></div>')+card('<h3>Five-day route</h3>'+routeDays.map(x=>'<div class="route-day"><strong>'+x[0]+'</strong><div>'+x[1]+'</div></div>').join(''))+card('<h3>Skill drills</h3><div class="grid">'+['questions','narrative','conditionals','usedto','agreement','prepositions'].map(c=>'<button class="secondary oralDrill" data-c="'+c+'">'+esc(C[c].name)+'</button>').join('')+'</div>');document.getElementById('oralMix').onclick=()=>startSession(pickExercises(exercises,state,{concepts:['questions','narrative','conditionals','usedto','agreement','prepositions'],count:12}),'Oral warm-up');document.getElementById('oralSpeak').onclick=()=>renderSpeaking(['questions','narrative','conditionals','usedto','agreement','prepositions']);document.getElementById('storyLab').onclick=renderStoryLab;document.getElementById('oralSim').onclick=renderOralSimulator;document.getElementById('oralTransfer').onclick=()=>startSession(pickExercises(exercises,state,{concepts:['questions','narrative','conditionals','usedto','prepositions'],transfer:'free',count:8}),'Oral · free transfer');document.querySelectorAll('.oralDrill').forEach(b=>b.onclick=()=>startSession(pickExercises(exercises,state,{concept:b.dataset.c,count:10}),'Oral drill · '+C[b.dataset.c].name))}



function renderOralSimulator(){
  oralSim={index:0,results:[],parts:[
    {id:'oral_sim_q',concept:'questions',seconds:60,prompt:'A researcher says that one unexpected finding changed the project. Ask four natural follow-up questions, including one subject question and one indirect question.',targets:['subject question','object question','indirect question']},
    {id:'oral_sim_n',concept:'narrative',seconds:90,prompt:'Tell a short story about arriving at an archive and discovering that something had happened before you arrived. Include background, main event, earlier event and prior duration.',targets:['past progressive','past simple','past perfect','past perfect progressive']},
    {id:'oral_sim_c',concept:'conditionals',seconds:75,prompt:'Give advice for handling a difficult academic or institutional situation using alternatives to if. Include one precaution.',targets:['unless','as long as / provided that','in case','as soon as']}
  ]};
  renderOralSimulatorPart();
}
function renderOralSimulatorPart(){
  const p=oralSim.parts[oralSim.index];
  setTitle('Oral rehearsal · '+(oralSim.index+1)+' / '+oralSim.parts.length);
  app.innerHTML=card('<div class="row between">'+pill('Part '+(oralSim.index+1)+' / '+oralSim.parts.length)+pill(p.seconds+' sec','gold')+'</div><div class="exercise-prompt">'+esc(p.prompt)+'</div><div>'+p.targets.map(x=>pill(x)).join('')+'</div><div class="big-timer" id="sTimer">'+p.seconds+'</div><div class="grid"><button class="primary" id="recordBtn">Start recording</button><button class="secondary" id="simSkipRecord">Use timer only</button></div><div id="audioBox"></div><div class="divider"></div><h3>Target audit</h3>'+p.targets.map((x,i)=>'<label class="check-line"><input type="checkbox" class="targetCheck" value="'+i+'">'+esc(x)+'</label>').join('')+'<button class="primary" id="simNext">'+(oralSim.index===oralSim.parts.length-1?'Finish rehearsal':'Save & next part')+'</button>')+
  card('<p class="muted small">This rehearsal measures target coverage, not an official course grade. Mark a target only if you actually produced it accurately.</p>');
  document.getElementById('recordBtn').onclick=()=>toggleRecording(p);
  document.getElementById('simSkipRecord').onclick=()=>startStandaloneTimer(p.seconds);
  document.getElementById('simNext').onclick=()=>completeOralSimulatorPart(p);
}
function startStandaloneTimer(seconds){
  clearInterval(timerHandle);
  timerStarted=Date.now();
  const el=document.getElementById('sTimer');
  timerHandle=setInterval(()=>{
    const left=Math.max(0,seconds-Math.floor((Date.now()-timerStarted)/1000));
    if(el)el.textContent=left;
    if(left===0)clearInterval(timerHandle);
  },250);
}
function completeOralSimulatorPart(p){
  clearInterval(timerHandle);
  const checks=[...document.querySelectorAll('.targetCheck:checked')].map(x=>x.value);
  const row=recordSpeaking(state,p,checks);
  oralSim.results.push({concept:p.concept,prompt:p.prompt,coverage:row.coverage,checks,total:p.targets.length});
  if(oralSim.index<oralSim.parts.length-1){oralSim.index++;renderOralSimulatorPart();return}
  finishOralSimulator();
}
function finishOralSimulator(){
  const overall=Math.round(oralSim.results.reduce((a,x)=>a+x.coverage,0)/oralSim.results.length);
  const weak=oralSim.results.filter(x=>x.coverage<75).map(x=>x.concept);
  recordExamRun(state,{type:'oral_midterm_rehearsal',coverage:overall,parts:oralSim.results});
  app.innerHTML=card('<div class="kicker">Rehearsal complete</div><h2>'+overall+'% target coverage</h2><p>This is a diagnostic coverage score, not a grade.</p>'+oralSim.results.map(x=>'<div class="mini-row"><strong>'+esc(C[x.concept]?.name||x.concept)+'</strong><span style="float:right">'+x.coverage+'%</span></div>').join('')+'<div class="divider"></div><div class="grid">'+(weak.length?'<button class="primary" id="simRepair">Repair weak areas</button>':'')+'<button class="secondary" id="simAgain">Run new rehearsal</button><button class="ghost" id="simHome">Back to Today</button></div>','hero');
  if(weak.length)document.getElementById('simRepair').onclick=()=>startSession(pickExercises(exercises,state,{concepts:[...new Set(weak)],count:12}),'Post-rehearsal repair');
  document.getElementById('simAgain').onclick=renderOralSimulator;
  document.getElementById('simHome').onclick=()=>nav('today');
}

function renderStoryLab(){
  setTitle('Unit 3 Story Lab');
  const prompts=[
    'A researcher entered an archive after closing time and discovered that several files were missing.',
    'A political reporter arrived at a counting center just as the power went out.',
    'A philosopher found a handwritten note inside a book that had been sealed for decades.',
    'A student was walking home when they realized that the same stranger had been following them for several blocks.'
  ];
  const prompt=prompts[Math.floor(Math.random()*prompts.length)];
  app.innerHTML=card('<div class="kicker">Unit 3 · narrative integration</div><h2>'+esc(prompt)+'</h2><p>Build the story in four temporal layers rather than writing one long sentence.</p><div class="timeline"><div class="event"><strong>Background</strong><br>What was happening?</div><div class="event"><strong>Main event</strong><br>What happened?</div><div class="event"><strong>Earlier event</strong><br>What had happened before?</div><div class="event"><strong>Prior duration</strong><br>What had been happening for some time?</div></div><div class="grid"><button class="primary" id="storySpeak">Tell it aloud</button><button class="secondary" id="storyDrill">Narrative drill</button></div>')+card('<h3>Success criteria</h3><p>'+pill('past progressive')+pill('past simple')+pill('past perfect')+pill('past perfect progressive')+'</p><p class="muted">Aim for 5–7 controlled sentences. Precision is more important than one syntactically overloaded sentence.</p>');
  document.getElementById('storySpeak').onclick=()=>renderSpeaking(['narrative']);
  document.getElementById('storyDrill').onclick=()=>startSession(pickExercises(exercises,state,{concept:'narrative',count:12}),'Unit 3 · narrative drill');
}

function renderWrittenLab(){
  setTitle('Unit 4 / Written Exam Lab');
  app.innerHTML=card('<div class="kicker">Unit 4 · Written Exam preparation</div><h2>Future system + intensifiers + for/against writing</h2><p>The course combines future forms, advanced future perfect/progressive forms, intensifiers and a Unit Review focused on structuring a for-and-against blog post.</p><div class="grid"><button class="primary" id="writtenSim">Full rehearsal</button><button class="secondary" id="futureDrill">Future forms</button><button class="secondary" id="intensifierDrill">Intensifiers</button><button class="secondary" id="writingSprint">For/against writing</button><button class="secondary" id="futureSpeak">Future speaking</button></div>')+
  card('<h3>Future map</h3><div class="example"><strong>Schedule:</strong> The seminar starts at 9.</div><div class="example"><strong>Arrangement:</strong> I am meeting my supervisor tomorrow.</div><div class="example"><strong>In progress:</strong> At 10, I will be presenting.</div><div class="example"><strong>Completed:</strong> By Friday, I will have finished.</div><div class="example"><strong>Duration:</strong> By December, I will have been studying English for four months.</div>')+
  card('<h3>Intensifier map</h3><div class="example"><strong>Comparative:</strong> considerably more effective</div><div class="example"><strong>Strong adjective:</strong> utterly unrealistic / totally unexpected</div><div class="example"><strong>Academic collocation:</strong> highly likely / deeply concerned</div>');
  document.getElementById('writtenSim').onclick=renderWrittenExamSimulator;
  document.getElementById('futureDrill').onclick=()=>startSession(pickExercises(exercises,state,{concept:'future',count:14}),'Unit 4 · future forms');
  document.getElementById('intensifierDrill').onclick=()=>startSession(pickExercises(exercises,state,{concept:'intensifiers',count:12}),'Unit 4 · intensifiers');
  document.getElementById('writingSprint').onclick=renderForAgainstLab;
  document.getElementById('futureSpeak').onclick=()=>renderSpeaking(['future','intensifiers']);
}

function renderWrittenExamSimulator(){
  const grammar=pickExercises(exercises,state,{concepts:['future','intensifiers','prepositions','agreement','academicdiscourse'],count:18});
  startSession(grammar,'Written Exam rehearsal · language',renderForAgainstLab);
}

function renderForAgainstLab(){
  setTitle('For & Against Writing Lab');
  const prompts=[
    'Universities should allow students to use generative AI in most assessed work.',
    'Cities should restrict private cars in their centers.',
    'Automation will improve working life more than it will damage it.',
    'Political campaigns should be allowed to use highly personalized digital advertising.',
    'Remote work is better for organizations than fully in-person work.'
  ];
  const p=prompts[Math.floor(Math.random()*prompts.length)];
  app.innerHTML=card('<div class="kicker">Personal practice · 130–180 words</div><h2>'+esc(p)+'</h2><p>Write a balanced post with five functions: introduce the issue → argument for → argument against → your position → conclusion.</p><textarea class="input textarea" id="writingText" style="min-height:220px" placeholder="Write here…"></textarea><div class="row between"><span class="muted small" id="wordCount">0 words</span><button class="primary small-btn" id="writingCheck">Self-check</button></div><div id="writingFeedback"></div>')+
  card('<h3>Structure prompts</h3><div class="example"><strong>Introduce:</strong> There is considerable debate about whether…</div><div class="example"><strong>For:</strong> One argument in favor is that…</div><div class="example"><strong>Against:</strong> On the other hand, critics argue that…</div><div class="example"><strong>Position:</strong> On balance, I would argue that…</div><div class="example"><strong>Conclusion:</strong> Overall, the strongest case depends on…</div>');
  const ta=document.getElementById('writingText');
  ta.oninput=()=>{const n=ta.value.trim()?ta.value.trim().split(/\s+/).length:0;document.getElementById('wordCount').textContent=n+' words'};
  document.getElementById('writingCheck').onclick=()=>{
    const txt=ta.value.trim();
    document.getElementById('writingFeedback').innerHTML='<div class="feedback"><h3>Writing audit</h3>'+
      '<label class="check-line"><input type="checkbox" class="writeCheck">The introduction identifies the issue.</label>'+
      '<label class="check-line"><input type="checkbox" class="writeCheck">There is at least one developed argument for.</label>'+
      '<label class="check-line"><input type="checkbox" class="writeCheck">There is at least one developed argument against.</label>'+
      '<label class="check-line"><input type="checkbox" class="writeCheck">Examples or reasons support the claims.</label>'+
      '<label class="check-line"><input type="checkbox" class="writeCheck">My own position is explicit but not overstated.</label>'+
      '<label class="check-line"><input type="checkbox" class="writeCheck">The conclusion synthesizes rather than introduces a new argument.</label>'+
      '<label class="check-line"><input type="checkbox" class="writeCheck">Future forms / intensifiers are accurate where used.</label>'+
      '<label class="check-line"><input type="checkbox" class="writeCheck">Agreement, punctuation and linking are controlled.</label>'+
      '<button class="secondary" id="saveWriting">Save audit</button></div>';
    document.getElementById('saveWriting').onclick=()=>{
      const checks=[...document.querySelectorAll('.writeCheck:checked')].length;
      const coverage=Math.round(checks/8*100);
      state.sessions.unshift({date:new Date().toISOString(),label:'For & Against Writing',type:'writing',prompt:p,text:txt,coverage});
      state.sessions=state.sessions.slice(0,50);saveState(state);
      app.insertAdjacentHTML('afterbegin',card('<div class="kicker">Saved</div><h2>'+coverage+'% checklist coverage</h2><p class="muted">This is a personal diagnostic, not an official exam score.</p>','hero'));
    };
  };
}


function renderUnit5Lab(){
  setTitle('Unit 5 · Change Lab');
  app.innerHTML=card('<div class="kicker">Unit 5</div><h2>Change · grammar + argumentation</h2><p>Train the official Unit 5 core: passive voice and causative have/get, -ing and infinitive forms, conditional counterarguments, and problem/solution writing.</p><div class="grid"><button class="primary" id="u5Mix">Unit 5 mixed</button><button class="secondary" id="u5Passive">Passive & causative</button><button class="secondary" id="u5Verbs">-ing / infinitive</button><button class="secondary" id="u5Counter">Counterarguments</button><button class="secondary" id="u5Writing">Problem / solution</button><button class="secondary" id="u5Speak">Unit 5 speaking</button></div>')+
  card('<h3>Functional map</h3><div class="example"><strong>Passive:</strong> The proposal was reviewed by the committee.</div><div class="example"><strong>Causative:</strong> We had the document translated.</div><div class="example"><strong>-ing:</strong> They suggested revising the draft.</div><div class="example"><strong>Infinitive:</strong> We decided to revise the draft.</div><div class="example"><strong>Counterargument:</strong> That may be true, but people might change if the incentives changed.</div>');
  document.getElementById('u5Mix').onclick=()=>startSession(pickExercises(exercises,state,{concepts:['passivecausative','verbpatterns','counterarguments','academicdiscourse'],count:16}),'Unit 5 · mixed');
  document.getElementById('u5Passive').onclick=()=>startSession(pickExercises(exercises,state,{concept:'passivecausative',count:12}),'Unit 5 · passive & causative');
  document.getElementById('u5Verbs').onclick=()=>startSession(pickExercises(exercises,state,{concept:'verbpatterns',count:12}),'Unit 5 · -ing & infinitive');
  document.getElementById('u5Counter').onclick=()=>startSession(pickExercises(exercises,state,{concept:'counterarguments',count:12}),'Unit 5 · conditional counterarguments');
  document.getElementById('u5Writing').onclick=renderProblemSolutionLab;
  document.getElementById('u5Speak').onclick=()=>renderSpeaking(['passivecausative','verbpatterns','counterarguments','academicdiscourse']);
}

function renderProblemSolutionLab(){
  setTitle('Problem / Solution Writing Lab');
  const prompts=[
    'University students are becoming increasingly distracted by constant notifications.',
    'Many city residents feel unsafe using public transportation at night.',
    'Academic researchers often struggle to communicate complex findings to the public.',
    'Disposable packaging remains common even when reusable alternatives exist.',
    'Some neighborhoods have very limited access to green public spaces.'
  ];
  const p=prompts[Math.floor(Math.random()*prompts.length)];
  app.innerHTML=card('<div class="kicker">Personal practice · 140–190 words</div><h2>'+esc(p)+'</h2><p>Build the article around six functions: state the problem → explain a result → give an example → propose a solution → explain how it works → state the expected result.</p><textarea class="input textarea" id="psText" style="min-height:230px" placeholder="Write here…"></textarea><div class="row between"><span class="muted small" id="psCount">0 words</span><button class="primary small-btn" id="psCheck">Self-check</button></div><div id="psFeedback"></div>')+
  card('<h3>Useful frames</h3><div class="example"><strong>Problem:</strong> One of the main problems is…</div><div class="example"><strong>Result:</strong> As a result,…</div><div class="example"><strong>Example:</strong> A clear example of this is…</div><div class="example"><strong>Solution:</strong> One way to tackle this issue is to…</div><div class="example"><strong>Mechanism:</strong> This would allow…</div><div class="example"><strong>Expected effect:</strong> If implemented effectively, this could…</div>');
  const ta=document.getElementById('psText');
  ta.oninput=()=>{const n=ta.value.trim()?ta.value.trim().split(/\s+/).length:0;document.getElementById('psCount').textContent=n+' words'};
  document.getElementById('psCheck').onclick=()=>{
    const txt=ta.value.trim();
    document.getElementById('psFeedback').innerHTML='<div class="feedback"><h3>Problem / solution audit</h3>'+
    '<label class="check-line"><input type="checkbox" class="psCheck">The problem is stated precisely.</label>'+
    '<label class="check-line"><input type="checkbox" class="psCheck">A consequence or result is explained.</label>'+
    '<label class="check-line"><input type="checkbox" class="psCheck">There is a concrete example.</label>'+
    '<label class="check-line"><input type="checkbox" class="psCheck">At least one realistic solution is proposed.</label>'+
    '<label class="check-line"><input type="checkbox" class="psCheck">I explain how the solution addresses the problem.</label>'+
    '<label class="check-line"><input type="checkbox" class="psCheck">The expected result is stated cautiously.</label>'+
    '<label class="check-line"><input type="checkbox" class="psCheck">Verb patterns, agreement and linking are controlled.</label>'+
    '<button class="secondary" id="psSave">Save audit</button></div>';
    document.getElementById('psSave').onclick=()=>{
      const checks=[...document.querySelectorAll('.psCheck:checked')].length;
      const coverage=Math.round(checks/7*100);
      state.sessions.unshift({date:new Date().toISOString(),label:'Problem / Solution Writing',type:'writing',prompt:p,text:txt,coverage});
      state.sessions=state.sessions.slice(0,50);saveState(state);
      app.insertAdjacentHTML('afterbegin',card('<div class="kicker">Saved</div><h2>'+coverage+'% checklist coverage</h2><p class="muted">This is a personal diagnostic, not an official course score.</p>','hero'));
    };
  };
}

function renderFinalOralLab(){
  setTitle('Final Oral Lab');
  app.innerHTML=card('<div class="kicker">Semester integration</div><h2>Final Oral · productive transfer</h2><p>The final rehearsal mixes earlier weaknesses with the later course content. The goal is not to reproduce a confidential exam format, but to test whether you can select structures spontaneously under speaking pressure.</p><div class="grid"><button class="primary" id="finalFull">Full rehearsal</button><button class="secondary" id="finalTransfer">Mixed transfer</button><button class="secondary" id="finalSpeak">Speaking bank</button><button class="secondary" id="finalPron">Pronunciation</button><button class="secondary" id="finalU5">Unit 5 repair</button></div>')+
  card('<h3>Five transfer zones</h3><div class="example">1. Questions & interaction</div><div class="example">2. Narrative / past sequence</div><div class="example">3. Change over time: present perfect + used-to family</div><div class="example">4. Future prediction and planning</div><div class="example">5. Passive / verb patterns / conditional counterargument</div>');
  document.getElementById('finalFull').onclick=renderFinalOralSimulator;
  document.getElementById('finalTransfer').onclick=()=>startSession(challengeMix(exercises,state,16),'Final Oral · mixed transfer');
  document.getElementById('finalSpeak').onclick=()=>renderSpeaking();
  document.getElementById('finalPron').onclick=renderPronunciationLab;
  document.getElementById('finalU5').onclick=renderUnit5Lab;
}

function renderFinalOralSimulator(){
  finalOralSim={index:0,results:[],parts:[
    {id:'final_oral_1',concept:'questions',seconds:75,prompt:'A classmate says that an unexpected event changed their research project. Keep the conversation going with four natural follow-up questions, including one subject question and one indirect question.',targets:['subject question','object/follow-up question','indirect question']},
    {id:'final_oral_2',concept:'narrative',seconds:90,prompt:'Tell a short story about a difficult academic or travel situation. Include background, a main event, an earlier event, and something that had been happening for some time.',targets:['past progressive','past simple','past perfect','past perfect progressive']},
    {id:'final_oral_3',concept:'presentperfect',seconds:90,prompt:'Explain how your academic or professional life has changed over the last few years. Include a result up to now, an ongoing activity, a past habit, something normal now, and something you are still adapting to.',targets:['present perfect','present perfect progressive','used to / would','be/get used to']},
    {id:'final_oral_4',concept:'future',seconds:90,prompt:'Describe your plans for the next year and make one prediction about universities or technology. Include a schedule/arrangement, an activity in progress at a future time, and something completed by a deadline.',targets:['schedule/arrangement','future progressive','future perfect','prediction']},
    {id:'final_oral_5',concept:'counterarguments',seconds:90,prompt:'A speaker says: “Environmental or institutional reforms rarely work because people resist change.” Respond with a conditional counterargument, then describe one solution using either a passive or causative structure and one accurate verb pattern.',targets:['conditional counterargument','passive or causative','-ing/infinitive pattern']}
  ]};
  renderFinalOralSimulatorPart();
}
function renderFinalOralSimulatorPart(){
  const p=finalOralSim.parts[finalOralSim.index];
  setTitle('Final Oral rehearsal · '+(finalOralSim.index+1)+' / '+finalOralSim.parts.length);
  app.innerHTML=card('<div class="row between">'+pill('Part '+(finalOralSim.index+1)+' / '+finalOralSim.parts.length)+pill(p.seconds+' sec','gold')+'</div><div class="exercise-prompt">'+esc(p.prompt)+'</div><div>'+p.targets.map(x=>pill(x)).join('')+'</div><div class="big-timer" id="sTimer">'+p.seconds+'</div><div class="grid"><button class="primary" id="recordBtn">Start recording</button><button class="secondary" id="finalTimer">Use timer only</button></div><div id="audioBox"></div><div class="divider"></div><h3>Target audit</h3>'+p.targets.map((x,i)=>'<label class="check-line"><input type="checkbox" class="targetCheck" value="'+i+'">'+esc(x)+'</label>').join('')+'<button class="primary" id="finalNext">'+(finalOralSim.index===finalOralSim.parts.length-1?'Finish rehearsal':'Save & next part')+'</button>')+
  card('<p class="muted small">Only mark a target when it appeared accurately enough that you would want to keep it in a real answer.</p>');
  document.getElementById('recordBtn').onclick=()=>toggleRecording(p);
  document.getElementById('finalTimer').onclick=()=>startStandaloneTimer(p.seconds);
  document.getElementById('finalNext').onclick=()=>completeFinalOralPart(p);
}
function completeFinalOralPart(p){
  clearInterval(timerHandle);
  const checks=[...document.querySelectorAll('.targetCheck:checked')].map(x=>x.value);
  const row=recordSpeaking(state,p,checks);
  finalOralSim.results.push({concept:p.concept,prompt:p.prompt,coverage:row.coverage,checks,total:p.targets.length});
  if(finalOralSim.index<finalOralSim.parts.length-1){finalOralSim.index++;renderFinalOralSimulatorPart();return}
  const overall=Math.round(finalOralSim.results.reduce((a,x)=>a+x.coverage,0)/finalOralSim.results.length);
  const weak=finalOralSim.results.filter(x=>x.coverage<75).map(x=>x.concept);
  recordExamRun(state,{type:'final_oral_rehearsal',coverage:overall,parts:finalOralSim.results});
  app.innerHTML=card('<div class="kicker">Final rehearsal complete</div><h2>'+overall+'% target coverage</h2><p>This measures target coverage only; it is not an official grade prediction.</p>'+finalOralSim.results.map((x,i)=>'<div class="mini-row"><strong>Part '+(i+1)+' · '+esc(C[x.concept]?.name||x.concept)+'</strong><span style="float:right">'+x.coverage+'%</span></div>').join('')+'<div class="divider"></div><div class="grid">'+(weak.length?'<button class="primary" id="finalRepair">Repair weak areas</button>':'')+'<button class="secondary" id="finalAgain">Run again</button><button class="ghost" id="finalHome">Back to Today</button></div>','hero');
  if(weak.length)document.getElementById('finalRepair').onclick=()=>startSession(pickExercises(exercises,state,{concepts:[...new Set(weak)],count:14}),'Final Oral · repair');
  document.getElementById('finalAgain').onclick=renderFinalOralSimulator;
  document.getElementById('finalHome').onclick=()=>nav('today');
}

function renderAcademicLab(){
  setTitle('Academic Project Lab');
  app.innerHTML=card('<div class="kicker">Academic Project Presentation</div><h2>Argument + sentence control + Q&A</h2><p>Practice the language needed to introduce a thesis, organize an argument, hedge claims and respond without losing the turn.</p><div class="grid"><button class="primary" id="academicMix">Language drill</button><button class="secondary" id="academicSpeak">Speaking bank</button><button class="secondary" id="academicSim">Full rehearsal</button><button class="secondary" id="academicQA">Q&A challenge</button></div>')+
  card('<h3>Useful frames</h3><div class="example">My main argument is that…</div><div class="example">The first point concerns…</div><div class="example">The evidence suggests that…</div><div class="example">While it is true that…, I would argue that…</div><div class="example">What I mean is… / Let me rephrase that…</div>')+
  card('<h3>Three-step rehearsal</h3><p><strong>1.</strong> Opening: thesis + roadmap.</p><p><strong>2.</strong> Argument: claim + evidence + cautious implication.</p><p><strong>3.</strong> Q&A: objection + distinction + reformulation.</p>');
  document.getElementById('academicMix').onclick=()=>startSession(pickExercises(exercises,state,{concepts:['academicdiscourse','questions','agreement','prepositions','presentperfect','verbpatterns'],count:14}),'Academic Project · language');
  document.getElementById('academicSpeak').onclick=()=>renderSpeaking(['academicdiscourse','questions','agreement','prepositions','presentperfect','future']);
  document.getElementById('academicSim').onclick=renderPresentationSimulator;
  document.getElementById('academicQA').onclick=()=>renderSpeaking(['academicdiscourse']);
}

function renderPresentationSimulator(){
  presentationSim={index:0,results:[],parts:[
    {id:'presentation_sim_1',concept:'academicdiscourse',seconds:90,prompt:'Open your academic presentation. State a clear main argument, give a three-part roadmap, and make one hedged claim about the evidence.',targets:['thesis frame','roadmap','hedging']},
    {id:'presentation_sim_2',concept:'academicdiscourse',seconds:90,prompt:'Develop one central point. State the claim, introduce one piece of evidence or example, and explain its implication without overclaiming.',targets:['claim','evidence/example','cautious implication']},
    {id:'presentation_sim_3',concept:'academicdiscourse',seconds:60,prompt:'A listener objects: “Your argument seems to confuse social dependence with loss of autonomy.” Respond by acknowledging the objection, drawing a distinction, and reformulating your position.',targets:['acknowledgment','distinction','self-repair']}
  ]};
  renderPresentationSimulatorPart();
}
function renderPresentationSimulatorPart(){
  const p=presentationSim.parts[presentationSim.index];
  setTitle('Presentation rehearsal · '+(presentationSim.index+1)+' / '+presentationSim.parts.length);
  app.innerHTML=card('<div class="row between">'+pill('Part '+(presentationSim.index+1)+' / '+presentationSim.parts.length)+pill(p.seconds+' sec','gold')+'</div><div class="exercise-prompt">'+esc(p.prompt)+'</div><div>'+p.targets.map(x=>pill(x)).join('')+'</div><div class="big-timer" id="sTimer">'+p.seconds+'</div><div class="grid"><button class="primary" id="recordBtn">Start recording</button><button class="secondary" id="presentationTimer">Use timer only</button></div><div id="audioBox"></div><div class="divider"></div><h3>Target audit</h3>'+p.targets.map((x,i)=>'<label class="check-line"><input type="checkbox" class="targetCheck" value="'+i+'">'+esc(x)+'</label>').join('')+'<button class="primary" id="presentationNext">'+(presentationSim.index===presentationSim.parts.length-1?'Finish rehearsal':'Save & next part')+'</button>')+
  card('<p class="muted small">Judge whether the function was actually present and linguistically controlled. The score is diagnostic target coverage, not an official grade.</p>');
  document.getElementById('recordBtn').onclick=()=>toggleRecording(p);
  document.getElementById('presentationTimer').onclick=()=>startStandaloneTimer(p.seconds);
  document.getElementById('presentationNext').onclick=()=>completePresentationSimulatorPart(p);
}
function completePresentationSimulatorPart(p){
  clearInterval(timerHandle);
  const checks=[...document.querySelectorAll('.targetCheck:checked')].map(x=>x.value);
  const row=recordSpeaking(state,p,checks);
  presentationSim.results.push({concept:p.concept,prompt:p.prompt,coverage:row.coverage,checks,total:p.targets.length});
  if(presentationSim.index<presentationSim.parts.length-1){presentationSim.index++;renderPresentationSimulatorPart();return}
  const overall=Math.round(presentationSim.results.reduce((a,x)=>a+x.coverage,0)/presentationSim.results.length);
  recordExamRun(state,{type:'academic_project_rehearsal',coverage:overall,parts:presentationSim.results});
  app.innerHTML=card('<div class="kicker">Presentation rehearsal complete</div><h2>'+overall+'% target coverage</h2><p>This measures whether the target presentation functions appeared in your rehearsal.</p>'+presentationSim.results.map((x,i)=>'<div class="mini-row"><strong>Part '+(i+1)+'</strong><span style="float:right">'+x.coverage+'%</span></div>').join('')+'<div class="divider"></div><div class="grid"><button class="primary" id="presentationRepair">Practice academic discourse</button><button class="secondary" id="presentationAgain">Run another rehearsal</button><button class="ghost" id="presentationHome">Back to Today</button></div>','hero');
  document.getElementById('presentationRepair').onclick=()=>startSession(pickExercises(exercises,state,{concept:'academicdiscourse',count:12}),'Presentation repair');
  document.getElementById('presentationAgain').onclick=renderPresentationSimulator;
  document.getElementById('presentationHome').onclick=()=>nav('today');
}



function listeningNorm(s){
  return String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/[.,?!;:"]/g,'').replace(/\s+/g,' ').trim();
}
function listeningCoverage(reference,answer){
  const ref=listeningNorm(reference).split(' ').filter(Boolean);
  const ans=listeningNorm(answer).split(' ').filter(Boolean);
  if(!ref.length)return 0;
  const counts={};ans.forEach(w=>counts[w]=(counts[w]||0)+1);
  let hit=0;
  for(const w of ref){if(counts[w]>0){hit++;counts[w]--}}
  return Math.round(hit/ref.length*100);
}
function renderListeningLab(){
  setTitle('Listening Lab');
  const item=listening[Math.floor(Math.random()*listening.length)];
  app.innerHTML=card('<div class="row between">'+pill(item.focus)+pill(C[item.concept]?.name||item.concept,'gold')+'</div><h2>Listen, then reconstruct</h2><p class="muted">Play the sentence. Try not to look for grammar clues before listening.</p><div class="grid"><button class="primary" id="listenPlay">Play model</button><button class="secondary" id="listenSlow">Play slower</button><button class="secondary" id="listenNew">New item</button></div><textarea class="input textarea" id="listenAnswer" placeholder="Type what you heard…" style="margin-top:12px"></textarea><button class="primary" id="listenCheck">Check transcription</button><div id="listenFeedback"></div>')+
  card('<h3>Listening strategy</h3><p>'+esc(item.tip)+'</p><p class="muted small">The model is generated with the English text-to-speech voice available on your device. This is controlled listening practice, not a claim that one synthetic voice represents all English accents.</p>');
  function play(rate){
    if(!('speechSynthesis' in window)){alert('Text-to-speech is unavailable on this device.');return}
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(item.transcript);u.lang='en-US';u.rate=rate;speechSynthesis.speak(u);
  }
  document.getElementById('listenPlay').onclick=()=>play(.92);
  document.getElementById('listenSlow').onclick=()=>play(.72);
  document.getElementById('listenNew').onclick=renderListeningLab;
  document.getElementById('listenCheck').onclick=()=>{
    const answer=document.getElementById('listenAnswer').value.trim();
    const coverage=listeningCoverage(item.transcript,answer);
    state.sessions.unshift({date:new Date().toISOString(),label:'Listening Lab',type:'listening',concept:item.concept,focus:item.focus,coverage,answer,model:item.transcript});
    state.sessions=state.sessions.slice(0,50);saveState(state);
    document.getElementById('listenFeedback').innerHTML='<div class="feedback '+(coverage<75?'error':'')+'"><h3>'+coverage+'% word coverage</h3><p><strong>Transcript:</strong> '+esc(item.transcript)+'</p><p>'+esc(item.tip)+'</p><div class="grid"><button class="secondary" id="listenReplay">Replay</button><button class="primary" id="listenNext">Next item</button></div></div>';
    document.getElementById('listenReplay').onclick=()=>play(.92);
    document.getElementById('listenNext').onclick=renderListeningLab;
  };
}

function renderPronunciationLab(){
  setTitle('Pronunciation Lab');
  const p=pronunciation[Math.floor(Math.random()*pronunciation.length)];
  app.innerHTML=card('<div class="row between">'+pill(p.focus)+pill(p.seconds+' sec','gold')+'</div><div class="exercise-prompt">'+esc(p.sentence)+'</div><div class="example"><strong>Focus</strong><br>'+esc(p.tip)+'</div><div class="big-timer" id="sTimer">'+p.seconds+'</div><div class="grid"><button class="primary" id="pronPlay">Play model</button><button class="secondary" id="recordBtn">Record myself</button><button class="secondary" id="pronNew">New item</button></div><div id="audioBox"></div>')+
  card('<h3>Self-audit</h3><label class="check-line"><input type="checkbox" class="pronCheck">I kept the sentence in natural thought groups.</label><label class="check-line"><input type="checkbox" class="pronCheck">I stressed the key content words rather than every word.</label><label class="check-line"><input type="checkbox" class="pronCheck">I followed the specific focus above.</label><button class="secondary" id="pronSave">Save audit</button><p class="muted small">The model uses the English voice available on your device. Treat it as pronunciation practice, not as a single mandatory accent.</p>');
  document.getElementById('pronPlay').onclick=()=>{
    if(!('speechSynthesis' in window)){alert('Text-to-speech is unavailable on this device.');return}
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(p.sentence);u.lang='en-US';u.rate=.88;speechSynthesis.speak(u);
  };
  document.getElementById('recordBtn').onclick=()=>toggleRecording(p);
  document.getElementById('pronNew').onclick=renderPronunciationLab;
  document.getElementById('pronSave').onclick=()=>{
    const checks=[...document.querySelectorAll('.pronCheck:checked')].length;
    state.sessions.unshift({date:new Date().toISOString(),label:'Pronunciation Lab',type:'pronunciation',focus:p.focus,sentence:p.sentence,coverage:Math.round(checks/3*100)});
    state.sessions=state.sessions.slice(0,50);saveState(state);alert('Pronunciation audit saved locally.');
  };
}

function renderSpeaking(filter=null){setTitle('Speaking Studio');let pool=speaking.filter(p=>!filter||filter.includes(p.concept));const p=pool[Math.floor(Math.random()*pool.length)];app.innerHTML=card('<div class="row between">'+pill(C[p.concept].name)+pill(p.seconds+' sec','gold')+'</div><div class="exercise-prompt">'+esc(p.prompt)+'</div><div>'+p.targets.map(x=>pill(x)).join('')+'</div><div class="big-timer" id="sTimer">'+p.seconds+'</div><div class="grid"><button class="primary" id="recordBtn">Start recording</button><button class="secondary" id="newPrompt">New prompt</button></div><div id="audioBox"></div><div class="divider"></div><h3>Self-audit</h3>'+p.targets.map((x,i)=>'<label class="check-line"><input type="checkbox" class="targetCheck" value="'+i+'">'+esc(x)+'</label>').join('')+'<button class="secondary" id="saveSpeak">Save self-audit</button>');document.getElementById('newPrompt').onclick=()=>renderSpeaking(filter);document.getElementById('recordBtn').onclick=()=>toggleRecording(p);document.getElementById('saveSpeak').onclick=()=>{const checks=[...document.querySelectorAll('.targetCheck:checked')].map(x=>x.value);const row=recordSpeaking(state,p,checks);alert('Self-audit saved: '+row.coverage+'% target coverage. This now counts as free-transfer evidence.')}}
async function toggleRecording(p){const btn=document.getElementById('recordBtn');if(mediaRecorder&&mediaRecorder.state==='recording'){mediaRecorder.stop();clearInterval(timerHandle);btn.textContent='Start recording';btn.classList.remove('recording');return}try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});mediaChunks=[];mediaRecorder=new MediaRecorder(stream);mediaRecorder.ondataavailable=e=>mediaChunks.push(e.data);mediaRecorder.onstop=()=>{stream.getTracks().forEach(t=>t.stop());if(recordingUrl)URL.revokeObjectURL(recordingUrl);recordingUrl=URL.createObjectURL(new Blob(mediaChunks,{type:mediaRecorder.mimeType}));document.getElementById('audioBox').innerHTML='<audio controls src="'+recordingUrl+'"></audio>'};mediaRecorder.start();timerStarted=Date.now();btn.textContent='Stop recording';btn.classList.add('recording');timerHandle=setInterval(()=>{const left=Math.max(0,p.seconds-Math.floor((Date.now()-timerStarted)/1000));document.getElementById('sTimer').textContent=left;if(!left&&mediaRecorder.state==='recording')mediaRecorder.stop()},250)}catch{alert('Microphone access is unavailable. You can still use the timer and self-audit.') }}

if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
render();
