import type { Request, Response } from 'express';
import { prismaClient } from '../Databases/PrismaClient';


interface Data {
  vacancyNumber?: number;
  status?: number;
  vacancyTypeId: string
}


export class VacancyController {

  async create(req: Request, res: Response) {

    const data: Data = req.body;

    if (!data.vacancyTypeId) {
      res.status(400).send({ message: "Missing required fields" });
      return;
    }

    const newVacancy = await prismaClient.vacancy.create({
      data: {
        vacancyNumber: data.vacancyNumber,
        status: data.status || 0,
        vacancyTypeId: data.vacancyTypeId
      },
    });

    res.status(201).json(newVacancy);
    return;

  };

  async read(req: Request, res: Response) {

    const vacancyId = req.query.id as string | undefined;


    if (vacancyId != undefined) {
      const vacancy = await prismaClient.vacancy.findUnique({
        where: { id: vacancyId },
      });

      if (!vacancy) {
        res.status(404).send({ message: "Vacancy not found" });
        return;
      }

      res.status(200).json(vacancy);
      return;
    }

    const vacancy = await prismaClient.vacancy.findMany({
      orderBy: {
        vacancyNumber: 'asc', // 'asc' para ordem crescente
      },
    });

    res.status(200).json(vacancy);
    return

  };

  async update(req: Request, res: Response) {

  };

  async delete(req: Request, res: Response) {

  };

}