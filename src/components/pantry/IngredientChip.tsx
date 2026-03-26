import { motion } from 'framer-motion'
import type { PantryIngredient } from '../../types'

interface IngredientChipProps {
  ingredient: PantryIngredient
  onToggle: () => void
  onRemove: () => void
}

export function IngredientChip({ ingredient, onToggle, onRemove }: IngredientChipProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 10px',
        borderRadius: 'var(--radius-full)',
        background: ingredient.enabled
          ? 'linear-gradient(135deg, var(--accent), var(--accent-light))'
          : 'rgba(255,255,255,0.06)',
        border: ingredient.enabled
          ? 'none'
          : '1px solid rgba(255,255,255,0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <span
        onClick={onToggle}
        style={{
          fontSize: '13px',
          fontWeight: ingredient.enabled ? 600 : 400,
          color: ingredient.enabled ? '#fff' : 'var(--text-muted)',
          textDecoration: ingredient.enabled ? 'none' : 'line-through',
          whiteSpace: 'nowrap',
        }}
      >
        {ingredient.name}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '18px',
          height: '18px',
          minHeight: '18px',
          minWidth: '18px',
          borderRadius: '50%',
          background: ingredient.enabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
          padding: 0,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={ingredient.enabled ? '#fff' : 'var(--text-muted)'} strokeWidth="3" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </motion.div>
  )
}
