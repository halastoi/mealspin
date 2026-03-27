export interface LocalMeal {
  id: string
  name: Record<string, string>
  category: string
  area: string
  instructions: Record<string, string>
  thumbnail: string
  tags: string[]
  youtube: string | null
  ingredients: {
    name: Record<string, string>
    measure: string
  }[]
}

// Lazy load all recipe chunks
export async function loadAllRecipes(): Promise<LocalMeal[]> {
  const chunks = await Promise.all([
    import('./recipes_chunk01').then((m) => m.recipes_chunk01),
    import('./recipes_chunk02').then((m) => m.recipes_chunk02),
    import('./recipes_chunk03').then((m) => m.recipes_chunk03),
    import('./recipes_chunk04').then((m) => m.recipes_chunk04),
    import('./recipes_chunk05').then((m) => m.recipes_chunk05),
    import('./recipes_chunk06').then((m) => m.recipes_chunk06),
    import('./recipes_chunk07').then((m) => m.recipes_chunk07),
    import('./recipes_chunk08').then((m) => m.recipes_chunk08),
    import('./recipes_chunk09').then((m) => m.recipes_chunk09),
    import('./recipes_chunk10').then((m) => m.recipes_chunk10),
    import('./recipes_chunk11').then((m) => m.recipes_chunk11),
    import('./recipes_chunk12').then((m) => m.recipes_chunk12),
    import('./recipes_chunk13').then((m) => m.recipes_chunk13),
    import('./recipes_chunk14').then((m) => m.recipes_chunk14),
    import('./recipes_chunk15').then((m) => m.recipes_chunk15),
    import('./recipes_chunk16').then((m) => m.recipes_chunk16),
    import('./recipes_chunk17').then((m) => m.recipes_chunk17),
    import('./recipes_chunk18').then((m) => m.recipes_chunk18),
    import('./recipes_chunk19').then((m) => m.recipes_chunk19),
    import('./recipes_chunk20').then((m) => m.recipes_chunk20),
    import('./recipes_chunk21').then((m) => m.recipes_chunk21),
  ])
  return chunks.flat()
}
