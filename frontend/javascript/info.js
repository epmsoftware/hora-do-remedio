async function fetchMedicamentos() {
    const descricaoContainer = document.getElementById('descricaoContainer');

    try {
        const response = await fetch('http://localhost:3000/api/descricao');

        if (!response.ok) {
            throw new Error('Erro na rede');
        }

        const data = await response.json();

        // Limpa o contêiner antes de adicionar novos medicamentos
        descricaoContainer.innerHTML = '';

        document.getElementById('back').addEventListener('click', function () {
            window.location.href = 'Home.html';
        });

        if (data.length === 0) {
            const mensagem = document.createElement('p');
            mensagem.textContent = 'Nenhum remédio cadastrado';
            descricaoContainer.appendChild(mensagem);
        } else {
            data.forEach(medicamento => {
                const descricaoDiv = document.createElement('div');
                descricaoDiv.className = 'descricao';

                const descricaoMedicamento = document.createElement('span');
                descricaoMedicamento.className = 'descricaoRemedio';
                descricaoMedicamento.textContent = `${medicamento.nome} - ${medicamento.descricao}`;

                descricaoDiv.appendChild(descricaoMedicamento);
                descricaoContainer.appendChild(descricaoDiv);
            });
        }
    } catch (error) {
        console.error('Erro ao buscar medicamentos:', error);
        const mensagemErro = document.createElement('p');
        mensagemErro.textContent = 'Erro ao carregar medicamentos';
        descricaoContainer.appendChild(mensagemErro);
    }
}

// Chama a função ao carregar a página
window.onload = fetchMedicamentos;

document.getElementById('back').addEventListener('click', function() {
    window.location.href = 'home.html';
})