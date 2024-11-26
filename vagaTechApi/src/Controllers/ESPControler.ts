import { Request, Response } from 'express';
import { prismaClient } from '../Databases/PrismaClient';
import { getPlateVehicle } from '../Functions/getEspImage';
import { EmitSocket } from './EmitSocket';

const emitSocket = new EmitSocket();

type Data = {
  detected: boolean;
  ip: string;
  vacancyNumber: number;
};

export class ESPController {
  async receive(req: Request, res: Response) {
    const data: Data = req.body;

    if (!data.ip || !data.vacancyNumber) {
      console.error(data, "Faltando dados.");
      res.status(400).send("Dados inválidos");
      return;
    }

    try {
      if (!data.detected) {
        const vacancy = await prismaClient.vacancy.update({
          where: { vacancyNumber: data.vacancyNumber },
          data: {
            status: 0,
            currentVehicleId: null,
          },
        });

        emitSocket.emitUpdateVacancy(vacancy);
        res.status(200).json({ message: "success", vacancyStatus: vacancy.status });
        return;
      }

      const numberPlate = "BBX3E45"; //await getPlateVehicle(data.ip);

      if (!numberPlate) {
        console.error("Falha ao pegar número da placa.");
        res.status(500).send("Failed to get vehicle plate");
        return;
      }

      const vehicle = await prismaClient.vehicle.findUnique({
        where: { plate: numberPlate },
        include: { client: true },
      });

      if (!vehicle) {
        console.error("Veículo não encontrado.");
        res.status(404).send("Vehicle not found");
        return;
      }

      const vacancy = await prismaClient.vacancy.update({
        where: { vacancyNumber: data.vacancyNumber },
        data: {
          status: 1,
          currentVehicleId: vehicle.id,
        },
        include: {
          currentVehicle: true,
          client: true,
        },
      });

      emitSocket.emitUpdateVacancy(vacancy);
      res.status(200).json({ message: "success", vacancyStatus: vacancy.status });
    } catch (error) {
      console.error("Erro inesperado:", error);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  }
}
