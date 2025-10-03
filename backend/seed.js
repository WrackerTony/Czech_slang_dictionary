const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize database
const dbPath = path.join(__dirname, 'slang_dictionary.db');
const db = new sqlite3.Database(dbPath);

// Create table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slang_word TEXT UNIQUE NOT NULL,
      standard_word TEXT NOT NULL,
      word_type TEXT NOT NULL DEFAULT 'slovo',
      grammatical_info TEXT,
      genitive_form TEXT,
      meaning TEXT NOT NULL,
      examples TEXT,
      diminutives TEXT,
      adjectives TEXT,
      category TEXT DEFAULT 'obecné',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

console.log('Clearing existing data and seeding database with new slang words...');

// Clear existing data
db.run('DELETE FROM words', (err) => {
  if (err) {
    console.error('Error clearing database:', err);
    return;
  }
  console.log('Database cleared successfully.');
});

// Sample data
const sampleWords = [
  {
    slang_word: 'skibidi',
    standard_word: 'skibidi',
    word_type: 'slovo',
    grammatical_info: 'přísl. neskl.',
    genitive_form: '',
    meaning: 'odkaz na Skibidi Toilet sérii, virální videa od DaFuq!?Boom!, používá se jako vtipná narážka, reakce na něco šíleného nebo absurdního',
    examples: 'Ten tvůj plán je úplně skibidi, ale možná by mohl fungovat!; Tohle video je tak skibidi, že už ani nevím, co je realita.',
    diminutives: '',
    adjectives: 'skibidi příd. neskl.: s. styl; s. tance',
    category: 'internetové trendy'
  },
  {
    slang_word: 'sigma',
    standard_word: 'samotářský vlk',
    word_type: 'slovo',
    grammatical_info: '-y m.',
    genitive_form: 'sigmy',
    meaning: 'někdo, kdo je „osamělý vlk", neřídí se pravidly společnosti a je nezávislý, často se používá ironicky',
    examples: 'Ten borec si šel koupit burger místo rande? Totální sigma move!; On je takovej sigma; Být sigma',
    diminutives: '',
    adjectives: 'sigma příd. neskl.: s. osobnost; s. mentalita',
    category: 'osobnostní typy'
  },
  {
    slang_word: 'goofy',
    standard_word: 'hloupý',
    word_type: 'slovo',
    grammatical_info: 'příd. neskl.',
    genitive_form: '',
    meaning: 'hloupý, divný, vtipný; používá se pro něco absurdního nebo komického',
    examples: 'Tohle video je úplně goofy, ale nemůžu se přestat smát!; Dělat goofy věci; Goofy nápad',
    diminutives: '',
    adjectives: '',
    category: 'popis vlastností'
  },
  {
    slang_word: 'rizz',
    standard_word: 'charisma',
    word_type: 'slovo',
    grammatical_info: '-u m.',
    genitive_form: 'rizzu',
    meaning: 'charisma nebo schopnost někoho okouzlit, často v romantickém kontextu; odvozeno z anglického "charisma"',
    examples: 'On má fakt mega rizz, všechny holky po něm jdou!; Mít rizz; Použít svůj rizz',
    diminutives: '',
    adjectives: 'rizzovitý příd.: r-á energie; r-é chování',
    category: 'osobnostní vlastnosti'
  },
  {
    slang_word: 'drippy',
    standard_word: 'stylový',
    word_type: 'slovo',
    grammatical_info: 'příd. neskl.',
    genitive_form: '',
    meaning: 'stylový, módní; někdo, kdo má dobré oblečení nebo vypadá dobře',
    examples: 'Ty tvoje boty jsou fakt drippy, kde jsi je sehnal?; Drippy outfit; Vypadat drippy',
    diminutives: '',
    adjectives: '',
    category: 'mód a vzhled'
  },
  {
    slang_word: 'GM',
    standard_word: 'dobré ráno',
    word_type: 'zkratka',
    grammatical_info: 'zkr.',
    genitive_form: '',
    meaning: 'good morning, pozdrav na začátek dne, často používaný na Snapchatu',
    examples: 'GM bro, jak se spalo?',
    diminutives: '',
    adjectives: '',
    category: 'pozdravy'
  },
  {
    slang_word: 'GN',
    standard_word: 'dobrou noc',
    word_type: 'zkratka',
    grammatical_info: 'zkr.',
    genitive_form: '',
    meaning: 'good night, pozdrav na konec dne, často používaný na Snapchatu',
    examples: 'GN všem, jdu spát',
    diminutives: '',
    adjectives: '',
    category: 'pozdravy'
  },
  {
    slang_word: 'OGN',
    standard_word: 'opožděně dobrou noc',
    word_type: 'zkratka',
    grammatical_info: 'zkr.',
    genitive_form: '',
    meaning: 'opožděně good night, kombinace angličtiny, češtiny a zkratek, pozdrav na konec dne s opožděním',
    examples: 'OGN, omlouvám se za pozdní odpověď',
    diminutives: '',
    adjectives: '',
    category: 'pozdravy'
  },
  {
    slang_word: 'crushovat',
    standard_word: 'být zamilovaný',
    word_type: 'slovo',
    grammatical_info: 'sl. nedok.',
    genitive_form: '',
    meaning: 'mít na někoho crush, být do někoho zakoukaný, tajně se do někoho zamilovat',
    examples: 'Úplně crushuji na toho kluka z matiky; Ona na něj crushuje už půl roku; Přestaň crushovat a řekni mu to',
    diminutives: '',
    adjectives: 'crushový příd.: c-á láska; c-é city',
    category: 'city a vztahy'
  },
  {
    slang_word: 'Z5',
    standard_word: 'zpět',
    word_type: 'zkratka',
    grammatical_info: 'zkr.',
    genitive_form: '',
    meaning: 'zpět, zkratka fungující na principu české výslovnosti',
    examples: 'Z5 za 5 minut; Jsem Z5',
    diminutives: '',
    adjectives: '',
    category: 'zkratky'
  },
  {
    slang_word: 'sus',
    standard_word: 'podezřelý',
    word_type: 'slovo',
    grammatical_info: 'příd. neskl.',
    genitive_form: '',
    meaning: 'podezřelý, nápadný; z anglického "suspicious", pochází z hry Among Us',
    examples: 'To je ale sus chování; Ten týpek je úplně sus; Působíš sus',
    diminutives: '',
    adjectives: '',
    category: 'hra a internet'
  },
  {
    slang_word: 'BF',
    standard_word: 'přítel',
    word_type: 'zkratka',
    grammatical_info: 'zkr.',
    genitive_form: '',
    meaning: 'boyfriend, přítel v romantickém slova smyslu',
    examples: 'Můj BF mi koupil dárek; Kde je tvůj BF?',
    diminutives: '',
    adjectives: '',
    category: 'vztahy'
  },
  {
    slang_word: 'GF',
    standard_word: 'přítelkyně',
    word_type: 'zkratka',
    grammatical_info: 'zkr.',
    genitive_form: '',
    meaning: 'girlfriend, přítelkyně v romantickém slova smyslu',
    examples: 'Mám novou GF; Jeho GF je super',
    diminutives: '',
    adjectives: '',
    category: 'vztahy'
  },
  {
    slang_word: 'CF',
    standard_word: 'blízcí přátelé',
    word_type: 'zkratka',
    grammatical_info: 'zkr.',
    genitive_form: '',
    meaning: 'close friends, blízcí přátelé',
    examples: 'Jsi v mých CF na Snapu; Přidám tě do CF',
    diminutives: '',
    adjectives: '',
    category: 'vztahy'
  },
  {
    slang_word: 'fílovat',
    standard_word: 'mít pocit',
    word_type: 'slovo',
    grammatical_info: 'sl. nedok.',
    genitive_form: '',
    meaning: 'mít z něčeho dobrý pocit, chtít to udělat, mít to rád; z anglického "feel"',
    examples: 'Fíluji ten song; Dneska to nefíluji; Úplně fíluji tuhle atmosféru; Fíluješ to?',
    diminutives: '',
    adjectives: 'fílový příd.: f-á nálada',
    category: 'city'
  },
  {
    slang_word: 'cringe',
    standard_word: 'trapas',
    word_type: 'slovo',
    grammatical_info: '-u m.',
    genitive_form: 'cringu',
    meaning: 'něco extrémně trapného, kýčovitého, přitaženého za vlasy; z anglického "cringe"',
    examples: 'To je takový cringe; Dělá mi to cringe; Úplný cringe moment',
    diminutives: '',
    adjectives: 'cringeový příd.: c-á situace; c-é video',
    category: 'hodnocení'
  },
  {
    slang_word: 'doomer',
    standard_word: 'pesimista',
    word_type: 'slovo',
    grammatical_info: '-a m.',
    genitive_form: 'doomera',
    meaning: 'novodobý nihilista, pesimista; člověk kolem 30 let s rezignovaným přístupem k životu',
    examples: 'Je to klasický doomer; Doomer mindset; Chovat se jako doomer',
    diminutives: '',
    adjectives: 'doomerský příd.: d-á nálada; d-ý světonázor',
    category: 'osobnostní typy'
  },
  {
    slang_word: 'tryhardit',
    standard_word: 'příliš se snažit',
    word_type: 'slovo',
    grammatical_info: 'sl. nedok.',
    genitive_form: '',
    meaning: 'usilovně se snažit, přehnaně se snažit; něco extrémně hrotit; z anglického "try hard"',
    examples: 'Netryhard to tak; Úplně tryhardí tu hru; Přestaň tryhardit',
    diminutives: '',
    adjectives: 'tryhardový příd.: t-ý přístup',
    category: 'chování'
  },
  {
    slang_word: 'SNS',
    standard_word: 'je mi líto, že mi to není líto',
    word_type: 'zkratka',
    grammatical_info: 'zkr.',
    genitive_form: '',
    meaning: 'sorry not sorry, sarkastický výraz pro nesouhlas s něčím cizím',
    examples: 'SNS ale tohle mi nepřijde vtipný.',
    diminutives: '',
    adjectives: '',
    category: 'sarkasmus'
  },
  {
    slang_word: 'TBH',
    standard_word: 'abych byl upřímný',
    word_type: 'zkratka',
    grammatical_info: 'zkr.',
    genitive_form: '',
    meaning: 'to be honest, abych byl upřímný, úvod k upřímnému názoru',
    examples: 'TBH, tohle se mi moc nelíbí; TBH je to dobrý',
    diminutives: '',
    adjectives: '',
    category: 'upřímnost'
  },
  {
    slang_word: 'NGL',
    standard_word: 'nebudu lhát',
    word_type: 'zkratka',
    grammatical_info: 'zkr.',
    genitive_form: '',
    meaning: 'not gonna lie, nebudu lhát, úvod k upřímnému názoru',
    examples: 'NGL, je to celkem good; NGL, čekal jsem víc',
    diminutives: '',
    adjectives: '',
    category: 'upřímnost'
  },
  {
    slang_word: 'týpek',
    standard_word: 'muž',
    word_type: 'slovo',
    grammatical_info: '-pka m.',
    genitive_form: 'týpka',
    meaning: 'muž, chlap, kluk; hovorové označení pro mužskou osobu',
    examples: 'Nějakej týpek se mě ptal na cestu; Kdo je ten týpek?; Znáš toho týpka?',
    diminutives: 'týpeček',
    adjectives: '',
    category: 'osoby'
  },
  {
    slang_word: 'týpka',
    standard_word: 'žena',
    word_type: 'slovo',
    grammatical_info: '-y ž.',
    genitive_form: 'týpky',
    meaning: 'žena, holka, dívka; hovorové označení pro ženskou osobu',
    examples: 'Viděl jsi tu týpku?; Nějaká týpka mi napsala; S tou týpkou jsem mluvil',
    diminutives: 'týpečka',
    adjectives: '',
    category: 'osoby'
  },
  {
    slang_word: 'flexit',
    standard_word: 'chlubit se',
    word_type: 'slovo',
    grammatical_info: 'sl. nedok.',
    genitive_form: '',
    meaning: 'ukazovat se, předvádět se, chlubit se; z anglického "flex"',
    examples: 'Přestaň flexitit s tou bundou; Flexí se svými botama; Flexit svým autem',
    diminutives: '',
    adjectives: 'flexový příd.: f-é chování',
    category: 'chování'
  },
  {
    slang_word: 'buchta',
    standard_word: 'atraktivní dívka',
    word_type: 'slovo',
    grammatical_info: '-y ž.',
    genitive_form: 'buchty',
    meaning: 'atraktivní dívka, sexy žena; slangové označení pro hezkou dívku',
    examples: 'Ta buchta je fakt hezká; Viděl jsi tu buchtu?; Jít s buchtou na kafe',
    diminutives: 'buchtička',
    adjectives: '',
    category: 'osoby'
  },
  {
    slang_word: 'Kost',
    standard_word: 'hezká holka',
    word_type: 'slovo',
    grammatical_info: '-i ž.',
    genitive_form: 'Kosti',
    meaning: 'hezká holka, sexy dívka; slangové označení pro atraktivní ženu',
    examples: 'Ta Kost je fakt sexy; Viděl jsi tu Kost na party?',
    diminutives: '',
    adjectives: '',
    category: 'osoby'
  },
  {
    slang_word: 'Kočka',
    standard_word: 'hezká holka',
    word_type: 'slovo',
    grammatical_info: '-y ž.',
    genitive_form: 'Kočky',
    meaning: 'hezká holka, sexy dívka; běžně používané hovorově',
    examples: 'Ta Kočka je dneska fakt cute; Viděl jsi tu Kočku u nás ve škole?',
    diminutives: '',
    adjectives: '',
    category: 'osoby'
  },
  {
    slang_word: 'Žabka',
    standard_word: 'hezká holka',
    word_type: 'slovo',
    grammatical_info: '-y ž.',
    genitive_form: 'Žabky',
    meaning: 'hezká holka, sexy dívka; slangový výraz',
    examples: 'Ta Žabka je úplně boží; Viděl jsi tu Žabku na fotce?',
    diminutives: '',
    adjectives: '',
    category: 'osoby'
  },
  {
    slang_word: 'boot',
    standard_word: 'nastartovat operační systém / naskočit na hru',
    word_type: 'slovo',
    grammatical_info: 'sl. nedok.',
    genitive_form: '',
    meaning: 'spustit počítač, hru nebo program; z anglického "boot"',
    examples: 'Musím nejdřív bootnout počítač; Bootni hru a jdeme hrát',
    diminutives: '',
    adjectives: '',
    category: 'technologie a hry'
  },
  {
    slang_word: 'broskvička',
    standard_word: 'hezkej zadek',
    word_type: 'slovo',
    grammatical_info: '-y ž.',
    genitive_form: 'broskvičky',
    meaning: 'hezkej zadek, sexy pozadí',
    examples: 'Ta holka má fakt broskvičku; Jdu se kouknout na její broskvičku',
    diminutives: '',
    adjectives: '',
    category: 'osoby'
  },
  {
    slang_word: 'melouny',
    standard_word: 'velká prsa',
    word_type: 'slovo',
    grammatical_info: '-ů ž.',
    genitive_form: 'melounů',
    meaning: 'velká prsa, slangové označení pro ženský poprsí',
    examples: 'Ta holka má mega melouny; Obdivoval jsem její melouny',
    diminutives: '',
    adjectives: '',
    category: 'osoby'
  },
  {
    slang_word: 'kozy',
    standard_word: 'prsa',
    word_type: 'slovo',
    grammatical_info: '-ů ž.',
    genitive_form: 'koz',
    meaning: 'prsa, slangové označení ženského poprsí',
    examples: 'Viděl jsi ty kozy?; Ty kozy jsou fakt velký',
    diminutives: '',
    adjectives: '',
    category: 'osoby'
  },
  {
    slang_word: 'letiště',
    standard_word: 'hezká holka, na kterou bys „naletel“',
    word_type: 'slovo',
    grammatical_info: '-a ž.',
    genitive_form: 'letištěte',
    meaning: 'hezká holka, slangově někdo atraktivní, na koho bys „naletel“ jako letadlo',
    examples: 'Ta holka je úplný letiště; Nalítil jsem na letiště',
    diminutives: '',
    adjectives: '',
    category: 'osoby'
  },
  {
    slang_word: 'liliput',
    standard_word: 'malý člověk',
    word_type: 'slovo',
    grammatical_info: '-a m.',
    genitive_form: 'liliputa',
    meaning: 'malý člověk, nízký vzrůstem; slangové označení pro menší osobu',
    examples: 'Ten týpek je fakt liliput; Viděl jsi toho liliputa?',
    diminutives: '',
    adjectives: '',
    category: 'osoby'
  }


];

// Insert sample data after clearing
setTimeout(() => {
  const stmt = db.prepare('INSERT INTO words (slang_word, standard_word, word_type, grammatical_info, genitive_form, meaning, examples, diminutives, adjectives, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    sampleWords.forEach(word => {
      stmt.run(
        word.slang_word,
        word.standard_word,
        word.word_type,
        word.grammatical_info,
        word.genitive_form,
        word.meaning,
        word.examples,
        word.diminutives,
        word.adjectives,
        word.category
      );
    });

    db.run('COMMIT', (err) => {
      if (err) {
        console.error('Error seeding database:', err);
      } else {
        console.log('Database seeded successfully!');
        console.log(`Added ${sampleWords.length} words to the dictionary.`);
      }

      stmt.finalize();
      db.close();
    });
  });
}, 100);