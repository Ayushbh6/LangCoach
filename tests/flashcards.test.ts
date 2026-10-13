import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nounForms, verbForms, deckCards, flashcardFor } from '../lib/learning/flashcards';
import { vocabulary, allVocabulary, type Card } from '../data/vocabulary';
import { lessons } from '../data/lessons';
function noun(german:string,plural:string) {return nounForms({id:'test',german,english:'test',plural,kind:'noun',topic:'test'});}
test('noun forms cover weak nouns, genitive exceptions, plural-only and dative plurals',()=>{
  assert.equal(noun('der Kollege','Kollegen')[1].value,'den Kollegen');
  assert.equal(noun('der Name','Namen')[3].value,'des Namens');
  assert.equal(noun('der Bus','Busse')[3].value,'des Busses');
  assert.equal(noun('das Ergebnis','Ergebnisse')[3].value,'des Ergebnisses');
  assert.equal(noun('das Kind','Kinder')[5].value,'den Kindern');
  assert.equal(noun('das Auto','Autos')[5].value,'den Autos');
  assert.deepEqual(noun('die Eltern','plural only').map(x=>x.value),['die Eltern','den Eltern','der Eltern']);
  assert.equal(noun('das Geld','usually singular').length,4);
});
test('verb forms cover stem changes, reflexives, separable verbs and modals',()=>{
  assert.equal(verbForms('sprechen')[1].value,'sprichst');
  assert.equal(verbForms('arbeiten')[4].value,'arbeitet');
  assert.equal(verbForms('teilnehmen')[1].value,'nimmst teil');
  assert.equal(verbForms('sich bewerben')[1].value,'bewirbst dich');
  assert.equal(verbForms('tanzen')[1].value,'tanzt');
  assert.equal(verbForms('können')[0].value,'kann');
});
test('regular consonant endings distinguish kommen from öffnen', () => {
  assert.equal(verbForms('kommen')[1].value, 'kommst');
  assert.equal(verbForms('kennen')[2].value, 'kennt');
  assert.equal(verbForms('öffnen')[1].value, 'öffnest');
});

test('all study cards have backs, stable unique IDs and available level decks',()=>{
  assert.equal(new Set(allVocabulary.map(c=>c.id)).size,allVocabulary.length);
  assert.ok(vocabulary.length>800);
  for(const deck of ['a1','a2','b1','cases'] as const) assert.ok(deckCards(deck).length>0);
  for(const c of vocabulary) {
    const f=flashcardFor(c.id+':de',lessons[0])!;
    assert.ok(f.german && f.english);
    if(c.kind==='noun') assert.ok(f.forms.length>=3,c.german);
    if(c.kind==='verb') assert.equal(f.forms.length,6,c.german);
  }
});
