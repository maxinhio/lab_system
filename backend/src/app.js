const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
const authRoutes = require('./routes/auth');
const pacientesRoutes = require('./routes/pacientes');
const examenesRoutes = require('./routes/examenes');
const rolesRoutes = require('./routes/roles');
const usuariosRoutes = require('./routes/usuarios');
const categoriasRoutes = require('./routes/categorias');
const ordenesRoutes = require('./routes/ordenes');
const pagosRoutes = require('./routes/pagos');
const muestrasRoutes = require('./routes/muestras');
const resultadosRoutes = require('./routes/resultados');
const autorizacionRoutes = require('./routes/autorizacion');
const reportesRoutes = require('./routes/reportes');
const deviceTokensRoutes = require('./routes/deviceTokens');
const equiposRoutes = require('./routes/equipos');
const reactivosRoutes = require('./routes/reactivos');
const lotesRoutes = require('./routes/lotes');
const path = require('path');

// health
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'LABEXPRESS-LIS API funcionando' });
});

app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/examenes', examenesRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/muestras', muestrasRoutes);
app.use('/api/resultados', resultadosRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/ordenes', autorizacionRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/device-tokens', deviceTokensRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/reactivos', reactivosRoutes);
app.use('/api/lotes', lotesRoutes);

// Serve frontend in development if built (optional)
app.use(express.static(path.join(__dirname, '../../frontend/dist')));


// global error handler
const { errorHandler } = require('./middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

module.exports = app;
