document.getElementById('medicamentoForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const nome = document.getElementById('nome').value;
    const validade = document.getElementById('validade').value;
    const quantidade = document.getElementById('quantidade').value;
    const horario1 = document.getElementById('horario1').value;
    const horario2 = document.getElementById('horario2').value;
    const descricao = document.getElementById('descricao').value;


    // Enviar os dados para o servidor
    fetch('http://localhost:3000/api/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, validade, quantidade, horario1, horario2, descricao })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Exibe uma mensagem de sucesso
        document.getElementById('medicamentoForm').reset(); // Limpa o formulário
    })
    .catch(error => console.error('Erro:', error));
});