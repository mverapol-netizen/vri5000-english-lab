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
{id:'academicdiscourse',name:'Academic discourse',priority:8,summary:'Signposting, hedging, concession, reformulation and Q&A for academic presentations and writing.',rule:'Use explicit discourse frames to organize claims, soften certainty, concede objections and repair your wording without abandoning the turn.',examples:['My main argument is that…','The evidence suggests that…','While it is true that…, I would argue that…','What I mean is…','Let me rephrase that…']},
{id:'intensifiers',name:'Intensifiers',priority:7,summary:'Natural adverb–adjective and adverb–comparative combinations for degree and emphasis.',rule:'Choose an intensifier that collocates naturally with the adjective or comparative: considerably + comparative, utterly/totally + strong adjective, intensely/deeply + evaluative state, extremely + gradable adjective.',examples:['considerably more effective','utterly unrealistic','totally unexpected','intensely frustrating','extremely difficult']},
{id:'counterarguments',name:'Conditional counterarguments',priority:7,summary:'Use conditional structures to respond directly to another speaker’s argument and emphasize a contrasting possibility.',rule:'Reuse part of the original claim, then answer with a conditional counterargument. The modal often carries contrastive stress in speech: “That may be true, but people might change if…”',examples:['That may be true, but people might change if the incentives were stronger.','It could work if local institutions supported it.','Even if the cost increased, the long-term benefit might still justify it.']}
];
const C=Object.fromEntries(concepts.map(x=>[x.id,x]));
const domains=['politics','philosophy','sociology','horror','literature','academic','everyday','technology','environment','cities'];
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



speaking.push(
{id:'counter_speak_01',concept:'counterarguments',domain:'environment',seconds:60,prompt:'Respond to this claim: “People will never give up convenient disposable products.” Give two conditional counterarguments.',targets:['direct reuse of claim','modal contrast','if-clause']},
{id:'counter_speak_02',concept:'counterarguments',domain:'politics',seconds:60,prompt:'Respond to this claim: “Once institutions lose legitimacy, reform is pointless.” Use acknowledgment, could/might, and a condition.',targets:['acknowledgment','could/might','condition']},
{id:'counter_speak_03',concept:'counterarguments',domain:'technology',seconds:75,prompt:'Debate the claim that AI will inevitably make university assessment meaningless. Give one concession and two conditional responses.',targets:['concession','conditional counterargument','contrastive modal']},
{id:'counter_speak_04',concept:'counterarguments',domain:'academic',seconds:60,prompt:'A listener says your proposal would only work in wealthy countries. Respond without rejecting the criticism outright.',targets:['acknowledgment','conditional alternative','qualified conclusion']}
);



const chunks=[
{id:'chunk_acad_01',area:'Academic argument',text:'the evidence suggests that',meaning_es:'la evidencia sugiere que',example:'The evidence suggests that institutional trust has declined.',trap:'Avoid treating evidence as a person that “says” something.'},
{id:'chunk_acad_02',area:'Academic argument',text:'this raises the question of',meaning_es:'esto plantea la pregunta de',example:'This raises the question of how autonomy should be understood.',trap:'Use of before a noun phrase; use whether/why/how for a clause.'},
{id:'chunk_acad_03',area:'Academic argument',text:'to some extent',meaning_es:'hasta cierto punto',example:'To some extent, the pattern reflects institutional differences.',trap:'Do not overuse it as a filler.'},
{id:'chunk_acad_04',area:'Academic argument',text:'broadly speaking',meaning_es:'en términos generales',example:'Broadly speaking, the cases follow a similar trajectory.',trap:'Useful for a qualified generalization, not a precise finding.'},
{id:'chunk_acad_05',area:'Academic argument',text:'one possible explanation is that',meaning_es:'una posible explicación es que',example:'One possible explanation is that lower trust reduces compliance.',trap:'Keep the claim explicitly provisional.'},
{id:'chunk_acad_06',area:'Academic argument',text:'taken together, these findings suggest that',meaning_es:'en conjunto, estos hallazgos sugieren que',example:'Taken together, these findings suggest that institutional design matters.',trap:'Use it to synthesize, not introduce a new argument.'},

{id:'chunk_pol_01',area:'Political science',text:'institutional capacity',meaning_es:'capacidad institucional',example:'The reform depends on institutional capacity.',trap:'Institutional capacity is usually uncountable in this use.'},
{id:'chunk_pol_02',area:'Political science',text:'rule of law',meaning_es:'Estado de derecho',example:'The rule of law constrains the arbitrary use of power.',trap:'Normally use the rule of law with the article.'},
{id:'chunk_pol_03',area:'Political science',text:'political accountability',meaning_es:'rendición de cuentas política',example:'Political accountability can shape public trust.',trap:'Accountability is normally uncountable.'},
{id:'chunk_pol_04',area:'Political science',text:'public trust',meaning_es:'confianza pública',example:'Public trust remains fragile after the scandal.',trap:'Do not translate literally as “public confidence” in every context.'},
{id:'chunk_pol_05',area:'Political science',text:'democratic resilience',meaning_es:'resiliencia democrática',example:'Democratic resilience depends on both institutions and social norms.',trap:'Use democratic, not democracy, before the noun.'},
{id:'chunk_pol_06',area:'Political science',text:'policy implementation',meaning_es:'implementación de políticas',example:'Policy implementation varies across municipalities.',trap:'Implementation is uncountable when referring to the process.'},

{id:'chunk_phi_01',area:'Philosophy',text:'draw a distinction between',meaning_es:'trazar una distinción entre',example:'We need to draw a distinction between dependence and domination.',trap:'Use between when two categories are contrasted.'},
{id:'chunk_phi_02',area:'Philosophy',text:'make a claim about',meaning_es:'formular una afirmación sobre',example:'The author makes a claim about the social conditions of freedom.',trap:'Prefer make a claim, not do a claim.'},
{id:'chunk_phi_03',area:'Philosophy',text:'raise an objection to',meaning_es:'plantear una objeción a',example:'One might raise an objection to this account of autonomy.',trap:'Use raise, not make, for an objection in formal argument.'},
{id:'chunk_phi_04',area:'Philosophy',text:'provide an account of',meaning_es:'ofrecer una explicación/concepción de',example:'The theory provides an account of political obligation.',trap:'Account of, not account about.'},
{id:'chunk_phi_05',area:'Philosophy',text:'be compatible with',meaning_es:'ser compatible con',example:'Individuality can be compatible with social dependence.',trap:'Compatible with, not compatible to.'},
{id:'chunk_phi_06',area:'Philosophy',text:'a necessary condition for',meaning_es:'una condición necesaria para',example:'Recognition may be a necessary condition for autonomy.',trap:'Condition for, not condition of, in this structure.'},

{id:'chunk_soc_01',area:'Sociology',text:'shape outcomes',meaning_es:'moldear resultados',example:'Institutional arrangements can shape social outcomes.',trap:'Outcome is countable; use outcomes for multiple effects.'},
{id:'chunk_soc_02',area:'Sociology',text:'reinforce inequality',meaning_es:'reforzar la desigualdad',example:'Algorithmic systems may reinforce existing inequality.',trap:'Reinforce, not reforce.'},
{id:'chunk_soc_03',area:'Sociology',text:'social cohesion',meaning_es:'cohesión social',example:'High residential segregation can weaken social cohesion.',trap:'Cohesion is uncountable.'},
{id:'chunk_soc_04',area:'Sociology',text:'undergo change',meaning_es:'experimentar cambios',example:'Urban neighborhoods can undergo rapid change.',trap:'Undergo is irregular: undergo, underwent, undergone.'},
{id:'chunk_soc_05',area:'Sociology',text:'patterns of behavior',meaning_es:'patrones de comportamiento',example:'The study identifies recurring patterns of behavior.',trap:'Behavior is usually uncountable in general use.'},
{id:'chunk_soc_06',area:'Sociology',text:'be shaped by',meaning_es:'estar determinado/moldeado por',example:'Political attitudes are shaped by both institutions and experience.',trap:'Useful passive chunk; avoid overusing caused by.'},

{id:'chunk_repair_01',area:'Error repair',text:'depend on',meaning_es:'depender de',example:'The outcome depends on institutional capacity.',trap:'Not depend about.'},
{id:'chunk_repair_02',area:'Error repair',text:'think about',meaning_es:'pensar/reflexionar sobre',example:'We need to think about the consequences of the reform.',trap:'Use think about for considering a topic.'},
{id:'chunk_repair_03',area:'Error repair',text:'think of X as Y',meaning_es:'concebir X como Y',example:'We can think of autonomy as a social achievement.',trap:'Not think in X as Y.'},
{id:'chunk_repair_04',area:'Error repair',text:'highly likely',meaning_es:'altamente probable',example:'The outcome is highly likely under these conditions.',trap:'Not deeply likely or bitterly likely.'},
{id:'chunk_repair_05',area:'Error repair',text:'harness the potential of',meaning_es:'aprovechar el potencial de',example:'Universities need to harness the potential of AI responsibly.',trap:'Not explode AI potential.'},
{id:'chunk_repair_06',area:'Error repair',text:'make progress',meaning_es:'progresar',example:'I have made progress with question formation.',trap:'Not do progress or make progresses.'},

{id:'chunk_disc_01',area:'Discourse',text:'what I mean is',meaning_es:'lo que quiero decir es',example:'What I mean is that the mechanism operates indirectly.',trap:'Use it to repair without abandoning the turn.'},
{id:'chunk_disc_02',area:'Discourse',text:'let me rephrase that',meaning_es:'déjame reformular eso',example:'Let me rephrase that: the claim is more limited.',trap:'Keep speaking after the repair phrase.'},
{id:'chunk_disc_03',area:'Discourse',text:'while it is true that',meaning_es:'si bien es cierto que',example:'While it is true that access has expanded, inequalities remain.',trap:'Follow it with a complete clause.'},
{id:'chunk_disc_04',area:'Discourse',text:'by contrast',meaning_es:'en contraste',example:'By contrast, the second case shows much weaker enforcement.',trap:'Use it for an explicit contrast, not just sequence.'},
{id:'chunk_disc_05',area:'Discourse',text:'if this interpretation is correct',meaning_es:'si esta interpretación es correcta',example:'If this interpretation is correct, it has implications for autonomy.',trap:'Useful for cautious implication.'},
{id:'chunk_disc_06',area:'Discourse',text:'I see the concern, but',meaning_es:'entiendo la objeción/preocupación, pero',example:'I see the concern, but I would draw a distinction here.',trap:'Acknowledge before disagreeing.'},

{id:'chunk_every_01',area:'Everyday interaction',text:"I didn't sleep very well",meaning_es:'no dormí muy bien',example:"I didn't sleep very well, so I'm still waking up.",trap:'Natural for a difficult morning.'},
{id:'chunk_every_02',area:'Everyday interaction',text:"I'm still waking up",meaning_es:'todavía me estoy despertando/activando',example:"Give me a minute; I'm still waking up.",trap:'More natural than saying you are “with sleep.”'},
{id:'chunk_every_03',area:'Everyday interaction',text:"I'm a little confused about",meaning_es:'estoy un poco confundido con',example:"I'm a little confused about the last example.",trap:'A little is neutral; kind of is more informal and vaguer.'},
{id:'chunk_every_04',area:'Everyday interaction',text:'what about you?',meaning_es:'¿y tú?',example:"My morning was rough. What about you?",trap:'Simple but essential for returning a question.'},
{id:'chunk_every_05',area:'Everyday interaction',text:'how did that go?',meaning_es:'¿cómo te fue con eso?',example:"You had a presentation yesterday. How did that go?",trap:'Useful natural follow-up.'},
{id:'chunk_every_06',area:'Everyday interaction',text:'that sounds rough',meaning_es:'suena duro/complicado',example:"You barely slept? That sounds rough.",trap:'Informal and empathetic; avoid in very formal academic settings.'},

{id:'chunk_method_01',area:'Research methods',text:'account for variation in',meaning_es:'explicar variación en',example:'The model attempts to account for variation in turnout.',trap:'Account for, not explain about.'},
{id:'chunk_method_02',area:'Research methods',text:'be associated with',meaning_es:'estar asociado con',example:'Higher trust is associated with greater compliance.',trap:'Association is not automatically causation.'},
{id:'chunk_method_03',area:'Research methods',text:'control for',meaning_es:'controlar por',example:'The model controls for country-level income.',trap:'In statistical English, control for is standard.'},
{id:'chunk_method_04',area:'Research methods',text:'a robust finding',meaning_es:'un hallazgo robusto',example:'The relationship remains a robust finding across specifications.',trap:'Robust is common for stability across models/specifications.'},
{id:'chunk_method_05',area:'Research methods',text:'the results remain unchanged',meaning_es:'los resultados se mantienen sin cambios',example:'The results remain largely unchanged after adding controls.',trap:'Useful for robustness reporting.'},
{id:'chunk_method_06',area:'Research methods',text:'interpret with caution',meaning_es:'interpretar con cautela',example:'The coefficient should be interpreted with caution.',trap:'Common passive form in academic writing.'},

{id:'chunk_dep_01',area:'Dependent prepositions',text:'anxious about',meaning_es:'ansioso/preocupado por',example:'The students were anxious about the oral exam.',trap:'Anxious about, not anxious for in this meaning.'},
{id:'chunk_dep_02',area:'Dependent prepositions',text:'interested in',meaning_es:'interesado en',example:'I am interested in how institutions shape behavior.',trap:'Interested in + noun/-ing.'},
{id:'chunk_dep_03',area:'Dependent prepositions',text:'responsible for',meaning_es:'responsable de',example:'The team is responsible for checking the data.',trap:'Responsible for, not responsible of.'},
{id:'chunk_dep_04',area:'Dependent prepositions',text:'aware of',meaning_es:'consciente de',example:'Researchers should be aware of potential measurement error.',trap:'Aware of, not aware about.'},
{id:'chunk_dep_05',area:'Dependent prepositions',text:'sensitive to',meaning_es:'sensible a',example:'The estimate is sensitive to the coding decision.',trap:'Sensitive to is common in analysis.'},
{id:'chunk_dep_06',area:'Dependent prepositions',text:'concerned about',meaning_es:'preocupado por',example:'The committee is concerned about declining participation.',trap:'Concerned about for worry; concerned with can mean dealing with a topic.'},

{id:'chunk_phrasal_01',area:'Phrasal verbs',text:'deal with',meaning_es:'lidiar con/abordar',example:'The team had to deal with several unexpected problems.',trap:'Deal with, not deal about.'},
{id:'chunk_phrasal_02',area:'Phrasal verbs',text:'sort out',meaning_es:'resolver/ordenar',example:'We eventually sorted out the coding problem.',trap:'Separable: sort the problem out / sort out the problem.'},
{id:'chunk_phrasal_03',area:'Phrasal verbs',text:'run into',meaning_es:'encontrarse con un problema',example:'We ran into a problem during data collection.',trap:'Run into is informal-neutral and common in spoken English.'},
{id:'chunk_phrasal_04',area:'Phrasal verbs',text:'figure out',meaning_es:'descubrir/entender/resolver',example:'We need to figure out why the estimates changed.',trap:'Common in speech; use determine/establish for more formal writing.'},
{id:'chunk_phrasal_05',area:'Phrasal verbs',text:'end up',meaning_es:'terminar/acabar',example:'The discussion ended up focusing on institutional trust.',trap:'End up + -ing is common.'},
{id:'chunk_phrasal_06',area:'Phrasal verbs',text:'get away with',meaning_es:'salirse con la suya',example:'Officials should not be able to get away with ignoring the rules.',trap:'Get away with + noun/-ing.'},

{id:'chunk_follow_01',area:'Follow-up questions',text:'what happened next?',meaning_es:'¿qué pasó después?',example:'You said the system failed. What happened next?',trap:'Simple natural follow-up for narratives.'},
{id:'chunk_follow_02',area:'Follow-up questions',text:'how come?',meaning_es:'¿cómo es que?/¿por qué?',example:'You changed your topic? How come?',trap:'Informal; do not invert after how come: How come you changed it?'},
{id:'chunk_follow_03',area:'Follow-up questions',text:'what do you mean by',meaning_es:'¿qué quieres decir con?',example:'What do you mean by institutional autonomy?',trap:'Useful for clarification; follow with noun/phrase.'},
{id:'chunk_follow_04',area:'Follow-up questions',text:'did that help?',meaning_es:'¿eso ayudó?',example:'You changed the schedule. Did that help?',trap:'Natural short follow-up.'},
{id:'chunk_follow_05',area:'Follow-up questions',text:'and then what?',meaning_es:'¿y después qué?',example:'You found the document—and then what?',trap:'Very conversational; use What happened after that? in more formal contexts.'},
{id:'chunk_follow_06',area:'Follow-up questions',text:'would you say that',meaning_es:'¿dirías que…?',example:'Would you say that the reform changed public expectations?',trap:'Useful cautious interview frame.'},

{id:'chunk_morning_01',area:'Everyday interaction',text:'I had a rough start this morning',meaning_es:'tuve un comienzo difícil esta mañana',example:'I had a rough start this morning, but I am doing better now.',trap:'Natural alternative to “my morning was difficult.”'},
{id:'chunk_morning_02',area:'Everyday interaction',text:"I'm running on very little sleep",meaning_es:'estoy funcionando con muy pocas horas de sueño',example:"I'm running on very little sleep today.",trap:'Informal but natural.'},
{id:'chunk_morning_03',area:'Everyday interaction',text:"I'm a bit out of it",meaning_es:'estoy un poco ido/desorientado',example:"Sorry, I'm a bit out of it this morning.",trap:'Informal; useful for tired/confused state.'},
{id:'chunk_morning_04',area:'Everyday interaction',text:'I need a minute to wake up',meaning_es:'necesito un minuto para activarme',example:'I need a minute to wake up before we start.',trap:'Natural morning expression.'},
{id:'chunk_morning_05',area:'Everyday interaction',text:'how about you?',meaning_es:'¿y tú?',example:'I barely slept. How about you?',trap:'Equivalent to What about you? in many casual exchanges.'},
{id:'chunk_morning_06',area:'Everyday interaction',text:"I'm not fully awake yet",meaning_es:'todavía no estoy completamente despierto',example:"I'm not fully awake yet, so give me a second.",trap:'Natural and direct.'}
];

const shadowing=[
{id:'shadow_01',domain:'politics',focus:'thought groups + stress',transcript:'Public trust does not depend on one institution alone. It is shaped by repeated interactions between citizens and public authorities. The evidence suggests that transparency can help, but only when it is accompanied by credible accountability.',chunks:['public trust','is shaped by','the evidence suggests that'],reusePrompt:'Explain one reason why public trust may rise or fall. Reuse at least two chunks from the passage.'},
{id:'shadow_02',domain:'philosophy',focus:'contrast + self-repair',transcript:'I would draw a distinction between dependence and domination. Dependence is unavoidable in social life, but domination involves an asymmetry of power. What I mean is that individuality does not require complete independence from others.',chunks:['draw a distinction between','what I mean is','social life'],reusePrompt:'Define a concept you work with and make one distinction using the same discourse frames.'},
{id:'shadow_03',domain:'academic',focus:'hedging + sentence stress',transcript:'The available evidence suggests that the effect may vary across cases. One possible explanation is that institutions respond differently to the same external pressure. Taken together, these findings point to a more conditional interpretation.',chunks:['the evidence suggests that','one possible explanation is that','taken together'],reusePrompt:'Summarize a research finding cautiously using at least two chunks.'},
{id:'shadow_04',domain:'sociology',focus:'linking + rhythm',transcript:'Urban neighborhoods can undergo rapid change when housing costs rise and long-term residents move away. These changes may reinforce inequality and weaken social cohesion, especially when access to public services also becomes more uneven.',chunks:['undergo change','reinforce inequality','social cohesion'],reusePrompt:'Describe one social change and its consequences using two or three chunks from the passage.'},
{id:'shadow_05',domain:'horror',focus:'narrative rhythm',transcript:'The researcher was reading alone when the lights went out. Someone had removed several pages from the manuscript before she arrived, and she had been hearing footsteps in the corridor for almost an hour.',chunks:['was reading','had removed','had been hearing'],reusePrompt:'Retell a different unsettling scene using the same three time planes.'},
{id:'shadow_06',domain:'technology',focus:'future forms + stress',transcript:'By the end of the decade, universities will have adopted new rules for artificial intelligence. Some teachers will be redesigning assessment, while students will have been using these tools for years. The transition is highly likely to remain uneven.',chunks:['will have adopted','will be redesigning','highly likely'],reusePrompt:'Make a prediction about technology and education using at least two future forms and one intensifier.'},
{id:'shadow_07',domain:'everyday',focus:'natural conversation rhythm',transcript:"I didn't sleep very well last night, so I'm still waking up. I'm a little confused about the homework too. How did your morning go? Did you manage to finish everything?",chunks:["I didn't sleep very well","I'm still waking up","I'm a little confused about","How did your morning go?"],reusePrompt:'Give a natural 30-second morning update and ask the other person two follow-up questions.'},
{id:'shadow_08',domain:'academic',focus:'Q&A + reformulation',transcript:'That is an important objection. I see the concern, but I would distinguish between the empirical and normative parts of the claim. Let me rephrase that: the evidence supports the first more strongly than the second.',chunks:['I see the concern, but','draw a distinction','let me rephrase that'],reusePrompt:'Answer a difficult academic question using acknowledgment, distinction and reformulation.'},
{id:'shadow_09',domain:'environment',focus:'counterargument + modal stress',transcript:'Penalties may change behavior, but they are not the only option. People might also respond if the sustainable choice were cheaper and easier. That may be true only when the alternative is actually convenient.',chunks:['might also respond if','that may be true','sustainable choice'],reusePrompt:'Respond to an environmental policy claim with one acknowledgment and one conditional counterargument.'},
{id:'shadow_10',domain:'academic',focus:'dependent prepositions + linking',transcript:'The team was anxious about the deadline, but everyone was aware of the main risks. One researcher was responsible for checking the data, while another dealt with the missing files and eventually sorted the problem out.',chunks:['anxious about','aware of','responsible for','deal with','sort out'],reusePrompt:'Describe a project problem using at least three dependent-preposition or phrasal-verb chunks.'}
];

const conversations=[
{id:'conv_01',title:'Difficult morning before class',domain:'everyday',concepts:['questions'],opening:"You look tired today. Rough morning?",turns:[
{other:"I barely slept either. What happened to you?",task:'Give a short morning update, then return a question.',frames:["I didn't sleep very well…","I'm still waking up.","What about you?"]},
{other:"I had to finish an assignment at 2 a.m.",task:'React naturally and ask a follow-up.',frames:["That sounds rough.","How did that go?","Did you manage to…?"]},
{other:"Yeah, but I think I made a few mistakes.",task:'Ask one subject question and one object question about the assignment.',frames:['Who checked…?','What did you…?']}
]},
{id:'conv_02',title:'Seminar follow-up questions',domain:'academic',concepts:['questions','academicdiscourse'],opening:'A speaker says: “One unexpected finding changed the entire argument.”',turns:[
{other:'The finding appeared only in two countries.',task:'Ask what caused the difference and who first noticed it.',frames:['What caused…?','Who first noticed…?']},
{other:'A research assistant noticed it during data cleaning.',task:'Ask a polite indirect question about the data-cleaning process.',frames:['Could you explain how…?','Could you tell me whether…?']},
{other:'The mechanism is still uncertain.',task:'Ask one cautious follow-up rather than demanding certainty.',frames:['Would it be fair to say…?','Is it possible that…?']}
]},
{id:'conv_03',title:'Academic Q&A objection',domain:'philosophy',concepts:['academicdiscourse','counterarguments'],opening:'A listener says: “Your argument seems to confuse social dependence with domination.”',turns:[
{other:'Can you explain the difference?',task:'Acknowledge and draw a distinction.',frames:['I see the concern, but…','I would draw a distinction between…']},
{other:'But dependence can still limit freedom.',task:'Concede one point and qualify your claim.',frames:['While it is true that…','To some extent…']},
{other:'So are you changing your original argument?',task:'Reformulate without abandoning the position.',frames:['What I mean is…','Let me rephrase that…']}
]},
{id:'conv_04',title:'Political counterargument',domain:'politics',concepts:['counterarguments','conditionals'],opening:'A colleague says: “Once public trust falls, governments cannot recover it.”',turns:[
{other:'Trust is too fragile after a scandal.',task:'Give a conditional counterargument.',frames:['It could if…','People might… if…']},
{other:'But citizens may think reforms are only symbolic.',task:'Acknowledge the concern and add a condition.',frames:['That may be true, but…','provided that…']},
{other:'What would convince you that trust had recovered?',task:'Answer cautiously with one indicator.',frames:['One possible indicator is…','The evidence would be more convincing if…']}
]},
{id:'conv_05',title:'Supervisor meeting',domain:'academic',concepts:['presentperfect','future','verbpatterns'],opening:'Your supervisor asks: “What have you done since our last meeting?”',turns:[
{other:'What are you still working on?',task:'Use present perfect progressive for ongoing work.',frames:['I have been working on…']},
{other:'What will you have finished by next week?',task:'Answer with future perfect.',frames:['By next week, I will have…']},
{other:'What do you need me to review?',task:'Use need + object + to-infinitive naturally.',frames:['I need you to…']}
]},
{id:'conv_06',title:'City change discussion',domain:'sociology',concepts:['usedto','presentperfect'],opening:'A friend says: “This neighborhood feels completely different now.”',turns:[
{other:'What was it like before?',task:'Use used to and would for past habits/states.',frames:['It used to…','People would…']},
{other:'What feels normal now?',task:'Use be used to + -ing.',frames:["I'm used to…"]},
{other:'What are residents still adapting to?',task:'Use get used to + -ing.',frames:['They are still getting used to…']}
]},
{id:'conv_07',title:'Archive horror',domain:'horror',concepts:['narrative','questions'],opening:'A researcher says: “When I entered the archive, one cabinet was already open.”',turns:[
{other:'The room was completely empty.',task:'Ask what had happened before the researcher arrived.',frames:['What had happened…?','Who had…?']},
{other:'I had been hearing footsteps for several minutes.',task:'Ask one natural follow-up about the duration/background.',frames:['How long had you been…?']},
{other:'Then the lights went out.',task:'Retell the sequence in two or three sentences using several past planes.',frames:['was/were + -ing','had + participle','past simple']}
]},
{id:'conv_08',title:'Future of universities',domain:'technology',concepts:['future','intensifiers','counterarguments'],opening:'A colleague says: “AI will completely transform universities within five years.”',turns:[
{other:'Most assessment will be automated.',task:'Respond with a qualified prediction using an intensifier.',frames:['highly likely','considerably more…','to some extent']},
{other:'Teachers will not be necessary anymore.',task:'Give a conditional counterargument.',frames:['They might still be necessary if…']},
{other:'What do you think universities will have changed by 2030?',task:'Use future perfect and one cautious claim.',frames:['By 2030, universities will have…','The evidence suggests that…']}
]},
{id:'conv_09',title:'Research project went wrong',domain:'academic',concepts:['prepositions','narrative'],opening:'A colleague says: “Our data collection went badly yesterday.”',turns:[
{other:'We ran into three different problems.',task:'Ask what they had to deal with first.',frames:['What did you have to deal with first?','What happened next?']},
{other:'The files were in the wrong format.',task:'React and ask how they sorted it out.',frames:['How did you sort that out?','Did that help?']},
{other:'Eventually we fixed it, but we lost two hours.',task:'Retell the sequence briefly using one past perfect form.',frames:['had… before…','ended up…']}
]},
{id:'conv_10',title:'Fear and advice',domain:'everyday',concepts:['conditionals','questions'],opening:'A classmate says: “I get really anxious before oral presentations.”',turns:[
{other:'I usually forget what I wanted to say.',task:'Offer advice using in case.',frames:['Take a short outline in case…']},
{other:'I also speak too fast.',task:'Give another condition using as long as or provided that.',frames:['You will sound clearer as long as…','Provided that…']},
{other:'What if I completely freeze?',task:'Respond naturally, then return a question.',frames:['If that happens…','What usually helps you…?']}
]},
{id:'conv_11',title:'Environmental proposal',domain:'environment',concepts:['counterarguments','passivecausative'],opening:'A colleague says: “People will never adopt reusable systems voluntarily.”',turns:[
{other:'Convenience matters more than environmental concern.',task:'Give a conditional counterargument.',frames:['They might if…','It could work if…']},
{other:'The infrastructure would still be expensive.',task:'Acknowledge the point and propose a solution.',frames:['That may be true, but…','One way to tackle this is…']},
{other:'How would you implement it?',task:'Use one passive or causative structure.',frames:['The system could be introduced…','The city could have… installed.']}
]},
{id:'conv_12',title:'Clarifying a confusing explanation',domain:'academic',concepts:['questions','academicdiscourse'],opening:'A professor gives an explanation that you only partly understand.',turns:[
{other:'The mechanism is indirect and depends on institutional mediation.',task:'Say that you are a little confused and ask for clarification naturally.',frames:["I'm a little confused about…",'What do you mean by…?']},
{other:'I mean that institutions shape how the effect appears.',task:'Check your understanding with a cautious follow-up.',frames:['Would you say that…?','So, if I understand correctly…']},
{other:'Yes, exactly.',task:'Briefly reformulate the idea in your own words.',frames:['What I mean is…','So the key point is…']}
]}
];

const listening=[
{id:'listen_01',concept:'questions',domain:'academic',focus:'subject question',transcript:'Who developed the argument that changed the debate?',tip:'Listen for who + past verb without did.'},
{id:'listen_02',concept:'questions',domain:'everyday',focus:'indirect question',transcript:'Could you tell me why the class was moved to another room?',tip:'Notice statement word order after the indirect question frame.'},
{id:'listen_03',concept:'questions',domain:'politics',focus:'preposition question',transcript:'What are the researchers most concerned about?',tip:'Listen for the final preposition as part of the question.'},
{id:'listen_04',concept:'agreement',domain:'academic',focus:'agreement',transcript:'A series of recent studies has challenged the earlier interpretation.',tip:'The head noun series controls the singular verb.'},
{id:'listen_05',concept:'agreement',domain:'politics',focus:'agreement',transcript:'The results indicate that public trust remains fragile.',tip:'Results takes indicate; trust takes remains.'},
{id:'listen_06',concept:'narrative',domain:'horror',focus:'past background',transcript:'She was reading in the archive when the lights suddenly went out.',tip:'Distinguish the ongoing background from the interrupting event.'},
{id:'listen_07',concept:'narrative',domain:'academic',focus:'past perfect',transcript:'Someone had removed the file before the researcher arrived.',tip:'Listen for had + past participle marking the earlier event.'},
{id:'listen_08',concept:'narrative',domain:'literature',focus:'past perfect progressive',transcript:'They had been waiting for nearly an hour when the door finally opened.',tip:'Listen for had been + -ing and the duration phrase.'},
{id:'listen_09',concept:'usedto',domain:'academic',focus:'used to',transcript:'I used to avoid speaking English during seminars.',tip:'Used to + base verb expresses a past habit.'},
{id:'listen_10',concept:'usedto',domain:'everyday',focus:'be used to',transcript:'I am used to reading long papers before breakfast now.',tip:'Be used to is followed by an -ing form here.'},
{id:'listen_11',concept:'usedto',domain:'academic',focus:'get used to',transcript:'I am slowly getting used to answering questions without translating first.',tip:'Notice getting used to + -ing.'},
{id:'listen_12',concept:'presentperfect',domain:'academic',focus:'result',transcript:'I have completed three practice sessions this week.',tip:'Present perfect simple foregrounds completed number/result.'},
{id:'listen_13',concept:'presentperfect',domain:'academic',focus:'duration',transcript:'I have been practicing spontaneous speaking every morning.',tip:'Present perfect progressive foregrounds ongoing activity.'},
{id:'listen_14',concept:'conditionals',domain:'academic',focus:'unless',transcript:'Unless you practice under time pressure, spontaneous speaking may remain difficult.',tip:'Unless already contains the negative meaning.'},
{id:'listen_15',concept:'conditionals',domain:'everyday',focus:'in case',transcript:'Take a written outline in case your phone battery dies.',tip:'In case introduces a precaution.'},
{id:'listen_16',concept:'future',domain:'academic',focus:'future progressive',transcript:'At this time next week, I will be presenting my research in English.',tip:'Future progressive marks an activity in progress at a future time.'},
{id:'listen_17',concept:'future',domain:'academic',focus:'future perfect',transcript:'By Friday, I will have finished the revised version of the paper.',tip:'Future perfect marks completion before a future point.'},
{id:'listen_18',concept:'future',domain:'academic',focus:'future perfect progressive',transcript:'By December, I will have been studying English intensively for several months.',tip:'Listen for will have been + -ing.'},
{id:'listen_19',concept:'prepositions',domain:'politics',focus:'dependent preposition',transcript:'The outcome depends on whether institutions can maintain public trust.',tip:'Depend is followed by on.'},
{id:'listen_20',concept:'prepositions',domain:'academic',focus:'collocation',transcript:'The researchers were deeply concerned about the quality of the data.',tip:'Deeply concerned about forms one natural chunk.'},
{id:'listen_21',concept:'passivecausative',domain:'academic',focus:'passive',transcript:'The interviews were recorded, transcribed and checked before analysis.',tip:'Listen for the passive sequence be + past participles.'},
{id:'listen_22',concept:'passivecausative',domain:'everyday',focus:'causative',transcript:'I had the document printed before I left for class.',tip:'Causative have uses have + object + past participle.'},
{id:'listen_23',concept:'verbpatterns',domain:'academic',focus:'avoid + ing',transcript:'Researchers should avoid overstating what the evidence can actually show.',tip:'Avoid is followed by -ing.'},
{id:'listen_24',concept:'verbpatterns',domain:'academic',focus:'decide + infinitive',transcript:'We decided to revise the argument after the seminar.',tip:'Decide is followed by the to-infinitive.'},
{id:'listen_25',concept:'intensifiers',domain:'technology',focus:'intensifier',transcript:'The second system was considerably more reliable than the first.',tip:'Considerably naturally modifies a comparative.'},
{id:'listen_26',concept:'intensifiers',domain:'academic',focus:'intensifier',transcript:'The explanation is highly convincing, although the evidence remains limited.',tip:'Highly convincing is a formal collocation.'},
{id:'listen_27',concept:'academicdiscourse',domain:'academic',focus:'hedging',transcript:'The available evidence suggests that the effect may vary across cases.',tip:'Listen for two layers of caution: suggests that and may.'},
{id:'listen_28',concept:'academicdiscourse',domain:'philosophy',focus:'self-repair',transcript:'Let me rephrase that: the argument concerns dependence, not the absence of social relations.',tip:'Treat let me rephrase that as one discourse chunk.'},
{id:'listen_29',concept:'counterarguments',domain:'politics',focus:'conditional counterargument',transcript:'That may be true, but people might respond differently if the incentives changed.',tip:'Listen for the contrastive modal might and the if-clause.'},
{id:'listen_30',concept:'counterarguments',domain:'environment',focus:'conditional counterargument',transcript:'The policy could work if the sustainable option were also the convenient one.',tip:'The modal could introduces an alternative possibility.'}
];

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


speaking.push(
{id:'intensifier_speak_01',concept:'intensifiers',domain:'technology',seconds:60,prompt:'Compare two future technologies. Use considerably + comparative, highly likely, extremely + adjective, and one strong adjective with utterly or totally.',targets:['considerably + comparative','highly likely','extremely + adjective','strong-adjective intensifier']},
{id:'intensifier_speak_02',concept:'intensifiers',domain:'academic',seconds:60,prompt:'Evaluate a research result using four natural intensifier combinations without repeating the same adverb.',targets:['collocational variety','degree control']}
);


speaking.push(
{id:'u5_speak_vp_01',concept:'verbpatterns',domain:'cities',seconds:75,prompt:'Give advice for improving a neighborhood. Use avoid + -ing, decide + to, need + object + to, a modal + base, and one infinitive of purpose.',targets:['avoid + -ing','decide + to','need + object + to','modal + base','purpose infinitive']},
{id:'u5_speak_vp_02',concept:'verbpatterns',domain:'academic',seconds:75,prompt:'Describe a research routine using remember + -ing, remember + to, stop + -ing and try + -ing with the intended meanings.',targets:['remember + -ing','remember + to','stop + -ing','try + -ing']},
{id:'u5_speak_pass_01',concept:'passivecausative',domain:'academic',seconds:75,prompt:'Describe how a paper was prepared for submission. Use at least three passive forms and one causative have/get construction.',targets:['passive voice','causative have/get']},
{id:'u5_speak_pass_02',concept:'passivecausative',domain:'everyday',seconds:60,prompt:'Describe two services you arranged for someone else to perform and one unwanted event that happened to you.',targets:['have/get something done','unwelcome causative']}
);

const schedules={
 conservative:[
  {date:'2026-09-25',title:'Unit 3 · Final consolidation',concepts:['narrative','conditionals','prepositions','questions']},
  {date:'2026-09-28',title:'Oral Midterm',assessment:true,concepts:['questions','narrative','conditionals','usedto','agreement','prepositions']},
  {date:'2026-10-19',title:'Academic Project Presentation',assessment:true,concepts:['questions','agreement','prepositions','presentperfect','academicdiscourse']},
  {date:'2026-10-21',title:'Unit 4.1 · Future forms',concepts:['future']},
  {date:'2026-10-26',title:'Unit 4.2 · Future perfect/progressive + intensifiers',concepts:['future','intensifiers']},
  {date:'2026-10-28',title:'Unit 4.3 · Automation at work',concepts:['future','prepositions','academicdiscourse']},
  {date:'2026-11-02',title:'Unit 4 Review · For & against writing',concepts:['future','intensifiers','academicdiscourse']},
  {date:'2026-11-04',title:'Written Exam',assessment:true,concepts:['future','intensifiers','prepositions','agreement','academicdiscourse']},
  {date:'2026-11-09',title:'Unit 5.1 · Passive & causative',concepts:['passivecausative']},
  {date:'2026-11-16',title:'Unit 5.2 · -ing & infinitive',concepts:['verbpatterns']},
  {date:'2026-11-18',title:'Unit 5.3 · Conditional counterarguments',concepts:['counterarguments','conditionals']},
  {date:'2026-11-23',title:'Unit 5 Review · Problem/solution writing',concepts:['passivecausative','verbpatterns','counterarguments','academicdiscourse']},
  {date:'2026-11-30',title:'Final Oral preparation',concepts:concepts.map(x=>x.id)},
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
{date:'2026-10-26',title:'Unit 4.2 · Future perfect/progressive + intensifiers',concepts:['future','intensifiers']},
{date:'2026-10-28',title:'Unit 4.3 · Automation at work',concepts:['future','prepositions']},
{date:'2026-11-02',title:'Unit 4 Review · For & against writing',concepts:['future','intensifiers','academicdiscourse']},
{date:'2026-11-04',title:'Written Exam',assessment:true,concepts:['future','intensifiers','prepositions','agreement','academicdiscourse']},
{date:'2026-11-09',title:'Unit 5.1 · Passive & causative',concepts:['passivecausative']},
{date:'2026-11-16',title:'Unit 5.2 · -ing & infinitive',concepts:['verbpatterns']},
{date:'2026-11-18',title:'Unit 5.3 · Conditional counterarguments',concepts:['counterarguments','conditionals']},
{date:'2026-11-23',title:'Unit 5 Review · Problem/solution writing',concepts:['passivecausative','verbpatterns','counterarguments','academicdiscourse']},
{date:'2026-11-30',title:'Final Oral preparation',concepts:concepts.map(x=>x.id)},
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
{date:'2026-10-27',title:'Unit 4.2 · Future perfect/progressive + intensifiers',concepts:['future','intensifiers']},
{date:'2026-10-29',title:'Unit 4.3 · Automation at work',concepts:['future','prepositions']},
{date:'2026-11-03',title:'Unit 4 Review · For & against writing',concepts:['future','intensifiers','academicdiscourse']},
{date:'2026-11-05',title:'Written Exam',assessment:true,concepts:['future','intensifiers','prepositions','agreement','academicdiscourse']},
{date:'2026-11-10',title:'Unit 5.1 · Passive & causative',concepts:['passivecausative']},
{date:'2026-11-17',title:'Unit 5.2 · -ing & infinitive',concepts:['verbpatterns']},
{date:'2026-11-19',title:'Unit 5.3 · Conditional counterarguments',concepts:['counterarguments','conditionals']},
{date:'2026-11-24',title:'Unit 5 Review · Problem/solution writing',concepts:['passivecausative','verbpatterns','counterarguments','academicdiscourse']},
{date:'2026-12-01',title:'Final Oral preparation',concepts:concepts.map(x=>x.id)},
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
{date:'2026-10-28',title:'Unit 4.2 · Future perfect/progressive + intensifiers',concepts:['future','intensifiers']},
{date:'2026-10-30',title:'Unit 4.3 · Automation at work',concepts:['future','prepositions']},
{date:'2026-11-04',title:'Unit 4 Review · For & against writing',concepts:['future','intensifiers','academicdiscourse']},
{date:'2026-11-06',title:'Written Exam',assessment:true,concepts:['future','intensifiers','prepositions','agreement','academicdiscourse']},
{date:'2026-11-11',title:'Unit 5.1 · Passive & causative',concepts:['passivecausative']},
{date:'2026-11-18',title:'Unit 5.2 · -ing & infinitive',concepts:['verbpatterns']},
{date:'2026-11-20',title:'Unit 5.3 · Conditional counterarguments',concepts:['counterarguments','conditionals']},
{date:'2026-11-25',title:'Unit 5 Review · Problem/solution writing',concepts:['passivecausative','verbpatterns','counterarguments','academicdiscourse']},
{date:'2026-12-02',title:'Final Oral preparation',concepts:concepts.map(x=>x.id)},
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
{date:'2026-10-28',title:'Unit 4.2 · Future perfect/progressive + intensifiers',concepts:['future','intensifiers']},
{date:'2026-10-30',title:'Unit 4.3 · Automation at work',concepts:['future','prepositions']},
{date:'2026-11-06',title:'Written Exam',assessment:true,concepts:['future','intensifiers','prepositions','agreement','academicdiscourse']},
{date:'2026-11-11',title:'Unit 5.1 · Passive & causative',concepts:['passivecausative']},
{date:'2026-11-18',title:'Unit 5.2 · -ing & infinitive',concepts:['verbpatterns']},
{date:'2026-11-20',title:'Unit 5.3 · Conditional counterarguments',concepts:['counterarguments','conditionals']},
{date:'2026-12-04',title:'Final Oral Exam',assessment:true,concepts:concepts.map(x=>x.id)}
]
};





function addUnit5Depth(){
  const vpRows=[
    ['After the preposition “about,” choose the correct form: She is thinking about ___ to another city.',['moving','to move','move'],'moving','After a preposition, use the -ing form.'],
    ['Choose the natural subject form: ___ in a new city can be difficult at first.',['Living','To live always','Live'],'Living','An -ing form can function as the subject of a sentence.'],
    ['Choose the pattern after an adjective: It is difficult ___ reliable evidence quickly.',['to find','finding always','find'],'to find','Adjectives such as difficult are commonly followed by the infinitive.'],
    ['Express purpose: She moved to Santiago ___ at the university.',['to study','studying','study'],'to study','The infinitive can express purpose.'],
    ['Choose the form after avoid: Researchers should avoid ___ causal claims from weak evidence.',['making','to make','make'],'making','Avoid is followed by -ing.'],
    ['Choose the form after decide: The team decided ___ the survey.',['to redesign','redesigning','redesign'],'to redesign','Decide is followed by the to-infinitive.'],
    ['Choose the form after promise: The institution promised ___ the report.',['to publish','publishing','publish'],'to publish','Promise is followed by the to-infinitive.'],
    ['Choose the form after a modal: The city could ___ the policy next year.',['change','to change','changing'],'change','Modal verbs are followed by the base form.'],
    ['Choose the form after let: The supervisor let the students ___ a new approach.',['try','to try','trying'],'try','Let is followed by object + base form.'],
    ['Choose the form after make: The deadline made everyone ___ more carefully.',['plan','to plan','planning'],'plan','Make is followed by object + base form in the active voice.'],
    ['Meaning: “I remember meeting her.” Which interpretation is correct?',['I have a memory of the meeting.','I remembered that I needed to meet her later.'],'I have a memory of the meeting.','Remember + -ing refers to a memory of an earlier event.'],
    ['Meaning: “Remember to send the file.” Which interpretation is correct?',['Do not forget the future task.','Recall the memory of sending it.'],'Do not forget the future task.','Remember + to-infinitive refers to remembering a task that still needs to be done.'],
    ['Meaning: “He stopped smoking.” What changed?',['He quit the activity.','He paused another activity in order to smoke.'],'He quit the activity.','Stop + -ing means cease an activity.'],
    ['Meaning: “He stopped to smoke.” What happened?',['He paused another activity in order to smoke.','He permanently quit smoking.'],'He paused another activity in order to smoke.','Stop + to-infinitive means pause one activity in order to do another.'],
    ['Meaning: “Try restarting the app.” What does try mean?',['Experiment with a possible solution.','Make an effort that may be difficult.'],'Experiment with a possible solution.','Try + -ing often suggests experimenting with a method.'],
    ['Meaning: “Try to finish before six.” What does try mean?',['Make an effort to achieve the goal.','Experiment with finishing as one option.'],'Make an effort to achieve the goal.','Try + to-infinitive emphasizes effort toward a goal.'],
    ['Choose the form after appreciate: I appreciate you ___ the argument so clearly.',['explaining','to explain','explain'],'explaining','Appreciate is followed by -ing.'],
    ['Choose the form after manage: The team managed ___ the missing data.',['to recover','recovering','recover'],'to recover','Manage is followed by the to-infinitive.'],
    ['Choose the form after mind: Would you mind ___ the question?',['repeating','to repeat','repeat'],'repeating','Mind is followed by -ing.'],
    ['Choose the form after need + object: We need the committee ___ the proposal.',['to review','reviewing','review'],'to review','Need + object + to-infinitive is the target pattern.']
  ];
  vpRows.forEach((x,i)=>exercises.push(exercise({
    id:id('u5vp'),concept:'verbpatterns',domain:i%4===0?'academic':i%4===1?'cities':i%4===2?'everyday':'politics',
    type:'mcq',transfer:i<10?'controlled':'guided',difficulty:i<10?1:2,prompt:x[0],options:x[1],answer:x[2],
    explanation:x[3],misconception:'ing_infinitive_choice'
  })));

  const vpCorrections=[
    ['I am thinking about to move to another city.','I am thinking about moving to another city.','A preposition is followed by -ing.'],
    ['It is difficult finding a solution in this case.','It is difficult to find a solution in this case.','After difficult, use the to-infinitive.'],
    ['They decided revising the proposal.','They decided to revise the proposal.','Decide is followed by to-infinitive.'],
    ['Researchers should avoid to overstate the results.','Researchers should avoid overstating the results.','Avoid is followed by -ing.'],
    ['You must to check the source.','You must check the source.','Modal verbs take the base form.'],
    ['The supervisor made us to rewrite the section.','The supervisor made us rewrite the section.','Active make + object takes the base form.'],
    ['I will never forget to meet her for the first time.','I will never forget meeting her for the first time.','Forget + -ing refers to a memory of a past experience.'],
    ['He stopped to use the platform because of privacy concerns.','He stopped using the platform because of privacy concerns.','Stop + -ing means cease the activity.']
  ];
  vpCorrections.forEach((x,i)=>exercises.push(exercise({
    id:id('u5vpcorr'),concept:'verbpatterns',domain:i%2?'academic':'everyday',type:'text',transfer:'guided',difficulty:2,
    prompt:'Correct the verb pattern: “'+x[0]+'”',acceptedAnswers:[x[1]],answer:x[1],explanation:x[2],misconception:'ing_infinitive_choice'
  })));

  const vpTransforms=[
    ['Use avoid + -ing: “Researchers should not exaggerate the evidence.”','Researchers should avoid exaggerating the evidence.'],
    ['Use decide + to: “The team made the decision to postpone the meeting.”','The team decided to postpone the meeting.'],
    ['Use remember + -ing to express a memory: “I have a memory of presenting there for the first time.”','I remember presenting there for the first time.'],
    ['Use remember + to for a future task: “Do not forget that you need to bring the document.”','Remember to bring the document.'],
    ['Use stop + -ing: “She no longer checks email after midnight.”','She stopped checking email after midnight.'],
    ['Use stop + to: “He paused his work because he wanted to answer the phone.”','He stopped to answer the phone.'],
    ['Use try + -ing as an experiment: “One possible method is restarting the device.”','Try restarting the device.'],
    ['Use the infinitive of purpose: “She went to the archive because she wanted to verify the date.”','She went to the archive to verify the date.']
  ];
  vpTransforms.forEach((x,i)=>exercises.push(exercise({
    id:id('u5vptrans'),concept:'verbpatterns',domain:i%2?'academic':'everyday',type:'text',transfer:'guided',difficulty:3,
    prompt:x[0],acceptedAnswers:[x[1]],answer:x[1],explanation:'Select the form according to both grammar and meaning.',misconception:'verb_pattern_meaning'
  })));

  const passiveRows=[
    ['Make the research process passive: Researchers collected the interviews in May.',['The interviews were collected in May.','The interviews collected in May.'],'The interviews were collected in May.','Passive voice requires be + past participle.'],
    ['Choose the causative: A technician repaired my laptop for me.',['I had my laptop repaired.','I had repaired my laptop by a technician.'],'I had my laptop repaired.','Causative have is have + object + past participle.'],
    ['Choose the causative with get.',['She got the document translated.','She got translated the document.'],'She got the document translated.','Causative get places the object before the past participle.'],
    ['Choose the passive sequence.',['The proposal was reviewed, revised and approved.','The proposal reviewed, revised and approved.'],'The proposal was reviewed, revised and approved.','Keep the auxiliary be for the passive sequence.'],
    ['Express an unwelcome event naturally.',['He had his phone stolen on the train.','He had stolen his phone on the train.'],'He had his phone stolen on the train.','Causative have can describe an unwanted event that happens to someone.'],
    ['Choose the passive with a modal.',['The data should be checked again.','The data should checked again.'],'The data should be checked again.','Modal passive = modal + be + past participle.'],
    ['Choose the present perfect passive.',['The final report has been published.','The final report has published.'],'The final report has been published.','Present perfect passive = have/has been + past participle.'],
    ['Choose the past perfect passive.',['The files had been removed before the audit began.','The files had removed before the audit began.'],'The files had been removed before the audit began.','Past perfect passive = had been + past participle.'],
    ['Choose the causative question.',['Did you have the figures checked?','Did you have checked the figures?'],'Did you have the figures checked?','Keep object + past participle after have.'],
    ['Choose the natural research sentence.',['We had the transcripts anonymized before analysis.','We had anonymized the transcripts before analysis by someone else.'],'We had the transcripts anonymized before analysis.','Causative have foregrounds arranging for another person to do the task.']
  ];
  passiveRows.forEach((x,i)=>exercises.push(exercise({
    id:id('u5pass'),concept:'passivecausative',domain:i%2?'academic':'everyday',type:'mcq',transfer:i<5?'controlled':'guided',
    difficulty:2,prompt:x[0],options:x[1],answer:x[2],explanation:x[3],misconception:'passive_causative'
  })));

  const passiveFree=[
    ['academic','Describe a research workflow using three passive forms and two causative constructions.','Model: The interviews were recorded and the data were anonymized. The final dataset was checked twice. We had the transcripts translated and got the figures redesigned before submission.'],
    ['cities','Explain how a public project was completed using passive voice for the sequence and one causative construction for an outsourced task.','Model: The site was selected, the plan was approved and the work was completed in stages. The city had the environmental assessment carried out by an independent team.']
  ];
  passiveFree.forEach((x)=>exercises.push(exercise({
    id:id('u5passfree'),concept:'passivecausative',domain:x[0],type:'selfcheck',transfer:'free',difficulty:3,
    prompt:x[1],options:[],answer:x[2],explanation:'Check both passive morphology and causative word order.',misconception:'passive_causative_transfer'
  })));
}
addUnit5Depth();


function addConditionalCounterarguments(){
  const mcq=[
    ['A says: “People will never stop using disposable cups.” Choose the best conditional counterargument.',['They might if reusable cups were cheaper and easier to access.','People use cups every day.','That is completely false.'],'They might if reusable cups were cheaper and easier to access.','A conditional counterargument reuses the original idea and introduces a contrasting possibility.'],
    ['A says: “Social media is harmless.” Choose the strongest response.',['It might be for some users, but it could be harmful if the platform repeatedly amplifies extreme content.','Social media exists online.','No, it is bad.'],'It might be for some users, but it could be harmful if the platform repeatedly amplifies extreme content.','The response acknowledges the claim, then changes the condition under which the conclusion holds.'],
    ['A says: “Electric cars will never replace conventional cars.” Choose the best counterargument.',['They might if charging networks became cheaper and more widespread.','Cars have four wheels.','I disagree very much.'],'They might if charging networks became cheaper and more widespread.','The conditional identifies a circumstance that could alter the prediction.'],
    ['A says: “Students will always choose the easiest option.” Choose the best response.',['They might not if assessment rewarded deeper reasoning.','Students sometimes choose options.','That is wrong because students study.'],'They might not if assessment rewarded deeper reasoning.','The negative modal directly counters always while the if-clause supplies the condition.'],
    ['A says: “Public trust cannot recover after a major scandal.” Choose the best response.',['It could if institutions investigated the scandal transparently and imposed credible sanctions.','Trust is important.','Scandals are negative.'],'It could if institutions investigated the scandal transparently and imposed credible sanctions.','Could marks an alternative outcome under a different condition.'],
    ['A says: “Remote work always weakens teamwork.” Choose the best counterargument.',['It might not if teams had clear routines for coordination and informal contact.','Remote work uses computers.','I prefer office work.'],'It might not if teams had clear routines for coordination and informal contact.','A useful counterargument targets the original generalization and states a condition that changes it.'],
    ['A says: “No one will accept a congestion charge.” Choose the best response.',['They might if public transportation improved first.','Congestion is a problem.','Charges cost money.'],'They might if public transportation improved first.','The modal should carry the contrast: they might under a different condition.'],
    ['A says: “AI feedback cannot improve student writing.” Choose the best response.',['It could if students used it to revise rather than simply accept suggestions.','AI produces text.','Writing is important.'],'It could if students used it to revise rather than simply accept suggestions.','The counterargument preserves the topic but modifies the circumstances.'],
    ['A says: “This reform is too expensive to be realistic.” Choose the best response.',['It might still be realistic if the long-term savings outweighed the initial cost.','Expensive reforms cost money.','I do not like that view.'],'It might still be realistic if the long-term savings outweighed the initial cost.','Still helps signal contrast while the conditional provides the alternative scenario.'],
    ['A says: “Citizens never read long policy documents.” Choose the best response.',['They might if the documents were clearer and directly relevant to a decision they had to make.','Documents can be long.','Some citizens read.'],'They might if the documents were clearer and directly relevant to a decision they had to make.','The response challenges never by specifying conditions that could alter behavior.'],
    ['Choose the response that best takes the floor politely.',['That may be true, but people might respond differently if the incentives changed.','No, listen to me.','You are wrong.'],'That may be true, but people might respond differently if the incentives changed.','A brief acknowledgment plus a conditional counterargument allows disagreement without losing conversational control.'],
    ['Choose the response with the clearest contrastive modal.',['They could if the city provided reliable alternatives.','If the city provided reliable alternatives, alternatives exist.','The city should be reliable maybe.'],'They could if the city provided reliable alternatives.','The modal could carries the contrast between the original impossibility claim and the alternative possibility.'],
    ['A says: “Penalties are the only way to change behavior.” Choose the best response.',['Rewards might work if they were large enough and visible enough.','Penalties change behavior.','Only is a strong word.'],'Rewards might work if they were large enough and visible enough.','The counterargument proposes a competing mechanism under an explicit condition.'],
    ['A says: “Young voters are not interested in local politics.” Choose the best response.',['They might be if local issues were connected more clearly to housing, transport and employment.','Young people vote sometimes.','Politics can be boring.'],'They might be if local issues were connected more clearly to housing, transport and employment.','The conditional tests whether the conclusion depends on how the issue is framed.'],
    ['A says: “The policy failed once, so it will fail again.” Choose the best response.',['It might not if the implementation problems identified the first time were corrected.','It failed before.','Past failure is evidence.'],'It might not if the implementation problems identified the first time were corrected.','The response accepts the past failure but disputes that the same result is inevitable.'],
    ['A says: “People will not change their environmental habits voluntarily.” Choose the best response.',['They might if the convenient option were also the sustainable one.','Habits are difficult.','Voluntary action exists.'],'They might if the convenient option were also the sustainable one.','The conditional explains the circumstance under which behavior might change.']
  ];
  mcq.forEach((x,i)=>exercises.push(exercise({
    id:id('counter'),concept:'counterarguments',domain:i%4===0?'environment':i%4===1?'technology':i%4===2?'politics':'academic',
    type:'mcq',transfer:i<8?'controlled':'guided',difficulty:i<8?1:2,prompt:x[0],options:x[1],answer:x[2],
    explanation:x[3],misconception:'conditional_counterargument'
  })));

  const transforms=[
    ['Respond conditionally to: “Nobody will use the new service.” Use might + if.','They might if the service were easier to access.'],
    ['Respond conditionally to: “The reform cannot work in small municipalities.” Use could + if.','It could if small municipalities received additional technical support.'],
    ['Respond conditionally to: “Students will always use AI irresponsibly.” Use might not + if.','They might not if assessment required transparent documentation of how AI was used.'],
    ['Respond conditionally to: “The transition is too expensive.” Use still + might + if.','It might still be worthwhile if the long-term benefits outweighed the initial cost.'],
    ['Add acknowledgment before this counterargument: “People might change if the incentives changed.”','That may be true, but people might change if the incentives changed.'],
    ['Make the disagreement less categorical by using a conditional: “Remote work does not weaken teamwork.”','Remote work might not weaken teamwork if teams have strong coordination routines.'],
    ['Counter this claim: “Public transport will never replace private cars.”','It might if public transport became faster, safer and more reliable.'],
    ['Counter this claim: “Citizens cannot understand complex policy.”','They could if the information were presented more clearly.']
  ];
  transforms.forEach((x,i)=>exercises.push(exercise({
    id:id('countertrans'),concept:'counterarguments',domain:i%2?'politics':'academic',type:'text',transfer:'guided',difficulty:2,
    prompt:x[0],acceptedAnswers:[x[1]],answer:x[1],explanation:'Reuse the original proposition, then change the conclusion by introducing a condition and a contrasting modal.',misconception:'counterargument_form'
  })));

  const builders=[
    ['That','may','be','true,','but','people','might','change','if','the','incentives','changed.'],
    ['They','could','if','the','city','provided','reliable','alternatives.'],
    ['It','might','not','fail','if','implementation','improved.'],
    ['Even','if','costs','rose,','the','long-term','benefits','might','justify','the','policy.']
  ];
  builders.forEach((tokens,i)=>exercises.push(exercise({
    id:id('counterbuild'),concept:'counterarguments',domain:i%2?'environment':'politics',type:'builder',transfer:'guided',difficulty:2,
    prompt:'Build the conditional counterargument.',tokens:[...tokens].sort(()=>Math.random()-.5),answer:tokens.join(' '),
    explanation:'Build the acknowledgment/contrast and conditional as one complete conversational move.',misconception:'counterargument_word_order'
  })));

  const free=[
    ['politics','A colleague says: “Once public trust falls, governments cannot recover it.” Give a 45-second response with acknowledgment, a conditional counterargument and one example.','Model: That may be true in some cases, but trust could recover if institutions responded transparently and corrected the underlying problem. For example, an independent investigation might show citizens that accountability is possible.'],
    ['environment','Someone says: “People will never change environmentally harmful habits unless they are punished.” Respond using at least two conditional counterarguments.','Model: Penalties may help, but people might also change if the sustainable option were cheaper and easier. They could also respond to rewards if those incentives were visible enough.'],
    ['technology','Someone says: “AI will inevitably reduce students’ ability to think.” Respond with one concession and two conditional alternatives.','Model: That risk is real, but the outcome might be different if students had to justify their reasoning. AI could even support reflection if it were used for revision rather than answer generation.']
  ];
  free.forEach((x)=>exercises.push(exercise({
    id:id('counterfree'),concept:'counterarguments',domain:x[0],type:'selfcheck',transfer:'free',difficulty:3,
    prompt:x[1],options:[],answer:x[2],explanation:'Check whether you directly reused the original idea, introduced a genuine condition and made the contrasting modal clear.',misconception:'counterargument_transfer'
  })));
}
addConditionalCounterarguments();

function addIntensifiers(){
  const rows=[
    ['The revised transport plan is ___ more expensive than the original proposal.',['considerably','utterly','intensely'],'considerably','Considerably naturally modifies comparatives such as more expensive.'],
    ['The claim that no regulation is needed is ___ unrealistic.',['utterly','considerably','painfully'],'utterly','Utterly combines naturally with strong adjectives such as unrealistic.'],
    ['The result was ___ unexpected; none of the analysts had predicted it.',['totally','considerably','disastrously'],'totally','Totally can strongly intensify unexpected.'],
    ['Waiting three hours for a five-minute meeting was ___ frustrating.',['intensely','considerably','utterly more'],'intensely','Intensely can modify strong emotional/evaluative adjectives such as frustrating.'],
    ['The new procedure is ___ difficult for first-time users.',['extremely','utterly more','considerably'],'extremely','Extremely is a flexible intensifier with gradable adjectives such as difficult.'],
    ['The second model performed ___ better than the first.',['considerably','utterly','deeply'],'considerably','Comparative forms such as better commonly take considerably.'],
    ['The proposal is ___ impractical in small municipalities.',['utterly','considerably','intensely more'],'utterly','Utterly works with strong negative adjectives such as impractical.'],
    ['The difference between the two estimates was ___ significant.',['highly','utterly more','disastrously'],'highly','Highly significant is a conventional academic collocation.'],
    ['Researchers were ___ concerned about the missing observations.',['deeply','considerably more','utterly more'],'deeply','Deeply concerned is a natural collocation.'],
    ['The final cost was ___ higher than the initial estimate.',['considerably','totally','painfully'],'considerably','Considerably modifies a comparative adjective.'],
    ['The explanation is ___ convincing once the new evidence is included.',['highly','disastrously','utterly more'],'highly','Highly convincing is a natural formal collocation.'],
    ['The software failure had a ___ negative effect on the presentation.',['seriously','considerably more','utterly more'],'seriously','Seriously negative is a natural degree collocation.'],
    ['The committee found the evidence ___ persuasive.',['extremely','considerably more','utterly more'],'extremely','Extremely can intensify a gradable adjective such as persuasive.'],
    ['The assumption turned out to be ___ wrong.',['completely','considerably','intensely'],'completely','Completely wrong is a natural strong-degree collocation.'],
    ['The reform is ___ likely to produce uneven effects across regions.',['highly','utterly','disastrously'],'highly','Highly likely is a standard collocation.'],
    ['The first draft was ___ shorter than the version finally submitted.',['considerably','totally','deeply'],'considerably','Use considerably with comparative adjectives.'],
    ['The idea that evidence never matters is ___ absurd.',['utterly','considerably','highly more'],'utterly','Utterly naturally modifies strong adjectives such as absurd.'],
    ['The audience reaction was ___ positive.',['overwhelmingly','utterly more','disastrously'],'overwhelmingly','Overwhelmingly positive is a natural evaluative collocation.'],
    ['The problem became ___ worse after the second outage.',['considerably','totally','intensely'],'considerably','Worse is comparative and can be intensified by considerably.'],
    ['The instructions were ___ clear, so almost nobody made a mistake.',['extremely','disastrously','utterly more'],'extremely','Extremely clear is grammatically and collocationally natural.']
  ];
  rows.forEach((x,i)=>exercises.push(exercise({
    id:id('int'),concept:'intensifiers',domain:i%3===0?'academic':i%3===1?'politics':'technology',type:'mcq',
    transfer:i<10?'controlled':'guided',difficulty:i<10?1:2,prompt:x[0],options:x[1],answer:x[2],explanation:x[3],misconception:'intensifier_collocation'
  })));

  const corrections=[
    ['The second model was utterly better than the first.','The second model was considerably better than the first.','Use considerably, not utterly, to modify a comparative such as better.'],
    ['The claim was considerably absurd.','The claim was utterly absurd.','A strong adjective such as absurd naturally combines with utterly.'],
    ['The researchers were considerably concerned about the result.','The researchers were deeply concerned about the result.','Deeply concerned is the natural collocation for emotional concern.'],
    ['The outcome is utterly likely.','The outcome is highly likely.','Highly likely is the conventional collocation.'],
    ['The revised estimate is totally higher than the original.','The revised estimate is considerably higher than the original.','Use considerably with a comparative adjective.'],
    ['The result was considerably unexpected.','The result was totally unexpected.','Totally unexpected is a natural strong-degree combination.']
  ];
  corrections.forEach((x,i)=>exercises.push(exercise({
    id:id('intcorr'),concept:'intensifiers',domain:i%2?'academic':'technology',type:'text',transfer:'guided',
    difficulty:2,prompt:'Correct the intensifier: “'+x[0]+'”',acceptedAnswers:[x[1]],answer:x[1],explanation:x[2],misconception:'intensifier_collocation'
  })));

  const free=[
    ['academic','Compare two research designs using one comparative intensified with considerably, one highly + adjective combination, and one cautious conclusion.','Model: The second design is considerably more robust. Its identification strategy is highly convincing, although the evidence is still somewhat limited.'],
    ['technology','Evaluate a controversial technology using at least four natural intensifier + adjective combinations.','Model: The potential benefits are extremely significant, but some proposed uses are utterly unrealistic and the transition could be considerably more expensive than expected.']
  ];
  free.forEach((x)=>exercises.push(exercise({
    id:id('intfree'),concept:'intensifiers',domain:x[0],type:'selfcheck',transfer:'free',difficulty:3,
    prompt:x[1],options:[],answer:x[2],explanation:'Check collocation, not only grammatical possibility. The goal is to retrieve natural degree expressions.',misconception:'intensifier_transfer'
  })));
}
addIntensifiers();

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

export {concepts,C,domains,exercises,chunks,shadowing,conversations,speaking,listening,pronunciation,schedules};
