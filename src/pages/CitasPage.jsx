import { useEffect, useMemo } from 'react'
import CitasFilters from '../components/CitasFilters'
import CitasTable from '../components/CitasTable'
import Icon from '../components/Icon'
import Pagination from '../components/Pagination'
import { ErrorState, LoadingState } from '../components/StatusMessages'
import { ESTADOS, FILTROS_FECHA, REGISTROS_POR_PAGINA, filtrarCitas } from '../utils/citas'

/** Lee los filtros y la paginación desde la URL, corrigiendo valores inválidos. */
function leerParametros(params) {
  const limit = Number(params.get('limit'))
  const page = Number(params.get('page'))
  const fecha = params.get('fecha') ?? ''
  const estado = params.get('estado') ?? ''
  return {
    busqueda: params.get('q') ?? '',
    fecha: FILTROS_FECHA.some((f) => f.value === fecha) ? fecha : '',
    estado: ESTADOS.includes(estado) ? estado : '',
    limit: REGISTROS_POR_PAGINA.includes(limit) ? limit : REGISTROS_POR_PAGINA[0],
    page: Number.isInteger(page) && page > 0 ? page : 1,
  }
}

/** FASE 3: Tabla de citas con filtros, paginación en la URL y acciones CRUD. */
export default function CitasPage({ citas, isLoading, error, onRetry, params, updateParams, onNewCita, onView, onEdit, onDelete }) {
  const { busqueda, fecha, estado, limit, page } = leerParametros(params)

  const citasFiltradas = useMemo(() => filtrarCitas(citas, { busqueda, fecha, estado }), [citas, busqueda, fecha, estado])
  const totalPages = Math.max(1, Math.ceil(citasFiltradas.length / limit))
  const paginaActual = Math.min(page, totalPages)
  const citasPagina = citasFiltradas.slice((paginaActual - 1) * limit, paginaActual * limit)

  // Si la página de la URL ya no existe (por ejemplo, tras eliminar), se corrige.
  useEffect(() => {
    if (!isLoading && page !== paginaActual) updateParams({ page: paginaActual }, { replace: true })
  }, [isLoading, page, paginaActual, updateParams])

  function handleFilterChange(cambios) {
    // Al escribir en el buscador se reemplaza la entrada del historial
    // para no crear una por cada letra.
    updateParams({ ...cambios, page: 1 }, { replace: 'q' in cambios })
  }

  function handleClearFilters() {
    updateParams({ q: '', fecha: '', estado: '', page: 1 })
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">Gestión de citas</h2>
          <p className="page__subtitle">Consulta y organiza las citas programadas de la clínica.</p>
        </div>
        <button type="button" className="btn btn--primary btn--lg" onClick={onNewCita}>
          <Icon name="plus" />
          Nueva cita
        </button>
      </div>

      <section className="card table-card">
        <CitasFilters
          busqueda={busqueda}
          fecha={fecha}
          estado={estado}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        {isLoading && <LoadingState message="Cargando citas…" />}
        {!isLoading && error && <ErrorState message={error} onRetry={onRetry} />}

        {!isLoading && !error && (
          <>
            <CitasTable citas={citasPagina} onView={onView} onEdit={onEdit} onDelete={onDelete} />
            <Pagination
              page={paginaActual}
              totalPages={totalPages}
              limit={limit}
              totalItems={citasFiltradas.length}
              onPageChange={(nueva) => updateParams({ page: nueva })}
              onLimitChange={(nuevo) => updateParams({ limit: nuevo, page: 1 })}
            />
          </>
        )}
      </section>
    </div>
  )
}
