import Modal from './Modal'
import StatusBadge from './StatusBadge'
import { formatFecha } from '../utils/citas'

/** Detalle de una cita (acción "ver" de la tabla). */
export default function CitaDetalleModal({ cita, onClose, onEdit }) {
  const filas = [
    ['Paciente', cita.paciente],
    ['Expediente', `#${cita.expediente}`],
    ['Correo', cita.correo || '—'],
    ['Teléfono', cita.telefono || '—'],
    ['Dentista', cita.dentista],
    ['Fecha y hora', `${formatFecha(cita.fecha)} · ${cita.hora} h`],
    ['Tratamiento', cita.tratamiento],
    ['Notas', cita.notas || 'Sin notas'],
  ]

  return (
    <Modal
      title="Detalle de la cita"
      subtitle={`Expediente #${cita.expediente}`}
      icon="eye"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn--secondary" onClick={onClose}>
            Cerrar
          </button>
          <button type="button" className="btn btn--primary" onClick={onEdit}>
            Editar cita
          </button>
        </>
      }
    >
      <div className="detail__status">
        {cita.imagen && <img src={cita.imagen} alt="" className="detail__photo" />}
        <div>
          <strong>{cita.paciente}</strong>
          <StatusBadge estado={cita.estado} />
        </div>
      </div>
      <dl className="detail">
        {filas.map(([etiqueta, valor]) => (
          <div key={etiqueta} className="detail__row">
            <dt>{etiqueta}</dt>
            <dd>{valor}</dd>
          </div>
        ))}
      </dl>
    </Modal>
  )
}
