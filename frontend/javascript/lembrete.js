
let intervalId;
let dateId;

async function fetchMedicamentos() {
    try {
    const response = await fetch('http://localhost:3000/api/medicamentos')
            if (!response.ok) {
                throw new Error('Erro na rede');
            }
            const data = await response.json();
        
            const medicamentosContainer = document.getElementById('medicamentosContainer');
            // Limpa o contêiner antes de adicionar novos medicamentos
            medicamentosContainer.innerHTML = '';

             // Verifica o horário atual a cada 60 segundos
             intervalId = setInterval(() => {
                const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // Verifica se o horário do medicamento é igual ao horário atual e mostra a mensagem
                data.forEach(medicamento => {
                const horarios = [medicamento.frequencia1horario1, medicamento.frequencia2horario1, medicamento.frequencia2horario2, medicamento.frequencia3horario1, medicamento.frequencia3horario2, medicamento.frequencia3horario3].filter(Boolean); // Filtra horários não definidos
                if (horarios.includes(currentTime)) {
                    document.getElementById('audioNot').play();
                    alert(`É hora de tomar seu ${medicamento.nome} - Dosagem: ${medicamento.dosagem}`);};
                });
            }, 5000);


            // Verifica a data atual a cada 1 hora
            dateId = setInterval(() => {
                 const currentDate = new Date().toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });

                data.forEach(medicamento => {
                    const validadeObj = new Date(medicamento.validade);
                    const validadeFormatada = validadeObj.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });

                    console.log(validadeFormatada)

                    if (currentDate === validadeFormatada) {
                        alert(`Seu ${medicamento.nome} chegou na data de validade: ${validadeFormatada}`);
                    }
                });
            }, 3600000);


            document.getElementById('back').addEventListener('click', () => {
                window.location.href = 'Home.html'
            })
            
            
            if (data.length === 0) {
                const mensagem = document.createElement('p');
                mensagem.textContent = 'Nenhum remédio cadastrado';
                medicamentosContainer.appendChild(mensagem);
            } else {
                for (const medicamento of data) {                   
                    console.log(medicamento)

                    // Cria um div para as informações do remédio e o ícone da lixeira
                    const infoRemLixDiv = document.createElement('div');
                    infoRemLixDiv.className = 'containerRemLix';

                    // Cria uma nova div para cada medicamento
                    const medicamentoDiv = document.createElement('div');
                    medicamentoDiv.className = 'medicamento'; // Classe para estilização

                    infoRemLixDiv.appendChild(medicamentoDiv);
            
                    const validadeFormatada = new Date(medicamento.validade).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });

                    // Adiciona o texto do medicamento
                    const textoMedicamento = document.createElement('span');
                    textoMedicamento.className = 'nomeRemedio';
                    textoMedicamento.innerHTML = `${medicamento.nome}&nbsp;&nbsp;&nbsp;&nbsp;[&nbspFrequência - ${medicamento.frequencia}&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;Quantidade em estoque - ${medicamento.quantidade}&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;Validade - ${validadeFormatada}&nbsp]`;

                    medicamentoDiv.appendChild(textoMedicamento);    
                    
                    // Cria div para os links
                    const divLinks = document.createElement('div');
                    divLinks.className = 'divLinks';

                    // Cria o link para excluir as informações do medicamento
                    const linkLixeira = document.createElement('a');
                    linkLixeira.className = 'linkLixeira';
                    const imagemLinkLixeira = document.createElement('img');
                    imagemLinkLixeira.className = 'imagemLixeira';
                    imagemLinkLixeira.src = '../images/lixeira-removebg-preview.png';

                    // Cria o link para editar as informações do medicamento
                    const linkEdit = document.createElement('a');
                    linkEdit.className = 'linkEdit';
                    const imagemLinkEdit = document.createElement('i');
                    imagemLinkEdit.className = 'fa-solid fa-pen';

                    // Função para confirmar e excluir o medicamento
                    imagemLinkLixeira.addEventListener('click', async function() {
                        const confirmacao = confirm('Deseja realmente excluir este medicamento?');

                        if (confirmacao) {
                            try {
                                const deletResp = await fetch(`http://localhost:3000/api/deletar/${medicamento.id}`, {
                                method: 'DELETE'
                            });

                            if (!deletResp.ok) throw new Error('Erro ao excluir o medicamento');
                                await fetchMedicamentos();
                            } catch (error) {
                                console.error('Erro ao tentar excluir o medicamento!');
                            }
                        }
                    });

                    // Função para editar a quantidade em estoque
                    imagemLinkEdit.addEventListener('click', async function() {
                        const editar = prompt('Editar quantidade:', medicamento.quantidade);

                        if (editar !==null && !isNaN(editar)) {
                            await fetch(`http://localhost:3000/api/editarestoque/${medicamento.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ quantidade: Number(editar) })
                            });
                            await fetchMedicamentos();
                        }
                    });
                  
                    divLinks.appendChild(linkEdit);
                    divLinks.appendChild(linkLixeira);
                    linkEdit.appendChild(imagemLinkEdit);
                    linkLixeira.appendChild(imagemLinkLixeira);
                    medicamentoDiv.appendChild(divLinks);

                    // Adiciona a nova div ao contâiner de medicamentos
                    medicamentosContainer.appendChild(infoRemLixDiv);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar medicamentos:', error);
            const remedioText = document.createElement('p');
            remedioText.textContent = 'Erro ao carregar medicamentos'; // Mensagem de erro
            document.getElementById('medicamentosContainer').appendChild(remedioText);
        }
}

// Chama a função para buscar medicamentos ao carregar a página
window.onload = fetchMedicamentos;

document.getElementById('back').addEventListener('click', function() {
    window.location.href = 'home.html';
})