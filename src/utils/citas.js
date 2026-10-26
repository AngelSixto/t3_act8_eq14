// Utilidades para transformar los datos de la API en citas de la clínica
// y para dar formato a fechas y horas.

export const DENTISTAS = ['Dra. Ruiz', 'Dr. Méndez']
export const TRATAMIENTOS = ['Limpieza', 'Revisión', 'Ortodoncia', 'Extracción', 'Resina', 'Endodoncia', 'Blanqueamiento']
export const ESTADOS = ['Confirmada', 'Pendiente', 'Atendida', 'Cancelada']
export const REGISTROS_POR_PAGINA = [10, 20, 40, 50]

export const FILTROS_FECHA = [
  { value: '', label: 'Todas las fechas' },
  { value: 'hoy', label: 'Hoy' },
  { value: 'manana', label: 'Mañana' },
  { value: 'semana', label: 'Próximos 7 días' },
  { value: 'anteriores', label: 'Anteriores' },
]

/** Horarios de atención: 09:00 a 18:30 cada 30 minutos. */
export const HORARIOS = Array.from({ length: 20 }, (_, i) => {
  const minutos = 9 * 60 + i * 30
  return `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`
})

export function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(date, days) {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

export function horaActual() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

/** "2026-10-21" → "21/10/2026" */
export function formatFecha(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function iniciales(nombre) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('')
}

// Horarios que se usan para repartir la agenda (12 por dentista al día).
const HORARIOS_AGENDA = [0, 1, 3, 4, 6, 8, 9, 11, 13, 14, 16, 18].map((i) => HORARIOS[i])
const CITAS_POR_DIA = HORARIOS_AGENDA.length * DENTISTAS.length

function maximoComunDivisor(a, b) {
  return b === 0 ? a : maximoComunDivisor(b, a % b)
}

/**
 * Convierte un usuario de DummyJSON en una cita de la clínica.
 * El paciente, su correo, teléfono y foto vienen de la API; la fecha,
 * hora, dentista y estado se asignan de forma determinista (siempre igual)
 * y sin que un dentista tenga dos citas a la misma hora.
 */
export function pacienteACita(paciente, indice, total, hoy = new Date()) {
  const id = paciente.id
  // Se "barajan" los pacientes para que la agenda no quede en orden alfabético.
  const posicion = maximoComunDivisor(37, total) === 1 ? (indice * 37) % total : indice
  const diasDesdeHoy = Math.floor(posicion / CITAS_POR_DIA) - 3 // empieza 3 días atrás
  const lugarEnElDia = posicion % CITAS_POR_DIA
  const fecha = toISODate(addDays(hoy, diasDesdeHoy))
  const hora = HORARIOS_AGENDA[Math.floor(lugarEnElDia / DENTISTAS.length)]
  const dentista = DENTISTAS[lugarEnElDia % DENTISTAS.length]

  let estado
  if (diasDesdeHoy < 0) {
    estado = id % 5 === 0 ? 'Cancelada' : 'Atendida'
  } else if (diasDesdeHoy === 0) {
    if (id % 6 === 0) estado = 'Cancelada'
    else if (hora < horaActual()) estado = 'Atendida'
    else estado = id % 3 === 0 ? 'Pendiente' : 'Confirmada'
  } else {
    estado = ['Confirmada', 'Pendiente', 'Confirmada', 'Cancelada', 'Pendiente', 'Confirmada'][id % 6]
  }

  return {
    id,
    paciente: `${paciente.firstName} ${paciente.lastName}`,
    expediente: 1000 + id,
    correo: paciente.email,
    telefono: paciente.phone,
    imagen: paciente.image,
    dentista,
    fecha,
    hora,
    tratamiento: TRATAMIENTOS[id % TRATAMIENTOS.length],
    estado,
    notas: '',
  }
}

export function ordenarPorFechaYHora(a, b) {
  return `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`)
}

/** Aplica los filtros de texto, fecha y estado. */
export function filtrarCitas(citas, { busqueda, fecha, estado }) {
  const texto = busqueda.trim().toLowerCase()
  const hoy = toISODate(new Date())
  const manana = toISODate(addDays(new Date(), 1))
  const enSieteDias = toISODate(addDays(new Date(), 7))

  return citas.filter((cita) => {
    if (texto && !cita.paciente.toLowerCase().includes(texto) && !cita.dentista.toLowerCase().includes(texto)) {
      return false
    }
    if (estado && cita.estado !== estado) return false
    if (fecha === 'hoy' && cita.fecha !== hoy) return false
    if (fecha === 'manana' && cita.fecha !== manana) return false
    if (fecha === 'semana' && (cita.fecha < hoy || cita.fecha > enSieteDias)) return false
    if (fecha === 'anteriores' && cita.fecha >= hoy) return false
    return true
  })
}
