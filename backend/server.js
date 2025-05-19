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
app.use(express.static('HORA DO REMEDIO'));
app.use(session({
    secret: 'EpM.AvsM',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Rotas
const authRoutes = require('./routes/auth');
const pacienteRoutes = require('./routes/pacientes');
const medicamentoRoutes = require('./routes/medicamentos');

app.use('/api', authRoutes);
app.use('/api/paciente', pacienteRoutes);
app.use('/api/cadastrar', medicamentoRoutes);
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/descricao', medicamentoRoutes);

app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'login.html'));
});

app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'home.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});