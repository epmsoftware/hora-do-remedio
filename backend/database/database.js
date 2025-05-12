const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./horaDoRemedio.db');

// Criar tabela usuarios
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

  // Criar tabela cadastromedicamentos
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

  console.log("Tabelas criadas com sucesso.");
});

db.close();