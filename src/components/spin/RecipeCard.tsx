import { motion } from 'framer-motion'
import type { RecipeMatch } from '../../types'
import { getText } from '../../types'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { usePantryStore } from '../../stores/usePantryStore'
import { useFavoritesStore } from '../../stores/useFavoritesStore'

interface RecipeCardProps {
  match: RecipeMatch
  onClick: () => void
}

const cuisineEmojis: Record<string, string> = {
  Italian: 'IT', Mexican: 'MX', Chinese: 'CN', Indian: 'IN',
  Japanese: 'JP', Thai: 'TH', American: 'US', French: 'FR',
  British: 'GB', Canadian: 'CA', Greek: 'GR', Spanish: 'ES',
  Turkish: 'TR', Vietnamese: 'VN', Moroccan: 'MA', Egyptian: 'EG',
  Malaysian: 'MY', Filipino: 'PH', Irish: 'IE', Jamaican: 'JM',
  Dutch: 'NL', Polish: 'PL', Portuguese: 'PT', Russian: 'RU',
  Croatian: 'HR', Tunisian: 'TN', Kenyan: 'KE',
}

export function RecipeCard({ match, onClick }: RecipeCardProps) {
  const t = useSettingsStore((s) => s.t)
  const lang = useSettingsStore((s) => s.language)
  const hasPantry = usePantryStore((s) => s.ingredients.length > 0)
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore()
  const { meal, matchCount, totalIngredients, missingIngredients, matchPercent } = match
  const saved = isFavorite(meal.id)

  const mealName = getText(meal.name, lang)
  const percentColor = matchPercent >= 80 ? '#4ade80' : matchPercent >= 50 ? '#fbbf24' : '#f87171'

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onClick={onClick}
      style={{
        background: 'var(--gradient-card)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'var(--shadow-lg)',
        cursor: 'pointer',
        width: '100%',
        maxWidth: '380px',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden' }}>
        <img
          src={meal.thumbnail}
          alt={mealName}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
        }} />

        {/* Favorite heart */}
        <button
          onClick={(e) => { e.stopPropagation(); saved ? removeFavorite(meal.id) : addFavorite(meal) }}
          style={{
            position: 'absolute', top: '10px', left: '10px',
            width: '32px', height: '32px', minWidth: '32px', minHeight: '32px',
            borderRadius: '50%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? '#f87171' : 'none'} stroke={saved ? '#f87171' : '#fff'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Category badge */}
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          padding: '4px 10px', borderRadius: 'var(--radius-full)',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
          fontSize: '12px', fontWeight: 500, color: '#fff',
          border: '1px solid rgba(255,255,255,0.15)',
        }}>
          {meal.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '4px', lineHeight: 1.2 }}>
              {mealName}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {cuisineEmojis[meal.area] || ''} {meal.area}
            </span>
          </div>
        </div>

        {hasPantry ? (
          <>
            {/* Match percentage bar */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {matchCount} {t('recipe.of')} {totalIngredients} {t('recipe.match')}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: percentColor }}>
                  {matchPercent}%
                </span>
              </div>
              <div style={{
                width: '100%', height: '6px', borderRadius: '3px',
                background: 'rgba(255,255,255,0.08)', overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${matchPercent}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                  style={{
                    height: '100%', borderRadius: '3px',
                    background: `linear-gradient(90deg, ${percentColor}, ${percentColor}aa)`,
                  }}
                />
              </div>
            </div>

            {/* Missing ingredients */}
            {missingIngredients.length > 0 && (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--danger)' }}>
                  {missingIngredients.length} {t('recipe.missing')}:
                </span>{' '}
                {missingIngredients.slice(0, 3).join(', ')}
                {missingIngredients.length > 3 && ` +${missingIngredients.length - 3}`}
              </div>
            )}
          </>
        ) : (
          /* No pantry - just show ingredients list */
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {totalIngredients} {t('recipe.ingredients').toLowerCase()}:{' '}
            {meal.ingredients.slice(0, 4).map((ing) => getText(ing.name, lang)).join(', ')}
            {totalIngredients > 4 && ` +${totalIngredients - 4}`}
          </div>
        )}
      </div>
    </motion.div>
  )
}
