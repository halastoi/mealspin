import { motion } from 'framer-motion'
import { useSettingsStore } from '../../stores/useSettingsStore'

interface SpinButtonProps {
  onSpin: () => void
  isSpinning: boolean
  hasSpun: boolean
}

export function SpinButton({ onSpin, isSpinning, hasSpun }: SpinButtonProps) {
  const t = useSettingsStore((s) => s.t)

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={onSpin}
      disabled={isSpinning}
      style={{
        width: hasSpun ? '180px' : '160px',
        height: hasSpun ? '180px' : '160px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #f97316, #fb923c, #f97316)',
        backgroundSize: '200% 200%',
        color: '#fff',
        fontSize: hasSpun ? '18px' : '22px',
        fontWeight: 700,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: '0 8px 40px rgba(249,115,22,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 -2px 8px rgba(0,0,0,0.2)',
        border: '3px solid rgba(255,255,255,0.2)',
        cursor: isSpinning ? 'wait' : 'pointer',
        opacity: isSpinning ? 0.8 : 1,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Shine effect */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
        transition={isSpinning ? { duration: 1, repeat: Infinity, ease: 'linear' } : { duration: 0 }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10" />
          <path d="M12 6v6l4 2" />
          <path d="M20 4l-2 4h4" />
        </svg>
      </motion.div>
      <span style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
        {isSpinning ? '...' : hasSpun ? t('spin.again') : t('spin.button')}
      </span>
    </motion.button>
  )
}
