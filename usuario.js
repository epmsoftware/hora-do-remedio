document.getElementById('usuarioForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const idade = document.getElementById('idade').value;
    const peso = document.getElementById('peso').value;
    const altura = document.getElementById('altura').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const observacao = document.getElementById('observacao').value;

    // Enviar os dados para o banco de dados
    fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ nome, idade, peso, altura, email, telefone, observacao })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById('usuarioForm').reset();
    })
    .catch(error => console.error('Erro:', error));
});