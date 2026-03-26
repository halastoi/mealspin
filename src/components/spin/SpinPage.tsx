import { useState, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useSpinStore } from '../../stores/useSpinStore'
import { usePantryStore } from '../../stores/usePantryStore'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { SpinButton } from './SpinButton'
import { RecipeCard } from './RecipeCard'
import { FilterBar } from './FilterBar'
import { getText } from '../../types'
import type { Meal } from '../../types'

interface SpinPageProps {
  onSwitchToPantry: () => void
  onSelectRecipe: (meal: Meal) => void
  onShowAllRecipes: () => void
}

export function SpinPage({ onSwitchToPantry, onSelectRecipe, onShowAllRecipes }: SpinPageProps) {
  const { currentMatch, isSpinning, allMeals, spin, filters } = useSpinStore()
  const pantryIngredients = usePantryStore((s) => s.ingredients)
  const maxMissing = useSettingsStore((s) => s.maxMissing)
  const t = useSettingsStore((s) => s.t)
  const language = useSettingsStore((s) => s.language)
  const [searchQuery, setSearchQuery] = useState('')
  const [collapseFilters, setCollapseFilters] = useState(false)

  const enabledCount = pantryIngredients.filter((i) => i.enabled).length

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return allMeals
      .filter((m) => getText(m.name, language).toLowerCase().includes(q) || getText(m.name, 'en').toLowerCase().includes(q))
      .slice(0, 10)
  }, [searchQuery, allMeals, language])

  const handleSpin = () => {
    // If pantry is empty, allow any recipe (set maxMissing very high)
    const effectiveMaxMissing = enabledCount === 0 ? 999 : maxMissing
    useSpinStore.getState().setFilters({ ...filters, maxMissing: effectiveMaxMissing })
    spin(pantryIngredients)
    // Collapse filters on mobile after spin
    setCollapseFilters(true)
  }

  return (
    <div style={{
      padding: '12px 12px',
      overflowY: 'auto',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <FilterBar collapsed={collapseFilters} onToggle={() => setCollapseFilters(!collapseFilters)} />

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: '10px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('spin.search')}
          style={{
            width: '100%', padding: '10px 12px 10px 38px', borderRadius: '12px',
            background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
          }}
        />
        {searchResults.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
            background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0 0 12px 12px', maxHeight: '250px', overflowY: 'auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            {searchResults.map((meal) => (
              <button
                key={meal.id}
                onClick={() => { onSelectRecipe(meal); setSearchQuery('') }}
                style={{
                  width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)', textAlign: 'left',
                }}
              >
                <img src={meal.thumbnail} alt="" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{getText(meal.name, language)}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{meal.area} · {meal.category}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status bar: recipes count + ingredients + spin again */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', alignItems: 'center' }}>
        <button
          onClick={onShowAllRecipes}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            padding: '8px 12px', borderRadius: 'var(--radius-full)',
            background: 'rgba(74,222,128,0.08)',
            border: '1px solid rgba(74,222,128,0.2)',
            fontSize: '12px', color: '#4ade80', fontWeight: 500,
          }}
        >
          {allMeals.length} {t('spin.recipes')}
        </button>

        <button
          onClick={onSwitchToPantry}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            padding: '8px 12px', borderRadius: 'var(--radius-full)',
            background: enabledCount > 0 ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(249,115,22,0.2)',
            fontSize: '12px', color: enabledCount > 0 ? 'var(--accent-light)' : 'var(--text-muted)', fontWeight: 500,
          }}
        >
          🧺 {enabledCount}
        </button>

        {/* Spin Again - right side, same size */}
        {currentMatch && !isSpinning && (
          <button
            onClick={handleSpin}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
              padding: '8px 12px', borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
              color: '#fff', fontSize: '12px', fontWeight: 600,
              boxShadow: '0 2px 10px var(--accent-glow)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H20" />
              <path d="M18 2l4 4-4 4" />
              <path d="M2 6h1.4c1.3 0 2.5.6 3.3 1.7l6.1 8.6c.7 1.1 2 1.7 3.3 1.7H20" />
              <path d="M18 14l4 4-4 4" />
            </svg>
            {t('spin.again')}
          </button>
        )}
      </div>

      {/* Main spin area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: currentMatch ? 'flex-start' : 'center',
        gap: '20px',
      }}>
        <AnimatePresence mode="wait">
          {currentMatch && !isSpinning && (
            <RecipeCard
              key={currentMatch.meal.id}
              match={currentMatch}
              onClick={() => onSelectRecipe(currentMatch.meal)}
            />
          )}
        </AnimatePresence>

        {!currentMatch && !isSpinning && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍳</div>
            <p style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>
              {t('spin.title')}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              {enabledCount === 0 ? t('spin.emptyPantryHint') : t('spin.ready')}
            </p>
          </div>
        )}

        {!currentMatch && (
          <SpinButton
            onSpin={handleSpin}
            isSpinning={isSpinning}
            hasSpun={false}
          />
        )}
      </div>
    </div>
  )
}
