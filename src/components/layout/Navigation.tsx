import { motion } from 'framer-motion'
import { useSettingsStore, type ThemeMode } from '../../stores/useSettingsStore'

export type Tab = 'spin' | 'favorites' | 'pantry' | 'settings'

interface NavigationProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs: { id: Tab; labelKey: string; icon: string }[] = [
  { id: 'spin', labelKey: 'nav.spin', icon: 'spin' },
  { id: 'favorites', labelKey: 'nav.favorites', icon: 'favorites' },
  { id: 'pantry', labelKey: 'nav.pantry', icon: 'pantry' },
  { id: 'settings', labelKey: 'nav.settings', icon: 'settings' },
]

function TabIcon({ type, active }: { type: string; active: boolean }) {
  const color = active ? 'var(--accent-light)' : 'var(--text-muted)'

  switch (type) {
    case 'spin':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10" />
          <path d="M12 6v6l4 2" />
          <path d="M20 4l-2 4h4" />
        </svg>
      )
    case 'favorites':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )
    case 'pantry':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    case 'settings':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    default:
      return null
  }
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const t = useSettingsStore((s) => s.t)
  const theme = useSettingsStore((s) => s.theme) as ThemeMode
  const isLight = theme === 'light' || theme === 'cream'

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 0',
        paddingTop: '10px',
        paddingBottom: `calc(8px + var(--safe-bottom))`,
        background: isLight ? 'var(--bg-secondary)' : 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderTop: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id
        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.92 }}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 16px',
              position: 'relative',
              background: active ? 'rgba(249,115,22,0.08)' : 'transparent',
              borderRadius: '8px',
              transition: 'background 0.2s',
            }}
          >
            <TabIcon type={tab.icon} active={active} />
            <span
              style={{
                fontSize: '12px',
                color: active ? 'var(--accent-light)' : 'var(--text-muted)',
                fontWeight: active ? 600 : 400,
              }}
            >
              {t(tab.labelKey)}
            </span>
            {active && (
              <motion.div
                layoutId="nav-indicator"
                style={{
                  width: '20px',
                  height: '3px',
                  borderRadius: '1.5px',
                  background: 'var(--accent)',
                  position: 'absolute',
                  top: 0,
                  alignSelf: 'center',
                  left: 0,
                  right: 0,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  boxShadow: '0 0 8px var(--accent-glow)',
                }}
              />
            )}
          </motion.button>
        )
      })}
    </nav>
  )
}
