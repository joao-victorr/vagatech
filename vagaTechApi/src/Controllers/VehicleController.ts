import { Request, Response } from 'express';
import { prismaClient } from '../Databases/PrismaClient';

export class VehicleController {

  async create(req: Request, res: Response) {
    const {plate, clientId} = req.body;

    if (!plate || !clientId) {
      res.status(400).send({ message: 'Missing required fields' });
      return;
    }
    const validateClient = await prismaClient.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
      },
    })
    
    if (!validateClient) {
      res.status(404).send({ message: 'Client not found' });
      return;
    }

    const newVehicle = await prismaClient.vehicle.create({
      data: {
        plate: plate,
        clientId,
      },
    })

    res.status(201).json(newVehicle);
    return;


  };

  async read(req: Request, res: Response) {
    console.log("teste")
    if (req.query.id) {
      const id = req.query.id as string
      const vehicle = await prismaClient.vehicle.findUnique({
        where: { id: id},
        include: {
          client: true,
        }
      });
      res.status(200).json(vehicle);
      return;
    }

    const vehicles = await prismaClient.vehicle.findMany();
    res.status(200).json(vehicles);
    return;

  };

  async update(req: Request, res: Response) {

  };

  async delete(req: Request, res: Response) {

  };

}