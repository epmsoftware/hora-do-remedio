document.getElementById('usuarioForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const idade = document.getElementById('idade').value;
    const peso = document.getElementById('peso').value;
    const altura = document.getElementById('altura').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const observacao = document.getElementById('observacao').value;

    try {
    // Enviar os dados para o banco de dados
    const response = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ nome, idade, peso, altura, email, telefone, observacao })
    });
    
        const data = await response.json();
        alert(data.message);
        document.getElementById('usuarioForm').reset();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar usuário!');
    }
});

document.getElementById('back').addEventListener('click', function() {
    window.location.href = 'home.html';
})