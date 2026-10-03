import type { Card } from './vocabulary';
const rows = `
Nominative|___ Mann liest ein Buch.|Der|The man is reading a book.|The subject is nominative: der Mann.
Nominative|___ Frau arbeitet heute.|Die|The woman is working today.|The subject is nominative: die Frau.
Nominative|___ Kind spielt im Garten.|Das|The child is playing in the garden.|The subject is nominative: das Kind.
Nominative|___ Freunde kommen morgen.|Die|The friends are coming tomorrow.|Plural nominative uses die.
Nominative|Das ist ___ Tisch.|ein|That is a table.|After sein, the noun describing the subject is nominative: ein Tisch.
Nominative|Das ist ___ Tasche.|eine|That is a bag.|After sein: eine Tasche (feminine nominative).
Nominative|Das ist ___ Buch.|ein|That is a book.|After sein: ein Buch (neuter nominative).
Nominative|___ Bruder wohnt in Wien. (my)|Mein|My brother lives in Vienna.|Masculine nominative: mein Bruder.
Nominative|___ Schwester ist hier. (my)|Meine|My sister is here.|Feminine nominative: meine Schwester.
Nominative|___ Auto ist neu. (my)|Mein|My car is new.|Neuter nominative: mein Auto.
Accusative|Ich sehe ___ Mann.|den|I see the man.|sehen takes a direct object. Masculine accusative: der → den.
Accusative|Ich sehe ___ Frau.|die|I see the woman.|Feminine accusative stays die.
Accusative|Ich sehe ___ Kind.|das|I see the child.|Neuter accusative stays das.
Accusative|Ich sehe ___ Kinder.|die|I see the children.|Plural accusative stays die.
Accusative|Ich brauche ___ Stift.|einen|I need a pen.|Masculine accusative: ein → einen.
Accusative|Ich kaufe ___ Tasche.|eine|I am buying a bag.|Feminine accusative: eine.
Accusative|Ich lese ___ Buch.|ein|I am reading a book.|Neuter accusative: ein.
Accusative|Das Geschenk ist für ___ Freund.|den|The gift is for the friend.|für always takes accusative: den Freund.
Accusative|Wir fahren durch ___ Stadt.|die|We drive through the city.|durch always takes accusative: die Stadt.
Accusative|Ich gehe ohne ___ Bruder. (my)|meinen|I go without my brother.|ohne takes accusative. Masculine: meinen Bruder.
Dative|Ich helfe ___ Mann.|dem|I help the man.|helfen always takes dative: dem Mann.
Dative|Ich helfe ___ Frau.|der|I help the woman.|Feminine dative: die → der.
Dative|Ich helfe ___ Kind.|dem|I help the child.|Neuter dative: das → dem.
Dative|Ich helfe ___ Kindern.|den|I help the children.|Plural dative: den + noun ending in -n (where possible).
Dative|Ich fahre mit ___ Bus.|dem|I travel by bus.|mit always takes dative: dem Bus.
Dative|Ich komme aus ___ Schweiz.|der|I come from Switzerland.|aus takes dative: die Schweiz → der Schweiz.
Dative|Wir gehen zu ___ Arzt.|einem|We are going to a doctor.|zu takes dative. Masculine indefinite: einem Arzt.
Dative|Ich wohne bei ___ Freundin. (my)|meiner|I live with my friend.|bei takes dative. Feminine possessive: meiner Freundin.
Dative|Das Buch gehört ___ Kind.|dem|The book belongs to the child.|gehören takes dative: dem Kind.
Dative|Ich gebe ___ Frau das Buch.|der|I give the woman the book.|The recipient is dative: der Frau. The thing given is accusative.
Two-way prepositions|Das Buch liegt auf ___ Tisch.|dem|The book is lying on the table.|Location: wo? → dative. auf dem Tisch.
Two-way prepositions|Ich lege das Buch auf ___ Tisch.|den|I put the book onto the table.|Destination: wohin? → accusative. auf den Tisch.
Two-way prepositions|Ich bin in ___ Küche.|der|I am in the kitchen.|Location: in der Küche (dative).
Two-way prepositions|Ich gehe in ___ Küche.|die|I go into the kitchen.|Destination: in die Küche (accusative).
Two-way prepositions|Das Bild hängt an ___ Wand.|der|The picture is hanging on the wall.|Location: an der Wand (dative).
Two-way prepositions|Ich hänge das Bild an ___ Wand.|die|I hang the picture on the wall.|Destination: an die Wand (accusative).
Two-way prepositions|Das Kind läuft in ___ Park herum.|dem|The child runs around in the park.|Movement within a location still uses dative. Ask wo?, not just whether something moves.
Genitive · introduction|Das ist das Auto ___ Mannes.|des|That is the man's car.|Masculine genitive: des + noun -(e)s. A preview beyond the main A2 cases.
Genitive · introduction|Das ist die Tasche ___ Frau.|der|That is the woman's bag.|Feminine genitive: der Frau. Ownership: wessen?
Genitive · introduction|Das ist das Fahrrad ___ Kindes.|des|That is the child's bicycle.|Neuter genitive: des Kindes. In everyday speech, von + dative is common.
`;
export const cases: Card[] = rows.trim().split('\n').map((r,i)=> {
 const [topic,german,english,translation,note] = r.split('|');
 return {id:`case-${i+1}`,topic,german,english,translation,note,kind:'case'};
});
export const articleTable = [
 ['Nominative','der / ein','die / eine','das / ein','die / —'],
 ['Accusative','den / einen','die / eine','das / ein','die / —'],
 ['Dative','dem / einem','der / einer','dem / einem','den + -n / —'],
 ['Genitive','des / eines','der / einer','des / eines','der / —'],
];
