# MealSpin - Recipe Generator PWA

A "What can I cook?" recipe generator. Spin for a random recipe, filter by cuisine and category, manage your pantry ingredients. 656 recipes from around the world, translated in 4 languages.

## Features

- **656 recipes** from 40+ cuisines (including Romanian, Moldovan, Ukrainian, Balkan, Nordic, Baltic)
- **4 languages** - UI and recipes in English, Romanian, Russian, Spanish
- **Spin generator** - random recipe with one tap
- **Pantry system** - add your ingredients, see what you can cook
- **Ingredient matching** - shows what you have vs what you need
- **Favorites** - save recipes you love
- **Browse all** - paginated list of all recipes with search
- **Cuisine & category filters** - collapsible, translated
- **Tap to translate** - tap any ingredient, title, or instruction step to see original English
- **Imperial to metric** - auto-converts lb→g, oz→g, cups→ml for RO/RU
- **Measure translations** - cups→cani, tbsp→linguri, etc.
- **Offline** - works without internet after first load
- **PWA** - installable on Android/iOS
- **Dark theme** - 4 themes (Dark, Midnight, AMOLED, Ocean)
- **Zero ads, zero tracking, zero API calls at runtime**

## Tech Stack

- React 19 + TypeScript + Vite
- Zustand (state management)
- Framer Motion (animations)
- All recipe data embedded locally (no API calls)
- Wikimedia Commons images (Creative Commons)

## Recipe Sources

- [TheMealDB](https://www.themealdb.com/) - 595 international recipes (CC-BY-SA)
- 61 original regional recipes (Romania, Moldova, Ukraine, Balkans, Nordic, Baltic)

## Development

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run build
vercel --prod --yes
```

## Live

**https://mealspin-mu.vercel.app**
