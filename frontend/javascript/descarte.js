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

const back = document.getElementsByTagName('i');
        if (back.length > 0) {
            back[0].addEventListener('click', async function () {
                window.location.href = 'home.html';
            });
        }