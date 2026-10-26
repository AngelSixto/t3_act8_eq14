import { useState } from 'react'
import Icon from '../components/Icon'
import Logo from '../components/Logo'
import mascota from '../assets/mascota.png'
import { loginUser } from '../services/api'

function validarLogin(identifier, password) {
  const errores = {}
  if (!identifier.trim()) errores.identifier = 'Escribe tu usuario o correo electrónico.'
  if (!password) errores.password = 'Escribe tu contraseña.'
  else if (password.length < 4) errores.password = 'La contraseña debe tener al menos 4 caracteres.'
  return errores
}

/** FASE 1: Inicio de sesión con la API de DummyJSON. */
export default function LoginPage({ onLogin }) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errores, setErrores] = useState({})
  const [loginError, setLoginError] = useState('')
  const [showHelp, setShowHelp] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoginError('')

    const nuevosErrores = validarLogin(identifier, password)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    setIsSubmitting(true)
    try {
      const usuario = await loginUser(identifier, password)
      onLogin(usuario)
    } catch (error) {
      setLoginError(error.message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login">
      <section className="login__visual">
        <span className="login__circle login__circle--top" />
        <span className="login__circle login__circle--bottom" />
        <Logo />
        <img className="login__mascot" src={mascota} alt="Mascota de Sonrisa: un diente con bata de dentista" />
        <div className="login__message">
          <h2>
            Cuidamos tu sonrisa,
            <span>organizamos tu atención.</span>
          </h2>
          <p>Agenda, confirma y da seguimiento a las citas de la clínica desde un solo lugar.</p>
        </div>
        <small className="login__copy">© 2026 Sonrisa · Clínica dental</small>
      </section>

      <section className="login__panel">
        <form className="login__card" onSubmit={handleSubmit} noValidate>
          <h1>Bienvenido</h1>
          <p className="login__subtitle">Ingresa tus datos para continuar.</p>

          {loginError && (
            <div className="alert alert--error" role="alert">
              <Icon name="alert" />
              {loginError}
            </div>
          )}

          <label className={`field ${errores.identifier ? 'field--error' : ''}`}>
            <span className="field__label">Usuario o correo electrónico</span>
            <span className="field__control">
              <Icon name="mail" className="field__icon" />
              <input
                name="identifier"
                value={identifier}
                onChange={(event) => {
                  setIdentifier(event.target.value)
                  setErrores((e) => ({ ...e, identifier: undefined }))
                }}
                placeholder="recepcion@sonrisa.com"
                autoComplete="username"
              />
            </span>
            {errores.identifier && <span className="field__error">{errores.identifier}</span>}
          </label>

          <label className={`field ${errores.password ? 'field--error' : ''}`}>
            <span className="field__label">Contraseña</span>
            <span className="field__control">
              <Icon name="lock" className="field__icon" />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setErrores((e) => ({ ...e, password: undefined }))
                }}
                placeholder="••••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="field__toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <Icon name={showPassword ? 'eyeOff' : 'eye'} />
              </button>
            </span>
            {errores.password && <span className="field__error">{errores.password}</span>}
          </label>

          <button type="button" className="login__forgot" onClick={() => setShowHelp((visible) => !visible)}>
            ¿Olvidaste tu contraseña?
          </button>
          {showHelp && (
            <p className="login__help">Solicita el restablecimiento de tu contraseña al administrador de la clínica.</p>
          )}

          <button type="submit" className="btn btn--primary btn--block" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner spinner--small" />
                Verificando…
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>

          <p className="login__footer">Sistema de gestión de citas · Sonrisa</p>

          <div className="login__notice">
            <Icon name="lock" size={18} />
            Acceso exclusivo para personal autorizado.
          </div>
        </form>
      </section>
    </div>
  )
}
