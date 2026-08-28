-- LABEXPRESS-LIS: Phase 2 schema (exactly 16 tables)
DROP DATABASE IF EXISTS labexpress_lis;
CREATE DATABASE labexpress_lis CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE labexpress_lis;

-- 1. roles
CREATE TABLE roles (
  id_rol INT AUTO_INCREMENT PRIMARY KEY,
  nombre_rol VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. empleados
CREATE TABLE empleados (
  id_empleado INT AUTO_INCREMENT PRIMARY KEY,
  ci_nit VARCHAR(100) UNIQUE,
  nombres VARCHAR(200) NOT NULL,
  apellidos VARCHAR(200) NOT NULL,
  matricula_profesional VARCHAR(100),
  cargo VARCHAR(100),
  telefono VARCHAR(50),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. pacientes
CREATE TABLE pacientes (
  id_paciente INT AUTO_INCREMENT PRIMARY KEY,
  tipo_documento VARCHAR(30),
  numero_documento VARCHAR(100) NOT NULL UNIQUE,
  nombres VARCHAR(200) NOT NULL,
  apellidos VARCHAR(200) NOT NULL,
  fecha_nacimiento DATE,
  genero VARCHAR(20),
  telefono VARCHAR(50),
  email VARCHAR(150),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. usuarios
CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  id_empleado INT NULL,
  id_paciente INT NULL,
  id_rol INT NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. categorias_examen
CREATE TABLE categorias_examen (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre_categoria VARCHAR(150) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. examenes
CREATE TABLE examenes (
  id_examen INT AUTO_INCREMENT PRIMARY KEY,
  id_categoria INT NOT NULL,
  nombre_examen VARCHAR(200) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  estado ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_categoria) REFERENCES categorias_examen(id_categoria) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. ordenes_analisis
CREATE TABLE ordenes_analisis (
  id_orden INT AUTO_INCREMENT PRIMARY KEY,
  id_paciente INT NOT NULL,
  id_usuario_recepcion INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  monto_total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  estado_orden ENUM('PENDIENTE','EN_PROCESO','COMPLETADA','CANCELADA') NOT NULL DEFAULT 'PENDIENTE',
  url_pdf_informe VARCHAR(500),
  FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_usuario_recepcion) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. detalle_orden
CREATE TABLE detalle_orden (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_orden INT NOT NULL,
  id_examen INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_orden) REFERENCES ordenes_analisis(id_orden) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_examen) REFERENCES examenes(id_examen) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. muestras
CREATE TABLE muestras (
  id_muestra INT AUTO_INCREMENT PRIMARY KEY,
  id_orden INT NOT NULL,
  codigo_qr VARCHAR(100) NOT NULL UNIQUE,
  tipo_muestra ENUM('Sangre','Orina','Heces','Esputo','LCR') NOT NULL,
  estado_muestra ENUM('PENDIENTE','RECOLECTADA_EN_CAMPO','RECIBIDA_EN_LAB','PROCESADA','RECHAZADA') NOT NULL DEFAULT 'PENDIENTE',
  id_flebotomista INT,
  latitud_gps DECIMAL(10,7),
  longitud_gps DECIMAL(10,7),
  fecha_recoleccion DATETIME,
  motivo_rechazo TEXT,
  FOREIGN KEY (id_orden) REFERENCES ordenes_analisis(id_orden) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_flebotomista) REFERENCES empleados(id_empleado) ON DELETE SET NULL ON UPDATE CASCADE,
  CHECK (latitud_gps BETWEEN -90 AND 90),
  CHECK (longitud_gps BETWEEN -180 AND 180)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. resultados_detalle
CREATE TABLE resultados_detalle (
  id_resultado INT AUTO_INCREMENT PRIMARY KEY,
  id_orden INT NOT NULL,
  id_muestra INT NOT NULL,
  nombre_parametro VARCHAR(255) NOT NULL,
  valor_hallado VARCHAR(255) NOT NULL,
  unidad_medida VARCHAR(100),
  id_bioquimico INT,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  autorizado TINYINT(1) DEFAULT 0,
  FOREIGN KEY (id_orden) REFERENCES ordenes_analisis(id_orden) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_muestra) REFERENCES muestras(id_muestra) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_bioquimico) REFERENCES empleados(id_empleado) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. historial_resultados
CREATE TABLE historial_resultados (
  id_historial INT AUTO_INCREMENT PRIMARY KEY,
  id_resultado INT NOT NULL,
  id_usuario INT NULL,
  valor_anterior VARCHAR(255),
  valor_nuevo VARCHAR(255),
  fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  motivo TEXT,
  FOREIGN KEY (id_resultado) REFERENCES resultados_detalle(id_resultado) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. citas_domicilio
CREATE TABLE citas_domicilio (
  id_cita INT AUTO_INCREMENT PRIMARY KEY,
  id_paciente INT NOT NULL,
  fecha_programada DATETIME NOT NULL,
  direccion_toma VARCHAR(500) NOT NULL,
  foto_orden_path VARCHAR(500),
  estado_cita ENUM('Pendiente','Completada','Cancelada') NOT NULL DEFAULT 'Pendiente',
  id_flebotomista INT,
  id_orden INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_flebotomista) REFERENCES empleados(id_empleado) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_orden) REFERENCES ordenes_analisis(id_orden) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. pagos
CREATE TABLE pagos (
  id_pago INT AUTO_INCREMENT PRIMARY KEY,
  id_orden INT NOT NULL,
  monto DECIMAL(12,2) NOT NULL,
  fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metodo_pago ENUM('Efectivo','QR','Transferencia','Tarjeta') NOT NULL,
  num_transaccion VARCHAR(200),
  FOREIGN KEY (id_orden) REFERENCES ordenes_analisis(id_orden) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. reactivos_insumos
CREATE TABLE reactivos_insumos (
  id_reactivo INT AUTO_INCREMENT PRIMARY KEY,
  nombre_reactivo VARCHAR(255) NOT NULL,
  unidad_medida VARCHAR(50),
  stock_minimo INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. lotes_reactivos
CREATE TABLE lotes_reactivos (
  id_lote INT AUTO_INCREMENT PRIMARY KEY,
  id_reactivo INT NOT NULL,
  codigo_lote VARCHAR(200),
  fecha_vencimiento DATE,
  cantidad_disponible INT NOT NULL DEFAULT 0,
  FOREIGN KEY (id_reactivo) REFERENCES reactivos_insumos(id_reactivo) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. equipos_laboratorio
CREATE TABLE equipos_laboratorio (
  id_equipo INT AUTO_INCREMENT PRIMARY KEY,
  nombre_equipo VARCHAR(255) NOT NULL,
  marca_modelo VARCHAR(255),
  estado ENUM('Activo','Mantenimiento','Fuera de servicio') DEFAULT 'Activo',
  ultima_calibracion DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- OPTIONAL: autorizaciones (required by backend for recording authorizations)
CREATE TABLE IF NOT EXISTS autorizaciones (
  id_autorizacion INT AUTO_INCREMENT PRIMARY KEY,
  id_orden INT NOT NULL,
  id_usuario INT NULL,
  fecha_autorizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(100),
  FOREIGN KEY (id_orden) REFERENCES ordenes_analisis(id_orden) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes
CREATE INDEX idx_pacientes_numdoc ON pacientes (numero_documento);
CREATE INDEX idx_usuarios_username ON usuarios (username);
CREATE INDEX idx_muestras_codigoqr ON muestras (codigo_qr);
CREATE INDEX idx_ordenes_idpaciente ON ordenes_analisis (id_paciente);
CREATE INDEX idx_detalleorden_idorden ON detalle_orden (id_orden);
CREATE INDEX idx_detalleorden_idexamen ON detalle_orden (id_examen);
CREATE INDEX idx_ordenes_estado ON ordenes_analisis (estado_orden);
CREATE INDEX idx_muestras_estado ON muestras (estado_muestra);
CREATE INDEX idx_ordenes_fecha ON ordenes_analisis (fecha_creacion);
