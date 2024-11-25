const updatePanel = (data) => {
  console.log(data);
  const panel = document.getElementById("info-panel");

  // Seleciona os elementos dentro do painel
  const nomeElement = panel.querySelector("#nome");
  const placaElement = panel.querySelector("#placa");
  const tempoElement = panel.querySelector("#tempo");

  // Atualiza os conteúdos com os dados fornecidos
  nomeElement.textContent = data.nome || "N/A";
  placaElement.textContent = data.placa || "N/A";
  tempoElement.textContent = data.tempo || "N/A";
};
