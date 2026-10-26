import Icon from './Icon'
import { REGISTROS_POR_PAGINA } from '../utils/citas'

/** Devuelve los números a mostrar, con "…" cuando hay muchas páginas. */
function paginasVisibles(actual, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const paginas = new Set([1, total, actual - 1, actual, actual + 1])
  const lista = [...paginas].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const resultado = []
  lista.forEach((pagina, i) => {
    if (i > 0 && pagina - lista[i - 1] > 1) resultado.push(`gap-${pagina}`)
    resultado.push(pagina)
  })
  return resultado
}

export default function Pagination({ page, totalPages, limit, totalItems, onPageChange, onLimitChange }) {
  const desde = totalItems === 0 ? 0 : (page - 1) * limit + 1
  const hasta = Math.min(page * limit, totalItems)

  return (
    <div className="pagination">
      <label className="pagination__limit">
        Mostrar
        <span className="select-mini">
          <select value={limit} onChange={(event) => onLimitChange(Number(event.target.value))}>
            {REGISTROS_POR_PAGINA.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
          <Icon name="chevronDown" size={16} />
        </span>
        registros
      </label>

      <p className="pagination__range">
        Mostrando {desde}–{hasta} de {totalItems} citas
      </p>

      <nav className="pagination__pages" aria-label="Paginación">
        <button type="button" className="page-btn page-btn--wide" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <Icon name="chevronLeft" size={16} />
          Anterior
        </button>
        {paginasVisibles(page, totalPages).map((item) =>
          typeof item === 'string' ? (
            <span key={item} className="page-gap">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`page-btn ${item === page ? 'page-btn--active' : ''}`}
              aria-current={item === page ? 'page' : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          className="page-btn page-btn--wide"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
          <Icon name="chevronRight" size={16} />
        </button>
      </nav>
    </div>
  )
}
