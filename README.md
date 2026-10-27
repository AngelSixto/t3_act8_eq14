# Sonrisa · Sistema de gestión de citas odontológicas

**Actividad 8 – Consumo de APIs de Terceros: Login y Sistema con Tabla CRUD**
Programación Web · Ing. Adelina Martínez Nieto · Instituto Tecnológico de Oaxaca (TecNM) · Grupo 7SD

## 👥 Integrantes (Equipo 14)

- Sixto Morales Angel
- Poblete Hernandez Jhonatan Ivan

## 🔗 Enlaces

- **Proyecto desplegado en el VPS:** http://157.180.30.55/t3_act8_eq14/
- **Repositorio:** https://github.com/AngelSixto/t3_act8_eq14
- **Mockup en Figma (Actividad 7):** https://www.figma.com/proto/FqsYMfdiBLF9Q6yDEMyq3D/Sonrisas?node-id=18-2&starting-point-node-id=21%3A2

## 📝 Descripción

Sonrisa es un mini sistema web para la recepción de una clínica dental. Permite iniciar sesión, consultar un resumen de la actividad del día y administrar las citas de los pacientes en una tabla con filtros, paginación y acciones para agregar, editar y eliminar. La interfaz sigue el mockup diseñado en Figma en la actividad anterior: paleta verde azulado (60-30-10), tipografía Inter e íconos de línea.

## 🌐 APIs utilizadas

| Uso | API | Endpoint |
|---|---|---|
| Inicio de sesión | DummyJSON Auth | `POST https://dummyjson.com/auth/login` |
| Login con correo | DummyJSON Users | `GET https://dummyjson.com/users/filter?key=email&value=...` |
| **Datos de la tabla** | **DummyJSON Users** (pacientes) | `GET https://dummyjson.com/users?limit=0` |
| Agregar cita | DummyJSON Users | `POST https://dummyjson.com/users/add` |
| Editar cita | DummyJSON Users | `PUT https://dummyjson.com/users/:id` |
| Eliminar cita | DummyJSON Users | `DELETE https://dummyjson.com/users/:id` |

**API elegida para la tabla: DummyJSON (`/users`).** Cada usuario de la API se toma como un **paciente** (nombre, correo, teléfono y foto vienen de la API). A cada paciente se le asigna una cita con dentista, fecha, hora, tratamiento y estado de manera determinista, para que los datos encajen con el sistema de la clínica diseñado en Figma.

> **Sobre las acciones CRUD:** DummyJSON solo *simula* las escrituras: responde como si guardara, pero no persiste nada. Por eso cada acción **(1)** hace la petición real a la API (POST, PUT o DELETE) y **(2)** refleja el cambio en el estado local con `useState`, para que la tabla se actualice. Si la API no confirma el cambio (por ejemplo, al editar una cita creada localmente, que no existe en el servidor), el cambio se aplica igual de forma local y se avisa con una notificación. Las respuestas de la API se pueden ver en la consola del navegador (F12).

## 🔑 Usuario de prueba

| Usuario | Contraseña |
|---|---|
| `emilys` (o `emily.johnson@x.dummyjson.com`) | `emilyspass` |

Otros usuarios válidos: https://dummyjson.com/users (campos `username` y `password`).

## ✅ Funcionalidades por fase

**Fase 1 – Login**
- Formulario con usuario/correo y contraseña, con el diseño del mockup.
- Validación antes de enviar: los campos no pueden ir vacíos.
- Login con `POST /auth/login`. Se aceptan el nombre de usuario o el correo.
- Mensaje claro si los datos son incorrectos ("Usuario o contraseña incorrectos") o si no hay conexión.
- Los datos del usuario se guardan en el estado (`useState`) y en `sessionStorage` para no perder la sesión al recargar.

**Fase 2 – Sistema simulado**
- Sidebar con Panel principal, Citas, Pacientes y Dentistas. Las dos últimas son opciones simuladas.
- Navbar con la **foto**, el **nombre** y el **usuario** que devolvió la API, y un menú con **Cerrar sesión**.
- Vista protegida: sin sesión solo se muestra el login, aunque se abra un enlace directo a la tabla.

**Fase 3 – Tabla de citas**
- Filtro de texto (paciente o dentista), filtro por **estado** y filtro por **fecha**.
- Paginación con selector de **10, 20, 40 o 50** registros por página.
- La vista, la página, el límite y los filtros se reflejan en la URL, por ejemplo `?vista=citas&page=2&limit=20&estado=Pendiente`. El enlace se puede compartir y funcionan los botones Atrás y Adelante del navegador.
- Indicador "Cargando citas…" y mensaje de error con botón **Reintentar**.
- **Agregar** cita (formulario "Nueva cita" del mockup).
- **Editar** cita, con confirmación antes de guardar.
- **Eliminar** cita, con confirmación antes de eliminar.
- **Ver** el detalle de una cita.

## 🗂️ Estructura del proyecto

```
src/
├── assets/          # Imágenes (mascota del login)
├── components/      # Componentes reutilizables: Sidebar, Navbar, Modal, CitasTable, Pagination…
├── hooks/           # useCitas (datos + CRUD), useQueryParams (URL), useToasts
├── layouts/         # AppLayout: sidebar + navbar + contenido protegido
├── pages/           # LoginPage, DashboardPage, CitasPage, ModuloSimuladoPage
├── services/api.js  # Todas las llamadas a DummyJSON
├── styles/          # Estilos globales con los colores del mockup
└── utils/citas.js   # Transformación de datos, filtros y formatos
```

## 💻 Ejecutar en local

```bash
npm install
npm run dev
```

Abrir http://localhost:5173/t3_act8_eq14/

## 🚀 Despliegue en el VPS

```bash
npm run build
scp -r dist/* USUARIO@IP_DEL_VPS:/var/www/html/t3_act8_eq14/
```

El `base` de `vite.config.js` ya está configurado como `/t3_act8_eq14/`. La navegación usa parámetros de la URL (`?vista=...`), así que no hace falta configurar reglas extra en Nginx.
