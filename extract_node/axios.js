import fs from 'node:fs';
import sharp from 'sharp';



const cutImage = (placaCoords) => {
    sharp('teste.jpg')
      .extract({ width: placaCoords.width, height: placaCoords.height, left: placaCoords.x, top: placaCoords.y })
      .toFile('placa_recortada.jpg', (err, info) => {
        if (err) throw err;
        console.log('Placa recortada com sucesso!', info);
      });
  };