import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

/** Barra superior: título de la sección, notificaciones y datos del usuario. */
export default function Navbar({ titulo, usuario, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const nombreCompleto = `${usuario.firstName} ${usuario.lastName}`

  return (
    <header className="navbar">
      <h1 className="navbar__title">{titulo}</h1>

      <div className="navbar__actions">
        <button type="button" className="icon-button" aria-label="Notificaciones">
          <Icon name="bell" />
          <span className="icon-button__dot" />
        </button>
        <span className="navbar__separator" />

        <div className="user-menu" ref={menuRef}>
          <button
            type="button"
            className="user-menu__trigger"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
          >
            <img className="user-menu__photo" src={usuario.image} alt={`Foto de ${nombreCompleto}`} />
            <span className="user-menu__text">
              <strong>{nombreCompleto}</strong>
              <span>@{usuario.username}</span>
            </span>
            <Icon name="chevronDown" className="user-menu__chevron" />
          </button>

          {isMenuOpen && (
            <div className="user-menu__dropdown" role="menu">
              <p className="user-menu__email">{usuario.email}</p>
              <button type="button" className="user-menu__logout" onClick={onLogout} role="menuitem">
                <Icon name="logout" size={18} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
