import Icon from './Icon'
import Logo from './Logo'

export const MENU = [
  { vista: 'panel', label: 'Panel principal', icon: 'dashboard' },
  { vista: 'citas', label: 'Citas', icon: 'calendar' },
  { vista: 'pacientes', label: 'Pacientes', icon: 'users' },
  { vista: 'dentistas', label: 'Dentistas', icon: 'user' },
]

export default function Sidebar({ vistaActiva, onNavigate, onLogout }) {
  return (
    <aside className="sidebar">
      <Logo />
      <hr className="sidebar__divider" />

      <nav className="sidebar__nav" aria-label="Menú principal">
        {MENU.map((item) => (
          <button
            key={item.vista}
            type="button"
            className={`nav-item ${vistaActiva === item.vista ? 'nav-item--active' : ''}`}
            aria-current={vistaActiva === item.vista ? 'page' : undefined}
            onClick={() => onNavigate(item.vista)}
          >
            <Icon name={item.icon} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar__bottom">
        <div className="schedule-card">
          <span className="schedule-card__label">
            <Icon name="clock" size={20} />
            Horario de hoy
          </span>
          <strong>09:00 – 19:00 h</strong>
        </div>
        <hr className="sidebar__divider" />
        <button type="button" className="nav-item" onClick={onLogout}>
          <Icon name="logout" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
