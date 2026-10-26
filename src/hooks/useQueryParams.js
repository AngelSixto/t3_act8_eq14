import { useCallback, useEffect, useState } from 'react'

/**
 * Lee y actualiza los parámetros de la URL (?vista=citas&page=2&limit=20).
 * Cada cambio crea una entrada en el historial, así que el botón
 * "Atrás" del navegador regresa a la página anterior de la tabla y el
 * enlace se puede compartir.
 */
export function useQueryParams() {
  const [params, setParams] = useState(() => new URLSearchParams(window.location.search))

  useEffect(() => {
    const handlePopState = () => setParams(new URLSearchParams(window.location.search))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const updateParams = useCallback((changes, { replace = false, reset = false } = {}) => {
    const next = reset ? new URLSearchParams() : new URLSearchParams(window.location.search)
    Object.entries(changes).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) next.delete(key)
      else next.set(key, String(value))
    })
    const query = next.toString()
    const url = `${window.location.pathname}${query ? `?${query}` : ''}`
    if (replace) window.history.replaceState(null, '', url)
    else window.history.pushState(null, '', url)
    setParams(next)
  }, [])

  return [params, updateParams]
}
