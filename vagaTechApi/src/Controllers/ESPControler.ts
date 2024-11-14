import { Request, Response } from 'express';
import { prismaClient } from '../Databases/PrismaClient'

import { getPlateVehicle } from '../Functions/getEspImage';
import { EmitSocket } from './EmitSocket';

const emitSocket = new EmitSocket();

type Data = {
  detected: boolean;
  ip: string;
  vacancyNumber: number
}

export class ESPController {
  async receive(req: Request, res: Response) {
    const data: Data = req.body;

    if (!data.ip) {
      console.error(data, "Faltando dados.");
      res.status(400).send("Dados inválidos");
      return;
    }

    if (!data.detected) {
      console.log("Falso");
      res.status(200).send("Failed to detect");
      return;
    }



    const numberPlate = await getPlateVehicle(data.ip);
    // Aqui é onde emitimos a atualização para os clientes conectados via WebSocket
    emitSocket.emitUpdateVacancy({ numberPlate, vacancyNumber: data.vacancyNumber });

    // Enviamos a resposta HTTP para o ESP
    res.status(200);
    return;
  }
}
