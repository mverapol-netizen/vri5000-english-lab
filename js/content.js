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
{id:'passivecausative',name:'Passive & causative',priority:6,summary:'Passive voice and have/get something done.',rule:'Passive = be + past participle. Causative = have/get + object + past participle.',examples:['The data were collected in 2025.','We had the document translated.']}
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

const schedules={
 conservative:[
  {date:'2026-09-28',title:'Oral Midterm',assessment:true,concepts:['questions','narrative','conditionals','usedto','agreement','prepositions']},
  {date:'2026-10-19',title:'Academic Project Presentation',assessment:true,concepts:['questions','agreement','prepositions','presentperfect']},
  {date:'2026-10-21',title:'Unit 4.1 · Future forms',concepts:['future']},
  {date:'2026-10-26',title:'Unit 4.2 · Future perfect/progressive',concepts:['future']},
  {date:'2026-11-04',title:'Written Exam',assessment:true,concepts:['future','prepositions','agreement']},
  {date:'2026-11-09',title:'Unit 5.1 · Passive & causative',concepts:['passivecausative']},
  {date:'2026-11-16',title:'Unit 5.2 · -ing & infinitive',concepts:['verbpatterns']},
  {date:'2026-11-18',title:'Unit 5.3 · Counterarguments',concepts:['conditionals']},
  {date:'2026-12-02',title:'Final Oral Exam',assessment:true,concepts:concepts.map(x=>x.id)}
 ],
 mon_wed:[
{date:'2026-09-28',title:'Oral Midterm',assessment:true,concepts:['questions','narrative','conditionals','usedto','agreement','prepositions']},
{date:'2026-09-30',title:'Presentation preparation · Organizing',concepts:['questions','prepositions','agreement']},
{date:'2026-10-07',title:'Presentation preparation · Opening',concepts:['questions','prepositions']},
{date:'2026-10-19',title:'Academic Project Presentation',assessment:true,concepts:['questions','agreement','prepositions','presentperfect']},
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
{date:'2026-10-06',title:'Oral Midterm',assessment:true,concepts:['questions','narrative','conditionals','usedto','agreement','prepositions']},
{date:'2026-10-08',title:'Presentation preparation · Organizing',concepts:['questions','prepositions','agreement']},
{date:'2026-10-15',title:'Presentation preparation · Opening',concepts:['questions','prepositions']},
{date:'2026-10-20',title:'Academic Project Presentation',assessment:true,concepts:['questions','agreement','prepositions','presentperfect']},
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
{date:'2026-10-02',title:'Oral Midterm',assessment:true,concepts:['questions','narrative','conditionals','usedto','agreement','prepositions']},
{date:'2026-10-07',title:'Presentation preparation · Organizing',concepts:['questions','prepositions','agreement']},
{date:'2026-10-16',title:'Presentation preparation · Opening',concepts:['questions','prepositions']},
{date:'2026-10-21',title:'Academic Project Presentation',assessment:true,concepts:['questions','agreement','prepositions','presentperfect']},
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
{date:'2026-09-30',title:'Oral Midterm',assessment:true,concepts:['questions','narrative','conditionals','usedto','agreement','prepositions']},
{date:'2026-10-07',title:'Presentation preparation · Organizing',concepts:['questions','prepositions','agreement']},
{date:'2026-10-16',title:'Presentation preparation · Opening',concepts:['questions','prepositions']},
{date:'2026-10-21',title:'Academic Project Presentation',assessment:true,concepts:['questions','agreement','prepositions','presentperfect']},
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

export {concepts,C,domains,exercises,speaking,schedules};
