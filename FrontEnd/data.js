let data = [];

    // Função para buscar as vagas da URL 'http://localhost:4000/vacancy'
const fetchVagas = async () => {
    try {
        const response = await fetch('http://localhost:4000/vacancy');
        if (response.ok) {
            const vagas = await response.json();
            data = vagas; // Preenche o array 'data' com os dados retornados
            carregarVagas(); // Carrega as vagas após obter os dados
        } else {
            console.error("Erro ao buscar vagas:", response.statusText);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    }
};

    // Função para carregar as vagas no DOM
const carregarVagas = () => {
    const vagaGrid = document.getElementById("vagaGrid"); // Contêiner das vagas
    const vagaModelo = document.getElementById("vagaModelo"); // Modelo base

    // Limpa o conteúdo anterior
    vagaGrid.innerHTML = '';
    vagaGrid.appendChild(vagaModelo); // Mantém o modelo escondido

    // biome-ignore lint/complexity/noForEach: <explanation>
    data.forEach((item) => {
        // Clona o modelo
        const novaVaga = vagaModelo.cloneNode(true);

        // Remove o display: none para torná-lo visível
        novaVaga.style.display = 'block';

        // Atualiza os atributos e conteúdo com base nos dados
        novaVaga.setAttribute("key", item.id);
        novaVaga.setAttribute("data-numero", item.vacancyNumber);
        novaVaga.id = `vaga${item.vacancyNumber}`;
        novaVaga.querySelector('.vaga-numero').textContent = `Vaga ${item.vacancyNumber}`;
        novaVaga.querySelector('.vaga-status').textContent = item.status === 0 ? "Disponível" : "Ocupada";
        novaVaga.onclick = () => {
            console.log(item.status)
            updatePanel(item);
        }

        // Adiciona classes de estilo com base no status
        if (item.status === 0) {
            novaVaga.classList.add("disponivel");
        } else {
            novaVaga.classList.add("ocupada");
        }

        // Adiciona a nova vaga ao contêiner
        vagaGrid.appendChild(novaVaga);
    });
};

// Chama a função para buscar as vagas ao carregar a página
fetchVagas();



const socket = io('http://192.168.0.2:4000/');
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on("vacancyUpdate", (vagaInfo) => {

    const vagaIndex = data.findIndex(vaga => vaga.id === vagaInfo.id);

  if (vagaIndex !== -1) {
    // Atualiza os dados da vaga
    data[vagaIndex] = { ...data[vagaIndex], ...vagaInfo };
    console.log(data)

    carregarVagas();

  }
    
})
