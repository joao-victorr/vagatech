let data = [
    {id: "1", numero: 1, numberPlate: "", type: "simples"},
    {id: "2", numero: 2, numberPlate: "", type: "simples"},
    {id: "3", numero: 3, numberPlate: "", type: "simples"},
    {id: "4", numero: 4, numberPlate: "", type: "simples"},
    {id: "5", numero: 5, numberPlate: "", type: "simples"}
];

const socket = io('http://192.168.0.2:4000/');
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on("vacancyUpdate", (vagaInfo) => {
    console.log(vagaInfo)

    data = data.map(item => {
        if (item.id === vagaInfo.id) {
            // Atualiza o item com as novas informações de vagaInfo
            return { ...item, ...vagaInfo };
        }
        return item; // Retorna o item sem modificações se o ID não bater
    });
})




const vagaGrid = document.getElementById("vagaGrid");



const carregarVagas = () => {
    let num = 1; // Para incrementar o ID das divs
    data.map((item) => {
        // Cria uma nova div a cada iteração
        const newDiv = document.createElement("div");

        // Adiciona classes e atributos à nova div
        newDiv.setAttribute("key", item.id)
        newDiv.classList.add("vaga");
        newDiv.id = `vaga${num}`;
        newDiv.setAttribute("data-numero", item.numero);

        // Define o conteúdo da nova div
        newDiv.textContent = `Vaga ${item.numero}`;

        // Adiciona a nova div ao contêiner vagaGrid sem remover as anteriores
        vagaGrid.appendChild(newDiv);

        // Incrementa o número para o próximo ID
        num++;
    });
};

carregarVagas();