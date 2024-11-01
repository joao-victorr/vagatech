import fs from 'node:fs';
import axios from 'axios';
import sharp from 'sharp';

// Lê a imagem e converte para base64
const image = fs.readFileSync("images/2.jpeg", {
    encoding: "base64"
});


const detectPlate = (image) => {
  axios({
    method: "POST",
    url: "https://detect.roboflow.com/number-plate-detection-xglm4/3",
    params: {
      api_key: "QNIyXbBUDfa6F7tEyImy"
    },
    data: image,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
  .then((response) => {
    console.log('Resposta da detecção:', response.data);

    // Verifica se existem predições
    if (response.data.predictions && response.data.predictions.length > 0) {
      const { x, y, width, height } = response.data.predictions[0]; // Obtém as coordenadas da placa

      // Converte coordenadas do centro para o canto superior esquerdo
      const placaCoords = {
        x: Number.parseInt((x - width / 2).toFixed()),  // Ajusta para o canto superior esquerdo
        y: Number.parseInt((y - height / 2).toFixed()), // Ajusta para o canto superior esquerdo
        width: Number.parseInt(width.toFixed()),
        height: Number.parseInt(height.toFixed())
      };

      cutImage(placaCoords); // Chama a função de recorte com as coordenadas ajustadas
    } else {
      console.log('Nenhuma placa detectada.');
    }
  })
  .catch((error) => {
    console.error('Erro ao detectar a placa:', error);
  });
};


// Função para recortar a placa a partir das coordenadas
const cutImage = (placaCoords) => {
  sharp('images/2.jpeg')
    .metadata() // Obtém os metadados da imagem, incluindo a largura e altura
    .then(({ width: imageWidth, height: imageHeight }) => {
      // Defina a porcentagem que você deseja remover do tamanho da imagem, por exemplo, 5%
      const percentage = 0.04;

      // Calcula os novos valores com base nessa porcentagem
      const adjustedWidth = Math.floor(placaCoords.width - placaCoords.width * percentage);
      const adjustedHeight = Math.floor(placaCoords.height - placaCoords.height * percentage);
      const adjustedX = Math.floor(placaCoords.x + placaCoords.width * (percentage / 2)); // Move o recorte horizontalmente para compensar o ajuste de tamanho
      const adjustedY = Math.floor(placaCoords.y + placaCoords.height * (percentage / 2)); // Move o recorte verticalmente para compensar o ajuste de tamanho

      // Certifique-se de que o recorte não ultrapasse as bordas da imagem
      const finalWidth = Math.min(adjustedWidth, imageWidth - adjustedX);
      const finalHeight = Math.min(adjustedHeight, imageHeight - adjustedY);

      // Agora faz o recorte com os novos valores ajustados
      return sharp('images/2.jpeg')
        .extract({ width: finalWidth, height: finalHeight, left: adjustedX, top: adjustedY })
        .toFile('placa_recortada.jpg');
    })
    .then((info) => {
      console.log('Placa recortada com sucesso!', info);
    })
    .catch((err) => {
      console.error('Erro ao recortar a placa:', err);
    });
};


// Detecta a placa e recorta
detectPlate(image);
