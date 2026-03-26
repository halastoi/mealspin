import { useState, useMemo } from 'react'
import { useSpinStore } from '../../stores/useSpinStore'
import { usePantryStore } from '../../stores/usePantryStore'
import { useSettingsStore } from '../../stores/useSettingsStore'

export function IngredientSearch() {
  const [query, setQuery] = useState('')
  const allIngredients = useSpinStore((s) => s.allIngredients)
  const pantryIngredients = usePantryStore((s) => s.ingredients)
  const addIngredient = usePantryStore((s) => s.addIngredient)
  const t = useSettingsStore((s) => s.t)

  const filtered = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return allIngredients
      .filter((name) => name.toLowerCase().includes(q))
      .slice(0, 20)
  }, [query, allIngredients])

  const isAdded = (name: string) =>
    pantryIngredients.some((i) => i.name.toLowerCase() === name.toLowerCase())

  const handleAdd = (name: string) => {
    addIngredient(name)
    setQuery('')
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        position: 'relative',
        marginBottom: filtered.length > 0 ? '0' : '0',
      }}>
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('pantry.search')}
          style={{
            width: '100%',
            padding: '12px 12px 12px 40px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-card)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
              width: '28px', height: '28px', minHeight: '28px', minWidth: '28px',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.08)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {filtered.length > 0 && (
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '0 0 var(--radius-md) var(--radius-md)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderTop: 'none',
          maxHeight: '200px',
          overflowY: 'auto',
        }}>
          {filtered.map((name) => {
            const added = isAdded(name)
            return (
              <button
                key={name}
                onClick={() => !added && handleAdd(name)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  background: 'transparent',
                  minHeight: '44px',
                  opacity: added ? 0.5 : 1,
                }}
              >
                <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{name}</span>
                {added ? (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('pantry.alreadyAdded')}</span>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
