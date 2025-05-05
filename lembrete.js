
let intervalId;
let dateId;

function fetchMedicamentos() {
    fetch('http://localhost:3000/api/medicamentos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na rede');
            }
            return response.json();
        })
        .then(data => {
            const medicamentosContainer = document.getElementById('medicamentosContainer');

            // Limpa o contêiner antes de adicionar novos medicamentos
            medicamentosContainer.innerHTML = '';

            // Verifica o horário atual a cada 60 segundos
            intervalId = setInterval(() => {
                const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                // Verifica se o horário do medicamento é igual ao horário atual e mostra a mensagem
                data.forEach(medicamento => {
                    const horarios = [medicamento.frequencia1horario1, medicamento.frequencia2horario1, medicamento.frequencia2horario2, medicamento.frequencia3horario1, medicamento.frequencia3horario2, medicamento.frequencia3horario3].filter(Boolean); // Filtra horários não definidos
                    if (horarios.includes(currentTime)) {
                        document.getElementById('audioNot').play();
                        alert(`É hora de tomar seu ${medicamento.nome} - Dosagem: ${medicamento.dosagem}`);
                    };
                });
            }, 1000);

            dateId = setInterval(() => {
                const currentDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

                data.forEach(medicamento => {
                    const validade = medicamento.validade;
                    if (currentDate === validade) {
                        alert(`Seu ${medicamento.nome} chegou na data de validade: ${medicamento.validade}`);
                    };
                });
            }, 3900000);


            document.getElementById('back').addEventListener('click', function () {
                window.location.href = 'Home.html'
            })

            if (data.length === 0) {
                const mensagem = document.createElement('p');
                mensagem.textContent = 'Nenhum remédio cadastrado';
                medicamentosContainer.appendChild(mensagem);
            } else {

                data.forEach(medicamento => {

                    console.log(medicamento)

                    // Cria um div para as informações do remédio e o ícone da lixeira
                    const infoRemLixDiv = document.createElement('div');
                    infoRemLixDiv.className = 'containerRemLix';

                    // Cria uma nova div para cada medicamento
                    const medicamentoDiv = document.createElement('div');
                    medicamentoDiv.className = 'medicamento'; // Classe para estilização

                    infoRemLixDiv.appendChild(medicamentoDiv);

                    /* Adiciona o CheckBox
                    const label = document.createElement('label');
                    label.className = 'switch';
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `checkbox-${medicamento.id}`; // Cada medicamento tem um ID único
                    label.appendChild(checkbox);

                    const span = document.createElement('span');
                    span.className = 'slider';
                    label.appendChild(span);

                    label.appendChild(document.createTextNode(' ')); // Espaço entre o checkbox e o texto*/

                    const [ano, mes, dia] = medicamento.validade.split('-');
                    const validadeFormatada = `${dia}/${mes}/${ano}`;

                    // Adiciona o texto do medicamento
                    const textoMedicamento = document.createElement('span');
                    textoMedicamento.className = 'nomeRemedio';
                    textoMedicamento.innerHTML = `${medicamento.nome}&nbsp;&nbsp;&nbsp;&nbsp;[&nbspFrequência - ${medicamento.frequencia}&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;Quantidade em estoque - ${medicamento.quantidade}&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;Validade - ${validadeFormatada}&nbsp]`;

                    /* Adiciona o checkbox e o texto a uma nova div
                    medicamentoDiv.appendChild(label);*/
                    medicamentoDiv.appendChild(textoMedicamento);

                    // Cria div para os links
                    const divLinks = document.createElement('div');
                    divLinks.className = 'divLinks';

                    // Cria o link para excluir as informações do medicamento
                    const linkLixeira = document.createElement('a');
                    linkLixeira.className = 'linkLixeira';
                    const imagemLinkLixeira = document.createElement('img');
                    imagemLinkLixeira.className = 'imagemLixeira';
                    imagemLinkLixeira.src = './images/lixeira-removebg-preview.png';

                    // Cria o link para editar as informações do medicamento
                    const linkEdit = document.createElement('a');
                    linkEdit.className = 'linkEdit';
                    const imagemLinkEdit = document.createElement('i');
                    imagemLinkEdit.className = 'fa-solid fa-pen';

                    // Função para confirmar e excluir o medicamento
                    function confirmarExclusao(id) {
                        const confirmacao = confirm('Deseja realmente excluir este medicamento?');

                        if (confirmacao) {
                            fetch(`http://localhost:3000/api/deletar/${id}`, {
                                method: 'DELETE'
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Erro ao excluir o medicamento');
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    fetchMedicamentos(); // Recarregar a lista de medicamentos após a exclusão
                                })
                                .catch(error => {
                                    console.error('Erro', error);
                                    alert('Ocorreu um erro ao tentar excluir o medicamento.');
                                });
                        }
                    }

                    // Chamar função para deletar o medicamento
                    imagemLinkLixeira.addEventListener('click', function () {
                        confirmarExclusao(medicamento.id);
                    });

                    // Função para editar a quantidade em estoque
                    async function editarEstoque(id) {
                        const editar = prompt('Editar quantidade:', medicamento.quantidade);

                        if (editar !== null && !isNaN(editar)) {
                            await fetch(`http://localhost:3000/api/editarestoque/${id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ quantidade: Number(editar) })
                            });
                            fetchMedicamentos();
                        }
                    }

                    // Chamar função para editar a quantidade
                    imagemLinkEdit.addEventListener('click', function () {
                        editarEstoque(medicamento.id);
                    });


                    divLinks.appendChild(linkEdit);
                    divLinks.appendChild(linkLixeira);
                    linkEdit.appendChild(imagemLinkEdit);
                    linkLixeira.appendChild(imagemLinkLixeira);
                    medicamentoDiv.appendChild(divLinks);

                    // Adiciona a nova div ao contâiner de medicamentos
                    medicamentosContainer.appendChild(infoRemLixDiv);

                    /* Adiciona um evento de escuta ao checkbox
                    checkbox.addEventListener('change', function() {
                        if(this.checked) {
                            clearInterval(intervalId);
                            // Toca o som
                            document.getElementById('audioNotificacao').play();
                            // Mostra a notificação
                            alert(`Parabéns! Você tomou seu ${medicamento.nome} no horário certo.`);
                        }
                    });*/
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar medicamentos:', error);
            const remedioText = document.createElement('p');
            remedioText.textContent = 'Erro ao carregar medicamentos'; // Mensagem de erro
            document.getElementById('medicamentosContainer').appendChild(remedioText);
        });
}

// Chama a função para buscar medicamentos ao carregar a página
window.onload = fetchMedicamentos;

document.getElementById('back').addEventListener('click', function () {
    window.location.href = 'home.html';
})