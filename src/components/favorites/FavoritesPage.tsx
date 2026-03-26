import { useFavoritesStore } from '../../stores/useFavoritesStore'
import { useSettingsStore } from '../../stores/useSettingsStore'
import type { Meal } from '../../types'
import { getText } from '../../types'

interface FavoritesPageProps {
  onSelectRecipe: (meal: Meal) => void
}

export function FavoritesPage({ onSelectRecipe }: FavoritesPageProps) {
  const favorites = useFavoritesStore((s) => s.favorites)
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite)
  const t = useSettingsStore((s) => s.t)
  const lang = useSettingsStore((s) => s.language)

  return (
    <div style={{ padding: '20px 8px', overflowY: 'auto', height: '100%' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {t('favorites.title')}
        {favorites.length > 0 && (
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 400 }}>
            ({favorites.length})
          </span>
        )}
      </h2>

      {favorites.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>❤️</div>
          <p style={{ fontSize: '15px', fontWeight: 500, marginBottom: '4px' }}>{t('favorites.empty')}</p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('favorites.emptyHint')}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {favorites.map((meal) => {
            const mealName = getText(meal.name, lang)
            return (
              <div
                key={meal.id}
                style={{
                  borderRadius: '14px', overflow: 'hidden',
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                  position: 'relative',
                }}
              >
                <button
                  onClick={() => onSelectRecipe(meal)}
                  style={{ width: '100%', padding: 0, textAlign: 'left', display: 'flex', flexDirection: 'column' }}
                >
                  <img
                    src={meal.thumbnail}
                    alt={mealName}
                    loading="lazy"
                    style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '10px 12px' }}>
                    <p style={{
                      fontSize: '13px', fontWeight: 600, lineHeight: 1.3,
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                      {mealName}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {meal.area} · {meal.category}
                    </p>
                  </div>
                </button>
                {/* Remove button */}
                <button
                  onClick={() => removeFavorite(meal.id)}
                  style={{
                    position: 'absolute', top: '6px', right: '6px',
                    width: '28px', height: '28px', minWidth: '28px', minHeight: '28px',
                    borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
