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
            // Salvar o ID do usuário no localStorage, sessionStorage ou redirecionar com token
            localStorage.setItem('usuarioId', data.usuarioId);
            alert('Login bem-sucedido!');
            window.location.href = `Home.html?usuarioId=${data.usuarioId}`; // redireciona
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error('Erro:', err);
        alert('Erro ao fazer login');
    }
});