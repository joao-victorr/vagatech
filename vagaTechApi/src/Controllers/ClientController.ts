import { Request, Response } from 'express';
import { prismaClient } from '../Databases/PrismaClient';


interface Client {

}


export class ClientController {


  async create(req: Request, res: Response) {
    interface Data {
      name: string;
      cpf: string;
      monthlyPayer?: boolean;
    }
    const data: Data = req.body;

    if (!data.name ||!data.cpf) {
      res.status(400).send({ message: 'Missing required fields' });
      return;
    }

    const newClient = await prismaClient.client.create({
      data: {
        name: data.name,
        cpf: data.cpf,
        monthlyPayer: data.monthlyPayer || false,
      },
    })

    res.status(201).json(newClient);
    return;

  };

  async read(req: Request, res: Response) {
    const clientId = req.query.id as string;
    console.log(clientId);

    if (clientId) {
      const client = await prismaClient.client.findUnique({
        where: { id: clientId },
      });

      res.status(200).json(client);
      return;
    }

    const clients = await prismaClient.client.findMany();
    res.status(200).json(clients);
    return;

  };

  async update(req: Request, res: Response) {

  };

  async delete(req: Request, res: Response) {

  };

}