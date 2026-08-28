# API — Endpoints principales

Formato: endpoint — método — autenticación — roles autorizados — request — response — errores

- `POST /api/auth/login` — Login
  - Auth: no
  - Request: `{ username, password }`
  - Response 200: `{ success:true, data: { user: {...}, token: "<jwt>" } }`
  - Errores: 400 (faltan datos), 401 (credenciales inválidas), 403 (usuario inactivo)

- `POST /api/auth/logout` — Logout (revoke token)
  - Auth: Bearer
  - Roles: cualquier usuario autenticado
  - Response: 200 `{ success:true }`

- `GET /api/me` — Información del usuario actual
  - Auth: Bearer

- `POST /api/pacientes` — Crear paciente
  - Auth: Bearer
  - Roles: `Administrador`, `Recepcionista` (según rutas)
  - Request: `{ numero_documento, nombres, apellidos, ... }`

- `GET /api/pacientes/:id` — Obtener paciente
  - Auth: Bearer
  - Si el requester es paciente, solo puede acceder a su propio recurso

- `POST /api/ordenes` — Crear orden
  - Auth: Bearer
  - Roles: `Administrador`,`Recepcionista`
  - Request: `{ id_paciente, examenes: [id_ex], metodo_pago, num_transaccion }`

- `GET /api/ordenes/:id` — Obtener orden
  - Auth: Bearer
  - Pacientes solo pueden ver sus órdenes

- `GET /api/muestras/:codigo_qr` — Obtener muestra por QR
  - Auth: Bearer

- `POST /api/muestras/:id/recoleccion` — Registrar recolección (GPS)
  - Auth: Bearer
  - Request: `{ latitud, longitud, fecha_hora }`

- `POST /api/resultados` — Registrar resultados (array o single)
  - Auth: Bearer
  - Roles: `Bioquímico`, `Analista`, `Administrador`

- `PUT /api/resultados/:id` — Actualizar resultado
  - Auth: Bearer
  - Roles: `Bioquímico`, `Analista`, `Administrador`
  - Si orden en `COMPLETADA` y cambia `valor_hallado`, solo `Administrador` con `motivo`

- `GET /api/reportes/:ordenId/pdf` — Generar y descargar PDF
  - Auth: Bearer
  - Roles: staff o paciente propietario
  - Respuestas: 200 archivo PDF, 403 si no autorizado, 422 si no hay resultados

- `POST /api/device-tokens` — Registrar token FCM
  - Auth: Bearer
  - Request: `{ token, plataforma }`

- Admin: `POST /api/reactivos`, `POST /api/reactivos/lotes`, `GET /api/reactivos/alerts`, `POST /api/equipos`

Errores comunes
- 400 Bad Request: datos faltantes o inválidos
- 401 Unauthorized: token faltante o revocado
- 403 Forbidden: rol no autorizado o acceso a recurso ajeno
- 404 Not Found: recurso inexistente
- 422 Unprocessable: operación inválida por estado (p.ej. generar PDF sin resultados)

Nota: Para detalles completos por endpoint, revisar los controladores en `backend/src/controllers/`.
