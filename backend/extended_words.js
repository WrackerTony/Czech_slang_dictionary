// Rozšířená data slov pro slovník nespisovné češtiny
// Použití: Zkopírujte tato slova do sampleWords v seed.js

const extendedWords = [
  // Pozdravy a základní komunikace
  {
    slang_word: 'čau',
    standard_word: 'ahoj',
    word_type: 'slovo',
    grammatical_info: 'citsl. neskl.',
    genitive_form: '',
    meaning: 'neformální pozdrav při setkání i rozloučení',
    examples: 'Čau, jak se máš?; Čau, musím běžet',
    diminutives: '',
    adjectives: '',
    category: 'pozdravy'
  },
  {
    slang_word: 'nazdar',
    standard_word: 'na shledanou',
    word_type: 'slovo',
    grammatical_info: 'citsl. neskl.',
    genitive_form: '',
    meaning: 'hovorový pozdrav, zejména při rozloučení',
    examples: 'Nazdar, měj se!; Nazdar kamaráde',
    diminutives: '',
    adjectives: '',
    category: 'pozdravy'
  },

  // Jídlo a pití
  {
    slang_word: 'kafe',
    standard_word: 'káva',
    word_type: 'slovo',
    grammatical_info: '-a s.',
    genitive_form: 'kafe',
    meaning: 'káva, kávový nápoj',
    examples: 'Dáš si kafe?; Jít na kafe; Tady dělají dobré kafe',
    diminutives: 'kafíčko',
    adjectives: 'kafový',
    category: 'jídlo a pití'
  },
  {
    slang_word: 'pivo',
    standard_word: 'pivo',
    word_type: 'slovo',
    grammatical_info: '-a s.',
    genitive_form: 'piva',
    meaning: 'pivní nápoj (i ve spisovné češtině, ale používá se hovorově)',
    examples: 'jít na pivo; dát si p.; točené p.',
    diminutives: 'pivko, pivíčko',
    adjectives: 'pivní: p-í sklep; p-í zahrada',
    category: 'jídlo a pití'
  },

  // Osoby a vztahy
  {
    slang_word: 'kámoš',
    standard_word: 'kamarád',
    word_type: 'slovo',
    grammatical_info: '-e m.',
    genitive_form: 'kámoše',
    meaning: 'kamarád, přítel, dobrý známý',
    examples: 'Jde se mnou kámoš; Potkal jsem starého kámoše',
    diminutives: 'kámošek',
    adjectives: 'kámošský',
    category: 'vztahy'
  },
  {
    slang_word: 'brácha',
    standard_word: 'bratr',
    word_type: 'slovo',
    grammatical_info: '-y m.',
    genitive_form: 'bráchy',
    meaning: 'bratr, bratrský příbuzný',
    examples: 'Můj brácha je starší; Kde je tvůj brácha?',
    diminutives: 'bráška, bráško',
    adjectives: '',
    category: 'rodina'
  },
  {
    slang_word: 'borec',
    standard_word: 'schopný člověk',
    word_type: 'slovo',
    grammatical_info: '-rce m.',
    genitive_form: 'borce',
    meaning: 'schopný, odvážný nebo zkušený muž; expert',
    examples: 'Ten borec umí všechno; Fakt dobrý borec',
    diminutives: '',
    adjectives: 'borecký',
    category: 'osoby'
  },

  // Technologie
  {
    slang_word: 'kompl',
    standard_word: 'počítač',
    word_type: 'slovo',
    grammatical_info: '-u m.',
    genitive_form: 'komplu',
    meaning: 'počítač, výpočetní technika',
    examples: 'Sedět u komplu; Koupit nový kompl',
    diminutives: '',
    adjectives: 'komplový',
    category: 'technologie'
  },
  {
    slang_word: 'net',
    standard_word: 'internet',
    word_type: 'slovo',
    grammatical_info: '-u m.',
    genitive_form: 'netu',
    meaning: 'internet, světová počítačová síť',
    examples: 'Hledat na netu; Funguje ti net?',
    diminutives: '',
    adjectives: 'netový',
    category: 'technologie'
  },

  // Škola
  {
    slang_word: 'matika',
    standard_word: 'matematika',
    word_type: 'slovo',
    grammatical_info: '-y ž.',
    genitive_form: 'matiky',
    meaning: 'matematika jako předmět',
    examples: 'Mám zkoušku z matiky; Matika je těžká',
    diminutives: '',
    adjectives: 'matikový',
    category: 'škola'
  },
  {
    slang_word: 'fyzika',
    standard_word: 'fyzika',
    word_type: 'slovo',
    grammatical_info: '-y ž.',
    genitive_form: 'fyziky',
    meaning: 'fyzika jako předmět (hovorově zkráceno)',
    examples: 'Učit se fyziku; Test z fyziky',
    diminutives: '',
    adjectives: 'fyzikální',
    category: 'škola'
  },

  // Finance
  {
    slang_word: 'prachy',
    standard_word: 'peníze',
    word_type: 'slovo',
    grammatical_info: '-ů m. mn.',
    genitive_form: 'prachů',
    meaning: 'peníze, hotovost',
    examples: 'Nemám prachy; Vydělat prachy; Půjčit prachy',
    diminutives: '',
    adjectives: '',
    category: 'finance'
  },
  {
    slang_word: 'pracha',
    standard_word: 'peníze',
    word_type: 'slovo',
    grammatical_info: '-y ž.',
    genitive_form: 'prachy',
    meaning: 'peníze, hotovost (jednotné číslo)',
    examples: 'Máš nějakou prachu?; Dát prachu',
    diminutives: '',
    adjectives: '',
    category: 'finance'
  },

  // Doprava
  {
    slang_word: 'tramvaj',
    standard_word: 'tramvaj',
    word_type: 'slovo',
    grammatical_info: '-e ž.',
    genitive_form: 'tramvaje',
    meaning: 'elektrická kolejová doprava v ulicích',
    examples: 'jet tramvají; čekat na tramvaj',
    diminutives: 'tramvajka',
    adjectives: 'tramvajový: t-á trať',
    category: 'doprava'
  },

  // Bydlení
  {
    slang_word: 'barák',
    standard_word: 'dům',
    word_type: 'slovo',
    grammatical_info: '-u m.',
    genitive_form: 'baráku',
    meaning: 'dům, budova k bydlení',
    examples: 'starý b.; postavit b.; bydlet v baráku',
    diminutives: 'baráček, baranda',
    adjectives: 'barákový',
    category: 'bydlení'
  },

  // Modernější slang - Gaming
  {
    slang_word: 'noob',
    standard_word: 'začátečník',
    word_type: 'slovo',
    grammatical_info: '-a m.',
    genitive_form: 'nooba',
    meaning: 'začátečník, nezkušený hráč (z anglického newbie)',
    examples: 'Ten noob nic neumí; Jsem v tom ještě noob',
    diminutives: '',
    adjectives: 'noobský',
    category: 'gaming'
  },
  {
    slang_word: 'GG',
    standard_word: 'dobrá hra',
    word_type: 'zkratka',
    grammatical_info: 'zkr.',
    genitive_form: '',
    meaning: 'good game, vyjádření uznání po skončení hry',
    examples: 'GG, bylo to těsný; GG všem',
    diminutives: '',
    adjectives: '',
    category: 'gaming'
  },

  // Social media
  {
    slang_word: 'story',
    standard_word: 'příběh',
    word_type: 'slovo',
    grammatical_info: 'ž. neskl.',
    genitive_form: '',
    meaning: 'příspěvek na sociálních sítích, který zmizí po 24 hodinách',
    examples: 'Dát story; Viděl jsi tu story?; Mít to ve story',
    diminutives: '',
    adjectives: '',
    category: 'sociální sítě'
  },
  {
    slang_word: 'vibe',
    standard_word: 'nálada',
    word_type: 'slovo',
    grammatical_info: '-u m.',
    genitive_form: 'vibu',
    meaning: 'atmosféra, nálada, pocit z něčeho',
    examples: 'Dobrý vibe; Summer vibe; Mít stejný vibe',
    diminutives: '',
    adjectives: 'vibový',
    category: 'nálada'
  },

  // Hodnocení
  {
    slang_word: 'cool',
    standard_word: 'skvělý',
    word_type: 'slovo',
    grammatical_info: 'příd. neskl.',
    genitive_form: '',
    meaning: 'skvělý, super, v pohodě',
    examples: 'To je cool; Cool nápad; Být cool',
    diminutives: '',
    adjectives: '',
    category: 'hodnocení'
  },
  {
    slang_word: 'sick',
    standard_word: 'úžasný',
    word_type: 'slovo',
    grammatical_info: 'příd. neskl.',
    genitive_form: '',
    meaning: 'úžasný, neuvěřitelný (pozitivně)',
    examples: 'To je sick; Sick výkon',
    diminutives: '',
    adjectives: '',
    category: 'hodnocení'
  }
];

module.exports = extendedWords;
