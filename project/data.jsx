// data.jsx — content for Giuggiola's Think
// Italian copy: reflective, authentic, written as a real person.

const ARTICLES = [
  {
    id: "il-silenzio-che-cura",
    kicker: "Diario",
    title: "Il silenzio che cura",
    date: "12 maggio 2026",
    read: "5 min",
    preview:
      "Ho imparato che a volte la cosa più terapeutica non è dire qualcosa, ma restare. Stare nello stesso spazio di un'altra persona senza riempire ogni vuoto.",
    body: [
      "C'è una cosa che nessun manuale ti insegna davvero, e che ho capito solo stando seduta accanto alle persone: il silenzio non è assenza. È una presenza piena, a volte più eloquente di qualsiasi parola.",
      "Durante il tirocinio ho passato un pomeriggio intero con un ragazzo che non voleva parlare. All'inizio mi sentivo inutile, come se non stessi facendo il mio lavoro. Poi ho capito che il mio lavoro, quel giorno, era esattamente quello: esserci senza pretendere nulla.",
      "Restare è una forma di rispetto. Vuol dire dire all'altro: non ho fretta che tu guarisca per farmi sentire brava. Sono qui, e basta.",
      "Da allora ho smesso di avere paura delle pause. Le accolgo. Le lascio respirare. E mi sono accorta che spesso, dopo un lungo silenzio condiviso, arrivano le parole più vere.",
      "Forse curare non significa riempire i vuoti dell'altro, ma imparare ad abitarli insieme, senza scappare.",
    ],
  },
  {
    id: "imparare-ad-ascoltare",
    kicker: "Riflessioni",
    title: "Imparare ad ascoltare per davvero",
    date: "28 aprile 2026",
    read: "6 min",
    preview:
      "Ascoltare non è aspettare il proprio turno per parlare. È una disciplina, quasi una forma di amore. E come ogni cosa che conta, va allenata ogni giorno.",
    body: [
      "Per molto tempo ho creduto di saper ascoltare. In realtà aspettavo. Aspettavo che l'altro finisse per poter dire la mia, per consolare, per risolvere. Ascoltare per davvero è un'altra cosa.",
      "Significa lasciare che la storia dell'altro entri senza correggerla, senza incasellarla in una diagnosi prima del tempo. Significa fare spazio.",
      "Nel percorso che sto facciando — sto diventando Tecnico della Riabilitazione Psichiatrica — questa è forse la lezione più importante. Le persone non hanno bisogno che qualcuno aggiusti la loro vita. Hanno bisogno di essere viste.",
      "Ascoltare è lento. Non produce risultati immediati, non sta bene nelle statistiche. Ma è da lì che parte tutto il resto.",
    ],
  },
  {
    id: "la-mente-come-casa",
    kicker: "Pensieri",
    title: "La mente come una casa da riabitare",
    date: "9 aprile 2026",
    read: "4 min",
    preview:
      "Mi piace pensare alla riabilitazione non come a un riparare ciò che è rotto, ma come al tornare ad abitare stanze che avevamo chiuso.",
    body: [
      "Riabilitare. La parola contiene già tutto: rendere di nuovo abile, ma anche, se ascolti bene, rendere di nuovo abitabile.",
      "Mi piace immaginare la mente come una casa. A volte, dopo un dolore, chiudiamo delle stanze. Mettiamo i lenzuoli sui mobili, abbassiamo le tapparelle. Non perché quelle stanze siano rotte, ma perché entrarci fa male.",
      "Il lavoro che vorrei fare non è demolire e ricostruire da zero. È aprire piano una finestra, fare entrare un po' di luce, e aspettare che la persona scelga da sé quando tornare ad abitare.",
      "Nessuno ti riabita la casa al posto tuo. Ma qualcuno può tenerti la mano mentre riapri la porta.",
    ],
  },
  {
    id: "quaderni-e-paure",
    kicker: "Diario",
    title: "I quaderni dove metto le paure",
    date: "22 marzo 2026",
    read: "3 min",
    preview:
      "Scrivo da quando ero bambina. Non per diventare scrittrice, ma per non sentirmi sola dentro la mia testa. La scrittura è stata la mia prima forma di cura.",
    body: [
      "Ho una scatola piena di quaderni. Alcuni sono di quando avevo otto anni, con la grafia tonda e gli errori. Li tengo tutti.",
      "Per anni ho scritto di nascosto, convinta che fossero solo sfoghi. Oggi capisco che erano molto di più: erano il mio modo di mettere ordine nel caos, di trasformare le paure in qualcosa che potevo guardare da fuori.",
      "Quando scrivi una paura, smette di essere padrona di te. Diventa una frase. E una frase la puoi rileggere, correggere, capire.",
      "È anche per questo che ho deciso di pubblicare. Non perché abbia risposte, ma perché credo che condividere la propria fragilità, con cura, possa fare spazio anche a quella degli altri.",
    ],
  },
  {
    id: "le-giornate-storte",
    kicker: "Riflessioni",
    title: "Cosa faccio nelle giornate storte",
    date: "5 marzo 2026",
    read: "4 min",
    preview:
      "Non ho una formula. Ma ho imparato qualche piccolo gesto che, nei giorni in cui tutto pesa, mi riporta a galla senza fingere che vada tutto bene.",
    body: [
      "Le giornate storte esistono anche per chi studia come stare accanto al dolore degli altri. Anzi, forse esistono di più.",
      "Non credo nelle frasi motivazionali. Credo nei gesti piccoli: aprire la finestra, bere un bicchiere d'acqua lentamente, scrivere una riga anche brutta, chiamare una persona senza un motivo.",
      "Mi sono data il permesso di non stare sempre bene. È strano, ma è stato un sollievo. La calma non è non avere onde, è imparare a non annegare quando arrivano.",
      "Se oggi è una giornata storta anche per te, va bene così. Non devi sistemarla tutta. Devi solo attraversarla.",
    ],
  },
];

const BOOKS = [
  {
    id: "le-stanze-chiuse",
    title: "Le stanze chiuse",
    genre: "Narrativa",
    price: "8,90",
    accent: "#1B3B6F",
    blurb:
      "Un romanzo breve su una giovane donna che torna nella casa d'infanzia e, stanza dopo stanza, ritrova le parti di sé che aveva imparato a non guardare.",
    pages: "164 pagine",
  },
  {
    id: "appunti-di-cura",
    title: "Appunti di cura",
    genre: "Saggio personale",
    price: "6,50",
    accent: "#2E5A9E",
    blurb:
      "Una raccolta di riflessioni nate durante il percorso in riabilitazione psichiatrica. Sul silenzio, sull'ascolto, sul restare. Da leggere lentamente.",
    pages: "98 pagine",
  },
  {
    id: "il-giardino-sottovetro",
    title: "Il giardino sottovetro",
    genre: "Fantastico",
    price: "9,90",
    accent: "#14305C",
    blurb:
      "In una città dove i sentimenti vengono coltivati come piante rare, una ragazza scopre di custodire un seme che nessuno è mai riuscito a far germogliare.",
    pages: "212 pagine",
  },
];

window.SITE_DATA = { ARTICLES, BOOKS };
