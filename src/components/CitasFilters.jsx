import Icon from './Icon'
import { ESTADOS, FILTROS_FECHA } from '../utils/citas'

export default function CitasFilters({ busqueda, fecha, estado, onChange, onClear }) {
  const hayFiltros = busqueda || fecha || estado

  return (
    <div className="filters">
      <label className="input-icon filters__search">
        <Icon name="search" />
        <input
          type="search"
          placeholder="Buscar paciente o dentista"
          value={busqueda}
          onChange={(event) => onChange({ q: event.target.value })}
          aria-label="Buscar paciente o dentista"
        />
      </label>

      <label className="input-icon input-icon--select">
        <Icon name="calendar" />
        <select value={fecha} onChange={(event) => onChange({ fecha: event.target.value })} aria-label="Filtrar por fecha">
          {FILTROS_FECHA.map((opcion) => (
            <option key={opcion.value} value={opcion.value}>
              {opcion.label}
            </option>
          ))}
        </select>
        <Icon name="chevronDown" className="input-icon__chevron" />
      </label>

      <label className="input-icon input-icon--select">
        <Icon name="check" />
        <select value={estado} onChange={(event) => onChange({ estado: event.target.value })} aria-label="Filtrar por estado">
          <option value="">Todos los estados</option>
          {ESTADOS.map((opcion) => (
            <option key={opcion}>{opcion}</option>
          ))}
        </select>
        <Icon name="chevronDown" className="input-icon__chevron" />
      </label>

      <button type="button" className="btn btn--ghost" onClick={onClear} disabled={!hayFiltros}>
        <Icon name="reset" />
        Limpiar filtros
      </button>
    </div>
  )
}
