import Icon from '../components/Icon'

/** Pacientes y Dentistas: opciones de menú simuladas (solo se resaltan). */
export default function ModuloSimuladoPage({ titulo, descripcion, icon, onGoToCitas }) {
  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">{titulo}</h2>
          <p className="page__subtitle">{descripcion}</p>
        </div>
      </div>
      <section className="card simulated">
        <span className="simulated__icon">
          <Icon name={icon} size={32} />
        </span>
        <h3>Módulo en desarrollo</h3>
        <p>Esta sección forma parte del diseño, pero todavía no está disponible en esta versión del sistema.</p>
        <button type="button" className="btn btn--primary" onClick={onGoToCitas}>
          <Icon name="calendar" />
          Ir a Gestión de citas
        </button>
      </section>
    </div>
  )
}
