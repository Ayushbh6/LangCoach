import type { Card } from './vocabulary';
// Additional Goethe A1 headwords with independently written English glosses.
// Examples from the Goethe PDF are deliberately not reproduced.
const nouns = `
der Absender|sender|Absender
das Alter|age|usually singular
die Anmeldung|registration|Anmeldungen
die Anrede|form of address|Anreden
der Anruf|phone call|Anrufe
der Anrufbeantworter|answering machine|Anrufbeantworter
die Ansage|announcement|Ansagen
die Anzeige|advertisement; notice|Anzeigen
das Apartment|apartment|Apartments
der Appetit|appetite|usually singular
der Arbeitsplatz|workplace|Arbeitsplätze
der Aufzug|lift; elevator|Aufzüge
der Ausgang|exit|Ausgänge
die Auskunft|information; answer to an enquiry|Auskünfte
das Ausland|foreign countries; abroad|usually singular
der Ausländer|foreigner (male)|Ausländer
die Aussage|statement|Aussagen
der Ausweis|identity document|Ausweise
die Autobahn|motorway|Autobahnen
der Automat|vending machine; automated machine|Automaten
das Baby|baby|Babys
die Bäckerei|bakery|Bäckereien
die Bahn|railway; train|Bahnen
das Beispiel|example|Beispiele
das Bier|beer|Biere
die Birne|pear|Birnen
die Bitte|request|Bitten
der Bleistift|pencil|Bleistifte
der Blick|look; view|Blicke
der Bogen|sheet; arc|Bögen
die Briefmarke|postage stamp|Briefmarken
der Buchstabe|letter of the alphabet|Buchstaben
die CD|CD|CDs
die Dame|lady|Damen
der Dank|thanks; gratitude|usually singular
die Disco|disco|Discos
der Doktor|doctor; person with a doctorate|Doktoren
das Doppelzimmer|double room|Doppelzimmer
der Drucker|printer|Drucker
die Durchsage|public announcement|Durchsagen
der Durst|thirst|usually singular
die Dusche|shower|Duschen
die Ecke|corner|Ecken
die Ehefrau|wife|Ehefrauen
der Ehemann|husband|Ehemänner
der Eingang|entrance|Eingänge
der Eintritt|admission; entry|Eintritte
das Einzelzimmer|single room|Einzelzimmer
der Empfänger|recipient|Empfänger
die Entschuldigung|apology; excuse|Entschuldigungen
das Ergebnis|result|Ergebnisse
das Essen|food; meal|Essen
der Fahrer|driver (male)|Fahrer
der Familienname|surname|Familiennamen
der Familienstand|marital status|usually singular
das Fax|fax|Faxe
das Feuer|fire|Feuer
die Flasche|bottle|Flaschen
der Abflug|flight departure|Abflüge
das Formular|form to fill in|Formulare
die Führung|guided tour; leadership|Führungen
der Gast|guest|Gäste
das Geburtsjahr|year of birth|Geburtsjahre
der Geburtsort|place of birth|Geburtsorte
das Gepäck|luggage|usually singular
die Geschwister|siblings|plural only
das Getränk|drink; beverage|Getränke
das Gewicht|weight|Gewichte
das Glas|glass|Gläser
das Glück|luck; happiness|usually singular
der Glückwunsch|congratulation|Glückwünsche
die Großeltern|grandparents|plural only
die Gruppe|group|Gruppen
der Gruß|greeting|Grüße
das Haar|hair|Haare
das Hähnchen|chicken (food)|Hähnchen
die Halbpension|half board|usually singular
die Halle|hall|Hallen
die Hausfrau|homemaker (female)|Hausfrauen
der Hausmann|homemaker (male)|Hausmänner
die Heimat|home region; homeland|usually singular
der Herr|gentleman; Mr|Herren
die Hochzeit|wedding|Hochzeiten
der Hunger|hunger|usually singular
der Job|job|Jobs
der Junge|boy|Jungen
die Karte|card; map; ticket|Karten
die Kreditkarte|credit card|Kreditkarten
der Kindergarten|nursery school; kindergarten|Kindergärten
der Kiosk|kiosk; small shop|Kioske
die Klasse|class|Klassen
das Konto|bank account|Konten
der Kugelschreiber|ballpoint pen|Kugelschreiber
der Laden|shop|Läden
das Land|country; countryside|Länder
das Leben|life|Leben
die Lebensmittel|groceries; food products|plural only
die Leute|people|plural only
das Licht|light|Lichter
der Lkw|lorry; truck|Lkws
das Lokal|restaurant; bar|Lokale
das Mädchen|girl|Mädchen
die Maschine|machine|Maschinen
die Mitte|middle; centre|usually singular
die Möbel|furniture|plural only
der Name|name|Namen
das Öl|oil|Öle
die Oma|grandma|Omas
der Opa|grandpa|Opas
die Ordnung|order; tidiness|usually singular
der Ort|place|Orte
das Papier|paper|Papiere
die Postleitzahl|postcode|Postleitzahlen
das Praktikum|internship; work placement|Praktika
die Praxis|medical practice; practical experience|Praxen
der Prospekt|brochure|Prospekte
der Raum|room; space|Räume
das Reisebüro|travel agency|Reisebüros
der Reiseführer|travel guide|Reiseführer
die Reparatur|repair|Reparaturen
die Rezeption|reception desk|Rezeptionen
das Salz|salt|Salze
die S-Bahn|suburban railway|S-Bahnen
der Schalter|counter; switch|Schalter
das Schild|sign|Schilder
der Schinken|ham|Schinken
der Schluss|end; conclusion|Schlüsse
der Schüler|school pupil (male)|Schüler
die Sehenswürdigkeit|sight; tourist attraction|Sehenswürdigkeiten
die Speisekarte|menu|Speisekarten
der Stock|floor of a building; stick|Stockwerke (floors)
das Studium|university studies|usually singular
das Taxi|taxi|Taxis
der Teil|part|Teile
der Test|test|Tests
der Text|text|Texte
das Thema|topic|Themen
die Toilette|toilet|Toiletten
die Treppe|stairs; staircase|Treppen
die Unterschrift|signature|Unterschriften
der Verkäufer|salesperson (male)|Verkäufer
der Vermieter|landlord|Vermieter
der Vorname|first name|Vornamen
die Vorsicht|caution|usually singular
die Vorwahl|dialling code|Vorwahlen
der Wein|wine|Weine
die Welt|world|Welten
die Zigarette|cigarette|Zigaretten
der Zoll|customs; customs duty|Zölle
`;
const expressions = `
ich|I|Personal pronoun: ich → mich (accusative) → mir (dative).
du|you (informal singular)|du → dich (accusative) → dir (dative).
er|he|er → ihn (accusative) → ihm (dative).
sie|she; they|She: sie → sie → ihr. They: sie → sie → ihnen.
es|it|es → es (accusative) → ihm (dative).
wir|we|wir → uns (accusative and dative).
ihr|you (informal plural)|ihr → euch (accusative and dative).
Sie|you (formal)|Always capitalised. Sie → Sie (accusative) → Ihnen (dative).
man|one; people in general|Uses third-person singular: man kann.
ja|yes|Also used as a conversational particle.
nein|no|A negative reply.
nicht|not|Negates verbs, adjectives and many other expressions.
nichts|nothing|Something is etwas; nothing is nichts.
auch|also; too|Ich auch = me too.
nur|only|Narrows or limits something.
bitte|please; you are welcome|Meaning depends on context.
danke|thank you|A short expression of thanks.
hallo|hello|An informal greeting.
tschüss|bye|An informal farewell.
willkommen|welcome|Often: herzlich willkommen.
warum|why|Asks for a reason.
wann|when|Asks about time.
wer|who|wer → wen (accusative) → wem (dative) → wessen (genitive).
was|what|Asks about a thing or action.
wo|where (location)|Often answered with a dative two-way preposition.
wohin|where to (destination)|Often answered with an accusative two-way preposition.
woher|where from|Often answered with aus or von + dative.
wie|how|Also used in comparisons.
wie viel|how much|wie viele asks about a number of countable things.
mit|with|Always followed by dative.
ohne|without|Always followed by accusative.
für|for|Always followed by accusative.
durch|through|Always followed by accusative.
gegen|against; around (time)|Always followed by accusative.
aus|out of; from|Always followed by dative.
bei|at; with; near|Always followed by dative.
zu|to|Preposition zu takes dative; zu + infinitive is a different use.
von|from; of|Always followed by dative.
seit|since; for (ongoing time)|Always followed by dative.
nach|after; to|Always followed by dative.
in|in; into|Location: dative. Destination into: accusative.
an|at; on (contact)|Location: dative. Destination: accusative.
auf|on; onto|Location: dative. Destination onto: accusative.
über|above; over; about|Location: dative. Destination: accusative. Talking about: often accusative.
unter|under; among|Location: dative. Destination: accusative.
vor|in front of; before|Location or time before: dative. Destination: accusative.
zwischen|between|Location: dative. Destination: accusative.
um|around; at (time)|Always followed by accusative.
bis|until; up to|Often combined with another preposition: bis zum Bahnhof.
also|so; therefore|Not the same meaning as English also.
denn|because; then|As because, it joins main clauses without sending the verb to the end.
oben|upstairs; above|A location word.
unten|downstairs; below|A location word.
links|on the left; left|Direction or position.
rechts|on the right; right|Direction or position.
geradeaus|straight ahead|Useful for directions.
hier|here|Near the speaker.
dort|there|A place away from the speaker.
draußen|outside|A location word.
hinten|at the back|A location word.
sofort|immediately|A time word.
bald|soon|A time word.
zurzeit|currently; at present|Written as one word in this meaning.
`;
function rows(text: string, kind: Card['kind']): Card[] {
  return text.trim().split('\n').map(row=>{
    const [german,english,extra]=row.split('|');
    return {id:`a1-${(german==='Sie'?'formal-Sie':german).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'-')}`,german,english,kind,topic:'A1 foundations',cefr:'a2',...(kind==='noun'?{plural:extra}:{note:extra})};
  });
}
export const foundationCards=[...rows(nouns,'noun'),...rows(expressions,'expression')];
