const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/', (req, res) => {
    const {
        nome, validade, quantidade, frequencia, dosagem,
        frequencia1horario1, frequencia2horario1, frequencia2horario2,
        frequencia3horario1, frequencia3horario2, frequencia3horario3,
        descricao, usuarioId
    } = req.body;

    const sql = `INSERT INTO cadastromedicamentos 
        (nome, validade, quantidade, frequencia, dosagem, 
         frequencia1horario1, frequencia2horario1, frequencia2horario2,
         frequencia3horario1, frequencia3horario2, frequencia3horario3, 
         descricao, usuario_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        nome, validade, quantidade, frequencia, dosagem,
        frequencia1horario1, frequencia2horario1, frequencia2horario2,
        frequencia3horario1, frequencia3horario2, frequencia3horario3,
        descricao, usuarioId
    ];

    db.run(sql, values, err => {
        if (err) return res.status(500).json({ message: 'Erro ao cadastrar medicamento' });
        res.status(200).json({ message: 'Medicamento cadastrado com sucesso!' });
    });
});

router.get('/:usuarioId', (req, res) => {
    const sql = 'SELECT * FROM cadastromedicamentos WHERE usuario_id = ?';
    db.all(sql, [req.params.usuarioId], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Erro ao buscar medicamentos' });
        res.status(200).json(rows);
    });
});

router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM cadastromedicamentos WHERE id = ?';
    db.run(sql, [req.params.id], err => {
        if (err) return res.status(500).json({ message: 'Erro ao excluir o medicamento' });
        res.status(200).json({ message: 'Medicamento excluído com sucesso' });
    });
});

router.put('/editar/:id', (req, res) => {
    const { nome, quantidade, validade, frequencia1horario1, frequencia2horario1, frequencia2horario2 } = req.body;
    const sql = `
        UPDATE cadastromedicamentos 
        SET nome = ?, quantidade = ?, validade = ?, 
            frequencia1horario1 = ?, frequencia2horario1 = ?, frequencia2horario2 = ?
        WHERE id = ?
    `;

    const params = [
        nome,
        quantidade,
        validade,
        frequencia1horario1,
        frequencia2horario1,
        frequencia2horario2,
        req.params.id
    ];

    db.run(sql, params, err => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro ao editar medicamento' });
        }
        res.status(200).json({ message: 'Medicamento atualizado com sucesso!' });
    });
});

module.exports = router;