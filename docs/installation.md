# Instalación

Requisitos
- Node.js (16+ recommended)
- XAMPP (MySQL)
- Android Studio (para el cliente Android)

Pasos rápidos

1. Instalar Node.js
2. Instalar XAMPP y arrancar MySQL
3. Crear la base de datos y cargar el esquema:

```sql
-- en MySQL
CREATE DATABASE labexpress;
USE labexpress;
SOURCE backend/database/schema.sql;
```

4. (Opcional) importar seeds si existen
5. Crear archivo de variables de entorno `backend/.env` copiando `backend/.env.example` y rellenando valores (no subir a git)
6. Instalar dependencias backend:

```bash
cd backend
npm install
npm run dev
```

7. Frontend:

```bash
cd frontend
npm install
npm run dev
```

8. Android:
- Abrir `android/` en Android Studio
- Configurar la URL de la API en `ApiService.kt` o `NetworkModule` (usar `http://10.0.2.2:3000` en emulador)
- Ejecutar en emulador o dispositivo

Firebase (opcional)
- Para enviar push desde el servidor, proveer una credencial de servicio en la variable de entorno `FIREBASE_SERVICE_ACCOUNT_JSON` (JSON string) o `FIREBASE_SERVICE_ACCOUNT_PATH` (ruta al archivo JSON). No subir estas credenciales al repo.

PDF y QR
- Los informes PDF se generan en `backend/uploads/reports` y se devuelven tras verificar autorización.
- Las etiquetas QR se generan usando `qrcode` y se asocian a muestras en la BD.

Testing
- Ver `docs/testing/` para plan y casos.
- Ejecutar el script E2E (requiere backend corriendo):

```bash
node backend/tools/e2e_test.js
```
