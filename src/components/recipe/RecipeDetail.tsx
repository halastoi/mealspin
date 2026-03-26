import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Meal } from '../../types'
import { getText } from '../../types'
import { useFavoritesStore } from '../../stores/useFavoritesStore'
import { usePantryStore } from '../../stores/usePantryStore'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { ingredientMatch } from '../../utils/parseIngredients'
import { translateMeasure } from '../../utils/translateMeasure'

interface RecipeDetailProps {
  meal: Meal
  onBack: () => void
}

export function RecipeDetail({ meal, onBack }: RecipeDetailProps) {
  const [tappedIngIdx, setTappedIngIdx] = useState<number | null>(null)
  const [showOriginalName, setShowOriginalName] = useState(false)
  const [tappedStepIdx, setTappedStepIdx] = useState<number | null>(null)
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore()
  const pantryIngredients = usePantryStore((s) => s.ingredients)
  const t = useSettingsStore((s) => s.t)
  const lang = useSettingsStore((s) => s.language)

  const saved = isFavorite(meal.id)
  const enabledPantry = pantryIngredients.filter((p) => p.enabled)

  const hasIngredient = (ingName: Record<string, string>) =>
    enabledPantry.some((p) => ingredientMatch(p.name, ingName['en'] || ingName.en || ''))

  const mealName = getText(meal.name, lang)
  const mealInstructions = getText(meal.instructions, lang)

  const handleShare = async () => {
    const text = `${mealName} - ${meal.area} ${meal.category}\n${meal.thumbnail}`
    if (navigator.share) {
      try {
        await navigator.share({ title: mealName, text })
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  const instructionSteps = mealInstructions
    .split(/\r\n|\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  const instructionStepsEn = getText(meal.instructions, 'en')
    .split(/\r\n|\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'var(--bg-primary)',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Hero image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/11' }}>
        <img
          src={meal.thumbnail}
          alt={mealName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '0 0 24px 24px',
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          borderRadius: '0 0 24px 24px',
        }} />

        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: `calc(12px + var(--safe-top))`,
            left: '12px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        {/* Badges */}
        <div style={{
          position: 'absolute', bottom: '16px', left: '16px',
          display: 'flex', gap: '8px',
        }}>
          <span style={{
            padding: '4px 12px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent)', color: '#fff',
            fontSize: '12px', fontWeight: 600,
          }}>
            {meal.category}
          </span>
          <span style={{
            padding: '4px 12px', borderRadius: 'var(--radius-full)',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
            color: '#fff', fontSize: '12px', fontWeight: 500,
          }}>
            {meal.area}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 16px', paddingBottom: `calc(20px + var(--safe-bottom))` }}>
        {/* Title - tap to show original */}
        <button
          onClick={() => lang !== 'en' && setShowOriginalName(!showOriginalName)}
          style={{ textAlign: 'left', marginBottom: '16px', width: '100%' }}
        >
          <h1 style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1.2 }}>
            {mealName}
          </h1>
          {showOriginalName && lang !== 'en' && (
            <div style={{ fontSize: '13px', color: 'var(--accent-light)', fontStyle: 'italic', marginTop: '4px' }}>
              {meal.name.en}
            </div>
          )}
        </button>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <button
            onClick={() => saved ? removeFavorite(meal.id) : addFavorite(meal)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: saved ? 'linear-gradient(135deg, var(--accent), var(--accent-light))' : 'rgba(255,255,255,0.06)',
              color: saved ? '#fff' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 600,
              border: saved ? 'none' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: saved ? '0 4px 16px var(--accent-glow)' : 'none',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? '#fff' : 'none'} stroke={saved ? '#fff' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {saved ? t('recipe.saved') : t('recipe.save')}
          </button>
          <button
            onClick={handleShare}
            style={{
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 500,
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            {t('recipe.share')}
          </button>
        </div>

        {/* YouTube */}
        {meal.youtube && (
          <a
            href={meal.youtube}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,0,0,0.1)',
              color: '#ff4444',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '24px',
              border: '1px solid rgba(255,0,0,0.2)',
              textDecoration: 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff4444">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            {t('recipe.video')}
          </a>
        )}

        {/* Ingredients */}
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
            {t('recipe.ingredients')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {meal.ingredients.map((ing, idx) => {
              const has = hasIngredient(ing.name)
              const hasPantry = pantryIngredients.length > 0
              const ingDisplay = getText(ing.name, lang)
              const showStatus = hasPantry
              const isTapped = tappedIngIdx === idx
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: !showStatus ? 'rgba(255,255,255,0.04)' : has ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.06)',
                    border: !showStatus ? '1px solid rgba(255,255,255,0.08)' : has ? '1px solid rgba(74,222,128,0.15)' : '1px solid rgba(248,113,113,0.1)',
                  }}
                >
                  {showStatus && (has ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  ))}
                  <button
                    onClick={() => setTappedIngIdx(isTapped ? null : idx)}
                    style={{ flex: 1, textAlign: 'left', minHeight: '20px' }}
                  >
                    <span style={{ fontSize: '14px', color: !showStatus ? 'var(--text-primary)' : has ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {ingDisplay}
                    </span>
                    {isTapped && lang !== 'en' && (
                      <div style={{ fontSize: '11px', color: 'var(--accent-light)', fontStyle: 'italic', marginTop: '2px' }}>
                        {ing.name.en}
                      </div>
                    )}
                  </button>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', flexShrink: 0 }}>
                    {translateMeasure(ing.measure, lang)}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Instructions */}
        <section>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
            {t('recipe.instructions')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {instructionSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => lang !== 'en' && setTappedStepIdx(tappedStepIdx === idx ? null : idx)}
                style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', textAlign: 'left', width: '100%' }}
              >
                <span style={{
                  fontSize: '12px', fontWeight: 700, color: 'var(--accent)',
                  minWidth: '24px', height: '24px', lineHeight: '24px', textAlign: 'center',
                  borderRadius: '50%', background: 'rgba(249,115,22,0.15)',
                  flexShrink: 0,
                }}>
                  {idx + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    {step}
                  </p>
                  {tappedStepIdx === idx && lang !== 'en' && instructionStepsEn[idx] && (
                    <p style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--accent-light)', fontStyle: 'italic', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      {instructionStepsEn[idx]}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  )
}
