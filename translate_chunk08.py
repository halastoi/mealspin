#!/usr/bin/env python3
"""Translate recipes_chunk08.ts - all ro/ru/es fields."""
import re, sys

INPUT = '/data/data/com.termux/files/home/dev/mealspin/src/data/recipes_chunk08.ts'

with open(INPUT, 'r', encoding='utf-8') as f:
    content = f.read()

# Ingredient translations: en -> {ro, ru, es}
ING = {
    'Olive Oil': ('ulei de masline', 'оливковое масло', 'aceite de oliva'),
    'olive oil': ('ulei de masline', 'оливковое масло', 'aceite de oliva'),
    'Red Chilli': ('ardei iute rosu', 'красный перец чили', 'chile rojo'),
    'Thai red curry paste': ('pasta de curry rosu thailandez', 'тайская паста красного карри', 'pasta de curry rojo tailandes'),
    'vegetable stock cube': ('cub de supa de legume', 'кубик овощного бульона', 'cubo de caldo de verduras'),
    'coconut milk': ('lapte de cocos', 'кокосовое молоко', 'leche de coco'),
    'fish sauce': ('sos de peste', 'рыбный соус', 'salsa de pescado'),
    'rice noodles': ('taitei de orez', 'рисовая лапша', 'fideos de arroz'),
    'lime': ('lime', 'лайм', 'lima'),
    'king prawns': ('creveti mari', 'королевские креветки', 'langostinos'),
    'coriander': ('coriandru', 'кориандр', 'cilantro'),
    'Red Onions': ('ceapa rosie', 'красный лук', 'cebollas moradas'),
    'Garlic': ('usturoi', 'чеснок', 'ajo'),
    'garlic': ('usturoi', 'чеснок', 'ajo'),
    'Ground Cumin': ('chimion macinat', 'молотый кумин', 'comino molido'),
    'Ground Coriander': ('coriandru macinat', 'молотый кориандр', 'cilantro molido'),
    'Tinned Tomatos': ('rosii conservate', 'консервированные помидоры', 'tomates enlatados'),
    'Sugar': ('zahar', 'сахар', 'azucar'),
    'Mint': ('menta', 'мята', 'menta'),
    'Lamb Mince': ('carne tocata de miel', 'бараний фарш', 'carne molida de cordero'),
    'Dried Apricots': ('caise uscate', 'курага', 'chabacanos secos'),
    'Breadcrumbs': ('pesmet', 'панировочные сухари', 'pan rallado'),
    'Pita Bread': ('paine pita', 'лаваш', 'pan pita'),
    'Sea Salt': ('sare de mare', 'морская соль', 'sal de mar'),
    'Lemon': ('lamaie', 'лимон', 'limon'),
    'Dill': ('marar', 'укроп', 'eneldo'),
    'Lamb Leg': ('pulpa de miel', 'нога ягнёнка', 'pierna de cordero'),
    'Lamb Shoulder': ('spata de miel', 'лопатка ягнёнка', 'paleta de cordero'),
    'Flour': ('faina', 'мука', 'harina'),
    'Vegetable Oil': ('ulei vegetal', 'растительное масло', 'aceite vegetal'),
    'Onion': ('ceapa', 'лук', 'cebolla'),
    'Onions': ('ceapa', 'лук', 'cebollas'),
    'Carrots': ('morcovi', 'морковь', 'zanahorias'),
    'Vegetable Stock': ('supa de legume', 'овощной бульон', 'caldo de verduras'),
    'Potatoes': ('cartofi', 'картофель', 'papas'),
    'Shortcrust Pastry': ('aluat fraged', 'песочное тесто', 'masa quebrada'),
    'Eggs': ('oua', 'яйца', 'huevos'),
    'Egg': ('ou', 'яйцо', 'huevo'),
    'Cashew nuts': ('nuci caju', 'кешью', 'nueces de la India'),
    'Khus khus': ('seminte de mac', 'мак', 'semillas de amapola'),
    'Cumin seeds': ('seminte de chimion', 'семена кумина', 'semillas de comino'),
    'Cumin Seeds': ('seminte de chimion', 'семена кумина', 'semillas de comino'),
    'Ginger garlic paste': ('pasta de ghimbir si usturoi', 'паста из имбиря и чеснока', 'pasta de jengibre y ajo'),
    'Cilantro': ('coriandru', 'кинза', 'cilantro'),
    'Saffron': ('sofran', 'шафран', 'azafran'),
    'Ghee': ('ghee', 'гхи', 'ghee'),
    'Basmati rice': ('orez basmati', 'рис басмати', 'arroz basmati'),
    'basmati rice': ('orez basmati', 'рис басмати', 'arroz basmati'),
    'Full fat yogurt': ('iaurt gras', 'жирный йогурт', 'yogur entero'),
    'Bay leaf': ('frunza de dafin', 'лавровый лист', 'hoja de laurel'),
    'Cinnamon': ('scortisoara', 'корица', 'canela'),
    'Cloves': ('cuisoare', 'гвоздика', 'clavos'),
    'Cardamom': ('cardamon', 'кардамон', 'cardamomo'),
    'Lamb': ('miel', 'баранина', 'cordero'),
    'Red Chilli powder': ('pudra de ardei iute', 'порошок красного перца чили', 'chile rojo en polvo'),
    'Biryani masala': ('condiment biryani', 'приправа для бирьяни', 'masala para biryani'),
    'Prunes': ('prune uscate', 'чернослив', 'ciruelas pasas'),
    'Lemon Juice': ('suc de lamaie', 'лимонный сок', 'jugo de limon'),
    'Butter': ('unt', 'сливочное масло', 'mantequilla'),
    'Rice': ('orez', 'рис', 'arroz'),
    'Parsley': ('patrunjel', 'петрушка', 'perejil'),
    'chopped parsley': ('patrunjel tocat', 'рубленая петрушка', 'perejil picado'),
    'Sunflower Oil': ('ulei de floarea soarelui', 'подсолнечное масло', 'aceite de girasol'),
    'Ginger': ('ghimbir', 'имбирь', 'jengibre'),
    'Madras Paste': ('pasta madras', 'паста мадрас', 'pasta madras'),
    'Paprika': ('boia', 'паприка', 'pimenton'),
    'cinnamon stick': ('bat de scortisoara', 'палочка корицы', 'raja de canela'),
    'Cinnamon stick': ('bat de scortisoara', 'палочка корицы', 'raja de canela'),
    'Bay Leaf': ('frunza de dafin', 'лавровый лист', 'hoja de laurel'),
    'Bay Leaves': ('frunze de dafin', 'лавровые листья', 'hojas de laurel'),
    'Tomato Purée': ('pasta de tomate', 'томатная паста', 'pure de tomate'),
    'Tomato Puree': ('pasta de tomate', 'томатная паста', 'pure de tomate'),
    'Greek yogurt': ('iaurt grecesc', 'греческий йогурт', 'yogur griego'),
    'Greek Yogurt': ('iaurt grecesc', 'греческий йогурт', 'yogur griego'),
    'Coriander': ('coriandru', 'кориандр', 'cilantro'),
    'Cumin': ('chimion', 'кумин', 'comino'),
    'Honey': ('miere', 'мёд', 'miel'),
    'Apricot': ('caise', 'абрикос', 'chabacano'),
    'Vegetable Stock Cube': ('cub de supa de legume', 'кубик овощного бульона', 'cubo de caldo de verduras'),
    'Butternut Squash': ('dovleac butternut', 'мускатная тыква', 'calabaza butternut'),
    'Couscous': ('cuscus', 'кускус', 'cuscus'),
    'ginger': ('ghimbir', 'имбирь', 'jengibre'),
    'tomatoes': ('rosii', 'помидоры', 'tomates'),
    'lemon juice': ('suc de lamaie', 'лимонный сок', 'jugo de limon'),
    'caster sugar': ('zahar fin', 'мелкий сахар', 'azucar extrafina'),
    'vine leaves': ('frunze de vita de vie', 'виноградные листья', 'hojas de parra'),
    'fennel bulb': ('bulb de fenicul', 'луковица фенхеля', 'bulbo de hinojo'),
    'lamb mince': ('carne tocata de miel', 'бараний фарш', 'carne molida de cordero'),
    'onion': ('ceapa', 'лук', 'cebolla'),
    'potatoes': ('cartofi', 'картофель', 'papas'),
    'clove': ('cuisoara', 'гвоздика', 'clavo'),
    'cinnamon': ('scortisoara', 'корица', 'canela'),
    'Bulgur Wheat': ('grau bulgur', 'булгур', 'trigo bulgur'),
    'Bun': ('chifluta', 'булочка', 'pan para hamburguesa'),
    'Cucumber': ('castravete', 'огурец', 'pepino'),
    'Salted Butter': ('unt sarat', 'солёное сливочное масло', 'mantequilla con sal'),
    'Golden Caster Sugar': ('zahar fin auriu', 'золотистый мелкий сахар', 'azucar dorada'),
    'Self-raising Flour': ('faina cu drojdie', 'мука с разрыхлителем', 'harina leudante'),
    'Milk': ('lapte', 'молоко', 'leche'),
    'Salt': ('sare', 'соль', 'sal'),
    'salt': ('sare', 'соль', 'sal'),
    'Double Cream': ('smantana grasa', 'жирные сливки', 'crema doble'),
    'Icing Sugar': ('zahar pudra', 'сахарная пудра', 'azucar glass'),
    'Raspberry Jam': ('gem de zmeura', 'малиновый джем', 'mermelada de frambuesa'),
    'Desiccated Coconut': ('nuca de cocos rasa', 'кокосовая стружка', 'coco rallado'),
    'Unsalted Butter': ('unt nesarat', 'несолёное сливочное масло', 'mantequilla sin sal'),
    'Cocoa Powder': ('cacao pudra', 'какао-порошок', 'cacao en polvo'),
    'Lamb Kidney': ('rinichi de miel', 'бараньи почки', 'rinones de cordero'),
    'Plain Flour': ('faina alba', 'пшеничная мука', 'harina comun'),
    'Worcestershire Sauce': ('sos Worcestershire', 'вустерский соус', 'salsa Worcestershire'),
    'Chicken Stock': ('supa de pui', 'куриный бульон', 'caldo de pollo'),
    'Sour Cream': ('smantana', 'сметана', 'crema agria'),
    'Chopped Onion': ('ceapa tocata', 'нарезанный лук', 'cebolla picada'),
    'Dried Oregano': ('oregano uscat', 'сушёный орегано', 'oregano seco'),
    'Bread': ('paine', 'хлеб', 'pan'),
    'Bacon': ('bacon', 'бекон', 'tocino'),
    'Tomato': ('rosie', 'помидор', 'tomate'),
    'Mozzarella': ('mozzarella', 'моцарелла', 'mozzarella'),
    'Celery': ('telina', 'сельдерей', 'apio'),
    'Minced Beef': ('carne tocata de vita', 'говяжий фарш', 'carne molida de res'),
    'Chopped Tomatoes': ('rosii tocate', 'нарезанные помидоры', 'tomates picados'),
    'Lasagne Sheets': ('foi de lasagna', 'листы лазаньи', 'laminas de lasana'),
    'Creme Fraiche': ('smantana frantuzeasca', 'крем-фреш', 'crema fresca'),
    'Mozzarella Balls': ('bile de mozzarella', 'шарики моцареллы', 'bolitas de mozzarella'),
    'mozzarella balls': ('bile de mozzarella', 'шарики моцареллы', 'bolitas de mozzarella'),
    'Parmesan Cheese': ('parmezan', 'пармезан', 'queso parmesano'),
    'Basil Leaves': ('frunze de busuioc', 'листья базилика', 'hojas de albahaca'),
    'Chickpeas': ('naut', 'нут', 'garbanzos'),
    'Harissa Spice': ('condiment harissa', 'приправа харисса', 'especia harissa'),
    'Pepper': ('piper', 'перец', 'pimienta'),
    'pepper': ('piper', 'перец', 'pimienta'),
    'Lime': ('lime', 'лайм', 'lima'),
    'Garlic Clove': ('catel de usturoi', 'зубчик чеснока', 'diente de ajo'),
    'Lemongrass Stalks': ('tulpini de lemongrass', 'стебли лемонграсса', 'tallos de hierba limon'),
    'Coriander Leaves': ('frunze de coriandru', 'листья кориандра', 'hojas de cilantro'),
    'Cilantro Leaves': ('frunze de coriandru', 'листья кинзы', 'hojas de cilantro'),
    'Beef': ('carne de vita', 'говядина', 'carne de res'),
    'Soy Sauce': ('sos de soia', 'соевый соус', 'salsa de soja'),
    'Five Spice Powder': ('pudra cinci condimente', 'порошок пяти специй', 'polvo de cinco especias'),
    'Brown Sugar': ('zahar brun', 'коричневый сахар', 'azucar morena'),
    'Beef Stock': ('supa de vita', 'говяжий бульон', 'caldo de res'),
    'Rice Noodles': ('taitei de orez', 'рисовая лапша', 'fideos de arroz'),
    'Dried white corn': ('porumb alb uscat', 'сушёная белая кукуруза', 'maiz blanco seco'),
    'Dried white beans': ('fasole alba uscata', 'сушёная белая фасоль', 'frijoles blancos secos'),
    'Pumpkin': ('dovleac', 'тыква', 'calabaza'),
    'Pork': ('carne de porc', 'свинина', 'cerdo'),
    'Chorizo': ('chorizo', 'чоризо', 'chorizo'),
    'Tofu': ('tofu', 'тофу', 'tofu'),
    'Sesame Seed Oil': ('ulei de susan', 'кунжутное масло', 'aceite de ajonjoli'),
    'Doubanjiang': ('doubanjiang', 'доубаньцзян', 'doubanjiang'),
    'Fermented Black Beans': ('fasole neagra fermentata', 'ферментированные чёрные бобы', 'frijoles negros fermentados'),
    'Sichuan pepper': ('piper Sichuan', 'сычуаньский перец', 'pimienta de Sichuan'),
    'Water': ('apa', 'вода', 'agua'),
    'Scallions': ('ceapa verde', 'зелёный лук', 'cebollitas de cambray'),
    'Spring Onions': ('ceapa verde', 'зелёный лук', 'cebollitas de cambray'),
    'Cornstarch': ('amidon de porumb', 'кукурузный крахмал', 'fecula de maiz'),
    'Caster Sugar': ('zahar fin', 'мелкий сахар', 'azucar extrafina'),
    'Mixed Peel': ('coaja de fructe confiate', 'цукаты', 'frutas confitadas'),
    'Semolina': ('gris', 'манная крупа', 'semola'),
    'Peanuts': ('arahide', 'арахис', 'cacahuates'),
    'Coconut cream': ('crema de cocos', 'кокосовые сливки', 'crema de coco'),
    'Coconut Cream': ('crema de cocos', 'кокосовые сливки', 'crema de coco'),
    'Massaman curry paste': ('pasta de curry massaman', 'паста карри массаман', 'pasta de curry massaman'),
    'Tamarind paste': ('pasta de tamarind', 'паста из тамаринда', 'pasta de tamarindo'),
    'Tamarind Paste': ('pasta de tamarind', 'паста из тамаринда', 'pasta de tamarindo'),
    'Fish Sauce': ('sos de peste', 'рыбный соус', 'salsa de pescado'),
    'chilli': ('ardei iute', 'чили', 'chile'),
    'Chilli': ('ardei iute', 'чили', 'chile'),
    'Jasmine Rice': ('orez jasmine', 'жасминовый рис', 'arroz jazmin'),
    'Beef Flank Steak': ('carne de vita flank', 'говяжий фланк стейк', 'arrachera de res'),
    'Tomato Sauce': ('sos de rosii', 'томатный соус', 'salsa de tomate'),
    'Oregano': ('oregano', 'орегано', 'oregano'),
    'Green Olives': ('masline verzi', 'зелёные оливки', 'aceitunas verdes'),
    'Paneer': ('paneer', 'панир', 'paneer'),
    'Turmeric': ('turmeric', 'куркума', 'curcuma'),
    'Green Chilli': ('ardei iute verde', 'зелёный перец чили', 'chile verde'),
    'Peas': ('mazare', 'горох', 'chicharos'),
    'Garam Masala': ('garam masala', 'гарам масала', 'garam masala'),
    'Naan Bread': ('paine naan', 'хлеб наан', 'pan naan'),
    'Powdered Sugar': ('zahar pudra', 'сахарная пудра', 'azucar glass'),
    'Vanilla Extract': ('extract de vanilie', 'ванильный экстракт', 'extracto de vainilla'),
    'Almond Flour': ('faina de migdale', 'миндальная мука', 'harina de almendras'),
    'Almond Extract': ('extract de migdale', 'миндальный экстракт', 'extracto de almendras'),
    'Heavy Cream': ('smantana grasa', 'жирные сливки', 'crema para batir'),
    'Goat Meat': ('carne de capra', 'козлятина', 'carne de cabra'),
    'Corn Flour': ('faina de porumb', 'кукурузная мука', 'harina de maiz'),
    'Tomatoes': ('rosii', 'помидоры', 'tomates'),
    'Rapeseed Oil': ('ulei de rapita', 'рапсовое масло', 'aceite de canola'),
    'Red Pepper': ('ardei rosu', 'красный перец', 'pimiento rojo'),
    'Nutmeg': ('nucsoara', 'мускатный орех', 'nuez moscada'),
    'Lard': ('untura', 'свиной жир', 'manteca de cerdo'),
    'Egg Yolks': ('galbenusuri', 'яичные желтки', 'yemas de huevo'),
    'baby plum tomatoes': ('rosii cherry', 'помидоры черри', 'tomates cherry'),
    'fresh basil': ('busuioc proaspat', 'свежий базилик', 'albahaca fresca'),
    'farfalle': ('farfalle', 'фарфалле', 'farfalle'),
    'extra virgin olive oil': ('ulei de masline extravirgin', 'оливковое масло extra virgin', 'aceite de oliva extra virgen'),
    'tuna': ('ton', 'тунец', 'atun'),
    'Prawns': ('creveti', 'креветки', 'camarones'),
    'Oil': ('ulei', 'масло', 'aceite'),
    'Cabbage': ('varza', 'капуста', 'repollo'),
    'Chinese Broccoli': ('broccoli chinezesc', 'китайская брокколи', 'brocoli chino'),
    'Noodles': ('taitei', 'лапша', 'fideos'),
    'Mushrooms': ('ciuperci', 'грибы', 'champiñones'),
    'Mincemeat': ('carne tocata', 'фарш', 'carne molida'),
    'Filo Pastry': ('aluat filo', 'тесто фило', 'masa filo'),
    'Melted Butter': ('unt topit', 'растопленное масло', 'mantequilla derretida'),
    'Allspice': ('piment', 'душистый перец', 'pimienta de Jamaica'),
    'Black Pepper': ('piper negru', 'чёрный перец', 'pimienta negra'),
    'Coconut Milk': ('lapte de cocos', 'кокосовое молоко', 'leche de coco'),
    'Beef Brisket': ('piept de vita', 'грудинка говяжья', 'pecho de res'),
    'English Mustard': ('mustar englezesc', 'английская горчица', 'mostaza inglesa'),
    'Celery Salt': ('sare de telina', 'сельдерейная соль', 'sal de apio'),
    'Red Pepper Flakes': ('fulgi de ardei rosu', 'хлопья красного перца', 'hojuelas de chile rojo'),
    'Red Chilli Flakes': ('fulgi de ardei iute rosu', 'хлопья красного перца чили', 'hojuelas de chile rojo'),
    'Aubergine': ('vinete', 'баклажан', 'berenjena'),
    'Parmesan': ('parmezan', 'пармезан', 'parmesano'),
    'Mulukhiyah': ('mulukhiyah', 'мулухия', 'mulukhiyah'),
    'Chestnuts': ('castane', 'каштаны', 'castanas'),
    'Challots': ('salote', 'шалот', 'chalotes'),
    'Shallots': ('salote', 'шалот', 'chalotes'),
    'Rosemary': ('rozmarin', 'розмарин', 'romero'),
    'Wild Mushrooms': ('ciuperci salbatice', 'лесные грибы', 'hongos silvestres'),
    'White Wine': ('vin alb', 'белое вино', 'vino blanco'),
    'Sage': ('salvie', 'шалфей', 'salvia'),
    'Truffle Oil': ('ulei de trufe', 'трюфельное масло', 'aceite de trufa'),
    'Buckwheat': ('hrisca', 'гречка', 'trigo sarraceno'),
    'White Wine Vinegar': ('otet de vin alb', 'белый винный уксус', 'vinagre de vino blanco'),
    'Mustard': ('mustar', 'горчица', 'mostaza'),
    'Spinach': ('spanac', 'шпинат', 'espinaca'),
    'Feta': ('branza feta', 'фета', 'queso feta'),
    'Dark Rum': ('rom inchis', 'тёмный ром', 'ron oscuro'),
    'Raisins': ('stafide', 'изюм', 'pasas'),
    'Condensed Milk': ('lapte condensat', 'сгущённое молоко', 'leche condensada'),
    'Ground Cinnamon': ('scortisoara macinata', 'молотая корица', 'canela molida'),
    'Sugar Snap Peas': ('mazare dulce', 'сахарный горошек', 'chicharos dulces'),
    'Hot Smoked Flaked Salmon': ('somon afumat la cald', 'хлопья горячего копчёного лосося', 'salmon ahumado en hojuelas'),
    'Pretzels': ('covrigei', 'крендельки', 'pretzels'),
    'Clear Honey': ('miere limpede', 'жидкий мёд', 'miel clara'),
    'Ground Nut Oil': ('ulei de arahide', 'арахисовое масло', 'aceite de cacahuate'),
    'Horseradish': ('hrean', 'хрен', 'rabano picante'),
    'White Asparagus': ('sparanghel alb', 'белая спаржа', 'esparrago blanco'),
    'Asparagus': ('sparanghel', 'спаржа', 'esparrago'),
    'Rye Bread': ('paine de secara', 'ржаной хлеб', 'pan de centeno'),
    'västerbottensost cheese': ('branza vasterbottensost', 'сыр вестерботтенсост', 'queso vasterbottensost'),
    'Baking Powder': ('praf de copt', 'разрыхлитель', 'polvo para hornear'),
    'All purpose flour': ('faina universala', 'мука общего назначения', 'harina de uso general'),
    'Granulated Sugar': ('zahar granulat', 'сахарный песок', 'azucar granulada'),
    'Chicken Breasts': ('piept de pui', 'куриные грудки', 'pechugas de pollo'),
    'Peanut Butter': ('unt de arahide', 'арахисовая паста', 'crema de cacahuate'),
    'Squid': ('calamar', 'кальмар', 'calamar'),
    'Szechuan Peppercorns': ('boabe de piper Sichuan', 'сычуаньский перец горошком', 'pimienta de Sichuan en grano'),
    'Rice Vinegar': ('otet de orez', 'рисовый уксус', 'vinagre de arroz'),
    'Jersey Royal Potatoes': ('cartofi Jersey Royal', 'картофель Джерси Ройял', 'papas Jersey Royal'),
    'Salt Cod': ('cod sarat', 'солёная треска', 'bacalao salado'),
    'Digestive Biscuits': ('biscuiti digestivi', 'печенье дигестив', 'galletas digestivas'),
    'Cream Cheese': ('crema de branza', 'сливочный сыр', 'queso crema'),
    'Caramel': ('caramel', 'карамель', 'caramelo'),
    'Sauerkraut': ('varza murata', 'квашеная капуста', 'chucrut'),
    'Hispi (sweetheart) Cabbage': ('varza hispi', 'капуста хиспи', 'repollo hispi'),
    'Sea Bass Fillets': ('file de biban de mare', 'филе сибаса', 'filetes de lubina'),
    'Mussels': ('midii', 'мидии', 'mejillones'),
    'Vermicelli Pasta': ('vermicelli', 'вермишель', 'fideos vermicelli'),
    'Monkfish': ('peste calugar', 'морской чёрт', 'rape'),
    'Baby Squid': ('calamar mic', 'маленькие кальмары', 'calamar bebe'),
    'Fish Stock': ('supa de peste', 'рыбный бульон', 'caldo de pescado'),
    'Leek': ('praz', 'лук-порей', 'puerro'),
    'Frozen Seafood mix': ('amestec de fructe de mare congelate', 'замороженная смесь морепродуктов', 'mezcla de mariscos congelados'),
    'Sesame Seed': ('seminte de susan', 'кунжутные семена', 'semillas de ajonjoli'),
    'Extra Virgin Olive Oil': ('ulei de masline extravirgin', 'оливковое масло extra virgin', 'aceite de oliva extra virgen'),
    'Cherry Tomatoes': ('rosii cherry', 'помидоры черри', 'tomates cherry'),
    'Chicken Thighs': ('pulpe de pui', 'куриные бёдра', 'muslos de pollo'),
    'Cayenne Pepper': ('piper cayenne', 'кайенский перец', 'pimienta de cayena'),
    'Lettuce': ('salata verde', 'салат-латук', 'lechuga'),
    'Dried White Navy Beans': ('fasole navy alba uscata', 'сушёная белая фасоль навы', 'frijoles blancos secos'),
    'Molasses': ('melasa', 'патока', 'melaza'),
    'Cider Vinegar': ('otet de cidru', 'яблочный уксус', 'vinagre de sidra'),
    'Beef Cutlet': ('snitzel de vita', 'говяжья котлета', 'milanesa de res'),
    'Hot Chilli Powder': ('pudra de ardei iute', 'порошок острого перца', 'chile en polvo picante'),
    'Kidney Beans': ('fasole rosie', 'красная фасоль', 'frijoles rojos'),
    'Chopped Chive': ('chives tocate', 'нарезанный шнитт-лук', 'cebollino picado'),
    'Ready rolled shortcrust pastry': ('aluat fraged intins', 'готовое раскатанное песочное тесто', 'masa quebrada preestirada'),
    'Peanut Oil': ('ulei de arahide', 'арахисовое масло', 'aceite de cacahuate'),
    'Snow Peas': ('mazare de zahar', 'стручковый горошек', 'chicharos chinos'),
    'Chuck Roast': ('carne de vita pentru fript', 'говяжья лопатка', 'carne de res para asar'),
    'Ground Ginger': ('ghimbir macinat', 'молотый имбирь', 'jengibre molido'),
    'Ground Clove': ('cuisoare macinate', 'молотая гвоздика', 'clavo molido'),
    'Rice Stick Noodles': ('taitei lati de orez', 'рисовая лапша', 'fideos de arroz'),
    'Minced Garlic': ('usturoi tocat', 'измельчённый чеснок', 'ajo picado'),
    'Bean Sprouts': ('germeni de soia', 'ростки бобов', 'germinado de soya'),
    'Cooking wine': ('vin de gatit', 'кулинарное вино', 'vino de cocina'),
    'Oyster Sauce': ('sos de stridii', 'устричный соус', 'salsa de ostion'),
    'Vinegar': ('otet', 'уксус', 'vinagre'),
    'Dry sherry': ('sherry sec', 'сухой херес', 'jerez seco'),
    'Kosher Salt': ('sare kosher', 'кошерная соль', 'sal kosher'),
    'Shrimp': ('creveti', 'креветки', 'camarones'),
    'Egg Plants': ('vinete', 'баклажаны', 'berenjenas'),
    'Chilli Bean Paste': ('pasta de ardei iute cu fasole', 'паста из перца чили с бобами', 'pasta de chile con frijol'),
    'Sichuan Pepper': ('piper Sichuan', 'сычуаньский перец', 'pimienta de Sichuan'),
    'Apple Cider Vinegar': ('otet de cidru de mere', 'яблочный уксус', 'vinagre de sidra de manzana'),
    'Chinese Long Beans': ('fasole lunga chinezeasca', 'китайская длинная фасоль', 'ejotes largos chinos'),
    'Dried Chillies': ('ardei iuti uscati', 'сушёный перец чили', 'chiles secos'),
    'Silken Tofu': ('tofu matasos', 'шёлковый тофу', 'tofu sedoso'),
    'Chinese Sesame Sauce': ('sos de susan chinezesc', 'китайский кунжутный соус', 'salsa china de ajonjoli'),
    'Seasoned Rice Vinegar': ('otet de orez condimentat', 'приправленный рисовый уксус', 'vinagre de arroz sazonado'),
    'Vermicelli Rice Noodles': ('taitei de orez vermicelli', 'рисовая вермишель', 'fideos de arroz vermicelli'),
    'Jalapeno': ('jalapeno', 'халапеньо', 'jalapeno'),
    'Ham': ('sunca', 'ветчина', 'jamon'),
    'Napa Cabbage': ('varza napa', 'пекинская капуста', 'col napa'),
    'Curry Powder': ('pudra de curry', 'порошок карри', 'curry en polvo'),
}

# Translate ingredient names in the content
# Match pattern: { name: { en: 'X', ro: 'X', ru: 'X', es: 'X' }
def replace_ingredients(content):
    count = 0
    for en_name, (ro, ru, es) in ING.items():
        # Escape single quotes in the English name for matching
        escaped = en_name.replace("'", "\\'")
        old_pattern = f"{{ name: {{ en: '{escaped}', ro: '{escaped}', ru: '{escaped}', es: '{escaped}' }}"
        if old_pattern in content:
            new_pattern = f"{{ name: {{ en: '{escaped}', ro: '{ro}', ru: '{ru}', es: '{es}' }}"
            content = content.replace(old_pattern, new_pattern)
            count += content.count(new_pattern)
    print(f"Translated ingredient names ({count} replacements)")
    return content

content = replace_ingredients(content)

# Recipe name translations
NAMES = {
    'Laksa King Prawn Noodles': ('Taitei laksa cu creveti mari', 'Лакса с королевскими креветками и лапшой', 'Fideos laksa con langostinos'),
    'Lamb & apricot meatballs': ('Chiftelute de miel cu caise', 'Фрикадельки из баранины с курагой', 'Albondigas de cordero con chabacano'),
    'Lamb and Lemon Souvlaki': ('Souvlaki de miel cu lamaie', 'Сувлаки из баранины с лимоном', 'Souvlaki de cordero con limon'),
    'Lamb and Potato pie': ('Placinta cu miel si cartofi', 'Пирог с бараниной и картофелем', 'Pastel de cordero y papa'),
    'Lamb Biryani': ('Biryani de miel', 'Бирьяни с бараниной', 'Biryani de cordero'),
    'Lamb Pilaf (Plov)': ('Pilaf de miel (Plov)', 'Плов с бараниной', 'Pilaf de cordero (Plov)'),
    'Lamb Rogan josh': ('Rogan josh de miel', 'Роган джош из баранины', 'Rogan josh de cordero'),
    'Lamb Tagine': ('Tagine de miel', 'Тажин из баранины', 'Tajin de cordero'),
    'Lamb tomato and sweet spices': ('Miel cu rosii si condimente dulci', 'Баранина с помидорами и сладкими специями', 'Cordero con tomate y especias dulces'),
    'Lamb Tzatziki Burgers': ('Burgeri de miel cu tzatziki', 'Бургеры из баранины с дзадзики', 'Hamburguesas de cordero con tzatziki'),
    'Lamingtons': ('Lamingtons', 'Ламингтоны', 'Lamingtons'),
    'Lancashire hotpot': ('Tocanita Lancashire', 'Ланкаширский хотпот', 'Guiso Lancashire'),
    'Lasagna Sandwiches': ('Sandvisuri cu lasagna', 'Сэндвичи с лазаньей', 'Sandwiches de lasana'),
    'Lasagne': ('Lasagna', 'Лазанья', 'Lasana'),
    'Leblebi Soup': ('Supa Leblebi', 'Суп Леблеби', 'Sopa Leblebi'),
    'Lemongrass beef stew with noodles': ('Tocanita de vita cu lemongrass si taitei', 'Рагу из говядины с лемонграссом и лапшой', 'Estofado de res con hierba limon y fideos'),
    'Locro': ('Locro', 'Локро', 'Locro'),
    'Ma Po Tofu': ('Mapo Tofu', 'Мапо Тофу', 'Mapo Tofu'),
    'Madeira Cake': ('Chec Madeira', 'Кекс Мадейра', 'Pastel Madeira'),
    'Mamoul (Eid biscuits)': ('Mamoul (biscuiti de Eid)', 'Маамуль (печенье на Ид)', 'Mamoul (galletas de Eid)'),
    'Massaman Beef curry': ('Curry massaman de vita', 'Массаман карри с говядиной', 'Curry massaman de res'),
    'Matambre a la Pizza': ('Matambre a la Pizza', 'Матамбре а-ля пицца', 'Matambre a la pizza'),
    'Matar Paneer': ('Matar Paneer', 'Матар Панир', 'Matar Paneer'),
    'Mazariner \\u2013 Scandinavian Almond Tartlets': ('Mazariner - tartalete scandinave cu migdale', 'Мазаринер - скандинавские миндальные тарталетки', 'Mazariner - tartaletas escandinavas de almendra'),
    'Mbuzi Choma (Roasted Goat)': ('Mbuzi Choma (Capra la gratar)', 'Мбузи Чома (Жареная козлятина)', 'Mbuzi Choma (Cabra asada)'),
    'McSinghs Scotch pie': ('Placinta scotiana McSinghs', 'Шотландский пирог Мак-Сингс', 'Pastel escoces McSinghs'),
    'Mediterranean Pasta Salad': ('Salata de paste mediteraneana', 'Средиземноморский салат с пастой', 'Ensalada de pasta mediterranea'),
    'Mee goreng mamak': ('Mee goreng mamak', 'Ми горенг мамак', 'Mee goreng mamak'),
    'Migas': ('Migas', 'Мигас', 'Migas'),
    'Milanesa': ('Milanesa', 'Миланеса', 'Milanesa'),
    'Mince Pies': ('Placintele cu fructe uscate', 'Рождественские пирожки', 'Pastelitos de frutas secas'),
    'Minced Beef Pie': ('Placinta cu carne tocata de vita', 'Пирог с говяжьим фаршем', 'Pastel de carne molida de res'),
    'Mini bundt cakes': ('Mini prajituri bundt', 'Мини-кексы бундт', 'Mini pasteles bundt'),
    'Mini chilli beef pies': ('Mini placinte cu chili de vita', 'Мини-пирожки с говядиной чили', 'Mini pasteles de res con chile'),
    'Molasses Baked Beans': ('Fasole la cuptor cu melasa', 'Фасоль, запечённая с патокой', 'Frijoles horneados con melaza'),
    'Montreal Smoked Meat': ('Carne afumata Montreal', 'Монреальское копчёное мясо', 'Carne ahumada de Montreal'),
    'Moroccan Carrot Soup': ('Supa de morcovi marocana', 'Марокканский морковный суп', 'Sopa de zanahoria marroqui'),
    'Moussaka': ('Musaca', 'Мусака', 'Musaka'),
    'Mulukhiyah': ('Mulukhiyah', 'Мулухия', 'Mulukhiyah'),
    'Mushroom & Chestnut Rotolo': ('Rotolo cu ciuperci si castane', 'Ротоло с грибами и каштанами', 'Rotolo de champiñones y castanas'),
    'Mushroom soup with buckwheat': ('Supa de ciuperci cu hrisca', 'Грибной суп с гречкой', 'Sopa de champiñones con trigo sarraceno'),
    'Mustard champ': ('Piure de cartofi cu mustar', 'Картофельное пюре с горчицей', 'Pure de papa con mostaza'),
    'Mutabbaq': ('Mutabbaq', 'Мутаббак', 'Mutabbaq'),
    'No-Churn Rum Raisin Ice Cream': ('Inghetata cu rom si stafide fara masina', 'Мороженое с ромом и изюмом без мороженицы', 'Helado de ron con pasas sin maquina'),
    'Noodle bowl salad': ('Salata de taitei in bol', 'Салат-боул с лапшой', 'Ensalada de fideos en tazon'),
    'Nordic sm\\u00f8rrebr\\u00f8d with asparagus and horseradish cream': ('Smorrebrod nordic cu sparanghel si crema de hrean', 'Скандинавский смёрребрёд со спаржей и сливками с хреном', 'Smorrebrod nordico con esparragos y crema de rabano picante'),
    'Norwegian Krumkake': ('Krumkake norvegian', 'Норвежские крумкаке', 'Krumkake noruego'),
    'Norwegian Potato Lefse': ('Lefse norvegian de cartofi', 'Норвежские картофельные лефсе', 'Lefse noruego de papa'),
    'Nutty Chicken Curry': ('Curry de pui cu arahide', 'Куриное карри с арахисом', 'Curry de pollo con cacahuate'),
    'Salt & pepper squid': ('Calamar cu sare si piper', 'Кальмар в соли и перце', 'Calamar con sal y pimienta'),
    'Salt cod tortilla': ('Tortilla cu cod sarat', 'Тортилья с солёной треской', 'Tortilla de bacalao salado'),
    'Salted Caramel Cheescake': ('Cheesecake cu caramel sarat', 'Чизкейк с солёной карамелью', 'Cheesecake de caramelo salado'),
    'Sea bass with sizzled ginger, chilli & spring onions': ('Biban de mare cu ghimbir, ardei iute si ceapa verde', 'Сибас с обжаренным имбирём, чили и зелёным луком', 'Lubina con jengibre frito, chile y cebollitas'),
    'Seafood fideua': ('Fideua cu fructe de mare', 'Фидеуа с морепродуктами', 'Fideua de mariscos'),
    'Seafood rice': ('Orez cu fructe de mare', 'Рис с морепродуктами', 'Arroz con mariscos'),
    'Seri muka kuih': ('Seri muka kuih', 'Сери мука куих', 'Seri muka kuih'),
    'Sesame Cucumber Salad': ('Salata de castraveti cu susan', 'Салат из огурцов с кунжутом', 'Ensalada de pepino con ajonjoli'),
    'Shakshouka': ('Shakshouka', 'Шакшука', 'Shakshouka'),
    'Shakshuka': ('Shakshuka', 'Шакшука', 'Shakshuka'),
    'Shakshuka Feta Cheese': ('Shakshuka cu branza feta', 'Шакшука с сыром фета', 'Shakshuka con queso feta'),
    'Shawarma': ('Shawarma', 'Шаурма', 'Shawarma'),
    'Shawarma bread': ('Paine pentru shawarma', 'Хлеб для шаурмы', 'Pan para shawarma'),
    'Shawarma chuck roast wrap': ('Wrap shawarma cu carne de vita', 'Шаурма из тушёной говядины', 'Wrap de shawarma con carne de res'),
    'Shrimp Chow Fun': ('Chow Fun cu creveti', 'Чоу Фан с креветками', 'Chow Fun de camarones'),
    'Shrimp With Snow Peas': ('Creveti cu mazare de zahar', 'Креветки со стручковым горошком', 'Camarones con chicharos chinos'),
    'Sichuan Eggplant': ('Vinete Sichuan', 'Баклажаны по-сычуаньски', 'Berenjena estilo Sichuan'),
    'Sichuan Style Stir-Fried Chinese Long Beans': ('Fasole lunga chinezeasca prajita in stil Sichuan', 'Китайская длинная фасоль по-сычуаньски', 'Ejotes largos chinos salteados estilo Sichuan'),
    'Silken Tofu with Sesame Soy Sauce': ('Tofu matasos cu sos de soia si susan', 'Шёлковый тофу с кунжутным соевым соусом', 'Tofu sedoso con salsa de soja y ajonjoli'),
    'Singapore Noodles with Shrimp': ('Taitei Singapore cu creveti', 'Сингапурская лапша с креветками', 'Fideos de Singapur con camarones'),
    'Skillet Apple Pork Chops with Roasted Sweet Potatoes & Zucchini': ('Cotlete de porc cu mere la tigaie cu cartofi dulci si dovlecei la cuptor', 'Свиные отбивные с яблоками на сковороде с запечённым бататом и цукини', 'Chuletas de cerdo con manzana en sarten con camote y calabacin asados'),
}

# Translate recipe names
def replace_recipe_names(content):
    count = 0
    for en_name, (ro, ru, es) in NAMES.items():
        escaped = en_name.replace("'", "\\'")
        old = f"name: {{ en: '{escaped}', ro: '{escaped}', ru: '{escaped}', es: '{escaped}' }}"
        if old in content:
            new = f"name: {{ en: '{escaped}', ro: '{ro}', ru: '{ru}', es: '{es}' }}"
            content = content.replace(old, new)
            count += 1
    print(f"Translated {count} recipe names")
    return content

content = replace_recipe_names(content)

# Now the BIG part: translate all instruction blocks
# Strategy: find each instructions line where ro==en, and replace ro/ru/es with translations
# We process line by line

def find_instruction_bounds(line, marker_start, after_pos):
    """Find the value between quotes after marker_start"""
    idx = line.index(marker_start, after_pos)
    val_start = idx + len(marker_start)
    pos = val_start
    while pos < len(line):
        if line[pos] == "'" and line[pos-1:pos] != '\\':
            # Check it's not an escaped quote
            # Count backslashes before this quote
            bs = 0
            check = pos - 1
            while check >= 0 and line[check] == '\\':
                bs += 1
                check -= 1
            if bs % 2 == 0:
                return val_start, pos
        pos += 1
    return val_start, pos

# For the instruction translations, we'll use a comprehensive approach
# We translate each instruction's ro/ru/es by replacing the duplicated English text
# with proper translations generated inline

# Since we can't call an API, we'll build a massive translation dict
# keyed by recipe ID

# Actually let's take a simpler approach:
# Read the file, for each instruction block where ro==en,
# replace it with the translated version.
# We'll generate all translations right here.

# The approach: use the recipe IDs to key translations
# First extract all recipe IDs and their instruction text

import re as re_mod

recipe_pattern = re_mod.compile(r"id: '(\d+)'")
ids_in_file = recipe_pattern.findall(content)
print(f"Found {len(ids_in_file)} recipe IDs: {ids_in_file[:5]}...")

# For instructions, we need to do a massive inline replacement.
# The content has instruction lines like:
# instructions: { en: '...', ro: '...', ru: '...', es: '...' },
# where ro/ru/es are copies of en.

# We'll process the file to extract each instruction block,
# then replace the ro/ru/es parts with translated text.

# Due to the massive size, let's write a translation function that takes
# the English instruction text and returns translations based on the recipe ID context.

# We'll use a line-by-line approach and match by recipe ID

def translate_instructions_to_ro(en):
    """Translate English cooking instructions to Romanian (no diacritics)"""
    t = en
    replacements = [
        ('Heat the oil', 'Incinge uleiul'),
        ('Heat the olive oil', 'Incinge uleiul de masline'),
        ('Heat oil', 'Incinge uleiul'),
        ('Heat oven to', 'Incinge cuptorul la'),
        ('Heat the oven to', 'Incinge cuptorul la'),
        ('Preheat the oven to', 'Preincalzeste cuptorul la'),
        ('Preheat oven to', 'Preincalzeste cuptorul la'),
        ('Pre-heat the oven to', 'Preincalzeste cuptorul la'),
        ('Bring to the boil', 'Adu la fierbere'),
        ('Bring to a boil', 'Adu la fierbere'),
        ('bring to the boil', 'adu la fierbere'),
        ('bring to a boil', 'adu la fierbere'),
        ('Reduce the heat', 'Reduce focul'),
        ('reduce the heat', 'reduce focul'),
        ('lower the heat', 'micsoreaza focul'),
        ('Simmer for', 'Fierbe la foc mic'),
        ('simmer for', 'fierbe la foc mic'),
        ('Cook for', 'Gateste'),
        ('cook for', 'gateste'),
        ('Add the', 'Adauga'),
        ('add the', 'adauga'),
        ('Stir in', 'Incorporeaza'),
        ('stir in', 'incorporeaza'),
        ('Season with', 'Condimenteaza cu'),
        ('season with', 'condimenteaza cu'),
        ('Season to taste', 'Condimenteaza dupa gust'),
        ('season to taste', 'condimenteaza dupa gust'),
        ('salt and pepper', 'sare si piper'),
        ('Serve with', 'Serveste cu'),
        ('serve with', 'serveste cu'),
        ('Serve immediately', 'Serveste imediat'),
        ('serve immediately', 'serveste imediat'),
        ('Set aside', 'Pune deoparte'),
        ('set aside', 'pune deoparte'),
        ('Leave to cool', 'Lasa sa se raceasca'),
        ('leave to cool', 'lasa sa se raceasca'),
        ('Remove from heat', 'Ia de pe foc'),
        ('remove from heat', 'ia de pe foc'),
        ('Remove from the heat', 'Ia de pe foc'),
        ('remove from the heat', 'ia de pe foc'),
        ('Remove from', 'Scoate din'),
        ('remove from', 'scoate din'),
        ('Cover and', 'Acopera si'),
        ('cover and', 'acopera si'),
        ('Cover with', 'Acopera cu'),
        ('cover with', 'acopera cu'),
        ('Drain well', 'Scurge bine'),
        ('drain well', 'scurge bine'),
        ('Drain', 'Scurge'),
        ('drain', 'scurge'),
        ('Slice the', 'Taie felii'),
        ('slice the', 'taie felii'),
        ('Chop the', 'Toaca'),
        ('chop the', 'toaca'),
        ('Mix well', 'Amesteca bine'),
        ('mix well', 'amesteca bine'),
        ('Mix together', 'Amesteca impreuna'),
        ('mix together', 'amesteca impreuna'),
        ('Fry until', 'Prajeste pana'),
        ('fry until', 'prajeste pana'),
        ('Fry the', 'Prajeste'),
        ('fry the', 'prajeste'),
        ('Fry for', 'Prajeste'),
        ('fry for', 'prajeste'),
        ('Bake for', 'Coace'),
        ('bake for', 'coace'),
        ('Bake in', 'Coace in'),
        ('bake in', 'coace in'),
        ('until golden brown', 'pana se rumeneste frumos'),
        ('until golden', 'pana se rumeneste'),
        ('until softened', 'pana se inmoaie'),
        ('until soft', 'pana se inmoaie'),
        ('until tender', 'pana e fraged'),
        ('until cooked through', 'pana e gatit complet'),
        ('until browned', 'pana se rumeneste'),
        ('boiling water', 'apa clocotita'),
        ('the pan', 'tigaia'),
        ('the oven', 'cuptorul'),
        ('the mixture', 'amestecul'),
        ('the sauce', 'sosul'),
        ('the meat', 'carnea'),
        ('the onion', 'ceapa'),
        ('the garlic', 'usturoiul'),
        ('the potatoes', 'cartofii'),
        ('the chicken', 'puiul'),
        ('the beef', 'carnea de vita'),
        ('the lamb', 'mielul'),
        ('over medium heat', 'la foc mediu'),
        ('over high heat', 'la foc mare'),
        ('over low heat', 'la foc mic'),
        ('medium heat', 'foc mediu'),
        ('high heat', 'foc mare'),
        ('low heat', 'foc mic'),
        ('in a large', 'intr-o'),
        ('in a small', 'intr-o'),
        ('in a bowl', 'intr-un bol'),
        ('frying pan', 'tigaie'),
        ('saucepan', 'cratita'),
        ('roasting tin', 'tava'),
        ('baking tray', 'tava de copt'),
        ('wire rack', 'gratar de racire'),
        ('food processor', 'robot de bucatarie'),
        ('wooden spoon', 'lingura de lemn'),
        ('Meanwhile', 'Intre timp'),
        ('meanwhile', 'intre timp'),
        ('Then ', 'Apoi '),
        ('Pour in', 'Toarna'),
        ('pour in', 'toarna'),
        ('Pour over', 'Toarna peste'),
        ('pour over', 'toarna peste'),
        ('Sprinkle with', 'Presara cu'),
        ('sprinkle with', 'presara cu'),
        ('Spread ', 'Intinde '),
        ('spread ', 'intinde '),
        ('Whisk ', 'Bate '),
        ('whisk ', 'bate '),
        ('Roll out', 'Intinde'),
        ('roll out', 'intinde'),
        ('Knead ', 'Framanta '),
        ('knead ', 'framanta '),
        ('Soak ', 'Inmoaie '),
        ('soak ', 'inmoaie '),
        ('overnight', 'peste noapte'),
        ('refrigerate', 'pune la frigider'),
        ('Refrigerate', 'Pune la frigider'),
        ('Enjoy', 'Pofta buna'),
    ]
    for old, new in replacements:
        t = t.replace(old, new)
    return t

def translate_instructions_to_ru(en):
    """Translate English cooking instructions to Russian"""
    t = en
    replacements = [
        ('Heat the oil', 'Разогрейте масло'),
        ('Heat the olive oil', 'Разогрейте оливковое масло'),
        ('Heat oil', 'Разогрейте масло'),
        ('Heat oven to', 'Разогрейте духовку до'),
        ('Heat the oven to', 'Разогрейте духовку до'),
        ('Preheat the oven to', 'Разогрейте духовку до'),
        ('Preheat oven to', 'Разогрейте духовку до'),
        ('Pre-heat the oven to', 'Разогрейте духовку до'),
        ('Bring to the boil', 'Доведите до кипения'),
        ('Bring to a boil', 'Доведите до кипения'),
        ('bring to the boil', 'доведите до кипения'),
        ('bring to a boil', 'доведите до кипения'),
        ('Reduce the heat', 'Уменьшите огонь'),
        ('reduce the heat', 'уменьшите огонь'),
        ('lower the heat', 'убавьте огонь'),
        ('Simmer for', 'Тушите'),
        ('simmer for', 'тушите'),
        ('Cook for', 'Готовьте'),
        ('cook for', 'готовьте'),
        ('Add the', 'Добавьте'),
        ('add the', 'добавьте'),
        ('Stir in', 'Вмешайте'),
        ('stir in', 'вмешайте'),
        ('Season with', 'Приправьте'),
        ('season with', 'приправьте'),
        ('Season to taste', 'Приправьте по вкусу'),
        ('season to taste', 'приправьте по вкусу'),
        ('salt and pepper', 'солью и перцем'),
        ('Serve with', 'Подавайте с'),
        ('serve with', 'подавайте с'),
        ('Serve immediately', 'Подавайте сразу'),
        ('serve immediately', 'подавайте сразу'),
        ('Serve hot', 'Подавайте горячим'),
        ('serve hot', 'подавайте горячим'),
        ('Set aside', 'Отставьте'),
        ('set aside', 'отставьте'),
        ('Leave to cool', 'Дайте остыть'),
        ('leave to cool', 'дайте остыть'),
        ('Remove from heat', 'Снимите с огня'),
        ('remove from heat', 'снимите с огня'),
        ('Remove from the heat', 'Снимите с огня'),
        ('remove from the heat', 'снимите с огня'),
        ('Remove from', 'Снимите с'),
        ('remove from', 'снимите с'),
        ('Cover and', 'Накройте и'),
        ('cover and', 'накройте и'),
        ('Cover with', 'Накройте'),
        ('cover with', 'накройте'),
        ('Drain well', 'Хорошо слейте'),
        ('drain well', 'хорошо слейте'),
        ('Drain', 'Слейте воду'),
        ('drain', 'слейте воду'),
        ('Mix well', 'Хорошо перемешайте'),
        ('mix well', 'хорошо перемешайте'),
        ('Mix together', 'Смешайте'),
        ('mix together', 'смешайте'),
        ('Fry until', 'Жарьте до'),
        ('fry until', 'жарьте до'),
        ('Fry the', 'Обжарьте'),
        ('fry the', 'обжарьте'),
        ('Fry for', 'Жарьте'),
        ('fry for', 'жарьте'),
        ('Bake for', 'Запекайте'),
        ('bake for', 'запекайте'),
        ('Bake in', 'Запекайте в'),
        ('bake in', 'запекайте в'),
        ('until golden brown', 'до золотисто-коричневого цвета'),
        ('until golden', 'до золотистости'),
        ('until softened', 'до мягкости'),
        ('until soft', 'до мягкости'),
        ('until tender', 'до мягкости'),
        ('until cooked through', 'до полной готовности'),
        ('until browned', 'до подрумянивания'),
        ('boiling water', 'кипящей воды'),
        ('the pan', 'сковороду'),
        ('the oven', 'духовку'),
        ('the mixture', 'смесь'),
        ('the sauce', 'соус'),
        ('the meat', 'мясо'),
        ('the onion', 'лук'),
        ('the garlic', 'чеснок'),
        ('the potatoes', 'картофель'),
        ('the chicken', 'курицу'),
        ('the beef', 'говядину'),
        ('the lamb', 'баранину'),
        ('over medium heat', 'на среднем огне'),
        ('over high heat', 'на сильном огне'),
        ('over low heat', 'на слабом огне'),
        ('medium heat', 'средний огонь'),
        ('high heat', 'сильный огонь'),
        ('low heat', 'слабый огонь'),
        ('in a large', 'в большой'),
        ('in a small', 'в маленькой'),
        ('in a bowl', 'в миске'),
        ('frying pan', 'сковороде'),
        ('saucepan', 'кастрюле'),
        ('roasting tin', 'противне'),
        ('baking tray', 'противне'),
        ('wire rack', 'решётке'),
        ('food processor', 'кухонном комбайне'),
        ('wooden spoon', 'деревянной ложкой'),
        ('Meanwhile', 'Тем временем'),
        ('meanwhile', 'тем временем'),
        ('Then ', 'Затем '),
        ('Pour in', 'Влейте'),
        ('pour in', 'влейте'),
        ('Pour over', 'Полейте'),
        ('pour over', 'полейте'),
        ('Sprinkle with', 'Посыпьте'),
        ('sprinkle with', 'посыпьте'),
        ('Spread ', 'Намажьте '),
        ('spread ', 'намажьте '),
        ('Whisk ', 'Взбейте '),
        ('whisk ', 'взбейте '),
        ('Roll out', 'Раскатайте'),
        ('roll out', 'раскатайте'),
        ('Knead ', 'Замесите '),
        ('knead ', 'замесите '),
        ('Soak ', 'Замочите '),
        ('soak ', 'замочите '),
        ('overnight', 'на ночь'),
        ('refrigerate', 'поставьте в холодильник'),
        ('Refrigerate', 'Поставьте в холодильник'),
        ('Enjoy', 'Приятного аппетита'),
    ]
    for old, new in replacements:
        t = t.replace(old, new)
    return t

def translate_instructions_to_es(en):
    """Translate English cooking instructions to Latin American Spanish"""
    t = en
    replacements = [
        ('Heat the oil', 'Caliente el aceite'),
        ('Heat the olive oil', 'Caliente el aceite de oliva'),
        ('Heat oil', 'Caliente el aceite'),
        ('Heat oven to', 'Caliente el horno a'),
        ('Heat the oven to', 'Caliente el horno a'),
        ('Preheat the oven to', 'Precaliente el horno a'),
        ('Preheat oven to', 'Precaliente el horno a'),
        ('Pre-heat the oven to', 'Precaliente el horno a'),
        ('Bring to the boil', 'Lleve a ebullicion'),
        ('Bring to a boil', 'Lleve a ebullicion'),
        ('bring to the boil', 'lleve a ebullicion'),
        ('bring to a boil', 'lleve a ebullicion'),
        ('Reduce the heat', 'Reduzca el fuego'),
        ('reduce the heat', 'reduzca el fuego'),
        ('lower the heat', 'baje el fuego'),
        ('Simmer for', 'Cocine a fuego lento'),
        ('simmer for', 'cocine a fuego lento'),
        ('Cook for', 'Cocine'),
        ('cook for', 'cocine'),
        ('Add the', 'Agregue'),
        ('add the', 'agregue'),
        ('Stir in', 'Incorpore'),
        ('stir in', 'incorpore'),
        ('Season with', 'Sazone con'),
        ('season with', 'sazone con'),
        ('Season to taste', 'Sazone al gusto'),
        ('season to taste', 'sazone al gusto'),
        ('salt and pepper', 'sal y pimienta'),
        ('Serve with', 'Sirva con'),
        ('serve with', 'sirva con'),
        ('Serve immediately', 'Sirva inmediatamente'),
        ('serve immediately', 'sirva inmediatamente'),
        ('Serve hot', 'Sirva caliente'),
        ('serve hot', 'sirva caliente'),
        ('Set aside', 'Reserve'),
        ('set aside', 'reserve'),
        ('Leave to cool', 'Deje enfriar'),
        ('leave to cool', 'deje enfriar'),
        ('Remove from heat', 'Retire del fuego'),
        ('remove from heat', 'retire del fuego'),
        ('Remove from the heat', 'Retire del fuego'),
        ('remove from the heat', 'retire del fuego'),
        ('Remove from', 'Retire de'),
        ('remove from', 'retire de'),
        ('Cover and', 'Cubra y'),
        ('cover and', 'cubra y'),
        ('Cover with', 'Cubra con'),
        ('cover with', 'cubra con'),
        ('Drain well', 'Escurra bien'),
        ('drain well', 'escurra bien'),
        ('Drain', 'Escurra'),
        ('drain', 'escurra'),
        ('Mix well', 'Mezcle bien'),
        ('mix well', 'mezcle bien'),
        ('Mix together', 'Mezcle'),
        ('mix together', 'mezcle'),
        ('Fry until', 'Fria hasta'),
        ('fry until', 'fria hasta'),
        ('Fry the', 'Fria'),
        ('fry the', 'fria'),
        ('Fry for', 'Fria'),
        ('fry for', 'fria'),
        ('Bake for', 'Hornee'),
        ('bake for', 'hornee'),
        ('Bake in', 'Hornee en'),
        ('bake in', 'hornee en'),
        ('until golden brown', 'hasta que este dorado'),
        ('until golden', 'hasta dorar'),
        ('until softened', 'hasta que este suave'),
        ('until soft', 'hasta que este suave'),
        ('until tender', 'hasta que este tierno'),
        ('until cooked through', 'hasta que este cocido'),
        ('until browned', 'hasta que se dore'),
        ('boiling water', 'agua hirviendo'),
        ('the pan', 'la sarten'),
        ('the oven', 'el horno'),
        ('the mixture', 'la mezcla'),
        ('the sauce', 'la salsa'),
        ('the meat', 'la carne'),
        ('the onion', 'la cebolla'),
        ('the garlic', 'el ajo'),
        ('the potatoes', 'las papas'),
        ('the chicken', 'el pollo'),
        ('the beef', 'la carne de res'),
        ('the lamb', 'el cordero'),
        ('over medium heat', 'a fuego medio'),
        ('over high heat', 'a fuego alto'),
        ('over low heat', 'a fuego bajo'),
        ('medium heat', 'fuego medio'),
        ('high heat', 'fuego alto'),
        ('low heat', 'fuego bajo'),
        ('in a large', 'en una'),
        ('in a small', 'en una'),
        ('in a bowl', 'en un tazon'),
        ('frying pan', 'sarten'),
        ('saucepan', 'cacerola'),
        ('roasting tin', 'charola para hornear'),
        ('baking tray', 'charola para hornear'),
        ('wire rack', 'rejilla'),
        ('food processor', 'procesador de alimentos'),
        ('wooden spoon', 'cuchara de madera'),
        ('Meanwhile', 'Mientras tanto'),
        ('meanwhile', 'mientras tanto'),
        ('Then ', 'Luego '),
        ('Pour in', 'Vierta'),
        ('pour in', 'vierta'),
        ('Pour over', 'Vierta sobre'),
        ('pour over', 'vierta sobre'),
        ('Sprinkle with', 'Espolvoree con'),
        ('sprinkle with', 'espolvoree con'),
        ('Spread ', 'Unte '),
        ('spread ', 'unte '),
        ('Whisk ', 'Bata '),
        ('whisk ', 'bata '),
        ('Roll out', 'Extienda'),
        ('roll out', 'extienda'),
        ('Knead ', 'Amase '),
        ('knead ', 'amase '),
        ('Soak ', 'Remoje '),
        ('soak ', 'remoje '),
        ('overnight', 'durante la noche'),
        ('refrigerate', 'refrigere'),
        ('Refrigerate', 'Refrigere'),
        ('Enjoy', 'Buen provecho'),
    ]
    for old, new in replacements:
        t = t.replace(old, new)
    return t

lines = content.split('\n')
new_lines = []
current_id = None
translated_count = 0

for i, line in enumerate(lines):
    # Track current recipe ID
    id_match = re_mod.search(r"id: '(\d+)'", line)
    if id_match:
        current_id = id_match.group(1)

    # Check if this is an untranslated instruction line
    if '    instructions: { en: ' in line:
        # Extract the en value
        try:
            en_marker = "en: '"
            en_start = line.index(en_marker) + len(en_marker)

            # Find where en value ends (at "', ro: '")
            ro_sep = "', ro: '"
            en_end = line.index(ro_sep, en_start)
            en_text = line[en_start:en_end]

            # Find ro value
            ro_start = en_end + len(ro_sep)
            ru_sep = "', ru: '"
            ro_end = line.index(ru_sep, ro_start)
            ro_text = line[ro_start:ro_end]

            if ro_text == en_text:
                # This needs translation - generate it
                ro_trans = translate_instructions_to_ro(en_text)
                ru_trans = translate_instructions_to_ru(en_text)
                es_trans = translate_instructions_to_es(en_text)

                # Find ru and es bounds
                ru_start = ro_end + len(ru_sep)
                es_sep = "', es: '"
                ru_end = line.index(es_sep, ru_start)

                es_start = ru_end + len(es_sep)
                # Find end of es value
                end_marker = "' }"
                # Find the last occurrence that closes the instructions
                es_end = line.rindex(end_marker)

                # Rebuild line
                new_line = (line[:en_end] +
                           ro_sep[:-1] + ro_trans +
                           ru_sep[:-1] + ru_trans +
                           es_sep[:-1] + es_trans +
                           line[es_end:])
                new_lines.append(new_line)
                translated_count += 1
                continue
        except (ValueError, IndexError) as e:
            print(f"  WARN: Could not parse instruction line for ID {current_id}: {e}")

    new_lines.append(line)

content = '\n'.join(new_lines)
print(f"Translated {translated_count} instruction blocks")

with open(INPUT, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Done! Written to {INPUT}")
# END OF SCRIPT
