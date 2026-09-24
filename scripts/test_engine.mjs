import assert from 'node:assert/strict';
import {exercises} from '../js/content.js';
import {pickExercises,challengeMix,eventPack,conceptStats} from '../js/engine.js';

const state={seen:{},concepts:{},errors:[],sessions:[],speaking:[],examRuns:[],settings:{section:'conservative',duration:20}};

const first=pickExercises(exercises,state,{concept:'questions',count:8});
assert.equal(first.length,8);
assert.equal(new Set(first.map(x=>x.id)).size,8);
assert(first.every(x=>x.concept==='questions'));

for(const e of first.slice(0,3)) state.seen[e.id]={lastCorrect:true,lastSeen:new Date().toISOString(),reviewAt:new Date(Date.now()+86400000).toISOString()};
const second=pickExercises(exercises,state,{concept:'questions',count:8});
assert(second.some(x=>!state.seen[x.id]),'unseen items should remain available');

const challenge=challengeMix(exercises,state,10);
assert(challenge.length>0);
assert(challenge.some(x=>x.transfer==='free'||x.transfer==='guided'),'challenge should include productive evidence');

const event={concepts:['narrative','conditionals']};
const transfer=eventPack(exercises,state,event,'transfer',10);
assert(transfer.every(x=>event.concepts.includes(x.concept)));
assert(transfer.some(x=>x.transfer==='free'),'transfer pack should include free-transfer tasks');

const blank=conceptStats(state,'questions');
assert.equal(blank.status,'NEW');

const synthetic={concepts:{questions:{attempts:30,correct:27,transfer:{
  controlled:{attempts:12,correct:11},
  guided:{attempts:10,correct:9},
  free:{attempts:4,correct:3}
}}}};
const learned=conceptStats(synthetic,'questions');
assert(['MAINTENANCE','MASTERED'].includes(learned.status));

console.log('ENGINE TESTS OK');
