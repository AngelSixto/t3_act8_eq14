import Avatar from './Avatar'
import Icon from './Icon'
import StatusBadge from './StatusBadge'
import { formatFecha } from '../utils/citas'

export default function CitasTable({ citas, onView, onEdit, onDelete }) {
  if (citas.length === 0) {
    return (
      <div className="empty-state">
        <Icon name="search" size={28} />
        <strong>No se encontraron citas</strong>
        <p>Prueba con otro nombre o cambia los filtros.</p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Dentista</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Tratamiento</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita, index) => (
            <tr key={cita.id}>
              <td>
                <div className="patient-cell">
                  <Avatar nombre={cita.paciente} index={index} />
                  <span>
                    <strong>{cita.paciente}</strong>
                    <small>Expediente #{cita.expediente}</small>
                  </span>
                </div>
              </td>
              <td>{cita.dentista}</td>
              <td>{formatFecha(cita.fecha)}</td>
              <td className="table__time">{cita.hora}</td>
              <td>{cita.tratamiento}</td>
              <td>
                <StatusBadge estado={cita.estado} />
              </td>
              <td>
                <div className="row-actions">
                  <button type="button" className="action-btn action-btn--view" onClick={() => onView(cita)} title="Ver cita" aria-label={`Ver cita de ${cita.paciente}`}>
                    <Icon name="eye" />
                  </button>
                  <button type="button" className="action-btn" onClick={() => onEdit(cita)} title="Editar cita" aria-label={`Editar cita de ${cita.paciente}`}>
                    <Icon name="pencil" />
                  </button>
                  <button type="button" className="action-btn action-btn--delete" onClick={() => onDelete(cita)} title="Eliminar cita" aria-label={`Eliminar cita de ${cita.paciente}`}>
                    <Icon name="trash" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
