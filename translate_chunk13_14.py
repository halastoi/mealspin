#!/usr/bin/env python3
"""
Fully translate recipes_chunk13.ts and recipes_chunk14.ts
- Romanian (ro): NO diacritics
- Russian (ru): natural cooking language
- Spanish (es): Latin American
- Escape apostrophes with \'
- Keep measurements as-is
"""

import re
import json

# ============================================================
# TRANSLATIONS DATABASE
# ============================================================

# Recipe name translations: id -> {ro, ru, es}
RECIPE_NAMES = {
    # chunk13
    '52869': {'ro': 'Linte cu tahini', 'ru': 'Чечевица с тахини', 'es': 'Lentejas con tahini'},
    '53287': {'ro': 'Tagine de pui cu morcovi si cartofi dulci', 'ru': 'Тажин из курицы с морковью и бататом', 'es': 'Tagine de pollo con zanahorias y camotes'},
    '53119': {'ro': 'Tall Skoleboller', 'ru': 'Булочки Сколебуллер', 'es': 'Bollos Skoleboller'},
    '53026': {'ro': 'Tamiya', 'ru': 'Тамия', 'es': 'Tamiya'},
    '52806': {'ro': 'Pui tandoori', 'ru': 'Курица тандури', 'es': 'Pollo tandoori'},
    '53312': {'ro': 'Salata de varza acrisoara', 'ru': 'Острый капустный салат', 'es': 'Ensalada de repollo agridulce'},
    '53246': {'ro': 'Salata picanta de morcovi, varza si ceapa', 'ru': 'Острый салат из моркови, капусты и лука', 'es': 'Ensalada picante de zanahoria, repollo y cebolla'},
    '52909': {'ro': 'Tarta Tatin', 'ru': 'Тарт Татен', 'es': 'Tarta Tatin'},
    '52772': {'ro': 'Musaca de pui teriyaki', 'ru': 'Запеканка с курицей терияки', 'es': 'Cazuela de pollo teriyaki'},
    '53199': {'ro': 'Vita prajita in stil thailandez', 'ru': 'Тайская обжаренная говядина', 'es': 'Res salteada estilo tailandes'},
    '53206': {'ro': 'Chiftele de pui thailandeze cu sos dulce de ardei iute', 'ru': 'Тайские куриные котлетки с соусом чили', 'es': 'Tortitas de pollo tailandesas con salsa de chile dulce'},
    '53208': {'ro': 'Supa de legume cu cocos in stil thailandez', 'ru': 'Тайский кокосовый овощной бульон', 'es': 'Caldo de verduras y coco estilo tailandes'},
    '53195': {'ro': 'Supa thailandeza de curry cu taitei', 'ru': 'Тайский суп-карри с лапшой', 'es': 'Sopa tailandesa de curry con fideos'},
    '53212': {'ro': 'Pulpe de pui thailandeze', 'ru': 'Тайские куриные голени', 'es': 'Muslos de pollo tailandeses'},
    '53198': {'ro': 'Orez prajit thailandez cu creveti si mazare', 'ru': 'Тайский жареный рис с креветками и горошком', 'es': 'Arroz frito tailandes con camarones y guisantes'},
    '53214': {'ro': 'Supa verde thailandeza de pui', 'ru': 'Тайский зеленый куриный суп', 'es': 'Sopa verde tailandesa de pollo'},
    '52814': {'ro': 'Curry verde thailandez', 'ru': 'Тайский зеленый карри', 'es': 'Curry verde tailandes'},
    '53197': {'ro': 'Curry thailandez de porc cu arahide', 'ru': 'Тайское карри из свинины с арахисом', 'es': 'Curry tailandes de cerdo con cacahuete'},
    '53205': {'ro': 'Curry thailandez cu creveti', 'ru': 'Тайское карри с креветками', 'es': 'Curry tailandes de camarones'},
    '53210': {'ro': 'Supa thailandeza de dovleac', 'ru': 'Тайский тыквенный суп', 'es': 'Sopa tailandesa de calabaza'},
    '53203': {'ro': 'Salata thailandeza de taitei de orez', 'ru': 'Тайский салат с рисовой лапшой', 'es': 'Ensalada tailandesa de fideos de arroz'},
    '53213': {'ro': 'Supa de peste in stil thailandez cu verdeturi', 'ru': 'Рыбный бульон по-тайски с зеленью', 'es': 'Caldo de pescado estilo tailandes con verduras'},
    '53202': {'ro': 'Peste la aburi in stil thailandez', 'ru': 'Рыба на пару по-тайски', 'es': 'Pescado al vapor estilo tailandes'},
    '52882': {'ro': 'Placinta cu trei feluri de peste', 'ru': 'Пирог с тремя видами рыбы', 'es': 'Pastel de tres pescados'},
    '52912': {'ro': 'Sufleuri cu trei feluri de branza', 'ru': 'Суфле с тремя видами сыра', 'es': 'Suflés de tres quesos'},
    '52929': {'ro': 'Timbits', 'ru': 'Тимбитс', 'es': 'Timbits'},
    '52822': {'ro': 'Toad in the Hole', 'ru': 'Тоуд ин зе Хоул', 'es': 'Toad in the Hole'},
    '53240': {'ro': 'Tofu cu verdeturi si caju', 'ru': 'Тофу с зеленью и кешью', 'es': 'Tofu con verduras y anacardos'},
    '53207': {'ro': 'Tom kha gai', 'ru': 'Том кха гай', 'es': 'Tom kha gai'},
    '53196': {'ro': 'Supa tom yum (iute si acrisoara) cu creveti', 'ru': 'Суп том-ям (острый и кислый) с креветками', 'es': 'Sopa tom yum (picante y agria) con camarones'},
    '53194': {'ro': 'Supa tom yum cu creveti', 'ru': 'Суп том-ям с креветками', 'es': 'Sopa tom yum con camarones'},
    '53032': {'ro': 'Porc tonkatsu', 'ru': 'Свинина тонкацу', 'es': 'Cerdo tonkatsu'},
    '53165': {'ro': 'Torrijas cu sherry', 'ru': 'Торрихас с хересом', 'es': 'Torrijas con jerez'},
    '53318': {'ro': 'Torta de fiambre', 'ru': 'Торта де фиамбре', 'es': 'Torta de fiambre'},
    '52835': {'ro': 'Tortilla spaniola', 'ru': 'Испанская тортилья', 'es': 'Tortilla espanola'},
    '52846': {'ro': 'Nicoise cu ton', 'ru': 'Нисуаз с тунцом', 'es': 'Ensalada Nicoise de atun'},
    '52972': {'ro': 'Supa tunisiana de miel', 'ru': 'Тунисский суп из баранины', 'es': 'Sopa tunecina de cordero'},
    '52970': {'ro': 'Tort tunisian de portocale', 'ru': 'Тунисский апельсиновый торт', 'es': 'Pastel tunecino de naranja'},
    '53249': {'ro': 'Banh mi de curcan', 'ru': 'Бань ми с индейкой', 'es': 'Banh mi de pavo'},
    '52845': {'ro': 'Drob de curcan', 'ru': 'Мясной рулет из индейки', 'es': 'Pastel de carne de pavo'},
    '53251': {'ro': 'Lahmacun turcesc', 'ru': 'Турецкий лахмаджун', 'es': 'Lahmacun turco'},
    '53263': {'ro': 'Pilaf turcesc de miel', 'ru': 'Турецкий плов с бараниной', 'es': 'Pilaf turco de cordero'},
    '53252': {'ro': 'Orez turcesc (orez cu fidea)', 'ru': 'Турецкий рис (рис с вермишелью)', 'es': 'Arroz turco (arroz con fideos)'},
    '53270': {'ro': 'Miel in stil turcesc', 'ru': 'Баранина по-турецки', 'es': 'Cordero estilo turco'},
    '53114': {'ro': 'Ugali - Mamaliga kenyiana', 'ru': 'Угали - кенийская кукурузная каша', 'es': 'Ugali - Polenta keniana'},

    # chunk14
    '53321': {'ro': 'Alfajores cu vanilie', 'ru': 'Ванильные альфахорес', 'es': 'Alfajores de vainilla'},
    '53250': {'ro': 'Banh mi vegan', 'ru': 'Веганский бань ми', 'es': 'Banh mi vegano'},
    '52794': {'ro': 'Tort vegan de ciocolata', 'ru': 'Веганский шоколадный торт', 'es': 'Pastel vegano de chocolate'},
    '52775': {'ro': 'Lasagna vegana', 'ru': 'Веганская лазанья', 'es': 'Lasana vegana'},
    '53000': {'ro': 'Placinta de legume tip ciobanesc', 'ru': 'Овощной пастуший пирог', 'es': 'Pastel de pastor vegetariano'},
    '52863': {'ro': 'Musaca vegetariana', 'ru': 'Вегетарианское рагу', 'es': 'Cazuela vegetariana'},
    '52867': {'ro': 'Chili vegetarian', 'ru': 'Вегетарианский чили', 'es': 'Chili vegetariano'},
    '53222': {'ro': 'Shakshuka vegetariana', 'ru': 'Вегетарианская шакшука', 'es': 'Shakshuka vegetariana'},
    '52838': {'ro': 'Ragu venetian de rata', 'ru': 'Венецианское рагу из утки', 'es': 'Ragu veneciano de pato'},
    '53325': {'ro': 'Arepas venezuelene', 'ru': 'Венесуэльские арепас', 'es': 'Arepas venezolanas'},
    '53327': {'ro': 'Pui venezuelean cu cocos', 'ru': 'Венесуэльская курица с кокосом', 'es': 'Pollo venezolano con coco'},
    '53326': {'ro': 'Sancocho venezuelean', 'ru': 'Венесуэльский санкочо', 'es': 'Sancocho venezolano'},
    '53328': {'ro': 'Vita fiarta venezueleana', 'ru': 'Венесуэльская рваная говядина', 'es': 'Carne mechada venezolana'},
    '53332': {'ro': 'Empanadas venezuelene', 'ru': 'Венесуэльские эмпанадас', 'es': 'Empanadas venezolanas'},
    '53228': {'ro': 'Pastrav caramelizat vietnamez', 'ru': 'Вьетнамская форель в карамели', 'es': 'Trucha caramelizada vietnamita'},
    '53232': {'ro': 'Salata vietnameza de pui', 'ru': 'Вьетнамский куриный салат', 'es': 'Ensalada vietnamita de pollo'},
    '52828': {'ro': 'Porc la gratar vietnamez (bun-thit-nuong)', 'ru': 'Вьетнамская свинина на гриле (бун-тхит-нуонг)', 'es': 'Cerdo a la parrilla vietnamita (bun-thit-nuong)'},
    '53231': {'ro': 'Fluier de miel vietnamez cu cartofi dulci', 'ru': 'Вьетнамские бараньи голяшки с бататом', 'es': 'Jarrete de cordero vietnamita con camotes'},
    '53237': {'ro': 'Salata vietnameza de porc', 'ru': 'Вьетнамский салат со свининой', 'es': 'Ensalada vietnamita de cerdo'},
    '53243': {'ro': 'Rulouri vietnameze cu creveti spiralizati', 'ru': 'Вьетнамские спиральные роллы с креветками', 'es': 'Rollos vietnamitas de camarones con espirales'},
    '53241': {'ro': 'Rulouri vietnameze cu legume', 'ru': 'Вьетнамские овощные рулетики', 'es': 'Rollos vietnamitas de verduras'},
    '53235': {'ro': 'Porc caramelizat in stil vietnamez', 'ru': 'Свинина в карамели по-вьетнамски', 'es': 'Cerdo caramelizado estilo vietnamita'},
    '53236': {'ro': 'Tocana de legume in stil vietnamez', 'ru': 'Вьетнамское овощное жаркое', 'es': 'Guiso de verduras estilo vietnamita'},
    '53062': {'ro': 'Rulada cu nuci Guzvara', 'ru': 'Ореховый рулет Гужвара', 'es': 'Rollo de nueces Guzvara'},
    '53271': {'ro': 'Tort cu nuci, curmale si miere', 'ru': 'Торт с грецкими орехами, финиками и медом', 'es': 'Pastel de nueces, datiles y miel'},
    '53106': {'ro': 'Salata calda de sparanghel la cuptor', 'ru': 'Теплый салат из запеченной спаржи', 'es': 'Ensalada tibia de esparragos asados'},
    '52917': {'ro': 'Creme brulee cu ciocolata alba', 'ru': 'Крем-брюле с белым шоколадом', 'es': 'Creme brulee de chocolate blanco'},
    '52948': {'ro': 'Wontons', 'ru': 'Вонтоны', 'es': 'Wontons'},
    '52871': {'ro': 'Yaki Udon', 'ru': 'Яки Удон', 'es': 'Yaki Udon'},
    '53225': {'ro': 'Lahsa yemenita (Shakshuka de lux)', 'ru': 'Йеменская лахса (шакшука по-особому)', 'es': 'Lahsa yemeni (Shakshuka especial)'},
    '53097': {'ro': 'Budinci Yorkshire', 'ru': 'Йоркширские пудинги', 'es': 'Pudines Yorkshire'},
    '53294': {'ro': 'Zapiekanki', 'ru': 'Запеканки', 'es': 'Zapiekanki'},
    '53189': {'ro': 'Zemiakove Placky', 'ru': 'Земяковые плацки', 'es': 'Zemiakove Placky'},
    '53187': {'ro': 'Sullance s Makom', 'ru': 'Шуланце с маком', 'es': 'Sullance s Makom'},
}

# Ingredient name translations: en -> {ro, ru, es}
INGREDIENT_NAMES = {
    'Prunes': {'ro': 'prune uscate', 'ru': 'чернослив', 'es': 'ciruelas pasas'},
    'vanilla pod': {'ro': 'pastaie de vanilie', 'ru': 'стручок ванили', 'es': 'vaina de vainilla'},
    'Shredded Coconut': {'ro': 'cocos ras', 'ru': 'тёртый кокос', 'es': 'coco rallado'},
    'Broad Beans': {'ro': 'boabe de bob', 'ru': 'бобы', 'es': 'habas'},
    'Roasted Peanut': {'ro': 'arahide prajite', 'ru': 'жареный арахис', 'es': 'cacahuete tostado'},
    'Ground Nut Oil': {'ro': 'ulei de arahide', 'ru': 'арахисовое масло', 'es': 'aceite de cacahuete'},
    'Braeburn Apples': {'ro': 'mere Braeburn', 'ru': 'яблоки Бреберн', 'es': 'manzanas Braeburn'},
    'minced garlic': {'ro': 'usturoi tocat', 'ru': 'измельчённый чеснок', 'es': 'ajo picado'},
    'chicken breasts': {'ro': 'piept de pui', 'ru': 'куриные грудки', 'es': 'pechugas de pollo'},
    'stir-fry vegetables': {'ro': 'legume pentru prajit', 'ru': 'овощи для обжарки', 'es': 'verduras para saltear'},
    'White Cabbage': {'ro': 'varza alba', 'ru': 'белокочанная капуста', 'es': 'repollo blanco'},
    'Stir-fry Vegetables': {'ro': 'legume pentru prajit', 'ru': 'овощи для обжарки', 'es': 'verduras para saltear'},
    'Raw King Prawns': {'ro': 'creveti regali crudi', 'ru': 'сырые королевские креветки', 'es': 'langostinos crudos'},
    'Chinese Leaf': {'ro': 'varza chinezeasca', 'ru': 'пекинская капуста', 'es': 'col china'},
    'Chicken drumsticks': {'ro': 'pulpe inferioare de pui', 'ru': 'куриные голени', 'es': 'muslos de pollo'},
    'Hotsauce': {'ro': 'sos iute', 'ru': 'острый соус', 'es': 'salsa picante'},
    'Lime Leaves': {'ro': 'frunze de lime', 'ru': 'листья лайма', 'es': 'hojas de lima'},
    'Bamboo Shoot': {'ro': 'muguri de bambus', 'ru': 'побеги бамбука', 'es': 'brotes de bambu'},
    'Thai fish sauce': {'ro': 'sos de peste thailandez', 'ru': 'тайский рыбный соус', 'es': 'salsa de pescado tailandesa'},
    'Pork Tenderloin': {'ro': 'muschiulet de porc', 'ru': 'свиная вырезка', 'es': 'lomo de cerdo'},
    'Raw Frozen Prawns': {'ro': 'creveti congelati crudi', 'ru': 'сырые замороженные креветки', 'es': 'camarones crudos congelados'},
    'Vermicelli Rice Noodles': {'ro': 'taitei vermicelli de orez', 'ru': 'рисовая вермишель', 'es': 'fideos de arroz vermicelli'},
    'Muscovado Sugar': {'ro': 'zahar muscovado', 'ru': 'сахар мусковадо', 'es': 'azucar moscabado'},
    'Minced Pork': {'ro': 'carne tocata de porc', 'ru': 'свиной фарш', 'es': 'carne molida de cerdo'},
    'Sesame Seed': {'ro': 'seminte de susan', 'ru': 'семена кунжута', 'es': 'semillas de sesamo'},
    'Sirloin steak': {'ro': 'steak de muschi', 'ru': 'стейк из вырезки', 'es': 'bistec de lomo'},
    'Brown Rice Noodle': {'ro': 'taitei de orez brun', 'ru': 'лапша из бурого риса', 'es': 'fideos de arroz integral'},
    'Trout': {'ro': 'pastrav', 'ru': 'форель', 'es': 'trucha'},
    'Baby Pak Koi': {'ro': 'pak choi mic', 'ru': 'мини бок-чой', 'es': 'bok choy pequeno'},
    'Haddock': {'ro': 'eglefin', 'ru': 'пикша', 'es': 'eglefino'},
    'horseradish': {'ro': 'hrean', 'ru': 'хрен', 'es': 'rabano picante'},
    'Soya Bean': {'ro': 'boabe de soia', 'ru': 'соевые бобы', 'es': 'frijoles de soya'},
    'Marinated Tofu': {'ro': 'tofu marinat', 'ru': 'маринованный тофу', 'es': 'tofu marinado'},
    'Galangal Paste': {'ro': 'pasta de galangal', 'ru': 'паста галангала', 'es': 'pasta de galanga'},
    'Lemongrass Stalks': {'ro': 'tulpini de iarba de lamaie', 'ru': 'стебли лемонграсса', 'es': 'tallos de hierba limon'},
    'Oyster Mushrooms': {'ro': 'ciuperci pleurotus', 'ru': 'вёшенки', 'es': 'hongos ostra'},
    'Birds-eye Chillies': {'ro': 'ardei iuti mici', 'ru': 'перец чили птичий глаз', 'es': 'chiles ojo de pajaro'},
    'Galangal': {'ro': 'galangal', 'ru': 'галангал', 'es': 'galanga'},
    'makrut lime leaves': {'ro': 'frunze de lime kaffir', 'ru': 'листья кафир-лайма', 'es': 'hojas de lima kaffir'},
    'Chicken Stock Cube': {'ro': 'cub de supa de pui', 'ru': 'куриный бульонный кубик', 'es': 'cubo de caldo de pollo'},
    'Thai Chilli Jam': {'ro': 'gem thailandez de ardei iute', 'ru': 'тайский джем из чили', 'es': 'mermelada tailandesa de chile'},
    'Golden Caster Sugar': {'ro': 'zahar fin auriu', 'ru': 'золотистый мелкий сахар', 'es': 'azucar fino dorado'},
    'Sweet Sherry': {'ro': 'sherry dulce', 'ru': 'сладкий херес', 'es': 'jerez dulce'},
    'Strong white bread flour': {'ro': 'faina alba de paine puternica', 'ru': 'мука хлебопекарная высшего сорта', 'es': 'harina de fuerza para pan'},
    'Fast action yeast': {'ro': 'drojdie cu actiune rapida', 'ru': 'быстродействующие дрожжи', 'es': 'levadura de accion rapida'},
    'Chilli Flakes': {'ro': 'fulgi de ardei iute', 'ru': 'хлопья чили', 'es': 'hojuelas de chile'},
    'Lamb Stock': {'ro': 'supa de miel', 'ru': 'бараний бульон', 'es': 'caldo de cordero'},
    'Vermicelli Pasta': {'ro': 'paste vermicelli', 'ru': 'вермишель', 'es': 'fideos vermicelli'},
    'Seasoning': {'ro': 'condimente', 'ru': 'приправа', 'es': 'condimento'},
    'Iceberg Lettuce': {'ro': 'salata iceberg', 'ru': 'салат айсберг', 'es': 'lechuga iceberg'},
    'White Cornmeal': {'ro': 'malai alb', 'ru': 'белая кукурузная мука', 'es': 'harina de maiz blanca'},
    'Dulce de leche': {'ro': 'dulce de leche', 'ru': 'дульсе де лече', 'es': 'dulce de leche'},
    'Coconut Flakes': {'ro': 'fulgi de cocos', 'ru': 'кокосовая стружка', 'es': 'hojuelas de coco'},
    'All purpose flour': {'ro': 'faina universala', 'ru': 'мука общего назначения', 'es': 'harina para todo uso'},
    'Raw Vegetables': {'ro': 'legume crude', 'ru': 'сырые овощи', 'es': 'verduras crudas'},
    'Vegan White Wine Vinegar': {'ro': 'otet de vin alb vegan', 'ru': 'веганский белый винный уксус', 'es': 'vinagre de vino blanco vegano'},
    'Hummus': {'ro': 'humus', 'ru': 'хумус', 'es': 'hummus'},
    'coco sugar': {'ro': 'zahar de cocos', 'ru': 'кокосовый сахар', 'es': 'azucar de coco'},
    'cacao': {'ro': 'cacao', 'ru': 'какао', 'es': 'cacao'},
    'flax eggs': {'ro': 'oua de in', 'ru': 'льняные яйца', 'es': 'huevos de linaza'},
    'green red lentils': {'ro': 'linte verde si rosie', 'ru': 'зелёная и красная чечевица', 'es': 'lentejas verdes y rojas'},
    'vegan butter': {'ro': 'unt vegan', 'ru': 'веганское масло', 'es': 'mantequilla vegana'},
    'soya milk': {'ro': 'lapte de soia', 'ru': 'соевое молоко', 'es': 'leche de soya'},
    'Small Potatoes': {'ro': 'cartofi mici', 'ru': 'мелкий картофель', 'es': 'papas pequenas'},
    'Salted Butter': {'ro': 'unt sarat', 'ru': 'солёное масло', 'es': 'mantequilla con sal'},
    'Brown Lentils': {'ro': 'linte bruna', 'ru': 'коричневая чечевица', 'es': 'lentejas pardas'},
    'Kosher Salt': {'ro': 'sare kosher', 'ru': 'кошерная соль', 'es': 'sal kosher'},
    'Roasted Vegetables': {'ro': 'legume la cuptor', 'ru': 'запечённые овощи', 'es': 'verduras asadas'},
    'Mixed Grain': {'ro': 'cereale mixte', 'ru': 'смесь круп', 'es': 'cereales mixtos'},
    'Garlic Granules': {'ro': 'granule de usturoi', 'ru': 'гранулированный чеснок', 'es': 'granulos de ajo'},
    'Toast': {'ro': 'paine prajita', 'ru': 'тост', 'es': 'pan tostado'},
    'Duck Legs': {'ro': 'pulpe de rata', 'ru': 'утиные ножки', 'es': 'muslos de pato'},
    'Paccheri Pasta': {'ro': 'paste paccheri', 'ru': 'паста паккери', 'es': 'pasta paccheri'},
    'Chicken Breasts': {'ro': 'piept de pui', 'ru': 'куриные грудки', 'es': 'pechugas de pollo'},
    'Chicken Liver': {'ro': 'ficat de pui', 'ru': 'куриная печень', 'es': 'higado de pollo'},
    'Turkey Mince': {'ro': 'carne tocata de curcan', 'ru': 'индюшиный фарш', 'es': 'carne molida de pavo'},
    'Barbeque Sauce': {'ro': 'sos barbeque', 'ru': 'соус барбекю', 'es': 'salsa barbacoa'},
    'Hind Shank': {'ro': 'jarret de vita', 'ru': 'говяжья голяшка', 'es': 'jarrete de res'},
    'Sweet Red Peppers': {'ro': 'ardei rosii dulci', 'ru': 'сладкий красный перец', 'es': 'pimientos rojos dulces'},
    'Scallions': {'ro': 'ceapa verde', 'ru': 'зелёный лук', 'es': 'cebolletas'},
    'Cassaba': {'ro': 'yuca', 'ru': 'юка', 'es': 'yuca'},
    'Yautia': {'ro': 'yautia', 'ru': 'яутия', 'es': 'yautia'},
    'White Yam': {'ro': 'igname alb', 'ru': 'белый ямс', 'es': 'name blanco'},
    'Skirty Steak': {'ro': 'steak de falda', 'ru': 'стейк из пашины', 'es': 'bistec de falda'},
    'Rainbow Trout': {'ro': 'pastrav curcubeu', 'ru': 'радужная форель', 'es': 'trucha arcoiris'},
    'Bok Choi': {'ro': 'bok choy', 'ru': 'бок-чой', 'es': 'bok choy'},
    'Sesame Seed Oil': {'ro': 'ulei de susan', 'ru': 'кунжутное масло', 'es': 'aceite de sesamo'},
    'Lamb Shanks': {'ro': 'fluiere de miel', 'ru': 'бараньи голяшки', 'es': 'jarretes de cordero'},
    'Rice Vermicelli': {'ro': 'fidea de orez', 'ru': 'рисовая вермишель', 'es': 'fideos de arroz'},
    'Egg Rolls': {'ro': 'rulouri cu ou', 'ru': 'яичные рулетики', 'es': 'rollos de huevo'},
    'Challots': {'ro': 'salote', 'ru': 'лук-шалот', 'es': 'chalotes'},
    'Pork Shoulder Steaks': {'ro': 'steak de spata de porc', 'ru': 'стейк из свиной лопатки', 'es': 'bistec de paleta de cerdo'},
    'Rice Paper Sheets': {'ro': 'foi de orez', 'ru': 'рисовая бумага', 'es': 'hojas de papel de arroz'},
    'Rice Flour Pancakes': {'ro': 'clatite din faina de orez', 'ru': 'блинчики из рисовой муки', 'es': 'crepes de harina de arroz'},
    'White Chocolate Chips': {'ro': 'bucatele de ciocolata alba', 'ru': 'кусочки белого шоколада', 'es': 'chispas de chocolate blanco'},
    'Wonton Skin': {'ro': 'foi de wonton', 'ru': 'обёртки для вонтонов', 'es': 'masa de wonton'},
    'Shiitake Mushrooms': {'ro': 'ciuperci shiitake', 'ru': 'грибы шиитаке', 'es': 'hongos shiitake'},
    'Liquid Cheese': {'ro': 'branza lichida', 'ru': 'плавленый сыр', 'es': 'queso liquido'},
    'Polish Kabanos': {'ro': 'kabanos polonez', 'ru': 'польские кабаносы', 'es': 'kabanos polaco'},
    'Streaky Bacon': {'ro': 'bacon cu slanina', 'ru': 'бекон с прожилками', 'es': 'tocino entreverado'},
    'Clear Honey': {'ro': 'miere limpede', 'ru': 'жидкий мёд', 'es': 'miel liquida'},
    'Jersey Royal Potatoes': {'ro': 'cartofi noi Jersey Royal', 'ru': 'картофель Джерси Роял', 'es': 'papas Jersey Royal'},
    'Stoned Dates': {'ro': 'curmale fara sambure', 'ru': 'финики без косточек', 'es': 'datiles sin hueso'},
    'Semolina': {'ro': 'gris', 'ru': 'манная крупа', 'es': 'semolina'},
    'Ground Poppy seeds': {'ro': 'seminte de mac macinate', 'ru': 'молотые маковые семена', 'es': 'semillas de amapola molidas'},
    'Marjoram': {'ro': 'maghiran', 'ru': 'майоран', 'es': 'mejorana'},
    'chives': {'ro': 'arpagic', 'ru': 'шнитт-лук', 'es': 'cebollino'},
    'Gruyère': {'ro': 'gruyere', 'ru': 'грюйер', 'es': 'gruyere'},
}

# ============================================================
# INSTRUCTION TRANSLATIONS
# Full translations for each recipe's instructions
# ============================================================

INSTRUCTIONS = {
    # chunk13
    '52869': {
        'ro': 'Intr-o cana, amesteca tahini cu coaja si sucul de lamaie si 50ml de apa rece pentru a obtine un sos fluid. Condimenteaza dupa gust, apoi pune deoparte.\nIncinge uleiul intr-un wok sau tigaie mare la foc mediu-mare. Adauga ceapa rosie, impreuna cu un varf de sare, si prajeste 2 minute pana incepe sa se inmoaie si sa se rumeneasca. Adauga usturoiul, ardeiul, fasolea verde si dovleceii si prajeste 5 minute, amestecand frecvent.\nAdauga kale, lintea si sosul de tahini. Tine tigaia pe foc cateva minute, amestecand totul pana cand frunzele de kale se ofilesc si totul este acoperit cu sosul cremos.',
        'ru': 'В кувшине смешайте тахини с цедрой и соком лимона и 50 мл холодной воды, чтобы получилась жидкая заправка. Приправьте по вкусу, затем отложите в сторону.\nРазогрейте масло в воке или большой сковороде на среднем-сильном огне. Добавьте красный лук вместе с щепоткой соли и обжаривайте 2 минуты, пока он не начнёт размягчаться и подрумяниваться. Добавьте чеснок, перец, стручковую фасоль и кабачок и обжаривайте 5 минут, часто помешивая.\nДобавьте кале, чечевицу и заправку из тахини. Подержите сковороду на огне пару минут, перемешивая всё, пока кале не завянет и всё не покроется кремовой заправкой.',
        'es': 'En una jarra, mezcle el tahini con la ralladura y el jugo del limon y 50ml de agua fria para hacer un aderezo liquido. Sazone al gusto y reserve.\nCaliente el aceite en un wok o sarten grande a fuego medio-alto. Anade la cebolla morada junto con una pizca de sal y fria durante 2 minutos hasta que empiece a ablandarse y dorarse. Anade el ajo, el pimiento, los ejotes y el calabacin y fria durante 5 minutos, revolviendo frecuentemente.\nAnade la col rizada, las lentejas y el aderezo de tahini. Mantenga la sarten en el fuego un par de minutos, revolviendo todo hasta que la col rizada se marchite y todo este cubierto con el aderezo cremoso.',
    },
    '53287': {
        'ro': 'Combina ceapa, telina, coriandrul si patrunjelul intr-o oala mare. Amesteca cu turmeric, chimion, boia, ghimbir, piper cayenne, sare si piper. Pune pulpele de pui deasupra. Stropeste cu ulei de masline peste pui. Acopera si fierbe la foc mic pana cand puiul este fraged, aproximativ 40 de minute.\n\nPune stafidele intr-un bol mic si acopera cu apa fierbinte; lasa la inmuiat 10 minute. Scurge.\n\nPreincalzeste cuptorul la 200 de grade C.\n\nTransfera amestecul de pui intr-un vas de tagine rezistent la cuptor sau intr-o tava. Adauga cartofii dulci si morcovii. Acopera cu capac sau folie de aluminiu.\n\nCoace in cuptorul preincalzit pana cand cartofii dulci sunt moi, aproximativ 40 de minute. Adauga stafidele scurse si prunele uscate. Continua coacerea, acoperit, pana cand stafidele si prunele sunt incalzite, aproximativ 10 minute.',
        'ru': 'Соедините лук, сельдерей, кинзу и петрушку в большой кастрюле. Вмешайте куркуму, кумин, паприку, имбирь, кайенский перец, соль и перец. Выложите куриные бёдра сверху. Сбрызните курицу оливковым маслом. Накройте и тушите на слабом огне, пока курица не станет нежной, около 40 минут.\n\nПоложите изюм в маленькую миску и залейте горячей водой; оставьте замачиваться на 10 минут. Слейте воду.\n\nРазогрейте духовку до 200 градусов C.\n\nПереложите куриную смесь в жаропрочный тажин или форму для запекания. Добавьте батат и морковь. Накройте крышкой или алюминиевой фольгой.\n\nЗапекайте в разогретой духовке, пока батат не станет мягким, около 40 минут. Добавьте слитый изюм и чернослив. Продолжайте запекать под крышкой, пока изюм и чернослив не прогреются, около 10 минут.',
        'es': 'Combine las cebollas, el apio, el cilantro y el perejil en una olla grande. Incorpore la curcuma, el comino, el pimenton, el jengibre, la pimienta de cayena, la sal y la pimienta. Coloque los muslos de pollo encima. Rocié aceite de oliva sobre el pollo. Tape y cocine a fuego lento hasta que el pollo este tierno, unos 40 minutos.\n\nColoque las pasas en un tazon pequeno y cubra con agua caliente; deje remojar por 10 minutos. Escurra.\n\nPrecaliente el horno a 200 grados C.\n\nTransfiera la mezcla de pollo a un tagine o fuente para horno. Anade los camotes y las zanahorias. Cubra con tapa o papel aluminio.\n\nHornee en el horno precalentado hasta que los camotes esten blandos, unos 40 minutos. Anade las pasas escurridas y las ciruelas pasas. Continue horneando, tapado, hasta que las pasas y las ciruelas esten calientes, unos 10 minutos.',
    },
    '53119': {
        'ro': 'Incalzeste laptele pana devine caldut. Adauga drojdia si dizolva.\n\nAdauga zaharul, cardamomul, vanilia si aproximativ 2/3 din faina.\n\nAmesteca aluatul fie de mana, fie la mixer cu carlig de aluat, adaugand incet restul de faina. Este posibil sa ai nevoie de putin mai multa sau mai putina faina pentru a forma un aluat care sa nu fie prea lipicios pentru framantat. Cand aluatul formeaza o bila frumoasa, adauga untul inmuiat si continua sa framanti aluatul aproximativ zece minute.\n\nRuleaza aluatul intr-un cilindru si taie in sase parti egale. Modeleaza fiecare bucata intr-o chifluta rotunda si aseaza-le intr-o forma de briose/prajituri unsa. Acopera si lasa sa creasca pana se dubleaza in volum (aproximativ o ora).',
        'ru': 'Подогрейте молоко до тёплого состояния. Добавьте дрожжи и растворите.\n\nДобавьте сахар, кардамон, ваниль и примерно 2/3 муки.\n\nЗамесите тесто вручную или в миксере с крюком для теста, медленно добавляя оставшуюся муку. Вам может потребоваться чуть больше или меньше муки, чтобы тесто не было слишком липким для замеса. Когда тесто сформирует красивый шар, добавьте размягчённое масло и продолжайте месить тесто около десяти минут.\n\nСкатайте тесто в цилиндр и разрежьте на шесть равных частей. Скатайте каждый кусочек в круглую булочку и уложите в смазанную форму для маффинов. Накройте и дайте подняться до увеличения вдвое (около часа).',
        'es': 'Caliente la leche hasta que este tibia. Anade la levadura y disuelva.\n\nAnade el azucar, el cardamomo, la vainilla y aproximadamente 2/3 de la harina.\n\nMezcle la masa ya sea a mano o en una batidora con gancho para masa, anadiendo lentamente el resto de la harina. Puede necesitar un poco mas o menos de harina para formar una masa que no sea demasiado pegajosa para amasar. Cuando la masa forme una bola bonita, anade la mantequilla ablandada y continue amasando la masa durante unos diez minutos.\n\nEnrolle la masa en un cilindro y corte en seis partes iguales. Forme cada pieza en un bollo redondo y coloquelos en un molde de muffins engrasado. Cubra y deje reposar hasta que duplique su tamano (aproximadamente una hora).',
    },
    '53026': {
        'ro': 'Inmoaie boabele de bob in apa peste noapte. Scurge. Daca boabele fara piele nu sunt disponibile, freaca-le pentru a desprinde pielea, apoi arunca pielea. Usuca boabele cu un prosop.\nMacina boabele la o rasnita sau masina de tocat carne. Daca nu ai niciuna, proceseaza-le la robotul de bucatarie, dar doar pana cand boabele formeaza o pasta. (Daca sunt amestecate prea fin, aluatul tinde sa se destrame in timpul gatirii.) Adauga ceapa verde, usturoiul, coriandrul, chimonul, praful de copt, piperul cayenne, sarea, piperul si coriandrul macinat, daca folosesti. Refrigereaza cel putin 30 de minute.\nModeleaza amestecul de boabe in bilute de 2-3 cm. Aplatizeaza usor si acopera cu faina.\nIncinge cel putin 4 cm de ulei la foc mediu la 185 grade.\nPrajeste chiftelutele in serii, intorcandu-le o data, pana se rumenesc frumos pe toate partile, aproximativ 5 minute. Scoate cu o paleta cu gauri. Serveste ca parte a unui meze sau in paine pita cu salata de rosii si castraveti si sos de tahini.',
        'ru': 'Замочите бобы в воде на ночь. Слейте воду. Если бобы без кожицы недоступны, потрите их, чтобы снять кожицу, затем выбросьте кожицу. Промокните бобы полотенцем.\nПеремелите бобы в мельнице или мясорубке. Если нет ни того, ни другого, обработайте их в кухонном комбайне, но только до тех пор, пока бобы не образуют пасту. (Если измельчить слишком тонко, тесто может распадаться при жарке.) Добавьте зелёный лук, чеснок, кинзу, кумин, разрыхлитель, кайенский перец, соль, перец и молотый кориандр, если используете. Поставьте в холодильник минимум на 30 минут.\nСформируйте из бобовой массы шарики диаметром 2-3 см. Слегка приплюсните и обваляйте в муке.\nРазогрейте масло высотой не менее 4 см на среднем огне до 185 градусов.\nОбжаривайте котлетки порциями, переворачивая один раз, до золотисто-коричневого цвета со всех сторон, около 5 минут. Достаньте шумовкой. Подавайте как часть мезе или в лаваше с салатом из помидоров и огурцов и соусом тахини.',
        'es': 'Remoje los frijoles en agua durante la noche. Escurra. Si no hay frijoles sin piel disponibles, frotelos para aflojar las pieles, luego desechelas. Seque los frijoles con una toalla.\nMuela los frijoles en un molino o picadora de carne. Si no tiene ninguno, proceselos en un procesador de alimentos pero solo hasta que los frijoles formen una pasta. (Si se mezclan demasiado fino, la masa tiende a desmoronarse durante la coccion.) Anade las cebolletas, el ajo, el cilantro, el comino, el polvo de hornear, la pimienta de cayena, la sal, la pimienta y el cilantro molido, si lo usa. Refrigere al menos 30 minutos.\nForme la mezcla de frijoles en bolitas de 2-3 cm. Aplane ligeramente y cubra con harina.\nCaliente al menos 4 cm de aceite a fuego medio a 185 grados.\nFria las tortitas en tandas, volteando una vez, hasta que esten doradas por todos lados, aproximadamente 5 minutos. Retire con una espumadera. Sirva como parte de un meze o en pan pita con ensalada de tomate y pepino y salsa de tahini.',
    },
    '52806': {
        'ro': 'Amesteca sucul de lamaie cu boia si ceapa rosie intr-un vas mare si putin adanc. Cresteaza fiecare pulpa de pui de trei ori, apoi intoarce-le in suc si lasa deoparte 10 minute.\nAmesteca toate ingredientele pentru marinada si toarna peste pui. Amesteca bine totul, apoi acopera si pune la frigider cel putin 1 ora. Poate fi preparat cu o zi inainte.\nIncinge gratarul. Ridica bucatile de pui pe un gratar deasupra unei tavi de copt. Unge usor cu ulei si gratineaza 8 minute pe fiecare parte sau pana se rumeneste usor si este complet gatit.',
        'ru': 'Смешайте лимонный сок с паприкой и красным луком в большом неглубоком блюде. Сделайте по три надреза на каждом курином бёдрышке, затем переверните их в соке и отложите на 10 минут.\nСмешайте все ингредиенты маринада и залейте курицу. Хорошо всё перемешайте, затем накройте и поставьте в холодильник минимум на 1 час. Можно приготовить за день до подачи.\nРазогрейте гриль. Выложите кусочки курицы на решётку над противнем. Слегка смажьте маслом и обжаривайте на гриле по 8 минут с каждой стороны или пока курица слегка не обуглится и полностью не приготовится.',
        'es': 'Mezcle el jugo de limon con el pimenton y las cebollas moradas en un plato grande y poco profundo. Haga tres cortes en cada muslo de pollo, luego voltéelos en el jugo y reserve por 10 minutos.\nMezcle todos los ingredientes de la marinada y vierta sobre el pollo. Mezcle bien todo, luego cubra y refrigere al menos 1 hora. Se puede preparar con un dia de anticipacion.\nCaliente la parrilla. Coloque las piezas de pollo en una rejilla sobre una bandeja para hornear. Unte ligeramente con aceite y ase a la parrilla durante 8 minutos por cada lado o hasta que este ligeramente chamuscado y completamente cocido.',
    },
    '53312': {
        'ro': 'Pasul 1\nBate impreuna maioneza, coaja si sucul de lamaie, otetul, mustarul si sarea de telina intr-un bol mic, apoi condimenteaza din belsug.\n\nPasul 2\nAdauga varza, morcovii, ceapa si telina. Amesteca bine si pune la frigider. Se poate pregati cu o zi inainte.',
        'ru': 'Шаг 1\nВзбейте вместе майонез, цедру и сок лимона, уксус, горчицу и сельдерейную соль в небольшой миске, затем щедро приправьте.\n\nШаг 2\nДобавьте капусту, морковь, лук и сельдерей. Хорошо перемешайте и поставьте в холодильник. Можно приготовить за 1 день.',
        'es': 'Paso 1\nBata juntos la mayonesa, la ralladura y el jugo de limon, el vinagre, la mostaza y la sal de apio en un tazon pequeno, luego sazone generosamente.\n\nPaso 2\nAnade el repollo, las zanahorias, la cebolla y el apio. Mezcle bien y refrigere. Se puede preparar con 1 dia de anticipacion.',
    },
    '53246': {
        'ro': 'Pasul 1\nPune morcovii, varza si ceapa intr-un bol. Prepara sosul amestecand ingredientele pana cand zaharul se dizolva. Toarna peste salata, amestecand legumele in sos. Adauga ierburile aromatice, amesteca din nou, apoi presara arahidele deasupra.',
        'ru': 'Шаг 1\nПоложите морковь, капусту и лук в миску. Приготовьте заправку, перемешивая ингредиенты до растворения сахара. Полейте салат, перемешивая овощи в заправке. Добавьте зелень, снова перемешайте, затем посыпьте арахисом сверху.',
        'es': 'Paso 1\nColoque las zanahorias, el repollo y las cebollas en un tazon. Prepare el aderezo revolviendo los ingredientes hasta que el azucar se disuelva. Vierta sobre la ensalada, mezclando las verduras en el aderezo. Anade las hierbas, mezcle nuevamente y espolvoree los cacahuetes por encima.',
    },
    '52909': {
        'ro': 'Intinde aluatul intr-un cerc de 3mm grosime pe o suprafata usor infainata si taie un cerc de 24cm, folosind o farfurie ca ghid. Inteapa usor cu o furculita pe toata suprafata, inveleste in folie alimentara pe o tava de copt si pune la congelator in timp ce pregatesti merele.\nIncinge cuptorul la 180C/160C ventilator/gaz 4. Curata, taie in sferturi si scoate cotorul merelor. Pune zaharul intr-un vas ceramic de 20cm rezistent la flacara sau intr-o tigaie grea de 20cm rezistenta la cuptor si pune pe foc mediu-mare. Gateste zaharul 5-7 minute pana obtii un sirop de caramel chihlimbariu inchis care incepe sa fumege, apoi opreste focul si amesteca cele 60g de unt rece taiat cuburi.\nPentru asamblarea tartei Tatin, aseaza sferturile de mere foarte strans in cerc pe marginea vasului, cu partea rotunda in jos, apoi umple mijlocul in acelasi mod. Apasa usor cu mainile pentru a te asigura ca nu sunt goluri. Unge fructele cu untul topit.\nCoace in cuptor 30 de minute, apoi scoate si pune discul de aluat foietaj congelat deasupra - se va dezgheta rapid. Indoaie marginile in interiorul vasului si, cu un cutit, inteapa cateva gauri in aluat pentru a lasa aburul sa iasa. Coace inca 40-45 de minute pana cand aluatul este auriu si crocant.\nLasa sa se raceasca la temperatura camerei 1 ora inainte de a trece un cutit pe marginea vasului si de a-l rasturna pe o farfurie mare de servire suficient de adanca pentru a contine sucurile. Serveste cu smantana frantuzeasca sau inghetata de vanilie.',
        'ru': 'Раскатайте тесто в круг толщиной 3 мм на слегка посыпанной мукой поверхности и вырежьте круг диаметром 24 см, используя тарелку как шаблон. Слегка наколите вилкой по всей поверхности, заверните в плёнку на противне и заморозьте, пока готовите яблоки.\nРазогрейте духовку до 180C/160C вентилятор/газ 4. Очистите, разрежьте на четвертинки и удалите сердцевину яблок. Положите сахар в огнеупорную керамическую форму для тарт татен диаметром 20 см или в тяжёлую жаропрочную сковороду диаметром 20 см и поставьте на средне-сильный огонь. Варите сахар 5-7 минут до тёмного янтарного карамельного сиропа, который начинает дымиться, затем выключите огонь и вмешайте 60 г нарезанного кубиками холодного масла.\nДля сборки тарт татен разложите четвертинки яблок очень плотно кругом по краю формы, округлой стороной вниз, затем заполните середину таким же образом. Аккуратно прижмите руками, чтобы не было зазоров. Смажьте фрукты растопленным маслом.\nВыпекайте в духовке 30 минут, затем достаньте и положите диск замороженного слоёного теста сверху - он быстро оттает. Подверните края внутрь формы и ножом проколите несколько отверстий в тесте, чтобы выходил пар. Выпекайте ещё 40-45 минут до золотисто-коричневого и хрустящего теста.\nОставьте остывать до комнатной температуры на 1 час, затем проведите ножом по краю формы и переверните на большое сервировочное блюдо, достаточно глубокое для соков. Подавайте с крем-фреш или ванильным мороженым.',
        'es': 'Estire la masa en un circulo de 3mm de grosor sobre una superficie ligeramente enharinada y corte un circulo de 24cm, usando un plato como guia. Pinche ligeramente con un tenedor por toda la superficie, envuelva en plastico sobre una bandeja para hornear y congele mientras prepara las manzanas.\nCaliente el horno a 180C/160C ventilador/gas 4. Pele, corte en cuartos y descorazone las manzanas. Ponga el azucar en un molde ceramico para tarta tatin de 20cm resistente al fuego o en una sarten pesada de 20cm apta para horno y coloque a fuego medio-alto. Cocine el azucar durante 5-7 minutos hasta obtener un jarabe de caramelo ambar oscuro que empiece a humear, luego apague el fuego e incorpore los 60g de mantequilla fria cortada en cubos.\nPara armar la tarta tatin, acomode los cuartos de manzana muy apretados en circulo alrededor del borde del molde primero, con el lado redondeado hacia abajo, luego rellene el centro de la misma manera. Presione suavemente con las manos para asegurarse de que no haya espacios. Unte la fruta con la mantequilla derretida.\nHornee durante 30 minutos, luego retire y coloque el disco de masa de hojaldre congelada encima, se descongelara rapidamente. Meta los bordes dentro del molde y con un cuchillo haga algunos agujeros en la masa para que salga el vapor. Hornee durante 40-45 minutos mas hasta que la masa este dorada y crujiente.\nDeje enfriar a temperatura ambiente durante 1 hora antes de pasar un cuchillo alrededor del borde del molde y voltear sobre un plato grande de servir lo suficientemente profundo para contener los jugos. Sirva con crema fresca o helado de vainilla.',
    },
    '52772': {
        'ro': 'Preincalzeste cuptorul la 175°C. Unge o tava de copt de 23x33cm cu spray antiadeziv.\nCombina sosul de soia, jumatate de cana de apa, zaharul brun, ghimbirul si usturoiul intr-o craticioara mica si acopera. Adu la fierbere la foc mediu. Scoate capacul si gateste un minut dupa ce fierbe.\nIntre timp, amesteca amidonul de porumb cu 2 linguri de apa intr-un vas separat pana devine neted. Cand sosul fierbe, adauga amestecul in craticioara si amesteca. Gateste pana cand sosul incepe sa se ingroase, apoi scoate de pe foc.\nPune pieptul de pui in tava pregatita. Toarna o cana de sos peste pui. Pune puiul in cuptor si coace 35 de minute sau pana se gateste complet. Scoate din cuptor si sfarama puiul in vas folosind doua furculite.\n*Intre timp, gateste legumele la abur sau conform instructiunilor de pe ambalaj.\nAdauga legumele gatite si orezul in tava cu puiul. Adauga cea mai mare parte din sosul ramas, pastrand putin pentru a stropii deasupra la servire. Amesteca usor totul in tava pana se combina. Pune din nou la cuptor si gateste 15 minute. Scoate din cuptor si lasa sa stea 5 minute inainte de servire. Stropeste fiecare portie cu sosul ramas. Pofta buna!',
        'ru': 'Разогрейте духовку до 175°C. Смажьте форму для запекания 23x33 см антипригарным спреем.\nСоедините соевый соус, полстакана воды, коричневый сахар, имбирь и чеснок в маленькой кастрюле и накройте крышкой. Доведите до кипения на среднем огне. Снимите крышку и варите одну минуту после закипания.\nТем временем размешайте кукурузный крахмал с 2 столовыми ложками воды в отдельной посуде до однородности. Когда соус закипит, добавьте смесь в кастрюлю и перемешайте. Варите, пока соус не начнёт густеть, затем снимите с огня.\nПоложите куриные грудки в подготовленную форму. Залейте одним стаканом соуса поверх курицы. Поставьте курицу в духовку и запекайте 35 минут или до полной готовности. Достаньте из духовки и разберите курицу на волокна в форме двумя вилками.\n*Тем временем приготовьте овощи на пару или согласно инструкции на упаковке.\nДобавьте приготовленные овощи и рис к курице в форму для запекания. Добавьте большую часть оставшегося соуса, оставив немного для поливания при подаче. Аккуратно перемешайте всё в форме до однородности. Верните в духовку и готовьте 15 минут. Достаньте из духовки и дайте постоять 5 минут перед подачей. Полейте каждую порцию оставшимся соусом. Приятного аппетита!',
        'es': 'Precaliente el horno a 175°C. Rocié un molde para hornear de 23x33cm con spray antiadherente.\nCombine la salsa de soja, media taza de agua, el azucar moreno, el jengibre y el ajo en una cacerola pequena y tape. Lleve a ebullicion a fuego medio. Retire la tapa y cocine un minuto despues de hervir.\nMientras tanto, mezcle la maicena con 2 cucharadas de agua en un recipiente aparte hasta que quede suave. Cuando la salsa hierva, anade la mezcla a la cacerola y revuelva. Cocine hasta que la salsa empiece a espesar, luego retire del fuego.\nColoque las pechugas de pollo en el molde preparado. Vierta una taza de salsa sobre el pollo. Coloque el pollo en el horno y hornee 35 minutos o hasta que este completamente cocido. Retire del horno y deshebré el pollo en el molde usando dos tenedores.\n*Mientras tanto, cocine las verduras al vapor o segun las instrucciones del paquete.\nAnade las verduras cocidas y el arroz al molde con el pollo. Anade la mayor parte de la salsa restante, reservando un poco para rociar encima al servir. Mezcle suavemente todo en el molde hasta combinar. Regrese al horno y cocine 15 minutos. Retire del horno y deje reposar 5 minutos antes de servir. Rocié cada porcion con la salsa restante. !A disfrutar!',
    },
}

# For recipes not in INSTRUCTIONS dict, we'll need to handle them too.
# Due to the massive number of recipes, I'll write a more efficient approach:
# Read the files, and for each recipe that needs translation,
# provide the full translation inline.

def escape_ts(s):
    """Escape for TypeScript single-quoted strings"""
    # The string already has \' in the TS file for apostrophes
    # We need to make sure our translations also escape apostrophes
    return s.replace("'", "\\'")

def process_file(filepath):
    """Read file, fully translate all recipes, write back."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # For each recipe name that needs translation
    for recipe_id, names in RECIPE_NAMES.items():
        # Find and replace recipe names
        # The pattern is: id: 'XXXXX',\n    name: { en: '...', ro: '...', ru: '...', es: '...' }
        pass  # We'll do regex replacements below

    # For each ingredient that needs translation
    for en_name, translations in INGREDIENT_NAMES.items():
        ro = escape_ts(translations['ro'])
        ru = escape_ts(translations['ru'])
        es = escape_ts(translations['es'])
        en_escaped = re.escape(en_name)

        # Replace ingredient name patterns where ro/ru/es still equals English
        # Pattern: { en: 'English Name', ro: 'English Name', ru: 'English Name', es: 'English Name' }
        # We need to handle cases where some are already translated and some aren't

        # Replace all occurrences where the ingredient still has English in ro/ru/es
        # Match the full name object for this ingredient
        pattern = r"\{ name: \{ en: '" + en_escaped + r"', ro: '[^']*', ru: '[^']*', es: '[^']*' \}"
        replacement = "{ name: { en: '" + escape_ts(en_name) + "', ro: '" + ro + "', ru: '" + ru + "', es: '" + es + "' }"
        content = re.sub(pattern, replacement, content)

    return content

# Actually, let me take a different and more robust approach.
# I'll parse the TS files more carefully and do targeted replacements.

print("This script approach is being replaced by a more comprehensive one.")
