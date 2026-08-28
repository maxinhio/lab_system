# Backend — LABEXPRESS-LIS

Carpeta: `backend/`

Rápida guía:

1. Copiar `backend/.env.example` a `backend/.env` y completar variables.
2. Iniciar XAMPP (Apache + MySQL) y crear base `labexpress_lis` o ejecutar `database/schema.sql`.
3. Instalar dependencias:

```bash
cd backend
npm install
```

4. Iniciar en modo desarrollo:

```bash
npm run dev
```

Archivos principales:
- `src/app.js` — servidor Express mínimo.
- `database/schema.sql` — script inicial de creación de BD.
- `database/seed.sql` — datos de ejemplo (roles, categorías, exámenes básicos).
