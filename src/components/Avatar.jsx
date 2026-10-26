import { iniciales } from '../utils/citas'

const VARIANTES = ['avatar--teal', 'avatar--slate']

/** Círculo con las iniciales del paciente (como en el mockup). */
export default function Avatar({ nombre, index = 0, size = 'md' }) {
  return <span className={`avatar avatar--${size} ${VARIANTES[index % VARIANTES.length]}`}>{iniciales(nombre)}</span>
}
