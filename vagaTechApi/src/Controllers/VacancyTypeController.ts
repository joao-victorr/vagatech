import type { Request, Response } from 'express'
import { prismaClient } from "../Databases/PrismaClient";


interface Data {
  id?: string;
  name?: string;
  price?: number;

}

export class VacancyTypeController {

  async read (req: Request, res: Response) {
    console.log(req.query)
    
    if (req.query.id) {
      const id = req.query.id as string;
      console.log(id);
      const vacancyType = await Promise.resolve(prismaClient.vacancyType.findUnique({
        where: { id }
      }))

      if (!vacancyType) {
        res.status(404).send({ message: "Vacancy type not found" });
        return;
      }

      res.json(vacancyType);
      return;
    }

    const vacancys = await prismaClient.vacancyType.findMany();
    res.status(200).json({ vacancys })
  }

  async create (req: Request, res: Response)  {

    const data: Data = req.body;

    if(!data.name || !data.price) {
      res.status(400).send({ message: "Missing required fields" });
      return
    }

    const newVacancyType = await prismaClient.vacancyType.create({
      data: {
        name: data.name,
        price: data.price
      },
    });

    res.status(201).json(newVacancyType);
    return;
  };

  async update(req: Request, res: Response) {
    const data: Data = req.body;

    if(!data.id) {
      res.status(400).send({ message: "ID required field" });
      return
    }

    const updatedVacancyType = await Promise.resolve(
      prismaClient.vacancyType.update({
        where: { id: data.id },
        data: {
          name: data.name,
          price: data.price,
        },
      })
    ).then((result) => ({ result, error: null }))
    .catch((error) => ({ result: null, error }));

    if(updatedVacancyType.error) {
      res.status(400).send({ message: "ID invalido" });
      return;
    }
    
    res.status(200).json(updatedVacancyType.result);
    return 

  };

  async delete(req: Request, res: Response) {
    const id = req.body.id;

    if(!id) {
      res.status(400).send({ message: "ID required field" });
      return
    }

    const vaga = await Promise.resolve( prismaClient.vacancyType.delete({
      where: { id }
    }))
    .then((result) => ({ result, error: null }))
    .catch((error) => ({ result: null, error }));

    if(vaga.error) {
      res.status(400).send({ message: "ID invalido" });
      return;
    }

    res.status(204).send({ message: "Deleting" });
    return;
    


  };
}


