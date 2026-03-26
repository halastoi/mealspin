export function normalizeIngredient(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/ies$/, 'y')
    .replace(/es$/, '')
    .replace(/s$/, '')
}

export function ingredientMatch(pantryName: string, recipeName: string): boolean {
  const a = normalizeIngredient(pantryName)
  const b = normalizeIngredient(recipeName)
  if (a === b) return true
  if (a.includes(b) || b.includes(a)) return true
  return false
}
