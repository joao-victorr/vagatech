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

    if (!data.ip || !data.vacancyNumber) {
      console.error(data, "Faltando dados.");
      res.status(400).send("Dados inválidos");
      return;
    }

    if (!data.detected) {
      
      await prismaClient.vacancy.update({
        where: { vacancyNumber: data.vacancyNumber },
        data: {
          status: 0, // O status da vaga é 0 (disponível)
        }
      })

      const vacancy = await prismaClient.vacancy.findUnique({
        where: { vacancyNumber: data.vacancyNumber }
      })

      emitSocket.emitUpdateVacancy( vacancy );
      // Enviamos a resposta HTTP para o ESP
      res.status(200).json("success");

      return;
    }

    const numberPlate =  "DDO5M99" //await getPlateVehicle(data.ip);

    if (!numberPlate) {
      console.error("Falha ao pegar número da placa.");
      res.status(500).send("Failed to get vehicle plate");
      return;
    }

    await prismaClient.vacancy.update({
      where: { vacancyNumber: data.vacancyNumber },
      data: {
        status: 1, // O status da vaga é 1 (ocupada)
      }
    })

    const vacancy = await prismaClient.vacancy.findUnique({
      where: { vacancyNumber: data.vacancyNumber }
    })

    if (!vacancy) {
      console.error("Vaga não encontrada.");
      res.status(404).send("Vacancy not found");
      return;
    }

    emitSocket.emitUpdateVacancy( vacancy );
    // Enviamos a resposta HTTP para o ESP
    res.status(200).json("success");
    return;
  }
}
