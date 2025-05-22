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
        }
    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        alert('Erro ao verificar login.');
    }
})();

// Utilitário para formatar horário para HH:mm
const formatarHorario = (id) => {
    const valor = document.getElementById(id).value;
    return valor ? valor.slice(0, 5) : null;
};

document.getElementById('medicamentoForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const validade = document.getElementById('validade').value;
    const quantidade = document.getElementById('quantidade').value;
    const frequencia = document.getElementById('frequencia').value;
    const dosagem = document.getElementById('dosagem').value;
    const descricao = document.getElementById('descricao').value;
    const usuarioId = localStorage.getItem('usuarioId');

    const frequencia1horario1 = formatarHorario('frequencia1horario1');
    const frequencia2horario1 = formatarHorario('frequencia2horario1');
    const frequencia2horario2 = formatarHorario('frequencia2horario2');
    const frequencia3horario1 = formatarHorario('frequencia3horario1');
    const frequencia3horario2 = formatarHorario('frequencia3horario2');
    const frequencia3horario3 = formatarHorario('frequencia3horario3');

    try {
        const response = await fetch('http://localhost:3000/api/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                validade,
                quantidade,
                frequencia,
                dosagem,
                frequencia1horario1,
                frequencia2horario1,
                frequencia2horario2,
                frequencia3horario1,
                frequencia3horario2,
                frequencia3horario3,
                descricao,
                usuarioId
            })
        });

        const data = await response.json();
        alert(data.message);
        document.getElementById('medicamentoForm').reset();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar medicamento!');
    }
});

// Exibe campos de horário e dosagem de acordo com a frequência selecionada
document.getElementById('frequencia').addEventListener('change', function () {
    const valor = this.value;

    document.getElementById('container1horario').style.display = 'none';
    document.getElementById('container2horario').style.display = 'none';
    document.getElementById('container3horario').style.display = 'none';
    document.getElementById('containerDosagem').style.display = 'none';

    if (valor === 'Uma vez ao dia') {
        document.getElementById('container1horario').style.display = 'block';
        document.getElementById('containerDosagem').style.display = 'block';
    } else if (valor === 'Duas vezes ao dia') {
        document.getElementById('container2horario').style.display = 'block';
        document.getElementById('containerDosagem').style.display = 'block';
    } else if (valor === 'Três vezes ao dia') {
        document.getElementById('container3horario').style.display = 'block';
        document.getElementById('containerDosagem').style.display = 'block';
    }
});

// Botão de voltar para a home
const back = document.getElementsByTagName('i');
if (back.length > 0) {
    back[0].addEventListener('click', function () {
        window.location.href = 'home.html';
    });
}