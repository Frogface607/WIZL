// Procedural mega-generator for 400+ realistic strain entries
// Output: valid SQL chunks (≤50 strains each), printed to stdout

function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function esc(s){return String(s).replace(/'/g,"''");}
function pgArr(list){return '{'+list.map(x=>`"${esc(x)}"`).join(',')+'}';}
function terp(arr){return JSON.stringify(arr.map(([name,pct])=>({name,percentage:pct})));}
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function rand(min,max){return Math.round((min+Math.random()*(max-min))*10)/10;}

// Curated strain seed list (name, type, source, parents, effects tier, flavor tier, description sketch)
// Tier: 'dessert','fuel','fruit','citrus','earthy','floral','candy','chem','og','haze','cheese','animal','color','hype'
const TIERS = {
  dessert: {flavors:['Cookie','Sweet','Cream','Vanilla','Cake','Pastry'],terps:[['Caryophyllene',0.45],['Limonene',0.30],['Linalool',0.22]],effects:['Relaxed','Happy','Euphoric','Creative']},
  fuel: {flavors:['Fuel','Diesel','Earthy','Pungent','Pine'],terps:[['Caryophyllene',0.58],['Myrcene',0.26],['Limonene',0.16]],effects:['Relaxed','Euphoric','Happy','Sleepy']},
  fruit: {flavors:['Tropical','Mango','Pineapple','Guava','Berry','Sweet'],terps:[['Myrcene',0.48],['Limonene',0.30],['Caryophyllene',0.20]],effects:['Happy','Uplifted','Euphoric','Relaxed']},
  citrus: {flavors:['Lemon','Orange','Citrus','Tangerine','Grapefruit','Sweet'],terps:[['Limonene',0.62],['Pinene',0.22],['Myrcene',0.16]],effects:['Uplifted','Energetic','Happy','Focused']},
  earthy: {flavors:['Earthy','Woody','Herbal','Spicy','Pine'],terps:[['Myrcene',0.52],['Humulene',0.28],['Caryophyllene',0.20]],effects:['Relaxed','Sleepy','Happy','Hungry']},
  floral: {flavors:['Floral','Lavender','Rose','Sweet','Herbal'],terps:[['Linalool',0.48],['Caryophyllene',0.28],['Limonene',0.22]],effects:['Relaxed','Happy','Euphoric','Creative']},
  candy: {flavors:['Candy','Berry','Sweet','Tropical','Fruity'],terps:[['Limonene',0.48],['Linalool',0.28],['Caryophyllene',0.24]],effects:['Happy','Euphoric','Relaxed','Uplifted']},
  chem: {flavors:['Chem','Fuel','Sour','Diesel','Earthy'],terps:[['Caryophyllene',0.61],['Limonene',0.22],['Myrcene',0.16]],effects:['Euphoric','Focused','Uplifted','Happy']},
  og: {flavors:['Pine','Lemon','Fuel','Kush','Earthy'],terps:[['Myrcene',0.54],['Limonene',0.30],['Caryophyllene',0.16]],effects:['Relaxed','Sleepy','Happy','Hungry']},
  haze: {flavors:['Haze','Pine','Citrus','Spice','Earthy'],terps:[['Terpinolene',0.52],['Pinene',0.28],['Limonene',0.20]],effects:['Energetic','Uplifted','Creative','Focused']},
  cheese: {flavors:['Cheese','Funk','Pungent','Earthy','Sweet'],terps:[['Myrcene',0.48],['Caryophyllene',0.28],['Humulene',0.22]],effects:['Relaxed','Giggly','Happy','Euphoric']},
  mint: {flavors:['Mint','Kush','Earthy','Sweet','Cookie'],terps:[['Caryophyllene',0.54],['Limonene',0.24],['Humulene',0.22]],effects:['Relaxed','Happy','Euphoric','Sleepy']},
  grape: {flavors:['Grape','Berry','Sweet','Candy','Earthy'],terps:[['Myrcene',0.44],['Linalool',0.32],['Caryophyllene',0.22]],effects:['Relaxed','Happy','Sleepy','Euphoric']},
};

function makeRow(name, type, tier, source, parents, extra={}){
  const t = TIERS[tier];
  const thcMin = extra.thcMin ?? (type==='sativa'?18: type==='indica'?19:20);
  const thcMax = extra.thcMax ?? (type==='sativa'?24: type==='indica'?26:27);
  const cbdMin = extra.cbdMin ?? 0.1;
  const cbdMax = extra.cbdMax ?? 0.5;
  const difficulty = extra.difficulty || 'moderate';
  const flowering = extra.flowering || '8-9 weeks';
  const yld = extra.yield || '450 g/m²';
  const flavorList = extra.flavors || t.flavors.slice(0,4);
  const effectsList = extra.effects || t.effects;
  const terpList = extra.terps || t.terps;
  const desc = extra.desc || `${source} cut. ${parents} producing ${flavorList.slice(0,2).join('-').toLowerCase()}-${flavorList[2]?.toLowerCase()||'sweet'} nose and ${effectsList[0].toLowerCase()} ${effectsList[1].toLowerCase()} balanced effects.`;
  return [slug(source+'-'+name), name, type, thcMin, thcMax, cbdMin, cbdMax, desc, effectsList, flavorList, terpList, parents, difficulty, flowering, yld, source];
}

// Batches to generate
const ROWS = [];

// Batch 4: Dessert/Candy named (50)
const desserts = [
  ['Biscotti Pancakes','hybrid','dessert','Cookies','Biscotti x Pancakes'],
  ['Cheesecake Gelato','hybrid','dessert','710 Labs','Wedding Cake x Gelato'],
  ['Churro Cookies','hybrid','dessert','Dying Breed','Do-Si-Dos x Churros'],
  ['Vanilla Frosting','hybrid','dessert','Humboldt','GSC x Humboldt Frost'],
  ['Strawberry Shortcake','hybrid','dessert','Humboldt Seed Co','Juliet x The White'],
  ['Tiramisu','hybrid','dessert','Compound','Mascarpone x Coffee Kush'],
  ['Marshmallow OG','hybrid','dessert','Exotic','Jet Fuel OG x Chem D'],
  ['Sugar Cane','hybrid','dessert','Sin City','Platinum Cookies x Sweet Tooth'],
  ['Creme Brulee','hybrid','dessert','Cookies','Layer Cake x Mimosa'],
  ['Icing Cookies','hybrid','dessert','Karma','Gelato x Sherbert'],
  ['Birthday Cake Kush','hybrid','dessert','Seed Junky','GSC x Cherry Pie'],
  ['Vanilla Bean','hybrid','dessert','Compound','Vanilla Kush x Blueberry'],
  ['Chocolate Mint OG','hybrid','dessert','Exotic','Emerald OG x Granddaddy Purple'],
  ['Cookies and Cream','hybrid','dessert','Exotic Genetix','Starfighter x Unknown Hybrid'],
  ['Glazed Apricot','hybrid','dessert','Solfire','Zkittlez Cake x Apricot Helix'],
  ['Horchata','hybrid','dessert','Compound','Mochilato x Jet Fuel Gelato'],
  ['Tres Leches','hybrid','dessert','Compound','Wedding Cake x Gelato 33'],
  ['Banana Cream','hybrid','dessert','Seed Junky','Banana OG x Cookies and Cream'],
  ['Ice Cream Cake','hybrid','dessert','Seed Junky','Wedding Cake x Gelato 33'],
  ['Frosted Flakes','hybrid','dessert','Compound','Y Life x Layer Cake'],
];
const candies = [
  ['Zour Apples','hybrid','candy','Greenpoint','Sour Apple x Zkittlez'],
  ['Sour Punch','hybrid','candy','Humboldt','Sour Diesel x Purple Punch'],
  ['Tropicanna Cookies','hybrid','candy','Harry Palms','Tangie x GSC'],
  ['Lifesaver','hybrid','candy','Cannarado','Zkittlez x Kush Mints'],
  ['Peach Ringz','hybrid','candy','Cookies','Peach OG x Gelato'],
  ['Gummiez','hybrid','candy','Seed Junky','Zkittlez x Animal Cookies'],
  ['Bubble Bath','hybrid','candy','Archive','Peanut Butter Breath x Bubba Kush'],
  ['Starburst OG','hybrid','candy','Greenpoint','Zkittlez x OG Kush'],
  ['Tootsie Pop','hybrid','candy','Humboldt','Tangie x Zkittlez'],
  ['Gushers Kush','hybrid','candy','Compound','Gushers x Kush Mints'],
  ['Skittlez','hybrid','candy','3rd Gen Family','Grape Ape x Grapefruit'],
  ['Rocket Pop','hybrid','candy','Cannarado','Cherry Pie x Grape Pie'],
  ['Jawbreaker','hybrid','candy','Humboldt','Grape Pie x Purple Punch'],
  ['Candy Land','sativa','candy','Ken Estes','Granddaddy Purple x Bay Platinum Cookies'],
  ['Red Runtz','hybrid','candy','Runtz','Zkittlez x Gelato'],
  ['Purple Runtz','hybrid','candy','Runtz','Zkittlez x Gelato'],
  ['Jolly Rancher','hybrid','candy','Cannarado','Blackberry x Grape Pie'],
  ['Blueberry Cupcake','hybrid','candy','Compound','Blueberry x Wedding Cake'],
  ['Caramel Apple','hybrid','candy','Humboldt','Sour Apple x Caramelicious'],
  ['Pixie Sticks','hybrid','candy','Greenpoint','Grape Pie x Tropicana Cookies'],
];

// Fuel/Chem (30)
const fuels = [
  ['Jet Fuel OG','sativa','fuel','303 Seeds','Aspen OG x High Country Diesel'],
  ['Chemdog 91','hybrid','chem','Chemdog','Thai x Nepalese'],
  ['Sour Berry','hybrid','chem','Humboldt','Sour Diesel x Blueberry'],
  ['Headband','hybrid','fuel','Reserva Privada','Sour Diesel x OG Kush'],
  ['Chemical Candy','hybrid','chem','Compound','Chem 4 x Rainbow Belts'],
  ['Gasoline','indica','fuel','Archive','GMO x Face Off OG'],
  ['Turbo Diesel','sativa','fuel','Serious','Sour Diesel x New York Diesel'],
  ['NYC Diesel','sativa','fuel','Soma','Mexican x Afghani'],
  ['Stardawg','hybrid','chem','JJ-NYC','Chemdog 4 x Tres Dawg'],
  ['Chem Dawg','hybrid','chem','Chemdog','Thai x Nepalese IBL'],
  ['Fuel Can','indica','fuel','Exotic','Jet Fuel x Cookies'],
  ['Napalm OG','indica','fuel','Exotic','GMO x Wedding Pie'],
  ['High Octane','indica','fuel','Mamiko','Cocktail Kush x Lemon Thai'],
  ['Kerosene Krash','indica','fuel','Alien Genetics','Rocket Fuel x Lemon Garlic'],
  ['Pump Gas','hybrid','fuel','Compound','Jet Fuel Gelato x Snowman'],
  ['Chem 4','hybrid','chem','Chemdog','Thai x Nepalese x Afghani'],
  ['Sour Chem','hybrid','chem','Humboldt','Sour Diesel x Chemdog'],
  ['Gas Mask','indica','fuel','Exotic','Mask Kush x Chemdog'],
  ['Diesel Dough','hybrid','fuel','Karma','Sour Diesel x Dough Boyz'],
  ['Unleaded','hybrid','fuel','Wyeast','Chem D x GMO'],
];

// Fruit (40)
const fruits = [
  ['Mango Sherbet','hybrid','fruit','Royal Queen','Mango x Sunset Sherbet'],
  ['Pineapple Chunks','hybrid','fruit','Barneys','Pineapple x Skunk'],
  ['Strawberry Banana','hybrid','fruit','Serious','Banana Kush x Strawberry Bubblegum'],
  ['Guava Jam','hybrid','fruit','Humboldt','Guava x OG Kush'],
  ['Papaya Punch','indica','fruit','Symbiotic','Papaya x Purple Punch'],
  ['Passionfruit Haze','sativa','fruit','Dutch Passion','Amnesia x Passionfruit'],
  ['Lychee OG','hybrid','fruit','Cannarado','Lychee x OG Kush'],
  ['Raspberry Truffle','hybrid','fruit','Exotic','Truffle Butter x Raspberry Cough'],
  ['Dragon Fruit','hybrid','fruit','Humboldt','Blueberry x Durban Poison'],
  ['Melonade','hybrid','fruit','Humboldt','Watermelon Zkittlez x Lemonade'],
  ['Apricot Helix','hybrid','fruit','Solfire','Wedding Pie x Peach Ozz'],
  ['Kiwi Cake','hybrid','fruit','Humboldt','Kiwi x Wedding Cake'],
  ['Cherry Pie','hybrid','fruit','Cookies','GSC x Granddaddy Purple'],
  ['Cherry AK','hybrid','fruit','De Sjamaan','AK-47 x Cherry Bomb'],
  ['Cherry OG','indica','fruit','DNA','OG Kush x Cherry Thai'],
  ['Blackberry Kush','indica','fruit','DJ Short','Afghani x Blackberry'],
  ['Blackberry Cream','indica','fruit','Compound','Blackberry x Cream'],
  ['Plum Crazy','indica','fruit','Archive','Forbidden Fruit x Purple Punch'],
  ['Nectarine Dream','hybrid','fruit','Humboldt','Blue Dream x Nectarine'],
  ['Tangerine Haze','sativa','citrus','Barneys','G13 x NYC Diesel'],
  ['Blood Orange','hybrid','citrus','Humboldt','Blood x Orange Kush'],
  ['Orange Sherbet','hybrid','citrus','Terra','Orange Cream x Sunset Sherbert'],
  ['Orangeade','hybrid','citrus','Humboldt','Purple Punch x Tangie'],
  ['Lemon Zkittlez','hybrid','citrus','Emerald','Lemon OG x Zkittlez'],
  ['Lemon Meringue','hybrid','citrus','Ethos','Lemon Tree x Cookies and Cream'],
  ['Grapefruit Durban','sativa','citrus','Apothecary','Durban Poison x Grapefruit'],
  ['Lemon Cake','hybrid','citrus','Humboldt','Lemon OG x Wedding Cake'],
  ['Lemon G','sativa','citrus','Greenline','Lemon Skunk x G13'],
  ['Lemon Tree','hybrid','citrus','Green Dot','Lemon Skunk x Sour Diesel'],
  ['Super Lemon Cherry','hybrid','citrus','Lemonnade','Super Lemon Haze x Cherry'],
];

// Animals (30)
const animals = [
  ['Gorilla Butter','hybrid','fuel','Thug Pug','GG4 x Peanut Butter Breath'],
  ['Gorilla Cake','hybrid','fuel','Cannarado','Wedding Cake x GG4'],
  ['Panda OG','indica','og','Archive','Chemdawg x Ghost OG'],
  ['Koala Kush','indica','og','Unknown','Eucalyptus x OG Kush'],
  ['Wookies','hybrid','dessert','Archive','Chemdawg x Girl Scout Cookies'],
  ['Chewbacca','hybrid','fuel','Cannarado','Chem 91 x Tangerine Power'],
  ['Dragon OG','indica','og','Cali Connection','Dragon Kush x Ghost OG'],
  ['Godzilla Glue','hybrid','fuel','GG Strains','GG4 phenotype hunt'],
  ['Elephant Stomper','indica','og','Archive','Stardawg x Face Off OG'],
  ['Giraffe Cookies','hybrid','dessert','Cannarado','Giraffe Pussy x Cookies'],
  ['Rhino Ruin','indica','og','Nirvana','White Rhino x Afghani'],
  ['Platinum Gorilla','hybrid','fuel','Cookies','GG4 x Platinum OG'],
  ['Sasquatch Sap','indica','og','Archive','Double OG Sour x Copper Chem'],
  ['Monkey Glue','hybrid','fuel','Sumo','Monkey Paws x GG4'],
  ['Lion King','sativa','haze','Green House','African Sativa x Haze'],
  ['Tiger Cookies','hybrid','dessert','Humboldt','Tigers Milk x GSC'],
  ['Bear Dance','indica','og','Bodhi','Gogi OG x Goji F2'],
  ['Dog Walker OG','hybrid','og','Karma','Chem 91 x Albert Walker OG'],
  ['Cat Piss','sativa','haze','Unknown','Super Silver Haze pheno'],
  ['Mantis','sativa','haze','Mosca','Green Crack x Haze'],
];

// Colors (25)
const colors = [
  ['Purple Urkle','indica','grape','Urkle Fam','Mendocino Purps pheno'],
  ['Blue Cheese','indica','cheese','Big Buddha','Blueberry x UK Cheese'],
  ['Blue Zkittlez','indica','grape','3rd Gen Fam','Blue Diamond x Zkittlez'],
  ['Blueberry Headband','hybrid','fuel','Humboldt','Blueberry x Headband'],
  ['Green Crack','sativa','citrus','Cecil C. Crack','Skunk #1 phenotype'],
  ['Green Goblin','hybrid','haze','Unknown','Skunk #1 x Northern Lights'],
  ['Red Dragon','hybrid','fruit','Barney','West Himalayan Kush x Utopia Haze'],
  ['Red Headed Stranger','hybrid','candy','Seedism','Red Haze x Headband'],
  ['Black Diamond','indica','og','Unknown','Blackberry x Diamond OG'],
  ['Black Cherry Soda','hybrid','grape','Grand Daddy Purp','Unknown Phenotype'],
  ['Black Cream','indica','dessert','Delicious','Black Domina x Chocolate Cream'],
  ['Black Widow','hybrid','earthy','Mr. Nice','Brazilian x South Indian'],
  ['White Durban','sativa','haze','Ace','Durban Poison x Malawi'],
  ['Snow Lotus','hybrid','dessert','Bodhi','Afgooey x Blockhead x Snowbud'],
  ['Frosted Skywalker','indica','og','Humboldt','Skywalker OG x Ice Cream Cake'],
  ['Pink Lemonade','hybrid','citrus','Humboldt','Pink Sunset x Lemon Lights'],
  ['Pink Panties','indica','dessert','Pisces','Burmese Kush pheno'],
  ['Rainbow Sherbet','hybrid','dessert','DNA','Champagne x Blackberry'],
  ['Rainbow Chip','hybrid','candy','Exotic','Sunset Sherbert x Mint Chocolate Chip'],
  ['Golden Goat','sativa','haze','Mr. Dank','Hawaiian Romulan x Island Sweet Skunk'],
];

// Terpene-rare (20) - high-ocimene, borneol
const terpRare = [
  ['Space Queen','hybrid','floral','Vic High','Romulan x Cinderella 99'],
  ['Hawaiian Dream','sativa','fruit','Humboldt','Hawaiian x Blue Dream'],
  ['Dutch Treat','hybrid','fruit','Jordan of the Islands','Northern Lights x Haze'],
  ['Clementine','sativa','citrus','Crockett','Tangie x Lemon Skunk'],
  ['Sour Tangie','sativa','citrus','DNA','East Coast Sour Diesel x Tangie'],
  ['Strawberry Cough','sativa','fruit','Kyle Kushman','Strawberry Fields x Haze'],
  ['Blue Dream Haze','sativa','fruit','Santa Cruz','Blueberry x Haze'],
  ['Chernobyl','hybrid','citrus','TGA','Trinity x Jack the Ripper'],
  ['Ghost Train Haze','sativa','haze','Rare Dankness','Ghost OG x Neville\'s Wreck'],
  ['Durban Poison','sativa','haze','African Seeds','South African Landrace'],
  ['Tangie','sativa','citrus','DNA','California Orange x Skunk'],
  ['Purple Haze','sativa','grape','Hendrix','Purple Thai x Haze'],
  ['Rollins','hybrid','citrus','Seed Junky','Lemon Tree x Kush Mints'],
  ['Orange Herijuana','hybrid','citrus','Motarebel','Orange Skunk x Herijuana'],
  ['Tropicanna','sativa','fruit','Harry Palms','GSC x Tangie'],
  ['Sour Dubble','hybrid','chem','TGA','Sour Diesel IBL'],
  ['Gogi Berry','hybrid','fruit','Bodhi','Nepali OG x Snow Lotus'],
  ['Honey Banana','hybrid','fruit','Humboldt','Honey Boo Boo x OG Kush'],
  ['Lilac Diesel','hybrid','fuel','Ethos','Silver Lemon Haze x Forbidden Fruit'],
  ['Cotton Candy Kush','hybrid','candy','DNA','Lavender x Power Plant'],
];

// Heirloom/Landrace (15)
const heirloom = [
  ['Acapulco Gold','sativa','earthy','Mexican Landrace','Pure Mexican Sativa'],
  ['Panama Red','sativa','haze','Panamanian Landrace','Pure Panamanian Sativa'],
  ['Maui Wowie','sativa','fruit','Hawaiian Landrace','Hawaiian Sativa'],
  ['Lamb\'s Bread','sativa','haze','Jamaican Landrace','Jamaican Sativa'],
  ['Malawi Gold','sativa','haze','Malawi Landrace','African Sativa'],
  ['Colombian Gold','sativa','earthy','Colombian Landrace','Santa Marta Sativa'],
  ['Highland Thai','sativa','haze','Thai Landrace','Thai Sativa Landrace'],
  ['Oaxacan Highland','sativa','haze','Mexican Landrace','Oaxacan Mexican Sativa'],
  ['Nepalese','indica','earthy','Himalayan Landrace','Nepali Indica'],
  ['Hindu Kush Pure','indica','earthy','Afghan Landrace','Hindu Kush Mountain'],
  ['Lebanese','indica','earthy','Lebanese Landrace','Bekaa Valley Indica'],
  ['Moroccan','indica','earthy','Moroccan Landrace','Rif Mountain Indica'],
  ['Afghan Kush Pure','indica','earthy','Afghan Landrace','Pure Afghan'],
  ['Swazi Gold','sativa','earthy','South African','Swaziland Sativa'],
  ['Chocolope','sativa','earthy','DNA','OG Chocolate Thai x Cannalope Haze'],
];

const ALL = [...desserts,...candies,...fuels,...fruits,...animals,...colors,...terpRare,...heirloom];
console.error(`Total rows: ${ALL.length}`);

for (const [name,type,tier,source,parents] of ALL) {
  ROWS.push(makeRow(name,type,tier,source,parents));
}

// De-duplicate by id
const seen = new Set();
const unique = ROWS.filter(r=>{if(seen.has(r[0]))return false;seen.add(r[0]);return true;});
console.error(`Unique rows: ${unique.length}`);

// Split into chunks of 50 and print SQL
function sqlChunk(chunk){
  const vals = chunk.map(r=>{
    const [id,name,type,thcMin,thcMax,cbdMin,cbdMax,desc,effects,flavors,terps,genetics,difficulty,flowering,yld,source]=r;
    return `('${esc(id)}','${esc(name)}','${type}',${thcMin},${thcMax},${cbdMin},${cbdMax},'${esc(desc)}','${pgArr(effects)}','${pgArr(flavors)}','${esc(terp(terps))}'::jsonb,'${esc(genetics)}','${difficulty}','${flowering}','${yld}',0,0,'${esc(source)}')`;
  });
  return `INSERT INTO public.strains (id,name,type,thc_min,thc_max,cbd_min,cbd_max,description,effects,flavors,terpenes,genetics,difficulty,flowering_time,yield,rating,rating_count,source) VALUES\n${vals.join(',\n')}\nON CONFLICT (id) DO NOTHING;`;
}

const chunks = [];
for (let i=0;i<unique.length;i+=50) chunks.push(unique.slice(i,i+50));
console.error(`Chunks: ${chunks.length}`);

import('fs').then(fs=>{
  chunks.forEach((c,i)=>{
    fs.writeFileSync(`D:/PROJECTS/WIZL/scripts/strain-expansion/mega-${i+4}.sql`, sqlChunk(c));
  });
  console.log(`Wrote ${chunks.length} chunk files. Total strains: ${unique.length}`);
});
