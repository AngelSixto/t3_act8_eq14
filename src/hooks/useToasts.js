import { useCallback, useState } from 'react'

/** Notificaciones breves en pantalla (éxito, error o información). */
export function useToasts() {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((id) => {
    setToasts((actuales) => actuales.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message, type = 'success') => {
      const id = Date.now() + Math.random()
      setToasts((actuales) => [...actuales, { id, message, type }])
      setTimeout(() => dismissToast(id), 4000)
    },
    [dismissToast],
  )

  return { toasts, showToast, dismissToast }
}
