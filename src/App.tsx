import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useSettingsStore } from './stores/useSettingsStore'
import { useSpinStore } from './stores/useSpinStore'
import { Navigation, type Tab } from './components/layout/Navigation'
import { SpinPage } from './components/spin/SpinPage'
import { FavoritesPage } from './components/favorites/FavoritesPage'
import { PantryPage } from './components/pantry/PantryPage'
import { SettingsPage } from './components/settings/SettingsPage'
import { RecipeDetail } from './components/recipe/RecipeDetail'
import { AllRecipes } from './components/spin/AllRecipes'
import type { Meal } from './types'

export default function App() {
  const [activeTab, setActiveTabState] = useState<Tab>(() =>
    (sessionStorage.getItem('mealspin-tab') as Tab) || 'spin'
  )
  const setActiveTab = (tab: Tab) => {
    setActiveTabState(tab)
    sessionStorage.setItem('mealspin-tab', tab)
  }
  const [selectedRecipe, setSelectedRecipe] = useState<Meal | null>(null)
  const [showAllRecipes, setShowAllRecipes] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const leavingRef = useRef(false)

  const t = useSettingsStore((s) => s.t)
  const loadRecipes = useSpinStore((s) => s.loadRecipes)
  const isLoading = useSpinStore((s) => s.isLoading)

  // Load recipes on mount
  useEffect(() => {
    loadRecipes()
  }, [loadRecipes])

  // Back button handling
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)

    const handlePopState = () => {
      if (leavingRef.current) return
      if (selectedRecipe) {
        setSelectedRecipe(null)
      } else if (showAllRecipes) {
        setShowAllRecipes(false)
      } else if (showExitConfirm) {
        setShowExitConfirm(false)
      } else if (activeTab !== 'spin') {
        setActiveTab('spin')
      } else {
        setShowExitConfirm(true)
      }
      window.history.pushState(null, '', window.location.href)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [selectedRecipe, activeTab, showExitConfirm])

  return (
    <>
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: '10px 16px',
            paddingTop: `calc(10px + var(--safe-top))`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            background: 'rgba(0,0,0,0.2)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #fb923c, #f97316, #ea580c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}
            >
              mealspin
            </h1>
            <p style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              marginTop: '1px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}>
              {t('app.tagline')}
            </p>
          </div>
        </header>

        {/* Content */}
        <main
          style={{
            flex: 1,
            overflow: 'auto',
            position: 'relative',
          }}
        >
          {activeTab === 'spin' && (
            <SpinPage
              onSwitchToPantry={() => setActiveTab('pantry')}
              onSelectRecipe={setSelectedRecipe}
              onShowAllRecipes={() => setShowAllRecipes(true)}
            />
          )}
          {activeTab === 'favorites' && (
            <FavoritesPage onSelectRecipe={setSelectedRecipe} />
          )}
          {activeTab === 'pantry' && <PantryPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>

        {/* Navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 500,
          background: 'var(--bg-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '16px',
        }}>
          <div style={{ fontSize: '48px' }}>🍳</div>
          <div style={{ fontSize: '16px', fontWeight: 600 }}>MealSpin</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('spin.loading')}</div>
        </div>
      )}

      {/* All Recipes overlay */}
      <AnimatePresence>
        {showAllRecipes && (
          <AllRecipes
            onBack={() => setShowAllRecipes(false)}
            onSelectRecipe={(meal) => { setSelectedRecipe(meal) }}
          />
        )}
      </AnimatePresence>

      {/* Recipe Detail overlay */}
      <AnimatePresence>
        {selectedRecipe && (
          <RecipeDetail
            key={selectedRecipe.id}
            meal={selectedRecipe}
            onBack={() => setSelectedRecipe(null)}
          />
        )}
      </AnimatePresence>

      {/* Exit confirmation modal */}
      {showExitConfirm && (
        <div
          onClick={() => setShowExitConfirm(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(20,20,40,0.95)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              borderRadius: '20px',
              padding: '28px 24px',
              maxWidth: '320px',
              width: '100%',
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8V5l12-2v13" transform="scale(0.7) translate(4,4)" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
              mealspin
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
              {t('exit.message')}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowExitConfirm(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '15px',
                  boxShadow: '0 4px 16px var(--accent-glow)',
                }}
              >
                {t('exit.stay')}
              </button>
              <button
                onClick={() => {
                  leavingRef.current = true
                  setShowExitConfirm(false)
                  window.history.go(-2)
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  fontSize: '15px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {t('exit.leave')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
