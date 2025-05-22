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

        // 🔓 Desbloqueia o áudio após o primeiro clique do usuário
        document.addEventListener('click', () => {
            document.getElementById('audioNot').play().catch(() => {});
        }, { once: true });

        // ⏰ Verifica o horário atual a cada minuto
        intervalId = setInterval(() => {
            const currentTime = new Date().toLocaleTimeString([], {
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
                ].filter(Boolean);

                const horariosFormatados = horarios.map(h => h.slice(0, 5));

                if (horariosFormatados.includes(currentTime)) {
                    document.getElementById('audioNot').play();
                    alert(`É hora de tomar seu ${medicamento.nome} - Dosagem: ${medicamento.dosagem}`);
                }
            });
        }, 60000);

        // ⏳ Verifica a data de validade a cada 1 hora
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
                    const editar = prompt('Editar quantidade:', medicamento.quantidade);
                    if (editar !== null && !isNaN(editar)) {
                        await fetch(`http://localhost:3000/api/medicamentos/editarestoque/${medicamento.id}`, {
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