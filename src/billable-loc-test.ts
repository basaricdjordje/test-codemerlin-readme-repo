/**
 * Utilities used only for manual / integration checks (CodeMerlin billable-LOC test PR).
 * Not wired into the app bundle; safe to tree-shake or exclude from product metrics separately.
 */

/** Clamps `value` to the inclusive range [min, max]. If min > max, returns `value` unchanged. */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) return value
  return Math.min(max, Math.max(min, value))
}

/** True when `s` is a string with at least one non-whitespace character. */
export function isNonEmptyTrimmedString(s: unknown): s is string {
  return typeof s === 'string' && s.trim().length > 0
}

/** Deterministic 32-bit unsigned hash for short strings (not cryptographic). */
export function stableHashString(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0
  }
  return h >>> 0
}

/** Returns a shallow copy of unique primitive values from an iterable. */
export function uniquePrimitives<T extends string | number | boolean>(items: Iterable<T>): T[] {
  return [...new Set(items)]
}
