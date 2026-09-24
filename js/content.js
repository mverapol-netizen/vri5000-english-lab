const concepts=[
{id:'questions',name:'Question forms',priority:10,summary:'Subject/object questions, indirect questions and questions with prepositions.',rule:'Use do/does/did in object questions. In subject questions, who/what replaces the subject, so no do/does/did is normally used.',examples:['Who wrote the report?','What did the researcher write?','Could you tell me where the seminar is?']},
{id:'agreement',name:'Subject–verb agreement',priority:8,summary:'Keep subject and verb aligned even in long sentences.',rule:'The verb agrees with the head of the subject, not the nearest noun.',examples:['The evidence suggests a pattern.','The results suggest a pattern.','A series of reforms has changed the system.']},
{id:'narrative',name:'Narrative tenses',priority:10,summary:'Past simple, past progressive, past perfect and past perfect progressive.',rule:'Past simple = event; past progressive = background; past perfect = earlier event; past perfect progressive = prior duration.',examples:['She was reading when the lights went out.','Someone had removed the file before she arrived.','They had been waiting for hours.']},
{id:'usedto',name:'Used to family',priority:10,summary:'Past habits, past states, familiarity and adaptation.',rule:'used to + base; would + base for repeated past actions; be/get used to + noun or -ing.',examples:['I used to read less.','I would study at night.','I am used to reading long papers.','I am getting used to speaking in English.']},
{id:'presentperfect',name:'Present perfect system',priority:9,summary:'Result, experience, frequency, duration and ongoing activity.',rule:'Present perfect often emphasizes result/number; present perfect progressive emphasizes activity/duration.',examples:['I have written three pages.','I have been writing all morning.']},
{id:'conditionals',name:'Conditionals & alternatives',priority:9,summary:'unless, as long as, provided, in case and as soon as.',rule:'Unless = if not; provided/as long as = condition; in case = precaution; as soon as + present for future reference.',examples:['Unless institutions adapt, trust will decline.','Take notes in case you forget.','As soon as the results arrive, I will update the table.']},
{id:'future',name:'Future forms',priority:9,summary:'Schedules, arrangements, intentions, predictions and future perfect/progressive.',rule:'Present simple for schedules, present progressive for arrangements, future perfect for completion before a future point.',examples:['The class starts at 9.','I am meeting my supervisor tomorrow.','By Friday, I will have finished the draft.']},
{id:'verbpatterns',name:'Verb patterns',priority:8,summary:'-ing, to-infinitive and modal + base.',rule:'Modals + base; avoid/suggest + -ing; decide/plan + to-infinitive; need + object + to-infinitive.',examples:['They could reduce the risk.','They suggested changing the rule.','We decided to revise the draft.']},
{id:'prepositions',name:'Prepositions & collocations',priority:8,summary:'High-frequency dependent prepositions and academic chunks.',rule:'Learn the whole chunk: depend on, interested in, responsible for, impact on, highly likely.',examples:['The outcome depends on institutional capacity.','She is responsible for the analysis.','The reform had an impact on trust.']},
{id:'passivecausative',name:'Passive & causative',priority:6,summary:'Passive voice and have/get something done.',rule:'Passive = be + past participle. Causative = have/get + object + past participle.',examples:['The data were collected in 2025.','We had the document translated.']},
{id:'academicdiscourse',name:'Academic discourse',priority:8,summary:'Signposting, hedging, concession, reformulation and Q&A for academic presentations and writing.',rule:'Use explicit discourse frames to organize claims, soften certainty, concede objections and repair your wording without abandoning the turn.',examples:['My main argument is that…','The evidence suggests that…','While it is true that…, I would argue that…','What I mean is…','Let me rephrase that…']}
];
const C=Object.fromEntries(concepts.map(x=>[x.id,x]));
const domains=['politics','philosophy','sociology','horror','academic','everyday'];
const frames=['In a seminar: ','In a policy memo: ','During an interview: ','In an archive note: ','In a conversation: '];
const people=['the researcher','the committee','the journalist','the philosopher','the student','the analyst'];
const objects=['the report','the proposal','the argument','the evidence','the manuscript','the dataset'];
const verbs=[['write','wrote','written'],['review','reviewed','reviewed'],['challenge','challenged','challenged'],['change','changed','changed'],['remove','removed','removed'],['analyze','analyzed','analyzed']];
const exercise=(x)=>({difficulty:2,domain:'academic',transfer:'controlled',type:'mcq',...x});
let exercises=[];
let seq=0; const id=(c)=>c+'_'+String(++seq).padStart(4,'0');

function addQuestionBank(){
  people.forEach((p,i)=>{const [base,past]=verbs[i%verbs.length],obj=objects[i%objects.length];
    exercises.push(exercise({id:id('q'),concept:'questions',domain:domains[i%domains.length],prompt:p.charAt(0).toUpperCase()+p.slice(1)+' '+past+' '+obj+'. Ask about the person.',options:['Who '+past+' '+obj+'?','Who did '+base+' '+obj+'?','What did '+p+' '+base+'?'],answer:'Who '+past+' '+obj+'?',explanation:'Who is the subject of the question, so no do/did is needed.',misconception:'unnecessary_auxiliary'}));
    exercises.push(exercise({id:id('q'),concept:'questions',domain:domains[(i+2)%domains.length],prompt:p.charAt(0).toUpperCase()+p.slice(1)+' '+past+' '+obj+'. Ask about the object.',options:['What did '+p+' '+base+'?','What '+past+' '+obj+'?','Who did '+base+' '+obj+'?'],answer:'What did '+p+' '+base+'?',explanation:'This is an object question: use did + subject + base verb.',misconception:'missing_auxiliary'}));
  });
  ['seminar starts','archive closes','results arrive','meeting ends','course begins','presentation starts'].forEach((x,i)=>exercises.push(exercise({id:id('q'),concept:'questions',domain:domains[i%6],prompt:'Choose the polite indirect question.',options:['Could you tell me when the '+x+'?','Could you tell me when does the '+x+'?','Could you tell me when the '+x+' does?'],answer:'Could you tell me when the '+x+'?',explanation:'Indirect questions use statement word order and do not use do/does/did inversion.',misconception:'indirect_inversion'})));
}
function addAgreement(){
  const pairs=[['The evidence','suggests'],['The results','suggest'],['A series of reforms','has'],['The reforms','have'],['Each of the cases','illustrates'],['The arguments in the article','raise'],['Public trust','remains'],['These findings','indicate']];
  for(let r=0;r<4;r++) pairs.forEach((p,i)=>exercises.push(exercise({id:id('agr'),concept:'agreement',domain:domains[(i+r)%6],prompt:frames[r%frames.length]+p[0]+' ___ a relevant point.',options:[p[1],p[1].endsWith('s')?p[1].slice(0,-1):p[1]+'s'],answer:p[1],explanation:'The verb agrees with the head of the subject.',misconception:'agreement'})));
}
function addNarrative(){
  const rows=[
    ['the researcher arrived','someone removed the file','When the researcher arrived, someone had removed the file.'],
    ['the police reached the building','the suspect left','By the time the police reached the building, the suspect had left.'],
    ['the meeting began','the team prepared the slides','Before the meeting began, the team had prepared the slides.'],
    ['the lights went out','she read the manuscript','She was reading the manuscript when the lights went out.'],
    ['the alarm rang','they discuss the proposal','They were discussing the proposal when the alarm rang.'],
    ['the door opened','he wait for an hour','He had been waiting for an hour when the door opened.']
  ];
  for(let r=0;r<5;r++) rows.forEach((x,i)=>exercises.push(exercise({id:id('nar'),concept:'narrative',domain:domains[(i+r)%6],type:'mcq',transfer:r<2?'controlled':'guided',prompt:frames[r%frames.length]+'Choose the sentence that best expresses the sequence: '+x[0]+'; earlier/background: '+x[1]+'.',options:[x[2],x[2].replace(/had been|had|was|were/g,'').replace(/  +/g,' '),x[2].replace('had ','was ')],answer:x[2],explanation:'Choose the tense according to the temporal relation: event, background, earlier event or prior duration.',misconception:'narrative_sequence'})));
}
function addUsedTo(){
  const rows=[
    ['past state','I ___ shy when I was younger.','used to be','would be'],
    ['past repeated action','When I was an undergraduate, I ___ study at night.','would','am used to'],
    ['familiar now','I ___ reading long articles in English.','am used to','used to'],
    ['adaptation','I am ___ speaking spontaneously in seminars.','getting used to','used to'],
    ['familiar now','Researchers are ___ working with incomplete evidence.','used to','use to'],
    ['past habit','I ___ avoid long presentations.','used to','am used to']
  ];
  for(let r=0;r<5;r++) rows.forEach((x,i)=>exercises.push(exercise({id:id('ut'),concept:'usedto',domain:domains[(i+r)%6],transfer:r<2?'controlled':'guided',prompt:frames[r%frames.length]+x[1],options:[x[2],x[3]],answer:x[2],explanation:x[0]+': '+C.usedto.rule,misconception:'usedto_family'})));
}
function addPresentPerfect(){
  const rows=[
    ['result/number','I ___ three pages this morning.','have written','have been writing'],
    ['duration/activity','I ___ all morning.','have been writing','have written'],
    ['frequency','She ___ the archive twice this month.','has visited','has been visiting'],
    ['duration','They ___ data for six months.','have been collecting','have collected'],
    ['state verb','I ___ her for years.','have known','have been knowing'],
    ['experience','I ___ this paper in English before.','have never presented','have never been presenting']
  ];
  for(let r=0;r<4;r++) rows.forEach((x,i)=>exercises.push(exercise({id:id('pp'),concept:'presentperfect',domain:domains[(i+r)%6],prompt:frames[r%frames.length]+x[1],options:[x[2],x[3]],answer:x[2],explanation:'Focus: '+x[0]+'. '+C.presentperfect.rule,misconception:'perfect_aspect'})));
}
function addConditionals(){
  const rows=[
    ['___ institutions adapt, trust will decline.','Unless','Unless not'],
    ['You can use the archive ___ you follow the rules.','as long as','in case'],
    ['Bring a copy ___ the internet fails.','in case','unless'],
    ['___ the evidence is strong, the claim is plausible.','Provided that','As soon as'],
    ['___ the results arrive, I will update the table.','As soon as','As soon as will'],
    ['We will continue ___ the committee objects.','unless','provided']
  ];
  for(let r=0;r<5;r++) rows.forEach((x,i)=>exercises.push(exercise({id:id('cond'),concept:'conditionals',domain:domains[(i+r)%6],transfer:r<3?'controlled':'guided',prompt:frames[r%frames.length]+x[0],options:[x[1],x[2]],answer:x[1],explanation:C.conditionals.rule,misconception:'conditional_alternative'})));
}
function addFuture(){
  const rows=[
    ['According to the timetable, the class ___ at 9.','starts','will be starting'],
    ['I ___ my supervisor tomorrow at 10; it is arranged.','am meeting','will meet'],
    ['By Friday, I ___ the draft.','will have finished','will be finishing'],
    ['At 9 tomorrow, I ___ my paper.','will be presenting','will have presented'],
    ['By December, I ___ English for four months.','will have been studying','will have studied'],
    ['Look at those clouds. It ___.','is going to rain','will have rained']
  ];
  for(let r=0;r<4;r++) rows.forEach((x,i)=>exercises.push(exercise({id:id('fut'),concept:'future',domain:domains[(i+r)%6],prompt:frames[r%frames.length]+x[0],options:[x[1],x[2]],answer:x[1],explanation:C.future.rule,misconception:'future_choice'})));
}
function addVerbPatterns(){
  const rows=[['They could ___ the risk.','reduce','reducing'],['They suggested ___ the rule.','changing','to change'],['We decided ___ the proposal.','to revise','revising'],['Researchers should avoid ___ the evidence.','overstating','to overstate'],['My supervisor needs me ___ the file.','to send','send'],['They considered ___ the project.','postponing','to postpone']];
  for(let r=0;r<4;r++) rows.forEach((x,i)=>exercises.push(exercise({id:id('vp'),concept:'verbpatterns',domain:domains[(i+r)%6],prompt:frames[r%frames.length]+x[0],options:[x[1],x[2]],answer:x[1],explanation:C.verbpatterns.rule,misconception:'verb_pattern'})));
}
function addPrepositions(){
  const rows=[['The result depends ___ institutional capacity.','on','about'],['She is responsible ___ the analysis.','for','of'],['They are concerned ___ declining trust.','about','of'],['I am interested ___ political theory.','in','on'],['The reform had an impact ___ participation.','on','in'],['The outcome is ___ likely.','highly','deeply']];
  for(let r=0;r<5;r++) rows.forEach((x,i)=>exercises.push(exercise({id:id('prep'),concept:'prepositions',domain:domains[(i+r)%6],prompt:frames[r%frames.length]+x[0],options:[x[1],x[2]],answer:x[1],explanation:'Learn the whole chunk: '+x[0].replace('___',x[1]),misconception:'dependent_preposition'})));
}
function addPassive(){
  const rows=[['The data ___ in 2025.','were collected','collected'],['The law ___ by Congress last month.','was approved','approved'],['The results ___ next week.','will be published','will publish'],['We ___ the document translated yesterday.','had','were'],['She ___ her laptop repaired.','got','was'],['The interviews ___ before the analysis began.','had been completed','had completed']];
  for(let r=0;r<4;r++) rows.forEach((x,i)=>exercises.push(exercise({id:id('pc'),concept:'passivecausative',domain:domains[(i+r)%6],prompt:frames[r%frames.length]+x[0],options:[x[1],x[2]],answer:x[1],explanation:C.passivecausative.rule,misconception:'passive_causative'})));
}
addQuestionBank();addAgreement();addNarrative();addUsedTo();addPresentPerfect();addConditionals();addFuture();addVerbPatterns();addPrepositions();addPassive();


const repairRows=[
['questions','Which award he won?','Which award did he win?','Object questions in the simple past require did + subject + base verb.'],
['questions','Who did write the report?','Who wrote the report?','Who is the subject, so did is unnecessary.'],
['agreement','Universities has to adapt.','Universities have to adapt.','Plural subject universities takes have.'],
['agreement','Institutional rules determines outcomes.','Institutional rules determine outcomes.','Plural subject rules takes determine.'],
['agreement','Individuality have a social dimension.','Individuality has a social dimension.','Singular subject individuality takes has.'],
['verbpatterns','Institutions could suffering from low trust.','Institutions could suffer from low trust.','A modal is followed by the base form.'],
['verbpatterns','He needs I take photographs.','He needs me to take photographs.','Use need + object + to-infinitive.'],
['usedto','I am used to speak English in seminars.','I am used to speaking English in seminars.','Be used to is followed by a noun or -ing form.'],
['usedto','I am getting used to read long papers.','I am getting used to reading long papers.','Get used to is followed by a noun or -ing form.'],
['prepositions','The result depends about institutional capacity.','The result depends on institutional capacity.','The fixed pattern is depend on.'],
['prepositions','I think in AI as a political problem.','I think of AI as a political problem.','Use think of X as Y.'],
['prepositions','We need to think in institutional rules.','We need to think about institutional rules.','Use think about when considering a topic.'],
['prepositions','This outcome is deeply likely.','This outcome is highly likely.','The standard collocation is highly likely.'],
['prepositions','I need to repass the material.','I need to review the material.','Review the material is the natural academic expression.'],
['prepositions','Universities should explode AI potential.','Universities should harness AI’s potential.','Harness the potential is the natural collocation here.']
];
for(let r=0;r<2;r++) repairRows.forEach((x,i)=>{
  exercises.push(exercise({
    id:id('repair'),concept:x[0],domain:domains[(i+r)%domains.length],transfer:r?'guided':'controlled',
    prompt:frames[(r+2)%frames.length]+'Choose the best correction of: “'+x[1]+'”',
    options:[x[2],x[1],x[2].replace(/\.$/,'')+' actually.'],
    answer:x[2],explanation:x[3],misconception:'personal_error_repair'
  }));
});

const contrastRows=[
['questions','Which pair correctly contrasts a subject question and an object question?','Who wrote the report? / What did she write?','Who did write the report? / What she wrote?','Subject questions do not normally use do/did; object questions do.'],
['narrative','Which pair correctly contrasts background and event?','She was reading when the lights went out.','She had read when the lights were going out.','Past progressive gives background; past simple marks the interrupting event.'],
['narrative','Which sentence clearly marks an earlier past event?','Someone had removed the file before she arrived.','Someone removed the file before she had arrived.','Past perfect marks the earlier event relative to a later past reference point.'],
['usedto','Which contrast is correct?','I used to read less. / I am used to reading long papers now.','I was used to read less. / I am used to read long papers now.','Used to + base describes a past state/habit; be used to + -ing describes familiarity.'],
['presentperfect','Which contrast best expresses result versus duration?','I have written three pages. / I have been writing all morning.','I have been writing three pages. / I have written all morning.','Present perfect often focuses on result/number; progressive on activity/duration.'],
['conditionals','Which pair uses unless and in case correctly?','Unless you prepare, you may struggle. / Take notes in case you forget.','Unless you do not prepare, you may struggle. / Take notes unless you forget.','Unless means if not; in case introduces a precaution.'],
['future','Which contrast is correct for schedule versus arrangement?','The seminar starts at 9. / I am meeting my supervisor at 10.','The seminar is meeting at 9. / I start my supervisor at 10.','Present simple is typical for timetables; present progressive for arrangements.'],
['future','Which sentence expresses completion before a future point?','By Friday, I will have finished the draft.','By Friday, I will be finishing the draft yesterday.','Future perfect marks completion before a specified future time.'],
['verbpatterns','Which pair uses the verb patterns correctly?','They suggested changing the rule. / They decided to revise it.','They suggested to change the rule. / They decided revising it.','Suggest takes -ing; decide takes to-infinitive.'],
['prepositions','Which pair contains the natural collocations?','depend on / impact on','depend about / impact in','These combinations are learned as chunks.'],
['passivecausative','Which pair contrasts passive and causative correctly?','The report was translated. / We had the report translated.','The report translated. / We had translated the report by someone.','Passive focuses on what was done; causative have/get expresses arranging for it to be done.']
];
for(let r=0;r<3;r++) contrastRows.forEach((x,i)=>{
  exercises.push(exercise({
    id:id('contrast'),concept:x[0],domain:domains[(i+r+1)%domains.length],transfer:r===0?'controlled':'guided',
    prompt:frames[r%frames.length]+x[1],
    options:[x[2],x[3]],answer:x[2],explanation:x[4],misconception:'contrast'
  }));
});


const oralSprintRows=[
['questions','Choose the natural question with a final preposition.',['Who are you talking to?','To who are you talking?','Who you are talking to?'],'Who are you talking to?','In ordinary English, the preposition commonly stays at the end of the question.'],
['questions','Choose the correct question.',['What are you responsible for?','What do you responsible for?','For what you are responsible?'],'What are you responsible for?','Be responsible for uses be, so no do auxiliary is added.'],
['questions','Choose the correct negative question.',['Why didn’t the committee respond?','Why the committee didn’t respond?','Why didn’t the committee responded?'],'Why didn’t the committee respond?','Use did + subject + base verb in a negative object/why question.'],
['questions','Choose the correct negative subject question.',['Who didn’t attend the meeting?','Who not attended the meeting?','Who did not attended the meeting?'],'Who didn’t attend the meeting?','Negative subject questions use the negative auxiliary: Who didn’t…?'],
['questions','Choose the polite indirect question.',['Could you tell me what the results mean?','Could you tell me what do the results mean?','Could you tell me what mean the results?'],'Could you tell me what the results mean?','Indirect questions use statement word order.'],
['questions','Choose the polite indirect question.',['Do you know where the archive is?','Do you know where is the archive?','Do you know where does the archive be?'],'Do you know where the archive is?','After Do you know…, use statement word order.'],
['questions','Choose the natural question.',['Which theory are you referring to?','Which theory do you referring to?','To which theory you refer?'],'Which theory are you referring to?','The progressive question uses be + subject + -ing, with the preposition at the end.'],
['questions','Ask about the subject: Someone raised the objection.',['Who raised the objection?','Who did raise the objection?','What did someone raise?'],'Who raised the objection?','Who replaces the subject, so no do/did is needed.'],
['questions','Ask about the object: The reviewer criticized the methodology.',['What did the reviewer criticize?','What criticized the reviewer?','Who did criticize the methodology?'],'What did the reviewer criticize?','Object question: what + did + subject + base verb.'],
['questions','Choose the correct present-perfect question.',['Why haven’t they published the results?','Why they haven’t published the results?','Why haven’t they publish the results?'],'Why haven’t they published the results?','Invert have/has with the subject; keep the past participle.'],
['questions','Ask about the subject: Someone has changed the draft.',['Who has changed the draft?','Who did change the draft?','Who has change the draft?'],'Who has changed the draft?','Who is the subject; retain has + past participle.'],
['questions','Ask about the object: The team has changed the conclusion.',['What has the team changed?','What the team has changed?','Who has changed the conclusion?'],'What has the team changed?','Object question with present perfect: what + has + subject + past participle.'],

['narrative','The archive was quiet. The researcher ___ notes when the alarm rang.',['was taking','had taken','took'],'was taking','Past progressive supplies the background action interrupted by the alarm.'],
['narrative','By the time the journalist arrived, officials ___ the result.',['had announced','were announcing yesterday','have announced'],'had announced','Past perfect marks an event completed before another past event.'],
['narrative','The team ___ for three hours when the server finally came back online.',['had been waiting','was waited','has waited'],'had been waiting','Past perfect progressive expresses duration continuing up to a past reference point.'],
['narrative','While the witnesses ___, the lights suddenly went out.',['were speaking','had spoken','have spoken'],'were speaking','Use past progressive for an action in progress when a shorter event occurs.'],
['narrative','The committee discovered that someone ___ the figures before the meeting.',['had altered','was alter','has altered'],'had altered','The alteration occurred before the committee discovered it.'],
['narrative','She opened the envelope and ___ the handwritten note.',['found','had found before she opened it','was finding'],'found','Sequential completed events normally use past simple.'],
['narrative','The police entered the office. Papers ___ across the floor and a computer was still running.',['were lying','had lain tomorrow','have lain'],'were lying','Past progressive describes the scene/background at that past moment.'],
['narrative','He was exhausted because he ___ the files all night.',['had been reviewing','reviewed tomorrow','has reviewed'],'had been reviewing','Past perfect progressive explains prior duration causing a past state.'],
['narrative','When the debate began, both candidates ___ their opening statements already.',['had prepared','were prepare','have preparing'],'had prepared','Past perfect marks preparation completed before the debate began.'],
['narrative','The phone rang while I ___ an article about the crisis.',['was reading','had read before the phone existed','have read'],'was reading','Past progressive gives the ongoing background action.'],
['narrative','After the journalist ___ the source, she published the story.',['had verified','was verify','has verifying'],'had verified','Past perfect can make the prior sequence explicit before a later past event.'],
['narrative','They ___ the problem for weeks before they finally found the cause.',['had been investigating','were investigated','have investigate'],'had been investigating','Past perfect progressive emphasizes the duration before the discovery.'],

['conditionals','___ the electoral authority remains independent, the process can retain credibility.',['As long as','In case','Unless not'],'As long as','As long as introduces a condition that must continue to hold.'],
['conditionals','The reform can proceed ___ judicial review remains available.',['provided that','in case','unless not'],'provided that','Provided that means on the condition that.'],
['conditionals','Keep an offline copy ___ the platform goes down.',['in case','as long as','unless'],'in case','In case introduces a precaution against a possible event.'],
['conditionals','___ the evidence improves, we should not make a stronger claim.',['Unless','Provided','As soon as will'],'Unless','Unless means if not.'],
['conditionals','___ the committee publishes the report, we will update the presentation.',['As soon as','As soon as will','In case will'],'As soon as','Use present simple after as soon as for future reference.'],
['conditionals','You may use the dataset ___ you cite it correctly.',['as long as','unless','in case'],'as long as','As long as expresses a condition for permission.'],
['conditionals','We should prepare a backup slide ___ someone asks about the method.',['in case','unless','provided'],'in case','The backup is a precaution for a possible question.'],
['conditionals','The argument works ___ we accept the distinction between autonomy and independence.',['provided that','unless not','in case'],'provided that','Provided that introduces a necessary assumption/condition.'],
['conditionals','___ institutions respond quickly, distrust may deepen.',['Unless','As long as','In case'],'Unless','Unless institutions respond = if institutions do not respond.'],
['conditionals','___ I finish the draft, I’ll send it to my supervisor.',['As soon as','As soon as will','Provided will'],'As soon as','Future-time clauses normally use present simple after as soon as.'],

['prepositions','Choose the natural academic phrase.',['concerned about democratic erosion','concerned of democratic erosion','concerned on democratic erosion'],'concerned about democratic erosion','The dependent preposition is concerned about.'],
['prepositions','Choose the natural academic phrase.',['responsible for implementation','responsible of implementation','responsible on implementation'],'responsible for implementation','The fixed pattern is responsible for.'],
['prepositions','Choose the natural academic phrase.',['aware of the limitation','aware about the limitation','aware in the limitation'],'aware of the limitation','The fixed pattern is aware of.'],
['prepositions','Choose the natural academic phrase.',['sensitive to context','sensitive of context','sensitive in context'],'sensitive to context','Sensitive to is the standard dependent-preposition pattern.'],
['prepositions','Choose the natural noun + preposition combination.',['a reason for the decline','a reason of the decline','a reason on the decline'],'a reason for the decline','Use reason for + noun.'],
['prepositions','Choose the natural noun + preposition combination.',['the possibility of reform','the possibility for reforming in this structure','the possibility about reform'],'the possibility of reform','Possibility of is a common noun-preposition pattern.'],
['prepositions','Choose the natural phrase.',['a risk of democratic erosion','a risk on democratic erosion','a risk about democratic erosion'],'a risk of democratic erosion','Use risk of + noun/-ing.'],
['prepositions','Choose the natural phrase.',['have an impact on participation','have an impact in participation','have an impact of participation'],'have an impact on participation','Impact on is the standard collocation.'],
['prepositions','Choose the natural collocation.',['deeply concerned','highly concernedly','bitterly likely'],'deeply concerned','Deeply concerned is a common adverb + adjective collocation.'],
['prepositions','Choose the natural collocation.',['absolutely certain','deeply certain','highly certained'],'absolutely certain','Absolutely certain is a standard intensifying collocation.'],

['agreement','Choose the correct verb: A series of recent surveys ___ the same tendency.',['shows','show'],'shows','The head noun is series, which is singular.'],
['agreement','Choose the correct verb: The findings from the survey ___ substantial variation.',['indicate','indicates'],'indicate','The head noun findings is plural.'],
['agreement','Choose the correct verb: Each of the institutions ___ a different procedure.',['uses','use'],'uses','Each is grammatically singular.'],
['agreement','Choose the correct verb: The quality of the interviews ___ important.',['is','are'],'is','The head noun quality is singular; interviews is inside an of-phrase.'],
['agreement','Choose the correct verb: The interviews conducted last week ___ useful evidence.',['provide','provides'],'provide','The head noun interviews is plural.'],
['agreement','Choose the correct verb: Public confidence in electoral institutions ___ over time.',['changes','change'],'changes','The head noun confidence is singular.'],
['agreement','Choose the correct verb: Several forms of political participation ___ declined.',['have','has'],'have','The head noun forms is plural.'],
['agreement','Choose the correct verb: The relationship between these variables ___ unclear.',['remains','remain'],'remains','The head noun relationship is singular.']
];
oralSprintRows.forEach((x,i)=>exercises.push(exercise({
  id:id('oral'),concept:x[0],domain:domains[i%domains.length],transfer:i%3===0?'guided':'controlled',
  prompt:x[1],options:x[2],answer:x[3],explanation:x[4],misconception:'oral_midterm_core'
})));

const speaking=[
{concept:'questions',domain:'politics',seconds:75,prompt:'Interview a journalist about a sudden political resignation. Ask five natural questions, including one subject question and one indirect question.',targets:['subject question','object question','indirect question']},
{concept:'narrative',domain:'horror',seconds:90,prompt:'You entered a library and discovered a door that had never been there before. Tell what you were doing, what happened, and what had happened before you arrived.',targets:['past progressive','past simple','past perfect']},
{concept:'conditionals',domain:'academic',seconds:75,prompt:'Give advice to a student with an oral exam tomorrow. Use unless, as long as, in case and as soon as.',targets:['unless','as long as','in case','as soon as']},
{concept:'usedto',domain:'academic',seconds:75,prompt:'Describe how studying in English has changed for you. Use used to, would, be used to and get used to.',targets:['used to','would','be used to','get used to']},
{concept:'agreement',domain:'academic',seconds:60,prompt:'Explain why evidence matters in research. Use: the evidence, the results, a series of studies, the findings.',targets:['agreement']},
{concept:'prepositions',domain:'politics',seconds:75,prompt:'Explain what political trust depends on and what institutions should be concerned about. Use at least four chunks.',targets:['depend on','concerned about','responsible for','impact on']},
{concept:'presentperfect',domain:'academic',seconds:75,prompt:'Describe your recent English study. Distinguish completed results from activities that have been continuing.',targets:['present perfect','present perfect progressive']},
{concept:'future',domain:'academic',seconds:75,prompt:'Describe your academic work three months from now. Say what you will be doing and what you will have completed.',targets:['future progressive','future perfect']}
];

speaking.push(
{concept:'questions',domain:'philosophy',seconds:75,prompt:'Interview a philosopher about a concept you do not fully understand. Ask four follow-up questions without repeating the same question form.',targets:['subject question','object question','follow-up question']},
{concept:'questions',domain:'academic',seconds:60,prompt:'A professor says: “The evidence surprised us.” Ask three questions to clarify who found it, what it showed, and why it mattered.',targets:['subject question','object question','indirect question']},
{concept:'narrative',domain:'academic',seconds:90,prompt:'Tell the story of a research project that went wrong. Include background, a main event, an earlier cause and something that had been happening for some time.',targets:['past progressive','past simple','past perfect','past perfect progressive']},
{concept:'narrative',domain:'literature',seconds:90,prompt:'Retell a disturbing fictional journey in which the narrator discovers that someone had followed them before the story began.',targets:['past simple','past progressive','past perfect']},
{concept:'conditionals',domain:'politics',seconds:75,prompt:'Explain how institutions can survive a crisis. Use unless, provided that, as long as and in case.',targets:['unless','provided that','as long as','in case']},
{concept:'conditionals',domain:'horror',seconds:75,prompt:'Give survival instructions for an abandoned building using at least three alternatives to if.',targets:['unless','in case','as soon as']},
{concept:'usedto',domain:'sociology',seconds:75,prompt:'Compare social life before and after smartphones. Distinguish past habits from things people are now accustomed to.',targets:['used to','would','be used to']},
{concept:'usedto',domain:'everyday',seconds:60,prompt:'Describe a routine that changed and one new habit you are still adapting to.',targets:['used to','get used to']},
{concept:'presentperfect',domain:'academic',seconds:75,prompt:'Explain what you have accomplished this semester and what you have been working on recently.',targets:['present perfect','present perfect progressive']},
{concept:'presentperfect',domain:'politics',seconds:75,prompt:'Describe a political trend that has changed over several years and an activity that has been continuing recently.',targets:['present perfect','present perfect progressive']},
{concept:'future',domain:'technology',seconds:90,prompt:'Describe how AI may change academic work over the next five years. Include a prediction, an activity in progress and something completed by a future date.',targets:['will','future progressive','future perfect']},
{concept:'future',domain:'academic',seconds:75,prompt:'Describe your next conference day using a timetable, a personal arrangement and two advanced future forms.',targets:['present simple','present progressive','future progressive','future perfect']},
{concept:'verbpatterns',domain:'academic',seconds:75,prompt:'Advise a doctoral student about preparing a paper. Use a modal, suggest + -ing, decide + to and need + object + to.',targets:['modal + base','suggest + -ing','decide + to','need + object + to']},
{concept:'prepositions',domain:'philosophy',seconds:75,prompt:'Make a short philosophical argument using depend on, be compatible with, raise an objection and provide an account of.',targets:['depend on','be compatible with','raise an objection','provide an account of']},
{concept:'passivecausative',domain:'politics',seconds:75,prompt:'Explain how an election result is processed: votes are counted, results are verified, and an institution has something independently reviewed.',targets:['passive voice','causative have/get']},
{concept:'agreement',domain:'politics',seconds:60,prompt:'Discuss public trust using these subjects accurately: public trust, the findings, a series of surveys, institutions.',targets:['singular agreement','plural agreement']}
);


speaking.push(
{id:'oral_midterm_extra_01',concept:'questions',domain:'politics',seconds:75,prompt:'A political scientist says that an unexpected event changed voter behavior. Ask five follow-up questions that move from basic information to clarification.',targets:['subject question','object question','indirect question','question with preposition']},
{id:'oral_midterm_extra_02',concept:'questions',domain:'academic',seconds:75,prompt:'Your professor says: “One assumption in the paper is problematic.” Ask who identified it, what the assumption is, what it depends on, and why it matters.',targets:['subject question','object question','preposition question','indirect question']},
{id:'oral_midterm_extra_03',concept:'questions',domain:'everyday',seconds:60,prompt:'A classmate says they had a terrible morning. Keep the conversation going with five natural follow-up questions.',targets:['wh-question','subject question','negative question','follow-up question']},
{id:'oral_midterm_extra_04',concept:'questions',domain:'philosophy',seconds:75,prompt:'Interview a philosopher who claims that freedom depends on social institutions. Ask four precise questions about the claim and one polite indirect question.',targets:['object question','subject question','indirect question']},

{id:'oral_midterm_extra_05',concept:'narrative',domain:'horror',seconds:90,prompt:'You were studying alone when every computer in the room turned off. Explain what was happening, what happened next, what had happened earlier, and what had been happening for several minutes.',targets:['past progressive','past simple','past perfect','past perfect progressive']},
{id:'oral_midterm_extra_06',concept:'narrative',domain:'politics',seconds:90,prompt:'Tell a fictional election-night story in which officials were counting votes when a technical problem appeared, but warning signs had emerged earlier.',targets:['past progressive','past simple','past perfect']},
{id:'oral_midterm_extra_07',concept:'narrative',domain:'academic',seconds:90,prompt:'Tell the story of arriving late to a seminar and discovering that the schedule had changed after people had been waiting for a long time.',targets:['past simple','past perfect','past perfect progressive']},
{id:'oral_midterm_extra_08',concept:'narrative',domain:'literature',seconds:90,prompt:'Describe a character entering an old house while a storm was developing. Reveal an earlier event that explains why the house is empty.',targets:['past progressive','past simple','past perfect']},

{id:'oral_midterm_extra_09',concept:'conditionals',domain:'politics',seconds:75,prompt:'Give four conditions under which emergency political measures could be acceptable and one precaution institutions should take.',targets:['provided that','as long as','unless','in case']},
{id:'oral_midterm_extra_10',concept:'conditionals',domain:'academic',seconds:75,prompt:'Give practical advice for succeeding in an oral exam using unless, in case, as soon as, and provided that.',targets:['unless','in case','as soon as','provided that']},
{id:'oral_midterm_extra_11',concept:'conditionals',domain:'everyday',seconds:60,prompt:'Explain your plan for a very busy morning using at least four alternatives to if.',targets:['unless','as long as','in case','as soon as']},
{id:'oral_midterm_extra_12',concept:'conditionals',domain:'horror',seconds:75,prompt:'Give rules for surviving one night in an abandoned archive. Make the rules conditional without repeatedly using if.',targets:['unless','provided that','in case','as soon as']},

{id:'oral_midterm_extra_13',concept:'usedto',domain:'academic',seconds:75,prompt:'Compare how you studied before graduate school, what repeated habits you had, what is normal now, and what you are still adapting to.',targets:['used to','would','be used to','get used to']},
{id:'oral_midterm_extra_14',concept:'usedto',domain:'technology',seconds:75,prompt:'Describe how academic life changed after constant internet access became normal.',targets:['used to','would','be used to','get used to']},

{id:'oral_midterm_extra_15',concept:'agreement',domain:'academic',seconds:60,prompt:'Explain a research finding using these exact subjects: the evidence, the results, each study, a series of studies, the findings.',targets:['subject–verb agreement']},
{id:'oral_midterm_extra_16',concept:'prepositions',domain:'politics',seconds:75,prompt:'Explain why institutional trust can decline. Use at least five complete chunks rather than isolated vocabulary.',targets:['depend on','responsible for','concerned about','impact on','risk of']},

{id:'presentation_extra_01',concept:'presentperfect',domain:'academic',seconds:90,prompt:'Open a research presentation by explaining what the literature has established and what scholars have been debating recently.',targets:['present perfect','present perfect progressive','academic signposting']},
{id:'presentation_extra_02',concept:'future',domain:'academic',seconds:75,prompt:'End a presentation by explaining what you will do next, what you will be working on, and what you expect to have completed by a specific date.',targets:['will','future progressive','future perfect']},
{id:'presentation_extra_03',concept:'prepositions',domain:'philosophy',seconds:90,prompt:'Present one philosophical claim using draw a distinction, provide an account of, be compatible with, and raise an objection.',targets:['draw a distinction','provide an account of','be compatible with','raise an objection']},
{id:'presentation_extra_04',concept:'agreement',domain:'politics',seconds:75,prompt:'Give a concise evidence-based argument while deliberately switching between singular and plural academic subjects.',targets:['agreement','sentence control']}
);


speaking.push(
{id:'academic_discourse_speak_01',concept:'academicdiscourse',domain:'academic',seconds:90,prompt:'Open a presentation: state your main argument, give a three-part roadmap, and make one hedged claim.',targets:['thesis frame','roadmap','hedging']},
{id:'academic_discourse_speak_02',concept:'academicdiscourse',domain:'philosophy',seconds:75,prompt:'Respond to an objection. Acknowledge it, draw a distinction, and reformulate your claim without abandoning the turn.',targets:['acknowledgment','distinction','self-repair']},
{id:'academic_discourse_speak_03',concept:'academicdiscourse',domain:'politics',seconds:75,prompt:'Explain one empirical result using a cautious claim, a possible explanation, and a limitation.',targets:['hedging','possible explanation','limitation']},
{id:'academic_discourse_speak_04',concept:'academicdiscourse',domain:'academic',seconds:60,prompt:'Give a concise conclusion that synthesizes two findings and states one implication without overclaiming.',targets:['synthesis','cautious conclusion','implication']},
{id:'academic_discourse_speak_05',concept:'academicdiscourse',domain:'academic',seconds:60,prompt:'A listener says your definition is unclear. Define the term again, give one example, and explicitly reformulate once.',targets:['definition','example','self-repair']},
{id:'academic_discourse_speak_06',concept:'academicdiscourse',domain:'philosophy',seconds:90,prompt:'Present a claim, concede one opposing point, and explain why your argument still holds.',targets:['claim','concession','response']}
);


const pronunciation=[
{id:'pron_q_01',focus:'Question intonation',sentence:'Have you been practicing long?',tip:'Yes/no questions often use rising intonation. Keep the final rise controlled rather than exaggerated.',seconds:12},
{id:'pron_q_02',focus:'Question intonation',sentence:'Where were you living before?',tip:'Wh- questions commonly end with falling intonation.',seconds:12},
{id:'pron_q_03',focus:'Question intonation',sentence:'Who wrote the report?',tip:'This is a subject wh-question. Keep who prominent and let the pitch fall toward report.',seconds:12},
{id:'pron_q_04',focus:'Question intonation',sentence:'Could you tell me where the seminar is?',tip:'Treat the indirect question as one polite thought group; avoid question-word inversion in your rhythm.',seconds:14},
{id:'pron_q_05',focus:'Question intonation',sentence:'What are you worried about?',tip:'Do not drop the final preposition. Keep about inside the same thought group.',seconds:12},

{id:'pron_link_01',focus:'Connected speech',sentence:'They are open-minded and easy-going.',tip:'Link final consonants to following vowel sounds where natural: open-minded_and, and_easy-going.',seconds:14},
{id:'pron_link_02',focus:'Connected speech',sentence:'She achieved a lot despite having a difficult childhood.',tip:'Avoid separating every word. Group achieved_a_lot and despite_having naturally.',seconds:16},
{id:'pron_link_03',focus:'Connected speech',sentence:'He built a successful argument around the evidence.',tip:'Link built_a and argument_around without adding extra vowels.',seconds:14},
{id:'pron_link_04',focus:'Connected speech',sentence:'We spent a lot of our time discussing the article.',tip:'Practice consonant-to-vowel links in spent_a, lot_of, and time_discussing.',seconds:15},
{id:'pron_link_05',focus:'Connected speech',sentence:'The evidence indicates an important change.',tip:'Keep indicates_an connected and stress evidence, important, change.',seconds:14},

{id:'pron_used_01',focus:'used to catenation',sentence:'I used to study at night.',tip:'In fluent speech, used to is usually reduced; do not pronounce each word as an isolated full form.',seconds:12},
{id:'pron_used_02',focus:'used to catenation',sentence:'She used to have long hair.',tip:'Keep used to compact and move quickly into have.',seconds:12},
{id:'pron_used_03',focus:'be used to + -ing',sentence:'I am used to reading long academic papers.',tip:'Here used to means accustomed to. Keep to reading connected and do not insert a pause.',seconds:14},
{id:'pron_used_04',focus:'get used to + -ing',sentence:'I am getting used to speaking spontaneously.',tip:'Group getting used to speaking as one rhythmic unit.',seconds:14},

{id:'pron_stress_01',focus:'Sentence stress',sentence:'The evidence suggests that institutional capacity matters.',tip:'Stress evidence, suggests, institutional capacity, matters. Reduce function words.',seconds:15},
{id:'pron_stress_02',focus:'Sentence stress',sentence:'My main argument is that platforms reshape the conditions of choice.',tip:'Give prominence to main argument, platforms, reshape, conditions, choice.',seconds:16},
{id:'pron_stress_03',focus:'Thought groups',sentence:'While it is true that access has expanded, important inequalities remain.',tip:'Use a short boundary after expanded; do not rush the concession and main claim together.',seconds:16},
{id:'pron_stress_04',focus:'Thought groups',sentence:'The first point concerns autonomy; the second concerns social dependence.',tip:'Make two balanced thought groups with clear contrastive stress on first and second.',seconds:16},

{id:'pron_cond_01',focus:'Conditional intonation',sentence:'Unless institutions adapt, public trust may decline.',tip:'Use a clear boundary after the condition clause, then a falling contour on the main claim.',seconds:14},
{id:'pron_cond_02',focus:'Conditional intonation',sentence:'As long as oversight continues, the measure may be acceptable.',tip:'Keep as long as together and separate the condition from the consequence.',seconds:15},
{id:'pron_cond_03',focus:'Conditional intonation',sentence:'Take a copy in case the internet fails.',tip:'Keep in case unstressed relative to the key content words copy, internet, fails.',seconds:14},

{id:'pron_int_01',focus:'Intensifiers',sentence:'The outcome is highly likely.',tip:'Stress highly and likely as a natural collocation, without equal stress on every word.',seconds:10},
{id:'pron_int_02',focus:'Intensifiers',sentence:'The researchers were deeply concerned about the result.',tip:'Stress deeply concerned as the main information unit.',seconds:12},
{id:'pron_repair_01',focus:'Self-repair',sentence:'What I mean is that the mechanism operates indirectly.',tip:'Use What I mean is as a smooth repair frame; do not restart the sentence from zero.',seconds:14}
];

const schedules={
 conservative:[
  {date:'2026-09-25',title:'Unit 3 · Final consolidation',concepts:['narrative','conditionals','prepositions','questions']},
  {date:'2026-09-28',title:'Oral Midterm',assessment:true,concepts:['questions','narrative','conditionals','usedto','agreement','prepositions']},
  {date:'2026-10-19',title:'Academic Project Presentation',assessment:true,concepts:['questions','agreement','prepositions','presentperfect','academicdiscourse']},
  {date:'2026-10-21',title:'Unit 4.1 · Future forms',concepts:['future']},
  {date:'2026-10-26',title:'Unit 4.2 · Future perfect/progressive',concepts:['future']},
  {date:'2026-11-04',title:'Written Exam',assessment:true,concepts:['future','prepositions','agreement']},
  {date:'2026-11-09',title:'Unit 5.1 · Passive & causative',concepts:['passivecausative']},
  {date:'2026-11-16',title:'Unit 5.2 · -ing & infinitive',concepts:['verbpatterns']},
  {date:'2026-11-18',title:'Unit 5.3 · Counterarguments',concepts:['conditionals']},
  {date:'2026-12-02',title:'Final Oral Exam',assessment:true,concepts:concepts.map(x=>x.id)}
 ],
 mon_wed:[
{date:'2026-09-21',title:'Lesson 3.3 · Don’t look down',concepts:['narrative','prepositions']},
{date:'2026-09-23',title:'Unit 3 Review · Short story',concepts:['narrative','conditionals','prepositions']},
{date:'2026-09-28',title:'Oral Midterm',assessment:true,concepts:['questions','narrative','conditionals','usedto','agreement','prepositions']},
{date:'2026-09-30',title:'Presentation preparation · Organizing',concepts:['questions','prepositions','agreement','academicdiscourse']},
{date:'2026-10-07',title:'Presentation preparation · Opening',concepts:['questions','prepositions','academicdiscourse']},
{date:'2026-10-19',title:'Academic Project Presentation',assessment:true,concepts:['questions','agreement','prepositions','presentperfect','academicdiscourse']},
{date:'2026-10-21',title:'Unit 4.1 · Future forms',concepts:['future']},
{date:'2026-10-26',title:'Unit 4.2 · Future perfect/progressive',concepts:['future']},
{date:'2026-10-28',title:'Unit 4.3 · Automation at work',concepts:['future','prepositions']},
{date:'2026-11-04',title:'Written Exam',assessment:true,concepts:['future','prepositions','agreement']},
{date:'2026-11-09',title:'Unit 5.1 · Passive & causative',concepts:['passivecausative']},
{date:'2026-11-16',title:'Unit 5.2 · -ing & infinitive',concepts:['verbpatterns']},
{date:'2026-11-18',title:'Unit 5.3 · Counterarguments',concepts:['conditionals']},
{date:'2026-12-02',title:'Final Oral Exam',assessment:true,concepts:concepts.map(x=>x.id)}
],
 tue_thu:[
{date:'2026-09-29',title:'Lesson 3.3 · Don’t look down',concepts:['narrative','prepositions']},
{date:'2026-10-01',title:'Unit 3 Review · Short story',concepts:['narrative','conditionals','prepositions']},
{date:'2026-10-06',title:'Oral Midterm',assessment:true,concepts:['questions','narrative','conditionals','usedto','agreement','prepositions']},
{date:'2026-10-08',title:'Presentation preparation · Organizing',concepts:['questions','prepositions','agreement','academicdiscourse']},
{date:'2026-10-15',title:'Presentation preparation · Opening',concepts:['questions','prepositions','academicdiscourse']},
{date:'2026-10-20',title:'Academic Project Presentation',assessment:true,concepts:['questions','agreement','prepositions','presentperfect','academicdiscourse']},
{date:'2026-10-22',title:'Unit 4.1 · Future forms',concepts:['future']},
{date:'2026-10-27',title:'Unit 4.2 · Future perfect/progressive',concepts:['future']},
{date:'2026-10-29',title:'Unit 4.3 · Automation at work',concepts:['future','prepositions']},
{date:'2026-11-05',title:'Written Exam',assessment:true,concepts:['future','prepositions','agreement']},
{date:'2026-11-10',title:'Unit 5.1 · Passive & causative',concepts:['passivecausative']},
{date:'2026-11-17',title:'Unit 5.2 · -ing & infinitive',concepts:['verbpatterns']},
{date:'2026-11-19',title:'Unit 5.3 · Counterarguments',concepts:['conditionals']},
{date:'2026-12-03',title:'Final Oral Exam',assessment:true,concepts:concepts.map(x=>x.id)}
],
 wed_fri_am:[
{date:'2026-09-25',title:'Lesson 3.3 · Don’t look down',concepts:['narrative','prepositions']},
{date:'2026-09-30',title:'Unit 3 Review · Short story',concepts:['narrative','conditionals','prepositions']},
{date:'2026-10-02',title:'Oral Midterm',assessment:true,concepts:['questions','narrative','conditionals','usedto','agreement','prepositions']},
{date:'2026-10-07',title:'Presentation preparation · Organizing',concepts:['questions','prepositions','agreement','academicdiscourse']},
{date:'2026-10-16',title:'Presentation preparation · Opening',concepts:['questions','prepositions','academicdiscourse']},
{date:'2026-10-21',title:'Academic Project Presentation',assessment:true,concepts:['questions','agreement','prepositions','presentperfect','academicdiscourse']},
{date:'2026-10-23',title:'Unit 4.1 · Future forms',concepts:['future']},
{date:'2026-10-28',title:'Unit 4.2 · Future perfect/progressive',concepts:['future']},
{date:'2026-10-30',title:'Unit 4.3 · Automation at work',concepts:['future','prepositions']},
{date:'2026-11-06',title:'Written Exam',assessment:true,concepts:['future','prepositions','agreement']},
{date:'2026-11-11',title:'Unit 5.1 · Passive & causative',concepts:['passivecausative']},
{date:'2026-11-18',title:'Unit 5.2 · -ing & infinitive',concepts:['verbpatterns']},
{date:'2026-11-20',title:'Unit 5.3 · Counterarguments',concepts:['conditionals']},
{date:'2026-12-04',title:'Final Oral Exam',assessment:true,concepts:concepts.map(x=>x.id)}
],
 wed_fri_pm:[
{date:'2026-09-23',title:'Lesson 3.3 · Don’t look down',concepts:['narrative','prepositions']},
{date:'2026-09-25',title:'Unit 3 Review · Short story',concepts:['narrative','conditionals','prepositions']},
{date:'2026-09-30',title:'Oral Midterm',assessment:true,concepts:['questions','narrative','conditionals','usedto','agreement','prepositions']},
{date:'2026-10-07',title:'Presentation preparation · Organizing',concepts:['questions','prepositions','agreement','academicdiscourse']},
{date:'2026-10-16',title:'Presentation preparation · Opening',concepts:['questions','prepositions','academicdiscourse']},
{date:'2026-10-21',title:'Academic Project Presentation',assessment:true,concepts:['questions','agreement','prepositions','presentperfect','academicdiscourse']},
{date:'2026-10-23',title:'Unit 4.1 · Future forms',concepts:['future']},
{date:'2026-10-28',title:'Unit 4.2 · Future perfect/progressive',concepts:['future']},
{date:'2026-10-30',title:'Unit 4.3 · Automation at work',concepts:['future','prepositions']},
{date:'2026-11-06',title:'Written Exam',assessment:true,concepts:['future','prepositions','agreement']},
{date:'2026-11-11',title:'Unit 5.1 · Passive & causative',concepts:['passivecausative']},
{date:'2026-11-18',title:'Unit 5.2 · -ing & infinitive',concepts:['verbpatterns']},
{date:'2026-11-20',title:'Unit 5.3 · Counterarguments',concepts:['conditionals']},
{date:'2026-12-04',title:'Final Oral Exam',assessment:true,concepts:concepts.map(x=>x.id)}
]
};



function addAcademicDiscourse(){
  const mcq=[
    ['You are opening a presentation. Choose the clearest thesis frame.',['My main argument is that platform personalization can narrow individual agency.','I think like maybe platforms are kind of bad.'],'My main argument is that platform personalization can narrow individual agency.','Use an explicit thesis frame to establish the central claim.'],
    ['Choose the best signpost for moving to your first analytical point.',['The first point concerns the relationship between personalization and choice.','And another thing is choice somehow.'],'The first point concerns the relationship between personalization and choice.','A signpost tells the audience what function the next section performs.'],
    ['Choose the more cautious academic claim.',['The evidence suggests that the reform may have affected participation.','The reform definitely destroyed participation.'],'The evidence suggests that the reform may have affected participation.','Hedging distinguishes supported inference from absolute certainty.'],
    ['Choose the better transition to a broader implication.',['This leads to a broader question about institutional trust.','So anyway, trust.'],'This leads to a broader question about institutional trust.','The transition explicitly marks how the argument develops.'],
    ['Choose the best way to introduce an example.',['One illustration of this is the change in turnout after the reform.','For example thing, turnout changed.'],'One illustration of this is the change in turnout after the reform.','Academic exemplification should connect the example to the claim.'],
    ['Choose the stronger concession structure.',['While it is true that platforms expand access, they may also intensify dependence.','Platforms expand access but no, dependence too.'],'While it is true that platforms expand access, they may also intensify dependence.','Concession acknowledges a point before qualifying or opposing it.'],
    ['Choose the best phrase for a limited claim.',['To some extent, the pattern can be explained by institutional capacity.','Totally, everything is explained by institutional capacity.'],'To some extent, the pattern can be explained by institutional capacity.','To some extent limits the scope of the claim.'],
    ['Choose the best evidence frame.',['The available evidence indicates a persistent difference across cases.','The evidence says the truth is obvious.'],'The available evidence indicates a persistent difference across cases.','Academic language separates evidence from overstatement.'],
    ['A listener asks what you mean by “individuality.” Choose the best response opener.',['What I mean by individuality is the capacity to form and revise one’s own commitments.','It means what I already said.'],'What I mean by individuality is the capacity to form and revise one’s own commitments.','Define the contested term directly before expanding.'],
    ['You notice that your sentence became unclear. Choose the best self-repair.',['Let me rephrase that: the issue is not choice itself, but how choices are structured.','No, wait, forget it.'],'Let me rephrase that: the issue is not choice itself, but how choices are structured.','Self-repair should preserve the turn while improving precision.'],
    ['Choose the best way to answer a difficult question without pretending certainty.',['That is an important question. I would distinguish between the empirical and normative parts of the claim.','I do not know, so next question.'],'That is an important question. I would distinguish between the empirical and normative parts of the claim.','A structured answer can acknowledge difficulty and still advance the response.'],
    ['Choose the sentence that clearly contrasts two cases.',['By contrast, the second case shows much weaker institutional enforcement.','The second case is different and stuff.'],'By contrast, the second case shows much weaker institutional enforcement.','By contrast explicitly marks comparison.'],
    ['Choose the best phrase for an inference rather than a fact.',['One possible explanation is that lower trust reduces compliance.','The only explanation is obviously low trust.'],'One possible explanation is that lower trust reduces compliance.','Possible explanation marks inferential status.'],
    ['Choose the best way to qualify a generalization.',['Broadly speaking, the cases follow a similar pattern, although important differences remain.','All cases are basically the same.'],'Broadly speaking, the cases follow a similar pattern, although important differences remain.','A qualification prevents an overgeneralized claim.'],
    ['Choose the clearest roadmap sentence.',['I will first define the concept, then examine the mechanism, and finally discuss its implications.','I will talk about some things and finish later.'],'I will first define the concept, then examine the mechanism, and finally discuss its implications.','A roadmap helps the audience anticipate the structure.'],
    ['Choose the best conclusion frame.',['Taken together, these findings suggest that institutional design matters, but not in isolation.','So that proves everything I said.'],'Taken together, these findings suggest that institutional design matters, but not in isolation.','A conclusion should synthesize rather than overclaim.'],
    ['Choose the best way to return from an example to the argument.',['This example matters because it shows how the mechanism operates in practice.','That was the example. Next.'],'This example matters because it shows how the mechanism operates in practice.','Explicitly state the analytical role of the example.'],
    ['Choose the best way to disagree politely in Q&A.',['I see the concern, but I would draw a distinction between dependence and domination.','No, that objection is wrong.'],'I see the concern, but I would draw a distinction between dependence and domination.','Acknowledge the objection before stating the distinction.'],
    ['Choose the most natural cautious verb.',['The results appear to support the hypothesis.','The results scream that the hypothesis is true.'],'The results appear to support the hypothesis.','Appear to supports a cautious empirical claim.'],
    ['Choose the best transition from evidence to implication.',['If this interpretation is correct, it has implications for how we understand autonomy.','The evidence is done, now autonomy.'],'If this interpretation is correct, it has implications for how we understand autonomy.','The conditional transition keeps the implication proportionate to the evidence.']
  ];
  mcq.forEach((x,i)=>exercises.push(exercise({id:id('acad'),concept:'academicdiscourse',domain:i%2?'philosophy':'academic',type:'mcq',transfer:i<8?'controlled':'guided',difficulty:i<8?1:2,prompt:x[0],options:x[1],answer:x[2],explanation:x[3],misconception:'academic_register'})));

  const builders=[
    ['My','main','argument','is','that','platforms','reshape','the','conditions','of','choice.'],
    ['The','first','point','concerns','the','relationship','between','freedom','and','dependence.'],
    ['The','evidence','suggests','that','the','effect','may','vary','across','cases.'],
    ['This','leads','to','a','broader','question','about','institutional','capacity.'],
    ['One','possible','explanation','is','that','trust','shapes','compliance.'],
    ['While','it','is','true','that','access','has','expanded,','important','inequalities','remain.'],
    ['What','I','mean','is','that','the','mechanism','operates','indirectly.'],
    ['Let','me','rephrase','that:','the','claim','is','more','limited.'],
    ['Taken','together,','these','findings','suggest','a','persistent','pattern.'],
    ['By','contrast,','the','second','case','shows','weaker','enforcement.']
  ];
  builders.forEach((tokens,i)=>exercises.push(exercise({id:id('acadbuild'),concept:'academicdiscourse',domain:i%2?'politics':'academic',type:'builder',transfer:i<4?'controlled':'guided',difficulty:2,prompt:'Build the academic sentence.',tokens:[...tokens].sort(()=>Math.random()-.5),answer:tokens.join(' '),explanation:'The exercise trains complete discourse frames so they can be retrieved as chunks during presentation.',misconception:'academic_word_order'})));

  const transforms=[
    ['Make the claim more cautious: “The reform causes lower trust.”','The reform may cause lower trust.'],
    ['Introduce this as your thesis: “Platform personalization can narrow agency.”','My main argument is that platform personalization can narrow agency.'],
    ['Turn this into a concession: “Platforms expand access, but they may intensify dependence.”','While it is true that platforms expand access, they may intensify dependence.'],
    ['Reformulate politely: “That was unclear. I mean the mechanism is indirect.”','Let me rephrase that: the mechanism is indirect.'],
    ['Introduce a possible explanation: “Lower trust may reduce compliance.”','One possible explanation is that lower trust reduces compliance.'],
    ['Connect an example back to the argument: “Turnout fell after the reform.”','This example matters because it shows how the reform may have affected participation.'],
    ['Add a contrast signpost: “The second case shows weaker enforcement.”','By contrast, the second case shows weaker enforcement.'],
    ['Conclude cautiously: “The findings show institutional design matters.”','Taken together, the findings suggest that institutional design matters.'],
    ['Define a term in Q&A: “Individuality means the capacity to revise commitments.”','What I mean by individuality is the capacity to revise commitments.'],
    ['Give a roadmap: define the concept, examine the mechanism, discuss implications.','I will first define the concept, then examine the mechanism, and finally discuss its implications.']
  ];
  transforms.forEach((x,i)=>exercises.push(exercise({id:id('acadtrans'),concept:'academicdiscourse',domain:i%2?'philosophy':'academic',type:'text',transfer:'guided',difficulty:3,prompt:x[0],acceptedAnswers:[x[1]],answer:x[1],explanation:'The goal is to retrieve an academic discourse frame that matches the communicative function.',misconception:'academic_discourse_function'})));

  const free=[
    ['academic','Present a thesis in 4–5 sentences. Include a thesis frame, a roadmap, one hedged claim and one transition.','Model: My main argument is that platform personalization changes the conditions of individual choice. I will first define individuality, then examine the mechanism, and finally discuss its implications. The evidence suggests that the effect may vary across contexts. This leads to a broader question about autonomy.'],
    ['philosophy','Answer an objection to a philosophical claim. Acknowledge the objection, draw a distinction, and reformulate your position.','Model: I see the concern, but I would draw a distinction between dependence and domination. What I mean is that social dependence does not necessarily eliminate individuality. Let me rephrase that: the argument concerns the quality of the relation, not the absence of relations.'],
    ['politics','Explain a finding cautiously: state the result, give one possible explanation, and identify a limitation.','Model: The results indicate a decline in trust. One possible explanation is weaker institutional performance. However, the evidence does not establish a single causal mechanism.'],
    ['academic','Give a 60-second conclusion to a presentation using taken together, suggests that, and one implication.','Model: Taken together, these findings suggest that institutional capacity shapes how reforms are experienced. If this interpretation is correct, it has implications for how we understand public trust.'],
    ['academic','Respond to a difficult Q&A question without losing the turn. Use an acknowledgment, a distinction, a cautious claim and self-repair.','Model: That is an important question. I would distinguish between the empirical and normative claims. The evidence appears to support the first more strongly. What I mean is that the second remains an interpretive argument.']
  ];
  free.forEach((x)=>exercises.push(exercise({id:id('acadfree'),concept:'academicdiscourse',domain:x[0],type:'selfcheck',transfer:'free',difficulty:3,prompt:x[1],options:[],answer:x[2],explanation:'Compare the communicative functions in your answer with the model. Do not copy the wording; check signposting, hedging, concession and repair.',misconception:'academic_transfer'})));
}
addAcademicDiscourse();

function addV04RichPractice(){
  const builderMap={
    questions:[
      ['Who','wrote','the','report?'],
      ['What','did','the','committee','change?'],
      ['Could','you','tell','me','where','the','seminar','is?'],
      ['Who','challenged','the','argument?'],
      ['Which','proposal','did','the','analyst','support?'],
      ['What','are','you','worried','about?']
    ],
    agreement:[
      ['The','evidence','suggests','a','pattern.'],
      ['The','results','suggest','a','pattern.'],
      ['A','series','of','studies','has','confirmed','the','finding.'],
      ['These','arguments','raise','two','questions.'],
      ['Each','of','the','cases','illustrates','the','problem.'],
      ['Public','trust','remains','fragile.']
    ],
    narrative:[
      ['She','was','reading','when','the','lights','went','out.'],
      ['Someone','had','removed','the','file','before','she','arrived.'],
      ['They','had','been','waiting','for','hours','when','the','door','opened.'],
      ['Officials','were','counting','ballots','when','the','system','failed.'],
      ['The','meeting','had','already','started','when','I','arrived.'],
      ['He','was','walking','home','when','he','noticed','the','stranger.']
    ],
    usedto:[
      ['I','used','to','study','at','night.'],
      ['I','would','read','for','hours','after','class.'],
      ['I','am','used','to','reading','long','papers.'],
      ['I','am','getting','used','to','speaking','in','English.'],
      ['She','used','to','be','very','shy.'],
      ['Researchers','are','used','to','working','with','incomplete','data.']
    ],
    presentperfect:[
      ['I','have','written','three','pages','today.'],
      ['I','have','been','writing','all','morning.'],
      ['She','has','visited','the','archive','twice','this','month.'],
      ['They','have','been','collecting','data','for','six','months.'],
      ['I','have','known','her','for','years.'],
      ['We','have','already','finished','the','analysis.']
    ],
    conditionals:[
      ['Unless','institutions','adapt,','trust','will','decline.'],
      ['You','can','use','the','archive','as','long','as','you','follow','the','rules.'],
      ['Bring','a','copy','in','case','the','internet','fails.'],
      ['Provided','that','oversight','continues,','the','measure','may','be','acceptable.'],
      ['As','soon','as','the','results','arrive,','I','will','update','the','table.'],
      ['We','will','continue','unless','the','committee','objects.']
    ],
    future:[
      ['The','seminar','starts','at','nine.'],
      ['I','am','meeting','my','supervisor','tomorrow.'],
      ['At','ten,','I','will','be','presenting','my','paper.'],
      ['By','Friday,','I','will','have','finished','the','draft.'],
      ['By','December,','I','will','have','been','studying','English','for','four','months.'],
      ['The','evidence','suggests','that','AI','will','change','assessment.']
    ],
    verbpatterns:[
      ['They','could','reduce','the','risk.'],
      ['They','suggested','changing','the','rule.'],
      ['We','decided','to','revise','the','draft.'],
      ['Researchers','should','avoid','overstating','the','evidence.'],
      ['My','supervisor','needs','me','to','send','the','file.'],
      ['They','considered','postponing','the','project.']
    ],
    prepositions:[
      ['The','outcome','depends','on','institutional','capacity.'],
      ['She','is','responsible','for','the','analysis.'],
      ['Researchers','are','concerned','about','declining','trust.'],
      ['The','reform','had','an','impact','on','participation.'],
      ['This','outcome','is','highly','likely.'],
      ['The','author','draws','a','distinction','between','autonomy','and','independence.']
    ],
    passivecausative:[
      ['The','data','were','collected','in','2025.'],
      ['The','interviews','were','recorded','and','transcribed.'],
      ['We','had','the','document','translated.'],
      ['She','got','the','laptop','repaired','before','class.'],
      ['The','proposal','was','reviewed','by','the','committee.'],
      ['They','had','the','results','checked','again.']
    ]
  };
  for(const [concept,rows] of Object.entries(builderMap)){
    rows.forEach((tokens,i)=>exercises.push(exercise({
      id:id('build'),concept,domain:domains[i%domains.length],type:'builder',transfer:i<3?'controlled':'guided',
      difficulty:i<3?1:2,prompt:'Build the sentence in the correct order.',tokens:[...tokens].sort(()=>Math.random()-.5),
      answer:tokens.join(' '),explanation:'Build the complete target structure before checking. Word order is part of the grammar.',misconception:'word_order'
    })));
  }

  const correctionMap={
    questions:[
      ['Who did write the report?','Who wrote the report?','Who is the subject, so did is unnecessary.'],
      ['What the committee changed?','What did the committee change?','Object questions need did + subject + base verb in the past.'],
      ['Could you tell me where is the seminar?','Could you tell me where the seminar is?','Indirect questions use statement word order.'],
      ['Who did proposed the reform?','Who proposed the reform?','A subject question does not use did.'],
      ['What are you worried?','What are you worried about?','The preposition remains with the verb phrase.']
    ],
    agreement:[
      ['The evidence suggest a pattern.','The evidence suggests a pattern.','Evidence is singular here.'],
      ['The results suggests a pattern.','The results suggest a pattern.','Results is plural.'],
      ['A series of studies have confirmed the result.','A series of studies has confirmed the result.','The head noun series is singular.'],
      ['Each of the cases illustrate the problem.','Each of the cases illustrates the problem.','Each is singular.'],
      ['These finding indicates a problem.','These findings indicate a problem.','Plural subject requires the base verb form.']
    ],
    narrative:[
      ['When she arrived, someone removed the file before.','When she arrived, someone had removed the file.','Past perfect marks the earlier event.'],
      ['She read when the lights went out.','She was reading when the lights went out.','Past progressive gives the background action.'],
      ['They had waited for hours when the door opened.','They had been waiting for hours when the door opened.','Past perfect progressive highlights prior duration.'],
      ['Officials were counted ballots when the system failed.','Officials were counting ballots when the system failed.','Past progressive is was/were + -ing.'],
      ['By the time I arrived, the meeting started.','By the time I arrived, the meeting had started.','Use past perfect for the earlier completed event.']
    ],
    usedto:[
      ['I am used to read long papers.','I am used to reading long papers.','Be used to is followed by a noun or -ing form.'],
      ['I am getting used to speak in English.','I am getting used to speaking in English.','Get used to is followed by a noun or -ing form.'],
      ['I would be shy when I was younger.','I used to be shy when I was younger.','Would is not normally used for past states such as be shy.'],
      ['I used to reading at night.','I used to read at night.','Used to for a past habit takes the base verb.'],
      ['She is used to work under pressure.','She is used to working under pressure.','Be used to + -ing expresses familiarity.']
    ],
    presentperfect:[
      ['I have been written three pages today.','I have written three pages today.','Use present perfect for a completed result/number.'],
      ['I have written all morning.','I have been writing all morning.','The progressive emphasizes duration/activity.'],
      ['I have been knowing her for years.','I have known her for years.','Know is normally stative and not used progressively here.'],
      ['She has went to the archive twice.','She has gone to the archive twice.','Present perfect uses the past participle.'],
      ['We have finish the analysis.','We have finished the analysis.','Present perfect is have/has + past participle.']
    ],
    conditionals:[
      ['Unless institutions do not adapt, trust will decline.','Unless institutions adapt, trust will decline.','Unless already means if not.'],
      ['As soon as the results will arrive, I will update the table.','As soon as the results arrive, I will update the table.','Use present simple after as soon as for future reference.'],
      ['Bring a copy unless the internet fails.','Bring a copy in case the internet fails.','In case expresses precaution.'],
      ['You can enter provided you will follow the rules.','You can enter provided you follow the rules.','Use present simple in the condition clause.'],
      ['As long as institutions will cooperate, the plan can work.','As long as institutions cooperate, the plan can work.','Use present simple after as long as.']
    ],
    future:[
      ['According to the timetable, the class will start at 9.','According to the timetable, the class starts at 9.','Present simple is standard for fixed schedules.'],
      ['By Friday, I will finish already the draft.','By Friday, I will have finished the draft.','Future perfect marks completion before a future point.'],
      ['At 10 tomorrow, I will have presented my paper.','At 10 tomorrow, I will be presenting my paper.','Future progressive marks an action in progress at that time.'],
      ['By December, I will study English for four months.','By December, I will have been studying English for four months.','Future perfect progressive marks duration up to a future point.'],
      ['I meet my supervisor tomorrow; it is arranged.','I am meeting my supervisor tomorrow; it is arranged.','Present progressive expresses a personal arrangement.']
    ],
    verbpatterns:[
      ['They could reducing the risk.','They could reduce the risk.','A modal is followed by the base verb.'],
      ['They suggested to change the rule.','They suggested changing the rule.','Suggest is followed by -ing here.'],
      ['We decided revising the draft.','We decided to revise the draft.','Decide is followed by to-infinitive.'],
      ['Researchers should avoid to overstate the evidence.','Researchers should avoid overstating the evidence.','Avoid is followed by -ing.'],
      ['My supervisor needs that I send the file.','My supervisor needs me to send the file.','Need + object + to-infinitive is natural here.']
    ],
    prepositions:[
      ['The result depends about institutional capacity.','The result depends on institutional capacity.','The dependent preposition is depend on.'],
      ['She is responsible of the analysis.','She is responsible for the analysis.','The pattern is responsible for.'],
      ['Researchers are concerned of declining trust.','Researchers are concerned about declining trust.','The pattern is concerned about.'],
      ['The reform had an impact in participation.','The reform had an impact on participation.','The collocation is impact on.'],
      ['The outcome is deeply likely.','The outcome is highly likely.','Highly likely is the natural adverb–adjective collocation.']
    ],
    passivecausative:[
      ['The data was collected in 2025.','The data were collected in 2025.','In formal academic usage, data is commonly treated as plural.'],
      ['The interviews were record yesterday.','The interviews were recorded yesterday.','Passive voice requires be + past participle.'],
      ['We had translated the document by a professional.','We had the document translated by a professional.','Causative have is have + object + past participle.'],
      ['She got repaired her laptop.','She got her laptop repaired.','Causative get places the object before the past participle.'],
      ['The proposal reviewed by the committee.','The proposal was reviewed by the committee.','Passive voice needs an appropriate form of be.']
    ]
  };
  for(const [concept,rows] of Object.entries(correctionMap)){
    rows.forEach((x,i)=>exercises.push(exercise({
      id:id('corr'),concept,domain:domains[(i+1)%domains.length],type:'text',transfer:i<2?'controlled':'guided',
      difficulty:2,prompt:'Correct the sentence: “'+x[0]+'”',acceptedAnswers:[x[1]],answer:x[1],
      explanation:x[2],misconception:'error_correction'
    })));
  }

  const transformMap={
    questions:[
      ['The researcher changed the interpretation. Ask about the researcher.','Who changed the interpretation?'],
      ['The researcher changed the interpretation. Ask about the interpretation.','What did the researcher change?'],
      ['Where is the seminar? Make the question indirect with “Could you tell me…?”','Could you tell me where the seminar is?'],
      ['The analyst is worried about the deadline. Ask what the analyst is worried about.','What is the analyst worried about?']
    ],
    agreement:[
      ['Rewrite with a plural subject: “The result suggests a pattern.”','The results suggest a pattern.'],
      ['Rewrite with a singular head noun: “The studies have changed the debate.” Use “A series of studies”.','A series of studies has changed the debate.'],
      ['Correct the agreement: “Each of the arguments raise a problem.”','Each of the arguments raises a problem.'],
      ['Correct the agreement: “Public trust remain low.”','Public trust remains low.']
    ],
    narrative:[
      ['Show the earlier event clearly: “She arrived. Someone removed the file before that.”','Someone had removed the file before she arrived.'],
      ['Make reading the background action: “She read. Then the lights went out.”','She was reading when the lights went out.'],
      ['Emphasize prior duration: “They waited for hours. Then the door opened.”','They had been waiting for hours when the door opened.'],
      ['Use past perfect for the first event: “The meeting started. I arrived later.”','The meeting had started when I arrived.']
    ],
    usedto:[
      ['Express a past habit that is no longer true: “I studied at night in the past.”','I used to study at night.'],
      ['Express present familiarity: “Reading long papers feels normal to me now.”','I am used to reading long papers.'],
      ['Express adaptation in progress: “Speaking spontaneously is becoming more normal for me.”','I am getting used to speaking spontaneously.'],
      ['Express a repeated past action with would: “Every evening, I read for an hour.”','Every evening, I would read for an hour.']
    ],
    presentperfect:[
      ['Emphasize completed result: “Three pages are finished this morning.”','I have written three pages this morning.'],
      ['Emphasize ongoing duration: “I started writing this morning and I am still doing it.”','I have been writing all morning.'],
      ['Express experience up to now: “I never presented this paper in English before now.”','I have never presented this paper in English before.'],
      ['Express a state continuing from the past: “I met her years ago and still know her.”','I have known her for years.']
    ],
    conditionals:[
      ['Rewrite with unless: “If institutions do not adapt, trust will decline.”','Unless institutions adapt, trust will decline.'],
      ['Rewrite as a precaution with in case: “Bring a copy because the internet might fail.”','Bring a copy in case the internet fails.'],
      ['Rewrite with as long as: “You can use the archive if you follow the rules.”','You can use the archive as long as you follow the rules.'],
      ['Rewrite with as soon as: “The results arrive, and immediately after that I will update the table.”','As soon as the results arrive, I will update the table.']
    ],
    future:[
      ['Express completion before Friday: “I finish the draft before Friday.”','By Friday, I will have finished the draft.'],
      ['Express an action in progress at 10 tomorrow: “I present my paper at that time.”','At 10 tomorrow, I will be presenting my paper.'],
      ['Express a fixed timetable: “The seminar is scheduled for 9.”','The seminar starts at 9.'],
      ['Express an arranged meeting tomorrow: “My meeting with my supervisor is already arranged.”','I am meeting my supervisor tomorrow.']
    ],
    verbpatterns:[
      ['Use suggest correctly: “They suggested that the rule should change.”','They suggested changing the rule.'],
      ['Use decide correctly: “They made the decision to revise the draft.”','They decided to revise the draft.'],
      ['Use avoid correctly: “Researchers should not overstate the evidence.”','Researchers should avoid overstating the evidence.'],
      ['Use need + object + to-infinitive: “My supervisor requires me to send the file.”','My supervisor needs me to send the file.']
    ],
    prepositions:[
      ['Use depend correctly: “Institutional capacity determines the outcome.”','The outcome depends on institutional capacity.'],
      ['Use responsible correctly: “She has responsibility for the analysis.”','She is responsible for the analysis.'],
      ['Use impact correctly: “The reform affected participation.”','The reform had an impact on participation.'],
      ['Use the natural collocation for strong probability: “The outcome is very probable.”','The outcome is highly likely.']
    ],
    passivecausative:[
      ['Make it passive: “Researchers collected the data in 2025.”','The data were collected in 2025.'],
      ['Use causative have: “A professional translated the document for us.”','We had the document translated by a professional.'],
      ['Use causative get: “A technician repaired her laptop for her.”','She got her laptop repaired.'],
      ['Make it passive: “The committee reviewed the proposal.”','The proposal was reviewed by the committee.']
    ]
  };
  for(const [concept,rows] of Object.entries(transformMap)){
    rows.forEach((x,i)=>exercises.push(exercise({
      id:id('trans'),concept,domain:domains[(i+3)%domains.length],type:'text',transfer:'guided',
      difficulty:3,prompt:x[0],acceptedAnswers:[x[1]],answer:x[1],
      explanation:'This transformation tests whether you can select and produce the target structure without relying on recognition alone.',misconception:'transformation'
    })));
  }

  const timelineRows=[
    ['narrative',['17:45 — someone removed the file','18:00 — the researcher arrived'],'Choose the sentence that correctly marks the earlier event.',['When the researcher arrived, someone had removed the file.','When the researcher had arrived, someone removed the file.'],'When the researcher arrived, someone had removed the file.','Past perfect marks the event that happened before the later past reference point.'],
    ['narrative',['20:00 — officials were counting ballots','20:15 — the system failed'],'Choose the sentence that gives background + event.',['Officials were counting ballots when the system failed.','Officials had counted ballots when the system was failing.'],'Officials were counting ballots when the system failed.','Past progressive gives the ongoing background; past simple marks the event.'],
    ['narrative',['14:00 — they started waiting','17:00 — the door opened'],'Choose the sentence that emphasizes the duration before the later event.',['They had been waiting for three hours when the door opened.','They waited for three hours when the door had opened.'],'They had been waiting for three hours when the door opened.','Past perfect progressive expresses duration continuing up to a past reference point.'],
    ['narrative',['08:30 — the meeting started','08:45 — I arrived'],'Choose the clearest sequence.',['The meeting had started when I arrived.','The meeting was starting after I had arrived.'],'The meeting had started when I arrived.','Past perfect marks the earlier completed event.'],
    ['narrative',['22:00 — she was walking home','22:10 — she noticed the stranger'],'Choose the natural narrative sentence.',['She was walking home when she noticed the stranger.','She had walked home when she was noticing the stranger.'],'She was walking home when she noticed the stranger.','Use past progressive for background and past simple for the event.'],
    ['narrative',['09:00 — technicians started monitoring','13:00 — the attack began'],'Choose the form that emphasizes the prior ongoing activity.',['Technicians had been monitoring the network for four hours when the attack began.','Technicians were monitoring the network for four hours after the attack had begun.'],'Technicians had been monitoring the network for four hours when the attack began.','Past perfect progressive marks prior duration.'],
    ['narrative',['11:00 — the committee approved the text','12:00 — journalists received it'],'Choose the sentence with explicit anteriority.',['The committee had approved the text before journalists received it.','The committee was approving the text after journalists had received it.'],'The committee had approved the text before journalists received it.','Past perfect locates approval before the later past event.'],
    ['narrative',['18:30 — she was reading','18:42 — the alarm rang'],'Choose the natural sentence.',['She was reading when the alarm rang.','She had read when the alarm was ringing.'],'She was reading when the alarm rang.','The ongoing action is background; the alarm is the event.'],
    ['narrative',['16:00 — the witness left','17:00 — police arrived'],'Choose the sequence.',['The witness had left before the police arrived.','The witness was leaving after the police had arrived.'],'The witness had left before the police arrived.','Use past perfect for the earlier action.'],
    ['narrative',['10:00 — researchers started coding','15:00 — the server crashed'],'Choose the form that highlights five hours of prior activity.',['Researchers had been coding for five hours when the server crashed.','Researchers coded for five hours when the server had crashed.'],'Researchers had been coding for five hours when the server crashed.','Past perfect progressive emphasizes duration before the later event.'],
    ['future',['09:00 tomorrow — seminar begins'],'Choose the standard timetable form.',['The seminar starts at 9 tomorrow.','The seminar will have started at 9 yesterday.'],'The seminar starts at 9 tomorrow.','Present simple is commonly used for fixed timetables.'],
    ['future',['10:00 tomorrow — presentation in progress'],'Choose the form for an action in progress at that future time.',['At 10 tomorrow, I will be presenting my paper.','At 10 tomorrow, I will have presented my paper yesterday.'],'At 10 tomorrow, I will be presenting my paper.','Future progressive locates an activity in progress at a future point.'],
    ['future',['Friday — deadline','Before Friday — draft complete'],'Choose the form for completion before the deadline.',['By Friday, I will have finished the draft.','By Friday, I will be finishing the draft last week.'],'By Friday, I will have finished the draft.','Future perfect marks completion before a future reference point.'],
    ['future',['September — study begins','December — four months of study'],'Choose the form that emphasizes duration up to December.',['By December, I will have been studying English for four months.','By December, I will study English for four months yesterday.'],'By December, I will have been studying English for four months.','Future perfect progressive emphasizes duration up to a future point.'],
    ['future',['Tomorrow 10:00 — arranged supervisor meeting'],'Choose the form for a personal arrangement.',['I am meeting my supervisor tomorrow at 10.','I meet my supervisor yesterday at 10.'],'I am meeting my supervisor tomorrow at 10.','Present progressive is common for arranged future plans.'],
    ['future',['2030 — adoption complete before this point'],'Choose the future-perfect prediction.',['By 2030, many universities will have adopted new AI policies.','By 2030, many universities adopted new AI policies tomorrow.'],'By 2030, many universities will have adopted new AI policies.','Future perfect expresses expected completion before a future point.'],
    ['future',['This time next year — thesis writing in progress'],'Choose the natural form.',['This time next year, I will be writing my thesis.','This time next year, I will have wrote my thesis.'],'This time next year, I will be writing my thesis.','Future progressive expresses an action in progress at a future time.'],
    ['future',['Conference schedule — opening at 08:30'],'Choose the timetable form.',['The conference opens at 8:30.','The conference is going to have opened yesterday at 8:30.'],'The conference opens at 8:30.','Schedules commonly take the present simple.'],
    ['future',['Before the oral exam — practice accumulated over weeks'],'Choose the duration form.',['By the oral exam, I will have been practicing for several weeks.','By the oral exam, I practice for several weeks yesterday.'],'By the oral exam, I will have been practicing for several weeks.','Future perfect progressive expresses accumulated duration up to the future point.'],
    ['future',['Next week — already arranged presentation'],'Choose the arrangement form.',['I am presenting my project next week.','I present my project last week.'],'I am presenting my project next week.','Present progressive is natural for an arranged event.'],
    ['presentperfect',['08:00 — writing begins','12:00 — still writing'],'Choose the form that emphasizes ongoing duration.',['I have been writing all morning.','I have written all morning three times.'],'I have been writing all morning.','Present perfect progressive highlights ongoing activity and duration.'],
    ['presentperfect',['This month — three completed archive visits'],'Choose the form that emphasizes frequency/number.',['I have visited the archive three times this month.','I have been visiting the archive three times this month.'],'I have visited the archive three times this month.','Present perfect is natural for counted completed occurrences.'],
    ['presentperfect',['2019 — meet colleague','now — still know colleague'],'Choose the form for a continuing state.',['I have known her since 2019.','I have been knowing her since 2019.'],'I have known her since 2019.','Know is stative, so present perfect simple is preferred.'],
    ['presentperfect',['Morning — three pages completed'],'Choose the result-focused sentence.',['I have written three pages this morning.','I have been writing three pages this morning.'],'I have written three pages this morning.','Present perfect simple foregrounds the completed result.'],
    ['presentperfect',['Six months ago — data collection starts','now — collection continues'],'Choose the duration-focused form.',['They have been collecting data for six months.','They have collected data for six months and are still doing it.'],'They have been collecting data for six months.','Present perfect progressive naturally emphasizes an ongoing activity.'],
    ['presentperfect',['Past years — no previous English presentation','now — experience still absent'],'Choose the natural experience form.',['I have never presented this paper in English.','I have never been presenting this paper in English.'],'I have never presented this paper in English.','Present perfect simple is used for experience up to now.'],
    ['presentperfect',['Earlier today — analysis completed','now — result available'],'Choose the result-focused form.',['We have already finished the analysis.','We have already been finishing the analysis.'],'We have already finished the analysis.','Present perfect simple foregrounds the completed present result.'],
    ['presentperfect',['Recent weeks — repeated activity with temporary feel'],'Choose the activity-focused form.',['I have been practicing spoken English a lot recently.','I have practiced spoken English a lot recently and am doing it right now only once.'],'I have been practicing spoken English a lot recently.','Present perfect progressive highlights repeated/ongoing recent activity.'],
    ['presentperfect',['This week — five completed gym visits'],'Choose the frequency form.',['I have been to the gym five times this week.','I have been being to the gym five times this week.'],'I have been to the gym five times this week.','Present perfect simple is used for counted frequency.'],
    ['presentperfect',['Recent days — temporary bike commute continues'],'Choose the temporary ongoing form.',['I have been riding my bike to work recently.','I have ridden my bike to work right now for the last two weeks only as an ongoing activity.'],'I have been riding my bike to work recently.','Present perfect progressive highlights a temporary ongoing pattern.']
  ];
  timelineRows.forEach((x,i)=>exercises.push(exercise({
    id:id('time'),concept:x[0],domain:domains[i%domains.length],type:'timeline',transfer:i%3===0?'guided':'controlled',
    difficulty:2,prompt:x[2],timeline:x[1],options:x[3],answer:x[4],explanation:x[5],misconception:'time_relation'
  })));
}
addV04RichPractice();

const freeTasks=[
['questions','politics','You are interviewing a political scientist about an unexpected election result. Write or say three questions: one subject question, one object question, and one indirect question.','Example: Who changed the campaign strategy? What did the opposition propose? Could you tell me why turnout fell?'],
['questions','academic','Ask three natural follow-up questions after a researcher says: “The archival evidence changed my interpretation.”','Possible questions: What changed your interpretation? Which document changed it? Could you explain why the evidence mattered?'],
['agreement','academic','Explain in 3–4 sentences what research evidence can and cannot show. Include “the evidence”, “the results”, and “a series of studies”.','Model: The evidence suggests a relationship, but the results do not prove causation. A series of studies has reached similar conclusions.'],
['agreement','sociology','Describe a social trend using one singular collective expression and one plural subject.','Model: A series of surveys shows declining trust. Recent findings indicate that the pattern is uneven.'],
['narrative','horror','Tell a 4–5 sentence story: you entered an archive, something was happening, and you discovered that something had happened before you arrived.','Model: I entered the archive while the guard was checking the lights. A window suddenly slammed shut. Someone had removed three folders before I arrived. The staff had been looking for them for hours.'],
['narrative','politics','Narrate a fictional election-night crisis using an event, background action, earlier event, and prior duration.','Model: Officials were counting ballots when the system stopped. Technicians had noticed unusual traffic earlier, and they had been monitoring it for several hours.'],
['usedto','academic','Describe how your academic life has changed. Use used to, would, be used to, and get used to naturally.','Model: I used to avoid speaking English. I would prepare every sentence in advance. I am used to reading in English now, and I am getting used to speaking spontaneously.'],
['usedto','everyday','Compare an old routine with something that now feels normal but was difficult at first.','Model: I used to sleep later. I am used to getting up early now, although it took me weeks to get used to it.'],
['presentperfect','academic','Describe your English study this month. Mention one completed result and one activity that has continued over time.','Model: I have completed several grammar reviews, and I have been practicing spoken English every day.'],
['presentperfect','philosophy','Describe how your understanding of one philosophical author has changed over time using both perfect forms.','Model: I have read several essays on Arendt, and I have been reconsidering how she understands political action.'],
['conditionals','politics','Give four recommendations for protecting institutions during a crisis using unless, as long as, provided that, and in case.','Model: Institutions will remain resilient as long as procedures are followed. Emergency measures are acceptable provided that oversight continues.'],
['conditionals','everyday','Give practical advice for tomorrow using unless, in case, as soon as, and as long as.','Model: Take an umbrella in case it rains. As soon as you arrive, send me a message.'],
['future','academic','Describe your academic situation three months from now. Include a schedule, an arrangement, an action in progress, and something completed by then.','Model: The semester ends in December. I am meeting my supervisor next week. In three months I will be revising my paper, and I will have completed the course.'],
['future','technology','Make three predictions about AI and higher education using will, future progressive, and future perfect.','Model: AI will change assessment. Universities will be redesigning courses, and many institutions will have adopted new policies by then.'],
['verbpatterns','academic','Give advice about writing a paper using could, avoid, suggest, decide, and need + object + to-infinitive.','Model: You could narrow the question. Avoid making claims without evidence. I suggest revising the introduction. You need your reader to understand the argument.'],
['verbpatterns','politics','Describe a policy team’s decisions using suggest + -ing, decide + to, and a modal + base verb.','Model: The team suggested changing the procedure, decided to consult experts, and could publish the findings later.'],
['prepositions','politics','Explain political trust using depend on, responsible for, concerned about, impact on, and highly likely.','Model: Trust depends on institutional performance. Officials are responsible for enforcement and should be concerned about declining participation.'],
['prepositions','philosophy','Make a short academic claim using draw a distinction, raise an objection, be compatible with, and provide an account of.','Model: We can draw a distinction between autonomy and independence. One might raise an objection, but social dependence can be compatible with individuality.'],
['passivecausative','academic','Explain a research process using two passive forms and one causative have/get construction.','Model: The interviews were recorded and the data were coded. We had the transcripts checked before analysis.'],
['passivecausative','everyday','Describe two services you arranged for someone else to perform using have/get something done.','Model: I had my laptop repaired and got the document printed before the meeting.']
];
freeTasks.forEach((x)=>exercises.push(exercise({id:id('free'),concept:x[0],domain:x[1],type:'selfcheck',transfer:'free',difficulty:3,prompt:x[2],options:[],answer:x[3],explanation:'Compare your response with the model. The goal is accurate spontaneous use of the target structure, not reproducing the wording exactly.',misconception:'free_transfer'})));


const v04FreeTasks=[
['questions','philosophy','You are interviewing a philosopher after a lecture. Produce four natural follow-up questions, including one subject question and one indirect question.','Model: Who first formulated that objection? What did you mean by autonomy? Could you explain how the distinction affects your argument? What are you responding to?'],
['questions','everyday','A classmate says: “My morning was awful and I almost missed class.” Ask four natural follow-up questions.','Model: What happened? Who woke you up? What were you worried about? Could you tell me why you almost missed class?'],
['agreement','politics','Explain a survey result in four sentences while keeping agreement accurate with evidence, results, a series of polls, and each country.','Model: The evidence suggests a shift. The results indicate important differences. A series of polls has shown the same tendency. Each country presents a different pattern.'],
['agreement','philosophy','Define a concept in four sentences using one long singular subject and one plural subject without losing agreement.','Model: The relationship between autonomy and social dependence remains central. Recent arguments challenge the older account.'],
['narrative','literature','Retell a short disturbing scene using background, a main event, an earlier event, and prior duration.','Model: The narrator was walking through the house when the lights failed. Someone had opened the locked room earlier, and the family had been hearing noises for days.'],
['narrative','academic','Tell the story of a research problem that appeared after an earlier mistake and had been developing for several days.','Model: We were preparing the presentation when the dataset failed. A file had been corrupted earlier, and the team had been trying to recover it for days.'],
['usedto','sociology','Compare academic life before and after smartphones using all four members of the used-to family.','Model: Students used to rely more on printed material. They would spend longer in libraries. We are used to searching instantly now, and researchers had to get used to constant connectivity.'],
['usedto','everyday','Describe a morning habit you had in the past, a repeated routine, something normal now, and something you are still adapting to.','Model: I used to wake up late. I would skip breakfast. I am used to getting up earlier now, and I am still getting used to speaking English first thing in the morning.'],
['presentperfect','academic','Give a 45-second progress update on your English using present perfect for results and present perfect progressive for ongoing work.','Model: I have completed several grammar sets, and I have been practicing speaking every day.'],
['presentperfect','politics','Describe how a political debate has changed over the last decade, combining a continuing trend and completed developments.','Model: The debate has become more polarized, and researchers have been studying the role of social media for years.'],
['conditionals','politics','Give institutional advice using unless, provided that, as long as, in case, and as soon as.','Model: Institutions can act quickly provided that oversight remains. Keep backup procedures in case systems fail.'],
['conditionals','horror','Give survival instructions in a fictional archive using at least four alternatives to if.','Model: Do not open the door unless you hear the guard. Keep the flashlight ready in case the power fails.'],
['future','academic','Describe the next three months of your doctoral work using a schedule, an arrangement, future progressive, future perfect, and future perfect progressive.','Model: The seminar starts next week. I am meeting my supervisor on Friday. By December I will have completed the chapter.'],
['future','technology','Make a structured forecast about AI and universities using three distinct future forms and explain why each form fits.','Model: Universities will change assessment; many will be redesigning courses; by 2030 they will have adopted new rules.'],
['verbpatterns','academic','Give five pieces of advice to someone preparing a paper, deliberately using modal + base, avoid + -ing, suggest + -ing, decide + to, and need + object + to.','Model: You could narrow the question. Avoid overstating the evidence. I suggest revising the introduction.'],
['verbpatterns','everyday','Explain a study plan using plan to, avoid -ing, consider -ing, need someone to, and can + base.','Model: I plan to study tonight, avoid checking my phone, consider taking notes, and ask someone to test me.'],
['prepositions','politics','Explain democratic resilience using five complete chunks from the preposition/collocation bank.','Model: Resilience depends on institutional capacity and has an impact on public trust. Officials should be concerned about weak enforcement.'],
['prepositions','academic','Describe a research problem using interested in, responsible for, reason for, risk of, and impact on.','Model: I am interested in the reason for the discrepancy. The team is responsible for checking the risk of bias and its impact on the results.'],
['passivecausative','academic','Explain how an academic manuscript moved from draft to submission using at least three passives and two causatives.','Model: The draft was reviewed, the references were checked, and the paper was submitted. I had the figures redesigned and got the bibliography corrected.'],
['passivecausative','everyday','Describe a day when you arranged several services using have/get something done, then add one ordinary passive.','Model: I had my phone repaired and got a document printed. The package was delivered in the afternoon.']
];
v04FreeTasks.forEach((x)=>exercises.push(exercise({id:id('free4'),concept:x[0],domain:x[1],type:'selfcheck',transfer:'free',difficulty:3,prompt:x[2],options:[],answer:x[3],explanation:'Use the model as a diagnostic reference, not as a script. Check whether the target grammar appeared accurately and naturally.',misconception:'free_transfer'})));

export {concepts,C,domains,exercises,speaking,pronunciation,schedules};
