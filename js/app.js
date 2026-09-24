import {loadState,saveState,recordAttempt,updateConfidence,resetState,recordSpeaking} from './store.js';
import {pickExercises,todayMix,reviewMix,challengeMix,eventPack,conceptStats,daysUntil,isCorrect} from './engine.js';
import {concepts,C,domains,exercises,speaking,schedules} from './content.js';

const app=document.getElementById('app');
const title=document.getElementById('pageTitle');
let state=loadState();
let route='today';
let session=null;
let mediaRecorder=null,mediaChunks=[],recordingUrl=null,timerHandle=null,timerStarted=0;

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
function renderToday(){setTitle('Today');const ev=nextEvent();const due=reviewMix(exercises,state,10).length;const oral=ev?.title.includes('Oral');const academic=ev?.title.includes('Academic Project');const written=ev?.title.includes('Written Exam')||ev?.title.includes('Unit 4');app.innerHTML=card('<div class="kicker">Adaptive session</div><h2>'+esc(ev.title)+'</h2><p class="muted">'+daysUntil(ev.date)+' días · '+esc(ev.date)+'</p><div class="grid"><button class="primary" id="todayStart">Start '+state.settings.duration+' min</button><button class="secondary" id="reviewStart">Review due ('+due+')</button><button class="secondary" id="challengeStart">Challenge me</button><button class="secondary" id="speakStart">Speaking Studio</button></div>','hero')+(oral?card('<div class="kicker">Immediate priority</div><h3>Oral Midterm Lab</h3><p>Questions, narrative tenses, conditionals, agreement, chunks and productive transfer.</p><button class="primary" id="oralLab">Open Oral Lab</button>','urgent-card'):'')+(academic?card('<div class="kicker">Next assessment</div><h3>Academic Project Lab</h3><p>Thesis, signposting, hedging, sentence control and Q&A.</p><button class="primary" id="academicLab">Open Presentation Lab</button>','urgent-card'):'')+(written?card('<div class="kicker">Course preparation</div><h3>Unit 4 / Written Exam Lab</h3><p>Future forms, intensifiers and short for-and-against writing.</p><button class="primary" id="writtenLab">Open Written Lab</button>','urgent-card'):'')+card('<h3>How the engine works</h3><p>It prefers unseen exercises, active errors and due concepts. Correct items are normally replaced by new items testing the same structure.</p>');
 document.getElementById('todayStart').onclick=()=>startSession(todayMix(exercises,state,countForMinutes(state.settings.duration),{courseConcepts:ev.concepts}),'Today');
 document.getElementById('reviewStart').onclick=()=>startSession(reviewMix(exercises,state,10),'Review');
 document.getElementById('challengeStart').onclick=()=>startSession(challengeMix(exercises,state,10),'Challenge');
 document.getElementById('speakStart').onclick=()=>renderSpeaking();
 if(oral)document.getElementById('oralLab').onclick=renderOralLab;if(academic)document.getElementById('academicLab').onclick=renderAcademicLab;if(written)document.getElementById('writtenLab').onclick=renderWrittenLab;
}
function renderLearn(){setTitle('Learn');app.innerHTML='<div class="section-title">Concept library</div>'+concepts.sort((a,b)=>b.priority-a.priority).map(c=>card('<div class="row between"><div><div class="kicker">Priority '+c.priority+'</div><h3>'+esc(c.name)+'</h3></div>'+pill(c.id)+'</div><p>'+esc(c.summary)+'</p><button class="secondary learnBtn" data-id="'+c.id+'">Open</button>')).join('');document.querySelectorAll('.learnBtn').forEach(b=>b.onclick=()=>renderConcept(b.dataset.id))}
function renderConcept(cid){const c=C[cid];setTitle(c.name);app.innerHTML=card('<button class="ghost small-btn" id="backLearn">← Learn</button><h2>'+esc(c.name)+'</h2><p>'+esc(c.summary)+'</p><div class="example"><strong>Rule</strong><br>'+esc(c.rule)+'</div><h3>Examples</h3>'+c.examples.map(x=>'<div class="example">'+esc(x)+'</div>').join('')+'<button class="primary" id="practiceConcept">Practice this</button>');document.getElementById('backLearn').onclick=()=>nav('learn');document.getElementById('practiceConcept').onclick=()=>startSession(pickExercises(exercises,state,{concept:cid,count:12}),'Practice · '+c.name)}
function renderPractice(){setTitle('Practice');app.innerHTML=card('<h2>Choose your practice</h2><label>Content<select id="pConcept"><option value="mixed">Mixed</option>'+concepts.map(c=>'<option value="'+c.id+'">'+esc(c.name)+'</option>').join('')+'</select></label><label>Context<select id="pDomain"><option value="all">All contexts</option>'+domains.map(d=>'<option>'+d+'</option>').join('')+'</select></label><label>Length<select id="pCount"><option>8</option><option selected>12</option><option>20</option></select></label><button class="primary" id="pStart">Start practice</button>')+card('<h3>Production-first options</h3><div class="grid"><button class="secondary" id="guidedStart">Guided production</button><button class="secondary" id="freeStart">Free transfer</button></div>');document.getElementById('pStart').onclick=()=>startSession(pickExercises(exercises,state,{concept:document.getElementById('pConcept').value,domain:document.getElementById('pDomain').value,count:+document.getElementById('pCount').value}),'Practice');document.getElementById('guidedStart').onclick=()=>startSession(pickExercises(exercises,state,{count:12,transfer:'guided'}),'Guided production');document.getElementById('freeStart').onclick=()=>startSession(pickExercises(exercises,state,{count:8,transfer:'free'}),'Free transfer')}
function renderCourse(){setTitle('Course Path');const evs=currentEvents();const next=nextEvent();app.innerHTML=card('<div class="kicker">Current section</div><h2>'+esc(state.settings.section)+'</h2><p>Next: <strong>'+esc(next.title)+'</strong> · '+daysUntil(next.date)+' days</p><div class="study-pack"><button class="secondary" data-phase="prepare">Prepare</button><button class="secondary" data-phase="consolidate">Consolidate</button><button class="secondary" data-phase="transfer">Transfer test</button></div>')+'<div class="section-title">Timeline</div>'+evs.map(e=>card('<div class="row between"><div><strong>'+esc(e.date)+'</strong><h3>'+esc(e.title)+'</h3><div>'+e.concepts.slice(0,4).map(x=>pill(C[x]?.name||x)).join('')+'</div></div>'+(e.assessment?pill('ASSESSMENT','gold'):'')+'</div>')).join('');document.querySelectorAll('[data-phase]').forEach(b=>b.onclick=()=>startSession(eventPack(exercises,state,next,b.dataset.phase,12),next.title+' · '+b.dataset.phase))}
function renderProgress(){setTitle('Progress');const total=Object.values(state.seen).reduce((a,x)=>a+(x.attempts||0),0);const active=state.errors.filter(e=>!e.resolved);app.innerHTML=card('<div class="grid"><div class="metric"><strong>'+total+'</strong><span>attempts</span></div><div class="metric"><strong>'+Object.keys(state.seen).length+'</strong><span>unique items</span></div><div class="metric"><strong>'+active.length+'</strong><span>active errors</span></div><div class="metric"><strong>'+exercises.length+'</strong><span>available items</span></div></div>')+'<div class="section-title">Mastery by concept</div>'+concepts.map(c=>{const s=conceptStats(state,c.id);return card('<div class="row between"><strong>'+esc(c.name)+'</strong>'+pill(s.status)+'</div><div class="progressbar"><span style="width:'+s.mastery+'%"></span></div><div class="transfer-row"><span>Controlled</span><div class="progressbar"><span style="width:'+s.rates.controlled+'%"></span></div><strong>'+s.rates.controlled+'%</strong></div><div class="transfer-row"><span>Guided</span><div class="progressbar"><span style="width:'+s.rates.guided+'%"></span></div><strong>'+s.rates.guided+'%</strong></div><div class="transfer-row"><span>Transfer</span><div class="progressbar"><span style="width:'+s.rates.free+'%"></span></div><strong>'+s.rates.free+'%</strong></div>')}).join('')+(active.length?'<div class="section-title">Error Bank</div>'+active.slice(0,10).map(e=>card('<strong>'+esc(C[e.concept]?.name||e.concept)+'</strong><p>'+esc(e.prompt)+'</p><p class="small">Your answer: '+esc(e.userAnswer)+'<br>Correct: '+esc(e.correctAnswer)+'</p><button class="secondary repairBtn" data-c="'+e.concept+'">Repair this area</button>')).join(''):'');document.querySelectorAll('.repairBtn').forEach(b=>b.onclick=()=>startSession(pickExercises(exercises,state,{concept:b.dataset.c,count:8}),'Error repair'))}

function startSession(items,label){if(!items.length){alert('No exercises available for this selection yet.');return}session={items,index:0,correct:0,label,log:[]};renderExercise()}
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

function finishSession(){const pct=Math.round(session.correct/session.items.length*100);state.sessions.unshift({date:new Date().toISOString(),label:session.label,total:session.items.length,correct:session.correct,log:session.log});state.sessions=state.sessions.slice(0,50);saveState(state);app.innerHTML=card('<div class="kicker">Session complete</div><h2>'+pct+'%</h2><p>'+session.correct+' / '+session.items.length+' correct.</p><p class="muted">The engine will reuse the structure before it reuses the exact successful item.</p><button class="primary" id="homeAfter">Back to Today</button>','hero');document.getElementById('homeAfter').onclick=()=>nav('today')}

function renderOralLab(){setTitle('Oral Midterm Lab');const routeDays=[['D−5','Questions + agreement'],['D−4','Narrative tenses'],['D−3','Conditionals + chunks'],['D−2','Integrated speaking'],['D−1','Full rehearsal']];app.innerHTML=card('<div class="kicker">Oral Midterm</div><h2>Productive control under pressure</h2><p>This is a personal practice lab based on course content and your diagnostic priorities; it is not a reconstruction of the official exam.</p><div class="grid"><button class="primary" id="oralMix">10 min warm-up</button><button class="secondary" id="oralSpeak">Speaking bank</button><button class="secondary" id="storyLab">Unit 3 Story Lab</button><button class="secondary" id="oralTransfer">Free transfer</button></div>')+card('<h3>Five-day route</h3>'+routeDays.map(x=>'<div class="route-day"><strong>'+x[0]+'</strong><div>'+x[1]+'</div></div>').join(''))+card('<h3>Skill drills</h3><div class="grid">'+['questions','narrative','conditionals','usedto','agreement','prepositions'].map(c=>'<button class="secondary oralDrill" data-c="'+c+'">'+esc(C[c].name)+'</button>').join('')+'</div>');document.getElementById('oralMix').onclick=()=>startSession(pickExercises(exercises,state,{concepts:['questions','narrative','conditionals','usedto','agreement','prepositions'],count:12}),'Oral warm-up');document.getElementById('oralSpeak').onclick=()=>renderSpeaking(['questions','narrative','conditionals','usedto','agreement','prepositions']);document.getElementById('storyLab').onclick=renderStoryLab;document.getElementById('oralTransfer').onclick=()=>startSession(pickExercises(exercises,state,{concepts:['questions','narrative','conditionals','usedto','prepositions'],transfer:'free',count:8}),'Oral · free transfer');document.querySelectorAll('.oralDrill').forEach(b=>b.onclick=()=>startSession(pickExercises(exercises,state,{concept:b.dataset.c,count:10}),'Oral drill · '+C[b.dataset.c].name))}


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
  app.innerHTML=card('<div class="kicker">Unit 4</div><h2>Future system + short academic writing</h2><p>Practice functional choice between schedules, arrangements, predictions, ongoing future actions and completion before a future point.</p><div class="grid"><button class="primary" id="futureDrill">Future forms drill</button><button class="secondary" id="futureTransfer">Future transfer</button><button class="secondary" id="writingSprint">Writing sprint</button><button class="secondary" id="futureSpeak">Future speaking</button></div>')+card('<h3>Future map</h3><div class="example"><strong>Schedule:</strong> The seminar starts at 9.</div><div class="example"><strong>Arrangement:</strong> I am meeting my supervisor tomorrow.</div><div class="example"><strong>In progress:</strong> At 10, I will be presenting.</div><div class="example"><strong>Completed:</strong> By Friday, I will have finished.</div><div class="example"><strong>Duration:</strong> By December, I will have been studying English for four months.</div>');
  document.getElementById('futureDrill').onclick=()=>startSession(pickExercises(exercises,state,{concept:'future',count:14}),'Unit 4 · future forms');
  document.getElementById('futureTransfer').onclick=()=>startSession(pickExercises(exercises,state,{concept:'future',transfer:'free',count:6}),'Unit 4 · future transfer');
  document.getElementById('writingSprint').onclick=renderWritingSprint;
  document.getElementById('futureSpeak').onclick=()=>renderSpeaking(['future']);
}

function renderWritingSprint(){
  setTitle('Writing Sprint');
  const prompts=[
    'AI will improve higher education more than it will harm it.',
    'Automation will make academic work more creative.',
    'Digital platforms strengthen democratic participation.',
    'Future cities should restrict private car use.'
  ];
  const p=prompts[Math.floor(Math.random()*prompts.length)];
  app.innerHTML=card('<div class="kicker">60–90 words</div><h2>'+esc(p)+'</h2><p>Write one compact argument block: claim → reason → example → cautious conclusion.</p><textarea class="input textarea" id="writingText" placeholder="Write here…"></textarea><button class="primary" id="writingCheck">Open self-check</button><div id="writingFeedback"></div>');
  document.getElementById('writingCheck').onclick=()=>{
    const txt=document.getElementById('writingText').value.trim();
    document.getElementById('writingFeedback').innerHTML='<div class="feedback"><h3>Self-check</h3><label class="check-line"><input type="checkbox">Clear claim</label><label class="check-line"><input type="checkbox">Reason or evidence</label><label class="check-line"><input type="checkbox">Example</label><label class="check-line"><input type="checkbox">Hedging or cautious conclusion</label><div class="example"><strong>Useful frame:</strong> While it is true that…, the evidence suggests that… One possible explanation is… Therefore, it is likely that…</div><button class="secondary" id="saveWriting">Save locally</button></div>';
    document.getElementById('saveWriting').onclick=()=>{state.sessions.unshift({date:new Date().toISOString(),label:'Writing Sprint',type:'writing',prompt:p,text:txt});state.sessions=state.sessions.slice(0,50);saveState(state);alert('Writing sprint saved locally.')};
  };
}

function renderAcademicLab(){setTitle('Academic Project Lab');app.innerHTML=card('<div class="kicker">Academic Project Presentation</div><h2>Argument + sentence control + Q&A</h2><p>Practice the language needed to introduce a thesis, organize an argument, hedge claims and respond without losing the turn.</p><div class="grid"><button class="primary" id="academicMix">Grammar + chunks</button><button class="secondary" id="academicSpeak">Presentation speaking</button></div>')+card('<h3>Useful frames</h3><div class="example">My main argument is that…</div><div class="example">The first point concerns…</div><div class="example">The evidence suggests that…</div><div class="example">While it is true that…, I would argue that…</div><div class="example">What I mean is… / Let me rephrase that…</div>')+card('<h3>Three-step rehearsal</h3><p><strong>1.</strong> 90 seconds: explain one claim.</p><p><strong>2.</strong> 45 seconds: answer an objection.</p><p><strong>3.</strong> 30 seconds: reformulate your answer more precisely.</p>');document.getElementById('academicMix').onclick=()=>startSession(pickExercises(exercises,state,{concepts:['questions','agreement','prepositions','presentperfect','verbpatterns'],count:12}),'Academic Project · language');document.getElementById('academicSpeak').onclick=()=>renderSpeaking(['questions','agreement','prepositions','presentperfect','future'])}

function renderSpeaking(filter=null){setTitle('Speaking Studio');let pool=speaking.filter(p=>!filter||filter.includes(p.concept));const p=pool[Math.floor(Math.random()*pool.length)];app.innerHTML=card('<div class="row between">'+pill(C[p.concept].name)+pill(p.seconds+' sec','gold')+'</div><div class="exercise-prompt">'+esc(p.prompt)+'</div><div>'+p.targets.map(x=>pill(x)).join('')+'</div><div class="big-timer" id="sTimer">'+p.seconds+'</div><div class="grid"><button class="primary" id="recordBtn">Start recording</button><button class="secondary" id="newPrompt">New prompt</button></div><div id="audioBox"></div><div class="divider"></div><h3>Self-audit</h3>'+p.targets.map((x,i)=>'<label class="check-line"><input type="checkbox" class="targetCheck" value="'+i+'">'+esc(x)+'</label>').join('')+'<button class="secondary" id="saveSpeak">Save self-audit</button>');document.getElementById('newPrompt').onclick=()=>renderSpeaking(filter);document.getElementById('recordBtn').onclick=()=>toggleRecording(p);document.getElementById('saveSpeak').onclick=()=>{const checks=[...document.querySelectorAll('.targetCheck:checked')].map(x=>x.value);const row=recordSpeaking(state,p,checks);alert('Self-audit saved: '+row.coverage+'% target coverage. This now counts as free-transfer evidence.')}}
async function toggleRecording(p){const btn=document.getElementById('recordBtn');if(mediaRecorder&&mediaRecorder.state==='recording'){mediaRecorder.stop();clearInterval(timerHandle);btn.textContent='Start recording';btn.classList.remove('recording');return}try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});mediaChunks=[];mediaRecorder=new MediaRecorder(stream);mediaRecorder.ondataavailable=e=>mediaChunks.push(e.data);mediaRecorder.onstop=()=>{stream.getTracks().forEach(t=>t.stop());if(recordingUrl)URL.revokeObjectURL(recordingUrl);recordingUrl=URL.createObjectURL(new Blob(mediaChunks,{type:mediaRecorder.mimeType}));document.getElementById('audioBox').innerHTML='<audio controls src="'+recordingUrl+'"></audio>'};mediaRecorder.start();timerStarted=Date.now();btn.textContent='Stop recording';btn.classList.add('recording');timerHandle=setInterval(()=>{const left=Math.max(0,p.seconds-Math.floor((Date.now()-timerStarted)/1000));document.getElementById('sTimer').textContent=left;if(!left&&mediaRecorder.state==='recording')mediaRecorder.stop()},250)}catch{alert('Microphone access is unavailable. You can still use the timer and self-audit.') }}

if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
render();
