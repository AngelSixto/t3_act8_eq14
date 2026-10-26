import { useCallback, useEffect, useState } from 'react'
import {
  createCitaRequest,
  deleteCitaRequest,
  fetchPacientes,
  updateCitaRequest,
} from '../services/api'
import { ordenarPorFechaYHora, pacienteACita } from '../utils/citas'

/**
 * Maneja la lista de citas: carga inicial desde la API y acciones CRUD.
 *
 * DummyJSON solo simula las escrituras (responde como si guardara, pero no
 * persiste nada). Por eso cada acción: 1) hace la petición real a la API y
 * 2) refleja el cambio en el estado local para que la tabla se actualice.
 * Si la API no responde, el cambio se aplica igual de forma local.
 */
export function useCitas() {
  const [citas, setCitas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadCitas = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const pacientes = await fetchPacientes()
      setCitas(
        pacientes
          .map((paciente, indice) => pacienteACita(paciente, indice, pacientes.length))
          .sort(ordenarPorFechaYHora),
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCitas()
  }, [loadCitas])

  /** Ejecuta la petición a la API; devuelve true si respondió bien. */
  async function tryApiCall(apiCall) {
    try {
      const response = await apiCall()
      console.info('Respuesta de la API:', response)
      return true
    } catch (err) {
      console.warn('La API no confirmó el cambio, se aplica solo localmente:', err.message)
      return false
    }
  }

  const addCita = useCallback(async (datos) => {
    const apiOk = await tryApiCall(() => createCitaRequest(datos))
    setCitas((actuales) => {
      const nuevoId = Math.max(0, ...actuales.map((c) => c.id)) + 1
      const nueva = { ...datos, id: nuevoId, expediente: 1000 + nuevoId, esLocal: true }
      return [...actuales, nueva].sort(ordenarPorFechaYHora)
    })
    return apiOk
  }, [])

  const editCita = useCallback(async (id, datos) => {
    const apiOk = await tryApiCall(() => updateCitaRequest(id, datos))
    setCitas((actuales) =>
      actuales.map((cita) => (cita.id === id ? { ...cita, ...datos } : cita)).sort(ordenarPorFechaYHora),
    )
    return apiOk
  }, [])

  const removeCita = useCallback(async (id) => {
    const apiOk = await tryApiCall(() => deleteCitaRequest(id))
    setCitas((actuales) => actuales.filter((cita) => cita.id !== id))
    return apiOk
  }, [])

  return { citas, isLoading, error, loadCitas, addCita, editCita, removeCita }
}
