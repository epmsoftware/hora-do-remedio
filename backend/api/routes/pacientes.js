const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/', (req, res) => {
    const { nome, idade, peso, altura, email, telefone, observacao } = req.body;
    const sql = 'INSERT INTO paciente (nome, idade, peso, altura, email, telefone, observacao) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [nome, idade, peso, altura, email, telefone, observacao], err => {
        if (err) return res.status(500).json({ message: 'Erro ao cadastrar paciente' });
        res.status(200).json({ message: 'Paciente cadastrado com sucesso!' });
    });
});

module.exports = router;