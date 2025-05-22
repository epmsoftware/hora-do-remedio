const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors({ origin: 'http://127.0.0.1:5500', credentials: true }));
app.use(express.json());
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, '..', 'frontend')));
// app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
app.use('/css', express.static(path.join(__dirname, '..', 'frontend', 'css')));
app.use('/images', express.static(path.join(__dirname, '..', 'frontend', 'images')));
app.use('/javascript', express.static(path.join(__dirname, '..', 'frontend', 'javascript')));
app.use('/audio', express.static(path.join(__dirname, '..', 'frontend', 'audio')));
app.use('/video', express.static(path.join(__dirname, '..', 'frontend', 'video')));
app.use(session({
  secret: 'EpM.AvsM',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Rotas
const authRoutes = require('./rotas/autenticacao');
const pacienteRoutes = require('./rotas/pacientes');
const medicamentoRoutes = require('./rotas/medicamentos');

app.use('/api', authRoutes);
app.use('/api/paciente', pacienteRoutes);
app.use('/api/cadastrar', medicamentoRoutes);
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/descricao', medicamentoRoutes);

function verificarAutenticacao(req, res, next) {
  if (req.session && req.session.usuarioId) {
    return next();
  } else {
    return res.redirect('/');
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'inicial.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'login.html'));
});

app.get('/usuario.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'usuario.html'));
});

app.get('/home.html', verificarAutenticacao, (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'home.html'));
});

app.get('/paciente.html', verificarAutenticacao, (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'paciente.html'));
});

app.get('/cadastro.html', verificarAutenticacao, (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'cadastro.html'));
});

app.get('/lembrete.html', verificarAutenticacao, (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'lembrete.html'));
});

app.get('/info.html', verificarAutenticacao, (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'info.html'));
});

app.get('/descarte.html', verificarAutenticacao, (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'descarte.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});