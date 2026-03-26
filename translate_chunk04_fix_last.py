#!/usr/bin/env python3
"""Fix last missing recipe: 52795 (Chicken Handi)"""
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

FILE = 'src/data/recipes_chunk04.ts'
with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()

def escape_for_ts(s):
    return s.replace("\\", "\\\\").replace("'", "\\'")

trans = {
'ro': 'Ia o oala mare sau un wok, suficient de mare pentru a gati tot puiul, si incinge uleiul. Cand uleiul e fierbinte, adauga ceapa feliata si prajeste pana devine auriu-inchis. Apoi scoate-o pe o farfurie si pune-o deoparte.\nIn aceeasi oala, adauga usturoiul tocat si caleste un minut. Apoi adauga rosiile tocate si gateste pana se inmoaie. Aceasta dureaza circa 5 minute.\nIntoarce ceapa prajita in oala si amesteca. Adauga pasta de ghimbir si caleste bine.\nAcum adauga semintele de chimion, jumatate din semintele de coriandru si ardeii iuti verzi tocati. Amesteca rapid.\nUrmeaza condimentele - pudra de turmeric si praf de ardei iute. Caleste condimentele bine cateva minute.\nAdauga bucatile de pui in wok, condimenteaza cu sare dupa gust si gateste puiul acoperit pe foc mic-mediu pana cand puiul este aproape gatit complet. Aceasta dureaza circa 15 minute. Calirea lenta a puiului va intensifica aroma, asa ca nu grabi acest pas punand focul pe mare.\nCand uleiul se separa de condimente, adauga iaurtul batut tinand focul pe cel mai mic nivel ca iaurtul sa nu se taie. Presara restul de seminte de coriandru si adauga jumatate din frunzele uscate de schinduf. Amesteca bine.\nIn final adauga smantana si amesteca pentru ultima data pentru a combina totul.\nPresara restul de kasuri methi si garam masala si serveste puiul handi fierbinte cu naan sau rotis. Pofta buna!',
'ru': 'Возьмите большую кастрюлю или вок, достаточно большую для приготовления всей курицы, и нагрейте масло. Когда масло горячее, добавьте нарезанный лук и обжарьте до тёмно-золотистого цвета. Затем переложите на тарелку и отставьте.\nВ ту же кастрюлю добавьте рубленый чеснок и обжарьте минуту. Затем добавьте нарезанные помидоры и готовьте, пока они не станут мягкими. Это займёт около 5 минут.\nВерните обжаренный лук в кастрюлю и перемешайте. Добавьте имбирную пасту и хорошо обжарьте.\nТеперь добавьте семена тмина, половину семян кориандра и нарезанный зелёный чили. Быстро перемешайте.\nДалее идут специи - порошок куркумы и порошок красного чили. Хорошо обжарьте специи пару минут.\nДобавьте кусочки курицы в вок, посолите по вкусу и готовьте курицу под крышкой на среднем-слабом огне до почти полной готовности. Это займёт около 15 минут. Медленное обжаривание курицы усилит вкус, поэтому не ускоряйте этот шаг сильным огнём.\nКогда масло отделится от специй, добавьте взбитый йогурт, держа огонь на минимуме, чтобы йогурт не свернулся. Посыпьте оставшимися семенами кориандра и добавьте половину сушёных листьев пажитника. Хорошо перемешайте.\nВ конце добавьте сливки и перемешайте в последний раз.\nПосыпьте оставшимся касури метхи и гарам масала и подавайте курицу ханди горячей с наан или роти. Приятного аппетита!',
'es': 'Tome una olla grande o wok, lo suficientemente grande para cocinar todo el pollo, y caliente el aceite. Cuando el aceite este caliente, agregue la cebolla rebanada y fria hasta que este bien dorada. Luego retirela a un plato y reserve.\nEn la misma olla, agregue el ajo picado y saltee por un minuto. Luego agregue los tomates picados y cocine hasta que se ablanden. Esto tomara unos 5 minutos.\nRegrese la cebolla frita a la olla y revuelva. Agregue la pasta de jengibre y saltee bien.\nAhora agregue las semillas de comino, la mitad de las semillas de cilantro y los chiles verdes picados. Revuelva rapidamente.\nLuego van las especias - curcuma en polvo y chile en polvo. Saltee bien las especias por un par de minutos.\nAgregue las piezas de pollo al wok, sazone con sal al gusto y cocine el pollo tapado a fuego medio-lento hasta que este casi cocido. Esto tomara unos 15 minutos. Saltear lentamente el pollo realzara el sabor, asi que no acelere este paso poniendolo a fuego alto.\nCuando el aceite se separe de las especias, agregue el yogur batido manteniendo el fuego al minimo para que el yogur no se corte. Espolvoree las semillas de cilantro restantes y agregue la mitad de las hojas secas de fenogreco. Mezcle bien.\nFinalmente agregue la crema y revuelva por ultima vez para combinar todo.\nEspolvoree el kasuri methi restante y garam masala y sirva el pollo handi caliente con naan o rotis. Buen provecho!',
}

recipe_id = '52795'
id_pattern = f"id: '{recipe_id}'"
id_pos = content.find(id_pattern)
instr_pos = content.find("instructions: {", id_pos)
replaced = 0

for lang in ['ro', 'ru', 'es']:
    new_value = escape_for_ts(trans[lang])
    lang_pattern = f" {lang}: '"
    lang_pos = content.find(lang_pattern, instr_pos)
    if lang_pos == -1:
        continue
    next_id_pos = content.find("id: '", id_pos + len(id_pattern))
    if next_id_pos != -1 and lang_pos > next_id_pos:
        continue
    value_start = content.find("'", lang_pos + len(lang) + 1) + 1
    pos = value_start
    while pos < len(content):
        if content[pos] == "'" and content[pos-1] != '\\':
            break
        if content[pos] == "'" and pos >= 2 and content[pos-2:pos] == '\\\\':
            break
        pos += 1
    value_end = pos
    content = content[:value_start] + new_value + content[value_end:]
    replaced += 1

print(f"Fixed {replaced} translations for recipe {recipe_id}")

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done!")
