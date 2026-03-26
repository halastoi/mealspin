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

import { recipes_chunk01 } from './recipes_chunk01'
import { recipes_chunk02 } from './recipes_chunk02'
import { recipes_chunk03 } from './recipes_chunk03'
import { recipes_chunk04 } from './recipes_chunk04'
import { recipes_chunk05 } from './recipes_chunk05'
import { recipes_chunk06 } from './recipes_chunk06'
import { recipes_chunk07 } from './recipes_chunk07'
import { recipes_chunk08 } from './recipes_chunk08'
import { recipes_chunk09 } from './recipes_chunk09'
import { recipes_chunk10 } from './recipes_chunk10'
import { recipes_chunk11 } from './recipes_chunk11'
import { recipes_chunk12 } from './recipes_chunk12'
import { recipes_chunk13 } from './recipes_chunk13'
import { recipes_chunk14 } from './recipes_chunk14'
import { recipes_chunk15 } from './recipes_chunk15'
import { recipes_chunk16 } from './recipes_chunk16'
import { recipes_chunk17 } from './recipes_chunk17'
import { recipes_chunk18 } from './recipes_chunk18'
import { recipes_chunk19 } from './recipes_chunk19'

export const allRecipes: LocalMeal[] = [
  ...recipes_chunk01,
  ...recipes_chunk02,
  ...recipes_chunk03,
  ...recipes_chunk04,
  ...recipes_chunk05,
  ...recipes_chunk06,
  ...recipes_chunk07,
  ...recipes_chunk08,
  ...recipes_chunk09,
  ...recipes_chunk10,
  ...recipes_chunk11,
  ...recipes_chunk12,
  ...recipes_chunk13,
  ...recipes_chunk14,
  ...recipes_chunk15,
  ...recipes_chunk16,
  ...recipes_chunk17,
  ...recipes_chunk18,
  ...recipes_chunk19,
]
