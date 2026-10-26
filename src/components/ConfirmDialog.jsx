import Icon from './Icon'

/** Mensaje de confirmación antes de editar o eliminar. */
export default function ConfirmDialog({ title, message, confirmLabel, variant = 'primary', isBusy, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop modal-backdrop--top" onMouseDown={onCancel}>
      <div
        className="confirm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span className={`confirm__icon confirm__icon--${variant}`}>
          <Icon name={variant === 'danger' ? 'trash' : 'alert'} size={24} />
        </span>
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="confirm__actions">
          <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={isBusy}>
            Cancelar
          </button>
          <button
            type="button"
            className={`btn ${variant === 'danger' ? 'btn--danger' : 'btn--primary'}`}
            onClick={onConfirm}
            disabled={isBusy}
            autoFocus
          >
            {isBusy ? 'Procesando…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
