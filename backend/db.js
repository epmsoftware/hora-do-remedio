const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./banco.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');

        // Criação das tabelas, se ainda não existirem
        db.run(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL UNIQUE,
                senha TEXT NOT NULL
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS pacientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT,
                idade TEXT,
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
                nome TEXT,
                validade TEXT,
                quantidade INTEGER,
                frequencia TEXT,
                dosagem TEXT,
                frequencia1horario1 TEXT,
                frequencia2horario1 TEXT,
                frequencia2horario2 TEXT,
                frequencia3horario1 TEXT,
                frequencia3horario2 TEXT,
                frequencia3horario3 TEXT,
                descricao TEXT,
                usuario_id INTEGER,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            )
        `);
    }
});

module.exports = db;