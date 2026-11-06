import type { ReferenceCategory } from '@/types/models';

/** Options for the `Rutas | Lugares | Señales` segmented control. */
export const REFERENCE_CATEGORIES: { value: ReferenceCategory; label: string }[] = [
  { value: 'rutas', label: 'Rutas' },
  { value: 'lugares', label: 'Lugares' },
  { value: 'senales', label: 'Señales' },
];

export function isReferenceCategory(value: unknown): value is ReferenceCategory {
  return REFERENCE_CATEGORIES.some((option) => option.value === value);
}
