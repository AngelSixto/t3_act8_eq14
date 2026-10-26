import Avatar from '../components/Avatar'
import Icon from '../components/Icon'
import StatusBadge from '../components/StatusBadge'
import { ErrorState, LoadingState } from '../components/StatusMessages'
import { addDays, formatFecha, horaActual, toISODate } from '../utils/citas'

function saludo() {
  const hora = new Date().getHours()
  if (hora < 12) return 'Buenos días'
  if (hora < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

function fechaLarga() {
  const texto = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  return texto.charAt(0).toUpperCase() + texto.slice(1).replace(/,/, '')
}

/** Pantalla "Panel principal" del mockup. */
export default function DashboardPage({ usuario, citas, isLoading, error, onRetry, onNewCita, onGoToCitas }) {
  const hoy = toISODate(new Date())
  const ahora = horaActual()
  const manana = toISODate(addDays(new Date(), 1))

  const citasHoy = citas.filter((c) => c.fecha === hoy && c.estado !== 'Cancelada')
  const pendientes = citas.filter((c) => c.estado === 'Pendiente' && c.fecha >= hoy)
  const atendidosHoy = citas.filter((c) => c.fecha === hoy && c.estado === 'Atendida')
  const proximas = citas
    .filter((c) => (c.fecha > hoy || (c.fecha === hoy && c.hora >= ahora)) && ['Confirmada', 'Pendiente'].includes(c.estado))
    .slice(0, 3)

  const tarjetas = [
    { label: 'Citas de hoy', note: 'Agenda del día', value: citasHoy.length, icon: 'calendar', tone: 'teal' },
    { label: 'Pendientes', note: 'Por confirmar', value: pendientes.length, icon: 'clock', tone: 'yellow' },
    { label: 'Pacientes atendidos', note: 'Hoy', value: atendidosHoy.length, icon: 'userCheck', tone: 'blue' },
  ]

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">
            {saludo()}, {usuario.firstName}
          </h2>
          <p className="page__subtitle">{fechaLarga()} · Este es el resumen de la actividad de hoy.</p>
        </div>
        <button type="button" className="btn btn--primary" onClick={onNewCita}>
          <Icon name="plus" />
          Nueva cita
        </button>
      </div>

      {isLoading && <LoadingState message="Cargando citas…" />}
      {!isLoading && error && <ErrorState message={error} onRetry={onRetry} />}

      {!isLoading && !error && (
        <>
          <div className="stats">
            {tarjetas.map((tarjeta) => (
              <article key={tarjeta.label} className="card stat">
                <div className="stat__top">
                  <span className={`stat__icon stat__icon--${tarjeta.tone}`}>
                    <Icon name={tarjeta.icon} />
                  </span>
                  <span>
                    <span className="stat__label">{tarjeta.label}</span>
                    <span className="stat__note">{tarjeta.note}</span>
                  </span>
                </div>
                <strong className="stat__value">{tarjeta.value}</strong>
              </article>
            ))}
          </div>

          <section className="card upcoming">
            <div className="card__header">
              <h3>Próximas citas</h3>
              <p>Citas programadas para el resto del día</p>
            </div>

            {proximas.length === 0 ? (
              <div className="empty-state">
                <Icon name="calendar" size={28} />
                <strong>No hay citas próximas</strong>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="table table--compact">
                  <thead>
                    <tr>
                      <th>Hora</th>
                      <th>Paciente</th>
                      <th>Dentista</th>
                      <th>Tratamiento</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proximas.map((cita, index) => (
                      <tr key={cita.id}>
                        <td>
                          <span className="time-pill">{cita.hora}</span>
                          {cita.fecha !== hoy && (
                            <small className="time-pill__date">
                              {cita.fecha === manana ? 'Mañana' : formatFecha(cita.fecha)}
                            </small>
                          )}
                        </td>
                        <td>
                          <div className="patient-cell">
                            <Avatar nombre={cita.paciente} index={index + 1} />
                            <strong>{cita.paciente}</strong>
                          </div>
                        </td>
                        <td>{cita.dentista}</td>
                        <td>{cita.tratamiento}</td>
                        <td>
                          <StatusBadge estado={cita.estado} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="upcoming__more">
              <button type="button" className="btn btn--secondary" onClick={onGoToCitas}>
                Ver todas las citas
                <Icon name="chevronRight" />
              </button>
            </div>

            <p className="upcoming__footer">
              <Icon name="user" size={18} />
              <strong>Dentistas en turno:</strong> Dra. Ruiz (consultorio 1) · Dr. Méndez (consultorio 2)
            </p>
          </section>
        </>
      )}
    </div>
  )
}
