import { useFavoritesStore } from '../../stores/useFavoritesStore'
import { useSettingsStore } from '../../stores/useSettingsStore'
import type { Meal } from '../../types'
import { getText } from '../../types'

interface FavoritesSectionProps {
  onSelectRecipe: (meal: Meal) => void
}

export function FavoritesSection({ onSelectRecipe }: FavoritesSectionProps) {
  const favorites = useFavoritesStore((s) => s.favorites)
  const t = useSettingsStore((s) => s.t)
  const lang = useSettingsStore((s) => s.language)

  return (
    <section style={{ marginTop: '8px' }}>
      <h3 style={{
        fontSize: '16px', fontWeight: 600, marginBottom: '12px',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {t('favorites.title')} ({favorites.length})
      </h3>

      {favorites.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '24px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('favorites.empty')}</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
        }}>
          {favorites.map((meal) => {
            const mealName = getText(meal.name, lang)
            return (
              <button
                key={meal.id}
                onClick={() => onSelectRecipe(meal)}
                style={{
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  textAlign: 'left',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <img
                  src={meal.thumbnail}
                  alt={mealName}
                  loading="lazy"
                  style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                  }}
                />
                <div style={{ padding: '8px 10px' }}>
                  <p style={{
                    fontSize: '13px', fontWeight: 600, lineHeight: 1.2,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                    {mealName}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {meal.area}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
