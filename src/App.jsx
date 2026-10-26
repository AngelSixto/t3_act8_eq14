import { useState } from 'react'
import { useQueryParams } from './hooks/useQueryParams'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/LoginPage'

const SESSION_KEY = 'sonrisa-sesion'

function leerSesionGuardada() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}

export default function App() {
  // Datos del usuario que devolvió la API al iniciar sesión.
  // Se guardan también en sessionStorage para no perder la sesión al recargar.
  const [usuario, setUsuario] = useState(leerSesionGuardada)
  const [params, updateParams] = useQueryParams()

  function handleLogin(datosUsuario) {
    setUsuario(datosUsuario)
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(datosUsuario))
    } catch {
      /* el navegador no permite guardar: la sesión vive solo en el estado */
    }
    // Si llegó con un enlace compartido (?vista=citas&page=2) se respeta.
    if (!params.get('vista')) updateParams({ vista: 'panel' }, { replace: true })
  }

  function handleLogout() {
    setUsuario(null)
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      /* sin acceso a sessionStorage */
    }
    updateParams({}, { reset: true, replace: true })
  }

  // Vista protegida: sin usuario en el estado solo se muestra el login.
  if (!usuario) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <AppLayout usuario={usuario} params={params} updateParams={updateParams} onLogout={handleLogout} />
}
