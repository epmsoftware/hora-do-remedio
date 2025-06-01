const usuarioId = localStorage.getItem('usuarioId');

if (!usuarioId) {
    alert('Você precisa estar logado.');
    window.location.href = 'login.html';
}

let intervalId;
let dateId;
let avisosDados = {}; // Controle para evitar alertas duplicados

async function fetchMedicamentos() {
    try {
        const response = await fetch(`http://localhost:3000/api/medicamentos/${usuarioId}`);
        if (!response.ok) {
            throw new Error('Erro na rede');
        }

        const data = await response.json();

        const medicamentosContainer = document.getElementById('medicamentosContainer');
        medicamentosContainer.innerHTML = '';

        // Desbloqueia o áudio após o primeiro clique do usuário
        document.addEventListener('click', () => {
            document.getElementById('audioNot').play().catch(() => { });
        }, { once: true });


        let alarmesAtivos = {}; // Para controlar alarmes ativos por medicamento e horário

        intervalId = setInterval(() => {
            const agora = new Date();
            const horaAtual = agora.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });

            data.forEach(medicamento => {
                const horarios = [
                    medicamento.frequencia1horario1,
                    medicamento.frequencia2horario1,
                    medicamento.frequencia2horario2,
                    medicamento.frequencia3horario1,
                    medicamento.frequencia3horario2,
                    medicamento.frequencia3horario3
                ].filter(Boolean).map(h => h.slice(0, 5));

                horarios.forEach(horario => {
                    const chave = `${medicamento.id}_${horario}`;

                    // Se for o horário atual e ainda não iniciou o alarme
                    if (horaAtual === horario && !alarmesAtivos[chave]) {
                        document.getElementById('audioNot').play();
                        alert(`É hora de tomar seu ${medicamento.nome} - Dosagem: ${medicamento.dosagem}`);

                        // Inicia repetição do alarme a cada 5 minutos
                        let contador = 1;
                        const repetidor = setInterval(() => {
                            if (contador >= 12) {
                                clearInterval(repetidor);       // Para o alarme após 1 hora
                                delete alarmesAtivos[chave];    // Libera para outro dia
                                return;
                            }
                            document.getElementById('audioNot').play();
                            alert(`Lembrete: tome seu ${medicamento.nome} - Dosagem: ${medicamento.dosagem}`);
                            contador++;
                        }, 3 * 60 * 1000); // 3 minutos

                        alarmesAtivos[chave] = repetidor;
                    }
                });
            });
        }, 60000); // Verifica a cada minuto

        // Verifica a data de validade a cada 1 hora
        dateId = setInterval(() => {
            const currentDate = new Date().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            data.forEach(medicamento => {
                const [ano, mes, dia] = medicamento.validade.split('-');
                const validadeObj = new Date(ano, mes - 1, dia);
                const validadeFormatada = validadeObj.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });

                if (currentDate === validadeFormatada) {
                    document.getElementById('audioNot').play();
                    alert(`Seu ${medicamento.nome} chegou na data de validade: ${validadeFormatada}`);
                }
            });
        }, 3600000);

        // Voltar para home
        const back = document.getElementsByTagName('i');
        if (back.length > 0) {
            back[0].addEventListener('click', () => {
                window.location.href = 'home.html';
            });
        }

        if (data.length === 0) {
            const mensagem = document.createElement('p');
            mensagem.textContent = 'Nenhum remédio cadastrado';
            medicamentosContainer.appendChild(mensagem);
        } else {
            for (const medicamento of data) {
                const infoRemLixDiv = document.createElement('div');
                infoRemLixDiv.className = 'containerRemLix';

                const medicamentoDiv = document.createElement('div');
                medicamentoDiv.className = 'medicamento';
                infoRemLixDiv.appendChild(medicamentoDiv);

                const [ano, mes, dia] = medicamento.validade.split('-');
                const validadeObj = new Date(ano, mes - 1, dia);
                const validadeFormatada = validadeObj.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });

                const textoMedicamento = document.createElement('span');
                textoMedicamento.className = 'nomeRemedio';
                textoMedicamento.innerHTML = `${medicamento.nome}&nbsp;&nbsp;&nbsp;&nbsp;[&nbspFrequência - ${medicamento.frequencia}&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;Quantidade em estoque - ${medicamento.quantidade}&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;Validade - ${validadeFormatada}&nbsp]`;

                medicamentoDiv.appendChild(textoMedicamento);

                const divLinks = document.createElement('div');
                divLinks.className = 'divLinks';

                const linkLixeira = document.createElement('a');
                linkLixeira.className = 'linkLixeira';
                const imagemLinkLixeira = document.createElement('i');
                imagemLinkLixeira.className = 'fa-solid fa-trash-can';

                const linkEdit = document.createElement('a');
                linkEdit.className = 'linkEdit';
                const imagemLinkEdit = document.createElement('i');
                imagemLinkEdit.className = 'fa-solid fa-pen';

                imagemLinkLixeira.addEventListener('click', async () => {
                    const confirmacao = confirm('Deseja realmente excluir este medicamento?');
                    if (confirmacao) {
                        try {
                            const deletResp = await fetch(`http://localhost:3000/api/medicamentos/${medicamento.id}`, {
                                method: 'DELETE'
                            });
                            if (!deletResp.ok) throw new Error('Erro ao excluir');
                            await fetchMedicamentos();
                        } catch (error) {
                            console.error('Erro ao tentar excluir o medicamento!');
                        }
                    }
                });

                imagemLinkEdit.addEventListener('click', async () => {
                    const novoNome = prompt('Editar nome do medicamento:', medicamento.nome);
                    if (novoNome === null) return;

                    const novaQuantidade = prompt('Editar quantidade:', medicamento.quantidade);
                    if (novaQuantidade === null || isNaN(novaQuantidade)) return;

                    // Conversão da data de validade para DD/MM/AAAA no prompt
                    const [anoVal, mesVal, diaVal] = medicamento.validade.split('-');
                    const validadeBr = `${diaVal}/${mesVal}/${anoVal}`;
                    const novaValidadeBr = prompt('Editar data de validade (formato DD/MM/AAAA):', validadeBr);
                    if (novaValidadeBr === null) return;

                    // Converte de volta para YYYY-MM-DD
                    const [dia, mes, ano] = novaValidadeBr.split('/');
                    const novaValidade = `${ano}-${mes}-${dia}`;

                    let novoHorario1 = null;
                    let novoHorario2 = null;
                    let novoHorario3 = null;

                    if (medicamento.frequencia === 'Uma vez ao dia') {
                        novoHorario1 = prompt('Editar horário (HH:MM):', medicamento.frequencia1horario1 || '');
                    } else if (medicamento.frequencia === 'Duas vezes ao dia') {
                        novoHorario1 = prompt('Editar 1º horário (HH:MM):', medicamento.frequencia2horario1 || '');
                        novoHorario2 = prompt('Editar 2º horário (HH:MM):', medicamento.frequencia2horario2 || '');
                    } else if (medicamento.frequencia === 'Três vezes ao dia') {
                        novoHorario1 = prompt('Editar 1º horário (HH:MM):', medicamento.frequencia3horario1 || '');
                        novoHorario2 = prompt('Editar 2º horário (HH:MM):', medicamento.frequencia3horario2 || '');
                        novoHorario3 = prompt('Editar 3º horário (HH:MM):', medicamento.frequencia3horario3 || '');
                    }

                    const corpoAtualizado = {
                        nome: novoNome,
                        quantidade: Number(novaQuantidade),
                        validade: novaValidade,
                        frequencia: medicamento.frequencia,
                        frequencia1horario1: null,
                        frequencia2horario1: null,
                        frequencia2horario2: null,
                        frequencia3horario1: null,
                        frequencia3horario2: null,
                        frequencia3horario3: null
                    };

                    if (medicamento.frequencia === 'Uma vez ao dia') {
                        corpoAtualizado.frequencia1horario1 = novoHorario1;
                    } else if (medicamento.frequencia === 'Duas vezes ao dia') {
                        corpoAtualizado.frequencia2horario1 = novoHorario1;
                        corpoAtualizado.frequencia2horario2 = novoHorario2;
                    } else if (medicamento.frequencia === 'Três vezes ao dia') {
                        corpoAtualizado.frequencia3horario1 = novoHorario1;
                        corpoAtualizado.frequencia3horario2 = novoHorario2;
                        corpoAtualizado.frequencia3horario3 = novoHorario3;
                    }

                    try {
                        await fetch(`http://localhost:3000/api/medicamentos/editar/${medicamento.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(corpoAtualizado)
                        });
                        await fetchMedicamentos();
                    } catch (error) {
                        alert('Erro ao atualizar medicamento.');
                        console.error(error);
                    }
                });

                divLinks.appendChild(linkEdit);
                divLinks.appendChild(linkLixeira);
                linkEdit.appendChild(imagemLinkEdit);
                linkLixeira.appendChild(imagemLinkLixeira);
                medicamentoDiv.appendChild(divLinks);

                medicamentosContainer.appendChild(infoRemLixDiv);
            }
        }
    } catch (error) {
        console.error('Erro ao buscar medicamentos:', error);
        const remedioText = document.createElement('p');
        remedioText.textContent = 'Erro ao carregar medicamentos';
        document.getElementById('medicamentosContainer').appendChild(remedioText);
    }
}

window.onload = fetchMedicamentos;