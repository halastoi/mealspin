#!/usr/bin/env python3
"""Generate fully translated recipes_chunk08.ts"""

# First, restore original file from git, then apply translations via search/replace
import subprocess, os

os.chdir('/data/data/com.termux/files/home/dev/mealspin')
subprocess.run(['git', 'checkout', '--', 'src/data/recipes_chunk08.ts'], check=True)

with open('src/data/recipes_chunk08.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Define all replacements as (old, new) pairs
replacements = [
    # ===== Recipe 52821 - Laksa King Prawn Noodles =====
    ("name: { en: 'Laksa King Prawn Noodles', ro: 'Laksa King Creveti Taitei', ru: 'Laksa King Креветки Лапша', es: 'Laksa King Langostinos Fideos' }",
     "name: { en: 'Laksa King Prawn Noodles', ro: 'Taitei Laksa King cu creveti', ru: 'Лапша Лакса Кинг с креветками', es: 'Fideos Laksa King con langostinos' }"),

    # 52821 instructions ro
    ("ro: 'Incinge uleiul intr-o medium saucepan and adauga chilli. Gateste 1 min, then adauga curry paste, stir and gateste 1 min more. Dissolve the stock cube in a large jug in 700ml boiling water, then toarnato the pan and stir to combine. Tip in the coconut milk and adu la fierbere.\\nAdauga fish sauce and a little seasoning. Amesteca usor in the noodles and gateste a further 3-4 mins until softening. Stoarce in the lime juice, adauga prawns and cook through until warm, about 2-3 mins. Scatter over some of the coriander.\\nServeste in bowls with the remaining coriander and lime wedges on top for squeezing over.'",
     "ro: 'Incalziti uleiul intr-o cratita medie si adaugati ardeiul iute. Gatiti 1 minut, apoi adaugati pasta de curry, amestecati si gatiti inca 1 minut. Dizolvati cubul de supa intr-o cana mare in 700ml apa clocotita, apoi turnati in cratita si amestecati pentru a combina. Adaugati laptele de cocos si aduceti la fierbere.\\nAdaugati sosul de peste si putin condiment. Adaugati taiteii si gatiti inca 3-4 minute pana cand incep sa se inmoaie. Stoarceti sucul de lamaie verde, adaugati crevetii si gatiti pana se incalzesc, aproximativ 2-3 minute. Presarati deasupra putin coriandru.\\nServiti in boluri cu restul de coriandru si felii de lamaie verde deasupra pentru stors.'"),

    # 52821 instructions ru
    ("ru: 'Нагрейте масло в medium saucepan and добавьте chilli. Готовьте 1 min, then добавьте curry paste, stir and готовьте 1 min more. Dissolve the stock cube in a large jug in 700ml boiling water, then влейтеto the pan and stir to combine. Tip in the coconut milk and доведите до кипения.\\nДобавьте fish sauce and a little seasoning. Перемешайте in the noodles and готовьте a further 3-4 mins until softening. Выжмите in the lime juice, добавьте prawns and cook through until warm, about 2-3 mins. Scatter over some of the coriander.\\nПодавайте in bowls with the remaining coriander and lime wedges on top for squeezing over.'",
     "ru: 'Разогрейте масло в средней кастрюле и добавьте перец чили. Готовьте 1 минуту, затем добавьте пасту карри, перемешайте и готовьте ещё 1 минуту. Растворите бульонный кубик в большом кувшине в 700мл кипящей воды, затем влейте в кастрюлю и перемешайте. Добавьте кокосовое молоко и доведите до кипения.\\nДобавьте рыбный соус и немного приправ. Положите лапшу и варите ещё 3-4 минуты до мягкости. Выжмите сок лайма, добавьте креветки и прогрейте около 2-3 минут. Посыпьте частью кориандра.\\nПодавайте в мисках с оставшимся кориандром и дольками лайма сверху.'"),

    # 52821 instructions es
    ("es: 'Caliente el aceite en una medium saucepan and anade chilli. Cocine 1 min, then anade curry paste, stir and cocine 1 min more. Dissolve the stock cube in a large jug in 700ml boiling water, then viertato the pan and stir to combine. Tip in the coconut milk and lleve a ebullicion.\\nAnade fish sauce and a little seasoning. Mezcle in the noodles and cocine a further 3-4 mins until softening. Exprima in the lime juice, anade prawns and cook through until warm, about 2-3 mins. Scatter over some of the coriander.\\nSirva in bowls with the remaining coriander and lime wedges on top for squeezing over.'",
     "es: 'Caliente el aceite en una cacerola mediana y anade el chile. Cocine 1 minuto, luego anade la pasta de curry, revuelva y cocine 1 minuto mas. Disuelva el cubo de caldo en una jarra grande con 700ml de agua hirviendo, luego vierta en la cacerola y revuelva para combinar. Anade la leche de coco y lleve a ebullicion.\\nAnade la salsa de pescado y un poco de sazon. Incorpore los fideos y cocine 3-4 minutos mas hasta que se ablanden. Exprima el jugo de lima, anade los langostinos y cocine hasta que esten calientes, unos 2-3 minutos. Espolvoree con un poco de cilantro.\\nSirva en tazones con el cilantro restante y rodajas de lima encima para exprimir.'"),
]

# Apply replacements
for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
    else:
        print(f"WARNING: Could not find: {old[:80]}...")

with open('src/data/recipes_chunk08.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done with part 1")
