import { Router, Response, Request } from 'express';

import { ESPController } from '../Controllers/ESPControler'
import { VacancyType } from '../Controllers/VacancyTypeController';

const espController = new ESPController;
const vacancyType = new VacancyType;


const router = Router();


const getPong = (req: Request, res: Response) => {
  res.send("pong");
}



router.get("/ping", getPong);

router.post("/detectedVehicle", espController.receive);

router.get("/vacancyType", vacancyType.read);
router.post("/vacancyType", vacancyType.create);
router.put("/vacancyType", vacancyType.update);
router.delete("/vacancyType", vacancyType.delete);

export { router };
