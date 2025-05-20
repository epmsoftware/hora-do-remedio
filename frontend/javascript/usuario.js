document.getElementById('cadastroForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;

    try {
        // Enviar os dados para o bando de dados
        const response = await fetch('http://localhost:3000/api/usuario', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({ nome, senha })
        })

        const data = await response.json();
        alert(data.message);
        document.getElementById('cadastroForm').reset();

        window.location.href = 'login.html';
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar usuário!');
    }
});


const back = document.getElementsByTagName('i');
    if (back.length > 0) {
        back[0].addEventListener('click', async function () {
    window.location.href = 'login.html';
    });
}