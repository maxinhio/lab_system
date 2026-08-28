USE labexpress_lis;

SET FOREIGN_KEY_CHECKS = 0;

-- ROLES
INSERT INTO roles (id_rol, nombre_rol, descripcion) VALUES
(1,'Administrador','Rol con todos los permisos'),
(2,'Recepcionista','Gestiona pacientes y órdenes'),
(3,'Bioquímico','Registra y autoriza resultados'),
(4,'Flebotomista','Toma de muestras'),
(5,'Paciente','Acceso al portal del paciente')
ON DUPLICATE KEY UPDATE nombre_rol = VALUES(nombre_rol);

-- EMPLEADOS
INSERT INTO empleados (id_empleado, ci_nit, nombres, apellidos, matricula_profesional, cargo, telefono)
VALUES
(1,'EMP001','Admin','System','ADM-0001','Administrador','+59170000001'),
(2,'EMP002','Reception','User',NULL,'Recepcionista','+59170000002'),
(3,'EMP003','Bioquimico','User','BIO-1234','Bioquímico','+59170000003'),
(4,'EMP004','Flebo','User','FLE-5678','Flebotomista','+59170000004')
ON DUPLICATE KEY UPDATE nombres=VALUES(nombres);

-- USERS (passwords hashed with bcrypt)
-- Demo passwords (change in production): admin:Admin@123, recep:Recep@123, bio:Bio@123, flebo:Flebo@123, paciente:Patient@123
INSERT INTO usuarios (id_usuario, id_empleado, id_paciente, id_rol, username, password_hash, activo)
VALUES
(1,1,NULL,1,'admin','$2b$10$KbQi1Zy2hVq7J9e1u8XbOeR8g1PqjYH3cG5dF2aB6cD7eF8g9HiJK',1),
(2,2,NULL,2,'recepcion','$2b$10$.z9XOeySZNjQHPAp.iLG.OSQ53/pz3s6gxJaqwwttmjXt5u8AwZeO',1),
(3,3,NULL,3,'bioquimico','$2b$10$4bent9BoVjn.ceuKug8mWOJTg5EQ/QyNnRMbcJw2E1TWMXuQS9F5u',1),
(4,4,NULL,4,'flebotomista','$2b$10$hmQ.RBzu1iXvh6OWtaVdoOhSQa.iRO7FgwryNCTUamyWmwUpFB.1.',1),
(5, NULL,1,5,'paciente','$2b$10$SqgNuZ31tJ7Nysr9qeaOwOBX71muaercJvm1hSN2Lw.uG2oGOofW2',1)
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- CATEGORIAS
INSERT INTO categorias_examen (id_categoria, nombre_categoria, descripcion)
VALUES
(1,'Hematología','Exámenes de hematología'),
(2,'Química Sanguínea','Exámenes de química sanguínea'),
(3,'Inmunología','Exámenes de inmunología'),
(4,'Parasitología','Exámenes de parasitología'),
(5,'Microbiología','Exámenes de microbiología')
ON DUPLICATE KEY UPDATE nombre_categoria=VALUES(nombre_categoria);

-- EXAMENES
INSERT INTO examenes (id_examen, id_categoria, nombre_examen, descripcion, precio, estado)
VALUES
(1,1,'Hemograma Completo','Hemograma completo estándar',45.00,'Activo'),
(2,2,'Glucosa','Glucosa en sangre',15.00,'Activo'),
(3,2,'Colesterol Total','Colesterol total',20.00,'Activo'),
(4,2,'Triglicéridos','Triglicéridos',18.00,'Activo'),
(5,2,'Creatinina','Creatinina en sangre',25.00,'Activo'),
(6,5,'Examen General de Orina','EGO completo',30.00,'Activo')
ON DUPLICATE KEY UPDATE nombre_examen=VALUES(nombre_examen);

-- PACIENTES
INSERT INTO pacientes (id_paciente, tipo_documento, numero_documento, nombres, apellidos, fecha_nacimiento, genero, telefono, email)
VALUES
(1,'DNI','P001','Juan','Perez','1985-06-15','M','+59170000011','juan.perez@example.com'),
(2,'DNI','P002','María','Gomez','1990-09-20','F','+59170000012','maria.gomez@example.com')
ON DUPLICATE KEY UPDATE numero_documento=VALUES(numero_documento);

-- ORDENES (ejemplo)
INSERT INTO ordenes_analisis (id_orden, id_paciente, id_usuario_recepcion, fecha_creacion, monto_total, estado_orden)
VALUES
(1,1,2,'2026-08-27 09:00:00',60.00,'PENDIENTE')
ON DUPLICATE KEY UPDATE fecha_creacion=VALUES(fecha_creacion);

-- DETALLE_ORDEN
INSERT INTO detalle_orden (id_detalle, id_orden, id_examen, precio_unitario)
VALUES
(1,1,2,15.00),
(2,1,6,30.00)
ON DUPLICATE KEY UPDATE precio_unitario=VALUES(precio_unitario);

-- PAGOS (ejemplo)
INSERT INTO pagos (id_pago, id_orden, monto, fecha_pago, metodo_pago, num_transaccion)
VALUES
(1,1,60.00,'2026-08-27 09:05:00','Efectivo',NULL)
ON DUPLICATE KEY UPDATE monto=VALUES(monto);

-- MUESTRAS (ejemplo)
INSERT INTO muestras (id_muestra, id_orden, codigo_qr, tipo_muestra, estado_muestra, id_flebotomista)
VALUES
(1,1,'MUE-20260827-0001','Sangre','PENDIENTE',4)
ON DUPLICATE KEY UPDATE codigo_qr=VALUES(codigo_qr);

-- RESULTADOS_DETALLE (ejemplo)
INSERT INTO resultados_detalle (id_resultado, id_orden, id_muestra, nombre_parametro, valor_hallado, unidad_medida, id_bioquimico)
VALUES
(1,1,1,'Glucosa','--','mg/dL',3)
ON DUPLICATE KEY UPDATE nombre_parametro=VALUES(nombre_parametro);

-- HISTORIAL_RESULTADOS (vacío por ahora)

-- CITAS_DOMICILIO (ejemplo record to prepare feature)
INSERT INTO citas_domicilio (id_cita, id_paciente, fecha_programada, direccion_toma, estado_cita, id_flebotomista)
VALUES
(1,2,'2026-08-28 08:30:00','Calle Falsa 123','Pendiente',4)
ON DUPLICATE KEY UPDATE fecha_programada=VALUES(fecha_programada);

-- INVENTARIO: REACTIVOS Y LOTES (ejemplo)
INSERT INTO reactivos_insumos (id_reactivo, nombre_reactivo, unidad_medida, stock_minimo)
VALUES
(1,'Reactivo A','mL',10),
(2,'Reactivo B','mL',5)
ON DUPLICATE KEY UPDATE nombre_reactivo=VALUES(nombre_reactivo);

INSERT INTO lotes_reactivos (id_lote, id_reactivo, codigo_lote, fecha_vencimiento, cantidad_disponible)
VALUES
(1,1,'LoteA-001','2027-01-01',100),
(2,2,'LoteB-001','2026-12-01',50)
ON DUPLICATE KEY UPDATE codigo_lote=VALUES(codigo_lote);

-- EQUIPOS LAB
INSERT INTO equipos_laboratorio (id_equipo, nombre_equipo, marca_modelo, estado, ultima_calibracion)
VALUES
(1,'Centrífuga X','MarcaX Modelo1','Operativo','2026-06-01')
ON DUPLICATE KEY UPDATE nombre_equipo=VALUES(nombre_equipo);

SET FOREIGN_KEY_CHECKS = 1;

