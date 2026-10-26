import Icon from './Icon'

export function LoadingState({ message = 'Cargando…' }) {
  return (
    <div className="state" role="status">
      <span className="spinner" />
      <p>{message}</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <span className="state__icon">
        <Icon name="alert" size={28} />
      </span>
      <strong>No se pudieron cargar los datos</strong>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          <Icon name="reset" />
          Reintentar
        </button>
      )}
    </div>
  )
}

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`}>
          <Icon name={toast.type === 'error' ? 'alert' : toast.type === 'info' ? 'info' : 'check'} />
          <span>{toast.message}</span>
          <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Cerrar notificación">
            <Icon name="x" size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
