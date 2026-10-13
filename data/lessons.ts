import type { Lesson, Exercise } from "../lib/learning/types";
// Original teaching material. Answer keys stay on the server until feedback/support is requested.
type Seed = {
  id: string;
  title: string;
  germanTitle: string;
  outcome: string;
  scene: string;
  dialogue: string[];
  pattern: string;
  examples: string[];
  words: string[];
  gap: [string, string, string, string];
  variation: [string, string];
  reading: [string, string, string];
  listen: [string, string, string];
  writing: string;
  model: string;
  mission: string;
};
const seeds: Seed[] = [
  {
    id: "groceries",
    title: "A small shop. A real conversation.",
    germanTitle: "Im Supermarkt",
    outcome: "Find what you need and answer the cashier.",
    scene:
      "You need apples and bread. Ask an employee, then pay at the checkout.",
    dialogue: [
      "Du: Entschuldigung, wo finde ich die Äpfel?",
      "Mitarbeiterin: Gleich rechts neben dem Brot.",
      "Kassierer: Brauchen Sie eine Tasche?",
      "Du: Nein, danke. Ich habe eine dabei.",
    ],
    pattern:
      "After „ich möchte“, a masculine object uses einen: der Apfel → einen Apfel.",
    examples: ["Ich möchte einen Apfel.", "Ich möchte eine Banane."],
    words: [
      "der Apfel|apple|Plural: die Äpfel",
      "die Tasche|bag|Plural: die Taschen",
      "das Brot|bread|Plural: die Brote",
      "brauchen|to need|ich brauche · du brauchst · ihr braucht",
      "dabei|with you / along",
    ],
    gap: [
      "Ich möchte ___ Apfel.",
      "einen",
      "accusative-articles",
      "Apfel is masculine; möchte takes an accusative object.",
    ],
    variation: ["Ich kaufe ___ Kaffee.", "einen"],
    reading: [
      "Nora kauft Brot und drei Äpfel. Eine Tasche hat sie schon dabei.",
      "Was muss Nora nicht kaufen? (eine …)",
      "Tasche",
    ],
    listen: [
      "Die Äpfel finden Sie rechts. Das Brot ist links.",
      "Wo sind die Äpfel?",
      "rechts",
    ],
    writing: "Ask politely where the milk is, then say you already have a bag.",
    model:
      "Entschuldigung, wo finde ich die Milch? Ich habe schon eine Tasche dabei.",
    mission:
      "Be a shop employee and then the cashier. Ask one unexpected follow-up. Wait for my answers before correcting.",
  },
  {
    id: "cafe",
    title: "Your usual coffee. One new question.",
    germanTitle: "Im Café",
    outcome: "Order a drink and handle a follow-up.",
    scene: "You order at a café. The barista asks whether you want to stay.",
    dialogue: [
      "Du: Ich hätte gern einen Kaffee.",
      "Barista: Zum Mitnehmen oder hier trinken?",
      "Du: Zum Mitnehmen, bitte.",
      "Barista: Mit Milch?",
      "Du: Ja, mit Milch, aber ohne Zucker.",
    ],
    pattern:
      "Use mit + dative for what comes with your order; ohne + accusative for what you leave out.",
    examples: ["Mit einem Löffel, bitte.", "Ohne einen Löffel, danke."],
    words: [
      "der Kaffee|coffee|Plural: die Kaffees",
      "mitnehmen|to take away|ich nehme mit · du nimmst mit",
      "die Milch|milk",
      "der Zucker|sugar",
      "der Löffel|spoon|Plural: die Löffel",
    ],
    gap: [
      "Mit ___ Löffel, bitte.",
      "einem",
      "dative-after-mit",
      "Mit always takes dative: der → einem.",
    ],
    variation: ["Mit ___ Freund trinke ich Kaffee.", "einem"],
    reading: [
      "Lena bestellt Tee ohne Zucker. Sie bleibt im Café.",
      "Was bestellt Lena?",
      "Tee",
    ],
    listen: [
      "Einen Kaffee zum Mitnehmen? Das kostet drei Euro.",
      "Wie viel kostet der Kaffee? (number)",
      "3|drei",
    ],
    writing: "Order a tea to take away, without sugar.",
    model: "Ich hätte gern einen Tee zum Mitnehmen, ohne Zucker, bitte.",
    mission: "Be a barista. Ask about size, milk and whether I am staying.",
  },
  {
    id: "clarification",
    title: "Keep the conversation going.",
    germanTitle: "Noch einmal, bitte",
    outcome: "Ask for repetition without switching to English.",
    scene:
      "Someone explains something too quickly. Keep them talking at your pace.",
    dialogue: [
      "Du: Entschuldigung, können Sie das bitte wiederholen?",
      "Person: Natürlich. Der Termin ist am Donnerstag.",
      "Du: Was bedeutet Termin?",
      "Person: Ein vereinbartes Treffen.",
    ],
    pattern: "With können, conjugate können and put the other verb at the end.",
    examples: ["Können Sie das wiederholen?", "Kannst du langsamer sprechen?"],
    words: [
      "wiederholen|to repeat|ich wiederhole · ihr wiederholt",
      "langsamer|more slowly",
      "bedeuten|to mean|das bedeutet",
      "verstehen|to understand|ich verstehe · du verstehst",
      "erklären|to explain|ich erkläre · ihr erklärt",
    ],
    gap: [
      "Kannst du das bitte ___? (to explain)",
      "erklären",
      "modal-infinitive",
      "After kannst, use the infinitive at the end.",
    ],
    variation: ["Können Sie bitte langsamer ___? (to speak)", "sprechen"],
    reading: [
      "Tim versteht ein Wort nicht. Er fragt: „Was bedeutet das?“",
      "Versteht Tim das Wort? (ja/nein)",
      "nein",
    ],
    listen: [
      "Bitte kommen Sie am Donnerstag um zehn Uhr.",
      "An welchem Tag?",
      "Donnerstag|am Donnerstag",
    ],
    writing: "Ask someone to repeat and then explain a word.",
    model: "Können Sie das bitte wiederholen? Was bedeutet dieses Wort?",
    mission:
      "Explain a short everyday instruction in German. Let me ask for repetition and clarification.",
  },
  {
    id: "appointment",
    title: "Make a little room in your week.",
    germanTitle: "Einen Termin vereinbaren",
    outcome: "Arrange an appointment and confirm the time.",
    scene: "You call to arrange an appointment. Tuesday does not work for you.",
    dialogue: [
      "Du: Ich möchte einen Termin vereinbaren.",
      "Person: Passt Ihnen Dienstag um neun?",
      "Du: Leider nicht. Haben Sie am Mittwoch Zeit?",
      "Person: Ja, um zehn Uhr.",
    ],
    pattern: "Use am with days, um with clock times.",
    examples: ["Am Dienstag habe ich Zeit.", "Der Termin ist um zehn Uhr."],
    words: [
      "der Termin|appointment|Plural: die Termine",
      "vereinbaren|to arrange",
      "passen|to suit / fit|das passt",
      "leider|unfortunately",
      "verschieben|to postpone / reschedule|ich verschiebe",
    ],
    gap: [
      "Der Termin ist ___ zehn Uhr.",
      "um",
      "time-prepositions",
      "Use um for a clock time.",
    ],
    variation: ["___ Freitag habe ich Zeit.", "am"],
    reading: [
      "Der Termin war am Dienstag. Jetzt ist er am Mittwoch um zehn Uhr.",
      "Wann ist der neue Termin? (day)",
      "Mittwoch|am Mittwoch",
    ],
    listen: [
      "Am Mittwoch ist leider alles voll. Am Freitag um elf ist noch ein Termin frei.",
      "An welchem Tag ist ein Termin frei?",
      "Freitag|am Freitag",
    ],
    writing: "Say Tuesday does not work and ask for a Thursday appointment.",
    model:
      "Am Dienstag kann ich leider nicht. Haben Sie am Donnerstag einen Termin frei?",
    mission:
      "Help me arrange an appointment. Offer a time that I must decline, then find an alternative.",
  },
  {
    id: "weekend",
    title: "A little story from your weekend.",
    germanTitle: "Wie war dein Wochenende?",
    outcome: "Tell someone what you did and ask about their day.",
    scene: "A friend asks what you did at the weekend.",
    dialogue: [
      "Freund: Was hast du am Wochenende gemacht?",
      "Du: Ich habe einen Freund besucht.",
      "Freund: Seid ihr ins Café gegangen?",
      "Du: Ja, und danach bin ich nach Hause gefahren.",
    ],
    pattern:
      "Perfekt uses an auxiliary + participle. Lernen uses haben; gehen uses sein.",
    examples: ["Ich habe Deutsch gelernt.", "Ich bin nach Hause gegangen."],
    words: [
      "besuchen|to visit|ich habe besucht",
      "gelernt|learned|lernen → hat gelernt",
      "gegangen|gone / walked|gehen → ist gegangen",
      "danach|after that",
      "das Wochenende|weekend|Plural: die Wochenenden",
    ],
    gap: [
      "Ich ___ Deutsch gelernt.",
      "habe",
      "perfekt-auxiliary",
      "Lernen uses haben: ich habe gelernt.",
    ],
    variation: ["Ich ___ ins Café gegangen.", "bin"],
    reading: [
      "Am Samstag hat Mia gelernt. Am Sonntag hat sie ihre Schwester besucht.",
      "Wen hat Mia besucht?",
      "ihre Schwester|Schwester",
    ],
    listen: [
      "Gestern habe ich gearbeitet. Danach habe ich einen Film gesehen.",
      "Was hat die Person danach gesehen?",
      "einen Film|Film",
    ],
    writing: "Write two connected sentences about a real or imagined weekend.",
    model:
      "Am Samstag habe ich Deutsch gelernt. Danach bin ich ins Café gegangen.",
    mission:
      "Ask about my weekend and one follow-up about where, who or why. Record specific auxiliary/participle observations.",
  },
  {
    id: "plans",
    title: "Turn “sometime” into a plan.",
    germanTitle: "Hast du Zeit?",
    outcome: "Invite a friend and agree on a plan.",
    scene: "You want to meet a friend after work.",
    dialogue: [
      "Du: Hast du am Freitag Zeit?",
      "Freund: Ja. Wollen wir zusammen essen?",
      "Du: Gern. Wir können uns um sieben treffen.",
      "Freund: Super, bis Freitag!",
    ],
    pattern:
      "For ihr in regular present-tense verbs, use -t. For wir, use -en.",
    examples: ["Ihr spielt heute.", "Wir spielen morgen."],
    words: [
      "sich treffen|to meet|wir treffen uns · ihr trefft euch",
      "zusammen|together",
      "vorschlagen|to suggest|ich schlage vor",
      "gern|gladly / like to",
      "einladen|to invite|ich lade ein",
    ],
    gap: [
      "Ihr ___ heute Fußball. (spielen)",
      "spielt",
      "present-ihr",
      "Ihr takes -t for regular verbs: spielt.",
    ],
    variation: ["Ihr ___ morgen Deutsch. (lernen)", "lernt"],
    reading: [
      "Ben kann am Freitag nicht. Er schlägt Samstag vor. Lea hat am Samstag Zeit.",
      "Wann treffen sich Ben und Lea?",
      "Samstag|am Samstag",
    ],
    listen: [
      "Treffen wir uns um sieben vor dem Kino? Ja, gern!",
      "Wo treffen sie sich?",
      "vor dem Kino|Kino",
    ],
    writing: "Invite a friend and suggest a place and a time.",
    model:
      "Hast du am Samstag Zeit? Wir können uns um drei vor dem Café treffen.",
    mission:
      "Be a friend making plans. Decline my first suggestion politely, then agree on another.",
  },
  {
    id: "transport",
    title: "Get where you need to go.",
    germanTitle: "Unterwegs",
    outcome: "Ask for directions and check the right stop.",
    scene: "You are at a station and need the train to the city centre.",
    dialogue: [
      "Du: Entschuldigung, fährt diese Bahn zum Hauptbahnhof?",
      "Person: Nein, nehmen Sie die Linie zwei.",
      "Du: Wo muss ich umsteigen?",
      "Person: Am Rathaus.",
    ],
    pattern: "A question word comes first, then the conjugated verb.",
    examples: ["Wo muss ich umsteigen?", "Wann fährt die Bahn ab?"],
    words: [
      "umsteigen|to change trains|ich steige um",
      "die Haltestelle|stop|Plural: die Haltestellen",
      "der Hauptbahnhof|main station",
      "abfahren|to depart|die Bahn fährt ab",
      "die Verspätung|delay|Plural: die Verspätungen",
    ],
    gap: [
      "Wo ___ ich umsteigen? (müssen)",
      "muss",
      "modal-agreement",
      "Ich uses muss; umsteigen stays infinitive.",
    ],
    variation: ["Wann ___ du fahren? (müssen)", "musst"],
    reading: [
      "Die Linie zwei fährt zum Rathaus. Dort können Sie in die Linie vier umsteigen.",
      "Welche Linie nehmen Sie nach dem Umsteigen? (number)",
      "4|vier",
    ],
    listen: [
      "Die nächste Bahn fährt in zehn Minuten von Gleis drei ab.",
      "Von welchem Gleis? (number)",
      "3|drei",
    ],
    writing:
      "Ask whether this train goes to the main station and where you change.",
    model: "Fährt diese Bahn zum Hauptbahnhof? Wo muss ich umsteigen?",
    mission:
      "Be a passenger helping me reach a destination. Include a platform change and check whether I understood.",
  },
  {
    id: "training",
    title: "Find your words on the mat.",
    germanTitle: "Beim Training",
    outcome: "Ask a training partner to slow down and explain a movement.",
    scene: "You are practising a new technique with a partner.",
    dialogue: [
      "Du: Können wir das langsamer machen?",
      "Partner: Klar. Zuerst bewegen wir uns nach links.",
      "Du: Könnt ihr mir das noch einmal zeigen?",
      "Partner: Natürlich. Dann wechseln wir die Seite.",
    ],
    pattern: "Match the verb and reflexive pronoun to the person.",
    examples: ["Ich bewege mich.", "Ihr bewegt euch."],
    words: [
      "sich bewegen|to move|ich bewege mich · ihr bewegt euch",
      "zeigen|to show|ich zeige · ihr zeigt",
      "die Seite|side|Plural: die Seiten",
      "wechseln|to change / switch",
      "zuerst|first",
    ],
    gap: [
      "Ihr ___ euch nach links. (bewegen)",
      "bewegt",
      "present-ihr",
      "Ihr uses bewegt, with the pronoun euch.",
    ],
    variation: ["Ihr ___ euch auf das Training. (freuen)", "freut"],
    reading: [
      "Zuerst übt ihr langsam. Danach wechselt ihr die Seite.",
      "Was wechselt ihr danach?",
      "die Seite|Seite",
    ],
    listen: [
      "Bitte trainiert langsam. Wechselt nach zwei Minuten den Partner.",
      "Nach wie vielen Minuten wechselt ihr? (number)",
      "2|zwei",
    ],
    writing: "Ask your partner to demonstrate again and practise more slowly.",
    model: "Kannst du mir das noch einmal zeigen? Können wir langsamer üben?",
    mission:
      "Be a friendly training partner. Ask me to describe a movement with ich, then with ihr.",
  },
  {
    id: "market",
    title: "A familiar pattern, a different shop.",
    germanTitle: "Auf dem Markt",
    outcome: "Ask for a quantity and choose an alternative.",
    scene: "The market stall has no red apples left. Choose something else.",
    dialogue: [
      "Du: Ich hätte gern einen roten Apfel.",
      "Person: Wir haben nur grüne Äpfel.",
      "Du: Gut, dann nehme ich einen grünen Apfel.",
    ],
    pattern: "After einen, an adjective before a masculine noun ends in -en.",
    examples: ["Einen roten Apfel, bitte.", "Ich kaufe einen kleinen Kuchen."],
    words: [
      "rot|red",
      "grün|green",
      "das Kilo|kilogram|Plural: die Kilos",
      "frisch|fresh",
      "nehmen|to take|ich nehme · du nimmst",
    ],
    gap: [
      "Ich nehme einen ___ Apfel. (grün)",
      "grünen",
      "adjective-accusative",
      "After einen, the adjective ends in -en.",
    ],
    variation: ["Ich kaufe einen ___ Kuchen. (klein)", "kleinen"],
    reading: [
      "Ein Kilo Äpfel kostet drei Euro. Birnen kosten vier Euro pro Kilo.",
      "Was kostet weniger?",
      "Äpfel|die Äpfel",
    ],
    listen: [
      "Heute haben wir keine roten Äpfel, aber frische Birnen.",
      "Welches Obst ist verfügbar?",
      "Birnen|frische Birnen",
    ],
    writing: "Ask for a kilo of apples and accept a different colour.",
    model: "Ich hätte gern ein Kilo rote Äpfel. Grüne Äpfel sind auch gut.",
    mission:
      "Run a market stall. Offer an alternative and ask how much I want.",
  },
  {
    id: "reschedule",
    title: "Change the plan, keep it clear.",
    germanTitle: "Leider muss ich absagen",
    outcome: "Reschedule and give a short reason.",
    scene: "You cannot attend an appointment because you must work.",
    dialogue: [
      "Du: Ich muss den Termin leider verschieben.",
      "Person: Warum?",
      "Du: Weil ich arbeiten muss.",
      "Person: Passt Ihnen nächste Woche?",
    ],
    pattern: "After weil, the conjugated verb goes to the end.",
    examples: [
      "Ich sage ab, weil ich krank bin.",
      "Ich komme später, weil ich arbeiten muss.",
    ],
    words: [
      "absagen|to cancel|ich sage ab",
      "weil|because",
      "krank|ill",
      "nächste Woche|next week",
      "der Grund|reason|Plural: die Gründe",
    ],
    gap: [
      "Ich sage ab, weil ich krank ___.",
      "bin",
      "weil-verb-final",
      "The conjugated verb bin goes at the end of the weil clause.",
    ],
    variation: ["Ich komme später, weil ich arbeiten ___. (müssen)", "muss"],
    reading: [
      "Eva muss am Montag arbeiten. Sie verschiebt ihren Termin auf Donnerstag.",
      "Warum verschiebt Eva ihren Termin? Complete: Sie muss …",
      "arbeiten",
    ],
    listen: [
      "Ich kann morgen nicht kommen, weil ich krank bin. Können wir uns am Montag treffen?",
      "Warum kann die Person nicht kommen?",
      "krank|weil sie krank ist|sie ist krank",
    ],
    writing:
      "Write a short polite cancellation with a reason and a new suggestion.",
    model:
      "Leider kann ich morgen nicht kommen, weil ich arbeiten muss. Passt Ihnen Donnerstag?",
    mission:
      "Receive my cancellation, ask for a reason and help me choose a new time.",
  },
  {
    id: "parcel",
    title: "Ask for help with a small problem.",
    germanTitle: "Bei der Post",
    outcome: "Explain a missing parcel and ask what to do next.",
    scene: "A parcel has not arrived. Ask at the post office.",
    dialogue: [
      "Du: Mein Paket ist noch nicht angekommen.",
      "Person: Haben Sie die Sendungsnummer?",
      "Du: Ja, hier ist sie.",
      "Person: Das Paket kommt wahrscheinlich morgen.",
    ],
    pattern: "Ankommen uses sein in the Perfekt: ist angekommen.",
    examples: ["Das Paket ist angekommen.", "Ich habe die Nummer gefunden."],
    words: [
      "das Paket|parcel|Plural: die Pakete",
      "ankommen|to arrive|ist angekommen",
      "die Nummer|number|Plural: die Nummern",
      "wahrscheinlich|probably",
      "noch nicht|not yet",
    ],
    gap: [
      "Das Paket ___ angekommen.",
      "ist",
      "perfekt-auxiliary",
      "Ankommen uses sein: das Paket ist angekommen.",
    ],
    variation: ["Ich ___ die Nummer gefunden.", "habe"],
    reading: [
      "Das Paket sollte am Montag kommen. Heute ist Dienstag. Es ist noch nicht da.",
      "Ist das Paket angekommen? (ja/nein)",
      "nein",
    ],
    listen: [
      "Ihr Paket liegt seit Montag in der Filiale. Bringen Sie bitte Ihren Ausweis mit.",
      "Was sollen Sie mitbringen?",
      "Ausweis|den Ausweis|Ihren Ausweis",
    ],
    writing:
      "Explain that your parcel has not arrived and ask when it will come.",
    model: "Mein Paket ist noch nicht angekommen. Wann kommt es?",
    mission:
      "Be a post office employee. Ask for details and explain the next step.",
  },
  {
    id: "neighbour",
    title: "A quick chat by the door.",
    germanTitle: "Mit den Nachbarn",
    outcome: "Ask for help and explain who something belongs to.",
    scene: "A neighbour accepted a parcel for you. Thank them.",
    dialogue: [
      "Du: Haben Sie ein Paket für mich?",
      "Nachbar: Ja, ich habe es gestern angenommen.",
      "Du: Vielen Dank für Ihre Hilfe.",
      "Nachbar: Gern geschehen.",
    ],
    pattern: "Für always takes accusative. Mit always takes dative.",
    examples: [
      "Das ist für meinen Nachbarn.",
      "Ich spreche mit meinem Nachbarn.",
    ],
    words: [
      "der Nachbar|neighbour|Plural: die Nachbarn",
      "annehmen|to accept|hat angenommen",
      "helfen|to help|ich helfe · du hilfst",
      "gehören|to belong|das gehört mir",
      "gern geschehen|you are welcome",
    ],
    gap: [
      "Ich spreche mit ___ Nachbarn. (mein, singular)",
      "meinem",
      "dative-after-mit",
      "Mit takes dative: meinem Nachbarn.",
    ],
    variation: ["Das Paket ist für ___ Nachbarn. (mein, singular)", "meinen"],
    reading: [
      "Paul nimmt ein Paket für seine Nachbarin an. Sie holt es am Abend ab.",
      "Wann holt die Nachbarin das Paket ab?",
      "am Abend|Abend",
    ],
    listen: [
      "Ich bin heute bis sechs zu Hause. Sie können das Paket vorher abholen.",
      "Bis wie viel Uhr ist die Person zu Hause? (number)",
      "6|sechs",
    ],
    writing: "Thank a neighbour and ask when you can collect your parcel.",
    model: "Vielen Dank für Ihre Hilfe. Wann kann ich mein Paket abholen?",
    mission:
      "Be my neighbour. Arrange when I can collect a parcel and ask a small follow-up.",
  },
  {
    id: "day-out",
    title: "Tell the story in your own order.",
    germanTitle: "Ein Tag in der Stadt",
    outcome: "Connect events and explain what you enjoyed.",
    scene: "Tell a friend about a day in town.",
    dialogue: [
      "Du: Zuerst bin ich in die Stadt gefahren.",
      "Freund: Und dann?",
      "Du: Dann habe ich einen Freund getroffen.",
      "Freund: War es schön?",
      "Du: Ja, weil wir viel geredet haben.",
    ],
    pattern:
      "A time word can come first; the conjugated verb still comes second.",
    examples: [
      "Danach habe ich gegessen.",
      "Am Abend bin ich nach Hause gefahren.",
    ],
    words: [
      "dann|then",
      "getroffen|met|treffen → hat getroffen",
      "erzählen|to tell / recount",
      "geredet|talked|reden → hat geredet",
      "schön|nice / beautiful",
    ],
    gap: [
      "Danach ___ ich gegessen.",
      "habe",
      "main-clause-order",
      "The conjugated verb habe follows Danach.",
    ],
    variation: ["Am Abend ___ ich nach Hause gefahren.", "bin"],
    reading: [
      "Zuerst fährt Omar in die Stadt. Dann trifft er Ana. Danach essen sie zusammen.",
      "Was machen sie nach dem Treffen?",
      "essen|sie essen|sie essen zusammen",
    ],
    listen: [
      "Zuerst waren wir im Park. Danach haben wir im Café einen Tee getrunken.",
      "Wo waren sie zuerst?",
      "im Park|Park",
    ],
    writing:
      "Write three connected sentences about a day, using zuerst, dann and danach.",
    model:
      "Zuerst bin ich in die Stadt gefahren. Dann habe ich einen Freund getroffen. Danach haben wir gegessen.",
    mission:
      "Ask me to tell a short story. Prompt with Und dann? and ask why I enjoyed something.",
  },
  {
    id: "repair-week",
    title: "Bring it together. See what stays.",
    germanTitle: "Ein neuer Versuch",
    outcome: "Use familiar patterns in a fresh situation.",
    scene:
      "You meet a friend, change a plan and buy a snack. Try without the examples first.",
    dialogue: [
      "Du: Können wir uns morgen treffen?",
      "Freund: Ja. Was möchtest du machen?",
      "Du: Ich möchte einen Spaziergang machen und danach etwas essen.",
    ],
    pattern:
      "This is a practice check. Use feedback to choose what to revisit next.",
    examples: [
      "Ich möchte einen Spaziergang machen.",
      "Wir treffen uns, weil wir zusammen lernen wollen.",
    ],
    words: [
      "der Spaziergang|walk|Plural: die Spaziergänge",
      "etwas|something",
      "sich entscheiden|to decide|ich entscheide mich",
      "lieber|rather / prefer",
      "noch einmal|once more",
    ],
    gap: [
      "Ihr ___ heute zusammen. (lernen)",
      "lernt",
      "present-ihr",
      "Ihr takes -t: lernt.",
    ],
    variation: ["Ich bleibe zu Hause, weil ich müde ___.", "bin"],
    reading: [
      "Sam möchte spazieren gehen. Kim hat erst am Abend Zeit. Sie treffen sich um sieben.",
      "Wann treffen sie sich?",
      "um sieben|sieben|7",
    ],
    listen: [
      "Wir treffen uns nicht im Café, sondern vor der Bibliothek. Bitte komm um acht.",
      "Wo treffen sie sich?",
      "vor der Bibliothek|Bibliothek",
    ],
    writing:
      "Suggest a plan, give a reason and explain one thing you did yesterday.",
    model:
      "Wollen wir morgen lernen? Ich möchte üben, weil ich bald eine Prüfung habe. Gestern habe ich einen Text gelesen.",
    mission:
      "Combine a shop, an appointment and a friendly chat. Use new details and record where I needed support.",
  },
];
export const lessons: Lesson[] = seeds.map((s) => {
  const ex = (
    id: string,
    skill: Exercise["skill"],
    prompt: string,
    answers: string,
    target: string,
    extra: Partial<Exercise> = {},
  ): Exercise => ({
    id: `${s.id}-${id}`,
    version: 1,
    skill,
    prompt,
    answer: answers.split("|"),
    target,
    explanation: s.gap[3],
    hint: s.pattern,
    ...extra,
  });
  return {
    id: s.id,
    version: 1,
    title: s.title,
    germanTitle: s.germanTitle,
    outcome: s.outcome,
    scene: s.scene,
    dialogue: s.dialogue,
    pattern: s.pattern,
    examples: s.examples,
    words: s.words.map((w) => {
      const [german, english, note] = w.split("|");
      return { german, english, note };
    }),
    exercises: [
      ex("gap", "grammar", s.gap[0], s.gap[1], s.gap[2]),
      ex("variation", "grammar", s.variation[0], s.variation[1], s.gap[2], {
        fresh: true,
        transfer: true,
      }),
      ex("read", "reading", s.reading[1], s.reading[2], `reading-${s.id}`, {
        context: s.reading[0],
        explanation:
          "Compare your answer with the information in the short text.",
        hint: "Find the sentence that answers the question.",
      }),
      ex("listen", "listening", s.listen[1], s.listen[2], `listening-${s.id}`, {
        audio: `/audio/${s.id}.mp3`,
        transcript: s.listen[0],
        explanation: "The answer comes from the recording.",
        hint: "Listen again for the requested detail.",
      }),
      ex("write", "writing", s.writing, "", `writing-${s.id}`, {
        kind: "open",
        model: s.model,
        explanation:
          "Compare the meaning and pattern with this example. Other correct answers are possible.",
        hint: s.pattern,
      }),
    ],
    mission: s.mission,
  };
});
