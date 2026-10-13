import { foundationCards } from './a1-foundations';
import { b1Rows } from './b1-expansion';
export type Level = 'a2' | 'b1' | 'mixed';
export type Card = { id: string; german: string; english: string; topic: string; kind: 'noun' | 'verb' | 'adjective' | 'expression' | 'case'; cefr?: 'a2' | 'b1'; plural?: string; note?: string; example?: string; translation?: string };
export const levels: {value: Level; label: string; hint: string}[] = [
 {value:'a2',label:'A2 core',hint:'Everyday German for Goethe A2 preparation, including essential foundations.'},
 {value:'b1',label:'B1 expansion',hint:'Goethe B1 preparation: opinions, work, everyday problems, and connected sentences.'},
 {value:'mixed',label:'A2 + B1',hint:'Mix the A2 core with the B1 expansion. All words are checked against Goethe vocabulary references.'},
];
// Independently curated A1 foundations + A2 everyday vocabulary. Original translations.
// Noun rows: German | English | plural. Other rows: German | English | learning note.
const groups: [string, Card['kind'], string][] = [
['People & family', 'noun', `
die Familie|family|Familien
der Freund|friend (male)|Freunde
die Freundin|friend (female)|Freundinnen
der Nachbar|neighbour (male)|Nachbarn
die Nachbarin|neighbour (female)|Nachbarinnen
der Mann|man; husband|Männer
die Frau|woman; wife|Frauen
das Kind|child|Kinder
die Eltern|parents|plural only
der Vater|father|Väter
die Mutter|mother|Mütter
der Sohn|son|Söhne
die Tochter|daughter|Töchter
der Bruder|brother|Brüder
die Schwester|sister|Schwestern
der Großvater|grandfather|Großväter
die Großmutter|grandmother|Großmütter
der Onkel|uncle|Onkel
die Tante|aunt|Tanten
der Cousin|cousin (male)|Cousins
die Cousine|cousin (female)|Cousinen
der Partner|partner (male)|Partner
die Partnerin|partner (female)|Partnerinnen
der Mensch|human being; person|Menschen
die Person|person|Personen
`],
['At home', 'noun', `
die Wohnung|flat; apartment|Wohnungen
das Haus|house|Häuser
das Zimmer|room|Zimmer
die Küche|kitchen|Küchen
das Bad|bathroom|Bäder
der Flur|hallway|Flure
der Balkon|balcony|Balkone
der Garten|garden|Gärten
die Tür|door|Türen
das Fenster|window|Fenster
der Schlüssel|key|Schlüssel
der Tisch|table|Tische
der Stuhl|chair|Stühle
das Bett|bed|Betten
der Schrank|cupboard; wardrobe|Schränke
das Sofa|sofa|Sofas
die Lampe|lamp|Lampen
der Teppich|carpet|Teppiche
der Kühlschrank|fridge|Kühlschränke
die Waschmaschine|washing machine|Waschmaschinen
der Herd|stove; cooker|Herde
die Heizung|heating; heater|Heizungen
die Miete|rent|Mieten
der Umzug|move (of home)|Umzüge
die Adresse|address|Adressen
`],
['Food & drink', 'noun', `
das Brot|bread|Brote
das Brötchen|bread roll|Brötchen
die Butter|butter|usually singular
der Käse|cheese|Käse
das Ei|egg|Eier
die Milch|milk|usually singular
das Fleisch|meat|usually singular
der Fisch|fish|Fische
das Gemüse|vegetables|usually singular
das Obst|fruit (collectively)|usually singular
der Apfel|apple|Äpfel
die Banane|banana|Bananen
die Kartoffel|potato|Kartoffeln
die Tomate|tomato|Tomaten
die Zwiebel|onion|Zwiebeln
der Reis|rice|usually singular
die Nudel|noodle; pasta piece|Nudeln
die Suppe|soup|Suppen
der Salat|salad|Salate
der Kuchen|cake|Kuchen
das Wasser|water|usually singular
der Saft|juice|Säfte
der Kaffee|coffee|Kaffees
der Tee|tea|Tees
das Frühstück|breakfast|Frühstücke
`],
['Around town', 'noun', `
die Stadt|city; town|Städte
das Dorf|village|Dörfer
die Straße|street|Straßen
der Platz|square; place|Plätze
der Park|park|Parks
die Brücke|bridge|Brücken
der Bahnhof|railway station|Bahnhöfe
die Haltestelle|stop (bus or tram)|Haltestellen
der Flughafen|airport|Flughäfen
die Post|post office; mail|usually singular
die Bank|bank; bench|Banken (banks); Bänke (benches)
die Apotheke|pharmacy|Apotheken
das Krankenhaus|hospital|Krankenhäuser
die Schule|school|Schulen
die Universität|university|Universitäten
die Bibliothek|library|Bibliotheken
das Museum|museum|Museen
das Kino|cinema|Kinos
das Theater|theatre|Theater
das Restaurant|restaurant|Restaurants
das Café|café|Cafés
der Supermarkt|supermarket|Supermärkte
das Geschäft|shop; business|Geschäfte
die Polizei|police|usually singular
das Zentrum|centre|Zentren
`],
['Travel', 'noun', `
die Reise|journey; trip|Reisen
der Urlaub|holiday; vacation|Urlaube
der Ausflug|outing; excursion|Ausflüge
das Hotel|hotel|Hotels
die Unterkunft|accommodation|Unterkünfte
der Koffer|suitcase|Koffer
die Tasche|bag|Taschen
der Rucksack|backpack|Rucksäcke
der Pass|passport|Pässe
die Fahrkarte|travel ticket|Fahrkarten
das Ticket|ticket|Tickets
der Zug|train|Züge
der Bus|bus|Busse
die Straßenbahn|tram|Straßenbahnen
die U-Bahn|underground; metro|U-Bahnen
das Fahrrad|bicycle|Fahrräder
das Auto|car|Autos
das Flugzeug|aeroplane|Flugzeuge
das Schiff|ship|Schiffe
der Bahnsteig|platform (railway)|Bahnsteige
das Gleis|railway track|Gleise
die Abfahrt|departure|Abfahrten
die Ankunft|arrival|Ankünfte
die Verspätung|delay|Verspätungen
der Fahrplan|timetable|Fahrpläne
`],
['Work & study', 'noun', `
die Arbeit|work; job|Arbeiten
der Beruf|profession|Berufe
die Firma|company|Firmen
das Büro|office|Büros
der Kollege|colleague (male)|Kollegen
die Kollegin|colleague (female)|Kolleginnen
der Chef|boss (male)|Chefs
die Chefin|boss (female)|Chefinnen
der Termin|appointment|Termine
die Besprechung|meeting|Besprechungen
die Bewerbung|job application|Bewerbungen
der Lebenslauf|CV; résumé|Lebensläufe
der Vertrag|contract|Verträge
das Gehalt|salary|Gehälter
die Pause|break|Pausen
der Kurs|course|Kurse
der Unterricht|lessons; teaching|usually singular
die Prüfung|exam|Prüfungen
die Aufgabe|task; exercise|Aufgaben
die Hausaufgabe|homework task|Hausaufgaben
der Lehrer|teacher (male)|Lehrer
die Lehrerin|teacher (female)|Lehrerinnen
der Student|university student (male)|Studenten
die Studentin|university student (female)|Studentinnen
das Zeugnis|certificate; school report|Zeugnisse
`],
['Health & body', 'noun', `
der Körper|body|Körper
der Kopf|head|Köpfe
das Auge|eye|Augen
das Ohr|ear|Ohren
die Nase|nose|Nasen
der Mund|mouth|Münder
der Zahn|tooth|Zähne
der Hals|neck; throat|Hälse
der Arm|arm|Arme
die Hand|hand|Hände
der Finger|finger|Finger
der Bauch|belly; abdomen|Bäuche
der Rücken|back (body)|Rücken
das Bein|leg|Beine
der Fuß|foot|Füße
der Arzt|doctor (male)|Ärzte
die Ärztin|doctor (female)|Ärztinnen
die Krankheit|illness|Krankheiten
der Schmerz|pain|Schmerzen
das Fieber|fever|usually singular
die Erkältung|cold (illness)|Erkältungen
das Medikament|medicine; medication|Medikamente
die Tablette|tablet; pill|Tabletten
die Gesundheit|health|usually singular
die Versicherung|insurance|Versicherungen
`],
['Free time', 'noun', `
die Freizeit|free time|usually singular
das Hobby|hobby|Hobbys
der Sport|sport|usually singular
das Spiel|game|Spiele
der Fußball|football (ball)|Fußbälle
die Musik|music|usually singular
das Lied|song|Lieder
der Film|film; movie|Filme
das Buch|book|Bücher
die Zeitung|newspaper|Zeitungen
die Zeitschrift|magazine|Zeitschriften
das Foto|photo|Fotos
das Bild|picture|Bilder
das Konzert|concert|Konzerte
die Party|party|Partys
das Fest|celebration; festival|Feste
das Schwimmbad|swimming pool|Schwimmbäder
der Verein|club; association|Vereine
die Mannschaft|team|Mannschaften
der Spaziergang|walk; stroll|Spaziergänge
die Einladung|invitation|Einladungen
das Geschenk|gift|Geschenke
der Geburtstag|birthday|Geburtstage
das Wochenende|weekend|Wochenenden
die Ferien|school holidays|plural only
`],
['Time & plans', 'noun', `
die Zeit|time|Zeiten
die Uhr|clock; watch|Uhren
die Stunde|hour; lesson|Stunden
die Minute|minute|Minuten
die Sekunde|second|Sekunden
der Tag|day|Tage
die Woche|week|Wochen
der Monat|month|Monate
das Jahr|year|Jahre
der Morgen|morning|Morgen
der Vormittag|late morning|Vormittage
der Mittag|midday; noon|Mittage
der Nachmittag|afternoon|Nachmittage
der Abend|evening|Abende
die Nacht|night|Nächte
das Datum|date (calendar)|Daten
der Kalender|calendar|Kalender
der Anfang|beginning|Anfänge
das Ende|end|Enden
die Zukunft|future|usually singular
die Vergangenheit|past|usually singular
der Plan|plan|Pläne
die Idee|idea|Ideen
der Wunsch|wish|Wünsche
der Moment|moment|Momente
`],
['Shopping & clothes', 'noun', `
das Geld|money|usually singular
der Preis|price|Preise
die Rechnung|bill; invoice|Rechnungen
das Angebot|offer; special deal|Angebote
der Rabatt|discount|Rabatte
die Kasse|checkout; till|Kassen
der Kunde|customer (male)|Kunden
die Kundin|customer (female)|Kundinnen
die Größe|size|Größen
die Farbe|colour|Farben
die Kleidung|clothing|usually singular
die Jacke|jacket|Jacken
der Mantel|coat|Mäntel
die Hose|trousers|Hosen
das Hemd|shirt|Hemden
das T-Shirt|T-shirt|T-Shirts
der Pullover|jumper; sweater|Pullover
das Kleid|dress|Kleider
der Rock|skirt|Röcke
der Schuh|shoe|Schuhe
die Socke|sock|Socken
der Hut|hat|Hüte
die Mütze|cap; beanie|Mützen
die Brille|glasses|Brillen
der Regenschirm|umbrella|Regenschirme
`],
['Nature & weather', 'noun', `
das Wetter|weather|usually singular
die Sonne|sun|Sonnen
der Regen|rain|usually singular
der Schnee|snow|usually singular
der Wind|wind|Winde
die Wolke|cloud|Wolken
das Gewitter|thunderstorm|Gewitter
die Temperatur|temperature|Temperaturen
der Frühling|spring (season)|Frühlinge
der Sommer|summer|Sommer
der Herbst|autumn|Herbste
der Winter|winter|Winter
der Baum|tree|Bäume
die Blume|flower|Blumen
der Wald|forest|Wälder
der Berg|mountain|Berge
der See|lake|Seen
das Meer|sea|Meere
der Fluss|river|Flüsse
der Strand|beach|Strände
das Tier|animal|Tiere
der Hund|dog|Hunde
die Katze|cat|Katzen
der Vogel|bird|Vögel
die Umwelt|environment|usually singular
`],
['Communication', 'noun', `
die Sprache|language|Sprachen
das Wort|word|Wörter (individual words)
der Satz|sentence|Sätze
die Frage|question|Fragen
die Antwort|answer|Antworten
das Gespräch|conversation|Gespräche
die Nachricht|message; news item|Nachrichten
der Brief|letter|Briefe
die E-Mail|email|E-Mails
das Telefon|telephone|Telefone
das Handy|mobile phone|Handys
der Computer|computer|Computer
das Internet|internet|usually singular
die Webseite|webpage|Webseiten
das Passwort|password|Passwörter
die Nummer|number|Nummern
die Information|information; piece of information|Informationen
die Meinung|opinion|Meinungen
das Problem|problem|Probleme
der Fehler|mistake; error|Fehler
die Hilfe|help|Hilfen
die Erklärung|explanation|Erklärungen
die Bedeutung|meaning|Bedeutungen
die Erfahrung|experience|Erfahrungen
die Entscheidung|decision|Entscheidungen
`],
['Essential verbs', 'verb', `
sein|to be|ich bin · war · ist gewesen
haben|to have|ich habe · hatte · hat gehabt
werden|to become|ich werde · wurde · ist geworden
machen|to do; to make|hat gemacht
gehen|to go; to walk|ist gegangen
kommen|to come|ist gekommen
fahren|to drive; to travel|ist gefahren (travel)
bleiben|to stay|ist geblieben
wohnen|to live (reside)|hat gewohnt
leben|to live (be alive)|hat gelebt
heißen|to be called|ich heiße · hat geheißen
sprechen|to speak|ich spreche · du sprichst · hat gesprochen
sagen|to say|hat gesagt
fragen|to ask|hat gefragt
antworten|to answer|jemandem antworten (dative) · hat geantwortet
hören|to hear; to listen|hat gehört
sehen|to see|ich sehe · du siehst · hat gesehen
lesen|to read|ich lese · du liest · hat gelesen
schreiben|to write|hat geschrieben
lernen|to learn|hat gelernt
verstehen|to understand|hat verstanden
wissen|to know (a fact)|ich weiß · hat gewusst
kennen|to know (a person or place)|hat gekannt
brauchen|to need|hat gebraucht
mögen|to like|ich mag · mochte · hat gemocht
`],
['Everyday verbs', 'verb', `
essen|to eat|ich esse · du isst · hat gegessen
trinken|to drink|hat getrunken
kochen|to cook|hat gekocht
backen|to bake|hat gebacken
kaufen|to buy|hat gekauft
verkaufen|to sell|hat verkauft
bezahlen|to pay|hat bezahlt
kosten|to cost|hat gekostet
suchen|to look for|hat gesucht
finden|to find|hat gefunden
nehmen|to take|ich nehme · du nimmst · hat genommen
geben|to give|ich gebe · du gibst · hat gegeben
bringen|to bring|hat gebracht
holen|to fetch|hat geholt
tragen|to carry; to wear|du trägst · hat getragen
öffnen|to open|hat geöffnet
schließen|to close|hat geschlossen
waschen|to wash|du wäschst · hat gewaschen
putzen|to clean|hat geputzt
schlafen|to sleep|du schläfst · hat geschlafen
aufstehen|to get up|ich stehe auf · ist aufgestanden
frühstücken|to have breakfast|hat gefrühstückt
arbeiten|to work|hat gearbeitet
helfen|to help|du hilfst · hat geholfen · takes dative
warten|to wait|warten auf + accusative · hat gewartet
`],
['Activities & movement', 'verb', `
spielen|to play|hat gespielt
schwimmen|to swim|ist geschwommen (movement)
laufen|to run; to walk|du läufst · ist gelaufen
wandern|to hike|ist gewandert
tanzen|to dance|hat getanzt
singen|to sing|hat gesungen
reisen|to travel|ist gereist
fliegen|to fly|ist geflogen (travel)
steigen|to climb; to rise|ist gestiegen
einsteigen|to get in; to board|ich steige ein · ist eingestiegen
aussteigen|to get out; to alight|ich steige aus · ist ausgestiegen
umsteigen|to change (transport)|ich steige um · ist umgestiegen
ankommen|to arrive|ich komme an · ist angekommen
abfahren|to depart|der Zug fährt ab · ist abgefahren
besuchen|to visit|hat besucht
treffen|to meet|du triffst · hat getroffen
einladen|to invite|ich lade ein · hat eingeladen
anrufen|to call (phone)|ich rufe an · hat angerufen
erzählen|to tell; to recount|hat erzählt
erklären|to explain|hat erklärt
zeigen|to show|hat gezeigt
fotografieren|to photograph|hat fotografiert
feiern|to celebrate|hat gefeiert
beginnen|to begin|hat begonnen
aufhören|to stop (an activity)|ich höre auf · hat aufgehört
`],
['Thinking & organising', 'verb', `
können|can; to be able to|ich kann · konnte · modal verb
müssen|must; to have to|ich muss · musste · modal verb
wollen|to want to|ich will · wollte · modal verb
sollen|should; to be supposed to|ich soll · sollte · modal verb
dürfen|may; to be allowed to|ich darf · durfte · modal verb
denken|to think|hat gedacht
glauben|to believe|hat geglaubt
hoffen|to hope|hat gehofft
vergessen|to forget|du vergisst · hat vergessen
erinnern|to remind|sich erinnern an + accusative = remember
entscheiden|to decide|sich entscheiden · hat entschieden
planen|to plan|hat geplant
versuchen|to try|hat versucht
üben|to practise|hat geübt
wiederholen|to repeat; to revise|hat wiederholt
ändern|to change; to alter|hat geändert
bekommen|to get; to receive|hat bekommen
verlieren|to lose|hat verloren
gewinnen|to win|hat gewonnen
mieten|to rent|hat gemietet
reservieren|to reserve|hat reserviert
bestellen|to order|hat bestellt
reparieren|to repair|hat repariert
unterschreiben|to sign|hat unterschrieben
passieren|to happen|ist passiert
`],
['Describing things', 'adjective', `
gut|good|besser · am besten
schlecht|bad|schlechter · am schlechtesten
groß|big; tall|größer · am größten
klein|small|kleiner · am kleinsten
lang|long|länger · am längsten
kurz|short|kürzer · am kürzesten
hoch|high; tall|höher · am höchsten
niedrig|low|niedriger · am niedrigsten
breit|wide|breiter · am breitesten
eng|narrow; tight|enger · am engsten
neu|new|ein neues Buch
alt|old|älter · am ältesten
jung|young|jünger · am jüngsten
schön|beautiful; nice|schöner · am schönsten
hässlich|ugly|hässlicher · am hässlichsten
sauber|clean|ein sauberes Zimmer
schmutzig|dirty|schmutzige Schuhe
voll|full|Der Bus ist voll.
leer|empty|Die Flasche ist leer.
leicht|light; easy|leichter · am leichtesten
schwer|heavy; difficult|schwerer · am schwersten
einfach|simple; easy|eine einfache Frage
schwierig|difficult|eine schwierige Aufgabe
richtig|correct; right|Die Antwort ist richtig.
falsch|wrong; incorrect|Die Nummer ist falsch.
`],
['Feelings & qualities', 'adjective', `
glücklich|happy|Ich bin glücklich.
traurig|sad|Sie ist traurig.
müde|tired|Ich bin müde.
wach|awake|Bist du schon wach?
krank|ill; sick|Er ist krank.
gesund|healthy|gesundes Essen
hungrig|hungry|Ich bin hungrig.
durstig|thirsty|Wir sind durstig.
zufrieden|satisfied; content|zufrieden mit + dative
nervös|nervous|vor der Prüfung nervös
ruhig|quiet; calm|ein ruhiges Zimmer
laut|loud|Die Musik ist laut.
freundlich|friendly|eine freundliche Person
höflich|polite|eine höfliche Antwort
nett|nice; kind|Das ist sehr nett.
lustig|funny; amusing|ein lustiger Film
langweilig|boring|Der Film ist langweilig.
interessant|interesting|ein interessantes Buch
wichtig|important|eine wichtige Frage
möglich|possible|Ist das möglich?
fertig|finished; ready|Ich bin fertig.
sicher|safe; certain|Bist du sicher?
gefäh​rlich|dangerous|eine gefährliche Straße
beliebt|popular|ein beliebtes Café
bekannt|well-known; familiar|eine bekannte Stadt
`],
['Everyday descriptions', 'adjective', `
heiß|hot|heißer Tee
kalt|cold|kaltes Wasser
warm|warm|ein warmer Tag
kühl|cool (temperature)|ein kühler Abend
trocken|dry|trockene Kleidung
nass|wet|Die Jacke ist nass.
schnell|fast|schneller · am schnellsten
langsam|slow|langsamer · am langsamsten
früh|early|früher · am frühesten
spät|late|später · am spätesten
pünktlich|punctual; on time|Der Zug ist pünktlich.
billig|cheap|ein billiges Ticket
teuer|expensive|teurer · am teuersten
kostenlos|free of charge|Der Eintritt ist kostenlos.
reich|rich|eine reiche Familie
arm|poor|eine arme Familie
bequem|comfortable; convenient|ein bequemes Sofa
praktisch|practical|Das ist praktisch.
modern|modern|eine moderne Wohnung
kaputt|broken|Mein Handy ist kaputt.
offen|open|Die Tür ist offen.
geschlossen|closed|Das Geschäft ist geschlossen.
frei|free; available|Ist der Platz frei?
besetzt|occupied; taken|Der Platz ist besetzt.
verschieden|different; various|verschiedene Farben
`],
['Connecting words', 'expression', `
heute|today|Heute lerne ich Deutsch.
gestern|yesterday|Gestern war ich zu Hause.
morgen|tomorrow|Morgen habe ich Zeit.
jetzt|now|Jetzt beginnt der Kurs.
später|later|Bis später!
immer|always|Ich trinke immer Tee.
oft|often|Ich gehe oft zu Fuß.
manchmal|sometimes|Manchmal regnet es.
selten|rarely|Ich esse selten Fleisch.
nie|never|Ich komme nie zu spät.
schon|already|Ich bin schon hier.
noch|still; yet|Ich bin noch im Büro.
zusammen|together|Wir lernen zusammen.
allein|alone|Ich wohne allein.
vielleicht|perhaps; maybe|Vielleicht kommt sie morgen.
leider|unfortunately|Leider habe ich keine Zeit.
deshalb|therefore; that's why|Es regnet. Deshalb bleibe ich hier.
weil|because|Ich bleibe hier, weil es regnet. Verb last.
dass|that (conjunction)|Ich weiß, dass du kommst. Verb last.
wenn|if; when|Wenn ich Zeit habe, komme ich. Verb last.
aber|but|Das ist schön, aber teuer.
oder|or|Tee oder Kaffee?
und|and|Brot und Butter
mit|with|always dative: mit dem Bus
für|for|always accusative: für den Freund
`],
];
const foundations: Card[] = groups.flatMap(([topic, kind, rows]) => rows.trim().split('\n').map((row, i) => {
 const [german, english, extra] = row.split('|');
 return { id: `${topic.toLowerCase().replace(/[^a-z]+/g,'-')}-${i+1}`, german: german.replace(/\u200b/g,''), english, topic, kind, ...(kind === 'noun' ? {plural: extra} : {note: extra}) };
}));
// Stable explicit IDs preserve review history when this collection grows.
const stretchRows: [string, string, string, Card['kind'], string, string, string, string][] = [
 ['verdient','verdient','earned; deserved','expression','Work & study','Participle of verdienen. Also: er verdient = he earns / deserves.','Ich habe mir eine Pause verdient.','I have earned a break.'],
 ['verdienen','verdienen','to earn; to deserve','verb','Work & study','hat verdient','Sie verdient mehr als früher.','She earns more than before.'],
 ['vermeiden','vermeiden','to avoid','verb','Thinking & organising','vermied · hat vermieden','Wir möchten Fehler vermeiden.','We would like to avoid mistakes.'],
 ['zuverlaessig','zuverlässig','reliable','adjective','Feelings & qualities','A person or thing you can depend on.','Sie ist sehr zuverlässig.','She is very reliable.'],
 ['erreichen','erreichen','to reach; to achieve','verb','Activities & movement','hat erreicht','Wir haben unser Ziel erreicht.','We have achieved our goal.'],
 ['erledigen','erledigen','to take care of; to complete','verb','Work & study','hat erledigt','Ich muss diese Aufgabe heute erledigen.','I have to complete this task today.'],
 ['bewerben','sich bewerben','to apply for a job','verb','Work & study','sich bewerben um + accusative · hat sich beworben','Ich bewerbe mich um eine Stelle.','I am applying for a position.'],
 ['voraussetzung','die Voraussetzung','prerequisite; condition','noun','Work & study','Voraussetzungen','Erfahrung ist eine wichtige Voraussetzung.','Experience is an important prerequisite.'],
 ['verantwortung','die Verantwortung','responsibility','noun','Work & study','usually singular','Ich übernehme die Verantwortung.','I am taking responsibility.'],
 ['selbststaendig','selbstständig','independent; self-employed','adjective','Work & study','Also spelled selbständig.','Sie arbeitet selbstständig.','She works independently.'],
 ['vereinbaren','vereinbaren','to arrange; to agree on','verb','Work & study','hat vereinbart','Wir haben einen Termin vereinbart.','We have arranged an appointment.'],
 ['absagen','absagen','to cancel; to decline','verb','Time & plans','separable: ich sage ab · hat abgesagt','Ich muss den Termin absagen.','I have to cancel the appointment.'],
 ['verschieben','verschieben','to postpone; to move','verb','Time & plans','verschob · hat verschoben','Können wir das Treffen verschieben?','Can we postpone the meeting?'],
 ['beantragen','beantragen','to apply for; to request officially','verb','Work & study','hat beantragt','Ich habe ein Visum beantragt.','I have applied for a visa.'],
 ['genehmigen','genehmigen','to approve; to authorize','verb','Work & study','hat genehmigt','Mein Urlaub wurde genehmigt.','My leave was approved.'],
 ['ablehnen','ablehnen','to reject; to decline','verb','Communication','separable: ich lehne ab · hat abgelehnt','Sie hat das Angebot abgelehnt.','She declined the offer.'],
 ['ueberzeugen','überzeugen','to convince','verb','Communication','jemanden von etwas überzeugen · hat überzeugt','Das Ergebnis hat mich überzeugt.','The result convinced me.'],
 ['beruecksichtigen','berücksichtigen','to take into account','verb','Thinking & organising','hat berücksichtigt','Wir müssen die Kosten berücksichtigen.','We have to take the costs into account.'],
 ['schaetzen','schätzen','to estimate; to appreciate','verb','Thinking & organising','hat geschätzt','Ich schätze deine Hilfe.','I appreciate your help.'],
 ['sich-lohnen','sich lohnen','to be worth it','verb','Everyday verbs','hat sich gelohnt','Die Reise hat sich gelohnt.','The trip was worth it.'],
 ['nachweisen','nachweisen','to prove; to demonstrate','verb','Work & study','separable: ich weise nach · hat nachgewiesen','Ich muss meine Erfahrung nachweisen.','I have to demonstrate my experience.'],
 ['enttaeuscht','enttäuscht','disappointed','adjective','Feelings & qualities','enttäuscht von + dative','Ich bin vom Ergebnis enttäuscht.','I am disappointed with the result.'],
 ['erleichtert','erleichtert','relieved','adjective','Feelings & qualities','Often used with sein.','Ich bin erleichtert, dass alles gut gegangen ist.','I am relieved that everything went well.'],
 ['angemessen','angemessen','appropriate; reasonable','adjective','Everyday descriptions','Used for behaviour, prices, or responses.','Der Preis ist angemessen.','The price is reasonable.'],
 ['verfuegbar','verfügbar','available','adjective','Everyday descriptions','Useful for availability of people or things.','Der Termin ist noch verfügbar.','The appointment slot is still available.'],
 ['gruendlich','gründlich','thorough; thoroughly','adjective','Everyday descriptions','Used for careful work or checking.','Ich habe alles gründlich geprüft.','I checked everything thoroughly.'],
 ['gelegenheit','die Gelegenheit','opportunity; occasion','noun','Time & plans','Gelegenheiten','Das ist eine gute Gelegenheit.','This is a good opportunity.'],
 ['fortschritt','der Fortschritt','progress; advance','noun','Work & study','Fortschritte','Ich mache Fortschritte beim Deutschlernen.','I am making progress in learning German.'],
 ['herausforderung','die Herausforderung','challenge','noun','Work & study','Herausforderungen','Das ist eine neue Herausforderung.','This is a new challenge.'],
 ['zusammenhang','der Zusammenhang','connection; context','noun','Communication','Zusammenhänge','Ich verstehe den Zusammenhang nicht.','I do not understand the connection.'],
 ['trotzdem','trotzdem','nevertheless; even so','expression','Connecting words','Main-clause connector: verb in second position.','Es regnet. Trotzdem gehe ich spazieren.','It is raining. Even so, I am going for a walk.'],
 ['obwohl','obwohl','although','expression','Connecting words','Introduces a subordinate clause: verb last.','Ich gehe spazieren, obwohl es regnet.','I am going for a walk although it is raining.'],
 ['inzwischen','inzwischen','meanwhile; by now','expression','Connecting words','Useful for a situation that has changed.','Inzwischen spreche ich besser Deutsch.','By now, I speak better German.'],
 ['allerdings','allerdings','however; admittedly','expression','Connecting words','Adds a qualification or contrast.','Das ist möglich, allerdings dauert es länger.','That is possible; however, it takes longer.'],
 ['voraussichtlich','voraussichtlich','probably; as expected','expression','Time & plans','Used for a prediction or expected timing.','Der Zug kommt voraussichtlich um acht Uhr.','The train is expected to arrive at eight.'],
 ['schliesslich','schließlich','finally; after all','expression','Connecting words','Meaning depends on context.','Schließlich haben wir eine Lösung gefunden.','Finally, we found a solution.'],
];
const stretch: Card[] = stretchRows.map(([id,german,english,kind,topic,extra,example,translation])=>({
 id:`stretch-${id}`,german,english,kind,topic,cefr:'b1',example,translation,
 ...(kind==='noun'?{plural:extra}:{note:extra}),
}));
// Progress IDs stay stable. Four older stretch items outside the reference lists remain
// addressable by the API for old clients, but are excluded from the A2–B1 study bank.
const b1Ids = new Set(["stretch-vermeiden", "stretch-zuverlaessig", "stretch-erledigen", "stretch-voraussetzung", "stretch-verantwortung", "stretch-selbststaendig", "stretch-absagen", "stretch-beantragen", "stretch-genehmigen", "stretch-ablehnen", "stretch-ueberzeugen", "stretch-schaetzen", "stretch-sich-lohnen", "stretch-enttaeuscht", "stretch-erleichtert", "stretch-gruendlich", "stretch-gelegenheit", "stretch-fortschritt", "stretch-herausforderung", "stretch-zusammenhang", "stretch-trotzdem", "stretch-obwohl", "stretch-inzwischen", "stretch-allerdings", "stretch-voraussichtlich", "stretch-schliesslich", "work-study-10", "work-study-12", "health-body-21", "health-body-25", "time-plans-20", "time-plans-21", "shopping-clothes-5", "nature-weather-8", "nature-weather-25", "communication-22", "communication-23", "communication-25", "activities-movement-9", "activities-movement-14", "thinking-organising-11", "describing-things-8"]);
const extensionIds = new Set(["stretch-beruecksichtigen", "stretch-nachweisen", "stretch-angemessen", "stretch-verfuegbar"]);
const existing = [...stretch, ...foundations];
const existingWords = new Set(existing.map(c=>c.german));
const expansion: Card[] = b1Rows.trim().split('\n').filter(r=>!existingWords.has(r.split('|')[0])).map(row=>{
 const [german,english,kind,topic,extra,example,translation]=row.split('|');
 const id='b1-'+german.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').toLowerCase().replace(/[^a-z]+/g,'-');
 return {id,german,english,kind:kind as Card['kind'],topic,cefr:'b1',example,translation,...(kind==='noun'?{plural:extra}:{note:extra})};
});
const originalVocabulary: Card[] = [...existing.map(c=>({...c,cefr:(b1Ids.has(c.id)?'b1':'a2') as 'a2'|'b1'})),...expansion];
export const allVocabulary: Card[] = [...originalVocabulary, ...foundationCards.filter(c=>!originalVocabulary.some(old=>old.german===c.german))];
export const vocabulary = allVocabulary.filter(c=>!extensionIds.has(c.id));
export function matchesLevel(card:Card,level:Level) {return level==='mixed'||card.cefr===level;}
export const topics = [...new Set(vocabulary.map(c=>c.topic))];
