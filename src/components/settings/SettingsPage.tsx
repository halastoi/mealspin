import { useSettingsStore, type Language, type ThemeMode } from '../../stores/useSettingsStore'

const languages: { id: Language; label: string; flag: string }[] = [
  { id: 'en', label: 'English', flag: 'EN' },
  { id: 'ro', label: 'Romana', flag: 'RO' },
  { id: 'ru', label: 'Русский', flag: 'RU' },
  { id: 'es', label: 'Espanol', flag: 'ES' },
]

const themeOptions: { id: ThemeMode; key: string }[] = [
  { id: 'dark', key: 'settings.theme.dark' },
  { id: 'midnight', key: 'settings.theme.midnight' },
  { id: 'amoled', key: 'settings.theme.amoled' },
  { id: 'ocean', key: 'settings.theme.ocean' },
]

function ThemePreview({ themeId }: { themeId: ThemeMode }) {
  const colors = getPreviewColors(themeId)
  return (
    <div
      style={{
        width: '48px',
        height: '32px',
        borderRadius: '6px',
        background: colors.bg,
        border: `1px solid ${colors.accent}40`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '10px',
          background: colors.card,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '6px',
          left: '6px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: colors.accent,
        }}
      />
    </div>
  )
}

function getPreviewColors(id: ThemeMode) {
  const map: Record<ThemeMode, { bg: string; card: string; accent: string }> = {
    dark: { bg: '#0a0a1a', card: '#181838', accent: '#f97316' },
    midnight: { bg: '#0d1117', card: '#1c2333', accent: '#f97316' },
    amoled: { bg: '#000000', card: '#141414', accent: '#f97316' },
    ocean: { bg: '#0a1628', card: '#152640', accent: '#f97316' },
  }
  return map[id]
}

export function SettingsPage() {
  const { language, theme, maxMissing, setLanguage, setTheme, setMaxMissing, t } = useSettingsStore()

  return (
    <div style={{ padding: '20px 8px', paddingBottom: '16px', overflowY: 'auto', height: '100%' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>
        {t('settings.title')}
      </h2>

      {/* Language */}
      <section style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {t('settings.language')}
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 4px',
                borderRadius: 'var(--radius-md)',
                background: language === lang.id ? 'var(--bg-active)' : 'var(--bg-card)',
                border: language === lang.id ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 700, color: language === lang.id ? 'var(--accent-light)' : 'var(--text-secondary)' }}>{lang.flag}</span>
              <span style={{ fontSize: '11px', fontWeight: language === lang.id ? 600 : 400, color: language === lang.id ? 'var(--accent-light)' : 'var(--text-secondary)' }}>
                {lang.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Theme */}
      <section style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {t('settings.theme')}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {themeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              style={{
                padding: '16px 12px',
                borderRadius: 'var(--radius-md)',
                background: theme === opt.id ? 'var(--bg-active)' : 'var(--bg-card)',
                border: theme === opt.id ? '2px solid var(--accent)' : '2px solid transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
            >
              <ThemePreview themeId={opt.id} />
              <span style={{ fontSize: '13px', fontWeight: theme === opt.id ? 600 : 400 }}>
                {t(opt.key)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Max Missing Ingredients */}
      <section style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {t('filter.maxMissing')}
        </h3>
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t('filter.maxMissing')}</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-light)' }}>{maxMissing}</span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={maxMissing}
            onChange={(e) => setMaxMissing(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>0</span>
            <span>5</span>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {t('settings.howToUse')}
        </h3>
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { icon: '1', title: t('howto.pantry.title'), desc: t('howto.pantry.desc') },
            { icon: '2', title: t('howto.spin.title'), desc: t('howto.spin.desc') },
            { icon: '3', title: t('howto.filter.title'), desc: t('howto.filter.desc') },
            { icon: '4', title: t('howto.save.title'), desc: t('howto.save.desc') },
            { icon: '5', title: t('howto.install.title'), desc: t('howto.install.desc.android') + '\n' + t('howto.install.desc.ios') },
          ].map((item) => (
            <div key={item.icon} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{
                fontSize: '12px', fontWeight: 700, flexShrink: 0, width: '24px', height: '24px',
                textAlign: 'center', lineHeight: '24px', borderRadius: '50%',
                background: 'var(--accent)', color: '#fff',
              }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4, whiteSpace: 'pre-line' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section>
        <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {t('settings.about')}
        </h3>
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{t('settings.version')}</span>
            <span style={{ fontSize: '14px' }}>2.0.0</span>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Built with
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['React', 'TypeScript', 'Vite', 'Zustand', 'Framer Motion'].map((tech) => (
                <span key={tech} style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  background: 'rgba(255,255,255,0.06)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
