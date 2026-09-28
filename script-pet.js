const petForm = document.getElementById('petForm');

petForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // O FormData empacota texto e arquivos juntos para o envio
    const formData = new FormData();
    formData.append('tutor', document.getElementById('tutor').value.trim());
    formData.append('nome_pet', document.getElementById('nomePet').value.trim());
    formData.append('raca', document.getElementById('raca').value.trim());
    formData.append('genero', document.getElementById('genero').value);
    formData.append('peso', document.getElementById('peso').value);
    formData.append('idade', document.getElementById('idade').value);

    const imagemInput = document.getElementById('imagem');
    if (imagemInput.files[0]) {
        formData.append('imagem', imagemInput.files[0]);
    }

    try {
        const response = await fetch('http://localhost:3000/api/pets', {
            method: 'POST',
            // IMPORTANTE: Ao usar FormData, NÃO definimos o 'Content-Type'.
            // O navegador faz isso automaticamente para incluir o arquivo.
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            petForm.reset();
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao conectar com o servidor.');
    }
});