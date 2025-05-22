window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3000/api/usuario-logado', {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store',
        });
        const data = await response.json();
        
        if (!data.logado) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = '/';
        } else {
            console.log('Usuário logado com ID:', data.usuarioId);
            // Exiba o nome ou ID do usuário na interface, se quiser
        }
    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
    }
});

const logoutIcon = document.querySelector('i.fa-right-from-bracket');

if (logoutIcon) {
    logoutIcon.addEventListener('click', async function () {
        try {
            const response = await fetch('http://localhost:3000/api/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                window.location.href = '/';
            } else {
                alert('Erro ao deslogar: ' + data.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro na requisição de logout');
        }
    });
}