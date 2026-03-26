import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useSpinStore } from '../../stores/useSpinStore'
import { usePantryStore } from '../../stores/usePantryStore'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { IngredientChip } from './IngredientChip'
import { ingredientCategories, type IngredientItem } from '../../data/ingredientCategories'
const categoryIcons: Record<string, string> = {
  'Meat & Poultry': '&#129385;', 'Seafood': '&#128031;', 'Dairy & Eggs': '&#129370;',
  'Vegetables': '&#129388;', 'Fruits': '&#127822;', 'Grains & Pasta': '&#127837;',
  'Spices & Herbs': '&#127807;', 'Oils & Sauces': '&#129747;', 'Baking': '&#129473;',
  'Canned & Preserved': '&#129387;', 'Nuts & Seeds': '&#129372;', 'Other': '&#128230;',
}

export function PantryPage() {
  const { ingredients, addIngredient, removeIngredient, toggleIngredient, clearAll, addCommonStaples } = usePantryStore()
  const allApiIngredients = useSpinStore((s) => s.allIngredients)
  const t = useSettingsStore((s) => s.t)
  const language = useSettingsStore((s) => s.language)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCat, setExpandedCat] = useState<string | null>(null)

  const isAdded = (name: string) => ingredients.some((i) => i.name.toLowerCase() === name.toLowerCase())
  const getIngName = (item: IngredientItem) => item[language] || item.en

  // Build full ingredient list: categories + any API ingredients not in categories
  const categorizedNames = new Set(
    ingredientCategories.flatMap((cat) => cat.items.map((item) => item.en.toLowerCase()))
  )
  const uncategorized = allApiIngredients.filter(
    (name) => !categorizedNames.has(name.toLowerCase())
  )

  // Search filter
  const query = searchQuery.toLowerCase().trim()

  return (
    <div style={{ padding: '16px 8px', paddingBottom: '16px', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>
          {t('pantry.title')}
          {ingredients.length > 0 && (
            <span style={{ fontSize: '14px', color: 'var(--accent-light)', fontWeight: 400, marginLeft: '8px' }}>
              ({ingredients.length})
            </span>
          )}
        </h2>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          onClick={addCommonStaples}
          style={{
            flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
            color: '#fff', fontSize: '13px', fontWeight: 600,
            boxShadow: '0 4px 16px var(--accent-glow)',
          }}
        >
          {t('pantry.staples')}
        </button>
        {ingredients.length > 0 && (
          <button
            onClick={clearAll}
            style={{
              padding: '10px 16px', borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.06)', color: 'var(--danger)',
              fontSize: '13px', fontWeight: 500, border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {t('pantry.clear')}
          </button>
        )}
      </div>

      {/* My selected ingredients */}
      {ingredients.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {t('pantry.selected')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <AnimatePresence>
              {ingredients.map((ing) => (
                <IngredientChip
                  key={ing.name}
                  ingredient={ing}
                  onToggle={() => toggleIngredient(ing.name)}
                  onRemove={() => removeIngredient(ing.name)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('pantry.search')}
          style={{
            width: '100%', padding: '10px 12px 10px 38px', borderRadius: '10px',
            background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
          }}
        />
      </div>

      {/* Browse ingredients by category */}
      {query ? (
        // Search results
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {[...ingredientCategories.flatMap((cat) => cat.items), ...uncategorized.map((n) => ({ en: n, ro: n, ru: n, es: n }))]
              .filter((item) => {
                const display = typeof item === 'string' ? item : getIngName(item)
                return display.toLowerCase().includes(query)
              })
              .slice(0, 50)
              .map((item) => {
                const enName = typeof item === 'string' ? item : item.en
                const displayName = typeof item === 'string' ? item : getIngName(item)
                const added = isAdded(enName)
                return (
                  <button
                    key={enName}
                    onClick={() => added ? removeIngredient(enName) : addIngredient(enName)}
                    style={{
                      padding: '6px 12px', borderRadius: '20px',
                      background: added ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.05)',
                      border: added ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(255,255,255,0.08)',
                      color: added ? '#4ade80' : 'var(--text-primary)',
                      fontSize: '13px', minHeight: '34px',
                    }}
                  >
                    {added ? '✓ ' : '+ '}{displayName}
                  </button>
                )
              })}
          </div>
        </div>
      ) : (
        // Category browsing
        <div style={{ marginBottom: '24px' }}>
          {ingredientCategories.map((cat) => {
            const catKey = cat.name.en
            const catName = cat.name[language] || cat.name.en
            const isExpanded = expandedCat === catKey
            const addedCount = cat.items.filter((i) => isAdded(i.en)).length
            return (
              <div key={catKey} style={{ marginBottom: '4px' }}>
                <button
                  onClick={() => setExpandedCat(isExpanded ? null : catKey)}
                  style={{
                    width: '100%', padding: '10px 12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderRadius: isExpanded ? '12px 12px 0 0' : '12px',
                    background: isExpanded ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderBottom: isExpanded ? '1px solid rgba(255,255,255,0.04)' : undefined,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500 }}>
                    <span style={{ fontSize: '18px' }} dangerouslySetInnerHTML={{ __html: categoryIcons[catKey] || '&#128230;' }} />
                    {catName}
                    {addedCount > 0 && (
                      <span style={{
                        fontSize: '10px', fontWeight: 700, color: '#4ade80',
                        background: 'rgba(74,222,128,0.15)', padding: '2px 6px', borderRadius: '8px',
                      }}>
                        {addedCount}
                      </span>
                    )}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5"
                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {isExpanded && (
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '6px',
                    padding: '10px 12px', borderRadius: '0 0 12px 12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none',
                  }}>
                    {cat.items.map((ing) => {
                      const added = isAdded(ing.en)
                      const displayName = getIngName(ing)
                      return (
                        <button
                          key={ing.en}
                          onClick={() => added ? removeIngredient(ing.en) : addIngredient(ing.en)}
                          style={{
                            padding: '5px 10px', borderRadius: '16px',
                            background: added ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.05)',
                            border: added ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(255,255,255,0.1)',
                            color: added ? '#4ade80' : 'var(--text-primary)',
                            fontSize: '12px', minHeight: '30px',
                          }}
                        >
                          {added ? '✓ ' : '+ '}{displayName}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* end of pantry */}
    </div>
  )
}
