(async () => {
    try {
        const response = await fetch('http://localhost:3000/api/usuario-logado', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();

        if (!data.logado) {
            alert('Você precisa estar logado.');
            window.location.href = '/';
        } else {
            console.log('Usuário autenticado com ID:', data.usuarioId);
            // Você pode exibir isso na tela se quiser
        }
    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        alert('Erro ao verificar login.');
    }
})();

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
    const response = await fetch('http://localhost:3000/api/paciente', {
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
        alert('Erro ao cadastrar paciente!');
    }
});

const back = document.getElementsByTagName('i');
    if (back.length > 0) {
        back[0].addEventListener('click', async function () {
            window.location.href = 'home.html'
        })
    }