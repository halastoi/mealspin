import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSpinStore } from '../../stores/useSpinStore'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { getText } from '../../types'
import { useFavoritesStore } from '../../stores/useFavoritesStore'
import type { Meal } from '../../types'

interface AllRecipesProps {
  onBack: () => void
  onSelectRecipe: (meal: Meal) => void
}

const PAGE_SIZE = 20

export function AllRecipes({ onBack, onSelectRecipe }: AllRecipesProps) {
  const allMeals = useSpinStore((s) => s.allMeals)
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore()
  const t = useSettingsStore((s) => s.t)
  const lang = useSettingsStore((s) => s.language)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    if (!search.trim()) return allMeals
    const q = search.toLowerCase()
    return allMeals.filter((m) =>
      getText(m.name, lang).toLowerCase().includes(q) ||
      getText(m.name, 'en').toLowerCase().includes(q) ||
      m.area.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    )
  }, [allMeals, search, lang])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'var(--bg-primary)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '10px 12px', paddingTop: `calc(10px + var(--safe-top))`,
        display: 'flex', alignItems: 'center', gap: '10px',
        background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.08)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            placeholder={t('spin.search')}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
            }}
          />
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>
          {filtered.length}
        </span>
      </div>

      {/* Recipe list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {paged.map((meal) => {
            const name = getText(meal.name, lang)
            const fav = isFavorite(meal.id)
            return (
              <div
                key={meal.id}
                style={{
                  display: 'flex', alignItems: 'center',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <button
                  onClick={() => onSelectRecipe(meal)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 10px', textAlign: 'left',
                  }}
                >
                <img
                  src={meal.thumbnail}
                  alt=""
                  loading="lazy"
                  style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px', fontWeight: 500,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {meal.area} · {meal.category}
                  </div>
                </div>
                </button>
                <button
                  onClick={() => fav ? removeFavorite(meal.id) : addFavorite(meal)}
                  style={{ padding: '10px', flexShrink: 0, minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={fav ? '#f87171' : 'none'} stroke={fav ? '#f87171' : 'var(--text-muted)'} strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', padding: '16px 0',
          }}>
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              style={{
                padding: '8px 16px', borderRadius: '10px',
                background: page === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
                color: page === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                fontSize: '13px', border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              ←
            </button>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              style={{
                padding: '8px 16px', borderRadius: '10px',
                background: page >= totalPages - 1 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
                color: page >= totalPages - 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                fontSize: '13px', border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              →
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
