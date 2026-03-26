import { useState, useMemo } from 'react'
import { useSpinStore } from '../../stores/useSpinStore'
import { useSettingsStore } from '../../stores/useSettingsStore'

// Cuisine translations
const cuisineNames: Record<string, Record<string, string>> = {
  American: { en: 'American', ro: 'Americana', ru: 'Американская', es: 'Americana' },
  British: { en: 'British', ro: 'Britanica', ru: 'Британская', es: 'Británica' },
  Bosnian: { en: 'Bosnian', ro: 'Bosniaca', ru: 'Боснийская', es: 'Bosnia' },
  Bulgarian: { en: 'Bulgarian', ro: 'Bulgara', ru: 'Болгарская', es: 'Búlgara' },
  Canadian: { en: 'Canadian', ro: 'Canadiana', ru: 'Канадская', es: 'Canadiense' },
  Chinese: { en: 'Chinese', ro: 'Chineza', ru: 'Китайская', es: 'China' },
  Croatian: { en: 'Croatian', ro: 'Croata', ru: 'Хорватская', es: 'Croata' },
  Danish: { en: 'Danish', ro: 'Daneza', ru: 'Датская', es: 'Danesa' },
  Dutch: { en: 'Dutch', ro: 'Olandeza', ru: 'Голландская', es: 'Holandesa' },
  Egyptian: { en: 'Egyptian', ro: 'Egipteana', ru: 'Египетская', es: 'Egipcia' },
  Filipino: { en: 'Filipino', ro: 'Filipineza', ru: 'Филиппинская', es: 'Filipina' },
  Finnish: { en: 'Finnish', ro: 'Finlandeza', ru: 'Финская', es: 'Finlandesa' },
  French: { en: 'French', ro: 'Franceza', ru: 'Французская', es: 'Francesa' },
  Greek: { en: 'Greek', ro: 'Greceasca', ru: 'Греческая', es: 'Griega' },
  Icelandic: { en: 'Icelandic', ro: 'Islandeza', ru: 'Исландская', es: 'Islandesa' },
  Indian: { en: 'Indian', ro: 'Indiana', ru: 'Индийская', es: 'India' },
  Irish: { en: 'Irish', ro: 'Irlandeza', ru: 'Ирландская', es: 'Irlandesa' },
  Italian: { en: 'Italian', ro: 'Italiana', ru: 'Итальянская', es: 'Italiana' },
  Jamaican: { en: 'Jamaican', ro: 'Jamaicana', ru: 'Ямайская', es: 'Jamaiquina' },
  Japanese: { en: 'Japanese', ro: 'Japoneza', ru: 'Японская', es: 'Japonesa' },
  Kenyan: { en: 'Kenyan', ro: 'Kenyana', ru: 'Кенийская', es: 'Keniana' },
  Latvian: { en: 'Latvian', ro: 'Letona', ru: 'Латвийская', es: 'Letona' },
  Lithuanian: { en: 'Lithuanian', ro: 'Lituaniana', ru: 'Литовская', es: 'Lituana' },
  Malaysian: { en: 'Malaysian', ro: 'Malaeziena', ru: 'Малайзийская', es: 'Malasia' },
  Mexican: { en: 'Mexican', ro: 'Mexicana', ru: 'Мексиканская', es: 'Mexicana' },
  Moldovan: { en: 'Moldovan', ro: 'Moldoveneasca', ru: 'Молдавская', es: 'Moldava' },
  Moroccan: { en: 'Moroccan', ro: 'Marocana', ru: 'Марокканская', es: 'Marroquí' },
  'North Macedonian': { en: 'North Macedonian', ro: 'Nord-Macedoneana', ru: 'Северомакедонская', es: 'Macedonia del Norte' },
  Norwegian: { en: 'Norwegian', ro: 'Norvegiana', ru: 'Норвежская', es: 'Noruega' },
  Polish: { en: 'Polish', ro: 'Poloneza', ru: 'Польская', es: 'Polaca' },
  Portuguese: { en: 'Portuguese', ro: 'Portugheza', ru: 'Португальская', es: 'Portuguesa' },
  Romanian: { en: 'Romanian', ro: 'Romaneasca', ru: 'Румынская', es: 'Rumana' },
  Russian: { en: 'Russian', ro: 'Ruseasca', ru: 'Русская', es: 'Rusa' },
  Serbian: { en: 'Serbian', ro: 'Sarbeasca', ru: 'Сербская', es: 'Serbia' },
  Spanish: { en: 'Spanish', ro: 'Spaniola', ru: 'Испанская', es: 'Española' },
  Swedish: { en: 'Swedish', ro: 'Suedeza', ru: 'Шведская', es: 'Sueca' },
  Thai: { en: 'Thai', ro: 'Tailandeza', ru: 'Тайская', es: 'Tailandesa' },
  Tunisian: { en: 'Tunisian', ro: 'Tunisiana', ru: 'Тунисская', es: 'Tunecina' },
  Turkish: { en: 'Turkish', ro: 'Turceasca', ru: 'Турецкая', es: 'Turca' },
  Ukrainian: { en: 'Ukrainian', ro: 'Ucraineana', ru: 'Украинская', es: 'Ucraniana' },
  Vietnamese: { en: 'Vietnamese', ro: 'Vietnameza', ru: 'Вьетнамская', es: 'Vietnamita' },
}

// Category translations
const categoryNames: Record<string, Record<string, string>> = {
  Beef: { en: 'Beef', ro: 'Vita', ru: 'Говядина', es: 'Res' },
  Breakfast: { en: 'Breakfast', ro: 'Mic dejun', ru: 'Завтрак', es: 'Desayuno' },
  Chicken: { en: 'Chicken', ro: 'Pui', ru: 'Курица', es: 'Pollo' },
  Dessert: { en: 'Dessert', ro: 'Desert', ru: 'Десерт', es: 'Postre' },
  Goat: { en: 'Goat', ro: 'Capra', ru: 'Козлятина', es: 'Cabra' },
  Lamb: { en: 'Lamb', ro: 'Miel', ru: 'Баранина', es: 'Cordero' },
  Miscellaneous: { en: 'Other', ro: 'Altele', ru: 'Прочее', es: 'Otros' },
  Pasta: { en: 'Pasta', ro: 'Paste', ru: 'Паста', es: 'Pasta' },
  Pork: { en: 'Pork', ro: 'Porc', ru: 'Свинина', es: 'Cerdo' },
  Seafood: { en: 'Seafood', ro: 'Fructe de mare', ru: 'Морепродукты', es: 'Mariscos' },
  Side: { en: 'Side', ro: 'Garnitura', ru: 'Гарнир', es: 'Acompañamiento' },
  Starter: { en: 'Starter', ro: 'Aperitiv', ru: 'Закуска', es: 'Entrada' },
  Vegan: { en: 'Vegan', ro: 'Vegan', ru: 'Веган', es: 'Vegano' },
  Vegetarian: { en: 'Vegetarian', ro: 'Vegetarian', ru: 'Вегетарианское', es: 'Vegetariano' },
  Soup: { en: 'Soup', ro: 'Supa', ru: 'Суп', es: 'Sopa' },
}

function getTranslated(map: Record<string, Record<string, string>>, key: string, lang: string): string {
  return map[key]?.[lang] || key
}

interface FilterBarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function FilterBar({ collapsed, onToggle }: FilterBarProps) {
  const filters = useSpinStore((s) => s.filters)
  const setFilters = useSpinStore((s) => s.setFilters)
  const allMeals = useSpinStore((s) => s.allMeals)
  const t = useSettingsStore((s) => s.t)
  const lang = useSettingsStore((s) => s.language)
  const [cuisineSearch, setCuisineSearch] = useState('')
  const [showCuisines, setShowCuisines] = useState(false)
  const [showCategories, setShowCategories] = useState(false)

  const CUISINES = useMemo(() => {
    const areas = new Set(allMeals.map((m) => m.area).filter(Boolean))
    return [...areas].sort((a, b) => a.localeCompare(b))
  }, [allMeals])

  const CATEGORIES = useMemo(() => {
    const cats = new Set(allMeals.map((m) => m.category).filter(Boolean))
    return [...cats].sort((a, b) => a.localeCompare(b))
  }, [allMeals])

  const filteredCuisines = cuisineSearch.trim()
    ? CUISINES.filter((c) => {
        const translated = getTranslated(cuisineNames, c, lang).toLowerCase()
        const q = cuisineSearch.toLowerCase()
        return translated.includes(q) || c.toLowerCase().includes(q)
      })
    : CUISINES

  const toggleCuisine = (c: string) => {
    if (c === 'All') {
      setFilters({ cuisines: [] })
    } else {
      const current = filters.cuisines
      if (current.includes(c)) {
        setFilters({ cuisines: current.filter((x) => x !== c) })
      } else {
        setFilters({ cuisines: [...current, c] })
      }
    }
  }

  const toggleCategory = (c: string) => {
    if (c === 'All') {
      setFilters({ categories: [] })
    } else {
      const current = filters.categories
      if (current.includes(c)) {
        setFilters({ categories: current.filter((x) => x !== c) })
      } else {
        setFilters({ categories: [...current, c] })
      }
    }
  }

  const pillStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    borderRadius: 'var(--radius-full)',
    background: active ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
    color: active ? '#fff' : 'var(--text-secondary)',
    fontSize: '12px',
    fontWeight: active ? 600 : 400,
    whiteSpace: 'nowrap',
    border: active ? 'none' : '1px solid rgba(255,255,255,0.08)',
    boxShadow: active ? '0 2px 12px var(--accent-glow)' : 'none',
    transition: 'all 0.2s',
    flexShrink: 0,
    minHeight: '32px',
    minWidth: 'auto',
  })

  const activeCuisineCount = filters.cuisines.length
  const activeCategoryCount = filters.categories.length
  const activeCuisineLabel = activeCuisineCount > 0
    ? filters.cuisines.map((c) => getTranslated(cuisineNames, c, lang)).join(', ')
    : t('filter.all')
  const activeCategoryLabel = activeCategoryCount > 0
    ? filters.categories.map((c) => getTranslated(categoryNames, c, lang)).join(', ')
    : t('filter.all')

  if (collapsed) {
    return (
      <button
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '8px 12px', marginBottom: '10px',
          borderRadius: '10px', background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px',
          color: 'var(--text-secondary)',
        }}
      >
        <span style={{ display: 'flex', gap: '12px', overflow: 'hidden' }}>
          <span>🌍 {activeCuisineLabel}</span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span>🍽️ {activeCategoryLabel}</span>
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    )
  }

  return (
    <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {/* Cuisine toggle */}
      <div>
        <button
          onClick={() => { setShowCuisines(!showCuisines); setShowCategories(false) }}
          style={{
            width: '100%', padding: '8px 12px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', borderRadius: showCuisines ? '10px 10px 0 0' : '10px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🌍 {t('filter.cuisine')}:
            <span style={{ color: activeCuisineCount > 0 ? 'var(--accent-light)' : 'var(--text-muted)', fontWeight: 500 }}>
              {activeCuisineLabel}
            </span>
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5"
            style={{ transform: showCuisines ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {showCuisines && (
          <div style={{
            padding: '8px', borderRadius: '0 0 10px 10px',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderTop: 'none',
          }}>
            <input
              type="text"
              value={cuisineSearch}
              onChange={(e) => setCuisineSearch(e.target.value)}
              placeholder="🔍"
              style={{
                width: '100%', padding: '5px 10px', borderRadius: '8px', fontSize: '12px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-primary)', outline: 'none', marginBottom: '8px',
              }}
            />
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button onClick={() => toggleCuisine('All')} style={pillStyle(filters.cuisines.length === 0)}>
                {t('filter.all')}
              </button>
              {filteredCuisines.map((c) => (
                <button key={c} onClick={() => toggleCuisine(c)} style={pillStyle(filters.cuisines.includes(c))}>
                  {getTranslated(cuisineNames, c, lang)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category toggle */}
      <div>
        <button
          onClick={() => { setShowCategories(!showCategories); setShowCuisines(false) }}
          style={{
            width: '100%', padding: '8px 12px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', borderRadius: showCategories ? '10px 10px 0 0' : '10px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🍽️ {t('filter.category')}:
            <span style={{ color: activeCategoryCount > 0 ? 'var(--accent-light)' : 'var(--text-muted)', fontWeight: 500 }}>
              {activeCategoryLabel}
            </span>
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5"
            style={{ transform: showCategories ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {showCategories && (
          <div style={{
            padding: '8px', borderRadius: '0 0 10px 10px',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderTop: 'none',
          }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button onClick={() => toggleCategory('All')} style={pillStyle(filters.categories.length === 0)}>
                {t('filter.all')}
              </button>
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => toggleCategory(c)} style={pillStyle(filters.categories.includes(c))}>
                  {getTranslated(categoryNames, c, lang)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
