import { allVocabulary, vocabulary, type Card } from '../../data/vocabulary';
import { cases } from '../../data/cases';
import { a1CardIds } from '../../data/vocabulary-sources';
import type { Flashcard, Lesson } from './types';
export type RecallDeck = 'daily' | 'a1' | 'a2' | 'b1' | 'cases';
const a1 = new Set(a1CardIds);
export function cardLevel(card: Card) { return (card.id.startsWith('a1-') || a1.has(card.id)) ? 'a1' : card.cefr === 'b1' ? 'b1' : 'a2'; }
export function deckCards(deck: RecallDeck): Card[] {
  return deck === 'cases' ? cases : vocabulary.filter(c => deck === 'daily' || cardLevel(c) === deck);
}
const weak: Record<string,string> = { Nachbar:'Nachbarn', Mensch:'Menschen', Kunde:'Kunden', Kollege:'Kollegen', Junge:'Jungen', Student:'Studenten', Herr:'Herrn', Name:'Namen', Vorname:'Vornamen', Familienname:'Familiennamen', Automat:'Automaten', Buchstabe:'Buchstaben' };
const genitives: Record<string,string> = { Mann:'Mannes', Kind:'Kindes', Haus:'Hauses', Tag:'Tages', Jahr:'Jahres', Buch:'Buches', Geld:'Geldes', Bild:'Bildes', Wort:'Wortes', Freund:'Freundes', Arzt:'Arztes', Fuß:'Fußes', Fluss:'Flusses', Schluss:'Schlusses', Herz:'Herzens', Name:'Namens', Vorname:'Vornamens', Familienname:'Familiennamens', Buchstabe:'Buchstabens', Brot:'Brotes', Ei:'Eies', Bad:'Bades', Bett:'Bettes', Hemd:'Hemdes', Land:'Landes', Wald:'Waldes', Hund:'Hundes', Grund:'Grundes', Preis:'Preises', Bus:'Busses', Reis:'Reises', Käse:'Käses', Ende:'Endes', Interesse:'Interesses' };
export function nounForms(c: Card): Flashcard['forms'] {
  const match = c.german.match(/^(der|die|das) (.+)$/);
  if (!match || c.kind !== 'noun') return [];
  const [,article,noun] = match;
  const pluralOnly = c.plural === 'plural only';
  const plural = pluralOnly ? noun : c.plural?.split(' (')[0];
  const usablePlural = plural && !/singular|only|usually|—/i.test(plural);
  const oblique = article === 'der' ? (weak[noun] ?? noun) : noun;
  const genitive = article === 'die' ? noun : (genitives[noun] ?? (weak[noun] ?? (/nis$/.test(noun) ? noun+'ses' : /[sßxz]$/.test(noun) ? noun+'es' : noun+'s')));
  const rows: Flashcard['forms'] = pluralOnly ? [] : [
    {label:'Nominative · who/what?', value:c.german},
    {label:'Accusative · direct object', value:`${article==='der'?'den':article} ${oblique}`},
    {label:'Dative · recipient / after mit', value:`${article==='die'?'der':'dem'} ${oblique}`},
    {label:'Genitive · whose?', value:`${article==='die'?'der':'des'} ${genitive}`},
  ];
  if (usablePlural) rows.push(
    {label:'Plural · nominative / accusative',value:`die ${plural}`},
    {label:'Plural · dative',value:`den ${/[ns]$/.test(plural) ? plural : plural+'n'}`},
    {label:'Plural · genitive',value:`der ${plural}`},
  );
  return rows;
}
const irregular: Record<string,string[]> = {
  sein:['bin','bist','ist','sind','seid','sind'], haben:['habe','hast','hat','haben','habt','haben'], werden:['werde','wirst','wird','werden','werdet','werden'], wissen:['weiß','weißt','weiß','wissen','wisst','wissen'],
  können:['kann','kannst','kann','können','könnt','können'], müssen:['muss','musst','muss','müssen','müsst','müssen'], wollen:['will','willst','will','wollen','wollt','wollen'], sollen:['soll','sollst','soll','sollen','sollt','sollen'], dürfen:['darf','darfst','darf','dürfen','dürft','dürfen'], mögen:['mag','magst','mag','mögen','mögt','mögen'],
};
const changed: Record<string,[string,string]> = { fahren:['fährst','fährt'], sprechen:['sprichst','spricht'], sehen:['siehst','sieht'], lesen:['liest','liest'], essen:['isst','isst'], nehmen:['nimmst','nimmt'], geben:['gibst','gibt'], tragen:['trägst','trägt'], waschen:['wäschst','wäscht'], schlafen:['schläfst','schläft'], helfen:['hilfst','hilft'], laufen:['läufst','läuft'], treffen:['triffst','trifft'], vergessen:['vergisst','vergisst'], empfehlen:['empfiehlst','empfiehlt'], bewerben:['bewirbst','bewirbt'] };
const separable: Record<string,[string,string]> = { absagen:['sagen','ab'], ablehnen:['lehnen','ab'], nachweisen:['weisen','nach'], aufstehen:['stehen','auf'], einsteigen:['steigen','ein'], aussteigen:['steigen','aus'], umsteigen:['steigen','um'], ankommen:['kommen','an'], abfahren:['fahren','ab'], einladen:['laden','ein'], anrufen:['rufen','an'], aufhören:['hören','auf'], zustimmen:['stimmen','zu'], vorschlagen:['schlagen','vor'], feststellen:['stellen','fest'], teilnehmen:['nehmen','teil'] };
changed.laden=['lädst','lädt']; changed.schlagen=['schlägst','schlägt']; changed.widersprechen=['widersprichst','widerspricht'];
export function verbForms(german: string): Flashcard['forms'] {
  const reflexive = german.startsWith('sich ');
  const verb = german.replace(/^sich /,'');
  const [base,prefix] = separable[verb] ?? [verb,''];
  if (!/^[a-zäöüß]+(en|ern|eln)$/.test(base) && base !== 'sein') return [];
  let forms = irregular[base];
  if (!forms) {
    const stem = base.endsWith('en') ? base.slice(0,-2) : base.slice(0,-1);
    const e = /[dt]$/.test(stem) || /[^aeiouäöürlhmn][mn]$/.test(stem);
    forms = [stem+'e',stem+(e?'est':/[sßxz]$/.test(stem)?'t':'st'),stem+(e?'et':'t'),base,stem+(e?'et':'t'),base];
    if (/eln$/.test(base)) forms[0]=stem.slice(0,-2)+'le';
    if(changed[base]) [forms[1],forms[2]]=changed[base];
  }
  const pronouns=['ich','du','er/sie/es','wir','ihr','sie/Sie'];
  const refl=['mich','dich','sich','uns','euch','sich'];
  return forms.map((form,i)=>({label:pronouns[i],value:`${form}${reflexive?' '+refl[i]:''}${prefix?' '+prefix:''}`}));
}
export function flashcardFor(cardId: string, lesson: Lesson): Flashcard | undefined {
  const bare=cardId.replace(/:(de|en)$/,'');
  const word=lesson.words.find((_,i)=>bare===`phrase-${lesson.id}-${i}`);
  const c=allVocabulary.find(c=>c.id===bare) ?? cases.find(c=>c.id===bare) ?? (word ? allVocabulary.find(c=>c.german===word.german) : undefined);
  if(!c && !word) return;
  const german=word?.german ?? c!.german, english=word?.english ?? c!.english;
  return {
    german, english, kind:c?.kind ?? 'expression', level:c?.kind==='case'?'Cases':c?cardLevel(c).toUpperCase():'Today’s phrases',
    note:c?.note ?? word?.note ?? '', plural:c?.plural,
    example:c?.kind==='case'?german.replace('___',english):c?.example,
    translation:c?.translation,
    forms:c?.kind==='noun'?nounForms(c):c?.kind==='verb'?verbForms(german):[],
    source:c?.kind==='case'?'https://grammis.ids-mannheim.de/progr@mm/6915':c ? ((c.id.startsWith('a1-') || a1.has(c.id))?'https://www.goethe.de/pro/relaunch/prf/sr/A1_SD1_Wortliste_02.pdf':`https://www.goethe.de/pro/relaunch/prf/en/Goethe-Zertifikat_${c.cefr==='b1'?'B1':'A2'}_Wortliste.pdf`) : undefined,
  };
}
