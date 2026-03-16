export function matchesSearch(texts: string[], query: string): boolean {
  const trimmed = query.trim()
  if (!trimmed) return true
  const lowerQuery = trimmed.toLowerCase()
  return texts.some((text) => text.toLowerCase().includes(lowerQuery))
}
