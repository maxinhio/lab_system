# LABEXPRESS-LIS — Test Cases

Instrucciones: Para cada caso ejecutar pasos y anotar el resultado en `test-results.md`.

AUTH
- AUTH-01 Login correcto
  - Precondición: usuario existe
  - Pasos: POST `/api/auth/login` con credenciales válidas
  - Resultado esperado: 200, token JWT y datos de usuario

- AUTH-02 Password incorrecto
  - Paso: login con contraseña errónea
  - Esperado: 401 Credenciales inválidas

- AUTH-03 Usuario inexistente -> 401
- AUTH-04 Usuario inactivo -> 403
- AUTH-05 Token inválido -> usar token modificado y acceder a `/api/me` -> 403/401
- AUTH-06 Rol no autorizado -> intentar acción restringida (ej. recepcionista autorizar) -> 403

PACIENTES
- PAT-01 Crear paciente -> POST `/api/pacientes` -> 201 con id
- PAT-02 Documento duplicado -> crear con mismo `numero_documento` -> 409
- PAT-03 Editar paciente -> PUT `/api/pacientes/:id` -> validar cambios
- PAT-04 Buscar paciente -> GET `/api/pacientes/:id` y `/api/pacientes/documento/:doc`

ORDENES
- ORD-01 Crear orden -> POST `/api/ordenes` con examenes válidos -> 201 y código QR
- ORD-02 Orden sin exámenes -> 400
- ORD-03 Examen inexistente -> 404
- ORD-04 Cálculo total -> verificar `monto_total` en DB
- ORD-05 Rollback -> introducir error en pago simulando fallo y verificar no haya orden incompleta

PAGOS
- PAY-01 Pago correcto -> POST pago asociado a orden -> registro en `pagos`
- PAY-02 Pago inválido -> campos faltantes -> 400
- PAY-03 Pago asociado a orden -> consultar orden y ver pago relacionado

QR
- QR-01 Generar QR -> tras crear orden, existen `codigo_qr`
- QR-02 QR único -> crear segunda orden y verificar no colisión
- QR-03 QR inexistente -> GET /api/muestras/:codigo con código inválido -> 404
- QR-04 Consulta QR -> GET muestra por código y validar relación con orden

GPS
- GPS-01 Coordenadas válidas -> POST `/api/muestras/:id/recoleccion` con lat/lon válidas -> 200
- GPS-02 Latitud inválida -> valor fuera rango -> 422 o manejo controlado
- GPS-03 Longitud inválida -> idem

RESULTADOS
- RES-01 Registrar -> POST `/api/resultados` como Bioquímico -> 201
- RES-02 Modificar -> PUT `/api/resultados/:id` cambiar `valor_hallado` -> 200
- RES-03 Auditar modificación -> revisar `historial_resultados` para registro previo
- RES-04 Usuario no autorizado -> intento por recepcionista -> 403

PDF
- PDF-01 Generar -> GET `/api/reportes/:ordenId/pdf` cuando hay resultados y autorizado -> 200 y archivo
- PDF-02 Descargar -> paciente con propiedad -> 200
- PDF-03 Orden incompleta -> 422
- PDF-04 Usuario no autorizado -> 403

PACIENTE (propiedad)
- PATIENT-01 Ver propias órdenes -> login paciente -> GET `/api/ordenes/:id` -> 200
- PATIENT-02 Intentar ver otra orden -> 403
- PATIENT-03 Descargar propio informe -> 200
- PATIENT-04 Intentar descargar informe ajeno -> 403

INTEGRACIÓN (flujo end-to-end)
- Ejecutar el flujo completo (usar `backend/tools/e2e_test.js` como guía), verificar cada paso y artefactos.
