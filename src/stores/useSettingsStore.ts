import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'en' | 'ro' | 'ru' | 'es'
export type ThemeMode = 'dark' | 'light' | 'cream' | 'midnight' | 'amoled' | 'ocean'

export interface ThemeColors {
  bgPrimary: string
  bgSecondary: string
  bgCard: string
  bgCardHover: string
  bgActive: string
  accent: string
  accentGlow: string
  accentLight: string
}

export const themes: Record<ThemeMode, ThemeColors> = {
  light: {
    // Clean white - inspired by Apple/Notion
    bgPrimary: '#ffffff',
    bgSecondary: '#f7f7f8',
    bgCard: '#f2f2f4',
    bgCardHover: '#eaeaed',
    bgActive: '#fff2e8',
    accent: '#c2410c',
    accentGlow: 'rgba(194, 65, 12, 0.15)',
    accentLight: '#ea580c',
  },
  cream: {
    // Warm cream - inspired by Notion/Craft
    bgPrimary: '#faf8f5',
    bgSecondary: '#f0ece6',
    bgCard: '#fffdf9',
    bgCardHover: '#f5f0ea',
    bgActive: '#fde8d0',
    accent: '#b45309',
    accentGlow: 'rgba(180, 83, 9, 0.15)',
    accentLight: '#d97706',
  },
  dark: {
    bgPrimary: '#0a0a1a',
    bgSecondary: '#111128',
    bgCard: '#181838',
    bgCardHover: '#1f1f48',
    bgActive: '#5e2a1a',
    accent: '#f97316',
    accentGlow: 'rgba(249, 115, 22, 0.3)',
    accentLight: '#fb923c',
  },
  midnight: {
    bgPrimary: '#0d1117',
    bgSecondary: '#161b22',
    bgCard: '#1c2333',
    bgCardHover: '#252d3d',
    bgActive: '#5c3a1a',
    accent: '#f97316',
    accentGlow: 'rgba(249, 115, 22, 0.3)',
    accentLight: '#fb923c',
  },
  amoled: {
    bgPrimary: '#000000',
    bgSecondary: '#0a0a0a',
    bgCard: '#141414',
    bgCardHover: '#1e1e1e',
    bgActive: '#3a1a0a',
    accent: '#f97316',
    accentGlow: 'rgba(249, 115, 22, 0.3)',
    accentLight: '#fb923c',
  },
  ocean: {
    bgPrimary: '#0a1628',
    bgSecondary: '#0f1d32',
    bgCard: '#152640',
    bgCardHover: '#1c3050',
    bgActive: '#3d2a1a',
    accent: '#f97316',
    accentGlow: 'rgba(249, 115, 22, 0.3)',
    accentLight: '#fb923c',
  },
}

export const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.tagline': 'recipe generator',
    'nav.spin': 'Spin',
    'nav.favorites': 'Favorites',
    'nav.pantry': 'Pantry',
    'nav.settings': 'Settings',
    'spin.title': "What's Cookin'?",
    'spin.button': 'Spin!',
    'spin.again': 'Spin Again',
    'spin.noMatch': 'No recipes match your ingredients',
    'spin.addMore': 'Try adding more ingredients',
    'spin.search': 'Search recipes...',
    'spin.loading': 'Loading recipes...',
    'spin.loadingCount': 'Loading recipes',
    'spin.emptyPantry': 'Add ingredients first',
    'spin.emptyPantryHint': 'Tap Spin to discover a random recipe!',
    'spin.ready': 'Tap Spin to find what you can cook!',
    'spin.recipes': 'recipes',
    'spin.loadError': 'Failed to load recipes. Check your internet.',
    'spin.retry': 'Try Again',
    'spin.ingredients': 'My Ingredients',
    'recipe.ingredients': 'Ingredients',
    'recipe.instructions': 'Instructions',
    'recipe.youHave': 'You have',
    'recipe.youNeed': 'You need',
    'recipe.video': 'Watch Video',
    'recipe.save': 'Save',
    'recipe.saved': 'Saved',
    'recipe.share': 'Share',
    'recipe.of': 'of',
    'recipe.match': 'match',
    'recipe.missing': 'missing',
    'pantry.title': 'My Pantry',
    'pantry.search': 'Search ingredients...',
    'pantry.staples': 'Add Common Staples',
    'pantry.clear': 'Clear All',
    'pantry.selected': 'My Ingredients',
    'pantry.empty': 'Your pantry is empty',
    'pantry.emptyHint': 'Add ingredients to get started!',
    'pantry.count': 'ingredients',
    'pantry.alreadyAdded': 'Already added',
    'favorites.title': 'Favorites',
    'favorites.empty': 'No saved recipes yet',
    'favorites.emptyHint': 'Tap the heart on any recipe to save it here',
    'filter.cuisine': 'Cuisine',
    'filter.category': 'Category',
    'filter.maxMissing': 'Max missing ingredients',
    'filter.all': 'All',
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.theme.light': 'Light',
    'settings.theme.cream': 'Cream',
    'settings.theme.dark': 'Dark',
    'settings.theme.midnight': 'Midnight',
    'settings.theme.amoled': 'AMOLED',
    'settings.theme.ocean': 'Ocean',
    'settings.clearCache': 'Clear Recipe Cache',
    'settings.cacheCleared': 'Cache cleared! Recipes will reload.',
    'settings.howToUse': 'How to use',
    'settings.about': 'About',
    'settings.version': 'Version',
    'howto.pantry.title': 'Add ingredients',
    'howto.pantry.desc': 'Go to the Pantry tab and search for ingredients you have at home.',
    'howto.spin.title': 'Spin for recipes',
    'howto.spin.desc': 'Tap the Spin button to get a random recipe matching your ingredients.',
    'howto.filter.title': 'Use filters',
    'howto.filter.desc': 'Filter by cuisine or category to narrow down your results.',
    'howto.save.title': 'Save favorites',
    'howto.save.desc': 'Tap the heart icon on any recipe to save it to your favorites.',
    'howto.install.title': 'Install as app',
    'howto.install.desc.android': 'Android: Open in Chrome > Menu (3 dots) > "Install app".',
    'howto.install.desc.ios': 'iPhone: Open in Safari > Share > "Add to Home Screen".',
    'exit.message': 'Are you sure you want to leave MealSpin?',
    'exit.stay': 'Stay',
    'exit.leave': 'Leave',
  },
  ro: {
    'app.tagline': 'generator de retete',
    'nav.spin': 'Spin',
    'nav.favorites': 'Favorite',
    'nav.pantry': 'Camara',
    'nav.settings': 'Setari',
    'spin.title': 'Ce Gatim?',
    'spin.button': 'Invarte!',
    'spin.again': 'Mai invarte',
    'spin.noMatch': 'Nicio reteta gasita',
    'spin.addMore': 'Adauga mai multe ingrediente',
    'spin.search': 'Cauta retete...',
    'spin.loading': 'Se incarca retetele...',
    'spin.loadingCount': 'Se incarca retetele',
    'spin.emptyPantry': 'Adauga ingrediente mai intai',
    'spin.emptyPantryHint': 'Apasa Spin pentru a descoperi o reteta!',
    'spin.ready': 'Apasa Spin sa vezi ce poti gati!',
    'spin.recipes': 'retete',
    'spin.loadError': 'Nu s-au incarcat retetele. Verifica internetul.',
    'spin.retry': 'Reincearca',
    'spin.ingredients': 'Ingredientele Mele',
    'recipe.ingredients': 'Ingrediente',
    'recipe.instructions': 'Instructiuni',
    'recipe.youHave': 'Ai',
    'recipe.youNeed': 'Ai nevoie de',
    'recipe.video': 'Vezi Video',
    'recipe.save': 'Salveaza',
    'recipe.saved': 'Salvat',
    'recipe.share': 'Distribuie',
    'recipe.of': 'din',
    'recipe.match': 'potrivire',
    'recipe.missing': 'lipsesc',
    'pantry.title': 'Camara Mea',
    'pantry.search': 'Cauta ingrediente...',
    'pantry.staples': 'Adauga de Baza',
    'pantry.clear': 'Sterge Tot',
    'pantry.selected': 'Ingredientele Mele',
    'pantry.empty': 'Camara e goala',
    'pantry.emptyHint': 'Adauga ingrediente pentru a incepe!',
    'pantry.count': 'ingrediente',
    'pantry.alreadyAdded': 'Deja adaugat',
    'favorites.title': 'Favorite',
    'favorites.empty': 'Nicio reteta salvata',
    'favorites.emptyHint': 'Apasa inima pe orice reteta pentru a o salva aici',
    'filter.cuisine': 'Bucatarie',
    'filter.category': 'Categorie',
    'filter.maxMissing': 'Max ingrediente lipsa',
    'filter.all': 'Toate',
    'settings.title': 'Setari',
    'settings.language': 'Limba',
    'settings.theme': 'Tema',
    'settings.theme.light': 'Luminos',
    'settings.theme.cream': 'Crem',
    'settings.theme.dark': 'Intunecat',
    'settings.theme.midnight': 'Miezul Noptii',
    'settings.theme.amoled': 'AMOLED',
    'settings.theme.ocean': 'Ocean',
    'settings.clearCache': 'Sterge Cache Retete',
    'settings.cacheCleared': 'Cache sters! Retetele se vor reincarca.',
    'settings.howToUse': 'Cum se foloseste',
    'settings.about': 'Despre',
    'settings.version': 'Versiune',
    'howto.pantry.title': 'Adauga ingrediente',
    'howto.pantry.desc': 'Mergi la Camara si cauta ingredientele pe care le ai acasa.',
    'howto.spin.title': 'Invarte pentru retete',
    'howto.spin.desc': 'Apasa butonul Spin pentru o reteta aleatoare potrivita.',
    'howto.filter.title': 'Foloseste filtre',
    'howto.filter.desc': 'Filtreaza dupa bucatarie sau categorie.',
    'howto.save.title': 'Salveaza favorite',
    'howto.save.desc': 'Apasa inima pe orice reteta pentru a o salva.',
    'howto.install.title': 'Instaleaza ca aplicatie',
    'howto.install.desc.android': 'Android: Deschide in Chrome > Meniu > "Instaleaza aplicatia".',
    'howto.install.desc.ios': 'iPhone: Deschide in Safari > Distribuie > "Adauga pe ecranul principal".',
    'exit.message': 'Esti sigur ca vrei sa parasesti MealSpin?',
    'exit.stay': 'Ramai',
    'exit.leave': 'Pleaca',
  },
  ru: {
    'app.tagline': 'генератор рецептов',
    'nav.spin': 'Крутить',
    'nav.favorites': 'Избранное',
    'nav.pantry': 'Кладовая',
    'nav.settings': 'Настройки',
    'spin.title': 'Что готовим?',
    'spin.button': 'Крутить!',
    'spin.again': 'Ещё раз',
    'spin.noMatch': 'Рецептов не найдено',
    'spin.addMore': 'Добавьте больше ингредиентов',
    'spin.search': 'Поиск рецептов...',
    'spin.loading': 'Загрузка рецептов...',
    'spin.loadingCount': 'Загрузка рецептов',
    'spin.emptyPantry': 'Сначала добавьте ингредиенты',
    'spin.emptyPantryHint': 'Нажмите Spin чтобы найти рецепт!',
    'spin.ready': 'Нажмите Spin чтобы узнать что приготовить!',
    'spin.recipes': 'рецептов',
    'spin.loadError': 'Не удалось загрузить. Проверьте интернет.',
    'spin.retry': 'Повторить',
    'spin.ingredients': 'Мои ингредиенты',
    'recipe.ingredients': 'Ингредиенты',
    'recipe.instructions': 'Инструкции',
    'recipe.youHave': 'Есть',
    'recipe.youNeed': 'Нужно',
    'recipe.video': 'Смотреть видео',
    'recipe.save': 'Сохранить',
    'recipe.saved': 'Сохранено',
    'recipe.share': 'Поделиться',
    'recipe.of': 'из',
    'recipe.match': 'совпадение',
    'recipe.missing': 'не хватает',
    'pantry.title': 'Моя кладовая',
    'pantry.search': 'Поиск ингредиентов...',
    'pantry.staples': 'Добавить базовые',
    'pantry.clear': 'Очистить всё',
    'pantry.selected': 'Мои ингредиенты',
    'pantry.empty': 'Кладовая пуста',
    'pantry.emptyHint': 'Добавьте ингредиенты для начала!',
    'pantry.count': 'ингредиентов',
    'pantry.alreadyAdded': 'Уже добавлено',
    'favorites.title': 'Избранное',
    'favorites.empty': 'Нет сохранённых рецептов',
    'favorites.emptyHint': 'Нажмите сердечко на любом рецепте чтобы сохранить',
    'filter.cuisine': 'Кухня',
    'filter.category': 'Категория',
    'filter.maxMissing': 'Макс. недостающих',
    'filter.all': 'Все',
    'settings.title': 'Настройки',
    'settings.language': 'Язык',
    'settings.theme': 'Тема',
    'settings.theme.light': 'Светлая',
    'settings.theme.cream': 'Кремовая',
    'settings.theme.dark': 'Тёмная',
    'settings.theme.midnight': 'Полночь',
    'settings.theme.amoled': 'AMOLED',
    'settings.theme.ocean': 'Океан',
    'settings.clearCache': 'Очистить кеш рецептов',
    'settings.cacheCleared': 'Кеш очищен! Рецепты перезагрузятся.',
    'settings.howToUse': 'Как пользоваться',
    'settings.about': 'О приложении',
    'settings.version': 'Версия',
    'howto.pantry.title': 'Добавьте ингредиенты',
    'howto.pantry.desc': 'Перейдите в Кладовую и найдите ингредиенты, которые есть дома.',
    'howto.spin.title': 'Крутите для рецептов',
    'howto.spin.desc': 'Нажмите кнопку Крутить для случайного рецепта из ваших ингредиентов.',
    'howto.filter.title': 'Используйте фильтры',
    'howto.filter.desc': 'Фильтруйте по кухне или категории.',
    'howto.save.title': 'Сохраняйте избранное',
    'howto.save.desc': 'Нажмите сердечко на любом рецепте для сохранения.',
    'howto.install.title': 'Установить как приложение',
    'howto.install.desc.android': 'Android: Откройте в Chrome > Меню > "Установить приложение".',
    'howto.install.desc.ios': 'iPhone: Откройте в Safari > Поделиться > "На экран Домой".',
    'exit.message': 'Вы уверены, что хотите выйти из MealSpin?',
    'exit.stay': 'Остаться',
    'exit.leave': 'Выйти',
  },
  es: {
    'app.tagline': 'generador de recetas',
    'nav.spin': 'Girar',
    'nav.favorites': 'Favoritos',
    'nav.pantry': 'Despensa',
    'nav.settings': 'Ajustes',
    'spin.title': 'Que Cocinamos?',
    'spin.button': 'Girar!',
    'spin.again': 'Girar de Nuevo',
    'spin.noMatch': 'Sin recetas que coincidan',
    'spin.addMore': 'Intenta agregar mas ingredientes',
    'spin.search': 'Buscar recetas...',
    'spin.loading': 'Cargando recetas...',
    'spin.loadingCount': 'Cargando recetas',
    'spin.emptyPantry': 'Agrega ingredientes primero',
    'spin.emptyPantryHint': 'Toca Spin para descubrir una receta!',
    'spin.ready': 'Toca Spin para ver que cocinar!',
    'spin.recipes': 'recetas',
    'spin.loadError': 'No se cargaron las recetas. Verifica tu internet.',
    'spin.retry': 'Reintentar',
    'spin.ingredients': 'Mis Ingredientes',
    'recipe.ingredients': 'Ingredientes',
    'recipe.instructions': 'Instrucciones',
    'recipe.youHave': 'Tienes',
    'recipe.youNeed': 'Necesitas',
    'recipe.video': 'Ver Video',
    'recipe.save': 'Guardar',
    'recipe.saved': 'Guardado',
    'recipe.share': 'Compartir',
    'recipe.of': 'de',
    'recipe.match': 'coincidencia',
    'recipe.missing': 'faltan',
    'pantry.title': 'Mi Despensa',
    'pantry.search': 'Buscar ingredientes...',
    'pantry.staples': 'Agregar Basicos',
    'pantry.clear': 'Limpiar Todo',
    'pantry.selected': 'Mis Ingredientes',
    'pantry.empty': 'Tu despensa esta vacia',
    'pantry.emptyHint': 'Agrega ingredientes para comenzar!',
    'pantry.count': 'ingredientes',
    'pantry.alreadyAdded': 'Ya agregado',
    'favorites.title': 'Favoritos',
    'favorites.empty': 'Sin recetas guardadas',
    'favorites.emptyHint': 'Toca el corazon en cualquier receta para guardarla aqui',
    'filter.cuisine': 'Cocina',
    'filter.category': 'Categoria',
    'filter.maxMissing': 'Max faltantes',
    'filter.all': 'Todos',
    'settings.title': 'Ajustes',
    'settings.language': 'Idioma',
    'settings.theme': 'Tema',
    'settings.theme.light': 'Claro',
    'settings.theme.cream': 'Crema',
    'settings.theme.dark': 'Oscuro',
    'settings.theme.midnight': 'Medianoche',
    'settings.theme.amoled': 'AMOLED',
    'settings.theme.ocean': 'Oceano',
    'settings.clearCache': 'Limpiar cache de recetas',
    'settings.cacheCleared': 'Cache limpiado! Las recetas se recargaran.',
    'settings.howToUse': 'Como usar',
    'settings.about': 'Acerca de',
    'settings.version': 'Version',
    'howto.pantry.title': 'Agrega ingredientes',
    'howto.pantry.desc': 'Ve a la Despensa y busca los ingredientes que tienes en casa.',
    'howto.spin.title': 'Gira para recetas',
    'howto.spin.desc': 'Toca el boton Girar para una receta aleatoria con tus ingredientes.',
    'howto.filter.title': 'Usa filtros',
    'howto.filter.desc': 'Filtra por cocina o categoria para mejores resultados.',
    'howto.save.title': 'Guarda favoritos',
    'howto.save.desc': 'Toca el corazon en cualquier receta para guardarla.',
    'howto.install.title': 'Instalar como app',
    'howto.install.desc.android': 'Android: Abre en Chrome > Menu > "Instalar app".',
    'howto.install.desc.ios': 'iPhone: Abre en Safari > Compartir > "Agregar a pantalla de inicio".',
    'exit.message': 'Estas seguro de que quieres salir de MealSpin?',
    'exit.stay': 'Quedarme',
    'exit.leave': 'Salir',
  },
}

interface SettingsState {
  language: Language
  theme: ThemeMode
  maxMissing: number
  setLanguage: (lang: Language) => void
  setTheme: (theme: ThemeMode) => void
  setMaxMissing: (n: number) => void
  t: (key: string) => string
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      language: 'en',
      theme: 'dark',
      maxMissing: 3,
      setLanguage: (language: Language) => set({ language }),
      setTheme: (theme: ThemeMode) => {
        set({ theme })
        applyTheme(theme)
      },
      setMaxMissing: (maxMissing: number) => set({ maxMissing }),
      t: (key: string) => {
        const lang = get().language
        return translations[lang][key] ?? translations.en[key] ?? key
      },
    }),
    {
      name: 'mealspin-settings',
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    }
  )
)

function applyTheme(mode: ThemeMode): void {
  const t = themes[mode]
  const root = document.documentElement
  root.style.setProperty('--bg-primary', t.bgPrimary)
  root.style.setProperty('--bg-secondary', t.bgSecondary)
  root.style.setProperty('--bg-card', t.bgCard)
  root.style.setProperty('--bg-card-hover', t.bgCardHover)
  root.style.setProperty('--bg-active', t.bgActive)
  root.style.setProperty('--accent', t.accent)
  root.style.setProperty('--accent-glow', t.accentGlow)
  root.style.setProperty('--accent-light', t.accentLight)

  // Light themes need different text and glass colors
  const isLight = mode === 'light' || mode === 'cream'
  if (isLight) {
    root.style.setProperty('--text-primary', '#1c1c1e')
    root.style.setProperty('--text-secondary', '#48484a')
    root.style.setProperty('--text-muted', '#8e8e93')
    root.style.setProperty('--glass', 'rgba(0, 0, 0, 0.03)')
    root.style.setProperty('--glass-border', 'rgba(0, 0, 0, 0.1)')
    root.style.setProperty('--glass-hover', 'rgba(0, 0, 0, 0.06)')
    root.style.setProperty('--success', '#16a34a')
    root.style.setProperty('--danger', '#dc2626')
    root.style.setProperty('--shadow-sm', '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)')
    root.style.setProperty('--shadow-md', '0 4px 12px rgba(0,0,0,0.08)')
    root.style.setProperty('--shadow-lg', '0 8px 24px rgba(0,0,0,0.1)')
  } else {
    root.style.setProperty('--text-primary', '#e8e8f0')
    root.style.setProperty('--text-secondary', '#8888aa')
    root.style.setProperty('--text-muted', '#555570')
    root.style.setProperty('--glass', 'rgba(255, 255, 255, 0.04)')
    root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.08)')
    root.style.setProperty('--glass-hover', 'rgba(255, 255, 255, 0.07)')
    root.style.setProperty('--success', '#4ade80')
    root.style.setProperty('--danger', '#f87171')
    root.style.setProperty('--shadow-sm', '0 2px 8px rgba(0,0,0,0.3)')
    root.style.setProperty('--shadow-md', '0 4px 16px rgba(0,0,0,0.4)')
    root.style.setProperty('--shadow-lg', '0 8px 32px rgba(0,0,0,0.5)')
  }

  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t.bgPrimary)
}
