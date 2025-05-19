const usuarioId = localStorage.getItem('usuarioId');

if (!usuarioId) {
    alert('Você precisa estar logado.');
    window.location.href = 'login.html';
}

const back = document.getElementsByTagName('i');
        if (back.length > 0) {
            back[0].addEventListener('click', async function () {
                window.location.href = 'Home.html';
            });
        }