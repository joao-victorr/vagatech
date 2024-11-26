const updatePanel = async (data) => {
  const panel = document.getElementById("info-panel");
  if (!panel) {
    console.error("Painel de informações não encontrado");
    return;
  }

  // URL para buscar informações do veículo
  const url = `http://localhost:4000/vehicle?id=${data.currentVehicleId}`;

  try {
    // Faz a requisição à API
    const res = await fetch(url);

    if (!res.ok) {
      console.error("Erro ao procurar carro:", res.status, res.statusText);
      return;
    }

    // Aguarda a resposta JSON
    const vehicle = await res.json();
    console.log("Veículo encontrado:", vehicle);

    // Seleciona os elementos dentro do painel
    const nomeElement = panel.querySelector("#nome");
    const placaElement = panel.querySelector("#placa");
    const tempoElement = panel.querySelector("#tempo");

    // Atualiza os conteúdos com os dados retornados
    nomeElement.textContent = vehicle ? vehicle.client?.name : "N/A"; // Preenche com o nome do cliente
    placaElement.textContent = vehicle ? vehicle.plate : "N/A"; // Preenche com a placa do veículo
    tempoElement.textContent = data.tempo || "N/A"; // Tempo é baseado no argumento `data`
  } catch (error) {
    console.error("Erro na requisição ao servidor:", error);
  }
};
