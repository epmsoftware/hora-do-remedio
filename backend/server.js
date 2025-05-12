const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Conexão com o banco SQLite
const db = new sqlite3.Database('./database/horaDoRemedio.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite');
    }
});

// Criação das tabelas (caso não existam)
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            idade INTEGER,
            peso REAL,
            altura REAL,
            email TEXT,
            telefone TEXT,
            descricao TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS cadastromedicamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            validade TEXT NOT NULL,
            quantidade REAL NOT NULL,
            frequencia TEXT,
            dosagem TEXT,
            frequencia1horario1 TEXT,
            frequencia2horario1 TEXT,
            frequencia2horario2 TEXT,
            frequencia3horario1 TEXT,
            frequencia3horario2 TEXT,
            frequencia3horario3 TEXT,
            descricao TEXT NOT NULL
        )
    `);
});

// Rota para cadastrar usuarios
app.post('/api/usuarios', (req, res) => {
    const { nome, idade, peso, altura, email, telefone, descricao } = req.body;
    const sql = `INSERT INTO usuarios (nome, idade, peso, altura, email, telefone, descricao)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [nome, idade, peso, altura, email, telefone, descricao], function (err) {
        if (err) {
            console.error('Erro ao cadastrar usuário:', err.message);
            return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
        }
        res.status(200).json({ message: 'Usuário cadastrado com sucesso!', id: this.lastID });
    });
});

// Rota para cadastrar medicamentos
app.post('/api/cadastrar', (req, res) => {
    const {
        nome, validade, quantidade, frequencia, dosagem,
        frequencia1horario1, frequencia2horario1, frequencia2horario2,
        frequencia3horario1, frequencia3horario2, frequencia3horario3, descricao
    } = req.body;

    const sql = `INSERT INTO cadastromedicamentos (
        nome, validade, quantidade, frequencia, dosagem,
        frequencia1horario1, frequencia2horario1, frequencia2horario2,
        frequencia3horario1, frequencia3horario2, frequencia3horario3, descricao
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [
        nome, validade, quantidade, frequencia, dosagem,
        frequencia1horario1, frequencia2horario1, frequencia2horario2,
        frequencia3horario1, frequencia3horario2, frequencia3horario3, descricao
    ], function (err) {
        if (err) {
            console.error('Erro ao cadastrar medicamento:', err.message);
            return res.status(500).json({ message: 'Erro ao cadastrar medicamento' });
        }
        res.status(200).json({ message: 'Medicamento cadastrado com sucesso!', id: this.lastID });
    });
});

// Rota para obter medicamentos
app.get('/api/medicamentos', (req, res) => {
    const sql = `SELECT * FROM cadastromedicamentos`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar medicamentos:', err.message);
            return res.status(500).json({ message: 'Erro ao buscar medicamentos' });
        }
        res.status(200).json(rows);
    });
});

// Rota para obter descrição dos medicamentos
app.get('/api/descricao', (req, res) => {
    const sql = `SELECT nome, descricao FROM cadastromedicamentos`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar descrições:', err.message);
            return res.status(500).json({ message: 'Erro ao buscar descrições' });
        }
        res.status(200).json(rows);
    });
});

// Rota para deletar medicamento
app.delete('/api/deletar/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM cadastromedicamentos WHERE id = ?`;

    db.run(sql, [id], function (err) {
        if (err) {
            console.error('Erro ao deletar medicamento:', err.message);
            return res.status(500).json({ message: 'Erro ao deletar medicamento' });
        }
        res.status(200).json({ message: 'Medicamento excluído com sucesso' });
    });
});

// Rota para editar quantidade
app.put('/api/editarestoque/:id', (req, res) => {
    const id = req.params.id;
    const { quantidade } = req.body;

    const sql = `UPDATE cadastromedicamentos SET quantidade = ? WHERE id = ?`;

    db.run(sql, [quantidade, id], function (err) {
        if (err) {
            console.error('Erro ao atualizar quantidade:', err.message);
            return res.status(500).json({ message: 'Erro ao atualizar quantidade' });
        }
        res.status(200).json({ message: 'Quantidade atualizada com sucesso!' });
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});