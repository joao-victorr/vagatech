import fs from 'node:fs';
import axios from 'axios';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';

// Função para detectar a placa e retornar o buffer da imagem recortada
const detectPlate = async (imageBuffer) => {
  try {
    const image = imageBuffer.toString('base64');

    const response = await axios.post("https://detect.roboflow.com/number-plate-detection-xglm4/3", image, {
      params: { api_key: "QNIyXbBUDfa6F7tEyImy" },
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    console.log('Resposta da detecção:', response.data);

    // Verifica se existem predições
    if (response.data.predictions && response.data.predictions.length > 0) {
      const { x, y, width, height } = response.data.predictions[0]; // Obtém as coordenadas da placa

      // Converte coordenadas do centro para o canto superior esquerdo
      const placaCoords = {
        x: Math.round(x - width / 2),
        y: Math.round(y - height / 2),
        width: Math.round(width),
        height: Math.round(height)
      };

      // Chama a função de corte com as coordenadas ajustadas e retorna o buffer da imagem
      return await cutImage(placaCoords, imageBuffer);
    } else {
      console.log('Nenhuma placa detectada.');
      return null;
    }
  } catch (error) {
    console.error('Erro ao detectar a placa:', error);
    throw error;
  }
};

// Função para recortar a imagem a partir das coordenadas
const cutImage = async (placaCoords, imageBuffer) => {
  try {
    const { width: imageWidth, height: imageHeight } = await sharp(imageBuffer).metadata();

    const percentage = 0.04;
    const adjustedWidth = Math.floor(placaCoords.width * (1 - percentage));
    const adjustedHeight = Math.floor(placaCoords.height * (1 - percentage));
    const adjustedX = Math.floor(placaCoords.x + placaCoords.width * (percentage / 2));
    const adjustedY = Math.floor(placaCoords.y + placaCoords.height * (percentage / 2));

    const finalWidth = Math.min(adjustedWidth, imageWidth - adjustedX);
    const finalHeight = Math.min(adjustedHeight, imageHeight - adjustedY);

    // Retorna o buffer da imagem ao invés de salvar em um arquivo
    return await sharp(imageBuffer)
      .extract({ width: finalWidth, height: finalHeight, left: adjustedX, top: adjustedY })
      .toBuffer();
  } catch (err) {
    console.error('Erro ao recortar a placa:', err);
    throw err;
  }
};

// Função principal para detectar e reconhecer a placa
export const detectPlateAndRecognize = async (imageBuffer) => {
  try {
    // Detectar a placa e obter a imagem recortada como buffer
    const croppedImageBuffer = await detectPlate(imageBuffer);

    if (!croppedImageBuffer) {
      console.log('Nenhuma placa detectada.');
      return;
    }

    // Preprocessar a imagem diretamente do buffer (ajustar o contraste e binarizar)
    const preprocessedImageBuffer = await sharp(croppedImageBuffer)
      // .grayscale() // Converter para escala de cinza (opcional)
      // .normalize() // Ajustar o contraste (opcional)
      .toBuffer(); // Converte para buffer sem salvar em arquivo

    // Criar o worker do Tesseract
    const worker = await createWorker();

    // Definir as opções do Tesseract, limitando para caracteres de placas
    await worker.setParameters({
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // Apenas letras e números
    });

    // Reconhecer o texto na imagem preprocessada
    const ret = await worker.recognize(preprocessedImageBuffer);
    
    // Exibir o número da placa
    console.log('Placa reconhecida:', ret.data.text.trim());

    // Encerrar o worker do Tesseract
    await worker.terminate();

    return ret.data.text.trim(); // Retorna o número da placa
  } catch (error) {
    console.error('Erro no processo de detecção e reconhecimento:', error);
    throw error;
  }
};

// Exemplo de uso
// const exampleUsage = async () => {
//   // Lê a imagem e obtém o buffer
//   const imageBuffer = fs.readFileSync('images/3.jpeg');
  
//   const plateNumber = await detectPlateAndRecognize(imageBuffer);
//   console.log(`Número da placa: ${plateNumber}`);
// };

// exampleUsage();
