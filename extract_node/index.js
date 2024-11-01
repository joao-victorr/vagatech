import fs from 'node:fs';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';

(async () => {
  // Preprocessar a imagem (ajustar o contraste e binarizar)
  await sharp('images/placa1.png')
    // .grayscale() // Converter para escala de cinza
    // .normalise() // Ajustar o contraste
    .toFile('teste_preprocessada.png');

  const worker = await createWorker();
  await worker.setParameters({
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // Apenas letras e números de placas
  });

  const ret = await worker.recognize('teste_preprocessada.png');
  console.log('Placa reconhecida:', ret.data.text);
  await worker.terminate();
})();