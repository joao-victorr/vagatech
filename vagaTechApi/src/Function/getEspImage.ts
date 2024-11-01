import axios from "axios"
import fs from 'fs';
import path from 'node:path';
import { detectPlateAndRecognize } from './getNumberPlate.js'




const saveImage = async (imageBuffer: Buffer) => {

  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDay()
  const hors = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  // Create a timestamp for the image file name.
  const timestamp = `${year}-${month}-${day}_${hors}-${minutes}-${seconds}`

  const filePath = path.join(__dirname, `../images/${timestamp}.jpeg`);



  await fs.promises.writeFile(filePath, imageBuffer);
  console.log(`Image saved to ${filePath}`);
}

export const getPlateVehicle = async (ipAddress: string) => {
  // const url = `http://${ipAddress}/capture`

  // const res = await axios.get(url, {
  //   responseType: "arraybuffer",
  // })
  // if (res.status!== 200) {
  //   console.error(`Failed to get image from ${ipAddress}: status ${res.status}`);
  //   return;
  // }
  // const imageBuffer = res.data as ArrayBuffer;
  // const image = Buffer.from(imageBuffer);

 
  const imageBuffer = fs.readFileSync('/home/joao/Documents/workspace/projetos/vagaTech/VagaTechApi/src/images/3.jpeg');
  
  const plateNumber = await detectPlateAndRecognize(imageBuffer);
  console.log(`Número da placa: ${plateNumber}`);

  // const plateNumber = await detectPlateAndRecognize(image);
  // console.log(`Plate number: ${plateNumber}`);
  
  await saveImage(imageBuffer);
  return plateNumber;



}