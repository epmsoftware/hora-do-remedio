document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, senha })
        });

        const data = await response.json();

        if (response.ok) {
            // Login bem-sucedido, salva o ID do usuário e redireciona para a home
            localStorage.setItem('usuarioId', data.usuarioId);
            alert('Login bem-sucedido!');
            window.location.href = `home.html?usuarioId=${data.usuarioId}`;
        } else {
            // Se o erro for 401, redireciona para a página de cadastro
            if (response.status === 401) {
                alert('Usuário não cadastrado.');
                window.location.href = '/usuario.html'; // Redireciona para o formulário de cadastro
            } else {
                alert(data.message || 'Erro desconhecido');
            }
        }
    } catch (err) {
        console.error('Erro:', err);
        alert('Erro ao fazer login');
    }
});