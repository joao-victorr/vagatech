const vagas = document.querySelectorAll(".vaga")
const vagasPorPagina = 25; // Número de vagas por página
let paginaAtual = 1;
const totalDePaginas = 5; // Total fixo de 5 páginas

// Simulação dos dados das vagas
const vagasData = Array.from({ length: 125 }, (_, index) => ({
  numero: index + 1,
  ocupado: false,
  nome: '',
  placa: '',
  tempo: ''
}));

// Função para realizar a requisição à API
async function fetchVagaData() {
  try {
    const response = await fetch('URL_DA_API'); // URL da API
    const data = await response.json();

    // Atualiza o status das vagas com base nos dados da API
    data.forEach((info) => {
      const vaga = vagasData[info.numero - 1]; // Assumindo que o número da vaga comece em 1
      vaga.ocupado = info.ocupado; // Atualiza se a vaga está ocupada
      vaga.nome = info.nome; // Atualiza nome
      vaga.placa = info.placa; // Atualiza placa
      vaga.tempo = info.tempo; // Atualiza tempo
    });

    atualizarVagas();
  } catch (error) {
    console.error('Erro ao obter dados das vagas:', error);
  }
}

// Função para atualizar as vagas com base nos dados recebidos
function atualizarVagas() {
  const vagasGrid = document.getElementById('vagasGrid');
  vagasGrid.innerHTML = ''; // Limpa as vagas existentes
  const startIndex = (paginaAtual - 1) * vagasPorPagina;
  const endIndex = startIndex + vagasPorPagina;

  // Atualiza as vagas apenas da página atual
  vagasData.slice(startIndex, endIndex).forEach(vaga => {
    const vagaElement = document.createElement('div');
    vagaElement.className = 'vaga';
    vagaElement.id = `vaga${vaga.numero}`;
    vagaElement.dataset.numero = vaga.numero;
    vagaElement.textContent = vaga.numero < 10 ? `00${vaga.numero}` : vaga.numero;

    // Verifica se a vaga está ocupada
    if (vaga.ocupado) {
      vagaElement.classList.add('occupied');
      vagaElement.addEventListener('click', () => mostrarInfo(vaga));
    } else {
      vagaElement.classList.remove('occupied');
      vagaElement.addEventListener('click', () => mostrarInfo({ nome: 'fdsd', placa: '1223jhjhas', tempo: '1.23.3' }));
    }
    vagasGrid.appendChild(vagaElement);
  });

  atualizarPaginacao();
}

// Função para atualizar a visualização da paginação
function atualizarPaginacao() {
  document.getElementById('pageInfo').textContent = `Página ${paginaAtual} de ${totalDePaginas}`;
  document.getElementById('prevBtn').disabled = paginaAtual === 1;
  document.getElementById('nextBtn').disabled = paginaAtual === totalDePaginas;
}

// Funções para navegação da paginação
document.getElementById('prevBtn').addEventListener('click', () => {
  if (paginaAtual > 1) {
    paginaAtual--;
    atualizarVagas(); // Atualiza as vagas ao mudar de página
  }
});

document.getElementById('nextBtn').addEventListener('click', () => {
  if (paginaAtual < totalDePaginas) {
    paginaAtual++;
    atualizarVagas(); // Atualiza as vagas ao mudar de página
  }
});
const teste = () => {
  vagas.forEach((vaga) => {
    vaga.addEventListener("click", (event) => {
        const key = event.currentTarget.getAttribute("key"); 
        console.log("Key da div clicada:", key);
        const infoVaga = data.find(item => item.id === key)
        mostrarInfo(infoVaga)

    });
  });
}
// Informações da vaga no painel lateral
function mostrarInfo(vaga) {
  
  document.getElementById('nome').textContent = vaga.numero || 'Desconhecido';
  document.getElementById('placa').textContent = vaga.numberPlate || 'Sem placa';
  document.getElementById('tempo').textContent = '0 min';
}

// Chamada para obter os dados assim que a página for carregada
fetchVagaData();
teste()