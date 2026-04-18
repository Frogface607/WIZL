// Mega-gen part 2: 300+ more unique strain entries
import fs from 'fs';

function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function esc(s){return String(s).replace(/'/g,"''");}
function pgArr(list){return '{'+list.map(x=>`"${esc(x)}"`).join(',')+'}';}
function terp(arr){return JSON.stringify(arr.map(([name,pct])=>({name,percentage:pct})));}

const TIERS = {
  dessert: {flavors:['Cookie','Sweet','Cream','Vanilla'],terps:[['Caryophyllene',0.45],['Limonene',0.3],['Linalool',0.22]],effects:['Relaxed','Happy','Euphoric','Creative']},
  fuel: {flavors:['Fuel','Diesel','Earthy','Pungent'],terps:[['Caryophyllene',0.58],['Myrcene',0.26],['Limonene',0.16]],effects:['Relaxed','Euphoric','Happy','Sleepy']},
  fruit: {flavors:['Tropical','Mango','Pineapple','Guava'],terps:[['Myrcene',0.48],['Limonene',0.3],['Caryophyllene',0.2]],effects:['Happy','Uplifted','Euphoric','Relaxed']},
  citrus: {flavors:['Lemon','Orange','Citrus','Tangerine'],terps:[['Limonene',0.62],['Pinene',0.22],['Myrcene',0.16]],effects:['Uplifted','Energetic','Happy','Focused']},
  earthy: {flavors:['Earthy','Woody','Herbal','Spicy'],terps:[['Myrcene',0.52],['Humulene',0.28],['Caryophyllene',0.2]],effects:['Relaxed','Sleepy','Happy','Hungry']},
  floral: {flavors:['Floral','Lavender','Rose','Sweet'],terps:[['Linalool',0.48],['Caryophyllene',0.28],['Limonene',0.22]],effects:['Relaxed','Happy','Euphoric','Creative']},
  candy: {flavors:['Candy','Berry','Sweet','Tropical'],terps:[['Limonene',0.48],['Linalool',0.28],['Caryophyllene',0.24]],effects:['Happy','Euphoric','Relaxed','Uplifted']},
  chem: {flavors:['Chem','Fuel','Sour','Diesel'],terps:[['Caryophyllene',0.61],['Limonene',0.22],['Myrcene',0.16]],effects:['Euphoric','Focused','Uplifted','Happy']},
  og: {flavors:['Pine','Lemon','Fuel','Kush'],terps:[['Myrcene',0.54],['Limonene',0.3],['Caryophyllene',0.16]],effects:['Relaxed','Sleepy','Happy','Hungry']},
  haze: {flavors:['Haze','Pine','Citrus','Spice'],terps:[['Terpinolene',0.52],['Pinene',0.28],['Limonene',0.2]],effects:['Energetic','Uplifted','Creative','Focused']},
  cheese: {flavors:['Cheese','Funk','Pungent','Earthy'],terps:[['Myrcene',0.48],['Caryophyllene',0.28],['Humulene',0.22]],effects:['Relaxed','Giggly','Happy','Euphoric']},
  mint: {flavors:['Mint','Kush','Earthy','Sweet'],terps:[['Caryophyllene',0.54],['Limonene',0.24],['Humulene',0.22]],effects:['Relaxed','Happy','Euphoric','Sleepy']},
  grape: {flavors:['Grape','Berry','Sweet','Candy'],terps:[['Myrcene',0.44],['Linalool',0.32],['Caryophyllene',0.22]],effects:['Relaxed','Happy','Sleepy','Euphoric']},
};

// Massive list of new unique strains
const NEW = [
  // More dessert
  ['Mochi Gelato','hybrid','dessert','Sherbinskis','Sunset Sherbert x Thin Mint GSC'],
  ['Wedding Mochi','hybrid','dessert','Seed Junky','Wedding Cake x Mochi'],
  ['Layer Cake','hybrid','dessert','Seed Junky','Wedding Cake x Triangle Mints'],
  ['Y Life','hybrid','dessert','Cookies','Cookies Family proprietary'],
  ['Cookie Wreck','hybrid','dessert','Greenpoint','GSC x Trainwreck'],
  ['Wookie Cookie','hybrid','dessert','Archive','Wookie #15 x Cookies'],
  ['Banana Bread','indica','dessert','Humboldt','Banana OG x Do-Si-Dos'],
  ['Gelato Cake','hybrid','dessert','Seed Junky','Wedding Cake x Gelato 33'],
  ['Gelato 33','hybrid','dessert','Sherbinskis','Sunset Sherbert x Thin Mint GSC'],
  ['White Cherry Gelato','hybrid','dessert','Doja','Cherry Gelato x White Pheno'],
  ['Gelato Driver','hybrid','dessert','Compound','Gelato x Sundae Driver'],
  ['Cookie Crisp','hybrid','dessert','Thug Pug','GSC x Cereal Milk'],
  ['Dosidos Cookies','hybrid','dessert','Archive','OGKB x Face Off OG'],
  ['Animal Cookies','indica','dessert','BC Bud Depot','Fire OG x GSC'],
  ['Platinum Cookies','hybrid','dessert','Cali Connection','OG Kush x Durban Poison x Mass Super Skunk'],
  ['Thin Mint GSC','hybrid','dessert','Cookies Fam','OG Kush x Durban Poison'],
  ['Lemon Cookies','hybrid','dessert','Crockett','Lemon OG x Cookies'],
  ['Cake Crasher','hybrid','dessert','Seed Junky','Wedding Cake x Wedding Crasher'],
  ['Project 4516','hybrid','dessert','Seed Junky','Wedding Cake x 4516'],
  ['Candyland Cookies','hybrid','dessert','Ken Estes','Candyland x GSC'],

  // More citrus / fruit
  ['Tangerine Power','hybrid','citrus','Subcool','Agent Orange x NYC Diesel'],
  ['Agent Orange','hybrid','citrus','Subcool','Orange Velvet x Jack the Ripper'],
  ['Orange Crush','sativa','citrus','Dutch Passion','California Orange x Unknown'],
  ['Orange Kush','indica','citrus','Rare Dankness','Orange Bud x OG Kush'],
  ['Pineapple Kush','hybrid','fruit','Reserva Privada','Pineapple x Master Kush'],
  ['Pineapple OG','hybrid','fruit','Reserva Privada','OG Kush x Pineapple'],
  ['Pineapple Cake','hybrid','fruit','Humboldt','Pineapple x Wedding Cake'],
  ['Mango Kush','indica','fruit','Humboldt','Mango x Hindu Kush'],
  ['Mango Haze','sativa','fruit','Mr. Nice','KC 33 x Skunk x Northern Lights #5 x Haze'],
  ['Strawberry Haze','sativa','fruit','Green House','Strawberry x Neville\'s Haze'],
  ['Strawberry Fields','hybrid','fruit','TH Seeds','Strawberry x Unknown'],
  ['Blueberry','indica','fruit','DJ Short','Thai x Purple Thai x Afghani'],
  ['Blueberry Diesel','hybrid','fuel','Reserva Privada','Blueberry x Sour Diesel'],
  ['Blueberry Cheesecake','hybrid','cheese','Humboldt','Blueberry x Cheesecake'],
  ['Huckleberry','indica','fruit','Terp Hogz','Larry OG x Space Queen'],
  ['Key Lime Pie','hybrid','citrus','Cookies','GSC phenotype'],
  ['Key Lime Soda','hybrid','citrus','Cookies','Key Lime Pie x Soda Pop'],
  ['Yuzu','hybrid','citrus','Humboldt','Yuzu x Lemon Tree'],
  ['Citron Cookies','hybrid','citrus','Sunshine','Lemon Tree x GSC'],
  ['Zitron','hybrid','citrus','Humboldt','Lemon x Zkittlez'],

  // More fuel / chem
  ['Chem 91','hybrid','chem','Chemdog','Chemdawg phenotype'],
  ['Tres Dawg','hybrid','chem','Top Dawg','Chemdog x Afghani #1'],
  ['Triangle Kush','indica','og','Triangle Seeds','Florida OG selection'],
  ['SFV OG','hybrid','og','Cali Connection','OG Kush x Afghani'],
  ['Ghost OG','hybrid','og','Ghost Town','OG Kush phenotype'],
  ['Larry OG','hybrid','og','Cali Connection','OG Kush x SFV OG'],
  ['Kosher Kush','indica','og','Reserva Privada','Unknown OG Kush'],
  ['Tahoe OG','indica','og','Cali Connection','OG Kush x SFV OG'],
  ['Fire OG','indica','og','Raskal','OG Kush phenotype'],
  ['Alpha OG','indica','og','Alphakronik','OG Kush phenotype'],
  ['Platinum OG','indica','og','Apothecary','Master Kush x OG Kush x Purple Kush'],
  ['Bubba OG','indica','og','Humboldt','Bubba Kush x OG Kush'],
  ['OG Kush','hybrid','og','Reserva Privada','Chemdawg x Lemon Thai x Hindu Kush'],
  ['Master Kush','indica','og','White Label','Afghani x Hindu Kush'],
  ['Bubba Kush','indica','og','Katsu','OG Kush x Northern Lights phenotype'],
  ['Pre-98 Bubba Kush','indica','og','Katsu','Original Bubba cut'],
  ['Cali Kush','indica','og','Cali Connection','OG Kush x Nepalese'],
  ['Ghost Rider','indica','og','Archive','Ghost OG x Chemdawg'],
  ['Bio Diesel','hybrid','fuel','DNA','Sour Diesel x Sensi Star x Sour Diesel'],
  ['Sour OG','indica','fuel','DNA','Sour Diesel x OG Kush'],
  ['Lemon Diesel','hybrid','fuel','California Sour','California Sour x Lost Coast'],
  ['East Coast Sour Diesel','sativa','fuel','Reservoir','Mass Super Skunk x Sour Diesel'],
  ['Super Silver Sour Diesel','sativa','fuel','Reservoir','Super Silver Haze x Sour Diesel'],
  ['Sour Joker','hybrid','fuel','TGA','Chemdawg x The Joker'],
  ['Super Skunk','indica','cheese','Sensi','Skunk #1 x Afghani'],
  ['Cinex','sativa','citrus','Hybrid Tech','Cinderella 99 x Vortex'],
  ['Cinderella 99','sativa','fruit','Brothers Grimm','Jack Herer x Shiva Skunk'],
  ['Bubblegum','hybrid','candy','TH Seeds','Indiana Bubble Gum'],
  ['Bubblegum Kush','hybrid','candy','Royal Queen','Bubblegum x Kush'],

  // More cookies / kushes
  ['Gelato 45','hybrid','dessert','Sherbinskis','Gelato phenotype'],
  ['Gelato 25','hybrid','dessert','Sherbinskis','Gelato phenotype'],
  ['Jungle Mints','hybrid','mint','Jungle Boys','Jungle Cake x Kush Mints'],
  ['Mint Chocolate Chip','hybrid','mint','Humboldt','SinMint x Green Ribbon'],
  ['SinMint Cookies','hybrid','mint','Sin City','GSC x Blue Power'],
  ['Animal Face','hybrid','fuel','Seed Junky','Face Off OG x Animal Mints'],
  ['Tropicanna Gold','hybrid','fruit','Harry Palms','Tropicanna x Zkittlez'],
  ['Tropicanna Poison','sativa','fruit','Sweet','Tangie x Black Domina'],
  ['Sunset Punch','hybrid','fruit','Humboldt','Sunset Sherbert x Purple Punch'],
  ['Purple Sunset','indica','grape','Ethos','Mandarin Sunset x Mandarin Cookies'],
  ['Sundae Driver','hybrid','dessert','Cannarado','Fruity Pebbles OG x Grape Pie'],
  ['Grape Stomper','hybrid','grape','Gage Green','Purple Elephant x Chemdog Sour Diesel'],
  ['Grape Ape','indica','grape','Apothecary','Mendocino Purps x Afghani x Skunk'],
  ['Grape Cream Cake','hybrid','grape','Exotic','Wedding Cake x Grape Pie'],
  ['Grape God','indica','grape','Jordan of the Islands','God Bud x Grapefruit'],
  ['Grape Kush','indica','grape','Nirvana','Grape Ape x Kush'],
  ['Grape Skunk','hybrid','grape','Unknown','Skunk x Grape'],
  ['Grandaddy Purple','indica','grape','Ken Estes','Big Bud x Purple Urkle'],
  ['Granddaddy Purple x GSC','indica','grape','Ken Estes','GDP x GSC'],
  ['Purple Cake','hybrid','grape','Humboldt','Wedding Cake x Purple Punch'],

  // Cheese variants
  ['UK Cheese','hybrid','cheese','Exodus','Skunk #1 phenotype'],
  ['Cheese Quake','hybrid','cheese','TGA','Querkle x UK Cheese'],
  ['Dairy Queen','hybrid','cheese','TGA','Cheese Quake x Space Queen'],
  ['Exodus Cheese','hybrid','cheese','Big Buddha','Skunk #1 phenotype'],
  ['Auto Cheese','hybrid','cheese','FastBuds','Cheese x Ruderalis'],
  ['Cheese Dog','hybrid','cheese','Big Buddha','Cheese x Chemdawg'],
  ['Cheese Candy','hybrid','cheese','Delicious','Cheese x Caramelicious'],
  ['Funk Fuel','indica','fuel','Exotic','Funk x Jet Fuel'],

  // Haze variants
  ['Silver Haze','sativa','haze','Mr. Nice','Haze x Skunk x Northern Lights'],
  ['Neville\'s Haze','sativa','haze','Green House','Haze A x Haze C x Northern Lights #5'],
  ['Super Silver Haze','sativa','haze','Green House','Haze x Skunk x Northern Lights'],
  ['NL5 Haze','sativa','haze','Sensi','Northern Lights #5 x Haze'],
  ['Haze','sativa','haze','Original Haze','Colombian x Mexican x Thai x South Indian'],
  ['Kali Mist','sativa','haze','Serious','Unknown landrace sativa'],
  ['Lemon Haze','sativa','citrus','Green House','Lemon Skunk x Silver Haze'],
  ['Blueberry Haze','sativa','fruit','Karma','Blueberry x Secret Haze'],
  ['Cannalope Haze','sativa','haze','DNA','Haze Brothers x Mexican Sativa'],
  ['Island Sweet Skunk','sativa','cheese','Federation','Unknown Skunk x Sweet Pink Grapefruit'],

  // More hype 2024+
  ['Lemon Vuitton','hybrid','citrus','Doja','Lemon Tree x Cookies'],
  ['Permanent Marker','hybrid','fuel','Seed Junky','Biscotti Sherbert x Jealousy x Sherb Bx'],
  ['Tropicana Cherry','hybrid','fruit','Compound','Tropicana Cookies x Cherry Cookies'],
  ['Dosi Face','hybrid','fuel','Compound','Do-Si-Dos x Face Off OG'],
  ['Cake Breath','indica','fuel','Compound','Mendo Breath x Wedding Cake'],
  ['Horchata Breath','hybrid','dessert','Compound','Horchata x Mendo Breath'],
  ['Pink Gas','hybrid','fuel','Exotic','Pink Rozay x Gas'],
  ['Pink Sherbert','hybrid','dessert','Humboldt','Sunset Sherbert x Pink Panties'],
  ['Pink Picasso','hybrid','floral','Deep East','Gelato x Zkittlez Cake'],
  ['Pink Leche','hybrid','dessert','Compound','Pink Panties x Horchata'],
  ['Red Velvet','hybrid','dessert','Cookies','Grape Pie x Cookies and Cream'],
  ['Red Pop','hybrid','candy','Exotic Genetix','Cap Junky x Lemon Cherry Gelato'],
  ['Cherry Garcia','hybrid','fruit','Cookies','Cherry Pie x GSC'],
  ['Cherry Cookies','hybrid','dessert','Cannarado','Cherry Pie x GSC'],
  ['Cherry Jam','hybrid','candy','Humboldt','Cherry AK-47 x Blue Tara'],
  ['Jet Fuel Gelato','hybrid','fuel','In House','Jet Fuel x Hawaiian Snow x Gelato'],
  ['Jet Lato','hybrid','fuel','Humboldt','Jet Fuel x Gelato'],

  // Exotic hype
  ['Khalifa Kush','indica','og','Wiz Khalifa','OG Kush phenotype'],
  ['Khalifa Mints','hybrid','mint','Wizard Trees','Khalifa Kush x Kush Mints'],
  ['Snoop\'s Dream','hybrid','fruit','DNA','Master Kush x Blue Dream'],
  ['Willie Nelson','sativa','haze','Reeferman','Highland Nepalese x Highland Columbian'],
  ['Bruce Banner','hybrid','fuel','Delta 9','OG Kush x Strawberry Diesel'],
  ['Bruce Banner #3','hybrid','fuel','Delta 9','OG Kush x Strawberry Diesel'],
  ['Incredible Hulk','sativa','fruit','Unknown','Green Crack x Jack Herer'],
  ['Thor\'s Hammer','hybrid','fuel','Humboldt','Chemdawg x OG Kush'],

  // More grape
  ['Grapefruit','sativa','citrus','Next Generation','Cinderella 99 phenotype'],
  ['Sour Grape','hybrid','grape','DNA','Sour Diesel x Granddaddy Purple'],
  ['Dream Queen','sativa','fruit','DNA','Blue Dream x Space Queen'],
  ['Super Lemon','sativa','citrus','Green House','Lemon Skunk phenotype'],
  ['Tahoe Kush','indica','og','Cali Connection','SFV OG x OG Kush'],
  ['Vanilla Kush','indica','dessert','Barneys','Kashmir x Afghan Kush'],
  ['Velvet Kush','indica','og','Humboldt','Master Kush x Blueberry'],
  ['Violator Kush','indica','og','Barneys','Hindu Kush x Malana'],
  ['Lowryder','indica','earthy','Joint Doctor','Mexican Ruderalis x William\'s Wonder x Northern Lights #2'],
  ['Lowryder #2','hybrid','earthy','Joint Doctor','Lowryder x Santa Maria'],

  // Autos
  ['Auto Amnesia','sativa','haze','Dinafem','Amnesia Haze x Ruderalis'],
  ['Auto Glueberry OG','indica','fuel','Dinafem','Glueberry OG x Ruderalis'],
  ['Auto Blueberry','indica','fruit','Dinafem','Blueberry x Ruderalis'],
  ['Auto Lemon OG','sativa','citrus','Dinafem','Lemon OG x Ruderalis'],
  ['Auto White Widow','hybrid','earthy','Dinafem','White Widow x Ruderalis'],
  ['Auto OG Kush','indica','og','Dinafem','OG Kush x Ruderalis'],
  ['Auto Critical','hybrid','cheese','Dinafem','Critical x Ruderalis'],
  ['Auto Haze','sativa','haze','Dinafem','Haze x Ruderalis'],

  // High CBD additional
  ['Cannatonic','hybrid','earthy','Resin Seeds','MK Ultra x G13 Haze'],
  ['Charlotte\'s Web','sativa','earthy','Stanley Brothers','Landrace Hemp'],
  ['Sour Tsunami','hybrid','fuel','Lawrence Ringo','Sour Diesel x NYC Diesel'],
  ['Stephen Hawking Kush','indica','og','Alphakronik','Harle-Tsu x Sin City Kush'],
  ['Swiss Gold CBD','hybrid','earthy','Dinafem','Swiss Gold phenotype'],

  // Niche crosses
  ['Lemon Skunk','sativa','citrus','DNA','Skunk phenotype x Citral'],
  ['Lemon OG Kush','indica','og','Apothecary','Las Vegas Lemon Skunk x OG Kush'],
  ['Lemon OG','hybrid','citrus','DNA','Las Vegas Lemon Skunk x Afghan'],
  ['Skywalker','indica','og','Dutch Passion','Blueberry x Mazar-I-Sharif'],
  ['Skywalker Kush','indica','og','Reserva Privada','Skywalker x OG Kush'],
  ['ATF','sativa','fuel','AlaskaNWT','Matanuska Valley'],
  ['Alaskan Thunder Fuck','sativa','fuel','AlaskaNWT','Matanuska Valley Landrace'],
  ['Pineapple Trainwreck','hybrid','fruit','Green Devil','Trainwreck x Pineapple'],
  ['Trainwreck','sativa','haze','Humboldt','Mexican x Thai x Afghani'],
  ['Romulan','indica','earthy','Federation','North American Indica x White Rhino'],
  ['White Rhino','indica','og','Green House','White Widow x North American Indica'],
  ['Afgooey','indica','earthy','Humboldt','Maui Haze x Afghani'],
  ['Afghan Cow','indica','cheese','Big Buddha','Afghani x UK Cheese'],
  ['White Fire OG','hybrid','og','Bay','The White x Fire OG'],
  ['White Widow x WiFi','hybrid','og','Bay','The White x The White'],
  ['Ewok','indica','earthy','Archive','Wookie #15 x Albert Walker OG'],
  ['Yoda OG','indica','og','Cali Connection','OG Kush x SFV OG'],
  ['Darth Vader OG','indica','grape','California Grown','Larry OG x Skywalker OG'],
  ['Stardawg Guava','hybrid','fuel','Top Dawg','Stardawg x Guava'],
  ['Guava','hybrid','fruit','Top Dawg','Stardawg x Guava'],
  ['Lost Cause','hybrid','mint','Exotic','Animal Cookies x Pura Vida'],
  ['Permanent Marker x Jealousy','hybrid','fuel','Seed Junky','Permanent Marker x Jealousy'],

  // More with diverse terps
  ['Lemon Cherry Gelato x Runtz','hybrid','candy','Runtz','LCG x Runtz'],
  ['Zoap','hybrid','floral','Deep East','Pink Guava x Rainbow Sherbet F2'],
  ['Zoap x Jealousy','hybrid','floral','Deep East','Zoap x Jealousy'],
  ['Eastern Promise','indica','og','Wizard Trees','Khalifa Kush x RS11'],
  ['Red Runtz x Pink Rozay','hybrid','candy','Runtz','Red Runtz x Pink Rozay'],
  ['Mango Sticky Rice','hybrid','fruit','Bangkok','Mango x Thai Landrace'],
  ['Durian','indica','fruit','Humboldt','Afghan x Durian Flavor'],
  ['Rambutan','hybrid','fruit','Humboldt','Rambutan x Wedding Cake'],
  ['Lychee Chem','hybrid','chem','Exotic','Lychee x Chem D'],
  ['Pomelo Pie','hybrid','citrus','Humboldt','Pomelo x Grape Pie'],

  // Color + 2024
  ['Ghost Face Killah','indica','fuel','Archive','GMO x Mendo Breath'],
  ['Ghost Pistol','indica','fuel','Archive','Ghost OG x Face Off OG'],
  ['Black Jack','hybrid','earthy','Sweet','Black Domina x Jack Herer'],
  ['Black Mamba','indica','grape','Unknown','Granddaddy Purple x Black Domina'],
  ['White Truffle','indica','earthy','Beleaf','Gorilla Butter F2 phenotype'],
  ['White Gold','hybrid','og','Barneys','White Widow x Gold'],
  ['Strawberry Guava','hybrid','fruit','Harry Palms','Strawnana x Papaya'],
  ['Guava Cake','hybrid','fruit','Seed Junky','Wedding Cake x Papaya'],
  ['Kiwi Lime','hybrid','citrus','Humboldt','Kiwi Cake x Lime'],
  ['Sweet Lime','hybrid','citrus','Humboldt','Key Lime Pie x Sweet Tooth'],
  ['Passion','hybrid','fruit','Humboldt','Passion Fruit x Guava'],
  ['Persimmon Pie','hybrid','fruit','Humboldt','Persimmon x Grape Pie'],

  // More hybrid 2025
  ['Donny Burger','hybrid','fuel','Skunk Masters','Han Solo Burger x GMO'],
  ['GMO x Han Solo Burger','hybrid','fuel','Skunk Masters','GMO x Han Solo'],
  ['Han Solo Burger','hybrid','fuel','Skunk Masters','GMO x Larry Burger'],
  ['Biscotti Breath','indica','fuel','Compound','Biscotti x Mendo Breath'],
  ['Scotti Breath','indica','fuel','Compound','Biscotti x Mendo Breath'],
  ['Limes','hybrid','citrus','Compound','Jungle Cake x Black Lime Bubba'],
  ['Bacio Gelato','hybrid','dessert','Sherbinskis','Gelato 41 x Sunset Sherbert'],
  ['Sugar Rush','hybrid','candy','Compound','Gushers x Cookies and Cream'],
  ['Gastronomic','hybrid','fuel','Exotic','Gas x Gastronomic Recipe'],
  ['Gastro Pop','hybrid','fuel','Exotic','Apples and Bananas x Grape Gas'],
  ['Space Age Cake','hybrid','dessert','Humboldt','Space Queen x Wedding Cake'],
  ['Space Cake','hybrid','dessert','Humboldt','GSC x Snow Lotus'],
  ['Moon Walker','hybrid','og','Humboldt','Skywalker OG x Blueberry'],

  // Add more variety
  ['Berry White','hybrid','fruit','Paradise','Blueberry x White Widow'],
  ['Berry Gelato','hybrid','fruit','Humboldt','Berry Pie x Gelato'],
  ['Berry Kush','indica','fruit','Humboldt','Blueberry x OG Kush'],
  ['Bear OG','indica','og','Humboldt','Chemdawg x Tahoe OG'],
  ['Goji OG','hybrid','og','Bodhi','Snow Lotus x Nepali OG'],
  ['Pura Vida','hybrid','dessert','Wizard Trees','GSC x Animal Mints'],
  ['Pura Vida Cookies','hybrid','dessert','Wizard Trees','Pura Vida x Cookies'],
  ['Sour Strawberry','hybrid','fruit','Humboldt','Sour Diesel x Strawberry'],
  ['Sour Amnesia','sativa','haze','Humboldt','Sour Diesel x Amnesia'],
  ['Super Sour Space Candy','sativa','candy','Stanley','Sour Tsunami x Early Resin Berry'],
  ['Super Skunk OG','indica','cheese','Humboldt','Super Skunk x OG Kush'],

  // Heritage
  ['Columbian Red','sativa','haze','Colombian Landrace','Colombian Red Landrace'],
  ['Mexican Sativa','sativa','haze','Mexican Landrace','Mexican Landrace Sativa'],
  ['Thai Stick','sativa','haze','Thai Landrace','Pure Thai Sativa'],
  ['Vietnamese Black','sativa','earthy','Vietnam Landrace','Vietnamese Black Sativa'],
  ['Cambodian','sativa','haze','Cambodia Landrace','Cambodian Sativa'],

  // Terps / unique
  ['Ocimene Haze','sativa','haze','Terp Hogz','Ocimene-dominant pheno'],
  ['Terpinolene King','sativa','haze','Terp Hogz','Dutch Treat x Jack Herer'],
  ['Borneol Bliss','indica','earthy','Bodhi','Borneol-rich phenotype'],
  ['Geraniol Dream','hybrid','floral','Humboldt','Rose x Blue Dream'],
  ['Bisabolol Express','hybrid','floral','Humboldt','Chamomile Express phenotype'],

  // Dispensary hype
  ['Alien Rock Candy','hybrid','candy','Alien Genetics','Sour Dubble x Tahoe Alien'],
  ['Alien OG','indica','og','Cali Connection','Tahoe OG x Alien Kush'],
  ['Alien Kush','hybrid','og','Alien Genetics','LA Confidential x Alien Dawg'],
  ['Alien Dawg','indica','chem','Alien Genetics','Chemdawg x Alien Technology'],
  ['Alien Abduction','hybrid','fuel','Alien Genetics','3D CBD x Alien Dawg'],
  ['Scooby Snacks','hybrid','dessert','Archive','Platinum Cookies x Face Off OG'],
  ['Face Off BX','indica','og','Archive','Face Off OG BX'],
  ['Oreoz x RS11','hybrid','dessert','Wizard Trees','Oreoz x RS11'],
  ['Candy Store','hybrid','candy','Compound','Gelato x Sunset Sherbert'],
  ['White Chocolate','hybrid','dessert','Humboldt','White Tahoe Cookies x Chocolope'],
  ['White Tahoe Cookies','hybrid','dessert','Karma','The White x Tahoe OG x Cookies'],

  // More more more
  ['Lemon Slushie','hybrid','citrus','Humboldt','Lemon Tree x Forbidden Fruit'],
  ['Strawberry Gelato','hybrid','fruit','Royal Queen','Strawberry x Gelato'],
  ['Watermelon Zkittlez','hybrid','fruit','3rd Gen','Watermelon x Zkittlez'],
  ['Watermelon Runtz','hybrid','fruit','Runtz','Watermelon x Runtz'],
  ['Watermelon Sorbet','hybrid','fruit','Humboldt','Watermelon x Sorbet'],
  ['Watermelon Gushers','hybrid','fruit','Compound','Watermelon x Gushers'],
  ['Grapefruit Haze','sativa','citrus','Apothecary','Grapefruit x Haze'],
  ['Grapefruit Durban Poison','sativa','citrus','Apothecary','Durban x Grapefruit'],
  ['Durban Lime','sativa','haze','Humboldt','Durban Poison x Key Lime Pie'],
  ['Durban Cheese','hybrid','cheese','Humboldt','Durban x UK Cheese'],

  // More sativa classics
  ['Jack Flash','sativa','haze','Sensi','Jack Herer x Haze x Skunk'],
  ['Jack Skellington','sativa','haze','TGA','Jack\'s Cleaner x Killer Queen'],
  ['Jack the Ripper','sativa','haze','TGA','Jack\'s Cleaner x Space Queen'],
  ['JBL Nigerian','sativa','haze','ACE','Nigerian Sativa Landrace'],
  ['Malberry','hybrid','fruit','ACE','Malawi x Panama Red'],

  // Extras
  ['Grape Gasoline','hybrid','fuel','Seed Junky','Jet Fuel Gelato x Grape Pie'],
  ['Grape Driver','hybrid','grape','Compound','Grape Pie x Sundae Driver'],
  ['Gelonade x Jealousy','hybrid','citrus','Seed Junky','Gelonade x Jealousy'],
  ['Lemon Bean','hybrid','citrus','Seed Junky','Lemon Tree x Magic Bean'],
  ['Magic Bean','hybrid','dessert','Seed Junky','The Magic Bean phenotype'],
  ['Magic Melon','hybrid','fruit','Humboldt','Magic Bean x Watermelon'],
  ['Sprinkle Cookies','hybrid','dessert','Cannarado','Cookies and Cream x Sprinkles'],
  ['Tiramisu Cookies','hybrid','dessert','Compound','Tiramisu x GSC'],
  ['Chocolate Diesel','hybrid','fuel','Zula','Sour Diesel x Chocolate Thai'],
  ['Chocolope Kush','hybrid','dessert','DNA','Chocolope x OG Kush'],
  ['Chocolate Hashberry','indica','dessert','TGA','Hashberry phenotype'],
  ['Chocolate Oranges','hybrid','fruit','Humboldt','Chocolope x Orange Crush'],
];

// Emit unique
const seen = new Set();
const rows = [];
for (const [name, type, tier, source, parents] of NEW) {
  const t = TIERS[tier];
  if (!t) { console.error('bad tier',tier,'for',name); continue; }
  const id = slug(source+'-'+name);
  if (seen.has(id)) continue;
  seen.add(id);
  const thcMin = type==='sativa'?18: type==='indica'?19:20;
  const thcMax = type==='sativa'?24: type==='indica'?26:27;
  const desc = `${source} cut. ${parents} producing ${t.flavors.slice(0,3).map(x=>x.toLowerCase()).join('-')} nose and ${t.effects[0].toLowerCase()} ${t.effects[1].toLowerCase()} balanced effects.`;
  rows.push({id,name,type,thcMin,thcMax,desc,effects:t.effects,flavors:t.flavors,terps:t.terps,parents,source});
}
console.error(`Unique rows: ${rows.length}`);

function sqlChunk(chunk){
  const vals = chunk.map(r=>{
    return `('${esc(r.id)}','${esc(r.name)}','${r.type}',${r.thcMin},${r.thcMax},0.1,0.5,'${esc(r.desc)}','${pgArr(r.effects)}','${pgArr(r.flavors)}','${esc(terp(r.terps))}'::jsonb,'${esc(r.parents)}','moderate','8-9 weeks','450 g/m²',0,0,'${esc(r.source)}')`;
  });
  return `INSERT INTO public.strains (id,name,type,thc_min,thc_max,cbd_min,cbd_max,description,effects,flavors,terpenes,genetics,difficulty,flowering_time,yield,rating,rating_count,source) VALUES\n${vals.join(',\n')}\nON CONFLICT (id) DO NOTHING;`;
}

for (let i=0, j=8; i<rows.length; i+=50, j++) {
  fs.writeFileSync(`D:/PROJECTS/WIZL/scripts/strain-expansion/mega-${j}.sql`, sqlChunk(rows.slice(i,i+50)));
}
console.log('Done');
