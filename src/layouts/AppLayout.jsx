import { useMemo, useState } from 'react'
import CitaDetalleModal from '../components/CitaDetalleModal'
import CitaFormModal from '../components/CitaFormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import Navbar from '../components/Navbar'
import Sidebar, { MENU } from '../components/Sidebar'
import { ToastContainer } from '../components/StatusMessages'
import { useCitas } from '../hooks/useCitas'
import { useToasts } from '../hooks/useToasts'
import CitasPage from '../pages/CitasPage'
import DashboardPage from '../pages/DashboardPage'
import ModuloSimuladoPage from '../pages/ModuloSimuladoPage'
import { formatFecha } from '../utils/citas'

const TITULOS = { panel: 'Panel principal', citas: 'Citas', pacientes: 'Pacientes', dentistas: 'Dentistas' }

/** FASE 2: Sistema con sidebar y navbar (solo visible con sesión iniciada). */
export default function AppLayout({ usuario, params, updateParams, onLogout }) {
  const { citas, isLoading, error, loadCitas, addCita, editCita, removeCita } = useCitas()
  const { toasts, showToast, dismissToast } = useToasts()

  const [formulario, setFormulario] = useState(null) // { cita } o { cita: null } para nueva
  const [citaDetalle, setCitaDetalle] = useState(null)
  const [confirmacion, setConfirmacion] = useState(null) // { tipo: 'editar' | 'eliminar', cita, datos }
  const [isSaving, setIsSaving] = useState(false)

  const vistaParam = params.get('vista')
  const vista = MENU.some((item) => item.vista === vistaParam) ? vistaParam : 'panel'

  const nombresPacientes = useMemo(() => [...new Set(citas.map((cita) => cita.paciente))].sort(), [citas])

  function handleNavigate(nuevaVista) {
    if (nuevaVista === vista) return
    updateParams({ vista: nuevaVista }, { reset: true })
  }

  function avisarResultado(apiOk, mensaje) {
    if (apiOk) showToast(mensaje)
    else showToast(`${mensaje} (solo localmente: la API no confirmó el cambio).`, 'info')
  }

  // ---------- Agregar ----------
  async function handleCreateCita(datos) {
    setIsSaving(true)
    const apiOk = await addCita(datos)
    setIsSaving(false)
    setFormulario(null)
    avisarResultado(apiOk, `Cita de ${datos.paciente} registrada`)
  }

  // ---------- Editar (con confirmación) ----------
  function handleSubmitEdit(datos) {
    setConfirmacion({ tipo: 'editar', cita: formulario.cita, datos })
  }

  // ---------- Eliminar (con confirmación) ----------
  function handleAskDelete(cita) {
    setConfirmacion({ tipo: 'eliminar', cita })
  }

  async function handleConfirm() {
    const { tipo, cita, datos } = confirmacion
    setIsSaving(true)
    if (tipo === 'editar') {
      const apiOk = await editCita(cita.id, datos)
      setFormulario(null)
      avisarResultado(apiOk, `Cita de ${cita.paciente} actualizada`)
    } else {
      const apiOk = await removeCita(cita.id)
      avisarResultado(apiOk, `Cita de ${cita.paciente} eliminada`)
    }
    setIsSaving(false)
    setConfirmacion(null)
  }

  const abrirNuevaCita = () => setFormulario({ cita: null })
  const irACitas = () => handleNavigate('citas')

  return (
    <div className="app">
      <Sidebar vistaActiva={vista} onNavigate={handleNavigate} onLogout={onLogout} />

      <div className="app__main">
        <Navbar titulo={TITULOS[vista]} usuario={usuario} onLogout={onLogout} />

        <main className="app__content">
          {vista === 'panel' && (
            <DashboardPage
              usuario={usuario}
              citas={citas}
              isLoading={isLoading}
              error={error}
              onRetry={loadCitas}
              onNewCita={abrirNuevaCita}
              onGoToCitas={irACitas}
            />
          )}
          {vista === 'citas' && (
            <CitasPage
              citas={citas}
              isLoading={isLoading}
              error={error}
              onRetry={loadCitas}
              params={params}
              updateParams={updateParams}
              onNewCita={abrirNuevaCita}
              onView={setCitaDetalle}
              onEdit={(cita) => setFormulario({ cita })}
              onDelete={handleAskDelete}
            />
          )}
          {vista === 'pacientes' && (
            <ModuloSimuladoPage
              titulo="Pacientes"
              descripcion="Directorio de pacientes registrados en la clínica."
              icon="users"
              onGoToCitas={irACitas}
            />
          )}
          {vista === 'dentistas' && (
            <ModuloSimuladoPage
              titulo="Dentistas"
              descripcion="Profesionales de la clínica y su disponibilidad."
              icon="user"
              onGoToCitas={irACitas}
            />
          )}
        </main>
      </div>

      {formulario && (
        <CitaFormModal
          cita={formulario.cita}
          pacientes={nombresPacientes}
          isSaving={isSaving}
          onSubmit={formulario.cita ? handleSubmitEdit : handleCreateCita}
          onClose={() => setFormulario(null)}
        />
      )}

      {citaDetalle && (
        <CitaDetalleModal
          cita={citaDetalle}
          onClose={() => setCitaDetalle(null)}
          onEdit={() => {
            setFormulario({ cita: citaDetalle })
            setCitaDetalle(null)
          }}
        />
      )}

      {confirmacion && (
        <ConfirmDialog
          title={confirmacion.tipo === 'editar' ? '¿Guardar los cambios?' : '¿Eliminar esta cita?'}
          message={
            confirmacion.tipo === 'editar'
              ? `Se actualizará la cita de ${confirmacion.cita.paciente} del ${formatFecha(confirmacion.datos.fecha)} a las ${confirmacion.datos.hora} h.`
              : `Se eliminará la cita de ${confirmacion.cita.paciente} del ${formatFecha(confirmacion.cita.fecha)} a las ${confirmacion.cita.hora} h. Esta acción no se puede deshacer.`
          }
          confirmLabel={confirmacion.tipo === 'editar' ? 'Sí, guardar' : 'Sí, eliminar'}
          variant={confirmacion.tipo === 'editar' ? 'primary' : 'danger'}
          isBusy={isSaving}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmacion(null)}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
