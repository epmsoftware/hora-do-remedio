const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();

router.post('/usuario', async (req, res) => {
    const { nome, senha } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const sql = 'INSERT INTO usuarios (nome, senha) VALUES (?, ?)';
        db.run(sql, [nome, hashedPassword], function (err) {
            if (err) {
                return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
            }
            res.status(200).json({ message: 'Usuário cadastrado com sucesso!' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno ao cadastrar usuário' });
    }
});

router.post('/login', (req, res) => {
    const { nome, senha } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE nome = ?';
    db.get(sql, [nome], async (err, usuario) => {
        if (err || !usuario) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        req.session.usuarioId = usuario.id;
        res.status(200).json({ message: 'Login bem-sucedido', usuarioId: usuario.id });
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Erro ao deslogar' });
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logout bem-sucedido' });
    });
});

module.exports = router;