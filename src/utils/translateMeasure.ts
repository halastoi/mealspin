const measures: Record<string, Record<string, string>> = {
  'Finely': { ro: 'Fin', ru: 'Мелко', es: 'Finamente' },
  'Freshly': { ro: 'Proaspat', ru: 'Свежемолотый', es: 'Recién' },
  'as needed': { ro: 'dupa necesitate', ru: 'по необходимости', es: 'al gusto' },
  'bunch': { ro: 'legatura', ru: 'пучок', es: 'manojo' },
  'dash': { ro: 'strop', ru: 'капля', es: 'pizca' },
  'Dash': { ro: 'Strop', ru: 'Капля', es: 'Pizca' },
  'For frying': { ro: 'Pentru prajit', ru: 'Для жарки', es: 'Para freir' },
  'for frying': { ro: 'pentru prajit', ru: 'для жарки', es: 'para freir' },
  'For brushing': { ro: 'Pentru uns', ru: 'Для смазки', es: 'Para untar' },
  'for brushing': { ro: 'pentru uns', ru: 'для смазки', es: 'para untar' },
  'peeled': { ro: 'curatat', ru: 'очищенный', es: 'pelado' },
  'beaten': { ro: 'batut', ru: 'взбитый', es: 'batido' },
  'softened': { ro: 'inmuiat', ru: 'размягчённый', es: 'ablandado' },
  'melted': { ro: 'topit', ru: 'растопленный', es: 'derretido' },
  'optional': { ro: 'optional', ru: 'по желанию', es: 'opcional' },
  'Optional': { ro: 'Optional', ru: 'По желанию', es: 'Opcional' },
  'halved': { ro: 'taiat in jumatati', ru: 'разрезанный пополам', es: 'cortado a la mitad' },
  'quartered': { ro: 'taiat in sferturi', ru: 'разрезанный на четверти', es: 'en cuartos' },
  'whole': { ro: 'intreg', ru: 'целый', es: 'entero' },
  'shredded': { ro: 'ras', ru: 'тёртый', es: 'rallado' },
  'juiced': { ro: 'stors', ru: 'выжатый', es: 'exprimido' },
  'zested': { ro: 'ras coaja', ru: 'цедра', es: 'ralladura' },
  'can': { ro: 'conserva', ru: 'банка', es: 'lata' },
  'cans': { ro: 'conserve', ru: 'банок', es: 'latas' },
  'chopped': { ro: 'tocat', ru: 'нарезанный', es: 'picado' },
  'clove': { ro: 'catel', ru: 'зубчик', es: 'diente' },
  'cloves': { ro: 'catei', ru: 'зубчиков', es: 'dientes' },
  'crushed': { ro: 'zdrobit', ru: 'раздавленный', es: 'triturado' },
  'cup': { ro: 'cana', ru: 'стакан', es: 'taza' },
  'cups': { ro: 'cani', ru: 'стаканов', es: 'tazas' },
  'diced': { ro: 'taiat cuburi', ru: 'нарезанный кубиками', es: 'en cubos' },
  'dried': { ro: 'uscat', ru: 'сушёный', es: 'seco' },
  'drizzle': { ro: 'strop', ru: 'немного', es: 'chorrito' },
  'finely': { ro: 'fin', ru: 'мелко', es: 'finamente' },
  'fresh': { ro: 'proaspat', ru: 'свежий', es: 'fresco' },
  'freshly': { ro: 'proaspat', ru: 'свежемолотый', es: 'recién' },
  'garnish': { ro: 'pentru decor', ru: 'для украшения', es: 'para decorar' },
  'grated': { ro: 'ras', ru: 'тёртый', es: 'rallado' },
  'ground': { ro: 'macinat', ru: 'молотый', es: 'molido' },
  'head': { ro: 'bucata', ru: 'кочан', es: 'cabeza' },
  'heads': { ro: 'bucati', ru: 'кочанов', es: 'cabezas' },
  'handful': { ro: 'pumn', ru: 'горсть', es: 'puñado' },
  'jar': { ro: 'borcan', ru: 'банка', es: 'frasco' },
  'knob': { ro: 'bucata', ru: 'кусочек', es: 'trozo' },
  'large': { ro: 'mari', ru: 'крупных', es: 'grandes' },
  'liter': { ro: 'litru', ru: 'литр', es: 'litro' },
  'liters': { ro: 'litri', ru: 'литров', es: 'litros' },
  'litre': { ro: 'litru', ru: 'литр', es: 'litro' },
  'litres': { ro: 'litri', ru: 'литров', es: 'litros' },
  'lb': { ro: 'lb', ru: 'фунт', es: 'libra' },
  'lbs': { ro: 'lbs', ru: 'фунтов', es: 'libras' },
  'medium': { ro: 'medii', ru: 'средних', es: 'medianos' },
  'minced': { ro: 'tocat marunt', ru: 'измельчённый', es: 'picado fino' },
  'ounce': { ro: 'uncie', ru: 'унция', es: 'onza' },
  'ounces': { ro: 'uncii', ru: 'унций', es: 'onzas' },
  'oz': { ro: 'uncii', ru: 'унц.', es: 'oz' },
  'packet': { ro: 'pachet', ru: 'пакет', es: 'paquete' },
  'piece': { ro: 'bucata', ru: 'кусок', es: 'trozo' },
  'pieces': { ro: 'bucati', ru: 'кусков', es: 'trozos' },
  'pinch': { ro: 'varf', ru: 'щепотка', es: 'pizca' },
  'pound': { ro: 'livra', ru: 'фунт', es: 'libra' },
  'pounds': { ro: 'livre', ru: 'фунтов', es: 'libras' },
  'roughly': { ro: 'grosier', ru: 'крупно', es: 'groseramente' },
  'slice': { ro: 'felie', ru: 'ломтик', es: 'rebanada' },
  'sliced': { ro: 'feliat', ru: 'нарезанный', es: 'en rodajas' },
  'slices': { ro: 'felii', ru: 'ломтиков', es: 'rebanadas' },
  'small': { ro: 'mici', ru: 'маленьких', es: 'pequeños' },
  'splash': { ro: 'strop', ru: 'немного', es: 'chorrito' },
  'sprig': { ro: 'ramura', ru: 'веточка', es: 'ramita' },
  'sprigs': { ro: 'ramuri', ru: 'веточек', es: 'ramitas' },
  'stick': { ro: 'baton', ru: 'палочка', es: 'barra' },
  'tablespoon': { ro: 'lingura', ru: 'столовая ложка', es: 'cucharada' },
  'tablespoons': { ro: 'linguri', ru: 'столовых ложек', es: 'cucharadas' },
  'tbs': { ro: 'linguri', ru: 'ст.л.', es: 'cdas' },
  'tbls': { ro: 'linguri', ru: 'ст.л.', es: 'cdas' },
  'tblsp': { ro: 'linguri', ru: 'ст.л.', es: 'cdas' },
  'tbsp': { ro: 'linguri', ru: 'ст.л.', es: 'cdas' },
  'teaspoon': { ro: 'lingurita', ru: 'чайная ложка', es: 'cucharadita' },
  'teaspoons': { ro: 'lingurite', ru: 'чайных ложек', es: 'cucharaditas' },
  'thinly': { ro: 'subtire', ru: 'тонко', es: 'finamente' },
  'to serve': { ro: 'pentru servire', ru: 'для подачи', es: 'para servir' },
  'to taste': { ro: 'dupa gust', ru: 'по вкусу', es: 'al gusto' },
  'tsp': { ro: 'lingurite', ru: 'ч.л.', es: 'cdtas' },
}

// Convert imperial to metric for RO/RU (these countries use metric)
function convertToMetric(measure: string, lang: string): string {
  if (lang === 'es') return measure // Latin America uses both
  let result = measure

  // Convert lbs/lb/livre/фунт to grams: 1 lb = ~450g
  result = result.replace(/(\d+(?:\.\d+)?)\s*(?:lbs?|livre?|livra|фунт|фунтов)\b/gi, (_match, num) => {
    const g = Math.round(parseFloat(num) * 450)
    return g >= 1000 ? `${(g / 1000).toFixed(1)} kg` : `${g} g`
  })

  // Convert oz/ounces/uncii/унц to grams: 1 oz = ~28g
  result = result.replace(/(\d+(?:\.\d+)?)\s*(?:oz|uncii|uncie|унц\.|унция|унций)\b/gi, (_match, num) => {
    const g = Math.round(parseFloat(num) * 28)
    return `${g} g`
  })

  // Convert cups to ml: 1 cup = ~240ml
  result = result.replace(/(\d+(?:[./]\d+)?)\s*(?:cani|стаканов|стакан)\b/gi, (_match, num) => {
    let val = 0
    if (num.includes('/')) {
      const [a, b] = num.split('/')
      val = parseInt(a) / parseInt(b)
    } else {
      val = parseFloat(num)
    }
    const ml = Math.round(val * 240)
    return `${ml} ml`
  })

  return result
}

export function translateMeasure(measure: string, lang: string): string {
  if (lang === 'en') return measure
  let result = measure
  // Sort by length descending to replace longer phrases first
  const sorted = Object.entries(measures).sort((a, b) => b[0].length - a[0].length)
  for (const [en, trans] of sorted) {
    const translated = trans[lang as keyof typeof trans]
    if (translated) {
      const escaped = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp('(?<=^|[\\s\\d.,/])' + escaped + '(?=$|[\\s.,;!?)])', 'gi')
      result = result.replace(regex, translated)
      if (result === measure) {
        const simple = new RegExp(escaped, 'gi')
        result = result.replace(simple, translated)
      }
    }
  }
  // Convert imperial units to metric for RO/RU
  result = convertToMetric(result, lang)
  return result
}
