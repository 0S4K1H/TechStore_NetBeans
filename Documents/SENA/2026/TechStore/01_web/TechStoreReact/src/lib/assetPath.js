const BASE_URL = import.meta.env.BASE_URL ?? '/'

export function assetUrl(path) {
  const normalizedPath = path.replace(/^\/+/, '')

  if (BASE_URL.endsWith('/')) {
    return `${BASE_URL}${normalizedPath}`
  }

  return `${BASE_URL}/${normalizedPath}`
}
