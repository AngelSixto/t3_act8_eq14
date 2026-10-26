// Todas las llamadas a la API de terceros (DummyJSON) viven en este archivo.
// Los componentes nunca usan fetch directamente: llaman a estas funciones.

const BASE_URL = 'https://dummyjson.com'

/** Error con un mensaje legible para mostrarlo al usuario. */
export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Revisa tu conexión a internet e inténtalo de nuevo.')
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    throw new ApiError(data?.message || `El servidor respondió con un error (${response.status}).`, response.status)
  }
  return data
}

// ---------------------------------------------------------------------------
// FASE 1 · Autenticación
// ---------------------------------------------------------------------------

/**
 * Inicia sesión en DummyJSON (POST /auth/login).
 * Acepta el nombre de usuario o el correo: si recibe un correo, primero
 * busca a qué usuario pertenece para obtener su "username".
 */
export async function loginUser(identifier, password) {
  let username = identifier.trim()

  if (username.includes('@')) {
    const result = await request(`/users/filter?key=email&value=${encodeURIComponent(username)}`)
    if (!result?.users?.length) {
      throw new ApiError('Usuario o contraseña incorrectos.', 400)
    }
    username = result.users[0].username
  }

  try {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, expiresInMins: 60 }),
    })
  } catch (error) {
    if (error.status === 400 || error.status === 401) {
      throw new ApiError('Usuario o contraseña incorrectos.', error.status)
    }
    throw error
  }
}

// ---------------------------------------------------------------------------
// FASE 3 · Datos de la tabla (pacientes de DummyJSON → citas de la clínica)
// ---------------------------------------------------------------------------

const CAMPOS_PACIENTE = 'firstName,lastName,email,phone,age,gender,image'

/** Obtiene todos los pacientes (GET /users). */
export async function fetchPacientes() {
  const data = await request(`/users?limit=0&select=${CAMPOS_PACIENTE}`)
  return data.users
}

/** Registra un paciente/cita nueva (POST /users/add). DummyJSON la simula. */
export function createCitaRequest(cita) {
  const [firstName, ...apellidos] = cita.paciente.trim().split(' ')
  return request('/users/add', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName: apellidos.join(' '), ...citaToPayload(cita) }),
  })
}

/** Actualiza una cita existente (PUT /users/:id). DummyJSON la simula. */
export function updateCitaRequest(id, cita) {
  return request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(citaToPayload(cita)),
  })
}

/** Elimina una cita (DELETE /users/:id). DummyJSON la simula. */
export function deleteCitaRequest(id) {
  return request(`/users/${id}`, { method: 'DELETE' })
}

function citaToPayload(cita) {
  return {
    cita: {
      dentista: cita.dentista,
      fecha: cita.fecha,
      hora: cita.hora,
      tratamiento: cita.tratamiento,
      estado: cita.estado,
      notas: cita.notas,
    },
  }
}
