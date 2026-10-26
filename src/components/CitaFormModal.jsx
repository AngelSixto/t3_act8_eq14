import { useState } from 'react'
import Icon from './Icon'
import Modal from './Modal'
import { DENTISTAS, ESTADOS, HORARIOS, TRATAMIENTOS, toISODate, addDays } from '../utils/citas'

const CITA_VACIA = {
  paciente: '',
  dentista: DENTISTAS[0],
  fecha: toISODate(addDays(new Date(), 1)),
  hora: '10:00',
  tratamiento: TRATAMIENTOS[0],
  estado: 'Pendiente',
  notas: '',
}

function validarCita(datos) {
  const errores = {}
  if (!datos.paciente.trim()) errores.paciente = 'Escribe el nombre del paciente.'
  else if (datos.paciente.trim().split(' ').length < 2) errores.paciente = 'Escribe nombre y apellido.'
  if (!datos.fecha) errores.fecha = 'Selecciona una fecha.'
  if (!datos.hora) errores.hora = 'Selecciona una hora.'
  return errores
}

/** Formulario "Nueva cita" / "Editar cita" (overlay del mockup). */
export default function CitaFormModal({ cita, pacientes, isSaving, onSubmit, onClose }) {
  const esEdicion = Boolean(cita)
  const [datos, setDatos] = useState(() => (cita ? { ...cita } : { ...CITA_VACIA }))
  const [errores, setErrores] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setDatos((actuales) => ({ ...actuales, [name]: value }))
    if (errores[name]) setErrores((actuales) => ({ ...actuales, [name]: undefined }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nuevosErrores = validarCita(datos)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length === 0) {
      onSubmit({ ...datos, paciente: datos.paciente.trim(), notas: datos.notas.trim() })
    }
  }

  return (
    <Modal
      title={esEdicion ? 'Editar cita' : 'Nueva cita'}
      subtitle={esEdicion ? `Modifica los datos de la cita de ${cita.paciente}.` : 'Registra una cita para un paciente.'}
      icon={esEdicion ? 'pencil' : 'calendar'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn--secondary" onClick={onClose} disabled={isSaving}>
            Cancelar
          </button>
          <button type="submit" form="cita-form" className="btn btn--primary" disabled={isSaving}>
            <Icon name="check" />
            {isSaving ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Guardar cita'}
          </button>
        </>
      }
    >
      <form id="cita-form" className="form" onSubmit={handleSubmit} noValidate>
        <Field label="Paciente" icon="user" error={errores.paciente} chevron={!esEdicion}>
          <input
            name="paciente"
            value={datos.paciente}
            onChange={handleChange}
            placeholder="Seleccionar paciente"
            list="lista-pacientes"
            autoComplete="off"
            disabled={esEdicion}
          />
          <datalist id="lista-pacientes">
            {pacientes.map((nombre) => (
              <option key={nombre} value={nombre} />
            ))}
          </datalist>
        </Field>

        <Field label="Dentista" icon="users" chevron>
          <select name="dentista" value={datos.dentista} onChange={handleChange}>
            {DENTISTAS.map((dentista) => (
              <option key={dentista}>{dentista}</option>
            ))}
          </select>
        </Field>

        <div className="form__row">
          <Field label="Fecha" icon="calendar" error={errores.fecha}>
            <input type="date" name="fecha" value={datos.fecha} onChange={handleChange} />
          </Field>
          <Field label="Hora" icon="clock" error={errores.hora} chevron>
            <select name="hora" value={datos.hora} onChange={handleChange}>
              {HORARIOS.map((hora) => (
                <option key={hora}>{hora}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="form__row">
          <Field label="Tratamiento" icon="tooth" chevron>
            <select name="tratamiento" value={datos.tratamiento} onChange={handleChange}>
              {TRATAMIENTOS.map((tratamiento) => (
                <option key={tratamiento}>{tratamiento}</option>
              ))}
            </select>
          </Field>
          <Field label="Estado" icon="check" chevron>
            <select name="estado" value={datos.estado} onChange={handleChange}>
              {ESTADOS.map((estado) => (
                <option key={estado}>{estado}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Notas (opcional)" icon="note">
          <input name="notas" value={datos.notas} onChange={handleChange} placeholder="Ej. Paciente con sensibilidad dental" />
        </Field>
      </form>
    </Modal>
  )
}

function Field({ label, icon, error, chevron, children }) {
  return (
    <label className={`field ${error ? 'field--error' : ''}`}>
      <span className="field__label">{label}</span>
      <span className="field__control">
        <Icon name={icon} className="field__icon" />
        {children}
        {chevron && <Icon name="chevronDown" className="field__chevron" />}
      </span>
      {error && <span className="field__error">{error}</span>}
    </label>
  )
}
