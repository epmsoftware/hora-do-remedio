const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
    const { nome, idade, peso, altura, email, telefone, observacao } = req.body;

    const sql = `
        INSERT INTO pacientes (nome, idade, peso, altura, email, telefone, observacao)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [nome, idade, peso, altura, email, telefone, observacao], function(err) {
        if (err) {
            console.error('Erro ao cadastrar paciente:', err);
            return res.status(500).json({ message: 'Erro ao cadastrar paciente' });
        }
        res.status(200).json({ message: 'Paciente cadastrado com sucesso!' });
    });
});

module.exports = router;