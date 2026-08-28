# Base de Datos — Resumen de modelo

Tablas principales (resumen):

- `usuarios` — usuarios del sistema (id_usuario, username, password_hash, id_rol, activo, id_paciente, id_empleado)
- `roles` — nombres de roles (Administrador, Recepcionista, Bioquímico, Analista, Flebotomista, Paciente)
- `pacientes` — datos demográficos del paciente
- `ordenes_analisis` — ordenes creadas (id_orden, id_paciente, monto_total, estado_orden, url_pdf_informe)
- `detalle_orden` — examenes por orden
- `pagos` — pagos asociados a ordenes
- `muestras` — muestras físicas (id_muestra, id_orden, codigo_qr, estado_muestra)
- `resultados_detalle` — resultados por parámetro (id_resultado, id_orden, id_muestra, valor_hallado, id_bioquimico, autorizado)
- `historial_resultados` — auditoría de cambios de resultados
- `device_tokens` — tokens FCM por paciente
- `notification_events` — registros de intentos de notificación
- `reactivos_insumos`, `lotes_reactivos` — gestión de inventario de reactivos
- `equipos_laboratorio` — equipos, estado y última calibración
- `token_blacklist` — tokens revocados por logout

Relaciones clave
- `usuarios.id_paciente` -> `pacientes.id_paciente` (opcional)
- `ordenes_analisis.id_paciente` -> `pacientes.id_paciente`
- `detalle_orden.id_orden` -> `ordenes_analisis.id_orden`
- `muestras.id_orden` -> `ordenes_analisis.id_orden`
- `resultados_detalle.id_orden` -> `ordenes_analisis.id_orden`
- `lotes_reactivos.id_reactivo` -> `reactivos_insumos.id_reactivo`

Diccionario resumido
- `estado_orden`: `PENDIENTE`, `EN_PROCESO`, `COMPLETADA`, etc.
- `estado_muestra`: `PENDIENTE`, `RECOLECTADA`, `RECIBIDA_EN_LAB`, etc.

Ver `backend/database/schema.sql` para el esquema completo y tipos.
