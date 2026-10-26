const CLASES = {
  Confirmada: 'badge--confirmada',
  Pendiente: 'badge--pendiente',
  Atendida: 'badge--atendida',
  Cancelada: 'badge--cancelada',
}

export default function StatusBadge({ estado }) {
  return (
    <span className={`badge ${CLASES[estado] ?? ''}`}>
      <span className="badge__dot" />
      {estado}
    </span>
  )
}
